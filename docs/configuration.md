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
| `time_display` | changed \| updated \| off | changed | Time shown on device tiles. changed: time since the state last changed (HA last_changed). updated: time since the entity last reported anything (HA last_updated). off: hide. |
| `light_mood` | boolean | true | Room photos follow the lights. Room photos get darker when the room's lights are off and light up (warm glow) when they are on; brightness follows the light level. Rooms without lights stay unchanged. |
| `image_path` | URL | rooms/ next to atlas-home.js | Room image base URL. Where room images are loaded from. Example for own photos: /local/atlas/rooms/ |

## Global entities (`entities`)

Editor tab: **Entities**. House-wide entities used by the greeting, top bar, Climate, Energy, Security and Quick actions. Leave a field empty to hide what depends on it.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `alarm` | entity (alarm_control_panel) |  | Alarm panel. Greeting line, Security card, Security page (arm modes the panel supports, Disarm), Arm away quick action. Panels that need a code open the Home Assistant dialog, which asks for it. |
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
| `incidents` | entity (sensor) |  | Incident report sensor. Optional log analyzer sensor (e.g. the incident report published by Node-RED). Attributes: generated, summary (critical, warning, minor), incidents (severity, title, detail, recommendation, count, sources). Counts may also be top-level attributes, numbers or lists. Shown on the System page and in the attention banner. |
| `persons` | list of entity (person) |  | Persons. Presence chips on Home (picture, name, Home / Away / zone). Tap opens the person details. |
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
| `cameras` | off \| live \| stills | off | Camera wall. Shows the cameras of all rooms on this floor side by side on its Rooms page (stacked on the phone). live: muted live streams. stills: snapshots refreshed every 10 s (lighter on the tablet). Rooms with the camera section off are skipped; private cameras stay hidden. |

## Rooms (`rooms`)

Editor tab: **Rooms**. List of rooms in display order (previous / next follow this order within a floor). Independent of the HA area registry.

A list; each item has:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `id` (required) | text |  | ID. Used in URLs (room-<id>) and in layout lists. Lowercase, no spaces. |
| `name` (required) | text |  | Name |
| `floor` | floor id |  | Floor |
| `icon` | ATLAS icon key |  | Icon. One of the shipped line icons, e.g. office, living, server. |
| `image` | file name or URL |  | Image. Pick a shipped image or type a file name under the image base URL, or a full URL. Empty: the shipped image matching the room id is used automatically (e.g. laundry -> laundry.jpg, guest_room -> guest-room.jpg). none: no image. |
| `temperature` | entity (sensor) |  | Temperature sensor |
| `humidity` | entity (sensor) |  | Humidity sensor |
| `show_camera` | boolean | true | Show camera section. Off: the room has no camera section at all (no Camera card, no stream, not counted as unavailable), even if a camera entity is set. On without a camera entity: a compact "No camera" card. |
| `camera` | entity (camera) |  | Camera (live stream). Enables the camera slot (16:9) with Live, Snapshot, Recordings. |
| `camera_hq` | entity (camera) |  | Camera high quality stream. Optional, reserved for a quality switch. |
| `camera_snapshot` | entity (camera) |  | Snapshot camera. Optional. Snapshot uses this entity's picture, else the live camera's. |
| `camera_private` | boolean | false | Private camera. Stream hidden until the user taps Reveal. Off: the live stream starts (muted) as soon as the room opens. |
| `light_entities` | list of entity (light, switch, input_boolean) |  | Light entities. What counts as this room's lights for the photo effect, the Lights chip and Lights off, e.g. Tasmota relays (switch.*) that power lamps. Empty: the room's light.* devices, minus the excluded status LEDs. |
| `climate_extra` | list |  | Extra climate values. More values in the Climate card, e.g. CO2, pressure, VOC. Each value opens its history. |
| `automations` | list of entity (automation) |  | Automations. Shows an Automations card with an on/off switch and the last run time for each. |
| `printer_name` | text |  | Printer name. Title of the 3D printer card. The card appears when a status or progress sensor is set. |
| `printer_status` | entity (sensor) |  | Print status. e.g. sensor.<printer>_print_status (Bambu Lab). |
| `printer_progress` | entity (sensor) |  | Print progress (%) |
| `printer_remaining` | entity (sensor, duration) |  | Remaining time. Seconds, minutes or hours; converted by its unit. |
| `printer_nozzle` | entity (sensor) |  | Nozzle temperature |
| `printer_bed` | entity (sensor) |  | Bed temperature |
| `printer_chamber` | entity (sensor) |  | Chamber temperature |
| `printer_light` | entity (light, switch) |  | Chamber light |
| `printer_pause` | entity (button) |  | Pause button |
| `printer_resume` | entity (button) |  | Resume button |
| `printer_stop` | entity (button) |  | Stop button. Always asks for confirmation. |
| `printer_picture` | entity (camera, image) |  | Printer picture. Chamber camera or cover image, shown as a still in the card. |
| `car_name` | text |  | Vehicle name. Title of the vehicle card. The card appears in this room when any vehicle entity below is set. |
| `car_subtitle` | text |  | Vehicle subtitle. e.g. the model. |
| `car_image` | file name or URL |  | Vehicle image. File under the image base URL or a full URL (e.g. /local/car.png). Empty: a drawn car outline. |
| `car_lock` | entity (lock) |  | Lock. Shows locked / unlocked with Lock and Unlock buttons (Unlock asks first). Locks that need a code open the Home Assistant lock dialog. |
| `car_doors_locked` | entity (sensor, binary_sensor) |  | Doors locked status. Read-only lock status when there is no lock entity. A binary_sensor with device class lock counts off as locked (Home Assistant convention). |
| `car_doors_locked_when` | text | locked (sensor), off (binary_sensor) | Locked when state is. The state value of the doors status that means locked, if it differs. |
| `car_range` | entity (sensor) |  | Range |
| `car_odometer` | entity (sensor) |  | Odometer |
| `car_location` | entity (device_tracker, sensor) |  | Location. A device_tracker shows its zone (Home, Away or the zone name). |
| `car_daily_distance` | entity (sensor) |  | Distance today |
| `car_daily_trips` | entity (sensor) |  | Trips today |
| `car_monthly_distance` | entity (sensor) |  | Distance this month |
| `car_monthly_trips` | entity (sensor) |  | Trips this month |
| `car_last_updated` | entity (sensor, timestamp) |  | Last update. When the car last reported. Empty: the newest update among the vehicle entities. |
| `car_flash` | entity (button, input_button, script) |  | Flash lights |
| `car_horn` | entity (button, input_button, script) |  | Honk horn. Asks first. |
| `car_refresh` | entity (button, input_button, script) |  | Update data. Asks the car to send fresh data. |
| `side_cards` | list of card configs (YAML) |  | Own cards, left column. Any Lovelace cards (built-in or custom:..) shown below the camera, e.g. your own remote card. One card (type: custom:my-card plus its options) or a list of cards (each starting with - type:). |
| `cards` | list of card configs (YAML) |  | Own cards, below Devices. Any Lovelace cards shown below the Devices card, side by side when there is room (e.g. a washer and a dryer card). One card or a list of cards. |
| `devices` | list |  | Devices. Device tiles. Tap toggles light, switch, fan, input_boolean; other domains and long press open more-info. Per tile you can change the tap action (e.g. press a button) and ask before acting. A cover gets a full-width tile with Open / Stop / Close buttons for the actions it supports. |

Items of `climate_extra`:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `entity` (required) | entity (any) |  | Entity |
| `name` | text |  | Name. Label on the tile. Default: the entity's friendly name. |
| `icon` | mdi icon |  | Icon override. Optional, e.g. mdi:lamp. Default: chosen from the entity's domain and device class. |

Items of `devices`:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `entity` (required) | entity (any) |  | Entity |
| `name` | text |  | Name. Label on the tile. Default: the entity's friendly name. |
| `icon` | mdi icon |  | Icon override. Optional, e.g. mdi:lamp. Default: chosen from the entity's domain and device class. |
| `tap` | toggle \| more-info \| press | toggle for light, switch, fan, input_boolean; more-info otherwise | Tap action. press: presses a button or input_button, or runs a script. Hold or right click always opens the details. Covers ignore this and show Open / Stop / Close buttons. |
| `confirm` | boolean | false (true for covers with device class garage or gate) | Ask before acting. Asks for confirmation before the tap action, and before Open / Close on a cover (Stop never asks). Use it for plugs that power servers or network gear. |

## Layout (`layout`)

Editor tab: **Layout**. Which rooms appear where (lists of room ids, in order) and your own cards on Home and on the System page.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `home_tiles` | list of room id | first 8 rooms | Home room tiles. 8 tiles use the 3 / 2 / 3 design grid. |
| `top_tabs` | list of room id |  | Top bar room tabs |
| `security_tiles` | list of room id |  | Security camera tiles. Live camera stills (16:9, refreshed every 10 s) on the Home Security card; tap opens the room view. |
| `home_cards` | list of card configs (YAML) |  | Own cards on Home. Any Lovelace cards (built-in or custom:..) shown below the Home grid, side by side (stacked on the phone). One card (type: .. plus its options) or a list of cards (each starting with - type:). |
| `system_cards` | list of card configs (YAML) |  | Own cards on the System page. Any Lovelace cards shown on the System page below the incident report, e.g. a history graph of the server temperature. One card or a list of cards. |

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
      cameras: live
    - id: first
      level: "+1"
      name: First floor
    - id: ground
      level: "0"
      name: Ground floor
    - id: basement
      level: "-1"
      name: Basement
      cameras: live
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
      light_entities:
        - switch.office_ceiling_relay
        - light.office_fan_light
      devices:
        - entity: binary_sensor.office_door
          name: Door
        - entity: binary_sensor.office_window
          name: Window
        - entity: switch.office_ceiling_relay
          name: Ceiling lamp
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
      side_cards:
        - type: media-control
          entity: media_player.bedroom_tv
      temperature: sensor.bedroom_temperature
      humidity: sensor.bedroom_humidity
      devices:
        - entity: light.bedroom_canopy
          name: Canopy LEDs
        - entity: light.bedroom_wardrobe
          name: Wardrobe LEDs
        - entity: media_player.bedroom_tv
          name: TV
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
      side_cards:
        - type: media-control
          entity: media_player.living_room_tv
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
        - entity: lock.front_door
          name: Front door lock
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
      car_name: Family car
      car_subtitle: Electric hatchback
      car_lock: lock.family_car
      car_range: sensor.family_car_range
      car_odometer: sensor.family_car_odometer
      car_location: device_tracker.family_car
      car_daily_distance: sensor.family_car_distance_today
      car_daily_trips: sensor.family_car_trips_today
      car_monthly_distance: sensor.family_car_distance_month
      car_monthly_trips: sensor.family_car_trips_month
      car_last_updated: sensor.family_car_last_update
      car_flash: button.family_car_flash_lights
      car_horn: button.family_car_honk
      car_refresh: button.family_car_update_data
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
      camera: camera.server_room
      devices:
        - entity: switch.server_rack_power
          name: Rack power
          confirm: true
        - entity: button.router_restart
          name: Restart router
          tap: press
          confirm: true
    - id: workshop
      name: Workshop
      floor: basement
      icon: settings
      image: workshop.jpg
      camera: camera.workshop
      temperature: sensor.workshop_temperature
      humidity: sensor.workshop_humidity
      climate_extra:
        - entity: sensor.workshop_co2
          name: CO2
        - entity: sensor.workshop_pressure
          name: Pressure
      automations:
        - automation.workshop_eco_mode
        - automation.print_complete_notify
        - automation.workshop_door_alarm
      printer_name: 3D printer
      printer_status: sensor.3d_printer_status
      printer_progress: sensor.3d_printer_progress
      printer_remaining: sensor.3d_printer_remaining_time
      printer_nozzle: sensor.3d_printer_nozzle_temperature
      printer_bed: sensor.3d_printer_bed_temperature
      printer_chamber: sensor.3d_printer_chamber_temperature
      printer_light: light.3d_printer_chamber
      printer_pause: button.3d_printer_pause
      printer_resume: button.3d_printer_resume
      printer_stop: button.3d_printer_stop
      printer_picture: image.3d_printer_cover
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
      camera: camera.utility_room
      devices:
        - entity: binary_sensor.utility_room_door
          name: Door
        - entity: climate.heat_pump
          name: Heat pump
    - id: laundry
      name: Laundry
      floor: basement
      icon: power
      image: laundry.jpg
      camera: camera.workshop
      cards:
        - type: tile
          entity: sensor.washer_power
          name: Washer
        - type: tile
          entity: sensor.dryer_power
          name: Dryer
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
    home_cards:
      - type: markdown
        content: "**Own cards** appear here. Edit dashboard > Layout > Own cards on Home."
    system_cards:
      - type: history-graph
        title: Server room temperature
        hours_to_show: 24
        entities:
          - sensor.server_room_temperature
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
