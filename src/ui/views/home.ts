import { html, nothing, svg } from "lit";
import type { Ctx } from "../context";
import { formatState, isInvalid, num, powerKw, stateObj, domainOf } from "../../data/hass";
import { cameraOf, imageUrl, roomById, roomLights, rooms } from "../../data/model";
import { icon } from "../icons";
import { isContact } from "../devices";
import { fmtTemp, roomTile } from "./common";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 5) return "Good night.";
  if (h < 12) return "Good morning.";
  if (h < 18) return "Good afternoon.";
  return "Good evening.";
};

export const attentionBanner = (ctx: Ctx, compact = false) => {
  const al = ctx.alerts;
  const crit = al.filter((a) => a.severity === "critical").length;
  const warn = al.filter((a) => a.severity === "warning").length;
  const info = al.filter((a) => a.severity === "info").length;
  const need = crit + warn;
  const tone = crit ? "critical" : warn ? "" : info ? "info" : "calm";
  const title = need
    ? `${need} thing${need > 1 ? "s" : ""} need${need > 1 ? "" : "s"} attention`
    : info
      ? `Nothing urgent · ${info} note${info > 1 ? "s" : ""}`
      : "Nothing needs attention";
  const chips = al.slice(0, 3);
  return html`<div class="banner ${tone}" role="region" aria-label="Attention">
    <span class="sig">${need || info ? svg`<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 7v6M12 17h.01"></path></svg>` : icon("security", 22)}</span>
    <button class="sum" @click=${() => ctx.go("alerts")}>
      <b>${title}</b>
      <span class="n">${crit} critical · ${warn} warning${warn === 1 ? "" : "s"} · ${info} info</span>
    </button>
    ${compact
      ? nothing
      : html`<div class="chips">
          ${chips.map(
            (a) => html`<button class="chip ${a.severity}" @click=${() => ctx.openAlert(a)}>
              <span class="ico">${icon(a.icon, 20)}</span>
              <span class="txt"><span>${a.chipTitle}</span><span class="val"><b class="n">${a.chipValue}</b><span class="badge ${a.severity}">${a.badge}</span></span></span>
            </button>`
          )}
        </div>`}
    <button class="more" aria-label="All alerts" @click=${() => ctx.go("alerts")}>${icon("chevron", 18)}</button>
  </div>`;
};

const climateCard = (ctx: Ctx) => {
  const e = ctx.config.entities ?? {};
  const hp = stateObj(ctx.hass, e.heat_pump);
  if (!e.heat_pump) return nothing;
  const cur = isInvalid(hp) ? undefined : Number(hp!.attributes.current_temperature);
  const target = isInvalid(hp) ? undefined : Number(hp!.attributes.temperature);
  const valid = cur !== undefined && Number.isFinite(cur);
  const frac = valid ? Math.max(0, Math.min(1, (cur! - 10) / 20)) : 0;
  const SWEEP = 78;
  const action = isInvalid(hp) ? "Unavailable" : String(hp!.attributes.hvac_action ?? hp!.state);
  const out = num(ctx.hass, e.heat_pump_outdoor) ?? num(ctx.hass, e.outdoor_temperature);
  const sup = num(ctx.hass, e.heat_pump_supply);
  const ret = num(ctx.hass, e.heat_pump_return);
  return html`<section class="glass card">
    <h2 style="font-size:18px"><span style="color:var(--atlas-accent)">${icon("climate", 22)}</span>Climate</h2>
    <div class="clim">
      <svg role="img" aria-label="Heat pump ${valid ? cur : "unavailable"} degrees" width="136" height="136" viewBox="0 0 140 140" style="flex:none">
        <circle cx="70" cy="70" r="60" fill="rgba(0,0,0,0.35)"></circle>
        <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(241,245,255,0.08)" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="${SWEEP} 100" transform="rotate(130 70 70)"></circle>
        ${valid ? svg`<circle cx="70" cy="70" r="58" fill="none" stroke="var(--atlas-accent)" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="${Math.max(1, SWEEP * frac)} 100" transform="rotate(130 70 70)"></circle>` : nothing}
        <text x="70" y="76" text-anchor="middle" font-size="32" font-weight="700" fill="#F1F5FF">${valid ? cur!.toFixed(1) : "–"}<tspan font-size="13" dy="-13">°C</tspan></text>
        ${target !== undefined && Number.isFinite(target) ? svg`<text x="70" y="98" text-anchor="middle" font-size="12" fill="var(--atlas-accent)">Target ${target.toFixed(1)}°</text>` : nothing}
      </svg>
      <div class="det">
        <b>Heat pump · ${action.charAt(0).toUpperCase() + action.slice(1)}</b>
        <span class="n t2">Outdoor ${fmtTemp(out, "°")} · Supply ${fmtTemp(sup, "°")}</span>
        <span class="n t2">Return ${fmtTemp(ret, "°")}</span>
        <div class="btn3">
          <button class="sq" aria-label="Heat pump power" @click=${() => ctx.moreInfo(e.heat_pump!)}>${icon("power", 20)}</button>
          <button class="sq" aria-label="Eco mode" @click=${() => ctx.moreInfo(e.heat_pump!)}>${icon("eco", 20)}</button>
          <button class="sq" aria-label="Schedule" @click=${() => ctx.moreInfo(e.heat_pump!)}>${icon("schedule", 20)}</button>
        </div>
      </div>
    </div>
  </section>`;
};

const kw = (v?: number) => (v === undefined ? "–" : `${v.toFixed(2)} kW`);

const energyCard = (ctx: Ctx) => {
  const e = ctx.config.entities ?? {};
  if (!e.house_load && !e.solar_power && !e.grid_import) return nothing;
  const solar = powerKw(ctx.hass, e.solar_power);
  const house = powerKw(ctx.hass, e.house_load);
  const imp = powerKw(ctx.hass, e.grid_import);
  const exp = powerKw(ctx.hass, e.grid_export);
  const exporting = (exp ?? 0) > (imp ?? 0);
  const gridVal = exporting ? exp : imp;
  return html`<section class="glass card" style="gap:10px">
    <h2>Energy flow</h2>
    <div class="flow">
      <button class="node" @click=${() => e.solar_power && ctx.moreInfo(e.solar_power)}><span class="c">${icon("solar", 22)}</span><b class="n">${kw(solar)}</b><span>Solar</span></button>
      <span class="link ${(solar ?? 0) > 0.01 ? "act r" : ""}"></span>
      <button class="node house" @click=${() => e.house_load && ctx.moreInfo(e.house_load)}><span class="c">${icon("home", 24)}</span><b class="n">${kw(house)}</b><span>House</span></button>
      <span class="link ${(gridVal ?? 0) > 0.01 ? `act ${exporting ? "r" : "l"}` : ""}"></span>
      <button class="node" @click=${() => e.grid_import && ctx.moreInfo(e.grid_import)}><span class="c">${icon("grid", 22)}</span><b class="n">${kw(gridVal)}</b><span>${exporting ? "Grid export" : "Grid import"}</span></button>
    </div>
  </section>`;
};

const securityCard = (ctx: Ctx) => {
  const e = ctx.config.entities ?? {};
  const alarm = stateObj(ctx.hass, e.alarm);
  const contacts = rooms(ctx.config).flatMap((r) => (r.devices ?? []).map((d) => ctx.hass.states[d.entity])).filter((s) => isContact(s) || (s && domainOf(s.entity_id) === "cover"));
  const valid = contacts.filter((s) => !isInvalid(s));
  const open = valid.filter((s) => s.state === "on" || s.state === "open").length;
  const tiles = (ctx.config.layout?.security_tiles ?? []).map((id) => roomById(ctx.config, id)).filter(Boolean);
  return html`<section class="glass card" style="flex:1">
    <div class="row">
      <h2>${icon("security", 20)}Security</h2>
      <button class="n t2" style="font-size:12px" @click=${() => e.alarm && ctx.moreInfo(e.alarm)}>
        ${alarm ? (isInvalid(alarm) ? "Alarm unavailable" : formatState(ctx.hass, alarm)) : ""} · ${open} / ${valid.length} open${valid.length < contacts.length ? ` · ${contacts.length - valid.length} n/a` : ""}
      </button>
    </div>
    <div class="cams">
      ${tiles.map((r) => {
        const camera = cameraOf(r);
        const camOk = camera ? !isInvalid(stateObj(ctx.hass, camera)) : false;
        const img = imageUrl(ctx.config, r);
        return html`<button class="cam" @click=${() => ctx.openRoom(r!)}>
          ${img ? html`<img src=${img} alt="" loading="lazy" />` : nothing}
          <span>${camera ? html`<i class="dotst ${camOk ? "" : "na"}"></i>${r!.name} · open camera` : r!.name}</span>
        </button>`;
      })}
    </div>
  </section>`;
};

const quickActions = (ctx: Ctx) => {
  const e = ctx.config.entities ?? {};
  const alarm = stateObj(ctx.hass, e.alarm);
  const garage = stateObj(ctx.hass, e.garage_cover);
  const lightsOn = roomLights(ctx.config).filter((id) => ctx.hass.states[id]?.state === "on");
  const armed = alarm && alarm.state !== "disarmed" && !isInvalid(alarm);
  const wake = e.wake_pc;
  return html`<section class="glass card" style="gap:10px;padding:14px 16px">
    <h2 style="margin-left:4px">Quick actions</h2>
    <div class="actions">
      ${e.alarm
        ? html`<button class="qa primary" ?disabled=${isInvalid(alarm)} @click=${() =>
            armed
              ? ctx.moreInfo(e.alarm!)
              : ctx.confirm("Arm away?", "The alarm will arm in away mode.", () => ctx.call("alarm_control_panel", "alarm_arm_away", { entity_id: e.alarm }), "Arm away")}>
            ${icon("arm-away", 20)}${armed ? "Disarm" : "Arm away"}
          </button>`
        : nothing}
      ${e.garage_cover
        ? html`<button class="qa" ?disabled=${isInvalid(garage)} @click=${() => {
            const opening = garage?.state !== "open";
            ctx.confirm(opening ? "Open the garage?" : "Close the garage?", `Garage door is ${garage ? formatState(ctx.hass, garage).toLowerCase() : "unknown"}.`,
              () => ctx.call("cover", opening ? "open_cover" : "close_cover", { entity_id: e.garage_cover }), opening ? "Open" : "Close");
          }}>${icon("garage-door", 20)}Garage</button>`
        : nothing}
      <button class="qa" @click=${() =>
        lightsOn.length
          ? ctx.confirm("Turn lights off?", `${lightsOn.length} light${lightsOn.length > 1 ? "s are" : " is"} on in mapped rooms (status LEDs excluded).`,
              () => ctx.call("light", "turn_off", { entity_id: lightsOn }), "Turn off")
          : ctx.confirm("All lights are off", "No mapped room light is on.", () => undefined, "OK")}>
        ${icon("lights-off", 20)}Lights off${lightsOn.length ? html` <span class="n t2">${lightsOn.length}</span>` : nothing}
      </button>
      ${wake
        ? html`<button class="qa" @click=${() => {
            const d = domainOf(wake);
            if (d === "script") ctx.call("script", "turn_on", { entity_id: wake });
            else ctx.call(d, "press", { entity_id: wake });
          }}>${icon("wake-pc", 20)}Wake PC</button>`
        : nothing}
      <button class="qa" @click=${() => ctx.go("rooms")}>${icon("more", 20)}More</button>
    </div>
  </section>`;
};

const tileSpans = (n: number) => (n === 8 ? [2, 2, 2, 3, 3, 2, 2, 2] : Array(n).fill(2));

export const renderHome = (ctx: Ctx) => {
  const e = ctx.config.entities ?? {};
  const hp = stateObj(ctx.hass, e.heat_pump);
  const inside = isInvalid(hp) ? undefined : Number(hp!.attributes.current_temperature);
  const alarm = stateObj(ctx.hass, e.alarm);
  const tileIds = ctx.config.layout?.home_tiles?.length ? ctx.config.layout.home_tiles : rooms(ctx.config).slice(0, 8).map((r) => r.id);
  const tiles = tileIds.map((id) => roomById(ctx.config, id)).filter(Boolean);
  const spans = tileSpans(tiles.length);
  const total = rooms(ctx.config).length;
  const alarmTxt = alarm ? (isInvalid(alarm) ? "Alarm unavailable" : `Alarm ${formatState(ctx.hass, alarm).toLowerCase()}`) : "";
  const alarmWarn = alarm && (isInvalid(alarm) || ["triggered", "pending"].includes(alarm.state));
  return html`
    <section class="hero" aria-label="Greeting">
      <h1>${greeting()}</h1>
      <p class="n">
        ${e.heat_pump ? html`Heat pump reads ${inside !== undefined && Number.isFinite(inside) ? `${inside.toFixed(1)} °C` : "–"} indoors` : nothing}
        ${alarmTxt ? html`<span style="opacity:.5"> · </span><span style="color:${alarmWarn ? "var(--atlas-warn)" : "var(--atlas-accent)"};font-weight:600">${alarmTxt}</span>` : nothing}
      </p>
    </section>
    ${attentionBanner(ctx, ctx.narrow)}
    <div class="home-grid">
      <div class="col">
        <section class="glass card" style="flex:1;padding:16px">
          <div class="row" style="padding:0 4px;align-items:flex-start">
            <div><h2 style="font-size:20px">Rooms</h2><span class="t2" style="font-size:12px">Quick access to your spaces</span></div>
            <button class="pillbtn" @click=${() => ctx.go("rooms")}>View all ${total} rooms</button>
          </div>
          <div class="tiles" style="flex:1">${tiles.map((r, i) => roomTile(ctx, r!, spans[i] === 3 ? "s3" : ""))}</div>
        </section>
        ${quickActions(ctx)}
      </div>
      <div class="col">${climateCard(ctx)}${energyCard(ctx)}${securityCard(ctx)}</div>
    </div>
  `;
};
