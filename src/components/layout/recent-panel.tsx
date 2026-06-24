import {
  Bookmark,
  Search,
  User,
  Building2,
  UserPlus,
  FileText,
  type LucideIcon,
} from "lucide-react";
import type { RecentItem, RecentKind } from "@/lib/types";

const kindIcon: Record<RecentKind, LucideIcon> = {
  contact: User,
  company: Building2,
  prospect: UserPlus,
  proceedings: FileText,
  proposal: FileText,
};

function RecentList({ items }: { items: RecentItem[] }) {
  if (items.length === 0) {
    return <p className="px-4 py-6 text-center text-xs text-muted-foreground">검색 결과가 없습니다</p>;
  }
  return (
    <ul className="flex flex-col divide-y">
      {items.map((it) => {
        const Icon = kindIcon[it.kind];
        return (
          <li
            key={it.id}
            className="flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/50"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-400">
              <Icon className="size-4" />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm">{it.title}</span>
              <span className="truncate text-xs text-muted-foreground">
                {it.owner} ({it.at})
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function RecentPanel({
  registered,
  searched,
}: {
  registered: RecentItem[];
  searched: RecentItem[];
}) {
  return (
    <aside className="flex w-full flex-col gap-2.5">
      <section className="overflow-hidden rounded-2xl border bg-card">
        <h3 className="flex items-center gap-1.5 border-b px-4 py-2.5 text-sm font-semibold">
          <Bookmark className="size-4 fill-red-500 text-red-500" />
          최근등록
        </h3>
        <RecentList items={registered} />
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card">
        <h3 className="flex items-center gap-1.5 border-b px-4 py-2.5 text-sm font-semibold">
          <Search className="size-4 text-red-500" />
          최근검색
        </h3>
        <RecentList items={searched} />
      </section>
    </aside>
  );
}
