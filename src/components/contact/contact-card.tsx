"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Building2,
  Mail,
  Smartphone,
  Phone,
  Briefcase,
} from "lucide-react";
import { CardActionsMenu } from "@/components/common/card-actions-menu";
import { cn } from "@/lib/utils";
import type { Contact, SalesEventKind } from "@/lib/types";

// 펼침 라인의 색상 마커 (영업현황 종류별)
const kindSquare: Record<SalesEventKind, string> = {
  activity: "bg-sky-400",
  quotation: "bg-emerald-400",
  proposal: "bg-violet-400",
  opportunity: "bg-amber-400",
  contract: "bg-emerald-500",
  order: "bg-teal-400",
};

export function ContactCard({ contact }: { contact: Contact }) {
  const [open, setOpen] = useState(false);
  const events = contact.events ?? [];

  return (
    <article className="overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* 아바타 */}
          <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <User className="size-6" />
          </span>

          {/* 이름 / 거래처 (상세로 이동) */}
          <Link href={`/contact/${contact.id}`} className="min-w-0 flex-1">
            <h3 className="flex flex-wrap items-center gap-1.5 font-semibold hover:underline">
              {contact.name}
              {(contact.dept || contact.position) && (
                <span className="text-xs font-normal text-muted-foreground no-underline">
                  ( {contact.dept} / {contact.position} )
                </span>
              )}
            </h3>
            {contact.company && (
              <p className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="size-3.5 shrink-0" />
                {contact.company}
              </p>
            )}
          </Link>

          {/* 담당자 / N건 / 메뉴 */}
          <div className="flex shrink-0 items-center gap-3">
            {contact.ownerName && (
              <span className="flex flex-col items-center gap-0.5 text-xs text-muted-foreground">
                <User className="size-4" />
                {contact.ownerName}
              </span>
            )}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-sm font-medium text-red-500 transition-colors hover:bg-red-100"
            >
              <Briefcase className="size-3.5" />
              {events.length}건
            </button>
            <CardActionsMenu detailHref={`/contact/${contact.id}`} />
          </div>
        </div>

        {/* 연락처 */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-2.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Mail className="size-3.5" />
            {contact.email}
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <Smartphone className="size-3.5" />
            {contact.phone}
          </span>
          {contact.officePhone && (
            <>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1.5">
                <Phone className="size-3.5" />
                {contact.officePhone}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 펼침: 관련 영업현황 */}
      {open && (
        <ul className="flex flex-col gap-2 border-t bg-muted/30 px-4 py-3 text-sm">
          {events.length === 0 ? (
            <li className="py-2 text-center text-muted-foreground">
              관련 영업현황이 없습니다
            </li>
          ) : (
            events.map((e) => (
              <li key={e.id} className="flex items-center gap-2.5">
                <span
                  className={cn("size-3.5 shrink-0 rounded-[4px]", kindSquare[e.kind])}
                />
                <span className="truncate">{e.text}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </article>
  );
}
