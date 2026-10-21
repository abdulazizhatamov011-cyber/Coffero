"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { EXTRAS, FLAVORS, NAV_LINKS, img, money } from "@/lib/data";
import { LANGS, setLang, useLang, useT } from "@/lib/i18n";
import { signOut, useSession } from "@/lib/auth";
import { getLenis } from "@/lib/smooth";
import { useCart } from "./cart";

/** Closes a popover when clicking outside of it or pressing Escape. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) close(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    addEventListener("pointerdown", onDown);
    addEventListener("keydown", onKey);
    return () => { removeEventListener("pointerdown", onDown); removeEventListener("keydown", onKey); };
  }, [open, close]);
  return ref;
}

const popover = "absolute right-0 top-[calc(100%+10px)] z-20 min-w-[190px] origin-top-right rounded-2xl bg-paper p-2 text-ink shadow-[0_24px_50px_-18px_rgba(31,22,17,.45)] ring-1 ring-ink/8 transition duration-200";

export function LangMenu() {
  const lang = useLang();
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("nav.language")}
        className="rounded-full border-[1.5px] border-current px-3.5 py-1.5 text-[11px] font-bold tracking-[.12em] transition-colors hover:bg-tan/25"
      >
        {LANGS.find((l) => l.code === lang)?.label} <span className={`inline-block transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      <ul role="listbox" className={`${popover} ${open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}>
        {LANGS.map((l) => (
          <li key={l.code}>
            <button
              role="option"
              aria-selected={lang === l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-cream-2 ${lang === l.code ? "font-bold" : ""}`}
            >
              {l.name} <span className="text-[11px] font-bold tracking-wider text-muted">{l.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Language picker for the mobile menu. */
export function LangPills() {
  const lang = useLang();
  return (
    <div className="flex gap-2">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`rounded-full border border-cream/40 px-4 py-2 text-xs font-bold tracking-wider ${lang === l.code ? "bg-cream text-ink" : "text-cream"}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

export function AccountMenu() {
  const session = useSession();
  const t = useT();
  const { toast } = useCart();
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));

  const userIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
  );

  if (!session) {
    return (
      <Link href="/login" aria-label={t("auth.signIn")} title={t("auth.signIn")} className="grid size-9 place-items-center rounded-full transition hover:bg-tan/25">
        {userIcon}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("nav.account")}
        aria-expanded={open}
        className="grid size-9 place-items-center rounded-full bg-caramel font-display text-base text-white transition hover:brightness-110"
      >
        {session.name.slice(0, 1).toUpperCase()}
      </button>
      <div className={`${popover} min-w-[220px] ${open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}>
        <div className="px-3 pb-3 pt-2">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-muted">{t("acc.signedIn")}</p>
          <p className="mt-1 font-display text-lg leading-tight">{session.name}</p>
          <p className="truncate text-xs text-muted">{session.email}</p>
        </div>
        <Link
          href="/profile"
          onClick={() => setOpen(false)}
          className="block rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-cream-2"
        >
          {t("nav.profile")}
        </Link>
        <button
          onClick={() => { signOut(); setOpen(false); toast(t("acc.signedOut")); }}
          className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-cream-2"
        >
          {t("acc.signOut")} →
        </button>
      </div>
    </div>
  );
}

type Result =
  | { kind: "drink"; index: number; title: string; sub: string }
  | { kind: "extra"; title: string; sub: string }
  | { kind: "page"; href: string; title: string };

export function SearchButton() {
  const t = useT();
  const [open, setOpen] = useState(false);

  // "/" or Ctrl/⌘+K opens search from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.("input, textarea, select, [contenteditable]");
      if ((e.key === "/" && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) getLenis()?.stop();
    else getLenis()?.start();
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label={t("nav.search")} title={`${t("nav.search")} ( / )`} className="grid size-9 place-items-center rounded-full transition hover:bg-tan/25">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      </button>
      {open && <SearchPanel onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const t = useT();
  const router = useRouter();
  const { add } = useCart();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo<Result[]>(() => {
    const all: Result[] = [
      ...FLAVORS.map((f, i) => ({ kind: "drink" as const, index: i, title: f.name, sub: t(`flavor.${i}`) })),
      ...EXTRAS.map((e, i) => ({ kind: "extra" as const, title: t(`extra.${i}`), sub: `+${money(e.price)}` })),
      ...NAV_LINKS.map((l) => ({ kind: "page" as const, href: l.href, title: t(l.key) })),
    ];
    const s = q.trim().toLowerCase();
    if (!s) return all;
    return all.filter((r) => `${r.title} ${"sub" in r ? r.sub : ""}`.toLowerCase().includes(s));
  }, [q, t]);

  const choose = (r: Result) => {
    if (r.kind === "drink") add(r.index);
    else if (r.kind === "extra") { router.push("/menu"); onClose(); }
    else { router.push(r.href); onClose(); }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === "Enter" && results[active]) choose(results[active]);
  };

  const group = (kind: Result["kind"], label: string) => {
    const items = results.map((r, i) => ({ r, i })).filter(({ r }) => r.kind === kind);
    if (!items.length) return null;
    return (
      <div className="mb-4">
        <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[.16em] text-muted">{label}</p>
        {items.map(({ r, i }) => (
          <button
            key={`${r.kind}-${r.title}`}
            onMouseEnter={() => setActive(i)}
            onClick={() => choose(r)}
            className={`flex w-full items-center gap-4 rounded-2xl px-3 py-2.5 text-left transition-colors ${active === i ? "bg-cream-2" : ""}`}
          >
            {r.kind === "drink" && (
              <span className="relative size-12 shrink-0 overflow-hidden rounded-xl">
                <Image src={img(FLAVORS[r.index].img, 120)} alt="" fill sizes="48px" className="object-cover" />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg uppercase leading-tight">{r.title}</span>
              {"sub" in r && <span className="block truncate text-sm text-muted">{r.sub}</span>}
            </span>
            {r.kind === "drink" && (
              <span className="flex shrink-0 items-center gap-2">
                <span className="font-display">{money(FLAVORS[r.index].price)}</span>
                <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-cream">+ {t("search.add")}</span>
              </span>
            )}
            {r.kind === "page" && <span className="text-muted">→</span>}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/45 px-4 pt-[12vh] backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={t("nav.search")}>
      <div className="w-full max-w-[620px] overflow-hidden rounded-[28px] bg-paper text-ink shadow-[0_40px_90px_-30px_rgba(0,0,0,.6)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            placeholder={t("search.placeholder")}
            className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-muted/70"
          />
          <button onClick={onClose} aria-label={t("search.close")} className="rounded-full border border-ink/15 px-2.5 py-1 text-[11px] font-bold text-muted hover:bg-cream-2">ESC</button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3" data-lenis-prevent>
          {results.length === 0 ? (
            <p className="px-3 py-10 text-center text-muted">{t("search.empty")} “{q}”</p>
          ) : (
            <>
              {group("drink", t("search.drinks"))}
              {group("extra", t("search.extras"))}
              {group("page", t("search.pages"))}
            </>
          )}
        </div>
        <p className="border-t border-ink/10 px-5 py-2.5 text-xs text-muted">↑ ↓ · Enter · {t("search.hint")}</p>
      </div>
    </div>
  );
}
