"use client";

import { useState } from "react";
import { Search, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { companies } from "@/lib/mock-data";
import { getStoredCompanies } from "@/lib/company-store";
import type { Company } from "@/lib/types";

// 실제 연동 전, "내고객" 판별용 현재 사용자 (담당자명)
const CURRENT_USER = "김도원";

export function CompanySearchDialog({
  onSelect,
}: {
  onSelect: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [mine, setMine] = useState(false);
  const [results, setResults] = useState<Company[]>([]);

  const runSearch = () => {
    const all = [...companies, ...getStoredCompanies()];
    const kw = term.trim();
    setResults(
      all.filter(
        (c) =>
          (kw === "" || c.name.includes(kw)) &&
          (!mine || c.ownerName === CURRENT_USER)
      )
    );
  };

  const select = (c: Company) => {
    onSelect(c.name);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) runSearch(); // 열릴 때 전체 목록 표시
      }}
    >
      <DialogTrigger
        title="고객사 검색"
        className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
      >
        <Search className="size-4" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>고객사</DialogTitle>
        </DialogHeader>

        {/* 검색 바 */}
        <div className="flex items-center gap-2">
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                runSearch();
              }
            }}
            placeholder="검색어를 입력하세요"
            className="flex-1"
          />
          <Label className="flex shrink-0 items-center gap-1.5 text-sm font-normal whitespace-nowrap">
            <Checkbox
              checked={mine}
              onCheckedChange={(v) => setMine(v === true)}
              className="size-4"
            />
            내고객
          </Label>
          <Button type="button" size="sm" onClick={runSearch} className="shrink-0 gap-1.5">
            <Search className="size-4" />
            조회
          </Button>
        </div>

        {/* 결과 */}
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
                  onClick={() => select(c)}
                  className="flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors hover:border-brand/40 hover:bg-muted"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-400">
                    <Building2 className="size-4" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">{c.name}</span>
                    <span className="text-xs text-muted-foreground">
                      등록일 (0000.00.00)
                    </span>
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
