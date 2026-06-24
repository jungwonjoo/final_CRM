import Link from "next/link";
import {
  CalendarDays,
  Building2,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { CardActionsMenu } from "@/components/common/card-actions-menu";
import { cn } from "@/lib/utils";
import type { Support, SupportStatus } from "@/lib/types";

const STATUS_STYLE: Record<SupportStatus, string> = {
  처리중: "bg-amber-50 text-amber-700",
  완료: "bg-emerald-50 text-emerald-600",
};

function Meta({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <span className="flex w-16 flex-col items-center gap-1 text-xs text-muted-foreground">
      <Icon className="size-4" />
      <span className="max-w-full truncate text-foreground">{value}</span>
    </span>
  );
}

export function SupportCard({ support: s }: { support: Support }) {
  return (
    <article className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold">
            <Link href={`/support/${s.id}`} className="hover:underline">
              {s.title}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays className="size-3.5 shrink-0" />
            {s.startDate} ~ {s.endDate}
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-3">
          <Meta icon={Building2} value={s.company} />
          <Meta icon={UserRoundCheck} value={s.contact} />
          <span className="flex w-16 flex-col items-center gap-1 text-xs">
            <span
              className={cn(
                "rounded-md px-2 py-0.5 font-medium",
                STATUS_STYLE[s.status]
              )}
            >
              {s.status}
            </span>
          </span>
          <CardActionsMenu detailHref={`/support/${s.id}`} />
        </div>
      </div>
    </article>
  );
}
