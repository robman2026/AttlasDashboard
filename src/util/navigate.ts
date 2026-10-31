// Same pattern the HA frontend uses (src/common/navigate.ts): push the new URL,
// then fire "location-changed" on window so hui-root switches the view.
export const navigate = (path: string, replace = false) => {
  if (replace) history.replaceState(history.state, "", path);
  else history.pushState(null, "", path);
  window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace } }));
};

/** URL of a view inside the current dashboard, e.g. /atlas-home/room-office. */
export const viewUrl = (viewPath: string) => {
  const base = location.pathname.split("/").filter(Boolean)[0] ?? "lovelace";
  return `/${base}/${viewPath}`;
};

export const goView = (viewPath: string) => navigate(viewUrl(viewPath));

export const fireEvent = (node: EventTarget, type: string, detail?: unknown) =>
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));

/** Opens the native more-info dialog for an entity. */
export const moreInfo = (node: EventTarget, entityId: string) => fireEvent(node, "hass-more-info", { entityId });

/** Guarded define: avoids "already been used" errors when the resource loads twice. */
export const define = (tag: string, ctor: CustomElementConstructor) => {
  if (!customElements.get(tag)) customElements.define(tag, ctor);
};
