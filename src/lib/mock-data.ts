import type {
  ActivityItem,
  Company,
  Contact,
  Contract,
  Employee,
  Opportunity,
  Product,
  Proposal,
  Quotation,
  RecentItem,
  SalesEvent,
} from "@/lib/types";

// 퍼블리싱 원본의 더미값을 재현한 목업 데이터 (실제 API 연동 전까지 사용)
export const companies: Company[] = [
  {
    id: "1",
    name: "한국야금 KORLOY",
    memberCount: 42,
    address: "서울특별시 강남구 테헤란로 124",
    ownerName: "김도원",
    amount: 185000,
    counts: {
      opportunity: 3,
      activity: 12,
      quotation: 5,
      contract: 2,
      support: 1,
    },
  },
  {
    id: "2",
    name: "빙그레",
    memberCount: 28,
    address: "경기도 남양주시 다산순환로 20",
    ownerName: "박기준",
    amount: 96000,
    counts: {
      opportunity: 2,
      activity: 7,
      quotation: 3,
      contract: 1,
      support: null,
    },
  },
  {
    id: "3",
    name: "세아제강",
    memberCount: 35,
    address: "서울특별시 중구 칠패로 37",
    ownerName: "연경현",
    amount: 240000,
    counts: {
      opportunity: 4,
      activity: 9,
      quotation: 6,
      contract: 3,
      support: 2,
    },
  },
  {
    id: "4",
    name: "여기어때 컴퍼니",
    memberCount: 16,
    address: "서울특별시 강남구 봉은사로 479",
    ownerName: "오수연",
    amount: 54000,
    counts: {
      opportunity: 1,
      activity: 4,
      quotation: 2,
      contract: null,
      support: 1,
    },
  },
  {
    id: "5",
    name: "현대엘리베이터",
    memberCount: 51,
    address: "충청북도 충주시 충원대로 100",
    ownerName: "석정하",
    amount: 312000,
    counts: {
      opportunity: 5,
      activity: 15,
      quotation: 8,
      contract: 4,
      support: 3,
    },
  },
];

export function getCompany(id: string): Company | undefined {
  return companies.find((c) => c.id === id);
}

// 고객 목록 (고객 페이지) — "N건" 클릭 시 펼쳐질 영업현황 포함
export const contacts: Contact[] = [
  {
    id: "1",
    name: "황부장",
    dept: "구매팀",
    position: "부장",
    phone: "010-1111-1111",
    officePhone: "02-458-752358",
    email: "hwang@email.com",
    company: "한국야금 KORLOY",
    ownerName: "김도원",
    events: [
      { id: "c1e1", kind: "activity", text: "2026.06.08 / 업무협의 / 신제품 도입 미팅" },
      { id: "c1e2", kind: "quotation", text: "2026.06.05 / 견적 / 한국야금 CRM 구축형 견적" },
      { id: "c1e3", kind: "proposal", text: "2026.06.01 / 제안 / 영업관리 고도화 제안" },
    ],
  },
  {
    id: "2",
    name: "이상무",
    dept: "경영지원팀",
    position: "상무",
    phone: "010-2222-2222",
    officePhone: "02-552-100200",
    email: "lee@email.com",
    company: "빙그레",
    ownerName: "박기준",
    events: [
      { id: "c2e1", kind: "activity", text: "2026.06.07 / 방문 / 분기 영업 리뷰" },
      { id: "c2e2", kind: "contract", text: "2026.05.30 / 계약 / 연간 유지보수 계약" },
    ],
  },
  {
    id: "3",
    name: "정과장",
    dept: "기술연구소",
    position: "과장",
    phone: "010-3333-3333",
    officePhone: "02-330-445566",
    email: "jung@email.com",
    company: "세아제강",
    ownerName: "연경현",
    events: [
      { id: "c3e1", kind: "opportunity", text: "2026.06.06 / 영업기회 / 생산관리 시스템 도입" },
      { id: "c3e2", kind: "quotation", text: "2026.06.02 / 견적 / 세아제강 모듈 견적" },
      { id: "c3e3", kind: "activity", text: "2026.05.28 / 전화 / 요구사항 청취" },
    ],
  },
  {
    id: "4",
    name: "최대리",
    dept: "마케팅팀",
    position: "대리",
    phone: "010-4444-4444",
    officePhone: "02-778-991122",
    email: "choi@email.com",
    company: "여기어때 컴퍼니",
    ownerName: "오수연",
    events: [
      { id: "c4e1", kind: "activity", text: "2026.06.08 / 업무협의 / 프로모션 연동 협의" },
    ],
  },
  {
    id: "5",
    name: "한이사",
    dept: "영업팀",
    position: "이사",
    phone: "010-5555-5555",
    officePhone: "02-264-880099",
    email: "han@email.com",
    company: "현대엘리베이터",
    ownerName: "석정하",
    events: [
      { id: "c5e1", kind: "proposal", text: "2026.06.04 / 제안 / 전사 CRM 전환 제안" },
      { id: "c5e2", kind: "opportunity", text: "2026.06.03 / 영업기회 / 유지보수 확대" },
      { id: "c5e3", kind: "order", text: "2026.05.29 / 매출 / 1분기 라이선스" },
    ],
  },
  {
    id: "6",
    name: "김과장",
    dept: "기술연구소",
    position: "과장",
    phone: "010-6666-6666",
    officePhone: "02-458-752359",
    email: "kim6@email.com",
    company: "한국야금 KORLOY",
    ownerName: "김도원",
    events: [
      { id: "c6e1", kind: "activity", text: "2026.06.07 / 업무협의 / 기술 검토 미팅" },
    ],
  },
  {
    id: "7",
    name: "이대리",
    dept: "구매팀",
    position: "대리",
    phone: "010-7777-7777",
    officePhone: "02-458-752360",
    email: "lee7@email.com",
    company: "한국야금 KORLOY",
    ownerName: "박기준",
    events: [
      { id: "c7e1", kind: "quotation", text: "2026.06.05 / 견적 / 추가 모듈 견적" },
      { id: "c7e2", kind: "activity", text: "2026.06.01 / 전화 / 납기 협의" },
    ],
  },
  {
    id: "8",
    name: "박차장",
    dept: "경영지원팀",
    position: "차장",
    phone: "010-8888-8888",
    officePhone: "02-330-445567",
    email: "park8@email.com",
    company: "세아제강",
    ownerName: "연경현",
    events: [
      { id: "c8e1", kind: "contract", text: "2026.06.02 / 계약 / 컨설팅 계약" },
    ],
  },
];

export function getContact(id: string): Contact | undefined {
  return contacts.find((c) => c.id === id);
}

// 영업활동 목록 (2026년 6월)
export const activities: ActivityItem[] = [
  { id: "a1", date: "2026.06.08", time: "09:00", type: "방문", title: "신제품 소개 미팅", company: "한국야금 KORLOY", contact: "황부장", owner: "김도원", dept: "영업팀" },
  { id: "a2", date: "2026.06.08", time: "14:00", type: "전화", title: "납기 협의", company: "빙그레", contact: "이상무", owner: "박기준", dept: "개발팀" },
  { id: "a3", date: "2026.06.09", time: "10:30", type: "업무협의", title: "요구사항 정리", company: "세아제강", contact: "정과장", owner: "연경현", dept: "기술연구소" },
  { id: "a4", date: "2026.06.10", time: "13:00", type: "메일", title: "견적서 발송", company: "여기어때 컴퍼니", contact: "최대리", owner: "오수연", dept: "마케팅팀" },
  { id: "a5", date: "2026.06.12", time: "11:00", type: "방문", title: "계약 체결 미팅", company: "현대엘리베이터", contact: "한이사", owner: "석정하", dept: "클라우드팀" },
  { id: "a6", date: "2026.06.12", time: "16:00", type: "업무협의", title: "기술 검토", company: "한국야금 KORLOY", contact: "김과장", owner: "김도원", dept: "영업팀" },
  { id: "a7", date: "2026.06.15", time: "09:30", type: "전화", title: "후속 상담", company: "빙그레", contact: "이상무", owner: "박기준", dept: "개발팀" },
  { id: "a8", date: "2026.06.16", time: "15:00", type: "교육", title: "도입 교육 진행", company: "세아제강", contact: "정과장", owner: "연경현", dept: "기술연구소" },
  { id: "a9", date: "2026.06.18", time: "10:00", type: "방문", title: "정기 점검", company: "현대엘리베이터", contact: "한이사", owner: "석정하", dept: "클라우드팀" },
];

// 영업기회 목록
export const opportunities: Opportunity[] = [
  {
    id: "1",
    title: "신규 CRM 도입 검토",
    stage: 0,
    company: "한국야금 KORLOY",
    contact: "황부장",
    amount: 10000,
    startDate: "2026.06.01",
    endDate: "2026.08.31",
    products: ["사용자 라이선스", "서버 라이선스"],
  },
  {
    id: "2",
    title: "마케팅 자동화 제안",
    stage: 1,
    company: "빙그레",
    contact: "이상무",
    amount: 24000,
    startDate: "2026.05.20",
    endDate: "2026.07.20",
    products: ["사용자 라이선스"],
  },
  {
    id: "3",
    title: "생산관리 시스템 구축",
    stage: 2,
    company: "세아제강",
    contact: "정과장",
    amount: 52000,
    startDate: "2026.05.10",
    endDate: "2026.09.30",
    products: ["서버 라이선스", "유지보수"],
  },
  {
    id: "4",
    title: "예약 플랫폼 연동",
    stage: 3,
    company: "여기어때 컴퍼니",
    contact: "최대리",
    amount: 18000,
    startDate: "2026.04.15",
    endDate: "2026.06.30",
    products: ["사용자 라이선스", "컨설팅"],
  },
  {
    id: "5",
    title: "전사 영업관리 전환",
    stage: 4,
    company: "현대엘리베이터",
    contact: "한이사",
    amount: 96000,
    startDate: "2026.03.01",
    endDate: "2026.05.31",
    products: ["사용자 라이선스", "서버 라이선스", "유지보수"],
  },
];

export function getOpportunity(id: string): Opportunity | undefined {
  return opportunities.find((o) => o.id === id);
}

// 제안 목록
export const proposals: Proposal[] = [
  {
    id: "1",
    title: "CRM 고도화 제안",
    company: "한국야금 KORLOY",
    contact: "황부장",
    owner: "김도원",
    startDate: "2026.06.01",
    endDate: "2026.06.30",
    requestDate: "2026.06.01",
    submitDate: "2026.06.10",
    presentDate: "2026.06.15",
  },
  {
    id: "2",
    title: "마케팅 자동화 제안",
    company: "빙그레",
    contact: "이상무",
    owner: "박기준",
    startDate: "2026.05.20",
    endDate: "2026.07.20",
    requestDate: "2026.05.20",
    submitDate: "2026.06.02",
    presentDate: "2026.06.08",
  },
  {
    id: "3",
    title: "생산관리 시스템 제안",
    company: "세아제강",
    contact: "정과장",
    owner: "연경현",
    startDate: "2026.05.10",
    endDate: "2026.09.30",
    requestDate: "2026.05.10",
    submitDate: "2026.05.28",
    presentDate: "2026.06.05",
  },
  {
    id: "4",
    title: "전사 영업관리 전환 제안",
    company: "현대엘리베이터",
    contact: "한이사",
    owner: "석정하",
    startDate: "2026.03.01",
    endDate: "2026.05.31",
    requestDate: "2026.03.01",
    submitDate: "2026.03.20",
    presentDate: "2026.04.02",
  },
];

export function getProposal(id: string): Proposal | undefined {
  return proposals.find((p) => p.id === id);
}

// 견적 목록
export const quotations: Quotation[] = [
  { id: "1", title: "CRM 구축형 견적", number: "CRM-2026-0608-1", company: "한국야금 KORLOY", contact: "황부장", owner: "김도원", startDate: "2026.06.01", endDate: "2026.06.30", amount: 10000, qty: 2, total: 20000 },
  { id: "2", title: "마케팅 모듈 견적", number: "CRM-2026-0605-2", company: "빙그레", contact: "이상무", owner: "박기준", startDate: "2026.05.20", endDate: "2026.07.20", amount: 12000, qty: 2, total: 24000 },
  { id: "3", title: "생산관리 견적", number: "SI-2026-0602-3", company: "세아제강", contact: "정과장", owner: "연경현", startDate: "2026.05.10", endDate: "2026.09.30", amount: 26000, qty: 2, total: 52000 },
  { id: "4", title: "전사 라이선스 견적", number: "CRM-2026-0401-4", company: "현대엘리베이터", contact: "한이사", owner: "석정하", startDate: "2026.03.01", endDate: "2026.05.31", amount: 32000, qty: 3, total: 96000 },
];

export function getQuotation(id: string): Quotation | undefined {
  return quotations.find((q) => q.id === id);
}

// 계약 목록
export const contracts: Contract[] = [
  { id: "1", title: "CRM 구축 계약", company: "한국야금 KORLOY", contact: "황부장", owner: "김도원", contractDate: "2026.06.15", startDate: "2026.06.15", endDate: "2026.12.31", product: "서버 라이선스", productCount: 2, amount: 20000 },
  { id: "2", title: "마케팅 솔루션 계약", company: "빙그레", contact: "이상무", owner: "박기준", contractDate: "2026.06.05", startDate: "2026.06.05", endDate: "2027.06.04", product: "사용자 라이선스", productCount: 1, amount: 24000 },
  { id: "3", title: "생산관리 구축 계약", company: "세아제강", contact: "정과장", owner: "연경현", contractDate: "2026.06.02", startDate: "2026.06.02", endDate: "2026.12.31", product: "서버 라이선스", productCount: 3, amount: 52000 },
  { id: "4", title: "전사 라이선스 계약", company: "현대엘리베이터", contact: "한이사", owner: "석정하", contractDate: "2026.04.01", startDate: "2026.04.01", endDate: "2027.03.31", product: "사용자 라이선스", productCount: 4, amount: 96000 },
];

export function getContract(id: string): Contract | undefined {
  return contracts.find((c) => c.id === id);
}

// 제품 카탈로그 (견적품목 다중선택)
export const products: Product[] = [
  { id: "p1", name: "기본형 클라우드", spec: "USER", packQty: 0, price: 20000 },
  { id: "p2", name: "맞춤형 클라우드", spec: "USER", packQty: 0, price: 40000 },
  { id: "p3", name: "클라우드(산업단지)", spec: "", packQty: 0, price: 40000 },
  { id: "p4", name: "개발비 1DAY", spec: "M/D", packQty: 0, price: 500000 },
  { id: "p5", name: "출장교육비", spec: "SET", packQty: 0, price: 500000 },
  { id: "p6", name: "사용자 라이선스", spec: "USER", packQty: 1, price: 10000 },
  { id: "p7", name: "서버 라이선스", spec: "SET", packQty: 1, price: 10000 },
];

// 핑거세일즈 가입 직원 (담당자 선택 팝업용)
export const employees: Employee[] = [
  { id: "e1", name: "김도원", dept: "영업팀", position: "대리", roles: ["영업담당", "CRM"] },
  { id: "e2", name: "박기준", dept: "개발팀", position: "과장", roles: ["CRM"] },
  { id: "e3", name: "연경현", dept: "기술연구소", position: "차장", roles: ["영업담당"] },
  { id: "e4", name: "오수연", dept: "마케팅팀", position: "사원" },
  { id: "e5", name: "석정하", dept: "클라우드팀", position: "부장", roles: ["영업담당", "CRM"] },
  { id: "e6", name: "정해린", dept: "경영지원팀", position: "대리" },
  { id: "e7", name: "한도윤", dept: "개발팀", position: "선임", roles: ["CRM"] },
  { id: "e8", name: "윤서후", dept: "영업팀", position: "팀장", roles: ["영업담당"] },
];

// 고객사 영업현황 타임라인 목업
export const companySalesEvents: SalesEvent[] = [
  {
    id: "e1",
    kind: "activity",
    date: "0000.00.00",
    lines: ["거래처명 / 고객명 / 부서", "영업활동명", "방문 / 업무협의", "프로젝트 수행(화면설계)"],
  },
  {
    id: "e2",
    kind: "quotation",
    date: "0000.00.00",
    hasAttachment: true,
    lines: ["회사명 / 고객명 / 부서", "견적명", "10,000"],
  },
  {
    id: "e3",
    kind: "proposal",
    date: "0000.00.00",
    hasAttachment: true,
    lines: ["제안명", "거래처명 / 고객명 / 부서", "0000.00.00 ~ 0000.00.00"],
  },
];

export const recentRegistered: RecentItem[] = [
  { id: "r1", kind: "contact", title: "고객명", owner: "담당자", at: "0000.00.00 00:00" },
  { id: "r2", kind: "company", title: "거래처명", owner: "담당자", at: "0000.00.00 00:00" },
  { id: "r3", kind: "prospect", title: "잠재고객명", owner: "담당자", at: "0000.00.00 00:00" },
  { id: "r4", kind: "proceedings", title: "회의록 제목", owner: "담당자", at: "0000.00.00 00:00" },
];

export const recentSearched: RecentItem[] = [
  { id: "s1", kind: "proposal", title: "제안명", owner: "담당자", at: "0000.00.00 00:00" },
];
