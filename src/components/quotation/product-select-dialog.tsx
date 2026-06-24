"use client";

import { useState, type ReactNode } from "react";
import { Search, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { products } from "@/lib/mock-data";
import type { Product } from "@/lib/types";

const CATEGORIES = ["핑거포스트", "클라우드", "라이선스", "용역"];
const fmt = (n: number) => n.toLocaleString("ko-KR");

export function ProductSelectDialog({
  onAdd,
  triggerContent,
  triggerClassName,
}: {
  onAdd: (selected: Product[]) => void;
  triggerContent?: ReactNode;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState("핑거포스트");
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Product[]>(products);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const runSearch = () => {
    const kw = term.trim();
    setResults(products.filter((p) => kw === "" || p.name.includes(kw)));
  };

  const toggle = (id: string, on: boolean) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const submit = () => {
    const sel = products.filter((p) => checked.has(p.id));
    if (sel.length === 0) {
      alert("제품을 선택하세요.");
      return;
    }
    onAdd(sel);
    setChecked(new Set());
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setResults(products);
          setChecked(new Set());
        }
      }}
    >
      <button
        type="button"
        title="제품 선택"
        onClick={() => setOpen(true)}
        className={
          triggerClassName ??
          "flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
        }
      >
        {triggerContent ?? <Plus className="size-4" />}
      </button>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>제품 다중선택</DialogTitle>
        </DialogHeader>

        {/* 카테고리 + 검색 */}
        <div className="flex items-center gap-2">
          <Select value={cat} onValueChange={(v) => setCat(v ?? "핑거포스트")}>
            <SelectTrigger className="w-36 shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
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
                runSearch();
              }
            }}
            placeholder="제품명 검색"
            className="flex-1"
          />
          <Button type="button" size="sm" onClick={runSearch} className="shrink-0 gap-1.5">
            <Search className="size-4" />
            조회
          </Button>
        </div>

        {/* 제품 목록 */}
        <ul className="flex max-h-72 flex-col gap-1.5 overflow-auto">
          {results.length === 0 ? (
            <li className="py-10 text-center text-sm text-muted-foreground">
              검색 결과가 없습니다
            </li>
          ) : (
            results.map((p) => (
              <li key={p.id}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition-colors hover:border-brand/40 hover:bg-muted">
                  <Checkbox
                    checked={checked.has(p.id)}
                    onCheckedChange={(v) => toggle(p.id, v === true)}
                    className="size-4"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {p.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {p.packQty} | {p.spec || "-"} | {fmt(p.price)}
                    </span>
                  </span>
                </label>
              </li>
            ))
          )}
        </ul>

        <DialogFooter>
          <Button type="button" onClick={submit} className="gap-1.5">
            <Plus className="size-4" />
            추가 {checked.size > 0 && `(${checked.size})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
