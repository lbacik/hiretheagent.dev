import { afterEach, describe, expect, it, vi } from "vitest";

import {
  isNewsletterConfigured,
  newsletterConfig,
  subscribeToListmonk,
  type ListmonkConfig,
} from "./listmonk";

const FULL_ENV = {
  LISTMONK_URL: "https://lists.example.com",
  LISTMONK_API_USER: "api-user",
  LISTMONK_API_TOKEN: "api-token",
  LISTMONK_LIST_ID: "7",
};

const CONFIG: ListmonkConfig = {
  baseUrl: "https://lists.example.com",
  apiUser: "api-user",
  apiToken: "api-token",
  listId: 7,
};

function responseWith(status: number): Response {
  return new Response(null, { status });
}

describe("newsletterConfig", () => {
  it("returns the config when all four LISTMONK_* vars are set", () => {
    expect(newsletterConfig({ ...FULL_ENV })).toEqual(CONFIG);
  });

  it.each(["LISTMONK_URL", "LISTMONK_API_USER", "LISTMONK_API_TOKEN", "LISTMONK_LIST_ID"])(
    "returns null when %s is missing",
    (key) => {
      const env = { ...FULL_ENV };
      delete env[key as keyof typeof env];
      expect(newsletterConfig(env)).toBeNull();
      expect(isNewsletterConfigured(env)).toBe(false);
    },
  );

  it.each(["LISTMONK_URL", "LISTMONK_API_USER", "LISTMONK_API_TOKEN", "LISTMONK_LIST_ID"])(
    "returns null when %s is blank",
    (key) => {
      expect(newsletterConfig({ ...FULL_ENV, [key]: "   " })).toBeNull();
    },
  );

  it.each(["abc", "0", "-3", "7.5", ""])("treats LISTMONK_LIST_ID=%s as unconfigured", (listId) => {
    expect(newsletterConfig({ ...FULL_ENV, LISTMONK_LIST_ID: listId })).toBeNull();
  });

  it("strips trailing slashes from the URL", () => {
    expect(newsletterConfig({ ...FULL_ENV, LISTMONK_URL: "https://lists.example.com///" })?.baseUrl).toBe(
      "https://lists.example.com",
    );
  });
});

describe("subscribeToListmonk", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function mockFetch(status: number) {
    const fetchMock = vi.fn(async () => responseWith(status));
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  it("posts once to the subscribers API with status enabled, the list id and token auth", async () => {
    const fetchMock = mockFetch(200);
    const outcome = await subscribeToListmonk(CONFIG, "visitor@example.com", fetch);
    expect(outcome).toBe("subscribed");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://lists.example.com/api/subscribers");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({
      "Content-Type": "application/json",
      Authorization: "token api-user:api-token",
    });
    expect(JSON.parse(init.body as string)).toEqual({
      email: "visitor@example.com",
      status: "enabled",
      lists: [7],
    });
  });

  it("treats a 409 duplicate as already-subscribed without a second request", async () => {
    const fetchMock = mockFetch(409);
    expect(await subscribeToListmonk(CONFIG, "visitor@example.com", fetch)).toBe("already-subscribed");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([401, 403])("maps %i to credentials-error", async (status) => {
    expect(await subscribeToListmonk(CONFIG, "visitor@example.com", mockFetch(status) as typeof fetch)).toBe(
      "credentials-error",
    );
  });

  it.each([429, 500, 502, 503])("maps %i to transient-failure", async (status) => {
    expect(await subscribeToListmonk(CONFIG, "visitor@example.com", mockFetch(status) as typeof fetch)).toBe(
      "transient-failure",
    );
  });

  it.each([400, 404, 422])("maps other 4xx %i to rejected", async (status) => {
    expect(await subscribeToListmonk(CONFIG, "visitor@example.com", mockFetch(status) as typeof fetch)).toBe(
      "rejected",
    );
  });

  it("maps network errors to transient-failure", async () => {
    const failing = vi.fn(async () => {
      throw new TypeError("fetch failed");
    });
    expect(await subscribeToListmonk(CONFIG, "visitor@example.com", failing as typeof fetch)).toBe(
      "transient-failure",
    );
  });

  it("maps timeouts (aborted requests) to transient-failure", async () => {
    const aborting = vi.fn(async () => {
      throw new DOMException("The operation was aborted.", "TimeoutError");
    });
    expect(await subscribeToListmonk(CONFIG, "visitor@example.com", aborting as typeof fetch)).toBe(
      "transient-failure",
    );
  });

  it("rejects a malformed email without calling listmonk", async () => {
    const fetchMock = mockFetch(200);
    expect(await subscribeToListmonk(CONFIG, "not-an-email", fetch)).toBe("invalid-email");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
