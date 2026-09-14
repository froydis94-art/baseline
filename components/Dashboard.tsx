"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { CompositionPanel } from "@/components/biometrics/CompositionPanel";
import { MetricsGrid } from "@/components/biometrics/MetricsGrid";
import { RecoveryCard } from "@/components/biometrics/RecoveryCard";
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
  loadSelectedTriggers,
  resetBaselineStorage,
  triggerLabels,
  type OnboardingProfile,
} from "@/lib/onboarding";
import type { BodyDashboard } from "@/lib/terra";
import { todayKey } from "@/lib/utils";

const storageKey = `baseline.habits.${todayKey()}`;

export function Dashboard({ dashboard }: { dashboard: BodyDashboard }) {
  const router = useRouter();
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [triggers, setTriggers] = useState<OnboardingProfile["selectedTriggers"]>(
    [],
  );
  const [habits, setHabits] = useState<HabitState>(DEFAULT_HABIT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);

  useEffect(() => {
    const stored = loadProfile();
    setProfile(stored);
    setTriggers(loadSelectedTriggers());
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<HabitState>;
        setHabits({
          ...DEFAULT_HABIT_STATE,
          ...parsed,
          meters: { ...DEFAULT_HABIT_STATE.meters, ...parsed.meters },
          completed: { ...parsed.completed },
          streakMarkedOn: { ...parsed.streakMarkedOn },
        });
      }
    } catch {
      setHabits(DEFAULT_HABIT_STATE);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(habits));
  }, [habits, hydrated]);

  const loops = useMemo(() => habitsForTriggers(triggers), [triggers]);

  const summary = useMemo(() => {
    const labels = triggerLabels(triggers);
    if (labels.length === 0) {
      return "Standardløkker: protein, væskebalanse og Withings-restitusjon.";
    }
    return `Kalibrert mot ${labels.join(", ").toLowerCase()}.`;
  }, [triggers]);

  function onToggle(id: HabitId) {
    const today = todayKey();
    setHabits((current) => {
      if (id === "urge-surf") {
        const already = current.streakMarkedOn[id] === today;
        const days = current.meters[id] ?? 0;
        return {
          ...current,
          meters: {
            ...current.meters,
            [id]: Math.max(0, already ? days - 1 : days + 1),
          },
          streakMarkedOn: {
            ...current.streakMarkedOn,
            [id]: already ? undefined : today,
          },
        };
      }
      return {
        ...current,
        completed: {
          ...current.completed,
          [id]: !current.completed[id],
        },
      };
    });
  }

  function onAdjust(id: HabitId, delta: number) {
    const definition = loops.find((habit) => habit.id === id);
    setHabits((current) => {
      const next = Math.max(0, (current.meters[id] ?? 0) + delta);
      const capped = definition?.target
        ? Math.min(definition.target * 1.4, Number(next.toFixed(2)))
        : Number(next.toFixed(2));
      return {
        ...current,
        meters: {
          ...current.meters,
          [id]: capped,
        },
      };
    });
  }

  function resetOnboarding() {
    resetBaselineStorage();
    router.push("/onboarding");
  }

  if (!hydrated) {
    return <div className="min-h-screen bg-obsidian" />;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 sm:py-10">
      <AppHeader onSos={() => setSosOpen(true)} profile={profile} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <WindowStatus dashboard={dashboard} profile={profile} />
        <CompositionPanel
          dashboard={dashboard}
          connected={Boolean(profile?.withingsConnected)}
        />
      </div>
      <RecoveryCard
        dashboard={dashboard}
        connected={Boolean(profile?.withingsConnected)}
      />
      <MetricsGrid dashboard={dashboard} />
      <HabitBoard
        state={habits}
        habits={loops}
        summary={summary}
        onToggle={onToggle}
        onAdjust={onAdjust}
      />
      <footer className="space-y-3 pb-4 text-xs leading-5 text-slate-500">
        <p>
          Baseline er et atferds- og biometri-verktøy, ikke medisinsk
          rådgivning. Medikament, dose og nedtrapping avklares med behandler.
        </p>
        <button
          type="button"
          onClick={resetOnboarding}
          className="text-slate-600 underline-offset-4 transition-colors hover:text-slate-400 hover:underline"
        >
          Nullstill profil / Kjør onboarding på nytt
        </button>
      </footer>
      <SosProtocol
        open={sosOpen}
        triggers={triggers}
        onClose={() => setSosOpen(false)}
      />
    </div>
  );
}
