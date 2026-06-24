"use client";

import { useRef, useState } from "react";
import { Paperclip, Plus, FileText, X } from "lucide-react";

interface Attachment {
  id: string;
  name: string;
  size: number; // bytes
}

let fileSeq = 0;

const fmtSize = (b: number) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
};

export function AttachmentBox({ title = "첨부자료" }: { title?: string }) {
  const [items, setItems] = useState<Attachment[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPicked = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const picked = Array.from(files).map((f) => ({
      id: `f-${++fileSeq}`,
      name: f.name,
      size: f.size,
    }));
    setItems((prev) => [...prev, ...picked]);
    if (fileRef.current) fileRef.current.value = "";
  };
  const remove = (id: string) => setItems((prev) => prev.filter((a) => a.id !== id));

  return (
    <section className="flex flex-col rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between border-b pb-2.5">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
          <Paperclip className="size-4" /> {title} ({items.length})
        </h3>
        <button
          type="button"
          title={`${title} 추가`}
          onClick={() => fileRef.current?.click()}
          className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
        >
          <Plus className="size-4" />
        </button>
        <input ref={fileRef} type="file" multiple hidden onChange={(e) => onPicked(e.target.files)} />
      </div>

      {items.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">첨부된 자료가 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {items.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5 text-sm"
            >
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate" title={a.name}>
                {a.name}
              </span>
              <span className="shrink-0 text-[11px] text-muted-foreground">{fmtSize(a.size)}</span>
              <button
                type="button"
                onClick={() => remove(a.id)}
                title="삭제"
                className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
