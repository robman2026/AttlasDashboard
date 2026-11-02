import { html, nothing } from "lit";
import type { RoomConfig } from "../../config/types";
import type { Ctx } from "../context";
import { num } from "../../data/hass";
import { imageUrl, roomLightEntities, roomLightLevel } from "../../data/model";
import { glyph, icon } from "../icons";

export const fmtTemp = (v?: number, unit = " °C") => (v === undefined ? "–" : `${v.toFixed(1)}${unit}`);
export const fmtHum = (v?: number) => (v === undefined ? "" : `${Math.round(v)} % RH`);

/**
 * Light mood of a room photo: darker and desaturated when the room's lights are off,
 * brighter with a warm glow as the light level rises. Undefined when the room has no
 * lights or the option is off.
 */
export const lightMood = (ctx: Ctx, r: RoomConfig) => {
  if (ctx.config.appearance?.light_mood === false) return undefined;
  const ids = roomLightEntities(ctx.config, r);
  if (!ids.length) return undefined;
  const { on, level, brightness } = roomLightLevel(ctx.hass, ids);
  const state = on === 0 ? "dark" : level >= 0.95 ? "lit" : "part";
  const vars = on === 0
    ? "--lb:0.42;--ls:0.55;--lg:0"
    : `--lb:${(0.6 + 0.45 * level).toFixed(2)};--ls:${(0.8 + 0.32 * level).toFixed(2)};--lg:${(0.28 * level).toFixed(2)}`;
  const text = on === 0 ? "Off" : brightness < 100 ? `${on} on · ${brightness} %` : `${on} on`;
  return { state, vars, text, ids };
};

/** Photo room tile (Home grid and floor grid). */
export const roomTile = (ctx: Ctx, r: RoomConfig, cls = "", extra?: string) => {
  const t = num(ctx.hass, r.temperature);
  const h = num(ctx.hass, r.humidity);
  const badge = ctx.badges.get(r.id);
  const img = imageUrl(ctx.config, r);
  const humLine = r.temperature || r.humidity ? fmtHum(h) || (r.humidity ? "no reading" : "") : "no climate sensor";
  const mood = img ? lightMood(ctx, r) : undefined;
  return html`<button class="tile ${cls} ${badge ? "alert" : ""} ${mood ? `mood ${mood.state}` : ""}" style=${mood?.vars ?? ""} aria-label="Open ${r.name}" @click=${() => ctx.openRoom(r)}>
    ${img ? html`<img src=${img} alt="" loading="lazy" />${mood ? html`<span class="glow"></span>` : nothing}<span class="shade"></span>` : nothing}
    <span class="top">${icon(r.icon, 26)}<span class="tright">${mood ? html`<span class="lchip ${mood.state}" title="Room lights">${glyph("bulb", 13)}${mood.text}</span>` : nothing}${badge ? html`<span class="badge ${badge.severity === "critical" ? "critical" : ""}">${badge.text}</span>` : nothing}</span></span>
    <span class="bot">
      <span class="info">
        <span class="name">${r.name}</span>
        ${r.temperature ? html`<span class="temp n ${ctx.hot.has(r.id) ? "hot" : ""}">${fmtTemp(t)}</span>` : nothing}
        <span class="hum n">${[humLine, extra].filter(Boolean).join(" · ")}</span>
      </span>
      <span class="go">${icon("chevron", 14)}</span>
    </span>
  </button>`;
};

export const sevColor: Record<string, string> = {
  critical: "var(--atlas-crit)",
  warning: "var(--atlas-warn)",
  info: "var(--atlas-info)",
};
