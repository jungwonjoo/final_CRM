import { ContactDetailClient } from "@/components/contact/contact-detail-client";
import { getContact } from "@/lib/mock-data";

export const metadata = { title: "고객 상세 · FingerSales" };

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // 정적 목업에 있으면 전달, 없으면 클라이언트가 localStorage 빠른등록분을 조회
  const initial = getContact(id) ?? null;
  return <ContactDetailClient id={id} initial={initial} />;
}
