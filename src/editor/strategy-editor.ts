// Graphical editor shown in the dashboard "Edit" dialog (strategy getConfigElement).
// Forms are built from src/config/fields.ts (the same source that generates
// docs/configuration.md), using HA's own <ha-form> selectors so every entity is
// picked from the live registry. The dialog also offers a YAML mode.
import { LitElement, css, html, nothing } from "lit";
import type { AtlasConfig, RoomConfig } from "../config/types";
import type { HomeAssistant } from "../data/hass";
import { DEMO_PRESET } from "../config/preset-demo";
import { ROOM_ICON_KEYS } from "../config/constants";
import { SHIPPED_IMAGES } from "../config/images.generated";
import { SECTIONS, type FieldDef, type SectionDef } from "../config/fields";
import { fireEvent } from "../util/navigate";

type Tab = SectionDef["key"];
type Opt = { value: string; label: string };

export class AtlasStrategyEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _tab: { state: true },
    _room: { state: true },
    _formReady: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: AtlasConfig;
  declare _tab: Tab;
  declare _room: number;
  declare _formReady: boolean;

  constructor() {
    super();
    this._tab = "appearance";
    this._room = 0;
    this._formReady = !!customElements.get("ha-form");
  }

  setConfig(config: AtlasConfig) {
    this._config = config;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this._formReady) this._loadForm();
  }

  // ha-form is lazy-loaded by HA. Loading a built-in card editor pulls it in
  // (same approach many custom cards use via window.loadCardHelpers).
  private async _loadForm() {
    try {
      const helpers = await (window as any).loadCardHelpers?.();
      const c = await helpers?.createCardElement({ type: "entities", entities: [] });
      await c?.constructor?.getConfigElement?.();
    } catch (e) {
      console.warn("ATLAS: could not preload ha-form", e);
    }
    await customElements.whenDefined("ha-form");
    this._formReady = true;
  }

  private _emit(config: AtlasConfig) {
    this._config = config;
    fireEvent(this, "config-changed", { config });
  }

  private _patch(key: keyof AtlasConfig, value: unknown) {
    this._emit({ ...this._config!, [key]: value } as AtlasConfig);
  }

  private _loadPreset() {
    this._emit({ type: this._config!.type, ...structuredClone(DEMO_PRESET) });
  }

  // ---- schema building from src/config/fields.ts ----

  private _options(): Record<string, Opt[]> {
    const c = this._config!;
    return {
      $rooms: (c.rooms ?? []).map((r) => ({ value: r.id, label: r.name })),
      $floors: (c.floors ?? []).map((f) => ({ value: f.id, label: f.name })),
      $icons: ROOM_ICON_KEYS.map((k) => ({ value: k, label: k })),
      $images: [{ value: "none", label: "none (no image)" }, ...SHIPPED_IMAGES.map((f) => ({ value: f, label: f }))],
    };
  }

  private _selector(f: FieldDef): Record<string, unknown> {
    if (f.fields) {
      // List of objects: HA object selector with typed sub-fields.
      const label = f.fields.find((x) => x.name === "name" || x.name === "label")?.name;
      return {
        object: {
          multiple: true,
          ...(label ? { label_field: label } : {}),
          ...(f.fields.some((x) => x.name === "entity") ? { description_field: "entity" } : {}),
          fields: Object.fromEntries(f.fields.map((x) => [x.name, { label: x.label, required: x.required, selector: this._selector(x) }])),
        },
      };
    }
    const opts = f.selector.select?.options;
    if (typeof opts === "string") return { select: { ...f.selector.select, options: this._options()[opts] ?? [] } };
    return f.selector;
  }

  /** Field list to ha-form schema; consecutive fields with the same group become one block. */
  private _schema(fields: FieldDef[]): unknown[] {
    const out: any[] = [];
    for (const f of fields) {
      const item = { name: f.name, required: f.required, selector: this._selector(f) };
      if (!f.group) {
        out.push(item);
        continue;
      }
      const last = out[out.length - 1];
      if (last?._group === f.group) last.schema.push(item);
      else if (f.group === "_grid") out.push({ _group: f.group, type: "grid", name: "", schema: [item] });
      else out.push({ _group: f.group, type: "expandable", name: "", flatten: true, title: f.group, schema: [item] });
    }
    return out.map(({ _group, ...rest }) => rest);
  }

  private _fieldIndex = new Map<string, FieldDef>(
    SECTIONS.flatMap((sec) => sec.fields.map((f) => [f.name, f] as [string, FieldDef]))
  );
  private _label = (s: { name: string }) => this._fieldIndex.get(s.name)?.label ?? s.name;
  private _helper = (s: { name: string }) => this._fieldIndex.get(s.name)?.help;

  private _form(data: unknown, schema: unknown[], onChange: (v: any) => void) {
    return html`<ha-form
      .hass=${this.hass}
      .data=${data ?? {}}
      .schema=${schema}
      .computeLabel=${this._label}
      .computeHelper=${this._helper}
      @value-changed=${(e: CustomEvent) => {
        e.stopPropagation();
        onChange(e.detail.value);
      }}
    ></ha-form>`;
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    if (!this._formReady) return html`<p>Loading editor...</p>`;
    const empty = !(this._config.rooms ?? []).length;
    const sec = SECTIONS.find((x) => x.key === this._tab) ?? SECTIONS[0];
    return html`
      ${empty
        ? html`<div class="preset">
            <p>This dashboard has no rooms yet. Load the demo house as a starting point and replace its entities with yours, or paste your own config in YAML mode.</p>
            <button @click=${this._loadPreset}>Load demo house</button>
          </div>`
        : nothing}
      <nav>
        ${SECTIONS.map((x) => html`<button class=${x.key === sec.key ? "on" : ""} @click=${() => (this._tab = x.key)}>${x.tab}</button>`)}
      </nav>
      <p class="intro">${sec.intro}</p>
      <div class="body">${this._renderSection(sec)}</div>
    `;
  }

  private _renderSection(sec: SectionDef) {
    const c = this._config!;
    if (sec.key === "rooms") return this._renderRooms(sec);
    if (sec.shape === "list") {
      // Whole list edited as one object-selector field.
      const f: FieldDef = { name: sec.key, label: sec.tab, type: "list", selector: {}, fields: sec.fields };
      return this._form({ [sec.key]: c[sec.key] }, [{ name: sec.key, selector: this._selector(f) }], (v) => this._patch(sec.key, v[sec.key]));
    }
    return this._form(c[sec.key], this._schema(sec.fields), (v) => this._patch(sec.key, v));
  }

  private _renderRooms(sec: SectionDef) {
    const list = this._config!.rooms ?? [];
    const idx = Math.min(this._room, Math.max(0, list.length - 1));
    const room = list[idx];
    const setRooms = (next: RoomConfig[], sel = idx) => {
      this._room = sel;
      this._patch("rooms", next);
    };
    const move = (d: number) => {
      const j = idx + d;
      if (j < 0 || j >= list.length) return;
      const next = [...list];
      [next[idx], next[j]] = [next[j], next[idx]];
      setRooms(next, j);
    };
    return html`
      <div class="rooms-bar">
        <select @change=${(e: Event) => (this._room = Number((e.target as HTMLSelectElement).value))}>
          ${list.map((r, i) => html`<option value=${i} ?selected=${i === idx}>${r.name} (${r.id})</option>`)}
        </select>
        <button title="Move up" @click=${() => move(-1)}>Up</button>
        <button title="Move down" @click=${() => move(1)}>Down</button>
        <button @click=${() => setRooms([...list, { id: `room_${list.length + 1}`, name: "New room", devices: [] }], list.length)}>Add</button>
        <button class="danger" ?disabled=${!room} @click=${() => confirm(`Delete room "${room?.name}"?`) && setRooms(list.filter((_, i) => i !== idx), Math.max(0, idx - 1))}>Delete</button>
      </div>
      ${room
        ? this._form(room, this._schema(sec.fields), (v) => setRooms(list.map((r, i) => (i === idx ? v : r))))
        : html`<p>No rooms.</p>`}
    `;
  }

  static styles = css`
    :host { display: block; }
    nav { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px; }
    button {
      font: inherit; cursor: pointer; padding: 6px 12px; border-radius: 8px;
      border: 1px solid var(--divider-color, #444); background: transparent; color: var(--primary-text-color);
    }
    button.on { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: var(--primary-color); }
    button.danger { color: var(--error-color, #db4437); }
    .preset { padding: 12px; border: 1px dashed var(--primary-color); border-radius: 12px; margin-bottom: 12px; }
    .preset p { margin: 0 0 8px; }
    .intro { margin: 0 0 12px; color: var(--secondary-text-color); font-size: 13px; }
    .rooms-bar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-bottom: 12px; }
    select { font: inherit; padding: 6px; border-radius: 8px; flex: 1; min-width: 160px;
      background: var(--card-background-color); color: var(--primary-text-color); border: 1px solid var(--divider-color, #444); }
  `;
}
