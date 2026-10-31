import { html } from "lit";
import type { Ctx } from "../context";
import { num } from "../../data/hass";
import { floorById, floors, roomsOnFloor } from "../../data/model";
import { roomTile } from "./common";

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
  `;
};
