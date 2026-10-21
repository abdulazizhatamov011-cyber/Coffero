"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FLAVORS, img, money } from "@/lib/data";
import { changePassword, signOut, updateProfile, useSession, type AuthError } from "@/lib/auth";
import { LANGS, setLang, useLang, useT } from "@/lib/i18n";
import { useCart } from "./cart";

const card = "rounded-[32px] bg-paper p-6 shadow-[0_24px_50px_-30px_rgba(74,42,26,.45)] sm:p-8";
const label = "mb-2 block text-[11px] font-bold uppercase tracking-[.16em] text-muted";
const field = "w-full rounded-2xl border border-ink/15 bg-cream px-4 py-3.5 outline-none transition focus:border-caramel disabled:opacity-60";
const darkBtn = "rounded-full bg-ink px-6 py-3 text-[13px] font-bold tracking-wider text-cream transition-colors hover:bg-coffee disabled:opacity-60";

export default function ProfileView() {
  const t = useT();
  const lang = useLang();
  const session = useSession();
  const { add, count, setOpen } = useCart();

  const [nameMsg, setNameMsg] = useState<string | null>(null);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  if (!session) {
    return (
      <div className={`${card} mx-auto max-w-[460px] text-center`}>
        <p className="text-lg">{t("profile.notSigned")}</p>
        <Link href="/login" className={`${darkBtn} mt-6 inline-block`}>{t("auth.signIn")} →</Link>
      </div>
    );
  }

  const google = session.provider === "google";
  const since = session.since
    ? new Intl.DateTimeFormat(lang === "uz" ? "uz-Latn" : lang, { day: "numeric", month: "long", year: "numeric" }).format(session.since)
    : null;

  const saveName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err = updateProfile({ name: String(new FormData(e.currentTarget).get("name") ?? "") });
    setNameMsg(err ? t(err) : t("profile.saved"));
  };

  const savePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setBusy(true);
    const err: AuthError | null = await changePassword(String(f.get("current")), String(f.get("next")), String(f.get("confirm")));
    setBusy(false);
    setPwMsg(err ? { ok: false, text: t(err) } : { ok: true, text: t("profile.pwChanged") });
    if (!err) form.reset();
  };

  const favorite = session.favorite ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
      {/* identity card */}
      <aside className="overflow-hidden rounded-[32px] bg-[#9b7462] text-cream shadow-[0_30px_60px_-30px_rgba(74,42,26,.6)] lg:sticky lg:top-28">
        <div className="relative h-36">
          <Image src={img(FLAVORS[1].img, 700)} alt="" fill sizes="360px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#9b7462]" />
        </div>
        <div className="relative z-10 -mt-12 px-7 pb-8 text-center">
          <div className="mx-auto grid size-24 place-items-center rounded-full border-4 border-[#9b7462] bg-[#5a3626] font-display text-5xl shadow-[0_12px_24px_-10px_rgba(0,0,0,.6)]">
            {session.name.slice(0, 1).toUpperCase()}
          </div>
          <h2 className="mt-4 text-2xl font-bold">{session.name}</h2>
          <p className="truncate text-sm text-cream/75">{session.email}</p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-black/15 px-3.5 py-1.5 text-xs font-bold tracking-wide">
            {google ? "G ·" : "✉ ·"} {t(google ? "profile.viaGoogle" : "profile.viaEmail")}
          </span>
          {since && <p className="mt-3 text-xs text-cream/70">{t("profile.since")}: {since}</p>}

          <button
            onClick={() => setOpen(true)}
            className="mt-6 flex w-full items-center justify-between rounded-2xl bg-black/15 px-4 py-3 text-left text-sm transition-colors hover:bg-black/25"
          >
            <span>{t("profile.cartItems", { n: String(count) })}</span>
            <span className="font-bold">{t("profile.openCart")} →</span>
          </button>
          <button
            onClick={() => signOut()}
            className="mt-3 w-full rounded-full border border-cream/40 py-3 text-sm font-bold transition-colors hover:bg-cream hover:text-ink"
          >
            {t("acc.signOut")}
          </button>
        </div>
      </aside>

      <div className="grid gap-6">
        {/* personal details */}
        <section className={card}>
          <h3 className="font-display text-2xl uppercase">{t("profile.details")}</h3>
          <form onSubmit={saveName} className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <span className={label}>{t("auth.name")}</span>
              <input key={session.name} name="name" defaultValue={session.name} className={field} onChange={() => setNameMsg(null)} />
            </div>
            <div>
              <span className={label}>{t("auth.email")}</span>
              <input value={session.email} disabled className={field} readOnly />
              <p className="mt-1.5 text-xs text-muted">{t("profile.emailNote")}</p>
            </div>
            <div className="flex items-center gap-4 sm:col-span-2">
              <button type="submit" className={darkBtn}>{t("profile.save")}</button>
              {nameMsg && <span className="text-sm text-caramel">{nameMsg}</span>}
            </div>
          </form>
        </section>

        {/* favourite drink */}
        <section className={card}>
          <h3 className="font-display text-2xl uppercase">{t("profile.favorite")}</h3>
          <p className="mt-2 text-sm text-muted">{t("profile.favoriteText")}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {FLAVORS.map((f, i) => (
              <div
                key={f.name}
                className={`overflow-hidden rounded-3xl border-2 bg-cream transition ${favorite === i ? "border-caramel" : "border-transparent hover:border-ink/15"}`}
              >
                <button onClick={() => updateProfile({ favorite: i })} className="block w-full text-left">
                  <span className="relative block h-36">
                    <Image src={img(f.img, 500)} alt={f.name} fill sizes="(min-width: 640px) 220px, 100vw" className="object-cover" />
                    {favorite === i && <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-caramel text-white">★</span>}
                  </span>
                  <span className="block px-4 pt-3 font-display text-lg uppercase">{f.name}</span>
                </button>
                <div className="flex items-center justify-between px-4 pb-4 pt-1">
                  <span className="font-display">{money(f.price)}</span>
                  <button onClick={() => add(i)} className="rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-cream transition-colors hover:bg-caramel">
                    + {t("search.add")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* password */}
        <section className={card}>
          <h3 className="font-display text-2xl uppercase">{t("profile.password")}</h3>
          {google ? (
            <p className="mt-3 text-muted">{t("profile.googlePw")}</p>
          ) : (
            <form onSubmit={savePassword} className="mt-6 grid gap-5 sm:grid-cols-3">
              <div>
                <span className={label}>{t("profile.current")}</span>
                <input name="current" type="password" autoComplete="current-password" required className={field} />
              </div>
              <div>
                <span className={label}>{t("profile.new")}</span>
                <input name="next" type="password" autoComplete="new-password" required className={field} />
              </div>
              <div>
                <span className={label}>{t("auth.confirm")}</span>
                <input name="confirm" type="password" autoComplete="new-password" required className={field} />
              </div>
              <div className="flex items-center gap-4 sm:col-span-3">
                <button type="submit" disabled={busy} className={darkBtn}>{t("profile.save")}</button>
                {pwMsg && <span className={`text-sm ${pwMsg.ok ? "text-caramel" : "text-red-800"}`}>{pwMsg.text}</span>}
              </div>
            </form>
          )}
        </section>

        {/* preferences */}
        <section className={card}>
          <h3 className="font-display text-2xl uppercase">{t("profile.prefs")}</h3>
          <span className={`${label} mt-6`}>{t("nav.language")}</span>
          <div className="flex flex-wrap gap-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`rounded-full border px-5 py-2.5 text-sm font-bold transition-colors ${lang === l.code ? "border-ink bg-ink text-cream" : "border-ink/20 hover:border-ink"}`}
              >
                {l.name}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
