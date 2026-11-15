// Weather helpers (porting plan step 6, from the owner's Adaptive Room Card).
// HA weather API (frontend src/data/weather.ts): supported_features FORECAST_DAILY 1,
// FORECAST_HOURLY 2, FORECAST_TWICE_DAILY 4; forecasts come from the websocket
// subscription weather/subscribe_forecast (entity_id, forecast_type) as
// { type, forecast: [{ datetime, condition, temperature, templow, precipitation,
// precipitation_probability, wind_speed, ... }] }. The forecast attribute is legacy.
import type { HassEntity } from "./hass";

export type ForecastType = "daily" | "hourly" | "twice_daily";

export interface ForecastEntry {
  datetime: string;
  condition?: string;
  temperature?: number;
  templow?: number;
  precipitation?: number;
  precipitation_probability?: number;
  wind_speed?: number;
  is_daytime?: boolean;
}

/** Latest forecasts per "entity|type", filled by <atlas-view> subscriptions. */
export type ForecastMap = Record<string, ForecastEntry[] | null | undefined>;
export const fcKey = (entity: string, type: ForecastType) => `${entity}|${type}`;

const FEATURE: Record<ForecastType, number> = { daily: 1, hourly: 2, twice_daily: 4 };

export const supportedForecastTypes = (s?: HassEntity): ForecastType[] => {
  const f = Number(s?.attributes.supported_features ?? 0);
  return (["daily", "twice_daily", "hourly"] as ForecastType[]).filter((t) => (f & FEATURE[t]) !== 0);
};

/** Forecast types the Home card offers (daily first). */
export const homeForecastTypes = (s?: HassEntity): ForecastType[] => supportedForecastTypes(s).filter((t) => t === "daily" || t === "hourly");

/** HA conditions (frontend weather.ts). Wet: what the open window rule reacts to (source card groups rain, snow, lightning, hail). */
export const WET_CONDITIONS = ["rainy", "pouring", "lightning-rainy", "snowy", "snowy-rainy", "hail"];
/** Severe weather warning on Home and Alerts. */
export const SEVERE_CONDITIONS = ["lightning", "lightning-rainy", "hail", "pouring", "exceptional"];

export const conditionLabel = (c?: string) =>
  !c ? "-" : c === "partlycloudy" ? "Partly cloudy" : c === "clear-night" ? "Clear night" : c === "windy-variant" ? "Windy" : c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, ", ");

/**
 * Does the near-term hourly forecast confirm precipitation (same guard as the source card)?
 * Looks at the current and next hour: precipitation >= minMm or probability >= 50 % is true.
 * false when the fields are there but below; undefined when unknown (then the rule does not block).
 */
export const forecastHasPrecip = (fc: ForecastEntry[] | null | undefined, minMm = 0.1): boolean | undefined => {
  if (!Array.isArray(fc) || !fc.length) return undefined;
  let saw = false;
  for (const f of fc.slice(0, 2)) {
    if (f.precipitation !== undefined && f.precipitation !== null) {
      saw = true;
      if (Number(f.precipitation) >= minMm) return true;
    }
    if (f.precipitation_probability !== undefined && f.precipitation_probability !== null) {
      saw = true;
      if (Number(f.precipitation_probability) >= 50) return true;
    }
  }
  return saw ? false : undefined;
};

const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
export const windDir = (b: unknown) => {
  if (typeof b === "string" && b.trim()) return b;
  const n = Number(b);
  return b === undefined || b === null || !Number.isFinite(n) ? "" : DIRS[Math.round((((n % 360) + 360) % 360) / 45) % 8];
};
