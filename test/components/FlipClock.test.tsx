import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FlipClock from "../../app/components/FlipClock";

const at = (h: number, m: number, s: number) =>
  new Date(2026, 7, 28, h, m, s);

describe("FlipClock", () => {
  it("zero-pads hours, minutes and seconds in its accessible label", () => {
    render(<FlipClock now={at(9, 5, 3)} zone="-5" />);
    expect(screen.getByLabelText("09:05:03")).toBeInTheDocument();
  });

  it("renders the digits split into single characters", () => {
    const { container } = render(<FlipClock now={at(23, 41, 8)} zone="+0" />);
    expect(screen.getByLabelText("23:41:08")).toBeInTheDocument();
    expect(container.textContent).toContain(":");
  });

  it("shows the UTC offset when a zone is given", () => {
    render(<FlipClock now={at(12, 0, 0)} zone="-5" />);
    expect(screen.getByText("UTC-5")).toBeInTheDocument();
  });

  it("omits the UTC badge when the zone is empty", () => {
    render(<FlipClock now={at(12, 0, 0)} zone="" />);
    expect(screen.queryByText(/^UTC/)).not.toBeInTheDocument();
  });
});
