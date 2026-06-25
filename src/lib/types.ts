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

/** 매출 (계약 기반 매출 실적) */
export interface Order {
  id: string;
  customer: string; // 고객명 (대표 타이틀)
  contractTitle: string; // 계약명
  company: string; // 거래처명
  contact: string; // 고객명
  owner: string; // 담당자
  startDate: string; // 계약기간 시작
  endDate: string; // 계약기간 종료
  amount: number; // 견적금액(단가)
  qty: number; // 수량
  total: number; // 합계
}

/** 알람 (담당자 지정 등으로 발생하는 알림) */
export interface Alarm {
  id: string;
  text: string;
  at: string; // 0000.00.00 00:00
}

/** 회의록 */
export interface Proceeding {
  id: string;
  title: string; // 회의명
  company: string; // 거래처명
  owner: string; // 담당자
  date: string; // 회의일 0000.00.00
  place?: string; // 장소
  attendeesClient?: string; // 참석자(고객)
  attendeesOwn?: string; // 참석자(자사)
  content?: string; // 회의 내용
}

/** 영업공지 */
export interface Notice {
  id: string;
  title: string; // 제목
  author: string; // 작성자
  date: string; // 작성일 0000.00.00
  views: number; // 조회수
  comments: number; // 댓글수
  pinned: boolean; // 필독(상단고정)
  excerpt?: string; // 본문 미리보기
}

/** 영업보고 */
export interface SalesReport {
  id: string;
  reportDate: string; // 보고일
  template: string; // 보고 템플릿 (예: 영업팀 템플릿)
  startDate: string; // 보고기간 시작
  endDate: string; // 보고기간 종료
  dept: string; // 팀
  author: string; // 작성자
  submitted: boolean; // 제출 여부
}

/** 채터 (채팅방) */
export interface Chatter {
  id: string;
  title: string; // 채팅방 제목
  memberCount: number; // 참여인원
  participants: string; // 대화상대
  shared: string; // 공유내용
}

/** 채터 메모(메시지) — 실시간이 아닌, 남긴 메모를 채팅 형태로 표시 */
export interface ChatMessage {
  id: string;
  author: string; // 작성자
  at: string; // 작성 시각 (예: 2026.06.24 14:30)
  text: string; // 내용
}

/** 잠재고객 상태 */
export type ProspectStatus = "미접촉" | "접촉중" | "접촉금지" | "고객전환";

/** 잠재고객 */
export interface Prospect {
  id: string;
  name: string; // 잠재고객명
  company: string; // 거래처명
  owner: string; // 담당자
  registeredAt: string; // 등록일 0000.00.00
  status: ProspectStatus;
  email: string;
  mobile: string; // 휴대폰
  phone: string; // 일반전화
}

/** 고객지원 진행상태 */
export type SupportStatus = "처리중" | "완료";

/** 고객지원 */
export interface Support {
  id: string;
  title: string; // 고객지원 제목
  company: string; // 거래처명
  contact: string; // 고객명
  owner: string; // 담당자
  startDate: string; // 처리기간 시작
  endDate: string; // 처리기간 종료
  status: SupportStatus; // 진행상태
}

/** 할일 구분 */
export type TodoKind = "전화" | "메일" | "방문" | "견적" | "기타";

/** 할일 중요도 (상태 아이콘) */
export type TodoPriority = "높음" | "보통" | "낮음";

/** 할일 */
export interface Todo {
  id: string;
  kind: TodoKind;
  priority: TodoPriority; // 중요도
  title: string;
  at: string; // 등록일시 0000.00.00 00:00
  owner: string; // 담당자
  done: boolean; // 완료 여부
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
  | "order" // 매출
  | "support"; // 고객지원

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
