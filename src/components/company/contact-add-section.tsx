"use client";

import { useState } from "react";
import { Users, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AddedContact {
  id: string;
  name: string;
}

let seq = 0;

/** 고객사 등록 시 소속 고객(담당자)을 추가하는 패널 */
export function ContactAddSection() {
  const [items, setItems] = useState<AddedContact[]>([]);
  const [name, setName] = useState("");

  const add = () => {
    const v = name.trim();
    if (!v) return;
    setItems((prev) => [...prev, { id: `ct${++seq}`, name: v }]);
    setName("");
  };

  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <section className="rounded-xl border bg-card p-4">
      <h3 className="mb-2.5 flex items-center gap-1.5 text-sm font-semibold">
        <Users className="size-4 text-brand" />
        고객{" "}
        <span className="text-xs font-normal text-muted-foreground">
          ({items.length})
        </span>
      </h3>

      {/* 입력 + 추가 */}
      <div className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="고객명 입력"
          className="flex-1"
        />
        <button
          type="button"
          onClick={add}
          className="flex shrink-0 items-center gap-1 rounded-md bg-brand px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand/90"
        >
          <Plus className="size-4" />
          추가
        </button>
      </div>

      {/* 목록 */}
      <ul className="mt-3 flex flex-col">
        {items.map((it) => (
          <li
            key={it.id}
            className="flex items-center justify-between border-b border-dashed py-2.5 text-sm last:border-0"
          >
            <span>{it.name}</span>
            <button
              type="button"
              onClick={() => remove(it.id)}
              title="삭제"
              className="text-destructive transition-colors hover:text-destructive/70"
            >
              <X className="size-4" />
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="py-3 text-center text-xs text-muted-foreground">
            추가된 고객이 없습니다
          </li>
        )}
      </ul>
    </section>
  );
}
