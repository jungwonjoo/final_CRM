# FingerSales → Next.js 마이그레이션

FingerSales CRM 정적 퍼블리싱(HTML/jQuery)을 Next.js로 전환하는 프로젝트.

- **원본**: `~/Library/Mobile Documents/com~apple~CloudDocs/포트폴리오/dothome/fingersales/` (HTML 66개, 실제 앱 화면 ~50개)
- **작업 위치**: 이 저장소 (`test_cr`)
- **시작일**: 2026-06-23

---

## 1. 기술 스택

| 항목 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | Next.js 16 (App Router) | `src/` 디렉토리, `@/*` alias |
| 언어/런타임 | TypeScript, React 19 | |
| Node | **v24.17.0 LTS** | `.nvmrc`로 고정 (시스템 기본 v16은 EOL) |
| 스타일 | Tailwind CSS v4 | |
| UI 컴포넌트 | shadcn/ui (Base UI 기반) | `asChild` 대신 `render` prop 사용 |
| 아이콘 | lucide-react | |
| 브랜드 색 | 오렌지 `≈ #ee5a36` | `--primary` / `--brand` 토큰 |

> ⚠️ shadcn 최신 버전은 Radix가 아닌 **Base UI** 기반이라 몇 가지 차이가 있다:
> - 메뉴/드롭다운 항목을 링크로: `<DropdownMenuItem render={<Link/>}>` (`asChild` 아님)
> - `<Button>`을 링크로: `<Button render={<Link/>} nativeButton={false}>` — `nativeButton={false}`를
>   빼면 "expected a native &lt;button&gt;" 경고가 뜬다.

### 원본 → Next.js 전환 매핑
| 원본 | 전환 |
|---|---|
| jQuery DOM 조작 (`js/script.js`) | React 상태 + 컴포넌트 |
| Muuri 포틀릿 (`index.html` 메인) | react-grid-layout (예정) |
| jqWidgets jqxGrid (reports) | TanStack Table + shadcn/ui (예정) |
| Highcharts (status) | highcharts-react-official (예정) |
| jQuery UI datepicker | shadcn date-picker (예정) |
| CSS 7종 | Tailwind 토큰 |

---

## 2. 화면 인벤토리

네이밍 규칙: **`xxx010` = 목록, `xxx011` = 상세/등록 폼**

- **Sales (16 도메인)**: activity·opportunity·company·contact·prospect·support·notice·sales_report·product_manage·proposal·quotation·contract·order·todo·chatter·proceedings·report_view
- **Status (Highcharts 분석 9)**: main·activity_analysis·opportunity_analysis·contract_analysis·forecasting_analysis·mbo_analysis·contact·support
- **Reports (jqxGrid 6)**: company_manage·contact_manage·opportunity_manage·prospect_manage·employee_activity_view·weeklyindicators
- **공통**: index(메인 대시보드)·login·my_info·manual / admin

---

## 3. 완료된 작업 (2026-06-23)

### ✅ 프로젝트 셋업
- create-next-app (TS / Tailwind / ESLint / App Router / src / `@/*`)
- `.nvmrc` → 24, Node 24.17.0로 의존성 설치
- shadcn/ui init + 컴포넌트 추가: button, card, input, select, dialog, badge, progress, separator, label, textarea, dropdown-menu
- 브랜드 오렌지 테마 토큰 (`src/app/globals.css`)
- 루트 레이아웃 한국어/메타/폰트 정리

### ✅ 고객사 화면 (`/company`) — 새 디자인 목업 기준
원본을 그대로 베끼지 않고 **사용자 제공 새 목업**(모던/라운드/오렌지 액센트)을 따름.
- 상단 헤더: 로고, Sales 서비스 드롭다운 pill, 아이콘 바, 사용자 영역
- 탭 내비게이션: 활성 탭 오렌지 언더라인, 영업관리/영업도구 `+` 드롭다운
- 좌측 검색조건 패널 / 중앙 고객사 카드 / 우측 최근등록·최근검색
- **검색조건 패널: 데스크탑은 항상 펼침, `lg` 미만에서는 헤더 탭으로 접기/펼치기(토글)**
- 데스크탑 3컬럼 ↔ 모바일 단일 컬럼 반응형
- **우측 최근등록/검색 패널: 데스크탑은 인라인, `lg` 미만에서는 우하단 플로팅 버튼 → 팝오버**
  (`recent-section.tsx`가 `RecentPanel`을 감싸 분기. 팝오버는 PC와 동일한 270px 카드 묶음을 그대로 띄움)
- `next build` 통과 + dev 렌더링 스크린샷 검증 완료

### ✅ 고객사 상세 (`/company/[id]`)
- 기본정보 폼: 고객사*/구분/등급/진행상태/매출(년)/사원수/사업자번호/유선·팩스/웹사이트/
  주소(+주소검색·상세주소)/담당자/대표자명/목표매출액/제품유형/사용시작일/비고
  — 라벨+필드 2컬럼 반응형 그리드
- 상단 액션: 저장(submit) / 삭제 / 목록(← /company)
- 하단: 의견 · 메모 · 연결 고객(3) 섹션
  - 의견/메모는 `FeedbackSection`(클라이언트): textarea + 등록 버튼으로 추가, 항목별 ✕ 삭제,
    추가 시 현재 시각 자동 기록 (⌘/Ctrl+Enter 등록). 디자인은 기존 카드 그대로, 입력칸만 추가.
  - ⚠️ 아이콘은 문자열 키(`icon="message"|"note"`)로 전달 — 서버→클라이언트로 컴포넌트(함수)를
    직접 넘기면 "Only plain objects can be passed to Client Components" 에러.
- 목록 카드 클릭 → 상세로 이동 (`CompanyCard`를 `<Link>`로)

### ✅ 메인 대시보드 (`/dashboard`) — react-grid-layout 포틀릿
- `react-grid-layout` 1.5.3 사용 (드래그 이동 / 리사이즈 / 삭제 / 추가 / localStorage 저장)
- 포틀릿 9종: 목표달성현황·신규영업활동·견적주문·당월영업실적·실적차트·영업공지·일정정보·고객·고객사
- **편집 모드**: "포틀릿 수정하기" 버튼을 눌러야만 이동/리사이즈/삭제 표시(그립·X·핸들·테두리)가 나타남.
  편집 시 툴바에 "포틀릿 추가"(숨긴 포틀릿 복원)·"초기화"(기본 배치)·"완료" 노출. "완료"로 모두 잠금.
  → `isDraggable/isResizable={editing}`, 그립·X·핸들은 `editing` 조건부 렌더.
- 리사이즈 핸들 3곳: 아래(높이)·오른쪽(너비)·우하단(둘 다) — `resizeHandles={["s","e","se"]}`
- 레이아웃·표시목록은 `localStorage("fs-dashboard-v4")`에 저장 → 새로고침해도 유지
- 좌/우 두 컬럼 누적 높이를 비슷하게 기본 배치 (RGL은 세로 압축이라 컬럼 높이가 다르면 짧은 쪽 아래가 빔)
- 포틀릿 정의는 `portlets.tsx`의 `PORTLETS` 레지스트리에 모음 (id/title/기본 layout/콘텐츠)
- `/`·로고·Sales 드롭다운 → `/dashboard`로 연결
- ⚠️ **비반응형 `GridLayout`(단일 layout 배열) 사용** — `Responsive`의 멀티 브레이크포인트 `layouts`
  객체는 `onLayoutChange`가 빈/축소된 값을 저장해 `w:1,h:1`로 깨지는 문제가 있었음.
  load/save 시 유효성 검사(빈 배열·w<1 거르기)도 추가.
- ⚠️ RGL 1.5.x는 React 19에서 `defaultProps` deprecation 경고(콘솔 "Issues")를 내지만 동작/빌드 영향 없음.
  SSR 불일치 방지를 위해 `mounted` 후에만 그리드 렌더 + CSS는 컴포넌트에서 import.
- ⚠️ RGL 자식 `<div>`에는 반드시 `key={id}`(layout의 `i`와 일치) — 빠지면 그리드가 렌더되지 않음.

### 생성 파일
```
src/
├─ app/
│  ├─ layout.tsx                 # ko, 폰트/메타
│  ├─ page.tsx                   # → /dashboard 리다이렉트
│  └─ (sales)/
│     ├─ layout.tsx              # 헤더+푸터 셸
│     ├─ dashboard/page.tsx      # 메인 대시보드(포틀릿)
│     └─ company/
│        ├─ page.tsx             # 고객사 목록
│        └─ [id]/page.tsx        # 고객사 상세
├─ components/
│  ├─ layout/site-header.tsx     # 상단 헤더 + 탭 내비
│  ├─ layout/recent-panel.tsx    # 우측 최근등록/검색(내용)
│  ├─ layout/recent-section.tsx  # 데스크탑 인라인 / 모바일 팝오버 분기
│  └─ company/
│     ├─ company-search.tsx      # 좌측 검색조건(+필터/정렬, 모바일 토글)
│     ├─ company-card.tsx        # 고객사 카드(→ 상세 링크)
│     └─ company-form.tsx        # 상세 폼
└─ lib/
   ├─ types.ts                   # 도메인 타입
   ├─ mock-data.ts               # 더미 데이터 + getCompany()
   └─ nav.ts                     # 16개 도메인 메뉴 구조
.claude/launch.json              # next-dev (nvm 24 경유)
```

---

## 4. 다음 작업 (TODO)

- [ ] 고객사 상세/등록 폼 (`company011` → `/company/[id]`)
- [ ] 검색·필터 실제 동작(상태 관리) 연결
- [ ] 나머지 Sales 도메인 목록을 동일 패턴으로 확장 (타입 → 목업 → 카드/검색 → 페이지)
- [ ] 메인 대시보드(index) — react-grid-layout 포틀릿
- [ ] Reports — TanStack Table 그리드
- [ ] Status — Highcharts 분석 대시보드

## 개발 실행
```bash
nvm use            # .nvmrc → Node 24
npm run dev        # http://localhost:3000  (→ /company 리다이렉트)
npm run build
```
