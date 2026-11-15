// Fan tile for a fan.* room device (porting plan step 7, from the owner's Adaptive Room Card):
// tap runs the tile action (default toggle, asks first with confirm), hold opens details,
// horizontal drag sets the speed (fan.set_percentage, snapped to percentage_step), and a
// direction button (fan.set_direction forward / reverse) when the fan supports it.
// HA fan (frontend src/data/fan.ts): features SET_SPEED 1, OSCILLATE 2, DIRECTION 4.
import { html, nothing } from "lit";
import type { RoomDeviceConfig } from "../../config/types";
import type { Ctx } from "../context";
import type { HassEntity } from "../../data/hass";
import { isInvalid } from "../../data/hass";
import { deviceLabel, stateText } from "../devices";
import { dragHandlers } from "../drag";
import { stampTitle } from "../time";

const SET_SPEED = 1;
const DIRECTION = 4;

export const fanFeatures = (s?: HassEntity) => {
  const f = Number(s?.attributes.supported_features ?? 0);
  return { speed: (f & SET_SPEED) !== 0, direction: (f & DIRECTION) !== 0 };
};

export const fanPct = (s?: HassEntity) => {
  if (s?.state !== "on") return 0;
  const p = Number(s.attributes.percentage);
  return Number.isFinite(p) ? Math.max(0, Math.min(100, Math.round(p))) : 0;
};

/** Snap to the fan's speed steps (percentage_step, e.g. 25 for four speeds), minimum one step. */
export const snapPct = (s: HassEntity | undefined, p: number) => {
  const step = Number(s?.attributes.percentage_step) > 0 ? Number(s!.attributes.percentage_step) : 1;
  return Math.max(Math.round(step), Math.min(100, Math.round(Math.round(p / step) * step)));
};

export const fanTile = (ctx: Ctx, d: RoomDeviceConfig, ago: string, tap: () => void, icon: unknown) => {
  const s = ctx.hass.states[d.entity];
  const f = fanFeatures(s);
  const on = s?.state === "on";
  const pct = fanPct(s);
  const name = deviceLabel(ctx.hass, d);
  const dir = String(s?.attributes.direction ?? "forward");
  const h = dragHandlers({
    start: () => fanPct(ctx.hass.states[d.entity]),
    canDrag: () => fanFeatures(ctx.hass.states[d.entity]).speed && !isInvalid(ctx.hass.states[d.entity]),
    snap: (p) => snapPct(ctx.hass.states[d.entity], p),
    preview: (el, p) => {
      el.style.setProperty("--pct", `${p}%`);
      // Write into the static preview span: the label itself holds Lit parts and must not be replaced.
      const lbl = el.querySelector(".lprev");
      if (lbl) lbl.textContent = `${p} %`;
    },
    commit: (p) => ctx.call("fan", "set_percentage", { entity_id: d.entity, percentage: p }),
    tap,
    hold: () => ctx.moreInfo(d.entity),
  });
  const label = on && f.speed && pct ? `On · ${pct} %` : stateText(ctx.hass, s);
  return html`<div class="dev fan ${on ? "on" : ""} ${!s || isInvalid(s) ? "na" : ""}" title=${stampTitle(ctx.hass, s) || d.entity}>
    <button class="dmain fdrag" style="--pct:${pct}%" aria-label="${name}: tap to toggle${f.speed ? ", drag to set the speed" : ""}, hold for details"
      @pointerdown=${h.down} @pointermove=${h.move} @pointerup=${h.up} @pointercancel=${h.cancel} @contextmenu=${h.context}
      @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tap(); } }}>
      <span class="ffill" aria-hidden="true"></span>
      <span class="chipi fspin">${icon}</span>
      <span class="txt"><b>${name}</b><span class="fstate">${label}</span><span class="lprev"></span>${ago ? html`<small class="ago n">${ago}</small>` : nothing}</span>
    </button>
    ${f.direction
      ? html`<button class="fdir" ?disabled=${!s || isInvalid(s)} aria-label="${name} direction: ${dir}. Switch"
          @click=${() => ctx.call("fan", "set_direction", { entity_id: d.entity, direction: dir === "reverse" ? "forward" : "reverse" })}>${dir === "reverse" ? "↺ Rev" : "↻ Fwd"}</button>`
      : nothing}
  </div>`;
};
