import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md";
};

const paddingMap = {
  none: "",
  sm: "p-5",
  md: "p-6",
};

export function Card({ children, className, padding = "md" }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-line bg-glass/80 shadow-[0_0_0_1px_rgba(15,23,42,0.4)] backdrop-blur-xl",
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "sage" | "cyan" | "coral";
}) {
  return (
    <p
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.22em]",
        tone === "muted" && "text-slate-400",
        tone === "sage" && "text-sage",
        tone === "cyan" && "text-cyan",
        tone === "coral" && "text-coral",
      )}
    >
      {children}
    </p>
  );
}
