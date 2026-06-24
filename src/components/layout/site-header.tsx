"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, Power, Hand } from "lucide-react";
import { mainNav } from "@/lib/nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobalSearchDialog } from "@/components/layout/global-search-dialog";
import { NotificationBell } from "@/components/layout/notification-bell";
import { MobileNav } from "@/components/layout/mobile-nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      {/* 1행: 로고 + 우측 아이콘 */}
      <div className="flex h-14 items-center gap-4 px-5">
        {/* 태블릿 이하: 햄버거 → 좌측 드로어 메뉴 */}
        <MobileNav />

        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-brand text-primary-foreground">
            <Hand className="size-4" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[9px] font-medium tracking-wide text-muted-foreground">
              CRM FOR BUSINESS SALES
            </span>
            <span className="text-base font-bold tracking-tight">FINGER SALES</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          {/* Sales 서비스 전환 pill — 다른 서비스(Status/Reports) 추가 전까지 숨김
          <DropdownMenu>
            <DropdownMenuTrigger className="mr-2 flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-sm font-medium text-primary-foreground outline-none">
              <span className="size-1.5 rounded-full bg-primary-foreground" />
              Sales
              <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {serviceNav.map((s) => (
                <DropdownMenuItem key={s.label} render={<Link href={s.href} />}>
                  {s.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          */}

          {/* 통합검색 */}
          <GlobalSearchDialog trigger={<Search className="size-[18px]" />} />

          {/* 알림 */}
          <NotificationBell />

          {/* 내 정보 → 마이페이지 */}
          <Link
            href="/mypage"
            title="내 정보"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <User className="size-[18px]" />
          </Link>

          {/* 로그아웃 → 로그인 페이지 */}
          <Link
            href="/login"
            title="로그아웃"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Power className="size-[18px]" />
          </Link>

          {/* 사용자 */}
          <div className="ml-2 flex items-center gap-2 border-l pl-3">
            <div className="flex flex-col items-end leading-tight">
              <span className="text-[10px] text-muted-foreground">기술연구소</span>
              <span className="text-xs font-semibold">김지원 대리</span>
            </div>
            <span className="flex size-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-primary-foreground">
              김
            </span>
          </div>
        </div>
      </div>

      {/* 2행: 탭 메뉴 (데스크탑 전용 — 태블릿 이하는 햄버거 드로어) */}
      <nav className="hidden items-center gap-1 px-5 lg:flex">
        {mainNav.map((item) => {
          const active = item.href
            ? pathname.startsWith(item.href)
            : item.children?.some((c) => pathname.startsWith(c.href));

          if (item.children) {
            return (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger
                  className={cn(
                    "flex items-center gap-1 border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground",
                    active && "border-brand text-foreground"
                  )}
                >
                  {item.label}
                  <span className="text-brand">+</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {item.children.map((c) => (
                    <DropdownMenuItem key={c.href} render={<Link href={c.href} />}>
                      {c.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                active && "border-brand font-semibold text-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
