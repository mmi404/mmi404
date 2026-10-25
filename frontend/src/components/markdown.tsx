/**
 * Minimal markdown-to-React renderer for the small amount of prose the
 * backend returns (persona intro, about-me bio). Deliberately not a full
 * markdown implementation or a new dependency — the content is short,
 * plain prose with at most paragraphs, bold/italic, inline code, and links.
 * Safe to render on the server (no DOM APIs).
 */

import type { ReactNode } from "react";

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Order matters: links, then bold, then italic, then inline code.
  const pattern =
    /(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const key = `${keyPrefix}-${i++}`;
    if (match[1]) {
      nodes.push(
        <a
          key={key}
          href={match[3]}
          className="text-accent underline underline-offset-2 hover:text-accent-hover"
          target={match[3].startsWith("http") ? "_blank" : undefined}
          rel={match[3].startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {match[2]}
        </a>
      );
    } else if (match[4]) {
      nodes.push(<strong key={key}>{match[5]}</strong>);
    } else if (match[6]) {
      nodes.push(<em key={key}>{match[7]}</em>);
    } else if (match[8]) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-[0.85em]"
        >
          {match[9]}
        </code>
      );
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

export function Markdown({
  content,
  className,
}: {
  content: string | null | undefined;
  className?: string;
}) {
  // Defensive, not just a call-site convention: these backend text fields
  // (project technicalDescription, persona introMarkdown, site-profile
  // aboutMeMarkdown) are all nullable with no server-side constraint
  // forcing them non-empty. A null here previously threw
  // "Cannot read properties of null (reading 'split')" wherever a caller
  // forgot to pre-check — found via a real admin-created project that had
  // no technicalDescription set.
  if (!content) return null;

  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={className}>
      {paragraphs.map((paragraph, pIndex) => {
        const lines = paragraph.split(/\n/);
        return (
          <p key={pIndex}>
            {lines.map((line, lIndex) => (
              <span key={lIndex}>
                {renderInline(line, `${pIndex}-${lIndex}`)}
                {lIndex < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
