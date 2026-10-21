"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FLAVORS, PHOTOS, img } from "@/lib/data";
import { signIn, signUp, syncGoogleSession, useSession, validEmail, type AuthError } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { useCart } from "./cart";

type Mode = "signin" | "signup" | "reset";

const MOCHA = "#9b7462";

/** Photo with the wavy edge the form slides up into. */
function WavyPhoto({ src, alt, color, position = "50% 50%", className = "" }: { src: string; alt: string; color: string; position?: string; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Image src={src} alt={alt} fill priority quality={75} sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" style={{ objectPosition: position }} />
      {/* S-shaped edge: rounded corner on the left, a long flat run, then the form sweeps up on the right */}
      <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute -bottom-[2px] left-0 h-[112px] w-full sm:h-[124px]" aria-hidden>
        <path d="M0 122 V100 C0 76 16 62 46 62 H258 C298 62 312 54 322 32 C333 9 352 0 400 0 V122 Z" fill={color} />
      </svg>
    </div>
  );
}

const Icon = {
  mail: <path d="M3 6h18v12H3zM3 6l9 7 9-7" />,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
};

function Field({ icon, ...props }: { icon: keyof typeof Icon } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-3 border-b-2 border-[#4a2c1c] pb-2 transition-colors focus-within:border-cream">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b2416" strokeWidth="2" strokeLinejoin="round" className="shrink-0">{Icon[icon]}</svg>
      <input {...props} className="min-w-0 flex-1 bg-transparent py-1 text-[15px] text-[#2b170c] outline-none placeholder:text-[#3b2416]/75" />
    </label>
  );
}

export default function AuthCard() {
  const t = useT();
  const router = useRouter();
  const { toast } = useCart();
  const session = useSession();
  const [mode, setMode] = useState<Mode>("signin");
  const [error, setError] = useState<AuthError | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [justCreated, setJustCreated] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // coming back from Google: pick up the session, or explain why it failed
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("signed") === "google") syncGoogleSession();
    const err = params.get("error");
    if (err?.startsWith("google")) toast(t(err === "google_cancelled" ? "auth.googleCancelled" : "auth.googleFailed"));
    if (params.size) window.history.replaceState(null, "", "/login");
  }, [t, toast]);

  const switchTo = (m: Mode) => { setMode(m); setError(null); setNotice(null); };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    setError(null);
    setNotice(null);

    if (mode === "reset") {
      if (!validEmail(get("email"))) return setError("auth.err.email");
      setNotice(t("auth.resetSent"));
      return;
    }

    setBusy(true);
    const res = mode === "signin"
      ? await signIn(get("email"), get("password"))
      : await signUp(get("name"), get("email"), get("password"), get("confirm"));
    setBusy(false);
    if (typeof res === "string") return setError(res);
    setJustCreated(mode === "signup");
  }

  const social = (p: string) => toast(t("auth.social", { p }));

  if (session) {
    return (
      <div className="w-full max-w-[420px] overflow-hidden rounded-[40px] text-center text-cream shadow-[0_40px_80px_-30px_rgba(74,42,26,.6)]" style={{ background: MOCHA }}>
        <WavyPhoto src={img(PHOTOS.visit, 900)} alt="" color={MOCHA} position="50% 62%" className="h-[300px] sm:h-[340px]" />
        <div className="px-8 pb-10">
          <div className="relative z-10 mx-auto -mt-12 grid size-20 place-items-center rounded-full border-4 border-[#9b7462] bg-[#5a3626] font-display text-4xl shadow-[0_12px_24px_-10px_rgba(0,0,0,.6)]">
            {session.name.slice(0, 1).toUpperCase()}
          </div>
          <h2 className="mt-5 text-2xl font-bold">{t("auth.successTitle", { name: session.name })}</h2>
          <p className="mt-2 text-cream/80">{t(justCreated ? "auth.successCreated" : "auth.successSignedIn")}</p>
          <p className="text-sm text-cream/60">{session.email}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-9 w-full max-w-[260px] rounded-full bg-[#5a3626] py-4 text-lg font-bold shadow-[inset_0_-5px_0_rgba(0,0,0,.25),0_12px_22px_-8px_rgba(40,18,8,.8)] transition hover:-translate-y-0.5 hover:bg-[#4b2c1e]"
          >
            {t("auth.enter")}
          </button>
        </div>
      </div>
    );
  }

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => switchTo(m)}
      className={`relative pb-2 text-lg font-bold transition-colors sm:text-xl ${mode === m ? "text-cream" : "text-cream/70 hover:text-cream"}`}
    >
      {label}
      <span className={`absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full bg-[#3b2416] transition-transform duration-300 ${mode === m ? "scale-x-100" : "scale-x-0"}`} />
    </button>
  );

  return (
    <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-end lg:justify-center">
      {/* welcome card (desktop) */}
      <div className="hidden w-[300px] overflow-hidden rounded-[36px] bg-white shadow-[0_40px_80px_-30px_rgba(74,42,26,.5)] lg:block">
        <WavyPhoto src={img(FLAVORS[2].img, 700)} alt={FLAVORS[2].name} color="#ffffff" position="50% 40%" className="h-[330px]" />
        <div className="px-7 pb-9 pt-3 text-center">
          <h2 className="text-lg font-bold text-[#6b4331]">{t("auth.welcome")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#9a6a4f]">{t("auth.welcomeText")}</p>
          <button
            onClick={() => { switchTo("signin"); formRef.current?.querySelector("input")?.focus(); }}
            className="mt-7 rounded-full px-8 py-2.5 text-sm font-bold text-cream shadow-[0_10px_20px_-8px_rgba(74,42,26,.7)]"
            style={{ background: MOCHA }}
          >
            {t("auth.signIn")}
          </button>
        </div>
      </div>

      {/* auth card */}
      <div className="w-full max-w-[420px] overflow-hidden rounded-[40px] shadow-[0_40px_80px_-30px_rgba(74,42,26,.6)]" style={{ background: MOCHA }}>
        <WavyPhoto src={img(PHOTOS.visit, 900)} alt="" color={MOCHA} position="50% 62%" className="h-[290px] sm:h-[330px]" />

        <div className="-mt-3 px-7 pb-9 sm:px-9">
          {mode === "reset" ? (
            <div className="pt-2">
              <h2 className="text-xl font-bold text-cream">{t("auth.resetTitle")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-cream/80">{t("auth.resetText")}</p>
            </div>
          ) : (
            <div className="flex justify-around">
              {tab("signin", t("auth.signIn"))}
              {tab("signup", t("auth.signUp"))}
            </div>
          )}

          <form key={mode} ref={formRef} onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-6">
            {mode === "signup" && <Field icon="user" name="name" placeholder={`${t("auth.name")}:`} autoComplete="name" />}
            <Field icon="mail" name="email" type="email" placeholder={`${t("auth.email")}:`} autoComplete="email" />
            {mode !== "reset" && (
              <Field icon="lock" name="password" type="password" placeholder={`${t("auth.password")}:`}
                autoComplete={mode === "signin" ? "current-password" : "new-password"} />
            )}
            {mode === "signup" && <Field icon="lock" name="confirm" type="password" placeholder={`${t("auth.confirm")}:`} autoComplete="new-password" />}

            <div aria-live="polite" className="-my-2 min-h-5 text-center text-sm">
              {error && <span className="font-semibold text-[#3a0f05]">{t(error)}</span>}
              {notice && <span className="text-cream">{notice}</span>}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mx-auto w-[200px] rounded-full bg-[#5a3626] py-3.5 text-lg font-bold text-cream shadow-[inset_0_-5px_0_rgba(0,0,0,.25),0_12px_22px_-8px_rgba(40,18,8,.8)] transition hover:-translate-y-0.5 hover:bg-[#4b2c1e] disabled:opacity-60"
            >
              {mode === "signin" ? t("auth.signIn") : mode === "signup" ? t("auth.signUp") : t("auth.sendLink")}
            </button>
          </form>

          {mode === "signin" && (
            <button onClick={() => switchTo("reset")} className="mx-auto mt-4 block text-cream/90 hover:text-cream hover:underline">
              {t("auth.forgot")}
            </button>
          )}
          {mode === "reset" && (
            <button onClick={() => switchTo("signin")} className="mx-auto mt-4 block text-cream/90 hover:text-cream hover:underline">
              {t("auth.back")}
            </button>
          )}

          {mode !== "reset" && (
            <>
              <div className="mt-5 flex items-center gap-3 text-cream/90">
                <span className="h-[2px] flex-1 rounded bg-[#4a2c1c]" />
                {t("auth.or")}
                <span className="h-[2px] flex-1 rounded bg-[#4a2c1c]" />
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <button onClick={() => social("Facebook")} aria-label="Facebook" className="grid size-11 place-items-center rounded-full bg-[#4a2c1c] text-[#9b7462] transition hover:scale-105">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8.1v3h2.5V21h2.9Z" /></svg>
                </button>
                <a href="/api/auth/google" aria-label="Google" className="grid size-11 place-items-center rounded-full bg-[#4a2c1c] text-[#9b7462] transition hover:scale-105">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M20 12.2h-8M20 12.2A8 8 0 1 1 17.5 6.4" /></svg>
                </a>
              </div>
            </>
          )}

          <p className="mt-6 text-center text-xs text-cream/70">{t("auth.demoNote")}</p>
        </div>
      </div>
    </div>
  );
}
