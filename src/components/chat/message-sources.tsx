import { Link2 } from "lucide-react";
import type { RefLink } from "@/lib/links";

/** "References" footer listing the links cited in a reply. */
export function MessageSources({ links }: { links: RefLink[] }) {
  if (!links.length) return null;
  return (
    <div className="mt-3 border-t pt-2">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Link2 className="size-3.5" /> References
      </div>
      <ol className="space-y-1">
        {links.map((l, i) => (
          <li key={l.url} className="flex items-baseline gap-2 text-xs">
            <span className="shrink-0 text-muted-foreground">{i + 1}.</span>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 truncate accent-text hover:underline"
            >
              {l.label}
            </a>
            <span className="shrink-0 text-muted-foreground/70">· {l.domain}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
