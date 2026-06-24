import { Calendar, Plus, Users, Briefcase, Mail } from "lucide-react";

const QUICK_ITEMS = [
  { icon: Calendar, label: "일정" },
  { icon: Plus, label: "등록" },
  { icon: Users, label: "고객" },
  { icon: Briefcase, label: "영업기회" },
  { icon: Mail, label: "메일" },
];

/** 스크롤을 따라다니는 좌측 고정 퀵메뉴 (md 이상에서 노출) */
export function QuickMenu() {
  return (
    <nav
      aria-label="퀵 메뉴"
      className="fixed left-4 top-[179px] z-40 hidden flex-col items-center gap-1 rounded-full border bg-card p-2 shadow-lg md:flex"
    >
      {QUICK_ITEMS.map(({ icon: Icon, label }) => (
        <button
          key={label}
          type="button"
          title={label}
          aria-label={label}
          className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
        >
          <Icon className="size-5" />
        </button>
      ))}
    </nav>
  );
}
