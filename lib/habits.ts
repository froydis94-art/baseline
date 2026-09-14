export type HabitId =
  | "protein"
  | "strength"
  | "sleep"
  | "hydration"
  | "evening-loop";

export type HabitKind = "toggle" | "meter";

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
};

export const HABITS: HabitDefinition[] = [
  {
    id: "protein",
    title: "Protein",
    intent: "Hold lean mass mens appetitten er stille.",
    kind: "meter",
    unit: "g",
    target: 140,
    step: 10,
  },
  {
    id: "strength",
    title: "Styrkeøkt",
    intent: "Tre signaler til muskel denne uken.",
    kind: "toggle",
  },
  {
    id: "sleep",
    title: "Søvn 7+",
    intent: "Restitusjon er en del av den nye normalen.",
    kind: "toggle",
  },
  {
    id: "hydration",
    title: "Hydrering",
    intent: "Tørst og hunger skilles lettere i vinduet.",
    kind: "meter",
    unit: "L",
    target: 2.5,
    step: 0.25,
  },
  {
    id: "evening-loop",
    title: "Kveldsvandring",
    intent: "Erstatt snack-loopen før den kommer tilbake.",
    kind: "toggle",
  },
];

export const DEFAULT_HABIT_STATE: HabitState = {
  completed: {
    sleep: true,
  },
  meters: {
    protein: 90,
    hydration: 1.5,
  },
};

export function habitDone(
  habit: HabitDefinition,
  state: HabitState,
): boolean {
  if (habit.kind === "meter") {
    const value = state.meters[habit.id] ?? 0;
    return value >= (habit.target ?? 0);
  }
  return Boolean(state.completed[habit.id]);
}

export function completedCount(state: HabitState): number {
  return HABITS.filter((habit) => habitDone(habit, state)).length;
}
