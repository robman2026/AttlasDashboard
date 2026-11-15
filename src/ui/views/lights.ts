// Lights page (porting plan step 3, from the owner's former lights card): every room's
// lights grouped by floor. No new options: a room's lights are roomLightEntities()
// (light_entities, else its light.* devices minus excluded status LEDs).
// Tile: tap toggles, hold opens details, drag left / right dims (lights with brightness).
import { html } from "lit";
import type { RoomConfig } from "../../config/types";
import type { Ctx } from "../context";
import type { HassEntity } from "../../data/hass";
import { domainOf, isInvalid } from "../../data/hass";
import { deviceName, floorById, floors, roomLightEntities, rooms, roomsOnFloor } from "../../data/model";
import { glyph } from "../icons";
import { dragHandlers } from "../drag";

// Same rule as the HA frontend (src/data/light.ts, lightSupportsBrightness).
const BRIGHTNESS_MODES = ["brightness", "color_temp", "hs", "xy", "rgb", "rgbw", "rgbww", "white"];
export const supportsBrightness = (s?: HassEntity) =>
  !!s && domainOf(s.entity_id) === "light" &&
  Array.isArray(s.attributes.supported_color_modes) &&
  (s.attributes.supported_color_modes as string[]).some((m) => BRIGHTNESS_MODES.includes(m));

const pctOf = (s?: HassEntity) => {
  if (s?.state !== "on") return 0;
  const b = s.attributes.brightness;
  return typeof b === "number" ? Math.max(1, Math.round((b / 255) * 100)) : 100;
};

const stateLabel = (s?: HassEntity) =>
  !s ? "Not found" : s.state === "unavailable" ? "Unavailable" : s.state === "unknown" ? "Unknown" : s.state === "on" ? (supportsBrightness(s) ? `On · ${pctOf(s)} %` : "On") : "Off";

/** Pointer handling for one tile: tap toggles, hold opens details, horizontal drag dims. */
const tileHandlers = (ctx: Ctx, id: string) => {
  const s = () => ctx.hass.states[id];
  return dragHandlers({
    start: () => pctOf(s()),
    canDrag: () => supportsBrightness(s()) && !isInvalid(s()),
    preview: (el, p) => {
      el.style.setProperty("--pct", `${p}%`);
      // Write into the static preview span: the label itself holds Lit parts and must not be replaced.
      const lbl = el.querySelector(".lprev");
      if (lbl) lbl.textContent = `${p} %`;
    },
    commit: (p) => ctx.call("light", "turn_on", { entity_id: id, brightness_pct: p }),
    tap: () => {
      const st = s();
      if (!st || isInvalid(st)) return ctx.moreInfo(id);
      const d = domainOf(id);
      ctx.call(["light", "switch", "input_boolean"].includes(d) ? d : "homeassistant", "toggle", { entity_id: id });
    },
    hold: () => ctx.moreInfo(id),
  });
};

const lightTile = (ctx: Ctx, r: RoomConfig, id: string) => {
  const st = ctx.hass.states[id];
  const on = st?.state === "on";
  const na = !st || st.state === "unavailable";
  const dim = supportsBrightness(st);
  const h = tileHandlers(ctx, id);
  const name = (r.devices ?? []).find((d) => d.entity === id)?.name ?? deviceName(ctx.config, id) ?? String(st?.attributes.friendly_name ?? id);
  return html`<button class="ltile ${on ? "on" : ""} ${na ? "na" : ""} ${dim ? "dim" : ""}" style="--pct:${pctOf(st)}%"
    title=${dim ? `${name}: tap to toggle, drag to dim, hold for details` : `${name}: tap to toggle, hold for details`}
    @pointerdown=${h.down} @pointermove=${h.move} @pointerup=${h.up} @pointercancel=${h.cancel} @contextmenu=${h.context}
    @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ctx.call(domainOf(id) === "light" ? "light" : "homeassistant", "toggle", { entity_id: id }); } }}>
    <span class="lfill" aria-hidden="true"></span>
    <span class="lic">${glyph(domainOf(id) === "light" ? "bulb" : "power", 20)}</span>
    <span class="ltxt"><b>${name}</b><span class="lstate">${stateLabel(st)}</span><span class="lstate lprev"></span></span>
  </button>`;
};

const roomBlock = (ctx: Ctx, r: RoomConfig) => {
  const ids = roomLightEntities(ctx.config, r);
  const onIds = ids.filter((id) => ctx.hass.states[id]?.state === "on");
  return html`<div class="lroom">
    <div class="row">
      <button class="lrname" @click=${() => ctx.openRoom(r)}><b>${r.name}</b><small class="t2">${onIds.length ? `${onIds.length} of ${ids.length} on` : "All off"}</small></button>
      <button class="tog ${onIds.length ? "on" : ""}" role="switch" aria-checked=${onIds.length ? "true" : "false"} aria-label="${r.name} lights"
        @click=${() => ctx.call("homeassistant", onIds.length ? "turn_off" : "turn_on", { entity_id: onIds.length ? onIds : ids })}><i></i></button>
    </div>
    <div class="ltiles">${ids.map((id) => lightTile(ctx, r, id))}</div>
  </div>`;
};

export const renderLights = (ctx: Ctx) => {
  const withLights = (rs: RoomConfig[]) => rs.filter((r) => roomLightEntities(ctx.config, r).length);
  const groups = floors(ctx.config)
    .map((f) => ({ title: `${f.name}${f.level ? ` · level ${f.level}` : ""}`, rooms: withLights(roomsOnFloor(ctx.config, f.id)) }))
    .filter((g) => g.rooms.length);
  const loose = withLights(rooms(ctx.config).filter((r) => !r.floor || !floorById(ctx.config, r.floor)));
  if (loose.length) groups.push({ title: "Other rooms", rooms: loose });
  const all = [...new Set(groups.flatMap((g) => g.rooms.flatMap((r) => roomLightEntities(ctx.config, r))))];
  const onAll = all.filter((id) => ctx.hass.states[id]?.state === "on");
  return html`
    <section class="hero" aria-label="Lights">
      <h1 class="sm">Lights</h1>
      <p class="n">${onAll.length} of ${all.length} on <span style="opacity:.5">·</span> tap to toggle, drag to dim, hold for details</p>
    </section>
    <div class="row" style="padding:0 6px;justify-content:flex-end">
      <button class="ctl" ?disabled=${!onAll.length}
        @click=${() => ctx.confirm("Turn all lights off?", `${onAll.length} light${onAll.length === 1 ? " is" : "s are"} on.`, () => ctx.call("homeassistant", "turn_off", { entity_id: onAll }), "Turn off")}>
        ${glyph("power", 18)}All off
      </button>
    </div>
    ${groups.length
      ? groups.map((g) => html`<section class="glass card lfloor"><h2>${g.title}</h2><div class="lrooms">${g.rooms.map((r) => roomBlock(ctx, r))}</div></section>`)
      : html`<section class="glass card"><p class="empty">No room has lights yet. Add light devices to a room, or set its Light entities.</p></section>`}
  `;
};

export const hasLights = (ctx: Ctx) => rooms(ctx.config).some((r) => roomLightEntities(ctx.config, r).length);
