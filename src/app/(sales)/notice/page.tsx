import Link from "next/link";
import { Home, ChevronRight, Pencil, Pin } from "lucide-react";
import { NoticeSearch } from "@/components/notice/notice-search";
import { NoticeCard } from "@/components/notice/notice-card";
import { RecentSection } from "@/components/layout/recent-section";
import { EmptyState } from "@/components/common/empty-state";
import { notices, recentRegistered, recentSearched } from "@/lib/mock-data";

export const metadata = { title: "영업공지 · FingerSales" };

export default function NoticeListPage() {
  const pinned = notices.filter((n) => n.pinned);
  const rest = notices.filter((n) => !n.pinned);

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <span>Sales</span>
        <ChevronRight className="size-3.5" />
        <span>영업도구</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">영업공지</span>
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
        <NoticeSearch />

        <section className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold">영업공지</h1>
            <span className="text-sm text-muted-foreground">
              ( 검색결과 : {notices.length} 건 )
            </span>
            <Link
              href="/notice/new"
              title="공지 추가"
              className="ml-auto flex size-8 items-center justify-center rounded-md border text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
            >
              <Pencil className="size-4" />
            </Link>
          </div>

          {pinned.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="flex items-center gap-1.5 text-xs font-semibold text-brand">
                <Pin className="size-3.5" />
                필독 공지
              </h2>
              <div className="flex flex-col gap-3">
                {pinned.map((n) => (
                  <NoticeCard key={n.id} notice={n} />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-semibold text-muted-foreground">전체 공지</h2>
            {rest.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="flex flex-col gap-3">
                {rest.map((n) => (
                  <NoticeCard key={n.id} notice={n} />
                ))}
              </div>
            )}
          </div>
        </section>

        <RecentSection registered={recentRegistered} searched={recentSearched} />
      </div>
    </div>
  );
}
