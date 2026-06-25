"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Users, Phone, Mail, Plus } from "lucide-react";
import { CompanyForm } from "@/components/company/company-form";
import { FeedbackSection } from "@/components/company/feedback-section";
import { SalesTimeline } from "@/components/company/sales-timeline";
import { contacts, getSalesEventsByCompany } from "@/lib/mock-data";
import { getStoredCompanies } from "@/lib/company-store";
import type { Company } from "@/lib/types";

export function CompanyDetailClient({
  id,
  initial,
}: {
  id: string;
  initial: Company | null;
}) {
  const [company, setCompany] = useState<Company | null>(initial);
  const [checked, setChecked] = useState(!!initial);

  // 정적 목업에 없으면 localStorage 빠른등록분에서 조회
  useEffect(() => {
    if (initial) return;
    const found = getStoredCompanies().find((c) => c.id === id) ?? null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompany(found);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecked(true);
  }, [id, initial]);

  if (!checked) return null;

  if (!company) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-sm text-muted-foreground">고객사를 찾을 수 없습니다.</p>
        <Link
          href="/company"
          className="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          고객사 목록으로
        </Link>
      </div>
    );
  }

  // 같은 고객사(거래처명)에 속한 고객만 필터
  const companyContacts = contacts.filter((c) => c.company === company.name);

  return (
    <div className="flex flex-col gap-4">
      {/* breadcrumb */}
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/company" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/company" className="hover:text-foreground">
          고객사
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{company.name}</span>
      </nav>

      <CompanyForm company={company} />

      {/* 의견 / 메모 / 연결 고객 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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

        <section className="rounded-xl border bg-card p-4">
          <div className="mb-2.5 flex items-center gap-1.5">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold">
              <Users className="size-4 text-brand" />
              고객{" "}
              <span className="text-xs font-normal text-muted-foreground">
                ({companyContacts.length})
              </span>
            </h3>
            <Link
              href="/contact/new"
              title="고객 추가"
              className="ml-auto flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
            >
              <Plus className="size-4" />
            </Link>
          </div>
          {companyContacts.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">
              등록된 고객이 없습니다
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {companyContacts.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/contact/${c.id}`}
                    className="flex flex-col gap-1 rounded-lg border p-2.5 transition-colors hover:border-brand/40 hover:bg-muted"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-medium">
                        {c.name}
                        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                          {c.position}
                        </span>
                      </span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {c.dept}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="size-3" />
                      {c.phone}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="size-3" />
                      {c.email}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* 영업현황 타임라인 */}
      <SalesTimeline events={getSalesEventsByCompany(company.name)} />
    </div>
  );
}
