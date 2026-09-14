"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { CompositionPanel } from "@/components/biometrics/CompositionPanel";
import { MetricsGrid } from "@/components/biometrics/MetricsGrid";
import { HabitBoard } from "@/components/habits/HabitBoard";
import { SosProtocol } from "@/components/sos/SosProtocol";
import { WindowStatus } from "@/components/WindowStatus";
import {
  DEFAULT_HABIT_STATE,
  habitsForTriggers,
  type HabitId,
  type HabitState,
} from "@/lib/habits";
import {
  loadProfile,
  triggerLabels,
  type OnboardingProfile,
} from "@/lib/onboarding";
import type { BodyDashboard } from "@/lib/terra";
import { todayKey } from "@/lib/utils";

const storageKey = `baseline.habits.${todayKey()}`;

export function Dashboard({ dashboard }: { dashboard: BodyDashboard }) {
  const router = useRouter();
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [habits, setHabits] = useState<HabitState>(DEFAULT_HABIT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);

  useEffect(() => {
    const stored = loadProfile();
    if (!stored?.completed) {
      router.replace("/onboarding");
      return;
    }
    setProfile(stored);
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setHabits(JSON.parse(raw) as HabitState);
    } catch {
      setHabits(DEFAULT_HABIT_STATE);
    }
    setHydrated(true);
  }, [router]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(habits));
  }, [habits, hydrated]);

  const loops = useMemo(
    () => habitsForTriggers(profile?.selectedTriggers ?? []),
    [profile],
  );

  const summary = useMemo(() => {
    const labels = triggerLabels(profile?.selectedTriggers ?? []);
    if (labels.length === 0) {
      return "Vinduet er stille. Disse løkkene er det som skal stå igjen når dosen trappes ned.";
    }
    return `Kalibrert mot ${labels.join(", ").toLowerCase()}.`;
  }, [profile]);

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
    const definition = loops.find((habit) => habit.id === id);
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

  if (!hydrated || !profile) {
    return <div className="min-h-screen bg-obsidian" />;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 sm:py-10">
      <AppHeader onSos={() => setSosOpen(true)} profile={profile} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <WindowStatus dashboard={dashboard} profile={profile} />
        <CompositionPanel
          dashboard={dashboard}
          connected={profile.withingsConnected}
        />
      </div>
      <MetricsGrid dashboard={dashboard} />
      <HabitBoard
        state={habits}
        habits={loops}
        summary={summary}
        onToggle={onToggle}
        onAdjust={onAdjust}
      />
      <footer className="pb-4 text-xs leading-5 text-slate-500">
        Baseline er et atferds- og biometri-verktøy, ikke medisinsk rådgivning.
        Medikament, dose og nedtrapping avklares med behandler.
      </footer>
      <SosProtocol open={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  );
}
