import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { OrderForm } from "@/components/order/order-form";
import { getOrder } from "@/lib/mock-data";

export const metadata = { title: "매출 상세 · FingerSales" };

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/order" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <span>영업관리</span>
        <ChevronRight className="size-3.5" />
        <Link href="/order" className="hover:text-foreground">
          매출
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{order.customer}</span>
      </nav>

      <OrderForm order={order} />
    </div>
  );
}
