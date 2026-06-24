import Link from "next/link";
import { Home, ChevronRight, Pencil } from "lucide-react";
import { OrderSearch } from "@/components/order/order-search";
import { OrderCard } from "@/components/order/order-card";
import { RecentSection } from "@/components/layout/recent-section";
import { EmptyState } from "@/components/common/empty-state";
import { orders, recentRegistered, recentSearched } from "@/lib/mock-data";

export const metadata = { title: "매출 · FingerSales" };

export default function OrderListPage() {
  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <span>Sales</span>
        <ChevronRight className="size-3.5" />
        <span>영업관리</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">매출</span>
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
        <OrderSearch />

        <section className="flex flex-col">
          <div className="mb-3 flex items-center gap-2">
            <h1 className="text-lg font-bold">매출</h1>
            <span className="text-sm text-muted-foreground">
              ( 검색결과 : {orders.length} 건 )
            </span>
            <Link
              href="/order/new"
              title="매출 추가"
              className="ml-auto flex size-8 items-center justify-center rounded-md border text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
            >
              <Pencil className="size-4" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((o) => (
                <OrderCard key={o.id} order={o} />
              ))}
            </div>
          )}
        </section>

        <RecentSection registered={recentRegistered} searched={recentSearched} />
      </div>
    </div>
  );
}
