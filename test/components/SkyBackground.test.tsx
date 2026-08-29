import { render } from "@testing-library/react";
import { act } from "react";
import { afterEach, describe, expect, it } from "vitest";
import SkyBackground from "../../app/components/SkyBackground";

const at = (h: number, m = 0, s = 0) => new Date(2026, 7, 28, h, m, s);

const setWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });
};

const originalWidth = window.innerWidth;

// Layer order inside the sky wrapper: gradient, stars, orb, haze, vignette.
const layer = (container: HTMLElement, index: number) =>
  (container.firstElementChild as HTMLElement).children[index] as HTMLElement;

const gradientOf = (container: HTMLElement) => layer(container, 0);
const starsOf = (container: HTMLElement) => layer(container, 1);
const orbPosition = (container: HTMLElement) => {
  const orb = layer(container, 2);
  return { left: orb.style.left, top: orb.style.top };
};

afterEach(() => {
  setWidth(originalWidth);
});

describe("SkyBackground", () => {
  it("renders the full stack of sky layers plus 90 stars", () => {
    const { container } = render(<SkyBackground now={at(2)} />);
    const sky = container.firstElementChild as HTMLElement;

    expect(sky).toHaveAttribute("aria-hidden");
    expect(sky.children).toHaveLength(5);
    expect(container.querySelectorAll("span")).toHaveLength(90);
  });

  it("paints a dark, fully starred sky at midnight", () => {
    const { container } = render(<SkyBackground now={at(0)} />);
    expect(gradientOf(container).style.background).toContain("rgb(2, 4, 18)");
    expect(starsOf(container).style.opacity).toBe("1");
  });

  it("fades the stars out entirely at midday", () => {
    const { container } = render(<SkyBackground now={at(12)} />);
    expect(starsOf(container).style.opacity).toBe("0");
  });

  it("interpolates between palette stops through dawn", () => {
    const { container } = render(<SkyBackground now={at(5, 30)} />);
    // Halfway between the 4.5h and 6.5h stops.
    expect(gradientOf(container).style.background).toContain("rgb(21, 23, 59)");
  });

  it("clamps to the final palette stop at the end of the day", () => {
    const { container } = render(<SkyBackground now={at(23, 59, 59)} />);
    expect(gradientOf(container).style.background).toContain("rgb(2, 4, 18)");
  });

  it("puts the sun at the horizon at 06:00 and its apex at noon", () => {
    setWidth(1440);
    const { container: dawn } = render(<SkyBackground now={at(6)} />);
    expect(orbPosition(dawn)).toEqual({ left: "30%", top: "76%" });

    const { container: noon } = render(<SkyBackground now={at(12)} />);
    expect(orbPosition(noon)).toEqual({ left: "55%", top: "16%" });
  });

  it("swaps to the moon after 18:00 and carries it past midnight", () => {
    setWidth(1440);
    const { container: dusk } = render(<SkyBackground now={at(18)} />);
    expect(orbPosition(dusk)).toEqual({ left: "30%", top: "76%" });

    // 03:00 sits 9h into the 18:00 - 06:00 night arc.
    const { container: night } = render(<SkyBackground now={at(3)} />);
    expect(orbPosition(night).left).toBe("67.5%");
  });

  it("uses the mobile arc below 640px", () => {
    setWidth(500);
    const { container } = render(<SkyBackground now={at(12)} />);
    expect(orbPosition(container)).toEqual({ left: "50%", top: "20%" });
  });

  it("uses the tablet arc below 1024px", () => {
    setWidth(800);
    const { container } = render(<SkyBackground now={at(12)} />);
    expect(orbPosition(container)).toEqual({ left: "50%", top: "17%" });
  });

  it("re-reads the arc when the window resizes", () => {
    setWidth(1440);
    const { container } = render(<SkyBackground now={at(12)} />);
    expect(orbPosition(container).left).toBe("55%");

    act(() => {
      setWidth(500);
      window.dispatchEvent(new Event("resize"));
    });

    expect(orbPosition(container).left).toBe("50%");
  });

  it("detaches its resize listener on unmount", () => {
    const { unmount, container } = render(<SkyBackground now={at(12)} />);
    unmount();

    act(() => {
      setWidth(500);
      window.dispatchEvent(new Event("resize"));
    });

    expect(container.firstElementChild).toBeNull();
  });
});
