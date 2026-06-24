"use client";

import { useMemo, useState } from "react";
import { Search, Plus, X, UserRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { employees } from "@/lib/mock-data";

const ROLE_LABELS = ["영업담당", "CRM"] as const;

export function ParticipantSelectDialog({
  existing = [],
  onAdd,
  title = "대화상대",
}: {
  existing?: string[]; // 이미 참여 중인 이름 (중복 방지)
  onAdd: (names: string[]) => void;
  title?: string; // 다이얼로그/버튼 명칭 (예: 대화상대, 담당자)
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const results = useMemo(
    () => employees.filter((e) => query === "" || e.name.includes(query)),
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

  const selected = employees.filter((e) => checked.has(e.id));

  const submit = () => {
    const names = selected.map((e) => e.name).filter((n) => !existing.includes(n));
    if (selected.length === 0) {
      alert(`${title}를 선택하세요.`);
      return;
    }
    onAdd(names);
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
        title={`${title} 추가`}
        onClick={() => setOpen(true)}
        className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
      >
        <Plus className="size-4" />
      </button>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title} 선택 ({selected.length}명)</DialogTitle>
        </DialogHeader>

        {/* 검색 */}
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
            placeholder="이름 검색"
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

        {/* 선택된 항목 칩 */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1.5 rounded-lg border bg-muted/30 p-2">
            {selected.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => toggle(e.id)}
                className="flex items-center gap-1 rounded-md bg-card px-2 py-1 text-xs shadow-sm transition-colors hover:text-destructive"
              >
                {e.name}
                <X className="size-3" />
              </button>
            ))}
          </div>
        )}

        {/* 직원 목록 */}
        <ul className="flex max-h-72 flex-col gap-1.5 overflow-auto">
          {results.length === 0 ? (
            <li className="py-10 text-center text-sm text-muted-foreground">
              검색 결과가 없습니다
            </li>
          ) : (
            results.map((e) => {
              const isExisting = existing.includes(e.name);
              return (
                <li key={e.id}>
                  <div
                    role="button"
                    tabIndex={isExisting ? -1 : 0}
                    aria-disabled={isExisting}
                    onClick={() => !isExisting && toggle(e.id)}
                    onKeyDown={(ev) => {
                      if (!isExisting && (ev.key === "Enter" || ev.key === " ")) {
                        ev.preventDefault();
                        toggle(e.id);
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors ${
                      isExisting
                        ? "cursor-not-allowed opacity-50"
                        : `cursor-pointer hover:border-brand/40 hover:bg-muted ${
                            checked.has(e.id) ? "border-brand/60 bg-brand/5" : ""
                          }`
                    }`}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-primary-foreground">
                      <UserRound className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      <span className="text-sm font-medium">{e.name}</span>
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({e.dept} / {e.position})
                      </span>
                      {isExisting && (
                        <span className="ml-1 text-xs text-brand">· 참여중</span>
                      )}
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {ROLE_LABELS.map((r) => (
                        <span key={r} className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Checkbox
                            checked={!!e.roles?.includes(r)}
                            className="pointer-events-none size-3.5"
                          />
                          {r}
                        </span>
                      ))}
                    </span>
                  </div>
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
