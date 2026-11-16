// Bundled into ATLAS Home (porting plan step 8, owner's decision: bundle as-is).
// Source: https://github.com/robman2026/Samsung-SolarCell-Remote-HA-Card (MIT, Copyright (c) 2026 robman2026), commit 6bf8b2e.
// Look and behaviour unchanged. Changes for bundling:
//  - em dashes in comments replaced by "-" (project rule);
//  - custom element and card picker entry registered only when not already defined (the separate HACS card may still be installed).
// Placed in a room with `cards` / `side_cards` like any Lovelace card.

/**
 * Samsung Solar Remote Card for Home Assistant
 * v1.1.0 - Slim button style matching original YAML remote
 *
 * @license MIT
 */

const CARD_VERSION = '2.0.0';

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const STYLES = `
  :host {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  * { box-sizing: border-box; }

  .remote {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: #1c1c1c;
    border: 2px solid #141414;
    border-radius: 40px;
    padding: 28px 18px 20px;
    box-shadow: inset 0 4px 10px rgba(255,255,255,0.05);
    width: 100%;
    max-width: 250px;
    font-family: -apple-system, 'Helvetica Neue', sans-serif;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 6px;
  }

  /* ── Base round button ── */
.btn {
  position: relative;                 /* REQUIRED for pseudo-elements */
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: rgba(30,30,30,0.9);
  border: 0;                           /* we replace the border */
  border-radius: 50%;
  cursor: pointer;

  transition: filter .1s, transform .08s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  flex-shrink: 0;
}

/* --- BASE INNER BORDER --- */
.btn::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;

  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.18),
    inset 0 0 10px rgba(255,255,255,0.12);

  opacity: 0.6;
  transition: opacity 160ms ease;
}

/* --- HOVER / ACTIVE BORDER (STRONGER) --- */
.btn::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;

  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.4),
    inset 0 0 18px rgba(255,255,255,0.32);

  opacity: 0;
  transition: opacity 160ms ease;
}

/* hover */
.btn:hover::after {
  opacity: 1;
}

/* active (keeps your behavior) */
.btn:active {
  filter: brightness(2);
  transform: scale(0.88);
}

/* sizes */
.btn-50 { width:50px; height:50px; }
.btn-44 { width:44px; height:44px; }

/* icon */
.btn svg {
  width:22px;
  height:22px;
  fill:white;
  display:block;
}
.btn.icon-lg svg {
  width:26px;
  height:26px;
}


  /* ── Power - slim oval ── */
.btn-power {
  position: relative;                 /* required */
  width: 50px;
  height: 30px;
  border-radius: 20px;

  background: rgba(30,30,30,0.9);
  border: 0;                          /* we replace the border */

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: filter .1s, transform .08s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* --- BASE INNER BORDER --- */
.btn-power::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;

  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.16),
    inset 0 0 8px rgba(255,255,255,0.12);

  opacity: 0.6;
  transition: opacity 160ms ease;
}

/* --- HOVER / ACTIVE BORDER (STRONGER) --- */
.btn-power::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;

  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.38),
    inset 0 0 14px rgba(255,255,255,0.3);

  opacity: 0;
  transition: opacity 160ms ease;
}

/* hover */
.btn-power:hover::after {
  opacity: 1;
}

/* active (keeps your exact behavior) */
.btn-power:active {
  filter: brightness(1.6);
  transform: scale(0.88);
}

/* icon */
.btn-power svg {
  width: 18px;
  height: 18px;
  display: block;
  fill: white;
}


  /* ── 123 button ── */
.btn-123 {
  position: relative;                 /* required for pseudo-elements */
  width: 50px;
  height: 50px;
  border-radius: 50%;

  background: rgba(30,30,30,0.9);
  border: 0;                          /* replace solid border */

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;

  cursor: pointer;
  transition: filter .1s, transform .08s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  padding: 0;
  flex-shrink: 0;
}

/* --- BASE INNER BORDER --- */
.btn-123::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;

  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.16),
    inset 0 0 10px rgba(255,255,255,0.12);

  opacity: 0.6;
  transition: opacity 160ms ease;
}

/* --- HOVER / ACTIVE BORDER (STRONGER) --- */
.btn-123::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;

  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.38),
    inset 0 0 18px rgba(255,255,255,0.3);

  opacity: 0;
  transition: opacity 160ms ease;
}

/* hover */
.btn-123:hover::after {
  opacity: 1;
}

/* active (keeps your behavior exactly) */
.btn-123:active {
  filter: brightness(1.6);
  transform: scale(0.88);
}

/* content (unchanged) */
.btn-123 .cog  {
  width: 13px;
  height: 13px;
  fill: white;
}
.btn-123 .num  {
  font-size: 8px;
  font-weight: 700;
  color: white;
  line-height: 1;
}
.btn-123 .dots {
  display: flex;
  gap: 2px;
}
.btn-123 .dot  {
  width: 4px;
  height: 4px;
  border-radius: 50%;
}

  /* ── D-pad ── */
.dpad { position:relative; width:160px; height:160px; flex-shrink:0; margin:2px 0; }
.dpad-ring {
  position:absolute; inset:0; border-radius:50%;
  background: radial-gradient(circle at 40% 35%, #2a2a2a, #161616);
  box-shadow: 0 4px 16px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.04);
}
.dpad-btn {
  position:absolute; background:transparent; border:none;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; -webkit-tap-highlight-color:transparent; touch-action:manipulation;
  transition: filter .1s; overflow: visible;
}
.dpad-btn:active { filter: brightness(2.2); }
.dpad-btn svg.icon { width:24px; height:24px; fill:white; pointer-events:none; display:block; position:relative; z-index:1; transition: filter .15s; }
.dpad-btn:hover svg.icon { filter: drop-shadow(0 0 5px rgba(255,255,255,0.9)) drop-shadow(0 0 10px rgba(180,180,255,0.6)); }

/* glow arrow on d-pad */
.dpad-btn .arrow-glow {
  position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  opacity:0; transition:opacity .2s; pointer-events:none; z-index:2;
}
.dpad-btn:hover .arrow-glow { opacity:1; }
.dpad-btn .arrow-glow svg { width:30px; height:30px; fill:white; filter: drop-shadow(0 0 8px rgba(255,255,255,1)) drop-shadow(0 0 16px rgba(160,160,255,0.7)); pointer-events:none; }
.dpad-btn.btn-up    .arrow-glow svg { animation: aUp    .7s ease-in-out infinite; }
.dpad-btn.btn-down  .arrow-glow svg { animation: aDown  .7s ease-in-out infinite; }
.dpad-btn.btn-left  .arrow-glow svg { animation: aLeft  .7s ease-in-out infinite; }
.dpad-btn.btn-right .arrow-glow svg { animation: aRight .7s ease-in-out infinite; }

@keyframes aUp    { 0%,100%{transform:translateY(3px)}  50%{transform:translateY(-3px)} }
@keyframes aDown  { 0%,100%{transform:translateY(-3px)} 50%{transform:translateY(3px)} }
@keyframes aRight { 0%,100%{transform:translateX(-3px)} 50%{transform:translateX(3px)} }

.dpad-up    { top:4px;    left:50%; transform:translateX(-50%); width:52px; height:52px; }
.dpad-down  { bottom:4px; left:50%; transform:translateX(-50%); width:52px; height:52px; }
.dpad-left  { left:4px;   top:50%;  transform:translateY(-50%); width:52px; height:70px; }
.dpad-right { right:4px;  top:50%;  transform:translateY(-50%); width:52px; height:70px; }

.dpad-ok {
  position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
  width:88px; height:88px; border-radius:50%;
  background: radial-gradient(circle at 40% 35%, #2e2e2e, #141414);
  box-shadow: 0 3px 10px rgba(0,0,0,0.9), inset 0 2px 4px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.04);
  border:none; cursor:pointer; overflow:hidden;
  -webkit-tap-highlight-color:transparent; touch-action:manipulation;
  transition: filter .1s, transform .08s;
}
.dpad-ok::after {
  content:''; position:absolute; inset:0; border-radius:50%;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 70%);
  opacity:0; transition: opacity .2s;
}
.dpad-ok:hover::after { opacity:1; }
.dpad-ok:active { filter: brightness(1.5); transform: translate(-50%,-50%) scale(0.92); }

  /* ── Pill buttons - 35px height, 12px radius, matches YAML ── */
.pill-row {
  display: flex;
  gap: 6px;
  width: 100%;
}

.btn-pill {
  position: relative;                 /* required */
  flex: 1;
  height: 35px;
  border-radius: 12px;

  background: rgba(30,30,30,0.9);
  border: 0;                          /* replace solid border */

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: filter .1s, transform .08s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* --- BASE INNER BORDER --- */
.btn-pill::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;

  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.15),
    inset 0 0 8px rgba(255,255,255,0.12);

  opacity: 0.6;
  transition: opacity 160ms ease;
}

/* --- HOVER / ACTIVE BORDER (STRONGER) --- */
.btn-pill::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;

  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.36),
    inset 0 0 14px rgba(255,255,255,0.3);

  opacity: 0;
  transition: opacity 160ms ease;
}

/* hover */
.btn-pill:hover::after {
  opacity: 1;
}

/* active (keeps your behavior) */
.btn-pill:active {
  filter: brightness(1.6);
  transform: scale(0.93);
}

/* icon */
.btn-pill svg {
  width: 18px;
  height: 18px;
  fill: white;
  display: block;
}

  /* ── App buttons ── */
  .app-row { display:flex; gap:6px; width:100%; }
  .btn-app {
    flex: 1;
    height: 35px;
    border-radius: 13px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: filter .1s, transform .08s;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    gap: 4px;
    padding: 0 6px;
  }
  .btn-app:active { filter: brightness(1.3); transform: scale(0.95); }

  .btn-netflix {
    background: #000;
    border:1px solid #111;
  }
  .btn-netflix-logo {
    width:95%; height:95%;
    background: url("https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg") center/contain no-repeat;
  }

  .btn-youtube {
    background:#fff; 
    border:1px solid #eee;
  }
  .btn-youtube-logo {
    width:120%; height:120%;
    background: url("https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg") center/contain no-repeat;
  }

  .btn-prime {
    background: linear-gradient(200deg, #1098F7 0%, #001f3f 100%);
    border: 1px solid #1098F7;
    box-shadow: inset 0 1px 2px rgba(255,255,255,0.2);
  }
  .btn-prime-logo {
    width:100%; height:100%;
    background: url("https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg") center/contain no-repeat;
    filter: brightness(0) invert(1);
  }

  .btn-disney {
    background: linear-gradient(180deg, #016f7d 0%, #001f3f 100%);
    border: 1px solid #004d61;
  }
  .btn-disney-logo {
    width:100%; height:100%;
    background: url("https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg") center/contain no-repeat;
    filter: brightness(0) invert(1);
  }

  .divider {
    width: 85%;
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 4px 0;
  }
  
  .btn-plex {
    background: linear-gradient(50deg, #AFAFAF 40%, #fff 100%);
    border: 1px solid #AFAFAF;
	box-shadow: inset 0 3px 4px rgba(0,0,0,0.2);
  }
  .btn-plex-logo {
    width:85%; height:85%;
    background: url("https://upload.wikimedia.org/wikipedia/commons/7/7b/Plex_logo_2022.svg") center/contain no-repeat;
  }

  .btn-spotify {
    background: #1DB954;
    border: 1px solid #1DB954;
  }
  .btn-spotify-logo {
    width:85%; height:85%;
    background: url("https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg") center/contain no-repeat;
    filter: brightness(0) invert(1);
  }
  
/* ── Samsung wordmark at bottom ── */
  .samsung-logo {
    margin-top: 14px;
    margin-bottom: 4px;
    opacity: 0.35;
    user-select: none;
    pointer-events: none;
    flex-shrink: 0;
    width: 100%;   
    height: 14px;
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    filter: brightness(0) invert(1); /* makes it white */
  }

  
`;

/* ─────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────── */
const ICONS = {
  power:     `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v9" stroke="#cc2222" stroke-width="2.2" stroke-linecap="round"/><path d="M7 6.3A8 8 0 1 0 17 6.3" stroke="#cc2222" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>`,
  menu:      `<svg viewBox="0 0 24 24" fill="white"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>`,
  mute:      `<svg viewBox="0 0 24 24" fill="white"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`,
  up:        `<svg viewBox="0 0 24 24" fill="white"><g transform="scale(1.1)" transform-origin="12 12"><path d="M7 14l5-5 5 5z"/></g></svg>`,
  down:      `<svg viewBox="0 0 24 24" fill="white"><g transform="scale(1.1)" transform-origin="12 12"><path d="M7 10l5 5 5-5z"/></g></svg>`,
  left:      `<svg viewBox="0 0 24 24" fill="white"><g transform="scale(1.1)" transform-origin="12 12"><path d="M15 7l-5 5 5 5z"/></g></svg>`,
  right:     `<svg viewBox="0 0 24 24" fill="white"><g transform="scale(1.1)" transform-origin="12 12"><path d="M9 7l5 5-5 5z"/></g></svg>`,
  back:      `<svg viewBox="0 0 24 24" fill="white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`,
  home:      `<svg viewBox="0 0 24 24" fill="white"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
  playpause: `<svg viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14l11-7-11-7z"/></svg>`,
  volup:     `<svg viewBox="0 0 24 24" fill="white"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`,
  voldown:   `<svg viewBox="0 0 24 24" fill="white"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>`,
  chup:      `<svg viewBox="0 0 24 24" fill="white"><path d="M7 14l5-5 5 5z"/></svg>`,
  chdown:    `<svg viewBox="0 0 24 24" fill="white"><path d="M7 10l5 5 5-5z"/></svg>`,
  cog:       `<svg viewBox="0 0 24 24" fill="white"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54A.484.484 0 0 0 14 3h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.476.476 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`,
};

/* ─────────────────────────────────────────────────────────────
   CARD CLASS
───────────────────────────────────────────────────────────── */
class SamsungSolarRemoteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass = null;
    this._config = {};
  }

  setConfig(config) {
    if (!config.media_player && !config.remote) {
      throw new Error('samsung-solar-remote: Please define media_player or remote entity.');
    }
    this._config = {
      media_player: config.media_player || '',
      remote:       config.remote       || '',
      apps: {
        netflix: config.apps?.netflix !== false,
        youtube: config.apps?.youtube !== false,
        prime:   config.apps?.prime   !== false,
        disney:  config.apps?.disney  !== false,
        plex:    config.apps?.plex    !== false,
        spotify: config.apps?.spotify !== false,
      },
      commands: {
        more:      config.commands?.more      || 'KEY_MORE',
        menu:      config.commands?.menu      || 'KEY_MENU',
        mute:      config.commands?.mute      || 'KEY_MUTE',
        up:        config.commands?.up        || 'KEY_UP',
        down:      config.commands?.down      || 'KEY_DOWN',
        left:      config.commands?.left      || 'KEY_LEFT',
        right:     config.commands?.right     || 'KEY_RIGHT',
        enter:     config.commands?.enter     || 'KEY_ENTER',
        back:      config.commands?.back      || 'KEY_RETURN',
        home:      config.commands?.home      || 'KEY_HOME',
        playpause: config.commands?.playpause || 'KEY_ENTER',
        volup:     config.commands?.volup     || 'KEY_VOLUP',
        voldown:   config.commands?.voldown   || 'KEY_VOLDOWN',
        chup:      config.commands?.chup      || 'KEY_CHUP',
        chdown:    config.commands?.chdown    || 'KEY_CHDOWN',
      },
    };
    this._render();
  }

  set hass(hass) { this._hass = hass; }

  _sendKey(command) {
    if (!this._hass || !this._config.remote) return;
    this._hass.callService('remote', 'send_command', {
      entity_id: this._config.remote,
      command,
    });
  }

  _call(domain, service, data = {}) {
    if (!this._hass) return;
    this._hass.callService(domain, service, data);
  }

  _handleAction(action) {
    const c = this._config.commands;
    const mp = this._config.media_player;
    switch (action) {
      case 'power':
        // Uses media_player.turn_off - same as original YAML
        if (mp) this._call('media_player', 'turn_off', { entity_id: mp });
        else this._sendKey('KEY_POWER');
        break;
      case 'plex':     this._call('shell_command', 'launch_plex');    break;
      case 'spotify':  this._call('shell_command', 'launch_spotify'); break;
      case 'netflix':  this._call('shell_command', 'launch_netflix'); break;
      case 'youtube':  this._call('shell_command', 'launch_youtube'); break;
      case 'prime':    this._call('shell_command', 'launch_prime');   break;
      case 'disney':   this._call('shell_command', 'launch_disney');  break;
      default:
        if (c[action]) this._sendKey(c[action]);
    }
  }

  _render() {
    const cfg = this._config;
    this.shadowRoot.innerHTML = `
      <style>${STYLES}</style>
      <div class="remote">

        <!-- Power -->
        <div class="row">
          <button class="btn-power" data-action="power">${ICONS.power}</button>
          <span></span>
        </div>

        <div class="divider"></div>
 
        <!-- 123 · Menu · Mute -->
        <div class="row">
          <button class="btn-123" data-action="more">
            <svg class="cog" viewBox="0 0 24 24" fill="white" width="13" height="13"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54A.484.484 0 0 0 14 3h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.476.476 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
            <span class="num">123</span>
            <span class="dots">
              <span class="dot" style="background:#ff4d4d"></span>
              <span class="dot" style="background:#4dff4d"></span>
              <span class="dot" style="background:#ffdb4d"></span>
              <span class="dot" style="background:#4d94ff"></span>
            </span>
          </button>
          <button class="btn btn-50 icon-lg" data-action="menu">${ICONS.menu}</button>
          <button class="btn btn-50 icon-lg" data-action="mute">${ICONS.mute}</button>
        </div>

        <div class="divider"></div>

        <!-- D-Pad -->
        <div class="dpad">
          <div class="dpad-ring"></div>
          <button class="dpad-btn dpad-up"    data-action="up">${ICONS.up}</button>
          <button class="dpad-btn dpad-left"  data-action="left">${ICONS.left}</button>
          <button class="dpad-ok"             data-action="enter"></button>
          <button class="dpad-btn dpad-right" data-action="right">${ICONS.right}</button>
          <button class="dpad-btn dpad-down"  data-action="down">${ICONS.down}</button>
        </div>

        <div class="divider"></div>

        <!-- Back · Home · Play/Pause -->
        <div class="row">
          <button class="btn btn-44" data-action="back">${ICONS.back}</button>
          <button class="btn btn-50" data-action="home">${ICONS.home}</button>
          <button class="btn btn-44" data-action="playpause">${ICONS.playpause}</button>
        </div>

        <!-- Vol + Channel -->
        <div class="pill-row">
          <button class="btn-pill" data-action="volup">${ICONS.volup}</button>
          <button class="btn-pill" data-action="chup">${ICONS.chup}</button>
        </div>
        <div class="pill-row">
          <button class="btn-pill" data-action="voldown">${ICONS.voldown}</button>
          <button class="btn-pill" data-action="chdown">${ICONS.chdown}</button>
        </div>

        <div class="divider"></div>

        <!-- Apps -->
        ${(cfg.apps.netflix || cfg.apps.youtube) ? `
        <div class="app-row">
          ${cfg.apps.netflix ? `<button class="btn-app btn-netflix" data-action="netflix"><div class="btn-netflix-logo"></div></button>` : ''}
          ${cfg.apps.youtube ? `<button class="btn-app btn-youtube" data-action="youtube"><div class="btn-youtube-logo"></div></button>` : ''}
        </div>` : ''}

        ${(cfg.apps.prime || cfg.apps.disney) ? `
        <div class="app-row">
          ${cfg.apps.prime  ? `<button class="btn-app btn-prime"  data-action="prime"><div class="btn-prime-logo"></div></button>` : ''}
          ${cfg.apps.disney ? `<button class="btn-app btn-disney" data-action="disney"><div class="btn-disney-logo"></div></button>` : ''}
        </div>` : ''}

        ${(cfg.apps.plex || cfg.apps.spotify) ? `
        <div class="app-row">
          ${cfg.apps.plex  ? `<button class="btn-app btn-plex"  data-action="plex"><div class="btn-plex-logo"></div></button>` : ''}
          ${cfg.apps.spotify ? `<button class="btn-app btn-spotify" data-action="spotify"><div class="btn-spotify-logo"></div></button>` : ''}
        </div>` : ''}
        
      <!-- Samsung wordmark -->
        <div class="samsung-logo"></div>   
      </div>
    `;

    this.shadowRoot.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', () => this._handleAction(el.dataset.action));
    });
  }

  getCardSize() { return 8; }

  static getStubConfig() {
    return {
      media_player: 'media_player.samsung_tv',
      remote: 'remote.samsung_tv',
      spotify: true,
      apps: { netflix: true, youtube: true, prime: true, disney: true },
    };
  }
}

// ATLAS: register only if the separately installed card has not done so already.
if (!customElements.get('samsung-solar-remote-card')) customElements.define('samsung-solar-remote-card', SamsungSolarRemoteCard);

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === 'samsung-solar-remote-card')) window.customCards.push({
  type: 'samsung-solar-remote-card',
  name: 'Samsung Solar Remote Card',
  description: 'A pixel-perfect Samsung SolarCell remote for Home Assistant.',
  preview: true,
  documentationURL: 'https://github.com/robman2026/Samsung-SolarCell-Remote-HA-Card',
});

console.info(
  `%c SAMSUNG-SOLAR-REMOTE %c v${CARD_VERSION} `,
  'background:#1DB954;color:#fff;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:bold',
  'background:#1c1c1c;color:#fff;padding:2px 6px;border-radius:0 4px 4px 0',
);
