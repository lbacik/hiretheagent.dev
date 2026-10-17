// Captures the sticky version bar (closed bar and open "What's new" panel)
// at desktop (1280 px) and mobile (390 px) widths.
//
// Targets a running server: `pnpm dev` first, then
// `pnpm screenshots [url]` (default http://localhost:3000).
// Writes PNGs to ./screenshots/ (git-ignored). The maintainer runs this
// during review against the real API and attaches the images to the PR.
//
// Without real Releases the bar renders nothing; the script then logs a
// skip instead of failing.

import { mkdir } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

const BASE_URL =
  process.argv[2] ?? process.env.SCREENSHOTS_URL ?? "http://localhost:3000";
const OUT_DIR = path.join(process.cwd(), "screenshots");

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 },
];

// CHROME_PATH points the script at a system Chrome when Puppeteer's
// downloaded browser is unavailable.
const launchOptions = { args: ["--no-sandbox", "--disable-setuid-sandbox"] };
if (process.env.CHROME_PATH)
  launchOptions.executablePath = process.env.CHROME_PATH;

const browser = await puppeteer.launch(launchOptions);
try {
  await mkdir(OUT_DIR, { recursive: true });
  for (const viewport of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
    });
    await page.goto(BASE_URL, { waitUntil: "networkidle0" });
    await page.evaluate(() => window.scrollTo(0, 0));

    const toggle = await page.$("button[aria-expanded]");
    if (!toggle) {
      console.log(
        `[${viewport.name}] version bar not rendered (no Releases); skipping.`,
      );
      await page.close();
      continue;
    }

    await page.screenshot({
      path: path.join(OUT_DIR, `version-bar-closed-${viewport.name}.png`),
    });

    await toggle.click();
    await page.waitForSelector("button[aria-expanded='true']");
    await new Promise((r) => setTimeout(r, 300));
    await page.screenshot({
      path: path.join(OUT_DIR, `version-bar-open-${viewport.name}.png`),
    });
    console.log(`[${viewport.name}] captured closed + open.`);
    await page.close();
  }
} finally {
  await browser.close();
}
