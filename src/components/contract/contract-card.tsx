import Link from "next/link";
import {
  CalendarDays,
  MoreVertical,
  Building2,
  UserRound,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import type { Contract } from "@/lib/types";

const fmt = (n: number) => n.toLocaleString("ko-KR");

function Meta({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <span className="flex w-16 flex-col items-center gap-1 text-xs text-muted-foreground">
      <Icon className="size-4" />
      <span className="max-w-full truncate text-foreground">{value}</span>
    </span>
  );
}

export function ContractCard({ contract: c }: { contract: Contract }) {
  return (
    <article className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold">
            <Link href={`/contract/${c.id}`} className="hover:underline">
              {c.title}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays className="size-3.5 shrink-0" />
            계약일 {c.contractDate}
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-3">
          <Meta icon={Building2} value={c.company} />
          <Meta icon={UserRoundCheck} value={c.contact} />
          <Meta icon={UserRound} value={c.owner} />
          <button
            type="button"
            title="더보기"
            className="-mr-1 flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <MoreVertical className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t pt-2.5 text-xs text-muted-foreground">
        <span>
          계약제품 (
          <span className="text-foreground">
            {c.product}
            {c.productCount > 0 && ` 외 ${c.productCount}`}
          </span>
          )
        </span>
        <span>
          계약금액 (<span className="font-semibold text-brand">{fmt(c.amount)}</span>)
        </span>
        <span>
          계약기간 (
          <span className="text-foreground">
            {c.startDate} ~ {c.endDate}
          </span>
          )
        </span>
      </div>
    </article>
  );
}
