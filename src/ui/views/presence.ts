// Presence on Home (porting plan step 4): one chip per person in entities.persons.
// HA person states: "home", "not_home" or a zone name (HA docs, person integration);
// formatEntityState gives the localised label ("Home", "Away", zone name).
import { html, nothing } from "lit";
import type { Ctx } from "../context";
import { formatState, isInvalid } from "../../data/hass";
import { timeAgo } from "../time";

export const presenceRow = (ctx: Ctx) => {
  const ids = ctx.config.entities?.persons ?? [];
  if (!ids.length) return nothing;
  const home = ids.filter((id) => ctx.hass.states[id]?.state === "home").length;
  return html`<div class="presence" role="list" aria-label="Presence: ${home} of ${ids.length} home">
    ${ids.map((id) => {
      const s = ctx.hass.states[id];
      const name = String(s?.attributes.friendly_name ?? id.split(".")[1] ?? id);
      const bad = isInvalid(s);
      const at = s?.state === "home";
      const pic = s?.attributes.entity_picture as string | undefined;
      const where = !s ? "Not found" : bad ? "Unknown" : formatState(ctx.hass, s);
      return html`<button role="listitem" class="pchip ${at ? "home" : ""} ${bad ? "na" : ""}" title="${name}: ${where}${s && !bad ? `, ${timeAgo(ctx.hass, s.last_changed)}` : ""}"
        @click=${() => ctx.moreInfo(id)}>
        <span class="pav">${pic ? html`<img src=${pic} alt="" />` : name.charAt(0).toUpperCase()}<i></i></span>
        <span class="ptxt"><b>${name}</b><small>${where}</small></span>
      </button>`;
    })}
  </div>`;
};
