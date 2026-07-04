import { ExternalLink, GraduationCap } from "lucide-react";

export interface CourseCard {
  title: string;
  provider: string;
  url: string;
  blurb: string;
}

// Rendered from the recommendCourses tool output. Deliberately understated —
// a helpful pointer, not a sales banner.
export function CourseCards({ courses }: { courses: CourseCard[] }) {
  if (!courses?.length) return null;
  return (
    <div className="mt-2 grid gap-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <GraduationCap className="size-3.5" /> Related course{courses.length > 1 ? "s" : ""} (optional)
      </div>
      {courses.map((c, i) => (
        <a
          key={i}
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover-lift animate-pop-in group flex items-start gap-3 rounded-xl border bg-card/60 p-3 shadow-soft hover:bg-card"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <span className="truncate">{c.title}</span>
              <ExternalLink className="size-3.5 shrink-0 opacity-50 transition group-hover:opacity-100" />
            </div>
            <div className="text-xs accent-text">{c.provider}</div>
            {c.blurb && <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{c.blurb}</div>}
          </div>
        </a>
      ))}
    </div>
  );
}
