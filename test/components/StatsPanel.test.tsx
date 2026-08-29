import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatsPanel from "../../app/components/StatsPanel";

const stats = [
  { label: "Current timezone", value: "America/Lima", numeric: false },
  { label: "Day of the year", value: "240", numeric: true },
  { label: "Day of the week", value: "Friday", numeric: false },
  { label: "Week number", value: "34", numeric: true },
];

describe("StatsPanel", () => {
  it("renders nothing while closed", () => {
    render(<StatsPanel open={false} isNight={false} stats={stats} />);
    expect(screen.queryByText("Current timezone")).not.toBeInTheDocument();
  });

  it("renders every label when open", () => {
    render(<StatsPanel open isNight={false} stats={stats} />);
    for (const s of stats) {
      expect(screen.getByText(s.label)).toBeInTheDocument();
    }
  });

  it("shows string values verbatim", () => {
    render(<StatsPanel open isNight={false} stats={stats} />);
    expect(screen.getByText("America/Lima")).toBeInTheDocument();
    expect(screen.getByText("Friday")).toBeInTheDocument();
  });

  it("counts numeric values up to their target", async () => {
    render(<StatsPanel open isNight={false} stats={stats} />);
    await waitFor(
      () => {
        expect(screen.getByText("240")).toBeInTheDocument();
        expect(screen.getByText("34")).toBeInTheDocument();
      },
      { timeout: 4000 },
    );
  });

  it("marks the night variant on the panel", () => {
    const { container } = render(
      <StatsPanel open isNight stats={stats} />,
    );
    expect(container.querySelector("aside")).toHaveAttribute(
      "data-night",
      "true",
    );
  });

  it("skips the counter for a numeric stat with an empty value", () => {
    render(
      <StatsPanel
        open
        isNight={false}
        stats={[{ label: "Week number", value: "", numeric: true }]}
      />,
    );
    expect(screen.getByText("Week number")).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });
});
