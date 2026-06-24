"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function NoticeSearch() {
  const [open, setOpen] = useState(false);

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
        <Input placeholder="제목, 내용" />
        <Input placeholder="작성자" />
        <Button className="mt-1 w-full gap-1.5">
          <Search className="size-4" />
          검색
        </Button>
      </div>
    </aside>
  );
}
