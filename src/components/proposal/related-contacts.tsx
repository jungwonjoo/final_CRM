"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Save, ChevronUp, ChevronDown, Trash2, UserRound } from "lucide-react";
import { ContactSearchDialog } from "@/components/contact/contact-search-dialog";
import { contacts as allContacts } from "@/lib/mock-data";
import { getStoredContacts } from "@/lib/contact-store";
import type { Contact } from "@/lib/types";

export function RelatedContacts({ initial = [] }: { initial?: Contact[] }) {
  const [list, setList] = useState<Contact[]>(initial);
  const [open, setOpen] = useState(true);

  const add = (name: string) => {
    const found = [...allContacts, ...getStoredContacts()].find((c) => c.name === name);
    const c: Contact =
      found ?? { id: `r-${Date.now()}`, name, dept: "", position: "", phone: "", email: "" };
    setList((prev) => (prev.some((x) => x.id === c.id) ? prev : [...prev, c]));
  };

  const remove = (id: string) => setList((prev) => prev.filter((c) => c.id !== id));

  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between border-b pb-2.5">
        <h3 className="text-sm font-semibold">
          연관고객 <span className="font-normal text-muted-foreground">({list.length})</span>
        </h3>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ContactSearchDialog onSelect={add} triggerIcon={Plus} triggerTitle="연관고객 추가" />
          <button
            type="button"
            title="저장"
            onClick={() => alert("저장되었습니다.")}
            className="flex size-6 items-center justify-center rounded transition-colors hover:bg-muted hover:text-brand"
          >
            <Save className="size-4" />
          </button>
          <button
            type="button"
            title={open ? "접기" : "펼치기"}
            onClick={() => setOpen((v) => !v)}
            className="flex size-6 items-center justify-center rounded transition-colors hover:bg-muted hover:text-foreground"
          >
            {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </div>
      </div>

      {open &&
        (list.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            연관고객이 없습니다. + 버튼으로 추가하세요.
          </p>
        ) : (
          <ul className="flex flex-col divide-y">
            {list.map((c) => (
              <li key={c.id} className="py-3">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/contact/${c.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {c.name} / {c.dept || "-"} / {c.position || "-"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    title="삭제"
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-1.5 flex items-start justify-between gap-2">
                  <ul className="flex flex-col gap-0.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-1.5">
                      <span className="text-brand">•</span>
                      {c.phone || "-"}
                      {c.officePhone ? ` / ${c.officePhone}` : ""}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-brand">•</span>
                      {c.email || "-"}
                    </li>
                  </ul>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <UserRound className="size-5" />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}
