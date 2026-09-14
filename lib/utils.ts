export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatKg(value: number, digits = 1): string {
  return `${value.toFixed(digits)} kg`;
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function signedDelta(value: number, digits = 1, unit = "kg"): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)} ${unit}`;
}

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
