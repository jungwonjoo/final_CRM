import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { ProceedingForm } from "@/components/proceedings/proceeding-form";
import { AttachmentBox } from "@/components/common/attachment-box";
import { getProceeding } from "@/lib/mock-data";

export const metadata = { title: "회의록 상세 · FingerSales" };

export default async function ProceedingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proceeding = getProceeding(id);
  if (!proceeding) notFound();

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/proceedings" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <span>영업도구</span>
        <ChevronRight className="size-3.5" />
        <Link href="/proceedings" className="hover:text-foreground">
          회의록
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="max-w-[40ch] truncate text-foreground">{proceeding.title}</span>
      </nav>

      <ProceedingForm proceeding={proceeding} />

      <AttachmentBox title="첨부자료" />
    </div>
  );
}
