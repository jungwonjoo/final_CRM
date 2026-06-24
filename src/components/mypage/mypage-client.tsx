"use client";

import { useState } from "react";
import { Save, Trash2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { alarms as SEED_ALARMS } from "@/lib/mock-data";
import type { Alarm } from "@/lib/types";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-bold">
      <span className="h-4 w-1 rounded-full bg-brand" />
      {children}
    </h2>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] items-center gap-3">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div>{children}</div>
    </div>
  );
}

export function MyPageClient() {
  const [alarms, setAlarms] = useState<Alarm[]>(SEED_ALARMS);

  const removeAlarm = (id: string) => setAlarms((prev) => prev.filter((a) => a.id !== id));
  const clearAll = () => {
    if (!alarms.length) return;
    if (window.confirm("모든 알람을 삭제하시겠습니까?")) setAlarms([]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 내 정보 변경 */}
      <section className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle>내 정보 변경</SectionTitle>
          <button
            type="button"
            onClick={() => alert("저장되었습니다.")}
            title="저장"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
          >
            <Save className="size-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          <Field label="아이디">
            <Input placeholder="아이디" defaultValue="kim.jiwon" disabled />
          </Field>
          <Field label="이름">
            <Input placeholder="이름" defaultValue="김지원" />
          </Field>
          <Field label="휴대번호">
            <Input placeholder="010-000-0000" defaultValue="010-1234-5678" inputMode="tel" />
          </Field>
          <Field label="회사번호">
            <Input placeholder="070-000-0000" defaultValue="070-4066-5900" inputMode="tel" />
          </Field>
          <Field label="메일">
            <Input type="email" placeholder="abcd@crm.co.kr" defaultValue="kim.jiwon@crm.co.kr" />
          </Field>
          <Field label="구글 연동">
            <Button type="button" size="sm" variant="outline">
              해제
            </Button>
          </Field>
          <Field label="잔디 URL">
            <Input placeholder="https://" />
          </Field>
          <Field label="언어">
            <Select defaultValue="KOREAN">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KOREAN">KOREAN</SelectItem>
                <SelectItem value="ENGLISH">ENGLISH</SelectItem>
                <SelectItem value="JAPANESE">JAPANESE</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </section>

      {/* 비밀번호 변경 */}
      <section className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle>비밀번호 변경</SectionTitle>
          <button
            type="button"
            onClick={() => alert("비밀번호가 변경되었습니다.")}
            title="저장"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
          >
            <Save className="size-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          <Field label="현재 비밀번호">
            <Input type="password" placeholder="현재 비밀번호" />
          </Field>
          <span className="hidden sm:block" />
          <Field label="신규 비밀번호">
            <Input type="password" placeholder="신규 비밀번호" />
          </Field>
          <Field label="신규 확인">
            <Input type="password" placeholder="신규 비밀번호 확인" />
          </Field>
        </div>
      </section>

      {/* 알람 */}
      <section className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle>알람 ({alarms.length})</SectionTitle>
          <button
            type="button"
            onClick={clearAll}
            title="전체 삭제"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
        {alarms.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">알람이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            {alarms.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2.5 text-sm"
              >
                <Bell className="size-4 shrink-0 text-brand" />
                <span className="min-w-0 flex-1 truncate" title={a.text}>
                  {a.text}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{a.at}</span>
                <button
                  type="button"
                  onClick={() => removeAlarm(a.id)}
                  title="삭제"
                  className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
