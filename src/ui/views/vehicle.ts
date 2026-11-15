// Vehicle card (porting plan step 2): room option car_*. Renders only in the room whose
// config sets vehicle entities. Behaviour follows the owner's former vehicle card:
// lock state and control, range, odometer, location, daily / monthly distance and trips,
// last update, and press actions (flash lights, horn, update data).
import { html, nothing, svg } from "lit";
import type { RoomConfig } from "../../config/types";
import type { Ctx } from "../context";
import type { HassEntity } from "../../data/hass";
import { domainOf, formatState, isInvalid, stateObj } from "../../data/hass";
import { assetUrl } from "../../data/model";
import { glyph } from "../icons";
import { timeAgo } from "../time";

const CAR_ENTITY_KEYS = [
  "car_lock", "car_doors_locked", "car_range", "car_odometer", "car_location",
  "car_daily_distance", "car_daily_trips", "car_monthly_distance", "car_monthly_trips",
  "car_last_updated", "car_flash", "car_horn", "car_refresh",
] as const;

/** All vehicle entities of a room (for the re-render list and the "has a vehicle" check). */
export const vehicleEntities = (r: RoomConfig): string[] =>
  CAR_ENTITY_KEYS.map((k) => r[k]).filter((x): x is string => !!x);

export const hasVehicle = (r: RoomConfig) => vehicleEntities(r).length > 0;

type LockState = "locked" | "unlocked" | "moving" | "jammed" | "unknown";

/** Lock state from the lock entity, else from the doors status (HA: binary_sensor lock off = locked). */
export const vehicleLock = (ctx: Ctx, r: RoomConfig): { state: LockState; text: string; entity?: string } => {
  const lock = stateObj(ctx.hass, r.car_lock);
  if (r.car_lock) {
    if (isInvalid(lock)) return { state: "unknown", text: "Unknown", entity: r.car_lock };
    const st = lock!.state;
    const state: LockState = st === "locked" ? "locked" : st === "jammed" ? "jammed" : ["locking", "unlocking", "opening"].includes(st) ? "moving" : "unlocked";
    return { state, text: formatState(ctx.hass, lock!), entity: r.car_lock };
  }
  const doors = stateObj(ctx.hass, r.car_doors_locked);
  if (!r.car_doors_locked) return { state: "unknown", text: "" };
  if (isInvalid(doors)) return { state: "unknown", text: "Unknown", entity: r.car_doors_locked };
  const when = r.car_doors_locked_when?.trim();
  const st = doors!.state;
  const locked = when
    ? st.toLowerCase() === when.toLowerCase()
    : domainOf(doors!.entity_id) === "binary_sensor"
      ? st === "off"
      : st.toLowerCase() === "locked";
  return { state: locked ? "locked" : "unlocked", text: locked ? "Locked" : "Unlocked", entity: r.car_doors_locked };
};

const val = (ctx: Ctx, id?: string) => {
  const s = stateObj(ctx.hass, id);
  return !s || isInvalid(s) ? "–" : formatState(ctx.hass, s);
};

/** When the car last reported: a timestamp sensor, else the newest last_updated of its entities. */
const lastReport = (ctx: Ctx, r: RoomConfig): string | undefined => {
  const t = stateObj(ctx.hass, r.car_last_updated);
  if (t && !isInvalid(t) && Number.isFinite(Date.parse(t.state))) return t.state;
  const times = vehicleEntities(r)
    .map((id) => ctx.hass.states[id])
    .filter((s): s is HassEntity => !!s && !isInvalid(s) && !["button", "input_button", "script"].includes(domainOf(s.entity_id)))
    .map((s) => s.last_updated)
    .filter((x) => Number.isFinite(Date.parse(x)))
    .sort();
  return times[times.length - 1];
};

/** Side view of a car, drawn in the accent colour (used when no car_image is set). */
const carOutline = () => svg`<svg class="vsvg" viewBox="0 0 320 130" aria-hidden="true">
  <path d="M18 92 C18 78 26 72 40 70 L92 62 C112 40 140 30 178 30 L214 30 C238 30 256 42 270 60 L290 66 C302 69 306 76 306 88 L306 96 L18 96 Z"
    fill="var(--atlas-accent-soft)" stroke="var(--atlas-accent)" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M106 62 C122 44 144 38 172 38 L178 38 L178 62 Z M190 38 L212 38 C230 38 244 46 254 62 L190 62 Z" fill="rgba(241,245,255,0.12)" stroke="var(--atlas-accent)" stroke-width="2"/>
  <circle cx="84" cy="96" r="20" fill="#14171c" stroke="var(--atlas-accent)" stroke-width="3"/><circle cx="84" cy="96" r="7" fill="var(--atlas-accent)"/>
  <circle cx="246" cy="96" r="20" fill="#14171c" stroke="var(--atlas-accent)" stroke-width="3"/><circle cx="246" cy="96" r="7" fill="var(--atlas-accent)"/>
  <path d="M292 76 L304 78" stroke="#FFD27A" stroke-width="4" stroke-linecap="round"/>
</svg>`;

const press = (ctx: Ctx, id: string) => {
  const d = domainOf(id);
  return ctx.call(d, d === "script" ? "turn_on" : "press", { entity_id: id });
};

export const vehicleCard = (ctx: Ctx, r: RoomConfig) => {
  if (!hasVehicle(r)) return nothing;
  const name = r.car_name || "Vehicle";
  const lock = vehicleLock(ctx, r);
  const lockEnt = stateObj(ctx.hass, r.car_lock);
  const needsCode = !!lockEnt?.attributes.code_format;
  const img = assetUrl(ctx.config, r.car_image);
  const last = lastReport(ctx, r);
  const loc = stateObj(ctx.hass, r.car_location);
  const lockAct = (service: "lock" | "unlock") => {
    if (!r.car_lock) return;
    if (needsCode) return ctx.moreInfo(r.car_lock); // the HA dialog asks for the code
    const run = () => ctx.call("lock", service, { entity_id: r.car_lock });
    if (service === "unlock") ctx.confirm(`Unlock ${name}?`, `${name} is ${lock.text.toLowerCase()}.`, run, "Unlock");
    else run();
  };
  const stat = (label: string, id?: string, extra?: string) =>
    id ? html`<button class="vstat" @click=${() => ctx.moreInfo(id)}><b class="n">${val(ctx, id)}</b><small>${label}${extra ? ` · ${extra}` : ""}</small></button>` : nothing;
  const pair = (label: string, dist?: string, trips?: string) =>
    dist || trips
      ? html`<button class="vstat" @click=${() => ctx.moreInfo((dist || trips)!)}>
          <b class="n">${dist ? val(ctx, dist) : "–"}</b>
          <small>${label}${trips ? ` · ${val(ctx, trips)} trip${val(ctx, trips) === "1" ? "" : "s"}` : ""}</small>
        </button>`
      : nothing;
  const action = (id: string | undefined, label: string, g: string, confirm = false) =>
    id
      ? html`<button class="sq vact" ?disabled=${stateObj(ctx.hass, id)?.state === "unavailable"} title=${label}
          @click=${() => (confirm ? ctx.confirm(`${label}?`, `${name}: ${label.toLowerCase()} now.`, () => press(ctx, id), label) : press(ctx, id))}>${glyph(g, 18)}<span>${label}</span></button>`
      : nothing;
  return html`<section class="glass card vehicle">
    <div class="row">
      <h2>${glyph("car", 20)}<span class="vname">${name}${r.car_subtitle ? html`<small class="t2">${r.car_subtitle}</small>` : nothing}</span></h2>
      ${lock.text
        ? html`<button class="vlock ${lock.state}" @click=${() => lock.entity && ctx.moreInfo(lock.entity)}>${glyph(lock.state === "locked" ? "lock" : "unlock", 16)}${lock.text}</button>`
        : nothing}
    </div>
    <div class="vbody">
      <div class="vpic">${img ? html`<img src=${img} alt=${name} loading="lazy" />` : carOutline()}</div>
      <div class="vstats">
        ${stat("Range", r.car_range)}
        ${stat("Odometer", r.car_odometer)}
        ${r.car_location
          ? html`<button class="vstat" @click=${() => ctx.moreInfo(r.car_location!)}><b>${val(ctx, r.car_location)}</b><small>Location${loc && !isInvalid(loc) ? ` · ${timeAgo(ctx.hass, loc.last_changed)}` : ""}</small></button>`
          : nothing}
        ${pair("Today", r.car_daily_distance, r.car_daily_trips)}
        ${pair("This month", r.car_monthly_distance, r.car_monthly_trips)}
      </div>
    </div>
    <div class="vfoot">
      <span class="t2 vupd">${last ? `Updated ${timeAgo(ctx.hass, last)}` : "No update time"}</span>
      <div class="vacts">
        ${r.car_lock
          ? html`<button class="sq vact" ?disabled=${lock.state === "unknown" || lock.state === "moving"} @click=${() => lockAct(lock.state === "locked" ? "unlock" : "lock")}>
              ${glyph(lock.state === "locked" ? "unlock" : "lock", 18)}<span>${lock.state === "locked" ? "Unlock" : "Lock"}</span></button>`
          : nothing}
        ${action(r.car_flash, "Flash lights", "bulb")}
        ${action(r.car_horn, "Honk horn", "horn", true)}
        ${action(r.car_refresh, "Update data", "refresh")}
      </div>
    </div>
  </section>`;
};
