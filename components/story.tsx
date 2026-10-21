"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { FLAVORS, PHOTOS, STEPS, img } from "@/lib/data";
import { easeInOutCubic, getLenis, setWheelInterceptor } from "@/lib/smooth";
import LiquidRing from "./liquid-ring";
import { useT } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

const SCENES = 4;
const MOBILE = "(max-width: 1023px)";

const LABELS = [
  { text: "Espresso shot", pos: "left-[5%] top-[15%] lg:left-[22%] lg:top-[20%]" },
  { text: "Vanilla cloud", pos: "right-[5%] top-[23%] lg:right-[22%] lg:top-[26%]" },
  { text: "Oat milk", pos: "left-[8%] top-[33%] lg:left-[28%] lg:top-[46%]" },
  { text: "Salted caramel", pos: "right-[5%] top-[41%] lg:right-[26%] lg:top-[52%]" },
  { text: "Cold brew 18h", pos: "left-[12%] top-[49%] lg:left-[46%] lg:top-[80%]" },
];

/** Text that slides up from behind a mask. */
function Line({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <span className="line-in block">{children}</span>
    </span>
  );
}

export default function Story() {
  const root = useRef<HTMLElement>(null);
  const [flavor, setFlavor] = useState(0);
  const t = useT();

  useGSAP(
    () => {
      const story = root.current!;
      const mm = gsap.matchMedia();

      mm.add({ mobile: MOBILE, desktop: "(min-width: 1024px)" }, (ctx) => {
        const mobile = Boolean(ctx.conditions?.mobile);
        // The arch is a real box that grows to full screen, so the photo is always
        // "cover"-fitted to it (the whole glass shows instead of a zoomed-in slice).
        const arch = story.querySelector<HTMLElement>(".arch")!;
        // On small screens the arch starts just under the heading and its width follows the
        // free height, so it keeps an arch shape on phones and tablets alike.
        const s1Text = story.querySelector<HTMLElement>(".s1-text")!;
        const archTop = () => Math.max(innerHeight * 0.28, s1Text.offsetTop + s1Text.offsetHeight + 32);
        const archBottom = () => innerHeight * 0.04;
        const side = () => (innerWidth - Math.min(innerWidth * 0.88, (innerHeight - archTop() - archBottom()) * 0.8)) / 2;
        const archBox = mobile
          ? { top: archTop, left: side, right: side, bottom: archBottom }
          : { top: "13%", left: "55%", right: "7%", bottom: "8%" };
        // on small screens the "18h" seal sits on the arch's top-right shoulder
        if (mobile) gsap.set(".seal-wrap", { top: () => archTop() + 8, right: () => Math.max(8, side() - 12) });
        const topRadius = () => arch.offsetWidth / 2;
        const bottomRadius = mobile ? 24 : 28;

        // intro on load
        // (explicit fromTo values so React's dev double-mount can't capture a half-finished state)
        gsap.fromTo(".s1 .line-in", { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.1, delay: 0.15 });
        gsap.fromTo(".s1-fade", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, delay: 0.6 });
        gsap.fromTo(".arch-wrap", { yPercent: 25, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.4, ease: "power4.out" });
        gsap.fromTo(".seal-wrap", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.9 });

        gsap.set(".mix-ch", { yPercent: 110 });
        gsap.set(".mix-step", { opacity: 0, y: 40 });
        gsap.set(".t-label", { opacity: 0, scale: 0.6, y: 14 });
        gsap.set(".s4", { yPercent: 100 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: story,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress * (SCENES - 1);
              // at the very end the "solid" trigger below owns the header — don't overwrite it
              if (self.progress < 1) document.documentElement.dataset.nav = p > 0.55 && p < 1.5 ? "dark" : "";
              // navbar links/icons only appear once the "daily obsession" scene arrives
              document.documentElement.dataset.items = p >= 2.45 ? "on" : "";
            },
          },
        });

        // 0 → 1 : the arch photo grows to full screen, "MIX IT UP"
        tl.fromTo(".s1-text", { yPercent: 0, opacity: 1 }, { yPercent: -25, opacity: 0, duration: 0.4, ease: "power1.in" }, 0)
          .fromTo(".hint-inner", { opacity: 1 }, { opacity: 0, duration: 0.2 }, 0)
          .fromTo(".seal", { scale: 1, rotate: 0 }, { scale: 0, rotate: 120, duration: 0.35 }, 0)
          .fromTo(".arch",
            { ...archBox, borderTopLeftRadius: topRadius, borderTopRightRadius: topRadius, borderBottomLeftRadius: bottomRadius, borderBottomRightRadius: bottomRadius },
            { top: 0, left: 0, right: 0, bottom: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, duration: 0.7, ease: "power2.inOut" }, 0.05)
          .fromTo(".ai1", { scale: 1.08 }, { scale: 1, duration: 0.7, ease: "power2.inOut" }, 0.05)
          .to(".ai2", { opacity: 1, duration: 0.3 }, 0.5)
          .fromTo(".ai2", { scale: 1.2 }, { scale: 1, duration: 1.2 }, 0.5)
          .to(".shade", { opacity: 1, duration: 0.3 }, 0.55)
          .fromTo(".mix-ch", { yPercent: 110 }, { yPercent: 0, duration: 0.25, stagger: 0.03, ease: "power3.out" }, 0.5)
          .to(".mix-fade", { opacity: 1, duration: 0.2 }, 0.7)
          .to(".mix-step", { opacity: 1, y: 0, duration: 0.2, stagger: 0.05, ease: "power3.out" }, 0.72)
          // 1 → 2 : circle reveal of the splash
          .fromTo(".mix-ch", { yPercent: 0 }, { yPercent: -110, duration: 0.3, stagger: 0.03, ease: "power2.in", immediateRender: false }, 1.4)
          .to(".mix-fade", { opacity: 0, duration: 0.2 }, 1.4)
          .to(".mix-step", { opacity: 0, y: -24, duration: 0.2, stagger: 0.03 }, 1.4)
          .fromTo(".s3", { clipPath: "circle(0% at 50% 55%)" }, { clipPath: "circle(80% at 50% 55%)", duration: 0.55, ease: "power2.inOut" }, 1.45)
          .fromTo(".splash", { rotate: -25, scale: 0.6 }, { rotate: 8, scale: 1.05, duration: 1.5 }, 1.45)
          .fromTo(".sun", { rotate: 0, scale: 0.7 }, { rotate: 140, scale: 1, duration: 1.5 }, 1.45)
          .fromTo(".band-text", { xPercent: 0 }, { xPercent: -25, duration: 1.5 }, 1.45)
          .to(".t-label", { opacity: 1, scale: 1, y: 0, duration: 0.15, stagger: 0.07, ease: "back.out(2)" }, 1.8)
          // 2 → 3 : product scene slides up
          .to(".s4", { yPercent: 0, duration: 0.5, ease: "power2.inOut" }, 2.45)
          .from(".s4 .line-in", { yPercent: 110, duration: 0.3, stagger: 0.06, ease: "power3.out" }, 2.75)
          .from(".product", { y: 200, opacity: 0, duration: 0.35, ease: "power3.out" }, 2.7)
          .from(".orbit", { scaleX: 0.3, opacity: 0, duration: 0.3 }, 2.8)
          .from(".s4-fade", { opacity: 0, y: 30, duration: 0.2, stagger: 0.05 }, 2.8)
          .set({}, {}, SCENES - 1);

        // header turns solid once the story is over
        ScrollTrigger.create({
          trigger: story,
          start: "bottom bottom",
          end: "max",
          onToggle: (s) => {
            document.documentElement.dataset.nav = s.isActive ? "solid" : "";
            if (s.isActive) document.documentElement.dataset.items = "on";
          },
        });
      });

      /* ---- one wheel notch = one scene, like the video ---- */
      let busy = false;
      const scenePos = (i: number) => story.offsetTop + (i / (SCENES - 1)) * (story.offsetHeight - innerHeight);
      const go = (i: number) => {
        busy = true;
        const done = () => { setTimeout(() => (busy = false), 200); };
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(scenePos(i), { duration: 1.4, easing: easeInOutCubic, lock: true, force: true, onComplete: done });
        } else {
          gsap.to(window, { scrollTo: scenePos(i), duration: 1.4, ease: "power2.inOut", overwrite: true, onComplete: done });
        }
      };

      /** Returns true when the wheel was used to jump a scene. */
      const handleWheel = (deltaY: number, e: WheelEvent) => {
        // ignore the wheel while a drawer / menu / search has paused the page scroll
        if (document.body.dataset.cart === "open" || getLenis()?.isStopped) return false;
        const dir = Math.sign(deltaY);
        if (!dir) return false;
        const y = scrollY, a = scenePos(0), b = scenePos(SCENES - 1);
        if (y < a - 2 || y > b + 2) return false;
        const cur = ((y - a) / (b - a)) * (SCENES - 1);
        const next = dir > 0 ? Math.floor(cur + 0.02) + 1 : Math.ceil(cur - 0.02) - 1;
        if (next < 0 || next > SCENES - 1) return false; // leave the story naturally
        e.preventDefault();
        if (!busy) go(next);
        return true;
      };
      // with smooth scrolling on, Lenis asks us first; otherwise listen to the wheel directly
      const onWheel = (e: WheelEvent) => { if (!getLenis()) handleWheel(e.deltaY, e); };
      setWheelInterceptor(handleWheel);
      const onKey = (e: KeyboardEvent) => {
        if ((e.target as HTMLElement)?.closest?.("input, textarea, select, [contenteditable]") || getLenis()?.isStopped) return;
        const y = scrollY, a = scenePos(0), b = scenePos(SCENES - 1);
        if (y > b + 2 || busy) return;
        const cur = Math.round(((y - a) / (b - a)) * (SCENES - 1));
        if (["ArrowDown", "PageDown", " "].includes(e.key) && cur < SCENES - 1) { e.preventDefault(); go(cur + 1); }
        if (["ArrowUp", "PageUp"].includes(e.key) && cur > 0) { e.preventDefault(); go(cur - 1); }
      };
      const onGo = (e: Event) => go((e as CustomEvent<number>).detail);

      addEventListener("wheel", onWheel, { passive: false });
      addEventListener("keydown", onKey);
      addEventListener("swirl:go", onGo);
      return () => {
        setWheelInterceptor(null);
        // leaving the home page: give the header back its default look
        document.documentElement.dataset.nav = "";
        document.documentElement.dataset.items = "";
        removeEventListener("wheel", onWheel);
        removeEventListener("keydown", onKey);
        removeEventListener("swirl:go", onGo);
        mm.revert();
      };
    },
    { scope: root }
  );

  return (
    <section id="story" ref={root} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[radial-gradient(120%_90%_at_65%_50%,var(--color-paper)_0%,var(--color-cream)_55%,var(--color-cream-2)_100%)]">

        {/* ---------- Scene 1: hero ---------- */}
        <div className="s1 absolute inset-0">
          <div className="s1-text absolute inset-x-4 top-24 z-3 lg:inset-x-auto lg:left-[6vw] lg:top-1/2 lg:-translate-y-[46%]">
            <div className="text-xs font-bold uppercase tracking-[.2em] text-muted"><Line>{t("s1.eyebrow")}</Line></div>
            <h1 className="mt-3 font-display text-[clamp(36px,10.5vw,72px)] uppercase lg:text-[clamp(52px,min(6vw,12vh),120px)] leading-[.88] lg:mb-6 lg:mt-[18px]">
              <Line className="whitespace-nowrap pb-[.04em]">Good things</Line>
              <Line className="whitespace-nowrap pb-[.04em]">come around</Line>
            </h1>
            <p className="s1-fade mb-7 hidden max-w-[360px] leading-relaxed text-muted lg:block">
              {t("s1.text")}
            </p>
            <a href="#menu" className="s1-fade hidden items-center gap-2.5 rounded-full bg-ink px-7 py-4 text-[13px] font-bold tracking-wider text-cream transition-colors hover:bg-coffee lg:inline-flex">
              {t("s1.shop")}
            </a>
          </div>
          <div className="s1-fade absolute bottom-[5vh] left-[6vw] z-3 hidden lg:block">
          <div className="hint-inner flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.2em] text-muted">
            <span className="relative h-[34px] w-[22px] rounded-xl border-[1.6px] border-muted after:absolute after:left-1/2 after:top-[7px] after:h-[7px] after:w-[3px] after:rounded-sm after:bg-muted after:content-[''] after:animate-wheel" />
            {t("s1.scroll")}
          </div>
          </div>
        </div>

        {/* the arch photo that grows into scene 2 */}
        <div className="arch-wrap absolute inset-0 z-2">
          <div className="arch absolute inset-[46%_6%_4%_6%] overflow-hidden rounded-t-[999px] rounded-b-3xl lg:inset-[13%_7%_8%_55%] lg:rounded-b-[28px]">
            <div className="ai1 absolute inset-0">
              <Image src={img(PHOTOS.hero, 1800)} alt="Iced coffee with cinnamon" fill priority sizes="100vw" className="object-cover object-[50%_60%]" />
            </div>
            <div className="ai2 absolute inset-0 opacity-0">
              <Image src={img(PHOTOS.pour, 1800)} alt="Milk being poured into iced coffee" fill sizes="100vw" className="object-cover" />
            </div>
            <div className="shade absolute inset-0 bg-[linear-gradient(180deg,rgba(20,12,8,.25),rgba(20,12,8,.55))] opacity-0" />
          </div>
        </div>

        <div className="seal-wrap absolute right-[5%] top-[40%] z-4 lg:right-auto lg:left-[calc(55%-70px)] lg:top-auto lg:bottom-[12%]">
          <div className="seal relative grid size-[110px] place-items-center rounded-full bg-ink text-cream lg:size-[140px]">
            <svg viewBox="0 0 140 140" className="absolute inset-0 animate-spin-slow">
              <defs><path id="circ" d="M70 70 m-52 0 a52 52 0 1 1 104 0 a52 52 0 1 1 -104 0" /></defs>
              <text fontSize="11" fontWeight="700" letterSpacing="3.2" fill="#f4ece0" className="font-sans">
                <textPath href="#circ">COLD BREW • SLOW STEEPED • 18 HOURS •</textPath>
              </text>
            </svg>
            <b className="font-display text-3xl font-normal">18h</b>
          </div>
        </div>

        {/* ---------- Scene 2: mix it up ---------- */}
        <div className="pointer-events-none absolute inset-0 z-3 text-cream">
          <div className="absolute inset-x-0 top-[17vh] text-center lg:top-[15vh]">
            <div className="mix-fade text-xs font-bold uppercase tracking-[.2em] opacity-0">{t("s2.eyebrow")}</div>
            <h2 className="mt-2 flex justify-center overflow-hidden pt-[.05em] font-display text-[clamp(48px,min(15vw,26vh),260px)] uppercase leading-[.95]">
              {[..."MIX IT UP"].map((c, i) =>
                c === " " ? <span key={i} className="w-[.25em]" /> : <span key={i} className="mix-ch inline-block">{c}</span>
              )}
            </h2>
            <p className="mix-fade mx-auto mt-4 max-w-[440px] px-4 leading-relaxed opacity-0">
              {t("s2.text")}
            </p>
            <Link
              href="/menu"
              className="mix-fade pointer-events-auto mt-6 inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-cream/70 px-6 py-3 text-[13px] font-bold tracking-wider opacity-0 backdrop-blur-sm transition-colors hover:bg-cream hover:text-ink"
            >
              {t("s2.cta")}
            </Link>
          </div>

          {/* how a swirl is made */}
          <div className="absolute inset-x-[5vw] bottom-[6vh] grid grid-cols-3 gap-2 sm:gap-4">
            {STEPS.map((s, i) => (
              <div key={s.n} className="mix-step min-w-0 rounded-2xl border border-cream/25 bg-white/10 p-3 backdrop-blur-md sm:rounded-3xl sm:p-5">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="text-[11px] font-bold tracking-[.16em] text-[#f0b073]">{s.n}</span>
                  <b className="truncate font-display text-base font-normal uppercase sm:text-2xl">{t(`step.${i}.title`)}</b>
                </div>
                <p className="mt-1.5 hidden text-sm leading-snug text-cream/80 sm:block">{t(`step.${i}.text`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Scene 3: what's in the swirl ---------- */}
        <div className="s3 absolute inset-0 z-4 bg-[radial-gradient(90%_80%_at_50%_45%,#e2c4a0_0%,#c99f74_60%,#b48658_100%)] [clip-path:circle(0%_at_50%_55%)]">
          <div className="sun absolute left-1/2 top-1/2 aspect-square w-[min(64vh,70vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full shadow-[0_40px_90px_-30px_rgba(74,42,26,.6)]">
            <Image src={img(PHOTOS.sun, 1200)} alt="" fill sizes="64vh" className="scale-125 object-cover" />
          </div>
          <div className="absolute inset-x-0 top-[58%] z-2 flex h-12 lg:h-15 items-center overflow-hidden bg-paper">
            <div className="band-text whitespace-nowrap font-display text-xl tracking-[.2em] text-coffee lg:text-[28px]">
              {"SHAKEN · STIRRED · SWIRLED · ".repeat(12)}
            </div>
          </div>
          <div className="splash absolute left-1/2 top-1/2 aspect-[3/4] h-[96vh] -translate-x-1/2 -translate-y-1/2 mix-blend-multiply [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_55%,transparent_98%)]">
            <Image src={img(PHOTOS.splash, 1400)} alt="Coffee and milk splash" fill sizes="72vh" className="object-cover brightness-112 contrast-115" />
          </div>
          {LABELS.map((l, i) => (
            <span key={l.pos} className={`t-label absolute z-3 whitespace-nowrap rounded-full border-[1.3px] border-ink bg-paper px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[.14em] shadow-[0_10px_24px_-12px_rgba(0,0,0,.4)] lg:px-4 lg:py-2.5 lg:text-[11px] ${l.pos}`}>
              <i className="mr-2 inline-block size-[7px] rounded-full bg-caramel align-[1px]" />
              {t(`label.${i}`)}
            </span>
          ))}
          <div className="absolute inset-x-[6vw] bottom-[6vh] z-3 max-w-[480px] lg:right-auto">
            <div className="text-xs font-bold uppercase tracking-[.2em] text-[#3d2a1e]">{t("s3.eyebrow")}</div>
            <h3 className="my-2 font-display text-[clamp(32px,4vw,62px)] uppercase leading-[.95]">Layer by layer</h3>
            <p className="leading-relaxed text-[#3d2a1e]">{t("s3.text")}</p>
          </div>
        </div>

        {/* ---------- Scene 4: your daily obsession ---------- */}
        <div className="s4 absolute inset-0 z-5 bg-[radial-gradient(110%_90%_at_50%_60%,var(--color-paper)_0%,var(--color-cream)_60%,var(--color-cream-2)_100%)]">
          <div className="absolute inset-x-4 top-[11vh] z-3 text-center lg:top-[12vh]">
            <div className="mb-1.5 font-display text-lg tracking-wide lg:text-[22px]"><Line>The Sip</Line></div>
            <h2 className="font-italic text-[clamp(32px,9vw,64px)] lg:text-[clamp(52px,min(6.6vw,11vh),108px)] font-bold uppercase italic leading-[.92]">
              <Line>Your daily <span className="inline-block animate-spin-mid align-top text-[.5em] not-italic text-caramel">✦</span></Line>
              <Line>obsession</Line>
            </h2>
          </div>

          <div className="s4-fade absolute left-[6vw] top-[52%] z-3 hidden lg:block">
            <small className="text-[11px] uppercase tracking-[.16em] text-muted">{t("s4.section")}</small>
            {FLAVORS.map((f, i) => (
              <button
                key={f.name}
                onClick={() => setFlavor(i)}
                className={`block text-left font-display text-[clamp(20px,2vw,32px)] uppercase leading-[1.3] transition duration-300 hover:translate-x-2 hover:text-ink ${flavor === i ? "translate-x-2 text-ink" : "text-ink/30"}`}
              >
                {f.name}
              </button>
            ))}
            <div className="mt-4.5 flex gap-2">
              <span className="rounded-full border-[1.3px] border-ink bg-paper px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em]">{FLAVORS[flavor].name}</span>
              <span className="rounded-full border-[1.3px] border-ink bg-paper px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em]">{t("s4.size")}</span>
            </div>
          </div>

          {/* flavour switcher for phones (the side list is desktop only) */}
          <div className="s4-fade absolute inset-x-0 bottom-[calc(3vh+64px+40vh+16px)] z-3 flex justify-center gap-2 lg:hidden">
            {FLAVORS.map((f, i) => (
              <button
                key={f.name}
                onClick={() => setFlavor(i)}
                className={`rounded-full border-[1.3px] border-ink px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.1em] transition-colors ${flavor === i ? "bg-ink text-cream" : "bg-paper"}`}
              >
                {f.name}
              </button>
            ))}
          </div>

          <div className="product absolute bottom-[calc(3vh+64px)] left-1/2 z-2 h-[40vh] w-[min(60vw,22vh)] -translate-x-1/2 lg:bottom-[7vh] lg:h-[52vh] lg:w-[min(25vw,28vh,330px)]">
            <LiquidRing half="back" className="orbit absolute -inset-x-[34%] top-[36%] -z-1 w-[168%] drop-shadow-[0_14px_14px_rgba(40,18,6,.25)]" />
            <div className="absolute inset-0 overflow-hidden rounded-full shadow-[0_40px_80px_-30px_rgba(74,42,26,.55)]">
              {FLAVORS.map((f, i) => (
                <div key={f.name} className={`absolute inset-0 transition duration-[1200ms] ease-[cubic-bezier(.2,.8,.2,1)] ${flavor === i ? "scale-100 opacity-100" : "scale-108 opacity-0"}`}>
                  <Image src={img(f.img, 800)} alt={f.name} fill sizes="(min-width: 1024px) 330px, 60vw" className="object-cover" />
                </div>
              ))}
            </div>
            <LiquidRing half="front" className="orbit absolute -inset-x-[34%] top-[36%] z-3 w-[168%] drop-shadow-[0_14px_14px_rgba(40,18,6,.3)]" />
          </div>

          <div className="s4-fade absolute right-[6vw] top-[38%] z-3 hidden w-[200px] rounded-[26px] bg-paper p-3 shadow-[0_24px_50px_-20px_rgba(74,42,26,.4)] lg:block">
            <div className="relative h-[min(190px,22vh)] overflow-hidden rounded-[18px]">
              <Image src={img(PHOTOS.honey, 500)} alt="Iced latte with a gold straw" fill sizes="176px" className="object-cover" />
            </div>
            <b className="mx-1 mb-0.5 mt-2.5 block font-display font-normal uppercase">Honey Swirl</b>
            <span className="mx-1 text-xs text-muted">{t("s4.new")}</span>
          </div>

          <a href="#menu" className="s4-fade absolute bottom-[3vh] left-1/2 z-3 inline-flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full bg-ink px-6 py-3.5 text-[13px] lg:px-7 lg:py-4 font-bold tracking-wider text-cream transition-colors hover:bg-coffee lg:bottom-[6vh] lg:left-auto lg:right-[6vw] lg:translate-x-0">
            {t("s4.cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
