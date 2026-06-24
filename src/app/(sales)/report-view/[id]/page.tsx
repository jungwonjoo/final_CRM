import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight, List, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackSection } from "@/components/company/feedback-section";
import { AttachmentBox } from "@/components/common/attachment-box";
import { RelatedOpportunities } from "@/components/report-view/related-opportunities";
import { getSalesReport, opportunities } from "@/lib/mock-data";

export const metadata = { title: "영업보고현황 상세 · FingerSales" };

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[6rem_1fr] border-b last:border-b-0">
      <span className="border-r bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">{label}</span>
      <span className="px-3 py-2.5 text-sm">{value}</span>
    </div>
  );
}

export default async function ReportViewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = getSalesReport(id);
  if (!r) notFound();

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/report-view" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <span>영업도구</span>
        <ChevronRight className="size-3.5" />
        <Link href="/report-view" className="hover:text-foreground">
          영업보고현황
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">보고일 : {r.reportDate}</span>
      </nav>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">영업보고현황</h1>
          <span className="text-sm text-muted-foreground">( {r.template} )</span>
          {r.submitted && (
            <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="size-3.5" />
              제출됨
            </span>
          )}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5"
          nativeButton={false}
          render={<Link href="/report-view" />}
        >
          <List className="size-4" />
          목록
        </Button>
      </div>

      {/* 보고 정보 (읽기 전용) */}
      <section className="overflow-hidden rounded-xl border bg-card">
        <Row label="보고자" value={`${r.dept} / ${r.author}`} />
        <Row label="보고일" value={r.reportDate} />
        <Row label="기간" value={`${r.startDate} ~ ${r.endDate}`} />
        <Row label="제출상태" value={r.submitted ? "제출 완료" : "미제출"} />
      </section>

      {/* 내용 (읽기 전용) */}
      <section className="rounded-xl border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold">내용</h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {r.dept} {r.author}의 {r.startDate} ~ {r.endDate} 기간 영업 활동 보고입니다.
          주요 영업기회 진행 현황과 고객 미팅 결과, 다음 주 추진 계획을 정리하였습니다.
        </p>
      </section>

      {/* 진행중 영업기회 */}
      <RelatedOpportunities initial={opportunities.slice(0, 1)} />

      {/* 의견 + 첨부자료 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FeedbackSection title="의견" addLabel="의견" icon="message" />
        <AttachmentBox title="첨부자료" />
      </div>
    </div>
  );
}
