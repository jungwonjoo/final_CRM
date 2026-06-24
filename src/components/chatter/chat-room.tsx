"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { List, Trash2, Users, Paperclip, Send, X, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareSelectDialog } from "@/components/chatter/share-select-dialog";
import { ParticipantSelectDialog } from "@/components/chatter/participant-select-dialog";
import { cn } from "@/lib/utils";
import type { Chatter, ChatMessage } from "@/lib/types";

const ME = "김지원"; // 현재 로그인 사용자 (헤더 기준)

interface Attachment {
  id: string;
  name: string;
  size: number; // bytes
}

let fileSeq = 0;

const fmtNow = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const fmtSize = (b: number) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
};

// 방별 초기 메모(목업). 실제 사용 시 이 배열만 API/DB로 교체하면 됨.
function seedMessages(c: Chatter): ChatMessage[] {
  const first = c.participants.split(",")[0]?.trim() || "담당자";
  return [
    { id: "m1", author: first, at: "2026.06.20 09:12", text: `${c.title} 관련 자료 공유드립니다. (${c.shared})` },
    { id: "m2", author: ME, at: "2026.06.20 09:30", text: "확인했습니다. 일정 정리해서 다시 공유할게요." },
    { id: "m3", author: first, at: "2026.06.21 14:05", text: "넵, 검토 후 의견 남기겠습니다." },
  ];
}

export function ChatRoom({ chatter }: { chatter: Chatter }) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => seedMessages(chatter));
  const [shared, setShared] = useState<string[]>(() =>
    chatter.shared ? [chatter.shared] : []
  );
  const [participants, setParticipants] = useState<string[]>(() =>
    chatter.participants
      .split(",")
      .map((s) => s.trim().replace(/\s*외\s*\d+명$/, "").trim())
      .filter(Boolean)
  );
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [input, setInput] = useState("");

  const addParticipants = (names: string[]) =>
    setParticipants((prev) => Array.from(new Set([...prev, ...names])));
  const removeParticipant = (name: string) =>
    setParticipants((prev) => prev.filter((p) => p !== name));
  const boardRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFilesPicked = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const picked = Array.from(files).map((f) => ({
      id: `f-${++fileSeq}`,
      name: f.name,
      size: f.size,
    }));
    setAttachments((prev) => [...prev, ...picked]);
    if (fileRef.current) fileRef.current.value = ""; // 같은 파일 재선택 허용
  };
  const removeAttachment = (id: string) =>
    setAttachments((prev) => prev.filter((a) => a.id !== id));

  const addShared = (items: string[]) =>
    setShared((prev) => Array.from(new Set([...prev, ...items])));
  const removeShared = (item: string) =>
    setShared((prev) => prev.filter((s) => s !== item));

  // 새 메모가 쌓이면 맨 아래로 스크롤
  useEffect(() => {
    const el = boardRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: `new-${prev.length + 1}`, author: ME, at: fmtNow(new Date()), text },
    ]);
    setInput("");
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* 좌측: 방 정보 */}
      <aside className="flex flex-col gap-4">
        <section className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">공유내용 ({shared.length})</h2>
            <ShareSelectDialog onAdd={addShared} />
          </div>
          {shared.length === 0 ? (
            <p className="py-2 text-center text-xs text-muted-foreground">
              공유내용이 없습니다.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {shared.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5 text-sm"
                >
                  <span className="min-w-0 flex-1 break-words">{s}</span>
                  <button
                    type="button"
                    onClick={() => removeShared(s)}
                    title="공유내용 삭제"
                    className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold">
              <Users className="size-4" /> 대화상대 ({participants.length})
            </h2>
            <ParticipantSelectDialog existing={participants} onAdd={addParticipants} />
          </div>
          {participants.length === 0 ? (
            <p className="py-2 text-center text-xs text-muted-foreground">
              대화상대가 없습니다.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {participants.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-primary-foreground">
                    {p.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{p}</span>
                  <button
                    type="button"
                    onClick={() => removeParticipant(p)}
                    title="대화상대 삭제"
                    className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold">
              <Paperclip className="size-4" /> 첨부자료 ({attachments.length})
            </h2>
            <button
              type="button"
              title="첨부자료 추가"
              onClick={() => fileRef.current?.click()}
              className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
            >
              <Plus className="size-4" />
            </button>
            <input
              ref={fileRef}
              type="file"
              multiple
              hidden
              onChange={(e) => onFilesPicked(e.target.files)}
            />
          </div>
          {attachments.length === 0 ? (
            <p className="py-2 text-center text-xs text-muted-foreground">
              첨부된 자료가 없습니다.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {attachments.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5 text-sm"
                >
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate" title={a.name}>
                    {a.name}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {fmtSize(a.size)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(a.id)}
                    title="첨부자료 삭제"
                    className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>

      {/* 중앙: 채팅 */}
      <section className="flex min-h-[600px] flex-col rounded-xl border bg-card">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <h1 className="truncate text-base font-bold">{chatter.title}</h1>
          <div className="ml-auto flex items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5 text-destructive hover:text-destructive"
            >
              <Trash2 className="size-4" />
              삭제
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5"
              nativeButton={false}
              render={<Link href="/chatter" />}
            >
              <List className="size-4" />
              목록
            </Button>
          </div>
        </div>

        {/* 메모 스레드 */}
        <div ref={boardRef} className="flex-1 space-y-4 overflow-y-auto bg-muted/20 p-4">
          {messages.map((m) => {
            const mine = m.author === ME;
            return (
              <div key={m.id} className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
                {!mine && <span className="px-1 text-xs text-muted-foreground">{m.author}</span>}
                <div className={cn("flex max-w-[78%] items-end gap-2", mine && "flex-row-reverse")}>
                  <div
                    className={cn(
                      "whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm",
                      mine
                        ? "rounded-br-sm bg-brand text-primary-foreground"
                        : "rounded-bl-sm border bg-card"
                    )}
                  >
                    {m.text}
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {m.at.slice(-5)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 입력창 */}
        <div className="flex items-end gap-2 border-t p-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder="내용을 입력하세요 (Enter 전송 / Shift+Enter 줄바꿈)"
            className="min-h-[44px] flex-1 resize-none rounded-md border px-3 py-2 text-sm outline-none focus:border-brand"
          />
          <Button type="button" onClick={send} className="h-11 shrink-0 gap-1.5">
            <Send className="size-4" />
            보내기
          </Button>
        </div>
      </section>
    </div>
  );
}
