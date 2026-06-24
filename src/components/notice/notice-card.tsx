import Link from "next/link";
import { Pin, Eye, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notice } from "@/lib/types";

export function NoticeCard({ notice: n }: { notice: Notice }) {
  return (
    <article
      className={cn(
        "rounded-xl border p-4 transition-shadow hover:shadow-md",
        n.pinned ? "border-brand/30 bg-brand/5" : "bg-card"
      )}
    >
      <div className="flex items-start gap-3">
        {/* 작성자 아바타 */}
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            n.pinned ? "bg-brand text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          {n.author.slice(0, 1)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="flex min-w-0 items-center gap-1.5 font-semibold">
              {n.pinned && (
                <span className="flex shrink-0 items-center gap-0.5 rounded-md bg-brand px-1.5 py-0.5 text-[11px] font-medium text-primary-foreground">
                  <Pin className="size-3" />
                  필독
                </span>
              )}
              <Link href={`/notice/${n.id}`} className="truncate hover:underline">
                {n.title}
              </Link>
            </h3>
            <span className="shrink-0 text-xs text-muted-foreground">{n.date}</span>
          </div>

          {n.excerpt && (
            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{n.excerpt}</p>
          )}

          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{n.author}</span>
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {n.views.toLocaleString("ko-KR")}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="size-3.5" />
              {n.comments}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
