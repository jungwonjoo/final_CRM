"use client";

import { useState } from "react";
import { X, MessageSquare, StickyNote, type LucideIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const icons = {
  message: MessageSquare,
  note: StickyNote,
} satisfies Record<string, LucideIcon>;

export type FeedbackIcon = keyof typeof icons;

export interface FeedbackItem {
  id: string;
  author: string;
  at: string; // YYYY.MM.DD HH:mm:ss
  text: string;
}

function now() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(
    d.getHours()
  )}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

let seq = 0;

export function FeedbackSection({
  title,
  icon,
  addLabel,
  initialItems = [],
  author = "담당자",
}: {
  title: string;
  icon: FeedbackIcon;
  addLabel: string;
  initialItems?: FeedbackItem[];
  author?: string;
}) {
  const Icon = icons[icon];
  const [items, setItems] = useState<FeedbackItem[]>(initialItems);
  const [text, setText] = useState("");

  const add = () => {
    const v = text.trim();
    if (!v) return;
    setItems((prev) => [
      { id: `f${++seq}`, author, at: now(), text: v },
      ...prev,
    ]);
    setText("");
  };

  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <section className="rounded-xl border bg-card p-4">
      <h3 className="mb-2.5 flex items-center gap-1.5 text-sm font-semibold">
        <Icon className="size-4 text-brand" />
        {title}{" "}
        <span className="text-xs font-normal text-muted-foreground">
          ({items.length})
        </span>
      </h3>

      {/* 입력창 + 등록 버튼 */}
      <div className="flex gap-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") add();
          }}
          placeholder={`${title}을(를) 입력하세요`}
          rows={3}
          className="flex-1 resize-none"
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 self-stretch rounded-md bg-neutral-500 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-600"
        >
          {addLabel}
        </button>
      </div>

      {/* 목록 */}
      <ul className="mt-3 flex flex-col">
        {items.map((it) => (
          <li
            key={it.id}
            className="border-b border-dashed py-2.5 last:border-0"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {it.author}{" "}
                <span className="ml-1">({it.at})</span>
              </span>
              <button
                type="button"
                onClick={() => remove(it.id)}
                title="삭제"
                className="text-destructive transition-colors hover:text-destructive/70"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm">{it.text}</p>
          </li>
        ))}
        {items.length === 0 && (
          <li className="py-3 text-center text-xs text-muted-foreground">
            등록된 {title}이(가) 없습니다
          </li>
        )}
      </ul>
    </section>
  );
}
