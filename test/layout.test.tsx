import { describe, expect, it } from "vitest";
import RootLayout, { metadata } from "../app/layout";

describe("RootLayout", () => {
  it("declares the document metadata", () => {
    expect(metadata.title).toBe("Circadia — a living clock");
    expect(metadata.description).toMatch(/living sky/);
  });

  it("renders an html shell carrying both font variables", () => {
    const tree = RootLayout({ children: <p>content</p> });

    expect(tree.type).toBe("html");
    expect(tree.props.lang).toBe("en");
    expect(tree.props.className).toBe("--font-body --font-display");

    const body = tree.props.children;
    expect(body.type).toBe("body");
    expect(body.props.children).toEqual(<p>content</p>);
  });
});
