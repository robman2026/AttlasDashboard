// src/config/constants.ts
var e = "atlas-home", t = `ll-strategy-dashboard-${e}`, n = "atlas-home-strategy-editor", r = "atlas-view", i = "0.1.0", a = "#56E7C0", o = [
	"#56E7C0",
	"#5EC8FF",
	"#A7A3FF",
	"#FF8FB1"
], s = new URL(
	/* @vite-ignore */
	"./rooms/",
	import.meta.url
).href, c = [
	"living",
	"kitchen",
	"office",
	"kids-room",
	"bedroom",
	"hallway",
	"attic",
	"garage",
	"basement",
	"shelter",
	"server",
	"stairs",
	"door",
	"humidity",
	"eco",
	"settings",
	"system",
	"power",
	"climate",
	"home",
	"rooms",
	"security",
	"energy",
	"light",
	"camera"
], l = (e, t = !1) => {
	t ? history.replaceState(history.state, "", e) : history.pushState(null, "", e), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: t } }));
}, u = (e) => `/${location.pathname.split("/").filter(Boolean)[0] ?? "lovelace"}/${e}`, d = (e) => l(u(e)), f = (e, t, n) => e.dispatchEvent(new CustomEvent(t, {
	detail: n,
	bubbles: !0,
	composed: !0
})), p = (e, t) => f(e, "hass-more-info", { entityId: t }), m = (e, t) => {
	customElements.get(e) || customElements.define(e, t);
}, h = [
	"attic.jpg",
	"backup/attic-lounge.jpg",
	"backup/bedroom.jpg",
	"backup/garden.jpg",
	"backup/kids-room.jpg",
	"backup/office.jpg",
	"backup/shelter.jpg",
	"basement.jpg",
	"bathroom.jpg",
	"bedroom.jpg",
	"entrance.jpg",
	"garage.jpg",
	"garden.jpg",
	"guest-room.jpg",
	"guest-wc.jpg",
	"hallway.jpg",
	"kids-room.jpg",
	"kitchen.jpg",
	"laundry.jpg",
	"living.jpg",
	"office.jpg",
	"server.jpg",
	"shelter.jpg",
	"utility.jpg",
	"workshop.jpg"
], g = (e) => e.rooms ?? [], _ = (e) => (e.energy_meters ?? []).filter((e) => e?.power), v = [
	"power",
	"energy",
	"current",
	"power_factor",
	"voltage",
	"frequency",
	"power_a",
	"power_b",
	"power_c",
	"current_a",
	"current_b",
	"current_c",
	"voltage_a",
	"voltage_b",
	"voltage_c"
], y = (e) => _(e).flatMap((e) => v.map((t) => e[t]).filter((e) => !!e)), b = (e) => e.floors ?? [], x = (e, t) => g(e).find((e) => e.id === t), S = (e, t) => b(e).find((e) => e.id === t), C = (e, t) => g(e).filter((e) => e.floor === t), w = (e) => e && e.show_camera !== !1 && e.camera || void 0, T = (e, t) => {
	let n = /* @__PURE__ */ new Map();
	for (let r of C(e, t)) {
		let e = w(r);
		e && n.set(e, [...n.get(e) ?? [], r]);
	}
	return [...n].map(([e, t]) => ({
		camera: e,
		rooms: t
	}));
}, E = (e, t) => g(e).find((e) => e.temperature === t || e.humidity === t || w(e) === t || (e.devices ?? []).some((e) => e.entity === t)), ee = (e, t) => {
	for (let n of g(e)) {
		let e = (n.devices ?? []).find((e) => e.entity === t);
		if (e?.name) return e.name;
	}
}, te = (e, t) => {
	if (!t) return;
	if (t.image) return t.image === "none" ? void 0 : t.image;
	if (e.appearance?.image_path) return;
	let n = `${t.id.replace(/_/g, "-")}.jpg`;
	return h.includes(n) ? n : void 0;
}, ne = (e, t) => {
	if (!t) return;
	if (/^(https?:)?\/\//.test(t) || t.startsWith("/")) return t;
	let n = e.appearance?.image_path || s;
	return n.endsWith("/") || (n += "/"), n + t;
}, re = (e, t) => ne(e, te(e, t)), ie = (e) => {
	let t = e.appearance?.accent ?? "";
	return /^#[0-9a-fA-F]{6}$/.test(t) ? t : a;
}, ae = (e) => {
	let t = /* @__PURE__ */ new Set(), n = (e) => e && t.add(e), r = e.entities ?? {};
	[
		r.alarm,
		r.weather,
		r.outdoor_temperature,
		r.heat_pump,
		r.heat_pump_outdoor,
		r.heat_pump_supply,
		r.heat_pump_return,
		r.solar_power,
		r.house_load,
		r.grid_import,
		r.grid_export,
		r.incidents,
		r.wake_pc,
		r.garage_cover
	].forEach(n);
	for (let t of g(e)) n(t.temperature), n(t.humidity), n(w(t)), (t.devices ?? []).forEach((e) => n(e.entity));
	return [...t];
}, oe = (e) => {
	let t = /* @__PURE__ */ new Map();
	for (let n of g(e)) {
		let e = w(n);
		e && t.set(e, [...t.get(e) ?? [], n]);
	}
	return [...t].map(([e, t]) => ({
		camera: e,
		rooms: t
	}));
}, se = (e) => !!e.entities?.alarm || !!e.alerts?.exterior_doors?.length || !!e.alerts?.interior_doors?.length || oe(e).length > 0 || g(e).some((e) => !!e.car_lock || (e.devices ?? []).some((e) => [
	"binary_sensor",
	"cover",
	"lock"
].includes(e.entity.split(".")[0]))), ce = (e) => [...new Set(g(e).flatMap((t) => le(e, t)))], le = (e, t) => {
	if (!t) return [];
	if (t.light_entities?.length) return t.light_entities;
	let n = new Set(e.entities?.exclude_lights ?? []);
	return (t.devices ?? []).map((e) => e.entity).filter((e) => e.startsWith("light.") && !n.has(e));
}, ue = (e, t) => {
	let n = 0, r = 0;
	for (let i of t) {
		let t = e.states[i];
		if (t?.state !== "on") continue;
		n++;
		let a = t.attributes.brightness;
		r += typeof a == "number" ? Math.max(.05, Math.min(1, a / 255)) : 1;
	}
	return {
		on: n,
		total: t.length,
		level: t.length ? r / t.length : 0,
		brightness: n ? Math.round(r / n * 100) : 0
	};
}, de = (e) => e.solar?.power || e.entities?.solar_power, fe = (e) => !!de(e) || !!e.solar?.production_today, pe = (e) => e.heat_pump?.climate || e.entities?.heat_pump, me = (e) => !!pe(e) || !!e.heat_pump?.status || !!e.heat_pump?.gauges?.length || !!e.heat_pump?.energy_produced, he, D = (e, t, n = {}) => ({
	type: `custom:${r}`,
	view: t,
	...n,
	atlas: e
}), ge = class extends HTMLElement {
	static getConfigElement() {
		return document.createElement(n);
	}
	static getCreateSuggestions() {
		return {
			title: "ATLAS Home",
			icon: "mdi:home-variant-outline"
		};
	}
	static async generate(e) {
		let t = b(e)[0]?.id, n = {
			subview: !0,
			back_path: "home"
		}, r = [
			{
				title: "Home",
				path: "home",
				icon: "mdi:home-variant-outline",
				type: "panel",
				cards: [D(e, "home")]
			},
			{
				title: "Alerts",
				path: "alerts",
				type: "panel",
				...n,
				cards: [D(e, "alerts")]
			},
			{
				title: "Rooms",
				path: "rooms",
				type: "panel",
				...n,
				cards: [D(e, "rooms", { floor: t })]
			}
		];
		r.push({
			title: "System",
			path: "system",
			type: "panel",
			...n,
			cards: [D(e, "system")]
		}), fe(e) && r.push({
			title: e.solar?.name || "Solar",
			path: "solar",
			type: "panel",
			...n,
			cards: [D(e, "solar")]
		}), me(e) && r.push({
			title: e.heat_pump?.name || "Heat pump",
			path: "heatpump",
			type: "panel",
			...n,
			cards: [D(e, "heatpump")]
		}), se(e) && r.push({
			title: "Security",
			path: "security",
			type: "panel",
			...n,
			cards: [D(e, "security")]
		}), ce(e).length && r.push({
			title: "Lights",
			path: "lights",
			type: "panel",
			...n,
			cards: [D(e, "lights")]
		}), _(e).length && r.push({
			title: "Energy",
			path: "energy",
			type: "panel",
			...n,
			cards: [D(e, "energy")]
		});
		for (let t of b(e)) r.push({
			title: t.name,
			path: `floor-${t.id}`,
			type: "panel",
			...n,
			cards: [D(e, "rooms", { floor: t.id })]
		});
		for (let t of g(e)) r.push({
			title: t.name,
			path: `room-${t.id}`,
			type: "panel",
			...n,
			cards: [D(e, "room", { room: t.id })]
		});
		return {
			title: "ATLAS Home",
			views: r
		};
	}
};
he = ge, he.registryDependencies = [], he.configRequired = !0;
// node_modules/@lit/reactive-element/css-tag.js
var _e = globalThis, ve = _e.ShadowRoot && (_e.ShadyCSS === void 0 || _e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ye = Symbol(), be = /* @__PURE__ */ new WeakMap(), xe = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== ye) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (ve && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = be.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && be.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, Se = (e) => new xe(typeof e == "string" ? e : e + "", void 0, ye), Ce = (e, ...t) => new xe(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, ye), we = (e, t) => {
	if (ve) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), r = _e.litNonce;
		r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
	}
}, Te = ve ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return Se(t);
})(e) : e, { is: Ee, defineProperty: De, getOwnPropertyDescriptor: Oe, getOwnPropertyNames: ke, getOwnPropertySymbols: Ae, getPrototypeOf: je } = Object, Me = globalThis, Ne = Me.trustedTypes, Pe = Ne ? Ne.emptyScript : "", Fe = Me.reactiveElementPolyfillSupport, Ie = (e, t) => e, Le = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? Pe : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, Re = (e, t) => !Ee(e, t), ze = {
	attribute: !0,
	type: String,
	converter: Le,
	reflect: !1,
	useDefault: !1,
	hasChanged: Re
};
Symbol.metadata ??= Symbol("metadata"), Me.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var Be = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ze) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && De(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = Oe(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? ze;
	}
	static _$Ei() {
		if (this.hasOwnProperty(Ie("elementProperties"))) return;
		let e = je(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(Ie("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ie("properties"))) {
			let e = this.properties, t = [...ke(e), ...Ae(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(Te(e));
		} else e !== void 0 && t.push(Te(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return we(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? Le : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? Le : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? Re)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
Be.elementStyles = [], Be.shadowRootOptions = { mode: "open" }, Be[Ie("elementProperties")] = /* @__PURE__ */ new Map(), Be[Ie("finalized")] = /* @__PURE__ */ new Map(), Fe?.({ ReactiveElement: Be }), (Me.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var Ve = globalThis, He = (e) => e, Ue = Ve.trustedTypes, We = Ue ? Ue.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Ge = "$lit$", O = `lit$${Math.random().toFixed(9).slice(2)}$`, Ke = "?" + O, qe = `<${Ke}>`, Je = document, Ye = () => Je.createComment(""), Xe = (e) => e === null || typeof e != "object" && typeof e != "function", Ze = Array.isArray, Qe = (e) => Ze(e) || typeof e?.[Symbol.iterator] == "function", $e = "[ 	\n\f\r]", et = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, tt = /-->/g, nt = />/g, rt = RegExp(`>|${$e}(?:([^\\s"'>=/]+)(${$e}*=${$e}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), it = /'/g, at = /"/g, ot = /^(?:script|style|textarea|title)$/i, st = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), k = st(1), A = st(2), ct = Symbol.for("lit-noChange"), j = Symbol.for("lit-nothing"), lt = /* @__PURE__ */ new WeakMap(), ut = Je.createTreeWalker(Je, 129);
function dt(e, t) {
	if (!Ze(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return We === void 0 ? t : We.createHTML(t);
}
var ft = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = et;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === et ? c[1] === "!--" ? o = tt : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = rt) : (ot.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = rt) : o = nt : o === rt ? c[0] === ">" ? (o = i ?? et, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? rt : c[3] === "\"" ? at : it) : o === at || o === it ? o = rt : o === tt || o === nt ? o = et : (o = rt, i = void 0);
		let d = o === rt && e[t + 1].startsWith("/>") ? " " : "";
		a += o === et ? n + qe : l >= 0 ? (r.push(s), n.slice(0, l) + Ge + n.slice(l) + O + d) : n + O + (l === -2 ? t : d);
	}
	return [dt(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, pt = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ft(t, n);
		if (this.el = e.createElement(l, r), ut.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = ut.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(Ge)) {
					let t = u[o++], n = i.getAttribute(e).split(O), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? vt : r[1] === "?" ? yt : r[1] === "@" ? bt : _t
					}), i.removeAttribute(e);
				} else e.startsWith(O) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ot.test(i.tagName)) {
					let e = i.textContent.split(O), t = e.length - 1;
					if (t > 0) {
						i.textContent = Ue ? Ue.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], Ye()), ut.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], Ye());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === Ke) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(O, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += O.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = Je.createElement("template");
		return n.innerHTML = e, n;
	}
};
function mt(e, t, n = e, r) {
	if (t === ct) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = Xe(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = mt(e, i._$AS(e, t.values), i, r)), t;
}
var ht = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? Je).importNode(t, !0);
		ut.currentNode = r;
		let i = ut.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new gt(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new xt(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = ut.nextNode(), a++);
		}
		return ut.currentNode = Je, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, gt = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = j, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = mt(this, e, t), Xe(e) ? e === j || e == null || e === "" ? (this._$AH !== j && this._$AR(), this._$AH = j) : e !== this._$AH && e !== ct && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? Qe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== j && Xe(this._$AH) ? this._$AA.nextSibling.data = e : this.T(Je.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = pt.createElement(dt(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new ht(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = lt.get(e.strings);
		return t === void 0 && lt.set(e.strings, t = new pt(e)), t;
	}
	k(t) {
		Ze(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(Ye()), this.O(Ye()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = He(e).nextSibling;
			He(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, _t = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = j, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = j;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = mt(this, e, t, 0), a = !Xe(e) || e !== this._$AH && e !== ct, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = mt(this, r[n + o], t, o), s === ct && (s = this._$AH[o]), a ||= !Xe(s) || s !== this._$AH[o], s === j ? e = j : e !== j && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === j ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, vt = class extends _t {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === j ? void 0 : e;
	}
}, yt = class extends _t {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== j);
	}
}, bt = class extends _t {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = mt(this, e, t, 0) ?? j) === ct) return;
		let n = this._$AH, r = e === j && n !== j || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== j && (n === j || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, xt = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		mt(this, e);
	}
}, St = Ve.litHtmlPolyfillSupport;
St?.(pt, gt), (Ve.litHtmlVersions ??= []).push("3.3.3");
var Ct = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new gt(t.insertBefore(Ye(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, wt = globalThis, M = class extends Be {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ct(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return ct;
	}
};
M._$litElement$ = !0, M.finalized = !0, wt.litElementHydrateSupport?.({ LitElement: M });
var Tt = wt.litElementPolyfillSupport;
Tt?.({ LitElement: M }), (wt.litElementVersions ??= []).push("4.2.2");
// src/config/preset-demo.ts
var Et = {
	appearance: {
		accent: "#56E7C0",
		variant: "warm_glass",
		ambience: "graphite",
		background: "living"
	},
	entities: {
		alarm: "alarm_control_panel.home_alarm",
		weather: "weather.home",
		outdoor_temperature: "sensor.outdoor_temperature",
		heat_pump: "climate.heat_pump",
		heat_pump_outdoor: "sensor.heat_pump_outdoor_temperature",
		heat_pump_supply: "sensor.heat_pump_supply_temperature",
		heat_pump_return: "sensor.heat_pump_return_temperature",
		solar_power: "sensor.solar_power",
		house_load: "sensor.house_power",
		grid_import: "sensor.grid_import_power",
		grid_export: "sensor.grid_export_power",
		incidents: "sensor.incident_report",
		wake_pc: "input_button.wake_pc",
		garage_cover: "cover.garage_door",
		persons: ["person.alex", "person.sam"],
		exclude_lights: ["light.attic_camera_status_led", "light.garage_camera_status_led"]
	},
	alerts: {
		temperature_rules: [{
			entity: "sensor.server_room_temperature",
			above: 32,
			clear_below: 30,
			label: "Server room"
		}],
		exterior_doors: [
			"binary_sensor.basement_door",
			"binary_sensor.front_door",
			"cover.garage_door"
		],
		interior_doors: ["binary_sensor.office_door", "binary_sensor.bathroom_door"],
		critical: [],
		mailbox: "binary_sensor.mailbox",
		rain_windows: [
			"binary_sensor.attic_window",
			"binary_sensor.kitchen_window",
			"binary_sensor.bathroom_skylight",
			"binary_sensor.hallway_skylight"
		],
		updates: !0,
		data_quality: !0
	},
	floors: [
		{
			id: "attic",
			level: "+2",
			name: "Attic",
			cameras: "live"
		},
		{
			id: "first",
			level: "+1",
			name: "First floor"
		},
		{
			id: "ground",
			level: "0",
			name: "Ground floor"
		},
		{
			id: "basement",
			level: "-1",
			name: "Basement",
			cameras: "live"
		}
	],
	rooms: [
		{
			id: "attic",
			name: "Attic",
			floor: "attic",
			icon: "attic",
			image: "attic.jpg",
			temperature: "sensor.attic_temperature",
			humidity: "sensor.attic_humidity",
			camera: "camera.attic",
			devices: [
				{
					entity: "binary_sensor.attic_window",
					name: "Window"
				},
				{
					entity: "binary_sensor.attic_motion",
					name: "Motion"
				},
				{
					entity: "light.attic_ceiling",
					name: "Ceiling light"
				}
			]
		},
		{
			id: "kids_room",
			name: "Kids room",
			floor: "first",
			icon: "kids-room",
			image: "backup/kids-room.jpg",
			temperature: "sensor.kids_room_temperature",
			humidity: "sensor.kids_room_humidity",
			camera: "camera.kids_room",
			camera_private: !0,
			devices: [
				{
					entity: "binary_sensor.kids_room_window_left",
					name: "Window left"
				},
				{
					entity: "binary_sensor.kids_room_window_right",
					name: "Window right"
				},
				{
					entity: "binary_sensor.kids_room_motion",
					name: "Motion"
				},
				{
					entity: "light.kids_room_fan_light",
					name: "Fan light"
				},
				{
					entity: "fan.kids_room_fan",
					name: "Ceiling fan"
				}
			]
		},
		{
			id: "office",
			name: "Office",
			floor: "first",
			icon: "office",
			image: "office.jpg",
			temperature: "sensor.office_temperature",
			humidity: "sensor.office_humidity",
			light_entities: ["switch.office_ceiling_relay", "light.office_fan_light"],
			devices: [
				{
					entity: "binary_sensor.office_door",
					name: "Door"
				},
				{
					entity: "binary_sensor.office_window",
					name: "Window"
				},
				{
					entity: "switch.office_ceiling_relay",
					name: "Ceiling lamp"
				},
				{
					entity: "light.office_fan_light",
					name: "Fan light"
				},
				{
					entity: "fan.office_fan",
					name: "Ceiling fan"
				}
			]
		},
		{
			id: "bedroom",
			name: "Bedroom",
			floor: "first",
			icon: "bedroom",
			image: "bedroom.jpg",
			show_camera: !1,
			side_cards: [{
				type: "media-control",
				entity: "media_player.bedroom_tv"
			}],
			temperature: "sensor.bedroom_temperature",
			humidity: "sensor.bedroom_humidity",
			devices: [
				{
					entity: "light.bedroom_canopy",
					name: "Canopy LEDs"
				},
				{
					entity: "light.bedroom_wardrobe",
					name: "Wardrobe LEDs"
				},
				{
					entity: "fan.bedroom_ceiling_fan",
					name: "Ceiling fan"
				},
				{
					entity: "media_player.bedroom_tv",
					name: "TV"
				}
			]
		},
		{
			id: "hallway",
			name: "Upstairs hall",
			floor: "first",
			icon: "hallway",
			image: "hallway.jpg",
			temperature: "sensor.hallway_temperature",
			humidity: "sensor.hallway_humidity",
			devices: [
				{
					entity: "binary_sensor.hallway_motion",
					name: "Motion"
				},
				{
					entity: "binary_sensor.stair_window",
					name: "Stair window"
				},
				{
					entity: "binary_sensor.hallway_skylight",
					name: "Skylight"
				}
			]
		},
		{
			id: "bathroom",
			name: "Bathroom",
			floor: "first",
			icon: "humidity",
			image: "bathroom.jpg",
			devices: [
				{
					entity: "binary_sensor.bathroom_door",
					name: "Door"
				},
				{
					entity: "binary_sensor.bathroom_motion",
					name: "Motion"
				},
				{
					entity: "binary_sensor.bathroom_skylight",
					name: "Skylight"
				}
			]
		},
		{
			id: "guest_room",
			name: "Guest room",
			floor: "first",
			icon: "bedroom",
			temperature: "sensor.guest_room_temperature",
			humidity: "sensor.guest_room_humidity",
			devices: [{
				entity: "binary_sensor.guest_room_window",
				name: "Window"
			}]
		},
		{
			id: "living",
			name: "Living room",
			floor: "ground",
			icon: "living",
			image: "living.jpg",
			temperature: "sensor.living_room_temperature",
			humidity: "sensor.living_room_humidity",
			camera: "camera.living_room",
			side_cards: [{
				type: "custom:samsung-solar-remote-card",
				media_player: "media_player.living_room_tv",
				remote: "remote.living_room_tv",
				spotify: !0,
				apps: {
					netflix: !0,
					youtube: !0,
					prime: !0,
					disney: !0
				}
			}],
			devices: [
				{
					entity: "binary_sensor.living_room_window_left",
					name: "Window left"
				},
				{
					entity: "binary_sensor.living_room_window_right",
					name: "Window right"
				},
				{
					entity: "binary_sensor.living_room_presence",
					name: "Presence"
				},
				{
					entity: "light.tv_backlight",
					name: "TV backlight"
				},
				{
					entity: "media_player.living_room_tv",
					name: "TV"
				}
			]
		},
		{
			id: "kitchen",
			name: "Kitchen",
			floor: "ground",
			icon: "kitchen",
			image: "kitchen.jpg",
			power: "sensor.circuit_kitchen_power",
			power_energy: "sensor.circuit_kitchen_energy",
			power_current: "sensor.circuit_kitchen_current",
			power_max: 3e3,
			devices: [
				{
					entity: "light.kitchen_cabinet_left",
					name: "Cabinet light left"
				},
				{
					entity: "light.kitchen_cabinet_right",
					name: "Cabinet light right"
				},
				{
					entity: "binary_sensor.kitchen_presence",
					name: "Presence"
				},
				{
					entity: "binary_sensor.kitchen_window",
					name: "Window"
				}
			],
			appliances: [{
				name: "Oven",
				entity: "switch.oven_power",
				temperature: "sensor.oven_temperature",
				temperature_max: 300,
				setpoint: "number.oven_setpoint",
				operation: "sensor.oven_operation_state",
				program: "select.oven_program",
				door: "binary_sensor.oven_door",
				progress: "sensor.oven_program_progress",
				finish: "sensor.oven_finish_time",
				controls: ["switch.oven_fast_preheat", "button.oven_pause"],
				stop: "button.oven_stop"
			}, {
				name: "Dishwasher",
				icon: "mdi:dishwasher",
				entity: "switch.dishwasher_power",
				operation: "sensor.dishwasher_operation_state",
				program: "select.dishwasher_program",
				door: "binary_sensor.dishwasher_door",
				progress: "sensor.dishwasher_program_progress",
				finish: "sensor.dishwasher_finish_time",
				remote: "binary_sensor.dishwasher_remote_start",
				controls: ["switch.dishwasher_extra_dry"],
				stop: "button.dishwasher_stop"
			}]
		},
		{
			id: "entrance",
			name: "Entrance",
			floor: "ground",
			icon: "door",
			image: "entrance.jpg",
			camera: "camera.doorbell",
			devices: [
				{
					entity: "binary_sensor.front_door",
					name: "Front door"
				},
				{
					entity: "lock.front_door",
					name: "Front door lock"
				},
				{
					entity: "binary_sensor.mailbox",
					name: "Mailbox"
				},
				{
					entity: "binary_sensor.doorbell_person",
					name: "Doorbell person"
				},
				{
					entity: "binary_sensor.entrance_motion",
					name: "Motion"
				}
			]
		},
		{
			id: "guest_wc",
			name: "Guest WC",
			floor: "ground",
			icon: "humidity",
			image: "guest-wc.jpg",
			devices: [
				{
					entity: "binary_sensor.guest_wc_door",
					name: "Door"
				},
				{
					entity: "binary_sensor.guest_wc_motion",
					name: "Motion"
				},
				{
					entity: "light.guest_wc_mirror",
					name: "Mirror light"
				}
			]
		},
		{
			id: "garage",
			name: "Garage",
			floor: "ground",
			icon: "garage",
			image: "garage.jpg",
			temperature: "sensor.garage_temperature",
			humidity: "sensor.garage_humidity",
			camera: "camera.garage",
			car_name: "Family car",
			car_subtitle: "Electric hatchback",
			car_lock: "lock.family_car",
			car_range: "sensor.family_car_range",
			car_odometer: "sensor.family_car_odometer",
			car_location: "device_tracker.family_car",
			car_daily_distance: "sensor.family_car_distance_today",
			car_daily_trips: "sensor.family_car_trips_today",
			car_monthly_distance: "sensor.family_car_distance_month",
			car_monthly_trips: "sensor.family_car_trips_month",
			car_last_updated: "sensor.family_car_last_update",
			car_flash: "button.family_car_flash_lights",
			car_horn: "button.family_car_honk",
			car_refresh: "button.family_car_update_data",
			devices: [
				{
					entity: "cover.garage_door",
					name: "Garage door"
				},
				{
					entity: "binary_sensor.garage_side_door",
					name: "Side door"
				},
				{
					entity: "binary_sensor.garage_window",
					name: "Window"
				},
				{
					entity: "binary_sensor.garage_motion",
					name: "Motion"
				}
			]
		},
		{
			id: "garden",
			name: "Garden",
			floor: "ground",
			icon: "eco",
			mower: "lawn_mower.garden_mower",
			mower_battery: "sensor.garden_mower_battery",
			mower_name: "Mower",
			devices: [{
				entity: "binary_sensor.garden_door",
				name: "Garden door"
			}, {
				entity: "switch.garden_irrigation",
				name: "Irrigation valve"
			}]
		},
		{
			id: "basement",
			name: "Basement",
			floor: "basement",
			icon: "basement",
			image: "basement.jpg",
			temperature: "sensor.basement_temperature",
			humidity: "sensor.basement_humidity",
			camera: "camera.basement",
			devices: [
				{
					entity: "binary_sensor.basement_door",
					name: "Door"
				},
				{
					entity: "binary_sensor.basement_hall_motion",
					name: "Hall motion"
				},
				{
					entity: "binary_sensor.basement_stairs_motion",
					name: "Stairs motion"
				},
				{
					entity: "media_player.basement_tv",
					name: "TV"
				}
			]
		},
		{
			id: "shelter",
			name: "Shelter",
			floor: "basement",
			icon: "shelter",
			image: "backup/shelter.jpg",
			temperature: "sensor.shelter_temperature",
			humidity: "sensor.shelter_humidity",
			devices: []
		},
		{
			id: "server",
			name: "Server room",
			floor: "basement",
			icon: "server",
			image: "server.jpg",
			temperature: "sensor.server_room_temperature",
			humidity: "sensor.server_room_humidity",
			camera: "camera.server_room",
			devices: [{
				entity: "switch.server_rack_power",
				name: "Rack power",
				confirm: !0
			}, {
				entity: "button.router_restart",
				name: "Restart router",
				tap: "press",
				confirm: !0
			}]
		},
		{
			id: "workshop",
			name: "Workshop",
			floor: "basement",
			icon: "settings",
			image: "workshop.jpg",
			camera: "camera.workshop",
			temperature: "sensor.workshop_temperature",
			humidity: "sensor.workshop_humidity",
			climate_extra: [{
				entity: "sensor.workshop_co2",
				name: "CO2"
			}, {
				entity: "sensor.workshop_pressure",
				name: "Pressure"
			}],
			automations: [
				"automation.workshop_eco_mode",
				"automation.print_complete_notify",
				"automation.workshop_door_alarm"
			],
			printer_name: "3D printer",
			printer_status: "sensor.3d_printer_status",
			printer_progress: "sensor.3d_printer_progress",
			printer_remaining: "sensor.3d_printer_remaining_time",
			printer_nozzle: "sensor.3d_printer_nozzle_temperature",
			printer_bed: "sensor.3d_printer_bed_temperature",
			printer_chamber: "sensor.3d_printer_chamber_temperature",
			printer_light: "light.3d_printer_chamber",
			printer_pause: "button.3d_printer_pause",
			printer_resume: "button.3d_printer_resume",
			printer_stop: "button.3d_printer_stop",
			printer_picture: "image.3d_printer_cover",
			devices: [
				{
					entity: "sensor.3d_printer_status",
					name: "3D printer"
				},
				{
					entity: "sensor.3d_printer_progress",
					name: "Print progress"
				},
				{
					entity: "light.3d_printer_chamber",
					name: "Chamber light"
				},
				{
					entity: "binary_sensor.workshop_presence",
					name: "Presence"
				}
			]
		},
		{
			id: "utility",
			name: "Utility room",
			floor: "basement",
			icon: "system",
			image: "utility.jpg",
			camera: "camera.utility_room",
			salt_level: "sensor.water_softener_salt",
			salt_distance: "sensor.water_softener_salt_distance",
			devices: [{
				entity: "binary_sensor.utility_room_door",
				name: "Door"
			}, {
				entity: "climate.heat_pump",
				name: "Heat pump"
			}]
		},
		{
			id: "laundry",
			name: "Laundry",
			floor: "basement",
			icon: "power",
			image: "laundry.jpg",
			camera: "camera.workshop",
			cards: [{
				type: "custom:samsung-laundry-card",
				brand: "generic",
				show_washer: !0,
				show_dryer: !0,
				washer_label: "Washer",
				dryer_label: "Dryer",
				washer_machine_state: "sensor.washer_state",
				washer_completion_time: "sensor.washer_completion_time",
				washer_current_course: "sensor.washer_program",
				washer_power: "sensor.washer_power",
				dryer_machine_state: "sensor.dryer_state",
				dryer_completion_time: "sensor.dryer_completion_time",
				dryer_current_course: "sensor.dryer_program",
				dryer_power: "sensor.dryer_power"
			}],
			devices: [{
				entity: "sensor.washer_power",
				name: "Washer"
			}, {
				entity: "sensor.dryer_power",
				name: "Dryer"
			}]
		}
	],
	layout: {
		home_tiles: [
			"living",
			"office",
			"kids_room",
			"bedroom",
			"hallway",
			"basement",
			"garage",
			"server"
		],
		top_tabs: [
			"living",
			"kitchen",
			"bedroom",
			"office",
			"kids_room",
			"garage"
		],
		security_tiles: ["entrance", "garage"],
		home_cards: [{
			type: "markdown",
			content: "**Own cards** appear here. Edit dashboard > Layout > Own cards on Home."
		}],
		system_cards: [{
			type: "history-graph",
			title: "Server room temperature",
			hours_to_show: 24,
			entities: ["sensor.server_room_temperature"]
		}]
	},
	solar: {
		peak_power: 6,
		battery_soc: "sensor.home_battery_soc",
		battery_power: "sensor.home_battery_power",
		production_today: "sensor.solar_production_today",
		consumption_today: "sensor.house_consumption_today",
		export_today: "sensor.grid_export_today",
		import_today: "sensor.grid_import_today",
		forecast_today: "sensor.solar_forecast_today",
		remaining_today: "sensor.solar_forecast_remaining",
		strings: [{
			name: "PV1 (south roof)",
			power: "sensor.pv1_power",
			voltage: "sensor.pv1_voltage",
			current: "sensor.pv1_current"
		}, {
			name: "PV2 (west roof)",
			power: "sensor.pv2_power",
			voltage: "sensor.pv2_voltage",
			current: "sensor.pv2_current"
		}],
		inverter: [
			{
				entity: "sensor.inverter_status",
				name: "Status"
			},
			{
				entity: "sensor.inverter_temperature",
				name: "Temperature"
			},
			{
				entity: "sensor.inverter_grid_frequency",
				name: "Grid frequency"
			}
		]
	},
	heat_pump: {
		status: "sensor.heat_pump_compressor",
		priority: "sensor.heat_pump_priority",
		mode: "select.heat_pump_mode",
		connection: "sensor.heat_pump_connection",
		degree_minutes: "sensor.heat_pump_degree_minutes",
		gauges: [
			{
				entity: "sensor.heat_pump_supply_temperature",
				name: "Supply"
			},
			{
				entity: "sensor.heat_pump_return_temperature",
				name: "Return"
			},
			{
				entity: "sensor.heat_pump_outdoor_temperature",
				name: "Outdoor"
			},
			{
				entity: "sensor.heat_pump_discharge_temperature",
				name: "Discharge"
			}
		],
		energy_produced: "sensor.heat_pump_energy_produced",
		energy_consumed: "sensor.heat_pump_energy_consumed",
		power: "sensor.heat_pump_power",
		energy: [{
			entity: "sensor.heat_pump_hot_water_energy",
			name: "Hot water produced"
		}],
		pressures: [{
			entity: "sensor.heat_pump_high_pressure",
			name: "High pressure"
		}, {
			entity: "sensor.heat_pump_low_pressure",
			name: "Low pressure"
		}],
		circuit: [
			{
				entity: "sensor.heat_pump_evaporator",
				name: "Evaporator"
			},
			{
				entity: "sensor.heat_pump_suction_gas",
				name: "Suction gas"
			},
			{
				entity: "sensor.heat_pump_compressor_frequency",
				name: "Compressor frequency"
			}
		],
		runtimes: [
			{
				entity: "sensor.heat_pump_runtime_heating",
				name: "Compressor, heating"
			},
			{
				entity: "sensor.heat_pump_runtime_hot_water",
				name: "Compressor, hot water"
			},
			{
				entity: "sensor.heat_pump_compressor_starts",
				name: "Compressor starts"
			}
		]
	},
	energy_meters: [
		{
			name: "Whole house",
			main: !0,
			max_power: 11e3,
			power: "sensor.main_meter_power",
			energy: "sensor.main_meter_energy",
			current: "sensor.main_meter_current",
			power_factor: "sensor.main_meter_power_factor",
			frequency: "sensor.main_meter_frequency",
			power_a: "sensor.main_meter_power_a",
			power_b: "sensor.main_meter_power_b",
			power_c: "sensor.main_meter_power_c",
			current_a: "sensor.main_meter_current_a",
			current_b: "sensor.main_meter_current_b",
			current_c: "sensor.main_meter_current_c",
			voltage_a: "sensor.main_meter_voltage_a",
			voltage_b: "sensor.main_meter_voltage_b",
			voltage_c: "sensor.main_meter_voltage_c"
		},
		{
			name: "Kitchen",
			power: "sensor.circuit_kitchen_power",
			energy: "sensor.circuit_kitchen_energy",
			current: "sensor.circuit_kitchen_current",
			power_factor: "sensor.circuit_kitchen_power_factor",
			voltage: "sensor.circuit_kitchen_voltage",
			frequency: "sensor.circuit_kitchen_frequency",
			max_power: 3e3
		},
		{
			name: "Living & hallway",
			power: "sensor.circuit_living_power",
			energy: "sensor.circuit_living_energy",
			current: "sensor.circuit_living_current",
			power_factor: "sensor.circuit_living_power_factor",
			voltage: "sensor.circuit_living_voltage",
			frequency: "sensor.circuit_living_frequency",
			max_power: 2500
		},
		{
			name: "Office",
			power: "sensor.circuit_office_power",
			energy: "sensor.circuit_office_energy",
			current: "sensor.circuit_office_current",
			power_factor: "sensor.circuit_office_power_factor",
			voltage: "sensor.circuit_office_voltage",
			frequency: "sensor.circuit_office_frequency",
			max_power: 2e3
		},
		{
			name: "Server rack",
			power: "sensor.circuit_server_power",
			energy: "sensor.circuit_server_energy",
			current: "sensor.circuit_server_current",
			power_factor: "sensor.circuit_server_power_factor",
			voltage: "sensor.circuit_server_voltage",
			frequency: "sensor.circuit_server_frequency",
			max_power: 500
		},
		{
			name: "Laundry",
			power: "sensor.circuit_laundry_power",
			energy: "sensor.circuit_laundry_energy",
			current: "sensor.circuit_laundry_current",
			power_factor: "sensor.circuit_laundry_power_factor",
			voltage: "sensor.circuit_laundry_voltage",
			frequency: "sensor.circuit_laundry_frequency",
			max_power: 3e3
		},
		{
			name: "Heating pump",
			power: "sensor.circuit_heating_power",
			energy: "sensor.circuit_heating_energy",
			current: "sensor.circuit_heating_current",
			power_factor: "sensor.circuit_heating_power_factor",
			voltage: "sensor.circuit_heating_voltage",
			frequency: "sensor.circuit_heating_frequency",
			max_power: 2e3
		},
		{
			name: "Oven & cooktop",
			power: "sensor.circuit_cooking_power",
			energy: "sensor.circuit_cooking_energy",
			power_factor: "sensor.circuit_cooking_power_factor",
			frequency: "sensor.circuit_cooking_frequency",
			max_power: 7e3,
			power_a: "sensor.circuit_cooking_power_a",
			power_b: "sensor.circuit_cooking_power_b",
			power_c: "sensor.circuit_cooking_power_c",
			current_a: "sensor.circuit_cooking_current_a",
			current_b: "sensor.circuit_cooking_current_b",
			current_c: "sensor.circuit_cooking_current_c",
			voltage_a: "sensor.circuit_cooking_voltage_a",
			voltage_b: "sensor.circuit_cooking_voltage_b",
			voltage_c: "sensor.circuit_cooking_voltage_c"
		},
		{
			name: "Attic",
			power: "sensor.circuit_attic_power",
			energy: "sensor.circuit_attic_energy",
			current: "sensor.circuit_attic_current",
			power_factor: "sensor.circuit_attic_power_factor",
			voltage: "sensor.circuit_attic_voltage",
			frequency: "sensor.circuit_attic_frequency",
			max_power: 500
		}
	]
}, N = (e, t = !1) => ({ entity: {
	...e ? { domain: e } : {},
	...t ? { multiple: !0 } : {}
} }), P = { text: {} }, F = { boolean: {} }, I = (e, t = {}) => ({ select: {
	mode: "dropdown",
	options: e,
	...t
} }), Dt = (e) => Array.isArray(e) ? e.join(", ") : e, L = [
	{
		name: "entity",
		label: "Entity",
		type: "entity (any)",
		required: !0,
		selector: N()
	},
	{
		name: "name",
		label: "Name",
		type: "text",
		help: "Label on the tile. Default: the entity's friendly name.",
		selector: P
	},
	{
		name: "icon",
		label: "Icon override",
		type: "mdi icon",
		help: "Optional, e.g. mdi:lamp. Default: chosen from the entity's domain and device class.",
		selector: { icon: {} }
	}
], Ot = [
	...L,
	{
		name: "tap",
		label: "Tap action",
		type: "toggle | more-info | press",
		default: "toggle for light, switch, fan, input_boolean; more-info otherwise",
		help: "press: presses a button or input_button, or runs a script. Hold or right click always opens the details. Covers ignore this and show Open / Stop / Close buttons.",
		selector: I([
			{
				value: "toggle",
				label: "Toggle"
			},
			{
				value: "more-info",
				label: "Open details"
			},
			{
				value: "press",
				label: "Press button / run script"
			}
		])
	},
	{
		name: "confirm",
		label: "Ask before acting",
		type: "boolean",
		default: "false (true for covers with device class garage or gate)",
		help: "Asks for confirmation before the tap action, and before Open / Close on a cover (Stop never asks). Use it for plugs that power servers or network gear.",
		selector: F
	}
], kt = [
	{
		name: "name",
		label: "Name",
		type: "text",
		required: !0,
		selector: P
	},
	{
		name: "entity",
		label: "Main state",
		type: "entity (switch, binary_sensor, sensor)",
		help: "On (or an operation state like Run) counts as running.",
		selector: N([
			"switch",
			"binary_sensor",
			"sensor",
			"input_boolean"
		])
	},
	{
		name: "icon",
		label: "Icon",
		type: "icon",
		help: "Shown when no temperature sensor is set.",
		selector: { icon: {} }
	},
	{
		name: "operation",
		label: "Operation state",
		type: "entity (sensor, select)",
		help: "e.g. Ready, Run, Finished (Home Connect operation state).",
		selector: N(["sensor", "select"])
	},
	{
		name: "program",
		label: "Active program",
		type: "entity (sensor, select)",
		selector: N(["sensor", "select"])
	},
	{
		name: "door",
		label: "Door",
		type: "entity (binary_sensor, sensor)",
		selector: N(["binary_sensor", "sensor"])
	},
	{
		name: "temperature",
		label: "Temperature",
		type: "entity (sensor)",
		help: "Shows an arc gauge instead of the icon.",
		selector: N("sensor")
	},
	{
		name: "temperature_max",
		label: "Temperature full scale",
		type: "number",
		default: "300",
		selector: { number: {
			mode: "box",
			step: 10,
			min: 1
		} }
	},
	{
		name: "setpoint",
		label: "Setpoint",
		type: "entity (sensor, number)",
		selector: N(["sensor", "number"])
	},
	{
		name: "progress",
		label: "Program progress (%)",
		type: "entity (sensor)",
		selector: N("sensor")
	},
	{
		name: "finish",
		label: "Finish time",
		type: "entity (sensor)",
		help: "Timestamp sensor (shows the time and how long until then) or a remaining time sensor.",
		selector: N("sensor")
	},
	{
		name: "remote",
		label: "Remote start allowed",
		type: "entity (binary_sensor, switch)",
		selector: N(["binary_sensor", "switch"])
	},
	{
		name: "controls",
		label: "Controls while running",
		type: "list of entity (switch, button, script)",
		help: "Switches toggle, buttons are pressed, scripts run.",
		selector: N([
			"switch",
			"input_boolean",
			"button",
			"input_button",
			"script"
		], !0)
	},
	{
		name: "stop",
		label: "Stop button",
		type: "entity (button, script)",
		help: "Shown while running; always asks first.",
		selector: N([
			"button",
			"input_button",
			"script"
		])
	}
], At = [
	{
		key: "appearance",
		tab: "General",
		title: "Appearance (`appearance`)",
		intro: "Look of the dashboard. Each device can override style and accent with the gear icon in the top bar (stored in that browser only).",
		shape: "object",
		fields: [
			{
				name: "accent",
				label: "Accent colour (hex)",
				type: "hex colour",
				default: "#56E7C0",
				help: "Presets: #56E7C0 mint, #5EC8FF blue, #A7A3FF lavender, #FF8FB1 pink. Any #RRGGBB works.",
				selector: { select: {
					options: [
						"#56E7C0",
						"#5EC8FF",
						"#A7A3FF",
						"#FF8FB1"
					],
					custom_value: !0
				} }
			},
			{
				name: "variant",
				label: "Style variant",
				type: "warm_glass | glass | quiet",
				default: "warm_glass",
				help: "warm_glass: blurred room photo + glass panels. glass: no photo. quiet: opaque panels, no blur (best for the wall tablet).",
				selector: I([
					{
						value: "warm_glass",
						label: "Warm glass (photo + blur)"
					},
					{
						value: "glass",
						label: "Glass (no photo)"
					},
					{
						value: "quiet",
						label: "Quiet (opaque, no blur)"
					}
				])
			},
			{
				name: "ambience",
				label: "Ambience",
				type: "graphite | midnight | deep_teal | violet_night | warm",
				default: "graphite",
				help: "Background colour mood behind the glass.",
				selector: I([
					{
						value: "graphite",
						label: "Graphite"
					},
					{
						value: "midnight",
						label: "Midnight"
					},
					{
						value: "deep_teal",
						label: "Deep teal"
					},
					{
						value: "violet_night",
						label: "Violet night"
					},
					{
						value: "warm",
						label: "Warm"
					}
				])
			},
			{
				name: "background",
				label: "Home background image (room)",
				type: "room id",
				default: "first room",
				help: "Room whose image is the blurred Home background. Room views always use their own image.",
				selector: I("$rooms")
			},
			{
				name: "time_display",
				label: "Time shown on device tiles",
				type: "changed | updated | off",
				default: "changed",
				help: "changed: time since the state last changed (HA last_changed). updated: time since the entity last reported anything (HA last_updated). off: hide.",
				selector: I([
					{
						value: "changed",
						label: "Last changed"
					},
					{
						value: "updated",
						label: "Last updated"
					},
					{
						value: "off",
						label: "Off"
					}
				])
			},
			{
				name: "light_mood",
				label: "Room photos follow the lights",
				type: "boolean",
				default: "true",
				help: "Room photos get darker when the room's lights are off and light up (warm glow) when they are on; brightness follows the light level. Rooms without lights stay unchanged.",
				selector: F
			},
			{
				name: "image_path",
				label: "Room image base URL",
				type: "URL",
				default: "rooms/ next to atlas-home.js",
				help: "Where room images are loaded from. Example for own photos: /local/atlas/rooms/",
				selector: P
			}
		]
	},
	{
		key: "entities",
		tab: "Entities",
		title: "Global entities (`entities`)",
		intro: "House-wide entities used by the greeting, top bar, Climate, Energy, Security and Quick actions. Leave a field empty to hide what depends on it.",
		shape: "object",
		fields: [
			{
				name: "alarm",
				label: "Alarm panel",
				type: `entity (${Dt("alarm_control_panel")})`,
				help: "Greeting line, Security card, Security page (arm modes the panel supports, Disarm), Arm away quick action. Panels that need a code open the Home Assistant dialog, which asks for it.",
				selector: N("alarm_control_panel")
			},
			{
				name: "weather",
				label: "Weather",
				type: "entity (weather)",
				help: "Top bar condition and icon.",
				selector: N("weather")
			},
			{
				name: "outdoor_temperature",
				label: "Outdoor temperature",
				type: "entity (sensor)",
				help: "Top bar temperature. Falls back to the weather entity's temperature.",
				selector: N("sensor")
			},
			{
				name: "heat_pump",
				label: "Heat pump (climate)",
				type: "entity (climate)",
				help: "Greeting indoor reading and Climate card ring (current and target).",
				selector: N("climate"),
				group: "Heat pump"
			},
			{
				name: "heat_pump_outdoor",
				label: "Heat pump outdoor sensor",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Heat pump"
			},
			{
				name: "heat_pump_supply",
				label: "Heat pump supply line",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Heat pump"
			},
			{
				name: "heat_pump_return",
				label: "Heat pump return line",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Heat pump"
			},
			{
				name: "solar_power",
				label: "Solar power",
				type: "entity (sensor, W or kW)",
				selector: N("sensor"),
				group: "Energy"
			},
			{
				name: "house_load",
				label: "House load",
				type: "entity (sensor, W or kW)",
				help: "Total house consumption.",
				selector: N("sensor"),
				group: "Energy"
			},
			{
				name: "grid_import",
				label: "Grid import",
				type: "entity (sensor, W or kW)",
				selector: N("sensor"),
				group: "Energy"
			},
			{
				name: "grid_export",
				label: "Grid export",
				type: "entity (sensor, W or kW)",
				help: "When export is larger than import the arrow points to the grid.",
				selector: N("sensor"),
				group: "Energy"
			},
			{
				name: "garage_cover",
				label: "Garage door (cover)",
				type: "entity (cover)",
				help: "Garage quick action (open or close, always confirmed).",
				selector: N("cover"),
				group: "Quick actions and system"
			},
			{
				name: "wake_pc",
				label: "Wake PC",
				type: "entity (input_button, button, script)",
				help: "Wake PC quick action (press, or script.turn_on).",
				selector: N([
					"input_button",
					"button",
					"script"
				]),
				group: "Quick actions and system"
			},
			{
				name: "incidents",
				label: "Incident report sensor",
				type: "entity (sensor)",
				help: "Optional log analyzer sensor (e.g. the incident report published by Node-RED). Attributes: generated, summary (critical, warning, minor), incidents (severity, title, detail, recommendation, count, sources). Counts may also be top-level attributes, numbers or lists. Shown on the System page and in the attention banner.",
				selector: N("sensor"),
				group: "Quick actions and system"
			},
			{
				name: "persons",
				label: "Persons",
				type: "list of entity (person)",
				help: "Presence chips on Home (picture, name, Home / Away / zone). Tap opens the person details.",
				selector: N("person", !0),
				group: "Quick actions and system"
			},
			{
				name: "exclude_lights",
				label: "Lights never counted as room lights",
				type: "list of entity (light)",
				help: "Camera status LEDs etc. Excluded from Lights off.",
				selector: N("light", !0),
				group: "Quick actions and system"
			}
		]
	},
	{
		key: "alerts",
		tab: "Alerts",
		title: "Alert rules (`alerts`)",
		intro: "Rules for the attention banner and Alerts view. See docs/alerts.md for how each rule behaves. Unknown or unavailable is never treated as clear.",
		shape: "object",
		fields: [
			{
				name: "temperature_rules",
				label: "Temperature limits (warning)",
				type: "list",
				help: "Warning above `above`, clears below `clear_below` (hysteresis).",
				selector: { object: {} },
				fields: [
					{
						name: "label",
						label: "Label",
						type: "text",
						help: "Default: room name.",
						selector: P
					},
					{
						name: "entity",
						label: "Temperature sensor",
						type: "entity (sensor)",
						required: !0,
						selector: N("sensor")
					},
					{
						name: "above",
						label: "Warn above (°C)",
						type: "number",
						required: !0,
						selector: { number: {
							mode: "box",
							step: .5
						} }
					},
					{
						name: "clear_below",
						label: "Clear below (°C)",
						type: "number",
						default: "same as above",
						selector: { number: {
							mode: "box",
							step: .5
						} }
					}
				]
			},
			{
				name: "exterior_doors",
				label: "Exterior doors (warning when open)",
				type: "list of entity (binary_sensor, cover)",
				selector: N(["binary_sensor", "cover"], !0)
			},
			{
				name: "interior_doors",
				label: "Interior doors (info when open)",
				type: "list of entity (binary_sensor, cover)",
				selector: N(["binary_sensor", "cover"], !0)
			},
			{
				name: "critical",
				label: "Critical detectors (leak, smoke)",
				type: "list of entity (binary_sensor)",
				help: "Critical when on. Warning when the detector itself is unavailable.",
				selector: N("binary_sensor", !0)
			},
			{
				name: "rain_windows",
				label: "Windows to close when it rains (warning)",
				type: "list of entity (binary_sensor, cover)",
				help: "Warning when one is open while the weather is rainy, pouring, snowy, hail or a thunderstorm. With an hourly forecast, the rule waits until the current or next hour confirms precipitation (stops false alarms from a wrong rainy state).",
				selector: N(["binary_sensor", "cover"], !0),
				group: "Weather"
			},
			{
				name: "rain_weather",
				label: "Weather entity for the rain rule",
				type: "entity (weather)",
				default: "entities.weather",
				help: "Optional, e.g. a local weather service that reports rain more reliably.",
				selector: N("weather"),
				group: "Weather"
			},
			{
				name: "rain_min_mm",
				label: "Precipitation that confirms rain (mm)",
				type: "number",
				default: "0.1",
				help: "Hourly forecast amount for the current or next hour. A probability of 50 % or more also confirms it.",
				selector: { number: {
					mode: "box",
					step: .1,
					min: 0
				} },
				group: "Weather"
			},
			{
				name: "severe_weather",
				label: "Severe weather warning",
				type: "boolean",
				default: "true",
				help: "Warning while the weather is lightning, hail, pouring or exceptional.",
				selector: F,
				group: "Weather"
			},
			{
				name: "mailbox",
				label: "Mailbox contact",
				type: "entity (binary_sensor)",
				help: "Info while open (or while the acknowledge helper is on).",
				selector: N("binary_sensor")
			},
			{
				name: "mailbox_ack",
				label: "Mailbox acknowledge helper",
				type: "entity (input_boolean)",
				help: "Optional. If set, the alert stays until this helper is turned off (Acknowledge button). An automation must turn it on when the mailbox opens.",
				selector: N("input_boolean")
			},
			{
				name: "updates",
				label: "Show available updates (info)",
				type: "boolean",
				default: "true",
				selector: F
			},
			{
				name: "data_quality",
				label: "Warn about unavailable mapped devices",
				type: "boolean",
				default: "true",
				selector: F
			}
		]
	},
	{
		key: "floors",
		tab: "Floors",
		title: "Floors (`floors`)",
		intro: "List of floors, top to bottom. Rooms reference a floor by id. Independent of the HA floor registry.",
		shape: "list",
		fields: [
			{
				name: "id",
				label: "ID",
				type: "text",
				required: !0,
				help: "Used in URLs (floor-<id>). Lowercase, no spaces.",
				selector: P
			},
			{
				name: "name",
				label: "Name",
				type: "text",
				required: !0,
				selector: P
			},
			{
				name: "level",
				label: "Level",
				type: "text",
				help: "Shown on the floor card, e.g. +1, 0, -1.",
				selector: P
			},
			{
				name: "cameras",
				label: "Camera wall",
				type: "off | live | stills",
				default: "off",
				help: "Shows the cameras of all rooms on this floor side by side on its Rooms page (stacked on the phone). live: muted live streams. stills: snapshots refreshed every 10 s (lighter on the tablet). Rooms with the camera section off are skipped; private cameras stay hidden.",
				selector: I([
					{
						value: "off",
						label: "Off"
					},
					{
						value: "live",
						label: "Live streams"
					},
					{
						value: "stills",
						label: "Snapshots (every 10 s)"
					}
				])
			}
		]
	},
	{
		key: "rooms",
		tab: "Rooms",
		title: "Rooms (`rooms`)",
		intro: "List of rooms in display order (previous / next follow this order within a floor). Independent of the HA area registry.",
		shape: "list",
		fields: [
			{
				name: "id",
				label: "ID",
				type: "text",
				required: !0,
				help: "Used in URLs (room-<id>) and in layout lists. Lowercase, no spaces.",
				selector: P,
				group: "_grid"
			},
			{
				name: "name",
				label: "Name",
				type: "text",
				required: !0,
				selector: P,
				group: "_grid"
			},
			{
				name: "floor",
				label: "Floor",
				type: "floor id",
				selector: I("$floors"),
				group: "_grid"
			},
			{
				name: "icon",
				label: "Icon",
				type: "ATLAS icon key",
				help: "One of the shipped line icons, e.g. office, living, server.",
				selector: I("$icons"),
				group: "_grid"
			},
			{
				name: "image",
				label: "Image",
				type: "file name or URL",
				help: "Pick a shipped image or type a file name under the image base URL, or a full URL. Empty: the shipped image matching the room id is used automatically (e.g. laundry -> laundry.jpg, guest_room -> guest-room.jpg). none: no image.",
				selector: { select: {
					options: "$images",
					custom_value: !0
				} }
			},
			{
				name: "temperature",
				label: "Temperature sensor",
				type: "entity (sensor)",
				selector: N("sensor")
			},
			{
				name: "humidity",
				label: "Humidity sensor",
				type: "entity (sensor)",
				selector: N("sensor")
			},
			{
				name: "show_camera",
				label: "Show camera section",
				type: "boolean",
				default: "true",
				help: "Off: the room has no camera section at all (no Camera card, no stream, not counted as unavailable), even if a camera entity is set. On without a camera entity: a compact \"No camera\" card.",
				selector: F,
				group: "Camera"
			},
			{
				name: "camera",
				label: "Camera (live stream)",
				type: "entity (camera)",
				help: "Enables the camera slot (16:9) with Live, Snapshot, Recordings.",
				selector: N("camera"),
				group: "Camera"
			},
			{
				name: "camera_hq",
				label: "Camera high quality stream",
				type: "entity (camera)",
				help: "Optional, reserved for a quality switch.",
				selector: N("camera"),
				group: "Camera"
			},
			{
				name: "camera_snapshot",
				label: "Snapshot camera",
				type: "entity (camera)",
				help: "Optional. Snapshot uses this entity's picture, else the live camera's.",
				selector: N("camera"),
				group: "Camera"
			},
			{
				name: "camera_private",
				label: "Private camera",
				type: "boolean",
				default: "false",
				help: "Stream hidden until the user taps Reveal. Off: the live stream starts (muted) as soon as the room opens.",
				selector: F,
				group: "Camera"
			},
			{
				name: "light_entities",
				label: "Light entities",
				type: "list of entity (light, switch, input_boolean)",
				help: "What counts as this room's lights for the photo effect, the Lights chip and Lights off, e.g. Tasmota relays (switch.*) that power lamps. Empty: the room's light.* devices, minus the excluded status LEDs.",
				selector: N([
					"light",
					"switch",
					"input_boolean"
				], !0),
				group: "Lights"
			},
			{
				name: "climate_extra",
				label: "Extra climate values",
				type: "list",
				help: "More values in the Climate card, e.g. CO2, pressure, VOC. Each value opens its history.",
				selector: { object: {} },
				fields: L,
				group: "Climate and automations"
			},
			{
				name: "appliances",
				label: "Appliances",
				type: "list",
				help: "Appliances card (oven, dishwasher, washer, dryer ...). Only the name is required; every other field adds its part of the tile. Controls and Stop appear while the appliance runs.",
				selector: { object: {} },
				fields: kt,
				group: "Appliances"
			},
			{
				name: "automations",
				label: "Automations",
				type: "list of entity (automation)",
				help: "Shows an Automations card with an on/off switch and the last run time for each.",
				selector: N("automation", !0),
				group: "Climate and automations"
			},
			{
				name: "printer_name",
				label: "Printer name",
				type: "text",
				help: "Title of the 3D printer card. The card appears when a status or progress sensor is set.",
				selector: P,
				group: "3D printer"
			},
			{
				name: "printer_status",
				label: "Print status",
				type: "entity (sensor)",
				help: "e.g. sensor.<printer>_print_status (Bambu Lab).",
				selector: N("sensor"),
				group: "3D printer"
			},
			{
				name: "printer_progress",
				label: "Print progress (%)",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "3D printer"
			},
			{
				name: "printer_remaining",
				label: "Remaining time",
				type: "entity (sensor, duration)",
				help: "Seconds, minutes or hours; converted by its unit.",
				selector: N("sensor"),
				group: "3D printer"
			},
			{
				name: "printer_nozzle",
				label: "Nozzle temperature",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "3D printer"
			},
			{
				name: "printer_bed",
				label: "Bed temperature",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "3D printer"
			},
			{
				name: "printer_chamber",
				label: "Chamber temperature",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "3D printer"
			},
			{
				name: "printer_light",
				label: "Chamber light",
				type: "entity (light, switch)",
				selector: N(["light", "switch"]),
				group: "3D printer"
			},
			{
				name: "printer_pause",
				label: "Pause button",
				type: "entity (button)",
				selector: N("button"),
				group: "3D printer"
			},
			{
				name: "printer_resume",
				label: "Resume button",
				type: "entity (button)",
				selector: N("button"),
				group: "3D printer"
			},
			{
				name: "printer_stop",
				label: "Stop button",
				type: "entity (button)",
				help: "Always asks for confirmation.",
				selector: N("button"),
				group: "3D printer"
			},
			{
				name: "printer_picture",
				label: "Printer picture",
				type: "entity (camera, image)",
				help: "Chamber camera or cover image, shown as a still in the card.",
				selector: N(["camera", "image"]),
				group: "3D printer"
			},
			{
				name: "car_name",
				label: "Vehicle name",
				type: "text",
				help: "Title of the vehicle card. The card appears in this room when any vehicle entity below is set.",
				selector: P,
				group: "Vehicle"
			},
			{
				name: "car_subtitle",
				label: "Vehicle subtitle",
				type: "text",
				help: "e.g. the model.",
				selector: P,
				group: "Vehicle"
			},
			{
				name: "car_image",
				label: "Vehicle image",
				type: "file name or URL",
				help: "File under the image base URL or a full URL (e.g. /local/car.png). Empty: a drawn car outline.",
				selector: P,
				group: "Vehicle"
			},
			{
				name: "car_lock",
				label: "Lock",
				type: "entity (lock)",
				help: "Shows locked / unlocked with Lock and Unlock buttons (Unlock asks first). Locks that need a code open the Home Assistant lock dialog.",
				selector: N("lock"),
				group: "Vehicle"
			},
			{
				name: "car_doors_locked",
				label: "Doors locked status",
				type: "entity (sensor, binary_sensor)",
				help: "Read-only lock status when there is no lock entity. A binary_sensor with device class lock counts off as locked (Home Assistant convention).",
				selector: N(["sensor", "binary_sensor"]),
				group: "Vehicle"
			},
			{
				name: "car_doors_locked_when",
				label: "Locked when state is",
				type: "text",
				default: "locked (sensor), off (binary_sensor)",
				help: "The state value of the doors status that means locked, if it differs.",
				selector: P,
				group: "Vehicle"
			},
			{
				name: "car_range",
				label: "Range",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Vehicle"
			},
			{
				name: "car_odometer",
				label: "Odometer",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Vehicle"
			},
			{
				name: "car_location",
				label: "Location",
				type: "entity (device_tracker, sensor)",
				help: "A device_tracker shows its zone (Home, Away or the zone name).",
				selector: N(["device_tracker", "sensor"]),
				group: "Vehicle"
			},
			{
				name: "car_daily_distance",
				label: "Distance today",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Vehicle"
			},
			{
				name: "car_daily_trips",
				label: "Trips today",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Vehicle"
			},
			{
				name: "car_monthly_distance",
				label: "Distance this month",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Vehicle"
			},
			{
				name: "car_monthly_trips",
				label: "Trips this month",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Vehicle"
			},
			{
				name: "car_last_updated",
				label: "Last update",
				type: "entity (sensor, timestamp)",
				help: "When the car last reported. Empty: the newest update among the vehicle entities.",
				selector: N("sensor"),
				group: "Vehicle"
			},
			{
				name: "car_flash",
				label: "Flash lights",
				type: "entity (button, input_button, script)",
				selector: N([
					"button",
					"input_button",
					"script"
				]),
				group: "Vehicle"
			},
			{
				name: "car_horn",
				label: "Honk horn",
				type: "entity (button, input_button, script)",
				help: "Asks first.",
				selector: N([
					"button",
					"input_button",
					"script"
				]),
				group: "Vehicle"
			},
			{
				name: "car_refresh",
				label: "Update data",
				type: "entity (button, input_button, script)",
				help: "Asks the car to send fresh data.",
				selector: N([
					"button",
					"input_button",
					"script"
				]),
				group: "Vehicle"
			},
			{
				name: "power",
				label: "Power sensor",
				type: "entity (sensor)",
				help: "Room power card (gauge coloured by load) and a power chip in the room status strip.",
				selector: N("sensor"),
				group: "Room power"
			},
			{
				name: "power_energy",
				label: "Energy sensor (kWh)",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Room power"
			},
			{
				name: "power_current",
				label: "Current sensor (A)",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Room power"
			},
			{
				name: "power_max",
				label: "Full scale (W)",
				type: "number",
				default: "3000",
				help: "Power at a full gauge. Colour: green up to 40 %, then amber, orange from 85 %, red at full scale.",
				selector: { number: {
					mode: "box",
					step: 100,
					min: 100
				} },
				group: "Room power"
			},
			{
				name: "mower",
				label: "Lawn mower",
				type: "entity (lawn_mower)",
				help: "Mower card: state, battery, Start / Pause / Dock for what the mower supports. A mower in error raises a warning.",
				selector: N("lawn_mower"),
				group: "Lawn mower"
			},
			{
				name: "mower_battery",
				label: "Mower battery (%)",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Lawn mower"
			},
			{
				name: "mower_name",
				label: "Mower name",
				type: "text",
				default: "entity name",
				selector: P,
				group: "Lawn mower"
			},
			{
				name: "salt_level",
				label: "Salt level sensor (%)",
				type: "entity (sensor)",
				help: "Water softener salt in % (0-100, or 0-1). Card with the level; an info alert asks to buy salt below the threshold.",
				selector: N("sensor"),
				group: "Salt level"
			},
			{
				name: "salt_distance",
				label: "Salt distance sensor",
				type: "entity (sensor)",
				help: "Optional raw reading shown as a detail (e.g. distance from the lid to the salt).",
				selector: N("sensor"),
				group: "Salt level"
			},
			{
				name: "salt_warn_below",
				label: "Buy salt below (%)",
				type: "number",
				default: "30",
				selector: { number: {
					mode: "box",
					step: 5,
					min: 0,
					max: 100
				} },
				group: "Salt level"
			},
			{
				name: "salt_name",
				label: "Salt card title",
				type: "text",
				default: "Salt level",
				selector: P,
				group: "Salt level"
			},
			{
				name: "side_cards",
				label: "Own cards, left column",
				type: "list of card configs (YAML)",
				help: "Any Lovelace cards (built-in or custom:...) shown below the camera, e.g. your own remote card. One card (type: custom:my-card plus its options) or a list of cards (each starting with - type:).",
				selector: { object: {} },
				group: "Own cards"
			},
			{
				name: "cards",
				label: "Own cards, below Devices",
				type: "list of card configs (YAML)",
				help: "Any Lovelace cards shown below the Devices card, side by side when there is room (e.g. a washer and a dryer card). One card or a list of cards.",
				selector: { object: {} },
				group: "Own cards"
			},
			{
				name: "devices",
				label: "Devices",
				type: "list",
				help: "Device tiles. Tap toggles light, switch, fan, input_boolean; other domains and long press open more-info. Per tile you can change the tap action (e.g. press a button) and ask before acting. A cover gets a full-width tile with Open / Stop / Close buttons for the actions it supports.",
				selector: { object: {} },
				fields: Ot
			}
		]
	},
	{
		key: "layout",
		tab: "Layout",
		title: "Layout (`layout`)",
		intro: "Which rooms appear where (lists of room ids, in order) and your own cards on Home and on the System page.",
		shape: "object",
		fields: [
			{
				name: "home_tiles",
				label: "Home room tiles",
				type: "list of room id",
				default: "first 8 rooms",
				help: "8 tiles use the 3 / 2 / 3 design grid.",
				selector: { select: {
					multiple: !0,
					reorder: !0,
					options: "$rooms"
				} }
			},
			{
				name: "top_tabs",
				label: "Top bar room tabs",
				type: "list of room id",
				selector: { select: {
					multiple: !0,
					reorder: !0,
					options: "$rooms"
				} }
			},
			{
				name: "security_tiles",
				label: "Security camera tiles",
				type: "list of room id",
				help: "Live camera stills (16:9, refreshed every 10 s) on the Home Security card; tap opens the room view.",
				selector: { select: {
					multiple: !0,
					reorder: !0,
					options: "$rooms"
				} }
			},
			{
				name: "home_cards",
				label: "Own cards on Home",
				type: "list of card configs (YAML)",
				help: "Any Lovelace cards (built-in or custom:...) shown below the Home grid, side by side (stacked on the phone). One card (type: ... plus its options) or a list of cards (each starting with - type:).",
				selector: { object: {} }
			},
			{
				name: "system_cards",
				label: "Own cards on the System page",
				type: "list of card configs (YAML)",
				help: "Any Lovelace cards shown on the System page below the incident report, e.g. a history graph of the server temperature. One card or a list of cards.",
				selector: { object: {} }
			}
		]
	},
	{
		key: "energy_meters",
		tab: "Energy",
		title: "Energy meters (`energy_meters`)",
		intro: "Power meters and metered circuits for the Energy view (sidebar > Energy). Mark the whole-house meter as main to show it large with its phases. Without meters, Energy opens the built-in HA Energy dashboard.",
		shape: "list",
		fields: [
			{
				name: "name",
				label: "Name",
				type: "text",
				required: !0,
				selector: P
			},
			{
				name: "power",
				label: "Power sensor",
				type: "entity (sensor, W or kW)",
				required: !0,
				selector: N("sensor")
			},
			{
				name: "main",
				label: "Main meter",
				type: "boolean",
				default: "false",
				help: "Shown large at the top with phases. Use for the whole-house meter.",
				selector: F
			},
			{
				name: "max_power",
				label: "Gauge full scale (W)",
				type: "number",
				default: "3000",
				help: "Power at which the gauge ring is full.",
				selector: { number: {
					min: 1,
					mode: "box",
					unit_of_measurement: "W"
				} }
			},
			{
				name: "energy",
				label: "Total energy sensor",
				type: "entity (sensor, kWh)",
				selector: N("sensor")
			},
			{
				name: "current",
				label: "Current sensor",
				type: "entity (sensor, A)",
				selector: N("sensor")
			},
			{
				name: "power_factor",
				label: "Power factor sensor",
				type: "entity (sensor)",
				help: "Percent (0-100) or 0-1; shown as %.",
				selector: N("sensor")
			},
			{
				name: "voltage",
				label: "Voltage sensor",
				type: "entity (sensor, V)",
				selector: N("sensor")
			},
			{
				name: "frequency",
				label: "Frequency sensor",
				type: "entity (sensor, Hz)",
				selector: N("sensor")
			},
			{
				name: "power_a",
				label: "Phase A power",
				type: "entity (sensor)",
				help: "Phase sensors are optional; with any of them set the meter shows a phase table.",
				selector: N("sensor")
			},
			{
				name: "power_b",
				label: "Phase B power",
				type: "entity (sensor)",
				selector: N("sensor")
			},
			{
				name: "power_c",
				label: "Phase C power",
				type: "entity (sensor)",
				selector: N("sensor")
			},
			{
				name: "current_a",
				label: "Phase A current",
				type: "entity (sensor)",
				selector: N("sensor")
			},
			{
				name: "current_b",
				label: "Phase B current",
				type: "entity (sensor)",
				selector: N("sensor")
			},
			{
				name: "current_c",
				label: "Phase C current",
				type: "entity (sensor)",
				selector: N("sensor")
			},
			{
				name: "voltage_a",
				label: "Phase A voltage",
				type: "entity (sensor)",
				selector: N("sensor")
			},
			{
				name: "voltage_b",
				label: "Phase B voltage",
				type: "entity (sensor)",
				selector: N("sensor")
			},
			{
				name: "voltage_c",
				label: "Phase C voltage",
				type: "entity (sensor)",
				selector: N("sensor")
			}
		]
	},
	{
		key: "solar",
		tab: "Solar",
		title: "Solar view (`solar`)",
		intro: "Solar view (porting plan step 10): live flow and gauges, today's energy with an hourly chart from long-term statistics, PV strings and inverter values. Live values fall back to Entities (solar power, house load, grid import / export). Every field is optional; parts without entities are hidden.",
		shape: "object",
		fields: [
			{
				name: "name",
				label: "View title",
				type: "text",
				default: "Solar",
				selector: P
			},
			{
				name: "power",
				label: "PV power now",
				type: "entity (sensor)",
				default: "entities.solar_power",
				help: "W or kW.",
				selector: N("sensor"),
				group: "Live"
			},
			{
				name: "peak_power",
				label: "Peak power (kW)",
				type: "number",
				default: "6",
				help: "Full scale of the PV gauge.",
				selector: { number: {
					mode: "box",
					step: .5,
					min: .5
				} },
				group: "Live"
			},
			{
				name: "house_load",
				label: "House load",
				type: "entity (sensor)",
				default: "entities.house_load",
				selector: N("sensor"),
				group: "Live"
			},
			{
				name: "grid_import",
				label: "Grid import",
				type: "entity (sensor)",
				default: "entities.grid_import",
				selector: N("sensor"),
				group: "Live"
			},
			{
				name: "grid_export",
				label: "Grid export",
				type: "entity (sensor)",
				default: "entities.grid_export",
				selector: N("sensor"),
				group: "Live"
			},
			{
				name: "battery_soc",
				label: "Battery charge (%)",
				type: "entity (sensor)",
				help: "Adds a battery node and gauge.",
				selector: N("sensor"),
				group: "Live"
			},
			{
				name: "battery_power",
				label: "Battery power",
				type: "entity (sensor)",
				help: "Positive = charging.",
				selector: N("sensor"),
				group: "Live"
			},
			{
				name: "production_today",
				label: "Production today (kWh)",
				type: "entity (sensor)",
				help: "Also draws the hourly chart from Home Assistant long-term statistics (the sensor needs a state class).",
				selector: N("sensor"),
				group: "Today"
			},
			{
				name: "consumption_today",
				label: "House consumption today (kWh)",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Today"
			},
			{
				name: "export_today",
				label: "Exported today (kWh)",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Today"
			},
			{
				name: "import_today",
				label: "Imported today (kWh)",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Today"
			},
			{
				name: "forecast_today",
				label: "Forecast today (kWh)",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Today"
			},
			{
				name: "remaining_today",
				label: "Remaining forecast today (kWh)",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Today"
			},
			{
				name: "self_consumption",
				label: "Self-consumption (%)",
				type: "entity (sensor)",
				default: "computed from production and export",
				selector: N("sensor"),
				group: "Today"
			},
			{
				name: "strings",
				label: "PV strings",
				type: "list",
				help: "One row per string: power, voltage, current.",
				selector: { object: {} },
				fields: [
					{
						name: "name",
						label: "Name",
						type: "text",
						required: !0,
						selector: P
					},
					{
						name: "power",
						label: "Power",
						type: "entity (sensor)",
						selector: N("sensor")
					},
					{
						name: "voltage",
						label: "Voltage",
						type: "entity (sensor)",
						selector: N("sensor")
					},
					{
						name: "current",
						label: "Current",
						type: "entity (sensor)",
						selector: N("sensor")
					}
				]
			},
			{
				name: "inverter",
				label: "Inverter values",
				type: "list",
				help: "Status, temperature, grid frequency, insulation resistance, ...",
				selector: { object: {} },
				fields: L
			}
		]
	},
	{
		key: "heat_pump",
		tab: "Heat pump",
		title: "Heat pump view (`heat_pump`)",
		intro: "Heat pump view (porting plan step 10): status, temperature gauges, energy with COP, pressures, refrigerant circuit and run times. Works with any heat pump (examples follow the Nibe integration). Every field is optional.",
		shape: "object",
		fields: [
			{
				name: "name",
				label: "View title",
				type: "text",
				default: "Heat pump",
				selector: P
			},
			{
				name: "climate",
				label: "Climate entity",
				type: "entity (climate)",
				default: "entities.heat_pump",
				help: "Current and target temperature, HVAC action; tap for the thermostat.",
				selector: N("climate"),
				group: "Status"
			},
			{
				name: "status",
				label: "Compressor / operation state",
				type: "entity (sensor, binary_sensor)",
				selector: N(["sensor", "binary_sensor"]),
				group: "Status"
			},
			{
				name: "priority",
				label: "Priority",
				type: "entity (sensor)",
				help: "e.g. heating or hot water.",
				selector: N("sensor"),
				group: "Status"
			},
			{
				name: "mode",
				label: "Mode",
				type: "entity (select, sensor)",
				help: "e.g. smart home mode; tap opens it.",
				selector: N(["select", "sensor"]),
				group: "Status"
			},
			{
				name: "connection",
				label: "Connection state",
				type: "entity (sensor, binary_sensor)",
				selector: N(["sensor", "binary_sensor"]),
				group: "Status"
			},
			{
				name: "degree_minutes",
				label: "Degree minutes",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Status"
			},
			{
				name: "gauges",
				label: "Temperature gauges",
				type: "list",
				help: "Up to 4, e.g. supply, return, outdoor, discharge.",
				selector: { object: {} },
				fields: L
			},
			{
				name: "gauge_min",
				label: "Gauge minimum (°C)",
				type: "number",
				default: "-20",
				selector: { number: {
					mode: "box",
					step: 5
				} },
				group: "_grid"
			},
			{
				name: "gauge_max",
				label: "Gauge maximum (°C)",
				type: "number",
				default: "80",
				selector: { number: {
					mode: "box",
					step: 5
				} },
				group: "_grid"
			},
			{
				name: "energy_produced",
				label: "Energy produced total (kWh)",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Energy"
			},
			{
				name: "energy_consumed",
				label: "Energy consumed total (kWh)",
				type: "entity (sensor)",
				help: "With produced: COP = produced / consumed.",
				selector: N("sensor"),
				group: "Energy"
			},
			{
				name: "power",
				label: "Current power use",
				type: "entity (sensor)",
				selector: N("sensor"),
				group: "Energy"
			},
			{
				name: "energy",
				label: "More energy values",
				type: "list",
				help: "Heating, hot water, demand at DOT, ...",
				selector: { object: {} },
				fields: L
			},
			{
				name: "pressures",
				label: "Pressures",
				type: "list",
				selector: { object: {} },
				fields: L
			},
			{
				name: "circuit",
				label: "Refrigerant circuit",
				type: "list",
				help: "Evaporator, suction gas, liquid line, condenser, compressor frequency, pump speed, ...",
				selector: { object: {} },
				fields: L
			},
			{
				name: "runtimes",
				label: "Run times",
				type: "list",
				help: "Compressor run times, starts, additional heat, ...",
				selector: { object: {} },
				fields: L
			}
		]
	}
], jt, Mt = class extends M {
	constructor() {
		super(), this._fieldIndex = new Map(At.flatMap((e) => e.fields.map((e) => [e.name, e]))), this._label = (e) => this._fieldIndex.get(e.name)?.label ?? e.name, this._helper = (e) => this._fieldIndex.get(e.name)?.help, this._tab = "appearance", this._room = 0, this._formReady = !!customElements.get("ha-form");
	}
	setConfig(e) {
		this._config = e;
	}
	connectedCallback() {
		super.connectedCallback(), this._formReady || this._loadForm();
	}
	async _loadForm() {
		try {
			await (await (await window.loadCardHelpers?.())?.createCardElement({
				type: "entities",
				entities: []
			}))?.constructor?.getConfigElement?.();
		} catch (e) {
			console.warn("ATLAS: could not preload ha-form", e);
		}
		await customElements.whenDefined("ha-form"), this._formReady = !0;
	}
	_emit(e) {
		this._config = e, f(this, "config-changed", { config: e });
	}
	_patch(e, t) {
		this._emit({
			...this._config,
			[e]: t
		});
	}
	_loadPreset() {
		this._emit({
			type: this._config.type,
			...structuredClone(Et)
		});
	}
	_options() {
		let e = this._config;
		return {
			$rooms: (e.rooms ?? []).map((e) => ({
				value: e.id,
				label: e.name
			})),
			$floors: (e.floors ?? []).map((e) => ({
				value: e.id,
				label: e.name
			})),
			$icons: c.map((e) => ({
				value: e,
				label: e
			})),
			$images: [{
				value: "none",
				label: "none (no image)"
			}, ...h.map((e) => ({
				value: e,
				label: e
			}))]
		};
	}
	_selector(e) {
		if (e.fields) {
			let t = e.fields.find((e) => e.name === "name" || e.name === "label")?.name;
			return { object: {
				multiple: !0,
				...t ? { label_field: t } : {},
				...e.fields.some((e) => e.name === "entity") ? { description_field: "entity" } : {},
				fields: Object.fromEntries(e.fields.map((e) => [e.name, {
					label: e.label,
					required: e.required,
					selector: this._selector(e)
				}]))
			} };
		}
		let t = e.selector.select?.options;
		return typeof t == "string" ? { select: {
			...e.selector.select,
			options: this._options()[t] ?? []
		} } : e.selector;
	}
	_schema(e) {
		let t = [];
		for (let n of e) {
			let e = {
				name: n.name,
				required: n.required,
				selector: this._selector(n)
			};
			if (!n.group) {
				t.push(e);
				continue;
			}
			let r = t[t.length - 1];
			r?._group === n.group ? r.schema.push(e) : n.group === "_grid" ? t.push({
				_group: n.group,
				type: "grid",
				name: "",
				schema: [e]
			}) : t.push({
				_group: n.group,
				type: "expandable",
				name: "",
				flatten: !0,
				title: n.group,
				schema: [e]
			});
		}
		return t.map(({ _group: e, ...t }) => t);
	}
	_form(e, t, n) {
		return k`<ha-form
      .hass=${this.hass}
      .data=${e ?? {}}
      .schema=${t}
      .computeLabel=${this._label}
      .computeHelper=${this._helper}
      @value-changed=${(e) => {
			e.stopPropagation(), n(e.detail.value);
		}}
    ></ha-form>`;
	}
	render() {
		if (!this._config || !this.hass) return j;
		if (!this._formReady) return k`<p>Loading editor...</p>`;
		let e = !(this._config.rooms ?? []).length, t = At.find((e) => e.key === this._tab) ?? At[0];
		return k`
      ${e ? k`<div class="preset">
            <p>This dashboard has no rooms yet. Load the demo house as a starting point and replace its entities with yours, or paste your own config in YAML mode.</p>
            <button @click=${this._loadPreset}>Load demo house</button>
          </div>` : j}
      <nav>
        ${At.map((e) => k`<button class=${e.key === t.key ? "on" : ""} @click=${() => this._tab = e.key}>${e.tab}</button>`)}
      </nav>
      <p class="intro">${t.intro}</p>
      <div class="body">${this._renderSection(t)}</div>
    `;
	}
	_renderSection(e) {
		let t = this._config;
		if (e.key === "rooms") return this._renderRooms(e);
		if (e.shape === "list") {
			let n = {
				name: e.key,
				label: e.tab,
				type: "list",
				selector: {},
				fields: e.fields
			};
			return this._form({ [e.key]: t[e.key] }, [{
				name: e.key,
				selector: this._selector(n)
			}], (t) => this._patch(e.key, t[e.key]));
		}
		return this._form(t[e.key], this._schema(e.fields), (t) => this._patch(e.key, t));
	}
	_renderRooms(e) {
		let t = this._config.rooms ?? [], n = Math.min(this._room, Math.max(0, t.length - 1)), r = t[n], i = (e, t = n) => {
			this._room = t, this._patch("rooms", e);
		}, a = (e) => {
			let r = n + e;
			if (r < 0 || r >= t.length) return;
			let a = [...t];
			[a[n], a[r]] = [a[r], a[n]], i(a, r);
		};
		return k`
      <div class="rooms-bar">
        <select @change=${(e) => this._room = Number(e.target.value)}>
          ${t.map((e, t) => k`<option value=${t} ?selected=${t === n}>${e.name} (${e.id})</option>`)}
        </select>
        <button title="Move up" @click=${() => a(-1)}>Up</button>
        <button title="Move down" @click=${() => a(1)}>Down</button>
        <button @click=${() => i([...t, {
			id: `room_${t.length + 1}`,
			name: "New room",
			devices: []
		}], t.length)}>Add</button>
        <button class="danger" ?disabled=${!r} @click=${() => confirm(`Delete room "${r?.name}"?`) && i(t.filter((e, t) => t !== n), Math.max(0, n - 1))}>Delete</button>
      </div>
      ${r ? this._form(r, this._schema(e.fields), (e) => i(t.map((t, r) => r === n ? e : t))) : k`<p>No rooms.</p>`}
    `;
	}
};
jt = Mt, jt.properties = {
	hass: { attribute: !1 },
	_config: { state: !0 },
	_tab: { state: !0 },
	_room: { state: !0 },
	_formReady: { state: !0 }
}, jt.styles = Ce`
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
var R = (e) => e.split(".")[0], z = (e, t) => t && e ? e.states[t] : void 0, B = (e) => !e || e.state === "unavailable" || e.state === "unknown", V = (e, t) => {
	let n = z(e, t);
	if (B(n)) return;
	let r = Number(n.state);
	return Number.isFinite(r) ? r : void 0;
}, H = (e, t) => {
	let n = V(e, t);
	if (n === void 0) return;
	let r = String(z(e, t)?.attributes.unit_of_measurement ?? "kW");
	return r === "W" ? n / 1e3 : r === "MW" ? n * 1e3 : n;
}, Nt = (e, t) => String(z(e, t)?.attributes.friendly_name ?? t), U = (e, t) => {
	if (e.formatEntityState) return e.formatEntityState(t);
	let n = t.attributes.unit_of_measurement;
	return n ? `${t.state} ${n}` : t.state;
}, Pt = (e) => e ? R(e.entity_id) === "cover" ? e.state === "open" || e.state === "opening" : e.state === "on" : !1, Ft = {
	critical: 0,
	warning: 1,
	minor: 2
}, It = [
	"critical",
	"warning",
	"minor"
], Lt = (e) => {
	if (Array.isArray(e)) return e.length;
	if (e == null || e === "") return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}, Rt = (e) => It.includes(e) ? e : "minor", zt = (e) => {
	if (!e || B(e)) return;
	let t = e.attributes ?? {}, n = (Array.isArray(t.incidents) ? t.incidents : []).filter((e) => e && typeof e == "object").map((e, t) => ({
		id: String(e.id ?? t),
		severity: Rt(e.severity),
		title: String(e.title ?? "Incident"),
		detail: e.detail ? String(e.detail) : "",
		recommendation: e.recommendation ? String(e.recommendation) : "",
		count: Lt(e.count),
		sources: Array.isArray(e.sources) ? e.sources.map(String) : []
	})).sort((e, t) => Ft[e.severity] - Ft[t.severity] || (t.count ?? 0) - (e.count ?? 0)), r = t.summary && typeof t.summary == "object" ? t.summary : {}, i = Object.fromEntries(It.map((e) => [e, Lt(r[e]) ?? Lt(t[e]) ?? n.filter((t) => t.severity === e).length]));
	return {
		generated: typeof t.generated == "string" ? t.generated : void 0,
		counts: i,
		incidents: n
	};
}, Bt = (e, t) => `${e}|${t}`, Vt = {
	daily: 1,
	hourly: 2,
	twice_daily: 4
}, Ht = (e) => {
	let t = Number(e?.attributes.supported_features ?? 0);
	return [
		"daily",
		"twice_daily",
		"hourly"
	].filter((e) => (t & Vt[e]) !== 0);
}, Ut = (e) => Ht(e).filter((e) => e === "daily" || e === "hourly"), Wt = [
	"rainy",
	"pouring",
	"lightning-rainy",
	"snowy",
	"snowy-rainy",
	"hail"
], Gt = [
	"lightning",
	"lightning-rainy",
	"hail",
	"pouring",
	"exceptional"
], Kt = (e) => e ? e === "partlycloudy" ? "Partly cloudy" : e === "clear-night" ? "Clear night" : e === "windy-variant" ? "Windy" : e.charAt(0).toUpperCase() + e.slice(1).replace(/-/g, ", ") : "-", qt = (e, t = .1) => {
	if (!Array.isArray(e) || !e.length) return;
	let n = !1;
	for (let r of e.slice(0, 2)) if (r.precipitation !== void 0 && r.precipitation !== null && (n = !0, Number(r.precipitation) >= t) || r.precipitation_probability !== void 0 && r.precipitation_probability !== null && (n = !0, Number(r.precipitation_probability) >= 50)) return !0;
	return !n && void 0;
}, Jt = [
	"N",
	"NE",
	"E",
	"SE",
	"S",
	"SW",
	"W",
	"NW"
], Yt = (e) => {
	if (typeof e == "string" && e.trim()) return e;
	let t = Number(e);
	return e == null || !Number.isFinite(t) ? "" : Jt[Math.round((t % 360 + 360) % 360 / 45) % 8];
}, Xt = /* @__PURE__ */ new Map(), Zt = {
	critical: 0,
	warning: 1,
	info: 2
}, Qt = (e, t, n = {}) => {
	let r = [], i = t.alerts ?? {}, a = (e) => E(t, e)?.name, o = (n) => ee(t, n) ?? Nt(e, n);
	for (let n of i.critical ?? []) {
		let i = z(e, n), a = E(t, n);
		B(i) ? r.push({
			id: `crit-na-${n}`,
			severity: "warning",
			title: `${o(n)} unavailable`,
			meta: `Detector state unknown${a ? ` · ${a.name}` : ""}`,
			chipTitle: o(n),
			chipValue: "Detector",
			badge: "Unavailable",
			icon: "alert",
			room: a?.id,
			entity: n
		}) : i.state === "on" && r.push({
			id: `crit-${n}`,
			severity: "critical",
			title: `${o(n)} triggered`,
			meta: a?.name ?? n,
			chipTitle: a?.name ?? o(n),
			chipValue: o(n),
			badge: "Triggered",
			icon: "alert",
			room: a?.id,
			roomBadge: "Alarm",
			entity: n
		});
	}
	for (let n of i.temperature_rules ?? []) {
		let i = V(e, n.entity), a = E(t, n.entity), s = n.label || a?.name || o(n.entity);
		if (i === void 0) {
			Xt.delete(n.entity), r.push({
				id: `temp-na-${n.entity}`,
				severity: "warning",
				title: `${s} temperature unavailable`,
				meta: `Cannot check the ${n.above} °C limit`,
				chipTitle: s,
				chipValue: "No reading",
				badge: "Unavailable",
				icon: "temperature",
				room: a?.id,
				entity: n.entity
			});
			continue;
		}
		let c = n.clear_below ?? n.above, l = Xt.get(n.entity) ? i >= c : i > n.above;
		if (Xt.set(n.entity, l), l) {
			let t = V(e, a?.humidity);
			r.push({
				id: `temp-${n.entity}`,
				severity: "warning",
				title: `${s} ${i.toFixed(1)} °C${t === void 0 ? "" : ` · ${Math.round(t)} % RH`}`,
				meta: `Above the ${n.above} °C limit${a ? ` · ${a.name}` : ""}`,
				chipTitle: s,
				chipValue: `${i.toFixed(1)} °C`,
				badge: "Too hot",
				icon: "temperature",
				room: a?.id,
				roomBadge: "Too hot",
				entity: n.entity
			});
		}
	}
	let s = (n, i) => {
		for (let a of n ?? []) {
			if (!Pt(z(e, a))) continue;
			let n = E(t, a);
			r.push({
				id: `door-${a}`,
				severity: i,
				title: `${n ? `${n.name} ` : ""}${o(a).toLowerCase()} open`,
				meta: `${Nt(e, a)}${n ? ` · ${n.name}` : ""}`,
				chipTitle: n?.name ?? o(a),
				chipValue: o(a),
				badge: "Open",
				icon: "door-open",
				room: n?.id,
				roomBadge: `${o(a)} open`,
				entity: a
			});
		}
	};
	s(i.exterior_doors, "warning"), s(i.interior_doors, "info");
	let c = i.rain_weather || t.entities?.weather, l = z(e, c);
	if (i.rain_windows?.length && c && !B(l) && Wt.includes(l.state)) {
		let a = Number.isFinite(Number(i.rain_min_mm)) && i.rain_min_mm !== void 0 ? Number(i.rain_min_mm) : .1;
		if (qt(n[Bt(c, "hourly")], a) !== !1) {
			let n = U(e, l) || Kt(l.state);
			for (let a of i.rain_windows) {
				let i = z(e, a);
				if (B(i) || !Pt(i)) continue;
				let s = E(t, a);
				r.push({
					id: `rain-${a}`,
					severity: "warning",
					title: `${s ? `${s.name} ` : ""}${o(a).toLowerCase()} open · ${n.toLowerCase()}`,
					meta: `${Nt(e, a)}${s ? ` · ${s.name}` : ""} · close it, the weather is ${n.toLowerCase()}`,
					chipTitle: s?.name ?? o(a),
					chipValue: o(a),
					badge: n,
					icon: "door-open",
					room: s?.id,
					roomBadge: `${o(a)} open · ${n.toLowerCase()}`,
					entity: a
				});
			}
		}
	}
	for (let n of t.rooms ?? []) {
		let t = z(e, n.mower);
		if (n.mower && t?.state === "error") {
			let t = n.mower_name || Nt(e, n.mower);
			r.push({
				id: `mower-${n.id}`,
				severity: "warning",
				title: `${t} needs help`,
				meta: `Lawn mower error · ${n.name}`,
				chipTitle: n.name,
				chipValue: t,
				badge: "Error",
				icon: "alert",
				room: n.id,
				roomBadge: "Mower error",
				entity: n.mower
			});
		}
		let i = V(e, n.salt_level);
		if (n.salt_level && i !== void 0) {
			let e = Math.max(0, Math.min(100, i > 1 ? i : i * 100));
			e < (Number.isFinite(Number(n.salt_warn_below)) && n.salt_warn_below !== void 0 ? Number(n.salt_warn_below) : 30) && r.push({
				id: `salt-${n.id}`,
				severity: "info",
				title: `Salt low: ${Math.round(e)} %`,
				meta: `${n.salt_name || "Salt level"} · ${n.name} · buy salt`,
				chipTitle: n.name,
				chipValue: `${Math.round(e)} %`,
				badge: "Buy salt",
				icon: "info",
				room: n.id,
				roomBadge: "Salt low",
				entity: n.salt_level
			});
		}
	}
	let u = z(e, t.entities?.weather);
	if (i.severe_weather !== !1 && t.entities?.weather && !B(u) && Gt.includes(u.state)) {
		let n = U(e, u) || Kt(u.state);
		r.push({
			id: "severe-weather",
			severity: "warning",
			title: `Severe weather: ${n.toLowerCase()}`,
			meta: "Current condition from the weather entity",
			chipTitle: "Weather",
			chipValue: n,
			badge: "Weather",
			icon: "alert",
			entity: t.entities.weather
		});
	}
	if (i.data_quality !== !1) {
		let n = ae(t).filter((t) => {
			let n = z(e, t);
			return !n || n.state === "unavailable";
		});
		if (n.length) {
			let e = n.map((e) => {
				let t = a(e);
				return `${o(e)}${t ? ` (${t})` : ""}`;
			});
			r.push({
				id: "data-quality",
				severity: "warning",
				title: `${n.length} device${n.length > 1 ? "s" : ""} unavailable`,
				meta: e.slice(0, 8).join(", ") + (e.length > 8 ? ` +${e.length - 8} more` : ""),
				chipTitle: "Data quality",
				chipValue: `${n.length} device${n.length > 1 ? "s" : ""}`,
				badge: "Unavailable",
				icon: "alert"
			});
		}
	}
	let d = t.entities?.incidents;
	if (d) {
		let t = zt(z(e, d));
		if (!t) r.push({
			id: "incidents-na",
			severity: "warning",
			title: "Incident report unavailable",
			meta: "Log analysis state unknown",
			chipTitle: "Log report",
			chipValue: "No data",
			badge: "Unavailable",
			icon: "system",
			entity: d
		});
		else {
			let { critical: e, warning: n, minor: i } = t.counts;
			if (e + n + i > 0) {
				let a = [
					e && `${e} critical`,
					n && `${n} warning${n > 1 ? "s" : ""}`,
					i && `${i} minor`
				].filter(Boolean).join(", ");
				r.push({
					id: "incidents",
					severity: e + n > 0 ? "warning" : "info",
					title: `Log report: ${a}`,
					meta: t.incidents.length ? t.incidents.slice(0, 2).map((e) => e.title).join(" · ") : "Incident analyzer",
					chipTitle: "System",
					chipValue: `${e + n + i} issue${e + n + i > 1 ? "s" : ""}`,
					badge: "Check log",
					icon: "system",
					view: "system",
					entity: d
				});
			}
		}
	}
	if (i.mailbox && (i.mailbox_ack ? z(e, i.mailbox_ack)?.state === "on" : z(e, i.mailbox)?.state === "on")) {
		let e = E(t, i.mailbox);
		r.push({
			id: "mailbox",
			severity: "info",
			title: "Mailbox opened",
			meta: `${e?.name ?? ""}${i.mailbox_ack ? " · stays until acknowledged" : ""}`,
			chipTitle: "Mailbox",
			chipValue: "Opened",
			badge: "Mail",
			icon: "info",
			room: e?.id,
			entity: i.mailbox_ack ?? i.mailbox
		});
	}
	if (i.updates !== !1) {
		let t = Object.values(e.states).filter((e) => R(e.entity_id) === "update" && e.state === "on");
		t.length && r.push({
			id: "updates",
			severity: "info",
			title: `${t.length} update${t.length > 1 ? "s" : ""} available`,
			meta: t.slice(0, 4).map((e) => String(e.attributes.title ?? e.attributes.friendly_name ?? e.entity_id)).join(" · "),
			chipTitle: "Updates",
			chipValue: String(t.length),
			badge: "Update",
			icon: "info",
			href: "/config/updates"
		});
	}
	return r.sort((e, t) => Zt[e.severity] - Zt[t.severity]);
}, $t = (e) => {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) n.room && n.roomBadge && !t.has(n.room) && t.set(n.room, {
		text: n.roomBadge,
		severity: n.severity
	});
	return t;
}, en = Ce`
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
  .lprev { display: none; }
  .dragging .lprev { display: inline; }
  .dragging .lstate:not(.lprev), .dragging .fstate { display: none; }
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

  /* ---------- fan tile, room power, mower, salt (step 7) ---------- */
  .dev.fan { position: relative; overflow: hidden; padding: 0 8px 0 0; gap: 6px; }
  .dev.fan .dmain { flex: 1; align-self: stretch; display: flex; align-items: center; gap: 12px; padding: 12px 0 12px 14px; min-width: 0; text-align: left; touch-action: pan-y; }
  .dev.fan .dmain > :not(.ffill) { position: relative; }
  .dev.fan .ffill { position: absolute; inset: 0 auto 0 0; width: 0; background: linear-gradient(90deg, var(--atlas-accent-soft), rgba(86, 231, 192, 0.06)); pointer-events: none; transition: width 0.25s ease; }
  .dev.fan.on .ffill { width: var(--pct, 0%); }
  .dev.fan.on, .devcard.has-img .dev.fan.on { background: rgba(14, 16, 20, 0.58); }
  .dev.fan .dragging .ffill { width: var(--pct, 0%); transition: none; }
  .dev.fan.on .fspin svg { animation: atlas-spin 1.6s linear infinite; }
  @keyframes atlas-spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { .dev.fan.on .fspin svg { animation: none; } }
  .fdir { position: relative; flex: none; height: 32px; padding: 0 8px; border-radius: 10px; font-size: 11px; border: 1px solid rgba(188, 200, 222, 0.2); background: rgba(241, 245, 255, 0.06); color: var(--atlas-text); white-space: nowrap; }
  .fdir:disabled { opacity: 0.4; }
  .rpbody, .saltbody { display: flex; align-items: center; gap: 16px; text-align: left; }
  .rpring { position: relative; width: 96px; height: 96px; flex: none; display: flex; align-items: center; justify-content: center; }
  .rpring svg { position: absolute; inset: 0; }
  .rpring b { position: relative; font-size: 16px; font-weight: 700; }
  .rptxt { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .rptxt > b { font-size: 16px; }
  .rptxt small { font-size: 12px; }
  .mower { gap: 10px; }
  .mbadge { flex: none; height: 26px; padding: 0 10px; border-radius: 999px; font-size: 12px; font-weight: 700; background: rgba(241, 245, 255, 0.08); color: var(--atlas-text2); }
  .mbadge.on { background: var(--atlas-accent-soft); color: var(--atlas-accent); }
  .mbadge.mid { background: rgba(255, 191, 87, 0.16); color: var(--atlas-warn); }
  .mbadge.bad { background: rgba(255, 114, 125, 0.18); color: var(--atlas-crit); }
  .mbatt { display: flex; align-items: center; gap: 10px; }
  .mbatt small { font-size: 12px; flex: none; }
  .mbar { flex: 1; height: 8px; border-radius: 4px; background: rgba(241, 245, 255, 0.08); overflow: hidden; display: block; }
  .mbar > i { display: block; height: 100%; border-radius: 4px; }
  .mbatt b { font-size: 13px; flex: none; min-width: 42px; text-align: right; }
  .mbtns { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; }
  .mbtns .sq { color: var(--atlas-text); padding: 0 10px; }
  .mbtns .sq.on { color: var(--atlas-accent); border-color: var(--atlas-accent-glow); background: var(--atlas-accent-soft); }
  .mbtns .sq:disabled { opacity: 0.4; }
  .salttank { position: relative; width: 44px; height: 84px; flex: none; border-radius: 10px 10px 14px 14px; border: 2px solid rgba(188, 200, 222, 0.3); overflow: hidden; display: flex; align-items: flex-end; background: rgba(0, 0, 0, 0.25); }
  .salttank > i { display: block; width: 100%; opacity: 0.85; transition: height 0.4s ease; }

  /* ---------- appliances (step 9) ---------- */
  .appls { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 10px; }
  .appl { display: flex; flex-direction: column; gap: 10px; padding: 12px; border-radius: 14px; background: rgba(241, 245, 255, 0.04); border: 1px solid rgba(188, 200, 222, 0.1); min-width: 0; }
  .appl.run { border-color: var(--atlas-accent-glow); background: rgba(86, 231, 192, 0.06); }
  .appl.na { border-style: dashed; border-color: rgba(255, 191, 87, 0.35); }
  .ahead { display: flex; align-items: center; gap: 12px; text-align: left; min-width: 0; }
  .ahead .atxt { flex: 1; }
  .ahead .atxt small { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .aarc { position: relative; width: 48px; height: 48px; flex: none; display: flex; align-items: center; justify-content: center; }
  .aarc svg { position: absolute; inset: 0; }
  .aarc b { position: relative; font-size: 14px; font-weight: 700; }
  .aico { width: 44px; height: 44px; flex: none; border-radius: 22px; display: flex; align-items: center; justify-content: center; background: rgba(241, 245, 255, 0.08); color: var(--atlas-text2); }
  .appl.run .aico { background: var(--atlas-accent-soft); color: var(--atlas-accent); }
  .abadge { flex: none; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; background: rgba(241, 245, 255, 0.08); color: var(--atlas-text2); }
  .abadge.on { background: var(--atlas-accent-soft); color: var(--atlas-accent); }
  .apill { display: inline-flex; align-items: center; gap: 5px; padding: 1px 8px; border-radius: 999px; font-size: 11px; background: rgba(241, 245, 255, 0.08); }
  .apill i { width: 6px; height: 6px; border-radius: 3px; background: var(--atlas-text2); }
  .apill.active { color: var(--atlas-accent); background: var(--atlas-accent-soft); }
  .apill.active i { background: var(--atlas-accent); }
  .apill.ready { color: #5ec8ff; }
  .apill.ready i { background: #5ec8ff; }
  .adoor { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; }
  .adoor.open { color: var(--atlas-warn); }
  .astrip { display: grid; gap: 6px; padding: 8px 10px; border-radius: 10px; background: rgba(0, 0, 0, 0.22); }
  .astrip span { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
  .astrip small { font-size: 10px; color: var(--atlas-text2); text-transform: uppercase; letter-spacing: 0.04em; }
  .astrip b { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 5px; }
  .adot { display: inline-block; width: 7px; height: 7px; border-radius: 4px; background: rgba(241, 245, 255, 0.25); }
  .adot.on { background: var(--atlas-accent); box-shadow: 0 0 4px var(--atlas-accent); }
  .aprog { display: block; height: 5px; border-radius: 3px; background: rgba(241, 245, 255, 0.08); overflow: hidden; }
  .aprog > i { display: block; height: 100%; background: var(--atlas-accent); border-radius: 3px; }
  .actls { display: flex; flex-wrap: wrap; gap: 6px; }
  .actl { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px; border-radius: 10px; font-size: 12px; border: 1px solid rgba(188, 200, 222, 0.2); background: rgba(241, 245, 255, 0.06); }
  .actl.on { border-color: var(--atlas-accent-glow); color: var(--atlas-accent); }
  .actl.stop { color: var(--atlas-crit); border-color: rgba(255, 114, 125, 0.45); }

  /* ---------- solar and heat pump views (step 10) ---------- */
  .solar-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 16px; align-items: start; }
  .sflow { margin: 4px 0 6px; }
  .sgauges { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 10px; }
  .sgauge { position: relative; display: flex; flex-direction: column; align-items: center; padding: 4px 0; }
  .sgauge svg { width: 104px; height: 104px; }
  .sgauge b { position: absolute; top: 40px; font-size: 15px; font-weight: 700; }
  .sgauge small { margin-top: -14px; font-size: 12px; color: var(--atlas-text2); }
  .sgauge:disabled { cursor: default; }
  .schart { width: 100%; height: auto; display: block; }
  .slegend { display: flex; flex-wrap: wrap; gap: 14px; font-size: 12px; }
  .slegend span { display: inline-flex; align-items: center; gap: 6px; }
  .slegend i { width: 12px; height: 4px; border-radius: 2px; display: inline-block; }
  .scbar { display: flex; flex-direction: column; gap: 6px; text-align: left; }
  .scbar b { font-size: 16px; }
  .scbar .mbar { flex: none; width: 100%; }
  .stable { display: flex; flex-direction: column; }
  .strow { display: grid; grid-template-columns: minmax(0, 1.2fr) repeat(3, minmax(0, 1fr)); gap: 8px; align-items: center; padding: 8px 0; border-top: 1px solid rgba(188, 200, 222, 0.08); font-size: 13px; }
  .strow.head { border-top: 0; font-size: 11px; color: var(--atlas-text2); text-transform: uppercase; letter-spacing: 0.04em; }
  .strow button { text-align: left; }
  .strow button:disabled { opacity: 0.4; }

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
    .appls { grid-template-columns: minmax(0, 1fr); }
    .solar-grid { grid-template-columns: minmax(0, 1fr); }
    .sgauges { grid-template-columns: repeat(2, minmax(0, 1fr)); }
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
`, tn = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, nn = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), rn = class {
	constructor(e) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(e, t, n) {
		this._$Ct = e, this._$AM = t, this._$Ci = n;
	}
	_$AS(e, t) {
		return this.update(e, t);
	}
	update(e, t) {
		return this.render(...t);
	}
}, an = class extends rn {
	constructor(e) {
		if (super(e), this.it = j, e.type !== tn.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
	}
	render(e) {
		if (e === j || e == null) return this._t = void 0, this.it = e;
		if (e === ct) return e;
		if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
		if (e === this.it) return this._t;
		this.it = e;
		let t = [e];
		return t.raw = t, this._t = {
			_$litType$: this.constructor.resultType,
			strings: t,
			values: []
		};
	}
};
an.directiveName = "unsafeHTML", an.resultType = 1;
// node_modules/lit-html/directives/unsafe-svg.js
var on = class extends an {};
on.directiveName = "unsafeSVG", on.resultType = 2;
var sn = nn(on), cn = {
	alert: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14 4a2 2 0 0 1 4 0l12 22a2 2 0 0 1-2 3H4a2 2 0 0 1-2-3Z\"/><path d=\"M16 11v8M16 24h.01\"/></g>",
	"arm-away": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m16 3 11 4v9c0 7-11 13-11 13S5 23 5 16V7Z\"/><path d=\"m11 16 4 4 7-9\"/></g>",
	attic: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m2 17 14-14 14 14M6 14v15h20V14\"/><path d=\"m11 15 5-5 5 5v8H11Z\"/></g>",
	automations: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 8h24M4 24h24M10 8v16M22 8v16\"/><circle cx=\"10\" cy=\"13\" r=\"3\" fill=\"currentColor\"/><circle cx=\"22\" cy=\"20\" r=\"3\" fill=\"currentColor\"/></g>",
	back: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m19 5-11 11 11 11M8 16h22\"/></g>",
	basement: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 29V3h17v26M21 29h7M10 16h2\"/><path d=\"M23 8h5v5M23 18h5v5\"/></g>",
	bedroom: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 9v20M29 14v15M3 23h26M3 14h23a3 3 0 0 1 3 3v6M6 14V9h7v5M16 14V9h7v5\"/></g>",
	blinds: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"3\" width=\"22\" height=\"25\" rx=\"1\"/><path d=\"M5 9h22M5 15h22M5 21h22M29 5v18\"/></g>",
	camera: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"8\" width=\"20\" height=\"17\" rx=\"3\"/><path d=\"m23 14 6-4v13l-6-4\"/><circle cx=\"12\" cy=\"16\" r=\"4\"/></g>",
	chevron: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m12 6 10 10-10 10\"/></g>",
	climate: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 20V7a4 4 0 0 1 8 0v13a7 7 0 1 1-8 0Z\"/><path d=\"M16 10v13\"/><circle cx=\"16\" cy=\"25\" r=\"2\"/></g>",
	"door-open": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 29V3h17v26M5 3l12 4v22L5 25M12 16h1M2 29h28\"/></g>",
	door: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 29V3h20v26M3 29h26M19 16h2\"/></g>",
	eco: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 27C1 11 14 4 29 3c0 16-8 27-24 24ZM5 27 23 9\"/></g>",
	energy: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m18 2-12 16h9l-1 12 12-17h-9Z\"/></g>",
	"garage-door": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m3 11 13-8 13 8v18H3Z\"/><path d=\"M7 15h18M7 20h18M7 25h18M12 13v14M20 13v14\"/></g>",
	garage: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m3 11 13-8 13 8v18H3Z\"/><path d=\"M7 15h18v14M7 20h18M7 25h18\"/></g>",
	grid: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m16 2-8 28M16 2l8 28M5 10h22M3 19h26M10 10l12 9M22 10 10 19M10 19l12 11M22 19 10 30\"/></g>",
	hallway: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 29V4h12v25M4 29h25M11 16h1M19 24h4v-5h4v-5h3\"/></g>",
	home: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 11 16 2l12 9v18H19V19h-6v10H4Z\"/></g>",
	humidity: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M16 2S5 15 5 21a11 11 0 0 0 22 0C27 15 16 2 16 2Z\"/><path d=\"M10 22a6 6 0 0 0 6 6\"/></g>",
	info: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"16\" cy=\"16\" r=\"13\"/><path d=\"M16 14v10M16 8h.01\"/></g>",
	"kids-room": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 9v20M29 14v15M3 23h26M3 14h23a3 3 0 0 1 3 3v6M6 14V9h7v5M16 14V9h7v5\"/><path d=\"m26 3 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z\"/></g>",
	kitchen: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"3\" width=\"22\" height=\"26\" rx=\"2\"/><path d=\"M5 14h22M10 7v3M10 19v5\"/></g>",
	light: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10 21a10 10 0 1 1 12 0l-2 4h-8ZM12 29h8M16 5v5\"/></g>",
	"lights-off": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10 21a10 10 0 1 1 12 0l-2 4h-8ZM12 29h8M2 2l28 28\"/></g>",
	living: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 18V9a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9M5 16a3 3 0 0 1 3 3v3h16v-3a3 3 0 0 1 6 0v7H2v-7a3 3 0 0 1 3-3ZM6 26v3M26 26v3\"/></g>",
	more: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"7\" cy=\"16\" r=\"1.5\"/><circle cx=\"16\" cy=\"16\" r=\"1.5\"/><circle cx=\"25\" cy=\"16\" r=\"1.5\"/></g>",
	night: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M23 5a12 12 0 1 0 4 19A14 14 0 0 1 23 5Z\"/></g>",
	office: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 17h26M6 17v12M26 17v12\"/><rect x=\"9\" y=\"3\" width=\"14\" height=\"10\" rx=\"1\"/><path d=\"M16 13v4\"/></g>",
	power: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M16 2v13M8 7a12 12 0 1 0 16 0\"/></g>",
	rooms: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"4\" width=\"9\" height=\"9\" rx=\"1\"/><rect x=\"19\" y=\"4\" width=\"9\" height=\"9\" rx=\"1\"/><rect x=\"4\" y=\"19\" width=\"9\" height=\"9\" rx=\"1\"/><rect x=\"19\" y=\"19\" width=\"9\" height=\"9\" rx=\"1\"/></g>",
	schedule: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"6\" width=\"24\" height=\"23\" rx=\"2\"/><path d=\"M10 2v8M22 2v8M4 13h24M10 19h3M19 19h3M10 24h3\"/></g>",
	search: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"13\" cy=\"13\" r=\"9\"/><path d=\"m20 20 9 9\"/></g>",
	security: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m16 3 11 4v9c0 7-11 13-11 13S5 23 5 16V7Z\"/></g>",
	server: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"3\" width=\"22\" height=\"26\" rx=\"2\"/><path d=\"M5 12h22M5 21h22M10 7h1M10 16h1M10 25h1M17 7h6M17 16h6M17 25h6\"/></g>",
	settings: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m12 3 1 4h6l1-4 5 3-2 4 3 5 4-1v6l-4-1-3 5 2 4-5 3-1-4h-6l-1 4-5-3 2-4-3-5-4 1v-6l4 1 3-5-2-4Z\"/><circle cx=\"16\" cy=\"17\" r=\"5\"/></g>",
	shelter: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m3 13 13-9 13 9v16H3Z\"/><rect x=\"10\" y=\"16\" width=\"12\" height=\"13\" rx=\"1\"/><circle cx=\"16\" cy=\"22\" r=\"3\"/><path d=\"M16 19v6M13 22h6\"/></g>",
	solar: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"16\" cy=\"16\" r=\"6\"/><path d=\"M16 2v4M16 26v4M2 16h4M26 16h4M6 6l3 3M23 23l3 3M6 26l3-3M23 9l3-3\"/></g>",
	stairs: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 28h7v-7h7v-7h7V7h7M3 18 25 3M25 3v7M25 3h-7\"/></g>",
	system: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 7h22M5 16h22M5 25h22\"/><circle cx=\"8\" cy=\"7\" r=\"1\"/><circle cx=\"8\" cy=\"16\" r=\"1\"/><circle cx=\"8\" cy=\"25\" r=\"1\"/></g>",
	temperature: "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 20V7a4 4 0 0 1 8 0v13a7 7 0 1 1-8 0Z\"/><path d=\"M16 10v13\"/><circle cx=\"16\" cy=\"25\" r=\"2\"/></g>",
	"wake-pc": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"4\" width=\"26\" height=\"18\" rx=\"2\"/><path d=\"M16 22v7M9 29h14M16 7v7M11 10a6 6 0 1 0 10 0\"/></g>"
}, W = (e, t = 20) => {
	let n = e ? cn[e] : void 0;
	return n ? k`<svg class="ic" aria-hidden="true" width=${t} height=${t} viewBox="0 0 32 32">${sn(n)}</svg>` : j;
}, ln = {
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
	car: "M3 16v-3l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5v3M3 16h18M7 16v2M17 16v2M6 12h12M7.5 14h.01M16.5 14h.01",
	lock: "M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3",
	unlock: "M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 6.8-1.2",
	horn: "M4 10v4h3l6 4V6L7 10zM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11",
	house: "M3 11l9-7 9 7v9H3zM9 20v-6h6v6",
	moon: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z",
	plane: "M10 14l-7-2v-2l7-1V4a2 2 0 0 1 4 0v5l7 1v2l-7 2v4l2 2v1l-4-1-4 1v-1l2-2z",
	shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
	shieldoff: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM4 4l16 16",
	refresh: "M20 11a8 8 0 0 0-14.6-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5L20 16M20 20v-4h-4"
}, G = (e, t = 20) => k`<svg aria-hidden="true" width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${A`<path d=${ln[e] ?? ln.dot}></path>`}</svg>`, un = (e) => {
	let t = e ?? "", n = A`<circle cx="14" cy="13" r="6" fill="#FFD27A"></circle>`, r = A`<path d="M10 26h20a7 7 0 0 0 0-14 9.5 9.5 0 0 0-18.3 2A6 6 0 0 0 10 26z" fill="#D3D8DE"></path>`, i = A`<path d="M14 28l-2 3M21 28l-2 3M28 28l-2 3" stroke="#5EC8FF" stroke-width="2" stroke-linecap="round"></path>`, a = A`<path d="M24 6a10 10 0 1 0 8 15A9 9 0 0 1 24 6z" fill="#D3D8DE"></path>`, o = A`${r}`;
	return t === "sunny" ? o = A`<circle cx="20" cy="15" r="8" fill="#FFD27A"></circle>` : t === "clear-night" ? o = a : t === "partlycloudy" ? o = A`${n}${r}` : (t.includes("rain") || t === "pouring" || t.includes("snow") || t === "hail") && (o = A`${r}${i}`), k`<svg aria-hidden="true" width="40" height="32" viewBox="0 0 40 32">${o}</svg>`;
}, dn = 6e4, fn = 36e5, pn = 864e5, K = (e, t, n = Date.now()) => {
	let r = t ? Date.parse(t) : NaN;
	if (!Number.isFinite(r)) return "";
	let i = e.locale?.language ?? e.language ?? "en", a = new Intl.RelativeTimeFormat(i, {
		numeric: "auto",
		style: "short"
	}), o = Math.max(0, n - r);
	return o < dn ? a.format(0, "minute") : o < fn ? a.format(-Math.floor(o / dn), "minute") : o < pn ? a.format(-Math.floor(o / fn), "hour") : o < 7 * pn ? a.format(-Math.floor(o / pn), "day") : new Date(r).toLocaleDateString(i, {
		day: "numeric",
		month: "short"
	});
}, mn = (e, t = "changed") => !e || t === "off" ? void 0 : t === "updated" ? e.last_updated : e.last_changed, hn = (e, t) => {
	if (!t) return "";
	let n = e.locale?.language ?? e.language ?? "en", r = (e) => Number.isFinite(Date.parse(e)) ? new Date(e).toLocaleString(n) : "-";
	return `${t.entity_id}\nLast changed: ${r(t.last_changed)}\nLast updated: ${r(t.last_updated)}`;
}, gn = [
	"car_lock",
	"car_doors_locked",
	"car_range",
	"car_odometer",
	"car_location",
	"car_daily_distance",
	"car_daily_trips",
	"car_monthly_distance",
	"car_monthly_trips",
	"car_last_updated",
	"car_flash",
	"car_horn",
	"car_refresh"
], _n = (e) => gn.map((t) => e[t]).filter((e) => !!e), vn = (e) => _n(e).length > 0, yn = (e, t) => {
	let n = z(e.hass, t.car_lock);
	if (t.car_lock) {
		if (B(n)) return {
			state: "unknown",
			text: "Unknown",
			entity: t.car_lock
		};
		let r = n.state;
		return {
			state: r === "locked" ? "locked" : r === "jammed" ? "jammed" : [
				"locking",
				"unlocking",
				"opening"
			].includes(r) ? "moving" : "unlocked",
			text: U(e.hass, n),
			entity: t.car_lock
		};
	}
	let r = z(e.hass, t.car_doors_locked);
	if (!t.car_doors_locked) return {
		state: "unknown",
		text: ""
	};
	if (B(r)) return {
		state: "unknown",
		text: "Unknown",
		entity: t.car_doors_locked
	};
	let i = t.car_doors_locked_when?.trim(), a = r.state, o = i ? a.toLowerCase() === i.toLowerCase() : R(r.entity_id) === "binary_sensor" ? a === "off" : a.toLowerCase() === "locked";
	return {
		state: o ? "locked" : "unlocked",
		text: o ? "Locked" : "Unlocked",
		entity: t.car_doors_locked
	};
}, bn = (e, t) => {
	let n = z(e.hass, t);
	return !n || B(n) ? "–" : U(e.hass, n);
}, xn = (e, t) => {
	let n = z(e.hass, t.car_last_updated);
	if (n && !B(n) && Number.isFinite(Date.parse(n.state))) return n.state;
	let r = _n(t).map((t) => e.hass.states[t]).filter((e) => !!e && !B(e) && ![
		"button",
		"input_button",
		"script"
	].includes(R(e.entity_id))).map((e) => e.last_updated).filter((e) => Number.isFinite(Date.parse(e))).sort();
	return r[r.length - 1];
}, Sn = () => A`<svg class="vsvg" viewBox="0 0 320 130" aria-hidden="true">
  <path d="M18 92 C18 78 26 72 40 70 L92 62 C112 40 140 30 178 30 L214 30 C238 30 256 42 270 60 L290 66 C302 69 306 76 306 88 L306 96 L18 96 Z"
    fill="var(--atlas-accent-soft)" stroke="var(--atlas-accent)" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M106 62 C122 44 144 38 172 38 L178 38 L178 62 Z M190 38 L212 38 C230 38 244 46 254 62 L190 62 Z" fill="rgba(241,245,255,0.12)" stroke="var(--atlas-accent)" stroke-width="2"/>
  <circle cx="84" cy="96" r="20" fill="#14171c" stroke="var(--atlas-accent)" stroke-width="3"/><circle cx="84" cy="96" r="7" fill="var(--atlas-accent)"/>
  <circle cx="246" cy="96" r="20" fill="#14171c" stroke="var(--atlas-accent)" stroke-width="3"/><circle cx="246" cy="96" r="7" fill="var(--atlas-accent)"/>
  <path d="M292 76 L304 78" stroke="#FFD27A" stroke-width="4" stroke-linecap="round"/>
</svg>`, Cn = (e, t) => {
	let n = R(t);
	return e.call(n, n === "script" ? "turn_on" : "press", { entity_id: t });
}, wn = (e, t) => {
	if (!vn(t)) return j;
	let n = t.car_name || "Vehicle", r = yn(e, t), i = !!z(e.hass, t.car_lock)?.attributes.code_format, a = ne(e.config, t.car_image), o = xn(e, t), s = z(e.hass, t.car_location), c = (a) => {
		if (!t.car_lock) return;
		if (i) return e.moreInfo(t.car_lock);
		let o = () => e.call("lock", a, { entity_id: t.car_lock });
		a === "unlock" ? e.confirm(`Unlock ${n}?`, `${n} is ${r.text.toLowerCase()}.`, o, "Unlock") : o();
	}, l = (t, n, r) => n ? k`<button class="vstat" @click=${() => e.moreInfo(n)}><b class="n">${bn(e, n)}</b><small>${t}${r ? ` · ${r}` : ""}</small></button>` : j, u = (t, n, r) => n || r ? k`<button class="vstat" @click=${() => e.moreInfo(n || r)}>
          <b class="n">${n ? bn(e, n) : "–"}</b>
          <small>${t}${r ? ` · ${bn(e, r)} trip${bn(e, r) === "1" ? "" : "s"}` : ""}</small>
        </button>` : j, d = (t, r, i, a = !1) => t ? k`<button class="sq vact" ?disabled=${z(e.hass, t)?.state === "unavailable"} title=${r}
          @click=${() => a ? e.confirm(`${r}?`, `${n}: ${r.toLowerCase()} now.`, () => Cn(e, t), r) : Cn(e, t)}>${G(i, 18)}<span>${r}</span></button>` : j;
	return k`<section class="glass card vehicle">
    <div class="row">
      <h2>${G("car", 20)}<span class="vname">${n}${t.car_subtitle ? k`<small class="t2">${t.car_subtitle}</small>` : j}</span></h2>
      ${r.text ? k`<button class="vlock ${r.state}" @click=${() => r.entity && e.moreInfo(r.entity)}>${G(r.state === "locked" ? "lock" : "unlock", 16)}${r.text}</button>` : j}
    </div>
    <div class="vbody">
      <div class="vpic">${a ? k`<img src=${a} alt=${n} loading="lazy" />` : Sn()}</div>
      <div class="vstats">
        ${l("Range", t.car_range)}
        ${l("Odometer", t.car_odometer)}
        ${t.car_location ? k`<button class="vstat" @click=${() => e.moreInfo(t.car_location)}><b>${bn(e, t.car_location)}</b><small>Location${s && !B(s) ? ` · ${K(e.hass, s.last_changed)}` : ""}</small></button>` : j}
        ${u("Today", t.car_daily_distance, t.car_daily_trips)}
        ${u("This month", t.car_monthly_distance, t.car_monthly_trips)}
      </div>
    </div>
    <div class="vfoot">
      <span class="t2 vupd">${o ? `Updated ${K(e.hass, o)}` : "No update time"}</span>
      <div class="vacts">
        ${t.car_lock ? k`<button class="sq vact" ?disabled=${r.state === "unknown" || r.state === "moving"} @click=${() => c(r.state === "locked" ? "unlock" : "lock")}>
              ${G(r.state === "locked" ? "unlock" : "lock", 18)}<span>${r.state === "locked" ? "Unlock" : "Lock"}</span></button>` : j}
        ${d(t.car_flash, "Flash lights", "bulb")}
        ${d(t.car_horn, "Honk horn", "horn", !0)}
        ${d(t.car_refresh, "Update data", "refresh")}
      </div>
    </div>
  </section>`;
}, Tn = 2, En = (e, t) => {
	let n = H(e.hass, t.power);
	return n === void 0 ? void 0 : n * 1e3;
}, Dn = (e, t) => {
	if (e === void 0) return "var(--atlas-text2)";
	let n = e / (t || 3e3);
	return n < .65 ? "var(--atlas-accent)" : n < .85 ? "var(--atlas-warn)" : "var(--atlas-crit)";
}, On = (e) => e === void 0 ? "–" : Math.abs(e) >= 1e4 ? `${(e / 1e3).toFixed(2)} kW` : `${Math.round(e)} W`, kn = (e, t) => {
	let n = Math.max(0, Math.min(1, e));
	return A`<svg class="ering" width="96" height="96" viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(241,245,255,0.08)" stroke-width="8" stroke-linecap="round"
      pathLength="100" stroke-dasharray="75 100" transform="rotate(135 50 50)"></circle>
    ${n > 0 ? A`<circle cx="50" cy="50" r="42" fill="none" stroke=${t} stroke-width="8" stroke-linecap="round"
          pathLength="100" stroke-dasharray=${`${(n * 75).toFixed(1)} 100`} transform="rotate(135 50 50)"></circle>` : j}
  </svg>`;
}, An = (e, t) => {
	if (!t.power) return j;
	let n = Number(t.power_max) > 0 ? Number(t.power_max) : 3e3, r = En(e, t), i = Dn(r, n), a = r === void 0 ? "Offline" : r < Tn ? "Standby" : "Consuming", o = V(e.hass, t.power_energy), s = V(e.hass, t.power_current);
	return k`<section class="glass card rpower">
    <div class="row"><h2>${G("power", 20)}Power</h2><span class="n t2" style="font-size:12px">of ${On(n)}</span></div>
    <button class="rpbody" @click=${() => e.moreInfo(t.power)}>
      <span class="rpring">${kn(r === void 0 ? 0 : r / n, i)}<b class="n" style="color:${i}">${On(r)}</b></span>
      <span class="rptxt">
        <b style="color:${i}">${a}</b>
        ${t.power_energy ? k`<small class="t2">Energy <span class="n">${o === void 0 ? "–" : `${o.toFixed(2)} kWh`}</span></small>` : j}
        ${t.power_current ? k`<small class="t2">Current <span class="n">${s === void 0 ? "–" : `${s.toFixed(2)} A`}</span></small>` : j}
      </span>
    </button>
  </section>`;
}, jn = {
	start: 1,
	pause: 2,
	dock: 4
}, Mn = {
	mowing: "Mowing",
	paused: "Paused",
	returning: "Returning",
	docked: "Docked",
	idle: "Idle",
	error: "Error"
}, Nn = (e) => {
	let t = Number(e?.attributes.supported_features ?? 0), n = !!e && !B(e);
	return {
		start: (t & jn.start) !== 0 && n && e.state !== "mowing",
		pause: (t & jn.pause) !== 0 && n && e.state !== "paused" && ["mowing", "returning"].includes(e.state),
		dock: (t & jn.dock) !== 0 && n && e.state !== "docked",
		showStart: (t & jn.start) !== 0,
		showPause: (t & jn.pause) !== 0,
		showDock: (t & jn.dock) !== 0
	};
}, Pn = (e, t) => {
	if (!t.mower) return j;
	let n = z(e.hass, t.mower), r = t.mower_name || String(n?.attributes.friendly_name ?? "Mower"), i = n ? B(n) ? "Unavailable" : Mn[n.state] ?? U(e.hass, n) : "Not found", a = !n || B(n) || n.state === "error" ? "bad" : n.state === "mowing" ? "on" : n.state === "returning" || n.state === "paused" ? "mid" : "", o = V(e.hass, t.mower_battery), s = o === void 0 ? "var(--atlas-text2)" : o > 50 ? "var(--atlas-accent)" : o > 20 ? "var(--atlas-warn)" : "var(--atlas-crit)", c = Nn(n), l = (n) => e.call("lawn_mower", n, { entity_id: t.mower }), u = c.showPause && n && ["mowing", "returning"].includes(n.state);
	return k`<section class="glass card mower">
    <div class="row">
      <h2>${G("mower", 20)}${r}</h2>
      <button class="mbadge ${a}" @click=${() => e.moreInfo(t.mower)}>${i}</button>
    </div>
    <span class="t2" style="font-size:12px">${n && !B(n) ? `${i} since ${K(e.hass, n.last_changed)}` : t.mower}</span>
    ${t.mower_battery ? k`<button class="mbatt" @click=${() => e.moreInfo(t.mower_battery)}>
          <small class="t2">Battery</small><i class="mbar"><i style="width:${o === void 0 ? 0 : Math.max(0, Math.min(100, o))}%;background:${s}"></i></i>
          <b class="n" style="color:${s}">${o === void 0 ? "–" : `${Math.round(o)} %`}</b>
        </button>` : j}
    <div class="mbtns">
      ${u ? k`<button class="sq" ?disabled=${!c.pause} @click=${() => l("pause")}>Pause</button>` : c.showStart ? k`<button class="sq on" ?disabled=${!c.start} @click=${() => l("start_mowing")}>Start mowing</button>` : j}
      ${c.showDock ? k`<button class="sq" ?disabled=${!c.dock} @click=${() => l("dock")}>Return to dock</button>` : j}
    </div>
  </section>`;
}, Fn = (e, t) => {
	let n = V(e.hass, t.salt_level);
	if (n !== void 0) return Math.max(0, Math.min(100, n > 1 ? n : n * 100));
}, In = (e) => Number.isFinite(Number(e.salt_warn_below)) && e.salt_warn_below !== void 0 ? Number(e.salt_warn_below) : 30, Ln = (e) => e === void 0 ? "var(--atlas-text2)" : e < 30 ? "var(--atlas-crit)" : e < 60 ? "var(--atlas-warn)" : "var(--atlas-accent)", Rn = (e, t) => {
	if (!t.salt_level) return j;
	let n = Fn(e, t), r = n !== void 0 && n < In(t), i = Ln(n), a = z(e.hass, t.salt_distance);
	return k`<section class="glass card salt">
    <div class="row"><h2>${G("drop", 20)}${t.salt_name || "Salt level"}</h2>${r ? k`<span class="badge">Buy salt</span>` : j}</div>
    <button class="saltbody" @click=${() => e.moreInfo(t.salt_level)}>
      <span class="salttank"><i style="height:${n ?? 0}%;background:${i}"></i></span>
      <span class="rptxt">
        <b class="n" style="font-size:30px;color:${i}">${n === void 0 ? "–" : `${Math.round(n)} %`}</b>
        <small class="t2">${n === void 0 ? "Sensor unavailable" : r ? `Below ${In(t)} %, refill the softener` : "full"}</small>
        ${t.salt_distance ? k`<small class="t2">Reading <span class="n">${a && !B(a) ? U(e.hass, a) : "–"}</span></small>` : j}
      </span>
    </button>
  </section>`;
}, zn = (e) => [
	e.power,
	e.power_energy,
	e.power_current,
	e.mower,
	e.mower_battery,
	e.salt_level,
	e.salt_distance
].filter((e) => !!e), Bn = (e) => !!e && [
	"on",
	"true",
	"home",
	"open"
].includes(e.state.toLowerCase()), Vn = (e, t) => {
	let n = z(e.hass, t);
	return !n || B(n) ? "–" : U(e.hass, n);
}, Hn = (e, t) => {
	if (Bn(z(e.hass, t.entity))) return !0;
	let n = z(e.hass, t.operation)?.state.toLowerCase() ?? "";
	return [
		"run",
		"active",
		"heat",
		"progress"
	].some((e) => n.includes(e));
}, Un = (e) => {
	let t = e.toLowerCase();
	return t.includes("ready") ? "ready" : [
		"run",
		"active",
		"heat",
		"progress"
	].some((e) => t.includes(e)) ? "active" : "idle";
}, Wn = (e, t) => {
	let n = z(e.hass, t);
	if (!n || B(n)) return "–";
	let r = Date.parse(n.state);
	if (n.attributes.device_class === "timestamp" || Number.isFinite(r) && /\d{4}-\d{2}-\d{2}T/.test(n.state)) {
		let t = e.hass.locale?.language ?? e.hass.language ?? "en", n = new Date(r).toLocaleTimeString(t, {
			hour: "2-digit",
			minute: "2-digit"
		}), i = Math.round((r - Date.now()) / 6e4);
		return i > 0 ? `${n} · ${i >= 60 ? `${Math.floor(i / 60)} h ${i % 60}` : `${i} min`}` : n;
	}
	return U(e.hass, n);
}, Gn = (e, t) => {
	let n = Math.max(0, Math.min(1, e));
	return A`<svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(241,245,255,0.1)" stroke-width="4"></circle>
    ${n > 0 ? A`<circle cx="24" cy="24" r="20" fill="none" stroke=${t} stroke-width="4" stroke-linecap="round" pathLength="100" stroke-dasharray=${`${(n * 100).toFixed(1)} 100`} transform="rotate(-90 24 24)"></circle>` : j}
  </svg>`;
}, Kn = (e, t) => {
	let n = z(e.hass, t.entity), r = Hn(e, t), i = !!t.entity && B(n), a = Bn(n), o = i ? "–" : a || r ? "On" : "Off", s = V(e.hass, t.temperature), c = Number(t.temperature_max) > 0 ? Number(t.temperature_max) : 300, l = s === void 0 ? "var(--atlas-text2)" : s / c > .6 ? "var(--atlas-crit)" : s / c > .25 ? "var(--atlas-warn)" : "var(--atlas-accent)", u = String(z(e.hass, t.temperature)?.attributes.unit_of_measurement ?? "°C"), d = z(e.hass, t.operation), f = z(e.hass, t.door), p = !!f && !B(f) && (Bn(f) || f.state.toLowerCase() === "open"), m = V(e.hass, t.progress), h = V(e.hass, t.setpoint), g = [];
	if (t.setpoint && g.push(["Setpoint", h !== void 0 && h > 0 ? `${Math.round(h)}${u}` : "–"]), t.program && g.push(["Program", Vn(e, t.program)]), t.progress && g.push(["Progress", m !== void 0 && m > 0 ? `${Math.round(m)} %` : "–"]), t.finish && g.push(["Finish", Wn(e, t.finish)]), t.remote) {
		let n = z(e.hass, t.remote);
		g.push(["Remote start", k`<i class="adot ${Bn(n) ? "on" : ""}"></i>${Vn(e, t.remote)}`]);
	}
	let _ = (t) => {
		let n = z(e.hass, t);
		return !!n && n.state !== "unavailable";
	}, v = r ? (t.controls ?? []).filter(_) : [], y = (n) => {
		let r = z(e.hass, n), i = R(n), a = String(r.attributes.friendly_name ?? n).replace(RegExp(`^${t.name}\\s*`, "i"), ""), o = ["switch", "input_boolean"].includes(i);
		return k`<button class="actl ${o && r.state === "on" ? "on" : ""}" @click=${() => o ? e.call(i, "toggle", { entity_id: n }) : e.call(i, i === "script" ? "turn_on" : "press", { entity_id: n })}>${o ? k`<i class="adot ${r.state === "on" ? "on" : ""}"></i>` : j}${a}</button>`;
	}, b = t.stop && r && _(t.stop) ? t.stop : void 0, x = n ? K(e.hass, n.last_changed) : "", S = t.entity || t.operation || t.program;
	return k`<div class="appl ${r ? "run" : ""} ${i ? "na" : ""}">
    <button class="ahead" @click=${() => S && e.moreInfo(S)}>
      ${t.temperature ? k`<span class="aarc">${Gn(s === void 0 ? 0 : s / c, l)}<b class="n" style="color:${l}">${s === void 0 ? "–" : Math.round(s)}</b></span>` : k`<span class="chipi aico">${t.icon ? k`<ha-icon .icon=${t.icon} style="--mdc-icon-size:20px"></ha-icon>` : G(/oven|stove|cook/i.test(t.name) ? "oven" : "washer", 20)}</span>`}
      <span class="atxt">
        <b>${t.name}</b>
        <small class="t2">
          ${d && !B(d) ? k`<span class="apill ${Un(d.state)}"><i></i>${U(e.hass, d)}</span>` : j}
          ${f && !B(f) ? k`<span class="adoor ${p ? "open" : ""}">${G("door", 13)}${U(e.hass, f)}</span>` : j}
          ${(!d || B(d)) && (!f || B(f)) ? x : j}
        </small>
      </span>
      <span class="abadge ${o === "On" ? "on" : ""}">${o}</span>
    </button>
    ${g.length ? k`<div class="astrip" style="grid-template-columns:repeat(${Math.min(g.length, 4)}, minmax(0, 1fr))">
          ${g.map(([e, t]) => k`<span><small>${e}</small><b class="n">${t}</b></span>`)}
        </div>` : j}
    ${m !== void 0 && m > 0 ? k`<i class="aprog"><i style="width:${Math.min(100, m)}%"></i></i>` : j}
    ${v.length || b ? k`<div class="actls">
          ${v.map(y)}
          ${b ? k`<button class="actl stop" @click=${() => e.confirm(`Stop ${t.name}?`, "The running program will be cancelled.", () => e.call(R(b), R(b) === "script" ? "turn_on" : "press", { entity_id: b }), "Stop")}>Stop</button>` : j}
        </div>` : j}
  </div>`;
}, qn = (e, t) => {
	let n = (t.appliances ?? []).filter((e) => e && e.name);
	if (!n.length) return j;
	let r = n.filter((t) => Hn(e, t)).length;
	return k`<section class="glass card appliances">
    <div class="row"><h2>${G("oven", 20)}Appliances</h2><span class="n t2" style="font-size:12px">${r ? `${r} running` : "All idle"}</span></div>
    <div class="appls">${n.map((t) => Kn(e, t))}</div>
  </section>`;
}, Jn = (e) => (e.appliances ?? []).flatMap((e) => [
	e.entity,
	e.operation,
	e.program,
	e.door,
	e.temperature,
	e.setpoint,
	e.progress,
	e.finish,
	e.remote,
	e.stop,
	...e.controls ?? []
]).filter((e) => !!e), Yn = (e, t = " °C") => e === void 0 ? "–" : `${e.toFixed(1)}${t}`, Xn = (e) => e === void 0 ? "" : `${Math.round(e)} % RH`, Zn = (e, t) => {
	if (e.config.appearance?.light_mood === !1) return;
	let n = le(e.config, t);
	if (!n.length) return;
	let { on: r, level: i, brightness: a } = ue(e.hass, n);
	return {
		state: r === 0 ? "dark" : i >= .95 ? "lit" : "part",
		vars: r === 0 ? "--lb:0.42;--ls:0.55;--lg:0" : `--lb:${(.6 + .45 * i).toFixed(2)};--ls:${(.8 + .32 * i).toFixed(2)};--lg:${(.28 * i).toFixed(2)}`,
		text: r === 0 ? "Off" : a < 100 ? `${r} on · ${a} %` : `${r} on`,
		ids: n
	};
}, Qn = (e, t, n = "", r) => {
	let i = V(e.hass, t.temperature), a = V(e.hass, t.humidity), o = e.badges.get(t.id), s = re(e.config, t), c = t.temperature || t.humidity ? Xn(a) || (t.humidity ? "no reading" : "") : "no climate sensor", l = s ? Zn(e, t) : void 0;
	return k`<button class="tile ${n} ${o ? "alert" : ""} ${l ? `mood ${l.state}` : ""}" style=${l?.vars ?? ""} aria-label="Open ${t.name}" @click=${() => e.openRoom(t)}>
    ${s ? k`<img src=${s} alt="" loading="lazy" />${l ? k`<span class="glow"></span>` : j}<span class="shade"></span>` : j}
    <span class="top">${W(t.icon, 26)}<span class="tright">${l ? k`<span class="lchip ${l.state}" title="Room lights">${G("bulb", 13)}${l.text}</span>` : j}${o ? k`<span class="badge ${o.severity === "critical" ? "critical" : ""}">${o.text}</span>` : j}</span></span>
    <span class="bot">
      <span class="info">
        <span class="name">${t.name}</span>
        ${t.temperature ? k`<span class="temp n ${e.hot.has(t.id) ? "hot" : ""}">${Yn(i)}</span>` : j}
        <span class="hum n">${[c, r].filter(Boolean).join(" · ")}</span>
      </span>
      <span class="go">${W("chevron", 14)}</span>
    </span>
  </button>`;
}, $n = {
	critical: "var(--atlas-crit)",
	warning: "var(--atlas-warn)",
	info: "var(--atlas-info)"
}, er = (e, t, n) => {
	let r = (Array.isArray(t) ? t : t && typeof t == "object" ? [t] : []).filter((e) => e && typeof e == "object");
	return r.length ? k`<div class="owncards ${n}">${r.map((t) => k`<atlas-hui-card .config=${t} .hass=${e.hass}></atlas-hui-card>`)}</div>` : j;
}, q = (e, ...t) => t.some((t) => e.includes(t)), tr = [
	"door",
	"garage_door",
	"opening",
	"window"
], nr = [
	"motion",
	"occupancy",
	"presence"
], rr = (e) => {
	if (!e || R(e.entity_id) !== "binary_sensor") return !1;
	let t = String(e.attributes.device_class ?? "");
	return nr.includes(t) ? !1 : tr.includes(t) || q(e.entity_id, "contact", "window", "door", "skylight", "velux");
}, ir = (e) => {
	if (!e || R(e.entity_id) !== "binary_sensor" || rr(e)) return !1;
	let t = String(e.attributes.device_class ?? "");
	return nr.includes(t) || q(e.entity_id, "motion", "presence", "occupancy");
}, ar = (e, t) => {
	let n = R(e), r = String(t?.attributes.device_class ?? "");
	return n === "binary_sensor" ? r === "window" || q(e, "window", "skylight", "velux") ? "window" : r === "garage_door" ? "garage" : q(e, "mailbox", "letterbox") ? "mail" : r === "door" || r === "opening" || q(e, "door") ? "door" : nr.includes(r) || q(e, "motion", "presence", "person", "occupancy") ? "motion" : "dot" : n === "light" ? "bulb" : n === "fan" ? "fan" : n === "media_player" ? "tv" : n === "cover" ? "garage" : n === "camera" ? "camera" : n === "climate" ? "heat" : n === "switch" ? q(e, "water", "valve", "irrig") ? "drop" : "power" : n === "select" ? "washer" : q(e, "print") ? "printer" : q(e, "mower") ? "mower" : q(e, "oven") ? "oven" : q(e, "washer", "dryer") ? "washer" : r === "temperature" ? "thermo" : r === "battery" ? "power" : "dot";
}, or = [
	"light",
	"switch",
	"fan",
	"input_boolean"
], sr = [
	"button",
	"input_button",
	"script"
], cr = (e) => e.tap ?? (or.includes(R(e.entity)) ? "toggle" : "more-info"), lr = 1, ur = 2, dr = 8, fr = (e) => {
	let t = Number(e?.attributes.supported_features ?? 0);
	return {
		open: (t & lr) !== 0,
		close: (t & ur) !== 0,
		stop: (t & dr) !== 0
	};
}, pr = (e) => {
	if (!e || e.state === "unavailable") return {
		open: !1,
		close: !1,
		stop: !1
	};
	let t = e.attributes.assumed_state === !0, n = e.attributes.current_position, r = typeof n == "number" ? n : void 0, i = r === void 0 ? e.state === "open" : r === 100, a = r === void 0 ? e.state === "closed" : r === 0;
	return {
		open: t || !i && e.state !== "opening",
		close: t || !a && e.state !== "closing",
		stop: !0
	};
}, mr = (e, t) => e.confirm ?? ["garage", "gate"].includes(String(t?.attributes.device_class ?? "")), hr = (e) => !!e && e.state === "unknown" && ["button", "input_button"].includes(R(e.entity_id)), gr = (e) => {
	if (hr(e)) return "idle";
	if (B(e)) return "na";
	let t = R(e.entity_id), n = e.state;
	return t === "binary_sensor" ? n === "on" ? rr(e) ? "open" : "on" : "idle" : t === "cover" ? n === "open" || n === "opening" ? "open" : "idle" : or.includes(t) ? n === "on" ? "on" : "idle" : t === "media_player" ? [
		"off",
		"standby",
		"idle"
	].includes(n) ? "idle" : "on" : t === "climate" ? n === "off" ? "idle" : "on" : "idle";
}, _r = (e, t) => {
	if (!t) return "Not found";
	if (t.state === "unavailable") return "Unavailable";
	if (hr(t)) return "Never pressed";
	if (t.state === "unknown") return "Unknown";
	let n = R(t.entity_id);
	if (n === "light" && t.state === "on" && typeof t.attributes.brightness == "number") return `On · ${Math.round(t.attributes.brightness / 255 * 100)} %`;
	if (n === "climate") {
		let e = t.attributes.hvac_action ? String(t.attributes.hvac_action) : t.state, n = t.attributes.current_temperature;
		return `${e.charAt(0).toUpperCase()}${e.slice(1)}${n == null ? "" : ` · ${n} °C`}`;
	}
	return U(e, t);
}, J = (e, t) => t.name || String(e.states[t.entity]?.attributes.friendly_name ?? t.entity), vr = [
	{
		state: "armed_home",
		label: "Home",
		feature: 1,
		service: "alarm_arm_home",
		g: "house"
	},
	{
		state: "armed_away",
		label: "Away",
		feature: 2,
		service: "alarm_arm_away",
		g: "lock"
	},
	{
		state: "armed_night",
		label: "Night",
		feature: 4,
		service: "alarm_arm_night",
		g: "moon"
	},
	{
		state: "armed_vacation",
		label: "Vacation",
		feature: 32,
		service: "alarm_arm_vacation",
		g: "plane"
	},
	{
		state: "armed_custom_bypass",
		label: "Custom bypass",
		feature: 16,
		service: "alarm_arm_custom_bypass",
		g: "shield"
	}
], yr = (e) => {
	let t = Number(e?.attributes.supported_features ?? 0);
	return vr.filter((e) => (t & e.feature) !== 0);
}, br = (e, t) => !!e?.attributes.code_format && (!t || !!e.attributes.code_arm_required), xr = (e) => B(e) ? "na" : e.state === "triggered" ? "crit" : [
	"arming",
	"pending",
	"disarming"
].includes(e.state) ? "warn" : e.state.startsWith("armed") ? "armed" : "calm", Sr = (e, t) => ee(e.config, t) ?? String(e.hass.states[t]?.attributes.friendly_name ?? t), Cr = (e) => {
	let t = e.config.entities?.alarm;
	if (!t) return j;
	let n = z(e.hass, t), r = xr(n), i = yr(n), a = n?.attributes.changed_by, o = (r) => {
		if (br(n, !0)) return e.moreInfo(t);
		e.confirm(`Arm ${r.label.toLowerCase()}?`, `The alarm will arm in ${r.label.toLowerCase()} mode.`, () => e.call("alarm_control_panel", r.service, { entity_id: t }), "Arm");
	}, s = () => {
		if (br(n, !1)) return e.moreInfo(t);
		e.confirm("Disarm the alarm?", `The alarm is ${n ? U(e.hass, n).toLowerCase() : "unknown"}.`, () => e.call("alarm_control_panel", "alarm_disarm", { entity_id: t }), "Disarm");
	}, c = n?.state === "disarmed";
	return k`<section class="glass card alarm ${r}">
    <div class="row">
      <h2>${W("security", 20)}Alarm</h2>
      <button class="t2 more" @click=${() => e.moreInfo(t)}>Details ${W("chevron", 14)}</button>
    </div>
    <button class="astate" @click=${() => e.moreInfo(t)}>
      <span class="aico">${G(r === "calm" ? "shieldoff" : "shield", 30)}</span>
      <span class="atxt"><b>${n ? B(n) ? "Unavailable" : U(e.hass, n) : "Not found"}</b>
        <small class="t2">${n && !B(n) ? `Since ${K(e.hass, n.last_changed)}` : t}${a ? ` · by ${a}` : ""}</small></span>
    </button>
    <div class="amodes">
      ${i.map((e) => k`<button class="sq ${n?.state === e.state ? "on" : ""}" aria-pressed=${n?.state === e.state ? "true" : "false"}
          ?disabled=${B(n) || n?.state === e.state} @click=${() => o(e)}>${G(e.g, 18)}<span>${e.label}</span></button>`)}
      <button class="sq dis" ?disabled=${B(n) || c} @click=${s}>${G("shieldoff", 18)}<span>Disarm</span></button>
    </div>
    ${!i.length && n && !B(n) ? k`<p class="t2" style="font-size:12px;margin:0">This panel reports no arm modes. Use Details to control it.</p>` : j}
  </section>`;
}, wr = (e, t, n, r, i = j) => {
	let a = e.hass.states[t], o = E(e.config, t);
	return k`<div class="srow ${r}">
    <button class="smain" @click=${() => e.moreInfo(t)}>
      <span class="sic">${G(R(t) === "lock" ? a?.state === "locked" ? "lock" : "unlock" : ar(t, a), 18)}</span>
      <span class="atxt"><b>${Sr(e, t)}</b><small class="t2">${o ? `${o.name} · ` : ""}${n}${a && !B(a) ? ` · ${K(e.hass, a.last_changed)}` : ""}</small></span>
    </button>
    ${i}
  </div>`;
}, Tr = (e) => {
	let t = e.config.alerts ?? {}, n = g(e.config).flatMap((e) => (e.devices ?? []).map((e) => e.entity)).filter((t) => rr(e.hass.states[t]) || R(t) === "cover"), r = new Set([t.mailbox].filter(Boolean));
	return [.../* @__PURE__ */ new Set([
		...t.exterior_doors ?? [],
		...t.interior_doors ?? [],
		...n
	])].filter((e) => !r.has(e));
}, Er = (e) => B(e) ? 1 : Pt(e) ? 0 : 2, Dr = (e) => {
	let t = Tr(e);
	if (!t.length) return j;
	let n = new Set(e.config.alerts?.exterior_doors ?? []), r = [...t].sort((t, n) => Er(e.hass.states[t]) - Er(e.hass.states[n])), i = t.filter((t) => !B(e.hass.states[t]) && Pt(e.hass.states[t])).length, a = t.filter((t) => B(e.hass.states[t])).length;
	return k`<section class="glass card">
    <div class="row"><h2>${G("door", 20)}Doors and windows</h2>
      <span class="n t2" style="font-size:12px">${i} open · ${t.length - i - a} closed${a ? ` · ${a} n/a` : ""}</span></div>
    <div class="slist">
      ${r.map((t) => {
		let r = e.hass.states[t], i = B(r), a = !i && Pt(r);
		return wr(e, t, `${r ? i ? "Unavailable" : U(e.hass, r) : "Not found"}${n.has(t) ? " · exterior" : ""}`, i ? "na" : a ? n.has(t) ? "warn" : "open" : "");
	})}
    </div>
  </section>`;
}, Or = (e) => [...new Set(g(e.config).flatMap((e) => [...(e.devices ?? []).map((e) => e.entity).filter((e) => R(e) === "lock"), ...e.car_lock ? [e.car_lock] : []]))], kr = (e) => {
	let t = Or(e);
	if (!t.length) return j;
	let n = t.filter((t) => {
		let n = e.hass.states[t];
		return !B(n) && n.state !== "locked";
	}).length;
	return k`<section class="glass card">
    <div class="row"><h2>${G("lock", 20)}Locks</h2><span class="n t2" style="font-size:12px">${n ? `${n} not locked` : "All locked"}</span></div>
    <div class="slist">
      ${t.map((t) => {
		let n = e.hass.states[t], r = B(n), i = n?.state === "locked", a = [
			"locking",
			"unlocking",
			"opening"
		].includes(n?.state ?? ""), o = Sr(e, t);
		return wr(e, t, n ? r ? "Unavailable" : U(e.hass, n) : "Not found", r ? "na" : i ? "" : "warn", k`<button class="sq sbtn" ?disabled=${r || a} @click=${() => {
			if (n?.attributes.code_format) return e.moreInfo(t);
			i ? e.confirm(`Unlock ${o}?`, `${o} is locked.`, () => e.call("lock", "unlock", { entity_id: t }), "Unlock") : e.call("lock", "lock", { entity_id: t });
		}}>${G(i ? "unlock" : "lock", 16)}<span>${i ? "Unlock" : "Lock"}</span></button>`);
	})}
    </div>
  </section>`;
}, Ar = (e) => {
	let t = [...new Set(g(e.config).flatMap((e) => (e.devices ?? []).map((e) => e.entity)))].filter((t) => ir(e.hass.states[t]));
	if (!t.length) return j;
	let n = t.filter((t) => e.hass.states[t]?.state === "on"), r = [...t].sort((t, n) => Number(e.hass.states[n]?.state === "on") - Number(e.hass.states[t]?.state === "on"));
	return k`<section class="glass card">
    <div class="row"><h2>${G("motion", 20)}Motion and presence</h2><span class="n t2" style="font-size:12px">${n.length ? `${n.length} detected` : "All clear"}</span></div>
    <div class="slist">
      ${r.map((t) => {
		let n = e.hass.states[t], r = B(n);
		return wr(e, t, n ? r ? "Unavailable" : U(e.hass, n) : "Not found", r ? "na" : n.state === "on" ? "open" : "");
	})}
    </div>
  </section>`;
}, jr = (e, t, n, r, i = !1) => {
	let a = z(e.hass, t), o = !i && !!a && !B(a) && !!a.attributes.entity_picture, s = o ? `${a.attributes.entity_picture}&width=640&height=360&t=${Math.floor(e.tick / 1e4)}` : void 0, c = !i && !o;
	return k`<button class="cam ${c ? "na" : ""}" aria-label="${n} camera" @click=${r}>
    ${s ? k`<img src=${s} alt="" />` : k`<span class="camna">${W("camera", 22)}${i ? "Private · open the room" : t ? "Camera unavailable" : "No camera"}</span>`}
    <span class="lbl"><i class="dotst ${c ? "na" : ""}"></i>${n}</span>
  </button>`;
}, Mr = (e) => {
	let t = oe(e.config);
	return t.length ? k`<section class="glass card">
    <div class="row"><h2>${W("camera", 20)}Cameras</h2><span class="n t2" style="font-size:12px">${t.length} camera${t.length === 1 ? "" : "s"} · stills every 10 s</span></div>
    <div class="cams scams">
      ${t.map((t) => jr(e, t.camera, t.rooms.map((e) => e.name).join(" · "), () => e.openRoom(t.rooms[0]), t.rooms.some((e) => e.camera_private)))}
    </div>
  </section>` : j;
}, Nr = (e) => {
	let t = z(e.hass, e.config.entities?.alarm), n = Tr(e), r = n.filter((t) => !B(e.hass.states[t]) && Pt(e.hass.states[t])).length, i = oe(e.config).length;
	return k`
    <section class="hero" aria-label="Security">
      <h1 class="sm">Security</h1>
      <p class="n">${[
		t ? B(t) ? "Alarm unavailable" : `Alarm ${U(e.hass, t).toLowerCase()}` : "",
		n.length ? `${r} open` : "",
		i ? `${i} camera${i === 1 ? "" : "s"}` : ""
	].filter(Boolean).join(" · ")}</p>
    </section>
    <div class="sec-grid">
      <div class="col">${Cr(e)}${Dr(e)}${kr(e)}</div>
      <div class="col">${Mr(e)}${Ar(e)}</div>
    </div>
  `;
}, Pr = (e) => {
	let t = e.config.entities?.persons ?? [];
	return t.length ? k`<div class="presence" role="list" aria-label="Presence: ${t.filter((t) => e.hass.states[t]?.state === "home").length} of ${t.length} home">
    ${t.map((t) => {
		let n = e.hass.states[t], r = String(n?.attributes.friendly_name ?? t.split(".")[1] ?? t), i = B(n), a = n?.state === "home", o = n?.attributes.entity_picture, s = n ? i ? "Unknown" : U(e.hass, n) : "Not found";
		return k`<button role="listitem" class="pchip ${a ? "home" : ""} ${i ? "na" : ""}" title="${r}: ${s}${n && !i ? `, ${K(e.hass, n.last_changed)}` : ""}"
        @click=${() => e.moreInfo(t)}>
        <span class="pav">${o ? k`<img src=${o} alt="" />` : r.charAt(0).toUpperCase()}<i></i></span>
        <span class="ptxt"><b>${r}</b><small>${s}</small></span>
      </button>`;
	})}
  </div>` : j;
}, Fr = (e) => typeof e == "number" && Number.isFinite(e) ? Math.round(e) : void 0, Ir = (e) => {
	let t = e.config.entities?.weather;
	if (!t) return j;
	let n = z(e.hass, t);
	if (B(n)) return j;
	let r = n.attributes, i = Ut(n), a = e.ui.wxType && i.includes(e.ui.wxType) ? e.ui.wxType : i[0], o = (a ? e.forecasts[Bt(t, a)] : void 0) ?? (Array.isArray(r.forecast) ? r.forecast : []), s = e.hass.locale?.language ?? e.hass.language ?? "en", c = a === "hourly", l = (o ?? []).slice(0, c ? 6 : 5), u = (e) => {
		let t = new Date(e);
		return Number.isNaN(t.getTime()) ? "" : c ? t.toLocaleTimeString(s, {
			hour: "2-digit",
			minute: "2-digit"
		}) : t.toLocaleDateString(s, { weekday: "short" });
	}, d = Fr(r.temperature), f = String(r.temperature_unit ?? "°C"), p = Fr(r.wind_speed), m = [p === void 0 ? "" : `Wind ${p} ${r.wind_speed_unit ?? "km/h"}${Yt(r.wind_bearing) ? ` ${Yt(r.wind_bearing)}` : ""}`, Fr(r.humidity) === void 0 ? "" : `Humidity ${Fr(r.humidity)} %`].filter(Boolean);
	return k`<div class="wxstrip" role="group" aria-label="Weather forecast">
    ${i.length > 1 ? k`<div class="wxseg" role="group" aria-label="Forecast type">
          ${i.map((t) => k`<button class=${t === a ? "on" : ""} aria-pressed=${t === a ? "true" : "false"} @click=${() => {
		e.ui.wxType = t, e.refresh();
	}}>${t === "daily" ? "Days" : "Hours"}</button>`)}
        </div>` : j}
    <button class="wxfc" title=${`${Kt(n.state)}${d === void 0 ? "" : ` ${d}${f}`}${m.length ? ` · ${m.join(" · ")}` : ""}`} @click=${() => e.moreInfo(t)}>
      ${l.length ? l.map((e) => {
		let t = Fr(e.temperature), n = Fr(e.templow), r = Fr(e.precipitation_probability);
		return k`<span class="wxday">
              <small>${u(e.datetime)}</small>
              ${un(e.condition)}
              <b class="n">${t === void 0 ? "–" : `${t}°`}${n === void 0 ? j : k`<span class="t2">${n}°</span>`}</b>
              ${r ? k`<small class="wxpp">${r} %</small>` : j}
            </span>`;
	}) : k`<span class="wxnone t2">${i.length ? "Loading forecast..." : `${Kt(n.state)} · no forecast`}</span>`}
    </button>
  </div>`;
}, Lr = () => {
	let e = (/* @__PURE__ */ new Date()).getHours();
	return e < 5 ? "Good night." : e < 12 ? "Good morning." : e < 18 ? "Good afternoon." : "Good evening.";
}, Rr = (e, t = !1) => {
	let n = e.alerts, r = n.filter((e) => e.severity === "critical").length, i = n.filter((e) => e.severity === "warning").length, a = n.filter((e) => e.severity === "info").length, o = r + i, s = r ? "critical" : i ? "" : a ? "info" : "calm", c = o ? `${o} thing${o > 1 ? "s" : ""} need${o > 1 ? "" : "s"} attention` : a ? `Nothing urgent · ${a} note${a > 1 ? "s" : ""}` : "Nothing needs attention", l = n.slice(0, 3);
	return k`<div class="banner ${s}" role="region" aria-label="Attention">
    <span class="sig">${o || a ? A`<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 7v6M12 17h.01"></path></svg>` : W("security", 22)}</span>
    <button class="sum" @click=${() => e.go("alerts")}>
      <b>${c}</b>
      <span class="n">${r} critical · ${i} warning${i === 1 ? "" : "s"} · ${a} info</span>
    </button>
    ${t ? j : k`<div class="chips">
          ${l.map((t) => k`<button class="chip ${t.severity}" @click=${() => e.openAlert(t)}>
              <span class="ico">${W(t.icon, 20)}</span>
              <span class="txt"><span>${t.chipTitle}</span><span class="val"><b class="n">${t.chipValue}</b><span class="badge ${t.severity}">${t.badge}</span></span></span>
            </button>`)}
        </div>`}
    <button class="more" aria-label="All alerts" @click=${() => e.go("alerts")}>${W("chevron", 18)}</button>
  </div>`;
}, zr = (e) => {
	let t = e.config.entities ?? {}, n = z(e.hass, t.heat_pump);
	if (!t.heat_pump) return j;
	let r = B(n) ? void 0 : Number(n.attributes.current_temperature), i = B(n) ? void 0 : Number(n.attributes.temperature), a = r !== void 0 && Number.isFinite(r), o = a ? Math.max(0, Math.min(1, (r - 10) / 20)) : 0, s = B(n) ? "Unavailable" : String(n.attributes.hvac_action ?? n.state), c = V(e.hass, t.heat_pump_outdoor) ?? V(e.hass, t.outdoor_temperature), l = V(e.hass, t.heat_pump_supply), u = V(e.hass, t.heat_pump_return);
	return k`<section class="glass card">
    ${me(e.config) ? k`<button class="h2btn" @click=${() => e.go("heatpump")}><h2 style="font-size:18px"><span style="color:var(--atlas-accent)">${W("climate", 22)}</span>Climate${W("chevron", 14)}</h2></button>` : k`<h2 style="font-size:18px"><span style="color:var(--atlas-accent)">${W("climate", 22)}</span>Climate</h2>`}
    <div class="clim">
      <svg role="img" aria-label="Heat pump ${a ? r : "unavailable"} degrees" width="136" height="136" viewBox="0 0 140 140" style="flex:none">
        <circle cx="70" cy="70" r="60" fill="rgba(0,0,0,0.35)"></circle>
        <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(241,245,255,0.08)" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="${78} 100" transform="rotate(130 70 70)"></circle>
        ${a ? A`<circle cx="70" cy="70" r="58" fill="none" stroke="var(--atlas-accent)" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="${Math.max(1, 78 * o)} 100" transform="rotate(130 70 70)"></circle>` : j}
        <text x="70" y="76" text-anchor="middle" font-size="32" font-weight="700" fill="#F1F5FF">${a ? r.toFixed(1) : "–"}<tspan font-size="13" dy="-13">°C</tspan></text>
        ${i !== void 0 && Number.isFinite(i) ? A`<text x="70" y="98" text-anchor="middle" font-size="12" fill="var(--atlas-accent)">Target ${i.toFixed(1)}°</text>` : j}
      </svg>
      <div class="det">
        <b>Heat pump · ${s.charAt(0).toUpperCase() + s.slice(1)}</b>
        <span class="n t2">Outdoor ${Yn(c, "°")} · Supply ${Yn(l, "°")}</span>
        <span class="n t2">Return ${Yn(u, "°")}</span>
        <div class="btn3">
          <button class="sq" aria-label="Heat pump power" @click=${() => e.moreInfo(t.heat_pump)}>${W("power", 20)}</button>
          <button class="sq" aria-label="Eco mode" @click=${() => e.moreInfo(t.heat_pump)}>${W("eco", 20)}</button>
          <button class="sq" aria-label="Schedule" @click=${() => e.moreInfo(t.heat_pump)}>${W("schedule", 20)}</button>
        </div>
      </div>
    </div>
  </section>`;
}, Br = (e) => e === void 0 ? "–" : `${e.toFixed(2)} kW`, Vr = (e) => {
	let t = e.config.entities ?? {};
	if (!t.house_load && !t.solar_power && !t.grid_import) return j;
	let n = H(e.hass, t.solar_power), r = H(e.hass, t.house_load), i = H(e.hass, t.grid_import), a = H(e.hass, t.grid_export), o = (a ?? 0) > (i ?? 0), s = o ? a : i;
	return k`<section class="glass card" style="gap:10px">
    <div class="row">
      <h2>Energy flow</h2>
      ${_(e.config).length > 0 ? k`<button class="t2 more" @click=${() => e.go("energy")}>Circuits ${W("chevron", 14)}</button>` : j}
    </div>
    <div class="flow">
      <button class="node" @click=${() => fe(e.config) ? e.go("solar") : t.solar_power && e.moreInfo(t.solar_power)}><span class="c">${W("solar", 22)}</span><b class="n">${Br(n)}</b><span>Solar</span></button>
      <span class="link ${(n ?? 0) > .01 ? "act r" : ""}"></span>
      <button class="node house" @click=${() => t.house_load && e.moreInfo(t.house_load)}><span class="c">${W("home", 24)}</span><b class="n">${Br(r)}</b><span>House</span></button>
      <span class="link ${(s ?? 0) > .01 ? `act ${o ? "r" : "l"}` : ""}"></span>
      <button class="node" @click=${() => t.grid_import && e.moreInfo(t.grid_import)}><span class="c">${W("grid", 22)}</span><b class="n">${Br(s)}</b><span>${o ? "Grid export" : "Grid import"}</span></button>
    </div>
  </section>`;
}, Hr = (e) => {
	let t = e.config.entities ?? {}, n = z(e.hass, t.alarm), r = Tr(e).map((t) => e.hass.states[t]), i = r.filter((e) => !B(e)), a = i.filter((e) => Pt(e)).length, o = (e.config.layout?.security_tiles ?? []).map((t) => x(e.config, t)).filter(Boolean);
	return k`<section class="glass card">
    <div class="row">
      ${se(e.config) ? k`<button class="h2btn" @click=${() => e.go("security")}><h2>${W("security", 20)}Security${W("chevron", 14)}</h2></button>` : k`<h2>${W("security", 20)}Security</h2>`}
      <button class="n t2" style="font-size:12px" @click=${() => t.alarm && e.moreInfo(t.alarm)}>
        ${n ? B(n) ? "Alarm unavailable" : U(e.hass, n) : ""} · ${a} / ${i.length} open${i.length < r.length ? ` · ${r.length - i.length} n/a` : ""}
      </button>
    </div>
    ${o.length ? k`<div class="cams">${o.map((t) => jr(e, w(t), t.name, () => e.openRoom(t)))}</div>` : j}
  </section>`;
}, Ur = (e) => {
	let t = e.config.entities ?? {}, n = z(e.hass, t.alarm), r = z(e.hass, t.garage_cover), i = ce(e.config).filter((t) => e.hass.states[t]?.state === "on"), a = n && n.state !== "disarmed" && !B(n), o = t.wake_pc;
	return k`<section class="glass card" style="gap:10px;padding:14px 16px">
    <h2 style="margin-left:4px">Quick actions</h2>
    <div class="actions">
      ${t.alarm ? k`<button class="qa primary" ?disabled=${B(n)} @click=${() => a ? e.moreInfo(t.alarm) : e.confirm("Arm away?", "The alarm will arm in away mode.", () => e.call("alarm_control_panel", "alarm_arm_away", { entity_id: t.alarm }), "Arm away")}>
            ${W("arm-away", 20)}${a ? "Disarm" : "Arm away"}
          </button>` : j}
      ${t.garage_cover ? k`<button class="qa" ?disabled=${B(r)} @click=${() => {
		let n = r?.state !== "open";
		e.confirm(n ? "Open the garage?" : "Close the garage?", `Garage door is ${r ? U(e.hass, r).toLowerCase() : "unknown"}.`, () => e.call("cover", n ? "open_cover" : "close_cover", { entity_id: t.garage_cover }), n ? "Open" : "Close");
	}}>${W("garage-door", 20)}Garage</button>` : j}
      <button class="qa" @click=${() => i.length ? e.confirm("Turn lights off?", `${i.length} light${i.length > 1 ? "s are" : " is"} on in mapped rooms (status LEDs excluded).`, () => e.call("homeassistant", "turn_off", { entity_id: i }), "Turn off") : e.confirm("All lights are off", "No mapped room light is on.", () => void 0, "OK")}>
        ${W("lights-off", 20)}Lights off${i.length ? k` <span class="n t2">${i.length}</span>` : j}
      </button>
      ${o ? k`<button class="qa" @click=${() => {
		let t = R(o);
		t === "script" ? e.call("script", "turn_on", { entity_id: o }) : e.call(t, "press", { entity_id: o });
	}}>${W("wake-pc", 20)}Wake PC</button>` : j}
      <button class="qa" @click=${() => e.go("rooms")}>${W("more", 20)}More</button>
    </div>
  </section>`;
}, Wr = (e) => e === 8 ? [
	2,
	2,
	2,
	3,
	3,
	2,
	2,
	2
] : Array(e).fill(2), Gr = (e) => {
	let t = e.config.entities ?? {}, n = z(e.hass, t.heat_pump), r = B(n) ? void 0 : Number(n.attributes.current_temperature), i = z(e.hass, t.alarm), a = (e.config.layout?.home_tiles?.length ? e.config.layout.home_tiles : g(e.config).slice(0, 8).map((e) => e.id)).map((t) => x(e.config, t)).filter(Boolean), o = Wr(a.length), s = g(e.config).length, c = i ? B(i) ? "Alarm unavailable" : `Alarm ${U(e.hass, i).toLowerCase()}` : "", l = i && (B(i) || ["triggered", "pending"].includes(i.state));
	return k`
    <section class="hero ${t.persons?.length || t.weather ? "split" : ""}" aria-label="Greeting">
      <div class="hgreet">
      <h1>${Lr()}</h1>
      <p class="n">
        ${t.heat_pump ? k`Heat pump reads ${r !== void 0 && Number.isFinite(r) ? `${r.toFixed(1)} °C` : "–"} indoors` : j}
        ${c ? k`<span style="opacity:.5"> · </span><span style="color:${l ? "var(--atlas-warn)" : "var(--atlas-accent)"};font-weight:600">${c}</span>` : j}
      </p>
      </div>
      <div class="hside">${Ir(e)}${Pr(e)}</div>
    </section>
    ${Rr(e, e.narrow)}
    <div class="home-grid">
      <div class="col">
        <section class="glass card" style="flex:1;padding:16px">
          <div class="row" style="padding:0 4px;align-items:flex-start">
            <div><h2 style="font-size:20px">Rooms</h2><span class="t2" style="font-size:12px">Quick access to your spaces</span></div>
            <button class="pillbtn" @click=${() => e.go("rooms")}>View all ${s} rooms</button>
          </div>
          <div class="tiles" style="flex:1">${a.map((t, n) => Qn(e, t, o[n] === 3 ? "s3" : ""))}</div>
        </section>
        ${Ur(e)}
      </div>
      <div class="col">${zr(e)}${Vr(e)}${Hr(e)}</div>
    </div>
    ${er(e, e.config.layout?.home_cards, "main homecards")}
  `;
}, Kr = [
	["critical", "Critical"],
	["warning", "Warning"],
	["info", "Info"]
], qr = (e) => {
	let t = e.config.alerts?.mailbox_ack, n = Kr.map(([t, n]) => ({
		sev: t,
		label: n,
		items: e.alerts.filter((e) => e.severity === t)
	})).filter((e) => e.items.length);
	return k`
    <section class="hero">
      <h1 class="sm">Needs attention</h1>
      <p>Grouped by severity · rows clear automatically when the condition resolves</p>
    </section>
    ${n.length ? n.map((n) => k`<section class="glass card group">
            <h2 style="color:${$n[n.sev]}">${n.label} · ${n.items.length}</h2>
            <div class="alist">
              ${n.items.map((r) => k`<button class="arow ${r.severity}" @click=${() => e.openAlert(r)}>
                  <span class="ico">${W(r.icon, 20)}</span>
                  <span class="txt"><b>${r.title}</b><span>${r.meta}</span></span>
                  ${r.id === "mailbox" && t ? k`<span class="ctl" role="button" @click=${(n) => {
		n.stopPropagation(), e.call("input_boolean", "turn_off", { entity_id: t });
	}}>Acknowledge</span>` : j}
                  <span class="badge ${r.severity}">${n.label}</span>
                </button>`)}
            </div>
          </section>`) : k`<section class="glass card"><p class="empty">Nothing needs attention. All mapped sources report valid states.</p></section>`}
  `;
}, Jr = (e, t) => {
	let n = t.cameras ?? "off";
	if (n === "off") return j;
	let r = T(e.config, t.id);
	if (!r.length) return j;
	let i = r.length, a = n === "live" && !!customElements.get("ha-camera-stream"), o = Math.floor(e.tick / 1e4);
	return k`<section class="glass card camsec" style="padding:16px;gap:12px">
    <div class="row" style="padding:0 4px">
      <h2 style="font-size:20px">Cameras on ${t.name}</h2>
      <span class="t2" style="font-size:12px">${n === "live" ? "Live, muted" : "Snapshots every 10 s"} · tap a name for the room</span>
    </div>
    <div class="camwall ${e.narrow ? "" : "fitwall"}" style="--cols:${i <= 3 ? i : i === 4 ? 2 : 3}">
      ${r.map(({ camera: t, rooms: n }) => {
		let r = z(e.hass, t), i = n.map((e) => e.name).join(" · "), s = r?.attributes.entity_picture, c;
		return c = n.some((e) => e.camera_private) ? k`<div class="camslot private"><span class="t2" style="font-size:12px">Private camera · open the room to reveal</span></div>` : B(r) ? k`<div class="camslot"><b style="font-size:13px">Camera unavailable</b></div>` : a ? k`<div class="camslot live"><ha-camera-stream .hass=${e.hass} .stateObj=${r} .fitMode=${"cover"} muted></ha-camera-stream></div>` : k`<div class="camslot live">${s ? k`<img src=${`${s}&width=960&height=540&t=${o}`} alt="${i} camera" loading="lazy" />` : k`<span class="t2" style="font-size:12px">Waiting for picture</span>`}</div>`, k`<div class="camtile">
          <span class="camname"><i class="dotst ${B(r) ? "na" : ""}"></i>${n.map((t, n) => k`${n ? k`<span class="t2" aria-hidden="true">·</span>` : j}<button @click=${() => e.openRoom(t)}>${t.name}</button>`)}</span>
          ${c}
        </div>`;
	})}
    </div>
  </section>`;
}, Yr = (e, t) => {
	let n = C(e.config, t), r = n.filter((t) => !e.hot.has(t.id)).map((t) => V(e.hass, t.temperature)).filter((e) => e !== void 0), i = r.length ? `${(r.reduce((e, t) => e + t, 0) / r.length).toFixed(1)} °C typical` : "no sensors", a = n.filter((t) => e.badges.has(t.id)).length;
	return i + (a ? ` · ${a} alert${a > 1 ? "s" : ""}` : "");
}, Xr = (e) => {
	let t = b(e.config), n = S(e.config, e.floorId) ?? t[0], r = e.config.rooms?.length ?? 0, i = (e.config.rooms ?? []).filter((t) => !t.floor || !S(e.config, t.floor)), a = n ? C(e.config, n.id) : i, o = n ? Jr(e, n) : j, s = o !== j && !e.narrow, c = k`<section class="glass card roomsec" style="flex:1;padding:16px">
      <div class="row" style="padding:0 4px">
        <h2 style="font-size:20px">${n ? `${n.name}${n.level ? ` · level ${n.level}` : ""}` : "Rooms"}</h2>
        <span class="t2" style="font-size:12px">Tap a room for its devices</span>
      </div>
      <div class="tiles floor">
        ${a.map((t) => Qn(e, t, "", `${(t.devices ?? []).length} devices`))}
      </div>
    </section>`;
	return k`
    <section class="hero">
      <h1 class="sm">Rooms</h1>
      <p>${t.length} floors · ${r} rooms · pick a floor, then a room</p>
    </section>
    <div class="floors">
      ${t.map((t) => {
		let r = C(e.config, t.id).length;
		return k`<button class="glass fl ${t.id === n?.id ? "on" : ""}" @click=${() => e.go(`floor-${t.id}`)}>
          <span class="row" style="align-items:baseline"><span class="lv n">${t.level ?? ""}</span><small>${r} room${r === 1 ? "" : "s"}</small></span>
          <span style="font-size:16px;font-weight:600">${t.name}</span>
          <small class="n">${Yr(e, t.id)}</small>
        </button>`;
	})}
    </div>
    ${s ? k`<div class="fitgrid ${a.length === 1 ? "single" : ""}" style="--rcols:${a.length === 1 ? 1 : 2}">${c}${o}</div>` : k`${c}${o}`}
  `;
}, Zr = (e, t) => {
	let n = z(e.hass, t);
	return n ? B(n) ? "–" : U(e.hass, n) : "–";
}, Qr = (e, t) => {
	let n = V(e.hass, t);
	if (n === void 0) return;
	let r = String(z(e.hass, t)?.attributes.unit_of_measurement ?? "min"), i = r === "s" ? n / 60 : r === "h" ? n * 60 : r === "d" ? n * 1440 : n, a = Math.max(0, Math.round(i));
	return a >= 60 ? `${Math.floor(a / 60)} h ${a % 60} min` : `${a} min`;
}, $r = (e) => !!(e.printer_status || e.printer_progress), ei = (e, t) => {
	let n = e.alerts.filter((e) => e.room === t.id), r = le(e.config, t), i = r.filter((t) => e.hass.states[t]?.state === "on"), a = (t.devices ?? []).filter((t) => {
		let n = e.hass.states[t.entity];
		return !n || n.state === "unavailable";
	}).length, o = $r(t) ? V(e.hass, t.printer_progress) : void 0;
	return k`<div class="strip">
    <button class="schip ${n.length ? "warn" : "ok"}" @click=${() => e.go("alerts")}>
      ${n.length ? G("dot", 18) : k`<span class="okdot">✓</span>`}
      <span><b>${n.length ? `${n.length} alert${n.length > 1 ? "s" : ""}` : "All OK"}</b><small>${n.length ? n[0].title : "No alerts"}</small></span>
    </button>
    ${r.length ? k`<button class="schip ${i.length ? "on" : ""}" title=${i.length ? "Turn the room lights off" : "Turn the room lights on"}
          @click=${() => e.call("homeassistant", i.length ? "turn_off" : "turn_on", { entity_id: i.length ? i : r })}>
          ${G("bulb", 18)}<span><b>Lights</b><small>${i.length ? `${i.length} of ${r.length} on` : "All off"}</small></span>
        </button>` : j}
    ${$r(t) ? k`<button class="schip" @click=${() => t.printer_status && e.moreInfo(t.printer_status)}>
          ${G("printer", 18)}<span><b>${t.printer_name || "3D printer"}</b><small>${Zr(e, t.printer_status)}${o === void 0 ? "" : ` · ${Math.round(o)} %`}</small>
          ${o === void 0 ? j : k`<i class="sbar"><i style="width:${Math.max(0, Math.min(100, o))}%"></i></i>`}</span>
        </button>` : j}
    ${vn(t) ? (() => {
		let n = yn(e, t), r = z(e.hass, t.car_range), i = [n.text, r && !B(r) ? U(e.hass, r) : ""].filter(Boolean).join(" · ");
		return k`<button class="schip ${n.state === "unlocked" || n.state === "jammed" ? "warn" : ""}" @click=${() => (n.entity || t.car_range) && e.moreInfo(n.entity || t.car_range)}>
            ${G("car", 18)}<span><b>${t.car_name || "Vehicle"}</b><small>${i || "No data"}</small></span>
          </button>`;
	})() : j}
    ${t.power ? (() => {
		let n = En(e, t), r = Number(t.power_max) > 0 ? Number(t.power_max) : 3e3;
		return k`<button class="schip" @click=${() => e.moreInfo(t.power)}>${G("power", 18)}<span><b style="color:${Dn(n, r)}">${On(n)}</b><small>Power</small></span></button>`;
	})() : j}
    ${t.mower ? (() => {
		let n = z(e.hass, t.mower), r = V(e.hass, t.mower_battery);
		return k`<button class="schip ${!n || B(n) || n.state === "error" ? "warn" : n.state === "mowing" ? "on" : ""}" @click=${() => e.moreInfo(t.mower)}>${G("mower", 18)}<span><b>${t.mower_name || "Mower"}</b><small>${n ? U(e.hass, n) : "Not found"}${r === void 0 ? "" : ` · ${Math.round(r)} %`}</small></span></button>`;
	})() : j}
    ${t.salt_level ? (() => {
		let n = Fn(e, t), r = n !== void 0 && n < In(t);
		return k`<button class="schip ${r ? "warn" : ""}" @click=${() => e.moreInfo(t.salt_level)}>${G("drop", 18)}<span><b>${n === void 0 ? "–" : `${Math.round(n)} %`}</b><small>${r ? "Buy salt" : t.salt_name || "Salt level"}</small></span></button>`;
	})() : j}
    ${a ? k`<span class="schip warn"><span><b>${a} unavailable</b><small>device${a > 1 ? "s" : ""} in this room</small></span></span>` : j}
  </div>`;
}, ti = (e, t) => {
	let n = t.climate_extra ?? [];
	return n.length ? k`<div class="cextra">
    ${n.map((t) => {
		let n = e.hass.states[t.entity];
		return k`<button class="cx" @click=${() => e.moreInfo(t.entity)}>
        <span class="cxi">${t.icon ? k`<ha-icon .icon=${t.icon} style="--mdc-icon-size:18px"></ha-icon>` : G(ar(t.entity, n), 18)}</span>
        <span><b class="n">${Zr(e, t.entity)}</b><small>${J(e.hass, t)}</small></span>
      </button>`;
	})}
  </div>` : j;
}, ni = (e, t) => {
	if (!$r(t)) return j;
	let n = V(e.hass, t.printer_progress), r = Qr(e, t.printer_remaining), i = z(e.hass, t.printer_picture)?.attributes.entity_picture, a = Math.floor(e.tick / 1e4), o = [
		["Nozzle", t.printer_nozzle],
		["Bed", t.printer_bed],
		["Chamber", t.printer_chamber]
	].filter(([, e]) => e), s = z(e.hass, t.printer_light), c = (t) => t && e.call("button", "press", { entity_id: t });
	return k`<section class="glass card printer">
    <div class="row">
      <h2>${G("printer", 20)}${t.printer_name || "3D printer"}</h2>
      <button class="pstatus" @click=${() => t.printer_status && e.moreInfo(t.printer_status)}>${Zr(e, t.printer_status)}</button>
    </div>
    <div class="pbody">
      ${i ? k`<button class="ppic" @click=${() => e.moreInfo(t.printer_picture)}><img src=${`${i}${i.includes("?") ? "&" : "?"}t=${a}`} alt="" /></button>` : j}
      <button class="pnum" @click=${() => t.printer_progress && e.moreInfo(t.printer_progress)}>
        <b class="n">${n === void 0 ? "–" : `${Math.round(n)} %`}</b>
        <span class="t2">${r ? `${r} remaining` : t.printer_remaining ? "no time estimate" : ""}</span>
      </button>
    </div>
    <span class="bar"><span style="width:${n === void 0 ? 0 : Math.max(0, Math.min(100, n))}%;background:var(--atlas-accent)"></span></span>
    ${o.length ? k`<div class="ptemps">${o.map(([t, n]) => k`<button @click=${() => e.moreInfo(n)}><b class="n">${Zr(e, n)}</b><small>${t}</small></button>`)}</div>` : j}
    ${t.printer_light || t.printer_pause || t.printer_resume || t.printer_stop ? k`<div class="pbtns">
          ${t.printer_light ? k`<button class="sq ${s?.state === "on" ? "on" : ""}" title="Chamber light" @click=${() => e.call(R(t.printer_light), "toggle", { entity_id: t.printer_light })}>${G("bulb", 20)}</button>` : j}
          ${t.printer_pause ? k`<button class="sq" title="Pause" @click=${() => c(t.printer_pause)}>Pause</button>` : j}
          ${t.printer_resume ? k`<button class="sq" title="Resume" @click=${() => c(t.printer_resume)}>Resume</button>` : j}
          ${t.printer_stop ? k`<button class="sq stop" title="Stop" @click=${() => e.confirm("Stop the print?", "The current print job will be cancelled.", () => c(t.printer_stop), "Stop print")}>Stop</button>` : j}
        </div>` : j}
  </section>`;
}, ri = (e, t) => {
	let n = t.automations ?? [];
	return n.length ? k`<section class="glass card autos">
    <h2>${W("automations", 20)}Automations</h2>
    ${n.map((t) => {
		let n = e.hass.states[t], r = n?.state === "on", i = n?.attributes.last_triggered;
		return k`<div class="auto">
        <button class="atxt" @click=${() => e.moreInfo(t)}>
          <b>${String(n?.attributes.friendly_name ?? t)}</b>
          <small class="t2">${B(n) ? "Unavailable" : i ? `Last run ${K(e.hass, i)}` : "Never run"}</small>
        </button>
        <button class="tog ${r ? "on" : ""}" role="switch" aria-checked=${r ? "true" : "false"} aria-label="Enable ${String(n?.attributes.friendly_name ?? t)}"
          ?disabled=${B(n)} @click=${() => e.call("automation", "toggle", { entity_id: t })}><i></i></button>
      </div>`;
	})}
  </section>` : j;
}, ii = 500, ai = 8, oi = (e) => {
	let t = 0, n = 0, r = 0, i = !1, a = !1, o, s = 1;
	return {
		down: (c) => {
			let l = c.currentTarget;
			t = c.clientX, n = e.start(), r = n, i = !1, a = !1, s = l.getBoundingClientRect().width || 1, l.setPointerCapture?.(c.pointerId), o = window.setTimeout(() => {
				a = !0, e.hold();
			}, ii);
		},
		move: (c) => {
			if (a || !c.buttons && c.pointerType === "mouse") return;
			let l = c.clientX - t;
			if (!i && Math.abs(l) < ai || !e.canDrag()) return;
			i = !0, window.clearTimeout(o);
			let u = Math.max(1, Math.min(100, Math.round(n + l / s * 100)));
			r = e.snap ? e.snap(u) : u;
			let d = c.currentTarget;
			d.classList.add("dragging"), e.preview(d, r);
		},
		up: (t) => {
			window.clearTimeout(o), t.currentTarget.classList.remove("dragging"), a || (i ? e.commit(r) : e.tap());
		},
		cancel: (e) => {
			window.clearTimeout(o), e.currentTarget.classList.remove("dragging"), i = !1;
		},
		context: (t) => {
			t.preventDefault(), window.clearTimeout(o), a = !0, e.hold();
		}
	};
}, si = 1, ci = 4, li = (e) => {
	let t = Number(e?.attributes.supported_features ?? 0);
	return {
		speed: (t & si) !== 0,
		direction: (t & ci) !== 0
	};
}, ui = (e) => {
	if (e?.state !== "on") return 0;
	let t = Number(e.attributes.percentage);
	return Number.isFinite(t) ? Math.max(0, Math.min(100, Math.round(t))) : 0;
}, di = (e, t) => {
	let n = Number(e?.attributes.percentage_step) > 0 ? Number(e.attributes.percentage_step) : 1;
	return Math.max(Math.round(n), Math.min(100, Math.round(Math.round(t / n) * n)));
}, fi = (e, t, n, r, i) => {
	let a = e.hass.states[t.entity], o = li(a), s = a?.state === "on", c = ui(a), l = J(e.hass, t), u = String(a?.attributes.direction ?? "forward"), d = oi({
		start: () => ui(e.hass.states[t.entity]),
		canDrag: () => li(e.hass.states[t.entity]).speed && !B(e.hass.states[t.entity]),
		snap: (n) => di(e.hass.states[t.entity], n),
		preview: (e, t) => {
			e.style.setProperty("--pct", `${t}%`);
			let n = e.querySelector(".lprev");
			n && (n.textContent = `${t} %`);
		},
		commit: (n) => e.call("fan", "set_percentage", {
			entity_id: t.entity,
			percentage: n
		}),
		tap: r,
		hold: () => e.moreInfo(t.entity)
	}), f = s && o.speed && c ? `On · ${c} %` : _r(e.hass, a);
	return k`<div class="dev fan ${s ? "on" : ""} ${!a || B(a) ? "na" : ""}" title=${hn(e.hass, a) || t.entity}>
    <button class="dmain fdrag" style="--pct:${c}%" aria-label="${l}: tap to toggle${o.speed ? ", drag to set the speed" : ""}, hold for details"
      @pointerdown=${d.down} @pointermove=${d.move} @pointerup=${d.up} @pointercancel=${d.cancel} @contextmenu=${d.context}
      @keydown=${(e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), r());
	}}>
      <span class="ffill" aria-hidden="true"></span>
      <span class="chipi fspin">${i}</span>
      <span class="txt"><b>${l}</b><span class="fstate">${f}</span><span class="lprev"></span>${n ? k`<small class="ago n">${n}</small>` : j}</span>
    </button>
    ${o.direction ? k`<button class="fdir" ?disabled=${!a || B(a)} aria-label="${l} direction: ${u}. Switch"
          @click=${() => e.call("fan", "set_direction", {
		entity_id: t.entity,
		direction: u === "reverse" ? "forward" : "reverse"
	})}>${u === "reverse" ? "↺ Rev" : "↻ Fwd"}</button>` : j}
  </div>`;
}, pi = 500, mi = (e, t) => {
	let n = e.hass.states[t.entity], r = R(t.entity), i = J(e.hass, t), a = cr(t), o, s = "", c = "", l = "";
	if (a === "toggle" && or.includes(r) && !B(n)) {
		let a = n.state === "on";
		o = () => e.call(r, "toggle", { entity_id: t.entity }), s = `Turn ${a ? "off" : "on"} ${i}?`, c = `${i} is ${_r(e.hass, n).toLowerCase()}.`, l = a ? "Turn off" : "Turn on";
	} else if (a === "press" && sr.includes(r) && n && n.state !== "unavailable") {
		let n = r === "script";
		o = () => e.call(r, n ? "turn_on" : "press", { entity_id: t.entity }), s = `${n ? "Run" : "Press"} ${i}?`, c = n ? "The script will run now." : "The button will be pressed now.", l = n ? "Run" : "Press";
	}
	o ? t.confirm ? e.confirm(s, c, o, l) : o() : e.moreInfo(t.entity);
}, hi = (e, t) => {
	let n, r = !1;
	return {
		down: () => {
			r = !1, n = window.setTimeout(() => {
				r = !0, e.moreInfo(t.entity);
			}, pi);
		},
		up: () => window.clearTimeout(n),
		click: () => {
			r || mi(e, t);
		},
		context: (i) => {
			i.preventDefault(), window.clearTimeout(n), r = !0, e.moreInfo(t.entity);
		}
	};
}, gi = (e, t) => e.icon ? k`<ha-icon .icon=${e.icon} style="--mdc-icon-size:20px"></ha-icon>` : G(ar(e.entity, t)), _i = (e, t, n) => {
	let r = e.hass.states[t.entity], i = fr(r), a = pr(r), o = J(e.hass, t), s = r?.attributes.current_position, c = typeof s == "number" && r && [
		"open",
		"opening",
		"closing"
	].includes(r.state) ? ` · ${s} %` : "", l = (n, i) => {
		let a = () => e.call("cover", n, { entity_id: t.entity });
		n !== "stop_cover" && mr(t, r) ? e.confirm(`${i} ${o}?`, `${o} is ${_r(e.hass, r).toLowerCase()}.`, a, i) : a();
	}, u = (e, t, n, r) => e ? k`<button class="sq" aria-label="${r} ${o}" ?disabled=${!t} @click=${() => l(n, r)}>${r}</button>` : j;
	return k`<div class="dev cover ${gr(r)}" title=${hn(e.hass, r) || t.entity}>
    <button class="dmain" @click=${() => e.moreInfo(t.entity)} @contextmenu=${(n) => {
		n.preventDefault(), e.moreInfo(t.entity);
	}}>
      <span class="chipi">${gi(t, r)}</span>
      <span class="txt"><b>${o}</b><span>${_r(e.hass, r)}${c}</span>${n ? k`<small class="ago n">${n}</small>` : j}</span>
    </button>
    <span class="cbtns">
      ${u(i.open, a.open, "open_cover", "Open")}${u(i.stop, a.stop, "stop_cover", "Stop")}${u(i.close, a.close, "close_cover", "Close")}
    </span>
  </div>`;
}, vi = (e, t, n = []) => {
	let r = e.hass.states[t.entity], i = K(e.hass, mn(r, e.config.appearance?.time_display)), a = fr(r);
	if (R(t.entity) === "cover" && (a.open || a.close || a.stop)) return _i(e, t, i);
	if (R(t.entity) === "fan" && cr(t) === "toggle") return fi(e, t, i, () => mi(e, t), gi(t, r));
	let o = gr(r) === "on" && n.includes(t.entity) ? "on lit" : gr(r), s = hi(e, t);
	return k`<button class="dev ${o}" title=${hn(e.hass, r) || t.entity}
    @pointerdown=${s.down} @pointerup=${s.up} @pointerleave=${s.up} @click=${s.click} @contextmenu=${s.context}>
    <span class="chipi">${gi(t, r)}</span>
    <span class="txt"><b>${J(e.hass, t)}</b><span>${_r(e.hass, r)}</span>${i ? k`<small class="ago n">${i}</small>` : j}</span>
  </button>`;
}, yi = (e, t) => {
	if (t.show_camera === !1) return j;
	if (!t.camera) return k`<section class="glass card"><h2>Camera</h2>
      <div class="camslot none"><span class="camico">${G("camera", 24)}</span><span class="t2" style="font-size:12px">This room has no camera</span></div>
    </section>`;
	let n = `cam:${t.id}`, r = e.ui[n] ?? "live", i = !t.camera_private || e.ui[`reveal:${t.id}`] === !0, a = z(e.hass, t.camera), o = z(e.hass, t.camera_snapshot) ?? a, s = (t) => {
		e.ui[n] = t, e.refresh();
	}, c = !!customElements.get("ha-camera-stream"), l;
	if (!i) l = k`<div class="camslot private"><span class="camico">${G("camera", 24)}</span>
      <b style="font-size:14px">${t.name} camera · private</b><span class="t2" style="font-size:12px">Stream hidden until you tap Reveal</span>
      <button class="ctl" @click=${() => {
		e.ui[`reveal:${t.id}`] = !0, e.refresh();
	}}>Reveal</button></div>`;
	else if (B(a)) l = k`<div class="camslot"><span class="camico">${G("camera", 24)}</span><b style="font-size:14px">Camera unavailable</b><span class="t2" style="font-size:12px">${t.camera}</span></div>`;
	else if (r === "live" && c) l = k`<div class="camslot live"><ha-camera-stream .hass=${e.hass} .stateObj=${a} .fitMode=${"cover"} controls muted></ha-camera-stream></div>`;
	else if (r === "snapshot" && o?.attributes.entity_picture) l = k`<div class="camslot live"><img src=${`${o.attributes.entity_picture}&t=${e.ui[`${n}:t`] ?? 0}`} alt="${t.name} snapshot" /></div>`;
	else {
		let e = a?.attributes.entity_picture;
		l = k`<div class="camslot live">${e ? k`<img src=${`${e}&width=1280&height=720`} alt="" />` : j}
      <span class="camwait">Starting live stream…</span></div>`;
	}
	let u = (e, t, n) => k`<button class="sq ${t ? "on" : ""}" style="color:var(--atlas-text)" @click=${n}>${e}</button>`;
	return k`<section class="glass card">
    <div class="row"><h2>Camera</h2>
      <span style="display:flex;gap:10px;align-items:center">
        ${i && !B(a) && r === "live" ? k`<span class="livetag"><i></i>Live</span>` : j}
        ${t.camera_private && i ? k`<button class="t2" style="font-size:12px" @click=${() => {
		e.ui[`reveal:${t.id}`] = !1, s("live");
	}}>Hide</button>` : j}
      </span>
    </div>
    ${l}
    ${i && !B(a) ? k`<div class="btn3" style="margin-top:0">
          ${u("Live", r === "live", () => c ? s("live") : e.moreInfo(t.camera))}
          ${u("Snapshot", r === "snapshot", () => {
		e.ui[`${n}:t`] = Date.now(), s("snapshot");
	})}
          ${u("Recordings", !1, () => e.href("/media-browser/browser"))}
        </div>` : j}
  </section>`;
}, bi = (e) => {
	let t = x(e.config, e.roomId);
	if (!t) return k`<section class="glass card"><p class="empty">Room "${e.roomId}" is not in the config.</p></section>`;
	let n = S(e.config, t.floor), r = n ? C(e.config, n.id) : g(e.config), i = r.findIndex((e) => e.id === t.id), a = r[(i - 1 + r.length) % r.length], o = r[(i + 1) % r.length], s = V(e.hass, t.temperature), c = V(e.hass, t.humidity), l = e.badges.get(t.id), u = t.devices ?? [], d = re(e.config, t), f = d ? Zn(e, t) : void 0, p = er(e, t.side_cards, "side"), m = s === void 0 ? "" : s < 16 ? "#5EC8FF" : s > 30 ? "var(--atlas-crit)" : "var(--atlas-accent)", h = [
		s === void 0 ? "" : Yn(s),
		c === void 0 ? "" : Xn(c),
		`${u.length} device${u.length === 1 ? "" : "s"}`
	].filter(Boolean).join(" · "), _ = t.temperature || t.humidity, v = e.config.appearance?.time_display, y = (t) => {
		let n = z(e.hass, t), r = K(e.hass, mn(n, v));
		return r ? k`<small class="ago n" title=${hn(e.hass, n)}>${r}</small>` : j;
	};
	return k`
    <nav class="crumb" aria-label="Breadcrumb">
      <button @click=${() => e.go("home")}>Home</button><span aria-hidden="true">›</span>
      ${n ? k`<button @click=${() => e.go(`floor-${n.id}`)}>${n.name}</button><span aria-hidden="true">›</span>` : j}
      <b>${t.name}</b>
    </nav>
    <section class="rhead">
      <div class="rtitle">
        <div class="title">${W(t.icon, 32)}<h1>${t.name}</h1>${l ? k`<span class="badge ${l.severity === "critical" ? "critical" : ""}">${l.text}</span>` : j}</div>
        <p class="n t2">${n ? k`${n.name} <span style="opacity:.5">·</span> ` : j}${h}</p>
      </div>
      ${ei(e, t)}
      ${r.length > 1 ? k`<div class="rnav">
            <button class="ctl" aria-label="Previous room" @click=${() => e.openRoom(a)}>‹ ${a.name}</button>
            <button class="ctl" aria-label="Next room" @click=${() => e.openRoom(o)}>${o.name} ›</button>
          </div>` : j}
    </section>
    <div class="room-grid ${p === j ? "" : "has-side"}">
      <div class="col lcol">
        <section class="glass card" style="gap:16px">
          <h2>Climate</h2>
          ${_ ? k`<div class="metrics">
                <button class="metric" @click=${() => t.temperature && e.moreInfo(t.temperature)}>
                  <span class="lbl">${W("temperature", 16)}Temperature${y(t.temperature)}</span>
                  <span class="big n" style="color:${e.hot.has(t.id) ? "var(--atlas-crit)" : "inherit"}">${s === void 0 ? "–" : `${s.toFixed(1)}°`}</span>
                  <span class="bar">${s === void 0 ? j : k`<span style="width:${Math.round(Math.max(.05, Math.min(1, (s - 10) / 30)) * 100)}%;background:${m}"></span>`}</span>
                </button>
                <button class="metric" @click=${() => t.humidity && e.moreInfo(t.humidity)}>
                  <span class="lbl">${W("humidity", 16)}Humidity${y(t.humidity)}</span>
                  <span class="big n">${c === void 0 ? "–" : `${Math.round(c)} %`}</span>
                  <span class="bar">${c === void 0 ? j : k`<span style="width:${Math.round(Math.min(100, c))}%;background:${c < 25 ? "var(--atlas-warn)" : "#5EC8FF"}"></span>`}</span>
                </button>
              </div>` : k`<span class="t2" style="font-size:14px">No temperature sensor in this room yet.</span>`}
          ${ti(e, t)}
        </section>
        ${An(e, t)}
        ${Rn(e, t)}
        ${yi(e, t)}
        ${ni(e, t)}
      </div>
      ${p === j ? j : k`<div class="col scol">${p}</div>`}
      <div class="col mcol">
        <section class="glass card devcard ${d ? "has-img" : ""} ${f ? `mood ${f.state}` : ""}" style="flex:1;padding:18px;${f?.vars ?? ""}">
          ${d ? k`<img class="devbg" src=${d} alt="" />${f ? k`<span class="devglow" aria-hidden="true"></span>` : j}<span class="devshade" aria-hidden="true"></span>` : j}
          <div class="row"><h2>Devices</h2><span class="n t2" style="font-size:12px">${u.length} device${u.length === 1 ? "" : "s"} · tap to toggle, hold for details</span></div>
          ${u.length ? k`<div class="devs">${u.map((t) => vi(e, t, f?.ids ?? []))}</div>` : k`<span class="t2" style="font-size:14px">No devices mapped to this room.</span>`}
        </section>
        ${wn(e, t)}
        ${Pn(e, t)}
        ${qn(e, t)}
        ${ri(e, t)}
        ${er(e, t.cards, "main")}
        ${r.length > 1 ? k`<section class="glass card" style="padding:14px 16px;gap:10px">
              <h2 style="font-size:14px;margin-left:4px">Other rooms on ${n?.name ?? "this floor"}</h2>
              <div class="sibs">
                ${r.filter((e) => e.id !== t.id).map((t) => {
		let n = V(e.hass, t.temperature);
		return k`<button class=${e.badges.has(t.id) ? "alert" : ""} @click=${() => e.openRoom(t)}>${W(t.icon, 18)}${t.name}${n === void 0 ? j : k` <span class="n" style="opacity:.7">${n.toFixed(1)}°</span>`}</button>`;
	})}
              </div>
            </section>` : j}
      </div>
    </div>
  `;
}, xi = 2, Si = 3e3, Ci = (e, t) => {
	let n = H(e.hass, t);
	return n === void 0 ? void 0 : n * 1e3;
}, Y = (e) => e === void 0 ? "–" : Math.abs(e) >= 1e4 ? `${(e / 1e3).toFixed(2)} kW` : `${Math.round(e)} W`, X = (e, t, n) => e === void 0 ? "–" : `${e.toFixed(t)}${n}`, wi = (e, t) => {
	let n = V(e.hass, t);
	if (n !== void 0) return Math.abs(n) <= 1 ? n * 100 : n;
}, Ti = (e, t) => !!z(e.hass, t.power) && !B(z(e.hass, t.power)), Ei = (e, t, n) => {
	let r = e === void 0 ? 0 : Math.max(0, Math.min(1, e));
	return A`<svg class="ering" width=${t} height=${t} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(241,245,255,0.08)" stroke-width="7" stroke-linecap="round"
      pathLength="100" stroke-dasharray="75 100" transform="rotate(135 50 50)"></circle>
    ${r > 0 ? A`<circle cx="50" cy="50" r="42" fill="none" stroke=${n ? "var(--atlas-warn)" : "var(--atlas-accent)"} stroke-width="7" stroke-linecap="round"
          pathLength="100" stroke-dasharray=${`${(r * 75).toFixed(1)} 100`} transform="rotate(135 50 50)"></circle>` : j}
  </svg>`;
}, Di = (e) => [
	"a",
	"b",
	"c"
].filter((t) => e[`power_${t}`] || e[`current_${t}`] || e[`voltage_${t}`]), Oi = (e, t) => {
	let n = Di(t);
	if (!n.length) return j;
	let r = [
		{
			key: "power",
			label: "W",
			fmt: (t) => Y(Ci(e, t))
		},
		{
			key: "current",
			label: "A",
			fmt: (t) => X(V(e.hass, t), 2, " A")
		},
		{
			key: "voltage",
			label: "V",
			fmt: (t) => X(V(e.hass, t), 0, " V")
		}
	].filter((e) => n.some((n) => t[`${e.key}_${n}`])), i = `grid-template-columns: 22px repeat(${r.length}, minmax(0, 1fr))`;
	return k`<div class="ephases" role="table" aria-label="${t.name} phases">
    ${n.map((n) => k`<div class="ph sm" role="row" style=${i}>
        <span class="phl" role="rowheader">${n.toUpperCase()}</span>
        ${r.map((r) => {
		let i = t[`${r.key}_${n}`];
		return k`<button class="n" role="cell" ?disabled=${!i} aria-label="Phase ${n.toUpperCase()} ${r.key}" @click=${() => i && e.moreInfo(i)}>${i ? r.fmt(i) : ""}</button>`;
	})}
      </div>`)}
  </div>`;
}, ki = (e, t, n) => Ti(e, t) ? n !== void 0 && Math.abs(n) >= xi ? {
	text: "Consuming",
	cls: "on"
} : {
	text: "Standby",
	cls: "idle"
} : {
	text: "Offline",
	cls: "off"
}, Ai = (e, t, n) => k`<button class="estat" ?disabled=${!n} @click=${() => n?.()}><b class="n">${e}</b><span>${t}</span></button>`, ji = (e, t) => {
	let n = Ci(e, t.power), r = t.max_power || Si, i = ki(e, t, n), a = Di(t), o = (t) => t ? () => e.moreInfo(t) : void 0;
	return k`<section class="glass card emain">
    <div class="row"><h2>${W("energy", 20)}${t.name}</h2><span class="estatus ${i.cls}"><i></i>${i.text}</span></div>
    <div class="emain-body">
      <button class="egauge big" @click=${() => e.moreInfo(t.power)}>
        ${Ei(n === void 0 ? void 0 : n / r, 168, n !== void 0 && n > r * .8)}
        <span class="ev"><b class="n">${Y(n)}</b><span>${i.text === "Offline" ? "no data" : "now"}</span></span>
      </button>
      ${a.length ? k`<div class="phases" role="table" aria-label="Phases">
            <div class="ph head" role="row"><span></span>${a.map((e) => k`<span role="columnheader">Phase ${e.toUpperCase()}</span>`)}</div>
            <div class="ph" role="row"><span class="t2">${W("energy", 16)}Power</span>${a.map((n) => k`<button class="n" @click=${() => o(t[`power_${n}`])?.()}>${Y(Ci(e, t[`power_${n}`]))}</button>`)}</div>
            <div class="ph" role="row"><span class="t2">${W("power", 16)}Current</span>${a.map((n) => k`<button class="n" @click=${() => o(t[`current_${n}`])?.()}>${X(V(e.hass, t[`current_${n}`]), 2, " A")}</button>`)}</div>
            <div class="ph" role="row"><span class="t2">${W("grid", 16)}Voltage</span>${a.map((n) => k`<button class="n" @click=${() => o(t[`voltage_${n}`])?.()}>${X(V(e.hass, t[`voltage_${n}`]), 1, " V")}</button>`)}</div>
          </div>` : j}
    </div>
    <div class="estats">
      ${t.energy ? Ai(X(V(e.hass, t.energy), 1, " kWh"), "Total energy", o(t.energy)) : j}
      ${t.power_factor ? Ai(X(wi(e, t.power_factor), 0, " %"), "Power factor", o(t.power_factor)) : j}
      ${t.current ? Ai(X(V(e.hass, t.current), 2, " A"), "Current", o(t.current)) : j}
      ${t.frequency ? Ai(X(V(e.hass, t.frequency), 2, " Hz"), "Frequency", o(t.frequency)) : j}
    </div>
  </section>`;
}, Mi = (e, t, n) => {
	let r = t ? Ci(e, t.power) : void 0, i = n.map((t) => ({
		m: t,
		w: Ci(e, t.power)
	})).filter((e) => e.w !== void 0), a = i.reduce((e, t) => e + Math.max(0, t.w), 0), o = r === void 0 ? void 0 : r - a, s = [...i].filter((e) => e.w >= xi).sort((e, t) => t.w - e.w).slice(0, 4), c = Math.max(r ?? 0, s[0]?.w ?? 0, 1), l = n.length - i.length;
	return k`<section class="glass card esum">
    <h2>${W("info", 20)}Right now</h2>
    <div class="esum-figs">
      ${t ? k`<div><b class="n">${Y(r)}</b><span>Whole house</span></div>` : j}
      <div><b class="n">${Y(i.length ? a : void 0)}</b><span>Metered circuits</span></div>
      ${o === void 0 ? j : k`<div><b class="n">${Y(Math.max(0, o))}</b><span>Not metered</span></div>`}
    </div>
    <h3 class="t2">Top consumers</h3>
    ${s.length ? k`<div class="etop">${s.map((t) => k`<button @click=${() => e.moreInfo(t.m.power)}>
            <span class="lbl"><span>${t.m.name}</span><b class="n">${Y(t.w)}</b></span>
            <span class="bar"><span style="width:${Math.round(t.w / c * 100)}%"></span></span>
          </button>`)}</div>` : k`<span class="t2" style="font-size:13px">All circuits in standby.</span>`}
    ${l ? k`<span class="t2" style="font-size:12px;color:var(--atlas-warn)">${l} circuit${l > 1 ? "s" : ""} offline</span>` : j}
  </section>`;
}, Ni = (e, t) => {
	let n = Ci(e, t.power), r = t.max_power || Si, i = ki(e, t, n), a = (t) => t ? () => e.moreInfo(t) : void 0, o = [t.voltage ? X(V(e.hass, t.voltage), 1, " V") : "", t.frequency ? X(V(e.hass, t.frequency), 2, " Hz") : ""].filter(Boolean).join(" · ");
	return k`<div class="ecard ${i.cls}">
    <div class="row"><b class="ename">${t.name}</b><span class="estatus ${i.cls}"><i></i>${i.text}</span></div>
    <button class="egauge" aria-label="${t.name} power details" @click=${() => e.moreInfo(t.power)}>
      ${Ei(n === void 0 ? void 0 : n / r, 116, n !== void 0 && n > r * .8)}
      <span class="ev"><b class="n">${Y(n)}</b></span>
    </button>
    <div class="estats sm">
      ${t.energy ? Ai(X(V(e.hass, t.energy), 1, " kWh"), "Energy", a(t.energy)) : j}
      ${t.current ? Ai(X(V(e.hass, t.current), 2, " A"), "Current", a(t.current)) : j}
      ${t.power_factor ? Ai(X(wi(e, t.power_factor), 0, " %"), "PF", a(t.power_factor)) : j}
    </div>
    ${Oi(e, t)}
    ${o ? k`<span class="n t2 eextra">${o}</span>` : j}
  </div>`;
}, Pi = (e) => {
	let t = _(e.config), n = t.find((e) => e.main), r = t.filter((e) => e !== n), i = r.filter((t) => ki(e, t, Ci(e, t.power)).cls === "on").length;
	return k`
    <section class="hero" aria-label="Energy">
      <h1>Energy</h1>
      <p class="n">${r.length} circuit${r.length === 1 ? "" : "s"} metered <span style="opacity:.5">·</span> ${i} consuming now</p>
    </section>
    ${t.length ? k`<div class="energy-top">${n ? ji(e, n) : j}${Mi(e, n, r)}</div>
          ${r.length ? k`<section class="glass card" style="gap:14px">
                <div class="row"><h2>Circuits</h2><span class="t2" style="font-size:12px">Tap a value for its history</span></div>
                <div class="egrid">${r.map((t) => Ni(e, t))}</div>
              </section>` : j}` : k`<section class="glass card"><p class="empty">No energy meters configured. Add them in Edit dashboard > Energy.</p></section>`}
  `;
}, Fi = [
	"brightness",
	"color_temp",
	"hs",
	"xy",
	"rgb",
	"rgbw",
	"rgbww",
	"white"
], Ii = (e) => !!e && R(e.entity_id) === "light" && Array.isArray(e.attributes.supported_color_modes) && e.attributes.supported_color_modes.some((e) => Fi.includes(e)), Li = (e) => {
	if (e?.state !== "on") return 0;
	let t = e.attributes.brightness;
	return typeof t == "number" ? Math.max(1, Math.round(t / 255 * 100)) : 100;
}, Ri = (e) => e ? e.state === "unavailable" ? "Unavailable" : e.state === "unknown" ? "Unknown" : e.state === "on" ? Ii(e) ? `On · ${Li(e)} %` : "On" : "Off" : "Not found", zi = (e, t) => {
	let n = () => e.hass.states[t];
	return oi({
		start: () => Li(n()),
		canDrag: () => Ii(n()) && !B(n()),
		preview: (e, t) => {
			e.style.setProperty("--pct", `${t}%`);
			let n = e.querySelector(".lprev");
			n && (n.textContent = `${t} %`);
		},
		commit: (n) => e.call("light", "turn_on", {
			entity_id: t,
			brightness_pct: n
		}),
		tap: () => {
			let r = n();
			if (!r || B(r)) return e.moreInfo(t);
			let i = R(t);
			e.call([
				"light",
				"switch",
				"input_boolean"
			].includes(i) ? i : "homeassistant", "toggle", { entity_id: t });
		},
		hold: () => e.moreInfo(t)
	});
}, Bi = (e, t, n) => {
	let r = e.hass.states[n], i = r?.state === "on", a = !r || r.state === "unavailable", o = Ii(r), s = zi(e, n), c = (t.devices ?? []).find((e) => e.entity === n)?.name ?? ee(e.config, n) ?? String(r?.attributes.friendly_name ?? n);
	return k`<button class="ltile ${i ? "on" : ""} ${a ? "na" : ""} ${o ? "dim" : ""}" style="--pct:${Li(r)}%"
    title=${o ? `${c}: tap to toggle, drag to dim, hold for details` : `${c}: tap to toggle, hold for details`}
    @pointerdown=${s.down} @pointermove=${s.move} @pointerup=${s.up} @pointercancel=${s.cancel} @contextmenu=${s.context}
    @keydown=${(t) => {
		(t.key === "Enter" || t.key === " ") && (t.preventDefault(), e.call(R(n) === "light" ? "light" : "homeassistant", "toggle", { entity_id: n }));
	}}>
    <span class="lfill" aria-hidden="true"></span>
    <span class="lic">${G(R(n) === "light" ? "bulb" : "power", 20)}</span>
    <span class="ltxt"><b>${c}</b><span class="lstate">${Ri(r)}</span><span class="lstate lprev"></span></span>
  </button>`;
}, Vi = (e, t) => {
	let n = le(e.config, t), r = n.filter((t) => e.hass.states[t]?.state === "on");
	return k`<div class="lroom">
    <div class="row">
      <button class="lrname" @click=${() => e.openRoom(t)}><b>${t.name}</b><small class="t2">${r.length ? `${r.length} of ${n.length} on` : "All off"}</small></button>
      <button class="tog ${r.length ? "on" : ""}" role="switch" aria-checked=${r.length ? "true" : "false"} aria-label="${t.name} lights"
        @click=${() => e.call("homeassistant", r.length ? "turn_off" : "turn_on", { entity_id: r.length ? r : n })}><i></i></button>
    </div>
    <div class="ltiles">${n.map((n) => Bi(e, t, n))}</div>
  </div>`;
}, Hi = (e) => {
	let t = (t) => t.filter((t) => le(e.config, t).length), n = b(e.config).map((n) => ({
		title: `${n.name}${n.level ? ` · level ${n.level}` : ""}`,
		rooms: t(C(e.config, n.id))
	})).filter((e) => e.rooms.length), r = t(g(e.config).filter((t) => !t.floor || !S(e.config, t.floor)));
	r.length && n.push({
		title: "Other rooms",
		rooms: r
	});
	let i = [...new Set(n.flatMap((t) => t.rooms.flatMap((t) => le(e.config, t))))], a = i.filter((t) => e.hass.states[t]?.state === "on");
	return k`
    <section class="hero" aria-label="Lights">
      <h1 class="sm">Lights</h1>
      <p class="n">${a.length} of ${i.length} on <span style="opacity:.5">·</span> tap to toggle, drag to dim, hold for details</p>
    </section>
    <div class="row" style="padding:0 6px;justify-content:flex-end">
      <button class="ctl" ?disabled=${!a.length}
        @click=${() => e.confirm("Turn all lights off?", `${a.length} light${a.length === 1 ? " is" : "s are"} on.`, () => e.call("homeassistant", "turn_off", { entity_id: a }), "Turn off")}>
        ${G("power", 18)}All off
      </button>
    </div>
    ${n.length ? n.map((t) => k`<section class="glass card lfloor"><h2>${t.title}</h2><div class="lrooms">${t.rooms.map((t) => Vi(e, t))}</div></section>`) : k`<section class="glass card"><p class="empty">No room has lights yet. Add light devices to a room, or set its Light entities.</p></section>`}
  `;
}, Ui = (e) => g(e.config).some((t) => le(e.config, t).length), Wi = {
	critical: "Critical",
	warning: "Warning",
	minor: "Minor"
}, Gi = [
	["Settings", "/config/system"],
	["Logs", "/config/logs"],
	["Repairs", "/config/repairs"],
	["Updates", "/config/updates"]
], Ki = (e, t) => {
	let n = t ? Date.parse(t) : NaN;
	if (!Number.isFinite(n)) return "";
	let r = e.hass.locale?.language ?? e.hass.language ?? "en";
	return new Date(n).toLocaleString(r, {
		day: "2-digit",
		month: "short",
		hour: "2-digit",
		minute: "2-digit"
	});
}, qi = (e, t) => `${e} ${t}${e === 1 ? "" : "s"}`, Ji = (e) => k`<div class="inc ${e.severity}">
  <div class="incmain">
    <div class="inchead"><span class="itag ${e.severity}">${Wi[e.severity]}</span><b>${e.title}</b>${e.count ? k`<span class="icount n">${e.count}×</span>` : j}</div>
    ${e.detail ? k`<p>${e.detail}</p>` : j}
    ${e.sources.length ? k`<small class="t2">Source: ${e.sources.join(", ")}</small>` : j}
  </div>
  ${e.recommendation ? k`<div class="increc"><small>Recommendation</small><p>${e.recommendation}</p></div>` : j}
</div>`, Yi = (e) => {
	let t = e.config.entities?.incidents;
	if (!t) return j;
	let n = zt(z(e.hass, t)), r = n?.counts ?? {
		critical: 0,
		warning: 0,
		minor: 0
	}, i = r.critical + r.warning + r.minor, a = n ? r.critical ? "crit" : r.warning ? "warn" : i ? "info" : "ok" : "wait", o = n ? r.critical ? qi(r.critical, "critical incident") : r.warning ? `${qi(r.warning, "warning")} to check` : i ? qi(r.minor, "minor issue") : "No incidents in the latest scan" : "No report yet", s = n ? i ? [
		r.critical && qi(r.critical, "critical"),
		r.warning && qi(r.warning, "warning"),
		r.minor && `${r.minor} minor`
	].filter(Boolean).join(" · ") : "Home Assistant and add-on logs look clean." : `Waiting for ${t} to report. The analyzer publishes it after its next run.`;
	return k`<section class="glass card report">
    <div class="row">
      <h2>${W("system", 20)}Log report</h2>
      <button class="t2 more" @click=${() => e.moreInfo(t)}>${n?.generated ? `Updated ${Ki(e, n.generated)}` : "Details"} ${W("chevron", 14)}</button>
    </div>
    <div class="rbanner ${a}">
      <span class="rico">${a === "ok" ? G("shield", 22) : a === "wait" ? G("refresh", 22) : W("alert", 22)}</span>
      <span class="atxt"><b>${o}</b><small>${s}</small></span>
    </div>
    ${n ? k`<div class="rstats">
          ${[
		"critical",
		"warning",
		"minor"
	].map((e) => k`<div class="rstat ${e} ${r[e] ? "has" : ""}"><b class="n">${r[e]}</b><small>${Wi[e]}</small></div>`)}
        </div>
        ${n.incidents.length ? k`<div class="incs">${n.incidents.map(Ji)}</div>` : i ? k`<p class="t2" style="margin:0;font-size:12px">The sensor reports counts but no incident list.</p>` : j}` : j}
  </section>`;
}, Xi = (e) => {
	let t = Object.values(e.hass.states).filter((e) => R(e.entity_id) === "update");
	if (!t.length) return j;
	let n = t.filter((e) => e.state === "on"), r = (e) => String(e.attributes.title ?? e.attributes.friendly_name ?? e.entity_id), i = (e) => {
		let t = e.attributes;
		return t.in_progress ? "Installing" : !t.installed_version && !t.latest_version ? "Update available" : `${t.installed_version ?? "-"} → ${t.latest_version ?? "-"}`;
	};
	return k`<section class="glass card">
    <div class="row">
      <h2>${G("refresh", 20)}Updates</h2>
      <button class="t2 more" @click=${() => e.href("/config/updates")}>All updates ${W("chevron", 14)}</button>
    </div>
    ${n.length ? k`<div class="slist">
          ${n.map((t) => k`<div class="srow open"><button class="smain" @click=${() => e.moreInfo(t.entity_id)}>
              <span class="sic">${G("refresh", 18)}</span>
              <span class="atxt"><b>${r(t)}</b><small class="t2">${i(t)}</small></span>
            </button></div>`)}
        </div>` : k`<p class="t2" style="margin:0;font-size:13px">Everything is up to date.</p>`}
  </section>`;
}, Zi = (e) => {
	let t = ae(e.config).filter((t) => {
		let n = e.hass.states[t];
		return !n || n.state === "unavailable";
	});
	return k`<section class="glass card">
    <div class="row">
      <h2>${W("alert", 20)}Unavailable devices</h2>
      <span class="n t2" style="font-size:12px">${t.length ? `${t.length} of ${ae(e.config).length}` : "None"}</span>
    </div>
    ${t.length ? k`<div class="slist">
          ${t.map((t) => {
		let n = e.hass.states[t], r = E(e.config, t), i = ee(e.config, t) ?? String(n?.attributes.friendly_name ?? t);
		return k`<div class="srow na"><button class="smain" @click=${() => n ? e.moreInfo(t) : r ? e.openRoom(r) : void 0}>
              <span class="sic">${G(n ? "power" : "dot", 18)}</span>
              <span class="atxt"><b>${i}</b><small>${r ? `${r.name} · ` : ""}${n ? "Unavailable" : "Not found"} · ${t}</small></span>
            </button></div>`;
	})}
        </div>` : k`<p class="t2" style="margin:0;font-size:13px">Every entity in the dashboard config responds.</p>`}
  </section>`;
}, Qi = (e) => {
	let t = zt(z(e.hass, e.config.entities?.incidents)), n = e.hass.config?.version, r = [n ? `Home Assistant ${n}` : "", e.config.entities?.incidents ? t ? `Log report: ${t.counts.critical} critical · ${qi(t.counts.warning, "warning")} · ${t.counts.minor} minor` : "Log report: waiting" : ""].filter(Boolean);
	return k`
    <section class="hero" aria-label="System">
      <h1 class="sm">System</h1>
      ${r.length ? k`<p class="n">${r.join(" · ")}</p>` : j}
    </section>
    <div class="syslinks">
      ${Gi.map(([t, n]) => k`<button class="ctl" @click=${() => e.href(n)}>${t} ${W("chevron", 14)}</button>`)}
    </div>
    <div class="sys-grid">
      <div class="col">${Yi(e)}</div>
      <div class="col">${Xi(e)}${Zi(e)}</div>
    </div>
    ${er(e, e.config.layout?.system_cards, "main")}
  `;
}, Z = (e) => e === void 0 ? "–" : `${e.toFixed(2)} kW`, Q = (e) => e === void 0 ? "–" : `${e.toFixed(1)} kWh`, $i = (e, t, n, r, i) => {
	let a = n === void 0 ? 0 : Math.max(0, Math.min(1, n));
	return k`<button class="sgauge" @click=${() => i?.()} ?disabled=${!i}>
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(241,245,255,0.08)" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="75 100" transform="rotate(135 50 50)"></circle>
      ${a > 0 ? A`<circle cx="50" cy="50" r="40" fill="none" stroke=${r} stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray=${`${(a * 75).toFixed(1)} 100`} transform="rotate(135 50 50)"></circle>` : j}
    </svg>
    <b class="n">${t}</b><small>${e}</small>
  </button>`;
}, ea = (e, t, n, r) => {
	let i = e.stats;
	if (!t || !i) return k`<p class="t2" style="margin:0;font-size:12px">${t ? "Loading statistics..." : "Set Production today to see the hourly chart."}</p>`;
	let a = i.series[t] ?? [], o = n ? i.series[n] ?? [] : [], s = r ? i.series[r] ?? [] : [];
	if (!a.some((e) => e !== null)) return k`<p class="t2" style="margin:0;font-size:12px">No long-term statistics for ${t} yet (it needs a state class).</p>`;
	let c = Math.max(.5, ...[
		...a,
		...o,
		...s
	].map((e) => e ?? 0)), l = 1200, u = 1166 / 24, d = (e) => 10 + 168 * (1 - e / c), f = (e, t, n = "") => {
		let r = e.map((e, t) => e === null ? null : `${(34 + u * t + u / 2).toFixed(1)},${d(e).toFixed(1)}`).filter(Boolean);
		return r.length > 1 ? A`<polyline points=${r.join(" ")} fill="none" stroke=${t} stroke-width="2" stroke-linejoin="round" stroke-dasharray=${n}></polyline>` : j;
	};
	return k`<svg class="schart" viewBox="0 0 ${l} ${200}" role="img" aria-label="Energy per hour today">
      ${[
		0,
		c / 2,
		c
	].map((e) => A`<line x1=${34} x2=${l} y1=${d(e)} y2=${d(e)} stroke="rgba(241,245,255,0.08)"></line><text x=${28} y=${d(e) + 4} text-anchor="end" font-size="10" fill="rgba(188,200,222,0.7)">${e.toFixed(+(e < 2))}</text>`)}
      ${a.map((e, t) => e === null || e <= 0 ? j : A`<rect x=${34 + u * t + 2} y=${d(e)} width=${44.583333333333336} height=${d(0) - d(e)} rx="2" fill="var(--atlas-accent)" opacity="0.8"><title>${String(t).padStart(2, "0")}:00 ${e.toFixed(2)} kWh</title></rect>`)}
      ${f(o, "var(--atlas-warn)")}
      ${f(s, "#5ec8ff", "4 3")}
      ${[
		0,
		6,
		12,
		18,
		23
	].map((e) => A`<text x=${34 + u * e + u / 2} y=${194} text-anchor="middle" font-size="10" fill="rgba(188,200,222,0.7)">${String(e).padStart(2, "0")}h</text>`)}
    </svg>
    <div class="slegend"><span><i style="background:var(--atlas-accent)"></i>Production</span>${n ? k`<span><i style="background:var(--atlas-warn)"></i>House</span>` : j}${r ? k`<span><i style="background:#5ec8ff"></i>Export</span>` : j}<span class="t2">kWh per hour</span></div>`;
}, ta = (e) => {
	let t = e.config, n = t.solar ?? {}, r = t.entities ?? {}, i = de(t), a = n.house_load || r.house_load, o = n.grid_import || r.grid_import, s = n.grid_export || r.grid_export, c = H(e.hass, i), l = H(e.hass, a), u = H(e.hass, o), d = H(e.hass, s), f = (d ?? 0) > (u ?? 0), p = f ? d : u, m = V(e.hass, n.battery_soc), h = H(e.hass, n.battery_power), g = Number(n.peak_power) > 0 ? Number(n.peak_power) : 6, _ = V(e.hass, n.production_today), v = V(e.hass, n.consumption_today), y = V(e.hass, n.export_today), b = V(e.hass, n.import_today), x = V(e.hass, n.forecast_today), S = V(e.hass, n.remaining_today), C = V(e.hass, n.self_consumption), w = C ?? (_ !== void 0 && y !== void 0 && _ > 0 ? (_ - y) / _ * 100 : void 0), T = (t) => t ? () => e.moreInfo(t) : void 0, E = (t, n, r) => r ? k`<button class="vstat" @click=${() => e.moreInfo(r)}><b class="n">${n}</b><small>${t}</small></button>` : j, ee = (t) => {
		let n = z(e.hass, t);
		return !n || B(n) ? "–" : U(e.hass, n);
	}, te = (e, t) => k`<span class="link ${e ? `act ${t}` : ""}"></span>`, ne = n.strings ?? [], re = n.inverter ?? [];
	return k`
    <section class="hero" aria-label="Solar">
      <h1 class="sm">${n.name || "Solar"}</h1>
      <p class="n">${Z(c)} now${_ === void 0 ? "" : ` · ${Q(_)} today`}${x === void 0 ? "" : ` · forecast ${Q(x)}`}</p>
    </section>
    <div class="solar-grid">
      <section class="glass card">
        <div class="row"><h2>${W("solar", 20)}Live</h2>${f ? k`<span class="badge" style="background:rgba(94,200,255,0.18);color:#5ec8ff">Exporting</span>` : j}</div>
        <div class="flow sflow">
          <button class="node" @click=${() => T(i)?.()}><span class="c">${W("solar", 22)}</span><b class="n">${Z(c)}</b><span>Solar</span></button>
          ${te((c ?? 0) > .01, "r")}
          <button class="node house" @click=${() => T(a)?.()}><span class="c">${W("home", 24)}</span><b class="n">${Z(l)}</b><span>House</span></button>
          ${te((p ?? 0) > .01, f ? "r" : "l")}
          <button class="node" @click=${() => T(f ? s : o)?.()}><span class="c">${W("grid", 22)}</span><b class="n">${Z(p)}</b><span>${f ? "Grid export" : "Grid import"}</span></button>
        </div>
        <div class="sgauges">
          ${$i("Solar", Z(c), c === void 0 ? void 0 : c / g, "var(--atlas-accent)", T(i))}
          ${a ? $i("House", Z(l), l === void 0 ? void 0 : l / g, "var(--atlas-warn)", T(a)) : j}
          ${o || s ? $i(f ? "Export" : "Import", Z(p), p === void 0 ? void 0 : p / g, f ? "#5ec8ff" : "var(--atlas-crit)", T(f ? s : o)) : j}
          ${n.battery_soc ? $i(h === void 0 ? "Battery" : h > .01 ? "Charging" : h < -.01 ? "Discharging" : "Battery", m === void 0 ? "–" : `${Math.round(m)} %`, m === void 0 ? void 0 : m / 100, "#a7a3ff", T(n.battery_soc)) : j}
        </div>
      </section>
      <section class="glass card">
        <div class="row"><h2>${G("power", 20)}Today</h2></div>
        <div class="vstats">
          ${E("Generated", Q(_), n.production_today)}
          ${E("House", Q(v), n.consumption_today)}
          ${E("Exported", Q(y), n.export_today)}
          ${E("Imported", Q(b), n.import_today)}
          ${E("Forecast", Q(x), n.forecast_today)}
          ${E("Still expected", Q(S), n.remaining_today)}
        </div>
        ${w === void 0 ? j : k`<button class="scbar" @click=${() => n.self_consumption && e.moreInfo(n.self_consumption)}>
              <span class="row"><small class="t2">Self-consumption${C === void 0 ? " (production minus export)" : ""}</small><b class="n">${Math.round(w)} %</b></span>
              <i class="mbar"><i style="width:${Math.max(0, Math.min(100, w))}%;background:var(--atlas-accent)"></i></i>
            </button>`}
      </section>
    </div>
    <section class="glass card">
      <div class="row"><h2>Production today</h2><span class="t2" style="font-size:12px">per hour, from long-term statistics</span></div>
      ${ea(e, n.production_today, n.consumption_today, n.export_today)}
    </section>
    ${ne.length || re.length ? k`<div class="solar-grid">
          ${ne.length ? k`<section class="glass card">
                <h2>PV strings</h2>
                <div class="stable" role="table">
                  <div class="strow head" role="row"><span>String</span><span>Power</span><span>Voltage</span><span>Current</span></div>
                  ${ne.map((t) => k`<div class="strow" role="row"><b>${t.name}</b>
                    ${[
		t.power,
		t.voltage,
		t.current
	].map((t) => k`<button class="n" ?disabled=${!t} @click=${() => t && e.moreInfo(t)}>${ee(t)}</button>`)}</div>`)}
                </div>
              </section>` : j}
          ${re.length ? k`<section class="glass card">
                <h2>Inverter</h2>
                <div class="cextra">
                  ${re.map((t) => k`<button class="cx" @click=${() => e.moreInfo(t.entity)}>
                    <span class="cxi">${t.icon ? k`<ha-icon .icon=${t.icon} style="--mdc-icon-size:18px"></ha-icon>` : G(ar(t.entity, e.hass.states[t.entity]), 18)}</span>
                    <span><b class="n">${ee(t.entity)}</b><small>${J(e.hass, t)}</small></span></button>`)}
                </div>
              </section>` : j}
        </div>` : j}
  `;
}, na = (e) => {
	let t = e.config.solar ?? {};
	return [
		t.power,
		t.house_load,
		t.grid_import,
		t.grid_export,
		t.battery_soc,
		t.battery_power,
		t.production_today,
		t.consumption_today,
		t.export_today,
		t.import_today,
		t.forecast_today,
		t.remaining_today,
		t.self_consumption,
		...(t.strings ?? []).flatMap((e) => [
			e.power,
			e.voltage,
			e.current
		]),
		...(t.inverter ?? []).map((e) => e.entity)
	].filter((e) => !!e);
}, ra = (e, t) => {
	let n = z(e.hass, t);
	return !n || B(n) ? "–" : U(e.hass, n);
}, ia = (e) => e < .3 ? "#5ec8ff" : e < .6 ? "var(--atlas-accent)" : e < .8 ? "var(--atlas-warn)" : "var(--atlas-crit)", aa = (e, t) => e !== void 0 && t !== void 0 && t > 0 ? e / t : void 0, oa = (e, t, n, r) => n?.length ? k`<section class="glass card">
        <h2>${G(r, 20)}${t}</h2>
        <div class="cextra">
          ${n.map((t) => k`<button class="cx" @click=${() => e.moreInfo(t.entity)}>
            <span class="cxi">${t.icon ? k`<ha-icon .icon=${t.icon} style="--mdc-icon-size:18px"></ha-icon>` : G(ar(t.entity, e.hass.states[t.entity]), 18)}</span>
            <span><b class="n">${ra(e, t.entity)}</b><small>${J(e.hass, t)}</small></span></button>`)}
        </div>
      </section>` : j, sa = (e) => {
	let t = e.config.heat_pump ?? {}, n = pe(e.config), r = z(e.hass, n), i = r && !B(r) ? Number(r.attributes.current_temperature) : void 0, a = r && !B(r) ? Number(r.attributes.temperature) : void 0, o = r && !B(r) ? String(r.attributes.hvac_action ?? r.state) : void 0, s = Number.isFinite(Number(t.gauge_min)) && t.gauge_min !== void 0 ? Number(t.gauge_min) : -20, c = Number.isFinite(Number(t.gauge_max)) && t.gauge_max !== void 0 ? Number(t.gauge_max) : 80, l = aa(V(e.hass, t.energy_produced), V(e.hass, t.energy_consumed)), u = z(e.hass, t.connection), d = !!t.connection && (!u || B(u) || [
		"off",
		"disconnected",
		"offline"
	].includes(u.state.toLowerCase())), f = (t, n, r = !1) => n ? k`<button class="schip ${r ? "warn" : ""}" @click=${() => e.moreInfo(n)}><span><b>${ra(e, n)}</b><small>${t}</small></span></button>` : j, p = (t.gauges ?? []).slice(0, 4), m = [
		o ? o.charAt(0).toUpperCase() + o.slice(1) : "",
		i !== void 0 && Number.isFinite(i) ? `${i.toFixed(1)} °C` : "",
		l === void 0 ? "" : `COP ${l.toFixed(1)}`
	].filter(Boolean);
	return k`
    <section class="hero" aria-label="Heat pump">
      <h1 class="sm">${t.name || "Heat pump"}</h1>
      ${m.length ? k`<p class="n">${m.join(" · ")}</p>` : j}
    </section>
    <div class="strip" style="padding:0 6px">
      ${n ? k`<button class="schip ${o === "heating" ? "on" : ""}" @click=${() => e.moreInfo(n)}>${W("climate", 18)}<span><b>${i !== void 0 && Number.isFinite(i) ? `${i.toFixed(1)} °C` : "–"}${a !== void 0 && Number.isFinite(a) ? ` → ${a.toFixed(1)} °C` : ""}</b><small>${o ?? "Unavailable"}</small></span></button>` : j}
      ${f("Compressor", t.status)}
      ${f("Priority", t.priority)}
      ${f("Mode", t.mode)}
      ${f("Connection", t.connection, d)}
      ${f("Degree minutes", t.degree_minutes)}
    </div>
    ${p.length ? k`<section class="glass card">
          <h2>${W("temperature", 20)}Temperatures</h2>
          <div class="sgauges">
            ${p.map((t) => {
		let n = V(e.hass, t.entity), r = n === void 0 ? void 0 : (n - s) / (c - s || 1), i = r === void 0 ? "var(--atlas-text2)" : ia(Math.max(0, Math.min(1, r))), a = r === void 0 ? 0 : Math.max(0, Math.min(1, r));
		return k`<button class="sgauge" @click=${() => e.moreInfo(t.entity)}>
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(241,245,255,0.08)" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="75 100" transform="rotate(135 50 50)"></circle>
                  ${a > 0 ? A`<circle cx="50" cy="50" r="40" fill="none" stroke=${i} stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray=${`${(a * 75).toFixed(1)} 100`} transform="rotate(135 50 50)"></circle>` : j}
                </svg>
                <b class="n" style="color:${i}">${n === void 0 ? "–" : `${n.toFixed(1)}°`}</b><small>${J(e.hass, t)}</small>
              </button>`;
	})}
          </div>
        </section>` : j}
    <div class="solar-grid">
      ${t.energy_produced || t.energy_consumed || t.power || t.energy?.length ? k`<section class="glass card">
            <h2>${G("power", 20)}Energy</h2>
            <div class="vstats">
              ${t.energy_produced ? k`<button class="vstat" @click=${() => e.moreInfo(t.energy_produced)}><b class="n">${ra(e, t.energy_produced)}</b><small>Produced</small></button>` : j}
              ${t.energy_consumed ? k`<button class="vstat" @click=${() => e.moreInfo(t.energy_consumed)}><b class="n">${ra(e, t.energy_consumed)}</b><small>Consumed</small></button>` : j}
              ${t.energy_produced && t.energy_consumed ? k`<div class="vstat"><b class="n" style="color:var(--atlas-accent)">${l === void 0 ? "–" : l.toFixed(2)}</b><small>COP (produced / consumed)</small></div>` : j}
              ${t.power ? k`<button class="vstat" @click=${() => e.moreInfo(t.power)}><b class="n">${ra(e, t.power)}</b><small>Power now</small></button>` : j}
              ${(t.energy ?? []).map((t) => k`<button class="vstat" @click=${() => e.moreInfo(t.entity)}><b class="n">${ra(e, t.entity)}</b><small>${J(e.hass, t)}</small></button>`)}
            </div>
          </section>` : j}
      ${oa(e, "Pressures", t.pressures, "thermo")}
    </div>
    <div class="solar-grid">
      ${oa(e, "Refrigerant circuit", t.circuit, "heat")}
      ${oa(e, "Run times", t.runtimes, "refresh")}
    </div>
  `;
}, ca = (e) => {
	let t = e.heat_pump ?? {};
	return [
		t.climate,
		t.status,
		t.priority,
		t.mode,
		t.connection,
		t.degree_minutes,
		t.energy_produced,
		t.energy_consumed,
		t.power,
		...[
			t.gauges,
			t.energy,
			t.pressures,
			t.circuit,
			t.runtimes
		].flatMap((e) => (e ?? []).map((e) => e.entity))
	].filter((e) => !!e);
}, la = (e = /* @__PURE__ */ new Date()) => new Date(e.getFullYear(), e.getMonth(), e.getDate()), ua = (e) => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`, da = async (e, t, n = /* @__PURE__ */ new Date()) => {
	let r = la(n), i = new Date(r.getTime() + 864e5), a = await e.callWS({
		type: "recorder/statistics_during_period",
		start_time: r.toISOString(),
		end_time: i.toISOString(),
		statistic_ids: t,
		period: "hour",
		types: ["change"]
	}), o = {};
	for (let e of t) {
		let t = Array(24).fill(null);
		for (let n of a?.[e] ?? []) {
			let e = typeof n.start == "number" ? n.start : Date.parse(n.start), a = new Date(e).getHours();
			e >= r.getTime() && e < i.getTime() && typeof n.change == "number" && Number.isFinite(n.change) && (t[a] = Math.max(0, n.change));
		}
		for (let r = 0; r <= n.getHours() && r < 24; r++) t[r] === null && (a?.[e]?.length ?? 0) > 0 && (t[r] = 0);
		o[e] = t;
	}
	return {
		day: ua(n),
		fetched: Date.now(),
		series: o
	};
}, fa, pa = {
	graphite: {
		base: [
			"#1A1D22",
			"#14171C",
			"#0E1014"
		],
		g: [
			"rgba(150,160,180,0.14)",
			"rgba(130,140,160,0.12)",
			"rgba(170,180,200,0.16)",
			"rgba(50,54,62,0.5)"
		],
		light: "rgba(220,228,240,0.4)",
		tile: "120,130,150",
		dark: "20,23,28"
	},
	midnight: {
		base: [
			"#101830",
			"#0B1122",
			"#060A14"
		],
		g: [
			"rgba(70,110,210,0.26)",
			"rgba(100,80,210,0.20)",
			"rgba(60,150,230,0.22)",
			"rgba(25,35,70,0.55)"
		],
		light: "rgba(150,190,255,0.55)",
		tile: "70,100,180",
		dark: "12,16,30"
	},
	deep_teal: {
		base: [
			"#0D1E1E",
			"#091616",
			"#050D0D"
		],
		g: [
			"rgba(40,170,155,0.22)",
			"rgba(30,120,150,0.20)",
			"rgba(70,190,170,0.22)",
			"rgba(18,50,50,0.55)"
		],
		light: "rgba(150,245,225,0.5)",
		tile: "50,140,130",
		dark: "10,22,22"
	},
	violet_night: {
		base: [
			"#1A1230",
			"#120C22",
			"#0A0714"
		],
		g: [
			"rgba(150,90,230,0.24)",
			"rgba(210,90,180,0.18)",
			"rgba(110,80,230,0.22)",
			"rgba(45,30,75,0.55)"
		],
		light: "rgba(225,185,255,0.55)",
		tile: "130,90,200",
		dark: "20,14,32"
	},
	warm: {
		base: [
			"#1C1712",
			"#15110D",
			"#0E0B09"
		],
		g: [
			"rgba(255,170,90,0.22)",
			"rgba(255,190,120,0.20)",
			"rgba(255,160,80,0.30)",
			"rgba(90,70,55,0.55)"
		],
		light: "rgba(255,205,140,0.7)",
		tile: "170,120,80",
		dark: "20,18,16"
	}
}, ma = "atlas-home.device", ha = () => {
	try {
		return JSON.parse(localStorage.getItem(ma) ?? "{}");
	} catch {
		return {};
	}
}, ga = (e) => {
	try {
		localStorage.setItem(ma, JSON.stringify(e));
	} catch {}
}, _a = (e) => [
	1,
	3,
	5
].map((t) => parseInt(e.slice(t, t + 2), 16)).join(","), va = {}, ya, ba = !1, xa = {}, Sa = class extends M {
	constructor() {
		super(), this._fcSubs = /* @__PURE__ */ new Map(), this._onResize = () => this._side && this._fitSide(this._side), this._onMq = (e) => this._narrow = e.matches, this._call = async (e, t, n) => {
			try {
				await this.hass.callService(e, t, n);
			} catch (n) {
				f(this, "hass-notification", { message: `ATLAS: ${e}.${t} failed: ${n?.message ?? n}` });
			}
		}, this._settings = !1, this._prefs = ha(), this._narrow = !1, this._tick = 0;
	}
	setConfig(e) {
		if (!e?.atlas) throw Error("atlas-view is generated by the ATLAS Home dashboard strategy");
		this._config = e;
		let t = e.atlas;
		this._relevant = /* @__PURE__ */ new Set([
			...ae(t),
			...(t.alerts?.temperature_rules ?? []).map((e) => e.entity),
			...t.alerts?.exterior_doors ?? [],
			...t.alerts?.interior_doors ?? [],
			...t.alerts?.critical ?? [],
			...[t.alerts?.mailbox, t.alerts?.mailbox_ack].filter((e) => !!e),
			...t.entities?.exclude_lights ?? [],
			...t.entities?.persons ?? [],
			...na({ config: t }),
			...ca(t),
			...t.alerts?.rain_windows ?? [],
			...[t.alerts?.rain_weather].filter((e) => !!e),
			...y(t),
			...g(t).flatMap((e) => [
				...(e.climate_extra ?? []).map((e) => e.entity),
				...e.light_entities ?? [],
				...e.automations ?? [],
				e.printer_status,
				e.printer_progress,
				e.printer_remaining,
				e.printer_nozzle,
				e.printer_bed,
				e.printer_chamber,
				e.printer_light,
				e.printer_picture,
				..._n(e),
				...zn(e),
				...Jn(e)
			]).filter((e) => !!e)
		]), e.view === "room" && this._prepareCamera(w(x(t, e.room)));
		let n = this._floorCameras();
		n.mode === "live" && this._prepareCamera(n.cameras[0]);
	}
	_floorCameras() {
		let e = this._config;
		if (!e || e.view !== "rooms") return {
			mode: "off",
			cameras: []
		};
		let t = S(e.atlas, e.floor) ?? b(e.atlas)[0], n = t?.cameras ?? "off";
		return n === "off" ? {
			mode: n,
			cameras: []
		} : {
			mode: n,
			cameras: T(e.atlas, t.id).map((e) => e.camera)
		};
	}
	getCardSize() {
		return 12;
	}
	connectedCallback() {
		super.connectedCallback();
		let e = this._config?.view === "home" || this._config?.view === "security" || this._floorCameras().mode !== "off" ? 1e4 : 3e4;
		this._timer = window.setInterval(() => this._tick = Date.now(), e), this._mq = window.matchMedia("(max-width: 760px)"), this._narrow = this._mq.matches, this._mq.addEventListener("change", this._onMq);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.clearInterval(this._timer), this._mq?.removeEventListener("change", this._onMq), this._ro?.disconnect(), this._wall = void 0, this._sideRo?.disconnect(), this._side = void 0, window.removeEventListener("resize", this._onResize);
		for (let e of this._fcSubs.values()) e.then((e) => e()).catch(() => void 0);
		this._fcSubs.clear();
	}
	_syncStats() {
		let e = this._config;
		if (!e || e.view !== "solar" || !this.hass || ba) return;
		let t = e.atlas.solar ?? {}, n = [
			t.production_today,
			t.consumption_today,
			t.export_today
		].filter((e) => !!e);
		n.length && (ya && ya.day === ua(/* @__PURE__ */ new Date()) && Date.now() - ya.fetched < 6e5 && n.every((e) => e in ya.series) || (ba = !0, da(this.hass, n).then((e) => ya = e).catch((e) => console.warn("ATLAS: statistics not available", e)).finally(() => {
			ba = !1, this.requestUpdate();
		})));
	}
	_neededForecasts() {
		let e = this._config?.atlas;
		if (!e || !this.hass) return [];
		let t = [], n = e.entities?.weather;
		if (n && this._config.view === "home") {
			let e = Ut(this.hass.states[n]), r = va.wxType ?? e[0];
			r && e.includes(r) && t.push([n, r]);
		}
		let r = e.alerts?.rain_weather || n;
		return r && e.alerts?.rain_windows?.length && Ht(this.hass.states[r]).includes("hourly") && t.push([r, "hourly"]), t;
	}
	_syncForecasts() {
		let e = this.hass?.connection;
		if (!e || !this.isConnected) return;
		let t = new Map(this._neededForecasts().map(([e, t]) => [Bt(e, t), [e, t]]));
		for (let [e, n] of this._fcSubs) t.has(e) || (n.then((e) => e()).catch(() => void 0), this._fcSubs.delete(e));
		for (let [n, [r, i]] of t) {
			if (this._fcSubs.has(n)) continue;
			let t = e.subscribeMessage((e) => {
				xa[n] = e.forecast ?? null, this.requestUpdate();
			}, {
				type: "weather/subscribe_forecast",
				entity_id: r,
				forecast_type: i
			});
			t.catch(() => this._fcSubs.delete(n)), this._fcSubs.set(n, t);
		}
	}
	_fitPage() {
		let e = this._floorCameras();
		return !this._narrow && e.mode !== "off" && e.cameras.length > 0;
	}
	updated() {
		this._syncForecasts(), this._syncStats(), this._watchSide();
		let e = this.renderRoot.querySelector(".camwall.fitwall") ?? void 0;
		e !== this._wall && (this._ro?.disconnect(), this._wall = e, e && (this._ro = new ResizeObserver(() => this._fitWall(e)), this._ro.observe(e)));
	}
	_watchSide() {
		let e = this.renderRoot.querySelector(".room-grid.has-side > .scol") ?? void 0;
		e !== this._side && (this._sideRo?.disconnect(), window.removeEventListener("resize", this._onResize), this._side = e, e?.firstElementChild && (this._sideRo = new ResizeObserver(() => this._fitSide(e)), this._sideRo.observe(e.firstElementChild), window.addEventListener("resize", this._onResize)));
	}
	_fitSide(e) {
		let t = e.firstElementChild;
		if (!t) return;
		let n = window.innerWidth > 1200, r = Number(e.style.zoom || 1), i = t.getBoundingClientRect().height / r, a = this.renderRoot.querySelector(".root");
		if (!n || !a || !i) {
			e.style.zoom && (e.style.zoom = "");
			return;
		}
		let o = parseFloat(getComputedStyle(this).getPropertyValue("--header-height")) || 0, s = e.getBoundingClientRect().top - a.getBoundingClientRect().top + o, c = window.innerHeight - s - 16, l = Math.max(.75, Math.min(1, c / i)), u = l > .995 ? "" : l.toFixed(3);
		e.style.zoom !== u && (e.style.zoom = u);
	}
	_fitWall(e) {
		let t = e.children.length, n = e.clientWidth, r = e.clientHeight;
		if (!t || n <= 0 || r <= 0) return;
		let i = {
			cols: 1,
			w: 0
		};
		for (let e = 1; e <= t; e++) {
			let a = Math.ceil(t / e), o = (n - 12 * (e - 1)) / e, s = ((r - 12 * (a - 1)) / a - 30) * 16 / 9, c = Math.floor(Math.min(o, s));
			c > i.w && (i = {
				cols: e,
				w: c
			});
		}
		e.style.setProperty("--fcols", String(i.cols)), e.style.setProperty("--fw", `${Math.max(i.w, 120)}px`);
	}
	shouldUpdate(e) {
		if (e.size > 1 || !e.has("hass")) return !0;
		let t = e.get("hass");
		if (!t || !this.hass || !this._relevant) return !0;
		this.renderRoot?.querySelectorAll?.("atlas-hui-card").forEach((e) => e.hass = this.hass);
		for (let e of this._relevant) if (t.states[e] !== this.hass.states[e]) return !0;
		if (this._config?.view === "system") {
			for (let e in this.hass.states) if (e.startsWith("update.") && t.states[e] !== this.hass.states[e]) return !0;
		}
		return !1;
	}
	async _prepareCamera(e) {
		if (e && !customElements.get("ha-camera-stream")) try {
			(await window.loadCardHelpers?.())?.createCardElement({
				type: "picture-glance",
				entities: [],
				camera_image: e
			}), await customElements.whenDefined("ha-camera-stream"), this.requestUpdate();
		} catch {}
	}
	_ctx(e) {
		let t = this._config, n = new Set(e.filter((e) => e.roomBadge === "Too hot" && e.room).map((e) => e.room));
		return {
			hass: this.hass,
			config: t.atlas,
			alerts: e,
			badges: $t(e),
			hot: n,
			floorId: t.floor,
			roomId: t.room,
			narrow: this._narrow,
			tick: this._tick,
			go: (e) => d(e),
			href: (e) => l(e),
			openRoom: (e) => d(`room-${typeof e == "string" ? e : e.id}`),
			moreInfo: (e) => p(this, e),
			call: this._call,
			confirm: (e, t, n, r = "Confirm") => this._confirm = {
				title: e,
				text: t,
				action: n,
				ok: r
			},
			openAlert: (e) => {
				e.room ? d(`room-${e.room}`) : e.view ? d(e.view) : e.entity ? p(this, e.entity) : e.href ? l(e.href) : d("alerts");
			},
			refresh: () => this.requestUpdate(),
			ui: va,
			forecasts: xa,
			stats: ya
		};
	}
	render() {
		if (!this._config || !this.hass) return j;
		let e = this._config.atlas, t = e.appearance ?? {}, n = this._prefs.variant ?? t.variant ?? "warm_glass", r = this._prefs.accent && /^#[0-9a-fA-F]{6}$/.test(this._prefs.accent) ? this._prefs.accent : ie(e), i = pa[t.ambience ?? "graphite"] ?? pa.graphite, a = _a(r), o = `--atlas-accent:${r};--atlas-accent-soft:rgba(${a},0.16);--atlas-accent-glow:rgba(${a},0.45);--atlas-tile:${i.tile}`;
		if (!g(e).length) return k`<div class="root v-quiet" style=${o}><div class="frame"><div class="main">
        <section class="glass card" style="max-width:640px;margin:10vh auto;gap:14px">
          <h2 style="font-size:24px">${W("home", 28)}ATLAS Home</h2>
          <p class="t2">No rooms configured yet. Open the dashboard menu, choose <b>Edit dashboard</b>, then <b>Load demo house</b> or paste your own config in YAML mode, and save.</p>
        </section></div></div></div>`;
		let s = Qt(this.hass, e, xa), c = this._ctx(s), l = this._config.view, u = l === "room" ? x(e, this._config.room) : void 0, d = n === "warm_glass" ? re(e, u) ?? re(e, x(e, t.background) ?? g(e)[0]) : void 0, f;
		return f = l === "home" ? Gr(c) : l === "alerts" ? qr(c) : l === "rooms" ? Xr(c) : l === "energy" ? Pi(c) : l === "lights" ? Hi(c) : l === "security" ? Nr(c) : l === "system" ? Qi(c) : l === "solar" ? ta(c) : l === "heatpump" ? sa(c) : bi(c), k`<div class="root v-${n}" style=${o}>
      ${this._background(n, i, d)}
      <div class="frame">
        ${this._sidebar(c)}
        <div class="main ${this._fitPage() ? "fit" : ""}">
          ${this._topbar(c)}
          ${f}
        </div>
      </div>
      ${this._bottomNav(c)}
      ${this._settings ? this._settingsPanel(n, r) : j}
      ${this._confirm ? this._confirmDialog() : j}
    </div>`;
	}
	_background(e, t, n) {
		if (e === "quiet") return k`<div class="bg" style="background:var(--atlas-canvas)"></div>`;
		let r = (e, t, n, r, i, a) => k`<div class="blob" style="left:${e}%;top:${t}%;width:${n}px;height:${r}px;background:${i};filter:blur(${a}px)"></div>`;
		return k`<div class="bg" aria-hidden="true" style="background:linear-gradient(180deg,${t.base[0]} 0%,${t.base[1]} 60%,${t.base[2]} 100%)">
      ${r(4, 2, 520, 380, t.g[0], 90)}${r(62, -6, 640, 420, t.g[1], 100)}${r(78, 40, 300, 300, t.g[2], 70)}${r(30, 55, 700, 360, t.g[3], 80)}
      ${r(12, 18, 60, 60, t.light, 14)}${r(52, 10, 46, 46, t.light, 12)}${r(88, 22, 70, 70, t.light, 16)}${r(70, 78, 50, 50, t.light, 14)}
      ${n ? k`<img class="photo" src=${n} alt="" /><div class="tint" style="background:linear-gradient(180deg,rgba(${t.dark},0.35) 0%,rgba(${t.dark},0.6) 100%)"></div>` : j}
    </div>`;
	}
	_sidebar(e) {
		let t = this._config.view, n = e.config.entities ?? {}, r = this._energyNav(e), i = [
			[
				"Home",
				"home",
				t === "home" || t === "alerts",
				() => e.go("home")
			],
			[
				"Rooms",
				"rooms",
				t === "rooms" || t === "room",
				() => e.go("rooms")
			],
			...Ui(e) ? [[
				"Lights",
				"light",
				t === "lights",
				() => e.go("lights")
			]] : [],
			[
				"Energy",
				"energy",
				t === "energy",
				r
			],
			...fe(e.config) ? [[
				e.config.solar?.name || "Solar",
				"solar",
				t === "solar",
				() => e.go("solar")
			]] : [],
			[
				me(e.config) ? e.config.heat_pump?.name || "Heat pump" : "Climate",
				"climate",
				t === "heatpump",
				() => me(e.config) ? e.go("heatpump") : n.heat_pump ? e.moreInfo(n.heat_pump) : void 0
			],
			[
				"Security",
				"security",
				t === "security",
				() => se(e.config) ? e.go("security") : n.alarm ? e.moreInfo(n.alarm) : void 0
			],
			[
				"Automations",
				"automations",
				!1,
				() => e.href("/config/automation/dashboard")
			],
			[
				"System",
				"system",
				t === "system",
				() => e.go("system")
			]
		], a = this.hass.user?.name ?? "";
		return k`<aside class="glass">
      <button class="logo" @click=${() => e.go("home")}>${W("home", 34)}<span class="lt"><b>ATLAS</b><small>Smart Home</small></span></button>
      <nav class="nav" aria-label="Main">
        ${i.map(([e, t, n, r]) => k`<button class=${n ? "on" : ""} aria-current=${n ? "page" : "false"} title=${e} @click=${r}>${W(t, 20)}<span class="lbl">${e}</span></button>`)}
      </nav>
      ${a ? k`<div class="user"><span class="avatar">${a.charAt(0).toUpperCase()}</span><span class="lbl">${a}</span></div>` : j}
    </aside>`;
	}
	_topbar(e) {
		let t = this._config.view, n = e.config.entities ?? {}, r = [
			[
				"Home",
				"home",
				t === "home" || t === "alerts"
			],
			...(e.config.layout?.top_tabs ?? []).map((t) => x(e.config, t)).filter((e) => !!e).map((e) => [
				e.name,
				`room-${e.id}`,
				t === "room" && this._config.room === e.id
			]),
			[
				"All rooms",
				"rooms",
				t === "rooms"
			]
		], i = z(this.hass, n.weather), a = V(this.hass, n.outdoor_temperature) ?? (B(i) ? void 0 : Number(i.attributes.temperature)), o = /* @__PURE__ */ new Date(), s = this.hass.locale?.language ?? this.hass.language ?? "en", c = o.toLocaleDateString(s, {
			weekday: "short",
			day: "numeric",
			month: "short"
		}), l = o.toLocaleTimeString(s, {
			hour: "2-digit",
			minute: "2-digit",
			hour12: !1
		});
		return k`<header class="glass top">
      <span class="mlogo">${W("home", 24)}<b>ATLAS</b></span>
      <div class="tabs" role="tablist" aria-label="Views">
        ${r.map(([t, n, r]) => k`<button role="tab" aria-selected=${r ? "true" : "false"} class=${r ? "on" : ""} @click=${() => e.go(n)}>${t}</button>`)}
      </div>
      <div class="tools">
        ${n.weather || n.outdoor_temperature ? k`<button class="weather" @click=${() => n.weather && e.moreInfo(n.weather)}>
              ${un(B(i) ? void 0 : i.state)}
              <span><span class="n" style="font-size:15px;font-weight:600">${a !== void 0 && Number.isFinite(a) ? `${a.toFixed(1)} °C` : "–"}</span>
              <span class="t2 wtxt" style="font-size:11px">${i && !B(i) ? U(this.hass, i) : "Weather unavailable"} · ${c}</span></span>
            </button>` : j}
        <span class="clock n">${l}</span>
        <button class="iconbtn" aria-label="Display settings" @click=${() => this._settings = !this._settings}>${W("settings", 22)}</button>
      </div>
    </header>`;
	}
	_energyNav(e) {
		return () => _(e.config).length ? e.go("energy") : e.href("/energy");
	}
	_bottomNav(e) {
		let t = this._config.view, n = e.config.entities ?? {}, r = this._energyNav(e);
		return k`<nav class="glass bnav" aria-label="Main">
      ${[
			[
				"Home",
				"home",
				t === "home",
				() => e.go("home")
			],
			[
				"Rooms",
				"rooms",
				t === "rooms" || t === "room",
				() => e.go("rooms")
			],
			...Ui(e) ? [[
				"Lights",
				"light",
				t === "lights",
				() => e.go("lights")
			]] : [[
				"Climate",
				"climate",
				t === "heatpump",
				() => me(e.config) ? e.go("heatpump") : n.heat_pump ? e.moreInfo(n.heat_pump) : void 0
			]],
			[
				"Energy",
				"energy",
				t === "energy",
				r
			],
			[
				"Alerts",
				"alert",
				t === "alerts",
				() => e.go("alerts")
			]
		].map(([e, t, n, r]) => k`<button class=${n ? "on" : ""} @click=${r}>${W(t, 22)}${e}</button>`)}
    </nav>`;
	}
	_settingsPanel(e, t) {
		let n = (e) => {
			this._prefs = {
				...this._prefs,
				...e
			}, ga(this._prefs);
		};
		return k`<div class="settings" role="dialog" aria-label="Display settings">
      <div class="row"><b>Display on this device</b><button class="iconbtn" aria-label="Close" @click=${() => this._settings = !1}>✕</button></div>
      <span class="t2" style="font-size:12px">Style</span>
      <div class="seg">${[
			["warm_glass", "Warm glass"],
			["glass", "Glass"],
			["quiet", "Quiet"]
		].map(([t, r]) => k`<button class=${e === t ? "on" : ""} @click=${() => n({ variant: t })}>${r}</button>`)}</div>
      <span class="t2" style="font-size:12px">Accent</span>
      <div class="seg">${o.map((e) => k`<button class="sw ${t === e ? "on" : ""}" style="background:${e}" aria-label="Accent ${e}" @click=${() => n({ accent: e })}></button>`)}</div>
      <button class="ctl" @click=${() => {
			this._prefs = {}, ga({});
		}}>Use dashboard defaults</button>
      <span class="t2" style="font-size:11px">Stored in this browser only. Defaults and all entities are set in Edit dashboard.</span>
    </div>`;
	}
	_confirmDialog() {
		let e = this._confirm, t = () => this._confirm = void 0;
		return k`<div class="scrim" @click=${t}>
      <div class="dialog" role="alertdialog" aria-modal="true" aria-label=${e.title} @click=${(e) => e.stopPropagation()}>
        <h2>${e.title}</h2>
        <p class="t2">${e.text}</p>
        <div class="acts">
          <button class="ctl" @click=${t}>Cancel</button>
          <button class="ctl ok" @click=${() => {
			t(), e.action();
		}}>${e.ok}</button>
        </div>
      </div>
    </div>`;
	}
};
fa = Sa, fa.styles = en, fa.properties = {
	hass: { attribute: !1 },
	_config: { state: !0 },
	_confirm: { state: !0 },
	_settings: { state: !0 },
	_prefs: { state: !0 },
	_narrow: { state: !0 },
	_tick: { state: !0 }
};
// src/ui/embedded-card.ts
var Ca = class extends HTMLElement {
	constructor(...e) {
		super(...e), this._key = "", this._onRebuild = (e) => {
			e.stopPropagation(), this._build();
		};
	}
	set config(e) {
		let t = JSON.stringify(e ?? null);
		t !== this._key && (this._key = t, this._config = e, this._build());
	}
	set hass(e) {
		this._hass = e, this._card && e && (this._card.hass = e);
	}
	get hass() {
		return this._hass;
	}
	connectedCallback() {
		this.style.display = "block", this.addEventListener("ll-rebuild", this._onRebuild);
	}
	disconnectedCallback() {
		this.removeEventListener("ll-rebuild", this._onRebuild);
	}
	async _build() {
		let e = this._config;
		if (!e || typeof e != "object" || !e.type) this._show("Card config needs a \"type\" (e.g. custom:my-card).");
		else try {
			let t = await window.loadCardHelpers?.();
			if (!t) throw Error("card helpers not available");
			let n = await t.createCardElement(e);
			if (this._config !== e) return;
			this._hass && (n.hass = this._hass), this._card = n, this.replaceChildren(n);
		} catch (e) {
			this._show(`Could not create card: ${e?.message ?? e}`);
		}
	}
	_show(e) {
		this._card = void 0;
		let t = document.createElement("p");
		t.textContent = e, t.style.cssText = "margin:0;padding:12px;border-radius:12px;border:1px dashed #FFBF57;color:#FFBF57;font-size:13px", this.replaceChildren(t);
	}
}, wa = "2.0.0", Ta = "\n  :host {\n    display: flex;\n    justify-content: center;\n    align-items: flex-start;\n  }\n\n  * { box-sizing: border-box; }\n\n  .remote {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    gap: 8px;\n    background: #1c1c1c;\n    border: 2px solid #141414;\n    border-radius: 40px;\n    padding: 28px 18px 20px;\n    box-shadow: inset 0 4px 10px rgba(255,255,255,0.05);\n    width: 100%;\n    max-width: 250px;\n    font-family: -apple-system, 'Helvetica Neue', sans-serif;\n  }\n\n  .row {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    width: 100%;\n    gap: 6px;\n  }\n\n  /* ── Base round button ── */\n.btn {\n  position: relative;                 /* REQUIRED for pseudo-elements */\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n\n  background: rgba(30,30,30,0.9);\n  border: 0;                           /* we replace the border */\n  border-radius: 50%;\n  cursor: pointer;\n\n  transition: filter .1s, transform .08s;\n  -webkit-tap-highlight-color: transparent;\n  touch-action: manipulation;\n  flex-shrink: 0;\n}\n\n/* --- BASE INNER BORDER --- */\n.btn::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n\n  box-shadow:\n    inset 0 0 0 1px rgba(255,255,255,0.18),\n    inset 0 0 10px rgba(255,255,255,0.12);\n\n  opacity: 0.6;\n  transition: opacity 160ms ease;\n}\n\n/* --- HOVER / ACTIVE BORDER (STRONGER) --- */\n.btn::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n\n  box-shadow:\n    inset 0 0 0 1px rgba(255,255,255,0.4),\n    inset 0 0 18px rgba(255,255,255,0.32);\n\n  opacity: 0;\n  transition: opacity 160ms ease;\n}\n\n/* hover */\n.btn:hover::after {\n  opacity: 1;\n}\n\n/* active (keeps your behavior) */\n.btn:active {\n  filter: brightness(2);\n  transform: scale(0.88);\n}\n\n/* sizes */\n.btn-50 { width:50px; height:50px; }\n.btn-44 { width:44px; height:44px; }\n\n/* icon */\n.btn svg {\n  width:22px;\n  height:22px;\n  fill:white;\n  display:block;\n}\n.btn.icon-lg svg {\n  width:26px;\n  height:26px;\n}\n\n\n  /* ── Power - slim oval ── */\n.btn-power {\n  position: relative;                 /* required */\n  width: 50px;\n  height: 30px;\n  border-radius: 20px;\n\n  background: rgba(30,30,30,0.9);\n  border: 0;                          /* we replace the border */\n\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n\n  cursor: pointer;\n  transition: filter .1s, transform .08s;\n  -webkit-tap-highlight-color: transparent;\n  touch-action: manipulation;\n}\n\n/* --- BASE INNER BORDER --- */\n.btn-power::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n\n  box-shadow:\n    inset 0 0 0 1px rgba(255,255,255,0.16),\n    inset 0 0 8px rgba(255,255,255,0.12);\n\n  opacity: 0.6;\n  transition: opacity 160ms ease;\n}\n\n/* --- HOVER / ACTIVE BORDER (STRONGER) --- */\n.btn-power::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n\n  box-shadow:\n    inset 0 0 0 1px rgba(255,255,255,0.38),\n    inset 0 0 14px rgba(255,255,255,0.3);\n\n  opacity: 0;\n  transition: opacity 160ms ease;\n}\n\n/* hover */\n.btn-power:hover::after {\n  opacity: 1;\n}\n\n/* active (keeps your exact behavior) */\n.btn-power:active {\n  filter: brightness(1.6);\n  transform: scale(0.88);\n}\n\n/* icon */\n.btn-power svg {\n  width: 18px;\n  height: 18px;\n  display: block;\n  fill: white;\n}\n\n\n  /* ── 123 button ── */\n.btn-123 {\n  position: relative;                 /* required for pseudo-elements */\n  width: 50px;\n  height: 50px;\n  border-radius: 50%;\n\n  background: rgba(30,30,30,0.9);\n  border: 0;                          /* replace solid border */\n\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1px;\n\n  cursor: pointer;\n  transition: filter .1s, transform .08s;\n  -webkit-tap-highlight-color: transparent;\n  touch-action: manipulation;\n  padding: 0;\n  flex-shrink: 0;\n}\n\n/* --- BASE INNER BORDER --- */\n.btn-123::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n\n  box-shadow:\n    inset 0 0 0 1px rgba(255,255,255,0.16),\n    inset 0 0 10px rgba(255,255,255,0.12);\n\n  opacity: 0.6;\n  transition: opacity 160ms ease;\n}\n\n/* --- HOVER / ACTIVE BORDER (STRONGER) --- */\n.btn-123::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n\n  box-shadow:\n    inset 0 0 0 1px rgba(255,255,255,0.38),\n    inset 0 0 18px rgba(255,255,255,0.3);\n\n  opacity: 0;\n  transition: opacity 160ms ease;\n}\n\n/* hover */\n.btn-123:hover::after {\n  opacity: 1;\n}\n\n/* active (keeps your behavior exactly) */\n.btn-123:active {\n  filter: brightness(1.6);\n  transform: scale(0.88);\n}\n\n/* content (unchanged) */\n.btn-123 .cog  {\n  width: 13px;\n  height: 13px;\n  fill: white;\n}\n.btn-123 .num  {\n  font-size: 8px;\n  font-weight: 700;\n  color: white;\n  line-height: 1;\n}\n.btn-123 .dots {\n  display: flex;\n  gap: 2px;\n}\n.btn-123 .dot  {\n  width: 4px;\n  height: 4px;\n  border-radius: 50%;\n}\n\n  /* ── D-pad ── */\n.dpad { position:relative; width:160px; height:160px; flex-shrink:0; margin:2px 0; }\n.dpad-ring {\n  position:absolute; inset:0; border-radius:50%;\n  background: radial-gradient(circle at 40% 35%, #2a2a2a, #161616);\n  box-shadow: 0 4px 16px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.04);\n}\n.dpad-btn {\n  position:absolute; background:transparent; border:none;\n  display:flex; align-items:center; justify-content:center;\n  cursor:pointer; -webkit-tap-highlight-color:transparent; touch-action:manipulation;\n  transition: filter .1s; overflow: visible;\n}\n.dpad-btn:active { filter: brightness(2.2); }\n.dpad-btn svg.icon { width:24px; height:24px; fill:white; pointer-events:none; display:block; position:relative; z-index:1; transition: filter .15s; }\n.dpad-btn:hover svg.icon { filter: drop-shadow(0 0 5px rgba(255,255,255,0.9)) drop-shadow(0 0 10px rgba(180,180,255,0.6)); }\n\n/* glow arrow on d-pad */\n.dpad-btn .arrow-glow {\n  position:absolute; inset:0; display:flex; align-items:center; justify-content:center;\n  opacity:0; transition:opacity .2s; pointer-events:none; z-index:2;\n}\n.dpad-btn:hover .arrow-glow { opacity:1; }\n.dpad-btn .arrow-glow svg { width:30px; height:30px; fill:white; filter: drop-shadow(0 0 8px rgba(255,255,255,1)) drop-shadow(0 0 16px rgba(160,160,255,0.7)); pointer-events:none; }\n.dpad-btn.btn-up    .arrow-glow svg { animation: aUp    .7s ease-in-out infinite; }\n.dpad-btn.btn-down  .arrow-glow svg { animation: aDown  .7s ease-in-out infinite; }\n.dpad-btn.btn-left  .arrow-glow svg { animation: aLeft  .7s ease-in-out infinite; }\n.dpad-btn.btn-right .arrow-glow svg { animation: aRight .7s ease-in-out infinite; }\n\n@keyframes aUp    { 0%,100%{transform:translateY(3px)}  50%{transform:translateY(-3px)} }\n@keyframes aDown  { 0%,100%{transform:translateY(-3px)} 50%{transform:translateY(3px)} }\n@keyframes aRight { 0%,100%{transform:translateX(-3px)} 50%{transform:translateX(3px)} }\n\n.dpad-up    { top:4px;    left:50%; transform:translateX(-50%); width:52px; height:52px; }\n.dpad-down  { bottom:4px; left:50%; transform:translateX(-50%); width:52px; height:52px; }\n.dpad-left  { left:4px;   top:50%;  transform:translateY(-50%); width:52px; height:70px; }\n.dpad-right { right:4px;  top:50%;  transform:translateY(-50%); width:52px; height:70px; }\n\n.dpad-ok {\n  position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);\n  width:88px; height:88px; border-radius:50%;\n  background: radial-gradient(circle at 40% 35%, #2e2e2e, #141414);\n  box-shadow: 0 3px 10px rgba(0,0,0,0.9), inset 0 2px 4px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.04);\n  border:none; cursor:pointer; overflow:hidden;\n  -webkit-tap-highlight-color:transparent; touch-action:manipulation;\n  transition: filter .1s, transform .08s;\n}\n.dpad-ok::after {\n  content:''; position:absolute; inset:0; border-radius:50%;\n  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 70%);\n  opacity:0; transition: opacity .2s;\n}\n.dpad-ok:hover::after { opacity:1; }\n.dpad-ok:active { filter: brightness(1.5); transform: translate(-50%,-50%) scale(0.92); }\n\n  /* ── Pill buttons - 35px height, 12px radius, matches YAML ── */\n.pill-row {\n  display: flex;\n  gap: 6px;\n  width: 100%;\n}\n\n.btn-pill {\n  position: relative;                 /* required */\n  flex: 1;\n  height: 35px;\n  border-radius: 12px;\n\n  background: rgba(30,30,30,0.9);\n  border: 0;                          /* replace solid border */\n\n  display: flex;\n  align-items: center;\n  justify-content: center;\n\n  cursor: pointer;\n  transition: filter .1s, transform .08s;\n  -webkit-tap-highlight-color: transparent;\n  touch-action: manipulation;\n}\n\n/* --- BASE INNER BORDER --- */\n.btn-pill::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n\n  box-shadow:\n    inset 0 0 0 1px rgba(255,255,255,0.15),\n    inset 0 0 8px rgba(255,255,255,0.12);\n\n  opacity: 0.6;\n  transition: opacity 160ms ease;\n}\n\n/* --- HOVER / ACTIVE BORDER (STRONGER) --- */\n.btn-pill::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n\n  box-shadow:\n    inset 0 0 0 1px rgba(255,255,255,0.36),\n    inset 0 0 14px rgba(255,255,255,0.3);\n\n  opacity: 0;\n  transition: opacity 160ms ease;\n}\n\n/* hover */\n.btn-pill:hover::after {\n  opacity: 1;\n}\n\n/* active (keeps your behavior) */\n.btn-pill:active {\n  filter: brightness(1.6);\n  transform: scale(0.93);\n}\n\n/* icon */\n.btn-pill svg {\n  width: 18px;\n  height: 18px;\n  fill: white;\n  display: block;\n}\n\n  /* ── App buttons ── */\n  .app-row { display:flex; gap:6px; width:100%; }\n  .btn-app {\n    flex: 1;\n    height: 35px;\n    border-radius: 13px;\n    border: none;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    overflow: hidden;\n    transition: filter .1s, transform .08s;\n    -webkit-tap-highlight-color: transparent;\n    touch-action: manipulation;\n    gap: 4px;\n    padding: 0 6px;\n  }\n  .btn-app:active { filter: brightness(1.3); transform: scale(0.95); }\n\n  .btn-netflix {\n    background: #000;\n    border:1px solid #111;\n  }\n  .btn-netflix-logo {\n    width:95%; height:95%;\n    background: url(\"https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg\") center/contain no-repeat;\n  }\n\n  .btn-youtube {\n    background:#fff; \n    border:1px solid #eee;\n  }\n  .btn-youtube-logo {\n    width:120%; height:120%;\n    background: url(\"https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg\") center/contain no-repeat;\n  }\n\n  .btn-prime {\n    background: linear-gradient(200deg, #1098F7 0%, #001f3f 100%);\n    border: 1px solid #1098F7;\n    box-shadow: inset 0 1px 2px rgba(255,255,255,0.2);\n  }\n  .btn-prime-logo {\n    width:100%; height:100%;\n    background: url(\"https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg\") center/contain no-repeat;\n    filter: brightness(0) invert(1);\n  }\n\n  .btn-disney {\n    background: linear-gradient(180deg, #016f7d 0%, #001f3f 100%);\n    border: 1px solid #004d61;\n  }\n  .btn-disney-logo {\n    width:100%; height:100%;\n    background: url(\"https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg\") center/contain no-repeat;\n    filter: brightness(0) invert(1);\n  }\n\n  .divider {\n    width: 85%;\n    height: 1px;\n    background: rgba(255,255,255,0.05);\n    margin: 4px 0;\n  }\n  \n  .btn-plex {\n    background: linear-gradient(50deg, #AFAFAF 40%, #fff 100%);\n    border: 1px solid #AFAFAF;\n	box-shadow: inset 0 3px 4px rgba(0,0,0,0.2);\n  }\n  .btn-plex-logo {\n    width:85%; height:85%;\n    background: url(\"https://upload.wikimedia.org/wikipedia/commons/7/7b/Plex_logo_2022.svg\") center/contain no-repeat;\n  }\n\n  .btn-spotify {\n    background: #1DB954;\n    border: 1px solid #1DB954;\n  }\n  .btn-spotify-logo {\n    width:85%; height:85%;\n    background: url(\"https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg\") center/contain no-repeat;\n    filter: brightness(0) invert(1);\n  }\n  \n/* ── Samsung wordmark at bottom ── */\n  .samsung-logo {\n    margin-top: 14px;\n    margin-bottom: 4px;\n    opacity: 0.35;\n    user-select: none;\n    pointer-events: none;\n    flex-shrink: 0;\n    width: 100%;   \n    height: 14px;\n    background-image: url(\"https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg\");\n    background-position: center;\n    background-repeat: no-repeat;\n    background-size: contain;\n    filter: brightness(0) invert(1); /* makes it white */\n  }\n\n  \n", $ = {
	power: "<svg viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M12 3v9\" stroke=\"#cc2222\" stroke-width=\"2.2\" stroke-linecap=\"round\"/><path d=\"M7 6.3A8 8 0 1 0 17 6.3\" stroke=\"#cc2222\" stroke-width=\"2.2\" stroke-linecap=\"round\" fill=\"none\"/></svg>",
	menu: "<svg viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z\"/></svg>",
	mute: "<svg viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z\"/></svg>",
	up: "<svg viewBox=\"0 0 24 24\" fill=\"white\"><g transform=\"scale(1.1)\" transform-origin=\"12 12\"><path d=\"M7 14l5-5 5 5z\"/></g></svg>",
	down: "<svg viewBox=\"0 0 24 24\" fill=\"white\"><g transform=\"scale(1.1)\" transform-origin=\"12 12\"><path d=\"M7 10l5 5 5-5z\"/></g></svg>",
	left: "<svg viewBox=\"0 0 24 24\" fill=\"white\"><g transform=\"scale(1.1)\" transform-origin=\"12 12\"><path d=\"M15 7l-5 5 5 5z\"/></g></svg>",
	right: "<svg viewBox=\"0 0 24 24\" fill=\"white\"><g transform=\"scale(1.1)\" transform-origin=\"12 12\"><path d=\"M9 7l5 5-5 5z\"/></g></svg>",
	back: "<svg viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z\"/></svg>",
	home: "<svg viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z\"/></svg>",
	playpause: "<svg viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M6 19h4V5H6v14zm8-14v14l11-7-11-7z\"/></svg>",
	volup: "<svg viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z\"/></svg>",
	voldown: "<svg viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z\"/></svg>",
	chup: "<svg viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M7 14l5-5 5 5z\"/></svg>",
	chdown: "<svg viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M7 10l5 5 5-5z\"/></svg>",
	cog: "<svg viewBox=\"0 0 24 24\" fill=\"white\"><path d=\"M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54A.484.484 0 0 0 14 3h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.476.476 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z\"/></svg>"
}, Ea = class extends HTMLElement {
	constructor() {
		super(), this.attachShadow({ mode: "open" }), this._hass = null, this._config = {};
	}
	setConfig(e) {
		if (!e.media_player && !e.remote) throw Error("samsung-solar-remote: Please define media_player or remote entity.");
		this._config = {
			media_player: e.media_player || "",
			remote: e.remote || "",
			apps: {
				netflix: e.apps?.netflix !== !1,
				youtube: e.apps?.youtube !== !1,
				prime: e.apps?.prime !== !1,
				disney: e.apps?.disney !== !1,
				plex: e.apps?.plex !== !1,
				spotify: e.apps?.spotify !== !1
			},
			commands: {
				more: e.commands?.more || "KEY_MORE",
				menu: e.commands?.menu || "KEY_MENU",
				mute: e.commands?.mute || "KEY_MUTE",
				up: e.commands?.up || "KEY_UP",
				down: e.commands?.down || "KEY_DOWN",
				left: e.commands?.left || "KEY_LEFT",
				right: e.commands?.right || "KEY_RIGHT",
				enter: e.commands?.enter || "KEY_ENTER",
				back: e.commands?.back || "KEY_RETURN",
				home: e.commands?.home || "KEY_HOME",
				playpause: e.commands?.playpause || "KEY_ENTER",
				volup: e.commands?.volup || "KEY_VOLUP",
				voldown: e.commands?.voldown || "KEY_VOLDOWN",
				chup: e.commands?.chup || "KEY_CHUP",
				chdown: e.commands?.chdown || "KEY_CHDOWN"
			}
		}, this._render();
	}
	set hass(e) {
		this._hass = e;
	}
	_sendKey(e) {
		this._hass && this._config.remote && this._hass.callService("remote", "send_command", {
			entity_id: this._config.remote,
			command: e
		});
	}
	_call(e, t, n = {}) {
		this._hass && this._hass.callService(e, t, n);
	}
	_handleAction(e) {
		let t = this._config.commands, n = this._config.media_player;
		switch (e) {
			case "power":
				n ? this._call("media_player", "turn_off", { entity_id: n }) : this._sendKey("KEY_POWER");
				break;
			case "plex":
				this._call("shell_command", "launch_plex");
				break;
			case "spotify":
				this._call("shell_command", "launch_spotify");
				break;
			case "netflix":
				this._call("shell_command", "launch_netflix");
				break;
			case "youtube":
				this._call("shell_command", "launch_youtube");
				break;
			case "prime":
				this._call("shell_command", "launch_prime");
				break;
			case "disney":
				this._call("shell_command", "launch_disney");
				break;
			default: t[e] && this._sendKey(t[e]);
		}
	}
	_render() {
		let e = this._config;
		this.shadowRoot.innerHTML = `
      <style>${Ta}</style>
      <div class="remote">

        <!-- Power -->
        <div class="row">
          <button class="btn-power" data-action="power">${$.power}</button>
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
          <button class="btn btn-50 icon-lg" data-action="menu">${$.menu}</button>
          <button class="btn btn-50 icon-lg" data-action="mute">${$.mute}</button>
        </div>

        <div class="divider"></div>

        <!-- D-Pad -->
        <div class="dpad">
          <div class="dpad-ring"></div>
          <button class="dpad-btn dpad-up"    data-action="up">${$.up}</button>
          <button class="dpad-btn dpad-left"  data-action="left">${$.left}</button>
          <button class="dpad-ok"             data-action="enter"></button>
          <button class="dpad-btn dpad-right" data-action="right">${$.right}</button>
          <button class="dpad-btn dpad-down"  data-action="down">${$.down}</button>
        </div>

        <div class="divider"></div>

        <!-- Back · Home · Play/Pause -->
        <div class="row">
          <button class="btn btn-44" data-action="back">${$.back}</button>
          <button class="btn btn-50" data-action="home">${$.home}</button>
          <button class="btn btn-44" data-action="playpause">${$.playpause}</button>
        </div>

        <!-- Vol + Channel -->
        <div class="pill-row">
          <button class="btn-pill" data-action="volup">${$.volup}</button>
          <button class="btn-pill" data-action="chup">${$.chup}</button>
        </div>
        <div class="pill-row">
          <button class="btn-pill" data-action="voldown">${$.voldown}</button>
          <button class="btn-pill" data-action="chdown">${$.chdown}</button>
        </div>

        <div class="divider"></div>

        <!-- Apps -->
        ${e.apps.netflix || e.apps.youtube ? `
        <div class="app-row">
          ${e.apps.netflix ? "<button class=\"btn-app btn-netflix\" data-action=\"netflix\"><div class=\"btn-netflix-logo\"></div></button>" : ""}
          ${e.apps.youtube ? "<button class=\"btn-app btn-youtube\" data-action=\"youtube\"><div class=\"btn-youtube-logo\"></div></button>" : ""}
        </div>` : ""}

        ${e.apps.prime || e.apps.disney ? `
        <div class="app-row">
          ${e.apps.prime ? "<button class=\"btn-app btn-prime\"  data-action=\"prime\"><div class=\"btn-prime-logo\"></div></button>" : ""}
          ${e.apps.disney ? "<button class=\"btn-app btn-disney\" data-action=\"disney\"><div class=\"btn-disney-logo\"></div></button>" : ""}
        </div>` : ""}

        ${e.apps.plex || e.apps.spotify ? `
        <div class="app-row">
          ${e.apps.plex ? "<button class=\"btn-app btn-plex\"  data-action=\"plex\"><div class=\"btn-plex-logo\"></div></button>" : ""}
          ${e.apps.spotify ? "<button class=\"btn-app btn-spotify\" data-action=\"spotify\"><div class=\"btn-spotify-logo\"></div></button>" : ""}
        </div>` : ""}
        
      <!-- Samsung wordmark -->
        <div class="samsung-logo"></div>   
      </div>
    `, this.shadowRoot.querySelectorAll("[data-action]").forEach((e) => {
			e.addEventListener("click", () => this._handleAction(e.dataset.action));
		});
	}
	getCardSize() {
		return 8;
	}
	static getStubConfig() {
		return {
			media_player: "media_player.samsung_tv",
			remote: "remote.samsung_tv",
			spotify: !0,
			apps: {
				netflix: !0,
				youtube: !0,
				prime: !0,
				disney: !0
			}
		};
	}
};
customElements.get("samsung-solar-remote-card") || customElements.define("samsung-solar-remote-card", Ea), window.customCards = window.customCards || [], window.customCards.some((e) => e.type === "samsung-solar-remote-card") || window.customCards.push({
	type: "samsung-solar-remote-card",
	name: "Samsung Solar Remote Card",
	description: "A pixel-perfect Samsung SolarCell remote for Home Assistant.",
	preview: !0,
	documentationURL: "https://github.com/robman2026/Samsung-SolarCell-Remote-HA-Card"
}), console.info(`%c SAMSUNG-SOLAR-REMOTE %c v${wa} `, "background:#1DB954;color:#fff;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:bold", "background:#1c1c1c;color:#fff;padding:2px 6px;border-radius:0 4px 4px 0");
// src/bundled/laundry-card.js
var Da = [
	"run",
	"running",
	"active",
	"on",
	"washing",
	"drying",
	"inuse",
	"in_use"
], Oa = [
	"pause",
	"paused",
	"holding"
], ka = [
	"end",
	"done",
	"finished",
	"complete",
	"completed",
	"ready",
	"idle_end"
];
function Aa(e) {
	if (!e) return "stopped";
	let t = String(e).toLowerCase().replace(/[\s-]/g, "_");
	return Da.some((e) => t.includes(e)) ? "running" : Oa.some((e) => t.includes(e)) ? "paused" : ka.some((e) => t.includes(e)) ? "done" : "stopped";
}
function ja(e, t) {
	return !e || !t ? null : e.states[t]?.state ?? null;
}
function Ma(e, t) {
	let n = ja(e, t);
	return n === null || n === "unavailable" || n === "unknown" || /^\d{4}-\d{2}-\d{2}T/.test(n) ? "–" : n;
}
function Na(e, t) {
	let n = e?.states[t];
	if (!n?.last_changed) return null;
	try {
		let e = new Date(n.last_changed);
		return isNaN(e.getTime()) ? null : e.toLocaleDateString(void 0, {
			day: "2-digit",
			month: "short",
			year: "numeric"
		}) + " · " + e.toLocaleTimeString(void 0, {
			hour: "2-digit",
			minute: "2-digit"
		});
	} catch {
		return null;
	}
}
function Pa(e, t) {
	let n = ja(e, t);
	if (!n || n === "unavailable" || n === "unknown") return null;
	if (/^\d{4}-\d{2}-\d{2}T/.test(n)) try {
		let e = new Date(n);
		if (!isNaN(e.getTime())) return e.toLocaleTimeString(void 0, {
			hour: "2-digit",
			minute: "2-digit"
		});
	} catch {}
	return n;
}
var Fa = {
	samsung: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg",
	lg: "https://upload.wikimedia.org/wikipedia/commons/8/8d/LG_logo_%282014%29.svg",
	bosch: "https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg",
	siemens: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Siemens-logo.svg",
	miele: "https://upload.wikimedia.org/wikipedia/commons/2/25/Miele_logo.svg"
}, Ia = {
	samsung: {
		h: 11,
		maxw: 72
	},
	lg: {
		h: 20,
		maxw: 56
	},
	bosch: {
		h: 14,
		maxw: 56
	},
	siemens: {
		h: 11,
		maxw: 64
	},
	miele: {
		h: 14,
		maxw: 52
	}
};
function La(e) {
	let t = Fa[e];
	if (!t) return k`<span style="font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.45);font-weight:600;">${e}</span>`;
	let n = Ia[e] || {
		h: 12,
		maxw: 60
	}, r = e === "lg" ? "" : e === "miele" ? "filter:brightness(10);" : "filter:brightness(0) invert(1);", i = e === "lg" ? "0.85" : "0.65";
	return k`<img src="${t}" alt="${e}"
    style="height:${n.h}px;width:auto;max-width:${n.maxw}px;display:block;object-fit:contain;${r}opacity:${i};"
    @error=${(e) => {
		e.target.style.display = "none";
	}}/>`;
}
function Ra(e, t) {
	let n = t === "washer";
	if (e === "samsung" || e === "generic") {
		let e = "#e8e8e8", t = "#f2f2f2", r = "rgba(0,0,0,.09)";
		return n ? `<svg viewBox="0 0 300 72" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="72" fill="${e}"/><rect x="88" y="12" width="124" height="48" rx="7" fill="${t}" stroke="${r}" stroke-width="1"/><line x1="0" y1="0.5" x2="300" y2="0.5" stroke="rgba(0,0,0,.1)" stroke-width="1"/></svg>` : `<svg viewBox="0 0 300 72" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="72" fill="${e}"/><rect x="10" y="10" width="162" height="52" rx="6" fill="${t}" stroke="${r}" stroke-width="1"/><rect x="184" y="10" width="106" height="52" rx="6" fill="${t}" stroke="${r}" stroke-width="1"/>${[
			18,
			26,
			34,
			42,
			50,
			58
		].map((e) => `<line x1="192" y1="${e}" x2="282" y2="${e}" stroke="rgba(0,0,0,.11)" stroke-width="1.5" stroke-linecap="round"/>`).join("")}</svg>`;
	}
	if (e === "lg") {
		let e = "#1a1a1a", t = "#222", r = "rgba(255,255,255,.07)";
		return n ? `<svg viewBox="0 0 300 72" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="72" fill="${e}"/><rect x="20" y="14" width="108" height="44" rx="6" fill="${t}" stroke="${r}" stroke-width="1"/><rect x="60" y="33" width="28" height="5" rx="2.5" fill="rgba(255,255,255,.07)"/></svg>` : `<svg viewBox="0 0 300 72" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="72" fill="${e}"/><rect x="172" y="14" width="108" height="44" rx="6" fill="${t}" stroke="${r}" stroke-width="1"/><rect x="212" y="33" width="28" height="5" rx="2.5" fill="rgba(255,255,255,.07)"/></svg>`;
	}
	if (e === "bosch" || e === "siemens") {
		let e = "#e8e8e8", t = "#f0f0f0", r = "rgba(0,0,0,.09)";
		if (n) return `<svg viewBox="0 0 300 72" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="72" fill="${e}"/><rect x="10" y="10" width="130" height="52" rx="5" fill="${t}" stroke="${r}" stroke-width="1"/><rect x="152" y="10" width="138" height="52" rx="5" fill="${t}" stroke="${r}" stroke-width="1"/><circle cx="221" cy="36" r="18" fill="${e}" stroke="${r}" stroke-width="1"/><circle cx="221" cy="36" r="5" fill="${t}" stroke="${r}" stroke-width="1"/></svg>`;
		let i = [];
		for (let e = 6; e <= 20; e += 5) {
			let t = Math.max(6, Math.round(2 * Math.PI * e / 7));
			for (let n = 0; n < t; n++) {
				let a = n * 2 * Math.PI / t;
				i.push(`<circle cx="${(248 + e * Math.cos(a)).toFixed(1)}" cy="${(36 + e * Math.sin(a)).toFixed(1)}" r="1.8" fill="${r}"/>`);
			}
		}
		return `<svg viewBox="0 0 300 72" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="72" fill="${e}"/><rect x="10" y="10" width="204" height="52" rx="5" fill="${t}" stroke="${r}" stroke-width="1"/><circle cx="248" cy="36" r="28" fill="${t}" stroke="${r}" stroke-width="1"/>${i.join("")}</svg>`;
	}
	if (e === "miele") {
		let e = "#e4e4e0", t = "#efefeb", r = "rgba(0,0,0,.08)";
		return n ? `<svg viewBox="0 0 300 72" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="72" fill="${e}"/><rect x="10" y="10" width="130" height="52" rx="5" fill="${t}" stroke="${r}" stroke-width="1"/><circle cx="74" cy="36" r="5" fill="rgba(0,0,0,.1)" stroke="${r}" stroke-width="1"/><rect x="152" y="10" width="138" height="52" rx="5" fill="${t}" stroke="${r}" stroke-width="1"/><circle cx="220" cy="36" r="5" fill="rgba(0,0,0,.1)" stroke="${r}" stroke-width="1"/></svg>` : `<svg viewBox="0 0 300 72" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="72" fill="${e}"/><rect x="10" y="8" width="162" height="56" rx="5" fill="${t}" stroke="${r}" stroke-width="1"/><rect x="180" y="8" width="108" height="56" rx="5" fill="${t}" stroke="${r}" stroke-width="1"/>${[
			15,
			22,
			29,
			36,
			43,
			50,
			57
		].map((e) => `<line x1="190" y1="${e}" x2="282" y2="${e}" stroke="${r}" stroke-width="2" stroke-linecap="round"/>`).join("")}</svg>`;
	}
	return "<svg viewBox=\"0 0 300 72\"><rect width=\"300\" height=\"72\" fill=\"#ddd\"/></svg>";
}
var za = {
	samsung: "t-sam",
	lg: "t-lg",
	bosch: "t-bsh",
	siemens: "t-bsh",
	miele: "t-miele",
	generic: "t-sam"
}, Ba = class extends M {
	static get properties() {
		return {
			hass: {},
			_config: {}
		};
	}
	static getConfigElement() {
		return document.createElement("samsung-laundry-card-editor");
	}
	static getStubConfig() {
		return {
			brand: "samsung",
			show_washer: !0,
			show_dryer: !0,
			washer_label: "Washer",
			dryer_label: "Dryer",
			washer_machine_state: "",
			washer_completion_time: "",
			washer_current_course: "",
			washer_water_temperature: "",
			washer_spin_level: "",
			washer_power: "",
			washer_energy: "",
			washer_water_consumption: "",
			washer_job_state: "",
			dryer_machine_state: "",
			dryer_completion_time: "",
			dryer_current_course: "",
			dryer_energy: "",
			dryer_power: "",
			dryer_job_state: ""
		};
	}
	setConfig(e) {
		if (!e) throw Error("samsung-laundry-card: missing config");
		this._config = e;
	}
	getCardSize() {
		return 6;
	}
	updated() {
		let e = this._config?.brand || "samsung";
		this.shadowRoot.querySelectorAll(".mc-foot[data-foot]").forEach((t) => {
			t.innerHTML = Ra(e, t.dataset.foot);
		});
	}
	_fireMoreInfo(e) {
		e && e !== "undefined" && this.dispatchEvent(new CustomEvent("hass-more-info", {
			bubbles: !0,
			composed: !0,
			detail: { entityId: e }
		}));
	}
	_callService(e, t, n) {
		this.hass.callService(e, t, n);
	}
	_sideData(e) {
		let t = this._config, n = t[`${e}_machine_state`], r = t[`${e}_completion_time`], i = t[`${e}_current_course`], a = Aa(ja(this.hass, n));
		if (a === "running" && r) {
			let e = ja(this.hass, r);
			if (e && /^\d{4}-\d{2}-\d{2}T/.test(e)) {
				let t = new Date(e);
				!isNaN(t.getTime()) && t < /* @__PURE__ */ new Date() && (a = "done");
			}
		}
		let o = i ? Ma(this.hass, i) : "–", s = "–";
		if (a === "running") {
			let e = Pa(this.hass, r);
			s = e ? `Done ${e}` : "Running…";
		} else if (a === "paused") {
			let e = Pa(this.hass, r);
			s = e ? `Paused · done ${e}` : "Paused";
		} else {
			let e = Na(this.hass, n);
			s = e ? `Last run · ${e}` : "–";
		}
		return {
			normState: a,
			program: o,
			timeText: s
		};
	}
	_renderMachine(e) {
		let t = this._config, n = t.brand || "samsung", r = e === "washer", i = t[`${e}_label`] || (r ? "Washer" : "Dryer"), { normState: a, program: o, timeText: s } = this._sideData(e), c = a === "running" ? r ? "#4fa3e0" : "#e07c4f" : a === "paused" ? "#e0b44f" : a === "done" ? "#3cbe64" : "#888", l = a === "running" || a === "paused" ? 162 : a === "done" ? 0 : 540, u = a === "running" || a === "paused" ? 70 : a === "done" ? 100 : 0, d = {
			running: r ? "Running" : "Drying",
			paused: "Paused",
			done: "Done ✓",
			stopped: "Stopped"
		}, f = {
			running: r ? "#5bb8ff" : "#ff9555",
			paused: "#f0c84a",
			done: "#4ddd88",
			stopped: "rgba(255,255,255,.25)"
		}, p = {
			running: r ? "lv-wr" : "lv-dr",
			paused: "lv-off",
			done: "lv-done",
			stopped: "lv-off"
		}, m = d[a] || "Stopped", h = f[a] || f.stopped, g = p[a] || "lv-off", _ = a === "running", v = a === "paused", y = _ ? r ? "ph-glow gw-on" : "ph-glow gd-on" : "ph-glow", b = _ ? .12 : 0, x = _ ? "animation:spin 3s linear infinite;" : v ? "animation:spin-sl 8s linear infinite;" : "", S = _ ? "animation:spin 4s linear infinite;" : v ? "animation:spin-sl 10s linear infinite;" : "", C = t.frosted_glass, w = Math.min(.9, Math.max(.1, parseFloat(t.frosted_opacity) || .52)), T = Math.min(40, Math.max(4, parseFloat(t.frosted_blur) || 22)), E = C ? `background:rgba(8,14,30,${w});backdrop-filter:blur(${T}px);-webkit-backdrop-filter:blur(${T}px);` : "", ee = [
			{
				lbl: "Temp",
				eid: t.washer_water_temperature
			},
			{
				lbl: "Spin",
				eid: t.washer_spin_level
			},
			{
				lbl: "Power",
				eid: t.washer_power
			},
			{
				lbl: "Energy",
				eid: t.washer_energy
			},
			{
				lbl: "Water",
				eid: t.washer_water_consumption
			},
			{
				lbl: "Job",
				eid: t.washer_job_state
			}
		], te = [
			{
				lbl: "Energy",
				eid: t.dryer_energy
			},
			{
				lbl: "Power",
				eid: t.dryer_power
			},
			{
				lbl: "Job",
				eid: t.dryer_job_state
			},
			{
				lbl: "Course",
				eid: t.dryer_current_course
			},
			{
				lbl: "",
				eid: ""
			},
			{
				lbl: "",
				eid: ""
			}
		], ne = r ? ee : te;
		return k`
      <div class="mc ${za[n] || "t-sam"}" style="${E}">

        <!-- PANEL: 3-col → logo | knob(center) | lcd -->
        <div class="mc-panel">
          <div class="mc-logo-cell">${La(n)}</div>
          <div class="mc-knob"></div>
          <div class="mc-lcd-cell">
            <div class="mc-lcd">
              <div class="mc-lcd-dot ${g}"></div>
              <span class="mc-lcd-txt" style="color:${h};">${m}</span>
            </div>
          </div>
        </div>

        <!-- BODY -->
        <div class="mc-body">
          <div class="mc-bg-glow" style="background:${r ? "#4fa3e0" : "#e07c4f"};animation:bglow 3s ease-in-out infinite${r ? "" : " .5s"};opacity:${b};"></div>
          <div class="ph">
            <svg style="position:absolute;inset:0;width:var(--ph);height:var(--ph);pointer-events:none;z-index:5;" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="86" fill="none" stroke="rgba(255,255,255,.04)" stroke-width="3.5"/>
              <circle cx="90" cy="90" r="86" fill="none" stroke="${c}" stroke-width="3.5"
                stroke-linecap="round" stroke-dasharray="540" stroke-dashoffset="${l}"
                transform="rotate(-90 90 90)" style="transition:stroke-dashoffset 1.4s ease,stroke .6s ease;"/>
            </svg>
            <div class="ph-chrome"></div>
            <div class="ph-rubber"></div>
            <div class="ph-win">
              ${r ? k`
                <div class="drum-w">
                  <div class="wshim" style="${_ || v ? "animation:wshim 2s ease-in-out infinite;" : "display:none;"}"></div>
                  <div style="position:absolute;inset:0;border-radius:50%;overflow:hidden;display:${_ ? "block" : "none"};">
                    <div class="bub" style="width:10px;height:10px;bottom:10px;left:16px;animation:bub-rise 3.2s ease-in infinite;"></div>
                    <div class="bub" style="width:7px;height:7px;bottom:7px;left:38px;animation:bub-rise 2.8s ease-in infinite .6s;"></div>
                    <div class="bub" style="width:12px;height:12px;bottom:11px;left:58px;animation:bub-rise 3.6s ease-in infinite 1.1s;"></div>
                    <div class="bub" style="width:8px;height:8px;bottom:9px;left:82px;animation:bub-rise 3.9s ease-in infinite .3s;"></div>
                  </div>
                  <div class="drum-w-bowl" style="${x}">
                    <svg width="100%" height="100%" viewBox="0 0 58 58">
                      <circle cx="29" cy="29" r="27" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
                      <path d="M29 29L29 5" stroke="rgba(170,205,255,.3)" stroke-width="4.5" stroke-linecap="round"/>
                      <path d="M29 29L8 42" stroke="rgba(170,205,255,.3)" stroke-width="4.5" stroke-linecap="round"/>
                      <path d="M29 29L50 42" stroke="rgba(170,205,255,.3)" stroke-width="4.5" stroke-linecap="round"/>
                      <circle cx="29" cy="29" r="6" fill="rgba(110,145,200,.3)" stroke="rgba(255,255,255,.1)" stroke-width="1"/>
                      <circle cx="29" cy="29" r="2.5" fill="rgba(170,205,255,.2)"/>
                    </svg>
                  </div>
                </div>
              ` : k`
                <div class="drum-d">
                  <div class="hglow" style="opacity:${+!!_};animation:${_ ? "hpulse 1.8s ease-in-out infinite" : "none"};"></div>
                  <div style="position:absolute;bottom:8%;left:50%;transform:translateX(-50%);display:${_ ? "flex" : "none"};gap:3px;">
                    <div class="hwave" style="height:10px;animation:hwave 1.1s ease-in-out infinite;"></div>
                    <div class="hwave" style="height:14px;animation:hwave 1.4s ease-in-out infinite .2s;"></div>
                    <div class="hwave" style="height:11px;animation:hwave 0.9s ease-in-out infinite .4s;"></div>
                    <div class="hwave" style="height:13px;animation:hwave 1.3s ease-in-out infinite .1s;"></div>
                    <div class="hwave" style="height:10px;animation:hwave 1.0s ease-in-out infinite .3s;"></div>
                  </div>
                  <div class="drum-d-inner" style="${S}">
                    <svg width="100%" height="100%" viewBox="0 0 72 72">
                      <ellipse cx="36" cy="11" rx="14" ry="10" fill="rgba(100,100,100,.4)" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
                      <ellipse cx="15" cy="48" rx="14" ry="10" fill="rgba(100,100,100,.4)" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
                      <ellipse cx="57" cy="48" rx="14" ry="10" fill="rgba(100,100,100,.4)" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
                      <line x1="36" y1="36" x2="36" y2="14" stroke="rgba(210,210,210,.68)" stroke-width="4" stroke-linecap="round"/>
                      <line x1="36" y1="36" x2="17" y2="50" stroke="rgba(210,210,210,.68)" stroke-width="4" stroke-linecap="round"/>
                      <line x1="36" y1="36" x2="55" y2="50" stroke="rgba(210,210,210,.68)" stroke-width="4" stroke-linecap="round"/>
                      <circle cx="36" cy="36" r="7.5" fill="rgba(165,165,165,.5)" stroke="rgba(255,255,255,.22)" stroke-width="1.5"/>
                      <circle cx="36" cy="36" r="3" fill="rgba(220,220,220,.36)"/>
                      <circle cx="36" cy="28.5" r="1.4" fill="rgba(255,255,255,.22)"/>
                      <circle cx="42.5" cy="41" r="1.4" fill="rgba(255,255,255,.22)"/>
                      <circle cx="29.5" cy="41" r="1.4" fill="rgba(255,255,255,.22)"/>
                    </svg>
                  </div>
                </div>
              `}
            </div>
            <div class="${y}"></div>
          </div>
        </div>

        <!-- INFO -->
        <div class="mc-info">
          <div class="mc-prog-wrap">
            <div class="mc-prog" style="width:${u}%;background:${c};"></div>
          </div>
          <!-- Program name (current_course) or label if no entity / no value -->
          <div class="mc-cy" @click=${() => this._fireMoreInfo(t[`${e}_machine_state`])}>
            ${o === "–" ? i : o}
          </div>
          <div class="mc-tm">${s}</div>

          <!-- Stat tiles row 1: slots 0-2 -->
          <div class="mc-sg">
            ${ne.slice(0, 3).map((e) => k`
              <div class="mc-st" @click=${() => this._fireMoreInfo(e.eid)}>
                <span class="mc-sv">${e.eid ? Ma(this.hass, e.eid) : "–"}</span>
                <span class="mc-sl">${e.lbl}</span>
              </div>`)}
          </div>
          <!-- Stat tiles row 2: slots 3-5 -->
          <div class="mc-sg">
            ${ne.slice(3, 6).map((e) => k`
              <div class="mc-st" @click=${() => this._fireMoreInfo(e.eid)}>
                <span class="mc-sv">${e.eid ? Ma(this.hass, e.eid) : e.lbl ? "–" : ""}</span>
                <span class="mc-sl">${e.lbl}</span>
              </div>`)}
          </div>
        </div>

        <!-- FOOT (injected via updated()) -->
        <div class="mc-foot" data-foot="${e}"></div>
      </div>`;
	}
	render() {
		return this._config ? k`
      <div class="lc-root">
        ${this._config.show_washer === !1 ? "" : this._renderMachine("washer")}
        ${this._config.show_dryer === !1 ? "" : this._renderMachine("dryer")}
      </div>` : k``;
	}
	static get styles() {
		return Ce`
:host{display:block;}
.lc-root{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:stretch;}
@media(max-width:480px){.lc-root{grid-template-columns:1fr;}}
.mc{display:flex;flex-direction:column;border-radius:18px;overflow:hidden;box-shadow:0 8px 36px rgba(0,0,0,.7);}
/* Panel */
.mc-panel{height:54px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 12px;gap:8px;flex-shrink:0;}
.mc-logo-cell{display:flex;align-items:center;justify-content:flex-start;overflow:visible;min-width:0;}
.mc-knob{width:32px;height:32px;border-radius:50%;box-shadow:0 3px 8px rgba(0,0,0,.9),inset 0 1px 0 rgba(255,255,255,.2),0 0 0 1.5px rgba(0,0,0,.5);}
.mc-lcd-cell{display:flex;align-items:center;justify-content:flex-end;}
.mc-lcd{display:flex;align-items:center;gap:5px;border-radius:5px;padding:5px 10px 5px 8px;background:#040608;border:1px solid rgba(255,255,255,.12);min-width:82px;}
.mc-lcd-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;transition:all .4s;}
.mc-lcd-txt{font-family:'DM Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.06em;transition:color .4s;white-space:nowrap;}
/* Body */
.mc-body{padding:16px 14px 10px;display:flex;flex-direction:column;align-items:center;position:relative;overflow:hidden;flex:1;}
.mc-bg-glow{position:absolute;width:190px;height:190px;border-radius:50%;top:-60px;left:50%;transform:translateX(-50%);pointer-events:none;filter:blur(48px);transition:opacity .8s;}
/* Porthole */
.ph{--ph:180px;--ph-r-t:5px;--ph-w-t:33px;--ph-w-s:114px;position:relative;width:var(--ph);height:var(--ph);flex-shrink:0;}
@media(max-width:480px){.ph{--ph:158px;--ph-r-t:4px;--ph-w-t:28px;--ph-w-s:102px;}}
.ph-chrome{position:absolute;top:0;left:0;width:var(--ph);height:var(--ph);border-radius:50%;background:conic-gradient(from 0deg,#666,#ccc,#eee,#bbb,#888,#ddd,#eee,#aaa,#666);box-shadow:0 3px 12px rgba(0,0,0,.3);z-index:1;}
.ph-rubber{position:absolute;top:var(--ph-r-t);left:var(--ph-r-t);width:calc(var(--ph) - var(--ph-r-t)*2);height:calc(var(--ph) - var(--ph-r-t)*2);border-radius:50%;background:radial-gradient(circle at 30% 26%,#282828 0%,#060606 55%,#000 100%);box-shadow:inset 0 7px 22px rgba(0,0,0,1);z-index:2;}
.ph-win{position:absolute;top:var(--ph-w-t);left:var(--ph-w-t);width:var(--ph-w-s);height:var(--ph-w-s);border-radius:50%;overflow:hidden;z-index:3;}
.ph-glow{position:absolute;top:var(--ph-w-t);left:var(--ph-w-t);width:var(--ph-w-s);height:var(--ph-w-s);border-radius:50%;pointer-events:none;z-index:6;opacity:0;transition:opacity .6s;}
.gw-on{opacity:1;animation:pglow-w 2.2s ease-in-out infinite;}
.gd-on{opacity:1;animation:pglow-d 2.4s ease-in-out infinite .3s;}
/* Drums */
.drum-w{width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 38% 32%,rgba(48,78,148,.38),rgba(10,18,58,.78) 48%,rgba(2,4,16,.92) 100%);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.drum-w::before{content:'';position:absolute;width:70px;height:31px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,255,255,.09),transparent 70%);top:13px;left:14px;transform:rotate(-20deg);}
.drum-w::after{content:'';position:absolute;inset:0;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(255,255,255,.06),inset 0 4px 14px rgba(0,0,0,.5);}
.drum-w-bowl{width:72%;height:72%;border-radius:50%;background:radial-gradient(circle at 38% 32%,rgba(100,130,195,.1),rgba(22,40,115,.06) 50%,rgba(3,6,28,.2) 100%);border:1.5px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;position:relative;z-index:2;}
.drum-d{width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 38% 32%,#484848,#1e1e1e 45%,#0c0c0c 100%);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.drum-d::before{content:'';position:absolute;inset:0;border-radius:50%;background-image:radial-gradient(circle,rgba(0,0,0,.65) 1.8px,transparent 1.8px);background-size:9px 9px;opacity:.65;}
.drum-d::after{content:'';position:absolute;inset:0;border-radius:50%;background:radial-gradient(ellipse at 36% 30%,rgba(255,255,255,.08),transparent 55%);}
.drum-d-inner{width:68%;height:68%;border-radius:50%;display:flex;align-items:center;justify-content:center;position:relative;z-index:2;}
.hglow{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 50% 70%,rgba(255,90,0,.32),rgba(200,40,0,.1) 50%,transparent 70%);opacity:0;}
.hwave{width:3px;border-radius:2px;background:rgba(255,130,0,.65);}
.bub{position:absolute;border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(140,190,255,.7),rgba(60,120,220,.3));border:1px solid rgba(140,190,255,.4);opacity:0;}
.wshim{position:absolute;bottom:0;left:0;right:0;height:36%;border-radius:0 0 57px 57px;background:linear-gradient(180deg,transparent,rgba(50,110,200,.18));pointer-events:none;}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes spin-sl{to{transform:rotate(360deg);}}
@keyframes bub-rise{0%{transform:translateY(0) scale(.4);opacity:0;}20%{opacity:.8;}80%{opacity:.6;}100%{transform:translateY(-90px) scale(1.2);opacity:0;}}
@keyframes wshim{0%,100%{opacity:.5;}50%{opacity:1;}}
@keyframes hpulse{0%,100%{opacity:0;}50%{opacity:1;}}
@keyframes hwave{0%,100%{transform:scaleY(1);opacity:.4;}50%{transform:scaleY(1.7);opacity:.95;}}
@keyframes pglow-w{0%,100%{box-shadow:0 0 0 0 rgba(79,163,224,0);}45%{box-shadow:0 0 22px 11px rgba(79,163,224,.42);}}
@keyframes pglow-d{0%,100%{box-shadow:0 0 0 0 rgba(224,124,79,0);}45%{box-shadow:0 0 22px 11px rgba(224,124,79,.46);}}
@keyframes bglow{0%,100%{opacity:.06;}50%{opacity:.16;}}
@keyframes lp{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.28;transform:scale(.5);}}
/* Info */
.mc-info{padding:0 13px 13px;display:flex;flex-direction:column;align-items:center;}
.mc-prog-wrap{width:100%;height:3px;border-radius:2px;margin:10px 0 9px;}
.mc-prog{height:3px;border-radius:2px;transition:width 1.3s ease,background .6s ease;}
.mc-cy{font-size:15px;font-weight:600;text-align:center;margin-bottom:2px;min-height:22px;cursor:pointer;}
.mc-tm{font-size:10px;font-family:'DM Mono',monospace;text-align:center;margin-bottom:11px;min-height:15px;}
.mc-sg{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;width:100%;}
.mc-sg+.mc-sg{margin-top:5px;}
.mc-st{border-radius:10px;padding:8px 3px;text-align:center;cursor:pointer;transition:background .15s;}
.mc-sv{font-size:12px;font-weight:600;display:block;font-family:'DM Mono',monospace;}
.mc-sl{font-size:7px;font-weight:500;letter-spacing:.09em;text-transform:uppercase;}
.mc-foot{flex-shrink:0;line-height:0;}
.mc-foot svg{display:block;width:100%;}
/* Live dots */
.lv-wr{background:#4fa3e0;box-shadow:0 0 6px #4fa3e0;animation:lp 2s ease infinite;}
.lv-dr{background:#e07c4f;box-shadow:0 0 6px #e07c4f;animation:lp 2s ease infinite .4s;}
.lv-done{background:#3cbe64;box-shadow:0 0 6px #3cbe64;}
.lv-off{background:rgba(255,255,255,.18);}
/* ── Samsung ── */
.t-sam .mc-panel{background:linear-gradient(180deg,#111,#0a0a0a);border-bottom:2px solid #000;}
.t-sam .mc-knob{background:radial-gradient(circle at 33% 28%,#d0d0d0,#777 45%,#222 80%);border:2px solid rgba(255,255,255,.3);}
.t-sam .mc-body{background:linear-gradient(172deg,#f7f7f7,#e5e5e5);}
.t-sam .mc-info{background:linear-gradient(172deg,#f0f0f0,#e0e0e0);}
.t-sam .mc-cy{color:#111;}.t-sam .mc-tm{color:rgba(0,0,0,.36);}
.t-sam .mc-prog-wrap{background:rgba(0,0,0,.08);}
.t-sam .mc-st{background:rgba(0,0,0,.05);border:1px solid rgba(0,0,0,.07);}
.t-sam .mc-sv{color:#111;}.t-sam .mc-sl{color:rgba(0,0,0,.28);}
/* ── LG ── */
.t-lg .mc-panel{background:linear-gradient(180deg,#1a1a1a,#111);border-bottom:1px solid rgba(255,255,255,.06);}
.t-lg .mc-knob{background:radial-gradient(circle at 50% 50%,#222,#0a0a0a);border:2px solid rgba(255,255,255,.15);box-shadow:0 0 0 4px rgba(255,255,255,.04),0 3px 8px rgba(0,0,0,.8);width:36px;height:36px;}
.t-lg .mc-body{background:linear-gradient(172deg,#2a2a2a,#1a1a1a);}
.t-lg .mc-info{background:linear-gradient(172deg,#252525,#181818);}
.t-lg .mc-cy{color:rgba(255,255,255,.88);}.t-lg .mc-tm{color:rgba(255,255,255,.35);}
.t-lg .mc-prog-wrap{background:rgba(255,255,255,.08);}
.t-lg .mc-st{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);}
.t-lg .mc-sv{color:rgba(255,255,255,.88);}.t-lg .mc-sl{color:rgba(255,255,255,.3);}
.t-lg .ph-chrome{background:conic-gradient(from 0deg,#333,#666,#888,#555,#333,#666,#888,#555,#333);}
.t-lg .ph{--ph-r-t:8px;--ph-w-t:20px;--ph-w-s:calc(var(--ph) - 40px);}
.t-lg .ph-rubber{background:radial-gradient(circle at 30% 26%,#1a1a1a 0%,#050505 60%,#000 100%);box-shadow:inset 0 4px 16px rgba(0,0,0,.95);}
.t-lg .drum-w{background:radial-gradient(circle at 38% 32%,rgba(30,50,120,.35),rgba(5,10,40,.8) 48%,rgba(0,0,0,.95) 100%);}
/* ── Bosch/Siemens ── */
.t-bsh .mc-panel{background:linear-gradient(180deg,#1a1a1a,#111);border-bottom:2px solid #222;height:60px;}
.t-bsh .mc-knob{background:radial-gradient(circle at 38% 32%,#3a3a3a,#111 55%,#080808 100%);border:2px solid #333;box-shadow:0 0 0 3px rgba(0,120,255,.3),0 0 0 5px rgba(0,80,200,.08),0 3px 10px rgba(0,0,0,.9);width:38px;height:38px;}
.t-bsh .mc-body{background:linear-gradient(172deg,#f5f5f5,#e8e8e8);}
.t-bsh .mc-info{background:linear-gradient(172deg,#eeeeee,#e0e0e0);}
.t-bsh .mc-cy{color:#111;}.t-bsh .mc-tm{color:rgba(0,0,0,.36);}
.t-bsh .mc-prog-wrap{background:rgba(0,0,0,.08);}
.t-bsh .mc-st{background:rgba(0,0,0,.05);border:1px solid rgba(0,0,0,.07);}
.t-bsh .mc-sv{color:#111;}.t-bsh .mc-sl{color:rgba(0,0,0,.28);}
.t-bsh .ph-chrome{background:conic-gradient(from 0deg,#888,#ddd,#eee,#bbb,#999,#ccc,#eee,#bbb,#888);box-shadow:0 3px 10px rgba(0,0,0,.25);}
.t-bsh .ph{--ph-r-t:8px;--ph-w-t:20px;--ph-w-s:calc(var(--ph) - 40px);}
.t-bsh .ph-rubber{background:radial-gradient(circle at 30% 26%,#1a1a1a 0%,#000 70%);box-shadow:inset 0 5px 18px rgba(0,0,0,.95);}
/* ── Miele ── */
.t-miele .mc-panel{background:linear-gradient(180deg,#1c1c1c,#141414);border-bottom:1px solid #333;height:58px;}
.t-miele .mc-knob{background:radial-gradient(circle at 30% 25%,#f5f5f5,#bbb 28%,#666 68%,#333 100%);border:2.5px solid rgba(255,255,255,.28);width:36px;height:36px;box-shadow:0 4px 12px rgba(0,0,0,.9),inset 0 1px 0 rgba(255,255,255,.35);}
.t-miele .mc-body{background:linear-gradient(172deg,#fafaf8,#f0f0ec);}
.t-miele .mc-info{background:linear-gradient(172deg,#f5f5f2,#ebebea);}
.t-miele .mc-cy{color:#111;}.t-miele .mc-tm{color:rgba(0,0,0,.35);}
.t-miele .mc-prog-wrap{background:rgba(0,0,0,.07);}
.t-miele .mc-st{background:rgba(0,0,0,.04);border:1px solid rgba(0,0,0,.06);}
.t-miele .mc-sv{color:#111;}.t-miele .mc-sl{color:rgba(0,0,0,.27);}
.t-miele .ph-chrome{background:conic-gradient(from 0deg,#aaa,#eee,#fff,#ddd,#aaa,#eee,#fff,#ddd,#aaa);box-shadow:0 4px 16px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.5);}
.t-miele .ph{--ph-r-t:12px;--ph-w-t:26px;--ph-w-s:calc(var(--ph) - 52px);}
.t-miele .ph-rubber{background:radial-gradient(circle at 32% 28%,#222 0%,#060606 70%);}
    `;
	}
}, Va = class extends M {
	static get properties() {
		return {
			hass: {},
			_config: {},
			_open: {}
		};
	}
	constructor() {
		super(), this._open = {
			appearance: !0,
			washer: !0,
			dryer: !1
		};
	}
	setConfig(e) {
		this._config = { ...e };
	}
	_set(e, t) {
		this._config = {
			...this._config,
			[e]: t
		}, this._fire();
	}
	_fire() {
		this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: this._config },
			bubbles: !0,
			composed: !0
		})), this.requestUpdate();
	}
	_toggleSec(e) {
		this._open = {
			...this._open,
			[e]: !this._open[e]
		}, this.requestUpdate();
	}
	_txt(e, t, n) {
		return k`<div class="ef">
      <label class="el">${e}</label>
      <input class="ei" type="text" .value="${this._config[t] || ""}" placeholder="${n || ""}"
        @change="${(e) => this._set(t, e.target.value)}"/>
    </div>`;
	}
	_toggle(e, t) {
		return k`<div class="tr">
      <span class="tl">${e}</span>
      <label class="tw">
        <input type="checkbox" ?checked="${!!this._config[t]}" @change="${(e) => this._set(t, e.target.checked)}"/>
        <span class="ts"></span>
      </label>
    </div>`;
	}
	_seg(e, t, n) {
		let r = this._config[t] || n[0].val;
		return k`<div class="ef">
      <label class="el">${e}</label>
      <div class="sg">
        ${n.map((e) => k`<div class="so ${r === e.val ? "active" : ""}" @click="${() => this._set(t, e.val)}">${e.label}</div>`)}
      </div>
    </div>`;
	}
	_range(e, t, n, r, i, a) {
		let o = parseFloat(this._config[t]) || n, s = Math.round((o - n) / (r - n) * 100);
		return k`<div class="ef">
      <div class="rh"><label class="el" style="margin:0">${e}</label><span class="rv">${o}${a || ""}</span></div>
      <input class="ri" type="range" min="${n}" max="${r}" step="${i}"
        .value="${String(o)}" style="--rp:${s}%"
        @input="${(e) => this._set(t, parseFloat(e.target.value))}"/>
    </div>`;
	}
	_pick(e, t, n) {
		let r = this._config[t] || "", i = n?.length ? { entity: { domain: n } } : { entity: {} };
		return k`<div class="ef">
      <ha-selector
        .hass=${this.hass}
        .selector=${i}
        .value=${r}
        .label=${e}
        @value-changed=${(e) => {
			let n = e.detail.value || "";
			n !== r && this._set(t, n);
		}}
      ></ha-selector>
    </div>`;
	}
	_sec(e, t, n, r) {
		let i = !!this._open[e];
		return k`<div class="es ${i ? "open" : ""}">
      <div class="eh" @click="${() => this._toggleSec(e)}">
        <div class="et">${t}${n === void 0 ? "" : k`<span class="eb">${n}</span>`}</div>
        <span class="ea">▾</span>
      </div>
      <div class="ebody">${i ? r : ""}</div>
    </div>`;
	}
	_appearance() {
		let e = this._config;
		return k`
      ${this._seg("Device brand", "brand", [
			{
				val: "samsung",
				label: "Samsung"
			},
			{
				val: "lg",
				label: "LG"
			},
			{
				val: "bosch",
				label: "Bosch"
			},
			{
				val: "siemens",
				label: "Siemens"
			},
			{
				val: "miele",
				label: "Miele"
			},
			{
				val: "generic",
				label: "Generic"
			}
		])}
      <p class="ht">Controls panel design, body colour, porthole style and foot panels.</p>
      ${this._toggle("Show washer panel", "show_washer")}
      ${this._toggle("Show dryer panel", "show_dryer")}
      ${this._toggle("Frosted glass mode", "frosted_glass")}
      ${e.frosted_glass ? k`
        <p class="ht">Translucent blur – works best with a wallpaper behind Home Assistant.</p>
        ${this._range("Glass opacity", "frosted_opacity", .1, .9, .01, "")}
        ${this._range("Blur strength", "frosted_blur", 4, 40, 1, "px")}
      ` : ""}
    `;
	}
	_washer() {
		let e = {
			samsung: {
				state: "sensor.washer_machine_state",
				time: "sensor.washer_completion_time",
				prog: "sensor.washer_current_course"
			},
			lg: {
				state: "sensor.washer_run_state",
				time: "sensor.washer_remain_time",
				prog: "sensor.washer_course"
			},
			bosch: {
				state: "sensor.washer_operation_state",
				time: "sensor.washer_finish_in_relative",
				prog: "sensor.washer_active_program"
			},
			siemens: {
				state: "sensor.washer_operation_state",
				time: "sensor.washer_finish_in_relative",
				prog: "sensor.washer_active_program"
			},
			miele: {
				state: "sensor.washer_status",
				time: "sensor.washer_remaining_time",
				prog: "sensor.washer_program"
			},
			generic: {
				state: "sensor.washer_state",
				time: "sensor.washer_completion_time",
				prog: "sensor.washer_program"
			}
		}[this._config.brand || "samsung"] || {};
		return k`
      ${this._txt("Washer label", "washer_label", "Washer")}
      <p class="hg">📡 Core entities</p>
      ${this._pick(`Machine state – e.g. ${e.state}`, "washer_machine_state", ["sensor", "binary_sensor"])}
      ${this._pick(`Completion time – e.g. ${e.time}`, "washer_completion_time", ["sensor"])}
      ${this._pick(`Current course (optional) – e.g. ${e.prog}`, "washer_current_course", ["sensor"])}
      <p class="hg">📊 Stat tiles</p>
      ${this._pick("Water temperature (Temp tile)", "washer_water_temperature", ["sensor", "select"])}
      ${this._pick("Spin level (Spin tile)", "washer_spin_level", ["sensor", "select"])}
      ${this._pick("Power W (Power tile)", "washer_power", ["sensor"])}
      ${this._pick("Energy kWh (Energy tile)", "washer_energy", ["sensor"])}
      ${this._pick("Water consumption (Water tile)", "washer_water_consumption", ["sensor"])}
      ${this._pick("Job state (Job tile)", "washer_job_state", ["sensor"])}
    `;
	}
	_dryer() {
		let e = {
			samsung: {
				state: "sensor.dryer_machine_state",
				time: "sensor.dryer_completion_time",
				prog: "sensor.dryer_current_course"
			},
			lg: {
				state: "sensor.dryer_run_state",
				time: "sensor.dryer_remain_time",
				prog: "sensor.dryer_course"
			},
			bosch: {
				state: "sensor.dryer_operation_state",
				time: "sensor.dryer_finish_in_relative",
				prog: "sensor.dryer_active_program"
			},
			siemens: {
				state: "sensor.dryer_operation_state",
				time: "sensor.dryer_finish_in_relative",
				prog: "sensor.dryer_active_program"
			},
			miele: {
				state: "sensor.dryer_status",
				time: "sensor.dryer_remaining_time",
				prog: "sensor.dryer_program"
			},
			generic: {
				state: "sensor.dryer_state",
				time: "sensor.dryer_completion_time",
				prog: "sensor.dryer_program"
			}
		}[this._config.brand || "samsung"] || {};
		return k`
      ${this._txt("Dryer label", "dryer_label", "Dryer")}
      <p class="hg">📡 Core entities</p>
      ${this._pick(`Machine state – e.g. ${e.state}`, "dryer_machine_state", ["sensor", "binary_sensor"])}
      ${this._pick(`Completion time – e.g. ${e.time}`, "dryer_completion_time", ["sensor"])}
      ${this._pick(`Current course (optional) – e.g. ${e.prog}`, "dryer_current_course", ["sensor"])}
      <p class="hg">📊 Stat tiles</p>
      ${this._pick("Energy kWh (Energy tile)", "dryer_energy", ["sensor"])}
      ${this._pick("Power W (Power tile)", "dryer_power", ["sensor"])}
      ${this._pick("Job state (Job tile)", "dryer_job_state", ["sensor"])}
      <p class="hg">⚙️ Controls</p>
    `;
	}
	render() {
		if (!this._config) return k``;
		let e = [
			"washer_machine_state",
			"washer_completion_time",
			"washer_current_course",
			"washer_water_temperature",
			"washer_spin_level",
			"washer_power",
			"washer_energy",
			"washer_water_consumption",
			"washer_job_state"
		].filter((e) => this._config[e]).length, t = [
			"dryer_machine_state",
			"dryer_completion_time",
			"dryer_current_course",
			"dryer_energy",
			"dryer_power",
			"dryer_job_state"
		].filter((e) => this._config[e]).length;
		return k`
      <div class="root">
        ${this._sec("appearance", "🎨 Appearance & Brand", void 0, this._appearance())}
        ${this._sec("washer", "🫧 Washer", e, this._washer())}
        ${this._sec("dryer", "🔥 Dryer", t, this._dryer())}
      </div>`;
	}
	static get styles() {
		return Ce`
:host{display:block;font-family:'Segoe UI',system-ui,sans-serif;}
.root{display:flex;flex-direction:column;padding:8px 0;}
.el{display:block;font-size:12px;font-weight:500;color:var(--primary-text-color,rgba(255,255,255,.7));margin-bottom:6px;}
.ef{margin-bottom:12px;}
.ei{width:100%;padding:10px 12px;font-size:14px;font-family:inherit;border:1px solid var(--divider-color,rgba(255,255,255,.1));border-radius:8px;background:var(--secondary-background-color,rgba(255,255,255,.04));color:var(--primary-text-color,#fff);box-sizing:border-box;}
.ei:focus{outline:none;border-color:var(--primary-color,#4fa3e0);}
.ht{font-size:12px;color:var(--secondary-text-color,rgba(255,255,255,.5));margin:0 0 10px;line-height:1.5;}
.hg{font-size:10px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--primary-color,#4fa3e0);margin:12px 0 8px;}
ha-selector{display:block;width:100%;}
.es{background:var(--secondary-background-color,rgba(255,255,255,.025));border:1px solid var(--divider-color,rgba(255,255,255,.06));border-radius:10px;margin-bottom:10px;overflow:hidden;}
.eh{padding:12px 14px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none;transition:background .15s;}
.eh:hover{background:rgba(255,255,255,.03);}
.et{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:500;color:var(--primary-text-color,#fff);}
.eb{font-size:11px;font-weight:500;color:var(--secondary-text-color,rgba(255,255,255,.4));background:rgba(255,255,255,.05);padding:2px 8px;border-radius:10px;}
.ea{color:var(--secondary-text-color,rgba(255,255,255,.4));font-size:12px;transition:transform .2s;}
.es.open .ea{transform:rotate(180deg);}
.ebody{padding:0 14px;}.es.open .ebody{padding:4px 14px 14px;}
.sg{display:flex;flex-wrap:wrap;border:1px solid var(--divider-color,rgba(255,255,255,.1));border-radius:8px;overflow:hidden;}
.so{flex:1;min-width:55px;padding:8px 4px;font-size:12px;text-align:center;cursor:pointer;color:var(--secondary-text-color,rgba(255,255,255,.5));transition:background .15s,color .15s;}
.so:hover{background:rgba(255,255,255,.04);}
.so.active{background:var(--primary-color,#4fa3e0);color:#fff;font-weight:500;}
.tr{display:flex;align-items:center;justify-content:space-between;padding:6px 0;margin-bottom:10px;}
.tl{font-size:13px;color:var(--primary-text-color,rgba(255,255,255,.85));}
.tw{position:relative;display:inline-block;width:40px;height:22px;}
.tw input{opacity:0;width:0;height:0;}
.ts{position:absolute;inset:0;background:rgba(255,255,255,.15);border-radius:11px;cursor:pointer;transition:background .2s;}
.ts::before{content:'';position:absolute;width:16px;height:16px;left:3px;top:3px;background:#fff;border-radius:50%;transition:transform .2s;}
input:checked+.ts{background:var(--primary-color,#4fa3e0);}
input:checked+.ts::before{transform:translateX(18px);}
.rh{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
.rv{font-size:12px;font-weight:600;color:var(--primary-color,#4fa3e0);font-family:monospace;min-width:36px;text-align:right;}
.ri{-webkit-appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;background:linear-gradient(to right,var(--primary-color,#4fa3e0) 0%,var(--primary-color,#4fa3e0) var(--rp,50%),rgba(255,255,255,.12) var(--rp,50%),rgba(255,255,255,.12) 100%);}
.ri::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px rgba(79,163,224,.4);cursor:pointer;}
.ri::-moz-range-thumb{width:16px;height:16px;border-radius:50%;border:none;background:#fff;box-shadow:0 0 0 3px rgba(79,163,224,.4);cursor:pointer;}
    `;
	}
};
customElements.get("samsung-laundry-card") || customElements.define("samsung-laundry-card", Ba), customElements.get("samsung-laundry-card-editor") || customElements.define("samsung-laundry-card-editor", Va), window.customCards = window.customCards || [], window.customCards.some((e) => e.type === "samsung-laundry-card") || window.customCards.push({
	type: "samsung-laundry-card",
	name: "Laundry Card",
	description: "Appliance-style front-load washer & dryer card. Works with any brand: Samsung, LG, Bosch, Siemens, Miele and more.",
	preview: !0,
	documentationURL: "https://github.com/robman2026/Laundry-Room-Card"
}), console.info("%c LAUNDRY-CARD %c v2.3.1 ", "background:#4fa3e0;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px;", "background:#0d1020;color:#6dbfff;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0;"), m(t, ge), m(n, Mt), m(r, Sa), m("atlas-hui-card", Ca);
var Ha = window;
Ha.customStrategies = Ha.customStrategies || [], Ha.customStrategies.some((e) => e.type === "atlas-home") || Ha.customStrategies.push({
	type: e,
	strategyType: "dashboard",
	name: "ATLAS Home",
	description: "Attention-first house dashboard with rooms, alerts and cameras.",
	documentationURL: "https://github.com/robman2026/AttlasDashboard"
}), console.info(`%c ATLAS HOME %c ${i} `, "background:#56E7C0;color:#14171C;font-weight:700", "background:#252A30;color:#F1F5FF");
