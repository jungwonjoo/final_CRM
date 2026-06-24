"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Responsive, type Layout } from "react-grid-layout";
import { X, Plus, RotateCcw, GripVertical, Pencil, Check } from "lucide-react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { PORTLETS } from "@/components/dashboard/portlets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// WidthProvider(window resize 의존) 대신 ResizeObserver로 폭을 직접 추적한다.
const Grid = Responsive;

const STORAGE_KEY = "fs-dashboard-v18a";
// 1024px 이상: 12칼럼 데스크톱 레이아웃 / 미만(태블릿·모바일): 1칼럼 세로 스택
const BREAKPOINTS = { lg: 1024, xs: 0 };
const COLS = { lg: 12, xs: 1 };
// 모바일 1칼럼에서 카드가 reflow되는 포틀릿은 높이를 키워준다
const MOBILE_H: Record<string, number> = { newbiz: 6 };

const ALL_IDS = PORTLETS.map((p) => p.id);

function defaultLayout(ids: string[]): Layout[] {
  return ids.map((id) => {
    const p = PORTLETS.find((x) => x.id === id)!;
    return { i: id, ...p.defaultLayout };
  });
}

// 데스크톱 레이아웃을 읽는 순서(위→아래, 좌→우)대로 1칼럼으로 변환
function stackedLayout(ids: string[], lg: Layout[]): Layout[] {
  const sorted = [...ids].sort((a, b) => {
    const la = lg.find((l) => l.i === a);
    const lb = lg.find((l) => l.i === b);
    return (la?.y ?? 0) - (lb?.y ?? 0) || (la?.x ?? 0) - (lb?.x ?? 0);
  });
  let y = 0;
  return sorted.map((id) => {
    const l = lg.find((x) => x.i === id);
    const h = MOBILE_H[id] ?? l?.h ?? 6;
    const item: Layout = { i: id, x: 0, y, w: 1, h };
    y += h;
    return item;
  });
}

interface Saved {
  items: string[];
  layout: Layout[];
}

export function DashboardGrid() {
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [bp, setBp] = useState<string>("lg");
  const [width, setWidth] = useState(1200);
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<string[]>(ALL_IDS);
  const [layout, setLayout] = useState<Layout[]>(defaultLayout(ALL_IDS));

  const layouts = useMemo(
    () => ({ lg: layout, xs: stackedLayout(items, layout) }),
    [layout, items]
  );

  // 데스크톱(lg)에서만 드래그/편집 가능
  const editMode = editing && bp === "lg";

  // 마운트 시 저장된 레이아웃 로드 (SSR 불일치 방지)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Saved;
        const validItems =
          Array.isArray(saved.items) && saved.items.every((id) => ALL_IDS.includes(id));
        const validLayout =
          Array.isArray(saved.layout) &&
          saved.layout.length > 0 &&
          saved.layout.every((l) => l.w >= 1 && l.h >= 1);
        if (validItems && validLayout) {
          setItems(saved.items);
          setLayout(saved.layout);
        }
      }
    } catch {
      /* noop */
    }
    setMounted(true);
  }, []);

  // ResizeObserver로 그리드 컨테이너 폭을 직접 추적 → 브라우저/타이밍 무관하게 항상 정확
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setWidth(w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mounted]);

  const persist = (nextItems: string[], nextLayout: Layout[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items: nextItems, layout: nextLayout })
      );
    } catch {
      /* noop */
    }
  };

  const onLayoutChange = (_current: Layout[], all: { lg?: Layout[] }) => {
    // 데스크톱(lg) 레이아웃만 저장. 1칼럼(xs)은 자동 생성이므로 저장하지 않음
    const next = all?.lg;
    if (!next || !next.length || next.some((l) => l.w < 1 || l.h < 1)) return;
    setLayout(next);
    persist(items, next);
  };

  const removePortlet = (id: string) => {
    const nextItems = items.filter((x) => x !== id);
    const nextLayout = layout.filter((l) => l.i !== id);
    setItems(nextItems);
    setLayout(nextLayout);
    persist(nextItems, nextLayout);
  };

  const addPortlet = (id: string) => {
    if (items.includes(id)) return;
    const def = PORTLETS.find((p) => p.id === id)!.defaultLayout;
    const nextItems = [...items, id];
    const nextLayout: Layout[] = [
      ...layout,
      { i: id, x: 0, y: Infinity, w: def.w, h: def.h, minW: def.minW, minH: def.minH },
    ];
    setItems(nextItems);
    setLayout(nextLayout);
    persist(nextItems, nextLayout);
  };

  const reset = () => {
    const next = defaultLayout(ALL_IDS);
    setItems(ALL_IDS);
    setLayout(next);
    persist(ALL_IDS, next);
  };

  const hidden = PORTLETS.filter((p) => !items.includes(p.id));

  if (!mounted) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted/40" />;
  }

  return (
    <div>
      {/* 툴바 (데스크톱에서만 노출) */}
      {bp === "lg" && (
      <div className="mb-3 flex min-h-9 items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {editing
            ? "포틀릿 헤더를 드래그해 이동 · 가장자리를 끌어 크기 조절 · X로 삭제"
            : " "}
        </p>
        <div className="flex items-center gap-1.5">
          {editing ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium outline-none transition-colors hover:bg-muted disabled:opacity-50">
                  <Plus className="size-4" />
                  포틀릿 추가
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {hidden.length === 0 ? (
                    <DropdownMenuItem disabled>추가할 포틀릿 없음</DropdownMenuItem>
                  ) : (
                    hidden.map((p) => (
                      <DropdownMenuItem key={p.id} onClick={() => addPortlet(p.id)}>
                        {p.title}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <RotateCcw className="size-4" />
                초기화
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand/90"
              >
                <Check className="size-4" />
                완료
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Pencil className="size-4" />
              포틀릿 수정하기
            </button>
          )}
        </div>
      </div>
      )}

      <div ref={containerRef}>
      <Grid
        className="layout"
        width={width}
        layouts={layouts}
        breakpoints={BREAKPOINTS}
        cols={COLS}
        rowHeight={30}
        margin={[12, 12]}
        isDraggable={editMode}
        isResizable={editMode}
        draggableHandle=".portlet-handle"
        draggableCancel=".portlet-no-drag"
        resizeHandles={["s", "e", "se"]}
        onLayoutChange={onLayoutChange}
        onBreakpointChange={(b: string) => setBp(b)}
      >
        {items.map((id) => {
          const p = PORTLETS.find((x) => x.id === id)!;
          // 렌더 함수를 컴포넌트로 취급 → 포틀릿 내부에서 훅(useState 등) 사용 가능
          const Body = p.render;
          // bare 포틀릿: 평상시엔 헤더·박스 없이 내용만, 편집 모드에선 이동/삭제용 헤더 노출
          const bareNow = p.bare && !editMode;
          return (
            <div
              key={id}
              className={cn(
                "flex flex-col",
                !bareNow && "overflow-hidden rounded-xl border bg-card",
                editMode && "border-brand/40 ring-1 ring-brand/20"
              )}
            >
              {(editMode || !p.bare) && (
                <div
                  className={cn(
                    "portlet-handle flex items-center gap-1.5 px-4 py-2.5",
                    editMode && "cursor-move"
                  )}
                >
                  {editMode && <GripVertical className="size-3.5 text-muted-foreground" />}
                  <h3 className="text-sm font-bold">{p.title}</h3>
                  {p.unit && (
                    <span className="text-[11px] text-muted-foreground">({p.unit})</span>
                  )}
                  {editMode ? (
                    <button
                      type="button"
                      onClick={() => removePortlet(id)}
                      title="삭제"
                      className="portlet-no-drag ml-auto flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                    >
                      <X className="size-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      title="더보기"
                      className="portlet-no-drag ml-auto flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
                    >
                      <Plus className="size-4" />
                    </button>
                  )}
                </div>
              )}
              <div
                className={cn(
                  "portlet-no-drag flex-1 overflow-auto",
                  !bareNow && "px-4 py-2.5"
                )}
              >
                <Body />
              </div>
            </div>
          );
        })}
      </Grid>
      </div>
    </div>
  );
}
