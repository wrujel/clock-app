"use client";

import { motion } from "framer-motion";
import styles from "./Loader.module.css";

const WORD = "CIRCADIA".split("");

export default function Loader() {
  return (
    <motion.div
      className={styles.loader}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.word} aria-label="Circadia">
        {WORD.map((letter, i) => (
          <motion.span
            key={i}
            className={styles.letter}
            initial={{ y: "115%" }}
            animate={{ y: 0 }}
            transition={{
              delay: 0.06 + i * 0.055,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-hidden
          >
            {letter}
          </motion.span>
        ))}
      </div>
      <div className={styles.bar}>
        <motion.div
          className={styles.barFill}
          animate={{ x: ["-110%", "270%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
