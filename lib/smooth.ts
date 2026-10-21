import Lenis from "lenis";

/** Returns true when it handled the wheel event itself (e.g. the story jumping a scene). */
type WheelInterceptor = (deltaY: number, event: WheelEvent) => boolean;

let lenis: Lenis | null = null;
let interceptor: WheelInterceptor | null = null;

export const getLenis = () => lenis;

export function setWheelInterceptor(fn: WheelInterceptor | null) {
  interceptor = fn;
}

export function createLenis() {
  lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.9,
    anchors: { duration: 1.4 },
    // let the story take over the wheel while it is on screen
    virtualScroll: ({ deltaY, event }) =>
      !(event.type === "wheel" && interceptor?.(deltaY, event as WheelEvent)),
  });
  return lenis;
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
}

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
