import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { SalesReportForm } from "@/components/sales-report/sales-report-form";
import { RelatedContacts } from "@/components/proposal/related-contacts";
import { OpportunityProducts } from "@/components/sales-report/opportunity-products";
import { SupportStaff } from "@/components/sales-report/support-staff";
import { SalesTimeline } from "@/components/company/sales-timeline";
import { FeedbackSection } from "@/components/company/feedback-section";
import { getSalesReport, contacts, companySalesEvents } from "@/lib/mock-data";

// 영업보고 상세
export const metadata = { title: "영업보고 상세 · FingerSales" };

export default async function SalesReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = getSalesReport(id);
  if (!report) notFound();

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
        <span className="text-foreground">보고일 : {report.reportDate}</span>
      </nav>

      <SalesReportForm report={report} />

      <RelatedContacts initial={contacts.slice(0, 1)} />

      <OpportunityProducts />

      <SupportStaff />

      <SalesTimeline events={companySalesEvents} />

      <FeedbackSection
        title="의견"
        addLabel="의견"
        icon="message"
        initialItems={[
          {
            id: "sr1",
            author: report.author,
            at: "9999.99.99 00:00:00",
            text: "주간 영업 실적 보고 완료.",
          },
        ]}
      />
    </div>
  );
}
