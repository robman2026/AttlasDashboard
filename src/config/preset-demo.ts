// Demo house with fictional rooms and entity IDs. Used by the editor's
// "Load demo house" button (a starting point to adapt), the local harness and
// the README screenshots. Real house configs are never committed: keep them in
// a *.private.yaml file (git-ignored) and paste them into the dashboard YAML.
import type { AtlasConfig } from "./types";

export const DEMO_PRESET: Omit<AtlasConfig, "type"> = {
  appearance: { accent: "#56E7C0", variant: "warm_glass", ambience: "graphite", background: "living" },
  entities: {
    alarm: "alarm_control_panel.home_alarm",
    weather: "weather.home",
    outdoor_temperature: "sensor.outdoor_temperature",
    heat_pump: "climate.heat_pump",
    heat_pump_outdoor: "sensor.heat_pump_outdoor_temperature",
    heat_pump_supply: "sensor.heat_pump_supply_temperature",
    heat_pump_return: "sensor.heat_pump_return_temperature",
    solar_power: "sensor.solar_power",
    house_load: "sensor.house_power",
    grid_import: "sensor.grid_import_power",
    grid_export: "sensor.grid_export_power",
    incidents: "sensor.incident_report",
    wake_pc: "input_button.wake_pc",
    garage_cover: "cover.garage_door",
    persons: ["person.alex", "person.sam"],
    exclude_lights: ["light.attic_camera_status_led", "light.garage_camera_status_led"],
  },
  alerts: {
    temperature_rules: [{ entity: "sensor.server_room_temperature", above: 32, clear_below: 30, label: "Server room" }],
    exterior_doors: ["binary_sensor.basement_door", "binary_sensor.front_door", "cover.garage_door"],
    interior_doors: ["binary_sensor.office_door", "binary_sensor.bathroom_door"],
    critical: [],
    mailbox: "binary_sensor.mailbox",
    updates: true,
    data_quality: true,
  },
  floors: [
    { id: "attic", level: "+2", name: "Attic" },
    { id: "first", level: "+1", name: "First floor" },
    { id: "ground", level: "0", name: "Ground floor" },
    { id: "basement", level: "-1", name: "Basement" },
  ],
  rooms: [
    {
      id: "attic", name: "Attic", floor: "attic", icon: "attic", image: "attic.jpg",
      temperature: "sensor.attic_temperature", humidity: "sensor.attic_humidity", camera: "camera.attic",
      devices: [
        { entity: "binary_sensor.attic_window", name: "Window" },
        { entity: "binary_sensor.attic_motion", name: "Motion" },
        { entity: "light.attic_ceiling", name: "Ceiling light" },
      ],
    },
    {
      id: "kids_room", name: "Kids room", floor: "first", icon: "kids-room", image: "backup/kids-room.jpg",
      temperature: "sensor.kids_room_temperature", humidity: "sensor.kids_room_humidity",
      camera: "camera.kids_room", camera_private: true,
      devices: [
        { entity: "binary_sensor.kids_room_window_left", name: "Window left" },
        { entity: "binary_sensor.kids_room_window_right", name: "Window right" },
        { entity: "binary_sensor.kids_room_motion", name: "Motion" },
        { entity: "light.kids_room_fan_light", name: "Fan light" },
        { entity: "fan.kids_room_fan", name: "Ceiling fan" },
      ],
    },
    {
      id: "office", name: "Office", floor: "first", icon: "office", image: "office.jpg",
      temperature: "sensor.office_temperature", humidity: "sensor.office_humidity",
      devices: [
        { entity: "binary_sensor.office_door", name: "Door" },
        { entity: "binary_sensor.office_window", name: "Window" },
        { entity: "light.office_fan_light", name: "Fan light" },
        { entity: "fan.office_fan", name: "Ceiling fan" },
      ],
    },
    {
      id: "bedroom", name: "Bedroom", floor: "first", icon: "bedroom", image: "bedroom.jpg", show_camera: false,
      temperature: "sensor.bedroom_temperature", humidity: "sensor.bedroom_humidity",
      devices: [
        { entity: "light.bedroom_canopy", name: "Canopy LEDs" },
        { entity: "light.bedroom_wardrobe", name: "Wardrobe LEDs" },
      ],
    },
    {
      id: "hallway", name: "Upstairs hall", floor: "first", icon: "hallway", image: "hallway.jpg",
      temperature: "sensor.hallway_temperature", humidity: "sensor.hallway_humidity",
      devices: [
        { entity: "binary_sensor.hallway_motion", name: "Motion" },
        { entity: "binary_sensor.stair_window", name: "Stair window" },
        { entity: "binary_sensor.hallway_skylight", name: "Skylight" },
      ],
    },
    {
      id: "bathroom", name: "Bathroom", floor: "first", icon: "humidity", image: "bathroom.jpg",
      devices: [
        { entity: "binary_sensor.bathroom_door", name: "Door" },
        { entity: "binary_sensor.bathroom_motion", name: "Motion" },
        { entity: "binary_sensor.bathroom_skylight", name: "Skylight" },
      ],
    },
    {
      id: "guest_room", name: "Guest room", floor: "first", icon: "bedroom",
      temperature: "sensor.guest_room_temperature", humidity: "sensor.guest_room_humidity",
      devices: [{ entity: "binary_sensor.guest_room_window", name: "Window" }],
    },
    {
      id: "living", name: "Living room", floor: "ground", icon: "living", image: "living.jpg",
      temperature: "sensor.living_room_temperature", humidity: "sensor.living_room_humidity", camera: "camera.living_room",
      devices: [
        { entity: "binary_sensor.living_room_window_left", name: "Window left" },
        { entity: "binary_sensor.living_room_window_right", name: "Window right" },
        { entity: "binary_sensor.living_room_presence", name: "Presence" },
        { entity: "light.tv_backlight", name: "TV backlight" },
        { entity: "media_player.living_room_tv", name: "TV" },
      ],
    },
    {
      id: "kitchen", name: "Kitchen", floor: "ground", icon: "kitchen", image: "kitchen.jpg",
      devices: [
        { entity: "light.kitchen_cabinet_left", name: "Cabinet light left" },
        { entity: "light.kitchen_cabinet_right", name: "Cabinet light right" },
        { entity: "binary_sensor.kitchen_presence", name: "Presence" },
        { entity: "binary_sensor.kitchen_window", name: "Window" },
        { entity: "sensor.oven_temperature", name: "Oven" },
        { entity: "select.dishwasher_program", name: "Dishwasher" },
      ],
    },
    {
      id: "entrance", name: "Entrance", floor: "ground", icon: "door", image: "entrance.jpg", camera: "camera.doorbell",
      devices: [
        { entity: "binary_sensor.front_door", name: "Front door" },
        { entity: "binary_sensor.mailbox", name: "Mailbox" },
        { entity: "binary_sensor.doorbell_person", name: "Doorbell person" },
        { entity: "binary_sensor.entrance_motion", name: "Motion" },
      ],
    },
    {
      id: "guest_wc", name: "Guest WC", floor: "ground", icon: "humidity", image: "guest-wc.jpg",
      devices: [
        { entity: "binary_sensor.guest_wc_door", name: "Door" },
        { entity: "binary_sensor.guest_wc_motion", name: "Motion" },
        { entity: "light.guest_wc_mirror", name: "Mirror light" },
      ],
    },
    {
      id: "garage", name: "Garage", floor: "ground", icon: "garage", image: "garage.jpg",
      temperature: "sensor.garage_temperature", humidity: "sensor.garage_humidity", camera: "camera.garage",
      devices: [
        { entity: "cover.garage_door", name: "Garage door" },
        { entity: "binary_sensor.garage_side_door", name: "Side door" },
        { entity: "binary_sensor.garage_window", name: "Window" },
        { entity: "binary_sensor.garage_motion", name: "Motion" },
      ],
    },
    {
      id: "garden", name: "Garden", floor: "ground", icon: "eco",
      devices: [
        { entity: "binary_sensor.garden_door", name: "Garden door" },
        { entity: "switch.garden_irrigation", name: "Irrigation valve" },
        { entity: "sensor.lawn_mower_status", name: "Lawn mower" },
      ],
    },
    {
      id: "basement", name: "Basement", floor: "basement", icon: "basement", image: "basement.jpg",
      temperature: "sensor.basement_temperature", humidity: "sensor.basement_humidity", camera: "camera.basement",
      devices: [
        { entity: "binary_sensor.basement_door", name: "Door" },
        { entity: "binary_sensor.basement_hall_motion", name: "Hall motion" },
        { entity: "binary_sensor.basement_stairs_motion", name: "Stairs motion" },
        { entity: "media_player.basement_tv", name: "TV" },
      ],
    },
    {
      id: "shelter", name: "Shelter", floor: "basement", icon: "shelter", image: "backup/shelter.jpg",
      temperature: "sensor.shelter_temperature", humidity: "sensor.shelter_humidity", devices: [],
    },
    {
      id: "server", name: "Server room", floor: "basement", icon: "server", image: "server.jpg",
      temperature: "sensor.server_room_temperature", humidity: "sensor.server_room_humidity", devices: [],
    },
    {
      id: "workshop", name: "Workshop", floor: "basement", icon: "settings", camera: "camera.workshop",
      devices: [
        { entity: "sensor.3d_printer_status", name: "3D printer" },
        { entity: "sensor.3d_printer_progress", name: "Print progress" },
        { entity: "light.3d_printer_chamber", name: "Chamber light" },
        { entity: "binary_sensor.workshop_presence", name: "Presence" },
      ],
    },
    {
      id: "utility", name: "Utility room", floor: "basement", icon: "system", image: "utility.jpg",
      devices: [
        { entity: "binary_sensor.utility_room_door", name: "Door" },
        { entity: "climate.heat_pump", name: "Heat pump" },
      ],
    },
    {
      id: "laundry", name: "Laundry", floor: "basement", icon: "power",
      devices: [
        { entity: "sensor.washer_power", name: "Washer" },
        { entity: "sensor.dryer_power", name: "Dryer" },
      ],
    },
  ],
  layout: {
    home_tiles: ["living", "office", "kids_room", "bedroom", "hallway", "basement", "garage", "server"],
    top_tabs: ["living", "kitchen", "bedroom", "office", "kids_room", "garage"],
    security_tiles: ["entrance", "garage"],
  },
  energy_meters: [
    {
      name: "Whole house", main: true, max_power: 11000,
      power: "sensor.main_meter_power", energy: "sensor.main_meter_energy", current: "sensor.main_meter_current",
      power_factor: "sensor.main_meter_power_factor", frequency: "sensor.main_meter_frequency",
      power_a: "sensor.main_meter_power_a", power_b: "sensor.main_meter_power_b", power_c: "sensor.main_meter_power_c",
      current_a: "sensor.main_meter_current_a", current_b: "sensor.main_meter_current_b", current_c: "sensor.main_meter_current_c",
      voltage_a: "sensor.main_meter_voltage_a", voltage_b: "sensor.main_meter_voltage_b", voltage_c: "sensor.main_meter_voltage_c",
    },
    { name: "Kitchen", power: "sensor.circuit_kitchen_power", energy: "sensor.circuit_kitchen_energy", current: "sensor.circuit_kitchen_current", power_factor: "sensor.circuit_kitchen_power_factor", voltage: "sensor.circuit_kitchen_voltage", frequency: "sensor.circuit_kitchen_frequency", max_power: 3000 },
    { name: "Living & hallway", power: "sensor.circuit_living_power", energy: "sensor.circuit_living_energy", current: "sensor.circuit_living_current", power_factor: "sensor.circuit_living_power_factor", voltage: "sensor.circuit_living_voltage", frequency: "sensor.circuit_living_frequency", max_power: 2500 },
    { name: "Office", power: "sensor.circuit_office_power", energy: "sensor.circuit_office_energy", current: "sensor.circuit_office_current", power_factor: "sensor.circuit_office_power_factor", voltage: "sensor.circuit_office_voltage", frequency: "sensor.circuit_office_frequency", max_power: 2000 },
    { name: "Server rack", power: "sensor.circuit_server_power", energy: "sensor.circuit_server_energy", current: "sensor.circuit_server_current", power_factor: "sensor.circuit_server_power_factor", voltage: "sensor.circuit_server_voltage", frequency: "sensor.circuit_server_frequency", max_power: 500 },
    { name: "Laundry", power: "sensor.circuit_laundry_power", energy: "sensor.circuit_laundry_energy", current: "sensor.circuit_laundry_current", power_factor: "sensor.circuit_laundry_power_factor", voltage: "sensor.circuit_laundry_voltage", frequency: "sensor.circuit_laundry_frequency", max_power: 3000 },
    { name: "Heating pump", power: "sensor.circuit_heating_power", energy: "sensor.circuit_heating_energy", current: "sensor.circuit_heating_current", power_factor: "sensor.circuit_heating_power_factor", voltage: "sensor.circuit_heating_voltage", frequency: "sensor.circuit_heating_frequency", max_power: 2000 },
    {
      name: "Oven & cooktop", power: "sensor.circuit_cooking_power", energy: "sensor.circuit_cooking_energy",
      power_factor: "sensor.circuit_cooking_power_factor", frequency: "sensor.circuit_cooking_frequency", max_power: 7000,
      power_a: "sensor.circuit_cooking_power_a", power_b: "sensor.circuit_cooking_power_b", power_c: "sensor.circuit_cooking_power_c",
      current_a: "sensor.circuit_cooking_current_a", current_b: "sensor.circuit_cooking_current_b", current_c: "sensor.circuit_cooking_current_c",
      voltage_a: "sensor.circuit_cooking_voltage_a", voltage_b: "sensor.circuit_cooking_voltage_b", voltage_c: "sensor.circuit_cooking_voltage_c",
    },
    { name: "Attic", power: "sensor.circuit_attic_power", energy: "sensor.circuit_attic_energy", current: "sensor.circuit_attic_current", power_factor: "sensor.circuit_attic_power_factor", voltage: "sensor.circuit_attic_voltage", frequency: "sensor.circuit_attic_frequency", max_power: 500 },
  ],
};
