import Link from "next/link";
import { Home, ChevronRight, Pencil } from "lucide-react";
import { QuotationSearch } from "@/components/quotation/quotation-search";
import { QuotationCard } from "@/components/quotation/quotation-card";
import { RecentSection } from "@/components/layout/recent-section";
import { quotations, recentRegistered, recentSearched } from "@/lib/mock-data";

export const metadata = { title: "견적 · FingerSales" };

export default function QuotationListPage() {
  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <span>Sales</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">견적</span>
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
        <QuotationSearch />

        <section className="flex flex-col">
          <div className="mb-3 flex items-center gap-2">
            <h1 className="text-lg font-bold">견적</h1>
            <span className="text-sm text-muted-foreground">
              ( 검색결과 : {quotations.length} 건 )
            </span>
            <Link
              href="/quotation/new"
              title="견적 추가"
              className="ml-auto flex size-8 items-center justify-center rounded-md border text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
            >
              <Pencil className="size-4" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {quotations.map((q) => (
              <QuotationCard key={q.id} quotation={q} />
            ))}
          </div>
        </section>

        <RecentSection registered={recentRegistered} searched={recentSearched} />
      </div>
    </div>
  );
}
