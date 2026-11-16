// Solar view (porting plan step 10, from the owner's FusionSolar card): live flow and gauges,
// today's energy with self-consumption, an hourly chart from long-term statistics (SVG, no
// chart library), PV strings and inverter values. Every part hides when its entities are missing.
import { html, nothing, svg } from "lit";
import type { Ctx } from "../context";
import { formatState, isInvalid, num, powerKw, stateObj } from "../../data/hass";
import { solarPowerEntity } from "../../data/model";
import { deviceLabel, glyphFor } from "../devices";
import { glyph, icon } from "../icons";

const kw = (v?: number) => (v === undefined ? "–" : `${v.toFixed(2)} kW`);
const kwh = (v?: number) => (v === undefined ? "–" : `${v.toFixed(1)} kWh`);

/** 270 degree gauge with the value in the middle. */
const gauge = (label: string, value: string, frac: number | undefined, color: string, onClick?: () => void) => {
  const f = frac === undefined ? 0 : Math.max(0, Math.min(1, frac));
  return html`<button class="sgauge" @click=${() => onClick?.()} ?disabled=${!onClick}>
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(241,245,255,0.08)" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="75 100" transform="rotate(135 50 50)"></circle>
      ${f > 0 ? svg`<circle cx="50" cy="50" r="40" fill="none" stroke=${color} stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray=${`${(f * 75).toFixed(1)} 100`} transform="rotate(135 50 50)"></circle>` : nothing}
    </svg>
    <b class="n">${value}</b><small>${label}</small>
  </button>`;
};

/** Hourly chart: production bars (accent), house consumption line (amber), export line (blue). */
const hourlyChart = (ctx: Ctx, prod?: string, cons?: string, exp?: string) => {
  const st = ctx.stats;
  if (!prod || !st) return html`<p class="t2" style="margin:0;font-size:12px">${prod ? "Loading statistics..." : "Set Production today to see the hourly chart."}</p>`;
  const P = st.series[prod] ?? [];
  const C = cons ? st.series[cons] ?? [] : [];
  const E = exp ? st.series[exp] ?? [] : [];
  if (!P.some((v) => v !== null)) return html`<p class="t2" style="margin:0;font-size:12px">No long-term statistics for ${prod} yet (it needs a state class).</p>`;
  const max = Math.max(0.5, ...[...P, ...C, ...E].map((v) => v ?? 0));
  const W = 1200, H = 200, top = 10, bottom = 22, left = 34;
  const bw = (W - left) / 24;
  const y = (v: number) => top + (H - top - bottom) * (1 - v / max);
  const line = (arr: (number | null)[], color: string, dash = "") => {
    const pts = arr.map((v, i) => (v === null ? null : `${(left + bw * i + bw / 2).toFixed(1)},${y(v).toFixed(1)}`)).filter(Boolean);
    return pts.length > 1 ? svg`<polyline points=${pts.join(" ")} fill="none" stroke=${color} stroke-width="2" stroke-linejoin="round" stroke-dasharray=${dash}></polyline>` : nothing;
  };
  const ticks = [0, max / 2, max];
  return html`<svg class="schart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Energy per hour today">
      ${ticks.map((t) => svg`<line x1=${left} x2=${W} y1=${y(t)} y2=${y(t)} stroke="rgba(241,245,255,0.08)"></line><text x=${left - 6} y=${y(t) + 4} text-anchor="end" font-size="10" fill="rgba(188,200,222,0.7)">${t.toFixed(t < 2 ? 1 : 0)}</text>`)}
      ${P.map((v, i) => (v === null || v <= 0 ? nothing : svg`<rect x=${left + bw * i + 2} y=${y(v)} width=${bw - 4} height=${y(0) - y(v)} rx="2" fill="var(--atlas-accent)" opacity="0.8"><title>${String(i).padStart(2, "0")}:00 ${v.toFixed(2)} kWh</title></rect>`))}
      ${line(C, "var(--atlas-warn)")}
      ${line(E, "#5ec8ff", "4 3")}
      ${[0, 6, 12, 18, 23].map((h) => svg`<text x=${left + bw * h + bw / 2} y=${H - 6} text-anchor="middle" font-size="10" fill="rgba(188,200,222,0.7)">${String(h).padStart(2, "0")}h</text>`)}
    </svg>
    <div class="slegend"><span><i style="background:var(--atlas-accent)"></i>Production</span>${cons ? html`<span><i style="background:var(--atlas-warn)"></i>House</span>` : nothing}${exp ? html`<span><i style="background:#5ec8ff"></i>Export</span>` : nothing}<span class="t2">kWh per hour</span></div>`;
};

export const renderSolar = (ctx: Ctx) => {
  const c = ctx.config;
  const s = c.solar ?? {};
  const e = c.entities ?? {};
  const pvId = solarPowerEntity(c);
  const houseId = s.house_load || e.house_load;
  const impId = s.grid_import || e.grid_import;
  const expId = s.grid_export || e.grid_export;
  const pv = powerKw(ctx.hass, pvId);
  const house = powerKw(ctx.hass, houseId);
  const imp = powerKw(ctx.hass, impId);
  const exp = powerKw(ctx.hass, expId);
  const exporting = (exp ?? 0) > (imp ?? 0);
  const grid = exporting ? exp : imp;
  const soc = num(ctx.hass, s.battery_soc);
  const bat = powerKw(ctx.hass, s.battery_power);
  const peak = Number(s.peak_power) > 0 ? Number(s.peak_power) : 6;
  const prod = num(ctx.hass, s.production_today);
  const cons = num(ctx.hass, s.consumption_today);
  const expT = num(ctx.hass, s.export_today);
  const impT = num(ctx.hass, s.import_today);
  const fc = num(ctx.hass, s.forecast_today);
  const rem = num(ctx.hass, s.remaining_today);
  const scS = num(ctx.hass, s.self_consumption);
  const sc = scS ?? (prod !== undefined && expT !== undefined && prod > 0 ? ((prod - expT) / prod) * 100 : undefined);
  const more = (id?: string) => (id ? () => ctx.moreInfo(id) : undefined);
  const tile = (label: string, v: string, id?: string) =>
    id ? html`<button class="vstat" @click=${() => ctx.moreInfo(id)}><b class="n">${v}</b><small>${label}</small></button>` : nothing;
  const val = (id?: string) => {
    const st = stateObj(ctx.hass, id);
    return !st || isInvalid(st) ? "–" : formatState(ctx.hass, st);
  };
  const flowLink = (active: boolean, dir: "r" | "l") => html`<span class="link ${active ? `act ${dir}` : ""}"></span>`;
  const strings = s.strings ?? [];
  const inv = s.inverter ?? [];
  return html`
    <section class="hero" aria-label="Solar">
      <h1 class="sm">${s.name || "Solar"}</h1>
      <p class="n">${kw(pv)} now${prod !== undefined ? ` · ${kwh(prod)} today` : ""}${fc !== undefined ? ` · forecast ${kwh(fc)}` : ""}</p>
    </section>
    <div class="solar-grid">
      <section class="glass card">
        <div class="row"><h2>${icon("solar", 20)}Live</h2>${exporting ? html`<span class="badge" style="background:rgba(94,200,255,0.18);color:#5ec8ff">Exporting</span>` : nothing}</div>
        <div class="flow sflow">
          <button class="node" @click=${() => more(pvId)?.()}><span class="c">${icon("solar", 22)}</span><b class="n">${kw(pv)}</b><span>Solar</span></button>
          ${flowLink((pv ?? 0) > 0.01, "r")}
          <button class="node house" @click=${() => more(houseId)?.()}><span class="c">${icon("home", 24)}</span><b class="n">${kw(house)}</b><span>House</span></button>
          ${flowLink((grid ?? 0) > 0.01, exporting ? "r" : "l")}
          <button class="node" @click=${() => more(exporting ? expId : impId)?.()}><span class="c">${icon("grid", 22)}</span><b class="n">${kw(grid)}</b><span>${exporting ? "Grid export" : "Grid import"}</span></button>
        </div>
        <div class="sgauges">
          ${gauge("Solar", kw(pv), pv === undefined ? undefined : pv / peak, "var(--atlas-accent)", more(pvId))}
          ${houseId ? gauge("House", kw(house), house === undefined ? undefined : house / peak, "var(--atlas-warn)", more(houseId)) : nothing}
          ${impId || expId ? gauge(exporting ? "Export" : "Import", kw(grid), grid === undefined ? undefined : grid / peak, exporting ? "#5ec8ff" : "var(--atlas-crit)", more(exporting ? expId : impId)) : nothing}
          ${s.battery_soc ? gauge(bat === undefined ? "Battery" : bat > 0.01 ? "Charging" : bat < -0.01 ? "Discharging" : "Battery", soc === undefined ? "–" : `${Math.round(soc)} %`, soc === undefined ? undefined : soc / 100, "#a7a3ff", more(s.battery_soc)) : nothing}
        </div>
      </section>
      <section class="glass card">
        <div class="row"><h2>${glyph("power", 20)}Today</h2></div>
        <div class="vstats">
          ${tile("Generated", kwh(prod), s.production_today)}
          ${tile("House", kwh(cons), s.consumption_today)}
          ${tile("Exported", kwh(expT), s.export_today)}
          ${tile("Imported", kwh(impT), s.import_today)}
          ${tile("Forecast", kwh(fc), s.forecast_today)}
          ${tile("Still expected", kwh(rem), s.remaining_today)}
        </div>
        ${sc !== undefined
          ? html`<button class="scbar" @click=${() => s.self_consumption && ctx.moreInfo(s.self_consumption)}>
              <span class="row"><small class="t2">Self-consumption${scS === undefined ? " (production minus export)" : ""}</small><b class="n">${Math.round(sc)} %</b></span>
              <i class="mbar"><i style="width:${Math.max(0, Math.min(100, sc))}%;background:var(--atlas-accent)"></i></i>
            </button>`
          : nothing}
      </section>
    </div>
    <section class="glass card">
      <div class="row"><h2>Production today</h2><span class="t2" style="font-size:12px">per hour, from long-term statistics</span></div>
      ${hourlyChart(ctx, s.production_today, s.consumption_today, s.export_today)}
    </section>
    ${strings.length || inv.length
      ? html`<div class="solar-grid">
          ${strings.length
            ? html`<section class="glass card">
                <h2>PV strings</h2>
                <div class="stable" role="table">
                  <div class="strow head" role="row"><span>String</span><span>Power</span><span>Voltage</span><span>Current</span></div>
                  ${strings.map((r) => html`<div class="strow" role="row"><b>${r.name}</b>
                    ${[r.power, r.voltage, r.current].map((id) => html`<button class="n" ?disabled=${!id} @click=${() => id && ctx.moreInfo(id)}>${val(id)}</button>`)}</div>`)}
                </div>
              </section>`
            : nothing}
          ${inv.length
            ? html`<section class="glass card">
                <h2>Inverter</h2>
                <div class="cextra">
                  ${inv.map((d) => html`<button class="cx" @click=${() => ctx.moreInfo(d.entity)}>
                    <span class="cxi">${d.icon ? html`<ha-icon .icon=${d.icon} style="--mdc-icon-size:18px"></ha-icon>` : glyph(glyphFor(d.entity, ctx.hass.states[d.entity]), 18)}</span>
                    <span><b class="n">${val(d.entity)}</b><small>${deviceLabel(ctx.hass, d)}</small></span></button>`)}
                </div>
              </section>`
            : nothing}
        </div>`
      : nothing}
  `;
};

/** Entities of the Solar view (re-render list). */
export const solarEntities = (ctx: { config: Ctx["config"] }) => {
  const s = ctx.config.solar ?? {};
  return [s.power, s.house_load, s.grid_import, s.grid_export, s.battery_soc, s.battery_power, s.production_today, s.consumption_today,
    s.export_today, s.import_today, s.forecast_today, s.remaining_today, s.self_consumption,
    ...(s.strings ?? []).flatMap((r) => [r.power, r.voltage, r.current]), ...(s.inverter ?? []).map((d) => d.entity)].filter((x): x is string => !!x);
};
