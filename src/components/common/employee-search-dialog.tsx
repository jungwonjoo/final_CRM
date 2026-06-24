"use client";

import { useState } from "react";
import { Search, UserRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { employees } from "@/lib/mock-data";
import type { Employee } from "@/lib/types";

const TEAMS = [
  "영업팀",
  "개발팀",
  "기술연구소",
  "클라우드팀",
  "마케팅팀",
  "경영지원팀",
];

export function EmployeeSearchDialog({
  onSelect,
}: {
  onSelect: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [team, setTeam] = useState("all");
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Employee[]>([]);

  const runSearch = () => {
    const kw = term.trim();
    setResults(
      employees.filter(
        (e) =>
          (team === "all" || e.dept === team) &&
          (kw === "" || e.name.includes(kw))
      )
    );
  };

  const select = (e: Employee) => {
    onSelect(e.name);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) runSearch();
      }}
    >
      <DialogTrigger
        title="담당자 검색"
        className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
      >
        <Search className="size-4" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>담당자</DialogTitle>
        </DialogHeader>

        {/* 팀 + 검색 */}
        <div className="flex items-center gap-2">
          <Select value={team} onValueChange={(v) => setTeam(v ?? "all")}>
            <SelectTrigger className="w-32 shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {TEAMS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
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
            placeholder="이름 검색"
            className="flex-1"
          />
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
            results.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => select(e)}
                  className="flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors hover:border-brand/40 hover:bg-muted"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-400">
                    <UserRound className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    <span className="text-sm font-medium">{e.name}</span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({e.dept} / {e.position})
                    </span>
                  </span>
                  {e.roles?.length ? (
                    <span className="flex shrink-0 gap-1">
                      {e.roles.map((r) => (
                        <span
                          key={r}
                          className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {r}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </button>
              </li>
            ))
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
