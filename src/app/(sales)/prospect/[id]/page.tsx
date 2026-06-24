import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { ProspectForm } from "@/components/prospect/prospect-form";
import { getProspect } from "@/lib/mock-data";

export const metadata = { title: "잠재고객 상세 · FingerSales" };

export default async function ProspectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prospect = getProspect(id);
  if (!prospect) notFound();

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/prospect" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <span>영업관리</span>
        <ChevronRight className="size-3.5" />
        <Link href="/prospect" className="hover:text-foreground">
          잠재고객
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{prospect.name}</span>
      </nav>

      <ProspectForm prospect={prospect} />
    </div>
  );
}
