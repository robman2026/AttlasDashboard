// Minimal subset of the Home Assistant frontend `hass` object used here.
import type { HassEntity } from "home-assistant-js-websocket";

export type { HassEntity };

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  user?: { name: string; is_admin: boolean };
  config: { location_name?: string; time_zone?: string; unit_system?: { temperature?: string } };
  locale?: { language?: string };
  language?: string;
  callService(domain: string, service: string, data?: Record<string, unknown>, target?: Record<string, unknown>): Promise<unknown>;
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  formatEntityState?(stateObj: HassEntity, state?: string): string;
  hassUrl?(path?: string): string;
}

export const UNAVAILABLE = "unavailable";
export const UNKNOWN = "unknown";

export const domainOf = (entityId: string) => entityId.split(".")[0];

export const stateObj = (hass: HomeAssistant | undefined, id?: string): HassEntity | undefined =>
  id && hass ? hass.states[id] : undefined;

/** True when the entity is missing, unavailable or unknown. Such values are never shown as valid. */
export const isInvalid = (s?: HassEntity) => !s || s.state === UNAVAILABLE || s.state === UNKNOWN;

/** Numeric state, or undefined when missing/unavailable/non-numeric. */
export const num = (hass: HomeAssistant | undefined, id?: string): number | undefined => {
  const s = stateObj(hass, id);
  if (isInvalid(s)) return undefined;
  const n = Number(s!.state);
  return Number.isFinite(n) ? n : undefined;
};

/** Power in kW regardless of W/kW/MW unit. */
export const powerKw = (hass: HomeAssistant | undefined, id?: string): number | undefined => {
  const v = num(hass, id);
  if (v === undefined) return undefined;
  const unit = String(stateObj(hass, id)?.attributes.unit_of_measurement ?? "kW");
  if (unit === "W") return v / 1000;
  if (unit === "MW") return v * 1000;
  return v;
};

export const friendlyName = (hass: HomeAssistant | undefined, id: string) =>
  String(stateObj(hass, id)?.attributes.friendly_name ?? id);

export const formatState = (hass: HomeAssistant, s: HassEntity): string => {
  if (hass.formatEntityState) return hass.formatEntityState(s);
  const unit = s.attributes.unit_of_measurement;
  return unit ? `${s.state} ${unit}` : s.state;
};

/** Contact/door semantics: binary_sensor "on" or cover "open"/"opening". */
export const isOpen = (s?: HassEntity) => {
  if (!s) return false;
  const d = domainOf(s.entity_id);
  if (d === "cover") return s.state === "open" || s.state === "opening";
  return s.state === "on";
};
