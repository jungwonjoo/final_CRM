"use client";

import Link from "next/link";
import { useState } from "react";
import { Save, Trash2, List, Asterisk, Check, CheckCircle2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { SalesReport } from "@/lib/types";

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
  template: ["영업팀 주간 템플릿", "클라우드팀 월간 템플릿", "기술연구소 주간 템플릿"],
};
const toDateInput = (s?: string) => (s ? s.replaceAll(".", "-") : undefined);

export function SalesReportForm({ report }: { report?: SalesReport }) {
  const isNew = !report;
  const [sms, setSms] = useState(false);
  const [submitted, setSubmitted] = useState(report?.submitted ?? false);

  return (
    <form className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">{isNew ? "영업보고 등록" : "영업보고"}</h1>
          {submitted && (
            <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="size-3.5" />
              제출됨
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {!isNew && !submitted && (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (window.confirm("보고서를 제출하시겠습니까?")) setSubmitted(true);
              }}
              className="gap-1.5"
            >
              <Check className="size-4" />
              제출
            </Button>
          )}
          <Button type="submit" size="sm" variant={isNew ? "default" : "outline"} className="gap-1.5">
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
            render={<Link href="/sales-report" />}
          >
            <List className="size-4" />
            목록
          </Button>
        </div>
      </div>

      <section className="rounded-xl border bg-card p-5">
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="보고일" required>
            <Input type="date" defaultValue={toDateInput(report?.reportDate)} />
          </Field>

          <Field label="보고 템플릿">
            <Picker label="선택하세요" options={options.template} current={report?.template} />
          </Field>

          <Field label="계약기간" full>
            <div className="flex items-center gap-1.5">
              <Input type="date" className="flex-1" defaultValue={toDateInput(report?.startDate)} />
              <span className="text-muted-foreground">~</span>
              <Input type="date" className="flex-1" defaultValue={toDateInput(report?.endDate)} />
            </div>
          </Field>

          <Field label="SMS알람">
            <label className="flex h-9 items-center gap-1.5">
              <Checkbox checked={sms} onCheckedChange={(v) => setSms(v === true)} />
              <span className="text-xs text-muted-foreground">제출 시 SMS 알람 발송</span>
            </label>
          </Field>
        </div>
      </section>
    </form>
  );
}
