"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { BARE_PAGES, EXTRAS, FLAVORS, NAV_LINKS, PHOTOS, STEPS, VALUES, img, money } from "@/lib/data";
import { getLenis } from "@/lib/smooth";
import { useT } from "@/lib/i18n";
import { useCart } from "./cart";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Fade-up reveals ([data-reveal]) and parallax images ([data-parallax]) for regular page sections. */
export function ScrollFx({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
        gsap.fromTo(el, { y: 60, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 1.1,
          delay: Number(el.dataset.reveal) || 0,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        })
      );
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) =>
        gsap.to(el, {
          yPercent: Number(el.dataset.parallax),
          ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        })
      );
    },
    { scope: root }
  );
  return <div ref={root}>{children}</div>;
}

const heading = "font-display font-normal uppercase leading-[.88]";

/** Header block for the inner pages (Menu, About, Contact). */
export function PageHero({ page, title, accent, photo }: { page: "menu" | "about" | "contact"; title: string; accent: string; photo: string }) {
  const t = useT();
  return (
    <section className="grid items-end gap-10 px-[5vw] pb-16 pt-32 lg:grid-cols-[1.2fr_1fr] lg:pb-24 lg:pt-40">
      <div>
        <div data-reveal className="text-xs font-bold uppercase tracking-[.2em] text-muted">{t(`hero.${page}.eyebrow`)}</div>
        <h1 data-reveal className={`${heading} mt-4 text-[clamp(44px,8vw,128px)]`}>
          {title} <em className="font-italic font-bold text-caramel">{accent}</em>
        </h1>
        <p data-reveal className="mt-6 max-w-[440px] leading-relaxed text-muted">{t(`hero.${page}.text`)}</p>
      </div>
      <div data-reveal className="relative mx-auto h-[300px] w-full max-w-[460px] overflow-hidden rounded-[999px_999px_28px_28px] sm:h-[380px] lg:h-[460px]">
        <div data-parallax="10" className="absolute inset-x-0 -top-[8%] h-[116%]">
          <Image src={img(photo, 1100)} alt="" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}

export function Menu({ full = false }: { full?: boolean }) {
  const { add } = useCart();
  const t = useT();
  return (
    <section id="menu" className="px-[5vw] py-20 lg:py-32">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-14 lg:gap-8">
        <h2 data-reveal className={`${heading} text-[clamp(40px,6vw,96px)]`}>{full ? <>The<br />classics</> : <>Pick your<br />swirl</>}</h2>
        <div data-reveal className="max-w-[340px]">
          <p className="leading-relaxed text-muted">{t("menu.text")}</p>
          {!full && (
            <Link href="/menu" className="mt-4 inline-flex items-center gap-2 text-sm font-bold tracking-wider underline-offset-4 hover:underline">
              {t("menu.full")}
            </Link>
          )}
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {FLAVORS.map((f, i) => (
          <article
            key={f.name}
            data-reveal={i * 0.12}
            className="group rounded-[32px] bg-paper p-3.5 pb-6 transition duration-500 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-2 hover:shadow-[0_30px_60px_-30px_rgba(74,42,26,.45)]"
          >
            <div className="relative mb-5.5 h-[320px] overflow-hidden rounded-3xl sm:h-[400px]">
              <Image src={img(f.img, 900)} alt={f.name} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-1000 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-107" />
              <span className="absolute left-4 top-4 rounded-full bg-paper px-3 py-1.5 text-[11px] font-bold tracking-[.16em]">0{i + 1}</span>
            </div>
            <div className="px-3">
              <h3 className="font-display text-3xl uppercase">{f.name}</h3>
              <p className="mb-5 mt-2 text-sm leading-relaxed text-muted">{t(`flavor.${i}`)}</p>
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl">{money(f.price)}</span>
                <button
                  onClick={() => add(i)}
                  aria-label={`${t("menu.addAria")}: ${f.name}`}
                  className="grid size-12 place-items-center rounded-full bg-ink text-[22px] text-cream transition hover:rotate-90 hover:bg-caramel"
                >
                  +
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {full && (
        <div className="mt-20 grid gap-10 lg:mt-28 lg:grid-cols-[1fr_1.2fr] lg:gap-[6vw]">
          <div data-reveal>
            <h3 className={`${heading} text-[clamp(34px,4vw,60px)]`}>Make it<br />yours</h3>
            <p className="mt-4 max-w-[360px] leading-relaxed text-muted">{t("menu.extrasText")}</p>
          </div>
          <ul data-reveal className="divide-y divide-ink/12 border-y border-ink/12">
            {EXTRAS.map((e, i) => (
              <li key={e.name} className="flex items-baseline justify-between gap-4 py-4.5">
                <span className="font-display text-xl uppercase sm:text-2xl">{t(`extra.${i}`)}</span>
                <span className="flex-1 border-b border-dotted border-ink/25" />
                <span className="font-display text-xl">+{money(e.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function Banner() {
  const t = useT();
  return (
    <section className="relative grid h-[80vh] place-items-center overflow-hidden text-center text-cream lg:h-[110vh]">
      <div data-parallax="15" className="absolute inset-x-0 -top-[15%] h-[130%]">
        <Image src={img(PHOTOS.banner, 2000)} alt="Iced coffee splash" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-[rgba(18,10,6,.45)]" />
      <div className="relative z-2 px-[5vw]">
        <h2 data-reveal className={`${heading} text-[clamp(38px,10vw,150px)]`}>
          Brewed <em className="font-italic text-[#f0b073]">slow</em>,<br />served cold
        </h2>
        <p data-reveal className="mx-auto mt-6 max-w-[460px] leading-relaxed opacity-85">{t("banner.text")}</p>
      </div>
    </section>
  );
}

export function Marquee() {
  const words = ["Cold brew", "✦", "Oat milk", "✦", "Salted caramel", "✦", "Vanilla cloud", "✦"];
  const seq = [...words, ...words, ...words, ...words];
  return (
    <div aria-hidden className="overflow-hidden bg-ink py-6.5 text-cream">
      <div className="flex w-max animate-marquee">
        {seq.map((w, i) => (
          <span key={i} className={`whitespace-nowrap px-4 font-display text-[clamp(28px,4vw,56px)] uppercase sm:px-7 ${w === "✦" ? "text-caramel" : ""}`}>
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

/** About page: the brand story next to a photo. */
export function AboutStory() {
  const t = useT();
  return (
    <section className="grid items-center gap-12 px-[5vw] py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-[6vw] lg:py-32">
      <div data-reveal className="relative mx-auto h-[420px] w-full max-w-[520px] overflow-hidden rounded-[28px] lg:h-[600px] lg:max-w-none">
        <div data-parallax="12" className="absolute inset-x-0 -top-[10%] h-[120%]">
          <Image src={img(PHOTOS.pour, 1200)} alt="Milk being poured into iced coffee" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>
      </div>
      <div>
        <div data-reveal className="text-xs font-bold uppercase tracking-[.2em] text-muted">{t("about.since")}</div>
        <h2 data-reveal className={`${heading} mt-4 text-[clamp(38px,5.5vw,88px)]`}>
          A small bar<br />with a <em className="font-italic font-bold text-caramel">slow</em> idea
        </h2>
        <p data-reveal className="mt-6 max-w-[520px] leading-relaxed text-muted">{t("about.text")}</p>
        <div data-reveal className="mt-10 grid grid-cols-3 gap-4 border-t border-ink/12 pt-8">
          {[["18h", t("about.stat1")], ["3", t("about.stat2")], ["0", t("about.stat3")]].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-[clamp(32px,4vw,56px)] leading-none">{n}</div>
              <div className="mt-2 text-xs font-bold uppercase tracking-[.14em] text-muted">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** About page: the three steps of a swirl plus what we care about. */
export function Process() {
  const t = useT();
  return (
    <section className="bg-paper px-[5vw] py-20 lg:py-32">
      <h2 data-reveal className={`${heading} text-[clamp(40px,6vw,96px)]`}>How a swirl<br />is made</h2>
      <div className="mt-12 grid gap-5 md:grid-cols-3 lg:mt-16">
        {STEPS.map((s, i) => (
          <div key={s.n} data-reveal={i * 0.1} className="rounded-[28px] border border-ink/10 bg-cream p-7 lg:p-9">
            <span className="text-xs font-bold tracking-[.16em] text-caramel">{s.n}</span>
            <h3 className="mt-3 font-display text-4xl uppercase">{t(`step.${i}.title`)}</h3>
            <p className="mt-3 leading-relaxed text-muted">{t(`step.${i}.text`)}</p>
          </div>
        ))}
      </div>
      <div className="mt-20 grid gap-10 lg:mt-28 lg:grid-cols-3">
        {VALUES.map((v, i) => (
          <div key={v.title} data-reveal={i * 0.1} className="border-t border-ink/15 pt-6">
            <h3 className="font-display text-2xl uppercase">{t(`value.${i}.title`)}</h3>
            <p className="mt-3 leading-relaxed text-muted">{t(`value.${i}.text`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Visit() {
  const [sent, setSent] = useState(false);
  const t = useT();
  const info = [
    [t("visit.address"), t("visit.street"), t("visit.city")],
    [t("visit.hours"), t("visit.weekdays"), t("visit.weekend")],
    [t("visit.phone"), "+998 90 000 00 00"],
    ["Instagram", "@coffero.coffee"],
  ];
  return (
    <section id="visit" className="grid items-center gap-12 px-[5vw] py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-[6vw] lg:py-32">
      <div>
        <h2 data-reveal className={`${heading} text-[clamp(38px,7vw,110px)]`}>
          Come <em className="font-italic font-bold text-caramel">around</em><br />for a sip
        </h2>
        <div data-reveal className="mt-10 grid gap-6 sm:grid-cols-2 sm:gap-6.5">
          {info.map(([label, ...lines]) => (
            <div key={label} className="leading-relaxed">
              <small className="mb-1.5 block text-[11px] font-bold uppercase tracking-[.16em] text-muted">{label}</small>
              {lines.map((l) => <div key={l}>{l}</div>)}
            </div>
          ))}
        </div>
        <div data-reveal className="mt-12 rounded-[28px] bg-coffee p-5 text-cream sm:p-7.5">
          <h3 className="mb-3.5 font-display text-2xl uppercase sm:text-[28px]">{t("visit.newsTitle")}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              e.currentTarget.reset();
            }}
            className="flex flex-col gap-2 rounded-[22px] bg-white/10 p-1.5 sm:flex-row sm:rounded-full"
          >
            <input type="email" required placeholder="your@email.com" className="min-w-0 flex-1 bg-transparent px-4 py-3 text-cream outline-none placeholder:text-cream/50 sm:py-0" />
            <button type="submit" className="rounded-full bg-cream px-7 py-3.5 text-[13px] font-bold tracking-wider text-ink transition hover:-translate-y-0.5">{t("visit.join")}</button>
          </form>
          <div className="mt-3 min-h-5 text-sm text-[#f0c08f]">{sent ? t("visit.thanks") : ""}</div>
        </div>
      </div>
      <div data-reveal className="relative mx-auto h-[420px] w-full max-w-[520px] overflow-hidden rounded-[999px_999px_32px_32px] lg:h-[560px] lg:max-w-none">
        <div data-parallax="12" className="absolute inset-x-0 -top-[10%] h-[120%]">
          <Image src={img(PHOTOS.visit, 1200)} alt="Barista pouring milk into iced coffee" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}

/** Contact page: a simple message form (demo — nothing is sent anywhere). */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const t = useT();
  const field = "w-full rounded-2xl border border-ink/15 bg-paper px-5 py-4 outline-none transition focus:border-caramel";
  return (
    <section className="grid gap-12 bg-paper px-[5vw] py-20 lg:grid-cols-[1fr_1.3fr] lg:gap-[6vw] lg:py-32">
      <div>
        <h2 data-reveal className={`${heading} text-[clamp(38px,5.5vw,88px)]`}>Say<br /><em className="font-italic font-bold text-caramel">hello</em></h2>
        <p data-reveal className="mt-6 max-w-[380px] leading-relaxed text-muted">{t("contact.text")}</p>
      </div>
      <form
        data-reveal
        onSubmit={(e) => { e.preventDefault(); setSent(true); e.currentTarget.reset(); }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <input required placeholder={t("contact.name")} className={field} />
        <input required type="email" placeholder={t("contact.email")} className={field} />
        <select className={`${field} sm:col-span-2`} defaultValue="0">
          <option value="0">{t("contact.topic0")}</option>
          <option value="1">{t("contact.topic1")}</option>
          <option value="2">{t("contact.topic2")}</option>
        </select>
        <textarea required rows={5} placeholder={t("contact.message")} className={`${field} resize-none sm:col-span-2`} />
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <button type="submit" className="rounded-full bg-ink px-8 py-4 text-[13px] font-bold tracking-wider text-cream transition-colors hover:bg-coffee">
            {t("contact.send")}
          </button>
          {sent && <span className="text-sm text-caramel">{t("contact.thanks")}</span>}
        </div>
      </form>
    </section>
  );
}

const SOCIALS = [
  { name: "Instagram", href: "https://instagram.com/", path: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5h.01" },
  { name: "Telegram", href: "https://t.me/", path: "m21 4-18 7 6 2 2 6 3-4 5 4 2-15Zm-12 9 9-6" },
  { name: "TikTok", href: "https://tiktok.com/", path: "M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.5 2.5 4.5 5 5" },
];

export function Footer() {
  const col = "mb-4 block text-[11px] font-bold uppercase tracking-[.16em] text-cream/50";
  const link = "block py-1 text-cream/85 transition-colors hover:text-[#f0b073]";
  const t = useT();
  const pathname = usePathname();
  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else scrollTo({ top: 0, behavior: "smooth" });
  };
  if (BARE_PAGES.includes(pathname)) return null;

  return (
    <ScrollFx>
      <footer id="footer" className="mt-12 overflow-hidden rounded-t-[36px] bg-ink px-[5vw] pb-8 pt-16 text-cream lg:mt-20 lg:rounded-t-[56px] lg:pt-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <div data-reveal>
            <Link href="/" className="font-display text-3xl">
              COFFERO<span className="text-caramel">.</span>
            </Link>
            <p className="mt-4 max-w-[300px] leading-relaxed text-cream/65">{t("s1.text")}</p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name}
                  className="grid size-11 place-items-center rounded-full border border-cream/20 transition-colors hover:border-caramel hover:bg-caramel">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          <div data-reveal="0.08">
            <small className={col}>{t("footer.pages")}</small>
            {NAV_LINKS.map((l) => <Link key={l.href} href={l.href} className={link}>{t(l.key)}</Link>)}
          </div>

          <div data-reveal="0.16">
            <small className={col}>{t("footer.visit")}</small>
            <p className="py-1 text-cream/85">{t("visit.street")}</p>
            <p className="py-1 text-cream/85">{t("footer.country")}</p>
            <p className="py-1 text-cream/60">{t("visit.weekdays")}</p>
            <p className="py-1 text-cream/60">{t("visit.weekend")}</p>
          </div>

          <div data-reveal="0.24">
            <small className={col}>{t("footer.contact")}</small>
            <a href="tel:+998900000000" className={link}>+998 90 000 00 00</a>
            <a href="mailto:hello@coffero.uz" className={link}>hello@coffero.uz</a>
            <Link href="/contact" className={link}>{t("footer.write")}</Link>
          </div>
        </div>

  

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-cream/12 pt-6 text-[13px] text-cream/55">
          <span>© 2026 Coffero Coffee Co. · Photos: Unsplash</span>
          <button onClick={toTop} className="inline-flex items-center gap-2 transition-colors hover:text-cream">
            {t("footer.top")} <span className="grid size-8 place-items-center rounded-full border border-cream/25">↑</span>
          </button>
        </div>
      </footer>
    </ScrollFx>
  );
}
