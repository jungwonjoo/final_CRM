"use client";

import Link from "next/link";
import { useState } from "react";
import { Save, Trash2, List, Asterisk, Plus, Link2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompanySearchDialog } from "@/components/company/company-search-dialog";
import { ContactSearchDialog } from "@/components/contact/contact-search-dialog";
import { EmployeeSearchDialog } from "@/components/common/employee-search-dialog";
import { ProductSelectDialog } from "@/components/quotation/product-select-dialog";
import {
  OrderItems,
  type OItem,
  SEED_ITEMS,
  summarizeOrder,
  productsToOrderItems,
} from "@/components/order/order-items";
import { addStoredCompany } from "@/lib/company-store";
import { addStoredContact } from "@/lib/contact-store";
import { cn } from "@/lib/utils";
import type { Order } from "@/lib/types";

function Field({
  label,
  required,
  full,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", full && "sm:col-span-2")}>
      <label className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground">
        {required && <Asterisk className="size-2.5 text-brand" />}
        {label}
      </label>
      {children}
    </div>
  );
}

function Picker({ label, options }: { label: string; options: string[] }) {
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// 제품 선택으로 자동 계산되는 읽기전용 값
function Auto({ value }: { value: string }) {
  return (
    <>
      <div className="flex h-8 items-center justify-end rounded-md bg-muted/50 px-2.5 text-sm">
        {value}
      </div>
      <span className="text-[11px] text-muted-foreground">
        제품을 선택하시면 자동으로 변경됩니다.
      </span>
    </>
  );
}

const options = {
  kind: ["상품매출", "용역매출", "유지보수매출", "기타매출"],
  business: ["구축", "유지보수", "라이선스", "컨설팅"],
};
const fmt = (n: number) => n.toLocaleString("ko-KR");
const toDateInput = (s?: string) => (s ? s.replaceAll(".", "-") : undefined);

export function OrderForm({ order }: { order?: Order }) {
  const isNew = !order;
  const [company, setCompany] = useState(order?.company ?? "");
  const [contact, setContact] = useState(order?.contact ?? "");
  const [owner, setOwner] = useState(order?.owner ?? "");
  const [registeredCompanyId, setRegisteredCompanyId] = useState<string | null>(null);
  const [registeredContactId, setRegisteredContactId] = useState<string | null>(null);
  const [items, setItems] = useState<OItem[]>(isNew ? [] : SEED_ITEMS);

  const sum = summarizeOrder(items);
  const auto = (v: number) => (items.length ? fmt(v) : "");
  const addProducts = (sel: Parameters<typeof productsToOrderItems>[0]) =>
    setItems((prev) => [...prev, ...productsToOrderItems(sel)]);

  const quickAddCompany = () => {
    const name = company.trim();
    if (!name) return alert("고객사명을 입력하세요.");
    if (!window.confirm("신규 고객사로 등록하시겠습니까?")) return;
    setRegisteredCompanyId(addStoredCompany(name).id);
    alert("신규 고객사로 등록되었습니다.");
  };

  const quickAddContact = () => {
    const name = contact.trim();
    if (!name) return alert("고객명을 입력하세요.");
    if (!window.confirm("신규 고객으로 등록하시겠습니까?")) return;
    setRegisteredContactId(addStoredContact(name).id);
    alert("신규 고객으로 등록되었습니다.");
  };

  return (
    <form className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">{isNew ? "매출 등록" : "매출"}</h1>
        <div className="flex items-center gap-1.5">
          <Button type="submit" size="sm" className="gap-1.5">
            <Save className="size-4" />
            저장
          </Button>
          {!isNew && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5 text-destructive hover:text-destructive"
            >
              <Trash2 className="size-4" />
              삭제
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            nativeButton={false}
            render={<Link href="/order" />}
          >
            <List className="size-4" />
            목록
          </Button>
        </div>
      </div>

      <section className="rounded-xl border bg-card p-5">
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="매출구분" required>
            <Picker label="상품매출" options={options.kind} />
          </Field>

          <Field label="사업유형">
            <Picker label="선택" options={options.business} />
          </Field>

          <Field label="고객사">
            <div className="relative">
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="거래처명"
                className={isNew ? "pr-[4.75rem]" : "pr-[3.25rem]"}
              />
              <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                {isNew && (
                  <button
                    type="button"
                    onClick={quickAddCompany}
                    title="고객사 빠른등록"
                    className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
                  >
                    <Plus className="size-4" />
                  </button>
                )}
                <Link
                  href={registeredCompanyId ? `/company/${registeredCompanyId}` : "/company"}
                  title={registeredCompanyId ? "등록한 고객사로 이동" : "고객사 목록"}
                  className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
                >
                  <Link2 className="size-4" />
                </Link>
                <CompanySearchDialog onSelect={setCompany} />
              </div>
            </div>
          </Field>

          <Field label="고객" required>
            <div className="relative">
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="고객명"
                className={isNew ? "pr-[4.75rem]" : "pr-[3.25rem]"}
              />
              <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                {isNew && (
                  <button
                    type="button"
                    onClick={quickAddContact}
                    title="고객 빠른등록"
                    className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
                  >
                    <Plus className="size-4" />
                  </button>
                )}
                <Link
                  href={registeredContactId ? `/contact/${registeredContactId}` : "/contact"}
                  title={registeredContactId ? "등록한 고객으로 이동" : "고객 목록"}
                  className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
                >
                  <Link2 className="size-4" />
                </Link>
                <ContactSearchDialog onSelect={setContact} />
              </div>
            </div>
          </Field>

          <Field label="영업기회">
            <Input placeholder="영업기회명" />
          </Field>

          <Field label="견적">
            <Input placeholder="견적명" />
          </Field>

          <Field label="계약">
            <Input defaultValue={order?.contractTitle} placeholder="계약명" />
          </Field>

          <Field label="매출일" required>
            <Input type="date" defaultValue={toDateInput(order?.startDate)} />
          </Field>

          <Field label="수량" required>
            <div className="flex gap-2">
              <div className="flex h-8 flex-1 items-center justify-end rounded-md bg-muted/50 px-2.5 text-sm">
                {items.length ? sum.totalQty : ""}
              </div>
              <ProductSelectDialog
                onAdd={addProducts}
                triggerContent={
                  <>
                    <Search className="size-4" />
                    제품검색
                  </>
                }
                triggerClassName="flex h-8 shrink-0 items-center gap-1 rounded-md border px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              />
            </div>
            <span className="text-[11px] text-muted-foreground">
              제품을 선택하시면 자동으로 변경됩니다.
            </span>
          </Field>

          <Field label="공급가액" required>
            <Auto value={auto(sum.supplyTotal)} />
          </Field>

          <Field label="세액" required>
            <Auto value={auto(sum.tax)} />
          </Field>

          <Field label="합계" required>
            <Auto value={auto(sum.grandTotal)} />
          </Field>

          <Field label="입고예정일">
            <Input type="date" defaultValue={toDateInput(order?.endDate)} />
          </Field>

          <Field label="담당자">
            <div className="relative">
              <Input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="담당자 입력"
                className="pr-9"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                <EmployeeSearchDialog onSelect={setOwner} />
              </div>
            </div>
          </Field>

          <Field label="비고" full>
            <Textarea placeholder="비고를 입력하세요" rows={3} />
          </Field>
        </div>
      </section>

      {/* 매출품목 (선택 시 위 요약 자동 계산) */}
      <OrderItems items={items} onChange={setItems} />
    </form>
  );
}
