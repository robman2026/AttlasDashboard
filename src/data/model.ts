// Read helpers over the strategy config (rooms, floors, entity lookup).
import type { AtlasConfig, FloorConfig, RoomConfig } from "../config/types";
import { DEFAULT_ACCENT, DEFAULT_IMAGE_PATH } from "../config/constants";

export const rooms = (c: AtlasConfig): RoomConfig[] => c.rooms ?? [];
export const floors = (c: AtlasConfig): FloorConfig[] => c.floors ?? [];
export const roomById = (c: AtlasConfig, id?: string) => rooms(c).find((r) => r.id === id);
export const floorById = (c: AtlasConfig, id?: string) => floors(c).find((f) => f.id === id);
export const roomsOnFloor = (c: AtlasConfig, floorId?: string) => rooms(c).filter((r) => r.floor === floorId);

/** Camera entity of a room, or undefined when the room has no camera or its camera section is switched off. */
export const cameraOf = (room?: RoomConfig): string | undefined =>
  room && room.show_camera !== false ? room.camera || undefined : undefined;

/** Room that maps an entity (climate sensors, camera or device list). */
export const roomOfEntity = (c: AtlasConfig, entityId: string): RoomConfig | undefined =>
  rooms(c).find(
    (r) =>
      r.temperature === entityId ||
      r.humidity === entityId ||
      cameraOf(r) === entityId ||
      (r.devices ?? []).some((d) => d.entity === entityId)
  );

/** Display name for a mapped entity: device name in its room, else undefined. */
export const deviceName = (c: AtlasConfig, entityId: string): string | undefined => {
  for (const r of rooms(c)) {
    const d = (r.devices ?? []).find((x) => x.entity === entityId);
    if (d?.name) return d.name;
  }
  return undefined;
};

export const imageUrl = (c: AtlasConfig, room?: RoomConfig): string | undefined => {
  if (!room?.image) return undefined;
  if (/^(https?:)?\/\//.test(room.image) || room.image.startsWith("/")) return room.image;
  let base = c.appearance?.image_path || DEFAULT_IMAGE_PATH;
  if (!base.endsWith("/")) base += "/";
  return base + room.image;
};

export const accentOf = (c: AtlasConfig) => {
  const a = c.appearance?.accent ?? "";
  return /^#[0-9a-fA-F]{6}$/.test(a) ? a : DEFAULT_ACCENT;
};

/** Every entity the config refers to (used by the data-quality alert). */
export const mappedEntities = (c: AtlasConfig): string[] => {
  const ids = new Set<string>();
  const add = (id?: string) => id && ids.add(id);
  const e = c.entities ?? {};
  [e.alarm, e.weather, e.outdoor_temperature, e.heat_pump, e.heat_pump_outdoor, e.heat_pump_supply,
    e.heat_pump_return, e.solar_power, e.house_load, e.grid_import, e.grid_export, e.incidents,
    e.wake_pc, e.garage_cover].forEach(add);
  for (const r of rooms(c)) {
    add(r.temperature);
    add(r.humidity);
    add(cameraOf(r));
    (r.devices ?? []).forEach((d) => add(d.entity));
  }
  return [...ids];
};

/** Light entities in rooms, minus excluded status LEDs. */
export const roomLights = (c: AtlasConfig): string[] => {
  const excluded = new Set(c.entities?.exclude_lights ?? []);
  const out: string[] = [];
  for (const r of rooms(c))
    for (const d of r.devices ?? [])
      if (d.entity.startsWith("light.") && !excluded.has(d.entity)) out.push(d.entity);
  return out;
};
