"use client";

import Link from "next/link";
import { useState } from "react";
import { Save, Trash2, List, Asterisk, Plus, Link2 } from "lucide-react";
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
import { addStoredCompany } from "@/lib/company-store";
import { addStoredContact } from "@/lib/contact-store";
import { cn } from "@/lib/utils";
import type { Contract } from "@/lib/types";

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

const options = {
  type: ["일반 클라우드", "맞춤형 클라우드", "추가개발", "프로젝트"],
  alarm: ["1개월 전", "3개월 전", "6개월 전"],
};
const fmt = (n: number) => n.toLocaleString("ko-KR");
const toDateInput = (s?: string) => (s ? s.replaceAll(".", "-") : undefined);

export function ContractForm({ contract }: { contract?: Contract }) {
  const isNew = !contract;
  const [company, setCompany] = useState(contract?.company ?? "");
  const [contact, setContact] = useState(contract?.contact ?? "");
  const [owner, setOwner] = useState(contract?.owner ?? "");
  const [registeredCompanyId, setRegisteredCompanyId] = useState<string | null>(null);
  const [registeredContactId, setRegisteredContactId] = useState<string | null>(null);

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
        <h1 className="text-lg font-bold">{isNew ? "계약 등록" : "계약"}</h1>
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
            render={<Link href="/contract" />}
          >
            <List className="size-4" />
            목록
          </Button>
        </div>
      </div>

      <section className="rounded-xl border bg-card p-5">
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="계약명" required full>
            <Input defaultValue={contract?.title} placeholder="계약명" maxLength={100} />
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

          <Field label="영업기회">
            <Input placeholder="영업기회명" />
          </Field>

          <Field label="견적">
            <Input placeholder="견적명" />
          </Field>

          <Field label="계약일">
            <Input type="date" defaultValue={toDateInput(contract?.contractDate)} />
          </Field>

          <Field label="계약기간">
            <div className="flex items-center gap-1.5">
              <Input type="date" className="flex-1" defaultValue={toDateInput(contract?.startDate)} />
              <span className="text-muted-foreground">~</span>
              <Input type="date" className="flex-1" defaultValue={toDateInput(contract?.endDate)} />
            </div>
          </Field>

          <Field label="계약금액">
            <Input
              defaultValue={contract ? fmt(contract.amount) : ""}
              placeholder="0"
              inputMode="numeric"
            />
          </Field>

          <Field label="부가세">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="VAT 별도" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="별도">VAT 별도</SelectItem>
                <SelectItem value="포함">VAT 포함</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="계약구분">
            <Picker label="선택하세요" options={options.type} />
          </Field>

          <Field label="대금지급조건" full>
            <Input placeholder="착수 50%, 검수 후 50% 지급" />
          </Field>

          <Field label="하자보증기간 (개월)">
            <Input placeholder="12" inputMode="numeric" />
          </Field>

          <Field label="입고예정일">
            <Input type="date" />
          </Field>

          <Field label="입고알림">
            <Picker label="선택" options={options.alarm} />
          </Field>

          <Field label="갱신예정일">
            <Input type="date" />
          </Field>

          <Field label="갱신알림">
            <Picker label="선택" options={options.alarm} />
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
    </form>
  );
}
