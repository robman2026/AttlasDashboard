// Appliances card (porting plan step 9, from the owner's Kitchen Card): oven, dishwasher,
// washer, dryer ... as a list per room (room option `appliances`). Every field is optional
// except the name; works with any integration (field names follow Home Connect entities).
import { html, nothing, svg } from "lit";
import type { ApplianceConfig, RoomConfig } from "../../config/types";
import type { Ctx } from "../context";
import type { HassEntity } from "../../data/hass";
import { domainOf, formatState, isInvalid, num, stateObj } from "../../data/hass";
import { glyph } from "../icons";
import { timeAgo } from "../time";

/** Same "on" rule as the source card. */
const isOnState = (s?: HassEntity) => !!s && ["on", "true", "home", "open"].includes(s.state.toLowerCase());

const label = (ctx: Ctx, id?: string) => {
  const s = stateObj(ctx.hass, id);
  return !s || isInvalid(s) ? "–" : formatState(ctx.hass, s);
};

/** Running: main entity on, or the operation state says run / active / heat / progress (source card rule). */
export const applianceRunning = (ctx: Ctx, a: ApplianceConfig) => {
  if (isOnState(stateObj(ctx.hass, a.entity))) return true;
  const op = stateObj(ctx.hass, a.operation)?.state.toLowerCase() ?? "";
  return ["run", "active", "heat", "progress"].some((w) => op.includes(w));
};

const opTone = (v: string) => {
  const l = v.toLowerCase();
  return l.includes("ready") ? "ready" : ["run", "active", "heat", "progress"].some((w) => l.includes(w)) ? "active" : "idle";
};

/** Finish: a timestamp sensor shows the clock time and how long until then; anything else its state. */
const finishText = (ctx: Ctx, id?: string) => {
  const s = stateObj(ctx.hass, id);
  if (!s || isInvalid(s)) return "–";
  const t = Date.parse(s.state);
  if (s.attributes.device_class === "timestamp" || (Number.isFinite(t) && /\d{4}-\d{2}-\d{2}T/.test(s.state))) {
    const lang = ctx.hass.locale?.language ?? ctx.hass.language ?? "en";
    const at = new Date(t).toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" });
    const mins = Math.round((t - Date.now()) / 60000);
    return mins > 0 ? `${at} · ${mins >= 60 ? `${Math.floor(mins / 60)} h ${mins % 60}` : `${mins} min`}` : at;
  }
  return formatState(ctx.hass, s);
};

const tempArc = (frac: number, color: string) => {
  const f = Math.max(0, Math.min(1, frac));
  return svg`<svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(241,245,255,0.1)" stroke-width="4"></circle>
    ${f > 0 ? svg`<circle cx="24" cy="24" r="20" fill="none" stroke=${color} stroke-width="4" stroke-linecap="round" pathLength="100" stroke-dasharray=${`${(f * 100).toFixed(1)} 100`} transform="rotate(-90 24 24)"></circle>` : nothing}
  </svg>`;
};

const applianceTile = (ctx: Ctx, a: ApplianceConfig) => {
  const main = stateObj(ctx.hass, a.entity);
  const running = applianceRunning(ctx, a);
  const unav = !!a.entity && isInvalid(main);
  const on = isOnState(main);
  const badge = unav ? "–" : on || running ? "On" : "Off";
  const t = num(ctx.hass, a.temperature);
  const tmax = Number(a.temperature_max) > 0 ? Number(a.temperature_max) : 300;
  const tcol = t === undefined ? "var(--atlas-text2)" : t / tmax > 0.6 ? "var(--atlas-crit)" : t / tmax > 0.25 ? "var(--atlas-warn)" : "var(--atlas-accent)";
  const unit = String(stateObj(ctx.hass, a.temperature)?.attributes.unit_of_measurement ?? "°C");
  const op = stateObj(ctx.hass, a.operation);
  const door = stateObj(ctx.hass, a.door);
  const doorOpen = !!door && !isInvalid(door) && (isOnState(door) || door.state.toLowerCase() === "open");
  const prog = num(ctx.hass, a.progress);
  const sp = num(ctx.hass, a.setpoint);
  const strip: [string, unknown][] = [];
  if (a.setpoint) strip.push(["Setpoint", sp !== undefined && sp > 0 ? `${Math.round(sp)}${unit}` : "–"]);
  if (a.program) strip.push(["Program", label(ctx, a.program)]);
  if (a.progress) strip.push(["Progress", prog !== undefined && prog > 0 ? `${Math.round(prog)} %` : "–"]);
  if (a.finish) strip.push(["Finish", finishText(ctx, a.finish)]);
  if (a.remote) {
    const r = stateObj(ctx.hass, a.remote);
    strip.push(["Remote start", html`<i class="adot ${isOnState(r) ? "on" : ""}"></i>${label(ctx, a.remote)}`]);
  }
  // Controls (switches toggle, buttons press, scripts run) show while the appliance runs, as in the source card.
  // A button that was never pressed reports "unknown", so only missing or unavailable entities are hidden.
  const usable = (id?: string) => { const s = stateObj(ctx.hass, id); return !!s && s.state !== "unavailable"; };
  const controls = running ? (a.controls ?? []).filter(usable) : [];
  const ctrl = (id: string) => {
    const s = stateObj(ctx.hass, id)!;
    const d = domainOf(id);
    const name = String(s.attributes.friendly_name ?? id).replace(new RegExp(`^${a.name}\\s*`, "i"), "");
    const toggle = ["switch", "input_boolean"].includes(d);
    return html`<button class="actl ${toggle && s.state === "on" ? "on" : ""}" @click=${() =>
      toggle ? ctx.call(d, "toggle", { entity_id: id }) : ctx.call(d, d === "script" ? "turn_on" : "press", { entity_id: id })}>${toggle ? html`<i class="adot ${s.state === "on" ? "on" : ""}"></i>` : nothing}${name}</button>`;
  };
  const stop = a.stop && running && usable(a.stop) ? a.stop : undefined;
  const ago = main ? timeAgo(ctx.hass, main.last_changed) : "";
  const more = a.entity || a.operation || a.program;
  return html`<div class="appl ${running ? "run" : ""} ${unav ? "na" : ""}">
    <button class="ahead" @click=${() => more && ctx.moreInfo(more)}>
      ${a.temperature
        ? html`<span class="aarc">${tempArc(t === undefined ? 0 : t / tmax, tcol)}<b class="n" style="color:${tcol}">${t === undefined ? "–" : Math.round(t)}</b></span>`
        : html`<span class="chipi aico">${a.icon ? html`<ha-icon .icon=${a.icon} style="--mdc-icon-size:20px"></ha-icon>` : glyph(/oven|stove|cook/i.test(a.name) ? "oven" : "washer", 20)}</span>`}
      <span class="atxt">
        <b>${a.name}</b>
        <small class="t2">
          ${op && !isInvalid(op) ? html`<span class="apill ${opTone(op.state)}"><i></i>${formatState(ctx.hass, op)}</span>` : nothing}
          ${door && !isInvalid(door) ? html`<span class="adoor ${doorOpen ? "open" : ""}">${glyph("door", 13)}${formatState(ctx.hass, door)}</span>` : nothing}
          ${(!op || isInvalid(op)) && (!door || isInvalid(door)) ? ago : nothing}
        </small>
      </span>
      <span class="abadge ${badge === "On" ? "on" : ""}">${badge}</span>
    </button>
    ${strip.length
      ? html`<div class="astrip" style="grid-template-columns:repeat(${Math.min(strip.length, 4)}, minmax(0, 1fr))">
          ${strip.map(([l, v]) => html`<span><small>${l}</small><b class="n">${v}</b></span>`)}
        </div>`
      : nothing}
    ${prog !== undefined && prog > 0 ? html`<i class="aprog"><i style="width:${Math.min(100, prog)}%"></i></i>` : nothing}
    ${controls.length || stop
      ? html`<div class="actls">
          ${controls.map(ctrl)}
          ${stop
            ? html`<button class="actl stop" @click=${() => ctx.confirm(`Stop ${a.name}?`, "The running program will be cancelled.", () => ctx.call(domainOf(stop), domainOf(stop) === "script" ? "turn_on" : "press", { entity_id: stop }), "Stop")}>Stop</button>`
            : nothing}
        </div>`
      : nothing}
  </div>`;
};

/**
 * Appliances inside the room's Devices card, below the device tiles: the Devices card
 * stretches to the column height, so its free space holds them (owner's feedback).
 */
export const appliancesBlock = (ctx: Ctx, r: RoomConfig) => {
  const list = (r.appliances ?? []).filter((a) => a && a.name);
  if (!list.length) return nothing;
  const running = list.filter((a) => applianceRunning(ctx, a)).length;
  return html`<div class="appblock" role="group" aria-label="Appliances">
    <div class="row"><h3>${glyph("oven", 18)}Appliances</h3><span class="n t2" style="font-size:12px">${running ? `${running} running` : "All idle"}</span></div>
    <div class="appls">${list.map((a) => applianceTile(ctx, a))}</div>
  </div>`;
};

/** Every entity of a room's appliances (re-render list in atlas-view). */
export const applianceEntities = (r: RoomConfig): string[] =>
  (r.appliances ?? []).flatMap((a) => [a.entity, a.operation, a.program, a.door, a.temperature, a.setpoint, a.progress, a.finish, a.remote, a.stop, ...(a.controls ?? [])])
    .filter((x): x is string => !!x);
