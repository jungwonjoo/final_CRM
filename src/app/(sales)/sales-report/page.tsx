import Link from "next/link";
import { Home, ChevronRight, Pencil } from "lucide-react";
import { SalesReportSearch } from "@/components/sales-report/sales-report-search";
import { SalesReportList } from "@/components/sales-report/sales-report-list";
import { RecentSection } from "@/components/layout/recent-section";
import { salesReports, recentRegistered, recentSearched } from "@/lib/mock-data";

export const metadata = { title: "영업보고 · FingerSales" };

export default function SalesReportListPage() {
  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <span>Sales</span>
        <ChevronRight className="size-3.5" />
        <span>영업도구</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">영업보고</span>
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
        <SalesReportSearch />

        <section className="flex flex-col">
          <div className="mb-3 flex items-center gap-2">
            <h1 className="text-lg font-bold">영업보고</h1>
            <span className="text-sm text-muted-foreground">
              ( 검색결과 : {salesReports.length} 건 )
            </span>
            <Link
              href="/sales-report/new"
              title="영업보고 추가"
              className="ml-auto flex size-8 items-center justify-center rounded-md border text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
            >
              <Pencil className="size-4" />
            </Link>
          </div>

          <SalesReportList items={salesReports} />
        </section>

        <RecentSection registered={recentRegistered} searched={recentSearched} />
      </div>
    </div>
  );
}
