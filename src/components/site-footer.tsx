import Image from "next/image";

import { ArrowLink } from "@/ledger/components/ui/arrow-link";
import { CornerMarkers } from "@/ledger/components/ui/corner-markers";
import { RollLink } from "@/ledger/components/ui/roll-link";

const ARROW = "/images/ledger/arrow.svg";

const RAIL = [
  ["/staffing-solutions", "Staffing Solutions"],
  ["/digital-solutions", "Digital Solutions"],
  ["/case-studies", "Case studies"],
  ["/referrals", "Referrals"],
  ["/blog", "Blog"],
  ["/about", "About us"],
  ["/contact", "Contact"],
] as const;

const LEGAL = [
  ["/editorial-policy", "Editorial policy"],
  ["/privacy-policy", "Privacy & Cookies"],
  ["/terms", "Terms"],
  ["/disclosure", "Disclosure"],
] as const;

const EYEBROW = "text-eyebrow font-medium uppercase text-on-dark-meta";

/**
 * Site-wide footer: Northwall's navy contact rail (arrow rows, dashed rules,
 * corner markers). The header steps aside over it on the home page.
 */
export function SiteFooter() {
  return (
    <footer data-header-theme="hidden" className="ld ld-dark relative bg-ground-dark font-sans text-on-dark">
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 px-5 pb-10 pt-20 md:grid-cols-12 md:gap-x-5 md:px-10">
        <div className="md:col-span-4">
          <Image src="/images/logo-web.png" alt="MIYO Global" width={89} height={48} />
          <p className="mt-6 max-w-[34ch] text-body text-on-dark-muted">
            Enterprise staffing and digital delivery from India and the UAE. GCC build-outs, technology talent, and managed digital services, under your brand.
          </p>
          <address className="mt-8 flex flex-col gap-2 text-body not-italic">
            <a className="ld-draw self-start py-1" href="mailto:staffing@miyoglobal.com">staffing@miyoglobal.com</a>
            <span className="text-on-dark-muted">Hyderabad, India</span>
            <span className="text-on-dark-muted">Ras Al Khaimah, UAE</span>
          </address>
        </div>

        <nav aria-label="Footer" className="md:col-span-4">
          <p className={EYEBROW}>Company</p>
          <ul className="mt-4">
            {RAIL.map(([href, label]) => (
              <li key={href} className="border-t border-dashed border-rule-dark last:border-b">
                <ArrowLink href={href} label={label} iconSrc={ARROW} className="flex min-h-12 items-center justify-between py-3.5 text-label font-medium uppercase" />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-10 md:col-span-4">
          <div>
            <p className={EYEBROW}>Prime Learning</p>
            <ul className="mt-4">
              <li className="border-t border-dashed border-rule-dark">
                <ArrowLink href="https://primelearning.ae" label="Prime Learning" iconSrc={ARROW} className="flex min-h-12 items-center justify-between py-3.5 text-label font-medium uppercase" />
              </li>
              <li className="border-y border-dashed border-rule-dark">
                <ArrowLink href="https://primelearning.ae/staffing" label="PL Staff Augmentation" iconSrc={ARROW} className="flex min-h-12 items-center justify-between py-3.5 text-label font-medium uppercase" />
              </li>
            </ul>
          </div>
          <div>
            <p className={EYEBROW}>Legal</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
              {LEGAL.map(([href, label]) => (
                <li key={href}>
                  <RollLink href={href} label={label} className="block py-2.5 text-label font-medium uppercase" />
                </li>
              ))}
            </ul>
            {/* ponytail: existing LinkedIn link kept as-is; confirm the official MIYO Global profile before changing it. */}
            <a className="ld-draw mt-3 inline-block py-2 text-label font-medium uppercase" href="https://www.linkedin.com/company/prime-learning-ae" target="_blank" rel="noopener">
              LinkedIn
            </a>
          </div>
        </div>

        <p className="relative border border-dashed border-rule-dark p-5 text-body text-on-dark-muted md:col-span-12">
          <CornerMarkers className="bg-on-dark" />
          <b className="font-medium text-on-dark">Recruitment notice:</b> MIYO Global never asks candidates for money, original documents, or cheques at any stage of hiring. If anyone requests these in our name, report it to staffing@miyoglobal.com.
        </p>

        <p className="flex flex-col gap-2 border-t border-dashed border-rule-dark pt-6 text-eyebrow text-on-dark-meta md:col-span-12 md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} MIYO Global. All rights reserved.</span>
          <span className="max-w-[60ch]">Miyo Global Private Limited (India) · Prime Assets Education &amp; Training Ltd. (UAE), operating as Prime Learning.</span>
        </p>
      </div>
    </footer>
  );
}
