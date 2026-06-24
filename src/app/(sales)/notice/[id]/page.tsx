import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { NoticeForm } from "@/components/notice/notice-form";
import { FeedbackSection } from "@/components/company/feedback-section";
import { AttachmentBox } from "@/components/common/attachment-box";
import { getNotice } from "@/lib/mock-data";

export const metadata = { title: "영업공지 상세 · FingerSales" };

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const notice = getNotice(id);
  if (!notice) notFound();

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/notice" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <span>영업도구</span>
        <ChevronRight className="size-3.5" />
        <Link href="/notice" className="hover:text-foreground">
          영업공지
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="max-w-[40ch] truncate text-foreground">{notice.title}</span>
      </nav>

      <NoticeForm notice={notice} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FeedbackSection title="의견" addLabel="의견" icon="message" />
        <AttachmentBox title="첨부자료" />
      </div>
    </div>
  );
}
