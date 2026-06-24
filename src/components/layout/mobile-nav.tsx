"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, Hand } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { mainNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // 현재 경로가 속한 그룹은 기본 펼침
  const [expanded, setExpanded] = useState<string | null>(
    mainNav.find((i) => i.children?.some((c) => pathname.startsWith(c.href)))?.label ?? null
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        title="메뉴"
        className="flex size-9 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground lg:hidden"
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">메뉴</SheetTitle>

        {/* 드로어 헤더 */}
        <div className="flex items-center gap-2 border-b px-4 py-3.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-brand text-primary-foreground">
            <Hand className="size-4" />
          </span>
          <span className="text-base font-bold tracking-tight">FINGER SALES</span>
        </div>

        {/* 메뉴 */}
        <nav className="flex flex-col gap-0.5 overflow-y-auto p-2">
          {mainNav.map((item) => {
            if (item.children) {
              const isOpen = expanded === item.label;
              const active = item.children.some((c) => pathname.startsWith(c.href));
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : item.label)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                      active && "text-brand"
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn("size-4 transition-transform", isOpen && "rotate-180")}
                    />
                  </button>
                  {isOpen && (
                    <div className="ml-3 flex flex-col border-l pl-2">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                            pathname.startsWith(c.href) && "font-semibold text-brand"
                          )}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                  pathname.startsWith(item.href!) && "font-semibold text-brand"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
