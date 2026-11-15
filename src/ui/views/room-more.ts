// Room cards of porting plan step 7 (from the owner's Adaptive Room Card and Multi-panel card):
// room power (power_*), lawn mower (mower_*) and salt level (salt_*). Each renders only in a
// room whose config sets it.
import { html, nothing, svg } from "lit";
import type { RoomConfig } from "../../config/types";
import type { Ctx } from "../context";
import { formatState, isInvalid, num, powerKw, stateObj } from "../../data/hass";
import { glyph } from "../icons";
import { timeAgo } from "../time";

// ---------- room power ----------

const STANDBY_W = 2;

/** Power in W (sensor in W or kW), undefined when unavailable. */
export const roomWatts = (ctx: Ctx, r: RoomConfig) => {
  const kw = powerKw(ctx.hass, r.power);
  return kw === undefined ? undefined : kw * 1000;
};

/** Load colour: accent up to 65 % of full scale, amber up to 85 %, red above (source card: green, amber, orange, red). */
export const loadColor = (w: number | undefined, max: number) => {
  if (w === undefined) return "var(--atlas-text2)";
  const f = w / (max || 3000);
  return f < 0.65 ? "var(--atlas-accent)" : f < 0.85 ? "var(--atlas-warn)" : "var(--atlas-crit)";
};

export const fmtW = (w?: number) => (w === undefined ? "–" : Math.abs(w) >= 10000 ? `${(w / 1000).toFixed(2)} kW` : `${Math.round(w)} W`);

const gauge = (frac: number, color: string) => {
  const f = Math.max(0, Math.min(1, frac));
  return svg`<svg class="ering" width="96" height="96" viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(241,245,255,0.08)" stroke-width="8" stroke-linecap="round"
      pathLength="100" stroke-dasharray="75 100" transform="rotate(135 50 50)"></circle>
    ${f > 0
      ? svg`<circle cx="50" cy="50" r="42" fill="none" stroke=${color} stroke-width="8" stroke-linecap="round"
          pathLength="100" stroke-dasharray=${`${(f * 75).toFixed(1)} 100`} transform="rotate(135 50 50)"></circle>`
      : nothing}
  </svg>`;
};

export const powerCard = (ctx: Ctx, r: RoomConfig) => {
  if (!r.power) return nothing;
  const max = Number(r.power_max) > 0 ? Number(r.power_max) : 3000;
  const w = roomWatts(ctx, r);
  const color = loadColor(w, max);
  const state = w === undefined ? "Offline" : w < STANDBY_W ? "Standby" : "Consuming";
  const kwh = num(ctx.hass, r.power_energy);
  const amps = num(ctx.hass, r.power_current);
  return html`<section class="glass card rpower">
    <div class="row"><h2>${glyph("power", 20)}Power</h2><span class="n t2" style="font-size:12px">of ${fmtW(max)}</span></div>
    <button class="rpbody" @click=${() => ctx.moreInfo(r.power!)}>
      <span class="rpring">${gauge(w === undefined ? 0 : w / max, color)}<b class="n" style="color:${color}">${fmtW(w)}</b></span>
      <span class="rptxt">
        <b style="color:${color}">${state}</b>
        ${r.power_energy ? html`<small class="t2">Energy <span class="n">${kwh === undefined ? "–" : `${kwh.toFixed(2)} kWh`}</span></small>` : nothing}
        ${r.power_current ? html`<small class="t2">Current <span class="n">${amps === undefined ? "–" : `${amps.toFixed(2)} A`}</span></small>` : nothing}
      </span>
    </button>
  </section>`;
};

// ---------- lawn mower ----------

// HA lawn_mower (frontend src/data/lawn_mower.ts): features START_MOWING 1, PAUSE 2, DOCK 4;
// states mowing, paused, returning, docked, idle, error.
const MOWER = { start: 1, pause: 2, dock: 4 };
const MOWER_LABEL: Record<string, string> = { mowing: "Mowing", paused: "Paused", returning: "Returning", docked: "Docked", idle: "Idle", error: "Error" };

export const mowerCan = (s?: ReturnType<typeof stateObj>) => {
  const f = Number(s?.attributes.supported_features ?? 0);
  const ok = !!s && !isInvalid(s);
  return {
    start: (f & MOWER.start) !== 0 && ok && s!.state !== "mowing",
    pause: (f & MOWER.pause) !== 0 && ok && s!.state !== "paused" && ["mowing", "returning"].includes(s!.state),
    dock: (f & MOWER.dock) !== 0 && ok && s!.state !== "docked",
    showStart: (f & MOWER.start) !== 0,
    showPause: (f & MOWER.pause) !== 0,
    showDock: (f & MOWER.dock) !== 0,
  };
};

export const mowerCard = (ctx: Ctx, r: RoomConfig) => {
  if (!r.mower) return nothing;
  const s = stateObj(ctx.hass, r.mower);
  const name = r.mower_name || String(s?.attributes.friendly_name ?? "Mower");
  const label = !s ? "Not found" : isInvalid(s) ? "Unavailable" : MOWER_LABEL[s.state] ?? formatState(ctx.hass, s);
  const tone = !s || isInvalid(s) || s.state === "error" ? "bad" : s.state === "mowing" ? "on" : s.state === "returning" || s.state === "paused" ? "mid" : "";
  const batt = num(ctx.hass, r.mower_battery);
  const bcol = batt === undefined ? "var(--atlas-text2)" : batt > 50 ? "var(--atlas-accent)" : batt > 20 ? "var(--atlas-warn)" : "var(--atlas-crit)";
  const can = mowerCan(s);
  const call = (service: string) => ctx.call("lawn_mower", service, { entity_id: r.mower });
  // Start and Pause share one slot (source card): Pause while mowing or returning, else Start.
  const pauseSlot = can.showPause && s && ["mowing", "returning"].includes(s.state);
  return html`<section class="glass card mower">
    <div class="row">
      <h2>${glyph("mower", 20)}${name}</h2>
      <button class="mbadge ${tone}" @click=${() => ctx.moreInfo(r.mower!)}>${label}</button>
    </div>
    <span class="t2" style="font-size:12px">${s && !isInvalid(s) ? `${label} since ${timeAgo(ctx.hass, s.last_changed)}` : r.mower}</span>
    ${r.mower_battery
      ? html`<button class="mbatt" @click=${() => ctx.moreInfo(r.mower_battery!)}>
          <small class="t2">Battery</small><i class="mbar"><i style="width:${batt === undefined ? 0 : Math.max(0, Math.min(100, batt))}%;background:${bcol}"></i></i>
          <b class="n" style="color:${bcol}">${batt === undefined ? "–" : `${Math.round(batt)} %`}</b>
        </button>`
      : nothing}
    <div class="mbtns">
      ${pauseSlot
        ? html`<button class="sq" ?disabled=${!can.pause} @click=${() => call("pause")}>Pause</button>`
        : can.showStart
          ? html`<button class="sq on" ?disabled=${!can.start} @click=${() => call("start_mowing")}>Start mowing</button>`
          : nothing}
      ${can.showDock ? html`<button class="sq" ?disabled=${!can.dock} @click=${() => call("dock")}>Return to dock</button>` : nothing}
    </div>
  </section>`;
};

// ---------- salt level ----------

/** Salt level in % (sensor 0..100, or 0..1 as a fraction, as the source card), undefined when unavailable. */
export const saltPct = (ctx: Ctx, r: RoomConfig) => {
  const v = num(ctx.hass, r.salt_level);
  if (v === undefined) return undefined;
  return Math.max(0, Math.min(100, v > 1 ? v : v * 100));
};

export const saltWarnBelow = (r: RoomConfig) => (Number.isFinite(Number(r.salt_warn_below)) && r.salt_warn_below !== undefined ? Number(r.salt_warn_below) : 30);

/** Source card thresholds: red below 30 %, amber below 60 %, green above. */
const saltColor = (p?: number) => (p === undefined ? "var(--atlas-text2)" : p < 30 ? "var(--atlas-crit)" : p < 60 ? "var(--atlas-warn)" : "var(--atlas-accent)");

export const saltCard = (ctx: Ctx, r: RoomConfig) => {
  if (!r.salt_level) return nothing;
  const p = saltPct(ctx, r);
  const low = p !== undefined && p < saltWarnBelow(r);
  const col = saltColor(p);
  const dist = stateObj(ctx.hass, r.salt_distance);
  return html`<section class="glass card salt">
    <div class="row"><h2>${glyph("drop", 20)}${r.salt_name || "Salt level"}</h2>${low ? html`<span class="badge">Buy salt</span>` : nothing}</div>
    <button class="saltbody" @click=${() => ctx.moreInfo(r.salt_level!)}>
      <span class="salttank"><i style="height:${p ?? 0}%;background:${col}"></i></span>
      <span class="rptxt">
        <b class="n" style="font-size:30px;color:${col}">${p === undefined ? "–" : `${Math.round(p)} %`}</b>
        <small class="t2">${p === undefined ? "Sensor unavailable" : low ? `Below ${saltWarnBelow(r)} %, refill the softener` : "full"}</small>
        ${r.salt_distance ? html`<small class="t2">Reading <span class="n">${dist && !isInvalid(dist) ? formatState(ctx.hass, dist) : "–"}</span></small>` : nothing}
      </span>
    </button>
  </section>`;
};

/** Entities of these cards (re-render list in atlas-view). */
export const roomMoreEntities = (r: RoomConfig): string[] =>
  [r.power, r.power_energy, r.power_current, r.mower, r.mower_battery, r.salt_level, r.salt_distance].filter((x): x is string => !!x);
