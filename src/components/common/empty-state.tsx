export function EmptyState({ message = "검색 결과가 없습니다." }: { message?: string }) {
  return (
    <div className="rounded-xl border bg-card py-16 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
