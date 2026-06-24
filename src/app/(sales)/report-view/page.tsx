import { Home, ChevronRight } from "lucide-react";
import { ReportViewSearch } from "@/components/report-view/report-view-search";
import { ReportViewCard } from "@/components/report-view/report-view-card";
import { RecentSection } from "@/components/layout/recent-section";
import { salesReports, recentRegistered, recentSearched } from "@/lib/mock-data";

export const metadata = { title: "영업보고현황 · FingerSales" };

export default function ReportViewListPage() {
  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <span>Sales</span>
        <ChevronRight className="size-3.5" />
        <span>영업도구</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">영업보고현황</span>
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
        <ReportViewSearch />

        <section className="flex flex-col">
          <div className="mb-3 flex items-center gap-2">
            <h1 className="text-lg font-bold">영업보고현황</h1>
            <span className="text-sm text-muted-foreground">
              ( 검색결과 : {salesReports.length} 건 )
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {salesReports.map((r) => (
              <ReportViewCard key={r.id} report={r} />
            ))}
          </div>
        </section>

        <RecentSection registered={recentRegistered} searched={recentSearched} />
      </div>
    </div>
  );
}
