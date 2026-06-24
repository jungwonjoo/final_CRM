import Link from "next/link";
import { Home, ChevronRight, Pencil } from "lucide-react";
import { ContractSearch } from "@/components/contract/contract-search";
import { ContractCard } from "@/components/contract/contract-card";
import { RecentSection } from "@/components/layout/recent-section";
import { contracts, recentRegistered, recentSearched } from "@/lib/mock-data";

export const metadata = { title: "계약 · FingerSales" };

export default function ContractListPage() {
  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <span>Sales</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">계약</span>
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
        <ContractSearch />

        <section className="flex flex-col">
          <div className="mb-3 flex items-center gap-2">
            <h1 className="text-lg font-bold">계약</h1>
            <span className="text-sm text-muted-foreground">
              ( 검색결과 : {contracts.length} 건 )
            </span>
            <Link
              href="/contract/new"
              title="계약 추가"
              className="ml-auto flex size-8 items-center justify-center rounded-md border text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
            >
              <Pencil className="size-4" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {contracts.map((c) => (
              <ContractCard key={c.id} contract={c} />
            ))}
          </div>
        </section>

        <RecentSection registered={recentRegistered} searched={recentSearched} />
      </div>
    </div>
  );
}
