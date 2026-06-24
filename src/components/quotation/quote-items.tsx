"use client";

import { useState } from "react";
import { Save, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductSelectDialog } from "@/components/quotation/product-select-dialog";
import {
  type QuoteItem,
  sellPrice,
  itemTotal,
  productsToItems,
} from "@/lib/quote";

const fmt = (n: number) => n.toLocaleString("ko-KR");
const toNum = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function ReadValue({ value }: { value: string }) {
  return (
    <div className="flex h-8 items-center justify-end rounded-md bg-muted/50 px-2.5 text-sm">
      {value}
    </div>
  );
}

export function QuoteItems({
  items,
  onChange,
}: {
  items: QuoteItem[];
  onChange: (items: QuoteItem[]) => void;
}) {
  const [open, setOpen] = useState(true);

  const remove = (id: string) => onChange(items.filter((it) => it.id !== id));
  const patch = (id: string, p: Partial<QuoteItem>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...p } : it)));

  const totalQty = items.reduce((s, it) => s + it.qty, 0);
  const totalAmount = items.reduce((s, it) => s + itemTotal(it), 0);

  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between border-b pb-2.5">
        <h3 className="text-sm font-semibold">
          견적품목 <span className="font-normal text-muted-foreground">({items.length})</span>
        </h3>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ProductSelectDialog onAdd={(sel) => onChange([...items, ...productsToItems(sel)])} />
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
        <>
          <div className="flex flex-col gap-3 pt-3">
            {items.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                품목이 없습니다. + 버튼으로 제품을 선택하세요.
              </p>
            )}
            {items.map((it) => (
              <div key={it.id} className="rounded-lg border p-3">
                <div className="mb-2.5 flex items-center justify-between gap-2">
                  <Input
                    value={it.name}
                    onChange={(e) => patch(it.id, { name: e.target.value })}
                    placeholder="품목명"
                    className="h-8 max-w-xs border-0 px-0 font-medium shadow-none"
                  />
                  <button
                    type="button"
                    onClick={() => remove(it.id)}
                    title="삭제"
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
                  <Row label="단가">
                    <Input
                      value={fmt(it.unitPrice)}
                      onChange={(e) => patch(it.id, { unitPrice: toNum(e.target.value) })}
                      inputMode="numeric"
                      className="h-8 text-right"
                    />
                  </Row>
                  <Row label="수량">
                    <Input
                      value={String(it.qty)}
                      onChange={(e) => patch(it.id, { qty: toNum(e.target.value) })}
                      inputMode="numeric"
                      className="h-8 text-right"
                    />
                  </Row>
                  <Row label="할인 (%)">
                    <Input
                      value={String(it.discount)}
                      onChange={(e) => patch(it.id, { discount: toNum(e.target.value) })}
                      inputMode="numeric"
                      className="h-8 text-right"
                    />
                  </Row>
                  <Row label="포장수량 / 규격">
                    <ReadValue value={it.packSpec || "-"} />
                  </Row>
                  <Row label="판매단가">
                    <ReadValue value={fmt(sellPrice(it))} />
                  </Row>
                  <Row label="제안금액">
                    <ReadValue value={fmt(itemTotal(it))} />
                  </Row>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4 rounded-lg bg-muted/50 px-3 py-2.5 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">수량 합계</span>
              <span className="font-semibold">{totalQty}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">제안금액 합계</span>
              <span className="font-semibold text-brand">{fmt(totalAmount)}</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
