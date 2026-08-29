// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import Home from "../app/page";
import SkyBackground from "../app/components/SkyBackground";
import { useMounted } from "../app/hooks/useMounted";

/** Minimal harness to read a hook's server snapshot. */
function ProbeMounted() {
  return <span>{String(useMounted())}</span>;
}

describe("server rendering", () => {
  it("reports useMounted as false before hydration", () => {
    expect(renderToString(<ProbeMounted />)).toContain("false");
  });

  it("renders the loader without touching window", () => {
    const html = renderToString(<Home />);

    expect(html).toContain("Circadia");
    // Ambient layers are gated on hydration, so no sky or cursor glow yet.
    expect(html).not.toContain("linear-gradient");
  });

  it("falls back to a default viewport width with no window present", () => {
    expect(globalThis.window).toBeUndefined();
    const html = renderToString(
      <SkyBackground now={new Date(2026, 7, 28, 12, 0, 0)} />,
    );

    // 1440px desktop arc puts the midday sun at 55% / 16%.
    expect(html).toContain("left:55%");
    expect(html).toContain("top:16%");
  });

  it("does not schedule the fetch effect on the server", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    renderToString(<Home />);

    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
