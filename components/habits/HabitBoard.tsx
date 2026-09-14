"use client";

import { HabitRow } from "@/components/habits/HabitRow";
import { Card, Eyebrow } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import {
  completedCount,
  HABITS,
  type HabitDefinition,
  type HabitId,
  type HabitState,
} from "@/lib/habits";
import { todayKey } from "@/lib/utils";

type HabitBoardProps = {
  state: HabitState;
  habits?: HabitDefinition[];
  summary?: string;
  onToggle: (id: HabitId) => void;
  onAdjust: (id: HabitId, delta: number) => void;
};

export function HabitBoard({
  state,
  habits = HABITS,
  summary,
  onToggle,
  onAdjust,
}: HabitBoardProps) {
  const done = completedCount(state, habits, todayKey());

  return (
    <Card>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <Eyebrow tone="sage">Daglige fundamenter</Eyebrow>
          <h2 className="mt-2 text-lg font-medium tracking-tight text-white">
            Vaneløkker
          </h2>
          <p className="mt-1 max-w-xl text-sm text-slate-400">
            {summary ??
              "Protein, væske og Withings — standardene til løkkene er satt."}
          </p>
        </div>
        <p className="text-sm tabular-nums text-slate-300">
          {done}/{habits.length}
        </p>
      </div>
      <Progress value={done} max={Math.max(habits.length, 1)} className="mb-5" />
      <ul className="space-y-3">
        {habits.map((habit) => (
          <HabitRow
            key={habit.id}
            habit={habit}
            state={state}
            onToggle={onToggle}
            onAdjust={onAdjust}
          />
        ))}
      </ul>
    </Card>
  );
}
