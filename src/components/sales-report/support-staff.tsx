"use client";

import { useState } from "react";
import { Save, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParticipantSelectDialog } from "@/components/chatter/participant-select-dialog";
import { employees } from "@/lib/mock-data";

const ROLES = ["영업", "기술지원", "기타"];
const ME = "김지원"; // 등록자 (현재 사용자)

interface Staff {
  id: string;
  name: string;
  dept: string;
  position: string;
  role: string; // 역할구분
  registrar: string; // 등록자
}

let seq = 0;
const SEED: Staff[] = [
  { id: "st1", name: "연경현", dept: "기술연구소", position: "차장", role: "영업", registrar: ME },
];

export function SupportStaff({ initial = SEED }: { initial?: Staff[] }) {
  const [list, setList] = useState<Staff[]>(initial);
  const [open, setOpen] = useState(true);

  const add = (names: string[]) =>
    setList((prev) => {
      const additions = names
        .map((n) => employees.find((e) => e.name === n))
        .filter((e): e is NonNullable<typeof e> => !!e)
        .filter((e) => !prev.some((s) => s.name === e.name))
        .map((e) => ({
          id: `new-${++seq}`,
          name: e.name,
          dept: e.dept,
          position: e.position,
          role: "영업",
          registrar: ME,
        }));
      return [...prev, ...additions];
    });
  const remove = (id: string) => setList((prev) => prev.filter((s) => s.id !== id));
  const patch = (id: string, role: string) =>
    setList((prev) => prev.map((s) => (s.id === id ? { ...s, role } : s)));

  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between border-b pb-2.5">
        <h3 className="text-sm font-semibold">
          지원인력 <span className="font-normal text-muted-foreground">({list.length})</span>
        </h3>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ParticipantSelectDialog
            existing={list.map((s) => s.name)}
            onAdd={add}
            title="담당자"
          />
          <button
            type="button"
            onClick={() => alert("저장되었습니다.")}
            title="저장"
            className="flex size-6 items-center justify-center rounded transition-colors hover:bg-muted hover:text-brand"
          >
            <Save className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            title={open ? "접기" : "펼치기"}
            className="flex size-6 items-center justify-center rounded transition-colors hover:bg-muted hover:text-foreground"
          >
            {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-4 pt-4">
          {list.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              지원인력이 없습니다. + 버튼으로 담당자를 선택하세요.
            </p>
          )}
          {list.map((s) => (
            <div key={s.id}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">
                  {s.name}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    ({s.dept} / {s.position})
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  title="삭제"
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-[7rem_1fr_7rem_1fr] overflow-hidden rounded-lg border text-sm">
                <span className="border-r bg-muted/40 px-3 py-2 text-center text-muted-foreground">
                  역할구분
                </span>
                <div className="border-r p-1.5">
                  <Select value={s.role} onValueChange={(v) => v && patch(s.id, v)}>
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <span className="border-r bg-muted/40 px-3 py-2 text-center text-muted-foreground">
                  등록자
                </span>
                <span className="px-3 py-2">{s.registrar}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
