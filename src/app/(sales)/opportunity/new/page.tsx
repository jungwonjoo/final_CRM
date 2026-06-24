import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { OpportunityForm } from "@/components/opportunity/opportunity-form";
import { FeedbackSection } from "@/components/company/feedback-section";

export const metadata = { title: "영업기회 등록 · FingerSales" };

export default function OpportunityNewPage() {
  return (
    <div className="flex flex-col gap-4">
      {/* breadcrumb */}
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/opportunity" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/opportunity" className="hover:text-foreground">
          영업기회
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">신규등록</span>
      </nav>

      <OpportunityForm />

      {/* 의견 / 메모 (신규라 비어있음) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FeedbackSection title="의견" addLabel="의견" icon="message" />
        <FeedbackSection title="메모" addLabel="메모" icon="note" />
      </div>
    </div>
  );
}
