"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/** True once the component has hydrated on the client.
 *  Hydration-safe: returns false during SSR and the first client render, so
 *  browser-only subtrees can be gated without a hydration mismatch. */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
