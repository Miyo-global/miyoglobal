/**
 * Timing shared by every section's entry reveal.
 *
 * The panels stack, so a block's background is already laid down by the time it
 * covers the previous one. `ENTRY_DELAY` holds its contents back just long
 * enough for that to register — the surface arrives first, the copy after it.
 */
export const ENTRY_DELAY = 180;

/** Gap between successive items revealing inside one section. */
export const ENTRY_STAGGER = 110;

/**
 * The body-copy animation, taken from the hero intro: every word rises into
 * place from just below the line, fading and scaling up as it arrives. Every
 * description on the page runs exactly this.
 */
export const COPY_CONFIG = { tension: 210, friction: 28 };
export const COPY_STAGGER = 22;
export const COPY_IN = { y: "0%", opacity: 1, scale: 1 };
export const COPY_OUT = { y: "60%", opacity: 0, scale: 0.94 };

/**
 * Northwall's WORD_GAP (0.266em, DM Sans) existed because spring-text-engine
 * drops the spaces between words. The ledger's WordRise keeps real spaces, so
 * Outfit wraps exactly as plain text and no gap constant is needed.
 */
