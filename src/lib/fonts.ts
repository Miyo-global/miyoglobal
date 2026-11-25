import { IBM_Plex_Mono, Libre_Caslon_Display, Work_Sans } from "next/font/google";

/**
 * Four self-hosted files in total, Latin subset, swapped in with metric-matched fallbacks so text never shifts:
 * Libre Caslon Display 400 (h1, h2), Work Sans variable 400 to 600 (UI and body), IBM Plex Mono 400 and 500 (meta).
 */
const caslon = Libre_Caslon_Display({ weight: "400", subsets: ["latin"], variable: "--font-caslon", display: "swap", adjustFontFallback: true });
const work = Work_Sans({ subsets: ["latin"], variable: "--font-work", display: "swap", adjustFontFallback: true });
const plex = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-plex", display: "swap", adjustFontFallback: true });

export const fontVariables = `${caslon.variable} ${work.variable} ${plex.variable}`;
