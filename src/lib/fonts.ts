import { Fraunces, IBM_Plex_Mono, Work_Sans } from "next/font/google";

/** Editorial pages only (jobs, referrals). Self-hosted by next/font, subset to Latin, swapped in so text paints immediately. */
const fraunces = Fraunces({ subsets: ["latin"], axes: ["opsz"], variable: "--font-fraunces", display: "swap" });
const work = Work_Sans({ subsets: ["latin"], variable: "--font-work", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

export const editorialFonts = `${fraunces.variable} ${work.variable} ${plexMono.variable}`;
