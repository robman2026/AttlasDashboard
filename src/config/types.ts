// Strategy configuration. Everything the dashboard shows comes from here;
// components never hardcode entity IDs. Edited in the dashboard "Edit" dialog.

export type Variant = "warm_glass" | "glass" | "quiet";
export type Ambience = "graphite" | "midnight" | "deep_teal" | "violet_night" | "warm";

export interface AppearanceConfig {
  accent?: string; // hex, default #56E7C0
  variant?: Variant;
  ambience?: Ambience;
  background?: string; // room id whose image is the Home background
  image_path?: string; // base URL for room images, default: rooms/ next to the bundle
}

export interface GlobalEntities {
  alarm?: string;
  weather?: string;
  outdoor_temperature?: string;
  heat_pump?: string; // climate entity, also used for the greeting line
  heat_pump_outdoor?: string;
  heat_pump_supply?: string;
  heat_pump_return?: string;
  solar_power?: string;
  house_load?: string;
  grid_import?: string;
  grid_export?: string;
  incidents?: string;
  wake_pc?: string;
  garage_cover?: string;
  persons?: string[];
  exclude_lights?: string[]; // never counted as room lights (camera status LEDs)
}

export interface TemperatureRule {
  entity: string;
  above: number;
  clear_below?: number; // hysteresis, defaults to `above`
  label?: string;
}

export interface AlertsConfig {
  temperature_rules?: TemperatureRule[];
  exterior_doors?: string[]; // warning when open
  interior_doors?: string[]; // info when open
  critical?: string[]; // real detectors (leak, smoke): critical when on
  mailbox?: string;
  mailbox_ack?: string; // optional input_boolean: alert stays until turned off
  updates?: boolean; // info for update.* entities that are "on"
  data_quality?: boolean; // warning listing mapped entities that are unavailable
}

export interface FloorConfig {
  id: string;
  name: string;
  level?: string;
}

export interface DeviceConfig {
  entity: string;
  name?: string;
  icon?: string; // optional mdi:* override
}

export interface RoomConfig {
  id: string;
  name: string;
  floor?: string;
  icon?: string; // ATLAS icon key, e.g. "office"
  image?: string; // file name under image_path, or a full URL
  temperature?: string;
  humidity?: string;
  show_camera?: boolean; // default true; false hides the whole camera section
  camera?: string; // live stream entity
  camera_hq?: string;
  camera_snapshot?: string;
  camera_private?: boolean; // hidden until "Reveal"
  devices?: DeviceConfig[];
}

export interface LayoutConfig {
  home_tiles?: string[];
  top_tabs?: string[];
  security_tiles?: string[];
}

export interface AtlasConfig {
  type: string;
  appearance?: AppearanceConfig;
  entities?: GlobalEntities;
  alerts?: AlertsConfig;
  floors?: FloorConfig[];
  rooms?: RoomConfig[];
  layout?: LayoutConfig;
}

/** Config passed to every generated custom:atlas-view card. */
export interface AtlasViewCardConfig {
  type: string;
  view: "home" | "alerts" | "rooms" | "room";
  room?: string;
  floor?: string;
  atlas: AtlasConfig;
}
