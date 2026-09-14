export const PROFILE_KEY = "baseline.profile";

export type WindowPhase = "weeks-1-4" | "months-2-4" | "taper-maintain";

export type TriggerId =
  | "food-noise"
  | "alcohol"
  | "nicotine"
  | "impulse"
  | "emotional";

export type OnboardingProfile = {
  completed: boolean;
  windowPhase: WindowPhase | null;
  selectedTriggers: TriggerId[];
  withingsConnected: boolean;
  sosCalibrated: boolean;
  trialStartedAt: string | null;
};

export const EMPTY_PROFILE: OnboardingProfile = {
  completed: false,
  windowPhase: null,
  selectedTriggers: [],
  withingsConnected: false,
  sosCalibrated: false,
  trialStartedAt: null,
};

export const WINDOW_OPTIONS: Array<{
  id: WindowPhase;
  title: string;
  detail: string;
}> = [
  {
    id: "weeks-1-4",
    title: "Akkurat startet (Uke 1–4)",
    detail: "Vinduet åpner seg. Løkkene må plantes før appetitten finner igjen de gamle stiene.",
  },
  {
    id: "months-2-4",
    title: "Godt i gang (Måned 2–4)",
    detail: "Food noise er dempet. Dette er det sterkeste intervallet for å låse lean mass.",
  },
  {
    id: "taper-maintain",
    title: "Planlegger nedtrapping / vedlikehold",
    detail: "Dosen reduseres snart. Rebound-risikoen er høyest uten nye reflekser.",
  },
];

export const TRIGGER_OPTIONS: Array<{
  id: TriggerId;
  emoji: string;
  title: string;
  intent: string;
}> = [
  {
    id: "food-noise",
    emoji: "🍽️",
    title: "Matstøy & kjedespising",
    intent: "Erstatt snack-loopen mens støyen er stille.",
  },
  {
    id: "alcohol",
    emoji: "🍷",
    title: "Alkohol & kveldsdrikking",
    intent: "Bygg en kveld uten automatisk glass.",
  },
  {
    id: "nicotine",
    emoji: "💨",
    title: "Nikotin / Vaping",
    intent: "Sett en kretsbryter mellom sug og handling.",
  },
  {
    id: "impulse",
    emoji: "🛍️",
    title: "Impulshandling / Skjermflukt",
    intent: "To minutter før kjøp eller scroll.",
  },
  {
    id: "emotional",
    emoji: "⚡",
    title: "Emosjonell uro & stress-spising",
    intent: "Vagus-pust og erstatning før skapet.",
  },
];

export const WINDOW_COPY: Record<
  WindowPhase,
  { eyebrow: string; title: string; body: string; badge: string }
> = {
  "weeks-1-4": {
    eyebrow: "Vinduet åpner seg",
    title: "GLP-1 · uke 1–4",
    body: "Appetitten er i ferd med å stilne. Plant løkkene nå, før de gamle impulsene tester deg.",
    badge: "Uke 1–4",
  },
  "months-2-4": {
    eyebrow: "Vinduet er åpent",
    title: "GLP-1 · måned 2–4",
    body: "Food noise er dempet. Bruk ukene til å låse lean mass og nye vaneløkker før nedtrapping.",
    badge: "Måned 2–4",
  },
  "taper-maintain": {
    eyebrow: "Sikre før nedtrapping",
    title: "Vedlikehold · rebound-vindu",
    body: "Dosen reduseres. Løkkene du fester nå er det som skal stå igjen som ny normal.",
    badge: "Nedtrapping",
  },
};

export function loadProfile(): OnboardingProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return { ...EMPTY_PROFILE, ...(JSON.parse(raw) as OnboardingProfile) };
  } catch {
    return null;
  }
}

export function saveProfile(profile: OnboardingProfile): void {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function triggerLabels(ids: TriggerId[]): string[] {
  return ids
    .map((id) => TRIGGER_OPTIONS.find((option) => option.id === id)?.title)
    .filter((title): title is string => Boolean(title));
}
