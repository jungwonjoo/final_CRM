import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { ActivityForm } from "@/components/activity/activity-form";
import { AttachmentBox } from "@/components/common/attachment-box";

export const metadata = { title: "영업활동 등록 · FingerSales" };

export default function ActivityNewPage() {
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
        <span className="text-foreground">신규등록</span>
      </nav>

      <ActivityForm />

      <AttachmentBox title="첨부자료" />
    </div>
  );
}
