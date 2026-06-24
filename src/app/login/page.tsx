import Link from "next/link";
import { Hand, Settings } from "lucide-react";
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

export const metadata = { title: "로그인 · FingerSales" };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] items-center gap-3">
      <label className="text-sm font-semibold text-muted-foreground">{label}</label>
      <div>{children}</div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-xl bg-brand text-primary-foreground">
            <Hand className="size-6" />
          </span>
          <div className="text-center leading-none">
            <p className="text-[10px] font-medium tracking-wide text-muted-foreground">
              CRM FOR BUSINESS SALES
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight">FINGER SALES</p>
          </div>
        </div>

        {/* 로그인 카드 */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <Row label="ID">
              <Input placeholder="fingersales" defaultValue="fingersales" />
            </Row>
            <Row label="PASSWORD">
              <Input type="password" placeholder="••••" />
            </Row>
            <Row label="LANGUAGE">
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
            </Row>

            <Label className="ml-auto flex w-fit items-center gap-1.5 text-sm font-normal">
              <Checkbox defaultChecked className="size-4" />
              자동로그인
            </Label>

            <div className="flex items-stretch gap-2">
              <Link
                href="/dashboard"
                className="flex h-11 flex-1 items-center justify-center rounded-md bg-brand text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand/90"
              >
                로그인
              </Link>
              <button
                type="button"
                title="설정"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-muted-foreground/80 text-background transition-colors hover:bg-muted-foreground"
              >
                <Settings className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          ⓒ FINGERPOST ALL RIGHT RESERVED.
        </p>
      </div>
    </main>
  );
}
