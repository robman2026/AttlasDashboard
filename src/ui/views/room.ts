import { html, nothing } from "lit";
import type { RoomConfig } from "../../config/types";
import type { Ctx } from "../context";
import { isInvalid, num, stateObj, domainOf } from "../../data/hass";
import { floorById, imageUrl, roomById, roomsOnFloor, rooms } from "../../data/model";
import { icon, glyph } from "../icons";
import { TOGGLE_DOMAINS, deviceLabel, glyphFor, kindOf, stateText } from "../devices";
import { fmtHum, fmtTemp } from "./common";

const LONG_PRESS_MS = 500;

/** Tap: toggle for lights/switches/fans/input_boolean, else more-info. Long press or right click: more-info. */
const pressHandlers = (ctx: Ctx, entity: string) => {
  let timer: number | undefined;
  let long = false;
  const toggleable = TOGGLE_DOMAINS.includes(domainOf(entity));
  return {
    down: () => {
      long = false;
      timer = window.setTimeout(() => {
        long = true;
        ctx.moreInfo(entity);
      }, LONG_PRESS_MS);
    },
    up: () => window.clearTimeout(timer),
    click: () => {
      if (long) return;
      const s = ctx.hass.states[entity];
      if (toggleable && !isInvalid(s)) ctx.call(domainOf(entity), "toggle", { entity_id: entity });
      else ctx.moreInfo(entity);
    },
    context: (e: Event) => {
      e.preventDefault();
      window.clearTimeout(timer);
      long = true;
      ctx.moreInfo(entity);
    },
  };
};

const deviceTile = (ctx: Ctx, d: NonNullable<RoomConfig["devices"]>[number]) => {
  const s = ctx.hass.states[d.entity];
  const k = kindOf(s);
  const h = pressHandlers(ctx, d.entity);
  return html`<button class="dev ${k}" title=${d.entity}
    @pointerdown=${h.down} @pointerup=${h.up} @pointerleave=${h.up} @click=${h.click} @contextmenu=${h.context}>
    <span class="chipi">${d.icon ? html`<ha-icon .icon=${d.icon} style="--mdc-icon-size:20px"></ha-icon>` : glyph(glyphFor(d.entity, s))}</span>
    <span class="txt"><b>${deviceLabel(ctx.hass, d)}</b><span>${stateText(ctx.hass, s)}</span></span>
  </button>`;
};

const cameraCard = (ctx: Ctx, r: RoomConfig) => {
  if (!r.camera) {
    return html`<section class="glass card"><h2>Camera</h2>
      <div class="camslot none"><span class="camico">${glyph("camera", 24)}</span><span class="t2" style="font-size:12px">This room has no camera</span></div>
    </section>`;
  }
  const key = `cam:${r.id}`;
  const mode = (ctx.ui[key] as string) ?? "idle";
  const revealed = !r.camera_private || ctx.ui[`reveal:${r.id}`] === true;
  const cam = stateObj(ctx.hass, r.camera);
  const snapEnt = stateObj(ctx.hass, r.camera_snapshot) ?? cam;
  const set = (m: string) => {
    ctx.ui[key] = m;
    ctx.refresh();
  };
  let slot;
  if (!revealed) {
    slot = html`<div class="camslot private"><span class="camico">${glyph("camera", 24)}</span>
      <b style="font-size:14px">${r.name} camera · private</b><span class="t2" style="font-size:12px">Stream hidden until you tap Reveal</span>
      <button class="ctl" @click=${() => { ctx.ui[`reveal:${r.id}`] = true; ctx.refresh(); }}>Reveal</button></div>`;
  } else if (isInvalid(cam)) {
    slot = html`<div class="camslot"><span class="camico">${glyph("camera", 24)}</span><b style="font-size:14px">Camera unavailable</b><span class="t2" style="font-size:12px">${r.camera}</span></div>`;
  } else if (mode === "live" && customElements.get("ha-camera-stream")) {
    slot = html`<div class="camslot"><ha-camera-stream .hass=${ctx.hass} .stateObj=${cam} controls muted></ha-camera-stream></div>`;
  } else if (mode === "snapshot" && snapEnt?.attributes.entity_picture) {
    slot = html`<div class="camslot"><img src=${`${snapEnt.attributes.entity_picture}&t=${ctx.ui[`${key}:t`] ?? 0}`} alt="${r.name} snapshot" /></div>`;
  } else {
    slot = html`<div class="camslot"><span class="camico">${glyph("camera", 24)}</span><b style="font-size:14px">${String(cam!.attributes.friendly_name ?? r.camera)}</b><span class="t2" style="font-size:12px">Live stream slot · loads on tap</span></div>`;
  }
  return html`<section class="glass card">
    <div class="row"><h2>Camera</h2>${r.camera_private && revealed ? html`<button class="t2" style="font-size:12px" @click=${() => { ctx.ui[`reveal:${r.id}`] = false; set("idle"); }}>Hide</button>` : nothing}</div>
    ${slot}
    ${revealed && !isInvalid(cam)
      ? html`<div class="btn3" style="margin-top:0">
          <button class="sq" style="color:var(--atlas-text)" @click=${() => (customElements.get("ha-camera-stream") ? set("live") : ctx.moreInfo(r.camera!))}>Live</button>
          <button class="sq" style="color:var(--atlas-text)" @click=${() => { ctx.ui[`${key}:t`] = Date.now(); set("snapshot"); }}>Snapshot</button>
          <button class="sq" style="color:var(--atlas-text)" @click=${() => ctx.href("/media-browser/browser")}>Recordings</button>
        </div>`
      : nothing}
  </section>`;
};

export const renderRoom = (ctx: Ctx) => {
  const r = roomById(ctx.config, ctx.roomId);
  if (!r) return html`<section class="glass card"><p class="empty">Room "${ctx.roomId}" is not in the config.</p></section>`;
  const f = floorById(ctx.config, r.floor);
  const peers = f ? roomsOnFloor(ctx.config, f.id) : rooms(ctx.config);
  const i = peers.findIndex((x) => x.id === r.id);
  const prev = peers[(i - 1 + peers.length) % peers.length];
  const next = peers[(i + 1) % peers.length];
  const t = num(ctx.hass, r.temperature);
  const h = num(ctx.hass, r.humidity);
  const badge = ctx.badges.get(r.id);
  const devs = r.devices ?? [];
  const img = imageUrl(ctx.config, r);
  const tone = t === undefined ? "" : t < 16 ? "#5EC8FF" : t > 30 ? "var(--atlas-crit)" : "var(--atlas-accent)";
  const summary = [t !== undefined ? fmtTemp(t) : "", h !== undefined ? fmtHum(h) : "", `${devs.length} device${devs.length === 1 ? "" : "s"}`].filter(Boolean).join(" · ");
  const hasClimate = r.temperature || r.humidity;
  return html`
    <nav class="crumb" aria-label="Breadcrumb">
      <button @click=${() => ctx.go("home")}>Home</button><span aria-hidden="true">›</span>
      ${f ? html`<button @click=${() => ctx.go(`floor-${f.id}`)}>${f.name}</button><span aria-hidden="true">›</span>` : nothing}
      <b>${r.name}</b>
    </nav>
    <section class="rhead">
      <div>
        <div class="title">${icon(r.icon, 44)}<h1>${r.name}</h1>${badge ? html`<span class="badge ${badge.severity === "critical" ? "critical" : ""}">${badge.text}</span>` : nothing}</div>
        <p class="n t2">${f ? html`${f.name} <span style="opacity:.5">·</span> ` : nothing}${summary}</p>
      </div>
      ${peers.length > 1
        ? html`<div style="display:flex;gap:8px">
            <button class="ctl" aria-label="Previous room" @click=${() => ctx.openRoom(prev)}>‹ ${prev.name}</button>
            <button class="ctl" aria-label="Next room" @click=${() => ctx.openRoom(next)}>${next.name} ›</button>
          </div>`
        : nothing}
    </section>
    <div class="room-grid">
      <div class="col">
        <section class="glass card" style="gap:16px">
          <h2>Climate</h2>
          ${hasClimate
            ? html`<div class="metrics">
                <button class="metric" @click=${() => r.temperature && ctx.moreInfo(r.temperature)}>
                  <span class="lbl">${icon("temperature", 16)}Temperature</span>
                  <span class="big n" style="color:${ctx.hot.has(r.id) ? "var(--atlas-crit)" : "inherit"}">${t === undefined ? "–" : `${t.toFixed(1)}°`}</span>
                  <span class="bar">${t !== undefined ? html`<span style="width:${Math.round(Math.max(0.05, Math.min(1, (t - 10) / 30)) * 100)}%;background:${tone}"></span>` : nothing}</span>
                </button>
                <button class="metric" @click=${() => r.humidity && ctx.moreInfo(r.humidity)}>
                  <span class="lbl">${icon("humidity", 16)}Humidity</span>
                  <span class="big n">${h === undefined ? "–" : `${Math.round(h)} %`}</span>
                  <span class="bar">${h !== undefined ? html`<span style="width:${Math.round(Math.min(100, h))}%;background:${h < 25 ? "var(--atlas-warn)" : "#5EC8FF"}"></span>` : nothing}</span>
                </button>
              </div>`
            : html`<span class="t2" style="font-size:14px">No temperature sensor in this room yet.</span>`}
        </section>
        ${cameraCard(ctx, r)}
      </div>
      <div class="col">
        <section class="glass card" style="flex:1;padding:18px">
          <div class="row"><h2>Devices</h2><span class="n t2" style="font-size:12px">${devs.length} device${devs.length === 1 ? "" : "s"} · tap to toggle, hold for details</span></div>
          ${devs.length ? html`<div class="devs">${devs.map((d) => deviceTile(ctx, d))}</div>` : html`<span class="t2" style="font-size:14px">No devices mapped to this room.</span>`}
          <div class="roomimg">
            ${img ? html`<img src=${img} alt="" loading="lazy" /><span class="shade"></span>` : nothing}
            <span>${img ? `${r.name} · conceptual room image` : `No room image yet for ${r.name}`}</span>
          </div>
        </section>
        ${peers.length > 1
          ? html`<section class="glass card" style="padding:14px 16px;gap:10px">
              <h2 style="font-size:14px;margin-left:4px">Other rooms on ${f?.name ?? "this floor"}</h2>
              <div class="sibs">
                ${peers.filter((x) => x.id !== r.id).map((x) => {
                  const xt = num(ctx.hass, x.temperature);
                  return html`<button class=${ctx.badges.has(x.id) ? "alert" : ""} @click=${() => ctx.openRoom(x)}>${icon(x.icon, 18)}${x.name}${xt !== undefined ? html` <span class="n" style="opacity:.7">${xt.toFixed(1)}°</span>` : nothing}</button>`;
                })}
              </div>
            </section>`
          : nothing}
      </div>
    </div>
  `;
};
