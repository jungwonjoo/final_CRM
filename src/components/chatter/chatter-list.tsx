"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, X } from "lucide-react";
import { CreateChatDialog } from "@/components/chatter/create-chat-dialog";
import { chatters } from "@/lib/mock-data";
import type { Chatter } from "@/lib/types";

let seq = 0;
const ME = "김지원";
const existingIds = new Set(chatters.map((c) => c.id));

export function ChatterList({ items }: { items: Chatter[] }) {
  const [rooms, setRooms] = useState<Chatter[]>(items);

  const leave = (id: string) => {
    if (!window.confirm("채팅방에서 나가시겠습니까?")) return;
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  const create = ({ title, participants }: { title: string; participants: string[] }) => {
    const room: Chatter = {
      id: `new-${++seq}`,
      title,
      memberCount: participants.length + 1, // 본인 포함
      participants: [ME, ...participants].join(", "),
      shared: "",
    };
    setRooms((prev) => [room, ...prev]);
  };

  return (
    <section className="flex flex-col">
      <div className="mb-3 flex items-center gap-2">
        <h1 className="text-lg font-bold">채터</h1>
        <span className="text-sm text-muted-foreground">( 검색결과 : {rooms.length} 건 )</span>
        <CreateChatDialog onCreate={create} />
      </div>

      {rooms.length === 0 ? (
        <div className="rounded-xl border bg-card py-16 text-center text-sm text-muted-foreground">
          참여 중인 채팅방이 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rooms.map((c) => (
            <article
              key={c.id}
              className="relative rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => leave(c.id)}
                title="채팅방 나가기"
                className="absolute right-3 top-3 flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
              >
                <X className="size-4" />
              </button>

              <h3 className="flex flex-wrap items-center gap-1.5 pr-8 font-semibold">
                {existingIds.has(c.id) ? (
                  <Link href={`/chatter/${c.id}`} className="hover:underline">
                    {c.title}
                  </Link>
                ) : (
                  <span>{c.title}</span>
                )}
                <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                  ( <Users className="size-3" /> {c.memberCount}명 )
                </span>
              </h3>

              <div className="mt-2.5 flex flex-col gap-1.5 text-sm">
                <p className="flex gap-2">
                  <b className="w-16 shrink-0 font-medium text-muted-foreground">대화상대</b>
                  <span className="min-w-0 text-foreground">{c.participants}</span>
                </p>
                <p className="flex gap-2">
                  <b className="w-16 shrink-0 font-medium text-muted-foreground">공유내용</b>
                  <span className="min-w-0 text-foreground">{c.shared || "-"}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
