// System page (porting plan step 5, from the owner's former incident report card):
// log analyzer report, available updates, unavailable mapped devices, own cards
// (layout.system_cards) and links to the Home Assistant system pages.
import { html, nothing } from "lit";
import type { Ctx } from "../context";
import type { HassEntity } from "../../data/hass";
import { domainOf, stateObj } from "../../data/hass";
import { deviceName, mappedEntities, roomOfEntity } from "../../data/model";
import { readIncidentReport, type Incident, type IncidentSeverity } from "../../data/incidents";
import { glyph, icon } from "../icons";
import { ownCards } from "./common";

const SEV_LABEL: Record<IncidentSeverity, string> = { critical: "Critical", warning: "Warning", minor: "Minor" };

// HA config panel routes (frontend src/panels/config/ha-panel-config.ts).
const LINKS: [string, string][] = [
  ["Settings", "/config/system"],
  ["Logs", "/config/logs"],
  ["Repairs", "/config/repairs"],
  ["Updates", "/config/updates"],
];

const fmtTime = (ctx: Ctx, iso?: string) => {
  const t = iso ? Date.parse(iso) : NaN;
  if (!Number.isFinite(t)) return "";
  const lang = ctx.hass.locale?.language ?? ctx.hass.language ?? "en";
  return new Date(t).toLocaleString(lang, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

const incidentRow = (i: Incident) => html`<div class="inc ${i.severity}">
  <div class="incmain">
    <div class="inchead"><span class="itag ${i.severity}">${SEV_LABEL[i.severity]}</span><b>${i.title}</b>${i.count ? html`<span class="icount n">${i.count}×</span>` : nothing}</div>
    ${i.detail ? html`<p>${i.detail}</p>` : nothing}
    ${i.sources.length ? html`<small class="t2">Source: ${i.sources.join(", ")}</small>` : nothing}
  </div>
  ${i.recommendation ? html`<div class="increc"><small>Recommendation</small><p>${i.recommendation}</p></div>` : nothing}
</div>`;

const reportCard = (ctx: Ctx) => {
  const id = ctx.config.entities?.incidents;
  if (!id) return nothing;
  const s = stateObj(ctx.hass, id);
  const r = readIncidentReport(s);
  const c = r?.counts ?? { critical: 0, warning: 0, minor: 0 };
  const total = c.critical + c.warning + c.minor;
  const tone = !r ? "wait" : c.critical ? "crit" : c.warning ? "warn" : total ? "info" : "ok";
  const title = !r
    ? "No report yet"
    : c.critical
      ? plural(c.critical, "critical incident")
      : c.warning
        ? `${plural(c.warning, "warning")} to check`
        : total
          ? plural(c.minor, "minor issue")
          : "No incidents in the latest scan";
  const sub = !r
    ? `Waiting for ${id} to report. The analyzer publishes it after its next run.`
    : total
      ? [c.critical && plural(c.critical, "critical"), c.warning && plural(c.warning, "warning"), c.minor && `${c.minor} minor`].filter(Boolean).join(" · ")
      : "Home Assistant and add-on logs look clean.";
  return html`<section class="glass card report">
    <div class="row">
      <h2>${icon("system", 20)}Log report</h2>
      <button class="t2 more" @click=${() => ctx.moreInfo(id)}>${r?.generated ? `Updated ${fmtTime(ctx, r.generated)}` : "Details"} ${icon("chevron", 14)}</button>
    </div>
    <div class="rbanner ${tone}">
      <span class="rico">${tone === "ok" ? glyph("shield", 22) : tone === "wait" ? glyph("refresh", 22) : icon("alert", 22)}</span>
      <span class="atxt"><b>${title}</b><small>${sub}</small></span>
    </div>
    ${r
      ? html`<div class="rstats">
          ${(["critical", "warning", "minor"] as IncidentSeverity[]).map(
            (k) => html`<div class="rstat ${k} ${c[k] ? "has" : ""}"><b class="n">${c[k]}</b><small>${SEV_LABEL[k]}</small></div>`
          )}
        </div>
        ${r.incidents.length
          ? html`<div class="incs">${r.incidents.map(incidentRow)}</div>`
          : total
            ? html`<p class="t2" style="margin:0;font-size:12px">The sensor reports counts but no incident list.</p>`
            : nothing}`
      : nothing}
  </section>`;
};

const updatesCard = (ctx: Ctx) => {
  const all = Object.values(ctx.hass.states).filter((s) => domainOf(s.entity_id) === "update");
  if (!all.length) return nothing;
  // update entity: state "on" = update available; attributes title, installed_version, latest_version, in_progress
  // (frontend src/data/update.ts).
  const on = all.filter((s) => s.state === "on");
  const name = (s: HassEntity) => String(s.attributes.title ?? s.attributes.friendly_name ?? s.entity_id);
  const versions = (s: HassEntity) => {
    const a = s.attributes;
    if (a.in_progress) return "Installing";
    if (!a.installed_version && !a.latest_version) return "Update available";
    return `${a.installed_version ?? "-"} → ${a.latest_version ?? "-"}`;
  };
  return html`<section class="glass card">
    <div class="row">
      <h2>${glyph("refresh", 20)}Updates</h2>
      <button class="t2 more" @click=${() => ctx.href("/config/updates")}>All updates ${icon("chevron", 14)}</button>
    </div>
    ${on.length
      ? html`<div class="slist">
          ${on.map(
            (s) => html`<div class="srow open"><button class="smain" @click=${() => ctx.moreInfo(s.entity_id)}>
              <span class="sic">${glyph("refresh", 18)}</span>
              <span class="atxt"><b>${name(s)}</b><small class="t2">${versions(s)}</small></span>
            </button></div>`
          )}
        </div>`
      : html`<p class="t2" style="margin:0;font-size:13px">Everything is up to date.</p>`}
  </section>`;
};

const unavailableCard = (ctx: Ctx) => {
  const bad = mappedEntities(ctx.config).filter((id) => {
    const s = ctx.hass.states[id];
    return !s || s.state === "unavailable";
  });
  return html`<section class="glass card">
    <div class="row">
      <h2>${icon("alert", 20)}Unavailable devices</h2>
      <span class="n t2" style="font-size:12px">${bad.length ? `${bad.length} of ${mappedEntities(ctx.config).length}` : "None"}</span>
    </div>
    ${bad.length
      ? html`<div class="slist">
          ${bad.map((id) => {
            const s = ctx.hass.states[id];
            const room = roomOfEntity(ctx.config, id);
            const label = deviceName(ctx.config, id) ?? String(s?.attributes.friendly_name ?? id);
            return html`<div class="srow na"><button class="smain" @click=${() => (s ? ctx.moreInfo(id) : room ? ctx.openRoom(room) : undefined)}>
              <span class="sic">${glyph(s ? "power" : "dot", 18)}</span>
              <span class="atxt"><b>${label}</b><small>${room ? `${room.name} · ` : ""}${s ? "Unavailable" : "Not found"} · ${id}</small></span>
            </button></div>`;
          })}
        </div>`
      : html`<p class="t2" style="margin:0;font-size:13px">Every entity in the dashboard config responds.</p>`}
  </section>`;
};

export const renderSystem = (ctx: Ctx) => {
  const r = readIncidentReport(stateObj(ctx.hass, ctx.config.entities?.incidents));
  const version = (ctx.hass.config as { version?: string } | undefined)?.version;
  const parts = [
    version ? `Home Assistant ${version}` : "",
    ctx.config.entities?.incidents
      ? r
        ? `Log report: ${r.counts.critical} critical · ${plural(r.counts.warning, "warning")} · ${r.counts.minor} minor`
        : "Log report: waiting"
      : "",
  ].filter(Boolean);
  return html`
    <section class="hero" aria-label="System">
      <h1 class="sm">System</h1>
      ${parts.length ? html`<p class="n">${parts.join(" · ")}</p>` : nothing}
    </section>
    <div class="syslinks">
      ${LINKS.map(([label, path]) => html`<button class="ctl" @click=${() => ctx.href(path)}>${label} ${icon("chevron", 14)}</button>`)}
    </div>
    <div class="sys-grid">
      <div class="col">${reportCard(ctx)}</div>
      <div class="col">${updatesCard(ctx)}${unavailableCard(ctx)}</div>
    </div>
    ${ownCards(ctx, ctx.config.layout?.system_cards, "main")}
  `;
};
