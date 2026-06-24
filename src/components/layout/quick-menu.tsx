import Link from "next/link";
import { Calendar, Plus, Users, Briefcase, Mail } from "lucide-react";

const QUICK_ITEMS: {
  icon: typeof Calendar;
  label: string;
  href?: string;
}[] = [
  { icon: Calendar, label: "일정" },
  { icon: Plus, label: "등록" },
  { icon: Users, label: "고객", href: "/contact" },
  { icon: Briefcase, label: "영업기회", href: "/opportunity" },
  { icon: Mail, label: "메일" },
];

const ITEM_CLASS =
  "flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-brand";

/** 스크롤을 따라다니는 좌측 고정 퀵메뉴 (md 이상에서 노출) */
export function QuickMenu() {
  return (
    <nav
      aria-label="퀵 메뉴"
      className="fixed left-4 top-[179px] z-40 hidden flex-col items-center gap-0.5 rounded-full border bg-card p-1.5 shadow-lg md:flex"
    >
      {QUICK_ITEMS.map(({ icon: Icon, label, href }) =>
        href ? (
          <Link
            key={label}
            href={href}
            title={label}
            aria-label={label}
            className={ITEM_CLASS}
          >
            <Icon className="size-[18px]" />
          </Link>
        ) : (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            className={ITEM_CLASS}
          >
            <Icon className="size-[18px]" />
          </button>
        )
      )}
    </nav>
  );
}
