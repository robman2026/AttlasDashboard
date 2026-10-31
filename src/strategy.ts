// Dashboard strategy: turns the ATLAS config into HA views.
// Docs: https://developers.home-assistant.io/docs/frontend/custom-ui/custom-strategy
// Every screen is its own view (own URL), so the browser back button and deep links work:
//   home, alerts, rooms, floor-<id>, room-<id>
import type { AtlasConfig, AtlasViewCardConfig } from "./config/types";
import { EDITOR_TAG, VIEW_CARD_TAG } from "./config/constants";
import { floors, rooms } from "./data/model";

const card = (atlas: AtlasConfig, view: AtlasViewCardConfig["view"], extra: Partial<AtlasViewCardConfig> = {}) => ({
  type: `custom:${VIEW_CARD_TAG}`,
  view,
  ...extra,
  atlas,
});

export class AtlasHomeStrategy extends HTMLElement {
  // Views come from the config only, so registry changes need no regeneration.
  static registryDependencies: readonly string[] = [];

  // Creating the dashboard opens the editor first (load the preset there).
  static configRequired = true;

  static getConfigElement() {
    return document.createElement(EDITOR_TAG);
  }

  static getCreateSuggestions() {
    return { title: "ATLAS Home", icon: "mdi:home-variant-outline" };
  }

  static async generate(config: AtlasConfig) {
    const firstFloor = floors(config)[0]?.id;
    const sub = { subview: true, back_path: "home" };
    const views: Record<string, unknown>[] = [
      { title: "Home", path: "home", icon: "mdi:home-variant-outline", type: "panel", cards: [card(config, "home")] },
      { title: "Alerts", path: "alerts", type: "panel", ...sub, cards: [card(config, "alerts")] },
      { title: "Rooms", path: "rooms", type: "panel", ...sub, cards: [card(config, "rooms", { floor: firstFloor })] },
    ];
    for (const f of floors(config)) {
      views.push({ title: f.name, path: `floor-${f.id}`, type: "panel", ...sub, cards: [card(config, "rooms", { floor: f.id })] });
    }
    for (const r of rooms(config)) {
      views.push({ title: r.name, path: `room-${r.id}`, type: "panel", ...sub, cards: [card(config, "room", { room: r.id })] });
    }
    return { title: "ATLAS Home", views };
  }
}
