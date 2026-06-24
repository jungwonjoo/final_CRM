import Link from "next/link";
import {
  Building2,
  CalendarDays,
  UserRound,
  Mail,
  Smartphone,
  Phone,
} from "lucide-react";
import { CardActionsMenu } from "@/components/common/card-actions-menu";
import { cn } from "@/lib/utils";
import type { Prospect, ProspectStatus } from "@/lib/types";

const STATUS_STYLE: Record<ProspectStatus, string> = {
  미접촉: "bg-slate-100 text-slate-600",
  접촉중: "bg-blue-50 text-blue-600",
  접촉금지: "bg-red-50 text-red-600",
  고객전환: "bg-emerald-50 text-emerald-600",
};

export function ProspectCard({ prospect: p }: { prospect: Prospect }) {
  return (
    <article className="overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="flex flex-wrap items-center gap-1.5 font-semibold">
              <Link href={`/prospect/${p.id}`} className="hover:underline">
                {p.name}
              </Link>
              <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                ( <Building2 className="size-3" /> {p.company} )
              </span>
            </h3>
          </div>

          <div className="flex shrink-0 items-start gap-3">
            <span className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="size-4" />
              <span className="text-foreground">{p.registeredAt}</span>
            </span>
            <span className="flex w-16 flex-col items-center gap-1 text-xs text-muted-foreground">
              <UserRound className="size-4" />
              <span className="max-w-full truncate text-foreground">{p.owner}</span>
            </span>
            <span className="flex flex-col items-center gap-1 text-xs">
              <span
                className={cn("rounded-md px-2 py-0.5 font-medium", STATUS_STYLE[p.status])}
              >
                {p.status}
              </span>
            </span>
            <CardActionsMenu detailHref={`/prospect/${p.id}`} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">
        <a href={`mailto:${p.email}`} className="flex items-center gap-1 hover:text-foreground">
          <Mail className="size-3.5" />
          {p.email}
        </a>
        <a href={`tel:${p.mobile}`} className="flex items-center gap-1 hover:text-foreground">
          <Smartphone className="size-3.5" />
          {p.mobile}
        </a>
        <a href={`tel:${p.phone}`} className="flex items-center gap-1 hover:text-foreground">
          <Phone className="size-3.5" />
          {p.phone}
        </a>
      </div>
    </article>
  );
}
