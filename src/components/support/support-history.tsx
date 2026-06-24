import { Clock } from "lucide-react";

interface HistoryEntry {
  id: string;
  text: string; // 처리 내용
  meta: string; // [일시] 부서 - 담당자 ▶ 거래처 - 고객명
}

const SEED: HistoryEntry[] = [
  {
    id: "h1",
    text: "담당자에 의한 종결",
    meta: "[2026-06-22 11:08:03] 기술연구소 - 김도원 ▶ 한국야금 - 황부장",
  },
  {
    id: "h2",
    text: "최초할당 : 영업담당자 (기술연구소 - 김도원)",
    meta: "[2026-06-20 11:07:19] 기술연구소 - 김도원 ▶ 기술연구소 - 김도원",
  },
  {
    id: "h3",
    text: "고객 접수 요청",
    meta: "[2026-06-20 11:07:19] 한국야금 - 황부장 ▶ 기술연구소 - 김도원",
  },
];

export function SupportHistory({ entries = SEED }: { entries?: HistoryEntry[] }) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <h3 className="mb-3 border-b pb-2.5 text-sm font-semibold">처리내역</h3>
      <ul className="flex flex-col gap-3">
        {entries.length === 0 && (
          <li className="py-6 text-center text-sm text-muted-foreground">
            처리내역이 없습니다.
          </li>
        )}
        {entries.map((e) => (
          <li key={e.id} className="flex gap-3">
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Clock className="size-3.5" />
            </span>
            <div className="min-w-0 rounded-lg border bg-muted/30 px-3 py-2">
              <p className="text-sm">{e.text}</p>
              <p className="mt-1 text-xs text-muted-foreground">{e.meta}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
