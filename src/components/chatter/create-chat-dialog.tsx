"use client";

import { useState } from "react";
import { Plus, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ParticipantSelectDialog } from "@/components/chatter/participant-select-dialog";

export function CreateChatDialog({
  onCreate,
}: {
  onCreate: (room: { title: string; participants: string[] }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);

  const reset = () => {
    setTitle("");
    setParticipants([]);
  };

  const addParticipants = (names: string[]) =>
    setParticipants((prev) => Array.from(new Set([...prev, ...names])));
  const removeParticipant = (name: string) =>
    setParticipants((prev) => prev.filter((p) => p !== name));

  const submit = () => {
    const t = title.trim();
    if (!t) return alert("채팅방 이름을 입력하세요.");
    onCreate({ title: t, participants });
    setOpen(false);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) reset();
      }}
    >
      <button
        type="button"
        title="채팅방 생성"
        onClick={() => setOpen(true)}
        className="ml-auto flex size-8 items-center justify-center rounded-md border text-brand transition-colors hover:bg-brand hover:text-primary-foreground"
      >
        <Plus className="size-4" />
      </button>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>채팅방 생성</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">채팅방 이름</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="채팅방 이름을 입력하세요"
              maxLength={100}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                대화상대 ({participants.length})
              </label>
              <ParticipantSelectDialog
                existing={participants}
                onAdd={addParticipants}
                title="대화상대"
              />
            </div>
            {participants.length === 0 ? (
              <p className="rounded-lg border border-dashed py-3 text-center text-xs text-muted-foreground">
                + 버튼으로 대화상대를 추가하세요.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {participants.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => removeParticipant(p)}
                    className="flex items-center gap-1 rounded-md border bg-muted/30 px-2 py-1 text-xs transition-colors hover:text-destructive"
                  >
                    {p}
                    <X className="size-3" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={submit} className="gap-1.5">
            <Check className="size-4" />
            완료
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
