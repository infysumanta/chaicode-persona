import type { PersonaId } from "./personas";

export interface Course {
  id: string;
  persona: PersonaId;
  title: string;
  provider: string; // e.g. "ChaiCode", "Udemy", "pro.piyushgarg.dev"
  url: string;
  tags: string[]; // lowercase keywords for matching a user's topic
  blurb: string;
  coupon?: string; // discount code to mention on the card (e.g. ChaiCode affiliate)
}

// Affiliate discount code for ChaiCode courses (10% off).
export const CHAICODE_COUPON = "SUMANTA52110";

// Real, current courses (URLs verified via research, mid-2026). Prices omitted —
// they rotate; the card links straight to the live enroll page. Udemy links that
// carry a referralCode are the creator's own official links.
export const CATALOG: Course[] = [
  // ---------------- Hitesh Choudhary — ChaiCode (coupon SUMANTA52110 for 10% off) ----------------
  {
    id: "hitesh-webdev-cohort",
    persona: "hitesh",
    title: "Web Dev Cohort (Live)",
    provider: "ChaiCode",
    url: "https://chaicode.com/cohorts/web-dev",
    tags: ["web", "webdev", "web dev", "fullstack", "full stack", "html", "css", "javascript", "js", "react", "nextjs", "next.js", "next", "node", "nodejs", "backend", "frontend", "typescript", "mongodb", "postgresql", "docker", "aws", "devops"],
    blurb: "5-month live full-stack cohort — JS, React, Next.js, Node, DBs, Docker, AWS, CI/CD.",
    coupon: CHAICODE_COUPON,
  },
  {
    id: "hitesh-genai-cohort",
    persona: "hitesh",
    title: "GenAI with Python (Live Cohort)",
    provider: "ChaiCode",
    url: "https://courses.chaicode.com/learn/batch/about?bundleId=232480",
    tags: ["genai", "gen ai", "generative ai", "ai", "python", "llm", "rag", "agents", "agentic", "mcp"],
    blurb: "Live cohort to build AI products with Python and GenAI — LLMs, RAG, agents.",
    coupon: CHAICODE_COUPON,
  },
  {
    id: "hitesh-dsa-cohort",
    persona: "hitesh",
    title: "DSA with Java (Live Cohort)",
    provider: "ChaiCode",
    url: "https://courses.chaicode.com/learn/batch/DSA-with-Java-Live-Cohort/about",
    tags: ["dsa", "data structures", "algorithms", "java", "leetcode", "interview"],
    blurb: "Live DSA cohort in Java for interview preparation.",
    coupon: CHAICODE_COUPON,
  },
  {
    id: "hitesh-all-cohorts",
    persona: "hitesh",
    title: "All ChaiCode Cohorts (DevOps, Data Science, DSA…)",
    provider: "ChaiCode",
    url: "https://courses.chaicode.com/learn/view-all?show=all&type=100",
    tags: ["devops", "data science", "datascience", "machine learning", "ml", "c++", "dsa", "cohort", "cohorts", "browse", "docker", "linux"],
    blurb: "Browse every live ChaiCode cohort — DevOps, Data Science, DSA and more.",
    coupon: CHAICODE_COUPON,
  },

  // ---------------- Hitesh Choudhary — Udemy (KEEPLEARNING coupon baked into the link) ----------------
  {
    id: "hitesh-genai-udemy",
    persona: "hitesh",
    title: "Full Stack Generative & Agentic AI with Python",
    provider: "Udemy",
    url: "https://www.udemy.com/course/full-stack-ai-with-python/",
    tags: ["genai", "gen ai", "generative ai", "agentic", "agents", "agent", "ai", "python", "llm", "rag", "mcp"],
    blurb: "GenAI + agentic AI with Python — LLMs, RAG, agents, MCP.",
  },
  {
    id: "hitesh-webdev-udemy",
    persona: "hitesh",
    title: "Complete Web Development Course",
    provider: "Udemy",
    url: "https://www.udemy.com/course/web-dev-master/",
    tags: ["web", "webdev", "web dev", "fullstack", "javascript", "js", "react", "node", "self paced"],
    blurb: "Self-paced beginner-to-pro full-stack web development.",
  },
  {
    id: "hitesh-react-udemy",
    persona: "hitesh",
    title: "Complete React & Next.js Course (AI-powered projects)",
    provider: "Udemy",
    url: "https://www.udemy.com/course/complete-react-and-nextjs-course-with-ai-powered-projects/",
    tags: ["react", "reactjs", "nextjs", "next.js", "next", "frontend", "ui", "hooks", "ssr"],
    blurb: "Master React and Next.js by building AI-powered projects.",
  },
  {
    id: "hitesh-python-udemy",
    persona: "hitesh",
    title: "The Ultimate Python Bootcamp (50 Projects)",
    provider: "Udemy",
    url: "https://www.udemy.com/course/100-days-of-python/",
    tags: ["python", "bootcamp", "projects", "beginner", "programming"],
    blurb: "Learn Python by building 50 real projects.",
  },
  {
    id: "hitesh-node-udemy",
    persona: "hitesh",
    title: "Node.js Backend Development",
    provider: "Udemy",
    url: "https://www.udemy.com/course/nodejs-backend/",
    tags: ["node", "nodejs", "backend", "express", "api", "rest", "server", "mongodb", "sql"],
    blurb: "Full Node.js backend — Express, databases, APIs, deployment.",
  },
  {
    id: "hitesh-dsa-udemy",
    persona: "hitesh",
    title: "Data Structures & Algorithms for Tech Interviews",
    provider: "Udemy",
    url: "https://www.udemy.com/course/data-structures-and-algorithm-dsa-for-tech-interviews/",
    tags: ["dsa", "data structures", "algorithms", "interview", "leetcode", "coding interview"],
    blurb: "DSA from basics to advanced, aimed at cracking tech interviews.",
  },
  {
    id: "hitesh-docker-udemy",
    persona: "hitesh",
    title: "Docker & Kubernetes for Beginners — DevOps Journey",
    provider: "Udemy",
    url: "https://www.udemy.com/course/docker-and-kubernetes-for-beginners-devops-journey/",
    tags: ["docker", "kubernetes", "k8s", "devops", "containers", "container", "containerization", "deployment"],
    blurb: "Docker and Kubernetes fundamentals for a DevOps journey.",
  },

  // ---------------- Piyush Garg ----------------
  {
    id: "piyush-docker",
    persona: "piyush",
    title: "Docker — Containerisation for Modern Development",
    provider: "pro.piyushgarg.dev",
    url: "https://pro.piyushgarg.dev/learn/docker",
    tags: ["docker", "container", "containers", "containerization", "containerisation", "devops", "compose", "kubernetes", "k8s", "aws", "ecs", "ecr", "image", "images"],
    blurb: "Premium Docker course — images, networking, volumes, Compose, ECS/ECR, autoscaling.",
  },
  {
    id: "piyush-genai",
    persona: "piyush",
    title: "Full Stack Generative & Agentic AI with Python",
    provider: "Udemy",
    url: "https://www.udemy.com/course/full-stack-ai-with-python/",
    tags: ["genai", "gen ai", "generative ai", "agentic", "agents", "agent", "ai", "python", "llm", "rag", "mcp", "langchain", "langgraph"],
    blurb: "GenAI + agentic AI with Python — LLMs, RAG, agents, MCP.",
  },
  {
    id: "piyush-node",
    persona: "piyush",
    title: "Node.js — Beginner to Advance",
    provider: "Udemy",
    url: "https://www.udemy.com/course/nodejs-backend/",
    tags: ["node", "nodejs", "backend", "express", "mongodb", "sql", "nosql", "orm", "api", "rest", "server"],
    blurb: "Full Node.js backend — Express, SQL/NoSQL, aggregation, testing, deployment.",
  },
  {
    id: "piyush-dsa-java",
    persona: "piyush",
    title: "Data Structures & Algorithms with Java",
    provider: "Udemy",
    url: "https://www.udemy.com/course/java-dsa/",
    tags: ["dsa", "data structures", "algorithms", "java", "leetcode", "interview"],
    blurb: "DSA fundamentals through advanced, in Java.",
  },
  {
    id: "piyush-twitter",
    persona: "piyush",
    title: "Full Stack Twitter Clone",
    provider: "Udemy",
    url: "https://www.udemy.com/course/full-stack-twitter-clone/",
    tags: ["fullstack", "full stack", "project", "twitter", "clone", "react", "node", "graphql", "real world", "mern"],
    blurb: "Build a full-stack Twitter clone — real-world end-to-end project.",
  },
  {
    id: "piyush-docker-udemy",
    persona: "piyush",
    title: "Docker Mastery Course",
    provider: "Udemy",
    url: "https://www.udemy.com/course/docker-mastery-course/",
    tags: ["docker", "containers", "container", "devops", "kubernetes", "compose"],
    blurb: "Master Docker — images, containers, Compose and more.",
  },
  {
    id: "piyush-courses-hub",
    persona: "piyush",
    title: "All of Piyush's Courses",
    provider: "piyushgarg.dev",
    url: "https://www.piyushgarg.dev/courses",
    tags: ["courses", "browse", "all", "system design", "web", "fullstack"],
    blurb: "Browse Piyush's full course catalog.",
  },
];

const norm = (s: string) => s.toLowerCase();

// English + common Hinglish filler so "how to learn X" reduces to just ["x"].
const STOP = new Set([
  "for", "the", "how", "learn", "want", "teach", "need", "know", "should", "could",
  "would", "from", "with", "this", "that", "and", "but", "you", "your", "can", "get",
  "use", "using", "start", "begin", "about", "into", "some", "any", "are", "was",
  "what", "when", "where", "which", "who", "why", "help", "please", "become", "good",
  "best", "way", "ways", "step", "steps", "guide", "roadmap", "hai", "hain", "kya",
  "kaise", "kaha", "kahan", "mujhe", "mko", "chahiye", "seekhna", "sikhna", "karna",
  "karu", "karun", "krna", "muje", "mera", "meri", "koi", "bhi", "aur", "raha", "rahe",
]);

/**
 * Return up to `limit` of a persona's courses relevant to `topic`.
 * Whole-word / tag matching only (no loose substrings), and stopwords are dropped,
 * so unrelated questions return [] and the AI never force-recommends.
 */
export function findCourses(persona: PersonaId, topic: string, limit = 3): Course[] {
  const t = norm(topic);
  const words = t
    .split(/[^a-z0-9+]+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
  if (words.length === 0) return [];

  const scored = CATALOG.filter((c) => c.persona === persona).map((c) => {
    const tokens = new Set(
      norm(`${c.title} ${c.blurb} ${c.tags.join(" ")}`)
        .split(/[^a-z0-9+]+/)
        .filter(Boolean)
    );
    const tagWords = new Set(c.tags.flatMap((tg) => norm(tg).split(" ")));
    let score = 0;

    // Multi-word tag phrases (e.g. "system design") matched against the raw topic.
    for (const tag of c.tags) {
      const tg = norm(tag);
      if (tg.includes(" ") && t.includes(tg)) score += 3;
    }
    // Single query words: strong hit on a tag word, weak hit elsewhere in the text.
    for (const w of words) {
      if (tagWords.has(w)) score += 3;
      else if (tokens.has(w)) score += 1;
    }
    return { c, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.c);
}

// Appended to each persona's system prompt. Keeps course suggestions optional
// and non-pushy — the user asked: give buy links, but never forcefully.
export const COURSE_GUIDANCE = `

Courses: When the user genuinely wants to learn a topic YOU teach, you may call the recommendCourses tool to fetch your real, current courses and share the enroll link as a FRIENDLY, OPTIONAL suggestion — one short line like "agar structured way me seekhna ho toh mera course bhi hai". Never pressure, never repeat it every message, and if the tool returns nothing relevant, just teach and don't mention any course. Free learning always comes first; the course is a bonus, not a paywall. IMPORTANT: whenever you recommend a ChaiCode course, always tell them to use coupon code ${CHAICODE_COUPON} for 10% off.`;

function normUrl(u: string): string {
  try {
    const x = new URL(u);
    return `${x.host}${x.pathname}`.replace(/\/$/, "").toLowerCase();
  } catch {
    return "";
  }
}

const URL_TO_COURSE = new Map(CATALOG.map((c) => [normUrl(c.url), c] as const));

export function courseForUrl(url: string): Course | undefined {
  return URL_TO_COURSE.get(normUrl(url));
}

/** Courses referenced by inline links in assistant text (matched to the catalog). */
export function extractCourseLinks(text: string): Course[] {
  const found = new Map<string, Course>();
  const md = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = md.exec(text))) {
    const c = courseForUrl(m[2]);
    if (c && !found.has(c.id)) found.set(c.id, c);
  }
  const bare = /https?:\/\/[^\s)\]]+/g;
  while ((m = bare.exec(text))) {
    const c = courseForUrl(m[0]);
    if (c && !found.has(c.id)) found.set(c.id, c);
  }
  return [...found.values()];
}

/** Strip catalog course links from markdown so a card renders instead of a raw link. */
export function stripCourseLinks(text: string): string {
  let out = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (mm, label, url) =>
    courseForUrl(url) ? label : mm
  );
  out = out.replace(/https?:\/\/[^\s)\]]+/g, (u) => (courseForUrl(u) ? "" : u));
  return out;
}
