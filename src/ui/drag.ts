// Tap / hold / horizontal drag on a tile (Lights page tiles, fan tiles).
// Tap runs tap(), hold (500 ms) or right click runs hold(), a horizontal drag of 8 px
// or more sets a level 1..100 shown live with preview() and sent with commit() on release.
const HOLD_MS = 500;
const DRAG_PX = 8;

export interface DragSpec {
  /** Level when the drag starts (0..100). */
  start(): number;
  /** Whether this tile can be dragged right now (supports a level and is available). */
  canDrag(): boolean;
  preview(el: HTMLElement, level: number): void;
  commit(level: number): void;
  tap(): void;
  hold(): void;
  /** Optional snapping (e.g. fan percentage_step). */
  snap?(level: number): number;
}

export const dragHandlers = (spec: DragSpec) => {
  let startX = 0;
  let startLevel = 0;
  let level = 0;
  let dragging = false;
  let held = false;
  let timer: number | undefined;
  let width = 1;
  return {
    down: (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      startX = e.clientX;
      startLevel = spec.start();
      level = startLevel;
      dragging = false;
      held = false;
      width = el.getBoundingClientRect().width || 1;
      el.setPointerCapture?.(e.pointerId);
      timer = window.setTimeout(() => {
        held = true;
        spec.hold();
      }, HOLD_MS);
    },
    move: (e: PointerEvent) => {
      if (held || (!e.buttons && e.pointerType === "mouse")) return;
      const dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) < DRAG_PX) return;
      if (!spec.canDrag()) return;
      dragging = true;
      window.clearTimeout(timer);
      const raw = Math.max(1, Math.min(100, Math.round(startLevel + (dx / width) * 100)));
      level = spec.snap ? spec.snap(raw) : raw;
      const el = e.currentTarget as HTMLElement;
      el.classList.add("dragging");
      spec.preview(el, level);
    },
    up: (e: PointerEvent) => {
      window.clearTimeout(timer);
      (e.currentTarget as HTMLElement).classList.remove("dragging");
      if (held) return;
      if (dragging) spec.commit(level);
      else spec.tap();
    },
    cancel: (e: PointerEvent) => {
      window.clearTimeout(timer);
      (e.currentTarget as HTMLElement).classList.remove("dragging");
      dragging = false;
    },
    context: (e: Event) => {
      e.preventDefault();
      window.clearTimeout(timer);
      held = true;
      spec.hold();
    },
  };
};
