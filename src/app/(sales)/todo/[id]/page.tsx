import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { TodoForm } from "@/components/todo/todo-form";
import { getTodo } from "@/lib/mock-data";

export const metadata = { title: "할일 상세 · FingerSales" };

export default async function TodoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const todo = getTodo(id);
  if (!todo) notFound();

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/todo" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <span>영업관리</span>
        <ChevronRight className="size-3.5" />
        <Link href="/todo" className="hover:text-foreground">
          할일
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="max-w-[40ch] truncate text-foreground">{todo.title}</span>
      </nav>

      <TodoForm todo={todo} />
    </div>
  );
}
