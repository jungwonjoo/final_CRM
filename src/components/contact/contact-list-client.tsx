"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { ContactCard } from "@/components/contact/contact-card";
import { EmptyState } from "@/components/common/empty-state";
import { getStoredContacts } from "@/lib/contact-store";
import type { Contact } from "@/lib/types";

export function ContactListClient({ base }: { base: Contact[] }) {
  const [list, setList] = useState<Contact[]>(base);

  useEffect(() => {
    const stored = getStoredContacts();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored.length) setList([...base, ...stored]);
  }, [base]);

  return (
    <section className="flex flex-col">
      <div className="mb-3 flex items-center gap-2">
        <h1 className="text-lg font-bold">고객</h1>
        <span className="text-sm text-muted-foreground">
          ( 검색결과 : {list.length} 건 )
        </span>
        <Link
          href="/contact/new"
          title="고객 추가"
          className="ml-auto flex size-8 items-center justify-center rounded-md border text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
        >
          <Pencil className="size-4" />
        </Link>
      </div>

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((c) => (
            <ContactCard key={c.id} contact={c} />
          ))}
        </div>
      )}
    </section>
  );
}
