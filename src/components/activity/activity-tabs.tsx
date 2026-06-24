"use client";

import { useState } from "react";
import {
  CalendarDays,
  List,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityItem, ActivityType } from "@/lib/types";

const TYPE_STYLE: Record<ActivityType, string> = {
  방문: "bg-blue-50 text-blue-600",
  전화: "bg-emerald-50 text-emerald-600",
  업무협의: "bg-amber-50 text-amber-700",
  메일: "bg-violet-50 text-violet-600",
  교육: "bg-teal-50 text-teal-600",
};

// 상세 패널의 색상 마커 (솔리드)
const TYPE_SQUARE: Record<ActivityType, string> = {
  방문: "bg-blue-500",
  전화: "bg-emerald-500",
  업무협의: "bg-amber-500",
  메일: "bg-violet-500",
  교육: "bg-teal-500",
};

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];
// 2026년 6월 (1일 = 월요일)
const WEEKS: (number | null)[][] = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, null, null, null, null, null],
];
const day = (d: string) => Number(d.slice(8, 10)); // "2026.06.08" → 8

type Tab = "calendar" | "list" | "dept";

const TABS: { key: Tab; label: string; icon: typeof List }[] = [
  { key: "calendar", label: "캘린더", icon: CalendarDays },
  { key: "list", label: "목록", icon: List },
  { key: "dept", label: "부서캘린더", icon: CalendarCheck },
];

function Chip({ a }: { a: ActivityItem }) {
  return (
    <span
      className={cn(
        "block truncate rounded px-1 py-0.5 text-[11px] leading-tight",
        TYPE_STYLE[a.type]
      )}
    >
      {a.title}
    </span>
  );
}

/* ---------- 캘린더 (월) ---------- */
function CalendarView({ items }: { items: ActivityItem[] }) {
  const byDay = (d: number) => items.filter((a) => day(a.date) === d);
  const firstDay = items.length ? day(items[0].date) : 1;
  const [selected, setSelected] = useState<number>(firstDay);
  const selActs = byDay(selected);

  return (
    <div>
      <div className="mb-3 flex items-center justify-center gap-4">
        <button type="button" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-bold">6 월 2026</span>
        <button type="button" className="text-muted-foreground hover:text-foreground">
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 border-l border-t text-xs">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="border-r border-b bg-muted/40 py-1.5 text-center font-medium text-muted-foreground"
          >
            {w}
          </div>
        ))}
        {WEEKS.flat().map((d, i) => {
          const acts = d ? byDay(d) : [];
          return (
            <button
              key={i}
              type="button"
              disabled={!d}
              onClick={() => d && setSelected(d)}
              className={cn(
                "min-h-20 border-r border-b p-1 text-left align-top transition-colors",
                d && "hover:bg-muted/50",
                d === selected && "bg-brand/5 ring-1 ring-inset ring-brand/40"
              )}
            >
              {d && (
                <>
                  <div
                    className={cn(
                      "mb-0.5 text-right text-xs",
                      d === selected ? "font-bold text-brand" : "text-muted-foreground"
                    )}
                  >
                    {d}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {acts.slice(0, 2).map((a) => (
                      <Chip key={a.id} a={a} />
                    ))}
                    {acts.length > 2 && (
                      <span className="px-1 text-[11px] text-muted-foreground">
                        +{acts.length - 2}건
                      </span>
                    )}
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* 선택한 요일 상세 */}
      <div className="mt-4 border-t pt-3">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-bold">
            2026.06.{String(selected).padStart(2, "0")}
          </h4>
          <div className="flex items-center gap-1.5">
            <span
              title="Google 캘린더 연동"
              className="flex size-6 items-center justify-center rounded border text-[11px] font-bold text-muted-foreground"
            >
              G
            </span>
            <span
              title="지도"
              className="flex size-6 items-center justify-center rounded border text-muted-foreground"
            >
              <MapPin className="size-3.5" />
            </span>
          </div>
        </div>
        {selActs.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            등록된 활동이 없습니다
          </p>
        ) : (
          <ul className="flex flex-col divide-y">
            {selActs.map((a) => (
              <li key={a.id} className="flex gap-2.5 py-2.5">
                <span
                  className={cn(
                    "mt-0.5 size-3.5 shrink-0 rounded-sm",
                    TYPE_SQUARE[a.type]
                  )}
                />
                <div className="min-w-0 text-sm">
                  <p className="font-medium">
                    {a.time} · {a.type} / {a.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.company} / {a.contact} · {a.owner}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------- 목록 ---------- */
function ListView({ items }: { items: ActivityItem[] }) {
  return (
    <ul className="flex flex-col divide-y">
      {items.map((a) => (
        <li key={a.id} className="flex items-center gap-3 py-2.5">
          <span className="flex w-24 shrink-0 flex-col text-xs text-muted-foreground">
            <span>{a.date.slice(5)}</span>
            <span>{a.time}</span>
          </span>
          <span
            className={cn(
              "shrink-0 rounded px-1.5 py-0.5 text-xs font-medium",
              TYPE_STYLE[a.type]
            )}
          >
            {a.type}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{a.title}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {a.company} / {a.contact}
            </span>
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {a.owner} · {a.dept}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- 부서캘린더 (담당자 × 주간) ---------- */
const WEEK_DAYS = [8, 9, 10, 11, 12, 13, 14]; // 6/8(월) ~ 6/14(일)

function DeptView({ items }: { items: ActivityItem[] }) {
  const people = [...new Set(items.map((a) => a.owner))].map((name) => {
    const dept = items.find((a) => a.owner === name)?.dept ?? "";
    return { name, dept };
  });
  const cell = (owner: string, d: number) =>
    items.filter((a) => a.owner === owner && day(a.date) === d);

  return (
    <div className="overflow-x-auto">
      <div className="mb-2 text-sm font-bold">6/8 ~ 6/14 주간</div>
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="w-28 border bg-muted/40 px-2 py-1.5 text-left font-medium text-muted-foreground">
              담당자
            </th>
            {WEEK_DAYS.map((d, i) => (
              <th
                key={d}
                className="border bg-muted/40 px-1 py-1.5 text-center font-medium text-muted-foreground"
              >
                {d}
                <span className="ml-0.5 text-[10px]">({WEEKDAYS[i]})</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {people.map((p) => (
            <tr key={p.name}>
              <td className="border px-2 py-1.5 align-top">
                <span className="block font-medium">{p.name}</span>
                <span className="block text-[11px] text-muted-foreground">{p.dept}</span>
              </td>
              {WEEK_DAYS.map((d) => (
                <td key={d} className="border p-1 align-top">
                  <div className="flex flex-col gap-0.5">
                    {cell(p.name, d).map((a) => (
                      <Chip key={a.id} a={a} />
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ActivityTabs({ items }: { items: ActivityItem[] }) {
  const [tab, setTab] = useState<Tab>("calendar");

  return (
    <section className="flex flex-col">
      {/* 탭 */}
      <div className="mb-3 flex items-center gap-1 border-b">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              tab === key
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
        <span className="ml-auto self-center text-sm text-muted-foreground">
          ( 총 {items.length} 건 )
        </span>
      </div>

      <div className="min-h-[520px] rounded-xl border bg-card p-4">
        {tab === "calendar" && <CalendarView items={items} />}
        {tab === "list" && <ListView items={items} />}
        {tab === "dept" && <DeptView items={items} />}
      </div>
    </section>
  );
}
