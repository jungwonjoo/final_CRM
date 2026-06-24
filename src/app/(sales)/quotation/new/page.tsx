import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { QuotationForm } from "@/components/quotation/quotation-form";
import { FeedbackSection } from "@/components/company/feedback-section";

export const metadata = { title: "견적 등록 · FingerSales" };

export default function QuotationNewPage() {
  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/quotation" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/quotation" className="hover:text-foreground">
          견적
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">신규등록</span>
      </nav>

      <QuotationForm />

      <FeedbackSection title="의견" addLabel="의견" icon="message" />
    </div>
  );
}
