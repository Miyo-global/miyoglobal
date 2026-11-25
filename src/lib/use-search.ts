"use client";

import { useSyncExternalStore } from "react";

const EVENT = "searchchange";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

/** The page's query string as state. The server render sees none, so prerendered HTML stays shareable and cacheable. */
export function useSearch(): URLSearchParams {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  return new URLSearchParams(search);
}

/** Replaces the query string without a navigation or a history entry, and tells useSearch readers. */
export function replaceSearch(params: URLSearchParams) {
  const qs = params.toString();
  window.history.replaceState(window.history.state, "", qs ? `?${qs}` : window.location.pathname);
  window.dispatchEvent(new Event(EVENT));
}
