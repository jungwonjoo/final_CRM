import Link from "next/link";
import { Users, MapPin, User, Wallet } from "lucide-react";
import { contacts, getCompanyCounts, type CompanyRelationCounts } from "@/lib/mock-data";
import type { Company } from "@/lib/types";

const fmt = (n: number) => n.toLocaleString("ko-KR");

const countRow: { key: keyof CompanyRelationCounts; label: string }[] = [
  { key: "activity", label: "영업활동" },
  { key: "quotation", label: "견적" },
  { key: "proposal", label: "제안" },
  { key: "contract", label: "계약" },
  { key: "support", label: "고객지원" },
];

export function CompanyCard({ company }: { company: Company }) {
  // 하단 연관 건수는 실제 등록 데이터에서 집계 (상세 영업현황과 동일)
  const counts = getCompanyCounts(company.name);

  // 같은 고객사에 등록된 고객 → "첫 고객명 외 N명"
  const members = contacts.filter((c) => c.company === company.name);
  const memberLabel =
    members.length === 0
      ? "-"
      : members.length === 1
        ? members[0].name
        : `${members[0].name} 외${members.length - 1}명`;

  return (
    <article className="overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      {/* 상단: 기본 정보 */}
      <Link href={`/company/${company.id}`} className="flex cursor-pointer items-start gap-4 p-4">
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 font-semibold">
            {company.name}
            <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
              <Users className="size-3.5" />
              {company.memberCount}명
            </span>
          </h3>
          <p className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            {company.address}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <User className="size-3.5" />
            {memberLabel}
          </span>
          <span className="flex items-center gap-1 font-semibold text-brand">
            <Wallet className="size-3.5" />
            {fmt(company.amount)}
          </span>
        </div>
      </Link>

      {/* 하단: 연관 건수 */}
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
        {countRow.map(({ key, label }) => (
          <li key={key}>
            {label}(
            <span className="font-semibold text-foreground">
              {fmt(counts[key])}
            </span>
            )
          </li>
        ))}
      </ul>
    </article>
  );
}
