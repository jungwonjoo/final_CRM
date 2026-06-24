"use client";

import Link from "next/link";
import { useState } from "react";
import { Save, Trash2, List, Asterisk, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Notice } from "@/lib/types";

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

const ME = "김지원";
const toDateInput = (s?: string) => (s ? s.replaceAll(".", "-") : undefined);

export function NoticeForm({ notice }: { notice?: Notice }) {
  const isNew = !notice;
  const author = notice?.author ?? ME; // 작성자 = 로그인 사용자 (수정 불가)
  const [pinned, setPinned] = useState(notice?.pinned ?? false);

  return (
    <form className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">{isNew ? "공지 등록" : "영업공지"}</h1>
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
            render={<Link href="/notice" />}
          >
            <List className="size-4" />
            목록
          </Button>
        </div>
      </div>

      <section className="rounded-xl border bg-card p-5">
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="제목" required full>
            <Input defaultValue={notice?.title} placeholder="공지 제목" maxLength={100} />
          </Field>

          <Field label="작성자">
            <div className="flex h-9 items-center rounded-md border bg-muted/50 px-3 text-sm text-muted-foreground">
              {author}
            </div>
          </Field>

          <Field label="등록일">
            <Input type="date" defaultValue={toDateInput(notice?.date)} />
          </Field>

          <Field label="필독">
            <label className="flex h-9 items-center gap-1.5">
              <Checkbox checked={pinned} onCheckedChange={(v) => setPinned(v === true)} />
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Pin className="size-3.5" />
                상단 고정(필독)으로 설정
              </span>
            </label>
          </Field>

          <Field label="내용" required full>
            <Textarea
              defaultValue={notice?.excerpt}
              placeholder="공지 내용을 입력하세요"
              rows={10}
              maxLength={5000}
            />
          </Field>
        </div>
      </section>
    </form>
  );
}
