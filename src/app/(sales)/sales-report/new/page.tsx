import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { SalesReportForm } from "@/components/sales-report/sales-report-form";
import { FeedbackSection } from "@/components/company/feedback-section";

export const metadata = { title: "영업보고 등록 · FingerSales" };

export default function SalesReportNewPage() {
  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/sales-report" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <span>영업도구</span>
        <ChevronRight className="size-3.5" />
        <Link href="/sales-report" className="hover:text-foreground">
          영업보고
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">신규등록</span>
      </nav>

      <SalesReportForm />

      <FeedbackSection title="의견" addLabel="의견" icon="message" />
    </div>
  );
}
