import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { OpportunityForm } from "@/components/opportunity/opportunity-form";
import { FeedbackSection } from "@/components/company/feedback-section";
import { SalesTimeline } from "@/components/company/sales-timeline";
import { getOpportunity, companySalesEvents } from "@/lib/mock-data";

export const metadata = { title: "영업기회 상세 · FingerSales" };

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opp = getOpportunity(id);
  if (!opp) notFound();

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
        <span className="text-foreground">{opp.title}</span>
      </nav>

      <OpportunityForm opp={opp} />

      {/* 의견 / 메모 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FeedbackSection
          title="의견"
          addLabel="의견"
          icon="message"
          initialItems={[
            {
              id: "c1",
              author: "담당자",
              at: "9999.99.99 00:00:00",
              text: "초기 미팅 완료, 견적 요청 예정.",
            },
          ]}
        />
        <FeedbackSection
          title="메모"
          addLabel="메모"
          icon="note"
          initialItems={[
            {
              id: "m1",
              author: "담당자",
              at: "9999.99.99 00:00:00",
              text: "예산 검토 중.",
            },
          ]}
        />
      </div>

      {/* 영업현황 타임라인 */}
      <SalesTimeline events={companySalesEvents} />
    </div>
  );
}
