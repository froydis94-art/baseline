import type { TriggerId } from "@/lib/onboarding";

export type HabitId =
  | "protein"
  | "strength"
  | "sleep"
  | "hydration"
  | "evening-loop"
  | "alcohol-free"
  | "nicotine-pause"
  | "impulse-pause"
  | "vagus-breath";

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

export const CORE_HABITS: HabitDefinition[] = [
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
];

export const TRIGGER_HABITS: Record<TriggerId, HabitDefinition[]> = {
  "food-noise": [
    {
      id: "evening-loop",
      title: "Kveldsvandring",
      intent: "Erstatt snack-loopen før den kommer tilbake.",
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
  ],
  alcohol: [
    {
      id: "alcohol-free",
      title: "Alkoholfri kveld",
      intent: "Bytt kveldsglasset med en synlig erstatning.",
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
  ],
  nicotine: [
    {
      id: "nicotine-pause",
      title: "2-minutt nikotinpause",
      intent: "Sug er et signal. Vent, pust, bytt.",
      kind: "toggle",
    },
  ],
  impulse: [
    {
      id: "impulse-pause",
      title: "2-minutt før kjøp/skjerm",
      intent: "Kretsbryter mellom impuls og handling.",
      kind: "toggle",
    },
  ],
  emotional: [
    {
      id: "vagus-breath",
      title: "Vagus-pust ved uro",
      intent: "4 sekunder inn, 6 sekunder ut før skapet.",
      kind: "toggle",
    },
  ],
};

export const HABITS: HabitDefinition[] = [
  ...CORE_HABITS,
  ...TRIGGER_HABITS["food-noise"],
];

export const DEFAULT_HABIT_STATE: HabitState = {
  completed: {},
  meters: {
    protein: 0,
    hydration: 0,
  },
};

export function habitsForTriggers(triggers: TriggerId[]): HabitDefinition[] {
  const seen = new Set<HabitId>();
  const next: HabitDefinition[] = [];

  for (const habit of CORE_HABITS) {
    seen.add(habit.id);
    next.push(habit);
  }

  for (const trigger of triggers) {
    for (const habit of TRIGGER_HABITS[trigger]) {
      if (seen.has(habit.id)) continue;
      seen.add(habit.id);
      next.push(habit);
    }
  }

  return next;
}

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

export function completedCount(
  state: HabitState,
  habits: HabitDefinition[] = HABITS,
): number {
  return habits.filter((habit) => habitDone(habit, state)).length;
}
