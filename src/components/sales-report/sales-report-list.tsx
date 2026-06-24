"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, UserRound, Check, CheckCircle2 } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import type { SalesReport } from "@/lib/types";

export function SalesReportList({ items }: { items: SalesReport[] }) {
  const [reports, setReports] = useState<SalesReport[]>(items);

  const submit = (id: string) => {
    if (!window.confirm("보고서를 제출하시겠습니까?")) return;
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, submitted: true } : r)));
  };

  if (reports.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-3">
      {reports.map((r) => (
        <article className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md" key={r.id}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="flex flex-wrap items-center gap-1.5 font-semibold">
                <Link href={`/sales-report/${r.id}`} className="hover:underline">
                  보고일 : {r.reportDate}
                </Link>
                <span className="text-xs font-normal text-muted-foreground">
                  ( {r.template} )
                </span>
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-3.5 shrink-0" />
                  {r.startDate} ~ {r.endDate}
                </span>
                <span className="flex items-center gap-1">
                  <UserRound className="size-3.5 shrink-0" />
                  {r.dept} / {r.author}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              {r.submitted ? (
                <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="size-3.5" />
                  제출됨
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => submit(r.id)}
                  className="flex items-center gap-1 rounded-md bg-brand px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-brand/90"
                >
                  <Check className="size-3.5" />
                  제출
                </button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
