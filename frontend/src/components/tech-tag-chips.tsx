export function TechTagChips({
  tags,
  size = "sm",
  max,
}: {
  tags: string[];
  size?: "sm" | "md";
  /** Cap how many chips render, with a "+N" chip for the rest. Used on
   * project cards so a project with many tags doesn't grow taller than its
   * neighbors in the grid; omitted on the detail page, which has room to
   * show everything. */
  max?: number;
}) {
  if (tags.length === 0) return null;

  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
  const visible = max ? tags.slice(0, max) : tags;
  const hiddenCount = max ? tags.length - visible.length : 0;

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies used">
      {visible.map((tag) => (
        <li
          key={tag}
          className={`font-mono-tag rounded-md border border-border-subtle bg-surface-raised ${padding} text-secondary`}
        >
          {tag}
        </li>
      ))}
      {hiddenCount > 0 && (
        <li
          className={`font-mono-tag rounded-md border border-border-subtle bg-surface-raised ${padding} text-muted`}
          aria-label={`${hiddenCount} more technologies`}
        >
          +{hiddenCount}
        </li>
      )}
    </ul>
  );
}
