import { DashboardGrid } from "@/components/dashboard/dashboard-grid";

export const metadata = { title: "대시보드 · FingerSales" };

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="sr-only">대시보드</h1>
      <DashboardGrid />
    </div>
  );
}
