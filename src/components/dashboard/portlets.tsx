"use client";

import { useState, type ReactNode } from "react";
import {
  Video,
  FileText,
  GraduationCap,
  Phone,
  Users,
  User,
  Building2,
  Briefcase,
  ArrowUp,
  ArrowDown,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Plus,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- 공통 작은 조각들 ---------- */

/* 목록형 포틀릿 공통 테이블 (제목/등록일 스타일) */
interface ListRow {
  tag?: string;
  title: string;
  meta: string;
}

function ListTable({ cols, rows }: { cols: [string, string]; rows: ListRow[] }) {
  return (
    <div className="flex flex-col text-sm">
      <div className="flex items-center justify-between border-b pb-2 text-xs font-medium text-muted-foreground">
        <span className="flex-1 text-center">{cols[0]}</span>
        <span className="shrink-0">{cols[1]}</span>
      </div>
      <ul className="flex flex-col divide-y">
        {rows.map((r, i) => (
          <li key={i} className="flex items-center gap-2 py-3">
            <span className="flex min-w-0 flex-1 items-center gap-1.5">
              {r.tag && (
                <span className="shrink-0 font-bold text-destructive">[{r.tag}]</span>
              )}
              <span className="truncate">{r.title}</span>
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">{r.meta}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- 1. 목표달성현황 ---------- */
function GoalPortlet() {
  const periods = ["7월", "3/4분기", "2021년"];
  return (
    <div className="@container">
    <div className="grid grid-cols-1 gap-3 @lg:grid-cols-3">
      {periods.map((p) => (
        <div key={p} className="rounded-lg border p-3">
          <div className="mb-2 text-center">
            <span className="inline-block rounded-full border border-brand px-3 py-0.5 text-xs font-medium text-brand">
              {p}
            </span>
          </div>
          <dl className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">목표</dt>
              <dd className="font-bold text-brand">0.0</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">실적</dt>
              <dd className="font-semibold">0.0</dd>
            </div>
            <div className="flex items-center justify-between rounded bg-orange-50 px-1.5 py-1">
              <dt className="text-muted-foreground">달성(%)</dt>
              <dd className="font-semibold">0.0</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
    </div>
  );
}

/* ---------- 2. 신규영업활동 ---------- */
function NewBizPortlet() {
  const stats = [
    { label: "잠재고객", value: "158", icon: Users, trend: "4.87%", up: true },
    { label: "고객", value: "304,500", icon: User, trend: "2.7%", up: false },
    { label: "고객사", value: "147,987", icon: Building2, trend: "8.2%", up: true },
    { label: "영업기회", value: "284", icon: Briefcase, trend: "4.7%", up: false },
  ];
  return (
    <div className="@container h-full">
    <div className="grid h-full grid-cols-2 gap-3 @2xl:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="flex flex-col justify-center rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-400">
                <Icon className="size-4" />
              </span>
            </div>
            <span className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{s.value}</span>
            <span
              className={cn(
                "mt-2 flex items-center justify-end gap-0.5 text-xs font-semibold",
                s.up ? "text-emerald-500" : "text-red-500"
              )}
            >
              {s.up ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
              {s.trend}
            </span>
          </div>
        );
      })}
    </div>
    </div>
  );
}

/* ---------- 4. 당월 영업실적 (지난달 vs 이번달 비교) ---------- */
const MONTH_PERF = [
  { title: "영업기회", prev: 158, cur: 198, strong: "bg-red-400", soft: "bg-red-200" },
  { title: "견적", prev: 450000, cur: 985417, strong: "bg-amber-400", soft: "bg-amber-200" },
  { title: "계약현황", prev: 102, cur: 207, strong: "bg-orange-400", soft: "bg-orange-200" },
  { title: "실적현황", prev: 8947215, cur: 10647694, strong: "bg-rose-400", soft: "bg-rose-200" },
];

function MonthPerfPortlet() {
  return (
    <div className="grid h-full grid-cols-2 gap-3">
      {MONTH_PERF.map((m) => {
        const max = Math.max(m.prev, m.cur, 1);
        const prevH = Math.max(Math.round((m.prev / max) * 100), 6);
        const curH = Math.max(Math.round((m.cur / max) * 100), 6);
        const curBigger = m.cur >= m.prev;
        return (
          <div
            key={m.title}
            className="flex h-full flex-col rounded-xl border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">{m.title}</span>
              <button
                type="button"
                aria-label="더보기"
                className="text-muted-foreground transition-colors hover:text-brand"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <div className="flex flex-1 items-end justify-center gap-4 py-3">
              <div
                className={cn("w-7 rounded-t", m.soft)}
                style={{ height: `${prevH}%` }}
              />
              <div
                className={cn("w-7 rounded-t", curBigger ? m.strong : m.soft)}
                style={{ height: `${curH}%` }}
              />
            </div>
            <div className="flex items-end justify-between text-xs">
              <div>
                <p className="text-muted-foreground">지난 달</p>
                <p className="mt-0.5 font-bold">{m.prev.toLocaleString("ko-KR")} 건</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">이번 달</p>
                <p className="mt-0.5 font-bold">{m.cur.toLocaleString("ko-KR")} 건</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- 6. 영업공지 ---------- */
function NoticePortlet() {
  return (
    <ListTable
      cols={["제목", "등록일"]}
      rows={[
        { tag: "필독", title: "핑거세일즈 2021.01.21 업데이트 내역", meta: "26.06.08" },
        { tag: "필독", title: "FingerSales Cloud 추가 기능 공지", meta: "26.06.08" },
        { title: "핑거세일즈 0000.00.00 업데이트 내역", meta: "26.06.08" },
        { title: "핑거세일즈 2021.02.04 업데이트 내역", meta: "26.06.08" },
      ]}
    />
  );
}

/* ---------- 7. 일정정보 ---------- */
function SchedulePortlet() {
  const items = [
    ["08:00 ~ 09:00", "새마을금고중앙회 / 김과장", "방문"],
    ["09:00 ~ 10:00", "코비젼 / 김혜든", "방문"],
    ["10:00 ~ 11:00", "새마을금고중앙회 / 김과장", "방문"],
    ["11:00 ~ 12:00", "새마을금고중앙회 / 김과장", "방문"],
  ];
  return (
    <div className="flex flex-col text-sm">
      <div className="flex items-center justify-between border-b pb-2 text-xs font-medium text-muted-foreground">
        <span>시간</span>
        <span>구분</span>
      </div>
      <ul className="flex flex-col divide-y">
        {items.map(([time, title, type], i) => (
          <li key={i} className="flex items-center gap-2 py-3">
            <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
            <span className="h-4 w-0.5 shrink-0 rounded bg-brand" />
            <span className="flex-1 truncate">{title}</span>
            <span className="shrink-0 text-xs text-muted-foreground">{type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- 8. 고객 ---------- */
function CustomersPortlet() {
  return (
    <ListTable
      cols={["고객", "등록일"]}
      rows={[
        { title: "김해든 / 코비젼", meta: "0000.00.00" },
        { title: "주은지 / 엑스론코리아", meta: "2021.07.02" },
        { title: "신제요 / 거래처명", meta: "2021.06.20" },
        { title: "이혜민 / 한국미디어마케팅그룹", meta: "2021.06.01" },
      ]}
    />
  );
}

/* ---------- 9. 고객사 ---------- */
function CompaniesPortlet() {
  return (
    <ListTable
      cols={["고객사", "등록일"]}
      rows={[
        { title: "코비젼", meta: "0000.00.00" },
        { title: "엑스론코리아", meta: "2021.07.02" },
        { title: "거래처명", meta: "2021.06.20" },
        { title: "한국미디어마케팅그룹", meta: "2021.06.01" },
      ]}
    />
  );
}

/* ---------- 10. 최근활동 ---------- */
const ACTIVITY_STYLES = {
  meeting: { icon: Video, color: "text-red-500", bg: "bg-red-50" },
  minutes: { icon: FileText, color: "text-amber-500", bg: "bg-amber-50" },
  education: { icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50" },
  call: { icon: Phone, color: "text-emerald-500", bg: "bg-emerald-50" },
} as const;

type ActivityType = keyof typeof ACTIVITY_STYLES;

interface Activity {
  type: ActivityType;
  title: string;
  who: string;
  at: string;
}

function RecentActivityPortlet() {
  const items: Activity[] = [
    { type: "meeting", title: "오버뷰 영상 제작 사전 미팅", who: "석정하", at: "2026.06.08 16:35" },
    { type: "minutes", title: "한국투자신탁운용 마케팅 이력관리 시스템 구축 회의록", who: "박기준", at: "2026.06.08 16:35" },
    { type: "education", title: "동영상 교육 이수자 전달교육 진행", who: "연경현", at: "2026.06.08 15:10" },
    { type: "meeting", title: "오버뷰 영상 제작 사전 미팅", who: "석정하", at: "2026.06.08 16:35" },
    { type: "call", title: "현대엘리베이터 담당자 전화 상담", who: "오수연", at: "2026.06.08 14:20" },
    { type: "minutes", title: "한국투자신탁운용 마케팅 이력관리 시스템 구축 회의록", who: "박기준", at: "2026.06.08 16:35" },
  ];
  return (
    <ul className="flex flex-col">
      {items.map((a, i) => {
        const s = ACTIVITY_STYLES[a.type];
        const Icon = s.icon;
        const last = i === items.length - 1;
        return (
          <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
            {!last && (
              <span
                aria-hidden
                className="absolute bottom-0 left-4 top-8 w-px -translate-x-1/2 bg-border"
              />
            )}
            <span
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                s.bg,
                s.color
              )}
            >
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{a.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {a.who} ({a.at})
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- 11. 영업활동 (달력 + 일정) ---------- */
function SalesActivityPortlet() {
  // 2026년 6월 (1일=월요일), 월요일 시작
  const weeks: (number | null)[][] = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
    [29, 30, null, null, null, null, null],
  ];
  const selected = 8;
  const soft = 4;
  const acts = [
    { time: "7:30 AM - 10:00 AM", title: "한국야구 DB팀 미팅" },
    { time: "10:30 AM - 11:00 AM", title: "매뉴얼페이지 디자인 검토" },
    { time: "12:15 PM - 02:00 PM", title: "Github 리포지토리 설정" },
    { time: "5:30 PM - 07:00 PM", title: "디자인 스튜디오 오버영상 미팅" },
  ];
  return (
    <div className="@container h-full">
      <div className="flex h-full flex-col gap-4 @lg:flex-row">
        {/* 달력 */}
      <div className="w-full shrink-0 @lg:max-w-xs">
        <div className="mb-3 flex items-center justify-between rounded-lg bg-red-50/70 px-3 py-2">
          <button
            type="button"
            aria-label="이전 달"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronsLeft className="size-4" />
          </button>
          <span className="text-sm font-bold">6 월 2026</span>
          <button
            type="button"
            aria-label="다음 달"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronsRight className="size-4" />
          </button>
        </div>
        <table className="w-full text-center text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              {["월", "화", "수", "목", "금", "토", "일"].map((d) => (
                <th key={d} className="py-1 font-medium">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((w, i) => (
              <tr key={i}>
                {w.map((d, j) => (
                  <td key={j} className="py-1">
                    {d && (
                      <span
                        className={cn(
                          "mx-auto flex size-7 items-center justify-center rounded-full",
                          d === selected && "bg-red-400 font-semibold text-white",
                          d === soft && "bg-muted"
                        )}
                      >
                        {d}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 선택일 일정 */}
      <ul className="flex flex-1 flex-col gap-3 border-t pt-4 @lg:border-t-0 @lg:border-l @lg:pt-0 @lg:pl-4">
        {acts.map((a, i) => (
          <li key={i} className="flex flex-col">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              {a.time}
            </span>
            <span className="mt-0.5 text-sm font-semibold">{a.title}</span>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

/* ---------- 12. 근무현황 ---------- */
type WorkStatus = "외근" | "휴가" | "출장";

const WORK_STATUS_STYLES: Record<WorkStatus, string> = {
  외근: "bg-red-50 text-red-500",
  휴가: "bg-amber-50 text-amber-600",
  출장: "bg-emerald-50 text-emerald-600",
};

function WorkStatusPortlet() {
  const items: { name: string; sub: string; status: WorkStatus; date: string }[] = [
    { name: "오수연", sub: "한국야구 [09:00 - 18:00]", status: "외근", date: "26.06.08" },
    { name: "박기준", sub: "연차휴가 (3/1)", status: "휴가", date: "26.06.08" },
    { name: "연경현", sub: "현대엘리베이터", status: "출장", date: "26.06.08" },
    { name: "박지혜", sub: "여기어때 [13:00 ~ 18:00]", status: "외근", date: "26.06.08" },
    { name: "김지원", sub: "인베니아 [09:00 - 18:00]", status: "외근", date: "26.06.08" },
  ];
  return (
    <ul className="flex flex-col divide-y">
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-3 py-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {it.name[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{it.name}</p>
            <p className="truncate text-xs text-muted-foreground">{it.sub}</p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold",
              WORK_STATUS_STYLES[it.status]
            )}
          >
            {it.status}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">{it.date}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- 13. TODO (사용자별, 요일 탭) ---------- */
const TODO_DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;
type TodoDay = (typeof TODO_DAYS)[number];
interface TodoItem {
  text: string;
  done: boolean;
}

const TODO_SEED: Record<TodoDay, TodoItem[]> = {
  월: [
    { text: "협업 대상 제품 소개 및 질의 응답", done: true },
    { text: "비대면바투처 수요기업 보집안내", done: false },
    { text: "하드웨어 상세구성, 인터페이스 항목", done: true },
    { text: "마케팅 협업 2차 분석", done: true },
    { text: "협업 추가 요구사항 리스트 검토", done: false },
    { text: "동영상 교육 이수자의 전달교육", done: false },
    { text: "동영상 교육 이수자의 전달교육", done: false },
    { text: "동영상 교육 이수자의 전달교육", done: false },
  ],
  화: [
    { text: "주간 영업 보고서 작성", done: false },
    { text: "신규 리드 전화 컨택", done: true },
  ],
  수: [{ text: "고객사 정기 미팅 준비", done: false }],
  목: [],
  금: [{ text: "견적서 검토 및 발송", done: false }],
  토: [],
  일: [],
};

function TodoPortlet() {
  const [day, setDay] = useState<TodoDay>("월");
  const [todos, setTodos] = useState<Record<TodoDay, TodoItem[]>>(TODO_SEED);
  const [input, setInput] = useState("");

  const list = todos[day];

  const toggle = (idx: number) =>
    setTodos((prev) => ({
      ...prev,
      [day]: prev[day].map((t, i) => (i === idx ? { ...t, done: !t.done } : t)),
    }));

  const add = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => ({ ...prev, [day]: [...prev[day], { text, done: false }] }));
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      {/* 요일 탭 */}
      <div className="mb-3 flex gap-1">
        {TODO_DAYS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDay(d)}
            className={cn(
              "flex-1 rounded-md py-1 text-xs font-medium transition-colors",
              d === day ? "bg-brand text-white" : "text-muted-foreground hover:bg-muted"
            )}
          >
            {d}
          </button>
        ))}
      </div>

      {/* 목록 */}
      <ul className="flex flex-1 flex-col gap-2 overflow-auto">
        {list.length === 0 ? (
          <li className="py-8 text-center text-sm text-muted-foreground">
            할 일이 없습니다
          </li>
        ) : (
          list.map((t, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                className="flex w-full items-center gap-2 text-left"
              >
                {t.done ? (
                  <Check className="size-4 shrink-0 text-red-500" />
                ) : (
                  <span className="size-4 shrink-0 rounded-[4px] border border-input" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    t.done && "text-red-500 line-through"
                  )}
                >
                  {t.text}
                </span>
              </button>
            </li>
          ))
        )}
      </ul>

      {/* 추가 입력 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일 입력"
          className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand/90"
        >
          추가
        </button>
      </form>
    </div>
  );
}

/* ---------- 포틀릿 레지스트리 ---------- */
export interface PortletDef {
  id: string;
  title: string;
  unit?: string;
  /** true면 헤더·바깥 박스 없이 내용만 그리드에 노출 (편집 모드에서는 이동/삭제용 헤더가 잠시 보임) */
  bare?: boolean;
  defaultLayout: { x: number; y: number; w: number; h: number; minW?: number; minH?: number };
  render: () => ReactNode;
}

// 그리드: 12칸, rowHeight 30px 기준.
// 최상단은 신규영업활동 KPI 밴드(풀폭 12칸 한 줄), 그 아래로 좌(x:0)·우(x:6) 두 컬럼.
// 두 컬럼의 누적 높이를 거의 같게 배치 → 한쪽만 비는 현상 최소화.
// (RGL은 세로 압축 방식이라 컬럼 높이가 다르면 짧은 쪽 아래에 빈 공간이 생김)
export const PORTLETS: PortletDef[] = [
  // 상단 밴드 (풀폭, 헤더·박스 없음)
  { id: "newbiz", title: "신규영업활동", bare: true, defaultLayout: { x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 4 }, render: NewBizPortlet },
  // 좌측 컬럼 (y:4 부터, 합계 39행)
  { id: "salesAct", title: "영업활동", defaultLayout: { x: 0, y: 4, w: 6, h: 10, minW: 4, minH: 7 }, render: SalesActivityPortlet },
  { id: "monthPerf", title: "당월 영업 실적", bare: true, defaultLayout: { x: 0, y: 14, w: 6, h: 9, minW: 4, minH: 7 }, render: MonthPerfPortlet },
  { id: "schedule", title: "일정정보", defaultLayout: { x: 0, y: 23, w: 6, h: 6, minW: 4, minH: 4 }, render: SchedulePortlet },
  { id: "customers", title: "고객", defaultLayout: { x: 0, y: 29, w: 6, h: 7, minW: 3, minH: 4 }, render: CustomersPortlet },
  { id: "companies", title: "고객사", defaultLayout: { x: 0, y: 36, w: 6, h: 7, minW: 3, minH: 4 }, render: CompaniesPortlet },
  // 우측 컬럼 (y:4 부터, 합계 38행)
  { id: "goal", title: "목표달성현황", unit: "단위 : 만원", defaultLayout: { x: 6, y: 4, w: 6, h: 7, minW: 4, minH: 5 }, render: GoalPortlet },
  { id: "recent", title: "최근활동", defaultLayout: { x: 6, y: 11, w: 6, h: 8, minW: 4, minH: 5 }, render: RecentActivityPortlet },
  { id: "notice", title: "영업 공지", defaultLayout: { x: 6, y: 19, w: 6, h: 6, minW: 4, minH: 4 }, render: NoticePortlet },
  { id: "todo", title: "TODO", defaultLayout: { x: 6, y: 25, w: 6, h: 9, minW: 4, minH: 7 }, render: TodoPortlet },
  { id: "workStatus", title: "근무현황", defaultLayout: { x: 6, y: 34, w: 6, h: 8, minW: 4, minH: 5 }, render: WorkStatusPortlet },
];
