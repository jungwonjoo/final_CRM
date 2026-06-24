"use client";

import { useState } from "react";
import { Save, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductSelectDialog } from "@/components/quotation/product-select-dialog";
import type { Product } from "@/lib/types";

export interface OItem {
  id: string;
  name: string;
  unitPrice: number;
  qty: number;
  deliveryDate: string; // 납품예정일
  note: string; // 비고
}

let seq = 0;
export const SEED_ITEMS: OItem[] = [
  { id: "oi1", name: "서버 라이선스", unitPrice: 10000, qty: 1, deliveryDate: "", note: "" },
  { id: "oi2", name: "사용자 라이선스", unitPrice: 10000, qty: 1, deliveryDate: "", note: "" },
];

const fmt = (n: number) => n.toLocaleString("ko-KR");
const toNum = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;
export const supplyOf = (it: OItem) => it.unitPrice * it.qty;

/** ProductSelectDialog 선택 결과를 매출품목으로 변환 */
export function productsToOrderItems(sel: Product[]): OItem[] {
  return sel.map((p) => ({
    id: `new-${++seq}`,
    name: p.name,
    unitPrice: p.price,
    qty: 1,
    deliveryDate: "",
    note: "",
  }));
}

/** 폼 상단 요약값 (수량/공급가액/세액/합계) — 세액은 공급가액의 10% */
export function summarizeOrder(items: OItem[]) {
  const totalQty = items.reduce((s, it) => s + it.qty, 0);
  const supplyTotal = items.reduce((s, it) => s + supplyOf(it), 0);
  const tax = Math.round(supplyTotal * 0.1);
  return { totalQty, supplyTotal, tax, grandTotal: supplyTotal + tax };
}

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

export function OrderItems({
  items,
  onChange,
}: {
  items: OItem[];
  onChange: (items: OItem[]) => void;
}) {
  const [open, setOpen] = useState(true);

  const add = (sel: Product[]) => onChange([...items, ...productsToOrderItems(sel)]);
  const remove = (id: string) => onChange(items.filter((it) => it.id !== id));
  const patch = (id: string, p: Partial<OItem>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...p } : it)));

  const sum = summarizeOrder(items);

  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between border-b pb-2.5">
        <h3 className="text-sm font-semibold">
          매출품목 <span className="font-normal text-muted-foreground">({items.length})</span>
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
        <>
          <div className="flex flex-col gap-3 pt-3">
            {items.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                매출품목이 없습니다. + 버튼으로 제품을 선택하세요.
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
                    <Input value={fmt(it.unitPrice)} onChange={(e) => patch(it.id, { unitPrice: toNum(e.target.value) })} inputMode="numeric" className="h-8 text-right" />
                  </Row>
                  <Row label="수량">
                    <Input value={String(it.qty)} onChange={(e) => patch(it.id, { qty: toNum(e.target.value) })} inputMode="numeric" className="h-8 text-right" />
                  </Row>
                  <Row label="공급가액">
                    <ReadValue value={fmt(supplyOf(it))} />
                  </Row>
                  <Row label="납품예정일">
                    <Input type="date" value={it.deliveryDate} onChange={(e) => patch(it.id, { deliveryDate: e.target.value })} className="h-8" />
                  </Row>
                  <Row label="비고">
                    <Input value={it.note} onChange={(e) => patch(it.id, { note: e.target.value })} className="h-8" />
                  </Row>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-4 rounded-lg bg-muted/50 px-3 py-2.5 text-sm sm:grid-cols-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">수량 합계</span>
              <span className="font-semibold">{sum.totalQty}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">공급가액</span>
              <span className="font-semibold">{fmt(sum.supplyTotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">합계 (VAT 포함)</span>
              <span className="font-semibold text-brand">{fmt(sum.grandTotal)}</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
