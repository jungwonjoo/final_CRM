import { Home, ChevronRight } from "lucide-react";
import { ChatterSearch } from "@/components/chatter/chatter-search";
import { ChatterList } from "@/components/chatter/chatter-list";
import { RecentSection } from "@/components/layout/recent-section";
import { chatters, recentRegistered, recentSearched } from "@/lib/mock-data";

export const metadata = { title: "채터 · FingerSales" };

export default function ChatterListPage() {
  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <span>Sales</span>
        <ChevronRight className="size-3.5" />
        <span>영업도구</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">채터</span>
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
        <ChatterSearch />

        <ChatterList items={chatters} />

        <RecentSection registered={recentRegistered} searched={recentSearched} />
      </div>
    </div>
  );
}
