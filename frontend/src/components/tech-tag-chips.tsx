export function TechTagChips({
  tags,
  size = "sm",
}: {
  tags: string[];
  size?: "sm" | "md";
}) {
  if (tags.length === 0) return null;

  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies used">
      {tags.map((tag) => (
        <li
          key={tag}
          className={`font-mono-tag rounded-full border border-border-subtle bg-surface-raised ${padding} text-secondary`}
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
