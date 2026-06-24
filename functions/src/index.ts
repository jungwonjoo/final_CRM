// FingerSales CRM — Cloud Functions
//
// 1) syncCompanyCounts  : 6→5 소스 컬렉션 onWrite → companies/{id}.counts.<kind> increment
// 2) syncMemberCount    : contacts onWrite → companies/{id}.memberCount increment
// 3) fanoutSalesEvents  : 6개 소스 onWrite → companies/{id}/salesEvents 타임라인 upsert/delete
// 4) backfillAggregates : (1회용 HTTPS callable) counts/memberCount/salesEvents 전체 재계산
//
// 모든 함수는 Admin SDK 권한으로 동작하므로 보안 규칙을 우회한다.

import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import {
  getFirestore,
  FieldValue,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

// ---------------------------------------------------------------------------
// 매핑 테이블
// ---------------------------------------------------------------------------

// companies.counts 에 반영할 소스 컬렉션 → counts 필드명
const COUNT_FIELD: Record<string, keyof CompanyCounts> = {
  opportunities: "opportunity",
  activities: "activity",
  quotations: "quotation",
  contracts: "contract",
  supports: "support",
};

interface CompanyCounts {
  opportunity: number;
  activity: number;
  quotation: number;
  contract: number;
  support: number;
}

// salesEvents 타임라인 대상 소스 컬렉션 → SalesEventKind
const EVENT_KIND: Record<string, string> = {
  activities: "activity",
  quotations: "quotation",
  proposals: "proposal",
  opportunities: "opportunity",
  contracts: "contract",
  orders: "order",
};

// ---------------------------------------------------------------------------
// 유틸
// ---------------------------------------------------------------------------

function getStr(d: DocumentData | undefined, key: string): string | undefined {
  const v = d?.[key];
  return typeof v === "string" ? v : undefined;
}

function pickDate(d: DocumentData): Timestamp {
  // 소스 종류별 대표 일자 선택
  return (
    (d.date as Timestamp) ||
    (d.contractDate as Timestamp) ||
    (d.submitDate as Timestamp) ||
    (d.startDate as Timestamp) ||
    Timestamp.now()
  );
}

// 타임라인 카드 본문 lines 구성 (종류별)
function buildLines(coll: string, d: DocumentData): string[] {
  const company = getStr(d, "company") ?? "";
  const contact = getStr(d, "contact") ?? "";
  const dept = getStr(d, "dept") ?? "";
  switch (coll) {
    case "activities":
      return [`${company} / ${contact} / ${dept}`, getStr(d, "title") ?? "", getStr(d, "type") ?? ""];
    case "quotations":
      return [`${company} / ${contact}`, getStr(d, "title") ?? "", String(d.total ?? d.amount ?? "")];
    case "proposals":
      return [getStr(d, "title") ?? "", `${company} / ${contact}`];
    case "opportunities":
      return [getStr(d, "title") ?? "", `${company} / ${contact}`, String(d.amount ?? "")];
    case "contracts":
      return [getStr(d, "title") ?? "", `${company} / ${contact}`, String(d.amount ?? "")];
    case "orders":
      return [getStr(d, "contractTitle") ?? "", `${company} / ${contact}`, String(d.total ?? "")];
    default:
      return [];
  }
}

// ---------------------------------------------------------------------------
// 1) syncCompanyCounts
// ---------------------------------------------------------------------------

function makeCountTrigger(coll: string) {
  return onDocumentWritten(`${coll}/{docId}`, async (event) => {
    const field = COUNT_FIELD[coll];
    if (!field) return;

    const before = event.data?.before.data();
    const after = event.data?.after.data();

    const beforeCompany = getStr(before, "companyId");
    const afterCompany = getStr(after, "companyId");

    const path = `counts.${field}`;
    const batch = db.batch();

    if (!before && after && afterCompany) {
      // 생성
      batch.set(
        db.doc(`companies/${afterCompany}`),
        { [path]: FieldValue.increment(1) } as DocumentData,
        { merge: true },
      );
    } else if (before && !after && beforeCompany) {
      // 삭제
      batch.set(
        db.doc(`companies/${beforeCompany}`),
        { [path]: FieldValue.increment(-1) } as DocumentData,
        { merge: true },
      );
    } else if (before && after && beforeCompany !== afterCompany) {
      // companyId 변경 → 이동
      if (beforeCompany) {
        batch.set(
          db.doc(`companies/${beforeCompany}`),
          { [path]: FieldValue.increment(-1) } as DocumentData,
          { merge: true },
        );
      }
      if (afterCompany) {
        batch.set(
          db.doc(`companies/${afterCompany}`),
          { [path]: FieldValue.increment(1) } as DocumentData,
          { merge: true },
        );
      }
    } else {
      return; // 동일 company 내 단순 수정 → counts 변동 없음
    }

    await batch.commit();
  });
}

export const countOpportunities = makeCountTrigger("opportunities");
export const countActivities = makeCountTrigger("activities");
export const countQuotations = makeCountTrigger("quotations");
export const countContracts = makeCountTrigger("contracts");
export const countSupports = makeCountTrigger("supports");

// ---------------------------------------------------------------------------
// 2) syncMemberCount (contacts → companies.memberCount)
// ---------------------------------------------------------------------------

export const syncMemberCount = onDocumentWritten("contacts/{docId}", async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  const beforeCompany = getStr(before, "companyId");
  const afterCompany = getStr(after, "companyId");

  const batch = db.batch();
  const inc = (cid: string, n: number) =>
    batch.set(
      db.doc(`companies/${cid}`),
      { memberCount: FieldValue.increment(n) } as DocumentData,
      { merge: true },
    );

  if (!before && after && afterCompany) inc(afterCompany, 1);
  else if (before && !after && beforeCompany) inc(beforeCompany, -1);
  else if (before && after && beforeCompany !== afterCompany) {
    if (beforeCompany) inc(beforeCompany, -1);
    if (afterCompany) inc(afterCompany, 1);
  } else return;

  await batch.commit();
});

// ---------------------------------------------------------------------------
// 3) fanoutSalesEvents (6개 소스 → companies/{id}/salesEvents)
// 결정성: salesEvents 문서 id = `${coll}_${sourceId}` (upsert/삭제 매칭 단순화)
// ---------------------------------------------------------------------------

function makeFanoutTrigger(coll: string) {
  return onDocumentWritten(`${coll}/{docId}`, async (event) => {
    const kind = EVENT_KIND[coll];
    if (!kind) return;

    const sourceId = event.params.docId as string;
    const after = event.data?.after.data();
    const before = event.data?.before.data();

    // 삭제 → 모든 거래처 하위에서 해당 이벤트 제거
    if (!after) {
      const cid = getStr(before, "companyId");
      if (cid) {
        await db.doc(`companies/${cid}/salesEvents/${coll}_${sourceId}`).delete().catch(() => undefined);
      }
      return;
    }

    const companyId = getStr(after, "companyId");
    if (!companyId) {
      logger.warn(`${coll}/${sourceId} 에 companyId 없음 — 타임라인 스킵`);
      return;
    }

    // companyId 가 바뀐 경우 이전 거래처에서 제거
    const prevCompany = getStr(before, "companyId");
    if (prevCompany && prevCompany !== companyId) {
      await db
        .doc(`companies/${prevCompany}/salesEvents/${coll}_${sourceId}`)
        .delete()
        .catch(() => undefined);
    }

    const eventDoc = {
      kind,
      date: pickDate(after),
      hasAttachment: coll === "quotations" || coll === "proposals",
      lines: buildLines(coll, after),
      sourceColl: coll,
      sourceId,
      companyId,
      contactId: getStr(after, "contactId") ?? null,
      createdAt: FieldValue.serverTimestamp(),
    };

    await db
      .doc(`companies/${companyId}/salesEvents/${coll}_${sourceId}`)
      .set(eventDoc, { merge: true });
  });
}

export const fanoutActivities = makeFanoutTrigger("activities");
export const fanoutQuotations = makeFanoutTrigger("quotations");
export const fanoutProposals = makeFanoutTrigger("proposals");
export const fanoutOpportunities = makeFanoutTrigger("opportunities");
export const fanoutContracts = makeFanoutTrigger("contracts");
export const fanoutOrders = makeFanoutTrigger("orders");

// ---------------------------------------------------------------------------
// 4) backfillAggregates — 1회용 재계산 (관리자만 호출)
// 호출: firebase functions:shell 또는 클라이언트 httpsCallable("backfillAggregates")
// ---------------------------------------------------------------------------

export const backfillAggregates = onCall(async (request) => {
  // 관리자 검증
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
  const emp = await db.doc(`employees/${uid}`).get();
  const roles = (emp.data()?.roles as string[] | undefined) ?? [];
  if (!roles.includes("admin")) {
    throw new HttpsError("permission-denied", "관리자만 실행할 수 있습니다.");
  }

  // counts 누적용 메모리 맵
  const counts: Record<string, CompanyCounts> = {};
  const members: Record<string, number> = {};
  const ensure = (cid: string) => {
    if (!counts[cid]) {
      counts[cid] = { opportunity: 0, activity: 0, quotation: 0, contract: 0, support: 0 };
    }
    return counts[cid];
  };

  // 4-1) counts 집계
  for (const coll of Object.keys(COUNT_FIELD)) {
    const snap = await db.collection(coll).get();
    snap.forEach((doc) => {
      const cid = getStr(doc.data(), "companyId");
      if (cid) ensure(cid)[COUNT_FIELD[coll]] += 1;
    });
  }

  // 4-2) memberCount 집계
  const contactsSnap = await db.collection("contacts").get();
  contactsSnap.forEach((doc) => {
    const cid = getStr(doc.data(), "companyId");
    if (cid) members[cid] = (members[cid] ?? 0) + 1;
  });

  // 4-3) companies 에 기록
  const companiesSnap = await db.collection("companies").get();
  let updated = 0;
  for (const c of companiesSnap.docs) {
    const cid = c.id;
    await c.ref.set(
      {
        counts: counts[cid] ?? {
          opportunity: 0,
          activity: 0,
          quotation: 0,
          contract: 0,
          support: 0,
        },
        memberCount: members[cid] ?? 0,
      },
      { merge: true },
    );
    updated += 1;
  }

  // 4-4) salesEvents 재생성
  let events = 0;
  for (const coll of Object.keys(EVENT_KIND)) {
    const snap = await db.collection(coll).get();
    for (const doc of snap.docs as QueryDocumentSnapshot[]) {
      const d = doc.data();
      const companyId = getStr(d, "companyId");
      if (!companyId) continue;
      await db.doc(`companies/${companyId}/salesEvents/${coll}_${doc.id}`).set(
        {
          kind: EVENT_KIND[coll],
          date: pickDate(d),
          hasAttachment: coll === "quotations" || coll === "proposals",
          lines: buildLines(coll, d),
          sourceColl: coll,
          sourceId: doc.id,
          companyId,
          contactId: getStr(d, "contactId") ?? null,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      events += 1;
    }
  }

  logger.info(`backfill 완료: companies=${updated}, salesEvents=${events}`);
  return { companies: updated, salesEvents: events };
});
