import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useNow } from "../../app/hooks/useNow";

const setHidden = (hidden: boolean) => {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => hidden,
  });
};

describe("useNow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-28T10:00:00.000Z"));
    setHidden(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts at the current time", () => {
    const { result } = renderHook(() => useNow());
    expect(result.current.toISOString()).toBe("2026-08-28T10:00:00.000Z");
  });

  it("ticks once per interval", () => {
    const { result } = renderHook(() => useNow(1000));

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.toISOString()).toBe("2026-08-28T10:00:01.000Z");

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.toISOString()).toBe("2026-08-28T10:00:03.000Z");
  });

  it("honours a custom interval", () => {
    const { result } = renderHook(() => useNow(5000));

    act(() => {
      vi.advanceTimersByTime(4999);
    });
    expect(result.current.toISOString()).toBe("2026-08-28T10:00:00.000Z");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.toISOString()).toBe("2026-08-28T10:00:05.000Z");
  });

  it("pauses while the tab is hidden and resyncs on return", () => {
    const { result } = renderHook(() => useNow(1000));

    act(() => {
      setHidden(true);
      document.dispatchEvent(new Event("visibilitychange"));
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    // Frozen at the last tick before the tab was hidden.
    expect(result.current.toISOString()).toBe("2026-08-28T10:00:00.000Z");

    act(() => {
      setHidden(false);
      document.dispatchEvent(new Event("visibilitychange"));
    });
    // Resynced to wall-clock time immediately on return.
    expect(result.current.toISOString()).toBe("2026-08-28T10:00:05.000Z");

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.toISOString()).toBe("2026-08-28T10:00:06.000Z");
  });

  it("unmounts cleanly while the tab is hidden", () => {
    const { unmount } = renderHook(() => useNow(1000));

    act(() => {
      setHidden(true);
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(vi.getTimerCount()).toBe(0);

    // Cleanup stops an already-stopped interval — must not throw.
    expect(() => unmount()).not.toThrow();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("clears its interval and listener on unmount", () => {
    const removeSpy = vi.spyOn(document, "removeEventListener");
    const { unmount } = renderHook(() => useNow(1000));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
    );
    expect(vi.getTimerCount()).toBe(0);
  });
});
