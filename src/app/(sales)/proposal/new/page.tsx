import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { ProposalForm } from "@/components/proposal/proposal-form";
import { RelatedContacts } from "@/components/proposal/related-contacts";
import { FeedbackSection } from "@/components/company/feedback-section";

export const metadata = { title: "제안 등록 · FingerSales" };

export default function ProposalNewPage() {
  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/proposal" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/proposal" className="hover:text-foreground">
          제안
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">신규등록</span>
      </nav>

      <ProposalForm />

      <RelatedContacts />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FeedbackSection title="의견" addLabel="의견" icon="message" />
        <FeedbackSection title="메모" addLabel="메모" icon="note" />
      </div>
    </div>
  );
}
