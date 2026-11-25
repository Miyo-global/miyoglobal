import Link from "next/link";

const S = "/staffing-solutions";
const D = "/digital-solutions";

const columns = [
  ["Staffing", [
    [S, "Staffing Solutions"],
    [`${S}#gcc`, "GCC & captive centres"],
    [`${S}#technology`, "IT & technology staffing"],
    [`${S}#executive-search`, "Executive search"],
    [`${S}#high-volume`, "High-volume hiring"],
    [`${S}#healthcare`, "Healthcare & clinical"],
    [`${S}#surge`, "Surge & contract"],
    [`${S}#models`, "Engagement models"],
  ]],
  ["Digital", [
    [D, "Digital Solutions"],
    [`${D}#ai-data`, "AI data services"],
    [`${D}#localization`, "Localization"],
    [`${D}#healthcare-ai`, "Healthcare AI review"],
    [`${D}#healthcare-ai`, "Trust & safety"],
    [`${D}#training`, "Corporate training"],
  ]],
  ["Company", [
    ["/about", "About us"],
    ["/about#leadership", "Leadership"],
    ["/case-studies", "Case studies"],
    ["/blog", "Blog"],
    ["/jobs", "Open jobs"],
    ["/referrals", "Referrals"],
    ["/contact", "Contact"],
    ["https://primelearning.ae", "Prime Learning"],
    ["https://primelearning.ae/staffing", "PL Staff Augmentation"],
  ]],
  ["Legal", [
    ["/privacy-policy", "Privacy & Cookies"],
    ["/terms", "Terms"],
    ["/disclosure", "Disclosure"],
    ["/editorial-policy", "Editorial policy"],
  ]],
] as const;

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="fcols">
          <div>
            <div className="fbrand">MIYO <span className="g">GLOBAL</span></div>
            <p className="fdesc">Enterprise staffing and digital delivery from India and the UAE. GCC build-outs, technology talent, and managed digital services, under your brand.</p>
            <p className="fcontact"><a href="mailto:staffing@miyoglobal.com">staffing@miyoglobal.com</a><br />Hyderabad, India<br />Ras Al Khaimah, UAE</p>
            <div className="fsoc">
              <a href="https://www.linkedin.com/company/miyo-global" target="_blank" rel="noopener" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="3" /><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 17v-7" /></svg>
              </a>
              <a href="mailto:staffing@miyoglobal.com" aria-label="Email">
                <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m3 6 9 7 9-7" /></svg>
              </a>
            </div>
          </div>
          {columns.map(([title, links]) => (
            <div className="fcol" key={title}>
              <h2 className="fh">{title}</h2>
              {links.map(([href, label]) =>
                href.startsWith("http") ? (
                  <a key={label} href={href} target="_blank" rel="noopener">{label}</a>
                ) : (
                  <Link key={label} href={href}>{label}</Link>
                ),
              )}
            </div>
          ))}
        </div>
        <div className="fnote"><b>Recruitment notice:</b> MIYO Global never asks candidates for money, original documents, or cheques at any stage of hiring. If anyone requests these in our name, report it to staffing@miyoglobal.com.</div>
        <div className="fbot">
          <span>© {new Date().getFullYear()} MIYO Global. All rights reserved.</span>
          <span className="ent">Miyo Global Private Limited (India) · Prime Assets Education &amp; Training Ltd. (UAE), operating as Prime Learning.</span>
        </div>
      </div>
    </footer>
  );
}
