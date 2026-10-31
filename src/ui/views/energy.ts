// Energy view: whole-house meter with phases, a summary and one gauge per metered circuit.
// Data comes only from `energy_meters` in the config. Unavailable sensors show "–", never 0.
import { html, nothing, svg } from "lit";
import type { EnergyMeter } from "../../config/types";
import type { Ctx } from "../context";
import { isInvalid, num, powerKw, stateObj } from "../../data/hass";
import { energyMeters } from "../../data/model";
import { icon } from "../icons";

const STANDBY_W = 2;
const DEFAULT_MAX_W = 3000;

/** Power in W (sensor may report W or kW), undefined when unavailable. */
const watts = (ctx: Ctx, id?: string) => {
  const kw = powerKw(ctx.hass, id);
  return kw === undefined ? undefined : kw * 1000;
};
const fmtW = (w?: number) => (w === undefined ? "–" : Math.abs(w) >= 10000 ? `${(w / 1000).toFixed(2)} kW` : `${Math.round(w)} W`);
const fmtNum = (v: number | undefined, digits: number, unit: string) => (v === undefined ? "–" : `${v.toFixed(digits)}${unit}`);
const pf = (ctx: Ctx, id?: string) => {
  const v = num(ctx.hass, id);
  if (v === undefined) return undefined;
  return Math.abs(v) <= 1 ? v * 100 : v;
};

const online = (ctx: Ctx, m: EnergyMeter) => !!stateObj(ctx.hass, m.power) && !isInvalid(stateObj(ctx.hass, m.power));

/** 270 degree gauge ring. */
const ring = (frac: number | undefined, size: number, warn: boolean) => {
  const f = frac === undefined ? 0 : Math.max(0, Math.min(1, frac));
  const color = warn ? "var(--atlas-warn)" : "var(--atlas-accent)";
  return svg`<svg class="ering" width=${size} height=${size} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(241,245,255,0.08)" stroke-width="7" stroke-linecap="round"
      pathLength="100" stroke-dasharray="75 100" transform="rotate(135 50 50)"></circle>
    ${f > 0
      ? svg`<circle cx="50" cy="50" r="42" fill="none" stroke=${color} stroke-width="7" stroke-linecap="round"
          pathLength="100" stroke-dasharray=${`${(f * 75).toFixed(1)} 100`} transform="rotate(135 50 50)"></circle>`
      : nothing}
  </svg>`;
};

type Phase = "a" | "b" | "c";
/** Phases that have at least one sensor configured. */
const phasesOf = (m: EnergyMeter): Phase[] =>
  (["a", "b", "c"] as const).filter((p) => m[`power_${p}`] || m[`current_${p}`] || m[`voltage_${p}`]);

/** Compact phase table for circuit cards: one row per phase, columns for the metrics that are configured. */
const phaseRows = (ctx: Ctx, m: EnergyMeter) => {
  const phases = phasesOf(m);
  if (!phases.length) return nothing;
  const cols: { key: "power" | "current" | "voltage"; label: string; fmt: (id?: string) => string }[] = [
    { key: "power", label: "W", fmt: (id) => fmtW(watts(ctx, id)) },
    { key: "current", label: "A", fmt: (id) => fmtNum(num(ctx.hass, id), 2, " A") },
    { key: "voltage", label: "V", fmt: (id) => fmtNum(num(ctx.hass, id), 0, " V") },
  ];
  const used = cols.filter((c) => phases.some((p) => m[`${c.key}_${p}`]));
  const grid = `grid-template-columns: 22px repeat(${used.length}, minmax(0, 1fr))`;
  return html`<div class="ephases" role="table" aria-label="${m.name} phases">
    ${phases.map(
      (p) => html`<div class="ph sm" role="row" style=${grid}>
        <span class="phl" role="rowheader">${p.toUpperCase()}</span>
        ${used.map((c) => {
          const id = m[`${c.key}_${p}`];
          return html`<button class="n" role="cell" ?disabled=${!id} aria-label="Phase ${p.toUpperCase()} ${c.key}" @click=${() => id && ctx.moreInfo(id)}>${id ? c.fmt(id) : ""}</button>`;
        })}
      </div>`
    )}
  </div>`;
};

const statusOf = (ctx: Ctx, m: EnergyMeter, w?: number) =>
  !online(ctx, m) ? { text: "Offline", cls: "off" } : w !== undefined && Math.abs(w) >= STANDBY_W ? { text: "Consuming", cls: "on" } : { text: "Standby", cls: "idle" };

const stat = (value: string, label: string, onClick?: () => void) =>
  html`<button class="estat" ?disabled=${!onClick} @click=${() => onClick?.()}><b class="n">${value}</b><span>${label}</span></button>`;

const mainCard = (ctx: Ctx, m: EnergyMeter) => {
  const w = watts(ctx, m.power);
  const max = m.max_power || DEFAULT_MAX_W;
  const st = statusOf(ctx, m, w);
  const phases = phasesOf(m);
  const mi = (id?: string) => (id ? () => ctx.moreInfo(id) : undefined);
  return html`<section class="glass card emain">
    <div class="row"><h2>${icon("energy", 20)}${m.name}</h2><span class="estatus ${st.cls}"><i></i>${st.text}</span></div>
    <div class="emain-body">
      <button class="egauge big" @click=${() => ctx.moreInfo(m.power)}>
        ${ring(w === undefined ? undefined : w / max, 168, w !== undefined && w > max * 0.8)}
        <span class="ev"><b class="n">${fmtW(w)}</b><span>${st.text === "Offline" ? "no data" : "now"}</span></span>
      </button>
      ${phases.length
        ? html`<div class="phases" role="table" aria-label="Phases">
            <div class="ph head" role="row"><span></span>${phases.map((p) => html`<span role="columnheader">Phase ${p.toUpperCase()}</span>`)}</div>
            <div class="ph" role="row"><span class="t2">${icon("energy", 16)}Power</span>${phases.map((p) => html`<button class="n" @click=${() => mi(m[`power_${p}`])?.()}>${fmtW(watts(ctx, m[`power_${p}`]))}</button>`)}</div>
            <div class="ph" role="row"><span class="t2">${icon("power", 16)}Current</span>${phases.map((p) => html`<button class="n" @click=${() => mi(m[`current_${p}`])?.()}>${fmtNum(num(ctx.hass, m[`current_${p}`]), 2, " A")}</button>`)}</div>
            <div class="ph" role="row"><span class="t2">${icon("grid", 16)}Voltage</span>${phases.map((p) => html`<button class="n" @click=${() => mi(m[`voltage_${p}`])?.()}>${fmtNum(num(ctx.hass, m[`voltage_${p}`]), 1, " V")}</button>`)}</div>
          </div>`
        : nothing}
    </div>
    <div class="estats">
      ${m.energy ? stat(fmtNum(num(ctx.hass, m.energy), 1, " kWh"), "Total energy", mi(m.energy)) : nothing}
      ${m.power_factor ? stat(fmtNum(pf(ctx, m.power_factor), 0, " %"), "Power factor", mi(m.power_factor)) : nothing}
      ${m.current ? stat(fmtNum(num(ctx.hass, m.current), 2, " A"), "Current", mi(m.current)) : nothing}
      ${m.frequency ? stat(fmtNum(num(ctx.hass, m.frequency), 2, " Hz"), "Frequency", mi(m.frequency)) : nothing}
    </div>
  </section>`;
};

const summaryCard = (ctx: Ctx, main: EnergyMeter | undefined, circuits: EnergyMeter[]) => {
  const total = main ? watts(ctx, main.power) : undefined;
  const vals = circuits.map((m) => ({ m, w: watts(ctx, m.power) }));
  const known = vals.filter((v) => v.w !== undefined);
  const sum = known.reduce((a, v) => a + Math.max(0, v.w!), 0);
  const rest = total !== undefined ? total - sum : undefined;
  const top = [...known].filter((v) => v.w! >= STANDBY_W).sort((a, b) => b.w! - a.w!).slice(0, 4);
  const scale = Math.max(total ?? 0, top[0]?.w ?? 0, 1);
  const offline = circuits.length - known.length;
  return html`<section class="glass card esum">
    <h2>${icon("info", 20)}Right now</h2>
    <div class="esum-figs">
      ${main ? html`<div><b class="n">${fmtW(total)}</b><span>Whole house</span></div>` : nothing}
      <div><b class="n">${fmtW(known.length ? sum : undefined)}</b><span>Metered circuits</span></div>
      ${rest !== undefined ? html`<div><b class="n">${fmtW(Math.max(0, rest))}</b><span>Not metered</span></div>` : nothing}
    </div>
    <h3 class="t2">Top consumers</h3>
    ${top.length
      ? html`<div class="etop">${top.map(
          (v) => html`<button @click=${() => ctx.moreInfo(v.m.power)}>
            <span class="lbl"><span>${v.m.name}</span><b class="n">${fmtW(v.w)}</b></span>
            <span class="bar"><span style="width:${Math.round((v.w! / scale) * 100)}%"></span></span>
          </button>`
        )}</div>`
      : html`<span class="t2" style="font-size:13px">All circuits in standby.</span>`}
    ${offline ? html`<span class="t2" style="font-size:12px;color:var(--atlas-warn)">${offline} circuit${offline > 1 ? "s" : ""} offline</span>` : nothing}
  </section>`;
};

const circuitCard = (ctx: Ctx, m: EnergyMeter) => {
  const w = watts(ctx, m.power);
  const max = m.max_power || DEFAULT_MAX_W;
  const st = statusOf(ctx, m, w);
  const mi = (id?: string) => (id ? () => ctx.moreInfo(id) : undefined);
  const extra = [m.voltage ? fmtNum(num(ctx.hass, m.voltage), 1, " V") : "", m.frequency ? fmtNum(num(ctx.hass, m.frequency), 2, " Hz") : ""].filter(Boolean).join(" · ");
  return html`<div class="ecard ${st.cls}">
    <div class="row"><b class="ename">${m.name}</b><span class="estatus ${st.cls}"><i></i>${st.text}</span></div>
    <button class="egauge" aria-label="${m.name} power details" @click=${() => ctx.moreInfo(m.power)}>
      ${ring(w === undefined ? undefined : w / max, 116, w !== undefined && w > max * 0.8)}
      <span class="ev"><b class="n">${fmtW(w)}</b></span>
    </button>
    <div class="estats sm">
      ${m.energy ? stat(fmtNum(num(ctx.hass, m.energy), 1, " kWh"), "Energy", mi(m.energy)) : nothing}
      ${m.current ? stat(fmtNum(num(ctx.hass, m.current), 2, " A"), "Current", mi(m.current)) : nothing}
      ${m.power_factor ? stat(fmtNum(pf(ctx, m.power_factor), 0, " %"), "PF", mi(m.power_factor)) : nothing}
    </div>
    ${phaseRows(ctx, m)}
    ${extra ? html`<span class="n t2 eextra">${extra}</span>` : nothing}
  </div>`;
};

export const renderEnergy = (ctx: Ctx) => {
  const meters = energyMeters(ctx.config);
  const main = meters.find((m) => m.main);
  const circuits = meters.filter((m) => m !== main);
  const on = circuits.filter((m) => statusOf(ctx, m, watts(ctx, m.power)).cls === "on").length;
  return html`
    <section class="hero" aria-label="Energy">
      <h1>Energy</h1>
      <p class="n">${circuits.length} circuit${circuits.length === 1 ? "" : "s"} metered <span style="opacity:.5">·</span> ${on} consuming now</p>
    </section>
    ${meters.length
      ? html`<div class="energy-top">${main ? mainCard(ctx, main) : nothing}${summaryCard(ctx, main, circuits)}</div>
          ${circuits.length
            ? html`<section class="glass card" style="gap:14px">
                <div class="row"><h2>Circuits</h2><span class="t2" style="font-size:12px">Tap a value for its history</span></div>
                <div class="egrid">${circuits.map((m) => circuitCard(ctx, m))}</div>
              </section>`
            : nothing}`
      : html`<section class="glass card"><p class="empty">No energy meters configured. Add them in Edit dashboard > Energy.</p></section>`}
  `;
};
