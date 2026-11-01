// Optional room sections, all driven by room config (nothing shows unless configured):
// status strip, extra climate values, 3D printer card, automations card.
import { html, nothing } from "lit";
import type { RoomConfig } from "../../config/types";
import type { Ctx } from "../context";
import { formatState, isInvalid, num, stateObj, domainOf } from "../../data/hass";
import { icon, glyph } from "../icons";
import { deviceLabel, glyphFor } from "../devices";
import { timeAgo } from "../time";

const val = (ctx: Ctx, id?: string) => {
  const s = stateObj(ctx.hass, id);
  return !s ? "–" : isInvalid(s) ? "–" : formatState(ctx.hass, s);
};

/** Duration sensor to "2 h 14 min" (state unit s, min or h; HA may convert to the suggested unit). */
const duration = (ctx: Ctx, id?: string) => {
  const v = num(ctx.hass, id);
  if (v === undefined) return undefined;
  const unit = String(stateObj(ctx.hass, id)?.attributes.unit_of_measurement ?? "min");
  const mins = unit === "s" ? v / 60 : unit === "h" ? v * 60 : unit === "d" ? v * 1440 : v;
  const m = Math.max(0, Math.round(mins));
  return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`;
};

export const hasPrinter = (r: RoomConfig) => !!(r.printer_status || r.printer_progress);

const roomLightIds = (ctx: Ctx, r: RoomConfig) => {
  const excluded = new Set(ctx.config.entities?.exclude_lights ?? []);
  return (r.devices ?? []).map((d) => d.entity).filter((id) => id.startsWith("light.") && !excluded.has(id));
};

/** Chips under the room title: alerts, lights, unavailable devices, printer. */
export const statusStrip = (ctx: Ctx, r: RoomConfig) => {
  const alerts = ctx.alerts.filter((a) => a.room === r.id);
  const lights = roomLightIds(ctx, r);
  const on = lights.filter((id) => ctx.hass.states[id]?.state === "on");
  const na = (r.devices ?? []).filter((d) => {
    const s = ctx.hass.states[d.entity];
    return !s || s.state === "unavailable";
  }).length;
  const p = hasPrinter(r) ? num(ctx.hass, r.printer_progress) : undefined;
  return html`<div class="strip">
    <button class="schip ${alerts.length ? "warn" : "ok"}" @click=${() => ctx.go("alerts")}>
      ${alerts.length ? glyph("dot", 18) : html`<span class="okdot">✓</span>`}
      <span><b>${alerts.length ? `${alerts.length} alert${alerts.length > 1 ? "s" : ""}` : "All OK"}</b><small>${alerts.length ? alerts[0].title : "No alerts"}</small></span>
    </button>
    ${lights.length
      ? html`<button class="schip ${on.length ? "on" : ""}" title=${on.length ? "Turn the room lights off" : "Turn the room lights on"}
          @click=${() => ctx.call("light", on.length ? "turn_off" : "turn_on", { entity_id: on.length ? on : lights })}>
          ${glyph("bulb", 18)}<span><b>Lights</b><small>${on.length ? `${on.length} of ${lights.length} on` : "All off"}</small></span>
        </button>`
      : nothing}
    ${hasPrinter(r)
      ? html`<button class="schip" @click=${() => r.printer_status && ctx.moreInfo(r.printer_status)}>
          ${glyph("printer", 18)}<span><b>${r.printer_name || "3D printer"}</b><small>${val(ctx, r.printer_status)}${p !== undefined ? ` · ${Math.round(p)} %` : ""}</small>
          ${p !== undefined ? html`<i class="sbar"><i style="width:${Math.max(0, Math.min(100, p))}%"></i></i>` : nothing}</span>
        </button>`
      : nothing}
    ${na ? html`<span class="schip warn"><span><b>${na} unavailable</b><small>device${na > 1 ? "s" : ""} in this room</small></span></span>` : nothing}
  </div>`;
};

/** Extra values (CO2, pressure, ...) below temperature and humidity. */
export const climateExtras = (ctx: Ctx, r: RoomConfig) => {
  const list = r.climate_extra ?? [];
  if (!list.length) return nothing;
  return html`<div class="cextra">
    ${list.map((d) => {
      const s = ctx.hass.states[d.entity];
      return html`<button class="cx" @click=${() => ctx.moreInfo(d.entity)}>
        <span class="cxi">${d.icon ? html`<ha-icon .icon=${d.icon} style="--mdc-icon-size:18px"></ha-icon>` : glyph(glyphFor(d.entity, s), 18)}</span>
        <span><b class="n">${val(ctx, d.entity)}</b><small>${deviceLabel(ctx.hass, d)}</small></span>
      </button>`;
    })}
  </div>`;
};

/** 3D printer card: progress, remaining time, temperatures, light and job buttons. */
export const printerCard = (ctx: Ctx, r: RoomConfig) => {
  if (!hasPrinter(r)) return nothing;
  const p = num(ctx.hass, r.printer_progress);
  const left = duration(ctx, r.printer_remaining);
  const pic = stateObj(ctx.hass, r.printer_picture)?.attributes.entity_picture as string | undefined;
  const bucket = Math.floor(ctx.tick / 10_000);
  const temps = ([["Nozzle", r.printer_nozzle], ["Bed", r.printer_bed], ["Chamber", r.printer_chamber]] as const).filter(([, id]) => id);
  const light = stateObj(ctx.hass, r.printer_light);
  const press = (id?: string) => id && ctx.call("button", "press", { entity_id: id });
  return html`<section class="glass card printer">
    <div class="row">
      <h2>${glyph("printer", 20)}${r.printer_name || "3D printer"}</h2>
      <button class="pstatus" @click=${() => r.printer_status && ctx.moreInfo(r.printer_status)}>${val(ctx, r.printer_status)}</button>
    </div>
    <div class="pbody">
      ${pic ? html`<button class="ppic" @click=${() => ctx.moreInfo(r.printer_picture!)}><img src=${`${pic}${pic.includes("?") ? "&" : "?"}t=${bucket}`} alt="" /></button>` : nothing}
      <button class="pnum" @click=${() => r.printer_progress && ctx.moreInfo(r.printer_progress)}>
        <b class="n">${p === undefined ? "–" : `${Math.round(p)} %`}</b>
        <span class="t2">${left ? `${left} remaining` : r.printer_remaining ? "no time estimate" : ""}</span>
      </button>
    </div>
    <span class="bar"><span style="width:${p === undefined ? 0 : Math.max(0, Math.min(100, p))}%;background:var(--atlas-accent)"></span></span>
    ${temps.length
      ? html`<div class="ptemps">${temps.map(([label, id]) => html`<button @click=${() => ctx.moreInfo(id!)}><b class="n">${val(ctx, id)}</b><small>${label}</small></button>`)}</div>`
      : nothing}
    ${r.printer_light || r.printer_pause || r.printer_resume || r.printer_stop
      ? html`<div class="pbtns">
          ${r.printer_light ? html`<button class="sq ${light?.state === "on" ? "on" : ""}" title="Chamber light" @click=${() => ctx.call(domainOf(r.printer_light!), "toggle", { entity_id: r.printer_light })}>${glyph("bulb", 20)}</button>` : nothing}
          ${r.printer_pause ? html`<button class="sq" title="Pause" @click=${() => press(r.printer_pause)}>Pause</button>` : nothing}
          ${r.printer_resume ? html`<button class="sq" title="Resume" @click=${() => press(r.printer_resume)}>Resume</button>` : nothing}
          ${r.printer_stop ? html`<button class="sq stop" title="Stop" @click=${() => ctx.confirm("Stop the print?", "The current print job will be cancelled.", () => press(r.printer_stop), "Stop print")}>Stop</button>` : nothing}
        </div>`
      : nothing}
  </section>`;
};

/** Automations with on/off switch and last run. */
export const automationsCard = (ctx: Ctx, r: RoomConfig) => {
  const list = r.automations ?? [];
  if (!list.length) return nothing;
  return html`<section class="glass card autos">
    <h2>${icon("automations", 20)}Automations</h2>
    ${list.map((id) => {
      const s = ctx.hass.states[id];
      const on = s?.state === "on";
      const last = s?.attributes.last_triggered as string | undefined;
      return html`<div class="auto">
        <button class="atxt" @click=${() => ctx.moreInfo(id)}>
          <b>${String(s?.attributes.friendly_name ?? id)}</b>
          <small class="t2">${isInvalid(s) ? "Unavailable" : last ? `Last run ${timeAgo(ctx.hass, last)}` : "Never run"}</small>
        </button>
        <button class="tog ${on ? "on" : ""}" role="switch" aria-checked=${on ? "true" : "false"} aria-label="Enable ${String(s?.attributes.friendly_name ?? id)}"
          ?disabled=${isInvalid(s)} @click=${() => ctx.call("automation", "toggle", { entity_id: id })}><i></i></button>
      </div>`;
    })}
  </section>`;
};
