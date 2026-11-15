// Security page (porting plan step 4): alarm panel, doors and windows, locks, motion and
// all cameras of the house. No new options: everything comes from the existing config
// (entities.alarm, alerts.exterior_doors / interior_doors, room devices, room cameras, car_lock).
import { html, nothing } from "lit";
import type { RoomConfig } from "../../config/types";
import type { Ctx } from "../context";
import type { HassEntity } from "../../data/hass";
import { domainOf, formatState, isInvalid, isOpen, stateObj } from "../../data/hass";
import { deviceName, houseCameraGroups, roomOfEntity, rooms } from "../../data/model";
import { glyphFor, isContact, isMotion } from "../devices";
import { glyph, icon } from "../icons";
import { timeAgo } from "../time";

// Alarm modes and feature bits as in the HA frontend (src/data/alarm_control_panel.ts,
// AlarmControlPanelEntityFeature: ARM_HOME 1, ARM_AWAY 2, ARM_NIGHT 4, TRIGGER 8,
// ARM_CUSTOM_BYPASS 16, ARM_VACATION 32).
const MODES: { state: string; label: string; feature: number; service: string; g: string }[] = [
  { state: "armed_home", label: "Home", feature: 1, service: "alarm_arm_home", g: "house" },
  { state: "armed_away", label: "Away", feature: 2, service: "alarm_arm_away", g: "lock" },
  { state: "armed_night", label: "Night", feature: 4, service: "alarm_arm_night", g: "moon" },
  { state: "armed_vacation", label: "Vacation", feature: 32, service: "alarm_arm_vacation", g: "plane" },
  { state: "armed_custom_bypass", label: "Custom bypass", feature: 16, service: "alarm_arm_custom_bypass", g: "shield" },
];

/** Arm modes the panel supports (supported_features bit set). */
export const alarmModes = (s?: HassEntity) => {
  const f = Number(s?.attributes.supported_features ?? 0);
  return MODES.filter((m) => (f & m.feature) !== 0);
};

/**
 * Whether HA needs a code for this action (same rule as the frontend's
 * setProtectedAlarmControlPanelMode): disarm when code_format is set; arm when
 * code_arm_required and code_format are set. Then the HA dialog asks for it.
 */
export const alarmNeedsCode = (s: HassEntity | undefined, arm: boolean) =>
  !!s?.attributes.code_format && (!arm || !!s.attributes.code_arm_required);

type Tone = "calm" | "armed" | "warn" | "crit" | "na";
const alarmTone = (s?: HassEntity): Tone =>
  isInvalid(s) ? "na" : s!.state === "triggered" ? "crit" : ["arming", "pending", "disarming"].includes(s!.state) ? "warn" : s!.state.startsWith("armed") ? "armed" : "calm";

const label = (ctx: Ctx, id: string) => deviceName(ctx.config, id) ?? String(ctx.hass.states[id]?.attributes.friendly_name ?? id);

const alarmCard = (ctx: Ctx) => {
  const id = ctx.config.entities?.alarm;
  if (!id) return nothing;
  const s = stateObj(ctx.hass, id);
  const tone = alarmTone(s);
  const modes = alarmModes(s);
  const by = s?.attributes.changed_by;
  const arm = (m: (typeof MODES)[number]) => {
    if (alarmNeedsCode(s, true)) return ctx.moreInfo(id);
    ctx.confirm(`Arm ${m.label.toLowerCase()}?`, `The alarm will arm in ${m.label.toLowerCase()} mode.`, () => ctx.call("alarm_control_panel", m.service, { entity_id: id }), "Arm");
  };
  const disarm = () => {
    if (alarmNeedsCode(s, false)) return ctx.moreInfo(id);
    ctx.confirm("Disarm the alarm?", `The alarm is ${s ? formatState(ctx.hass, s).toLowerCase() : "unknown"}.`, () => ctx.call("alarm_control_panel", "alarm_disarm", { entity_id: id }), "Disarm");
  };
  const disarmed = s?.state === "disarmed";
  return html`<section class="glass card alarm ${tone}">
    <div class="row">
      <h2>${icon("security", 20)}Alarm</h2>
      <button class="t2 more" @click=${() => ctx.moreInfo(id)}>Details ${icon("chevron", 14)}</button>
    </div>
    <button class="astate" @click=${() => ctx.moreInfo(id)}>
      <span class="aico">${glyph(tone === "calm" ? "shieldoff" : "shield", 30)}</span>
      <span class="atxt"><b>${s ? (isInvalid(s) ? "Unavailable" : formatState(ctx.hass, s)) : "Not found"}</b>
        <small class="t2">${s && !isInvalid(s) ? `Since ${timeAgo(ctx.hass, s.last_changed)}` : id}${by ? ` · by ${by}` : ""}</small></span>
    </button>
    <div class="amodes">
      ${modes.map(
        (m) => html`<button class="sq ${s?.state === m.state ? "on" : ""}" aria-pressed=${s?.state === m.state ? "true" : "false"}
          ?disabled=${isInvalid(s) || s?.state === m.state} @click=${() => arm(m)}>${glyph(m.g, 18)}<span>${m.label}</span></button>`
      )}
      <button class="sq dis" ?disabled=${isInvalid(s) || disarmed} @click=${disarm}>${glyph("shieldoff", 18)}<span>Disarm</span></button>
    </div>
    ${!modes.length && s && !isInvalid(s) ? html`<p class="t2" style="font-size:12px;margin:0">This panel reports no arm modes. Use Details to control it.</p>` : nothing}
  </section>`;
};

/** One row in the doors, locks or motion lists. */
const sRow = (ctx: Ctx, id: string, stateTxt: string, cls: string, extra: unknown = nothing) => {
  const s = ctx.hass.states[id];
  const room = roomOfEntity(ctx.config, id);
  return html`<div class="srow ${cls}">
    <button class="smain" @click=${() => ctx.moreInfo(id)}>
      <span class="sic">${glyph(domainOf(id) === "lock" ? (s?.state === "locked" ? "lock" : "unlock") : glyphFor(id, s), 18)}</span>
      <span class="atxt"><b>${label(ctx, id)}</b><small class="t2">${room ? `${room.name} · ` : ""}${stateTxt}${s && !isInvalid(s) ? ` · ${timeAgo(ctx.hass, s.last_changed)}` : ""}</small></span>
    </button>
    ${extra}
  </div>`;
};

/** Doors, windows and covers: room contacts and covers plus the alert door lists (mailbox excluded). */
export const securityContacts = (ctx: Ctx): string[] => {
  const a = ctx.config.alerts ?? {};
  const fromRooms = rooms(ctx.config).flatMap((r) => (r.devices ?? []).map((d) => d.entity))
    .filter((id) => isContact(ctx.hass.states[id]) || domainOf(id) === "cover");
  const skip = new Set([a.mailbox].filter(Boolean));
  return [...new Set([...(a.exterior_doors ?? []), ...(a.interior_doors ?? []), ...fromRooms])].filter((id) => !skip.has(id));
};

const rank = (s?: HassEntity) => (isInvalid(s) ? 1 : isOpen(s) ? 0 : 2);

const doorsCard = (ctx: Ctx) => {
  const ids = securityContacts(ctx);
  if (!ids.length) return nothing;
  const ext = new Set(ctx.config.alerts?.exterior_doors ?? []);
  const sorted = [...ids].sort((x, y) => rank(ctx.hass.states[x]) - rank(ctx.hass.states[y]));
  const open = ids.filter((id) => !isInvalid(ctx.hass.states[id]) && isOpen(ctx.hass.states[id])).length;
  const na = ids.filter((id) => isInvalid(ctx.hass.states[id])).length;
  return html`<section class="glass card">
    <div class="row"><h2>${glyph("door", 20)}Doors and windows</h2>
      <span class="n t2" style="font-size:12px">${open} open · ${ids.length - open - na} closed${na ? ` · ${na} n/a` : ""}</span></div>
    <div class="slist">
      ${sorted.map((id) => {
        const s = ctx.hass.states[id];
        const bad = isInvalid(s);
        const o = !bad && isOpen(s);
        const txt = !s ? "Not found" : bad ? "Unavailable" : formatState(ctx.hass, s);
        return sRow(ctx, id, `${txt}${ext.has(id) ? " · exterior" : ""}`, bad ? "na" : o ? (ext.has(id) ? "warn" : "open") : "");
      })}
    </div>
  </section>`;
};

/** Locks: lock.* room devices and vehicle locks (car_lock). */
export const securityLocks = (ctx: Ctx): string[] =>
  [...new Set(rooms(ctx.config).flatMap((r: RoomConfig) => [
    ...(r.devices ?? []).map((d) => d.entity).filter((id) => domainOf(id) === "lock"),
    ...(r.car_lock ? [r.car_lock] : []),
  ]))];

const locksCard = (ctx: Ctx) => {
  const ids = securityLocks(ctx);
  if (!ids.length) return nothing;
  const unlocked = ids.filter((id) => { const s = ctx.hass.states[id]; return !isInvalid(s) && s!.state !== "locked"; }).length;
  return html`<section class="glass card">
    <div class="row"><h2>${glyph("lock", 20)}Locks</h2><span class="n t2" style="font-size:12px">${unlocked ? `${unlocked} not locked` : "All locked"}</span></div>
    <div class="slist">
      ${ids.map((id) => {
        const s = ctx.hass.states[id];
        const bad = isInvalid(s);
        const locked = s?.state === "locked";
        const moving = ["locking", "unlocking", "opening"].includes(s?.state ?? "");
        const name = label(ctx, id);
        // HA lock.lock / lock.unlock; a lock with code_format opens the HA dialog, which asks for the code.
        const act = () => {
          if (s?.attributes.code_format) return ctx.moreInfo(id);
          if (locked) ctx.confirm(`Unlock ${name}?`, `${name} is locked.`, () => ctx.call("lock", "unlock", { entity_id: id }), "Unlock");
          else ctx.call("lock", "lock", { entity_id: id });
        };
        return sRow(ctx, id, !s ? "Not found" : bad ? "Unavailable" : formatState(ctx.hass, s), bad ? "na" : locked ? "" : "warn",
          html`<button class="sq sbtn" ?disabled=${bad || moving} @click=${act}>${glyph(locked ? "unlock" : "lock", 16)}<span>${locked ? "Unlock" : "Lock"}</span></button>`);
      })}
    </div>
  </section>`;
};

const motionCard = (ctx: Ctx) => {
  const ids = [...new Set(rooms(ctx.config).flatMap((r) => (r.devices ?? []).map((d) => d.entity)))].filter((id) => isMotion(ctx.hass.states[id]));
  if (!ids.length) return nothing;
  const on = ids.filter((id) => ctx.hass.states[id]?.state === "on");
  const sorted = [...ids].sort((x, y) => Number(ctx.hass.states[y]?.state === "on") - Number(ctx.hass.states[x]?.state === "on"));
  return html`<section class="glass card">
    <div class="row"><h2>${glyph("motion", 20)}Motion and presence</h2><span class="n t2" style="font-size:12px">${on.length ? `${on.length} detected` : "All clear"}</span></div>
    <div class="slist">
      ${sorted.map((id) => {
        const s = ctx.hass.states[id];
        const bad = isInvalid(s);
        return sRow(ctx, id, !s ? "Not found" : bad ? "Unavailable" : formatState(ctx.hass, s), bad ? "na" : s!.state === "on" ? "open" : "");
      })}
    </div>
  </section>`;
};

/** A 16:9 still of a camera (refreshed with the 10 s tick); private cameras stay hidden. */
export const cameraStill = (ctx: Ctx, camera: string | undefined, name: string, open: () => void, priv = false) => {
  const cam = stateObj(ctx.hass, camera);
  const ok = !priv && !!cam && !isInvalid(cam) && !!cam.attributes.entity_picture;
  // Still frame from /api/camera_proxy (width/height scale it server side), refreshed with the 10 s tick.
  const src = ok ? `${cam!.attributes.entity_picture}&width=640&height=360&t=${Math.floor(ctx.tick / 10_000)}` : undefined;
  const na = !priv && !ok;
  return html`<button class="cam ${na ? "na" : ""}" aria-label="${name} camera" @click=${open}>
    ${src ? html`<img src=${src} alt="" />` : html`<span class="camna">${icon("camera", 22)}${priv ? "Private · open the room" : camera ? "Camera unavailable" : "No camera"}</span>`}
    <span class="lbl"><i class="dotst ${na ? "na" : ""}"></i>${name}</span>
  </button>`;
};

const camerasCard = (ctx: Ctx) => {
  const groups = houseCameraGroups(ctx.config);
  if (!groups.length) return nothing;
  return html`<section class="glass card">
    <div class="row"><h2>${icon("camera", 20)}Cameras</h2><span class="n t2" style="font-size:12px">${groups.length} camera${groups.length === 1 ? "" : "s"} · stills every 10 s</span></div>
    <div class="cams scams">
      ${groups.map((g) => cameraStill(ctx, g.camera, g.rooms.map((r) => r.name).join(" · "), () => ctx.openRoom(g.rooms[0]), g.rooms.some((r) => r.camera_private)))}
    </div>
  </section>`;
};

export const renderSecurity = (ctx: Ctx) => {
  const alarm = stateObj(ctx.hass, ctx.config.entities?.alarm);
  const contacts = securityContacts(ctx);
  const open = contacts.filter((id) => !isInvalid(ctx.hass.states[id]) && isOpen(ctx.hass.states[id])).length;
  const cams = houseCameraGroups(ctx.config).length;
  const parts = [
    alarm ? (isInvalid(alarm) ? "Alarm unavailable" : `Alarm ${formatState(ctx.hass, alarm).toLowerCase()}`) : "",
    contacts.length ? `${open} open` : "",
    cams ? `${cams} camera${cams === 1 ? "" : "s"}` : "",
  ].filter(Boolean);
  return html`
    <section class="hero" aria-label="Security">
      <h1 class="sm">Security</h1>
      <p class="n">${parts.join(" · ")}</p>
    </section>
    <div class="sec-grid">
      <div class="col">${alarmCard(ctx)}${doorsCard(ctx)}${locksCard(ctx)}</div>
      <div class="col">${camerasCard(ctx)}${motionCard(ctx)}</div>
    </div>
  `;
};
