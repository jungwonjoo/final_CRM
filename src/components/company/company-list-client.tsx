"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { CompanyCard } from "@/components/company/company-card";
import { EmptyState } from "@/components/common/empty-state";
import { getStoredCompanies } from "@/lib/company-store";
import type { Company } from "@/lib/types";

export function CompanyListClient({ base }: { base: Company[] }) {
  const [list, setList] = useState<Company[]>(base);

  useEffect(() => {
    const stored = getStoredCompanies();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored.length) setList([...base, ...stored]);
  }, [base]);

  return (
    <section className="flex flex-col">
      <div className="mb-3 flex items-center gap-2">
        <h1 className="text-lg font-bold">고객사</h1>
        <span className="text-sm text-muted-foreground">
          ( 검색결과 : {list.length} 건 )
        </span>
        <Link
          href="/company/new"
          title="고객사 추가"
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
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>
      )}
    </section>
  );
}
