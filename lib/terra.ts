export type MetricSource = "withings" | "mock";

export type BodySnapshot = {
  measuredAt: string;
  source: MetricSource;
  provider: "Withings";
  weightKg: number;
  leanMassKg: number;
  fatMassKg: number;
  muscleMassKg: number;
  bodyFatPercent: number;
  bmi: number;
  restingHr: number | null;
};

export type SeriesPoint = {
  date: string;
  weightKg: number;
  leanMassKg: number;
  fatMassKg: number;
};

export type BodyDashboard = {
  latest: BodySnapshot;
  series: SeriesPoint[];
  deltas: {
    weight14d: number;
    lean14d: number;
    fat14d: number;
  };
};

type TerraBodyPayload = {
  data?: Array<{
    metadata?: { start_time?: string; end_time?: string };
    body?: {
      weight_kg?: number;
      bmi?: number;
      bodyfat_percentage?: number;
      muscle_mass_g?: number;
      bone_mass_g?: number;
    };
    heart_data?: {
      resting_hr_bpm?: number;
    };
  }>;
};

const TERRA_BASE = "https://api.tryterra.co/v2";

function isTerraConfigured(): boolean {
  return Boolean(
    process.env.TERRA_API_KEY &&
      process.env.TERRA_DEV_ID &&
      process.env.TERRA_USER_ID,
  );
}

function mockSeries(): SeriesPoint[] {
  const seed: SeriesPoint[] = [
    { date: "2026-08-31", weightKg: 86.8, leanMassKg: 57.6, fatMassKg: 29.2 },
    { date: "2026-09-02", weightKg: 86.1, leanMassKg: 57.7, fatMassKg: 28.4 },
    { date: "2026-09-04", weightKg: 85.4, leanMassKg: 57.8, fatMassKg: 27.6 },
    { date: "2026-09-06", weightKg: 84.7, leanMassKg: 57.9, fatMassKg: 26.8 },
    { date: "2026-09-08", weightKg: 84.1, leanMassKg: 58.0, fatMassKg: 26.1 },
    { date: "2026-09-10", weightKg: 83.4, leanMassKg: 58.0, fatMassKg: 25.4 },
    { date: "2026-09-12", weightKg: 82.9, leanMassKg: 58.1, fatMassKg: 24.8 },
    { date: "2026-09-14", weightKg: 82.4, leanMassKg: 58.1, fatMassKg: 24.3 },
  ];
  return seed;
}

function snapshotFromPoint(
  point: SeriesPoint,
  source: MetricSource,
  measuredAt = `${point.date}T07:14:00+02:00`,
): BodySnapshot {
  const bodyFatPercent = (point.fatMassKg / point.weightKg) * 100;
  const heightM = 1.72;
  return {
    measuredAt,
    source,
    provider: "Withings",
    weightKg: point.weightKg,
    leanMassKg: point.leanMassKg,
    fatMassKg: point.fatMassKg,
    muscleMassKg: Number((point.leanMassKg - 3.2).toFixed(1)),
    bodyFatPercent: Number(bodyFatPercent.toFixed(1)),
    bmi: Number((point.weightKg / (heightM * heightM)).toFixed(1)),
    restingHr: 58,
  };
}

function dashboardFromSeries(
  series: SeriesPoint[],
  source: MetricSource,
): BodyDashboard {
  const latestPoint = series[series.length - 1];
  const first = series[0];
  return {
    latest: snapshotFromPoint(latestPoint, source),
    series,
    deltas: {
      weight14d: Number((latestPoint.weightKg - first.weightKg).toFixed(1)),
      lean14d: Number((latestPoint.leanMassKg - first.leanMassKg).toFixed(1)),
      fat14d: Number((latestPoint.fatMassKg - first.fatMassKg).toFixed(1)),
    },
  };
}

function mapTerraPayload(payload: TerraBodyPayload): SeriesPoint[] {
  const points = (payload.data ?? [])
    .map((entry) => {
      const weightKg = entry.body?.weight_kg;
      if (!weightKg) return null;
      const bodyFat = entry.body?.bodyfat_percentage;
      const fatMassKg =
        bodyFat != null ? Number(((weightKg * bodyFat) / 100).toFixed(1)) : 0;
      const muscleKg =
        entry.body?.muscle_mass_g != null
          ? entry.body.muscle_mass_g / 1000
          : weightKg - fatMassKg;
      const date = (entry.metadata?.end_time ?? entry.metadata?.start_time ?? "")
        .slice(0, 10);
      return {
        date,
        weightKg,
        leanMassKg: Number(muscleKg.toFixed(1)),
        fatMassKg,
      } satisfies SeriesPoint;
    })
    .filter((point): point is SeriesPoint => Boolean(point && point.date));

  return points;
}

async function fetchTerraBody(): Promise<BodyDashboard | null> {
  if (!isTerraConfigured()) return null;

  const userId = process.env.TERRA_USER_ID;
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 14);

  const url = new URL(`${TERRA_BASE}/body`);
  url.searchParams.set("user_id", userId ?? "");
  url.searchParams.set("start_date", start.toISOString().slice(0, 10));
  url.searchParams.set("end_date", end.toISOString().slice(0, 10));
  url.searchParams.set("to_webhook", "false");

  const response = await fetch(url, {
    headers: {
      "dev-id": process.env.TERRA_DEV_ID ?? "",
      "x-api-key": process.env.TERRA_API_KEY ?? "",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as TerraBodyPayload;
  const series = mapTerraPayload(payload);
  if (series.length === 0) return null;
  return dashboardFromSeries(series, "withings");
}

export function getFallbackDashboard(): BodyDashboard {
  return dashboardFromSeries(mockSeries(), "mock");
}

export async function fetchBodyDashboard(): Promise<BodyDashboard> {
  try {
    const live = await fetchTerraBody();
    if (live) return live;
  } catch {
    // Fall through to labeled mock data so the prototype stays usable.
  }
  return getFallbackDashboard();
}

export function leanMassScore(dashboard: BodyDashboard): number {
  const leanHeld = dashboard.deltas.lean14d >= -0.2;
  const fatDown = dashboard.deltas.fat14d < 0;
  const ratio = dashboard.latest.leanMassKg / dashboard.latest.weightKg;
  const base = Math.round(ratio * 100);
  return Math.min(99, base + (leanHeld ? 8 : 0) + (fatDown ? 6 : 0));
}
