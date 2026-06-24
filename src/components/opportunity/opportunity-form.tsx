"use client";

import Link from "next/link";
import { useState } from "react";
import { Save, Trash2, List, Asterisk, Plus, Link2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { addStoredCompany } from "@/lib/company-store";
import { addStoredContact } from "@/lib/contact-store";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/lib/types";

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

const options = {
  status: ["진행중", "종료(성공)", "종료(실패)", "보류/연기"],
  stage: ["기회인지", "제품소개", "제안", "초기견적", "재견적", "협상", "계약"],
  saleType: ["상품매출", "커미션매출"],
  bizType: ["CRM", "SI"],
  process: ["기본영업프로세스", "공공영업프로세스", "대외협력프로세스"],
};

const fmt = (n: number) => n.toLocaleString("ko-KR");
const toDateInput = (s?: string) => (s ? s.replaceAll(".", "-") : undefined);

function Picker({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
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

export function OpportunityForm({ opp }: { opp?: Opportunity }) {
  const isNew = !opp;
  const [company, setCompany] = useState(opp?.company ?? "");
  const [contact, setContact] = useState(opp?.contact ?? "");
  const [owner, setOwner] = useState("");
  const [registeredCompanyId, setRegisteredCompanyId] = useState<string | null>(null);
  const [registeredContactId, setRegisteredContactId] = useState<string | null>(null);

  const quickAddCompany = () => {
    const name = company.trim();
    if (!name) {
      alert("고객사명을 입력하세요.");
      return;
    }
    if (!window.confirm("신규 고객사로 등록하시겠습니까?")) return;
    const created = addStoredCompany(name);
    setRegisteredCompanyId(created.id);
    alert("신규 고객사로 등록되었습니다.");
  };

  const quickAddContact = () => {
    const name = contact.trim();
    if (!name) {
      alert("고객명을 입력하세요.");
      return;
    }
    if (!window.confirm("신규 고객으로 등록하시겠습니까?")) return;
    const created = addStoredContact(name);
    setRegisteredContactId(created.id);
    alert("신규 고객으로 등록되었습니다.");
  };

  return (
    <form className="flex flex-col gap-4">
      {/* 헤더 + 액션 */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">{isNew ? "영업기회 등록" : "영업기회"}</h1>
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
            render={<Link href="/opportunity" />}
          >
            <List className="size-4" />
            목록
          </Button>
        </div>
      </div>

      {/* 기본 정보 */}
      <section className="rounded-xl border bg-card p-5">
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="영업기회명" required>
            <Input defaultValue={opp?.title} placeholder="영업기회명" maxLength={100} />
          </Field>

          <Field label="진행상태">
            <Picker label="선택" options={options.status} />
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

          <Field label="고객">
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

          <Field label="진행단계">
            <Picker label="선택" options={options.stage} />
          </Field>

          <Field label="성공확률 (%)">
            <Input
              defaultValue={opp ? String(opp.stage * 25) : ""}
              placeholder="0"
              inputMode="numeric"
            />
          </Field>

          <Field label="예상매출">
            <Input
              defaultValue={opp ? fmt(opp.amount) : ""}
              placeholder="0"
              inputMode="numeric"
            />
          </Field>

          <Field label="예상이익률 (%)">
            <Input placeholder="0" inputMode="numeric" />
          </Field>

          <Field label="예상이익금액">
            <Input placeholder="0" inputMode="numeric" />
          </Field>

          <Field label="매출유형">
            <Picker label="선택하세요" options={options.saleType} />
          </Field>

          <Field label="사업유형">
            <Picker label="선택하세요" options={options.bizType} />
          </Field>

          <Field label="영업프로세스">
            <Picker label="선택하세요" options={options.process} />
          </Field>

          <Field label="영업시작일">
            <Input type="date" defaultValue={toDateInput(opp?.startDate)} />
          </Field>

          <Field label="영업종료일">
            <Input type="date" defaultValue={toDateInput(opp?.endDate)} />
          </Field>

          <Field label="주소" full>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input placeholder="도로명/지번 주소" readOnly />
                <Button type="button" variant="outline" className="shrink-0 gap-1.5">
                  <MapPin className="size-4" />
                  주소검색
                </Button>
              </div>
              <Input placeholder="상세주소" />
            </div>
          </Field>

          <Field label="SMS알람">
            <Label className="flex h-9 items-center gap-2 text-sm font-normal">
              <Checkbox className="size-5" />
              수신
            </Label>
          </Field>

          <Field label="견적서">
            <div className="flex h-9 items-center gap-4 text-sm">
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  name="quote"
                  value="제출"
                  className="size-4 accent-orange-500"
                />
                제출
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  name="quote"
                  value="미제출"
                  defaultChecked
                  className="size-4 accent-orange-500"
                />
                미제출
              </label>
            </div>
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

          <Field label="제품유형">
            <Input
              defaultValue={opp?.products.join(", ")}
              placeholder="제품유형"
            />
          </Field>

          <Field label="비고" full>
            <Textarea placeholder="비고를 입력하세요" rows={3} />
          </Field>
        </div>
      </section>
    </form>
  );
}
