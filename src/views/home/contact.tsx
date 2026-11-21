import Image from "next/image";

import { SpringTrigger } from "@/ledger/components/animation/springs/spring-trigger";
import { HydrateWhenIdle } from "@/ledger/components/common/hydrate-when-idle";
import { CornerMarkers } from "@/ledger/components/ui/corner-markers";
import { ENTRY_DELAY } from "@/ledger/lib/springs/reveal";
import { ContactForm } from "@/components/contact-form";

import { contact } from "./content";
import { WordRise } from "./ui/word-rise";

const PARALLAX = { tension: 120, friction: 26 };

/**
 * 12 · Contact CTA (Northwall contact): a full-bleed duotoned photo rising 15%
 * slower than the page, a navy rail on the left and a white form card on the
 * right. The form is the existing /contact form and handler. The site footer
 * follows directly underneath.
 */
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" data-ground="dark" data-header-theme="dark" className="ld-dark relative overflow-hidden text-on-dark">
      <SpringTrigger
        tag="span"
        innerTag="span"
        mode="scrub"
        start="top bottom"
        end="bottom bottom"
        from={{ y: "-15%" }}
        to={{ y: "0%" }}
        config={PARALLAX}
        frameInterval={32}
        className="ld-duotone absolute inset-0 block overflow-hidden"
        innerClassName="absolute inset-x-0 top-0 block h-[120%]"
      >
        <Image src={contact.image.src} alt={contact.image.alt} fill sizes="100vw" quality={65} className="object-cover" />
      </SpringTrigger>

      <div className="relative grid grid-cols-12 gap-5 md:min-h-[50rem]">
        <div className="col-span-12 flex flex-col justify-end bg-ground-dark px-5 py-16 md:col-span-5 md:px-10 lg:col-span-4 lg:py-24">
          <WordRise
            tag="h2"
            id="contact-title"
            text={contact.title}
            stagger={55}
            delay={ENTRY_DELAY}
            className="max-w-[12ch] font-display text-[2.5rem] leading-none font-semibold tracking-[-0.015em] md:text-h2"
          />
          <WordRise text={contact.text} delay={ENTRY_DELAY + 160} className="mt-6 max-w-[40ch] font-sans text-lead font-light text-on-dark-muted" />
        </div>
        <div className="col-span-12 flex items-end px-5 pb-16 md:col-span-7 md:px-10 md:py-24 lg:col-span-6 lg:col-start-7">
          <div className="relative w-full border border-dashed border-rule-light bg-raised-light p-6 md:p-10">
            <CornerMarkers className="bg-ink" />
            <HydrateWhenIdle>
              <ContactForm variant="ledger" />
            </HydrateWhenIdle>
          </div>
        </div>
      </div>
    </section>
  );
}
