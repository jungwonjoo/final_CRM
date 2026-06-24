"use client";

import { useMemo, useState } from "react";
import { Search, Plus, X, Briefcase } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { opportunities } from "@/lib/mock-data";

const progressOf = (stage: number) => stage * 25;

export function OpportunitySelectDialog({
  existing = [],
  onAdd,
}: {
  existing?: string[]; // 이미 추가된 영업기회 id (중복 방지)
  onAdd: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const results = useMemo(
    () =>
      opportunities.filter(
        (o) => query === "" || o.title.includes(query) || o.company.includes(query)
      ),
    [query]
  );

  const reset = () => {
    setTerm("");
    setQuery("");
    setChecked(new Set());
  };

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selected = opportunities.filter((o) => checked.has(o.id));

  const submit = () => {
    const ids = selected.map((o) => o.id).filter((id) => !existing.includes(id));
    if (selected.length === 0) return alert("영업기회를 선택하세요.");
    onAdd(ids);
    setOpen(false);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) reset();
      }}
    >
      <button
        type="button"
        title="영업기회 추가"
        onClick={() => setOpen(true)}
        className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
      >
        <Plus className="size-4" />
      </button>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>영업기회 선택 ({selected.length}건)</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setQuery(term.trim());
              }
            }}
            placeholder="영업기회명, 고객사"
            className="flex-1"
          />
          <Button
            type="button"
            size="sm"
            onClick={() => setQuery(term.trim())}
            className="shrink-0 gap-1.5"
          >
            <Search className="size-4" />
            조회
          </Button>
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1.5 rounded-lg border bg-muted/30 p-2">
            {selected.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => toggle(o.id)}
                className="flex items-center gap-1 rounded-md bg-card px-2 py-1 text-xs shadow-sm transition-colors hover:text-destructive"
              >
                {o.title}
                <X className="size-3" />
              </button>
            ))}
          </div>
        )}

        <ul className="flex max-h-72 flex-col gap-1.5 overflow-auto">
          {results.length === 0 ? (
            <li className="py-10 text-center text-sm text-muted-foreground">검색 결과가 없습니다</li>
          ) : (
            results.map((o) => {
              const isExisting = existing.includes(o.id);
              const progress = progressOf(o.stage);
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    disabled={isExisting}
                    onClick={() => toggle(o.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors ${
                      isExisting
                        ? "cursor-not-allowed opacity-50"
                        : `hover:border-brand/40 hover:bg-muted ${
                            checked.has(o.id) ? "border-brand/60 bg-brand/5" : ""
                          }`
                    }`}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                      <Briefcase className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {o.title}
                        {isExisting && <span className="ml-1 text-xs text-brand">· 추가됨</span>}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {o.company} / {o.contact} · {o.startDate} ~ {o.endDate}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-amber-500">{progress}%</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <DialogFooter>
          <Button type="button" onClick={submit} className="gap-1.5">
            <Plus className="size-4" />
            추가 {selected.length > 0 && `(${selected.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
