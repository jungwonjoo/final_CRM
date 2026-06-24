import Link from "next/link";
import { User, CalendarDays, Layers, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/lib/types";

const STAGES = ["인지", "제안", "협상", "계약"];
// 파이프라인 단계별 색 (인지 → 계약)
const STAGE_COLORS = ["#dc964e", "#ffb152", "#f77803", "#e84f04"];

const fmt = (n: number) => n.toLocaleString("ko-KR");

export function OpportunityCard({ opp }: { opp: Opportunity }) {
  const probability = opp.stage * 25;
  const done = opp.stage >= 4;

  return (
    <article className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="flex items-center gap-1.5 font-semibold">
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-xs font-medium",
              done ? "bg-muted text-muted-foreground" : "bg-brand/10 text-brand"
            )}
          >
            {done ? "완료" : "진행중"}
          </span>
          <Link href={`/opportunity/${opp.id}`} className="hover:underline">
            {opp.title}
          </Link>
        </h3>
        <button
          type="button"
          title="더보기"
          className="-mr-1 flex size-7 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <MoreVertical className="size-4" />
        </button>
      </div>

      {/* 단계 + 성공확률 */}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex flex-1 gap-1">
          {STAGES.map((label, i) => (
            <span
              key={label}
              className={cn(
                "flex-1 rounded-md py-1 text-center text-xs font-medium",
                i < opp.stage ? "text-white" : "bg-muted text-muted-foreground"
              )}
              style={i < opp.stage ? { backgroundColor: STAGE_COLORS[i] } : undefined}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="shrink-0 text-xs text-muted-foreground">성공확률</span>
          <div
            className="relative h-5 w-40 overflow-hidden rounded-md bg-muted"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, rgba(0,0,0,0.05) 0 4px, rgba(0,0,0,0.1) 4px 8px)",
            }}
          >
            <div
              className="h-full"
              style={{ width: `${probability}%`, backgroundColor: "#f09246" }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
              {probability}%
            </span>
          </div>
        </div>
      </div>

      {/* 메타 */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <User className="size-3.5" />
          {opp.company} {opp.contact}
        </span>
        <span className="text-border">|</span>
        <span className="font-medium text-foreground">{fmt(opp.amount)}</span>
        <span className="text-border">|</span>
        <span className="flex items-center gap-1">
          <CalendarDays className="size-3.5" />
          {opp.startDate} ~ {opp.endDate}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
        <Layers className="size-3.5 shrink-0" />
        {opp.products.join(", ")}
      </div>
    </article>
  );
}
