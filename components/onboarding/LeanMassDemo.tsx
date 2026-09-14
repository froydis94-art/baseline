"use client";

import { motion } from "framer-motion";

const WIDTH = 320;
const HEIGHT = 148;
const PAD = 16;

const lean = [0.78, 0.79, 0.8, 0.81, 0.82, 0.83, 0.84];
const fat = [0.72, 0.6, 0.5, 0.42, 0.34, 0.28, 0.22];

function toPath(values: number[]): string {
  return values
    .map((value, index) => {
      const x = PAD + (index / (values.length - 1)) * (WIDTH - PAD * 2);
      const y = HEIGHT - PAD - value * (HEIGHT - PAD * 2);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export function LeanMassDemo() {
  const leanPath = toPath(lean);
  const fatPath = toPath(fat);

  return (
    <div className="rounded-2xl border border-line bg-obsidian/60 p-4">
      <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.16em]">
        <span className="text-sage">Muskelmasse beholdes</span>
        <span className="text-cyan">Fettvev faller</span>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-40 w-full"
        aria-hidden="true"
      >
        <motion.path
          d={leanPath}
          fill="none"
          stroke="#10B981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
        <motion.path
          d={fatPath}
          fill="none"
          stroke="#06B6D4"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.15, ease: "easeInOut" }}
        />
      </svg>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        Skalaen lyver. Lean mass og hvilepuls forteller om forbrenningen holder.
      </p>
    </div>
  );
}
