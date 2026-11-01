// Relative "time ago" labels for entity timestamps (HA last_changed / last_updated).
import type { HassEntity, HomeAssistant } from "../data/hass";
import type { TimeDisplay } from "../config/types";

const MIN = 60_000, HOUR = 3_600_000, DAY = 86_400_000;

export const timeAgo = (hass: HomeAssistant, iso: string | undefined, now = Date.now()): string => {
  const t = iso ? Date.parse(iso) : NaN;
  if (!Number.isFinite(t)) return "";
  const lang = hass.locale?.language ?? hass.language ?? "en";
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto", style: "short" });
  const d = Math.max(0, now - t);
  if (d < MIN) return rtf.format(0, "minute");
  if (d < HOUR) return rtf.format(-Math.floor(d / MIN), "minute");
  if (d < DAY) return rtf.format(-Math.floor(d / HOUR), "hour");
  if (d < 7 * DAY) return rtf.format(-Math.floor(d / DAY), "day");
  return new Date(t).toLocaleDateString(lang, { day: "numeric", month: "short" });
};

/** Timestamp selected by the time_display option (default: last_changed). */
export const stamp = (s: HassEntity | undefined, mode: TimeDisplay = "changed") =>
  !s || mode === "off" ? undefined : mode === "updated" ? s.last_updated : s.last_changed;

/** Tooltip with both absolute timestamps. */
export const stampTitle = (hass: HomeAssistant, s?: HassEntity) => {
  if (!s) return "";
  const lang = hass.locale?.language ?? hass.language ?? "en";
  const f = (iso: string) => (Number.isFinite(Date.parse(iso)) ? new Date(iso).toLocaleString(lang) : "-");
  return `${s.entity_id}\nLast changed: ${f(s.last_changed)}\nLast updated: ${f(s.last_updated)}`;
};
