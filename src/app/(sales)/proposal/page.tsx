import Link from "next/link";
import { Home, ChevronRight, Pencil } from "lucide-react";
import { ProposalSearch } from "@/components/proposal/proposal-search";
import { ProposalCard } from "@/components/proposal/proposal-card";
import { RecentSection } from "@/components/layout/recent-section";
import { EmptyState } from "@/components/common/empty-state";
import { proposals, recentRegistered, recentSearched } from "@/lib/mock-data";

export const metadata = { title: "제안 · FingerSales" };

export default function ProposalListPage() {
  return (
    <div className="flex flex-col gap-4">
      {/* breadcrumb */}
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <span>Sales</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">제안</span>
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
        {/* 좌: 검색조건 */}
        <ProposalSearch />

        {/* 중: 목록 */}
        <section className="flex flex-col">
          <div className="mb-3 flex items-center gap-2">
            <h1 className="text-lg font-bold">제안</h1>
            <span className="text-sm text-muted-foreground">
              ( 검색결과 : {proposals.length} 건 )
            </span>
            <Link
              href="/proposal/new"
              title="제안 추가"
              className="ml-auto flex size-8 items-center justify-center rounded-md border text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
            >
              <Pencil className="size-4" />
            </Link>
          </div>

          {proposals.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3">
              {proposals.map((p) => (
                <ProposalCard key={p.id} proposal={p} />
              ))}
            </div>
          )}
        </section>

        {/* 우: 최근등록/검색 */}
        <RecentSection registered={recentRegistered} searched={recentSearched} />
      </div>
    </div>
  );
}
