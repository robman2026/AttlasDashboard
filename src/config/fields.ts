// Single source of truth for every configuration option.
// Used by the graphical editor (src/editor/strategy-editor.ts) AND by the docs
// generator (scripts/build-docs.mjs -> docs/configuration.md).
// Add or change an option here and both the editor and the docs follow.
// Keep this file free of runtime imports (Node imports it directly for the docs).

/** Placeholders the editor replaces with live option lists. */
export type DynamicOptions = "$rooms" | "$floors" | "$icons";

export interface FieldDef {
  name: string;
  label: string;
  /** Plain type shown in the docs, e.g. "entity (sensor)". */
  type: string;
  help?: string;
  default?: string;
  required?: boolean;
  /** ha-form selector. `options` may be a DynamicOptions placeholder. */
  selector: Record<string, any>;
  /** Editor groups fields with the same group into one expandable block. */
  group?: string;
  /** Sub-fields for list-of-object options (rendered with the object selector). */
  fields?: FieldDef[];
}

export interface SectionDef {
  key: "appearance" | "entities" | "alerts" | "floors" | "rooms" | "layout" | "energy_meters";
  tab: string;
  title: string;
  intro: string;
  /** "object": config[key] is an object. "list": config[key] is a list (floors, rooms). */
  shape: "object" | "list";
  fields: FieldDef[];
}

const ent = (domain?: string | string[], multiple = false) => ({
  entity: { ...(domain ? { domain } : {}), ...(multiple ? { multiple: true } : {}) },
});
const text = { text: {} };
const bool = { boolean: {} };
const sel = (options: string[] | { value: string; label: string }[] | DynamicOptions, extra: Record<string, unknown> = {}) => ({
  select: { mode: "dropdown", options, ...extra },
});
const dom = (d: string | string[]) => (Array.isArray(d) ? d.join(", ") : d);

export const DEVICE_FIELDS: FieldDef[] = [
  { name: "entity", label: "Entity", type: "entity (any)", required: true, selector: ent() },
  { name: "name", label: "Name", type: "text", help: "Label on the tile. Default: the entity's friendly name.", selector: text },
  { name: "icon", label: "Icon override", type: "mdi icon", help: "Optional, e.g. mdi:lamp. Default: chosen from the entity's domain and device class.", selector: { icon: {} } },
];

export const SECTIONS: SectionDef[] = [
  {
    key: "appearance",
    tab: "General",
    title: "Appearance (`appearance`)",
    intro: "Look of the dashboard. Each device can override style and accent with the gear icon in the top bar (stored in that browser only).",
    shape: "object",
    fields: [
      { name: "accent", label: "Accent colour (hex)", type: "hex colour", default: "#56E7C0", help: "Presets: #56E7C0 mint, #5EC8FF blue, #A7A3FF lavender, #FF8FB1 pink. Any #RRGGBB works.", selector: { select: { options: ["#56E7C0", "#5EC8FF", "#A7A3FF", "#FF8FB1"], custom_value: true } } },
      { name: "variant", label: "Style variant", type: "warm_glass | glass | quiet", default: "warm_glass", help: "warm_glass: blurred room photo + glass panels. glass: no photo. quiet: opaque panels, no blur (best for the wall tablet).", selector: sel([{ value: "warm_glass", label: "Warm glass (photo + blur)" }, { value: "glass", label: "Glass (no photo)" }, { value: "quiet", label: "Quiet (opaque, no blur)" }]) },
      { name: "ambience", label: "Ambience", type: "graphite | midnight | deep_teal | violet_night | warm", default: "graphite", help: "Background colour mood behind the glass.", selector: sel([{ value: "graphite", label: "Graphite" }, { value: "midnight", label: "Midnight" }, { value: "deep_teal", label: "Deep teal" }, { value: "violet_night", label: "Violet night" }, { value: "warm", label: "Warm" }]) },
      { name: "background", label: "Home background image (room)", type: "room id", default: "first room", help: "Room whose image is the blurred Home background. Room views always use their own image.", selector: sel("$rooms") },
      { name: "image_path", label: "Room image base URL", type: "URL", default: "rooms/ next to atlas-home.js", help: "Where room images are loaded from. Example for own photos: /local/atlas/rooms/", selector: text },
    ],
  },
  {
    key: "entities",
    tab: "Entities",
    title: "Global entities (`entities`)",
    intro: "House-wide entities used by the greeting, top bar, Climate, Energy, Security and Quick actions. Leave a field empty to hide what depends on it.",
    shape: "object",
    fields: [
      { name: "alarm", label: "Alarm panel", type: `entity (${dom("alarm_control_panel")})`, help: "Greeting line, Security card, Arm away quick action.", selector: ent("alarm_control_panel") },
      { name: "weather", label: "Weather", type: "entity (weather)", help: "Top bar condition and icon.", selector: ent("weather") },
      { name: "outdoor_temperature", label: "Outdoor temperature", type: "entity (sensor)", help: "Top bar temperature. Falls back to the weather entity's temperature.", selector: ent("sensor") },
      { name: "heat_pump", label: "Heat pump (climate)", type: "entity (climate)", help: "Greeting indoor reading and Climate card ring (current and target).", selector: ent("climate"), group: "Heat pump" },
      { name: "heat_pump_outdoor", label: "Heat pump outdoor sensor", type: "entity (sensor)", selector: ent("sensor"), group: "Heat pump" },
      { name: "heat_pump_supply", label: "Heat pump supply line", type: "entity (sensor)", selector: ent("sensor"), group: "Heat pump" },
      { name: "heat_pump_return", label: "Heat pump return line", type: "entity (sensor)", selector: ent("sensor"), group: "Heat pump" },
      { name: "solar_power", label: "Solar power", type: "entity (sensor, W or kW)", selector: ent("sensor"), group: "Energy" },
      { name: "house_load", label: "House load", type: "entity (sensor, W or kW)", help: "Total house consumption.", selector: ent("sensor"), group: "Energy" },
      { name: "grid_import", label: "Grid import", type: "entity (sensor, W or kW)", selector: ent("sensor"), group: "Energy" },
      { name: "grid_export", label: "Grid export", type: "entity (sensor, W or kW)", help: "When export is larger than import the arrow points to the grid.", selector: ent("sensor"), group: "Energy" },
      { name: "garage_cover", label: "Garage door (cover)", type: "entity (cover)", help: "Garage quick action (open or close, always confirmed).", selector: ent("cover"), group: "Quick actions and system" },
      { name: "wake_pc", label: "Wake PC", type: "entity (input_button, button, script)", help: "Wake PC quick action (press, or script.turn_on).", selector: ent(["input_button", "button", "script"]), group: "Quick actions and system" },
      { name: "incidents", label: "Incident report sensor", type: "entity (sensor)", help: "Optional log analysis sensor with attributes critical, warning, minor (numbers or lists) and summary.", selector: ent("sensor"), group: "Quick actions and system" },
      { name: "persons", label: "Persons", type: "list of entity (person)", help: "Reserved for presence display (not shown yet).", selector: ent("person", true), group: "Quick actions and system" },
      { name: "exclude_lights", label: "Lights never counted as room lights", type: "list of entity (light)", help: "Camera status LEDs etc. Excluded from Lights off.", selector: ent("light", true), group: "Quick actions and system" },
    ],
  },
  {
    key: "alerts",
    tab: "Alerts",
    title: "Alert rules (`alerts`)",
    intro: "Rules for the attention banner and Alerts view. See docs/alerts.md for how each rule behaves. Unknown or unavailable is never treated as clear.",
    shape: "object",
    fields: [
      { name: "temperature_rules", label: "Temperature limits (warning)", type: "list", help: "Warning above `above`, clears below `clear_below` (hysteresis).", selector: { object: {} }, fields: [
        { name: "label", label: "Label", type: "text", help: "Default: room name.", selector: text },
        { name: "entity", label: "Temperature sensor", type: "entity (sensor)", required: true, selector: ent("sensor") },
        { name: "above", label: "Warn above (°C)", type: "number", required: true, selector: { number: { mode: "box", step: 0.5 } } },
        { name: "clear_below", label: "Clear below (°C)", type: "number", default: "same as above", selector: { number: { mode: "box", step: 0.5 } } },
      ] },
      { name: "exterior_doors", label: "Exterior doors (warning when open)", type: "list of entity (binary_sensor, cover)", selector: ent(["binary_sensor", "cover"], true) },
      { name: "interior_doors", label: "Interior doors (info when open)", type: "list of entity (binary_sensor, cover)", selector: ent(["binary_sensor", "cover"], true) },
      { name: "critical", label: "Critical detectors (leak, smoke)", type: "list of entity (binary_sensor)", help: "Critical when on. Warning when the detector itself is unavailable.", selector: ent("binary_sensor", true) },
      { name: "mailbox", label: "Mailbox contact", type: "entity (binary_sensor)", help: "Info while open (or while the acknowledge helper is on).", selector: ent("binary_sensor") },
      { name: "mailbox_ack", label: "Mailbox acknowledge helper", type: "entity (input_boolean)", help: "Optional. If set, the alert stays until this helper is turned off (Acknowledge button). An automation must turn it on when the mailbox opens.", selector: ent("input_boolean") },
      { name: "updates", label: "Show available updates (info)", type: "boolean", default: "true", selector: bool },
      { name: "data_quality", label: "Warn about unavailable mapped devices", type: "boolean", default: "true", selector: bool },
    ],
  },
  {
    key: "floors",
    tab: "Floors",
    title: "Floors (`floors`)",
    intro: "List of floors, top to bottom. Rooms reference a floor by id. Independent of the HA floor registry.",
    shape: "list",
    fields: [
      { name: "id", label: "ID", type: "text", required: true, help: "Used in URLs (floor-<id>). Lowercase, no spaces.", selector: text },
      { name: "name", label: "Name", type: "text", required: true, selector: text },
      { name: "level", label: "Level", type: "text", help: "Shown on the floor card, e.g. +1, 0, -1.", selector: text },
    ],
  },
  {
    key: "rooms",
    tab: "Rooms",
    title: "Rooms (`rooms`)",
    intro: "List of rooms in display order (previous / next follow this order within a floor). Independent of the HA area registry.",
    shape: "list",
    fields: [
      { name: "id", label: "ID", type: "text", required: true, help: "Used in URLs (room-<id>) and in layout lists. Lowercase, no spaces.", selector: text, group: "_grid" },
      { name: "name", label: "Name", type: "text", required: true, selector: text, group: "_grid" },
      { name: "floor", label: "Floor", type: "floor id", selector: sel("$floors"), group: "_grid" },
      { name: "icon", label: "Icon", type: "ATLAS icon key", help: "One of the shipped line icons, e.g. office, living, server.", selector: sel("$icons"), group: "_grid" },
      { name: "image", label: "Image", type: "file name or URL", help: "File under the image base URL (e.g. office.jpg, backup/shelter.jpg) or a full URL. Empty: no photo.", selector: text },
      { name: "temperature", label: "Temperature sensor", type: "entity (sensor)", selector: ent("sensor") },
      { name: "humidity", label: "Humidity sensor", type: "entity (sensor)", selector: ent("sensor") },
      { name: "show_camera", label: "Show camera section", type: "boolean", default: "true", help: "Off: the room has no camera section at all (no Camera card, no stream, not counted as unavailable), even if a camera entity is set. On without a camera entity: a compact \"No camera\" card.", selector: bool, group: "Camera" },
      { name: "camera", label: "Camera (live stream)", type: "entity (camera)", help: "Enables the camera slot (16:9) with Live, Snapshot, Recordings.", selector: ent("camera"), group: "Camera" },
      { name: "camera_hq", label: "Camera high quality stream", type: "entity (camera)", help: "Optional, reserved for a quality switch.", selector: ent("camera"), group: "Camera" },
      { name: "camera_snapshot", label: "Snapshot camera", type: "entity (camera)", help: "Optional. Snapshot uses this entity's picture, else the live camera's.", selector: ent("camera"), group: "Camera" },
      { name: "camera_private", label: "Private camera", type: "boolean", default: "false", help: "Stream hidden until the user taps Reveal. Off: the live stream starts (muted) as soon as the room opens.", selector: bool, group: "Camera" },
      { name: "devices", label: "Devices", type: "list", help: "Device tiles. Tap toggles light, switch, fan, input_boolean; other domains and long press open more-info.", selector: { object: {} }, fields: DEVICE_FIELDS },
    ],
  },
  {
    key: "layout",
    tab: "Layout",
    title: "Layout (`layout`)",
    intro: "Which rooms appear where. Lists of room ids, in order.",
    shape: "object",
    fields: [
      { name: "home_tiles", label: "Home room tiles", type: "list of room id", default: "first 8 rooms", help: "8 tiles use the 3 / 2 / 3 design grid.", selector: { select: { multiple: true, reorder: true, options: "$rooms" } } },
      { name: "top_tabs", label: "Top bar room tabs", type: "list of room id", selector: { select: { multiple: true, reorder: true, options: "$rooms" } } },
      { name: "security_tiles", label: "Security camera tiles", type: "list of room id", help: "Live camera stills (16:9, refreshed every 10 s) on the Home Security card; tap opens the room view.", selector: { select: { multiple: true, reorder: true, options: "$rooms" } } },
    ],
  },
  {
    key: "energy_meters",
    tab: "Energy",
    title: "Energy meters (`energy_meters`)",
    intro: "Power meters and metered circuits for the Energy view (sidebar > Energy). Mark the whole-house meter as main to show it large with its phases. Without meters, Energy opens the built-in HA Energy dashboard.",
    shape: "list",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, selector: text },
      { name: "power", label: "Power sensor", type: "entity (sensor, W or kW)", required: true, selector: ent("sensor") },
      { name: "main", label: "Main meter", type: "boolean", default: "false", help: "Shown large at the top with phases. Use for the whole-house meter.", selector: bool },
      { name: "max_power", label: "Gauge full scale (W)", type: "number", default: "3000", help: "Power at which the gauge ring is full.", selector: { number: { min: 1, mode: "box", unit_of_measurement: "W" } } },
      { name: "energy", label: "Total energy sensor", type: "entity (sensor, kWh)", selector: ent("sensor") },
      { name: "current", label: "Current sensor", type: "entity (sensor, A)", selector: ent("sensor") },
      { name: "power_factor", label: "Power factor sensor", type: "entity (sensor)", help: "Percent (0-100) or 0-1; shown as %.", selector: ent("sensor") },
      { name: "voltage", label: "Voltage sensor", type: "entity (sensor, V)", selector: ent("sensor") },
      { name: "frequency", label: "Frequency sensor", type: "entity (sensor, Hz)", selector: ent("sensor") },
      { name: "power_a", label: "Phase A power", type: "entity (sensor)", help: "Phase sensors are optional; with any of them set the meter shows a phase table.", selector: ent("sensor") },
      { name: "power_b", label: "Phase B power", type: "entity (sensor)", selector: ent("sensor") },
      { name: "power_c", label: "Phase C power", type: "entity (sensor)", selector: ent("sensor") },
      { name: "current_a", label: "Phase A current", type: "entity (sensor)", selector: ent("sensor") },
      { name: "current_b", label: "Phase B current", type: "entity (sensor)", selector: ent("sensor") },
      { name: "current_c", label: "Phase C current", type: "entity (sensor)", selector: ent("sensor") },
      { name: "voltage_a", label: "Phase A voltage", type: "entity (sensor)", selector: ent("sensor") },
      { name: "voltage_b", label: "Phase B voltage", type: "entity (sensor)", selector: ent("sensor") },
      { name: "voltage_c", label: "Phase C voltage", type: "entity (sensor)", selector: ent("sensor") },
    ],
  },
];
