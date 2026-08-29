import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import IconArrowDown from "../../app/components/IconArrowDown";
import IconMoon from "../../app/components/IconMoon";
import IconRefresh from "../../app/components/IconRefresh";
import IconSun from "../../app/components/IconSun";

describe("icons", () => {
  it("renders the arrow-down icon as decorative", () => {
    render(<IconArrowDown />);
    const img = screen.getByRole("presentation");
    expect(img).toHaveAttribute("src", "/stub-image.svg");
    expect(img).toHaveAttribute("width", "16");
    expect(img).toHaveAttribute("height", "8");
  });

  it("renders the refresh icon as decorative", () => {
    render(<IconRefresh />);
    const img = screen.getByRole("presentation");
    expect(img).toHaveAttribute("width", "18");
    expect(img).toHaveAttribute("height", "18");
  });

  it("renders the moon icon with a label", () => {
    render(<IconMoon />);
    expect(screen.getByAltText("icon moon")).toHaveAttribute(
      "src",
      "/stub-image.svg",
    );
  });

  it("renders the sun icon with a label", () => {
    render(<IconSun />);
    expect(screen.getByAltText("icon sun")).toHaveAttribute(
      "src",
      "/stub-image.svg",
    );
  });
});
