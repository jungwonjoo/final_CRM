"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, Plus, ChevronUp, ChevronDown, X, Search, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { proceedings } from "@/lib/mock-data";
import type { Proceeding } from "@/lib/types";

/** 회의록 선택 다이얼로그 — 회의록 메뉴에 등록된 회의록 목록에서 첨부 */
function ProceedingsPickerDialog({
  attachedIds,
  onSelect,
}: {
  attachedIds: string[];
  onSelect: (p: Proceeding) => void;
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");

  const kw = term.trim();
  const results = proceedings.filter(
    (p) =>
      !attachedIds.includes(p.id) &&
      (kw === "" || p.title.includes(kw) || p.company.includes(kw))
  );

  const select = (p: Proceeding) => {
    onSelect(p);
    setOpen(false);
    setTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        title="회의록 첨부"
        className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
      >
        <Plus className="size-4" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>회의록 첨부</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="회의명 / 거래처 검색"
            className="flex-1"
          />
          <Button type="button" size="sm" className="shrink-0 gap-1.5">
            <Search className="size-4" />
            조회
          </Button>
        </div>

        <ul className="flex max-h-72 flex-col gap-1.5 overflow-auto">
          {results.length === 0 ? (
            <li className="py-10 text-center text-sm text-muted-foreground">
              첨부할 회의록이 없습니다
            </li>
          ) : (
            results.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => select(p)}
                  className="flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors hover:border-brand/40 hover:bg-muted"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-400">
                    <FileText className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    <span className="text-sm font-medium">{p.title}</span>
                    <span className="ml-1 text-xs text-muted-foreground">({p.company})</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {p.owner} ({p.date})
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

export function ProceedingsAttachBox() {
  const [items, setItems] = useState<Proceeding[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  const add = (p: Proceeding) =>
    setItems((prev) => (prev.some((x) => x.id === p.id) ? prev : [...prev, p]));
  const remove = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));

  return (
    <section className="flex flex-col rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 border-b pb-2.5">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
          <ClipboardList className="size-4" /> 회의록 ({items.length})
        </h3>
        <div className="ml-auto flex items-center gap-1">
          <ProceedingsPickerDialog
            attachedIds={items.map((p) => p.id)}
            onSelect={add}
          />
          <button
            type="button"
            title={collapsed ? "펼치기" : "접기"}
            onClick={() => setCollapsed((c) => !c)}
            className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
          >
            {collapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
          </button>
        </div>
      </div>

      {!collapsed &&
        (items.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            첨부된 회의록이 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col divide-y">
            {items.map((p) => (
              <li key={p.id} className="flex items-center gap-2 py-2.5">
                <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                <Link
                  href={`/proceedings/${p.id}`}
                  className="min-w-0 flex-1 truncate text-sm hover:text-brand hover:underline"
                  title={p.title}
                >
                  {p.title}
                </Link>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {p.owner} ({p.date})
                </span>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  title="삭제"
                  className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}
