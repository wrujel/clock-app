"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CursorGlow from "./components/CursorGlow";
import FlipClock from "./components/FlipClock";
import IconArrowDown from "./components/IconArrowDown";
import IconMoon from "./components/IconMoon";
import IconSun from "./components/IconSun";
import Loader from "./components/Loader";
import MagneticButton from "./components/MagneticButton";
import Quote from "./components/Quote";
import SkyBackground from "./components/SkyBackground";
import StatsPanel from "./components/StatsPanel";
import { useMounted } from "./hooks/useMounted";
import { useNow } from "./hooks/useNow";
import styles from "./page.module.css";

const serverUrl = "/api";
const apiUrl = "https://api.ipify.org/?format=json";

async function getIp(): Promise<string | undefined> {
  const res = await fetch(apiUrl);
  const data = await res.json();
  if (!data) return undefined;
  return data.ip;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.35 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Home() {
  const [text, setText] = useState<string>();
  const [autor, setAutor] = useState<string>();
  const [zone, setZone] = useState("");
  const [timezone, setTimezone] = useState<string>();
  const [dayofWeek, setDayofWeek] = useState<string>();
  const [dayofYear, setDayofYear] = useState<string>();
  const [week, setWeek] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(false);
  const [city, setCity] = useState<string>();
  const [country, setCountry] = useState<string>();
  const mounted = useMounted();
  const now = useNow();

  const getServerData = useCallback(async () => {
    const ip = await getIp();
    if (!ip) {
      toast.error("Disable adblocker to load client");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${serverUrl}/data`, {
        method: "POST",
        body: JSON.stringify({ ip: ip }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.status !== 200) {
        toast.error("Error fetching data");
        return;
      }

      const zone = new Date().getTimezoneOffset() / 60;
      setZone(zone > 0 ? "-" + zone.toString() : "+" + zone.toString());
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(timeZone.toString());
      const today = new Date();
      const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
          1000 /
          60 /
          60 /
          24,
      );
      const weekNumber = Math.floor(dayOfYear / 7);
      setDayofWeek(today.toLocaleDateString("en-US", { weekday: "long" }));
      setDayofYear(dayOfYear.toString());
      setWeek(weekNumber.toString());
      setCity(data.city_name);
      setCountry(data.country_name);
      setText(data.content);
      setAutor(data.author);
    } catch {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch-on-mount. Every setState in getServerData runs after an await, so
    // none of them are synchronous with this effect; the rule can't see across
    // the async boundary and flags the call itself.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    toast.promise(getServerData(), {
      loading: "Tuning the sky…",
      success: "Sky synced",
      error: "Error loading client",
    });
  }, [getServerData]);

  const getQuote = useCallback(async () => {
    const res = await fetch(`${serverUrl}/quote`);
    const data = await res.json();
    if (!data) return;
    setText(data.content);
    setAutor(data.author);
  }, []);

  const handleRefresh = () => {
    toast.promise(getQuote(), {
      loading: "Loading…",
      success: "Quote loaded",
      error: "Error connecting to server",
    });
  };

  const hour = now.getHours();
  const greet =
    hour < 5
      ? "GOOD EVENING"
      : hour < 12
        ? "GOOD MORNING"
        : hour < 18
          ? "GOOD AFTERNOON"
          : "GOOD EVENING";
  const isNight = hour < 5 || hour >= 18;
  const statsReady = Boolean(timezone && dayofWeek && dayofYear && week);

  return (
    <div className={styles.shell}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(8, 11, 26, 0.72)",
            color: "#f5f7ff",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            backdropFilter: "blur(12px)",
            fontFamily: "var(--font-body), sans-serif",
            fontSize: "0.85rem",
          },
        }}
      />

      {mounted && <SkyBackground now={now} />}
      {mounted && <CursorGlow />}

      <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>

      {!loading && (
        <motion.main
          className={styles.main}
          data-info={info}
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div className={styles.topRow} variants={rise}>
            <Quote text={text} author={autor} onRefresh={handleRefresh} />
          </motion.div>

          <motion.div className={styles.bottomRow} variants={rise}>
            <div className={styles.info}>
              <h4 className={styles.greet}>
                <motion.span
                  className={styles.greetIcon}
                  initial={{ scale: 0, rotate: -120 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.55,
                    type: "spring",
                    stiffness: 220,
                    damping: 15,
                  }}
                >
                  {isNight ? <IconMoon /> : <IconSun />}
                </motion.span>
                <span className={styles.greetMask} aria-label={greet}>
                  {greet.split("").map((c, i) => (
                    <motion.span
                      key={i}
                      className={styles.greetLetter}
                      initial={{ y: "135%" }}
                      animate={{ y: 0 }}
                      transition={{
                        delay: 0.6 + i * 0.028,
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      aria-hidden
                    >
                      {c === " " ? "\u00A0" : c}
                    </motion.span>
                  ))}
                </span>
              </h4>

              <FlipClock now={now} zone={zone} />

              {city && country && (
                <motion.h3
                  className={styles.location}
                  initial={{ opacity: 0, letterSpacing: "0.7em" }}
                  animate={{ opacity: 1, letterSpacing: "0.3em" }}
                  transition={{
                    delay: 0.85,
                    duration: 1.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  IN {city}, {country}
                </motion.h3>
              )}
            </div>
          </motion.div>
        </motion.main>
      )}

      {/* Floating toggle — lives outside the shifted main so it stays
          reachable when the stats panel is open. */}
      {!loading && statsReady && (
        <motion.div
          className={styles.toggleSlot}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <MagneticButton>
            <motion.button
              type="button"
              className={styles.toggle}
              onClick={() => setInfo((v) => !v)}
              aria-expanded={info}
              whileTap={{ scale: 0.94 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={info ? "less" : "more"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  {info ? "LESS" : "MORE"}
                </motion.span>
              </AnimatePresence>
              <motion.span
                className={styles.toggleIcon}
                animate={{ rotate: info ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <IconArrowDown />
              </motion.span>
            </motion.button>
          </MagneticButton>
        </motion.div>
      )}

      {timezone && dayofWeek && dayofYear && week && (
        <StatsPanel
          open={info}
          isNight={isNight}
          stats={[
            { label: "Current timezone", value: timezone, numeric: false },
            { label: "Day of the year", value: dayofYear, numeric: true },
            { label: "Day of the week", value: dayofWeek, numeric: false },
            { label: "Week number", value: week, numeric: true },
          ]}
        />
      )}

      <div className={styles.grain} aria-hidden />
    </div>
  );
}
