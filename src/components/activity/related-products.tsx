"use client";

import { useState } from "react";
import { Save, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { ProductSelectDialog } from "@/components/quotation/product-select-dialog";
import type { Product } from "@/lib/types";

let seq = 0;
const fmt = (n: number) => n.toLocaleString("ko-KR");

interface RItem {
  id: string;
  name: string;
  packQty: number; // 포장수량
  spec: string; // 규격
  price: number; // 단가
}

export function RelatedProducts() {
  const [items, setItems] = useState<RItem[]>([]);
  const [open, setOpen] = useState(true);

  const add = (sel: Product[]) =>
    setItems((prev) => [
      ...prev,
      ...sel.map((p) => ({
        id: `rp-${++seq}`,
        name: p.name,
        packQty: p.packQty,
        spec: p.spec,
        price: p.price,
      })),
    ]);
  const remove = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));

  return (
    <section className="flex flex-col rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 border-b pb-2.5">
        <h3 className="text-sm font-semibold">연관제품 ({items.length})</h3>
        <div className="ml-auto flex items-center gap-1 text-muted-foreground">
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

      {open &&
        (items.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            제품 다중선택 팝업에서 제품을 선택하세요.
          </p>
        ) : (
          <ul className="flex flex-col divide-y">
            {items.map((it) => (
              <li key={it.id} className="flex items-center gap-2 py-2.5">
                <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                <span className="min-w-0 flex-1 truncate text-sm">
                  {it.name} / {it.packQty} / {it.spec || "-"} / {fmt(it.price)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(it.id)}
                  title="삭제"
                  className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}
