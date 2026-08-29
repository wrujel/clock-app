import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { afterEach, vi } from "vitest";

// next/image needs the Next build pipeline; render a plain <img> instead so
// component tests can still assert on src/alt.
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    priority: _priority,
    ...rest
  }: {
    src: string | { src: string };
    alt?: string;
    priority?: boolean;
    [key: string]: unknown;
  }) =>
    React.createElement("img", {
      src: typeof src === "string" ? src : src.src,
      alt: alt ?? "",
      ...rest,
    }),
}));

// next/font runs at build time and is unavailable under Vitest.
vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-body", className: "font-body" }),
  Space_Grotesk: () => ({
    variable: "--font-display",
    className: "font-display",
  }),
}));

// jsdom ships neither of these; framer-motion probes both. Node-environment
// suites (the API routes) load this same file, hence the guard.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverStub {
  root = null;
  rootMargin = "";
  thresholds: number[] = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

globalThis.ResizeObserver ??=
  ResizeObserverStub as unknown as typeof ResizeObserver;
globalThis.IntersectionObserver ??=
  IntersectionObserverStub as unknown as typeof IntersectionObserver;

afterEach(() => {
  cleanup();
});
