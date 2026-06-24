import Link from "next/link";
import { Home, ChevronRight, Pencil } from "lucide-react";
import { TodoSearch } from "@/components/todo/todo-search";
import { TodoList } from "@/components/todo/todo-list";
import { RecentSection } from "@/components/layout/recent-section";
import { todos, recentRegistered, recentSearched } from "@/lib/mock-data";

export const metadata = { title: "할일 · FingerSales" };

export default function TodoListPage() {
  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <span>Sales</span>
        <ChevronRight className="size-3.5" />
        <span>영업관리</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">할일</span>
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
        <TodoSearch />

        <section className="flex flex-col">
          <div className="mb-3 flex items-center gap-2">
            <h1 className="text-lg font-bold">할일</h1>
            <span className="text-sm text-muted-foreground">
              ( 검색결과 : {todos.length} 건 )
            </span>
            <Link
              href="/todo/new"
              title="할일 추가"
              className="ml-auto flex size-8 items-center justify-center rounded-md border text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
            >
              <Pencil className="size-4" />
            </Link>
          </div>

          <TodoList items={todos} />
        </section>

        <RecentSection registered={recentRegistered} searched={recentSearched} />
      </div>
    </div>
  );
}
