export const STRATEGY_TYPE = "atlas-home";
export const STRATEGY_TAG = `ll-strategy-dashboard-${STRATEGY_TYPE}`;
export const EDITOR_TAG = "atlas-home-strategy-editor";
export const VIEW_CARD_TAG = "atlas-view";
// Injected by Vite from package.json (single source of the version number).
declare const __ATLAS_VERSION__: string;
export const VERSION = __ATLAS_VERSION__;

export const DEFAULT_ACCENT = "#56E7C0";
export const ACCENT_PRESETS = ["#56E7C0", "#5EC8FF", "#A7A3FF", "#FF8FB1"];

/** Default image base: the rooms/ folder shipped next to this bundle (HACS installs all of dist/). */
export const DEFAULT_IMAGE_PATH = new URL(/* @vite-ignore */ "./rooms/", import.meta.url).href;

export const ROOM_ICON_KEYS = [
  "living", "kitchen", "office", "kids-room", "bedroom", "hallway", "attic", "garage",
  "basement", "shelter", "server", "stairs", "door", "humidity", "eco", "settings", "system",
  "power", "climate", "home", "rooms", "security", "energy", "light", "camera",
];
