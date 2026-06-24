import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { ProceedingForm } from "@/components/proceedings/proceeding-form";
import { AttachmentBox } from "@/components/common/attachment-box";

export const metadata = { title: "회의록 등록 · FingerSales" };

export default function ProceedingNewPage() {
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
        <span className="text-foreground">신규등록</span>
      </nav>

      <ProceedingForm />

      <AttachmentBox title="첨부자료" />
    </div>
  );
}
