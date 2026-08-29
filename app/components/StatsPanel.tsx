"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./StatsPanel.module.css";

interface Stat {
  label: string;
  value: string;
  numeric: boolean;
}

function CountUp({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, reduce]);

  // Reduced motion jumps straight to the final value — no animation, no state.
  return <>{reduce ? value : display}</>;
}

interface Props {
  open: boolean;
  isNight: boolean;
  stats: Stat[];
}

export default function StatsPanel({ open, isNight, stats }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          className={styles.panel}
          data-night={isNight}
          initial={{ y: "103%" }}
          animate={{ y: 0 }}
          exit={{ y: "103%" }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 0.9,
          }}
        >
          <div className={styles.grid}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className={styles.cell}
                initial={{ opacity: 0, y: 26 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.18 + i * 0.09,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                exit={{ opacity: 0, y: 12, transition: { duration: 0.18 } }}
              >
                <span className={styles.label}>{s.label}</span>
                <span className={styles.value}>
                  {s.numeric && s.value !== "" ? (
                    <CountUp value={Number(s.value)} />
                  ) : (
                    s.value
                  )}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
