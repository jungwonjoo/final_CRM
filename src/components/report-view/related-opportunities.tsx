"use client";

import { useState } from "react";
import { CalendarDays, Building2, Paperclip, Trash2 } from "lucide-react";
import { OpportunitySelectDialog } from "@/components/report-view/opportunity-select-dialog";
import { opportunities } from "@/lib/mock-data";
import type { Opportunity } from "@/lib/types";

const progressOf = (stage: number) => stage * 25;

export function RelatedOpportunities({ initial = [] }: { initial?: Opportunity[] }) {
  const [list, setList] = useState<Opportunity[]>(initial);

  const add = (ids: string[]) =>
    setList((prev) => {
      const additions = opportunities.filter(
        (o) => ids.includes(o.id) && !prev.some((x) => x.id === o.id)
      );
      return [...prev, ...additions];
    });
  const remove = (id: string) => setList((prev) => prev.filter((o) => o.id !== id));

  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between border-b pb-2.5">
        <h3 className="text-sm font-semibold">
          진행중 영업기회 <span className="font-normal text-muted-foreground">({list.length})</span>
        </h3>
        <OpportunitySelectDialog existing={list.map((o) => o.id)} onAdd={add} />
      </div>

      {list.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          진행중 영업기회가 없습니다. + 버튼으로 추가하세요.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5 pt-3">
          {list.map((o) => {
            const progress = progressOf(o.stage);
            return (
              <div
                key={o.id}
                className="group relative flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-3.5" />
                      {o.startDate} ~ {o.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="size-3.5" />
                      {o.contact}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <span className="truncate font-medium">{o.title}</span>
                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                      <Paperclip className="size-3" />0
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-semibold text-amber-500">{progress}%</span>
                  <button
                    type="button"
                    onClick={() => remove(o.id)}
                    title="삭제"
                    className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
