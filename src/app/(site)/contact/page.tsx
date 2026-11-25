import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { pageJsonLd, pageMetadata, type SitePage } from "@/lib/page-meta";
import { jsonLdScript, SITE_URL } from "@/lib/seo";
import { OfficeCard } from "@/views/contact/office-card";
import { OFFICES, officePlaces } from "@/views/contact/offices";

const page: SitePage = {
  path: "/contact",
  title: "Contact Us: Staffing Enquiries, India & UAE | MIYO Global",
  description: "Talk to MIYO Global about a role, a pod, a GCC or a digital programme. Email staffing@miyoglobal.com or reach our Hyderabad and Ras Al Khaimah offices.",
  image: "/images/og/contact.webp",
  imageAlt: "Colleagues across India and the UAE discussing a staffing enquiry",
  crumb: "Contact",
};

export const metadata: Metadata = pageMetadata(page);

const jsonLd = pageJsonLd(page, officePlaces(`${SITE_URL}${page.path}`));

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <section className="pt-section">
        <div className="frame">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          <div className="grid-12 mt-12 gap-y-6">
            <Eyebrow className="col-span-4 md:col-span-12">Get in touch</Eyebrow>
            <h1 className="col-span-4 max-w-heading md:col-span-8">Let’s build your team</h1>
            <p className="lead col-span-4 md:col-span-7">
              Tell us what you need, a role, a pod, a GCC, or a digital program, and we will come back with a plan and ramp-up timelines.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Enquiry form and offices" className="py-section">
        <div className="frame grid-12 gap-y-16">
          <div className="col-span-4 md:col-span-7">
            <ContactForm />
          </div>
          <aside aria-labelledby="offices-title" className="col-span-4 grid content-start gap-12 md:col-span-5">
            <h2 id="offices-title" className="text-h3">
              Write to us or visit
            </h2>
            <Card as="article" variant="plain">
              <p className="meta text-muted">Email</p>
              <h3 className="mt-3">
                <a href="mailto:staffing@miyoglobal.com" className="link inline-flex min-h-12 items-center break-all">
                  staffing@miyoglobal.com
                </a>
              </h3>
            </Card>
            {OFFICES.map((o) => (
              <OfficeCard key={o.id} office={o} />
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
