/* ------------------------------------------------------------------
   INDEXNOW — instantly notify Bing, Yandex & other engines of URLs.
   Reads public/sitemap.xml and submits every URL. Run AFTER deploy
   (the key file must be live at the domain root):
     npm run indexnow
------------------------------------------------------------------ */
import { readFileSync } from "node:fs";

const KEY = "9f63db800407065a4addc601d9e1e6b7";
const HOST = "www.velyxlabs.in";

const sitemap = readFileSync("public/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: urls,
};

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

console.log(`IndexNow: ${res.status} ${res.statusText} — submitted ${urls.length} URLs`);
if (res.status >= 400) console.log(await res.text());
