import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { ActivityForm } from "@/components/activity/activity-form";
import { ProceedingsAttachBox } from "@/components/activity/proceedings-attach-box";
import { RelatedProducts } from "@/components/activity/related-products";
import { SalesTimeline } from "@/components/company/sales-timeline";
import { AttachmentBox } from "@/components/common/attachment-box";
import { getActivity, getActivitySalesEvents } from "@/lib/mock-data";

export const metadata = { title: "영업활동 상세 · FingerSales" };

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = getActivity(id);
  if (!activity) notFound();

  const salesEvents = getActivitySalesEvents(activity);

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/activity" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/activity" className="hover:text-foreground">
          영업활동
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="max-w-[40ch] truncate text-foreground">{activity.title}</span>
      </nav>

      <ActivityForm activity={activity} />

      <SalesTimeline events={salesEvents} />

      <RelatedProducts />

      <ProceedingsAttachBox />

      <AttachmentBox title="첨부자료" />
    </div>
  );
}
