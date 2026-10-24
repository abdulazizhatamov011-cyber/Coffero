"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BARE_PAGES, NAV_LINKS } from "@/lib/data";
import { getLenis } from "@/lib/smooth";
import { useT } from "@/lib/i18n";
import { useCart } from "./cart";
import { AccountMenu, LangMenu, LangPills, SearchButton } from "./nav-tools";

/** Asks <Story> to jump to a scene (or falls back to normal anchor scroll). */
export function goScene(i: number) {
  window.dispatchEvent(new CustomEvent("swirl:go", { detail: i }));
}

// on the home page the links stay hidden until the story reaches the "daily obsession" scene
const reveal =
  "pointer-events-none -translate-y-3 opacity-0 transition duration-700 ease-[cubic-bezier(.2,.8,.2,1)] navshow:pointer-events-auto navshow:translate-y-0 navshow:opacity-100";

export default function Nav() {
  const { count, setOpen } = useCart();
  const pathname = usePathname();
  const home = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useT();

  // freeze page scroll while the mobile menu is open (links close it on click)
  useEffect(() => {
    if (menuOpen) getLenis()?.stop();
    else getLenis()?.start();
  }, [menuOpen]);

  if (BARE_PAGES.includes(pathname)) return null;

  const onHomeLink = (e: React.MouseEvent) => {
    if (!home) return;
    e.preventDefault();
    goScene(0);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 transition-colors duration-500 sm:px-[5vw] sm:py-5 ${
          home
            ? "nav-dark:text-cream nav-solid:bg-cream/90 nav-solid:shadow-[0_1px_0_rgba(31,22,17,.08)] nav-solid:backdrop-blur-md"
            : "bg-cream/90 shadow-[0_1px_0_rgba(31,22,17,.08)] backdrop-blur-md"
        } ${menuOpen ? "!bg-transparent !text-cream !shadow-none" : ""}`}
      >
        <Link href="/" onClick={onHomeLink} className="relative z-10 font-display text-[22px] tracking-wide sm:text-[26px]">
          Coffero<span className="text-caramel">.</span>
        </Link>

        <nav className={`hidden gap-9 text-xs font-semibold uppercase tracking-[.14em] lg:flex ${home ? reveal : ""}`}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={l.href === "/" ? onHomeLink : undefined}
              className={`link ${pathname === l.href ? "after:!w-full" : ""}`}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2 sm:gap-3.5">
          <LangMenu />
          <SearchButton />
          <AccountMenu />
          <button aria-label={t("nav.cart")} onClick={() => setOpen(true)} className="relative grid size-9 place-items-center rounded-full transition hover:bg-tan/25">
            {/* shopping bag */}
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5.5 8h13l-.9 11.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5.5 8Z" />
              <path d="M8.5 10V7a3.5 3.5 0 0 1 7 0v3" />
            </svg>
            <span className={`absolute right-0 top-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-caramel px-1 text-[10px] font-bold text-white transition-transform ${count ? "scale-100" : "scale-0"}`}>
              {count}
            </span>
          </button>
          {/* mobile menu toggle */}
          <button
            aria-label={t(menuOpen ? "nav.closeMenu" : "nav.openMenu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full transition hover:bg-tan/25 lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-[1.8px] w-full bg-current transition ${menuOpen ? "top-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-[1.8px] w-full bg-current transition ${menuOpen ? "bottom-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </header>

      {/* mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-ink px-[6vw] pb-10 pt-28 text-cream transition-[clip-path] duration-700 ease-[cubic-bezier(.7,0,.2,1)] lg:hidden ${
          menuOpen ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <nav className="flex flex-col">
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={(e) => { if (l.href === "/") onHomeLink(e); setMenuOpen(false); }}
              style={{ transitionDelay: menuOpen ? `${150 + i * 60}ms` : "0ms" }}
              className={`border-b border-cream/12 py-4 font-display text-[clamp(32px,9vw,64px)] uppercase leading-none transition duration-500 ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              } ${pathname === l.href ? "text-[#f0b073]" : ""}`}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>
        <div className="text-sm text-cream/60">
          <div className="mb-6"><LangPills /></div>
          <p>{t("visit.street")}, {t("visit.city")}</p>
          <p className="mt-1">+998 90 000 00 00 · hello@coffero.uz</p>
        </div>
      </div>
    </>
  );
}
