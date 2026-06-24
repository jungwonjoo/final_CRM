"use client";

import Link from "next/link";
import { MoreVertical, Eye, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** 리스트 카드 우상단 "더보기" 메뉴 (목업: 삭제는 알림만) */
export function CardActionsMenu({ detailHref }: { detailHref: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title="더보기"
        className="-mr-1 flex size-7 items-center justify-center rounded text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground"
      >
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<Link href={detailHref} />}>
          <Eye />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => alert("삭제 기능은 준비 중입니다.")}
        >
          <Trash2 />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
