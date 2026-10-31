import { html, nothing } from "lit";
import type { Ctx } from "../context";
import type { Severity } from "../../data/alerts";
import { icon } from "../icons";
import { sevColor } from "./common";

const GROUPS: [Severity, string][] = [["critical", "Critical"], ["warning", "Warning"], ["info", "Info"]];

export const renderAlerts = (ctx: Ctx) => {
  const ack = ctx.config.alerts?.mailbox_ack;
  const groups = GROUPS.map(([sev, label]) => ({ sev, label, items: ctx.alerts.filter((a) => a.severity === sev) })).filter((g) => g.items.length);
  return html`
    <section class="hero">
      <h1 class="sm">Needs attention</h1>
      <p>Grouped by severity · rows clear automatically when the condition resolves</p>
    </section>
    ${groups.length
      ? groups.map(
          (g) => html`<section class="glass card group">
            <h2 style="color:${sevColor[g.sev]}">${g.label} · ${g.items.length}</h2>
            <div class="alist">
              ${g.items.map(
                (a) => html`<button class="arow ${a.severity}" @click=${() => ctx.openAlert(a)}>
                  <span class="ico">${icon(a.icon, 20)}</span>
                  <span class="txt"><b>${a.title}</b><span>${a.meta}</span></span>
                  ${a.id === "mailbox" && ack
                    ? html`<span class="ctl" role="button" @click=${(ev: Event) => {
                        ev.stopPropagation();
                        ctx.call("input_boolean", "turn_off", { entity_id: ack });
                      }}>Acknowledge</span>`
                    : nothing}
                  <span class="badge ${a.severity}">${g.label}</span>
                </button>`
              )}
            </div>
          </section>`
        )
      : html`<section class="glass card"><p class="empty">Nothing needs attention. All mapped sources report valid states.</p></section>`}
  `;
};
