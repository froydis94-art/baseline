import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "sage" | "cyan" | "coral" | "ghost" | "line";
  size?: "sm" | "md";
};

export function Button({
  variant = "sage",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40",
        size === "sm" && "h-9 px-3.5 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        variant === "sage" && "bg-sage text-obsidian hover:bg-sage/90",
        variant === "cyan" && "bg-cyan text-obsidian hover:bg-cyan/90",
        variant === "coral" && "bg-coral text-white hover:bg-coral/90",
        variant === "ghost" && "bg-transparent text-slate-200 hover:bg-white/5",
        variant === "line" &&
          "border border-line bg-white/2 text-slate-100 hover:border-slate-500",
        className,
      )}
      {...props}
    />
  );
}
