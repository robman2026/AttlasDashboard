import { html, nothing } from "lit";
import type { RoomConfig, RoomDeviceConfig } from "../../config/types";
import type { Ctx } from "../context";
import { isInvalid, num, stateObj, domainOf } from "../../data/hass";
import { floorById, imageUrl, roomById, roomsOnFloor, rooms } from "../../data/model";
import { icon, glyph } from "../icons";
import { PRESS_DOMAINS, TOGGLE_DOMAINS, confirmCover, coverCan, coverFeatures, deviceLabel, glyphFor, kindOf, stateText, tapAction } from "../devices";
import { fmtHum, fmtTemp, lightMood, ownCards } from "./common";
import { stamp, stampTitle, timeAgo } from "../time";
import { automationsCard, climateExtras, printerCard, statusStrip } from "./room-extras";
import { vehicleCard } from "./vehicle";
import { fanTile } from "./fan";
import { mowerCard, powerCard, saltCard } from "./room-more";

const LONG_PRESS_MS = 500;

/**
 * Tap on a device tile: the tile's tap action (default: toggle for light, switch, fan,
 * input_boolean, details otherwise), asked first when the tile has confirm: true.
 */
const runTap = (ctx: Ctx, d: RoomDeviceConfig) => {
  const s = ctx.hass.states[d.entity];
  const dom = domainOf(d.entity);
  const name = deviceLabel(ctx.hass, d);
  const action = tapAction(d);
  let run: (() => unknown) | undefined;
  let title = "";
  let text = "";
  let ok = "";
  if (action === "toggle" && TOGGLE_DOMAINS.includes(dom) && !isInvalid(s)) {
    const on = s!.state === "on";
    run = () => ctx.call(dom, "toggle", { entity_id: d.entity });
    title = `Turn ${on ? "off" : "on"} ${name}?`;
    text = `${name} is ${stateText(ctx.hass, s).toLowerCase()}.`;
    ok = on ? "Turn off" : "Turn on";
  } else if (action === "press" && PRESS_DOMAINS.includes(dom) && s && s.state !== "unavailable") {
    // A button that was never pressed reports "unknown", so only unavailable blocks it.
    const script = dom === "script";
    run = () => ctx.call(dom, script ? "turn_on" : "press", { entity_id: d.entity });
    title = `${script ? "Run" : "Press"} ${name}?`;
    text = script ? "The script will run now." : "The button will be pressed now.";
    ok = script ? "Run" : "Press";
  }
  if (!run) ctx.moreInfo(d.entity);
  else if (d.confirm) ctx.confirm(title, text, run, ok);
  else run();
};

/** Tap runs the tile's action. Long press or right click: more-info. */
const pressHandlers = (ctx: Ctx, d: RoomDeviceConfig) => {
  let timer: number | undefined;
  let long = false;
  return {
    down: () => {
      long = false;
      timer = window.setTimeout(() => {
        long = true;
        ctx.moreInfo(d.entity);
      }, LONG_PRESS_MS);
    },
    up: () => window.clearTimeout(timer),
    click: () => {
      if (!long) runTap(ctx, d);
    },
    context: (e: Event) => {
      e.preventDefault();
      window.clearTimeout(timer);
      long = true;
      ctx.moreInfo(d.entity);
    },
  };
};

const tileIcon = (d: RoomDeviceConfig, s: ReturnType<typeof stateObj>) =>
  d.icon ? html`<ha-icon .icon=${d.icon} style="--mdc-icon-size:20px"></ha-icon>` : glyph(glyphFor(d.entity, s));

/**
 * Cover tile (full width): state with position, plus Open / Stop / Close for the actions
 * the cover supports. Open and Close ask first for garage doors and gates (or confirm: true).
 * Tapping the tile itself opens the details.
 */
const coverTile = (ctx: Ctx, d: RoomDeviceConfig, ago: string) => {
  const s = ctx.hass.states[d.entity];
  const f = coverFeatures(s);
  const can = coverCan(s);
  const name = deviceLabel(ctx.hass, d);
  const p = s?.attributes.current_position;
  const pos = typeof p === "number" && s && ["open", "opening", "closing"].includes(s.state) ? ` · ${p} %` : "";
  const act = (service: "open_cover" | "close_cover" | "stop_cover", verb: string) => {
    const run = () => ctx.call("cover", service, { entity_id: d.entity });
    if (service !== "stop_cover" && confirmCover(d, s)) ctx.confirm(`${verb} ${name}?`, `${name} is ${stateText(ctx.hass, s).toLowerCase()}.`, run, verb);
    else run();
  };
  const btn = (show: boolean, enabled: boolean, service: "open_cover" | "close_cover" | "stop_cover", verb: string) =>
    show ? html`<button class="sq" aria-label="${verb} ${name}" ?disabled=${!enabled} @click=${() => act(service, verb)}>${verb}</button>` : nothing;
  return html`<div class="dev cover ${kindOf(s)}" title=${stampTitle(ctx.hass, s) || d.entity}>
    <button class="dmain" @click=${() => ctx.moreInfo(d.entity)} @contextmenu=${(e: Event) => { e.preventDefault(); ctx.moreInfo(d.entity); }}>
      <span class="chipi">${tileIcon(d, s)}</span>
      <span class="txt"><b>${name}</b><span>${stateText(ctx.hass, s)}${pos}</span>${ago ? html`<small class="ago n">${ago}</small>` : nothing}</span>
    </button>
    <span class="cbtns">
      ${btn(f.open, can.open, "open_cover", "Open")}${btn(f.stop, can.stop, "stop_cover", "Stop")}${btn(f.close, can.close, "close_cover", "Close")}
    </span>
  </div>`;
};

const deviceTile = (ctx: Ctx, d: RoomDeviceConfig, lights: string[] = []) => {
  const s = ctx.hass.states[d.entity];
  const ago = timeAgo(ctx.hass, stamp(s, ctx.config.appearance?.time_display));
  const f = coverFeatures(s);
  if (domainOf(d.entity) === "cover" && (f.open || f.close || f.stop)) return coverTile(ctx, d, ago);
  if (domainOf(d.entity) === "fan" && tapAction(d) === "toggle") return fanTile(ctx, d, ago, () => runTap(ctx, d), tileIcon(d, s));
  // A room light that is on gets the warm "lit" style, matching the photo glow.
  const k = kindOf(s) === "on" && lights.includes(d.entity) ? "on lit" : kindOf(s);
  const h = pressHandlers(ctx, d);
  return html`<button class="dev ${k}" title=${stampTitle(ctx.hass, s) || d.entity}
    @pointerdown=${h.down} @pointerup=${h.up} @pointerleave=${h.up} @click=${h.click} @contextmenu=${h.context}>
    <span class="chipi">${tileIcon(d, s)}</span>
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
  const mood = img ? lightMood(ctx, r) : undefined;
  // Own left-column cards (e.g. a remote) get their own grid area: a third column on
  // wide screens, below climate and camera on medium ones (see .room-grid.has-side).
  const side = ownCards(ctx, r.side_cards, "side");
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
      <div class="rtitle">
        <div class="title">${icon(r.icon, 32)}<h1>${r.name}</h1>${badge ? html`<span class="badge ${badge.severity === "critical" ? "critical" : ""}">${badge.text}</span>` : nothing}</div>
        <p class="n t2">${f ? html`${f.name} <span style="opacity:.5">·</span> ` : nothing}${summary}</p>
      </div>
      ${statusStrip(ctx, r)}
      ${peers.length > 1
        ? html`<div class="rnav">
            <button class="ctl" aria-label="Previous room" @click=${() => ctx.openRoom(prev)}>‹ ${prev.name}</button>
            <button class="ctl" aria-label="Next room" @click=${() => ctx.openRoom(next)}>${next.name} ›</button>
          </div>`
        : nothing}
    </section>
    <div class="room-grid ${side !== nothing ? "has-side" : ""}">
      <div class="col lcol">
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
        ${powerCard(ctx, r)}
        ${saltCard(ctx, r)}
        ${cameraCard(ctx, r)}
        ${printerCard(ctx, r)}
      </div>
      ${side !== nothing ? html`<div class="col scol">${side}</div>` : nothing}
      <div class="col mcol">
        <section class="glass card devcard ${img ? "has-img" : ""} ${mood ? `mood ${mood.state}` : ""}" style="flex:1;padding:18px;${mood?.vars ?? ""}">
          ${img ? html`<img class="devbg" src=${img} alt="" />${mood ? html`<span class="devglow" aria-hidden="true"></span>` : nothing}<span class="devshade" aria-hidden="true"></span>` : nothing}
          <div class="row"><h2>Devices</h2><span class="n t2" style="font-size:12px">${devs.length} device${devs.length === 1 ? "" : "s"} · tap to toggle, hold for details</span></div>
          ${devs.length ? html`<div class="devs">${devs.map((d) => deviceTile(ctx, d, mood?.ids ?? []))}</div>` : html`<span class="t2" style="font-size:14px">No devices mapped to this room.</span>`}
        </section>
        ${vehicleCard(ctx, r)}
        ${mowerCard(ctx, r)}
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
