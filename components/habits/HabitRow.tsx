"use client";

import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import type { HabitDefinition, HabitState } from "@/lib/habits";
import { habitDone } from "@/lib/habits";
import { cn, todayKey } from "@/lib/utils";

type HabitRowProps = {
  habit: HabitDefinition;
  state: HabitState;
  onToggle: (id: HabitDefinition["id"]) => void;
  onAdjust: (id: HabitDefinition["id"], delta: number) => void;
};

function stepLabel(habit: HabitDefinition, sign: "+" | "−"): string {
  if (habit.unit === "g") return `${sign}${habit.step ?? 15}g`;
  if (habit.unit === "L") return `${sign}${habit.step ?? 0.3}L`;
  return sign;
}

export function HabitRow({ habit, state, onToggle, onAdjust }: HabitRowProps) {
  const today = todayKey();
  const done = habitDone(habit, state, today);
  const meter = state.meters[habit.id] ?? 0;

  return (
    <li
      className={cn(
        "rounded-xl border border-line bg-white/2 px-4 py-4 transition-colors",
        done && "border-sage/25 bg-sage/6",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white">{habit.title}</p>
            {done ? (
              <span className="text-[11px] uppercase tracking-[0.16em] text-sage">
                Sikret
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-400">{habit.intent}</p>
        </div>

        {habit.kind === "streak" ? (
          <Button
            size="sm"
            variant={done ? "sage" : "line"}
            aria-pressed={done}
            onClick={() => onToggle(habit.id)}
          >
            {done ? "I dag telt" : "Marker i dag"}
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="line"
              aria-label={`Reduser ${habit.title}`}
              onClick={() => onAdjust(habit.id, -(habit.step ?? 1))}
            >
              {stepLabel(habit, "−")}
            </Button>
            <Button
              size="sm"
              variant="line"
              aria-label={`Øk ${habit.title}`}
              onClick={() => onAdjust(habit.id, habit.step ?? 1)}
            >
              {stepLabel(habit, "+")}
            </Button>
          </div>
        )}
      </div>

      {habit.kind === "meter" && habit.target ? (
        <div className="mt-3">
          <div className="mb-2 flex items-baseline justify-between text-xs text-slate-400">
            <span className="tabular-nums text-slate-200">
              {habit.unit === "L" ? meter.toFixed(1) : meter}
              {habit.unit} / {habit.target}
              {habit.unit}
            </span>
            <span>{Math.min(100, Math.round((meter / habit.target) * 100))}%</span>
          </div>
          <Progress value={meter} max={habit.target} tone="sage" />
        </div>
      ) : null}

      {habit.kind === "streak" ? (
        <p className="mt-3 text-2xl font-semibold tabular-nums text-sage">
          {meter}
          <span className="ml-2 text-sm font-normal text-slate-400">
            dager uten impuls-handling
          </span>
        </p>
      ) : null}
    </li>
  );
}
