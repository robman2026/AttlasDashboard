// Attention engine (v1, evaluated in the frontend from config).
// Rule: unknown or unavailable is never treated as "clear".
import type { AtlasConfig } from "../config/types";
import type { HomeAssistant } from "./hass";
import { domainOf, friendlyName, isInvalid, isOpen, num, stateObj, formatState } from "./hass";
import { deviceName, mappedEntities, roomOfEntity } from "./model";
import { readIncidentReport } from "./incidents";
import { type ForecastMap, SEVERE_CONDITIONS, WET_CONDITIONS, conditionLabel, fcKey, forecastHasPrecip } from "./weather";

export type Severity = "critical" | "warning" | "info";

export interface AtlasAlert {
  id: string;
  severity: Severity;
  title: string; // full row title (Alerts view)
  meta: string;
  chipTitle: string; // short label (banner chip)
  chipValue: string;
  badge: string; // e.g. "Too hot", "Open"
  icon: string; // ATLAS icon key
  room?: string; // room id to navigate to
  view?: string; // ATLAS view path to open (e.g. "system")
  roomBadge?: string; // badge shown on the room tile
  entity?: string; // more-info target when no room
  href?: string; // HA path when neither room nor entity
}

// Hysteresis memory for temperature rules, kept for the page lifetime.
const tempActive = new Map<string, boolean>();

const SEV_ORDER: Record<Severity, number> = { critical: 0, warning: 1, info: 2 };

export const evaluateAlerts = (hass: HomeAssistant, c: AtlasConfig, forecasts: ForecastMap = {}): AtlasAlert[] => {
  const out: AtlasAlert[] = [];
  const a = c.alerts ?? {};
  const roomName = (id: string) => roomOfEntity(c, id)?.name;
  const label = (id: string) => deviceName(c, id) ?? friendlyName(hass, id);

  // Critical: real detectors only.
  for (const id of a.critical ?? []) {
    const s = stateObj(hass, id);
    const room = roomOfEntity(c, id);
    if (isInvalid(s)) {
      out.push({ id: `crit-na-${id}`, severity: "warning", title: `${label(id)} unavailable`, meta: `Detector state unknown${room ? ` · ${room.name}` : ""}`,
        chipTitle: label(id), chipValue: "Detector", badge: "Unavailable", icon: "alert", room: room?.id, entity: id });
    } else if (s!.state === "on") {
      out.push({ id: `crit-${id}`, severity: "critical", title: `${label(id)} triggered`, meta: room?.name ?? id,
        chipTitle: room?.name ?? label(id), chipValue: label(id), badge: "Triggered", icon: "alert", room: room?.id, roomBadge: "Alarm", entity: id });
    }
  }

  // Temperature limits with hysteresis.
  for (const rule of a.temperature_rules ?? []) {
    const v = num(hass, rule.entity);
    const room = roomOfEntity(c, rule.entity);
    const name = rule.label || room?.name || label(rule.entity);
    if (v === undefined) {
      tempActive.delete(rule.entity);
      out.push({ id: `temp-na-${rule.entity}`, severity: "warning", title: `${name} temperature unavailable`, meta: `Cannot check the ${rule.above} °C limit`,
        chipTitle: name, chipValue: "No reading", badge: "Unavailable", icon: "temperature", room: room?.id, entity: rule.entity });
      continue;
    }
    const clear = rule.clear_below ?? rule.above;
    const active = tempActive.get(rule.entity) ? v >= clear : v > rule.above;
    tempActive.set(rule.entity, active);
    if (active) {
      const hum = num(hass, room?.humidity);
      out.push({ id: `temp-${rule.entity}`, severity: "warning",
        title: `${name} ${v.toFixed(1)} °C${hum !== undefined ? ` · ${Math.round(hum)} % RH` : ""}`,
        meta: `Above the ${rule.above} °C limit${room ? ` · ${room.name}` : ""}`,
        chipTitle: name, chipValue: `${v.toFixed(1)} °C`, badge: "Too hot", icon: "temperature", room: room?.id, roomBadge: "Too hot", entity: rule.entity });
    }
  }

  // Doors.
  const doors = (ids: string[] | undefined, severity: Severity) => {
    for (const id of ids ?? []) {
      const s = stateObj(hass, id);
      if (!isOpen(s)) continue;
      const room = roomOfEntity(c, id);
      out.push({ id: `door-${id}`, severity, title: `${room ? `${room.name} ` : ""}${label(id).toLowerCase()} open`,
        meta: `${friendlyName(hass, id)}${room ? ` · ${room.name}` : ""}`,
        chipTitle: room?.name ?? label(id), chipValue: label(id), badge: "Open", icon: "door-open", room: room?.id,
        roomBadge: `${label(id)} open`, entity: id });
    }
  };
  doors(a.exterior_doors, "warning");
  doors(a.interior_doors, "info");

  // Open window while it rains (porting plan step 6, rule of the owner's Adaptive Room Card):
  // the weather condition is wet and the hourly forecast does not confirm it is dry.
  const wxId = a.rain_weather || c.entities?.weather;
  const wx = stateObj(hass, wxId);
  if (a.rain_windows?.length && wxId && !isInvalid(wx) && WET_CONDITIONS.includes(wx!.state)) {
    const min = Number.isFinite(Number(a.rain_min_mm)) && a.rain_min_mm !== undefined ? Number(a.rain_min_mm) : 0.1;
    if (forecastHasPrecip(forecasts[fcKey(wxId, "hourly")], min) !== false) {
      const what = formatState(hass, wx!) || conditionLabel(wx!.state); // HA's localized condition
      for (const id of a.rain_windows) {
        const s = stateObj(hass, id);
        if (isInvalid(s) || !isOpen(s)) continue;
        const room = roomOfEntity(c, id);
        out.push({ id: `rain-${id}`, severity: "warning", title: `${room ? `${room.name} ` : ""}${label(id).toLowerCase()} open · ${what.toLowerCase()}`,
          meta: `${friendlyName(hass, id)}${room ? ` · ${room.name}` : ""} · close it, the weather is ${what.toLowerCase()}`,
          chipTitle: room?.name ?? label(id), chipValue: label(id), badge: what, icon: "door-open", room: room?.id,
          roomBadge: `${label(id)} open · ${what.toLowerCase()}`, entity: id });
      }
    }
  }

  // Severe weather (lightning, hail, pouring, exceptional).
  const main = stateObj(hass, c.entities?.weather);
  if (a.severe_weather !== false && c.entities?.weather && !isInvalid(main) && SEVERE_CONDITIONS.includes(main!.state)) {
    const what = formatState(hass, main!) || conditionLabel(main!.state);
    out.push({ id: "severe-weather", severity: "warning", title: `Severe weather: ${what.toLowerCase()}`, meta: "Current condition from the weather entity",
      chipTitle: "Weather", chipValue: what, badge: "Weather", icon: "alert", entity: c.entities.weather });
  }

  // Data quality: mapped entities that are unavailable or missing.
  if (a.data_quality !== false) {
    const bad = mappedEntities(c).filter((id) => {
      const s = stateObj(hass, id);
      return !s || s.state === "unavailable";
    });
    if (bad.length) {
      const names = bad.map((id) => {
        const r = roomName(id);
        return `${label(id)}${r ? ` (${r})` : ""}`;
      });
      out.push({ id: "data-quality", severity: "warning", title: `${bad.length} device${bad.length > 1 ? "s" : ""} unavailable`,
        meta: names.slice(0, 8).join(", ") + (names.length > 8 ? ` +${names.length - 8} more` : ""),
        chipTitle: "Data quality", chipValue: `${bad.length} device${bad.length > 1 ? "s" : ""}`, badge: "Unavailable", icon: "alert" });
    }
  }

  // Incident report (log analyzer sensor; counts from summary, top-level attributes or the incident list).
  const inc = c.entities?.incidents;
  if (inc) {
    const s = stateObj(hass, inc);
    const rep = readIncidentReport(s);
    if (!rep) {
      out.push({ id: "incidents-na", severity: "warning", title: "Incident report unavailable", meta: "Log analysis state unknown",
        chipTitle: "Log report", chipValue: "No data", badge: "Unavailable", icon: "system", entity: inc });
    } else {
      const { critical: cr, warning: w, minor: m } = rep.counts;
      if (cr + w + m > 0) {
        const parts = [cr && `${cr} critical`, w && `${w} warning${w > 1 ? "s" : ""}`, m && `${m} minor`].filter(Boolean).join(", ");
        out.push({ id: "incidents", severity: cr + w > 0 ? "warning" : "info", title: `Log report: ${parts}`,
          meta: rep.incidents.length ? rep.incidents.slice(0, 2).map((x) => x.title).join(" · ") : "Incident analyzer",
          chipTitle: "System", chipValue: `${cr + w + m} issue${cr + w + m > 1 ? "s" : ""}`,
          badge: "Check log", icon: "system", view: "system", entity: inc });
      }
    }
  }

  // Mailbox: with an ack helper the alert stays until the helper is turned off.
  if (a.mailbox) {
    const active = a.mailbox_ack ? stateObj(hass, a.mailbox_ack)?.state === "on" : stateObj(hass, a.mailbox)?.state === "on";
    if (active) {
      const room = roomOfEntity(c, a.mailbox);
      out.push({ id: "mailbox", severity: "info", title: "Mailbox opened", meta: `${room?.name ?? ""}${a.mailbox_ack ? " · stays until acknowledged" : ""}`,
        chipTitle: "Mailbox", chipValue: "Opened", badge: "Mail", icon: "info", room: room?.id, entity: a.mailbox_ack ?? a.mailbox });
    }
  }

  // Updates (domain scan is fine here: update.* only).
  if (a.updates !== false) {
    const ups = Object.values(hass.states).filter((s) => domainOf(s.entity_id) === "update" && s.state === "on");
    if (ups.length) {
      out.push({ id: "updates", severity: "info", title: `${ups.length} update${ups.length > 1 ? "s" : ""} available`,
        meta: ups.slice(0, 4).map((s) => String(s.attributes.title ?? s.attributes.friendly_name ?? s.entity_id)).join(" · "),
        chipTitle: "Updates", chipValue: String(ups.length), badge: "Update", icon: "info", href: "/config/updates" });
    }
  }

  return out.sort((x, y) => SEV_ORDER[x.severity] - SEV_ORDER[y.severity]);
};

export const roomBadges = (alerts: AtlasAlert[]): Map<string, { text: string; severity: Severity }> => {
  const m = new Map<string, { text: string; severity: Severity }>();
  for (const al of alerts) if (al.room && al.roomBadge && !m.has(al.room)) m.set(al.room, { text: al.roomBadge, severity: al.severity });
  return m;
};
