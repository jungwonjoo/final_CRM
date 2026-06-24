import { CompanyDetailClient } from "@/components/company/company-detail-client";
import { getCompany } from "@/lib/mock-data";

export const metadata = { title: "고객사 상세 · FingerSales" };

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // 정적 목업에 있으면 전달, 없으면 클라이언트가 localStorage 빠른등록분을 조회
  const initial = getCompany(id) ?? null;
  return <CompanyDetailClient id={id} initial={initial} />;
}
