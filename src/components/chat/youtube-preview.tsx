"use client";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { youtubeThumb } from "@/lib/youtube";

interface Meta {
  title?: string;
  author?: string;
  thumbnail?: string;
}

export function YouTubePreview({ url, id, label }: { url: string; id: string; label?: string }) {
  const [meta, setMeta] = useState<Meta | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/oembed?url=${encodeURIComponent(url)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d && !d.error) setMeta(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [url]);

  const title = meta?.title || label || "Watch on YouTube";
  const thumb = meta?.thumbnail || youtubeThumb(id);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group my-2 block overflow-hidden rounded-xl border bg-card/60 transition hover:accent-ring hover:bg-card sm:flex"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted sm:w-48">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg transition group-hover:scale-110">
            <Play className="size-5 fill-current" />
          </span>
        </span>
      </div>
      <div className="min-w-0 flex-1 p-3">
        <div className="text-xs font-medium text-red-500">YouTube</div>
        <div className="mt-0.5 line-clamp-2 text-sm font-semibold">{title}</div>
        {meta?.author && (
          <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">{meta.author}</div>
        )}
      </div>
    </a>
  );
}
