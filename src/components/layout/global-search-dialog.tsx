"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Mail, Smartphone, Phone, UserRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
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
import { contacts } from "@/lib/mock-data";

const TEAMS = [
  "핑거포스트",
  "영업팀",
  "개발팀",
  "기술연구소",
  "클라우드팀",
  "마케팅팀",
  "경영지원팀",
  "컨설팅팀",
  "고객지원팀",
  "파트너",
];

export function GlobalSearchDialog({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [team, setTeam] = useState("핑거포스트");
  const [term, setTerm] = useState("");
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const results = useMemo(
    () =>
      contacts.filter(
        (c) =>
          query === "" ||
          c.name.includes(query) ||
          (c.company ?? "").includes(query)
      ),
    [query]
  );

  const reset = () => {
    setTeam("핑거포스트");
    setTerm("");
    setQuery("");
    setSearched(false);
  };

  const runSearch = () => {
    setQuery(term.trim());
    setSearched(true);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <button
        type="button"
        title="통합검색"
        onClick={() => setOpen(true)}
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {trigger}
      </button>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>통합검색</DialogTitle>
        </DialogHeader>

        {/* 팀 + 검색 */}
        <div className="flex items-center gap-2">
          <Select value={team} onValueChange={(v) => setTeam(v ?? "핑거포스트")}>
            <SelectTrigger className="w-36 shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
            placeholder="검색어를 입력하세요"
            className="flex-1"
          />
          <Button type="button" size="sm" onClick={runSearch} className="shrink-0 gap-1.5">
            <Search className="size-4" />
            조회
          </Button>
        </div>

        {/* 결과 */}
        <div className="max-h-80 overflow-auto">
          {!searched ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              팀을 선택하고 검색어를 입력해 조회하세요.
            </p>
          ) : results.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              검색 결과가 없습니다.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <h3 className="flex items-center gap-1.5 border-l-2 border-brand pl-2 text-sm font-semibold">
                고객 <span className="font-normal text-muted-foreground">({results.length})</span>
              </h3>
              <ul className="flex flex-col gap-1.5">
                {results.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/contact/${c.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-start justify-between gap-3 rounded-lg border p-2.5 transition-colors hover:border-brand/40 hover:bg-muted"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {c.company} / {c.name}
                        </span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="size-3" />
                            {c.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Smartphone className="size-3" />
                            {c.phone}
                          </span>
                          {c.officePhone && (
                            <span className="flex items-center gap-1">
                              <Phone className="size-3" />
                              {c.officePhone}
                            </span>
                          )}
                        </span>
                      </span>
                      {c.ownerName && (
                        <span className="flex shrink-0 flex-col items-center gap-0.5 text-xs text-muted-foreground">
                          <UserRound className="size-3.5" />
                          {c.ownerName}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
