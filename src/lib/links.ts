export interface RefLink {
  url: string;
  label: string;
  domain: string;
}

/** Extract unique http(s) links from markdown/plain text, keeping labels. */
export function extractLinks(text: string): RefLink[] {
  const found = new Map<string, RefLink>();
  const add = (url: string, label?: string) => {
    let domain = "";
    try {
      domain = new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return;
    }
    if (!found.has(url)) found.set(url, { url, label: (label || domain).trim(), domain });
  };
  const md = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = md.exec(text))) add(m[2], m[1]);
  const bare = /https?:\/\/[^\s)\]]+/g;
  while ((m = bare.exec(text))) add(m[0]);
  return [...found.values()];
}
