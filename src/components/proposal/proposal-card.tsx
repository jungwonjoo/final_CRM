import Link from "next/link";
import {
  CalendarDays,
  MoreVertical,
  Building2,
  UserRound,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import type { Proposal } from "@/lib/types";

function Meta({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <span className="flex w-16 flex-col items-center gap-1 text-xs text-muted-foreground">
      <Icon className="size-4" />
      <span className="max-w-full truncate text-foreground">{value}</span>
    </span>
  );
}

export function ProposalCard({ proposal: p }: { proposal: Proposal }) {
  return (
    <article className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        {/* 좌: 제안명 + 기간 */}
        <div className="min-w-0">
          <h3 className="font-semibold">
            <Link href={`/proposal/${p.id}`} className="hover:underline">
              {p.title}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays className="size-3.5 shrink-0" />
            {p.startDate} ~ {p.endDate}
          </p>
        </div>

        {/* 우: 거래처 / 고객 / 담당자 */}
        <div className="flex shrink-0 items-start gap-3">
          <Meta icon={Building2} value={p.company} />
          <Meta icon={UserRoundCheck} value={p.contact} />
          <Meta icon={UserRound} value={p.owner} />
          <button
            type="button"
            title="더보기"
            className="-mr-1 flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <MoreVertical className="size-4" />
          </button>
        </div>
      </div>

      {/* 요청 / 제출 / 발표일 */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t pt-2.5 text-xs text-muted-foreground">
        <span>
          요청일 (<span className="text-foreground">{p.requestDate}</span>)
        </span>
        <span>
          제출일 (<span className="text-foreground">{p.submitDate}</span>)
        </span>
        <span>
          발표일 (<span className="text-foreground">{p.presentDate}</span>)
        </span>
      </div>
    </article>
  );
}
