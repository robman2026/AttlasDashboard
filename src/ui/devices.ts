// Device tile semantics: icon, state kind and tap behaviour.
import type { DeviceConfig } from "../config/types";
import type { HassEntity, HomeAssistant } from "../data/hass";
import { domainOf, formatState, isInvalid } from "../data/hass";

export type Kind = "on" | "open" | "na" | "idle";

const has = (id: string, ...words: string[]) => words.some((w) => id.includes(w));

const DOOR_CLASSES = ["door", "garage_door", "opening", "window"];
const MOTION_CLASSES = ["motion", "occupancy", "presence"];

export const isContact = (s?: HassEntity) => {
  if (!s || domainOf(s.entity_id) !== "binary_sensor") return false;
  const dc = String(s.attributes.device_class ?? "");
  return DOOR_CLASSES.includes(dc) || has(s.entity_id, "contact", "window", "door", "skylight", "velux");
};

export const glyphFor = (id: string, s?: HassEntity): string => {
  const d = domainOf(id);
  const dc = String(s?.attributes.device_class ?? "");
  if (d === "binary_sensor") {
    if (dc === "window" || has(id, "window", "skylight", "velux")) return "window";
    if (dc === "garage_door") return "garage";
    if (has(id, "mailbox", "letterbox")) return "mail";
    if (dc === "door" || dc === "opening" || has(id, "door")) return "door";
    if (MOTION_CLASSES.includes(dc) || has(id, "motion", "presence", "person", "occupancy")) return "motion";
    return "dot";
  }
  if (d === "light") return "bulb";
  if (d === "fan") return "fan";
  if (d === "media_player") return "tv";
  if (d === "cover") return "garage";
  if (d === "camera") return "camera";
  if (d === "climate") return "heat";
  if (d === "switch") return has(id, "water", "valve", "irrig") ? "drop" : "power";
  if (d === "select") return "washer";
  if (has(id, "print")) return "printer";
  if (has(id, "mower")) return "mower";
  if (has(id, "oven")) return "oven";
  if (has(id, "washer", "dryer")) return "washer";
  if (dc === "temperature") return "thermo";
  if (dc === "battery") return "power";
  return "dot";
};

export const TOGGLE_DOMAINS = ["light", "switch", "fan", "input_boolean"];

export const kindOf = (s?: HassEntity): Kind => {
  if (isInvalid(s)) return "na";
  const d = domainOf(s!.entity_id);
  const st = s!.state;
  if (d === "binary_sensor") return st === "on" ? (isContact(s) ? "open" : "on") : "idle";
  if (d === "cover") return st === "open" || st === "opening" ? "open" : "idle";
  if (TOGGLE_DOMAINS.includes(d)) return st === "on" ? "on" : "idle";
  if (d === "media_player") return ["off", "standby", "idle"].includes(st) ? "idle" : "on";
  if (d === "climate") return st === "off" ? "idle" : "on";
  return "idle";
};

export const stateText = (hass: HomeAssistant, s?: HassEntity): string => {
  if (!s) return "Not found";
  if (s.state === "unavailable") return "Unavailable";
  if (s.state === "unknown") return "Unknown";
  const d = domainOf(s.entity_id);
  if (d === "light" && s.state === "on" && typeof s.attributes.brightness === "number")
    return `On · ${Math.round((s.attributes.brightness / 255) * 100)} %`;
  if (d === "climate") {
    const action = s.attributes.hvac_action ? String(s.attributes.hvac_action) : s.state;
    const cur = s.attributes.current_temperature;
    return `${action.charAt(0).toUpperCase()}${action.slice(1)}${cur != null ? ` · ${cur} °C` : ""}`;
  }
  return formatState(hass, s);
};

export const deviceLabel = (hass: HomeAssistant, d: DeviceConfig) =>
  d.name || String(hass.states[d.entity]?.attributes.friendly_name ?? d.entity);
