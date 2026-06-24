"use client";

import { useState } from "react";
import { QuoteItems } from "@/components/quotation/quote-items";
import { type QuoteItem, SEED_ITEMS } from "@/lib/quote";

export function OpportunityProducts({ initial = SEED_ITEMS }: { initial?: QuoteItem[] }) {
  const [items, setItems] = useState<QuoteItem[]>(initial);
  return <QuoteItems items={items} onChange={setItems} title="영업기회제품" />;
}
