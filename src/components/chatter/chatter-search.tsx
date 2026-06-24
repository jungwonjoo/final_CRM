"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployeeSearchDialog } from "@/components/common/employee-search-dialog";
import { cn } from "@/lib/utils";

export function ChatterSearch() {
  const [open, setOpen] = useState(false);
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
        <Input placeholder="공유내용, 대화내용" />

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
      </div>
    </aside>
  );
}
