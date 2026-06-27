"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { FeedbackSection } from "@/components/company/feedback-section";
import { SalesTimeline } from "@/components/company/sales-timeline";
import { getSalesEventsByCompany } from "@/lib/mock-data";
import { getStoredContacts } from "@/lib/contact-store";
import type { Contact } from "@/lib/types";

export function ContactDetailClient({
  id,
  initial,
}: {
  id: string;
  initial: Contact | null;
}) {
  const [contact, setContact] = useState<Contact | null>(initial);
  const [checked, setChecked] = useState(!!initial);

  useEffect(() => {
    if (initial) return;
    const found = getStoredContacts().find((c) => c.id === id) ?? null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContact(found);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecked(true);
  }, [id, initial]);

  if (!checked) return null;

  if (!contact) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-sm text-muted-foreground">고객을 찾을 수 없습니다.</p>
        <Link
          href="/contact"
          className="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          고객 목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* breadcrumb */}
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/contact" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/contact" className="hover:text-foreground">
          고객
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{contact.name}</span>
      </nav>

      <ContactForm contact={contact} />

      {/* 의견 / 메모 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FeedbackSection
          title="의견"
          addLabel="의견"
          icon="message"
          initialItems={[
            {
              id: "c1",
              author: "담당자",
              at: "9999.99.99 00:00:00",
              text: "시간 절약. 간단한 업무 자동화.",
            },
          ]}
        />

        <FeedbackSection
          title="메모"
          addLabel="메모"
          icon="note"
          initialItems={[
            {
              id: "m1",
              author: "담당자",
              at: "9999.99.99 00:00:00",
              text: "간단한 메모",
            },
          ]}
        />
      </div>

      {/* 영업현황 타임라인 */}
      <SalesTimeline events={getSalesEventsByCompany(contact.company)} />
    </div>
  );
}
