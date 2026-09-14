"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { CompositionPanel } from "@/components/biometrics/CompositionPanel";
import { MetricsGrid } from "@/components/biometrics/MetricsGrid";
import { HabitBoard } from "@/components/habits/HabitBoard";
import { SosProtocol } from "@/components/sos/SosProtocol";
import { WindowStatus } from "@/components/WindowStatus";
import {
  DEFAULT_HABIT_STATE,
  HABITS,
  type HabitId,
  type HabitState,
} from "@/lib/habits";
import type { BodyDashboard } from "@/lib/terra";
import { todayKey } from "@/lib/utils";

const storageKey = `baseline.habits.${todayKey()}`;

export function Dashboard({ dashboard }: { dashboard: BodyDashboard }) {
  const [habits, setHabits] = useState<HabitState>(DEFAULT_HABIT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setHabits(JSON.parse(raw) as HabitState);
    } catch {
      setHabits(DEFAULT_HABIT_STATE);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(habits));
  }, [habits, hydrated]);

  function onToggle(id: HabitId) {
    setHabits((current) => ({
      ...current,
      completed: {
        ...current.completed,
        [id]: !current.completed[id],
      },
    }));
  }

  function onAdjust(id: HabitId, delta: number) {
    const definition = HABITS.find((habit) => habit.id === id);
    setHabits((current) => {
      const next = Math.max(0, (current.meters[id] ?? 0) + delta);
      const capped = definition?.target
        ? Math.min(definition.target * 1.4, next)
        : next;
      return {
        ...current,
        meters: {
          ...current.meters,
          [id]: Number(capped.toFixed(2)),
        },
      };
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 sm:py-10">
      <AppHeader onSos={() => setSosOpen(true)} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <WindowStatus dashboard={dashboard} />
        <CompositionPanel dashboard={dashboard} />
      </div>
      <MetricsGrid dashboard={dashboard} />
      <HabitBoard state={habits} onToggle={onToggle} onAdjust={onAdjust} />
      <footer className="pb-4 text-xs leading-5 text-slate-500">
        Baseline er et atferds- og biometri-verktøy, ikke medisinsk rådgivning.
        Medikament, dose og nedtrapping avklares med behandler.
      </footer>
      <SosProtocol open={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  );
}
