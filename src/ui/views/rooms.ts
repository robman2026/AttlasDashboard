import { html, nothing } from "lit";
import type { FloorConfig } from "../../config/types";
import type { Ctx } from "../context";
import { isInvalid, num, stateObj } from "../../data/hass";
import { cameraOf, floorById, floors, roomsOnFloor } from "../../data/model";
import { roomTile } from "./common";

/** Camera wall: every camera on the floor, side by side (stacked on the phone). */
const cameraWall = (ctx: Ctx, f: FloorConfig) => {
  const mode = f.cameras ?? "off";
  if (mode === "off") return nothing;
  const rooms = roomsOnFloor(ctx.config, f.id).filter((r) => cameraOf(r));
  if (!rooms.length) return nothing;
  const live = mode === "live" && !!customElements.get("ha-camera-stream");
  const bucket = Math.floor(ctx.tick / 10_000);
  return html`<section class="glass card" style="padding:16px;gap:12px">
    <div class="row" style="padding:0 4px">
      <h2 style="font-size:20px">Cameras on ${f.name}</h2>
      <span class="t2" style="font-size:12px">${mode === "live" ? "Live, muted" : "Snapshots every 10 s"} · tap a name for the room</span>
    </div>
    <div class="camwall" style="--cols:${rooms.length <= 3 ? rooms.length : rooms.length === 4 ? 2 : 3}">
      ${rooms.map((r) => {
        const id = cameraOf(r)!;
        const s = stateObj(ctx.hass, id);
        const pic = s?.attributes.entity_picture as string | undefined;
        let body;
        if (r.camera_private) body = html`<div class="camslot private"><span class="t2" style="font-size:12px">Private camera · open the room to reveal</span></div>`;
        else if (isInvalid(s)) body = html`<div class="camslot"><b style="font-size:13px">Camera unavailable</b></div>`;
        else if (live) body = html`<div class="camslot live"><ha-camera-stream .hass=${ctx.hass} .stateObj=${s} .fitMode=${"cover"} muted></ha-camera-stream></div>`;
        else body = html`<div class="camslot live">${pic ? html`<img src=${`${pic}&width=960&height=540&t=${bucket}`} alt="${r.name} camera" loading="lazy" />` : html`<span class="t2" style="font-size:12px">Waiting for picture</span>`}</div>`;
        return html`<div class="camtile">
          <button class="camname" @click=${() => ctx.openRoom(r)}><i class="dotst ${isInvalid(s) ? "na" : ""}"></i>${r.name}</button>
          ${body}
        </div>`;
      })}
    </div>
  </section>`;
};

const floorSummary = (ctx: Ctx, floorId: string) => {
  const rs = roomsOnFloor(ctx.config, floorId);
  const temps = rs.filter((r) => !ctx.hot.has(r.id)).map((r) => num(ctx.hass, r.temperature)).filter((t): t is number => t !== undefined);
  const typical = temps.length ? `${(temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)} °C typical` : "no sensors";
  const issues = rs.filter((r) => ctx.badges.has(r.id)).length;
  return typical + (issues ? ` · ${issues} alert${issues > 1 ? "s" : ""}` : "");
};

export const renderRooms = (ctx: Ctx) => {
  const fl = floors(ctx.config);
  const cur = floorById(ctx.config, ctx.floorId) ?? fl[0];
  const total = ctx.config.rooms?.length ?? 0;
  const unassigned = (ctx.config.rooms ?? []).filter((r) => !r.floor || !floorById(ctx.config, r.floor));
  const list = cur ? roomsOnFloor(ctx.config, cur.id) : unassigned;
  return html`
    <section class="hero">
      <h1 class="sm">Rooms</h1>
      <p>${fl.length} floors · ${total} rooms · pick a floor, then a room</p>
    </section>
    <div class="floors">
      ${fl.map((f) => {
        const n = roomsOnFloor(ctx.config, f.id).length;
        return html`<button class="glass fl ${f.id === cur?.id ? "on" : ""}" @click=${() => ctx.go(`floor-${f.id}`)}>
          <span class="row" style="align-items:baseline"><span class="lv n">${f.level ?? ""}</span><small>${n} room${n === 1 ? "" : "s"}</small></span>
          <span style="font-size:16px;font-weight:600">${f.name}</span>
          <small class="n">${floorSummary(ctx, f.id)}</small>
        </button>`;
      })}
    </div>
    <section class="glass card" style="flex:1;padding:16px">
      <div class="row" style="padding:0 4px">
        <h2 style="font-size:20px">${cur ? `${cur.name}${cur.level ? ` · level ${cur.level}` : ""}` : "Rooms"}</h2>
        <span class="t2" style="font-size:12px">Tap a room for its devices</span>
      </div>
      <div class="tiles floor">
        ${list.map((r) => roomTile(ctx, r, "", `${(r.devices ?? []).length} devices`))}
      </div>
    </section>
    ${cur ? cameraWall(ctx, cur) : nothing}
  `;
};
