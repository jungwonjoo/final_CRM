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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const KINDS = ["고객", "고객사", "영업기회", "잠재고객"] as const;
type Kind = (typeof KINDS)[number];

interface ShareCandidate {
  id: string;
  kind: Kind;
  label: string; // 대표 표기
  sub: string; // 부가 정보
  date: string;
}

// 공유내용 후보(목업). 실제 사용 시 검색 API 결과로 교체.
const CANDIDATES: ShareCandidate[] = [
  { id: "c1", kind: "고객", label: "황부장 / 한국야금 KORLOY", sub: "구매팀 / 부장", date: "2026.06.07" },
  { id: "c2", kind: "고객", label: "정과장 / 세아제강", sub: "기술연구소 / 과장", date: "2026.06.02" },
  { id: "c3", kind: "고객사", label: "빙그레", sub: "경기도 남양주시", date: "2026.06.05" },
  { id: "c4", kind: "고객사", label: "현대엘리베이터", sub: "충청북도 충주시", date: "2026.04.01" },
  { id: "c5", kind: "영업기회", label: "세아제강 생산관리 시스템 도입", sub: "담당 연경현", date: "2026.06.06" },
  { id: "c6", kind: "영업기회", label: "현대엘리베이터 유지보수 확대", sub: "담당 석정하", date: "2026.06.03" },
  { id: "c7", kind: "잠재고객", label: "강현우 / 한국야금 KORLOY", sub: "미접촉", date: "2026.06.20" },
];

export function ShareSelectDialog({ onAdd }: { onAdd: (items: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind>("고객");
  const [term, setTerm] = useState("");
  const [query, setQuery] = useState({ kind: "고객" as Kind, term: "" });
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const results = useMemo(
    () =>
      CANDIDATES.filter(
        (c) => c.kind === query.kind && (query.term === "" || c.label.includes(query.term))
      ),
    [query]
  );

  const reset = () => {
    setKind("고객");
    setTerm("");
    setQuery({ kind: "고객", term: "" });
    setChecked(new Set());
  };

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selected = CANDIDATES.filter((c) => checked.has(c.id));

  const submit = () => {
    if (selected.length === 0) {
      alert("공유내용을 선택하세요.");
      return;
    }
    onAdd(selected.map((c) => `${c.kind} · ${c.label}`));
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
        title="공유내용 추가"
        onClick={() => setOpen(true)}
        className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
      >
        <Plus className="size-4" />
      </button>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>공유내용 선택 ({selected.length}건)</DialogTitle>
        </DialogHeader>

        {/* 분류 + 검색 */}
        <div className="flex items-center gap-2">
          <Select value={kind} onValueChange={(v) => setKind((v as Kind) ?? "고객")}>
            <SelectTrigger className="w-32 shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {KINDS.map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setQuery({ kind, term: term.trim() });
              }
            }}
            placeholder="공유내용"
            className="flex-1"
          />
          <Button
            type="button"
            size="sm"
            onClick={() => setQuery({ kind, term: term.trim() })}
            className="shrink-0 gap-1.5"
          >
            <Search className="size-4" />
            조회
          </Button>
        </div>

        {/* 선택된 항목 칩 */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1.5 rounded-lg border bg-muted/30 p-2">
            {selected.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                className="flex items-center gap-1 rounded-md bg-card px-2 py-1 text-xs shadow-sm transition-colors hover:text-destructive"
              >
                {c.label}
                <X className="size-3" />
              </button>
            ))}
          </div>
        )}

        {/* 후보 목록 */}
        <ul className="flex max-h-72 flex-col gap-1.5 overflow-auto">
          {results.length === 0 ? (
            <li className="py-10 text-center text-sm text-muted-foreground">
              검색 결과가 없습니다
            </li>
          ) : (
            results.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => toggle(c.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors hover:border-brand/40 hover:bg-muted ${
                    checked.has(c.id) ? "border-brand/60 bg-brand/5" : ""
                  }`}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-primary-foreground">
                    <UserRound className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{c.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{c.sub}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">{c.date}</span>
                </button>
              </li>
            ))
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
