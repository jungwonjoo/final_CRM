import Link from "next/link";
import { CalendarDays, Building2, UserRound, type LucideIcon } from "lucide-react";
import { CardActionsMenu } from "@/components/common/card-actions-menu";
import type { Proceeding } from "@/lib/types";

function Meta({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <span className="flex w-16 flex-col items-center gap-1 text-xs text-muted-foreground">
      <Icon className="size-4" />
      <span className="max-w-full truncate text-foreground">{value}</span>
    </span>
  );
}

export function ProceedingCard({ proceeding: p }: { proceeding: Proceeding }) {
  return (
    <article className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold">
            <Link href={`/proceedings/${p.id}`} className="hover:underline">
              {p.title}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays className="size-3.5 shrink-0" />
            {p.date}
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-3">
          <Meta icon={Building2} value={p.company} />
          <Meta icon={UserRound} value={p.owner} />
          <CardActionsMenu detailHref={`/proceedings/${p.id}`} />
        </div>
      </div>
    </article>
  );
}
