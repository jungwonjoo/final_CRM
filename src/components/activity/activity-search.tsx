"use client";

import { useState } from "react";
import { Search, ChevronDown, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeSearchDialog } from "@/components/common/employee-search-dialog";
import { cn } from "@/lib/utils";

const types = ["방문", "전화", "업무협의", "메일", "교육"];
const sorts = ["날짜", "담당자", "거래처"];

export function ActivitySearch() {
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
        <Input placeholder="영업활동 / 고객 / 고객사" />

        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="활동유형 전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">활동유형 전체</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
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

        {/* 기간 */}
        <div className="flex items-center gap-1.5">
          <Input type="date" className="flex-1" />
          <span className="text-muted-foreground">~</span>
          <Input type="date" className="flex-1" />
        </div>

        <Button className="mt-1 w-full gap-1.5">
          <Search className="size-4" />
          검색
        </Button>

        <div className="mt-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">정렬</h3>
        </div>
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-full flex-1">
              <SelectValue placeholder="날짜" />
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
