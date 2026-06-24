import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { MyPageClient } from "@/components/mypage/mypage-client";

export const metadata = { title: "마이페이지 · FingerSales" };

export default function MyPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/dashboard" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">마이페이지</span>
      </nav>

      <h1 className="text-lg font-bold">마이페이지</h1>

      <MyPageClient />
    </div>
  );
}
