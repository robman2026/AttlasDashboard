// Hourly energy from Home Assistant long-term statistics (porting plan step 10, Solar view chart).
// WS recorder/statistics_during_period (frontend src/data/recorder.ts fetchStatistics):
// { start_time, end_time, statistic_ids, period: "hour", types: ["change"] } returns
// { [statistic_id]: [{ start, end, change }] } with start / end in ms. "change" is the energy
// added in that hour (works for total and total_increasing sensors, also across daily resets).
import type { HomeAssistant } from "./hass";

export interface HourlyStats {
  day: string; // local date the data belongs to (YYYY-MM-DD)
  fetched: number; // ms
  series: Record<string, (number | null)[]>; // 24 values per statistic id, null = no data (future hours)
}

/** Local midnight today (browser time zone, like the HA frontend's energy panel). */
export const startOfToday = (now = new Date()) => new Date(now.getFullYear(), now.getMonth(), now.getDate());

export const localDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const fetchHourly = async (hass: HomeAssistant, ids: string[], now = new Date()): Promise<HourlyStats> => {
  const start = startOfToday(now);
  const end = new Date(start.getTime() + 24 * 3600_000);
  const res = await hass.callWS<Record<string, { start: number | string; change?: number | null }[]>>({
    type: "recorder/statistics_during_period",
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    statistic_ids: ids,
    period: "hour",
    types: ["change"],
  });
  const series: HourlyStats["series"] = {};
  for (const id of ids) {
    const slots: (number | null)[] = Array(24).fill(null);
    for (const p of res?.[id] ?? []) {
      const t = typeof p.start === "number" ? p.start : Date.parse(p.start);
      const h = new Date(t).getHours();
      if (t >= start.getTime() && t < end.getTime() && typeof p.change === "number" && Number.isFinite(p.change)) slots[h] = Math.max(0, p.change);
    }
    // Hours up to now without a row had no energy recorded: 0, not a gap.
    for (let h = 0; h <= now.getHours() && h < 24; h++) if (slots[h] === null && (res?.[id]?.length ?? 0) > 0) slots[h] = 0;
    series[id] = slots;
  }
  return { day: localDay(now), fetched: Date.now(), series };
};
