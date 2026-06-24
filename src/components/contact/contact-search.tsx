"use client";

import { useState } from "react";
import { Search, ChevronDown, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeSearchDialog } from "@/components/common/employee-search-dialog";
import { cn } from "@/lib/utils";

const teams = [
  "영업팀",
  "개발팀",
  "기술연구소",
  "클라우드팀",
  "마케팅팀",
  "경영지원팀",
];
const filters = [
  "고객이 5명 이상인 고객사",
  "고객이 10명 이상인 고객사",
  "고객이 20명 이상인 고객사",
];
const sorts = ["등록일", "고객"];

export function ContactSearch() {
  const [open, setOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [owner, setOwner] = useState("");

  return (
    <aside className="flex w-full flex-col rounded-xl border bg-card p-4">
      {/* 헤더: 모바일에서는 토글 버튼, 데스크탑에서는 단순 제목 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between lg:cursor-default lg:pointer-events-none"
      >
        <h2 className="text-sm font-semibold">검색조건</h2>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform lg:hidden",
            open && "rotate-180"
          )}
        />
      </button>

      {/* 본문: 모바일에서는 open일 때만, 데스크탑(lg)에서는 항상 표시 */}
      <div
        className={cn("mt-3 flex-col gap-2.5 lg:flex", open ? "flex" : "hidden")}
      >
        <Input placeholder="전화번호 / 고객 / 고객사 / 메일" />

        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {teams.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <Input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="담당자"
            className="pr-9"
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
            <EmployeeSearchDialog onSelect={setOwner} />
          </div>
        </div>

        <Button className="mt-1 w-full gap-1.5">
          <Search className="size-4" />
          검색
        </Button>

        {/* ── 필터/정렬 ── */}
        <div className="mt-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">필터/정렬</h3>
          <Label className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
            <Checkbox className="size-4" />
            담당없음
          </Label>
        </div>

        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="필터" />
          </SelectTrigger>
          <SelectContent>
            {filters.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-full flex-1">
              <SelectValue placeholder="등록일" />
            </SelectTrigger>
            <SelectContent>
              {sorts.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            title={sortAsc ? "오름차순" : "내림차순"}
            onClick={() => setSortAsc((v) => !v)}
            className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted-foreground/80 text-background transition-colors hover:bg-muted-foreground"
          >
            <ArrowDownUp className={cn("size-4 transition-transform", !sortAsc && "rotate-180")} />
          </button>
        </div>
      </div>
    </aside>
  );
}
