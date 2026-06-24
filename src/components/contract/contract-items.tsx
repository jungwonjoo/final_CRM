"use client";

import { useState } from "react";
import { Save, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductSelectDialog } from "@/components/quotation/product-select-dialog";
import type { Product } from "@/lib/types";

interface CItem {
  id: string;
  name: string;
  unitPrice: number;
  qty: number;
  cycle: string; // 매출주기
  salesDate: string; // 매출일 (계약제품/매출 공유)
  note: string; // 비고
}

let seq = 0;
const SEED: CItem[] = [
  { id: "ci1", name: "서버 라이선스", unitPrice: 10000, qty: 1, cycle: "1회", salesDate: "", note: "" },
  { id: "ci2", name: "사용자 라이선스", unitPrice: 10000, qty: 1, cycle: "1회", salesDate: "", note: "" },
];

const fmt = (n: number) => n.toLocaleString("ko-KR");
const toNum = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;
const amountOf = (it: CItem) => it.unitPrice * it.qty;

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
function Totals({ qty, amount, amountLabel }: { qty: number; amount: number; amountLabel: string }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-4 rounded-lg bg-muted/50 px-3 py-2.5 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground">수량 합계</span>
        <span className="font-semibold">{qty}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground">{amountLabel}</span>
        <span className="font-semibold text-brand">{fmt(amount)}</span>
      </div>
    </div>
  );
}

export function ContractItems({ initial = SEED }: { initial?: CItem[] }) {
  const [items, setItems] = useState<CItem[]>(initial);
  const [openP, setOpenP] = useState(true);
  const [openS, setOpenS] = useState(true);

  const add = (sel: Product[]) =>
    setItems((prev) => [
      ...prev,
      ...sel.map((p) => ({
        id: `new-${++seq}`,
        name: p.name,
        unitPrice: p.price,
        qty: 1,
        cycle: "1회",
        salesDate: "",
        note: "",
      })),
    ]);
  const remove = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));
  const patch = (id: string, p: Partial<CItem>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...p } : it)));

  const totalQty = items.reduce((s, it) => s + it.qty, 0);
  const totalAmount = items.reduce((s, it) => s + amountOf(it), 0);

  return (
    <>
      {/* 계약제품 (소스) */}
      <section className="rounded-xl border bg-card p-4">
        <div className="flex items-center justify-between border-b pb-2.5">
          <h3 className="text-sm font-semibold">
            계약제품 <span className="font-normal text-muted-foreground">({items.length})</span>
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
              onClick={() => setOpenP((v) => !v)}
              title={openP ? "접기" : "펼치기"}
              className="flex size-6 items-center justify-center rounded transition-colors hover:bg-muted hover:text-foreground"
            >
              {openP ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
          </div>
        </div>

        {openP && (
          <>
            <div className="flex flex-col gap-3 pt-3">
              {items.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  계약제품이 없습니다. + 버튼으로 제품을 선택하세요.
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
                    <Row label="금액">
                      <ReadValue value={fmt(amountOf(it))} />
                    </Row>
                    <Row label="매출주기">
                      <Input value={it.cycle} onChange={(e) => patch(it.id, { cycle: e.target.value })} className="h-8" />
                    </Row>
                    <Row label="매출일">
                      <Input type="date" value={it.salesDate} onChange={(e) => patch(it.id, { salesDate: e.target.value })} className="h-8" />
                    </Row>
                    <Row label="비고">
                      <Input value={it.note} onChange={(e) => patch(it.id, { note: e.target.value })} className="h-8" />
                    </Row>
                  </div>
                </div>
              ))}
            </div>
            <Totals qty={totalQty} amount={totalAmount} amountLabel="제안금액 합계" />
          </>
        )}
      </section>

      {/* 매출 (계약제품에서 자동 생성) */}
      <section className="rounded-xl border bg-card p-4">
        <div className="flex items-center justify-between border-b pb-2.5">
          <h3 className="text-sm font-semibold">
            매출 <span className="font-normal text-muted-foreground">({items.length})</span>
          </h3>
          <button
            type="button"
            onClick={() => setOpenS((v) => !v)}
            title={openS ? "접기" : "펼치기"}
            className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {openS ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </div>

        {openS && (
          <>
            <div className="flex flex-col gap-3 pt-3">
              {items.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  계약제품을 추가하면 매출이 자동 생성됩니다.
                </p>
              )}
              {items.map((it) => (
                <div key={it.id} className="rounded-lg border p-3">
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{it.name}</span>
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
                    <Row label="매출일">
                      <Input type="date" value={it.salesDate} onChange={(e) => patch(it.id, { salesDate: e.target.value })} className="h-8" />
                    </Row>
                    <Row label="단가">
                      <ReadValue value={fmt(it.unitPrice)} />
                    </Row>
                    <Row label="수량">
                      <ReadValue value={String(it.qty)} />
                    </Row>
                    <Row label="금액">
                      <ReadValue value={fmt(amountOf(it))} />
                    </Row>
                  </div>
                </div>
              ))}
            </div>
            <Totals qty={totalQty} amount={totalAmount} amountLabel="매출금액 합계" />
          </>
        )}
      </section>
    </>
  );
}
