// FingerSales 도메인 타입 (마이그레이션 공통)

/** 고객사 목록 카드에 표시되는 연관 건수 */
export interface CompanyCounts {
  opportunity: number | null; // 영업기회
  activity: number | null; // 영업활동
  quotation: number | null; // 견적
  contract: number | null; // 계약
  support: number | null; // 고객지원
}

/** 고객사 */
export interface Company {
  id: string;
  name: string; // 거래처명
  memberCount: number; // 고객 수 (n명)
  address: string; // 주소
  ownerName: string; // 담당자
  amount: number; // 금액(만원)
  counts: CompanyCounts;
}

/** 고객 (고객사에 소속된 담당자) */
export interface Contact {
  id: string;
  name: string; // 고객명
  dept: string; // 부서
  position: string; // 직급
  phone: string; // 휴대폰
  email: string; // 이메일
  officePhone?: string; // 일반전화
  company?: string; // 거래처명
  ownerName?: string; // 담당자
  events?: ContactEvent[]; // 관련 영업현황 ("N건" 클릭 시 펼침)
}

/** 고객 카드의 "N건" 펼침에 표시되는 간략 영업현황 라인 */
export interface ContactEvent {
  id: string;
  kind: SalesEventKind; // 색상/구분
  text: string; // 표시 라인 (예: "0000.00.00 / 견적 / 거래처명 CRM 구축형 견적")
}

/** 영업활동 종류 */
export type ActivityType = "방문" | "전화" | "업무협의" | "메일" | "교육";

/** 영업활동 */
export interface ActivityItem {
  id: string;
  date: string; // 2026.06.08
  time: string; // 09:00
  type: ActivityType;
  title: string;
  company: string; // 거래처
  contact: string; // 고객
  owner: string; // 담당자
  dept: string; // 부서
}

/** 영업기회 */
export interface Opportunity {
  id: string;
  title: string; // 영업기회명
  stage: number; // 완료 단계 수 0~4 (인지/제안/협상/계약) → 성공확률 = stage*25
  company: string; // 거래처명
  contact: string; // 고객명
  amount: number; // 금액(만원)
  startDate: string; // 시작일
  endDate: string; // 종료일
  products: string[]; // 제품유형
}

/** 제안 */
export interface Proposal {
  id: string;
  title: string; // 제안명
  company: string; // 거래처
  contact: string; // 고객
  owner: string; // 담당자
  startDate: string;
  endDate: string;
  requestDate: string; // 요청일
  submitDate: string; // 제출일
  presentDate: string; // 발표일
}

/** 계약 */
export interface Contract {
  id: string;
  title: string; // 계약명
  company: string;
  contact: string;
  owner: string;
  contractDate: string; // 계약일
  startDate: string; // 계약기간 시작
  endDate: string; // 계약기간 종료
  product: string; // 대표 계약제품
  productCount: number; // 외 N
  amount: number; // 계약금액
}

/** 제품 (견적품목 선택용 카탈로그) */
export interface Product {
  id: string;
  name: string;
  spec: string; // 규격 (USER / SET / M/D 등)
  packQty: number; // 포장수량
  price: number; // 단가
}

/** 견적 */
export interface Quotation {
  id: string;
  title: string; // 견적명
  number: string; // 견적번호
  company: string;
  contact: string;
  owner: string;
  startDate: string;
  endDate: string;
  amount: number; // 견적금액(단가)
  qty: number; // 수량
  total: number; // 합계
}

/** 핑거세일즈에 가입된 직원 (담당자 선택용) */
export interface Employee {
  id: string;
  name: string; // 이름
  dept: string; // 팀
  position: string; // 직급
  roles?: string[]; // 영업담당 / CRM 등
}

/** 영업현황 타임라인 이벤트 종류 */
export type SalesEventKind =
  | "activity" // 영업활동
  | "quotation" // 견적
  | "proposal" // 제안
  | "opportunity" // 영업기회
  | "contract" // 계약
  | "order"; // 매출

/** 영업현황 타임라인 이벤트 */
export interface SalesEvent {
  id: string;
  kind: SalesEventKind;
  date: string; // 0000.00.00
  hasAttachment?: boolean;
  lines: string[]; // 카드 본문 (종류별로 구성 다름)
}

/** 우측 컬럼 - 최근등록/최근검색 항목 */
export type RecentKind =
  | "contact" // 고객
  | "company" // 거래처
  | "prospect" // 잠재고객
  | "proceedings" // 회의록
  | "proposal"; // 제안

export interface RecentItem {
  id: string;
  kind: RecentKind;
  title: string;
  owner: string;
  at: string; // 0000.00.00 00:00
}
