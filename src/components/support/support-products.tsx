"use client";

import { useState } from "react";
import { Save, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductSelectDialog } from "@/components/quotation/product-select-dialog";
import type { Product } from "@/lib/types";

interface SItem {
  id: string;
  name: string;
  packQty: number; // 포장수량
  spec: string; // 규격
  note: string; // 비고
}

let seq = 0;
const SEED: SItem[] = [
  { id: "sp1", name: "서버 라이선스", packQty: 1, spec: "USER", note: "" },
  { id: "sp2", name: "사용자 라이선스", packQty: 1, spec: "USER", note: "" },
];

export function SupportProducts({ initial = SEED }: { initial?: SItem[] }) {
  const [items, setItems] = useState<SItem[]>(initial);
  const [open, setOpen] = useState(true);

  const add = (sel: Product[]) =>
    setItems((prev) => [
      ...prev,
      ...sel.map((p) => ({
        id: `new-${++seq}`,
        name: p.name,
        packQty: p.packQty,
        spec: p.spec,
        note: "",
      })),
    ]);
  const remove = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));
  const patch = (id: string, p: Partial<SItem>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...p } : it)));

  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between border-b pb-2.5">
        <h3 className="text-sm font-semibold">
          제품 <span className="font-normal text-muted-foreground">({items.length})</span>
        </h3>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ProductSelectDialog onAdd={add} />
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
          {items.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              제품이 없습니다. + 버튼으로 제품을 선택하세요.
            </p>
          )}
          {items.map((it) => (
            <div key={it.id}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{it.name}</span>
                <button
                  type="button"
                  onClick={() => remove(it.id)}
                  title="삭제"
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="overflow-hidden rounded-lg border text-sm">
                <div className="grid grid-cols-[7rem_1fr_7rem_1fr] border-b">
                  <span className="border-r bg-muted/40 px-3 py-2 text-center text-muted-foreground">
                    포장수량
                  </span>
                  <span className="border-r px-3 py-2">{it.packQty}</span>
                  <span className="border-r bg-muted/40 px-3 py-2 text-center text-muted-foreground">
                    규격
                  </span>
                  <span className="px-3 py-2">{it.spec || "-"}</span>
                </div>
                <div className="grid grid-cols-[7rem_1fr]">
                  <span className="border-r bg-muted/40 px-3 py-2 text-center text-muted-foreground">
                    비고
                  </span>
                  <div className="p-1.5">
                    <Input
                      value={it.note}
                      onChange={(e) => patch(it.id, { note: e.target.value })}
                      placeholder="비고를 입력하세요"
                      className="h-8 border-0 shadow-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
