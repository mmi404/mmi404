export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border-subtle p-10 text-center text-sm text-muted">
      {message}
    </div>
  );
}
