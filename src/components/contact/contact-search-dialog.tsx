"use client";

import { useState } from "react";
import { Search, UserRound, type LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { contacts } from "@/lib/mock-data";
import { getStoredContacts } from "@/lib/contact-store";
import type { Contact } from "@/lib/types";

export function ContactSearchDialog({
  onSelect,
  triggerIcon: TriggerIcon = Search,
  triggerTitle = "고객 검색",
}: {
  onSelect: (name: string) => void;
  triggerIcon?: LucideIcon;
  triggerTitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Contact[]>([]);

  const runSearch = () => {
    const all = [...contacts, ...getStoredContacts()];
    const kw = term.trim();
    setResults(
      all.filter(
        (c) =>
          kw === "" ||
          c.name.includes(kw) ||
          (c.company ?? "").includes(kw)
      )
    );
  };

  const select = (c: Contact) => {
    onSelect(c.name);
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
        title={triggerTitle}
        className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
      >
        <TriggerIcon className="size-4" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>고객</DialogTitle>
        </DialogHeader>

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
            placeholder="고객명 / 고객사 검색"
            className="flex-1"
          />
          <Button type="button" size="sm" onClick={runSearch} className="shrink-0 gap-1.5">
            <Search className="size-4" />
            조회
          </Button>
        </div>

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
                    <UserRound className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    <span className="text-sm font-medium">{c.name}</span>
                    {(c.dept || c.position) && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({c.dept} / {c.position})
                      </span>
                    )}
                    {c.company && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        · {c.company}
                      </span>
                    )}
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
