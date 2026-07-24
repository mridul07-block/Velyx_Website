import { marked } from "marked";

/* ------------------------------------------------------------------
   BLOG — loads markdown posts from src/content/blog/*.md.

   To publish a post: drop a new .md file in src/content/blog/ with
   frontmatter (title, description, date, tags, cover). Everything else
   — routing, SEO, sitemap, prerender — is automatic.
------------------------------------------------------------------ */

const files = import.meta.glob("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

// Minimal frontmatter parser: --- key: value --- then markdown body.
function parse(raw) {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = val;
  }
  return { data, body: m[2] };
}

function readingTime(text) {
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

const POSTS = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split("/").pop().replace(/\.md$/, "");
    const { data, body } = parse(raw);
    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.date || "",
      tags: (data.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
      cover: data.cover || "",
      readingTime: readingTime(body),
      html: marked.parse(body),
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const getPosts = () => POSTS;
export const getPost = (slug) => POSTS.find((p) => p.slug === slug);

export function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date)) return d;
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}
