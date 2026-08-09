"use client";

import { useEffect, useState } from "react";

/** Ticking clock — returns the current Date, refreshed every `intervalMs`.
 *  Pauses while the tab is hidden and resyncs on return. */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      id = setInterval(() => setNow(new Date()), intervalMs);
    };
    const stop = () => {
      if (id !== undefined) clearInterval(id);
      id = undefined;
    };
    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        setNow(new Date());
        start();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs]);

  return now;
}
