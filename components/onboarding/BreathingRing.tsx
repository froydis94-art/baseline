"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TEST_SECONDS = 10;
const INHALE = 4;
const CYCLE = 10;

export function BreathingRing({
  running,
  onFinished,
}: {
  running: boolean;
  onFinished: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) {
      setElapsed(0);
      return;
    }
    const started = Date.now();
    const id = window.setInterval(() => {
      const next = Math.min(
        TEST_SECONDS,
        Math.floor((Date.now() - started) / 1000),
      );
      setElapsed(next);
      if (next >= TEST_SECONDS) {
        window.clearInterval(id);
        onFinished();
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [running, onFinished]);

  const phase = running && elapsed % CYCLE < INHALE ? "inn" : "ut";

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <div className="relative flex h-44 w-44 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-coral/20" />
        <motion.div
          className="h-28 w-28 rounded-full bg-coral/20 ring-2 ring-coral/50"
          animate={
            running
              ? {
                  scale: phase === "inn" ? 1.18 : 0.78,
                  opacity: phase === "inn" ? 1 : 0.7,
                }
              : { scale: 0.86, opacity: 0.6 }
          }
          transition={
            running
              ? {
                  duration: phase === "inn" ? INHALE : 6,
                  ease: "easeInOut",
                }
              : { duration: 0.4 }
          }
        />
        <p className="absolute text-sm font-medium uppercase tracking-[0.18em] text-white">
          {!running ? "Klar" : phase === "inn" ? "Inn 4s" : "Ut 6s"}
        </p>
      </div>
      <p className="text-sm tabular-nums text-slate-400">
        {running ? `${elapsed} / ${TEST_SECONDS} sek` : "Vagus-pust · 4 / 6"}
      </p>
    </div>
  );
}
