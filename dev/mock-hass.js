// Mock hass for local visual checks of dist/atlas-home.js. Matches the demo
// house in src/config/preset-demo.ts (fictional rooms and entity IDs).
// Not shipped. Usage: npm run harness, then /dev/harness.html?view=home
const S = {};
const add = (id, state, attributes = {}) => (S[id] = { entity_id: id, state: String(state), attributes, last_changed: "", last_updated: "", context: { id: "" } });
const th = (room, t, h) => {
  add(`sensor.${room}_temperature`, t, { unit_of_measurement: "°C", device_class: "temperature" });
  if (h !== undefined) add(`sensor.${room}_humidity`, h, { unit_of_measurement: "%", device_class: "humidity" });
};
const contact = (id, on, dc = "door") => add(id, on ? "on" : "off", { device_class: dc });
const motion = (id, on = false, dc = "motion") => add(id, on ? "on" : "off", { device_class: dc });
const cam = (id, name, img) => add(id, "idle", { friendly_name: name, ...(img ? { entity_picture: `/dist/rooms/${img}?token=demo` } : {}) });
const na = (id) => add(id, "unavailable");

// Global
add("alarm_control_panel.home_alarm", "disarmed", { friendly_name: "Home alarm" });
add("weather.home", "cloudy", { temperature: 5.5 });
add("sensor.outdoor_temperature", 5.5, { unit_of_measurement: "°C" });
add("climate.heat_pump", "heat", { current_temperature: 18.2, temperature: 17, hvac_action: "heating", friendly_name: "Heat pump" });
add("sensor.heat_pump_outdoor_temperature", 9.3, { unit_of_measurement: "°C" });
add("sensor.heat_pump_supply_temperature", 21.4, { unit_of_measurement: "°C" });
add("sensor.heat_pump_return_temperature", 21.1, { unit_of_measurement: "°C" });
add("sensor.solar_power", 0, { unit_of_measurement: "kW" });
add("sensor.house_power", 0.42, { unit_of_measurement: "kW" });
add("sensor.grid_import_power", 0.42, { unit_of_measurement: "kW" });
add("sensor.grid_export_power", 0, { unit_of_measurement: "kW" });
add("sensor.incident_report", "0C / 1W / 1M", { critical: 0, warning: 1, minor: 1, summary: "Log analyzer · 06:00 run" });
add("input_button.wake_pc", "2026-10-30T20:00:00");
add("update.heat_pump_firmware", "on", { title: "Heat pump firmware" });
add("update.irrigation_controller", "on", { title: "Irrigation controller" });

// Attic
th("attic", 20.2, 51); cam("camera.attic", "Attic camera", "attic.jpg");
contact("binary_sensor.attic_window", false, "window"); motion("binary_sensor.attic_motion"); na("light.attic_ceiling");
// First floor
th("kids_room", 23.3, 48); cam("camera.kids_room", "Kids room camera", "kids-room.jpg");
contact("binary_sensor.kids_room_window_left", false, "window"); contact("binary_sensor.kids_room_window_right", false, "window");
na("binary_sensor.kids_room_motion"); na("light.kids_room_fan_light"); na("fan.kids_room_fan");
th("office", 23.9, 39); contact("binary_sensor.office_door", true); contact("binary_sensor.office_window", false, "window");
na("light.office_fan_light"); add("fan.office_fan", "unknown");
th("bedroom", 23.3, 49); add("light.bedroom_canopy", "off"); add("light.bedroom_wardrobe", "off");
th("hallway", 22.8, 43); motion("binary_sensor.hallway_motion"); contact("binary_sensor.stair_window", false, "window"); contact("binary_sensor.hallway_skylight", false, "window");
contact("binary_sensor.bathroom_door", true); motion("binary_sensor.bathroom_motion"); contact("binary_sensor.bathroom_skylight", false, "window");
th("guest_room", 23.4, 50); contact("binary_sensor.guest_room_window", false, "window");
// Ground floor
th("living_room", 23.2, 46); cam("camera.living_room", "Living room camera", "living.jpg");
contact("binary_sensor.living_room_window_left", false, "window"); contact("binary_sensor.living_room_window_right", false, "window");
motion("binary_sensor.living_room_presence", false, "occupancy"); add("light.tv_backlight", "off"); add("media_player.living_room_tv", "off");
add("light.kitchen_cabinet_left", "on", { brightness: 255 }); add("light.kitchen_cabinet_right", "on", { brightness: 255 });
motion("binary_sensor.kitchen_presence", false, "presence"); contact("binary_sensor.kitchen_window", false, "window");
add("sensor.oven_temperature", 59, { unit_of_measurement: "°C" }); add("select.dishwasher_program", "unknown");
contact("binary_sensor.guest_wc_door", false); motion("binary_sensor.guest_wc_motion"); add("light.guest_wc_mirror", "on", { brightness: 160 });
cam("camera.doorbell", "Doorbell", "entrance.jpg");
contact("binary_sensor.front_door", false); contact("binary_sensor.mailbox", true, "opening");
motion("binary_sensor.doorbell_person", false, "occupancy"); na("binary_sensor.entrance_motion");
th("garage", 11.4, 58); cam("camera.garage", "Garage camera", "garage.jpg");
add("cover.garage_door", "closed", { device_class: "garage" }); contact("binary_sensor.garage_side_door", false);
na("binary_sensor.garage_window"); na("binary_sensor.garage_motion");
contact("binary_sensor.garden_door", false); add("switch.garden_irrigation", "off"); add("sensor.lawn_mower_status", "docked");
// Basement
th("basement", 20.4, 48); cam("camera.basement", "Basement camera", "basement.jpg");
contact("binary_sensor.basement_door", true); motion("binary_sensor.basement_hall_motion"); motion("binary_sensor.basement_stairs_motion"); na("media_player.basement_tv");
th("shelter", 19.4, 50);
th("server_room", 37.3, 9);
cam("camera.workshop", "Workshop camera"); add("sensor.3d_printer_status", "printing"); add("sensor.3d_printer_progress", 14, { unit_of_measurement: "%" });
add("light.3d_printer_chamber", "on"); motion("binary_sensor.workshop_presence", false, "presence");
contact("binary_sensor.utility_room_door", false);
add("sensor.washer_power", 0, { unit_of_measurement: "W" }); add("sensor.dryer_power", 0, { unit_of_measurement: "W" });

// Energy meters (fictional three-phase house meter and circuits)
const W = { unit_of_measurement: "W", device_class: "power" };
add("sensor.main_meter_power", 1486, W); add("sensor.main_meter_energy", 4812.6, { unit_of_measurement: "kWh" });
add("sensor.main_meter_current", 6.71, { unit_of_measurement: "A" }); add("sensor.main_meter_power_factor", 91, { unit_of_measurement: "%" });
add("sensor.main_meter_frequency", 50.01, { unit_of_measurement: "Hz" });
[["a", 812, 3.62, 231.4], ["b", 402, 1.88, 230.2], ["c", 272, 1.21, 232.0]].forEach(([p, w, a, v]) => {
  add(`sensor.main_meter_power_${p}`, w, W); add(`sensor.main_meter_current_${p}`, a, { unit_of_measurement: "A" }); add(`sensor.main_meter_voltage_${p}`, v, { unit_of_measurement: "V" });
});
[["kitchen", 640, 412.3], ["living", 188, 233.9], ["office", 214, 301.4], ["server", 96, 702.8], ["laundry", 0.4, 158.1], ["heating", 61, 389.2]].forEach(([k, w, e]) => {
  add(`sensor.circuit_${k}_power`, w, W); add(`sensor.circuit_${k}_energy`, e, { unit_of_measurement: "kWh" });
  add(`sensor.circuit_${k}_current`, (w / 230).toFixed(2), { unit_of_measurement: "A" }); add(`sensor.circuit_${k}_power_factor`, w > 1 ? 88 : 0, { unit_of_measurement: "%" });
  add(`sensor.circuit_${k}_voltage`, 230.6, { unit_of_measurement: "V" }); add(`sensor.circuit_${k}_frequency`, 50.0, { unit_of_measurement: "Hz" });
});
["power", "energy", "current", "power_factor", "voltage", "frequency"].forEach((k) => na(`sensor.circuit_attic_${k}`));
// Three-phase circuit (oven and cooktop): phase sensors only, no single current or voltage
add("sensor.circuit_cooking_power", 2140, W); add("sensor.circuit_cooking_energy", 912.4, { unit_of_measurement: "kWh" });
add("sensor.circuit_cooking_power_factor", 98, { unit_of_measurement: "%" }); add("sensor.circuit_cooking_frequency", 50.0, { unit_of_measurement: "Hz" });
[["a", 1420, 6.2, 230.9], ["b", 712, 3.1, 231.4], ["c", 8, 0.04, 230.2]].forEach(([p, w, a, v]) => {
  add(`sensor.circuit_cooking_power_${p}`, w, W); add(`sensor.circuit_cooking_current_${p}`, a, { unit_of_measurement: "A" }); add(`sensor.circuit_cooking_voltage_${p}`, v, { unit_of_measurement: "V" });
});

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const fmt = (s) => {
  if (s.state === "unavailable") return "Unavailable";
  const dc = s.attributes.device_class;
  if (s.entity_id.startsWith("binary_sensor.")) {
    if (["door", "window", "opening", "garage_door"].includes(dc)) return s.state === "on" ? "Open" : "Closed";
    return s.state === "on" ? "Detected" : "Clear";
  }
  const u = s.attributes.unit_of_measurement;
  return u ? `${s.state} ${u}` : cap(s.state.replace(/_/g, " "));
};

export const mockHass = {
  states: S,
  user: { name: "Demo", is_admin: true },
  config: { location_name: "Demo home", time_zone: "Europe/Zurich" },
  locale: { language: "en-GB" },
  language: "en",
  formatEntityState: fmt,
  callService: async (d, s, data) => console.log("callService", d, s, JSON.stringify(data)),
  callWS: async () => ({}),
};
