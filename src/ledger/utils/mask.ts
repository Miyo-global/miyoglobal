import type { CSSProperties } from "react";

/**
 * Renders an image as a shape filled with `currentColor`, so a single asset
 * serves every colour it appears in (white on the dark blocks, black on the
 * light ones) without a second request.
 */
export const maskStyle = (src: string): CSSProperties => ({
  maskImage: `url(${src})`,
  maskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskImage: `url(${src})`,
  WebkitMaskSize: "100% 100%",
  WebkitMaskRepeat: "no-repeat",
});
