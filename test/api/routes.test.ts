// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "../../app/api/route";
import { GET as getQuote } from "../../app/api/quote/route";
import { POST } from "../../app/api/data/route";
import { quotes } from "../../app/api/quote/quotes-data";

describe("GET /api", () => {
  it("returns the service descriptor", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      name: "Clock App API in nestjs",
      author: "wrujel",
    });
  });
});

describe("GET /api/quote", () => {
  it("returns a quote with no-store cache headers", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const res = await getQuote();

    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe(
      "no-cache, no-store, max-age=0, must-revalidate",
    );
    await expect(res.json()).resolves.toEqual({
      content: quotes[0].quote,
      author: quotes[0].author,
    });
  });
});

describe("POST /api/data", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  it("merges the geo lookup for the posted IP with a random quote", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ city: "Lima", country_name: "Peru" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await POST(
      new Request("http://localhost/api/data", {
        method: "POST",
        body: JSON.stringify({ ip: "8.8.8.8" }),
      }),
    );

    expect(fetchMock).toHaveBeenCalledWith("https://freegeoip.app/json/8.8.8.8");
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      city_name: "Lima",
      country_name: "Peru",
      content: quotes[0].quote,
      author: quotes[0].author,
    });

    vi.unstubAllGlobals();
  });

  it("passes through undefined geo fields when the lookup returns nothing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ json: async () => ({}) }),
    );

    const res = await POST(
      new Request("http://localhost/api/data", {
        method: "POST",
        body: JSON.stringify({ ip: "" }),
      }),
    );

    const body = await res.json();
    expect(body.city_name).toBeUndefined();
    expect(body.country_name).toBeUndefined();
    expect(body.content).toBe(quotes[0].quote);

    vi.unstubAllGlobals();
  });
});
