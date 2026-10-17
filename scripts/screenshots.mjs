// Captures the sticky version bar (closed bar and open "What's new" panel)
// and the Change log section (default view, Features and Fixes filters, and
// the list after "Load more") at desktop (1280 px) and mobile (390 px) widths.
//
// Targets a running server: `pnpm dev` first, then
// `pnpm screenshots [url]` (default http://localhost:3000).
// Writes PNGs to ./screenshots/ (git-ignored). The maintainer runs this
// during review against the real API and attaches the images to the PR.
//
// Without real Releases nothing renders; the script then logs a
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

const settle = () => new Promise((r) => setTimeout(r, 300));

async function captureVersionBar(page, viewport) {
  await page.goto(BASE_URL, { waitUntil: "networkidle0" });
  await page.evaluate(() => window.scrollTo(0, 0));

  const toggle = await page.$("button[aria-expanded]");
  if (!toggle) {
    console.log(
      `[${viewport.name}] version bar not rendered (no Releases); skipping.`,
    );
    return;
  }

  await page.screenshot({
    path: path.join(OUT_DIR, `version-bar-closed-${viewport.name}.png`),
  });

  await toggle.click();
  await page.waitForSelector("button[aria-expanded='true']");
  await settle();
  await page.screenshot({
    path: path.join(OUT_DIR, `version-bar-open-${viewport.name}.png`),
  });
  console.log(`[${viewport.name}] captured version bar closed + open.`);
}

async function captureChangeLog(page, viewport) {
  await page.goto(`${BASE_URL}/#changelog`, { waitUntil: "networkidle0" });

  const feed = await page.$("[data-changelog-feed]");
  if (!feed) {
    console.log(
      `[${viewport.name}] change log not rendered (no Releases); skipping.`,
    );
    return;
  }

  const scrollToSection = () =>
    page.$eval("#changelog", (el) => el.scrollIntoView({ block: "start" }));

  await scrollToSection();
  await settle();
  await page.screenshot({
    path: path.join(OUT_DIR, `changelog-default-${viewport.name}.png`),
  });

  for (const filter of ["Features", "Fixes"]) {
    const chip = await page.$(`[data-changelog-filter="${filter}"]`);
    if (!chip) {
      console.log(`[${viewport.name}] ${filter} filter missing; skipping.`);
      continue;
    }
    await chip.click();
    await settle();
    await page.screenshot({
      path: path.join(
        OUT_DIR,
        `changelog-${filter.toLowerCase()}-${viewport.name}.png`,
      ),
    });
    console.log(`[${viewport.name}] captured ${filter} filter.`);
  }

  await page.click('[data-changelog-filter="All"]');
  await settle();
  const loadMore = await page.$("[data-changelog-load-more]");
  if (!loadMore) {
    console.log(
      `[${viewport.name}] fewer than 13 rows; no Load more to capture.`,
    );
    return;
  }
  await loadMore.click();
  await settle();
  await scrollToSection();
  await settle();
  await page.screenshot({
    path: path.join(OUT_DIR, `changelog-loaded-more-${viewport.name}.png`),
  });
  console.log(`[${viewport.name}] captured after Load more.`);
}

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
    await captureVersionBar(page, viewport);
    await captureChangeLog(page, viewport);
    await page.close();
  }
} finally {
  await browser.close();
}
