// Heat pump view (porting plan step 10, from the owner's Nibe SMO S40 card): status chips,
// temperature gauges, energy with COP, pressures, refrigerant circuit and run times. Generic:
// every part is a list of entities, hidden when empty.
import { html, nothing, svg } from "lit";
import type { DeviceConfig } from "../../config/types";
import type { Ctx } from "../context";
import { formatState, isInvalid, num, stateObj } from "../../data/hass";
import { heatPumpClimate } from "../../data/model";
import { deviceLabel, glyphFor } from "../devices";
import { glyph, icon } from "../icons";

const val = (ctx: Ctx, id?: string) => {
  const s = stateObj(ctx.hass, id);
  return !s || isInvalid(s) ? "–" : formatState(ctx.hass, s);
};

/** Severity colour along the gauge range (source card: blue, green, yellow, red). */
const tempColor = (f: number) => (f < 0.3 ? "#5ec8ff" : f < 0.6 ? "var(--atlas-accent)" : f < 0.8 ? "var(--atlas-warn)" : "var(--atlas-crit)");

/** COP from total produced and consumed energy (source card: estimated COP). */
export const copOf = (produced?: number, consumed?: number) =>
  produced !== undefined && consumed !== undefined && consumed > 0 ? produced / consumed : undefined;

const values = (ctx: Ctx, title: string, list: DeviceConfig[] | undefined, g: string) =>
  list?.length
    ? html`<section class="glass card">
        <h2>${glyph(g, 20)}${title}</h2>
        <div class="cextra">
          ${list.map((d) => html`<button class="cx" @click=${() => ctx.moreInfo(d.entity)}>
            <span class="cxi">${d.icon ? html`<ha-icon .icon=${d.icon} style="--mdc-icon-size:18px"></ha-icon>` : glyph(glyphFor(d.entity, ctx.hass.states[d.entity]), 18)}</span>
            <span><b class="n">${val(ctx, d.entity)}</b><small>${deviceLabel(ctx.hass, d)}</small></span></button>`)}
        </div>
      </section>`
    : nothing;

export const renderHeatPump = (ctx: Ctx) => {
  const h = ctx.config.heat_pump ?? {};
  const climateId = heatPumpClimate(ctx.config);
  const cl = stateObj(ctx.hass, climateId);
  const cur = cl && !isInvalid(cl) ? Number(cl.attributes.current_temperature) : undefined;
  const target = cl && !isInvalid(cl) ? Number(cl.attributes.temperature) : undefined;
  const action = cl && !isInvalid(cl) ? String(cl.attributes.hvac_action ?? cl.state) : undefined;
  const min = Number.isFinite(Number(h.gauge_min)) && h.gauge_min !== undefined ? Number(h.gauge_min) : -20;
  const max = Number.isFinite(Number(h.gauge_max)) && h.gauge_max !== undefined ? Number(h.gauge_max) : 80;
  const produced = num(ctx.hass, h.energy_produced);
  const consumed = num(ctx.hass, h.energy_consumed);
  const cop = copOf(produced, consumed);
  const conn = stateObj(ctx.hass, h.connection);
  const connBad = !!h.connection && (!conn || isInvalid(conn) || ["off", "disconnected", "offline"].includes(conn.state.toLowerCase()));
  const chip = (label: string, id?: string, warn = false) =>
    id ? html`<button class="schip ${warn ? "warn" : ""}" @click=${() => ctx.moreInfo(id)}><span><b>${val(ctx, id)}</b><small>${label}</small></span></button>` : nothing;
  const gauges = (h.gauges ?? []).slice(0, 4);
  const sub = [
    action ? action.charAt(0).toUpperCase() + action.slice(1) : "",
    cur !== undefined && Number.isFinite(cur) ? `${cur.toFixed(1)} °C` : "",
    cop !== undefined ? `COP ${cop.toFixed(1)}` : "",
  ].filter(Boolean);
  return html`
    <section class="hero" aria-label="Heat pump">
      <h1 class="sm">${h.name || "Heat pump"}</h1>
      ${sub.length ? html`<p class="n">${sub.join(" · ")}</p>` : nothing}
    </section>
    <div class="strip" style="padding:0 6px">
      ${climateId
        ? html`<button class="schip ${action === "heating" ? "on" : ""}" @click=${() => ctx.moreInfo(climateId)}>${icon("climate", 18)}<span><b>${cur !== undefined && Number.isFinite(cur) ? `${cur.toFixed(1)} °C` : "–"}${target !== undefined && Number.isFinite(target) ? ` → ${target.toFixed(1)} °C` : ""}</b><small>${action ?? "Unavailable"}</small></span></button>`
        : nothing}
      ${chip("Compressor", h.status)}
      ${chip("Priority", h.priority)}
      ${chip("Mode", h.mode)}
      ${chip("Connection", h.connection, connBad)}
      ${chip("Degree minutes", h.degree_minutes)}
    </div>
    ${gauges.length
      ? html`<section class="glass card">
          <h2>${icon("temperature", 20)}Temperatures</h2>
          <div class="sgauges">
            ${gauges.map((g) => {
              const v = num(ctx.hass, g.entity);
              const f = v === undefined ? undefined : (v - min) / (max - min || 1);
              const color = f === undefined ? "var(--atlas-text2)" : tempColor(Math.max(0, Math.min(1, f)));
              const ff = f === undefined ? 0 : Math.max(0, Math.min(1, f));
              return html`<button class="sgauge" @click=${() => ctx.moreInfo(g.entity)}>
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(241,245,255,0.08)" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="75 100" transform="rotate(135 50 50)"></circle>
                  ${ff > 0 ? svg`<circle cx="50" cy="50" r="40" fill="none" stroke=${color} stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray=${`${(ff * 75).toFixed(1)} 100`} transform="rotate(135 50 50)"></circle>` : nothing}
                </svg>
                <b class="n" style="color:${color}">${v === undefined ? "–" : `${v.toFixed(1)}°`}</b><small>${deviceLabel(ctx.hass, g)}</small>
              </button>`;
            })}
          </div>
        </section>`
      : nothing}
    <div class="solar-grid">
      ${h.energy_produced || h.energy_consumed || h.power || h.energy?.length
        ? html`<section class="glass card">
            <h2>${glyph("power", 20)}Energy</h2>
            <div class="vstats">
              ${h.energy_produced ? html`<button class="vstat" @click=${() => ctx.moreInfo(h.energy_produced!)}><b class="n">${val(ctx, h.energy_produced)}</b><small>Produced</small></button>` : nothing}
              ${h.energy_consumed ? html`<button class="vstat" @click=${() => ctx.moreInfo(h.energy_consumed!)}><b class="n">${val(ctx, h.energy_consumed)}</b><small>Consumed</small></button>` : nothing}
              ${h.energy_produced && h.energy_consumed ? html`<div class="vstat"><b class="n" style="color:var(--atlas-accent)">${cop === undefined ? "–" : cop.toFixed(2)}</b><small>COP (produced / consumed)</small></div>` : nothing}
              ${h.power ? html`<button class="vstat" @click=${() => ctx.moreInfo(h.power!)}><b class="n">${val(ctx, h.power)}</b><small>Power now</small></button>` : nothing}
              ${(h.energy ?? []).map((d) => html`<button class="vstat" @click=${() => ctx.moreInfo(d.entity)}><b class="n">${val(ctx, d.entity)}</b><small>${deviceLabel(ctx.hass, d)}</small></button>`)}
            </div>
          </section>`
        : nothing}
      ${values(ctx, "Pressures", h.pressures, "thermo")}
    </div>
    <div class="solar-grid">
      ${values(ctx, "Refrigerant circuit", h.circuit, "heat")}
      ${values(ctx, "Run times", h.runtimes, "refresh")}
    </div>
  `;
};

/** Entities of the Heat pump view (re-render list). */
export const heatPumpEntities = (c: Ctx["config"]) => {
  const h = c.heat_pump ?? {};
  return [h.climate, h.status, h.priority, h.mode, h.connection, h.degree_minutes, h.energy_produced, h.energy_consumed, h.power,
    ...[h.gauges, h.energy, h.pressures, h.circuit, h.runtimes].flatMap((l) => (l ?? []).map((d) => d.entity))].filter((x): x is string => !!x);
};
