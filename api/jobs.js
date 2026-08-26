// Same-origin proxy for the referrals page's open-positions list.
//
// The browser used to call the Apps Script /exec URL directly. For some
// referrers that request never completes — an ad blocker, VPN, or office/ISP
// firewall singles out script.google.com and silently drops it, which looks
// like an endless "Fetching open positions…" with no error. Routing the GET
// through this same-origin endpoint means the browser only ever talks to
// miyoglobal.com; the Apps Script call happens server-to-server, where none
// of those client-side blockers apply.
const REFERRAL_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwicD4imd-odXbCAF1Wtyw802_pSx9GHumZfslYjdu3js1OEghIBEBmkk3pvX79fSu1/exec';
const UPSTREAM_TIMEOUT_MS = 20000;

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ status: 'error', message: 'method not allowed' });
    return;
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const upstream = await fetch(REFERRAL_ENDPOINT + '?action=getJobs', { signal: ctrl.signal });
    clearTimeout(timer);
    if (!upstream.ok) {
      res.status(502).json({ status: 'error', message: 'upstream returned status ' + upstream.status });
      return;
    }
    const data = await upstream.json();
    // Short edge cache: everyone gets the same board, so one cold Apps Script
    // call can serve every visitor for a minute instead of one call each.
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=270');
    res.status(200).json(data);
  } catch (e) {
    clearTimeout(timer);
    const message = e && e.name === 'AbortError' ? 'upstream did not respond in time' : (e && e.message) || 'upstream fetch failed';
    res.status(502).json({ status: 'error', message: message });
  }
};
