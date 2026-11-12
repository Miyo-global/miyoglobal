"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const PARKED = "__miyoLeaveGuard";
const MESSAGE = "Leave without saving? Your unsaved changes will be lost.";

/**
 * While `dirty`, ask before leaving the page: tab close/reload (beforeunload), in-app links
 * (sidebar and any other <a>, caught before Next's <Link> handler) and browser Back/Forward.
 */
export function useLeaveGuard(dirty: boolean, confirm: (text: string, label: string) => Promise<boolean>) {
  const router = useRouter();
  const ask = useRef(confirm);
  const mounted = useRef(true);
  const parked = useRef(false);
  const unpark = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    ask.current = confirm;
  });
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!dirty) return;
    let active = true;
    let asking = false;

    const onUnload = (e: BeforeUnloadEvent) => e.preventDefault();

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.closest(".tiptap") || a.hasAttribute("download")) return;
      if (a.target && a.target !== "_self") return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      // Capture phase on window runs before React's root listener, so <Link> never sees the click.
      e.preventDefault();
      e.stopPropagation();
      if (asking) return;
      asking = true;
      void ask.current(MESSAGE, "Leave").then((ok) => {
        asking = false;
        if (!ok) return;
        active = false;
        window.removeEventListener("beforeunload", onUnload);
        router.push(url.pathname + url.search + url.hash);
      });
    };

    // Back/Forward: park a duplicate of the current entry on top, so leaving it fires popstate on the same URL.
    const park = () => {
      history.pushState({ ...history.state, [PARKED]: true }, "", location.href);
      parked.current = true;
    };
    clearTimeout(unpark.current);
    if (!parked.current) park();
    const onPop = () => {
      parked.current = !!history.state?.[PARKED];
      if (!active || asking) return;
      asking = true;
      void ask.current(MESSAGE, "Leave").then((ok) => {
        asking = false;
        if (!ok) return park();
        active = false;
        window.removeEventListener("beforeunload", onUnload);
        history.back();
      });
    };

    window.addEventListener("beforeunload", onUnload);
    window.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      // Clean again (saved or discarded) and still on this page: drop the parked entry. Skipped on unmount,
      // and cancelled if the editor turns dirty again first (the next effect run reuses the parked entry).
      if (!active) return;
      active = false;
      unpark.current = setTimeout(() => {
        if (!mounted.current || !parked.current || !history.state?.[PARKED]) return;
        parked.current = false;
        history.back();
      });
    };
  }, [dirty, router]);
}
