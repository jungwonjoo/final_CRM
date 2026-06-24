import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { CompanyForm } from "@/components/company/company-form";
import { FeedbackSection } from "@/components/company/feedback-section";
import { ContactAddSection } from "@/components/company/contact-add-section";

export const metadata = { title: "고객사 등록 · FingerSales" };

export default function CompanyNewPage() {
  return (
    <div className="flex flex-col gap-4">
      {/* breadcrumb */}
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/company" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/company" className="hover:text-foreground">
          고객사
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">신규등록</span>
      </nav>

      <CompanyForm />

      {/* 의견 / 메모 / 고객 추가 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <FeedbackSection title="의견" addLabel="의견" icon="message" />
        <FeedbackSection title="메모" addLabel="메모" icon="note" />
        <ContactAddSection />
      </div>
    </div>
  );
}
