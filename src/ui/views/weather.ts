// Weather forecast strip on Home (next to the greeting) (porting plan step 6, from the owner's Adaptive Room Card):
// forecast strip (daily or hourly, from the
// weather/subscribe_forecast subscription), toggle between the types the entity supports.
import { html, nothing } from "lit";
import type { Ctx } from "../context";
import { isInvalid, stateObj } from "../../data/hass";
import { type ForecastType, conditionLabel, fcKey, homeForecastTypes, windDir } from "../../data/weather";
import { weatherIcon } from "../icons";

const round = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : undefined);

export const weatherStrip = (ctx: Ctx) => {
  const id = ctx.config.entities?.weather;
  if (!id) return nothing;
  const s = stateObj(ctx.hass, id);
  if (isInvalid(s)) return nothing; // the top bar already says "Weather unavailable"
  const a = s!.attributes;
  const types: ForecastType[] = homeForecastTypes(s);
  const type = ((ctx.ui.wxType as ForecastType) && types.includes(ctx.ui.wxType as ForecastType) ? ctx.ui.wxType : types[0]) as ForecastType | undefined;
  const fc = (type ? ctx.forecasts[fcKey(id, type)] : undefined) ?? (Array.isArray(a.forecast) ? (a.forecast as never[]) : []);
  const lang = ctx.hass.locale?.language ?? ctx.hass.language ?? "en";
  const hourly = type === "hourly";
  const items = (fc ?? []).slice(0, hourly ? 6 : 5);
  const lbl = (dt: string) => {
    const d = new Date(dt);
    return Number.isNaN(d.getTime()) ? "" : hourly ? d.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" }) : d.toLocaleDateString(lang, { weekday: "short" });
  };
  const temp = round(a.temperature);
  const unit = String(a.temperature_unit ?? "°C");
  const wind = round(a.wind_speed);
  const details = [
    wind !== undefined ? `Wind ${wind} ${a.wind_speed_unit ?? "km/h"}${windDir(a.wind_bearing) ? ` ${windDir(a.wind_bearing)}` : ""}` : "",
    round(a.humidity) !== undefined ? `Humidity ${round(a.humidity)} %` : "",
  ].filter(Boolean);
  return html`<div class="wxstrip" role="group" aria-label="Weather forecast">
    ${types.length > 1
      ? html`<div class="wxseg" role="group" aria-label="Forecast type">
          ${types.map((t) => html`<button class=${t === type ? "on" : ""} aria-pressed=${t === type ? "true" : "false"} @click=${() => { ctx.ui.wxType = t; ctx.refresh(); }}>${t === "daily" ? "Days" : "Hours"}</button>`)}
        </div>`
      : nothing}
    <button class="wxfc" title=${`${conditionLabel(s!.state)}${temp !== undefined ? ` ${temp}${unit}` : ""}${details.length ? ` · ${details.join(" · ")}` : ""}`} @click=${() => ctx.moreInfo(id)}>
      ${items.length
        ? items.map((f) => {
            const hi = round(f.temperature);
            const lo = round(f.templow);
            const pp = round(f.precipitation_probability);
            return html`<span class="wxday">
              <small>${lbl(f.datetime)}</small>
              ${weatherIcon(f.condition)}
              <b class="n">${hi !== undefined ? `${hi}°` : "–"}${lo !== undefined ? html`<span class="t2">${lo}°</span>` : nothing}</b>
              ${pp ? html`<small class="wxpp">${pp} %</small>` : nothing}
            </span>`;
          })
        : html`<span class="wxnone t2">${types.length ? "Loading forecast..." : `${conditionLabel(s!.state)} · no forecast`}</span>`}
    </button>
  </div>`;
};
