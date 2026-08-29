// @vitest-environment node
import { describe, expect, it, vi, afterEach } from "vitest";
import { generateQuote } from "../../app/api/quote/generate-quote";
import { quotes } from "../../app/api/quote/quotes-data";

describe("generateQuote", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a quote from the bundled collection", () => {
    const quote = generateQuote();
    expect(quotes).toContain(quote);
    expect(quote).toHaveProperty("quote");
    expect(quote).toHaveProperty("author");
  });

  it("maps Math.random() 0 to the first quote", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(generateQuote()).toBe(quotes[0]);
  });

  it("never overruns the collection when Math.random() approaches 1", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999999);
    expect(generateQuote()).toBe(quotes[quotes.length - 1]);
  });
});

describe("quotes-data", () => {
  it("is a non-empty list of well-formed quotes", () => {
    expect(quotes.length).toBeGreaterThan(0);
    for (const q of quotes) {
      expect(typeof q.quote).toBe("string");
      expect(q.quote.length).toBeGreaterThan(0);
      expect(typeof q.author).toBe("string");
      expect(q.author.length).toBeGreaterThan(0);
    }
  });
});
