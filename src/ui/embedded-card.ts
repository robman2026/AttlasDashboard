// <atlas-hui-card>: renders any Lovelace card (built-in or custom, e.g. your own
// washer or remote card) inside an ATLAS view, from a plain card config.
// Uses window.loadCardHelpers().createCardElement, the API HA exposes for custom
// cards (frontend src/panels/lovelace/ha-panel-lovelace.ts, custom-card-helpers.ts).
import type { HomeAssistant } from "../data/hass";

type CardEl = HTMLElement & { hass?: HomeAssistant };

export class AtlasHuiCard extends HTMLElement {
  private _config?: Record<string, unknown>;
  private _hass?: HomeAssistant;
  private _card?: CardEl;
  private _key = "";

  set config(c: Record<string, unknown> | undefined) {
    const key = JSON.stringify(c ?? null);
    if (key === this._key) return;
    this._key = key;
    this._config = c;
    this._build();
  }

  set hass(h: HomeAssistant | undefined) {
    this._hass = h;
    if (this._card && h) this._card.hass = h;
  }

  get hass() {
    return this._hass;
  }

  connectedCallback() {
    this.style.display = "block";
    // createCardElement fires ll-rebuild when a custom card's element is defined later.
    this.addEventListener("ll-rebuild", this._onRebuild);
  }

  disconnectedCallback() {
    this.removeEventListener("ll-rebuild", this._onRebuild);
  }

  private _onRebuild = (e: Event) => {
    e.stopPropagation();
    this._build();
  };

  private async _build() {
    const cfg = this._config;
    if (!cfg || typeof cfg !== "object" || !cfg.type) {
      this._show(`Card config needs a "type" (e.g. custom:my-card).`);
      return;
    }
    try {
      const helpers = await (window as any).loadCardHelpers?.();
      if (!helpers) throw new Error("card helpers not available");
      const card: CardEl = await helpers.createCardElement(cfg);
      if (this._config !== cfg) return; // config changed while loading
      if (this._hass) card.hass = this._hass;
      this._card = card;
      this.replaceChildren(card);
    } catch (e: any) {
      this._show(`Could not create card: ${e?.message ?? e}`);
    }
  }

  private _show(msg: string) {
    this._card = undefined;
    const p = document.createElement("p");
    p.textContent = msg;
    p.style.cssText = "margin:0;padding:12px;border-radius:12px;border:1px dashed #FFBF57;color:#FFBF57;font-size:13px";
    this.replaceChildren(p);
  }
}
