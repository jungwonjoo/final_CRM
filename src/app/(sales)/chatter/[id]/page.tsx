import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { ChatRoom } from "@/components/chatter/chat-room";
import { getChatter } from "@/lib/mock-data";

export const metadata = { title: "채터 · FingerSales" };

export default async function ChatterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chatter = getChatter(id);
  if (!chatter) notFound();

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <Home className="size-3.5" />
        <Link href="/chatter" className="hover:text-foreground">
          Sales
        </Link>
        <ChevronRight className="size-3.5" />
        <span>영업도구</span>
        <ChevronRight className="size-3.5" />
        <Link href="/chatter" className="hover:text-foreground">
          채터
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="max-w-[40ch] truncate text-foreground">{chatter.title}</span>
      </nav>

      <ChatRoom chatter={chatter} />
    </div>
  );
}
