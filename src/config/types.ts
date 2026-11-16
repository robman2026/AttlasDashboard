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
  light_mood?: boolean; // room photos follow the room lights (default true)
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
  rain_windows?: string[]; // warning when open while the weather is wet (rain, snow, lightning, hail)
  rain_weather?: string; // weather entity for that rule (default: entities.weather)
  rain_min_mm?: number; // hourly forecast precipitation that confirms rain (default 0.1 mm)
  severe_weather?: boolean; // warning for lightning, hail, pouring, exceptional (default true)
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

/** toggle: light, switch, fan, input_boolean. press: press a button / input_button, run a script. more-info: details. */
export type TapAction = "toggle" | "more-info" | "press";

/** One tile in a room's Devices card. */
export interface RoomDeviceConfig extends DeviceConfig {
  tap?: TapAction; // default: toggle for light, switch, fan, input_boolean; more-info otherwise
  confirm?: boolean; // ask before the tap action and before cover Open / Close (default: true for garage doors and gates)
}

/** One appliance in a room's Appliances card (porting plan step 9). Only `name` is required. */
export interface ApplianceConfig {
  name: string;
  entity?: string; // main state: switch, binary_sensor, sensor (on = running)
  icon?: string; // mdi:* when no temperature is set
  operation?: string; // operation state (Ready, Run, Finished ...)
  program?: string; // active program
  door?: string; // door sensor
  temperature?: string; // current temperature: arc gauge instead of the icon
  temperature_max?: number; // full scale of the arc (default 300)
  setpoint?: string; // target temperature
  progress?: string; // program progress in %
  finish?: string; // finish time (timestamp sensor) or remaining time
  remote?: string; // remote start allowed
  controls?: string[]; // switches / buttons / scripts shown while running (e.g. Extra dry, Pause)
  stop?: string; // button or script, always asks first
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
  light_entities?: string[]; // what counts as this room's lights (light, switch, input_boolean); default: its light.* devices
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
  // Vehicle card (porting plan step 2). Appears in the room whose config sets car_* entities.
  car_name?: string;
  car_subtitle?: string; // e.g. model
  car_image?: string; // file under the image base URL, or a full URL; empty: drawn car outline
  car_lock?: string; // lock entity: state plus Lock / Unlock
  car_doors_locked?: string; // read-only lock status (sensor or binary_sensor with device class lock)
  car_doors_locked_when?: string; // state value that means locked (default: by entity type)
  car_range?: string;
  car_odometer?: string;
  car_location?: string; // device_tracker (zone name, home, not_home) or sensor
  car_daily_distance?: string;
  car_daily_trips?: string;
  car_monthly_distance?: string;
  car_monthly_trips?: string;
  car_last_updated?: string; // timestamp sensor; otherwise the newest last_updated of the car entities
  car_flash?: string; // button / input_button / script
  car_horn?: string; // button / input_button / script, asks first
  car_refresh?: string; // button / input_button / script: ask the car for fresh data
  appliances?: ApplianceConfig[]; // Appliances card (oven, dishwasher, washer, dryer ...)
  // Room power (porting plan step 7): metered circuit of this room
  power?: string; // power sensor (W or kW)
  power_energy?: string; // energy sensor (kWh)
  power_current?: string; // current sensor (A)
  power_max?: number; // W at full gauge (default 3000)
  // Lawn mower card
  mower?: string; // lawn_mower entity
  mower_battery?: string; // battery sensor (%)
  mower_name?: string;
  // Salt level (water softener)
  salt_level?: string; // sensor in % (0..100, or 0..1)
  salt_distance?: string; // optional raw sensor shown as detail (e.g. distance to the salt)
  salt_warn_below?: number; // % below which the alert asks to buy salt (default 30)
  salt_name?: string; // default "Salt level"
  camera?: string; // live stream entity
  camera_hq?: string;
  camera_snapshot?: string;
  camera_private?: boolean; // hidden until "Reveal"
  devices?: RoomDeviceConfig[];
}

export interface LayoutConfig {
  home_tiles?: string[];
  top_tabs?: string[];
  security_tiles?: string[];
  home_cards?: CardConfig | CardConfig[]; // own Lovelace cards below the Home grid
  system_cards?: CardConfig | CardConfig[]; // own Lovelace cards on the System page
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

/** One PV string of the inverter (Solar view). */
export interface SolarString {
  name: string;
  power?: string;
  voltage?: string;
  current?: string;
}

/** Solar view (porting plan step 10, from the owner's FusionSolar card). Live values fall back to `entities`. */
export interface SolarConfig {
  name?: string; // view title, default "Solar"
  power?: string; // PV power now (default entities.solar_power)
  peak_power?: number; // kW at a full gauge (default 6)
  house_load?: string; // default entities.house_load
  grid_import?: string; // default entities.grid_import
  grid_export?: string; // default entities.grid_export
  battery_soc?: string; // %
  battery_power?: string; // W or kW, positive = charging
  production_today?: string; // kWh, also the hourly chart (long-term statistics)
  consumption_today?: string; // kWh
  export_today?: string; // kWh
  import_today?: string; // kWh
  forecast_today?: string; // kWh
  remaining_today?: string; // kWh still expected today
  self_consumption?: string; // % of production used in the house
  strings?: SolarString[];
  inverter?: DeviceConfig[]; // inverter values: status, temperature, frequency, ...
}

/** Heat pump view (porting plan step 10, from the owner's Nibe SMO S40 card). Works with any heat pump. */
export interface HeatPumpConfig {
  name?: string; // view title, default "Heat pump"
  climate?: string; // climate entity (default entities.heat_pump)
  status?: string; // compressor or operation state
  priority?: string; // e.g. heating / hot water
  mode?: string; // select (e.g. smart home mode): tap opens it
  connection?: string;
  degree_minutes?: string;
  gauges?: DeviceConfig[]; // up to 4 temperature gauges
  gauge_min?: number; // default -20
  gauge_max?: number; // default 80
  energy_produced?: string; // kWh total (COP = produced / consumed)
  energy_consumed?: string; // kWh total
  power?: string; // current power use
  energy?: DeviceConfig[]; // more energy values (heating, hot water, demand at DOT)
  pressures?: DeviceConfig[];
  circuit?: DeviceConfig[]; // refrigerant circuit values
  runtimes?: DeviceConfig[]; // run times, compressor starts
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
  solar?: SolarConfig;
  heat_pump?: HeatPumpConfig;
}

/** Config passed to every generated custom:atlas-view card. */
export interface AtlasViewCardConfig {
  type: string;
  view: "home" | "alerts" | "rooms" | "room" | "energy" | "lights" | "security" | "system" | "solar" | "heatpump";
  room?: string;
  floor?: string;
  atlas: AtlasConfig;
}
