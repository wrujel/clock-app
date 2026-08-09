"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import styles from "./FlipClock.module.css";

const pad = (n: number) => n.toString().padStart(2, "0");

function FlipDigit({ char, small = false }: { char: string; small?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <span className={`${styles.window} ${small ? styles.sm : ""}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          className={styles.digit}
          initial={reduce ? { opacity: 0 } : { y: "105%", opacity: 0.4 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: "-105%", opacity: 0.4 }}
          transition={{ type: "spring", stiffness: 480, damping: 42, mass: 0.85 }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

interface Props {
  now: Date;
  zone: string;
}

export default function FlipClock({ now, zone }: Props) {
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());

  return (
    <div className={styles.clock} aria-label={`${hh}:${mm}:${ss}`}>
      <div className={styles.mainRow} aria-hidden>
        <FlipDigit char={hh[0]} />
        <FlipDigit char={hh[1]} />
        <span className={styles.colon}>:</span>
        <FlipDigit char={mm[0]} />
        <FlipDigit char={mm[1]} />
      </div>
      <div className={styles.side} aria-hidden>
        <div className={styles.seconds}>
          <FlipDigit char={ss[0]} small />
          <FlipDigit char={ss[1]} small />
        </div>
        {zone && <div className={styles.utc}>UTC{zone}</div>}
      </div>
    </div>
  );
}
