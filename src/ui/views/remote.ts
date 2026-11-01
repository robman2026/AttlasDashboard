// Remote card for rooms with a TV: media player controls plus navigation keys.
// Command names per TV type come from the official HA integration docs (see docs/architecture.md):
//   android_tv: Android TV Remote, remote.send_command (DPAD_*, BACK, HOME, MENU)
//   samsung:    SamsungTV, remote.send_command (KEY_UP ... KEY_RETURN, KEY_HOME, KEY_MENU)
//   webos:      LG webOS TV, webostv.button on the media player (UP ... ENTER, BACK, HOME, MENU)
//   apple_tv:   Apple TV, remote.send_command (up ... select, menu = back, home, top_menu)
//   roku:       Roku, remote.send_command (up ... select, back, home, info)
import { html, nothing } from "lit";
import type { RemoteType, RoomConfig } from "../../config/types";
import type { Ctx } from "../context";
import { formatState, isInvalid, stateObj } from "../../data/hass";
import { glyph } from "../icons";

type Key = "up" | "down" | "left" | "right" | "ok" | "back" | "home" | "menu";

const KEYS: Record<RemoteType, Record<Key, string>> = {
  android_tv: { up: "DPAD_UP", down: "DPAD_DOWN", left: "DPAD_LEFT", right: "DPAD_RIGHT", ok: "DPAD_CENTER", back: "BACK", home: "HOME", menu: "MENU" },
  samsung: { up: "KEY_UP", down: "KEY_DOWN", left: "KEY_LEFT", right: "KEY_RIGHT", ok: "KEY_ENTER", back: "KEY_RETURN", home: "KEY_HOME", menu: "KEY_MENU" },
  webos: { up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT", ok: "ENTER", back: "BACK", home: "HOME", menu: "MENU" },
  apple_tv: { up: "up", down: "down", left: "left", right: "right", ok: "select", back: "menu", home: "home", menu: "top_menu" },
  roku: { up: "up", down: "down", left: "left", right: "right", ok: "select", back: "back", home: "home", menu: "info" },
};

const ARROW: Record<string, string> = {
  up: "M6 15l6-6 6 6", down: "M6 9l6 6 6-6", left: "M15 6l-6 6 6 6", right: "M9 6l6 6-6 6",
  vol_down: "M4 9v6h4l5 4V5L8 9zM16 12h5", vol_up: "M4 9v6h4l5 4V5L8 9zM16 12h5M18.5 9.5v5",
  mute: "M4 9v6h4l5 4V5L8 9zM16 9l5 6M21 9l-5 6", play: "M7 5v14l11-7zM19 5v14",
  prev: "M6 5v14M18 5L9 12l9 7z", next: "M18 5v14M6 5l9 7-9 7z", back: "M9 14L4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3",
  home: "M4 11l8-7 8 7v9h-5v-6H9v6H4z", menu: "M4 6h16M4 12h16M4 18h16",
};
const ico = (k: string, size = 20) =>
  html`<svg aria-hidden="true" width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d=${ARROW[k]}></path></svg>`;

export const hasRemote = (r: RoomConfig) => !!(r.remote_media_player || r.remote_entity);

export const remoteCard = (ctx: Ctx, r: RoomConfig) => {
  if (!hasRemote(r)) return nothing;
  const mp = stateObj(ctx.hass, r.remote_media_player);
  const rem = stateObj(ctx.hass, r.remote_entity);
  const type = r.remote_type;
  const mpOk = !!mp && !isInvalid(mp);
  const isOn = mpOk && !["off", "standby"].includes(mp!.state);

  // Navigation keys: webOS goes through the media player, the others through the remote entity.
  const navTarget = type === "webos" ? (mpOk ? r.remote_media_player : undefined) : rem && !isInvalid(rem) ? r.remote_entity : undefined;
  const canNav = !!type && !!navTarget;
  const press = (k: Key) => {
    if (!canNav) return;
    const cmd = KEYS[type!][k];
    if (type === "webos") ctx.call("webostv", "button", { entity_id: navTarget, button: cmd });
    else ctx.call("remote", "send_command", { entity_id: navTarget, command: cmd });
  };
  const mpCall = (service: string, data: Record<string, unknown> = {}) =>
    mpOk && ctx.call("media_player", service, { entity_id: r.remote_media_player, ...data });

  const a = mp?.attributes ?? {};
  const title = mp ? String(a.friendly_name ?? r.remote_media_player) : String(rem?.attributes.friendly_name ?? "TV");
  const playing = [a.media_title, a.media_artist].filter(Boolean).join(" · ") || (a.app_name as string) || "";
  const status = mp ? (isInvalid(mp) ? "Unavailable" : formatState(ctx.hass, mp)) : rem ? formatState(ctx.hass, rem) : "";
  const sources = Array.isArray(a.source_list) ? (a.source_list as string[]) : [];
  const nav = (k: Key, label: string, cls = "") =>
    html`<button class="rk ${cls}" aria-label=${label} ?disabled=${!canNav} @click=${() => press(k)}>${k === "ok" ? "OK" : ico(k)}</button>`;
  const mbtn = (k: string, label: string, fn: () => unknown, on = false) =>
    html`<button class="rk sm ${on ? "on" : ""}" aria-label=${label} title=${label} ?disabled=${!mpOk} @click=${fn}>${ico(k, 18)}</button>`;

  return html`<section class="glass card remote">
    <div class="row">
      <h2>${glyph("tv", 20)}Remote</h2>
      <button class="rpower ${isOn ? "on" : ""}" aria-label="Power" ?disabled=${!mpOk && !(rem && !isInvalid(rem))}
        @click=${() => (mpOk ? mpCall("toggle") : ctx.call("remote", "toggle", { entity_id: r.remote_entity }))}>${glyph("power", 18)}</button>
    </div>
    <button class="rnow" @click=${() => (r.remote_media_player ? ctx.moreInfo(r.remote_media_player) : r.remote_entity && ctx.moreInfo(r.remote_entity))}>
      <b>${title}</b><span class="t2">${[...new Set([status, playing, a.source as string].filter(Boolean))].join(" · ")}</span>
    </button>
    ${type
      ? html`<div class="rpad" role="group" aria-label="Navigation">
          <span></span>${nav("up", "Up")}<span></span>
          ${nav("left", "Left")}${nav("ok", "OK", "ok")}${nav("right", "Right")}
          <span></span>${nav("down", "Down")}<span></span>
        </div>
        <div class="rrow">
          <button class="rk sm" aria-label="Back" title="Back" ?disabled=${!canNav} @click=${() => press("back")}>${ico("back", 18)}</button>
          <button class="rk sm" aria-label="Home" title="Home" ?disabled=${!canNav} @click=${() => press("home")}>${ico("home", 18)}</button>
          <button class="rk sm" aria-label="Menu" title="Menu" ?disabled=${!canNav} @click=${() => press("menu")}>${ico("menu", 18)}</button>
        </div>`
      : html`<span class="t2" style="font-size:12px">Set the TV type in Edit dashboard > Rooms > Remote control for the arrow keys.</span>`}
    ${r.remote_media_player
      ? html`<div class="rrow">
          ${mbtn("vol_down", "Volume down", () => mpCall("volume_down"))}
          ${mbtn("mute", "Mute", () => mpCall("volume_mute", { is_volume_muted: !a.is_volume_muted }), !!a.is_volume_muted)}
          ${mbtn("vol_up", "Volume up", () => mpCall("volume_up"))}
        </div>
        <div class="rrow">
          ${mbtn("prev", "Previous", () => mpCall("media_previous_track"))}
          ${mbtn("play", "Play / pause", () => mpCall("media_play_pause"))}
          ${mbtn("next", "Next", () => mpCall("media_next_track"))}
        </div>
        ${sources.length
          ? html`<select class="rsrc" aria-label="Source" ?disabled=${!mpOk} @change=${(e: Event) => mpCall("select_source", { source: (e.target as HTMLSelectElement).value })}>
              ${!a.source ? html`<option value="" selected disabled>Source</option>` : nothing}
              ${sources.map((s) => html`<option value=${s} ?selected=${s === a.source}>${s}</option>`)}
            </select>`
          : nothing}`
      : nothing}
  </section>`;
};
