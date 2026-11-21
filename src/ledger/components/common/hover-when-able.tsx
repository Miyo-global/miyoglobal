"use client";

import {
  forwardRef,
  useEffect,
  useSyncExternalStore,
  type ComponentProps,
  type ElementType,
} from "react";
import { animated } from "@react-spring/web";

import { Hover as SpringHover } from "@/ledger/components/animation/springs/hover";
import { springsConfig } from "@/ledger/lib/springs/config";

type HoverProps = ComponentProps<typeof SpringHover>;

/**
 * `Hover`, but only where a hover can happen.
 *
 * The vendored `Hover` builds a spring controller and starts it at mount on
 * every device, then ignores the pointer at phone widths
 * (`springsConfig.disableOnMobile.hover`). The header, the hero's calls to
 * action and the cards carry ~60 of them, so on a phone they were pure
 * hydration cost — a good part of the first long task, for an effect a phone
 * never plays.
 *
 * Until the page can hover, this renders the same element with the same
 * resting style (`from` — exactly what `Hover` server-renders), so the served
 * HTML and the first paint are identical. On a device with a fine pointer,
 * wider than the springs' mobile breakpoint, every instance switches to the
 * real `Hover` together: in an idle moment after `load`, or at the first mouse
 * move if that comes first. A pointer already resting on a trigger at that
 * moment is replayed as a `mouseenter`, so no hover is lost.
 */
let able = false;
let armed = false;
const listeners = new Set<() => void>();

const canHover = () =>
  window.innerWidth > springsConfig.mobileWidth &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const enable = () => {
  if (able || !canHover()) return;
  able = true;
  listeners.forEach((notify) => notify());
};

const arm = () => {
  if (armed) return;
  armed = true;
  const onPointer = (event: PointerEvent) => {
    if (event.pointerType === "mouse") enable();
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("resize", enable, { passive: true });
  const idle = () =>
    window.requestIdleCallback
      ? window.requestIdleCallback(enable, { timeout: 2000 })
      : window.setTimeout(enable, 300);
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
};

const subscribe = (notify: () => void) => {
  arm();
  listeners.add(notify);
  return () => listeners.delete(notify);
};

export const Hover = forwardRef<HTMLElement, HoverProps>((props, ref) => {
  const live = useSyncExternalStore(
    subscribe,
    () => able,
    () => false,
  );
  const { trigger } = props;

  useEffect(() => {
    if (!live) return;
    const node = trigger?.current as HTMLElement | null | undefined;
    if (node?.matches(":hover")) {
      node.dispatchEvent(new MouseEvent("mouseenter"));
    }
  }, [live, trigger]);

  if (live) return <SpringHover ref={ref} {...props} />;

  const {
    tag = "div",
    children,
    from = {},
    style,
    // The live form's props — the resting element takes none of them.
    to,
    config,
    delayIn,
    delayOut,
    enabled,
    disableOnMobile,
    immediateOut,
    trigger: _trigger,
    ...rest
  } = props;
  const Tag = animated[tag] as ElementType;

  return (
    <Tag ref={ref} style={{ ...from, ...style }} {...rest}>
      {children}
    </Tag>
  );
});

Hover.displayName = "HoverWhenAble";
