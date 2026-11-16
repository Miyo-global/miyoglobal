import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="fcols">
          <div>
            <div className="fbrand">MIYO <span className="g">GLOBAL</span></div>
            <p className="fdesc">Enterprise staffing and digital delivery from India and the UAE. GCC build-outs, technology talent, and managed digital services, under your brand.</p>
            <div className="fsoc">
              <a href="https://www.linkedin.com/company/prime-learning-ae" target="_blank" rel="noopener" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="3" /><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 17v-7" /></svg>
              </a>
              <a href="mailto:staffing@miyoglobal.com" aria-label="Email">
                <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m3 6 9 7 9-7" /></svg>
              </a>
            </div>
          </div>
          <div className="fcol">
            <h5>Company</h5>
            <Link href="/staffing-solutions">Staffing Solutions</Link>
            <Link href="/digital-solutions">Digital Solutions</Link>
            <Link href="/case-studies">Case studies</Link>
            <a href="/referrals">Referrals</a>
            <Link href="/blog">Blog</Link>
            <Link href="/about">About us</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/editorial-policy">Editorial policy</Link>
            <Link href="/privacy-policy">Privacy &amp; Cookies</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/disclosure">Disclosure</Link>
          </div>
          <div className="fcol">
            <h5>Get in touch</h5>
            <a href="mailto:staffing@miyoglobal.com">staffing@miyoglobal.com</a>
            <a href="https://primelearning.ae" target="_blank" rel="noopener">Prime Learning</a>
            <a href="https://primelearning.ae/staffing" target="_blank" rel="noopener">PL Staff Augmentation</a>
            <p>Hyderabad, India</p>
            <p>Ras Al Khaimah, UAE</p>
          </div>
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
