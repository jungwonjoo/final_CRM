"use client";

import Link from "next/link";
import { useState } from "react";
import { Save, Trash2, List, Asterisk, Plus, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompanySearchDialog } from "@/components/company/company-search-dialog";
import { addStoredCompany } from "@/lib/company-store";
import { cn } from "@/lib/utils";
import type { Prospect } from "@/lib/types";

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
  channel: ["자사홈페이지", "지인소개", "제품설명회", "기타"],
  status: ["미접촉", "접촉중", "접촉금지", "고객전환"],
  grade: ["A", "B", "C"],
};

export function ProspectForm({ prospect }: { prospect?: Prospect }) {
  const isNew = !prospect;
  const [company, setCompany] = useState(prospect?.company ?? "");
  const [privateOnly, setPrivateOnly] = useState(false);
  const [registeredCompanyId, setRegisteredCompanyId] = useState<string | null>(null);

  const quickAddCompany = () => {
    const name = company.trim();
    if (!name) return alert("고객사명을 입력하세요.");
    if (!window.confirm("신규 고객사로 등록하시겠습니까?")) return;
    setRegisteredCompanyId(addStoredCompany(name).id);
    alert("신규 고객사로 등록되었습니다.");
  };

  return (
    <form className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">{isNew ? "잠재고객 등록" : "잠재고객"}</h1>
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
            render={<Link href="/prospect" />}
          >
            <List className="size-4" />
            목록
          </Button>
        </div>
      </div>

      <section className="rounded-xl border bg-card p-5">
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="이름" required>
            <Input defaultValue={prospect?.name} placeholder="잠재고객명" maxLength={100} />
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

          <Field label="부서">
            <Input placeholder="부서" />
          </Field>

          <Field label="직책">
            <Input placeholder="직급" />
          </Field>

          <Field label="접촉구분">
            <Picker label="선택하세요" options={options.channel} />
          </Field>

          <Field label="접촉상태">
            <Picker label="선택하세요" options={options.status} current={prospect?.status} />
          </Field>

          <Field label="가망등급">
            <Picker label="선택하세요" options={options.grade} />
          </Field>

          <Field label="휴대폰번호">
            <Input defaultValue={prospect?.mobile} placeholder="휴대폰번호" inputMode="tel" />
          </Field>

          <Field label="유선번호">
            <Input defaultValue={prospect?.phone} placeholder="유선번호" inputMode="tel" />
          </Field>

          <Field label="메일">
            <Input type="email" defaultValue={prospect?.email} placeholder="메일" />
          </Field>

          <Field label="나만보기">
            <label className="flex h-9 items-center gap-1.5">
              <Checkbox checked={privateOnly} onCheckedChange={(v) => setPrivateOnly(v === true)} />
              <span className="text-xs text-muted-foreground">
                나만 볼 수 있는 잠재고객으로 설정
              </span>
            </label>
          </Field>
        </div>
      </section>
    </form>
  );
}
