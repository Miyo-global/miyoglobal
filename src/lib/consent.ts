/** localStorage key set when a visitor acknowledges the cookie notice. */
export const CONSENT_KEY = "miyo-consent";

/** Runs in <head> before first paint: marks <html data-consent> so CSS hides the server-rendered notice for returning visitors. */
export const CONSENT_SCRIPT = `try{if(localStorage.getItem("${CONSENT_KEY}"))document.documentElement.dataset.consent="1"}catch(e){}`;
