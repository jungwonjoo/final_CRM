import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { SupportForm } from "@/components/support/support-form";

export const metadata = { title: "고객지원 등록 · FingerSales" };

export default function SupportNewPage() {
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
        <span className="text-foreground">신규등록</span>
      </nav>

      <SupportForm />
    </div>
  );
}
