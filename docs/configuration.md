# Configuration reference

<!-- GENERATED FILE - do not edit. Source: src/config/fields.ts and src/config/preset-demo.ts. Run `npm run docs`. -->

Version 0.1.0. Everything below is editable in the dashboard: three dots > **Edit dashboard** (tabs match the sections), or in YAML via the dialog's three dots > **Edit in YAML**.

The strategy config lives in the dashboard's raw config:

```yaml
strategy:
  type: custom:atlas-home
  appearance: { ... }
  entities: { ... }
  alerts: { ... }
  floors: [ ... ]
  rooms: [ ... ]
  layout: { ... }
```

Rules that apply everywhere:

- Entities that are missing, `unavailable` or `unknown` are never shown as a valid value and never count as "clear".
- Rooms and floors come only from this config, not from the HA area or floor registry.


## Appearance (`appearance`)

Editor tab: **General**. Look of the dashboard. Each device can override style and accent with the gear icon in the top bar (stored in that browser only).

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `accent` | hex colour | #56E7C0 | Accent colour (hex). Presets: #56E7C0 mint, #5EC8FF blue, #A7A3FF lavender, #FF8FB1 pink. Any #RRGGBB works. |
| `variant` | warm_glass \| glass \| quiet | warm_glass | Style variant. warm_glass: blurred room photo + glass panels. glass: no photo. quiet: opaque panels, no blur (best for the wall tablet). |
| `ambience` | graphite \| midnight \| deep_teal \| violet_night \| warm | graphite | Ambience. Background colour mood behind the glass. |
| `background` | room id | first room | Home background image (room). Room whose image is the blurred Home background. Room views always use their own image. |
| `image_path` | URL | rooms/ next to atlas-home.js | Room image base URL. Where room images are loaded from. Example for own photos: /local/atlas/rooms/ |

## Global entities (`entities`)

Editor tab: **Entities**. House-wide entities used by the greeting, top bar, Climate, Energy, Security and Quick actions. Leave a field empty to hide what depends on it.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `alarm` | entity (alarm_control_panel) |  | Alarm panel. Greeting line, Security card, Arm away quick action. |
| `weather` | entity (weather) |  | Weather. Top bar condition and icon. |
| `outdoor_temperature` | entity (sensor) |  | Outdoor temperature. Top bar temperature. Falls back to the weather entity's temperature. |
| `heat_pump` | entity (climate) |  | Heat pump (climate). Greeting indoor reading and Climate card ring (current and target). |
| `heat_pump_outdoor` | entity (sensor) |  | Heat pump outdoor sensor |
| `heat_pump_supply` | entity (sensor) |  | Heat pump supply line |
| `heat_pump_return` | entity (sensor) |  | Heat pump return line |
| `solar_power` | entity (sensor, W or kW) |  | Solar power |
| `house_load` | entity (sensor, W or kW) |  | House load. Total house consumption. |
| `grid_import` | entity (sensor, W or kW) |  | Grid import |
| `grid_export` | entity (sensor, W or kW) |  | Grid export. When export is larger than import the arrow points to the grid. |
| `garage_cover` | entity (cover) |  | Garage door (cover). Garage quick action (open or close, always confirmed). |
| `wake_pc` | entity (input_button, button, script) |  | Wake PC. Wake PC quick action (press, or script.turn_on). |
| `incidents` | entity (sensor) |  | Incident report sensor. Optional log analysis sensor with attributes critical, warning, minor (numbers or lists) and summary. |
| `persons` | list of entity (person) |  | Persons. Reserved for presence display (not shown yet). |
| `exclude_lights` | list of entity (light) |  | Lights never counted as room lights. Camera status LEDs etc. Excluded from Lights off. |

## Alert rules (`alerts`)

Editor tab: **Alerts**. Rules for the attention banner and Alerts view. See docs/alerts.md for how each rule behaves. Unknown or unavailable is never treated as clear.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `temperature_rules` | list |  | Temperature limits (warning). Warning above `above`, clears below `clear_below` (hysteresis). |
| `exterior_doors` | list of entity (binary_sensor, cover) |  | Exterior doors (warning when open) |
| `interior_doors` | list of entity (binary_sensor, cover) |  | Interior doors (info when open) |
| `critical` | list of entity (binary_sensor) |  | Critical detectors (leak, smoke). Critical when on. Warning when the detector itself is unavailable. |
| `mailbox` | entity (binary_sensor) |  | Mailbox contact. Info while open (or while the acknowledge helper is on). |
| `mailbox_ack` | entity (input_boolean) |  | Mailbox acknowledge helper. Optional. If set, the alert stays until this helper is turned off (Acknowledge button). An automation must turn it on when the mailbox opens. |
| `updates` | boolean | true | Show available updates (info) |
| `data_quality` | boolean | true | Warn about unavailable mapped devices |

Items of `temperature_rules`:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | text |  | Label. Default: room name. |
| `entity` (required) | entity (sensor) |  | Temperature sensor |
| `above` (required) | number |  | Warn above (°C) |
| `clear_below` | number | same as above | Clear below (°C) |

## Floors (`floors`)

Editor tab: **Floors**. List of floors, top to bottom. Rooms reference a floor by id. Independent of the HA floor registry.

A list; each item has:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `id` (required) | text |  | ID. Used in URLs (floor-<id>). Lowercase, no spaces. |
| `name` (required) | text |  | Name |
| `level` | text |  | Level. Shown on the floor card, e.g. +1, 0, -1. |

## Rooms (`rooms`)

Editor tab: **Rooms**. List of rooms in display order (previous / next follow this order within a floor). Independent of the HA area registry.

A list; each item has:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `id` (required) | text |  | ID. Used in URLs (room-<id>) and in layout lists. Lowercase, no spaces. |
| `name` (required) | text |  | Name |
| `floor` | floor id |  | Floor |
| `icon` | ATLAS icon key |  | Icon. One of the shipped line icons, e.g. office, living, server. |
| `image` | file name or URL |  | Image. File under the image base URL (e.g. office.jpg, backup/shelter.jpg) or a full URL. Empty: no photo. |
| `temperature` | entity (sensor) |  | Temperature sensor |
| `humidity` | entity (sensor) |  | Humidity sensor |
| `show_camera` | boolean | true | Show camera section. Off: the room has no camera section at all (no Camera card, no stream, not counted as unavailable), even if a camera entity is set. On without a camera entity: a compact "No camera" card. |
| `camera` | entity (camera) |  | Camera (live stream). Enables the camera slot (16:9) with Live, Snapshot, Recordings. |
| `camera_hq` | entity (camera) |  | Camera high quality stream. Optional, reserved for a quality switch. |
| `camera_snapshot` | entity (camera) |  | Snapshot camera. Optional. Snapshot uses this entity's picture, else the live camera's. |
| `camera_private` | boolean | false | Private camera. Stream hidden until the user taps Reveal. Off: the live stream starts (muted) as soon as the room opens. |
| `devices` | list |  | Devices. Device tiles. Tap toggles light, switch, fan, input_boolean; other domains and long press open more-info. |

Items of `devices`:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `entity` (required) | entity (any) |  | Entity |
| `name` | text |  | Name. Label on the tile. Default: the entity's friendly name. |
| `icon` | mdi icon |  | Icon override. Optional, e.g. mdi:lamp. Default: chosen from the entity's domain and device class. |

## Layout (`layout`)

Editor tab: **Layout**. Which rooms appear where. Lists of room ids, in order.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `home_tiles` | list of room id | first 8 rooms | Home room tiles. 8 tiles use the 3 / 2 / 3 design grid. |
| `top_tabs` | list of room id |  | Top bar room tabs |
| `security_tiles` | list of room id |  | Security camera tiles. Live camera stills (16:9, refreshed every 10 s) on the Home Security card; tap opens the room view. |

## Energy meters (`energy_meters`)

Editor tab: **Energy**. Power meters and metered circuits for the Energy view (sidebar > Energy). Mark the whole-house meter as main to show it large with its phases. Without meters, Energy opens the built-in HA Energy dashboard.

A list; each item has:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | text |  | Name |
| `power` (required) | entity (sensor, W or kW) |  | Power sensor |
| `main` | boolean | false | Main meter. Shown large at the top with phases. Use for the whole-house meter. |
| `max_power` | number | 3000 | Gauge full scale (W). Power at which the gauge ring is full. |
| `energy` | entity (sensor, kWh) |  | Total energy sensor |
| `current` | entity (sensor, A) |  | Current sensor |
| `power_factor` | entity (sensor) |  | Power factor sensor. Percent (0-100) or 0-1; shown as %. |
| `voltage` | entity (sensor, V) |  | Voltage sensor |
| `frequency` | entity (sensor, Hz) |  | Frequency sensor |
| `power_a` | entity (sensor) |  | Phase A power. Phase sensors are optional; with any of them set the meter shows a phase table. |
| `power_b` | entity (sensor) |  | Phase B power |
| `power_c` | entity (sensor) |  | Phase C power |
| `current_a` | entity (sensor) |  | Phase A current |
| `current_b` | entity (sensor) |  | Phase B current |
| `current_c` | entity (sensor) |  | Phase C current |
| `voltage_a` | entity (sensor) |  | Phase A voltage |
| `voltage_b` | entity (sensor) |  | Phase B voltage |
| `voltage_c` | entity (sensor) |  | Phase C voltage |

## Demo house

Loaded by the editor's **Load demo house** button when the dashboard has no rooms. Fictional rooms and entity IDs: replace them with your own. Keep your real config out of the repo (e.g. `my-house.private.yaml`, git-ignored) and paste it in YAML mode.

```yaml
strategy:
  type: custom:atlas-home
  appearance:
    accent: "#56E7C0"
    variant: warm_glass
    ambience: graphite
    background: living
  entities:
    alarm: alarm_control_panel.home_alarm
    weather: weather.home
    outdoor_temperature: sensor.outdoor_temperature
    heat_pump: climate.heat_pump
    heat_pump_outdoor: sensor.heat_pump_outdoor_temperature
    heat_pump_supply: sensor.heat_pump_supply_temperature
    heat_pump_return: sensor.heat_pump_return_temperature
    solar_power: sensor.solar_power
    house_load: sensor.house_power
    grid_import: sensor.grid_import_power
    grid_export: sensor.grid_export_power
    incidents: sensor.incident_report
    wake_pc: input_button.wake_pc
    garage_cover: cover.garage_door
    persons:
      - person.alex
      - person.sam
    exclude_lights:
      - light.attic_camera_status_led
      - light.garage_camera_status_led
  alerts:
    temperature_rules:
      - entity: sensor.server_room_temperature
        above: 32
        clear_below: 30
        label: Server room
    exterior_doors:
      - binary_sensor.basement_door
      - binary_sensor.front_door
      - cover.garage_door
    interior_doors:
      - binary_sensor.office_door
      - binary_sensor.bathroom_door
    critical: []
    mailbox: binary_sensor.mailbox
    updates: true
    data_quality: true
  floors:
    - id: attic
      level: "+2"
      name: Attic
    - id: first
      level: "+1"
      name: First floor
    - id: ground
      level: "0"
      name: Ground floor
    - id: basement
      level: "-1"
      name: Basement
  rooms:
    - id: attic
      name: Attic
      floor: attic
      icon: attic
      image: attic.jpg
      temperature: sensor.attic_temperature
      humidity: sensor.attic_humidity
      camera: camera.attic
      devices:
        - entity: binary_sensor.attic_window
          name: Window
        - entity: binary_sensor.attic_motion
          name: Motion
        - entity: light.attic_ceiling
          name: Ceiling light
    - id: kids_room
      name: Kids room
      floor: first
      icon: kids-room
      image: backup/kids-room.jpg
      temperature: sensor.kids_room_temperature
      humidity: sensor.kids_room_humidity
      camera: camera.kids_room
      camera_private: true
      devices:
        - entity: binary_sensor.kids_room_window_left
          name: Window left
        - entity: binary_sensor.kids_room_window_right
          name: Window right
        - entity: binary_sensor.kids_room_motion
          name: Motion
        - entity: light.kids_room_fan_light
          name: Fan light
        - entity: fan.kids_room_fan
          name: Ceiling fan
    - id: office
      name: Office
      floor: first
      icon: office
      image: office.jpg
      temperature: sensor.office_temperature
      humidity: sensor.office_humidity
      devices:
        - entity: binary_sensor.office_door
          name: Door
        - entity: binary_sensor.office_window
          name: Window
        - entity: light.office_fan_light
          name: Fan light
        - entity: fan.office_fan
          name: Ceiling fan
    - id: bedroom
      name: Bedroom
      floor: first
      icon: bedroom
      image: bedroom.jpg
      show_camera: false
      temperature: sensor.bedroom_temperature
      humidity: sensor.bedroom_humidity
      devices:
        - entity: light.bedroom_canopy
          name: Canopy LEDs
        - entity: light.bedroom_wardrobe
          name: Wardrobe LEDs
    - id: hallway
      name: Upstairs hall
      floor: first
      icon: hallway
      image: hallway.jpg
      temperature: sensor.hallway_temperature
      humidity: sensor.hallway_humidity
      devices:
        - entity: binary_sensor.hallway_motion
          name: Motion
        - entity: binary_sensor.stair_window
          name: Stair window
        - entity: binary_sensor.hallway_skylight
          name: Skylight
    - id: bathroom
      name: Bathroom
      floor: first
      icon: humidity
      image: bathroom.jpg
      devices:
        - entity: binary_sensor.bathroom_door
          name: Door
        - entity: binary_sensor.bathroom_motion
          name: Motion
        - entity: binary_sensor.bathroom_skylight
          name: Skylight
    - id: guest_room
      name: Guest room
      floor: first
      icon: bedroom
      temperature: sensor.guest_room_temperature
      humidity: sensor.guest_room_humidity
      devices:
        - entity: binary_sensor.guest_room_window
          name: Window
    - id: living
      name: Living room
      floor: ground
      icon: living
      image: living.jpg
      temperature: sensor.living_room_temperature
      humidity: sensor.living_room_humidity
      camera: camera.living_room
      devices:
        - entity: binary_sensor.living_room_window_left
          name: Window left
        - entity: binary_sensor.living_room_window_right
          name: Window right
        - entity: binary_sensor.living_room_presence
          name: Presence
        - entity: light.tv_backlight
          name: TV backlight
        - entity: media_player.living_room_tv
          name: TV
    - id: kitchen
      name: Kitchen
      floor: ground
      icon: kitchen
      image: kitchen.jpg
      devices:
        - entity: light.kitchen_cabinet_left
          name: Cabinet light left
        - entity: light.kitchen_cabinet_right
          name: Cabinet light right
        - entity: binary_sensor.kitchen_presence
          name: Presence
        - entity: binary_sensor.kitchen_window
          name: Window
        - entity: sensor.oven_temperature
          name: Oven
        - entity: select.dishwasher_program
          name: Dishwasher
    - id: entrance
      name: Entrance
      floor: ground
      icon: door
      image: entrance.jpg
      camera: camera.doorbell
      devices:
        - entity: binary_sensor.front_door
          name: Front door
        - entity: binary_sensor.mailbox
          name: Mailbox
        - entity: binary_sensor.doorbell_person
          name: Doorbell person
        - entity: binary_sensor.entrance_motion
          name: Motion
    - id: guest_wc
      name: Guest WC
      floor: ground
      icon: humidity
      image: guest-wc.jpg
      devices:
        - entity: binary_sensor.guest_wc_door
          name: Door
        - entity: binary_sensor.guest_wc_motion
          name: Motion
        - entity: light.guest_wc_mirror
          name: Mirror light
    - id: garage
      name: Garage
      floor: ground
      icon: garage
      image: garage.jpg
      temperature: sensor.garage_temperature
      humidity: sensor.garage_humidity
      camera: camera.garage
      devices:
        - entity: cover.garage_door
          name: Garage door
        - entity: binary_sensor.garage_side_door
          name: Side door
        - entity: binary_sensor.garage_window
          name: Window
        - entity: binary_sensor.garage_motion
          name: Motion
    - id: garden
      name: Garden
      floor: ground
      icon: eco
      devices:
        - entity: binary_sensor.garden_door
          name: Garden door
        - entity: switch.garden_irrigation
          name: Irrigation valve
        - entity: sensor.lawn_mower_status
          name: Lawn mower
    - id: basement
      name: Basement
      floor: basement
      icon: basement
      image: basement.jpg
      temperature: sensor.basement_temperature
      humidity: sensor.basement_humidity
      camera: camera.basement
      devices:
        - entity: binary_sensor.basement_door
          name: Door
        - entity: binary_sensor.basement_hall_motion
          name: Hall motion
        - entity: binary_sensor.basement_stairs_motion
          name: Stairs motion
        - entity: media_player.basement_tv
          name: TV
    - id: shelter
      name: Shelter
      floor: basement
      icon: shelter
      image: backup/shelter.jpg
      temperature: sensor.shelter_temperature
      humidity: sensor.shelter_humidity
      devices: []
    - id: server
      name: Server room
      floor: basement
      icon: server
      image: server.jpg
      temperature: sensor.server_room_temperature
      humidity: sensor.server_room_humidity
      devices: []
    - id: workshop
      name: Workshop
      floor: basement
      icon: settings
      camera: camera.workshop
      devices:
        - entity: sensor.3d_printer_status
          name: 3D printer
        - entity: sensor.3d_printer_progress
          name: Print progress
        - entity: light.3d_printer_chamber
          name: Chamber light
        - entity: binary_sensor.workshop_presence
          name: Presence
    - id: utility
      name: Utility room
      floor: basement
      icon: system
      image: utility.jpg
      devices:
        - entity: binary_sensor.utility_room_door
          name: Door
        - entity: climate.heat_pump
          name: Heat pump
    - id: laundry
      name: Laundry
      floor: basement
      icon: power
      devices:
        - entity: sensor.washer_power
          name: Washer
        - entity: sensor.dryer_power
          name: Dryer
  layout:
    home_tiles:
      - living
      - office
      - kids_room
      - bedroom
      - hallway
      - basement
      - garage
      - server
    top_tabs:
      - living
      - kitchen
      - bedroom
      - office
      - kids_room
      - garage
    security_tiles:
      - entrance
      - garage
  energy_meters:
    - name: Whole house
      main: true
      max_power: 11000
      power: sensor.main_meter_power
      energy: sensor.main_meter_energy
      current: sensor.main_meter_current
      power_factor: sensor.main_meter_power_factor
      frequency: sensor.main_meter_frequency
      power_a: sensor.main_meter_power_a
      power_b: sensor.main_meter_power_b
      power_c: sensor.main_meter_power_c
      current_a: sensor.main_meter_current_a
      current_b: sensor.main_meter_current_b
      current_c: sensor.main_meter_current_c
      voltage_a: sensor.main_meter_voltage_a
      voltage_b: sensor.main_meter_voltage_b
      voltage_c: sensor.main_meter_voltage_c
    - name: Kitchen
      power: sensor.circuit_kitchen_power
      energy: sensor.circuit_kitchen_energy
      current: sensor.circuit_kitchen_current
      power_factor: sensor.circuit_kitchen_power_factor
      voltage: sensor.circuit_kitchen_voltage
      frequency: sensor.circuit_kitchen_frequency
      max_power: 3000
    - name: Living & hallway
      power: sensor.circuit_living_power
      energy: sensor.circuit_living_energy
      current: sensor.circuit_living_current
      power_factor: sensor.circuit_living_power_factor
      voltage: sensor.circuit_living_voltage
      frequency: sensor.circuit_living_frequency
      max_power: 2500
    - name: Office
      power: sensor.circuit_office_power
      energy: sensor.circuit_office_energy
      current: sensor.circuit_office_current
      power_factor: sensor.circuit_office_power_factor
      voltage: sensor.circuit_office_voltage
      frequency: sensor.circuit_office_frequency
      max_power: 2000
    - name: Server rack
      power: sensor.circuit_server_power
      energy: sensor.circuit_server_energy
      current: sensor.circuit_server_current
      power_factor: sensor.circuit_server_power_factor
      voltage: sensor.circuit_server_voltage
      frequency: sensor.circuit_server_frequency
      max_power: 500
    - name: Laundry
      power: sensor.circuit_laundry_power
      energy: sensor.circuit_laundry_energy
      current: sensor.circuit_laundry_current
      power_factor: sensor.circuit_laundry_power_factor
      voltage: sensor.circuit_laundry_voltage
      frequency: sensor.circuit_laundry_frequency
      max_power: 3000
    - name: Heating pump
      power: sensor.circuit_heating_power
      energy: sensor.circuit_heating_energy
      current: sensor.circuit_heating_current
      power_factor: sensor.circuit_heating_power_factor
      voltage: sensor.circuit_heating_voltage
      frequency: sensor.circuit_heating_frequency
      max_power: 2000
    - name: Oven & cooktop
      power: sensor.circuit_cooking_power
      energy: sensor.circuit_cooking_energy
      power_factor: sensor.circuit_cooking_power_factor
      frequency: sensor.circuit_cooking_frequency
      max_power: 7000
      power_a: sensor.circuit_cooking_power_a
      power_b: sensor.circuit_cooking_power_b
      power_c: sensor.circuit_cooking_power_c
      current_a: sensor.circuit_cooking_current_a
      current_b: sensor.circuit_cooking_current_b
      current_c: sensor.circuit_cooking_current_c
      voltage_a: sensor.circuit_cooking_voltage_a
      voltage_b: sensor.circuit_cooking_voltage_b
      voltage_c: sensor.circuit_cooking_voltage_c
    - name: Attic
      power: sensor.circuit_attic_power
      energy: sensor.circuit_attic_energy
      current: sensor.circuit_attic_current
      power_factor: sensor.circuit_attic_power_factor
      voltage: sensor.circuit_attic_voltage
      frequency: sensor.circuit_attic_frequency
      max_power: 500
```
