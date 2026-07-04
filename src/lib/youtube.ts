export interface YtLink {
  url: string;
  id: string;
  label?: string;
}

// Matches watch?v=, youtu.be/, shorts/, embed/, live/ — captures the 11-char id.
const ID_RE =
  /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

export function youtubeId(url: string): string | null {
  const m = url.match(ID_RE);
  return m ? m[1] : null;
}

export function youtubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/** Pull unique YouTube links out of markdown/plain text (keeps the link label). */
export function extractYouTubeLinks(text: string): YtLink[] {
  const found = new Map<string, YtLink>();

  // Markdown links first, so we can keep the human label.
  const md = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = md.exec(text))) {
    const id = youtubeId(m[2]);
    if (id && !found.has(id)) found.set(id, { url: m[2], id, label: m[1] });
  }

  // Bare URLs.
  const bare = /https?:\/\/[^\s)\]]+/g;
  while ((m = bare.exec(text))) {
    const id = youtubeId(m[0]);
    if (id && !found.has(id)) found.set(id, { url: m[0], id });
  }

  return [...found.values()];
}

/**
 * Remove YouTube links from markdown so they don't render as raw hyperlinks —
 * the rich preview card carries the click instead. Markdown links keep their
 * label as plain text; bare YouTube URLs are dropped.
 */
export function stripYouTubeLinks(text: string): string {
  let out = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (m, label, url) =>
    youtubeId(url) ? label : m
  );
  out = out.replace(/https?:\/\/[^\s)\]]+/g, (u) => (youtubeId(u) ? "" : u));
  return out;
}
