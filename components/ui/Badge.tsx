import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  tone?: "sage" | "cyan" | "coral" | "line";
};

export function Badge({ children, tone = "line" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em]",
        tone === "line" && "border-line bg-white/4 text-slate-300",
        tone === "sage" && "border-sage/30 bg-sage/10 text-sage",
        tone === "cyan" && "border-cyan/30 bg-cyan/10 text-cyan",
        tone === "coral" && "border-coral/30 bg-coral/10 text-coral",
      )}
    >
      {children}
    </span>
  );
}
