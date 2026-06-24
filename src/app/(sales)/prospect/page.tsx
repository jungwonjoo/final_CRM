import Link from "next/link";
import { Home, ChevronRight, Pencil } from "lucide-react";
import { ProspectSearch } from "@/components/prospect/prospect-search";
import { ProspectCard } from "@/components/prospect/prospect-card";
import { RecentSection } from "@/components/layout/recent-section";
import { EmptyState } from "@/components/common/empty-state";
import { prospects, recentRegistered, recentSearched } from "@/lib/mock-data";

export const metadata = { title: "잠재고객 · FingerSales" };

export default function ProspectListPage() {
  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <span>Sales</span>
        <ChevronRight className="size-3.5" />
        <span>영업관리</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">잠재고객</span>
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
        <ProspectSearch />

        <section className="flex flex-col">
          <div className="mb-3 flex items-center gap-2">
            <h1 className="text-lg font-bold">잠재고객</h1>
            <span className="text-sm text-muted-foreground">
              ( 검색결과 : {prospects.length} 건 )
            </span>
            <Link
              href="/prospect/new"
              title="잠재고객 추가"
              className="ml-auto flex size-8 items-center justify-center rounded-md border text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
            >
              <Pencil className="size-4" />
            </Link>
          </div>

          {prospects.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3">
              {prospects.map((p) => (
                <ProspectCard key={p.id} prospect={p} />
              ))}
            </div>
          )}
        </section>

        <RecentSection registered={recentRegistered} searched={recentSearched} />
      </div>
    </div>
  );
}
