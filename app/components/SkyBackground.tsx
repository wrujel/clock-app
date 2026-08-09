"use client";

import { useMemo } from "react";
import styles from "./SkyBackground.module.css";

type RGB = [number, number, number];

interface SkyStop {
  h: number;
  top: RGB;
  mid: RGB;
  bot: RGB;
  stars: number;
}

// Palette keyframes across a 24h cycle — night → dawn → day → dusk → night.
const STOPS: SkyStop[] = [
  { h: 0, top: [2, 4, 18], mid: [10, 14, 42], bot: [24, 28, 62], stars: 1 },
  { h: 4.5, top: [3, 5, 22], mid: [13, 18, 50], bot: [36, 34, 76], stars: 1 },
  { h: 6.5, top: [38, 40, 96], mid: [157, 94, 152], bot: [240, 172, 126], stars: 0 },
  { h: 9, top: [43, 108, 196], mid: [108, 178, 235], bot: [198, 229, 250], stars: 0 },
  { h: 16.5, top: [36, 110, 210], mid: [102, 176, 240], bot: [212, 236, 252], stars: 0 },
  { h: 18.5, top: [44, 48, 96], mid: [214, 108, 106], bot: [252, 166, 98], stars: 0 },
  { h: 20.5, top: [6, 8, 26], mid: [18, 22, 56], bot: [42, 40, 86], stars: 1 },
  { h: 24, top: [2, 4, 18], mid: [10, 14, 42], bot: [24, 28, 62], stars: 1 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const mixRgb = (c1: RGB, c2: RGB, t: number): RGB => [
  Math.round(lerp(c1[0], c2[0], t)),
  Math.round(lerp(c1[1], c2[1], t)),
  Math.round(lerp(c1[2], c2[2], t)),
];

const css = (c: RGB) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;

function skyAt(h: number) {
  let i = 0;
  while (i < STOPS.length - 2 && h > STOPS[i + 1].h) i++;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const t = Math.min(1, Math.max(0, (h - a.h) / (b.h - a.h)));
  return {
    top: mixRgb(a.top, b.top, t),
    mid: mixRgb(a.mid, b.mid, t),
    bot: mixRgb(a.bot, b.bot, t),
    stars: lerp(a.stars, b.stars, t),
  };
}

function orbAt(h: number): { kind: "sun" | "moon"; x: number; y: number } {
  // Arc biased to the center-right band so the orb never collides with the
  // quote (top-left) or the clock (bottom-left).
  const arc = (p: number) => ({
    x: 30 + p * 50,
    y: 76 - Math.sin(p * Math.PI) * 60,
  });
  if (h >= 6 && h < 18) return { kind: "sun", ...arc((h - 6) / 12) };
  const hh = h < 6 ? h + 24 : h;
  return { kind: "moon", ...arc((hh - 18) / 12) };
}

// Deterministic pseudo-random so server and client render identical stars.
const seeded = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

interface Props {
  now: Date;
}

export default function SkyBackground({ now }: Props) {
  const h = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const sky = skyAt(h);
  const orb = orbAt(h);

  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        left: seeded(i, 1) * 100,
        top: seeded(i, 2) * 62,
        size: 1 + seeded(i, 3) * 1.8,
        dur: 2.4 + seeded(i, 4) * 3.6,
        delay: -seeded(i, 5) * 6,
      })),
    []
  );

  return (
    <div className={styles.sky} aria-hidden>
      <div
        className={styles.gradient}
        style={{
          background: `linear-gradient(180deg, ${css(sky.top)} 0%, ${css(
            sky.mid
          )} 52%, ${css(sky.bot)} 100%)`,
        }}
      />
      <div className={styles.stars} style={{ opacity: sky.stars }}>
        {stars.map((s, i) => (
          <span
            key={i}
            className={styles.star}
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>
      <div
        className={`${styles.orb} ${
          orb.kind === "sun" ? styles.sun : styles.moon
        }`}
        style={{ left: `${orb.x}%`, top: `${orb.y}%` }}
      />
      <div
        className={styles.haze}
        style={{
          background: `linear-gradient(180deg, transparent, ${css(sky.bot)})`,
        }}
      />
      <div className={styles.vignette} />
    </div>
  );
}
