import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import CursorGlow from "../../app/components/CursorGlow";

describe("CursorGlow", () => {
  it("renders a decorative halo", () => {
    const { container } = render(<CursorGlow />);
    const glow = container.firstElementChild;
    expect(glow).toBeInTheDocument();
    expect(glow).toHaveAttribute("aria-hidden");
  });

  it("tracks the pointer", () => {
    const { container } = render(<CursorGlow />);

    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 320, clientY: 180 }),
      );
    });

    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("detaches its listener on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<CursorGlow />);

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
  });
});
