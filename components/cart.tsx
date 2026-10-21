"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FLAVORS, img, money } from "@/lib/data";
import { getLenis } from "@/lib/smooth";
import { useT } from "@/lib/i18n";

type CartState = {
  items: Record<number, number>;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (i: number) => void;
  change: (i: number, d: number) => void;
  toast: (msg: string) => void;
};

const CartContext = createContext<CartState | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Record<number, number>>({});
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toast = useCallback((m: string) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 1800);
  }, []);

  const t = useT();
  const add = useCallback((i: number) => {
    setItems((s) => ({ ...s, [i]: (s[i] ?? 0) + 1 }));
    toast(`${FLAVORS[i].name} — ${t("cart.added")}`);
  }, [toast, t]);

  const change = useCallback((i: number, d: number) => {
    setItems((s) => ({ ...s, [i]: Math.max(0, (s[i] ?? 0) + d) }));
  }, []);

  const count = Object.values(items).reduce((a, b) => a + b, 0);

  useEffect(() => {
    document.body.dataset.cart = open ? "open" : "";
    // freeze the smooth page scroll behind the drawer
    if (open) getLenis()?.stop();
    else getLenis()?.start();
  }, [open]);

  const value = useMemo(() => ({ items, count, open, setOpen, add, change, toast }), [items, count, open, add, change, toast]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
      <div
        className={`fixed left-1/2 bottom-8 z-[100] -translate-x-1/2 rounded-full bg-ink px-6 py-3 text-sm text-cream transition-transform duration-400 ease-[cubic-bezier(.2,.9,.3,1.3)] ${msg ? "translate-y-0" : "translate-y-[140px]"}`}
        role="status"
      >
        {msg}
      </div>
    </CartContext.Provider>
  );
}

function CartDrawer() {
  const { items, open, setOpen, change, toast, count } = useCart();
  const keys = Object.keys(items).map(Number).filter((k) => items[k] > 0);
  const total = keys.reduce((s, k) => s + items[k] * FLAVORS[k].price, 0);
  const t = useT();

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[80] bg-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        aria-label={t("nav.cart")}
        className={`fixed inset-y-0 right-0 z-[90] flex w-full max-w-[400px] flex-col bg-paper p-7 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-3xl uppercase">{t("cart.title")}</h3>
          <button onClick={() => setOpen(false)} aria-label={t("cart.close")} className="grid size-9 place-items-center rounded-full hover:bg-ink/10">✕</button>
        </header>
        <div className="flex-1 overflow-auto">
          {keys.length === 0 && <p className="mt-10 text-center text-muted">{t("cart.empty")}</p>}
          {keys.map((k) => (
            <div key={k} className="flex items-center gap-3.5 border-b border-ink/10 py-3.5">
              <div className="relative h-16 w-13 overflow-hidden rounded-xl">
                <Image src={img(FLAVORS[k].img, 200)} alt="" fill sizes="52px" className="object-cover" />
              </div>
              <div className="flex-1">
                <b className="block font-display font-normal uppercase">{FLAVORS[k].name}</b>
                <span className="text-xs text-muted">{money(FLAVORS[k].price)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => change(k, -1)} className="size-6.5 rounded-full border border-ink leading-none">−</button>
                {items[k]}
                <button onClick={() => change(k, 1)} className="size-6.5 rounded-full border border-ink leading-none">+</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between py-5 font-display text-2xl">
          <span>{t("cart.total")}</span>
          <span>{money(total)}</span>
        </div>
        <button
          onClick={() => toast(t(count ? "cart.demo" : "cart.addFirst"))}
          className="rounded-full bg-ink py-4 text-sm font-bold tracking-wider text-cream transition hover:bg-coffee"
        >
          {t("cart.checkout")}
        </button>
      </aside>
    </>
  );
}
