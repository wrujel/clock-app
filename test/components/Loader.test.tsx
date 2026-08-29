import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Loader from "../../app/components/Loader";

describe("Loader", () => {
  it("spells out the wordmark one letter at a time", () => {
    render(<Loader />);

    const word = screen.getByLabelText("Circadia");
    expect(word).toBeInTheDocument();
    expect(word.textContent).toBe("CIRCADIA");
    expect(word.querySelectorAll("span")).toHaveLength(8);
  });
});
