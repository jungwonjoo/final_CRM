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

const statuses = ["진행중", "완료(성공)", "완료(실패)", "보류/연기"];
const stages = ["인지", "제안", "협상", "계약"];
const dateTypes = ["시작일", "종료일", "등록일"];
const filters = ["성공확률 50% 이상", "금액 높은순", "마감 임박"];
const sorts = ["시작일", "금액", "성공확률"];

export function OpportunitySearch() {
  const [open, setOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [owner, setOwner] = useState("");

  return (
    <aside className="flex w-full flex-col rounded-xl border bg-card p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between lg:pointer-events-none lg:cursor-default"
      >
        <h2 className="text-sm font-semibold">검색조건</h2>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform lg:hidden",
            open && "rotate-180"
          )}
        />
      </button>

      <div className={cn("mt-3 flex-col gap-2.5 lg:flex", open ? "flex" : "hidden")}>
        <Input placeholder="영업기회 / 고객 / 고객사" />

        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {stages.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 담당자 (검색 팝업) */}
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

        {/* 날짜 기준 + 범위 */}
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="시작일" />
          </SelectTrigger>
          <SelectContent>
            {dateTypes.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1.5">
          <Input type="date" className="flex-1" />
          <span className="text-muted-foreground">~</span>
          <Input type="date" className="flex-1" />
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
              <SelectValue placeholder="시작일" />
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
