"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import IconRefresh from "./IconRefresh";
import MagneticButton from "./MagneticButton";
import styles from "./Quote.module.css";

interface Props {
  text?: string;
  author?: string;
  onRefresh: () => void;
}

export default function Quote({ text, author, onRefresh }: Props) {
  // Monotonic spin count so the icon never rotates backwards between clicks.
  const [spins, setSpins] = useState(0);

  return (
    <div className={styles.quote}>
      <div className={styles.body}>
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={text ?? "empty"}
            className={styles.text}
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {text && <p className={styles.content}>{text}</p>}
            {author && <footer className={styles.author}>{author}</footer>}
          </motion.blockquote>
        </AnimatePresence>
      </div>
      <MagneticButton>
        <motion.button
          type="button"
          className={styles.refresh}
          onClick={() => {
            setSpins((s) => s + 1);
            onRefresh();
          }}
          aria-label="Load a new quote"
          animate={{ rotate: spins * 360 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          whileTap={{ scale: 0.88 }}
        >
          <IconRefresh />
        </motion.button>
      </MagneticButton>
    </div>
  );
}
