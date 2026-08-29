import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The page reads the clock through useNow; pin it so greetings are deterministic.
const clock = { now: new Date(2026, 7, 28, 14, 30, 0) };
vi.mock("../app/hooks/useNow", () => ({ useNow: () => clock.now }));

const { default: Home } = await import("../app/page");

const IP_URL = "https://api.ipify.org/?format=json";

interface Responses {
  ip?: unknown;
  data?: unknown;
  dataStatus?: number;
  quote?: unknown;
  throwOnData?: boolean;
}

/** Route fetch by URL so each endpoint can be steered independently. */
const mockFetch = (r: Responses) =>
  vi.fn(async (url: string | URL) => {
    const href = String(url);
    if (href === IP_URL) {
      return { status: 200, json: async () => r.ip };
    }
    if (href.endsWith("/api/data")) {
      if (r.throwOnData) throw new Error("network down");
      return { status: r.dataStatus ?? 200, json: async () => r.data };
    }
    return { status: 200, json: async () => r.quote };
  });

const OK = {
  ip: { ip: "8.8.8.8" },
  data: {
    city_name: "Lima",
    country_name: "Peru",
    content: "Stay curious.",
    author: "Anon",
  },
  quote: { content: "Second quote.", author: "Someone" },
};

const setFetch = (r: Responses) => {
  const fn = mockFetch(r);
  vi.stubGlobal("fetch", fn);
  return fn;
};

beforeEach(() => {
  clock.now = new Date(2026, 7, 28, 14, 30, 0);
  // Fixed offset keeps the UTC badge stable across CI timezones.
  vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(300);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Home — successful load", () => {
  it("swaps the loader for the quote, clock and location", async () => {
    setFetch(OK);
    render(<Home />);

    expect(screen.getByLabelText("Circadia")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Stay curious.")).toBeInTheDocument();
    });
    expect(screen.getByText("Anon")).toBeInTheDocument();
    expect(screen.getByText("IN Lima, Peru")).toBeInTheDocument();
    expect(screen.getByLabelText("14:30:00")).toBeInTheDocument();
  });

  it("renders a negative UTC offset for a positive timezone offset", async () => {
    setFetch(OK);
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText("UTC-5")).toBeInTheDocument();
    });
  });

  it("renders a positive UTC offset for a negative timezone offset", async () => {
    vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(-120);
    setFetch(OK);
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText("UTC+-2")).toBeInTheDocument();
    });
  });

  it("posts the resolved IP to the data endpoint", async () => {
    const fetchMock = setFetch(OK);
    render(<Home />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/data",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ ip: "8.8.8.8" }),
        }),
      );
    });
  });

  it("omits the location line when the lookup has no city or country", async () => {
    setFetch({
      ...OK,
      data: { content: "Stay curious.", author: "Anon" },
    });
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Stay curious.")).toBeInTheDocument();
    });
    expect(screen.queryByText(/^IN /)).not.toBeInTheDocument();
  });
});

describe("Home — greeting and day/night", () => {
  const cases = [
    { hour: 2, greet: "GOOD EVENING", night: true },
    { hour: 9, greet: "GOOD MORNING", night: false },
    { hour: 14, greet: "GOOD AFTERNOON", night: false },
    { hour: 20, greet: "GOOD EVENING", night: true },
  ];

  for (const { hour, greet, night } of cases) {
    it(`shows "${greet}" and the ${night ? "moon" : "sun"} at ${hour}:00`, async () => {
      clock.now = new Date(2026, 7, 28, hour, 0, 0);
      setFetch(OK);
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByLabelText(greet)).toBeInTheDocument();
      });
      expect(
        screen.getByAltText(night ? "icon moon" : "icon sun"),
      ).toBeInTheDocument();
      // Spaces render as non-breaking so the mask keeps its width.
      expect(screen.getByLabelText(greet).textContent).toBe(
        greet.replace(/ /g, " "),
      );
    });
  }
});

describe("Home — stats panel", () => {
  it("opens and closes the panel from the toggle", async () => {
    const user = userEvent.setup();
    setFetch(OK);
    render(<Home />);

    const toggle = await screen.findByRole("button", { name: /MORE/ });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Current timezone")).not.toBeInTheDocument();

    await user.click(toggle);

    await waitFor(() => {
      expect(screen.getByText("Current timezone")).toBeInTheDocument();
    });
    expect(screen.getByText("Day of the week")).toBeInTheDocument();

    // The label crossfades via AnimatePresence, so it lands a frame later.
    const collapse = await screen.findByRole("button", { name: /LESS/ });
    expect(collapse).toHaveAttribute("aria-expanded", "true");

    await user.click(collapse);
    await waitFor(() => {
      expect(screen.queryByText("Current timezone")).not.toBeInTheDocument();
    });
  });
});

describe("Home — quote refresh", () => {
  it("replaces the quote when refresh is clicked", async () => {
    const user = userEvent.setup();
    setFetch(OK);
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Stay curious.")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Load a new quote" }));

    await waitFor(() => {
      expect(screen.getByText("Second quote.")).toBeInTheDocument();
    });
    expect(screen.getByText("Someone")).toBeInTheDocument();
  });

  it("keeps the current quote when the endpoint returns nothing", async () => {
    const user = userEvent.setup();
    setFetch({ ...OK, quote: null });
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Stay curious.")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Load a new quote" }));

    await waitFor(() => {
      expect(screen.getByText("Stay curious.")).toBeInTheDocument();
    });
  });
});

describe("Home — failure paths", () => {
  it("warns about an adblocker when the IP lookup yields no address", async () => {
    setFetch({ ...OK, ip: {} });
    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText("Disable adblocker to load client"),
      ).toBeInTheDocument();
    });
    // Nothing loaded, so neither the content nor the stats toggle appears.
    expect(screen.queryByText("Stay curious.")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /MORE/ }),
    ).not.toBeInTheDocument();
  });

  it("warns about an adblocker when the IP lookup returns no body", async () => {
    setFetch({ ...OK, ip: null });
    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText("Disable adblocker to load client"),
      ).toBeInTheDocument();
    });
  });

  it("reports a non-200 from the data endpoint", async () => {
    setFetch({ ...OK, dataStatus: 500 });
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Error fetching data")).toBeInTheDocument();
    });
    expect(screen.queryByText("Stay curious.")).not.toBeInTheDocument();
  });

  it("reports a thrown request to the data endpoint", async () => {
    setFetch({ ...OK, throwOnData: true });
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Error fetching data")).toBeInTheDocument();
    });
  });
});

describe("Home — ambient layers", () => {
  it("mounts the sky and cursor glow once hydrated", async () => {
    setFetch(OK);
    const { container } = render(<Home />);

    await waitFor(() => {
      expect(container.querySelectorAll("span").length).toBeGreaterThan(80);
    });
    const shell = container.firstElementChild as HTMLElement;
    expect(within(shell).getByText("Stay curious.")).toBeInTheDocument();
  });
});
