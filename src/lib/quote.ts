import type { Product } from "@/lib/types";

export interface QuoteItem {
  id: string;
  name: string;
  unitPrice: number; // 단가
  qty: number; // 수량
  discount: number; // 할인 %
  packSpec: string; // 포장수량 / 규격
}

let idSeq = 0;
export const nextItemId = () => `qi-${++idSeq}`;

export const SEED_ITEMS: QuoteItem[] = [
  { id: "qi-s1", name: "서버 라이선스", unitPrice: 10000, qty: 1, discount: 0, packSpec: "1 / SET" },
  { id: "qi-s2", name: "사용자 라이선스", unitPrice: 10000, qty: 1, discount: 0, packSpec: "1 / USER" },
];

export const sellPrice = (it: QuoteItem) => Math.round(it.unitPrice * (1 - it.discount / 100));
export const itemTotal = (it: QuoteItem) => sellPrice(it) * it.qty;

export function productsToItems(products: Product[]): QuoteItem[] {
  return products.map((p) => ({
    id: nextItemId(),
    name: p.name,
    unitPrice: p.price,
    qty: 1,
    discount: 0,
    packSpec: [p.packQty || 1, p.spec].filter(Boolean).join(" / "),
  }));
}

export interface QuoteSummary {
  totalQty: number;
  supplyTotal: number; // 전체 공급가액 (단가 기준)
  proposalSupply: number; // 제안 공급가액 (할인 적용)
  tax: number; // 세액 (VAT 10%)
  grandTotal: number; // 합계
}

export function summarize(items: QuoteItem[]): QuoteSummary {
  const totalQty = items.reduce((s, it) => s + it.qty, 0);
  const supplyTotal = items.reduce((s, it) => s + it.unitPrice * it.qty, 0);
  const proposalSupply = items.reduce((s, it) => s + itemTotal(it), 0);
  const tax = Math.round(proposalSupply * 0.1);
  return { totalQty, supplyTotal, proposalSupply, tax, grandTotal: proposalSupply + tax };
}
