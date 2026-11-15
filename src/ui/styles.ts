import { css } from "lit";

// Design tokens from docs/HANDOFF.md section 6. Accent is injected at runtime.
export const styles = css`
  :host {
    --atlas-canvas: #14171c;
    --atlas-solid: #252a30;
    --atlas-glass-bg: rgba(28, 31, 36, 0.72);
    --atlas-glass-border: rgba(188, 200, 222, 0.16);
    --atlas-text: #f1f5ff;
    --atlas-text2: #bcc8de;
    --atlas-dim: rgba(188, 200, 222, 0.55);
    --atlas-warn: #ffbf57;
    --atlas-crit: #ff727d;
    --atlas-info: #a7a3ff;
    --atlas-r-card: 20px;
    --atlas-r-ctl: 12px;
    display: block;
    color: var(--atlas-text);
    font-family: -apple-system, "Segoe UI", Roboto, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  * { box-sizing: border-box; }
  button { font: inherit; color: inherit; cursor: pointer; text-align: left; background: none; border: 0; padding: 0; }
  button:focus-visible { outline: 2px solid var(--atlas-accent); outline-offset: 2px; }
  h1, h2, h3, p { margin: 0; }
  .n { font-variant-numeric: tabular-nums; }
  .t2 { color: var(--atlas-text2); }
  .ic { flex: none; }

  /* ---------- frame & background ---------- */
  .root { position: relative; min-height: calc(100vh - var(--header-height, 56px)); background: var(--atlas-canvas); overflow: hidden; isolation: isolate; }
  .bg { position: absolute; inset: 0; z-index: -1; overflow: hidden; }
  .bg > * { position: absolute; }
  .bg .photo { left: -60px; top: -60px; width: calc(100% + 120px); height: calc(100% + 120px); object-fit: cover; filter: blur(16px) brightness(0.62) saturate(0.95); }
  .bg .tint { inset: 0; }
  .bg .blob { border-radius: 50%; }
  .frame { display: flex; gap: 16px; padding: 16px; min-height: calc(100vh - var(--header-height, 56px)); }
  .main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 16px; }

  .glass {
    background: var(--atlas-glass-bg); border: 1px solid var(--atlas-glass-border); border-radius: var(--atlas-r-card);
    box-shadow: 0 10px 36px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(12px) saturate(130%); -webkit-backdrop-filter: blur(12px) saturate(130%);
  }
  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    .glass { background: var(--atlas-solid); }
  }
  .v-quiet .glass { background: var(--atlas-solid); border-color: rgba(188, 200, 222, 0.12); box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none; }

  /* ---------- sidebar ---------- */
  aside { width: 200px; flex: none; display: flex; flex-direction: column; padding: 20px 14px; position: sticky; top: 16px; height: calc(100vh - var(--header-height, 56px) - 32px); }
  .logo { display: flex; align-items: center; gap: 10px; padding: 0 6px 26px; color: var(--atlas-accent); }
  .logo b { display: block; font-size: 18px; letter-spacing: 0.12em; color: var(--atlas-text); line-height: 1.15; }
  .logo small { display: block; font-size: 12px; color: var(--atlas-text2); }
  .nav { display: flex; flex-direction: column; gap: 4px; }
  .nav button { display: flex; align-items: center; gap: 14px; height: 46px; padding: 0 14px; border-radius: var(--atlas-r-ctl); font-size: 14px; border: 1px solid transparent; }
  .nav button.on { background: var(--atlas-accent-soft); border-color: var(--atlas-accent-glow); color: var(--atlas-accent); font-weight: 600; }
  .user { margin-top: auto; display: flex; align-items: center; gap: 10px; padding: 12px 12px 0; border-top: 1px solid rgba(188, 200, 222, 0.14); font-size: 13px; }
  .avatar { width: 32px; height: 32px; border-radius: 16px; background: rgba(241, 245, 255, 0.12); display: flex; align-items: center; justify-content: center; font-weight: 600; flex: none; }

  /* ---------- top bar ---------- */
  header.top { height: 64px; flex: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 14px 0 10px; }
  .tabs { display: flex; align-items: center; gap: 2px; overflow-x: auto; scrollbar-width: none; min-width: 0; }
  .tabs button { height: 44px; padding: 0 15px; border-radius: var(--atlas-r-ctl); font-size: 13px; white-space: nowrap; border: 1px solid transparent; opacity: 0.85; }
  .tabs button.on { background: rgba(241, 245, 255, 0.12); border-color: rgba(188, 200, 222, 0.25); font-weight: 600; opacity: 1; box-shadow: inset 0 -2px 0 var(--atlas-accent); }
  .tools { display: flex; align-items: center; gap: 18px; flex: none; }
  .weather { display: flex; align-items: center; gap: 10px; }
  .weather span { display: block; line-height: 1.25; }
  .clock { font-size: 26px; font-weight: 700; }
  .iconbtn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--atlas-r-ctl); }
  .mlogo { display: none; }

  /* ---------- shared bits ---------- */
  .hero { padding: 4px 26px 0; display: flex; flex-direction: column; gap: 6px; }
  .hero h1 { font-size: 64px; font-weight: 800; letter-spacing: -0.035em; line-height: 1; }
  .hero h1.sm { font-size: 56px; }
  .hero p { font-size: 18px; color: var(--atlas-text2); }
  .card { padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
  .card h2 { font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 10px; }
  .row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .pillbtn { height: 34px; padding: 0 12px; border-radius: var(--atlas-r-ctl); border: 1px solid rgba(188, 200, 222, 0.3); font-size: 12px; }
  .ctl { height: 44px; padding: 0 14px; border-radius: var(--atlas-r-ctl); border: 1px solid rgba(188, 200, 222, 0.25); background: rgba(241, 245, 255, 0.06); font-size: 13px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
  .badge { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 6px; background: var(--atlas-warn); color: #2a1a00; white-space: nowrap; }
  .badge.critical { background: var(--atlas-crit); color: #14171c; }
  .badge.info { background: var(--atlas-info); color: #14171c; }
  .empty { padding: 24px; text-align: center; color: var(--atlas-text2); }

  /* ---------- attention banner ---------- */
  .banner { display: flex; align-items: center; gap: 16px; padding: 12px 16px 12px 20px; border-radius: var(--atlas-r-card); background: rgba(66, 47, 14, 0.9); border: 1px solid rgba(255, 191, 87, 0.6); }
  .banner.critical { background: rgba(70, 20, 26, 0.9); border-color: rgba(255, 114, 125, 0.7); }
  .banner.info { background: rgba(40, 38, 70, 0.85); border-color: rgba(167, 163, 255, 0.5); }
  .banner.calm { background: var(--atlas-glass-bg); border-color: var(--atlas-glass-border); }
  .banner .sig { width: 44px; height: 44px; flex: none; border-radius: var(--atlas-r-ctl); background: var(--atlas-warn); color: #2a1a00; display: flex; align-items: center; justify-content: center; }
  .banner.critical .sig { background: var(--atlas-crit); }
  .banner.info .sig { background: var(--atlas-info); }
  .banner.calm .sig { background: var(--atlas-accent-soft); color: var(--atlas-accent); }
  .banner .sum { display: flex; flex-direction: column; gap: 2px; width: 236px; flex: none; }
  .banner .sum b { font-size: 18px; font-weight: 600; }
  .banner .sum span { font-size: 12px; color: #e9dcc2; }
  .chips { flex: 1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; min-width: 0; }
  .chip { display: flex; align-items: center; gap: 12px; padding: 9px 12px; border-radius: var(--atlas-r-ctl); background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 191, 87, 0.25); min-width: 0; }
  .chip .ico { width: 36px; height: 36px; flex: none; border-radius: var(--atlas-r-ctl); background: rgba(255, 191, 87, 0.2); color: var(--atlas-warn); display: flex; align-items: center; justify-content: center; }
  .chip.info .ico { background: rgba(167, 163, 255, 0.2); color: var(--atlas-info); }
  .chip.critical .ico { background: rgba(255, 114, 125, 0.2); color: var(--atlas-crit); }
  .chip .txt { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .chip .txt > span:first-child { font-size: 13px; color: #e9dcc2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .chip .val { display: flex; align-items: center; gap: 8px; }
  .chip .val b { font-size: 15px; font-weight: 600; color: var(--atlas-warn); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .chip.info .val b { color: var(--atlas-info); }
  .chip.critical .val b { color: var(--atlas-crit); }
  .banner .more { width: 44px; height: 44px; flex: none; border-radius: var(--atlas-r-ctl); border: 1px solid rgba(255, 191, 87, 0.35); display: flex; align-items: center; justify-content: center; }

  /* ---------- room tiles ---------- */
  .tiles { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); grid-auto-rows: minmax(150px, 1fr); gap: 10px; }
  .tiles.floor { grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 180px; gap: 12px; }
  .tile { position: relative; overflow: hidden; border-radius: var(--atlas-r-card); padding: 16px; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(160deg, rgba(var(--atlas-tile), 0.28) 0%, var(--atlas-solid) 75%); border: 1px solid rgba(188, 200, 222, 0.16); grid-column: span 2; }
  .tile.s3 { grid-column: span 3; }
  .tiles.floor .tile { grid-column: auto; }
  .tile.alert { border-color: rgba(255, 191, 87, 0.6); }
  .tile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .tile .shade { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0.35) 55%, rgba(0, 0, 0, 0.12)); }
  .tile .top, .tile .bot { position: relative; display: flex; justify-content: space-between; gap: 8px; }
  .tile .top { align-items: flex-start; }
  .tile .bot { align-items: flex-end; }
  .tile .info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .tile .name { font-size: 16px; font-weight: 600; }
  .tile .temp { font-size: 28px; font-weight: 600; letter-spacing: -0.02em; }
  .tile .temp.hot { color: var(--atlas-crit); }
  .tile .hum { font-size: 12px; color: var(--atlas-text2); }
  .go { width: 32px; height: 32px; flex: none; border-radius: 16px; background: rgba(0, 0, 0, 0.45); display: flex; align-items: center; justify-content: center; }

  /* ---------- home ---------- */
  .home-grid { flex: 1; display: grid; grid-template-columns: minmax(0, 1fr) 400px; gap: 16px; }
  .col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
  .actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .qa { height: 48px; padding: 0 18px; display: inline-flex; align-items: center; gap: 10px; border-radius: var(--atlas-r-ctl); font-size: 13px; font-weight: 600; border: 1px solid rgba(188, 200, 222, 0.2); background: rgba(241, 245, 255, 0.06); }
  .qa.primary { border-color: var(--atlas-accent); background: var(--atlas-accent-soft); color: var(--atlas-accent); box-shadow: 0 0 20px var(--atlas-accent-glow); }
  .clim { display: flex; align-items: center; gap: 16px; }
  .clim .det { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0; font-size: 13px; }
  .clim .det b { font-size: 15px; }
  .btn3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 6px; }
  .sq { height: 44px; border-radius: var(--atlas-r-ctl); border: 1px solid rgba(188, 200, 222, 0.2); background: rgba(241, 245, 255, 0.06); display: flex; align-items: center; justify-content: center; color: var(--atlas-accent); font-size: 13px; }
  .flow { display: flex; align-items: center; justify-content: space-between; }
  .node { display: flex; flex-direction: column; align-items: center; gap: 4px; width: 80px; }
  .node .c { width: 46px; height: 46px; border-radius: 50%; background: rgba(241, 245, 255, 0.08); display: flex; align-items: center; justify-content: center; }
  .node.house .c { width: 52px; height: 52px; background: var(--atlas-accent-soft); border: 1.5px solid var(--atlas-accent); box-shadow: 0 0 20px var(--atlas-accent-glow); color: var(--atlas-accent); }
  .node b { font-size: 15px; font-weight: 600; }
  .node span { font-size: 11px; color: var(--atlas-text2); }
  .link { flex: 1; height: 2px; margin-bottom: 38px; background: rgba(241, 245, 255, 0.12); position: relative; }
  .link.act { background: var(--atlas-accent); }
  .link.act::after { content: ""; position: absolute; top: -5px; border: 6px solid transparent; }
  .link.act.r::after { right: -2px; border-left-color: var(--atlas-accent); border-right: 0; }
  .link.act.l::after { left: -2px; border-right-color: var(--atlas-accent); border-left: 0; }
  .cams { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; align-content: start; }
  .cam { position: relative; overflow: hidden; aspect-ratio: 16 / 9; border-radius: var(--atlas-r-ctl); border: 1px solid rgba(188, 200, 222, 0.18); background: #0e1014; padding: 8px; display: flex; align-items: flex-end; }
  .cam img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .cam .camna { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; font-size: 12px; color: var(--atlas-text2); }
  .cam .lbl { position: relative; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: 8px; background: rgba(0, 0, 0, 0.55); }
  .cam.na { border-style: dashed; border-color: rgba(255, 191, 87, 0.35); }
  .more { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; padding: 4px 6px; border-radius: 8px; }
  .more:hover { color: var(--atlas-accent); }
  .dotst { width: 8px; height: 8px; border-radius: 4px; background: var(--atlas-accent); }
  .dotst.na { background: var(--atlas-warn); }

  /* ---------- alerts ---------- */
  .group h2 { font-size: 15px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
  .alist { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .arow { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 14px; border: 1px solid rgba(255, 191, 87, 0.45); background: rgba(66, 47, 14, 0.55); min-width: 0; }
  .arow.info { border-color: rgba(167, 163, 255, 0.35); background: rgba(40, 38, 70, 0.5); }
  .arow.critical { border-color: rgba(255, 114, 125, 0.55); background: rgba(70, 20, 26, 0.6); }
  .arow .ico { width: 40px; height: 40px; flex: none; border-radius: var(--atlas-r-ctl); display: flex; align-items: center; justify-content: center; background: rgba(255, 191, 87, 0.2); color: var(--atlas-warn); }
  .arow.info .ico { background: rgba(167, 163, 255, 0.2); color: var(--atlas-info); }
  .arow.critical .ico { background: rgba(255, 114, 125, 0.2); color: var(--atlas-crit); }
  .arow .txt { flex: 1; display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .arow .txt b { font-size: 15px; font-weight: 600; }
  .arow .txt span { font-size: 12px; color: var(--atlas-text2); overflow: hidden; text-overflow: ellipsis; }

  /* ---------- rooms / floors ---------- */
  .floors { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
  .fl { min-height: 112px; padding: 14px 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 2px; }
  .fl.on { border-color: var(--atlas-accent); color: var(--atlas-accent); box-shadow: 0 0 24px var(--atlas-accent-glow); }
  .fl .lv { font-size: 30px; font-weight: 700; letter-spacing: -0.03em; }
  .fl small { font-size: 12px; opacity: 0.85; }

  /* ---------- room view ---------- */
  /* Compact room header: breadcrumb line, then title + summary, status chips and prev / next on one row. */
  .crumb { padding: 0 20px; display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--atlas-text2); margin-bottom: -8px; }
  .crumb button { padding: 2px 0; }
  .crumb b { color: var(--atlas-text); }
  .rhead { padding: 0 20px; display: flex; align-items: center; gap: 10px 20px; flex-wrap: wrap; }
  .rhead .rtitle { min-width: 0; }
  .rhead .title { display: flex; align-items: center; gap: 12px; }
  .rhead h1 { font-size: 40px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; white-space: nowrap; }
  .rhead .badge { font-size: 12px; padding: 4px 10px; border-radius: 8px; }
  .rhead p { margin-top: 2px; font-size: 14px; }
  .rhead .strip { margin-top: 0; }
  .rnav { display: flex; gap: 8px; margin-left: auto; }
  .room-grid { flex: 1; display: grid; grid-template-columns: 400px minmax(0, 1fr); grid-template-areas: "left main"; gap: 16px; }
  .room-grid > .lcol { grid-area: left; }
  .room-grid > .mcol { grid-area: main; }
  .room-grid > .scol { grid-area: side; }
  /* Room with own left-column cards (e.g. a tall remote): third column on wide screens. */
  .room-grid.has-side { grid-template-columns: minmax(280px, min(26%, 360px)) minmax(0, 1fr) minmax(300px, min(28%, 400px)); grid-template-areas: "left main side"; }
  .room-grid.has-side .devs { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
  .room-grid.has-side .metric .lbl { flex-wrap: wrap; }
  .room-grid.has-side .metric .lbl .ago { flex-basis: 100%; margin-left: 0; padding-left: 22px; }
  .metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .metric { display: flex; flex-direction: column; gap: 8px; }
  .metric .lbl { font-size: 12px; display: flex; align-items: center; gap: 6px; color: var(--atlas-text2); }
  .metric .big { font-size: 44px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
  .bar { height: 4px; border-radius: 2px; background: rgba(241, 245, 255, 0.1); }
  .bar > span { display: block; height: 4px; border-radius: 2px; }
  .camslot { width: 100%; aspect-ratio: 16 / 9; border-radius: var(--atlas-r-ctl); background: #0e1014; border: 1.5px dashed var(--atlas-accent-glow); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 12px; text-align: center; overflow: hidden; position: relative; }
  .camslot.none { aspect-ratio: auto; height: 96px; border: 1px solid rgba(188, 200, 222, 0.14); }
  .camslot > img, .camslot > ha-camera-stream { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .camslot.live { border: 1px solid rgba(188, 200, 222, 0.16); padding: 0; }
  .camslot .camwait { position: relative; font-size: 12px; padding: 5px 10px; border-radius: 8px; background: rgba(0, 0, 0, 0.55); }
  .livetag { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--atlas-crit); }
  .livetag i { width: 7px; height: 7px; border-radius: 4px; background: var(--atlas-crit); }
  .btn3 .sq.on { border-color: var(--atlas-accent-glow); background: var(--atlas-accent-soft); }
  .camslot .camico { width: 56px; height: 56px; border-radius: 28px; display: flex; align-items: center; justify-content: center; background: var(--atlas-accent-soft); color: var(--atlas-accent); }
  .camslot.private .camico, .camslot.none .camico { background: rgba(241, 245, 255, 0.06); color: var(--atlas-text2); }
  .devs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 84px; gap: 10px; }
  .dev { border-radius: 14px; padding: 12px 14px; display: flex; align-items: center; gap: 12px; background: rgba(241, 245, 255, 0.05); border: 1px solid rgba(188, 200, 222, 0.12); min-width: 0; user-select: none; -webkit-user-select: none; }
  .dev .chipi { width: 40px; height: 40px; flex: none; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: rgba(241, 245, 255, 0.1); }
  .dev .txt { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .dev .txt b { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dev .txt span { font-size: 12px; color: var(--atlas-text2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dev.on { background: var(--atlas-accent-soft); border-color: var(--atlas-accent-glow); }
  .dev.on .chipi { background: var(--atlas-accent-soft); color: var(--atlas-accent); }
  .dev.on .txt span { color: var(--atlas-accent); }
  .dev.open { background: rgba(255, 191, 87, 0.14); border-color: rgba(255, 191, 87, 0.5); }
  .dev.open .chipi { background: rgba(255, 191, 87, 0.2); color: var(--atlas-warn); }
  .dev.open .txt span, .dev.na .txt span { color: var(--atlas-warn); }
  .dev.na { background: rgba(255, 191, 87, 0.05); border: 1px dashed rgba(255, 191, 87, 0.35); }
  .dev.na .chipi { background: rgba(241, 245, 255, 0.06); color: var(--atlas-dim); }
  /* Cover tile: full row, tap area on the left, Open / Stop / Close on the right. */
  .dev.cover { grid-column: 1 / -1; padding: 0 14px 0 0; gap: 10px; }
  .dev.cover .dmain { flex: 1; align-self: stretch; display: flex; align-items: center; gap: 12px; padding: 12px 0 12px 14px; min-width: 0; }
  .dev.cover .cbtns { display: flex; gap: 8px; flex: none; }
  .dev.cover .cbtns .sq { width: 76px; color: var(--atlas-text); }
  .dev.cover .cbtns .sq:disabled { opacity: 0.4; cursor: default; }
  /* Room image is only the backdrop of the Devices card. */
  .devcard { position: relative; overflow: hidden; }
  .devcard > :not(.devbg):not(.devshade):not(.devglow) { position: relative; }
  .devbg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
  .devshade { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(10, 12, 16, 0.72) 0%, rgba(10, 12, 16, 0.45) 45%, rgba(10, 12, 16, 0.7) 100%); }
  .devcard.has-img .dev:not(.on):not(.open):not(.na) { background: rgba(14, 16, 20, 0.58); border-color: rgba(188, 200, 222, 0.16); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
  .sibs { display: flex; gap: 8px; flex-wrap: wrap; }
  .sibs button { height: 44px; padding: 0 14px; border-radius: var(--atlas-r-ctl); font-size: 13px; display: inline-flex; align-items: center; gap: 8px; background: rgba(241, 245, 255, 0.06); border: 1px solid rgba(188, 200, 222, 0.2); }
  .sibs button.alert { border-color: rgba(255, 191, 87, 0.6); }

  /* ---------- dialogs / popovers ---------- */
  .scrim { position: fixed; inset: 0; z-index: 10; background: rgba(0, 0, 0, 0.55); display: flex; align-items: center; justify-content: center; padding: 16px; }
  .dialog { width: min(420px, 100%); padding: 22px; display: flex; flex-direction: column; gap: 14px; background: var(--atlas-solid); border: 1px solid var(--atlas-glass-border); border-radius: var(--atlas-r-card); }
  .dialog h2 { font-size: 20px; }
  .dialog .acts { display: flex; justify-content: flex-end; gap: 10px; }
  .dialog .ok { background: var(--atlas-accent); color: #14171c; border-color: var(--atlas-accent); font-weight: 700; }
  .settings { position: absolute; right: 16px; top: 88px; z-index: 5; width: 300px; padding: 16px; display: flex; flex-direction: column; gap: 12px; background: var(--atlas-solid); border: 1px solid var(--atlas-glass-border); border-radius: var(--atlas-r-card); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
  .seg { display: flex; flex-wrap: wrap; gap: 6px; }
  .seg button { height: 36px; padding: 0 10px; border-radius: 10px; font-size: 12px; border: 1px solid rgba(188, 200, 222, 0.25); }
  .seg button.on { border-color: var(--atlas-accent); color: var(--atlas-accent); }
  .sw { width: 36px; height: 36px; border-radius: 18px; border: 2px solid transparent; }
  .sw.on { border-color: var(--atlas-text); }

  /* ---------- own cards / camera wall ---------- */
  .owncards { display: grid; gap: 16px; }
  .owncards.main { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); align-items: start; }
  .camwall { display: grid; grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr)); gap: 12px; }
  .camtile { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  /* Fit mode (tablet / desktop): page is one window tall; rooms left, cameras right; JS sizes the camera tiles. */
  .main.fit { height: calc(100vh - var(--header-height, 56px) - 32px); min-height: 480px; }
  .main.fit > * { flex: none; }
  .main.fit > .fitgrid { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); gap: 16px; }
  .main.fit .hero { flex-direction: row; align-items: baseline; gap: 16px; }
  .main.fit .hero h1.sm { font-size: 40px; }
  .main.fit .hero p { font-size: 14px; }
  .main.fit .fl { min-height: 0; padding: 10px 14px; justify-content: flex-start; }
  .main.fit .fl .lv { font-size: 22px; line-height: 1.15; }
  .main.fit .roomsec, .main.fit .camsec { min-height: 0; overflow: hidden; }
  .main.fit .roomsec .tiles.floor { flex: 1; min-height: 0; grid-template-columns: repeat(var(--rcols, 2), minmax(0, 1fr)); grid-auto-rows: minmax(0, 1fr); gap: 10px; }
  /* Odd number of rooms: the last tile spans the row, no half-empty row. */
  .main.fit .fitgrid:not(.single) .tiles.floor .tile:last-child:nth-child(odd) { grid-column: span 2; }
  /* Single room: the tile fills the left card; the narrower left side gives the cameras more width. */
  .main.fit > .fitgrid.single { grid-template-columns: minmax(0, 1fr) minmax(0, 2.4fr); }
  .main.fit .tiles.floor .tile { padding: 10px 12px; min-height: 0; }
  .main.fit .tiles.floor .tile .temp { font-size: 20px; }
  .main.fit .tiles.floor .tile .top .ic { width: 20px; height: 20px; }
  .camwall.fitwall { flex: 1 1 auto; min-height: 0; grid-template-columns: repeat(var(--fcols, var(--cols, 3)), var(--fw, minmax(0, 1fr))); justify-content: center; align-content: center; }
  .camname { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; font-size: 14px; font-weight: 600; padding: 2px 4px; min-width: 0; }
  .camname button { padding: 2px 0; font-weight: 600; }
  .camname button:hover { color: var(--atlas-accent); }

  /* ---------- light mood: room photos follow the room lights ---------- */
  .tright { display: flex; align-items: center; justify-content: flex-end; gap: 6px; flex-wrap: wrap; }
  .tile.mood img, .devcard.mood .devbg { filter: brightness(var(--lb, 1)) saturate(var(--ls, 1)); transition: filter 0.6s ease; }
  .tile .glow, .devglow { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(120% 80% at 50% 10%, rgba(255, 190, 110, var(--lg, 0)), transparent 60%); }
  .tile.mood.dark .glow, .devcard.mood.dark .devglow { background: rgba(10, 14, 24, 0.35); }
  .tile.mood.lit, .devcard.mood.lit { border-color: rgba(255, 191, 87, 0.55); box-shadow: 0 0 28px rgba(255, 180, 90, 0.22); }
  .lchip { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px; white-space: nowrap; border: 1px solid transparent; }
  .lchip.dark { background: rgba(0, 0, 0, 0.55); color: var(--atlas-text2); }
  .lchip.part { background: rgba(255, 191, 87, 0.18); color: #ffd9a0; border-color: rgba(255, 191, 87, 0.45); }
  .lchip.lit { background: var(--atlas-warn); color: #2a1a00; }
  .dev.on.lit { background: rgba(255, 191, 87, 0.14); border-color: rgba(255, 191, 87, 0.5); }
  .dev.on.lit .chipi { background: rgba(255, 191, 87, 0.2); color: var(--atlas-warn); }
  .dev.on.lit .txt span { color: var(--atlas-warn); }

  /* ---------- room status strip ---------- */
  .strip { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .schip { display: inline-flex; align-items: center; gap: 10px; min-height: 44px; padding: 6px 14px 6px 10px; border-radius: 14px; background: var(--atlas-glass-bg); border: 1px solid var(--atlas-glass-border); text-align: left; max-width: 280px; }
  .schip > span { display: flex; flex-direction: column; min-width: 0; }
  .schip b { font-size: 13px; font-weight: 600; white-space: nowrap; }
  .schip small { font-size: 11px; color: var(--atlas-text2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .schip.ok .okdot { width: 22px; height: 22px; border-radius: 11px; display: flex; align-items: center; justify-content: center; background: var(--atlas-accent); color: #14171c; font-size: 13px; font-weight: 800; }
  .schip.warn { border-color: rgba(255, 191, 87, 0.5); color: var(--atlas-warn); }
  .schip.on { border-color: var(--atlas-accent-glow); color: var(--atlas-accent); }
  .sbar { display: block; height: 3px; border-radius: 2px; background: rgba(241, 245, 255, 0.12); margin-top: 3px; }
  .sbar > i { display: block; height: 3px; border-radius: 2px; background: var(--atlas-accent); }

  /* ---------- climate extras / printer / automations ---------- */
  .cextra { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
  .cx { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 12px; background: rgba(241, 245, 255, 0.05); border: 1px solid rgba(188, 200, 222, 0.1); text-align: left; min-width: 0; }
  .cx > span:last-child { display: flex; flex-direction: column; min-width: 0; }
  .cx b { font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cx small { font-size: 11px; color: var(--atlas-text2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cxi { color: var(--atlas-accent); display: flex; }
  .printer { gap: 12px; }
  .pstatus { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--atlas-accent); }
  .pbody { display: flex; align-items: center; gap: 14px; }
  .ppic { flex: none; width: 112px; aspect-ratio: 4 / 3; border-radius: 12px; overflow: hidden; background: #0e1014; border: 1px solid rgba(188, 200, 222, 0.14); }
  .ppic img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pnum { display: flex; flex-direction: column; gap: 4px; text-align: left; }
  .pnum b { font-size: 44px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
  .pnum span { font-size: 13px; }
  .ptemps { display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 8px; }
  .ptemps button { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 12px; background: rgba(241, 245, 255, 0.05); border: 1px solid rgba(188, 200, 222, 0.1); text-align: left; }
  .ptemps b { font-size: 15px; }
  .ptemps small { font-size: 11px; color: var(--atlas-text2); }
  .pbtns { display: grid; grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); gap: 8px; }
  .pbtns .sq { color: var(--atlas-text); }
  .pbtns .sq.on { color: var(--atlas-accent); border-color: var(--atlas-accent-glow); background: var(--atlas-accent-soft); }
  .pbtns .sq.stop { color: var(--atlas-crit); }
  .autos { gap: 6px; }
  .auto { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 0; border-top: 1px solid rgba(188, 200, 222, 0.08); }
  .auto:first-of-type { border-top: 0; }
  .atxt { display: flex; flex-direction: column; gap: 2px; text-align: left; min-width: 0; }
  .atxt b { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .atxt small { font-size: 12px; }
  .tog { flex: none; width: 48px; height: 28px; border-radius: 14px; background: rgba(241, 245, 255, 0.14); position: relative; border: 1px solid rgba(188, 200, 222, 0.2); }
  .tog i { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 10px; background: var(--atlas-text2); transition: left 0.15s; }
  .tog.on { background: var(--atlas-accent-soft); border-color: var(--atlas-accent); }
  .tog.on i { left: 23px; background: var(--atlas-accent); }
  .tog:disabled { opacity: 0.4; }

  /* ---------- lights page ---------- */
  .lfloor { gap: 14px; }
  .lrooms { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }
  .lroom { display: flex; flex-direction: column; gap: 10px; padding: 12px; border-radius: 16px; background: rgba(241, 245, 255, 0.03); border: 1px solid rgba(188, 200, 222, 0.08); }
  .lrname { display: flex; flex-direction: column; text-align: left; min-width: 0; }
  .lrname b { font-size: 15px; }
  .lrname small { font-size: 12px; }
  .ltiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
  .ltile { position: relative; overflow: hidden; display: flex; align-items: center; gap: 10px; min-height: 64px; padding: 10px 12px; border-radius: 14px; text-align: left;
    background: rgba(241, 245, 255, 0.05); border: 1px solid rgba(188, 200, 222, 0.12); touch-action: pan-y; user-select: none; -webkit-user-select: none; }
  .ltile .lfill { position: absolute; inset: 0 auto 0 0; width: 0; background: linear-gradient(90deg, rgba(255, 191, 87, 0.28), rgba(255, 191, 87, 0.14)); transition: width 0.25s ease; pointer-events: none; }
  .ltile.on .lfill { width: var(--pct, 100%); }
  .ltile.dragging .lfill { width: var(--pct, 0%); transition: none; }
  .ltile > :not(.lfill) { position: relative; }
  .ltile .lic { width: 36px; height: 36px; flex: none; border-radius: 18px; display: flex; align-items: center; justify-content: center; background: rgba(241, 245, 255, 0.08); color: var(--atlas-text2); }
  .ltile.on { border-color: rgba(255, 191, 87, 0.5); }
  .ltile.on .lic { background: rgba(255, 191, 87, 0.22); color: var(--atlas-warn); }
  .ltxt { display: flex; flex-direction: column; min-width: 0; }
  .ltxt b { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ltxt .lstate { font-size: 12px; color: var(--atlas-text2); }
  .ltile.on .lstate { color: var(--atlas-warn); }
  .ltile.na { border-style: dashed; border-color: rgba(255, 191, 87, 0.35); }
  .ltile.na .lstate { color: var(--atlas-warn); }
  .ltile.dim::after { content: ""; position: absolute; left: 12px; right: 12px; bottom: 5px; height: 2px; border-radius: 1px; background: rgba(241, 245, 255, 0.1); }

  /* ---------- security page and presence ---------- */
  .sec-grid { display: grid; grid-template-columns: minmax(340px, 1fr) minmax(0, 1.35fr); gap: 16px; align-items: start; }
  .sec-grid > .col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
  .scams { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
  .alarm { gap: 12px; }
  .astate { display: flex; align-items: center; gap: 14px; text-align: left; padding: 6px 4px; }
  .aico { width: 56px; height: 56px; flex: none; border-radius: 28px; display: flex; align-items: center; justify-content: center; background: rgba(241, 245, 255, 0.06); color: var(--atlas-text2); }
  .astate b { font-size: 22px; font-weight: 700; }
  .alarm.armed .aico { background: var(--atlas-accent-soft); color: var(--atlas-accent); }
  .alarm.armed .astate b { color: var(--atlas-accent); }
  .alarm.warn .aico, .alarm.na .aico { background: rgba(255, 191, 87, 0.14); color: var(--atlas-warn); }
  .alarm.warn .astate b, .alarm.na .astate b { color: var(--atlas-warn); }
  .alarm.crit { border-color: rgba(255, 114, 125, 0.6); }
  .alarm.crit .aico { background: rgba(255, 114, 125, 0.18); color: var(--atlas-crit); }
  .alarm.crit .astate b { color: var(--atlas-crit); }
  .amodes { display: grid; grid-template-columns: repeat(auto-fit, minmax(96px, 1fr)); gap: 8px; }
  .amodes .sq { gap: 6px; color: var(--atlas-text); padding: 0 8px; }
  .amodes .sq.on { color: var(--atlas-accent); border-color: var(--atlas-accent-glow); background: var(--atlas-accent-soft); opacity: 1; }
  .amodes .sq.dis { color: var(--atlas-warn); }
  .amodes .sq:disabled:not(.on) { opacity: 0.4; }
  .slist { display: flex; flex-direction: column; }
  .srow { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-top: 1px solid rgba(188, 200, 222, 0.08); }
  .srow:first-child { border-top: 0; }
  .smain { flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; text-align: left; }
  .sic { width: 34px; height: 34px; flex: none; border-radius: 17px; display: flex; align-items: center; justify-content: center; background: rgba(241, 245, 255, 0.06); color: var(--atlas-text2); }
  .srow.open .sic { background: var(--atlas-accent-soft); color: var(--atlas-accent); }
  .srow.warn .sic, .srow.na .sic { background: rgba(255, 191, 87, 0.14); color: var(--atlas-warn); }
  .srow.warn small, .srow.na small { color: var(--atlas-warn); }
  .sbtn { flex: none; gap: 6px; padding: 0 12px; height: 36px; color: var(--atlas-text); }
  .sbtn:disabled { opacity: 0.4; }
  .h2btn { text-align: left; }
  .h2btn:hover h2 { color: var(--atlas-accent); }
  .hgreet { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .hero.split { flex-direction: row; align-items: flex-end; justify-content: space-between; gap: 16px; }
  .presence { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
  .pchip { display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 12px 0 4px; border-radius: 20px; background: var(--atlas-glass-bg); border: 1px solid var(--atlas-glass-border); }
  .pav { position: relative; width: 32px; height: 32px; flex: none; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; background: rgba(241, 245, 255, 0.1); }
  .pav img { width: 100%; height: 100%; border-radius: 16px; object-fit: cover; }
  .pav i { position: absolute; right: -1px; bottom: -1px; width: 10px; height: 10px; border-radius: 5px; background: var(--atlas-dim); border: 2px solid #1c1f24; }
  .pchip.home .pav i { background: var(--atlas-accent); }
  .pchip.na .pav i { background: var(--atlas-warn); }
  .ptxt { display: flex; flex-direction: column; line-height: 1.15; text-align: left; }
  .ptxt b { font-size: 13px; font-weight: 600; }
  .ptxt small { font-size: 11px; color: var(--atlas-text2); }
  .pchip.home .ptxt small { color: var(--atlas-accent); }

  /* ---------- weather strip (Home hero) ---------- */
  .hside { display: flex; align-items: flex-end; justify-content: flex-end; flex-wrap: wrap; gap: 10px; min-width: 0; }
  .hside .presence { flex-direction: column; align-items: stretch; flex-wrap: nowrap; gap: 6px; }
  .wxstrip { display: flex; align-items: stretch; gap: 6px; max-width: 100%; }
  .wxseg { display: flex; flex-direction: column; gap: 4px; }
  .wxseg button { flex: 1; padding: 0 8px; border-radius: 8px; font-size: 11px; color: var(--atlas-text2); border: 1px solid rgba(188, 200, 222, 0.18); background: var(--atlas-glass-bg); }
  .wxseg button.on { color: var(--atlas-accent); border-color: var(--atlas-accent-glow); }
  .wxfc { display: flex; gap: 4px; padding: 4px; border-radius: 14px; background: var(--atlas-glass-bg); border: 1px solid var(--atlas-glass-border); min-width: 0; }
  .wxday { display: flex; flex-direction: column; align-items: center; gap: 1px; width: 58px; padding: 4px 2px; border-radius: 10px; }
  .wxday:first-child { background: rgba(241, 245, 255, 0.06); }
  .wxday small { font-size: 10px; color: var(--atlas-text2); white-space: nowrap; }
  .wxday svg { width: 26px; height: 21px; }
  .wxday b { font-size: 12px; font-weight: 600; white-space: nowrap; display: flex; gap: 3px; }
  .wxday .wxpp { color: #5ec8ff; }
  .wxnone { padding: 8px 12px; font-size: 12px; align-self: center; }

  /* ---------- system page ---------- */
  .syslinks { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 6px; }
  .sys-grid { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(320px, 1fr); gap: 16px; align-items: start; }
  .sys-grid > .col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
  .report { gap: 14px; }
  .rbanner { display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: 14px; background: rgba(241, 245, 255, 0.05); border: 1px solid rgba(188, 200, 222, 0.12); }
  .rbanner .rico { width: 44px; height: 44px; flex: none; border-radius: 22px; display: flex; align-items: center; justify-content: center; background: var(--atlas-accent-soft); color: var(--atlas-accent); }
  .rbanner b { font-size: 16px; }
  .rbanner small { font-size: 12px; color: var(--atlas-text2); }
  .rbanner.crit { background: rgba(255, 114, 125, 0.12); border-color: rgba(255, 114, 125, 0.5); }
  .rbanner.crit .rico { background: rgba(255, 114, 125, 0.2); color: var(--atlas-crit); }
  .rbanner.warn, .rbanner.wait { background: rgba(255, 191, 87, 0.1); border-color: rgba(255, 191, 87, 0.45); }
  .rbanner.warn .rico, .rbanner.wait .rico { background: rgba(255, 191, 87, 0.18); color: var(--atlas-warn); }
  .rbanner.info .rico { background: rgba(167, 163, 255, 0.18); color: var(--atlas-info); }
  .rstats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .rstat { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border-radius: 12px; background: rgba(241, 245, 255, 0.05); border: 1px solid rgba(188, 200, 222, 0.1); }
  .rstat b { font-size: 24px; font-weight: 700; color: var(--atlas-text2); }
  .rstat small { font-size: 12px; color: var(--atlas-text2); }
  .rstat.critical.has b { color: var(--atlas-crit); }
  .rstat.warning.has b { color: var(--atlas-warn); }
  .rstat.minor.has b { color: var(--atlas-info); }
  .incs { display: flex; flex-direction: column; gap: 8px; }
  .inc { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 14px; padding: 12px 14px; border-radius: 14px; background: rgba(241, 245, 255, 0.04); border: 1px solid rgba(188, 200, 222, 0.1); border-left: 3px solid var(--atlas-info); }
  .inc.critical { border-left-color: var(--atlas-crit); }
  .inc.warning { border-left-color: var(--atlas-warn); }
  .incmain { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .inchead { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
  .inchead b { font-size: 14px; }
  .inc p { margin: 0; font-size: 13px; color: var(--atlas-text2); line-height: 1.4; }
  .inc small { font-size: 11px; }
  .itag { font-size: 10px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; padding: 2px 8px; border-radius: 999px; background: rgba(167, 163, 255, 0.18); color: var(--atlas-info); }
  .itag.critical { background: rgba(255, 114, 125, 0.18); color: var(--atlas-crit); }
  .itag.warning { background: rgba(255, 191, 87, 0.18); color: var(--atlas-warn); }
  .icount { font-size: 12px; color: var(--atlas-text2); }
  .increc { padding-left: 14px; border-left: 1px solid rgba(188, 200, 222, 0.12); display: flex; flex-direction: column; gap: 4px; }
  .increc small { font-size: 11px; color: var(--atlas-accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
  .increc p { color: var(--atlas-text); }

  /* ---------- vehicle card ---------- */
  .vehicle { gap: 14px; }
  .vehicle h2 { min-width: 0; }
  .vname { display: flex; flex-direction: column; min-width: 0; line-height: 1.15; }
  .vname small { font-size: 12px; font-weight: 500; }
  .vlock { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px; border-radius: 999px; font-size: 12px; font-weight: 700; border: 1px solid rgba(188, 200, 222, 0.25); color: var(--atlas-text2); flex: none; }
  .vlock.locked { color: var(--atlas-accent); border-color: var(--atlas-accent-glow); background: var(--atlas-accent-soft); }
  .vlock.unlocked, .vlock.jammed { color: var(--atlas-warn); border-color: rgba(255, 191, 87, 0.5); background: rgba(255, 191, 87, 0.12); }
  .vbody { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 14px; align-items: center; }
  .vpic { display: flex; align-items: center; justify-content: center; min-height: 120px; border-radius: 14px; background: rgba(0, 0, 0, 0.25); overflow: hidden; }
  .vpic img { width: 100%; height: 100%; max-height: 220px; object-fit: contain; }
  .vsvg { width: 92%; height: auto; }
  .vstats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .vstats > :last-child:nth-child(odd) { grid-column: span 2; }
  .vstat { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border-radius: 12px; background: rgba(241, 245, 255, 0.05); border: 1px solid rgba(188, 200, 222, 0.1); text-align: left; min-width: 0; }
  .vstat b { font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .vstat small { font-size: 11px; color: var(--atlas-text2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .vfoot { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
  .vupd { font-size: 12px; }
  .vacts { display: flex; gap: 8px; flex-wrap: wrap; }
  .vact { width: auto; padding: 0 12px; gap: 6px; color: var(--atlas-text); font-size: 12px; }
  .vact:disabled { opacity: 0.4; cursor: default; }

  /* ---------- time ago ---------- */
  .ago { font-size: 11px; color: var(--atlas-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dev .txt .ago { margin-top: 1px; }
  .metric .lbl .ago { margin-left: auto; padding-left: 6px; }

  /* ---------- energy ---------- */
  .energy-top { display: grid; grid-template-columns: minmax(0, 1fr) 400px; gap: 16px; }
  .emain-body { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
  .egauge { position: relative; display: flex; align-items: center; justify-content: center; flex: none; border-radius: 50%; }
  .egauge .ev { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
  .egauge .ev b { font-size: 18px; font-weight: 700; }
  .egauge.big .ev b { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; }
  .egauge .ev span { font-size: 11px; color: var(--atlas-text2); }
  .phases { flex: 1; min-width: 260px; display: flex; flex-direction: column; gap: 4px; }
  .ph { display: grid; grid-template-columns: 96px repeat(3, minmax(0, 1fr)); align-items: center; gap: 6px; }
  .ph.head span { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--atlas-dim); text-align: center; }
  .ph > span.t2 { display: flex; align-items: center; gap: 6px; font-size: 12px; }
  .ph > button { height: 40px; border-radius: 10px; background: rgba(241, 245, 255, 0.05); border: 1px solid rgba(188, 200, 222, 0.1); font-size: 14px; font-weight: 600; }
  .estats { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px; }
  .estats.sm { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
  .estat { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 10px 12px; border-radius: 12px; background: rgba(241, 245, 255, 0.05); border: 1px solid rgba(188, 200, 222, 0.1); min-width: 0; text-align: left; }
  .estat b { font-size: 15px; font-weight: 600; white-space: nowrap; }
  .estat span { font-size: 11px; color: var(--atlas-text2); }
  .estats.sm .estat { padding: 7px 8px; }
  .estats.sm .estat b { font-size: 13px; }
  .estat:disabled { cursor: default; }
  .estatus { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--atlas-text2); white-space: nowrap; }
  .estatus i { width: 7px; height: 7px; border-radius: 4px; background: var(--atlas-dim); }
  .estatus.on { color: var(--atlas-accent); }
  .estatus.on i { background: var(--atlas-accent); box-shadow: 0 0 8px var(--atlas-accent-glow); }
  .estatus.off { color: var(--atlas-warn); }
  .estatus.off i { background: var(--atlas-warn); }
  .esum-figs { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 8px; }
  .esum-figs div { display: flex; flex-direction: column; gap: 2px; }
  .esum-figs b { font-size: 22px; font-weight: 700; }
  .esum-figs span { font-size: 12px; color: var(--atlas-text2); }
  .esum h3 { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 4px; }
  .etop { display: flex; flex-direction: column; gap: 10px; }
  .etop button { display: flex; flex-direction: column; gap: 6px; text-align: left; }
  .etop .lbl { display: flex; justify-content: space-between; gap: 8px; font-size: 13px; }
  .etop .bar > span { background: var(--atlas-accent); }
  .egrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
  .ecard { display: flex; flex-direction: column; align-items: stretch; gap: 10px; padding: 14px; border-radius: 16px; background: rgba(241, 245, 255, 0.04); border: 1px solid rgba(188, 200, 222, 0.12); min-width: 0; }
  .ecard.on { border-color: var(--atlas-accent-glow); background: linear-gradient(180deg, var(--atlas-accent-soft), rgba(241, 245, 255, 0.03)); }
  .ecard.off { border-style: dashed; border-color: rgba(255, 191, 87, 0.35); }
  .ecard .ename { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ecard .egauge { align-self: center; }
  .ecard .eextra { font-size: 11px; text-align: center; }
  .ephases { display: flex; flex-direction: column; gap: 4px; }
  .ph.sm { gap: 4px; }
  .ph.sm .phl { font-size: 11px; font-weight: 700; color: var(--atlas-dim); text-align: center; }
  .ph.sm > button { height: 30px; font-size: 12px; border-radius: 8px; padding: 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ph.sm > button:disabled { cursor: default; }

  /* ---------- bottom nav (phone) ---------- */
  .bnav { display: none; }

  /* ---------- responsive ---------- */
  /* Medium screens: own cards go below climate and camera; Devices spans the full height. */
  @media (max-width: 1200px) {
    .room-grid.has-side { grid-template-columns: 340px minmax(0, 1fr); grid-template-areas: "left main" "side main"; grid-template-rows: auto 1fr; }
    .room-grid.has-side > .scol { align-self: start; }
  }
  @media (max-width: 1280px) {
    .home-grid { grid-template-columns: minmax(0, 1fr) 340px; }
    .room-grid { grid-template-columns: 340px minmax(0, 1fr); }
    .energy-top { grid-template-columns: minmax(0, 1fr) 340px; }
    .devs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .hero h1 { font-size: 52px; }
    .banner .sum { width: 200px; }
    .chips { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .chips > :nth-child(3) { display: none; }
    .weather .wtxt { display: none; }
  }
  @media (max-width: 1100px) {
    .camwall { grid-template-columns: repeat(min(var(--cols, 3), 2), minmax(0, 1fr)); }
    aside { width: 76px; padding: 20px 10px; }
    .logo .lt, .nav .lbl, .user .lbl { display: none; }
    .logo { padding: 0 0 26px; justify-content: center; }
    .nav button { justify-content: center; padding: 0; }
    .home-grid, .room-grid, .room-grid.has-side, .energy-top, .sec-grid, .sys-grid { grid-template-columns: minmax(0, 1fr); }
    .room-grid { grid-template-areas: "left" "main"; }
    .room-grid.has-side { grid-template-areas: "left" "side" "main"; grid-template-rows: auto; }
    /* Greeting above the forecast strip and presence chips. */
    .hero.split { flex-direction: column; align-items: stretch; gap: 8px; }
    .presence { justify-content: flex-start; }
    .hside { justify-content: flex-start; align-items: stretch; flex-wrap: nowrap; }
    .wxstrip { flex: 1; }
    .wxfc { flex: 1; justify-content: space-between; }
    .wxday { width: auto; flex: 1; min-width: 0; }
  }
  @media (max-width: 760px) {
    .hside { flex-direction: column; }
    .hside .presence { flex-direction: row; flex-wrap: wrap; }
    .lrooms { grid-template-columns: minmax(0, 1fr); }
    .scams { grid-template-columns: minmax(0, 1fr); }
    .inc { grid-template-columns: minmax(0, 1fr); gap: 10px; }
    .increc { padding: 10px 0 0; border-left: 0; border-top: 1px solid rgba(188, 200, 222, 0.12); }
    .amodes { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .ltiles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .vbody { grid-template-columns: minmax(0, 1fr); }
    .vact span { display: none; }
    .vact { width: 44px; padding: 0; }
    .lchip { padding: 2px 7px; font-size: 10px; }
    .tile .name, .tile .hum { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tile .info { flex: 1; }
    .camsec > .row { flex-wrap: wrap; }
    .camsec > .row > span.t2 { flex-basis: 100%; }
    .strip { gap: 6px; }
    .schip { max-width: 100%; }
    .camwall, .owncards.main { grid-template-columns: minmax(0, 1fr); }
    .frame { padding: 12px 12px 96px; gap: 12px; }
    aside { display: none; }
    .main { gap: 12px; }
    header.top { height: 56px; padding: 0 6px 0 12px; }
    .tabs { display: none; }
    .mlogo { display: flex; align-items: center; gap: 8px; font-weight: 700; letter-spacing: 0.12em; color: var(--atlas-accent); }
    .mlogo b { color: var(--atlas-text); }
    .clock { display: none; }
    .tools { gap: 6px; }
    .hero { padding: 4px 6px 0; }
    .hero h1, .hero h1.sm { font-size: 34px; }
    .hero p { font-size: 14px; }
    .banner { padding: 10px 10px 10px 12px; gap: 12px; }
    .banner .sum { width: auto; flex: 1; }
    .banner .sum b { font-size: 16px; }
    .chips { display: none; }
    .tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 132px; }
    .tile, .tile.s3 { grid-column: span 1; padding: 12px; }
    .tile .temp { font-size: 22px; }
    .tiles.floor { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 140px; }
    .floors { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .alist { grid-template-columns: minmax(0, 1fr); }
    .crumb, .rhead { padding: 0 6px; }
    .rhead h1 { font-size: 30px; }
    .devs, .room-grid.has-side .devs { grid-template-columns: minmax(0, 1fr); grid-auto-rows: 76px; }
    .dev.cover { grid-row: span 2; flex-direction: column; align-items: stretch; gap: 6px; padding: 0 12px 12px; }
    .dev.cover .dmain { padding: 10px 0 0; }
    .dev.cover .cbtns .sq { flex: 1; width: auto; }
    .egrid { grid-template-columns: minmax(0, 1fr); gap: 8px; }
    .ecard { display: grid; grid-template-columns: 104px minmax(0, 1fr); align-items: center; gap: 8px 12px; padding: 12px; }
    .ecard > .row, .ecard > .eextra, .ecard > .ephases { grid-column: 1 / -1; }
    .ecard .ering { width: 100px; height: 100px; }
    .estats.sm { grid-template-columns: minmax(0, 1fr); }
    .ph { grid-template-columns: 74px repeat(3, minmax(0, 1fr)); }
    .ph > button { font-size: 12px; }
    .emain-body { justify-content: center; }
    .qa { flex: 1 1 40%; justify-content: center; }
    .settings { top: 70px; right: 12px; left: 12px; width: auto; }
    .bnav { display: grid; grid-template-columns: repeat(5, 1fr); position: fixed; left: 0; right: 0; bottom: 0; z-index: 4; height: 72px; padding: 6px 6px calc(6px + env(safe-area-inset-bottom)); border-radius: 20px 20px 0 0; }
    .bnav button { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; font-size: 11px; color: var(--atlas-text2); }
    .bnav button.on { color: var(--atlas-accent); }
  }
`;
