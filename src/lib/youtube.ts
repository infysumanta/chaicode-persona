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

export interface YtSearchLink {
  url: string;
  label?: string;
  query: string;
  channel?: string; // "@handle" when the search is scoped to a channel
}

/** Recognizes YouTube search-results / channel-search URLs (not single videos). */
export function parseYtSearch(url: string): { query: string; channel?: string } | null {
  try {
    const u = new URL(url);
    if (!/(^|\.)youtube\.com$/.test(u.hostname)) return null;
    if (youtubeId(url)) return null; // it's a video, handled elsewhere
    if (u.pathname === "/results" && u.searchParams.get("search_query")) {
      return { query: u.searchParams.get("search_query") as string };
    }
    const m = u.pathname.match(/^\/(@[\w.-]+)\/search$/);
    if (m && u.searchParams.get("query")) {
      return { query: u.searchParams.get("query") as string, channel: m[1] };
    }
    return null;
  } catch {
    return null;
  }
}

export function extractYouTubeSearchLinks(text: string): YtSearchLink[] {
  const found = new Map<string, YtSearchLink>();
  const add = (url: string, label?: string) => {
    const s = parseYtSearch(url);
    if (s && !found.has(url)) found.set(url, { url, label, query: s.query, channel: s.channel });
  };
  const md = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = md.exec(text))) add(m[2], m[1]);
  const bare = /https?:\/\/[^\s)\]]+/g;
  while ((m = bare.exec(text))) add(m[0]);
  return [...found.values()];
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
    youtubeId(url) || parseYtSearch(url) ? label : m
  );
  out = out.replace(/https?:\/\/[^\s)\]]+/g, (u) =>
    youtubeId(u) || parseYtSearch(u) ? "" : u
  );
  return out;
}
