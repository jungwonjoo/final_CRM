"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { alarms as seedAlarms } from "@/lib/mock-data";
import type { Alarm } from "@/lib/types";

export function NotificationBell() {
  const [list, setList] = useState<Alarm[]>(seedAlarms);

  const remove = (id: string) => setList((prev) => prev.filter((a) => a.id !== id));

  return (
    <Popover>
      <PopoverTrigger
        title="알림"
        className="relative flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground"
      >
        <Bell className="size-[18px]" />
        {list.length > 0 && (
          <span className="absolute right-1 top-1 flex min-w-3.5 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold leading-[14px] text-primary-foreground">
            {list.length}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-[340px] p-0">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <h3 className="text-sm font-semibold">
            알림 <span className="font-normal text-muted-foreground">({list.length})</span>
          </h3>
          <Link href="/mypage" className="text-xs text-brand hover:underline">
            전체보기
          </Link>
        </div>

        {list.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">새 알림이 없습니다.</p>
        ) : (
          <ul className="max-h-80 overflow-auto py-1">
            {list.map((a) => (
              <li
                key={a.id}
                className="group flex items-start gap-2 px-4 py-2.5 transition-colors hover:bg-muted/50"
              >
                <Bell className="mt-0.5 size-4 shrink-0 text-brand" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">{a.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.at}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  title="삭제"
                  className="mt-0.5 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
