import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Quote from "../../app/components/Quote";

describe("Quote", () => {
  it("renders the text and author", () => {
    render(
      <Quote text="Stay curious." author="Anon" onRefresh={() => {}} />,
    );
    expect(screen.getByText("Stay curious.")).toBeInTheDocument();
    expect(screen.getByText("Anon")).toBeInTheDocument();
  });

  it("renders nothing quotable while text and author are absent", () => {
    render(<Quote onRefresh={() => {}} />);
    const quote = screen.getByRole("button", { name: "Load a new quote" });
    expect(quote).toBeInTheDocument();
    expect(screen.queryByText("Anon")).not.toBeInTheDocument();
  });

  it("renders the author alone when no text is supplied", () => {
    render(<Quote author="Anon" onRefresh={() => {}} />);
    expect(screen.getByText("Anon")).toBeInTheDocument();
  });

  it("renders the text alone when no author is supplied", () => {
    render(<Quote text="Stay curious." onRefresh={() => {}} />);
    expect(screen.getByText("Stay curious.")).toBeInTheDocument();
  });

  it("calls onRefresh on every click", async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    render(<Quote text="A" author="B" onRefresh={onRefresh} />);

    const button = screen.getByRole("button", { name: "Load a new quote" });
    await user.click(button);
    await user.click(button);

    expect(onRefresh).toHaveBeenCalledTimes(2);
  });
});
