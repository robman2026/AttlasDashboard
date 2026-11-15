// Device tile semantics: icon, state kind and tap behaviour.
import type { DeviceConfig, RoomDeviceConfig, TapAction } from "../config/types";
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

/** Domains a "press" tap acts on: button.press, input_button.press, script.turn_on. */
export const PRESS_DOMAINS = ["button", "input_button", "script"];

/** What a tap on a device tile does: the configured action, else toggle for toggleable domains, else details. */
export const tapAction = (d: RoomDeviceConfig): TapAction =>
  d.tap ?? (TOGGLE_DOMAINS.includes(domainOf(d.entity)) ? "toggle" : "more-info");

// Cover controls follow the HA frontend (src/data/cover.ts, src/data/feature/cover_entity_feature.ts):
// supported_features OPEN = 1, CLOSE = 2, STOP = 8.
const COVER_OPEN = 1;
const COVER_CLOSE = 2;
const COVER_STOP = 8;

/** Which of Open / Close / Stop the cover supports. */
export const coverFeatures = (s?: HassEntity) => {
  const f = Number(s?.attributes.supported_features ?? 0);
  return { open: (f & COVER_OPEN) !== 0, close: (f & COVER_CLOSE) !== 0, stop: (f & COVER_STOP) !== 0 };
};

/** Which of Open / Close / Stop can be used now (frontend canOpen / canClose / canStop). */
export const coverCan = (s?: HassEntity) => {
  if (!s || s.state === "unavailable") return { open: false, close: false, stop: false };
  const assumed = s.attributes.assumed_state === true;
  const p = s.attributes.current_position;
  const pos = typeof p === "number" ? p : undefined;
  const fullyOpen = pos !== undefined ? pos === 100 : s.state === "open";
  const fullyClosed = pos !== undefined ? pos === 0 : s.state === "closed";
  return {
    open: assumed || (!fullyOpen && s.state !== "opening"),
    close: assumed || (!fullyClosed && s.state !== "closing"),
    stop: true,
  };
};

/** Cover Open / Close ask first: the device option, else yes for garage doors and gates. */
export const confirmCover = (d: RoomDeviceConfig, s?: HassEntity) =>
  d.confirm ?? ["garage", "gate"].includes(String(s?.attributes.device_class ?? ""));

/** A button / input_button reports "unknown" until its first press (core button/entity.py): not a fault. */
const neverPressed = (s?: HassEntity) => !!s && s.state === "unknown" && ["button", "input_button"].includes(domainOf(s.entity_id));

export const kindOf = (s?: HassEntity): Kind => {
  if (neverPressed(s)) return "idle";
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
  if (neverPressed(s)) return "Never pressed";
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
