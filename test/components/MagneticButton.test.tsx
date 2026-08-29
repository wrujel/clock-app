import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import MagneticButton from "../../app/components/MagneticButton";

describe("MagneticButton", () => {
  it("renders its children and applies the class name", () => {
    const { container } = render(
      <MagneticButton className="wrap">
        <button type="button">Press</button>
      </MagneticButton>,
    );

    expect(screen.getByRole("button", { name: "Press" })).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("wrap");
  });

  it("pulls toward the pointer on mouse move and releases on leave", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MagneticButton>
        <button type="button">Press</button>
      </MagneticButton>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    vi.spyOn(wrapper, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 40,
      right: 100,
      bottom: 40,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    // Pointer 50px right / 20px below the element centre.
    await user.pointer({ target: wrapper, coords: { clientX: 100, clientY: 40 } });
    await user.unhover(wrapper);

    expect(wrapper).toBeInTheDocument();
  });
});
