// 상단 내비게이션 구조 (원본 헤더 메뉴 기준)

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href?: string; // 단일 링크
  children?: NavChild[]; // 드롭다운
}

export const mainNav: NavItem[] = [
  { label: "영업활동", href: "/activity" },
  { label: "영업기회", href: "/opportunity" },
  { label: "고객사", href: "/company" },
  { label: "고객", href: "/contact" },
  {
    label: "영업관리",
    children: [
      { label: "제안", href: "/proposal" },
      { label: "견적", href: "/quotation" },
      { label: "계약", href: "/contract" },
      { label: "매출", href: "/order" },
      { label: "할일", href: "/todo" },
      { label: "고객지원", href: "/support" },
      { label: "잠재고객", href: "/prospect" },
    ],
  },
  {
    label: "영업도구",
    children: [
      { label: "채터", href: "/chatter" },
      { label: "영업보고", href: "/sales-report" },
      { label: "영업공지", href: "/notice" },
      { label: "회의록", href: "/proceedings" },
      { label: "영업보고현황", href: "/report-view" },
    ],
  },
];

/** 서비스 전환 드롭다운 (Sales / Status / Reports) */
export const serviceNav: NavChild[] = [
  { label: "Sales", href: "/dashboard" },
  { label: "Status", href: "/status" },
  { label: "Reports", href: "/reports" },
];
