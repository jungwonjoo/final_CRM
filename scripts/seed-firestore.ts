/**
 * FingerSales CRM — Firestore 시드 스크립트
 *
 * mock-data.ts 의 더미 데이터를 Firestore 에 적재한다.
 * 적재 순서: employees → companies → contacts → 나머지(activities/opportunities/
 *           proposals/quotations/contracts/orders/supports/todos/prospects/
 *           products/chatters)
 * 이름 참조(company/owner/contact) → ID 참조(companyId/ownerId/contactId) 변환,
 * 날짜 문자열("2026.06.08" / "2026.06.24 14:30") → Timestamp 파싱 포함.
 *
 * ── 실행 방법 ─────────────────────────────────────────────────────────────
 * 1. 서비스 계정 키 발급:
 *    Firebase 콘솔 > 프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성
 *    → 다운로드한 JSON 을 프로젝트 루트에 serviceAccountKey.json 으로 저장
 *      (이미 .gitignore 에 포함됨 — 절대 커밋 금지)
 *
 * 2. 의존성(스크립트 실행용):
 *    npm i -D firebase-admin tsx
 *
 * 3. 실행:
 *    GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json npx tsx scripts/seed-firestore.ts
 *
 *    (에뮬레이터에 적재하려면:
 *     FIRESTORE_EMULATOR_HOST=localhost:8080 npx tsx scripts/seed-firestore.ts )
 *
 * 4. 적재 후 집계 백필:
 *    클라이언트/shell 에서 httpsCallable("backfillAggregates") 1회 호출
 *    (또는 이 스크립트가 직접 counts/memberCount 를 계산해 넣으므로 생략 가능 —
 *     아래 computeAggregates() 가 처리한다.)
 */

import { cert, initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// mock-data 는 "@/lib/types" 를 import 하므로, tsx 의 tsconfig paths 해석이
// 필요하다. 간단히 상대경로로 가져온다.
import {
  activities,
  chatters,
  companies,
  contacts,
  contracts,
  employees,
  opportunities,
  orders,
  products,
  proposals,
  prospects,
  quotations,
  supports,
  todos,
} from "../src/lib/mock-data";

// ── Admin 초기화 ───────────────────────────────────────────────────────────
const keyPath = resolve(process.cwd(), "serviceAccountKey.json");
if (existsSync(keyPath) && !process.env.FIRESTORE_EMULATOR_HOST) {
  initializeApp({ credential: cert(JSON.parse(readFileSync(keyPath, "utf8"))) });
} else {
  // 에뮬레이터 또는 GOOGLE_APPLICATION_CREDENTIALS 사용
  initializeApp({ credential: applicationDefault() });
}
const db = getFirestore();

// ── 날짜 파서 ──────────────────────────────────────────────────────────────
function dateStrToTs(date: string, time?: string): Timestamp {
  const [y, m, d] = date.split(".").map((s) => parseInt(s, 10));
  let hh = 0;
  let mm = 0;
  if (time) {
    const [h, mi] = time.split(":").map((s) => parseInt(s, 10));
    hh = h || 0;
    mm = mi || 0;
  }
  return Timestamp.fromDate(new Date(y, (m || 1) - 1, d || 1, hh, mm));
}
function dateTimeStrToTs(value: string): Timestamp {
  const [date, time] = value.trim().split(/\s+/);
  return dateStrToTs(date, time);
}

const now = FieldValue.serverTimestamp();
const meta = (createdBy: string) => ({ createdAt: now, updatedAt: now, createdBy });

// ── 이름 → ID 매핑 테이블 ───────────────────────────────────────────────────
const empIdByName = new Map<string, string>(); // 담당자명 → employee uid
const companyIdByName = new Map<string, string>(); // 거래처명 → companyId
const contactIdByName = new Map<string, string>(); // "거래처명|고객명" → contactId

function ownerRef(name: string) {
  const ownerId = empIdByName.get(name) ?? "unknown";
  return { ownerId, ownerName: name };
}
function companyRef(name: string) {
  const companyId = companyIdByName.get(name) ?? "unknown";
  return { companyId, company: name };
}
function contactRef(companyName: string, contactName: string) {
  const contactId = contactIdByName.get(`${companyName}|${contactName}`) ?? "unknown";
  return { contactId, contact: contactName };
}

async function main() {
  // 1) employees — 문서 ID = uid. 데모용으로 mock id(e1..) 를 uid 로 사용.
  //    실제 운영에서는 Firebase Auth 의 uid 와 일치시켜야 한다.
  {
    const batch = db.batch();
    for (const e of employees) {
      const uid = e.id; // 데모: mock id 를 uid 로
      empIdByName.set(e.name, uid);
      batch.set(db.doc(`employees/${uid}`), {
        name: e.name,
        dept: e.dept,
        position: e.position,
        roles: e.roles ?? [],
      });
    }
    await batch.commit();
    console.log(`employees: ${employees.length}`);
  }

  // 2) companies — counts 는 0 으로 초기화(이후 computeAggregates 가 채움)
  {
    const batch = db.batch();
    for (const c of companies) {
      const ref = db.collection("companies").doc(); // auto-id
      companyIdByName.set(c.name, ref.id);
      batch.set(ref, {
        name: c.name,
        nameLower: c.name.toLowerCase(),
        memberCount: 0,
        address: c.address,
        amount: c.amount,
        counts: { opportunity: 0, activity: 0, quotation: 0, contract: 0, support: 0 },
        ...ownerRef(c.ownerName),
        ...meta(empIdByName.get(c.ownerName) ?? "seed"),
      });
    }
    await batch.commit();
    console.log(`companies: ${companies.length}`);
  }

  // 3) contacts
  {
    const batch = db.batch();
    for (const c of contacts) {
      const ref = db.collection("contacts").doc();
      const companyName = c.company ?? "";
      contactIdByName.set(`${companyName}|${c.name}`, ref.id);
      batch.set(ref, {
        name: c.name,
        dept: c.dept,
        position: c.position,
        phone: c.phone,
        email: c.email,
        ...(c.officePhone ? { officePhone: c.officePhone } : {}),
        ...companyRef(companyName),
        ...ownerRef(c.ownerName ?? ""),
        ...meta(empIdByName.get(c.ownerName ?? "") ?? "seed"),
      });
    }
    await batch.commit();
    console.log(`contacts: ${contacts.length}`);
  }

  // 4) activities (date + time → 단일 Timestamp)
  {
    const batch = db.batch();
    for (const a of activities) {
      batch.set(db.collection("activities").doc(), {
        date: dateStrToTs(a.date, a.time),
        type: a.type,
        title: a.title,
        dept: a.dept,
        ...companyRef(a.company),
        ...contactRef(a.company, a.contact),
        ...ownerRef(a.owner),
        ...meta(empIdByName.get(a.owner) ?? "seed"),
      });
    }
    await batch.commit();
    console.log(`activities: ${activities.length}`);
  }

  // 5) opportunities (stage 단일 저장)
  {
    const batch = db.batch();
    for (const o of opportunities) {
      batch.set(db.collection("opportunities").doc(), {
        title: o.title,
        stage: o.stage,
        amount: o.amount,
        startDate: dateStrToTs(o.startDate),
        endDate: dateStrToTs(o.endDate),
        products: o.products,
        ...companyRef(o.company),
        ...contactRef(o.company, o.contact),
        // 영업기회는 owner 필드가 없음 → 거래처 담당자 상속
        ...ownerRef(companies.find((c) => c.name === o.company)?.ownerName ?? ""),
        ...meta("seed"),
      });
    }
    await batch.commit();
    console.log(`opportunities: ${opportunities.length}`);
  }

  // 6) proposals
  {
    const batch = db.batch();
    for (const p of proposals) {
      batch.set(db.collection("proposals").doc(), {
        title: p.title,
        startDate: dateStrToTs(p.startDate),
        endDate: dateStrToTs(p.endDate),
        requestDate: dateStrToTs(p.requestDate),
        submitDate: dateStrToTs(p.submitDate),
        presentDate: dateStrToTs(p.presentDate),
        ...companyRef(p.company),
        ...contactRef(p.company, p.contact),
        ...ownerRef(p.owner),
        ...meta(empIdByName.get(p.owner) ?? "seed"),
      });
    }
    await batch.commit();
    console.log(`proposals: ${proposals.length}`);
  }

  // 7) quotations
  {
    const batch = db.batch();
    for (const q of quotations) {
      batch.set(db.collection("quotations").doc(), {
        title: q.title,
        number: q.number,
        startDate: dateStrToTs(q.startDate),
        endDate: dateStrToTs(q.endDate),
        amount: q.amount,
        qty: q.qty,
        total: q.total,
        ...companyRef(q.company),
        ...contactRef(q.company, q.contact),
        ...ownerRef(q.owner),
        ...meta(empIdByName.get(q.owner) ?? "seed"),
      });
    }
    await batch.commit();
    console.log(`quotations: ${quotations.length}`);
  }

  // 8) contracts
  {
    const batch = db.batch();
    for (const c of contracts) {
      batch.set(db.collection("contracts").doc(), {
        title: c.title,
        contractDate: dateStrToTs(c.contractDate),
        startDate: dateStrToTs(c.startDate),
        endDate: dateStrToTs(c.endDate),
        product: c.product,
        productCount: c.productCount,
        amount: c.amount,
        ...companyRef(c.company),
        ...contactRef(c.company, c.contact),
        ...ownerRef(c.owner),
        ...meta(empIdByName.get(c.owner) ?? "seed"),
      });
    }
    await batch.commit();
    console.log(`contracts: ${contracts.length}`);
  }

  // 9) orders
  {
    const batch = db.batch();
    for (const o of orders) {
      batch.set(db.collection("orders").doc(), {
        customer: o.customer,
        contractTitle: o.contractTitle,
        contractId: "", // 시드 단계에서는 계약 역참조 생략(필요 시 후처리)
        startDate: dateStrToTs(o.startDate),
        endDate: dateStrToTs(o.endDate),
        amount: o.amount,
        qty: o.qty,
        total: o.total,
        ...companyRef(o.company),
        ...contactRef(o.company, o.contact),
        ...ownerRef(o.owner),
        ...meta(empIdByName.get(o.owner) ?? "seed"),
      });
    }
    await batch.commit();
    console.log(`orders: ${orders.length}`);
  }

  // 10) supports
  {
    const batch = db.batch();
    for (const s of supports) {
      batch.set(db.collection("supports").doc(), {
        title: s.title,
        startDate: dateStrToTs(s.startDate),
        endDate: dateStrToTs(s.endDate),
        status: s.status,
        ...companyRef(s.company),
        ...contactRef(s.company, s.contact),
        ...ownerRef(s.owner),
        ...meta(empIdByName.get(s.owner) ?? "seed"),
      });
    }
    await batch.commit();
    console.log(`supports: ${supports.length}`);
  }

  // 11) todos (at: "0000.00.00 00:00")
  {
    const batch = db.batch();
    for (const t of todos) {
      batch.set(db.collection("todos").doc(), {
        kind: t.kind,
        priority: t.priority,
        title: t.title,
        at: dateTimeStrToTs(t.at),
        done: t.done,
        ...ownerRef(t.owner),
        ...meta(empIdByName.get(t.owner) ?? "seed"),
      });
    }
    await batch.commit();
    console.log(`todos: ${todos.length}`);
  }

  // 12) prospects
  {
    const batch = db.batch();
    for (const p of prospects) {
      batch.set(db.collection("prospects").doc(), {
        name: p.name,
        company: p.company,
        registeredAt: dateStrToTs(p.registeredAt),
        status: p.status,
        email: p.email,
        mobile: p.mobile,
        phone: p.phone,
        ...ownerRef(p.owner),
        ...meta(empIdByName.get(p.owner) ?? "seed"),
      });
    }
    await batch.commit();
    console.log(`prospects: ${prospects.length}`);
  }

  // 13) products (마스터)
  {
    const batch = db.batch();
    for (const p of products) {
      batch.set(db.collection("products").doc(), {
        name: p.name,
        spec: p.spec,
        packQty: p.packQty,
        price: p.price,
      });
    }
    await batch.commit();
    console.log(`products: ${products.length}`);
  }

  // 14) chatters (participantIds 는 데모상 빈 배열)
  {
    const batch = db.batch();
    for (const c of chatters) {
      batch.set(db.collection("chatters").doc(), {
        title: c.title,
        memberCount: c.memberCount,
        participants: c.participants,
        participantIds: [],
        shared: c.shared,
        ...ownerRef(employees[0]?.name ?? ""),
        ...meta("seed"),
      });
    }
    await batch.commit();
    console.log(`chatters: ${chatters.length}`);
  }

  await computeAggregates();
  console.log("시드 완료.");
}

/** 시드 직후 companies.counts / memberCount 를 직접 계산해 채운다 (CF 백필 대체) */
async function computeAggregates() {
  const countMap: Record<string, Record<string, number>> = {};
  const memberMap: Record<string, number> = {};
  const ensure = (cid: string) =>
    (countMap[cid] ??= { opportunity: 0, activity: 0, quotation: 0, contract: 0, support: 0 });

  const collToField: Record<string, string> = {
    opportunities: "opportunity",
    activities: "activity",
    quotations: "quotation",
    contracts: "contract",
    supports: "support",
  };

  for (const coll of Object.keys(collToField)) {
    const snap = await db.collection(coll).get();
    snap.forEach((d) => {
      const cid = d.get("companyId");
      if (cid) ensure(cid)[collToField[coll]] += 1;
    });
  }
  const cs = await db.collection("contacts").get();
  cs.forEach((d) => {
    const cid = d.get("companyId");
    if (cid) memberMap[cid] = (memberMap[cid] ?? 0) + 1;
  });

  const companiesSnap = await db.collection("companies").get();
  const batch = db.batch();
  companiesSnap.forEach((c) => {
    batch.set(
      c.ref,
      {
        counts: countMap[c.id] ?? {
          opportunity: 0,
          activity: 0,
          quotation: 0,
          contract: 0,
          support: 0,
        },
        memberCount: memberMap[c.id] ?? 0,
      },
      { merge: true },
    );
  });
  await batch.commit();
  console.log("집계(counts/memberCount) 계산 완료.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
