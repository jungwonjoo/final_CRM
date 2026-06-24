import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { ProposalForm } from "@/components/proposal/proposal-form";
import { RelatedContacts } from "@/components/proposal/related-contacts";
import { FeedbackSection } from "@/components/company/feedback-section";
import { getProposal, contacts } from "@/lib/mock-data";

export const metadata = { title: "제안 상세 · FingerSales" };

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proposal = getProposal(id);
  if (!proposal) notFound();

  const related = contacts.filter((c) => c.name === proposal.contact);

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
        <span className="text-foreground">{proposal.title}</span>
      </nav>

      <ProposalForm proposal={proposal} />

      <RelatedContacts initial={related} />

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
              text: "제안서 1차 검토 완료.",
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
              text: "발표 자료 보완 필요.",
            },
          ]}
        />
      </div>
    </div>
  );
}
