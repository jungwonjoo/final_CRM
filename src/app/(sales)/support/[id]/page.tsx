import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { SupportForm } from "@/components/support/support-form";
import { SupportHistory } from "@/components/support/support-history";
import { SupportProducts } from "@/components/support/support-products";
import { getSupport } from "@/lib/mock-data";

export const metadata = { title: "고객지원 상세 · FingerSales" };

export default async function SupportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const support = getSupport(id);
  if (!support) notFound();

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/support" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <span>영업관리</span>
        <ChevronRight className="size-3.5" />
        <Link href="/support" className="hover:text-foreground">
          고객지원
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="max-w-[40ch] truncate text-foreground">{support.title}</span>
      </nav>

      <SupportForm support={support} />

      <SupportProducts />

      <SupportHistory />
    </div>
  );
}
