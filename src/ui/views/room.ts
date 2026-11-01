import { html, nothing } from "lit";
import type { RoomConfig } from "../../config/types";
import type { Ctx } from "../context";
import { isInvalid, num, stateObj, domainOf } from "../../data/hass";
import { floorById, imageUrl, roomById, roomsOnFloor, rooms } from "../../data/model";
import { icon, glyph } from "../icons";
import { TOGGLE_DOMAINS, deviceLabel, glyphFor, kindOf, stateText } from "../devices";
import { fmtHum, fmtTemp } from "./common";
import { stamp, stampTitle, timeAgo } from "../time";
import { automationsCard, climateExtras, printerCard, statusStrip } from "./room-extras";

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
  const ago = timeAgo(ctx.hass, stamp(s, ctx.config.appearance?.time_display));
  return html`<button class="dev ${k}" title=${stampTitle(ctx.hass, s) || d.entity}
    @pointerdown=${h.down} @pointerup=${h.up} @pointerleave=${h.up} @click=${h.click} @contextmenu=${h.context}>
    <span class="chipi">${d.icon ? html`<ha-icon .icon=${d.icon} style="--mdc-icon-size:20px"></ha-icon>` : glyph(glyphFor(d.entity, s))}</span>
    <span class="txt"><b>${deviceLabel(ctx.hass, d)}</b><span>${stateText(ctx.hass, s)}</span>${ago ? html`<small class="ago n">${ago}</small>` : nothing}</span>
  </button>`;
};

const cameraCard = (ctx: Ctx, r: RoomConfig) => {
  if (r.show_camera === false) return nothing; // camera section switched off for this room
  if (!r.camera) {
    return html`<section class="glass card"><h2>Camera</h2>
      <div class="camslot none"><span class="camico">${glyph("camera", 24)}</span><span class="t2" style="font-size:12px">This room has no camera</span></div>
    </section>`;
  }
  const key = `cam:${r.id}`;
  // Live by default: ha-camera-stream renders its HLS / WebRTC player with autoplay + playsinline, muted here.
  const mode = (ctx.ui[key] as string) ?? "live";
  const revealed = !r.camera_private || ctx.ui[`reveal:${r.id}`] === true;
  const cam = stateObj(ctx.hass, r.camera);
  const snapEnt = stateObj(ctx.hass, r.camera_snapshot) ?? cam;
  const set = (m: string) => {
    ctx.ui[key] = m;
    ctx.refresh();
  };
  const streamReady = !!customElements.get("ha-camera-stream");
  let slot;
  if (!revealed) {
    slot = html`<div class="camslot private"><span class="camico">${glyph("camera", 24)}</span>
      <b style="font-size:14px">${r.name} camera · private</b><span class="t2" style="font-size:12px">Stream hidden until you tap Reveal</span>
      <button class="ctl" @click=${() => { ctx.ui[`reveal:${r.id}`] = true; ctx.refresh(); }}>Reveal</button></div>`;
  } else if (isInvalid(cam)) {
    slot = html`<div class="camslot"><span class="camico">${glyph("camera", 24)}</span><b style="font-size:14px">Camera unavailable</b><span class="t2" style="font-size:12px">${r.camera}</span></div>`;
  } else if (mode === "live" && streamReady) {
    slot = html`<div class="camslot live"><ha-camera-stream .hass=${ctx.hass} .stateObj=${cam} .fitMode=${"cover"} controls muted></ha-camera-stream></div>`;
  } else if (mode === "snapshot" && snapEnt?.attributes.entity_picture) {
    slot = html`<div class="camslot live"><img src=${`${snapEnt.attributes.entity_picture}&t=${ctx.ui[`${key}:t`] ?? 0}`} alt="${r.name} snapshot" /></div>`;
  } else {
    // Stream element still loading: show the current still frame meanwhile.
    const still = cam?.attributes.entity_picture;
    slot = html`<div class="camslot live">${still ? html`<img src=${`${still}&width=1280&height=720`} alt="" />` : nothing}
      <span class="camwait">Starting live stream…</span></div>`;
  }
  const btn = (label: string, on: boolean, fn: () => void) =>
    html`<button class="sq ${on ? "on" : ""}" style="color:var(--atlas-text)" @click=${fn}>${label}</button>`;
  return html`<section class="glass card">
    <div class="row"><h2>Camera</h2>
      <span style="display:flex;gap:10px;align-items:center">
        ${revealed && !isInvalid(cam) && mode === "live" ? html`<span class="livetag"><i></i>Live</span>` : nothing}
        ${r.camera_private && revealed ? html`<button class="t2" style="font-size:12px" @click=${() => { ctx.ui[`reveal:${r.id}`] = false; set("live"); }}>Hide</button>` : nothing}
      </span>
    </div>
    ${slot}
    ${revealed && !isInvalid(cam)
      ? html`<div class="btn3" style="margin-top:0">
          ${btn("Live", mode === "live", () => (streamReady ? set("live") : ctx.moreInfo(r.camera!)))}
          ${btn("Snapshot", mode === "snapshot", () => { ctx.ui[`${key}:t`] = Date.now(); set("snapshot"); })}
          ${btn("Recordings", false, () => ctx.href("/media-browser/browser"))}
        </div>`
      : nothing}
  </section>`;
};

/** Own Lovelace cards from the room config (cards / side_cards). Accepts one card or a list of cards. */
const ownCards = (ctx: Ctx, value: RoomConfig["cards"], cls: string) => {
  const list = (Array.isArray(value) ? value : value && typeof value === "object" ? [value] : []).filter(
    (c) => c && typeof c === "object"
  );
  return list.length
    ? html`<div class="owncards ${cls}">${list.map((c) => html`<atlas-hui-card .config=${c} .hass=${ctx.hass}></atlas-hui-card>`)}</div>`
    : nothing;
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
  const tMode = ctx.config.appearance?.time_display;
  const agoOf = (id?: string) => {
    const s = stateObj(ctx.hass, id);
    const a = timeAgo(ctx.hass, stamp(s, tMode));
    return a ? html`<small class="ago n" title=${stampTitle(ctx.hass, s)}>${a}</small>` : nothing;
  };
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
        ${statusStrip(ctx, r)}
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
                  <span class="lbl">${icon("temperature", 16)}Temperature${agoOf(r.temperature)}</span>
                  <span class="big n" style="color:${ctx.hot.has(r.id) ? "var(--atlas-crit)" : "inherit"}">${t === undefined ? "–" : `${t.toFixed(1)}°`}</span>
                  <span class="bar">${t !== undefined ? html`<span style="width:${Math.round(Math.max(0.05, Math.min(1, (t - 10) / 30)) * 100)}%;background:${tone}"></span>` : nothing}</span>
                </button>
                <button class="metric" @click=${() => r.humidity && ctx.moreInfo(r.humidity)}>
                  <span class="lbl">${icon("humidity", 16)}Humidity${agoOf(r.humidity)}</span>
                  <span class="big n">${h === undefined ? "–" : `${Math.round(h)} %`}</span>
                  <span class="bar">${h !== undefined ? html`<span style="width:${Math.round(Math.min(100, h))}%;background:${h < 25 ? "var(--atlas-warn)" : "#5EC8FF"}"></span>` : nothing}</span>
                </button>
              </div>`
            : html`<span class="t2" style="font-size:14px">No temperature sensor in this room yet.</span>`}
          ${climateExtras(ctx, r)}
        </section>
        ${cameraCard(ctx, r)}
        ${printerCard(ctx, r)}
        ${ownCards(ctx, r.side_cards, "side")}
      </div>
      <div class="col">
        <section class="glass card devcard ${img ? "has-img" : ""}" style="flex:1;padding:18px">
          ${img ? html`<img class="devbg" src=${img} alt="" /><span class="devshade" aria-hidden="true"></span>` : nothing}
          <div class="row"><h2>Devices</h2><span class="n t2" style="font-size:12px">${devs.length} device${devs.length === 1 ? "" : "s"} · tap to toggle, hold for details</span></div>
          ${devs.length ? html`<div class="devs">${devs.map((d) => deviceTile(ctx, d))}</div>` : html`<span class="t2" style="font-size:14px">No devices mapped to this room.</span>`}
        </section>
        ${automationsCard(ctx, r)}
        ${ownCards(ctx, r.cards, "main")}
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
