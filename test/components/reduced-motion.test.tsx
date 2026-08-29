import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// Every component reads framer-motion's useReducedMotion directly, and the
// library caches the media-query result in a module singleton — so the hook
// itself is what has to be replaced.
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, useReducedMotion: () => true };
});

const { default: CursorGlow } = await import("../../app/components/CursorGlow");
const { default: FlipClock } = await import("../../app/components/FlipClock");
const { default: MagneticButton } = await import(
  "../../app/components/MagneticButton"
);
const { default: StatsPanel } = await import(
  "../../app/components/StatsPanel"
);

describe("with prefers-reduced-motion", () => {
  it("CursorGlow renders nothing at all", () => {
    const { container } = render(<CursorGlow />);
    expect(container).toBeEmptyDOMElement();
  });

  it("CursorGlow attaches no pointer listener", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    render(<CursorGlow />);
    expect(addSpy).not.toHaveBeenCalledWith("mousemove", expect.any(Function));
  });

  it("FlipClock still renders the time", () => {
    render(<FlipClock now={new Date(2026, 7, 28, 9, 5, 3)} zone="-5" />);
    expect(screen.getByLabelText("09:05:03")).toBeInTheDocument();
  });

  it("MagneticButton ignores pointer movement", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MagneticButton>
        <button type="button">Press</button>
      </MagneticButton>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    const rectSpy = vi.spyOn(wrapper, "getBoundingClientRect");

    await user.pointer({
      target: wrapper,
      coords: { clientX: 100, clientY: 40 },
    });

    // Bails before measuring, so the element is never read.
    expect(rectSpy).not.toHaveBeenCalled();
  });

  it("StatsPanel shows numeric values immediately, without counting up", async () => {
    render(
      <StatsPanel
        open
        isNight={false}
        stats={[{ label: "Day of the year", value: "240", numeric: true }]}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("240")).toBeInTheDocument();
    });
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });
});
