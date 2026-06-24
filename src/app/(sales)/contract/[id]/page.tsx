import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { ContractForm } from "@/components/contract/contract-form";
import { ContractItems } from "@/components/contract/contract-items";
import { FeedbackSection } from "@/components/company/feedback-section";
import { getContract } from "@/lib/mock-data";

export const metadata = { title: "계약 상세 · FingerSales" };

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contract = getContract(id);
  if (!contract) notFound();

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/contract" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/contract" className="hover:text-foreground">
          계약
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{contract.title}</span>
      </nav>

      <ContractForm contract={contract} />

      <ContractItems />

      <FeedbackSection
        title="의견"
        addLabel="의견"
        icon="message"
        initialItems={[
          {
            id: "c1",
            author: "담당자",
            at: "9999.99.99 00:00:00",
            text: "계약서 검토 완료.",
          },
        ]}
      />
    </div>
  );
}
