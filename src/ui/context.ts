import type { AtlasConfig, RoomConfig } from "../config/types";
import type { HomeAssistant } from "../data/hass";
import type { AtlasAlert, Severity } from "../data/alerts";

/** Everything a view renderer needs, built once per render by <atlas-view>. */
export interface Ctx {
  hass: HomeAssistant;
  config: AtlasConfig;
  alerts: AtlasAlert[];
  badges: Map<string, { text: string; severity: Severity }>;
  hot: Set<string>; // rooms with an active temperature warning
  floorId?: string;
  roomId?: string;
  narrow: boolean;
  /** Timestamp of the last periodic refresh (10 s on Home for camera stills, else 30 s). */
  tick: number;
  go(viewPath: string): void;
  /** Navigate to an absolute HA path, e.g. /energy. */
  href(path: string): void;
  openRoom(room: RoomConfig | string): void;
  moreInfo(entityId: string): void;
  call(domain: string, service: string, data: Record<string, unknown>): Promise<void>;
  confirm(title: string, text: string, action: () => unknown, okLabel?: string): void;
  openAlert(a: AtlasAlert): void;
  /** Re-render the host element (for local UI state like camera reveal). */
  refresh(): void;
  ui: Record<string, unknown>;
}
