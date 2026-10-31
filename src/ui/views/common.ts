import { html, nothing } from "lit";
import type { RoomConfig } from "../../config/types";
import type { Ctx } from "../context";
import { num } from "../../data/hass";
import { imageUrl } from "../../data/model";
import { icon } from "../icons";

export const fmtTemp = (v?: number, unit = " °C") => (v === undefined ? "–" : `${v.toFixed(1)}${unit}`);
export const fmtHum = (v?: number) => (v === undefined ? "" : `${Math.round(v)} % RH`);

/** Photo room tile (Home grid and floor grid). */
export const roomTile = (ctx: Ctx, r: RoomConfig, cls = "", extra?: string) => {
  const t = num(ctx.hass, r.temperature);
  const h = num(ctx.hass, r.humidity);
  const badge = ctx.badges.get(r.id);
  const img = imageUrl(ctx.config, r);
  const humLine = r.temperature || r.humidity ? fmtHum(h) || (r.humidity ? "no reading" : "") : "no climate sensor";
  return html`<button class="tile ${cls} ${badge ? "alert" : ""}" aria-label="Open ${r.name}" @click=${() => ctx.openRoom(r)}>
    ${img ? html`<img src=${img} alt="" loading="lazy" /><span class="shade"></span>` : nothing}
    <span class="top">${icon(r.icon, 26)}${badge ? html`<span class="badge ${badge.severity === "critical" ? "critical" : ""}">${badge.text}</span>` : nothing}</span>
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
