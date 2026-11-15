// Incident report sensor (owner's log analyzer, ha-incident-report-card / ha-log-analyzer-dashboard):
// state is a short summary ("1C / 2W / 2M"); attributes hold generated (ISO time),
// summary ({ critical, warning, minor }), incidents ([{ id, severity, title, detail,
// recommendation, count, sources }]) and optionally top-level critical / warning / minor.
// Counts may be numbers or lists (lists count by length).
import type { HassEntity } from "./hass";
import { isInvalid } from "./hass";

export type IncidentSeverity = "critical" | "warning" | "minor";

export interface Incident {
  id: string;
  severity: IncidentSeverity;
  title: string;
  detail: string;
  recommendation: string;
  count?: number;
  sources: string[];
}

export interface IncidentReport {
  generated?: string;
  counts: Record<IncidentSeverity, number>;
  incidents: Incident[]; // critical first, then by count (as the source card)
}

const RANK: Record<IncidentSeverity, number> = { critical: 0, warning: 1, minor: 2 };
const SEVS: IncidentSeverity[] = ["critical", "warning", "minor"];

const count = (v: unknown): number | undefined => {
  if (Array.isArray(v)) return v.length;
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const sevOf = (v: unknown): IncidentSeverity => (SEVS.includes(v as IncidentSeverity) ? (v as IncidentSeverity) : "minor");

/** The report, or undefined while the sensor is missing, unknown or unavailable ("waiting for the analyzer"). */
export const readIncidentReport = (s?: HassEntity): IncidentReport | undefined => {
  if (!s || isInvalid(s)) return undefined;
  const a = s.attributes ?? {};
  const raw = Array.isArray(a.incidents) ? (a.incidents as Record<string, unknown>[]) : [];
  const incidents: Incident[] = raw
    .filter((x) => x && typeof x === "object")
    .map((x, i) => ({
      id: String(x.id ?? i),
      severity: sevOf(x.severity),
      title: String(x.title ?? "Incident"),
      detail: x.detail ? String(x.detail) : "",
      recommendation: x.recommendation ? String(x.recommendation) : "",
      count: count(x.count),
      sources: Array.isArray(x.sources) ? x.sources.map(String) : [],
    }))
    .sort((x, y) => RANK[x.severity] - RANK[y.severity] || (y.count ?? 0) - (x.count ?? 0));
  const summary = a.summary && typeof a.summary === "object" ? (a.summary as Record<string, unknown>) : {};
  const counts = Object.fromEntries(
    SEVS.map((k) => [k, count(summary[k]) ?? count(a[k]) ?? incidents.filter((x) => x.severity === k).length])
  ) as Record<IncidentSeverity, number>;
  return { generated: typeof a.generated === "string" ? a.generated : undefined, counts, incidents };
};
