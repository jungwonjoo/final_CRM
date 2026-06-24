import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { ProspectForm } from "@/components/prospect/prospect-form";

export const metadata = { title: "잠재고객 등록 · FingerSales" };

export default function ProspectNewPage() {
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
        <span className="text-foreground">신규등록</span>
      </nav>

      <ProspectForm />
    </div>
  );
}
