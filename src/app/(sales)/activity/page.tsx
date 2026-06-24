import Link from "next/link";
import { Home, ChevronRight, Pencil } from "lucide-react";
import { ActivitySearch } from "@/components/activity/activity-search";
import { ActivityTabs } from "@/components/activity/activity-tabs";
import { RecentSection } from "@/components/layout/recent-section";
import { activities, recentRegistered, recentSearched } from "@/lib/mock-data";

export const metadata = { title: "영업활동 · FingerSales" };

export default function ActivityListPage() {
  return (
    <div className="flex flex-col gap-4">
      {/* breadcrumb */}
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <span>Sales</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">영업활동</span>
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
        {/* 좌: 검색조건 */}
        <ActivitySearch />

        {/* 중: 캘린더 / 목록 / 부서캘린더 탭 */}
        <div className="flex flex-col">
          <div className="mb-3 flex items-center gap-2">
            <h1 className="text-lg font-bold">영업활동</h1>
            <Link
              href="/activity/new"
              title="영업활동 추가"
              className="ml-auto flex size-8 items-center justify-center rounded-md border text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
            >
              <Pencil className="size-4" />
            </Link>
          </div>
          <ActivityTabs items={activities} />
        </div>

        {/* 우: 최근등록/검색 */}
        <RecentSection registered={recentRegistered} searched={recentSearched} />
      </div>
    </div>
  );
}
