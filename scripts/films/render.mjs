/* Renders scripts/films/<slug>.html to public/films/<slug>.mp4 + .webp.
   `preview` writes a contact sheet to the system temp dir instead.
   Needs Chrome, ffmpeg and cwebp; puppeteer-core is resolved from
   PUPPETEER_CORE (a path) or the package name. */
import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const [, , slug, mode] = process.argv;
const puppeteer = (await import(process.env.PUPPETEER_CORE || "puppeteer-core")).default;
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", args: ["--allow-file-access-from-files"] });
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 1000 });
page.on("pageerror", (e) => { console.error("PAGEERR", e.message); process.exitCode = 1; });
await page.goto(`file://${resolve("scripts/films", `${slug}.html`)}`, { waitUntil: "load" });
const { DUR, FPS } = await page.evaluate(() => window.ready);
const frame = (t) => page.evaluate(async (tt) => { await window.draw(tt); return document.getElementById("c").toDataURL("image/png"); }, t).then((d) => Buffer.from(d.split(",")[1], "base64"));

if (mode === "preview") {
  const dir = mkdtempSync(join(tmpdir(), `film-${slug}-`));
  const times = [0.6, 1.6, 3, 4.6, 5.6, 7, 8.6, 9.6, 11];
  for (let i = 0; i < times.length; i++) writeFileSync(join(dir, `${i}.png`), await frame(times[i]));
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", join(dir, "%d.png"), "-vf", "scale=800:-1,tile=3x3", "-frames:v", "1", join(dir, "sheet.jpg")]);
  console.log(join(dir, "sheet.jpg"));
} else {
  const crf = process.env.CRF || "18";
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", crf, "-pix_fmt", "yuv420p", "-movflags", "+faststart", `public/films/${slug}.mp4`], { stdio: ["pipe", "inherit", "inherit"] });
  const n = Math.round(DUR * FPS);
  for (let i = 0; i < n; i++) { if (!ff.stdin.write(await frame(i / FPS))) await new Promise((r) => ff.stdin.once("drain", r)); }
  ff.stdin.end(); await new Promise((r) => ff.on("close", r));
  const poster = join(tmpdir(), `${slug}-poster.png`); writeFileSync(poster, await frame(9.6));
  execFileSync("cwebp", ["-quiet", "-q", "82", poster, "-o", `public/films/${slug}.webp`]);
  console.log(`public/films/${slug}.mp4`);
}
await browser.close();
