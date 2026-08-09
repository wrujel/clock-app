"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect } from "react";
import styles from "./CursorGlow.module.css";

/** Soft light halo that lazily trails the cursor. */
export default function CursorGlow() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 40, damping: 18, mass: 0.6 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  useEffect(() => {
    if (reduce) return;
    x.set(window.innerWidth / 2);
    y.set(window.innerHeight / 2);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [reduce, x, y]);

  if (reduce) return null;

  return <motion.div className={styles.glow} style={{ x: sx, y: sy }} aria-hidden />;
}
