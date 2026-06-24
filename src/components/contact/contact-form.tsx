"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  Save,
  Trash2,
  List,
  Asterisk,
  UserRound,
  Image as ImageIcon,
  X,
  Plus,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addStoredCompany } from "@/lib/company-store";
import { CompanySearchDialog } from "@/components/company/company-search-dialog";
import { EmployeeSearchDialog } from "@/components/common/employee-search-dialog";
import type { Contact } from "@/lib/types";

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

const grades = ["A", "B", "C"];

export function ContactForm({ contact }: { contact?: Contact }) {
  const isNew = !contact;
  const [showPhoto, setShowPhoto] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [companyName, setCompanyName] = useState(contact?.company ?? "");
  const [ownerName, setOwnerName] = useState(contact?.ownerName ?? "");
  // 빠른등록 시 생성된 고객사 id → 링크 버튼이 해당 상세로 이동
  const [registeredId, setRegisteredId] = useState<string | null>(null);

  // 고객사 빠른등록: 고객사명만으로 목록에 추가 (등록화면 전용)
  const quickAddCompany = () => {
    const name = companyName.trim();
    if (!name) {
      alert("고객사명을 입력하세요.");
      return;
    }
    if (!window.confirm("신규 고객사로 등록하시겠습니까?")) return;
    const created = addStoredCompany(name);
    setRegisteredId(created.id);
    alert("신규 고객사로 등록되었습니다.");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setPhoto(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  return (
    <form className="flex flex-col gap-4">
      {/* 헤더 + 액션 */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">{isNew ? "고객 등록" : "고객"}</h1>
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
            render={<Link href="/contact" />}
          >
            <List className="size-4" />
            목록
          </Button>
        </div>
      </div>

      {/* 기본 정보 */}
      <section className="rounded-xl border bg-card p-5">
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="고객" required>
            <Popover open={showPhoto} onOpenChange={setShowPhoto}>
              <div className="relative">
                <Input
                  defaultValue={contact?.name}
                  placeholder="고객명"
                  maxLength={100}
                  className="pr-9"
                />
                <PopoverTrigger
                  title="사진 등록"
                  className="absolute right-1.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
                >
                  <UserRound className="size-4" />
                </PopoverTrigger>
              </div>

              <PopoverContent side="right" align="start" sideOffset={8} className="w-auto p-2.5">
                <div className="flex items-start gap-2">
                  {/* 동작 버튼 */}
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setShowPhoto(false)}
                      title="닫기"
                      className="flex size-7 items-center justify-center rounded-md border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      title="사진 삭제"
                      className="flex size-7 items-center justify-center rounded-md border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      title="이미지 선택"
                      className="flex size-7 items-center justify-center rounded-md border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
                    >
                      <ImageIcon className="size-4" />
                    </button>
                  </div>

                  {/* 미리보기 */}
                  <div className="flex size-28 items-center justify-center overflow-hidden rounded-md border bg-muted">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt="고객 사진" className="size-full object-cover" />
                    ) : (
                      <UserRound className="size-14 text-muted-foreground/60" />
                    )}
                  </div>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                />
              </PopoverContent>
            </Popover>
          </Field>

          <Field label="고객사">
            <div className="relative">
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
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
                  href={registeredId ? `/company/${registeredId}` : "/company"}
                  title={registeredId ? "등록한 고객사로 이동" : "고객사 목록"}
                  className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
                >
                  <Link2 className="size-4" />
                </Link>
                <CompanySearchDialog onSelect={setCompanyName} />
              </div>
            </div>
          </Field>

          <Field label="부서">
            <Input defaultValue={contact?.dept} placeholder="부서" />
          </Field>

          <Field label="직책">
            <Input defaultValue={contact?.position} placeholder="직급" />
          </Field>

          <Field label="휴대번호" required>
            <Input defaultValue={contact?.phone} placeholder="휴대번호" />
          </Field>

          <Field label="유선번호">
            <Input defaultValue={contact?.officePhone} placeholder="유선번호" />
          </Field>

          <Field label="메일" required>
            <Input defaultValue={contact?.email} placeholder="메일" inputMode="email" />
          </Field>

          <Field label="등급">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="담당자">
            <div className="relative">
              <Input
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="담당자 입력"
                className="pr-9"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                <EmployeeSearchDialog onSelect={setOwnerName} />
              </div>
            </div>
          </Field>

          <Field label="유입경로">
            <Input placeholder="유입경로" />
          </Field>

          <Field label="KeyMan">
            <Label className="flex h-9 items-center gap-2 text-sm font-normal">
              <Checkbox className="size-5" />
              핵심 담당자로 지정
            </Label>
          </Field>
        </div>
      </section>
    </form>
  );
}
