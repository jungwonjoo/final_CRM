import { Home, ChevronRight } from "lucide-react";
import { ContactSearch } from "@/components/contact/contact-search";
import { ContactListClient } from "@/components/contact/contact-list-client";
import { RecentSection } from "@/components/layout/recent-section";
import { contacts, recentRegistered, recentSearched } from "@/lib/mock-data";

export const metadata = { title: "고객 · FingerSales" };

export default function ContactListPage() {
  return (
    <div className="flex flex-col gap-4">
      {/* breadcrumb */}
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <span>Sales</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">고객</span>
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
        {/* 좌: 검색조건 */}
        <ContactSearch />

        {/* 중: 목록 (localStorage 빠른등록분 병합) */}
        <ContactListClient base={contacts} />

        {/* 우: 최근등록/검색 */}
        <RecentSection registered={recentRegistered} searched={recentSearched} />
      </div>
    </div>
  );
}
