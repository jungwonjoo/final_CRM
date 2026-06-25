"use client";

import { useMemo, useState } from "react";
import {
  StickyNote,
  Calculator,
  Mic,
  Briefcase,
  PenLine,
  Coins,
  LifeBuoy,
  Paperclip,
  ArrowDownUp,
  type LucideIcon,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { SalesEvent, SalesEventKind } from "@/lib/types";

const kindConfig: Record<
  SalesEventKind,
  { label: string; icon: LucideIcon; ring: string; text: string }
> = {
  activity: { label: "영업활동", icon: StickyNote, ring: "border-rose-300", text: "text-rose-500" },
  quotation: { label: "견적", icon: Calculator, ring: "border-sky-300", text: "text-sky-500" },
  proposal: { label: "제안", icon: Mic, ring: "border-violet-300", text: "text-violet-500" },
  opportunity: { label: "영업기회", icon: Briefcase, ring: "border-amber-300", text: "text-amber-500" },
  contract: { label: "계약", icon: PenLine, ring: "border-emerald-300", text: "text-emerald-500" },
  order: { label: "매출", icon: Coins, ring: "border-teal-300", text: "text-teal-500" },
  support: { label: "고객지원", icon: LifeBuoy, ring: "border-orange-300", text: "text-orange-500" },
};

export function SalesTimeline({ events }: { events: SalesEvent[] }) {
  // 데이터에 존재하는 종류만 필터 칩으로 노출
  const kinds = useMemo(
    () => [...new Set(events.map((e) => e.kind))],
    [events]
  );

  const [selected, setSelected] = useState<Set<SalesEventKind>>(new Set());
  const [asc, setAsc] = useState(true);

  const showAll = selected.size === 0;

  const toggleKind = (k: SalesEventKind) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const visible = useMemo(() => {
    const list = showAll ? events : events.filter((e) => selected.has(e.kind));
    return asc ? list : [...list].reverse();
  }, [events, selected, showAll, asc]);

  return (
    <section className="rounded-xl border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">영업현황</h3>

      {/* 필터 바 */}
      <div className="mb-3 flex flex-wrap items-center gap-4 rounded-lg border bg-muted/40 px-3 py-2.5">
        <Label className="flex items-center gap-1.5 text-sm font-normal">
          <Checkbox
            checked={showAll}
            onCheckedChange={() => setSelected(new Set())}
            className="size-4"
          />
          전체표시
        </Label>
        {kinds.map((k) => (
          <Label key={k} className="flex items-center gap-1.5 text-sm font-normal text-muted-foreground">
            <Checkbox
              checked={selected.has(k)}
              onCheckedChange={() => toggleKind(k)}
              className="size-4"
            />
            {kindConfig[k].label}
          </Label>
        ))}
      </div>

      {/* 정렬 */}
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 items-center rounded-md border px-3 text-sm">날짜</span>
        <button
          type="button"
          title={asc ? "오래된순" : "최신순"}
          onClick={() => setAsc((v) => !v)}
          className="flex size-9 items-center justify-center rounded-md bg-foreground text-background transition-colors hover:bg-foreground/85"
        >
          <ArrowDownUp className={cn("size-4 transition-transform", asc && "rotate-180")} />
        </button>
      </div>

      {/* 타임라인 */}
      {visible.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">표시할 영업현황이 없습니다</p>
      ) : (
        <ol className="relative flex flex-col gap-3">
          <span
            aria-hidden
            className="absolute bottom-4 left-[17px] top-4 w-px bg-border"
          />
          {visible.map((e) => {
            const cfg = kindConfig[e.kind];
            const Icon = cfg.icon;
            return (
              <li key={e.id} className="relative flex gap-3.5">
                <span
                  className={cn(
                    "z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 bg-card",
                    cfg.ring,
                    cfg.text
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="flex-1 rounded-xl border bg-card p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="flex items-center gap-1.5 font-semibold">
                      {cfg.label}
                      {e.hasAttachment && (
                        <Paperclip className="size-3.5 text-muted-foreground" />
                      )}
                    </h4>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {e.date}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-col gap-0.5 text-sm text-muted-foreground">
                    {e.lines.map((l, i) => (
                      <p key={i}>{l}</p>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
