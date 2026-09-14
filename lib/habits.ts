import type { TriggerId } from "@/lib/onboarding";

export type HabitId = "protein" | "hydration" | "urge-surf";

export type HabitKind = "meter" | "streak";

export type HabitDefinition = {
  id: HabitId;
  title: string;
  intent: string;
  kind: HabitKind;
  unit?: string;
  target?: number;
  step?: number;
};

export type HabitState = {
  completed: Partial<Record<HabitId, boolean>>;
  meters: Partial<Record<HabitId, number>>;
  streakMarkedOn: Partial<Record<HabitId, string>>;
};

export const PROTEIN: HabitDefinition = {
  id: "protein",
  title: "Protein",
  intent: "Hold lean mass mens matstøyen er stille.",
  kind: "meter",
  unit: "g",
  target: 140,
  step: 15,
};

export const HYDRATION: HabitDefinition = {
  id: "hydration",
  title: "Væskebalanse",
  intent: "Tørst og hunger skilles lettere i vinduet.",
  kind: "meter",
  unit: "L",
  target: 2.5,
  step: 0.3,
};

export const URGE_SURF: HabitDefinition = {
  id: "urge-surf",
  title: "Urge surfing",
  intent: "Dager uten impuls-handling.",
  kind: "streak",
};

export const HABITS: HabitDefinition[] = [PROTEIN, HYDRATION];

export const DEFAULT_HABIT_STATE: HabitState = {
  completed: {},
  meters: {
    protein: 0,
    hydration: 0,
    "urge-surf": 0,
  },
  streakMarkedOn: {},
};

export function habitsForTriggers(triggers: TriggerId[]): HabitDefinition[] {
  const next: HabitDefinition[] = [PROTEIN, HYDRATION];
  const wantsUrge = triggers.some((id) =>
    id === "alcohol" || id === "nicotine" || id === "impulse",
  );
  if (wantsUrge) next.push(URGE_SURF);
  return next;
}

export function habitDone(
  habit: HabitDefinition,
  state: HabitState,
  today: string,
): boolean {
  if (habit.kind === "meter") {
    const value = state.meters[habit.id] ?? 0;
    return value >= (habit.target ?? 0);
  }
  return state.streakMarkedOn[habit.id] === today;
}

export function completedCount(
  state: HabitState,
  habits: HabitDefinition[],
  today: string,
): number {
  return habits.filter((habit) => habitDone(habit, state, today)).length;
}
