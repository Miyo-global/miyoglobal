import Image from "next/image";
import Link from "next/link";
import { FooterCta } from "./footer-cta";
import { ButtonLink } from "./ui/button";

const S = "/staffing-solutions";
const D = "/digital-solutions";

const COLUMNS = [
  ["Staffing", [
    [S, "Staffing Solutions"],
    [`${S}#gcc`, "GCC & captive centres"],
    [`${S}#technology`, "IT & technology staffing"],
    [`${S}#executive-search`, "Executive search"],
    [`${S}#high-volume`, "High-volume hiring"],
    [`${S}#healthcare`, "Healthcare & clinical"],
    [`${S}#models`, "Engagement models"],
  ]],
  ["Digital", [
    [D, "Digital Solutions"],
    [`${D}#ai-data`, "AI data services"],
    [`${D}#localization`, "Localization"],
    [`${D}#healthcare-ai`, "Healthcare AI & trust and safety"],
    [`${D}#training`, "Corporate training"],
  ]],
  ["Company", [
    ["/about", "About us"],
    ["/about#leadership", "Leadership"],
    ["/case-studies", "Case studies"],
    ["/jobs", "Open jobs"],
    ["/referrals", "Referrals"],
    ["/blog", "Insights"],
    ["/contact", "Contact"],
  ]],
  ["Legal", [
    ["/privacy-policy", "Privacy & cookies"],
    ["/terms", "Terms of use"],
    ["/disclosure", "Disclosure"],
    ["/editorial-policy", "Editorial policy"],
  ]],
] as const;

/** Navy rail footer: CTA slab, brand and four link columns, the recruitment notice (verbatim) and the legal entities. */
export function SiteFooter() {
  return (
    <footer className="on-ink bg-ink text-on-ink">
      <FooterCta>
      <div className="frame grid-12 gap-y-8 border-b border-on-ink-rule py-16 md:py-24">
          <h2 className="col-span-4 text-h2 md:col-span-7">Building a team in India or the UAE?</h2>
          <div className="col-span-4 flex flex-col gap-4 md:col-span-4 md:col-start-9 md:justify-end">
            <p className="text-on-ink-muted">Tell us the role, the pod or the centre. We come back with a plan and ramp-up timelines.</p>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="/contact" variant="accent">
                Hire talent
              </ButtonLink>
              <ButtonLink href="mailto:staffing@miyoglobal.com" variant="ghost" className="text-on-ink">
                staffing@miyoglobal.com
              </ButtonLink>
            </div>
          </div>
        </div>
      </FooterCta>

      <div className="frame grid-12 gap-y-12 py-16">
        <div className="col-span-4 md:col-span-4">
          <Image src="/images/logo-web.png" alt="MIYO Global" width={89} height={48} className="block h-12 w-auto" />
          <p className="mt-6 max-w-measure text-small text-on-ink-muted">
            Enterprise staffing and digital delivery from India and the UAE. GCC build-outs, technology talent, and managed digital services, under your brand.
          </p>
          <address className="mt-6 text-small not-italic text-on-ink-muted">
            Hyderabad, India
            <br />
            Ras Al Khaimah, UAE
          </address>
          <a href="https://www.linkedin.com/company/miyo-global" target="_blank" rel="noopener" className="mt-6 inline-flex min-h-12 items-center text-small underline underline-offset-4">
            MIYO Global on LinkedIn
          </a>
        </div>
        {COLUMNS.map(([title, links]) => (
          <div key={title} className="col-span-2 md:col-span-2">
            <h2 className="meta text-on-ink-muted">{title}</h2>
            <ul className="mt-4 grid">
              {links.map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className="inline-flex min-h-12 items-center text-small text-on-ink hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="frame border-t border-on-ink-rule py-8 text-small text-on-ink-muted">
        <p className="max-w-measure">
          <b className="font-semibold text-on-ink">Recruitment notice:</b> MIYO Global never asks candidates for money, original documents, or cheques at any stage of hiring. If anyone requests these in our name, report it to staffing@miyoglobal.com.
        </p>
        <div className="mt-6 flex flex-col gap-2 md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} MIYO Global. All rights reserved.</span>
          <span>
            Miyo Global Private Limited (India) · Prime Assets Education &amp; Training Ltd. (UAE), operating as{" "}
            <a href="https://primelearning.ae" target="_blank" rel="noopener" className="underline underline-offset-4">
              Prime Learning
            </a>
            .
          </span>
        </div>
      </div>
    </footer>
  );
}
