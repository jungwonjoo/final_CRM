"use client";

import Link from "next/link";
import { useState } from "react";
import { Save, Trash2, List, Asterisk, Plus, Link2, Check } from "lucide-react";
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
import type { Todo } from "@/lib/types";

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
  current,
}: {
  label: string;
  options: string[];
  current?: string;
}) {
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={current ?? label} />
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
  kind: ["전화", "메일", "방문", "견적", "기타"],
  priority: ["높음", "보통", "낮음"],
  status: ["진행중", "완료"],
  alarm: ["1개월 전", "3개월 전", "6개월 전"],
};

// "2026.06.20 09:30" → "2026-06-20T09:30"
const toDatetimeLocal = (at?: string) =>
  at ? at.replace(/\./g, "-").replace(" ", "T") : undefined;

export function TodoForm({ todo }: { todo?: Todo }) {
  const isNew = !todo;
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [owner, setOwner] = useState(todo?.owner ?? "");
  const [done, setDone] = useState(todo?.done ?? false);
  const [privateOnly, setPrivateOnly] = useState(false);
  const [alarmOn, setAlarmOn] = useState(false);
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
        <h1 className="text-lg font-bold">{isNew ? "할일 등록" : "할일"}</h1>
        <div className="flex items-center gap-1.5">
          {!isNew && !done && (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (window.confirm("완료 처리하시겠습니까?")) setDone(true);
              }}
              className="gap-1.5 bg-red-500 text-white hover:bg-red-600"
            >
              <Check className="size-4" />
              완료
            </Button>
          )}
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
            render={<Link href="/todo" />}
          >
            <List className="size-4" />
            목록
          </Button>
        </div>
      </div>

      <section className="rounded-xl border bg-card p-5">
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="제목" required full>
            <Input defaultValue={todo?.title} placeholder="할일 제목" maxLength={100} />
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

          <Field label="할일구분" required>
            <Picker label="선택하세요" options={options.kind} current={todo?.kind} />
          </Field>

          <Field label="우선순위" required>
            <Picker label="선택하세요" options={options.priority} current={todo?.priority} />
          </Field>

          <Field label="기한일" required>
            <Input type="datetime-local" defaultValue={toDatetimeLocal(todo?.at)} />
          </Field>

          <Field label="할일상태" required>
            <Picker
              label="선택하세요"
              options={options.status}
              current={done ? "완료" : todo ? "진행중" : undefined}
            />
          </Field>

          <Field label="알림">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5">
                <Checkbox checked={alarmOn} onCheckedChange={(v) => setAlarmOn(v === true)} />
                <span className="text-xs text-muted-foreground">사용</span>
              </label>
              <div className="flex-1">
                <Picker label="3개월 전" options={options.alarm} />
              </div>
            </div>
          </Field>

          <Field label="나만보기">
            <label className="flex h-9 items-center gap-1.5">
              <Checkbox checked={privateOnly} onCheckedChange={(v) => setPrivateOnly(v === true)} />
              <span className="text-xs text-muted-foreground">
                나만 볼 수 있는 할일로 설정
              </span>
            </label>
          </Field>

          <Field label="등록자">
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
            <Textarea placeholder="비고를 입력하세요" rows={5} maxLength={2000} />
          </Field>
        </div>
      </section>
    </form>
  );
}
