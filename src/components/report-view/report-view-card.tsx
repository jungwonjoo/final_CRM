import Link from "next/link";
import { CalendarDays, UserRound, FileText } from "lucide-react";
import type { SalesReport } from "@/lib/types";

export function ReportViewCard({ report: r }: { report: SalesReport }) {
  return (
    <article className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex flex-wrap items-center gap-1.5 font-semibold">
            <Link href={`/report-view/${r.id}`} className="hover:underline">
              보고일 : {r.reportDate}
            </Link>
            <span className="text-xs font-normal text-muted-foreground">( {r.template} )</span>
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5 shrink-0" />
              {r.startDate} ~ {r.endDate}
            </span>
            <span className="flex items-center gap-1 rounded bg-sky-50 px-1.5 py-0.5 text-xs font-medium text-sky-600">
              <FileText className="size-3" />
              Report
            </span>
            <span className="flex items-center gap-1">
              <UserRound className="size-3.5 shrink-0" />
              {r.dept} / {r.author}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
