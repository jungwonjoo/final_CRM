import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { ContractForm } from "@/components/contract/contract-form";
import { ContractItems } from "@/components/contract/contract-items";
import { FeedbackSection } from "@/components/company/feedback-section";

export const metadata = { title: "계약 등록 · FingerSales" };

export default function ContractNewPage() {
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
        <span className="text-foreground">신규등록</span>
      </nav>

      <ContractForm />

      <ContractItems initial={[]} />

      <FeedbackSection title="의견" addLabel="의견" icon="message" />
    </div>
  );
}
