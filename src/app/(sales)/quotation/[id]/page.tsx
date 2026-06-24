import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { QuotationForm } from "@/components/quotation/quotation-form";
import { FeedbackSection } from "@/components/company/feedback-section";
import { getQuotation } from "@/lib/mock-data";

export const metadata = { title: "견적 상세 · FingerSales" };

export default async function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quotation = getQuotation(id);
  if (!quotation) notFound();

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
        <span className="text-foreground">{quotation.title}</span>
      </nav>

      <QuotationForm quotation={quotation} />

      <FeedbackSection
        title="의견"
        addLabel="의견"
        icon="message"
        initialItems={[
          {
            id: "c1",
            author: "담당자",
            at: "9999.99.99 00:00:00",
            text: "견적 단가 재검토 요청.",
          },
        ]}
      />
    </div>
  );
}
