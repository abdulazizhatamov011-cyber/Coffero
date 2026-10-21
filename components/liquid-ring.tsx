"use client";

import { useId } from "react";

// one ellipse, drawn as two arcs so stroke dashes can flow around it
const RING = "M15 60 A185 40 0 1 0 385 60 A185 40 0 1 0 15 60";
const RING_HIGHLIGHT = "M18 55 A182 37 0 1 0 382 55 A182 37 0 1 0 18 55";
const RING_UNDER = "M15 64 A185 41 0 1 0 385 64 A185 41 0 1 0 15 64";

/**
 * A ring of poured coffee orbiting the glass. Render it twice: `half="back"` behind the
 * glass (top half of the ellipse) and `half="front"` above it (bottom half).
 */
export default function LiquidRing({ half, className = "" }: { half: "back" | "front"; className?: string }) {
  const id = useId().replace(/:/g, "");
  const front = half === "front";

  return (
    <svg viewBox="0 0 400 120" className={className} aria-hidden overflow="visible">
      <defs>
        {/* light comes from the front-left: dark edges, warm caramel in the middle */}
        <linearGradient id={`${id}-body`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#4e2610" />
          <stop offset=".2" stopColor="#8f4f24" />
          <stop offset=".42" stopColor="#c98544" />
          <stop offset=".55" stopColor="#b26c33" />
          <stop offset=".8" stopColor="#7a401b" />
          <stop offset="1" stopColor="#3a1c0b" />
        </linearGradient>
        <radialGradient id={`${id}-drop`} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#d99558" />
          <stop offset=".5" stopColor="#8a4a20" />
          <stop offset="1" stopColor="#2e1508" />
        </radialGradient>
        {/* slow, gentle undulation so the edge reads as poured liquid, not a hard hoop */}
        <filter id={`${id}-liquid`} x="-10%" y="-40%" width="120%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.02" numOctaves="1" seed="7" result="noise">
            <animate attributeName="baseFrequency" dur="10s" values="0.006 0.02;0.009 0.028;0.006 0.02" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={`${id}-soft`} x="-10%" y="-40%" width="120%" height="180%">
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
        <clipPath id={`${id}-half`} clipPathUnits="userSpaceOnUse">
          {front ? <rect x="-20" y="60" width="440" height="80" /> : <rect x="-20" y="-20" width="440" height="80" />}
        </clipPath>
      </defs>

      <g transform="rotate(-8 200 60)">
        <g clipPath={`url(#${id}-half)`}>
          <g filter={`url(#${id}-liquid)`}>
            {/* tube: dark rim, warm body, a darker underside so it looks round */}
            <path d={RING} fill="none" stroke="#2a130a" strokeOpacity=".8" strokeWidth="23" />
            <path d={RING} fill="none" stroke={`url(#${id}-body)`} strokeWidth="18" />
            <path d={RING_UNDER} fill="none" stroke="#3a1a0a" strokeOpacity=".45" strokeWidth="5" />
            {/* cream swirling through the coffee (soft-edged, flowing) */}
            <g filter={`url(#${id}-soft)`}>
              <path d={RING} fill="none" stroke="#f1dcbd" strokeOpacity=".7" strokeWidth="5" strokeLinecap="round" strokeDasharray="70 60 24 110">
                <animate attributeName="stroke-dashoffset" from="0" to="-528" dur="7s" repeatCount="indefinite" />
              </path>
              <path d={RING} fill="none" stroke="#e2b98a" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" strokeDasharray="30 120 50 80">
                <animate attributeName="stroke-dashoffset" from="0" to="-560" dur="5s" repeatCount="indefinite" />
              </path>
            </g>
          </g>
          {/* wet gloss: a faint continuous sheen plus bright glints sliding along */}
          <path d={RING_HIGHLIGHT} fill="none" stroke="#fff6ea" strokeOpacity=".28" strokeWidth="2" />
          <path d={RING_HIGHLIGHT} fill="none" stroke="#fffaf2" strokeOpacity=".95" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="38 170 10 140">
            <animate attributeName="stroke-dashoffset" from="0" to="-716" dur="8s" repeatCount="indefinite" />
          </path>
        </g>

        {front && (
          <>
            {/* droplets thrown off the ring */}
            {[
              [70, 112, 3.4],
              [338, 104, 2.6],
              [120, 128, 2],
              [295, 126, 1.8],
            ].map(([cx, cy, r]) => (
              <g key={`${cx}`}>
                <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.15} fill={`url(#${id}-drop)`} />
                <circle cx={cx - r * 0.35} cy={cy - r * 0.4} r={r * 0.3} fill="#fff3e2" opacity=".8" />
              </g>
            ))}
            {/* a slow drip falling from the bottom of the ring */}
            <g>
              <path d="M232 98 q-4 7 0 10 q4 -3 0 -10 Z" fill={`url(#${id}-drop)`}>
                <animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 46" keyTimes="0;0.55;1" dur="3.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.85;1" dur="3.2s" repeatCount="indefinite" />
              </path>
            </g>
          </>
        )}
      </g>
    </svg>
  );
}
