import Image from "next/image";

import { SpringTrigger } from "@/ledger/components/animation/springs/spring-trigger";
import { Spring } from "@/ledger/components/common/robot-spring";
import { DashedLink } from "@/ledger/components/ui/dashed-link";

import { hero } from "./content";
import { CountUp } from "./ui/count-up";
import { WordRise } from "./ui/word-rise";

const PARALLAX = { tension: 120, friction: 26 };
const LINE = 55;
const LINKS_CONFIG = { tension: 170, friction: 26 };

/**
 * 2 · Hero (Northwall hero composition): full-bleed duotoned photo sinking 22%
 * slower than the page, copy pinned top / middle / bottom. Server-rendered, so
 * the photo (the LCP) paints under the passage intro; the words play after it.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      data-ground="dark"
      data-header-theme="dark"
      className="relative flex min-h-lvh w-full flex-col overflow-hidden text-on-dark"
    >
      {/* Pinned to the first screen, so a web-font reflow of the copy never resizes the photo (CLS). */}
      <figure className="ld-duotone absolute inset-x-0 top-0 h-lvh overflow-hidden">
        <SpringTrigger
          tag="div"
          mode="scrub"
          start="top top"
          end="bottom top"
          from={{ y: "0%" }}
          to={{ y: "22%" }}
          config={PARALLAX}
          frameInterval={32}
          className="absolute inset-0"
          innerClassName="absolute inset-x-0 bottom-0 h-[130%]"
        >
          <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="100vw" quality={70} className="object-cover" style={{ objectPosition: "50% 35%" }} />
        </SpringTrigger>
      </figure>
      <span aria-hidden="true" className="ld-scrim absolute inset-x-0 top-0 z-[2] h-lvh" />

      <div className="relative z-10 flex flex-1 flex-col justify-between gap-12 px-5 pb-8 pt-[calc(var(--header-height)+2.5rem)] md:px-10 md:pt-[calc(var(--header-height)+3rem)]">
        <div className="max-w-[44rem]">
          <WordRise afterHandoff text={hero.eyebrow} className="font-sans text-eyebrow font-medium uppercase text-on-dark-muted" />
          <WordRise
            afterHandoff
            tag="h1"
            id="hero-title"
            text={hero.title}
            stagger={LINE}
            delay={80}
            className="mt-6 font-display text-[3rem] leading-[0.95] font-semibold tracking-[-0.02em] md:text-[4.5rem] xl:text-display"
          />
        </div>

        <div>
          <span aria-hidden="true" className="block border-t border-dashed border-rule-dark" />
          <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <WordRise afterHandoff text={hero.intro} delay={120} className="max-w-[44ch] font-sans text-lead font-light text-on-dark" />
            <ul className="flex flex-col gap-1 font-sans text-body md:text-right">
              {hero.stats.map((stat, i) => (
                <li key={stat.label}>
                  <span className="font-medium">
                    <CountUp value={stat.value} delay={i * 110} afterHandoff />
                  </span>{" "}
                  <span className="text-on-dark-muted">{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Spring tag="div" delayIn={320} from={{ opacity: 1, y: 16 }} to={{ opacity: 1, y: 0 }} config={LINKS_CONFIG}>
            <ul className="flex flex-col gap-3 sm:flex-row">
              {hero.links.map((link) => (
                <li key={link.href}>
                  <DashedLink href={link.href} label={link.label} tone="dark" primary={link.primary} className="w-full sm:w-auto" />
                </li>
              ))}
            </ul>
          </Spring>
          <div className="font-sans text-h3 font-medium md:text-right">
            {hero.tagline.map((line, i) => (
              <WordRise key={line} afterHandoff text={line} stagger={LINE} delay={160 + i * 90} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
