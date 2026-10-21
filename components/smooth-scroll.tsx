"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createLenis, destroyLenis, getLenis } from "@/lib/smooth";

gsap.registerPlugin(ScrollTrigger);

/** Smooth (inertia) page scrolling, kept in sync with GSAP ScrollTrigger. */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = createLenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      destroyLenis();
    };
  }, []);

  // every new page starts at the top, with scroll triggers measured for its layout
  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
