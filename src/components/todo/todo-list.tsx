"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, CheckSquare, Square, UserRound } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { cn } from "@/lib/utils";
import type { Todo, TodoKind, TodoPriority } from "@/lib/types";

const KIND_STYLE: Record<TodoKind, string> = {
  전화: "bg-emerald-50 text-emerald-600",
  메일: "bg-violet-50 text-violet-600",
  방문: "bg-blue-50 text-blue-600",
  견적: "bg-amber-50 text-amber-700",
  기타: "bg-slate-100 text-slate-600",
};

const PRIORITY_DOT: Record<TodoPriority, string> = {
  높음: "bg-red-500",
  보통: "bg-amber-500",
  낮음: "bg-slate-400",
};

export function TodoList({ items }: { items: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(items);

  const complete = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: true } : t)));

  if (todos.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-3">
      {todos.map((t) => (
        <article
          key={t.id}
          className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            {/* 좌측: 상태/구분 + 제목 */}
            <div className="flex min-w-0 items-start gap-2.5">
              {/* 완료 체크박스 */}
              {t.done ? (
                <CheckSquare className="mt-0.5 size-5 shrink-0 text-red-500" />
              ) : (
                <Square className="mt-0.5 size-5 shrink-0 text-muted-foreground/50" />
              )}

              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={cn("size-2 shrink-0 rounded-full", PRIORITY_DOT[t.priority])}
                    title={`중요도 ${t.priority}`}
                  />
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-xs font-medium",
                      KIND_STYLE[t.kind]
                    )}
                  >
                    {t.kind}
                  </span>
                </div>
                <p
                  className={cn(
                    "font-medium",
                    t.done && "text-muted-foreground line-through"
                  )}
                >
                  <Link href={`/todo/${t.id}`} className="hover:underline">
                    {t.title}
                  </Link>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{t.at}</p>
              </div>
            </div>

            {/* 우측: 담당자 + 완료 버튼 */}
            <div className="flex shrink-0 items-center gap-3">
              <span className="flex w-16 flex-col items-center gap-1 text-xs text-muted-foreground">
                <UserRound className="size-4" />
                <span className="max-w-full truncate text-foreground">{t.owner}</span>
              </span>

              {!t.done && (
                <button
                  type="button"
                  onClick={() => complete(t.id)}
                  className="flex items-center gap-1 rounded-md bg-red-500 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
                >
                  <Check className="size-3.5" />
                  완료
                </button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
