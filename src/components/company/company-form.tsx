"use client";

import Link from "next/link";
import { useState } from "react";
import { Save, Trash2, List, MapPin, Copy, Asterisk, Link2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { Company } from "@/lib/types";

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
  type: ["고객사", "협력사", "파트너", "기타"],
  grade: ["A", "B", "C", "D"],
  status: ["진행중", "종료(성공)", "종료(실패)", "보류/연기"],
  product: ["사용자 라이선스", "서버 라이선스", "유지보수", "컨설팅"],
};

export function CompanyForm({ company }: { company?: Company }) {
  const isNew = !company;
  const [website, setWebsite] = useState("");

  const openWebsite = () => {
    const raw = website.trim();
    if (!raw) {
      alert("연결할 링크가 없습니다.");
      return;
    }
    const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <form className="flex flex-col gap-4">
      {/* 헤더 + 액션 */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">{isNew ? "고객사 등록" : "고객사"}</h1>
        <div className="flex items-center gap-1.5">
          <Button type="submit" size="sm" className="gap-1.5">
            <Save className="size-4" />
            저장
          </Button>
          {!isNew && (
            <Button type="button" size="sm" variant="outline" className="gap-1.5 text-destructive hover:text-destructive">
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
            render={<Link href="/company" />}
          >
            <List className="size-4" />
            목록
          </Button>
        </div>
      </div>

      {/* 기본 정보 */}
      <section className="rounded-xl border bg-card p-5">
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="고객사" required>
            <Input defaultValue={company?.name} placeholder="거래처명" maxLength={100} />
          </Field>

          <Field label="구분">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {options.type.map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="등급">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {options.grade.map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="진행상태">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {options.status.map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="매출 (년)">
            <Input placeholder="0" inputMode="numeric" />
          </Field>

          <Field label="사원수">
            <Input placeholder="0" inputMode="numeric" />
          </Field>

          <Field label="사업자번호">
            <Input placeholder="000-00-00000" />
          </Field>

          <Field label="유선번호">
            <Input placeholder="02-000-0000" />
          </Field>

          <Field label="팩스번호">
            <Input placeholder="070-000-0000" />
          </Field>

          <Field label="웹사이트">
            <div className="relative">
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="http://www....."
                className="pr-9"
              />
              <button
                type="button"
                onClick={openWebsite}
                title="웹사이트 열기"
                className="absolute right-1.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
              >
                <Link2 className="size-4" />
              </button>
            </div>
          </Field>

          {/* 주소 (전체 폭) */}
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

          <Field label="담당자">
            <div className="relative">
              <Input placeholder="담당자 입력" className="pr-9" defaultValue={company?.ownerName} />
              <button
                type="button"
                title="담당자 검색"
                className="absolute right-1.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Copy className="size-4" />
              </button>
            </div>
          </Field>

          <Field label="대표자명">
            <Input placeholder="대표자명" />
          </Field>

          <Field label="목표매출액">
            <Input placeholder="0" inputMode="numeric" />
          </Field>

          <Field label="제품유형">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {options.product.map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="사용시작일">
            <Input type="date" />
          </Field>

          <Field label="비고" full>
            <Textarea placeholder="비고를 입력하세요" rows={3} />
          </Field>
        </div>
      </section>
    </form>
  );
}
