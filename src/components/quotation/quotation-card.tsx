import Link from "next/link";
import {
  CalendarDays,
  Building2,
  UserRound,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { CardActionsMenu } from "@/components/common/card-actions-menu";
import type { Quotation } from "@/lib/types";

const fmt = (n: number) => n.toLocaleString("ko-KR");

function Meta({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <span className="flex w-16 flex-col items-center gap-1 text-xs text-muted-foreground">
      <Icon className="size-4" />
      <span className="max-w-full truncate text-foreground">{value}</span>
    </span>
  );
}

export function QuotationCard({ quotation: q }: { quotation: Quotation }) {
  return (
    <article className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold">
            <Link href={`/quotation/${q.id}`} className="hover:underline">
              {q.title}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays className="size-3.5 shrink-0" />
            {q.startDate} ~ {q.endDate}
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-3">
          <Meta icon={Building2} value={q.company} />
          <Meta icon={UserRoundCheck} value={q.contact} />
          <Meta icon={UserRound} value={q.owner} />
          <CardActionsMenu detailHref={`/quotation/${q.id}`} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-2.5 text-xs text-muted-foreground">
        <span>
          견적금액 (<span className="text-foreground">{fmt(q.amount)}</span>)
        </span>
        <span>
          수량 (<span className="text-foreground">{q.qty}</span> 개)
        </span>
        <span>
          합계 (<span className="font-semibold text-brand">{fmt(q.total)}</span>)
        </span>
      </div>
    </article>
  );
}
