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
  time_display?: TimeDisplay; // relative time on device tiles and climate values
}

/** changed: HA last_changed (state change). updated: HA last_updated (any update). off: hidden. */
export type TimeDisplay = "changed" | "updated" | "off";


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
  cameras?: FloorCameras; // camera wall on the floor's Rooms page
}

/** off: no camera wall. live: live streams (muted). stills: snapshots refreshed every 10 s. */
export type FloorCameras = "off" | "live" | "stills";

/** Any Lovelace card config (built-in or custom:...), rendered inside the room view. */
export type CardConfig = { type: string } & Record<string, unknown>;

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
  cards?: CardConfig | CardConfig[]; // own cards below the Devices card (e.g. washer, dryer); one card or a list
  side_cards?: CardConfig | CardConfig[]; // own cards in the left column below the camera (e.g. a remote)
  climate_extra?: DeviceConfig[]; // extra values in the Climate card (CO2, pressure, VOC, ...)
  automations?: string[]; // automation entities shown with on/off toggles
  // 3D printer card (any integration; names below match ha-bambulab entities)
  printer_name?: string;
  printer_status?: string; // sensor, e.g. sensor.<printer>_print_status
  printer_progress?: string; // sensor in %
  printer_remaining?: string; // duration sensor (s, min or h)
  printer_nozzle?: string;
  printer_bed?: string;
  printer_chamber?: string;
  printer_light?: string; // light or switch
  printer_pause?: string; // button
  printer_resume?: string; // button
  printer_stop?: string; // button, always confirmed
  printer_picture?: string; // camera or image entity (chamber camera, cover image)
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

/** One power meter or metered circuit on the Energy view. */
export interface EnergyMeter {
  name: string;
  power: string; // instantaneous power sensor (W or kW)
  energy?: string; // total energy sensor (kWh)
  current?: string; // A
  power_factor?: string; // % (0-100) or 0-1
  voltage?: string; // V
  frequency?: string; // Hz
  max_power?: number; // W, full scale of the gauge (default 3000)
  main?: boolean; // shown large at the top (whole house meter)
  power_a?: string;
  power_b?: string;
  power_c?: string;
  current_a?: string;
  current_b?: string;
  current_c?: string;
  voltage_a?: string;
  voltage_b?: string;
  voltage_c?: string;
}

export interface AtlasConfig {
  type: string;
  appearance?: AppearanceConfig;
  entities?: GlobalEntities;
  alerts?: AlertsConfig;
  floors?: FloorConfig[];
  rooms?: RoomConfig[];
  layout?: LayoutConfig;
  energy_meters?: EnergyMeter[];
}

/** Config passed to every generated custom:atlas-view card. */
export interface AtlasViewCardConfig {
  type: string;
  view: "home" | "alerts" | "rooms" | "room" | "energy";
  room?: string;
  floor?: string;
  atlas: AtlasConfig;
}
