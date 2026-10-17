import { describe, expect, it } from "vitest";

import { getArticles } from "./articles";

describe("getArticles", () => {
  it("sorts oldest first, whatever order the list is written in", () => {
    const articles = getArticles();
    expect(articles.length).toBeGreaterThan(0);
    const dates = articles.map((a) => a.publishedAt);
    expect(dates).toEqual([...dates].sort());
    expect(articles[0].title).toBe("Coding Agent — Attempt 1");
    expect(articles[articles.length - 1].title).toBe(
      "The trust boundary behind ready-for-agent",
    );
  });

  it("returns a fresh array on each call", () => {
    const first = getArticles();
    first.pop();
    expect(getArticles().length).toBeGreaterThan(first.length);
  });
});

describe("articles data", () => {
  it("has https Medium URLs without a query string", () => {
    for (const article of getArticles()) {
      expect(article.url.startsWith("https://")).toBe(true);
      const host = new URL(article.url).hostname;
      expect(host === "medium.com" || host.endsWith(".medium.com")).toBe(true);
      expect(new URL(article.url).search).toBe("");
      expect(article.url.includes("?")).toBe(false);
    }
  });

  it("has valid YYYY-MM-DD publish dates", () => {
    for (const article of getArticles()) {
      expect(article.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      // Round-trip guards against impossible dates like 2026-13-40.
      expect(new Date(article.publishedAt).toISOString().slice(0, 10)).toBe(
        article.publishedAt,
      );
    }
  });

  it("has unique URLs", () => {
    const urls = getArticles().map((a) => a.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
