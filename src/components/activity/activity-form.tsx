"use client";

import Link from "next/link";
import { useState } from "react";
import { Save, List, Asterisk, Plus, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

function Picker({
  label,
  options,
  disabled,
}: {
  label: string;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <Select disabled={disabled}>
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
  progress: ["진행중", "종료(성공)", "보류/연기"],
  process: ["기회인지", "제품소개", "제안", "초기견적", "재견적", "협상", "계약"],
  kind: ["전화", "메일", "방문", "온라인"],
  purpose: ["인사", "제품소개", "교육", "계약"],
};

export function ActivityForm() {
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [companion, setCompanion] = useState("");
  const [participant, setParticipant] = useState("");
  const [done, setDone] = useState(false);
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
        <h1 className="text-lg font-bold">영업활동 등록</h1>
        <div className="flex items-center gap-1.5">
          <Button type="submit" size="sm" className="gap-1.5">
            <Save className="size-4" />
            저장
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            nativeButton={false}
            render={<Link href="/activity" />}
          >
            <List className="size-4" />
            목록
          </Button>
        </div>
      </div>

      <section className="rounded-xl border bg-card p-5">
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="영업기회">
            <Input placeholder="영업기회명" maxLength={100} />
          </Field>

          <div className="grid grid-cols-2 gap-2">
            <Field label="진행상태">
              <Picker label="진행상태" options={options.progress} disabled />
            </Field>
            <Field label="프로세스">
              <Picker label="프로세스" options={options.process} disabled />
            </Field>
          </div>

          <Field label="고객사">
            <div className="relative">
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="거래처명"
                className="pr-[4.75rem]"
              />
              <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                <button
                  type="button"
                  onClick={quickAddCompany}
                  title="고객사 빠른등록"
                  className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
                >
                  <Plus className="size-4" />
                </button>
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
                className="pr-[4.75rem]"
              />
              <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                <button
                  type="button"
                  onClick={quickAddContact}
                  title="고객 빠른등록"
                  className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
                >
                  <Plus className="size-4" />
                </button>
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

          <Field label="휴대번호">
            <Input placeholder="휴대번호" inputMode="tel" />
          </Field>

          <Field label="메일">
            <Input type="email" placeholder="메일" />
          </Field>

          <Field label="활동분류" required>
            <Picker label="선택하세요" options={options.kind} />
          </Field>

          <Field label="활동목적" required>
            <Picker label="선택하세요" options={options.purpose} />
          </Field>

          <Field label="날짜" required>
            <Input type="date" />
          </Field>

          <Field label="활동시간" required>
            <div className="flex items-center gap-1.5">
              <Input type="time" className="flex-1" />
              <span className="text-muted-foreground">~</span>
              <Input type="time" className="flex-1" />
            </div>
          </Field>

          <Field label="완료">
            <label className="flex h-9 items-center gap-1.5">
              <Checkbox checked={done} onCheckedChange={(v) => setDone(v === true)} />
              <span className="text-xs text-muted-foreground">활동 완료로 표시</span>
            </label>
          </Field>

          <Field label="동반">
            <div className="relative">
              <Input
                value={companion}
                onChange={(e) => setCompanion(e.target.value)}
                placeholder="동반자 입력"
                className="pr-9"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                <EmployeeSearchDialog onSelect={setCompanion} />
              </div>
            </div>
          </Field>

          <Field label="참가자">
            <div className="relative">
              <Input
                value={participant}
                onChange={(e) => setParticipant(e.target.value)}
                placeholder="참가자 입력"
                className="pr-9"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                <EmployeeSearchDialog onSelect={setParticipant} />
              </div>
            </div>
          </Field>

          <Field label="계획내용" full>
            <Textarea placeholder="계획 내용을 입력하세요" rows={5} maxLength={2000} />
          </Field>

          <Field label="활동내용" full>
            <Textarea placeholder="활동 내용을 입력하세요" rows={5} maxLength={2000} />
          </Field>
        </div>
      </section>
    </form>
  );
}
