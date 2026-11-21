import { BOT_UA_SOURCE } from "@/ledger/utils/bot-ua";

export const PASSAGE_ID = "ld-passage";
export const SEEN_KEY = "miyo-passage-seen";

/**
 * Runs before first paint (the CSP allows inline scripts): repeat visits in the
 * session, reduced motion and bots never see the curtain, so it never flashes.
 * It marks the curtain `data-play` when it may run; a client-side navigation
 * back to `/` never runs this script, so the curtain stays away then too.
 */
export const PASSAGE_GATE = `(function(){try{var e=document.getElementById("${PASSAGE_ID}");if(!e)return;var s=sessionStorage.getItem("${SEEN_KEY}");var r=matchMedia("(prefers-reduced-motion: reduce)").matches;var b=new RegExp(${JSON.stringify(BOT_UA_SOURCE)},"i").test(navigator.userAgent);if(s||r||b){e.style.display="none"}else{e.dataset.play="1";sessionStorage.setItem("${SEEN_KEY}","1")}}catch(_){var x=document.getElementById("${PASSAGE_ID}");if(x)x.style.display="none"}})();`;
