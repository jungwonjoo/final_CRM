// Firestore 도큐먼트 타입 레이어 (마이그레이션)
//
// 목적: src/lib/types.ts 의 UI용 인터페이스는 그대로 두고(수정 금지),
//       Firestore 저장 형태(*Doc) 를 별도로 정의한다.
//       - 이름 문자열 참조(company/owner/contact) → ID 참조(companyId/ownerId/contactId) + denorm 이름 병행
//       - 날짜 문자열("2026.06.08", "... 14:30") → Timestamp
//       - 공통 메타(createdAt/updatedAt/ownerId/createdBy)
//
// 변환 헬퍼(fromXDoc): Doc → UI 타입. (toXDoc 은 폼 입력 + ref 매핑이 필요하므로
//                       호출 측에서 companyId/contactId 를 주입하는 시그니처로 제공)

import { Timestamp } from "firebase/firestore";
import type {
  ActivityItem,
  ActivityType,
  ChatMessage,
  Chatter,
  Company,
  CompanyCounts,
  Contact,
  Contract,
  Employee,
  Opportunity,
  Order,
  Product,
  Proposal,
  Prospect,
  ProspectStatus,
  Quotation,
  SalesEvent,
  SalesEventKind,
  Support,
  SupportStatus,
  Todo,
  TodoKind,
  TodoPriority,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// 공통 메타
// ---------------------------------------------------------------------------

export interface BaseMeta {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string; // 작성자 uid
}

/** owner(담당자)를 가지는 엔티티 공통 참조 */
export interface OwnerRef {
  ownerId: string; // employees/{uid}
  ownerName: string; // denorm 표시용
}

/** 허브(거래처)/고객 참조 */
export interface CompanyRef {
  companyId: string;
  company: string; // denorm 거래처명
}
export interface ContactRef {
  contactId: string;
  contact: string; // denorm 고객명
}

// ---------------------------------------------------------------------------
// 엔티티 Doc 타입
// ---------------------------------------------------------------------------

export interface CompanyCountsDoc {
  opportunity: number; // null → 0 통일
  activity: number;
  quotation: number;
  contract: number;
  support: number;
}

export interface CompanyDoc extends BaseMeta, OwnerRef {
  name: string;
  nameLower: string; // 검색/정렬용
  memberCount: number; // contacts 집계로 동기화
  address: string;
  amount: number;
  counts: CompanyCountsDoc;
}

export interface ContactDoc extends BaseMeta, OwnerRef, CompanyRef {
  name: string;
  dept: string;
  position: string;
  phone: string;
  email: string;
  officePhone?: string;
}

export interface ActivityDoc extends BaseMeta, OwnerRef, CompanyRef, ContactRef {
  date: Timestamp; // date + time 통합
  type: ActivityType;
  title: string;
  dept: string;
}

export interface OpportunityDoc extends BaseMeta, OwnerRef, CompanyRef, ContactRef {
  title: string;
  stage: number; // 0~4 (성공확률 = stage*25, 클라 계산)
  amount: number;
  startDate: Timestamp;
  endDate: Timestamp;
  products: string[];
}

export interface ProposalDoc extends BaseMeta, OwnerRef, CompanyRef, ContactRef {
  title: string;
  opportunityId?: string;
  startDate: Timestamp;
  endDate: Timestamp;
  requestDate: Timestamp;
  submitDate: Timestamp;
  presentDate: Timestamp;
}

export interface QuotationDoc extends BaseMeta, OwnerRef, CompanyRef, ContactRef {
  title: string;
  number: string;
  opportunityId?: string;
  startDate: Timestamp;
  endDate: Timestamp;
  amount: number;
  qty: number;
  total: number;
}

export interface QuotationItemDoc {
  productId: string;
  name: string;
  spec: string;
  packQty: number;
  price: number;
  qty: number;
  lineTotal: number;
}

export interface ContractDoc extends BaseMeta, OwnerRef, CompanyRef, ContactRef {
  title: string;
  opportunityId?: string;
  quotationId?: string;
  contractDate: Timestamp;
  startDate: Timestamp;
  endDate: Timestamp;
  product: string;
  productCount: number;
  amount: number;
}

export interface OrderDoc extends BaseMeta, OwnerRef, CompanyRef, ContactRef {
  customer: string;
  contractTitle: string;
  contractId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  amount: number;
  qty: number;
  total: number;
}

export interface SupportDoc extends BaseMeta, OwnerRef, CompanyRef, ContactRef {
  title: string;
  startDate: Timestamp;
  endDate: Timestamp;
  status: SupportStatus;
}

export interface TodoDoc extends BaseMeta, OwnerRef {
  kind: TodoKind;
  priority: TodoPriority;
  title: string;
  at: Timestamp;
  done: boolean;
  companyId?: string;
  contactId?: string;
}

export interface ChatterDoc extends BaseMeta, OwnerRef {
  title: string;
  memberCount: number;
  participants: string; // denorm 표시용
  participantIds: string[]; // 보안규칙용 uid 배열
  shared: string;
  companyId?: string;
  lastMessageAt?: Timestamp;
}

export interface ChatMessageDoc {
  authorId: string;
  author: string;
  at: Timestamp;
  text: string;
}

export interface ProspectDoc extends BaseMeta, OwnerRef {
  name: string;
  company: string; // 아직 company doc 이 없을 수 있어 문자열 유지
  companyId?: string; // 전환 후 링크
  registeredAt: Timestamp;
  status: ProspectStatus;
  email: string;
  mobile: string;
  phone: string;
  convertedCompanyId?: string;
  convertedContactId?: string;
}

export interface ProductDoc {
  name: string;
  spec: string;
  packQty: number;
  price: number;
}

export interface EmployeeDoc {
  name: string;
  dept: string;
  position: string;
  roles: string[];
}

/** companies/{id}/salesEvents — CF fan-out 타임라인 */
export interface SalesEventDoc {
  kind: SalesEventKind;
  date: Timestamp;
  hasAttachment?: boolean;
  lines: string[];
  sourceColl: string; // 원본 컬렉션명
  sourceId: string; // 원본 문서 id
  companyId: string;
  contactId?: string;
  createdAt: Timestamp;
}

// ---------------------------------------------------------------------------
// 날짜 포맷 유틸
// ---------------------------------------------------------------------------

/** Timestamp → "2026.06.08" */
export function tsToDate(ts: Timestamp | null | undefined): string {
  if (!ts) return "";
  const d = ts.toDate();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

/** Timestamp → "09:00" */
export function tsToTime(ts: Timestamp | null | undefined): string {
  if (!ts) return "";
  const d = ts.toDate();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** Timestamp → "2026.06.24 14:30" */
export function tsToDateTime(ts: Timestamp | null | undefined): string {
  if (!ts) return "";
  return `${tsToDate(ts)} ${tsToTime(ts)}`;
}

/** "2026.06.08" (+ 선택적 "09:00") → Timestamp */
export function dateStrToTs(date: string, time?: string): Timestamp {
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

/** "2026.06.24 14:30" → Timestamp */
export function dateTimeStrToTs(value: string): Timestamp {
  const [date, time] = value.trim().split(/\s+/);
  return dateStrToTs(date, time);
}

// ---------------------------------------------------------------------------
// Doc → UI 변환 헬퍼 (fromXDoc)
// id 는 Firestore 문서 id 를 별도로 전달
// ---------------------------------------------------------------------------

function countsFromDoc(c: CompanyCountsDoc): CompanyCounts {
  // UI 는 0 을 "—" 로 표시. number 0 그대로 전달(타입은 number | null 호환).
  return {
    opportunity: c.opportunity,
    activity: c.activity,
    quotation: c.quotation,
    contract: c.contract,
    support: c.support,
  };
}

export function fromCompanyDoc(id: string, d: CompanyDoc): Company {
  return {
    id,
    name: d.name,
    memberCount: d.memberCount,
    address: d.address,
    ownerName: d.ownerName,
    amount: d.amount,
    counts: countsFromDoc(d.counts),
  };
}

export function fromContactDoc(id: string, d: ContactDoc): Contact {
  return {
    id,
    name: d.name,
    dept: d.dept,
    position: d.position,
    phone: d.phone,
    email: d.email,
    officePhone: d.officePhone,
    company: d.company,
    ownerName: d.ownerName,
    // events 는 salesEvents 를 contactId 로 별도 조회해 주입
  };
}

export function fromActivityDoc(id: string, d: ActivityDoc): ActivityItem {
  return {
    id,
    date: tsToDate(d.date),
    time: tsToTime(d.date),
    type: d.type,
    title: d.title,
    company: d.company,
    contact: d.contact,
    owner: d.ownerName,
    dept: d.dept,
  };
}

export function fromOpportunityDoc(id: string, d: OpportunityDoc): Opportunity {
  return {
    id,
    title: d.title,
    stage: d.stage,
    company: d.company,
    contact: d.contact,
    amount: d.amount,
    startDate: tsToDate(d.startDate),
    endDate: tsToDate(d.endDate),
    products: d.products,
  };
}

export function fromProposalDoc(id: string, d: ProposalDoc): Proposal {
  return {
    id,
    title: d.title,
    company: d.company,
    contact: d.contact,
    owner: d.ownerName,
    startDate: tsToDate(d.startDate),
    endDate: tsToDate(d.endDate),
    requestDate: tsToDate(d.requestDate),
    submitDate: tsToDate(d.submitDate),
    presentDate: tsToDate(d.presentDate),
  };
}

export function fromQuotationDoc(id: string, d: QuotationDoc): Quotation {
  return {
    id,
    title: d.title,
    number: d.number,
    company: d.company,
    contact: d.contact,
    owner: d.ownerName,
    startDate: tsToDate(d.startDate),
    endDate: tsToDate(d.endDate),
    amount: d.amount,
    qty: d.qty,
    total: d.total,
  };
}

export function fromContractDoc(id: string, d: ContractDoc): Contract {
  return {
    id,
    title: d.title,
    company: d.company,
    contact: d.contact,
    owner: d.ownerName,
    contractDate: tsToDate(d.contractDate),
    startDate: tsToDate(d.startDate),
    endDate: tsToDate(d.endDate),
    product: d.product,
    productCount: d.productCount,
    amount: d.amount,
  };
}

export function fromOrderDoc(id: string, d: OrderDoc): Order {
  return {
    id,
    customer: d.customer,
    contractTitle: d.contractTitle,
    company: d.company,
    contact: d.contact,
    owner: d.ownerName,
    startDate: tsToDate(d.startDate),
    endDate: tsToDate(d.endDate),
    amount: d.amount,
    qty: d.qty,
    total: d.total,
  };
}

export function fromSupportDoc(id: string, d: SupportDoc): Support {
  return {
    id,
    title: d.title,
    company: d.company,
    contact: d.contact,
    owner: d.ownerName,
    startDate: tsToDate(d.startDate),
    endDate: tsToDate(d.endDate),
    status: d.status,
  };
}

export function fromTodoDoc(id: string, d: TodoDoc): Todo {
  return {
    id,
    kind: d.kind,
    priority: d.priority,
    title: d.title,
    at: tsToDateTime(d.at),
    owner: d.ownerName,
    done: d.done,
  };
}

export function fromChatterDoc(id: string, d: ChatterDoc): Chatter {
  return {
    id,
    title: d.title,
    memberCount: d.memberCount,
    participants: d.participants,
    shared: d.shared,
  };
}

export function fromChatMessageDoc(id: string, d: ChatMessageDoc): ChatMessage {
  return {
    id,
    author: d.author,
    at: tsToDateTime(d.at),
    text: d.text,
  };
}

export function fromProspectDoc(id: string, d: ProspectDoc): Prospect {
  return {
    id,
    name: d.name,
    company: d.company,
    owner: d.ownerName,
    registeredAt: tsToDate(d.registeredAt),
    status: d.status,
    email: d.email,
    mobile: d.mobile,
    phone: d.phone,
  };
}

export function fromProductDoc(id: string, d: ProductDoc): Product {
  return {
    id,
    name: d.name,
    spec: d.spec,
    packQty: d.packQty,
    price: d.price,
  };
}

export function fromEmployeeDoc(id: string, d: EmployeeDoc): Employee {
  return {
    id,
    name: d.name,
    dept: d.dept,
    position: d.position,
    roles: d.roles,
  };
}

export function fromSalesEventDoc(id: string, d: SalesEventDoc): SalesEvent {
  return {
    id,
    kind: d.kind,
    date: tsToDate(d.date),
    hasAttachment: d.hasAttachment,
    lines: d.lines,
  };
}

// ---------------------------------------------------------------------------
// UI/폼 → Doc 변환 헬퍼 (toXDoc)
// ref(companyId/contactId/ownerId) 와 메타는 호출 측에서 주입.
// 여기서는 대표적으로 가장 복잡한 Activity 만 핵심 구현을 제공하고,
// 나머지는 동일 패턴(날짜 문자열 → Timestamp, 이름 → ref 주입)을 따른다.
// ---------------------------------------------------------------------------

export interface DocRefs {
  companyId: string;
  contactId: string;
  ownerId: string;
  createdBy: string;
}

/** ActivityItem(UI) + refs → ActivityDoc (createdAt/updatedAt 은 serverTimestamp 로 호출 측에서 덮어씀) */
export function toActivityDoc(
  ui: Omit<ActivityItem, "id">,
  refs: DocRefs,
): Omit<ActivityDoc, "createdAt" | "updatedAt"> {
  return {
    date: dateStrToTs(ui.date, ui.time),
    type: ui.type,
    title: ui.title,
    dept: ui.dept,
    company: ui.company,
    companyId: refs.companyId,
    contact: ui.contact,
    contactId: refs.contactId,
    ownerName: ui.owner,
    ownerId: refs.ownerId,
    createdBy: refs.createdBy,
  };
}
