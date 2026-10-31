import { svg, html, nothing } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { ICONS } from "./icons.generated";

/** ATLAS line icon (assets/icons), tinted with currentColor. */
export const icon = (key: string | undefined, size = 20) => {
  const inner = key ? ICONS[key] : undefined;
  if (!inner) return nothing;
  return html`<svg class="ic" aria-hidden="true" width=${size} height=${size} viewBox="0 0 32 32">${unsafeSVG(inner)}</svg>`;
};

// Small device glyphs from the prototype (24x24 stroke paths).
export const GLYPH: Record<string, string> = {
  door: "M6 21V3h10v18M4 21h14M13 12h.01",
  window: "M4 4h16v16H4zM12 4v16M4 12h16",
  thermo: "M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z",
  motion: "M13 4a2 2 0 1 0 0-4M10 22l2-6-3-3 1-5 4 3 3 1M8 8l-3 3",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z",
  fan: "M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M12 10c0-4 1-7 4-7 2 0 2 3 0 5M14 12c4 0 7 1 7 4 0 2-3 2-5 0M12 14c0 4-1 7-4 7-2 0-2-3 0-5M10 12c-4 0-7-1-7-4 0-2 3-2 5 0",
  tv: "M3 5h18v12H3zM8 21h8",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  camera: "M3 7h13v10H3zM16 10l5-3v10l-5-3",
  garage: "M3 21V9l9-6 9 6v12M7 21v-8h10v8M7 16h10",
  printer: "M6 9V3h12v6M6 18H4v-7h16v7h-2M7 14h10v7H7z",
  drop: "M12 3l6 8a6 6 0 1 1-12 0z",
  mower: "M3 17h13l3-6h-6l-2-4H5zM6 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM16 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  oven: "M4 3h16v18H4zM4 8h16M8 5.5h.01M12 5.5h.01M8 12h8v6H8z",
  heat: "M8 21c-2-3 0-5 2-7s2-5 0-8c4 2 7 6 6 10-1 3-3 5-6 5z",
  washer: "M5 3h14v18H5zM5 8h14M12 11a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  power: "M12 3v8M6.5 6.5a8 8 0 1 0 11 0",
  dot: "M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0",
};

export const glyph = (key: string, size = 20) =>
  html`<svg aria-hidden="true" width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${svg`<path d=${GLYPH[key] ?? GLYPH.dot}></path>`}</svg>`;

export const weatherIcon = (condition?: string) => {
  const c = condition ?? "";
  const sun = svg`<circle cx="14" cy="13" r="6" fill="#FFD27A"></circle>`;
  const cloud = svg`<path d="M10 26h20a7 7 0 0 0 0-14 9.5 9.5 0 0 0-18.3 2A6 6 0 0 0 10 26z" fill="#D3D8DE"></path>`;
  const drops = svg`<path d="M14 28l-2 3M21 28l-2 3M28 28l-2 3" stroke="#5EC8FF" stroke-width="2" stroke-linecap="round"></path>`;
  const moon = svg`<path d="M24 6a10 10 0 1 0 8 15A9 9 0 0 1 24 6z" fill="#D3D8DE"></path>`;
  let body = svg`${cloud}`;
  if (c === "sunny") body = svg`<circle cx="20" cy="15" r="8" fill="#FFD27A"></circle>`;
  else if (c === "clear-night") body = moon;
  else if (c === "partlycloudy") body = svg`${sun}${cloud}`;
  else if (c.includes("rain") || c === "pouring" || c.includes("snow") || c === "hail") body = svg`${cloud}${drops}`;
  return html`<svg aria-hidden="true" width="40" height="32" viewBox="0 0 40 32">${body}</svg>`;
};
