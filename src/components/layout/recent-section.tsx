"use client";

import { Clock } from "lucide-react";
import { RecentPanel } from "@/components/layout/recent-panel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { RecentItem } from "@/lib/types";

export function RecentSection({
  registered,
  searched,
}: {
  registered: RecentItem[];
  searched: RecentItem[];
}) {
  return (
    <>
      {/* 데스크탑(lg+): 우측 컬럼 인라인 */}
      <div className="hidden lg:block">
        <RecentPanel registered={registered} searched={searched} />
      </div>

      {/* 모바일/태블릿: 우하단 플로팅 버튼 → PC와 동일한 카드 팝오버 */}
      <div className="lg:hidden">
        <Popover>
          <PopoverTrigger
            title="최근등록/검색"
            className="fixed bottom-5 right-5 z-50 flex size-12 items-center justify-center rounded-full bg-brand text-primary-foreground shadow-lg outline-none transition-transform hover:scale-105"
          >
            <Clock className="size-5" />
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            sideOffset={12}
            className="w-[270px] max-h-[75dvh] overflow-y-auto border-0 bg-transparent p-0 shadow-none"
          >
            <div className="drop-shadow-xl">
              <RecentPanel registered={registered} searched={searched} />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
