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
}, ee = [
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
], h = (e) => e.rooms ?? [], g = (e) => (e.energy_meters ?? []).filter((e) => e?.power), te = [
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
], ne = (e) => g(e).flatMap((e) => te.map((t) => e[t]).filter((e) => !!e)), _ = (e) => e.floors ?? [], v = (e, t) => h(e).find((e) => e.id === t), re = (e, t) => _(e).find((e) => e.id === t), y = (e, t) => h(e).filter((e) => e.floor === t), b = (e) => e && e.show_camera !== !1 && e.camera || void 0, ie = (e, t) => {
	let n = /* @__PURE__ */ new Map();
	for (let r of y(e, t)) {
		let e = b(r);
		e && n.set(e, [...n.get(e) ?? [], r]);
	}
	return [...n].map(([e, t]) => ({
		camera: e,
		rooms: t
	}));
}, x = (e, t) => h(e).find((e) => e.temperature === t || e.humidity === t || b(e) === t || (e.devices ?? []).some((e) => e.entity === t)), ae = (e, t) => {
	for (let n of h(e)) {
		let e = (n.devices ?? []).find((e) => e.entity === t);
		if (e?.name) return e.name;
	}
}, oe = (e, t) => {
	if (!t) return;
	if (t.image) return t.image === "none" ? void 0 : t.image;
	if (e.appearance?.image_path) return;
	let n = `${t.id.replace(/_/g, "-")}.jpg`;
	return ee.includes(n) ? n : void 0;
}, se = (e, t) => {
	if (!t) return;
	if (/^(https?:)?\/\//.test(t) || t.startsWith("/")) return t;
	let n = e.appearance?.image_path || s;
	return n.endsWith("/") || (n += "/"), n + t;
}, ce = (e, t) => se(e, oe(e, t)), le = (e) => {
	let t = e.appearance?.accent ?? "";
	return /^#[0-9a-fA-F]{6}$/.test(t) ? t : a;
}, ue = (e) => {
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
	for (let t of h(e)) n(t.temperature), n(t.humidity), n(b(t)), (t.devices ?? []).forEach((e) => n(e.entity));
	return [...t];
}, de = (e) => {
	let t = /* @__PURE__ */ new Map();
	for (let n of h(e)) {
		let e = b(n);
		e && t.set(e, [...t.get(e) ?? [], n]);
	}
	return [...t].map(([e, t]) => ({
		camera: e,
		rooms: t
	}));
}, fe = (e) => !!e.entities?.alarm || !!e.alerts?.exterior_doors?.length || !!e.alerts?.interior_doors?.length || de(e).length > 0 || h(e).some((e) => !!e.car_lock || (e.devices ?? []).some((e) => [
	"binary_sensor",
	"cover",
	"lock"
].includes(e.entity.split(".")[0]))), pe = (e) => [...new Set(h(e).flatMap((t) => S(e, t)))], S = (e, t) => {
	if (!t) return [];
	if (t.light_entities?.length) return t.light_entities;
	let n = new Set(e.entities?.exclude_lights ?? []);
	return (t.devices ?? []).map((e) => e.entity).filter((e) => e.startsWith("light.") && !n.has(e));
}, me = (e, t) => {
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
}, he, C = (e, t, n = {}) => ({
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
		let t = _(e)[0]?.id, n = {
			subview: !0,
			back_path: "home"
		}, r = [
			{
				title: "Home",
				path: "home",
				icon: "mdi:home-variant-outline",
				type: "panel",
				cards: [C(e, "home")]
			},
			{
				title: "Alerts",
				path: "alerts",
				type: "panel",
				...n,
				cards: [C(e, "alerts")]
			},
			{
				title: "Rooms",
				path: "rooms",
				type: "panel",
				...n,
				cards: [C(e, "rooms", { floor: t })]
			}
		];
		r.push({
			title: "System",
			path: "system",
			type: "panel",
			...n,
			cards: [C(e, "system")]
		}), fe(e) && r.push({
			title: "Security",
			path: "security",
			type: "panel",
			...n,
			cards: [C(e, "security")]
		}), pe(e).length && r.push({
			title: "Lights",
			path: "lights",
			type: "panel",
			...n,
			cards: [C(e, "lights")]
		}), g(e).length && r.push({
			title: "Energy",
			path: "energy",
			type: "panel",
			...n,
			cards: [C(e, "energy")]
		});
		for (let t of _(e)) r.push({
			title: t.name,
			path: `floor-${t.id}`,
			type: "panel",
			...n,
			cards: [C(e, "rooms", { floor: t.id })]
		});
		for (let t of h(e)) r.push({
			title: t.name,
			path: `room-${t.id}`,
			type: "panel",
			...n,
			cards: [C(e, "room", { room: t.id })]
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
var Ve = globalThis, He = (e) => e, Ue = Ve.trustedTypes, We = Ue ? Ue.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Ge = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, Ke = "?" + w, qe = `<${Ke}>`, T = document, Je = () => T.createComment(""), Ye = (e) => e === null || typeof e != "object" && typeof e != "function", Xe = Array.isArray, Ze = (e) => Xe(e) || typeof e?.[Symbol.iterator] == "function", Qe = "[ 	\n\f\r]", $e = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, et = /-->/g, tt = />/g, E = RegExp(`>|${Qe}(?:([^\\s"'>=/]+)(${Qe}*=${Qe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), nt = /'/g, rt = /"/g, it = /^(?:script|style|textarea|title)$/i, at = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), D = at(1), O = at(2), k = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), ot = /* @__PURE__ */ new WeakMap(), j = T.createTreeWalker(T, 129);
function st(e, t) {
	if (!Xe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return We === void 0 ? t : We.createHTML(t);
}
var ct = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = $e;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === $e ? c[1] === "!--" ? o = et : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = E) : (it.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = E) : o = tt : o === E ? c[0] === ">" ? (o = i ?? $e, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? E : c[3] === "\"" ? rt : nt) : o === rt || o === nt ? o = E : o === et || o === tt ? o = $e : (o = E, i = void 0);
		let d = o === E && e[t + 1].startsWith("/>") ? " " : "";
		a += o === $e ? n + qe : l >= 0 ? (r.push(s), n.slice(0, l) + Ge + n.slice(l) + w + d) : n + w + (l === -2 ? t : d);
	}
	return [st(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, lt = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ct(t, n);
		if (this.el = e.createElement(l, r), j.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = j.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(Ge)) {
					let t = u[o++], n = i.getAttribute(e).split(w), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? pt : r[1] === "?" ? mt : r[1] === "@" ? ht : ft
					}), i.removeAttribute(e);
				} else e.startsWith(w) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (it.test(i.tagName)) {
					let e = i.textContent.split(w), t = e.length - 1;
					if (t > 0) {
						i.textContent = Ue ? Ue.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], Je()), j.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], Je());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === Ke) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(w, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += w.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = T.createElement("template");
		return n.innerHTML = e, n;
	}
};
function M(e, t, n = e, r) {
	if (t === k) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = Ye(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = M(e, i._$AS(e, t.values), i, r)), t;
}
var ut = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? T).importNode(t, !0);
		j.currentNode = r;
		let i = j.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new dt(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new gt(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = j.nextNode(), a++);
		}
		return j.currentNode = T, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, dt = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = M(this, e, t), Ye(e) ? e === A || e == null || e === "" ? (this._$AH !== A && this._$AR(), this._$AH = A) : e !== this._$AH && e !== k && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? Ze(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== A && Ye(this._$AH) ? this._$AA.nextSibling.data = e : this.T(T.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = lt.createElement(st(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new ut(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = ot.get(e.strings);
		return t === void 0 && ot.set(e.strings, t = new lt(e)), t;
	}
	k(t) {
		Xe(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(Je()), this.O(Je()), this, this.options)) : r = n[i], r._$AI(a), i++;
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
}, ft = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = A, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = A;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = M(this, e, t, 0), a = !Ye(e) || e !== this._$AH && e !== k, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = M(this, r[n + o], t, o), s === k && (s = this._$AH[o]), a ||= !Ye(s) || s !== this._$AH[o], s === A ? e = A : e !== A && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, pt = class extends ft {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === A ? void 0 : e;
	}
}, mt = class extends ft {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== A);
	}
}, ht = class extends ft {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = M(this, e, t, 0) ?? A) === k) return;
		let n = this._$AH, r = e === A && n !== A || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== A && (n === A || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, gt = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		M(this, e);
	}
}, _t = Ve.litHtmlPolyfillSupport;
_t?.(lt, dt), (Ve.litHtmlVersions ??= []).push("3.3.3");
var vt = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new dt(t.insertBefore(Je(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, yt = globalThis, bt = class extends Be {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = vt(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return k;
	}
};
bt._$litElement$ = !0, bt.finalized = !0, yt.litElementHydrateSupport?.({ LitElement: bt });
var xt = yt.litElementPolyfillSupport;
xt?.({ LitElement: bt }), (yt.litElementVersions ??= []).push("4.2.2");
// src/config/preset-demo.ts
var St = {
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
				type: "media-control",
				entity: "media_player.living_room_tv"
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
				},
				{
					entity: "sensor.oven_temperature",
					name: "Oven"
				},
				{
					entity: "select.dishwasher_program",
					name: "Dishwasher"
				}
			]
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
				type: "tile",
				entity: "sensor.washer_power",
				name: "Washer"
			}, {
				type: "tile",
				entity: "sensor.dryer_power",
				name: "Dryer"
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
} }), Ct = (e) => Array.isArray(e) ? e.join(", ") : e, wt = [
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
], Tt = [
	...wt,
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
], Et = [
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
				type: `entity (${Ct("alarm_control_panel")})`,
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
				fields: wt,
				group: "Climate and automations"
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
				fields: Tt
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
	}
], Dt, Ot = class extends bt {
	constructor() {
		super(), this._fieldIndex = new Map(Et.flatMap((e) => e.fields.map((e) => [e.name, e]))), this._label = (e) => this._fieldIndex.get(e.name)?.label ?? e.name, this._helper = (e) => this._fieldIndex.get(e.name)?.help, this._tab = "appearance", this._room = 0, this._formReady = !!customElements.get("ha-form");
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
			...structuredClone(St)
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
			}, ...ee.map((e) => ({
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
		return D`<ha-form
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
		if (!this._config || !this.hass) return A;
		if (!this._formReady) return D`<p>Loading editor...</p>`;
		let e = !(this._config.rooms ?? []).length, t = Et.find((e) => e.key === this._tab) ?? Et[0];
		return D`
      ${e ? D`<div class="preset">
            <p>This dashboard has no rooms yet. Load the demo house as a starting point and replace its entities with yours, or paste your own config in YAML mode.</p>
            <button @click=${this._loadPreset}>Load demo house</button>
          </div>` : A}
      <nav>
        ${Et.map((e) => D`<button class=${e.key === t.key ? "on" : ""} @click=${() => this._tab = e.key}>${e.tab}</button>`)}
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
		return D`
      <div class="rooms-bar">
        <select @change=${(e) => this._room = Number(e.target.value)}>
          ${t.map((e, t) => D`<option value=${t} ?selected=${t === n}>${e.name} (${e.id})</option>`)}
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
      ${r ? this._form(r, this._schema(e.fields), (e) => i(t.map((t, r) => r === n ? e : t))) : D`<p>No rooms.</p>`}
    `;
	}
};
Dt = Ot, Dt.properties = {
	hass: { attribute: !1 },
	_config: { state: !0 },
	_tab: { state: !0 },
	_room: { state: !0 },
	_formReady: { state: !0 }
}, Dt.styles = Ce`
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
var L = (e) => e.split(".")[0], R = (e, t) => t && e ? e.states[t] : void 0, z = (e) => !e || e.state === "unavailable" || e.state === "unknown", B = (e, t) => {
	let n = R(e, t);
	if (z(n)) return;
	let r = Number(n.state);
	return Number.isFinite(r) ? r : void 0;
}, V = (e, t) => {
	let n = B(e, t);
	if (n === void 0) return;
	let r = String(R(e, t)?.attributes.unit_of_measurement ?? "kW");
	return r === "W" ? n / 1e3 : r === "MW" ? n * 1e3 : n;
}, kt = (e, t) => String(R(e, t)?.attributes.friendly_name ?? t), H = (e, t) => {
	if (e.formatEntityState) return e.formatEntityState(t);
	let n = t.attributes.unit_of_measurement;
	return n ? `${t.state} ${n}` : t.state;
}, U = (e) => e ? L(e.entity_id) === "cover" ? e.state === "open" || e.state === "opening" : e.state === "on" : !1, At = {
	critical: 0,
	warning: 1,
	minor: 2
}, jt = [
	"critical",
	"warning",
	"minor"
], Mt = (e) => {
	if (Array.isArray(e)) return e.length;
	if (e == null || e === "") return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}, Nt = (e) => jt.includes(e) ? e : "minor", Pt = (e) => {
	if (!e || z(e)) return;
	let t = e.attributes ?? {}, n = (Array.isArray(t.incidents) ? t.incidents : []).filter((e) => e && typeof e == "object").map((e, t) => ({
		id: String(e.id ?? t),
		severity: Nt(e.severity),
		title: String(e.title ?? "Incident"),
		detail: e.detail ? String(e.detail) : "",
		recommendation: e.recommendation ? String(e.recommendation) : "",
		count: Mt(e.count),
		sources: Array.isArray(e.sources) ? e.sources.map(String) : []
	})).sort((e, t) => At[e.severity] - At[t.severity] || (t.count ?? 0) - (e.count ?? 0)), r = t.summary && typeof t.summary == "object" ? t.summary : {}, i = Object.fromEntries(jt.map((e) => [e, Mt(r[e]) ?? Mt(t[e]) ?? n.filter((t) => t.severity === e).length]));
	return {
		generated: typeof t.generated == "string" ? t.generated : void 0,
		counts: i,
		incidents: n
	};
}, Ft = (e, t) => `${e}|${t}`, It = {
	daily: 1,
	hourly: 2,
	twice_daily: 4
}, Lt = (e) => {
	let t = Number(e?.attributes.supported_features ?? 0);
	return [
		"daily",
		"twice_daily",
		"hourly"
	].filter((e) => (t & It[e]) !== 0);
}, Rt = (e) => Lt(e).filter((e) => e === "daily" || e === "hourly"), zt = [
	"rainy",
	"pouring",
	"lightning-rainy",
	"snowy",
	"snowy-rainy",
	"hail"
], Bt = [
	"lightning",
	"lightning-rainy",
	"hail",
	"pouring",
	"exceptional"
], Vt = (e) => e ? e === "partlycloudy" ? "Partly cloudy" : e === "clear-night" ? "Clear night" : e === "windy-variant" ? "Windy" : e.charAt(0).toUpperCase() + e.slice(1).replace(/-/g, ", ") : "-", Ht = (e, t = .1) => {
	if (!Array.isArray(e) || !e.length) return;
	let n = !1;
	for (let r of e.slice(0, 2)) if (r.precipitation !== void 0 && r.precipitation !== null && (n = !0, Number(r.precipitation) >= t) || r.precipitation_probability !== void 0 && r.precipitation_probability !== null && (n = !0, Number(r.precipitation_probability) >= 50)) return !0;
	return !n && void 0;
}, Ut = [
	"N",
	"NE",
	"E",
	"SE",
	"S",
	"SW",
	"W",
	"NW"
], Wt = (e) => {
	if (typeof e == "string" && e.trim()) return e;
	let t = Number(e);
	return e == null || !Number.isFinite(t) ? "" : Ut[Math.round((t % 360 + 360) % 360 / 45) % 8];
}, Gt = /* @__PURE__ */ new Map(), Kt = {
	critical: 0,
	warning: 1,
	info: 2
}, qt = (e, t, n = {}) => {
	let r = [], i = t.alerts ?? {}, a = (e) => x(t, e)?.name, o = (n) => ae(t, n) ?? kt(e, n);
	for (let n of i.critical ?? []) {
		let i = R(e, n), a = x(t, n);
		z(i) ? r.push({
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
		let i = B(e, n.entity), a = x(t, n.entity), s = n.label || a?.name || o(n.entity);
		if (i === void 0) {
			Gt.delete(n.entity), r.push({
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
		let c = n.clear_below ?? n.above, l = Gt.get(n.entity) ? i >= c : i > n.above;
		if (Gt.set(n.entity, l), l) {
			let t = B(e, a?.humidity);
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
			if (!U(R(e, a))) continue;
			let n = x(t, a);
			r.push({
				id: `door-${a}`,
				severity: i,
				title: `${n ? `${n.name} ` : ""}${o(a).toLowerCase()} open`,
				meta: `${kt(e, a)}${n ? ` · ${n.name}` : ""}`,
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
	let c = i.rain_weather || t.entities?.weather, l = R(e, c);
	if (i.rain_windows?.length && c && !z(l) && zt.includes(l.state)) {
		let a = Number.isFinite(Number(i.rain_min_mm)) && i.rain_min_mm !== void 0 ? Number(i.rain_min_mm) : .1;
		if (Ht(n[Ft(c, "hourly")], a) !== !1) {
			let n = H(e, l) || Vt(l.state);
			for (let a of i.rain_windows) {
				let i = R(e, a);
				if (z(i) || !U(i)) continue;
				let s = x(t, a);
				r.push({
					id: `rain-${a}`,
					severity: "warning",
					title: `${s ? `${s.name} ` : ""}${o(a).toLowerCase()} open · ${n.toLowerCase()}`,
					meta: `${kt(e, a)}${s ? ` · ${s.name}` : ""} · close it, the weather is ${n.toLowerCase()}`,
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
		let t = R(e, n.mower);
		if (n.mower && t?.state === "error") {
			let t = n.mower_name || kt(e, n.mower);
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
		let i = B(e, n.salt_level);
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
	let u = R(e, t.entities?.weather);
	if (i.severe_weather !== !1 && t.entities?.weather && !z(u) && Bt.includes(u.state)) {
		let n = H(e, u) || Vt(u.state);
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
		let n = ue(t).filter((t) => {
			let n = R(e, t);
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
		let t = Pt(R(e, d));
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
	if (i.mailbox && (i.mailbox_ack ? R(e, i.mailbox_ack)?.state === "on" : R(e, i.mailbox)?.state === "on")) {
		let e = x(t, i.mailbox);
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
		let t = Object.values(e.states).filter((e) => L(e.entity_id) === "update" && e.state === "on");
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
	return r.sort((e, t) => Kt[e.severity] - Kt[t.severity]);
}, Jt = (e) => {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) n.room && n.roomBadge && !t.has(n.room) && t.set(n.room, {
		text: n.roomBadge,
		severity: n.severity
	});
	return t;
}, Yt = Ce`
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
`, Xt = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Zt = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Qt = class {
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
}, $t = class extends Qt {
	constructor(e) {
		if (super(e), this.it = A, e.type !== Xt.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
	}
	render(e) {
		if (e === A || e == null) return this._t = void 0, this.it = e;
		if (e === k) return e;
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
$t.directiveName = "unsafeHTML", $t.resultType = 1;
// node_modules/lit-html/directives/unsafe-svg.js
var en = class extends $t {};
en.directiveName = "unsafeSVG", en.resultType = 2;
var tn = Zt(en), nn = {
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
	let n = e ? nn[e] : void 0;
	return n ? D`<svg class="ic" aria-hidden="true" width=${t} height=${t} viewBox="0 0 32 32">${tn(n)}</svg>` : A;
}, rn = {
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
}, G = (e, t = 20) => D`<svg aria-hidden="true" width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${O`<path d=${rn[e] ?? rn.dot}></path>`}</svg>`, an = (e) => {
	let t = e ?? "", n = O`<circle cx="14" cy="13" r="6" fill="#FFD27A"></circle>`, r = O`<path d="M10 26h20a7 7 0 0 0 0-14 9.5 9.5 0 0 0-18.3 2A6 6 0 0 0 10 26z" fill="#D3D8DE"></path>`, i = O`<path d="M14 28l-2 3M21 28l-2 3M28 28l-2 3" stroke="#5EC8FF" stroke-width="2" stroke-linecap="round"></path>`, a = O`<path d="M24 6a10 10 0 1 0 8 15A9 9 0 0 1 24 6z" fill="#D3D8DE"></path>`, o = O`${r}`;
	return t === "sunny" ? o = O`<circle cx="20" cy="15" r="8" fill="#FFD27A"></circle>` : t === "clear-night" ? o = a : t === "partlycloudy" ? o = O`${n}${r}` : (t.includes("rain") || t === "pouring" || t.includes("snow") || t === "hail") && (o = O`${r}${i}`), D`<svg aria-hidden="true" width="40" height="32" viewBox="0 0 40 32">${o}</svg>`;
}, on = 6e4, sn = 36e5, cn = 864e5, K = (e, t, n = Date.now()) => {
	let r = t ? Date.parse(t) : NaN;
	if (!Number.isFinite(r)) return "";
	let i = e.locale?.language ?? e.language ?? "en", a = new Intl.RelativeTimeFormat(i, {
		numeric: "auto",
		style: "short"
	}), o = Math.max(0, n - r);
	return o < on ? a.format(0, "minute") : o < sn ? a.format(-Math.floor(o / on), "minute") : o < cn ? a.format(-Math.floor(o / sn), "hour") : o < 7 * cn ? a.format(-Math.floor(o / cn), "day") : new Date(r).toLocaleDateString(i, {
		day: "numeric",
		month: "short"
	});
}, ln = (e, t = "changed") => !e || t === "off" ? void 0 : t === "updated" ? e.last_updated : e.last_changed, un = (e, t) => {
	if (!t) return "";
	let n = e.locale?.language ?? e.language ?? "en", r = (e) => Number.isFinite(Date.parse(e)) ? new Date(e).toLocaleString(n) : "-";
	return `${t.entity_id}\nLast changed: ${r(t.last_changed)}\nLast updated: ${r(t.last_updated)}`;
}, dn = [
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
], fn = (e) => dn.map((t) => e[t]).filter((e) => !!e), pn = (e) => fn(e).length > 0, mn = (e, t) => {
	let n = R(e.hass, t.car_lock);
	if (t.car_lock) {
		if (z(n)) return {
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
			text: H(e.hass, n),
			entity: t.car_lock
		};
	}
	let r = R(e.hass, t.car_doors_locked);
	if (!t.car_doors_locked) return {
		state: "unknown",
		text: ""
	};
	if (z(r)) return {
		state: "unknown",
		text: "Unknown",
		entity: t.car_doors_locked
	};
	let i = t.car_doors_locked_when?.trim(), a = r.state, o = i ? a.toLowerCase() === i.toLowerCase() : L(r.entity_id) === "binary_sensor" ? a === "off" : a.toLowerCase() === "locked";
	return {
		state: o ? "locked" : "unlocked",
		text: o ? "Locked" : "Unlocked",
		entity: t.car_doors_locked
	};
}, hn = (e, t) => {
	let n = R(e.hass, t);
	return !n || z(n) ? "–" : H(e.hass, n);
}, gn = (e, t) => {
	let n = R(e.hass, t.car_last_updated);
	if (n && !z(n) && Number.isFinite(Date.parse(n.state))) return n.state;
	let r = fn(t).map((t) => e.hass.states[t]).filter((e) => !!e && !z(e) && ![
		"button",
		"input_button",
		"script"
	].includes(L(e.entity_id))).map((e) => e.last_updated).filter((e) => Number.isFinite(Date.parse(e))).sort();
	return r[r.length - 1];
}, _n = () => O`<svg class="vsvg" viewBox="0 0 320 130" aria-hidden="true">
  <path d="M18 92 C18 78 26 72 40 70 L92 62 C112 40 140 30 178 30 L214 30 C238 30 256 42 270 60 L290 66 C302 69 306 76 306 88 L306 96 L18 96 Z"
    fill="var(--atlas-accent-soft)" stroke="var(--atlas-accent)" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M106 62 C122 44 144 38 172 38 L178 38 L178 62 Z M190 38 L212 38 C230 38 244 46 254 62 L190 62 Z" fill="rgba(241,245,255,0.12)" stroke="var(--atlas-accent)" stroke-width="2"/>
  <circle cx="84" cy="96" r="20" fill="#14171c" stroke="var(--atlas-accent)" stroke-width="3"/><circle cx="84" cy="96" r="7" fill="var(--atlas-accent)"/>
  <circle cx="246" cy="96" r="20" fill="#14171c" stroke="var(--atlas-accent)" stroke-width="3"/><circle cx="246" cy="96" r="7" fill="var(--atlas-accent)"/>
  <path d="M292 76 L304 78" stroke="#FFD27A" stroke-width="4" stroke-linecap="round"/>
</svg>`, vn = (e, t) => {
	let n = L(t);
	return e.call(n, n === "script" ? "turn_on" : "press", { entity_id: t });
}, yn = (e, t) => {
	if (!pn(t)) return A;
	let n = t.car_name || "Vehicle", r = mn(e, t), i = !!R(e.hass, t.car_lock)?.attributes.code_format, a = se(e.config, t.car_image), o = gn(e, t), s = R(e.hass, t.car_location), c = (a) => {
		if (!t.car_lock) return;
		if (i) return e.moreInfo(t.car_lock);
		let o = () => e.call("lock", a, { entity_id: t.car_lock });
		a === "unlock" ? e.confirm(`Unlock ${n}?`, `${n} is ${r.text.toLowerCase()}.`, o, "Unlock") : o();
	}, l = (t, n, r) => n ? D`<button class="vstat" @click=${() => e.moreInfo(n)}><b class="n">${hn(e, n)}</b><small>${t}${r ? ` · ${r}` : ""}</small></button>` : A, u = (t, n, r) => n || r ? D`<button class="vstat" @click=${() => e.moreInfo(n || r)}>
          <b class="n">${n ? hn(e, n) : "–"}</b>
          <small>${t}${r ? ` · ${hn(e, r)} trip${hn(e, r) === "1" ? "" : "s"}` : ""}</small>
        </button>` : A, d = (t, r, i, a = !1) => t ? D`<button class="sq vact" ?disabled=${R(e.hass, t)?.state === "unavailable"} title=${r}
          @click=${() => a ? e.confirm(`${r}?`, `${n}: ${r.toLowerCase()} now.`, () => vn(e, t), r) : vn(e, t)}>${G(i, 18)}<span>${r}</span></button>` : A;
	return D`<section class="glass card vehicle">
    <div class="row">
      <h2>${G("car", 20)}<span class="vname">${n}${t.car_subtitle ? D`<small class="t2">${t.car_subtitle}</small>` : A}</span></h2>
      ${r.text ? D`<button class="vlock ${r.state}" @click=${() => r.entity && e.moreInfo(r.entity)}>${G(r.state === "locked" ? "lock" : "unlock", 16)}${r.text}</button>` : A}
    </div>
    <div class="vbody">
      <div class="vpic">${a ? D`<img src=${a} alt=${n} loading="lazy" />` : _n()}</div>
      <div class="vstats">
        ${l("Range", t.car_range)}
        ${l("Odometer", t.car_odometer)}
        ${t.car_location ? D`<button class="vstat" @click=${() => e.moreInfo(t.car_location)}><b>${hn(e, t.car_location)}</b><small>Location${s && !z(s) ? ` · ${K(e.hass, s.last_changed)}` : ""}</small></button>` : A}
        ${u("Today", t.car_daily_distance, t.car_daily_trips)}
        ${u("This month", t.car_monthly_distance, t.car_monthly_trips)}
      </div>
    </div>
    <div class="vfoot">
      <span class="t2 vupd">${o ? `Updated ${K(e.hass, o)}` : "No update time"}</span>
      <div class="vacts">
        ${t.car_lock ? D`<button class="sq vact" ?disabled=${r.state === "unknown" || r.state === "moving"} @click=${() => c(r.state === "locked" ? "unlock" : "lock")}>
              ${G(r.state === "locked" ? "unlock" : "lock", 18)}<span>${r.state === "locked" ? "Unlock" : "Lock"}</span></button>` : A}
        ${d(t.car_flash, "Flash lights", "bulb")}
        ${d(t.car_horn, "Honk horn", "horn", !0)}
        ${d(t.car_refresh, "Update data", "refresh")}
      </div>
    </div>
  </section>`;
}, bn = 2, xn = (e, t) => {
	let n = V(e.hass, t.power);
	return n === void 0 ? void 0 : n * 1e3;
}, Sn = (e, t) => {
	if (e === void 0) return "var(--atlas-text2)";
	let n = e / (t || 3e3);
	return n < .65 ? "var(--atlas-accent)" : n < .85 ? "var(--atlas-warn)" : "var(--atlas-crit)";
}, Cn = (e) => e === void 0 ? "–" : Math.abs(e) >= 1e4 ? `${(e / 1e3).toFixed(2)} kW` : `${Math.round(e)} W`, wn = (e, t) => {
	let n = Math.max(0, Math.min(1, e));
	return O`<svg class="ering" width="96" height="96" viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(241,245,255,0.08)" stroke-width="8" stroke-linecap="round"
      pathLength="100" stroke-dasharray="75 100" transform="rotate(135 50 50)"></circle>
    ${n > 0 ? O`<circle cx="50" cy="50" r="42" fill="none" stroke=${t} stroke-width="8" stroke-linecap="round"
          pathLength="100" stroke-dasharray=${`${(n * 75).toFixed(1)} 100`} transform="rotate(135 50 50)"></circle>` : A}
  </svg>`;
}, Tn = (e, t) => {
	if (!t.power) return A;
	let n = Number(t.power_max) > 0 ? Number(t.power_max) : 3e3, r = xn(e, t), i = Sn(r, n), a = r === void 0 ? "Offline" : r < bn ? "Standby" : "Consuming", o = B(e.hass, t.power_energy), s = B(e.hass, t.power_current);
	return D`<section class="glass card rpower">
    <div class="row"><h2>${G("power", 20)}Power</h2><span class="n t2" style="font-size:12px">of ${Cn(n)}</span></div>
    <button class="rpbody" @click=${() => e.moreInfo(t.power)}>
      <span class="rpring">${wn(r === void 0 ? 0 : r / n, i)}<b class="n" style="color:${i}">${Cn(r)}</b></span>
      <span class="rptxt">
        <b style="color:${i}">${a}</b>
        ${t.power_energy ? D`<small class="t2">Energy <span class="n">${o === void 0 ? "–" : `${o.toFixed(2)} kWh`}</span></small>` : A}
        ${t.power_current ? D`<small class="t2">Current <span class="n">${s === void 0 ? "–" : `${s.toFixed(2)} A`}</span></small>` : A}
      </span>
    </button>
  </section>`;
}, q = {
	start: 1,
	pause: 2,
	dock: 4
}, En = {
	mowing: "Mowing",
	paused: "Paused",
	returning: "Returning",
	docked: "Docked",
	idle: "Idle",
	error: "Error"
}, Dn = (e) => {
	let t = Number(e?.attributes.supported_features ?? 0), n = !!e && !z(e);
	return {
		start: (t & q.start) !== 0 && n && e.state !== "mowing",
		pause: (t & q.pause) !== 0 && n && e.state !== "paused" && ["mowing", "returning"].includes(e.state),
		dock: (t & q.dock) !== 0 && n && e.state !== "docked",
		showStart: (t & q.start) !== 0,
		showPause: (t & q.pause) !== 0,
		showDock: (t & q.dock) !== 0
	};
}, On = (e, t) => {
	if (!t.mower) return A;
	let n = R(e.hass, t.mower), r = t.mower_name || String(n?.attributes.friendly_name ?? "Mower"), i = n ? z(n) ? "Unavailable" : En[n.state] ?? H(e.hass, n) : "Not found", a = !n || z(n) || n.state === "error" ? "bad" : n.state === "mowing" ? "on" : n.state === "returning" || n.state === "paused" ? "mid" : "", o = B(e.hass, t.mower_battery), s = o === void 0 ? "var(--atlas-text2)" : o > 50 ? "var(--atlas-accent)" : o > 20 ? "var(--atlas-warn)" : "var(--atlas-crit)", c = Dn(n), l = (n) => e.call("lawn_mower", n, { entity_id: t.mower }), u = c.showPause && n && ["mowing", "returning"].includes(n.state);
	return D`<section class="glass card mower">
    <div class="row">
      <h2>${G("mower", 20)}${r}</h2>
      <button class="mbadge ${a}" @click=${() => e.moreInfo(t.mower)}>${i}</button>
    </div>
    <span class="t2" style="font-size:12px">${n && !z(n) ? `${i} since ${K(e.hass, n.last_changed)}` : t.mower}</span>
    ${t.mower_battery ? D`<button class="mbatt" @click=${() => e.moreInfo(t.mower_battery)}>
          <small class="t2">Battery</small><i class="mbar"><i style="width:${o === void 0 ? 0 : Math.max(0, Math.min(100, o))}%;background:${s}"></i></i>
          <b class="n" style="color:${s}">${o === void 0 ? "–" : `${Math.round(o)} %`}</b>
        </button>` : A}
    <div class="mbtns">
      ${u ? D`<button class="sq" ?disabled=${!c.pause} @click=${() => l("pause")}>Pause</button>` : c.showStart ? D`<button class="sq on" ?disabled=${!c.start} @click=${() => l("start_mowing")}>Start mowing</button>` : A}
      ${c.showDock ? D`<button class="sq" ?disabled=${!c.dock} @click=${() => l("dock")}>Return to dock</button>` : A}
    </div>
  </section>`;
}, kn = (e, t) => {
	let n = B(e.hass, t.salt_level);
	if (n !== void 0) return Math.max(0, Math.min(100, n > 1 ? n : n * 100));
}, An = (e) => Number.isFinite(Number(e.salt_warn_below)) && e.salt_warn_below !== void 0 ? Number(e.salt_warn_below) : 30, jn = (e) => e === void 0 ? "var(--atlas-text2)" : e < 30 ? "var(--atlas-crit)" : e < 60 ? "var(--atlas-warn)" : "var(--atlas-accent)", Mn = (e, t) => {
	if (!t.salt_level) return A;
	let n = kn(e, t), r = n !== void 0 && n < An(t), i = jn(n), a = R(e.hass, t.salt_distance);
	return D`<section class="glass card salt">
    <div class="row"><h2>${G("drop", 20)}${t.salt_name || "Salt level"}</h2>${r ? D`<span class="badge">Buy salt</span>` : A}</div>
    <button class="saltbody" @click=${() => e.moreInfo(t.salt_level)}>
      <span class="salttank"><i style="height:${n ?? 0}%;background:${i}"></i></span>
      <span class="rptxt">
        <b class="n" style="font-size:30px;color:${i}">${n === void 0 ? "–" : `${Math.round(n)} %`}</b>
        <small class="t2">${n === void 0 ? "Sensor unavailable" : r ? `Below ${An(t)} %, refill the softener` : "full"}</small>
        ${t.salt_distance ? D`<small class="t2">Reading <span class="n">${a && !z(a) ? H(e.hass, a) : "–"}</span></small>` : A}
      </span>
    </button>
  </section>`;
}, Nn = (e) => [
	e.power,
	e.power_energy,
	e.power_current,
	e.mower,
	e.mower_battery,
	e.salt_level,
	e.salt_distance
].filter((e) => !!e), Pn = (e, t = " °C") => e === void 0 ? "–" : `${e.toFixed(1)}${t}`, Fn = (e) => e === void 0 ? "" : `${Math.round(e)} % RH`, In = (e, t) => {
	if (e.config.appearance?.light_mood === !1) return;
	let n = S(e.config, t);
	if (!n.length) return;
	let { on: r, level: i, brightness: a } = me(e.hass, n);
	return {
		state: r === 0 ? "dark" : i >= .95 ? "lit" : "part",
		vars: r === 0 ? "--lb:0.42;--ls:0.55;--lg:0" : `--lb:${(.6 + .45 * i).toFixed(2)};--ls:${(.8 + .32 * i).toFixed(2)};--lg:${(.28 * i).toFixed(2)}`,
		text: r === 0 ? "Off" : a < 100 ? `${r} on · ${a} %` : `${r} on`,
		ids: n
	};
}, Ln = (e, t, n = "", r) => {
	let i = B(e.hass, t.temperature), a = B(e.hass, t.humidity), o = e.badges.get(t.id), s = ce(e.config, t), c = t.temperature || t.humidity ? Fn(a) || (t.humidity ? "no reading" : "") : "no climate sensor", l = s ? In(e, t) : void 0;
	return D`<button class="tile ${n} ${o ? "alert" : ""} ${l ? `mood ${l.state}` : ""}" style=${l?.vars ?? ""} aria-label="Open ${t.name}" @click=${() => e.openRoom(t)}>
    ${s ? D`<img src=${s} alt="" loading="lazy" />${l ? D`<span class="glow"></span>` : A}<span class="shade"></span>` : A}
    <span class="top">${W(t.icon, 26)}<span class="tright">${l ? D`<span class="lchip ${l.state}" title="Room lights">${G("bulb", 13)}${l.text}</span>` : A}${o ? D`<span class="badge ${o.severity === "critical" ? "critical" : ""}">${o.text}</span>` : A}</span></span>
    <span class="bot">
      <span class="info">
        <span class="name">${t.name}</span>
        ${t.temperature ? D`<span class="temp n ${e.hot.has(t.id) ? "hot" : ""}">${Pn(i)}</span>` : A}
        <span class="hum n">${[c, r].filter(Boolean).join(" · ")}</span>
      </span>
      <span class="go">${W("chevron", 14)}</span>
    </span>
  </button>`;
}, Rn = {
	critical: "var(--atlas-crit)",
	warning: "var(--atlas-warn)",
	info: "var(--atlas-info)"
}, zn = (e, t, n) => {
	let r = (Array.isArray(t) ? t : t && typeof t == "object" ? [t] : []).filter((e) => e && typeof e == "object");
	return r.length ? D`<div class="owncards ${n}">${r.map((t) => D`<atlas-hui-card .config=${t} .hass=${e.hass}></atlas-hui-card>`)}</div>` : A;
}, J = (e, ...t) => t.some((t) => e.includes(t)), Bn = [
	"door",
	"garage_door",
	"opening",
	"window"
], Vn = [
	"motion",
	"occupancy",
	"presence"
], Hn = (e) => {
	if (!e || L(e.entity_id) !== "binary_sensor") return !1;
	let t = String(e.attributes.device_class ?? "");
	return Vn.includes(t) ? !1 : Bn.includes(t) || J(e.entity_id, "contact", "window", "door", "skylight", "velux");
}, Un = (e) => {
	if (!e || L(e.entity_id) !== "binary_sensor" || Hn(e)) return !1;
	let t = String(e.attributes.device_class ?? "");
	return Vn.includes(t) || J(e.entity_id, "motion", "presence", "occupancy");
}, Wn = (e, t) => {
	let n = L(e), r = String(t?.attributes.device_class ?? "");
	return n === "binary_sensor" ? r === "window" || J(e, "window", "skylight", "velux") ? "window" : r === "garage_door" ? "garage" : J(e, "mailbox", "letterbox") ? "mail" : r === "door" || r === "opening" || J(e, "door") ? "door" : Vn.includes(r) || J(e, "motion", "presence", "person", "occupancy") ? "motion" : "dot" : n === "light" ? "bulb" : n === "fan" ? "fan" : n === "media_player" ? "tv" : n === "cover" ? "garage" : n === "camera" ? "camera" : n === "climate" ? "heat" : n === "switch" ? J(e, "water", "valve", "irrig") ? "drop" : "power" : n === "select" ? "washer" : J(e, "print") ? "printer" : J(e, "mower") ? "mower" : J(e, "oven") ? "oven" : J(e, "washer", "dryer") ? "washer" : r === "temperature" ? "thermo" : r === "battery" ? "power" : "dot";
}, Gn = [
	"light",
	"switch",
	"fan",
	"input_boolean"
], Kn = [
	"button",
	"input_button",
	"script"
], qn = (e) => e.tap ?? (Gn.includes(L(e.entity)) ? "toggle" : "more-info"), Jn = 1, Yn = 2, Xn = 8, Zn = (e) => {
	let t = Number(e?.attributes.supported_features ?? 0);
	return {
		open: (t & Jn) !== 0,
		close: (t & Yn) !== 0,
		stop: (t & Xn) !== 0
	};
}, Qn = (e) => {
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
}, $n = (e, t) => e.confirm ?? ["garage", "gate"].includes(String(t?.attributes.device_class ?? "")), er = (e) => !!e && e.state === "unknown" && ["button", "input_button"].includes(L(e.entity_id)), tr = (e) => {
	if (er(e)) return "idle";
	if (z(e)) return "na";
	let t = L(e.entity_id), n = e.state;
	return t === "binary_sensor" ? n === "on" ? Hn(e) ? "open" : "on" : "idle" : t === "cover" ? n === "open" || n === "opening" ? "open" : "idle" : Gn.includes(t) ? n === "on" ? "on" : "idle" : t === "media_player" ? [
		"off",
		"standby",
		"idle"
	].includes(n) ? "idle" : "on" : t === "climate" ? n === "off" ? "idle" : "on" : "idle";
}, nr = (e, t) => {
	if (!t) return "Not found";
	if (t.state === "unavailable") return "Unavailable";
	if (er(t)) return "Never pressed";
	if (t.state === "unknown") return "Unknown";
	let n = L(t.entity_id);
	if (n === "light" && t.state === "on" && typeof t.attributes.brightness == "number") return `On · ${Math.round(t.attributes.brightness / 255 * 100)} %`;
	if (n === "climate") {
		let e = t.attributes.hvac_action ? String(t.attributes.hvac_action) : t.state, n = t.attributes.current_temperature;
		return `${e.charAt(0).toUpperCase()}${e.slice(1)}${n == null ? "" : ` · ${n} °C`}`;
	}
	return H(e, t);
}, rr = (e, t) => t.name || String(e.states[t.entity]?.attributes.friendly_name ?? t.entity), ir = [
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
], ar = (e) => {
	let t = Number(e?.attributes.supported_features ?? 0);
	return ir.filter((e) => (t & e.feature) !== 0);
}, or = (e, t) => !!e?.attributes.code_format && (!t || !!e.attributes.code_arm_required), sr = (e) => z(e) ? "na" : e.state === "triggered" ? "crit" : [
	"arming",
	"pending",
	"disarming"
].includes(e.state) ? "warn" : e.state.startsWith("armed") ? "armed" : "calm", cr = (e, t) => ae(e.config, t) ?? String(e.hass.states[t]?.attributes.friendly_name ?? t), lr = (e) => {
	let t = e.config.entities?.alarm;
	if (!t) return A;
	let n = R(e.hass, t), r = sr(n), i = ar(n), a = n?.attributes.changed_by, o = (r) => {
		if (or(n, !0)) return e.moreInfo(t);
		e.confirm(`Arm ${r.label.toLowerCase()}?`, `The alarm will arm in ${r.label.toLowerCase()} mode.`, () => e.call("alarm_control_panel", r.service, { entity_id: t }), "Arm");
	}, s = () => {
		if (or(n, !1)) return e.moreInfo(t);
		e.confirm("Disarm the alarm?", `The alarm is ${n ? H(e.hass, n).toLowerCase() : "unknown"}.`, () => e.call("alarm_control_panel", "alarm_disarm", { entity_id: t }), "Disarm");
	}, c = n?.state === "disarmed";
	return D`<section class="glass card alarm ${r}">
    <div class="row">
      <h2>${W("security", 20)}Alarm</h2>
      <button class="t2 more" @click=${() => e.moreInfo(t)}>Details ${W("chevron", 14)}</button>
    </div>
    <button class="astate" @click=${() => e.moreInfo(t)}>
      <span class="aico">${G(r === "calm" ? "shieldoff" : "shield", 30)}</span>
      <span class="atxt"><b>${n ? z(n) ? "Unavailable" : H(e.hass, n) : "Not found"}</b>
        <small class="t2">${n && !z(n) ? `Since ${K(e.hass, n.last_changed)}` : t}${a ? ` · by ${a}` : ""}</small></span>
    </button>
    <div class="amodes">
      ${i.map((e) => D`<button class="sq ${n?.state === e.state ? "on" : ""}" aria-pressed=${n?.state === e.state ? "true" : "false"}
          ?disabled=${z(n) || n?.state === e.state} @click=${() => o(e)}>${G(e.g, 18)}<span>${e.label}</span></button>`)}
      <button class="sq dis" ?disabled=${z(n) || c} @click=${s}>${G("shieldoff", 18)}<span>Disarm</span></button>
    </div>
    ${!i.length && n && !z(n) ? D`<p class="t2" style="font-size:12px;margin:0">This panel reports no arm modes. Use Details to control it.</p>` : A}
  </section>`;
}, ur = (e, t, n, r, i = A) => {
	let a = e.hass.states[t], o = x(e.config, t);
	return D`<div class="srow ${r}">
    <button class="smain" @click=${() => e.moreInfo(t)}>
      <span class="sic">${G(L(t) === "lock" ? a?.state === "locked" ? "lock" : "unlock" : Wn(t, a), 18)}</span>
      <span class="atxt"><b>${cr(e, t)}</b><small class="t2">${o ? `${o.name} · ` : ""}${n}${a && !z(a) ? ` · ${K(e.hass, a.last_changed)}` : ""}</small></span>
    </button>
    ${i}
  </div>`;
}, dr = (e) => {
	let t = e.config.alerts ?? {}, n = h(e.config).flatMap((e) => (e.devices ?? []).map((e) => e.entity)).filter((t) => Hn(e.hass.states[t]) || L(t) === "cover"), r = new Set([t.mailbox].filter(Boolean));
	return [.../* @__PURE__ */ new Set([
		...t.exterior_doors ?? [],
		...t.interior_doors ?? [],
		...n
	])].filter((e) => !r.has(e));
}, fr = (e) => z(e) ? 1 : U(e) ? 0 : 2, pr = (e) => {
	let t = dr(e);
	if (!t.length) return A;
	let n = new Set(e.config.alerts?.exterior_doors ?? []), r = [...t].sort((t, n) => fr(e.hass.states[t]) - fr(e.hass.states[n])), i = t.filter((t) => !z(e.hass.states[t]) && U(e.hass.states[t])).length, a = t.filter((t) => z(e.hass.states[t])).length;
	return D`<section class="glass card">
    <div class="row"><h2>${G("door", 20)}Doors and windows</h2>
      <span class="n t2" style="font-size:12px">${i} open · ${t.length - i - a} closed${a ? ` · ${a} n/a` : ""}</span></div>
    <div class="slist">
      ${r.map((t) => {
		let r = e.hass.states[t], i = z(r), a = !i && U(r);
		return ur(e, t, `${r ? i ? "Unavailable" : H(e.hass, r) : "Not found"}${n.has(t) ? " · exterior" : ""}`, i ? "na" : a ? n.has(t) ? "warn" : "open" : "");
	})}
    </div>
  </section>`;
}, mr = (e) => [...new Set(h(e.config).flatMap((e) => [...(e.devices ?? []).map((e) => e.entity).filter((e) => L(e) === "lock"), ...e.car_lock ? [e.car_lock] : []]))], hr = (e) => {
	let t = mr(e);
	if (!t.length) return A;
	let n = t.filter((t) => {
		let n = e.hass.states[t];
		return !z(n) && n.state !== "locked";
	}).length;
	return D`<section class="glass card">
    <div class="row"><h2>${G("lock", 20)}Locks</h2><span class="n t2" style="font-size:12px">${n ? `${n} not locked` : "All locked"}</span></div>
    <div class="slist">
      ${t.map((t) => {
		let n = e.hass.states[t], r = z(n), i = n?.state === "locked", a = [
			"locking",
			"unlocking",
			"opening"
		].includes(n?.state ?? ""), o = cr(e, t);
		return ur(e, t, n ? r ? "Unavailable" : H(e.hass, n) : "Not found", r ? "na" : i ? "" : "warn", D`<button class="sq sbtn" ?disabled=${r || a} @click=${() => {
			if (n?.attributes.code_format) return e.moreInfo(t);
			i ? e.confirm(`Unlock ${o}?`, `${o} is locked.`, () => e.call("lock", "unlock", { entity_id: t }), "Unlock") : e.call("lock", "lock", { entity_id: t });
		}}>${G(i ? "unlock" : "lock", 16)}<span>${i ? "Unlock" : "Lock"}</span></button>`);
	})}
    </div>
  </section>`;
}, gr = (e) => {
	let t = [...new Set(h(e.config).flatMap((e) => (e.devices ?? []).map((e) => e.entity)))].filter((t) => Un(e.hass.states[t]));
	if (!t.length) return A;
	let n = t.filter((t) => e.hass.states[t]?.state === "on"), r = [...t].sort((t, n) => Number(e.hass.states[n]?.state === "on") - Number(e.hass.states[t]?.state === "on"));
	return D`<section class="glass card">
    <div class="row"><h2>${G("motion", 20)}Motion and presence</h2><span class="n t2" style="font-size:12px">${n.length ? `${n.length} detected` : "All clear"}</span></div>
    <div class="slist">
      ${r.map((t) => {
		let n = e.hass.states[t], r = z(n);
		return ur(e, t, n ? r ? "Unavailable" : H(e.hass, n) : "Not found", r ? "na" : n.state === "on" ? "open" : "");
	})}
    </div>
  </section>`;
}, _r = (e, t, n, r, i = !1) => {
	let a = R(e.hass, t), o = !i && !!a && !z(a) && !!a.attributes.entity_picture, s = o ? `${a.attributes.entity_picture}&width=640&height=360&t=${Math.floor(e.tick / 1e4)}` : void 0, c = !i && !o;
	return D`<button class="cam ${c ? "na" : ""}" aria-label="${n} camera" @click=${r}>
    ${s ? D`<img src=${s} alt="" />` : D`<span class="camna">${W("camera", 22)}${i ? "Private · open the room" : t ? "Camera unavailable" : "No camera"}</span>`}
    <span class="lbl"><i class="dotst ${c ? "na" : ""}"></i>${n}</span>
  </button>`;
}, vr = (e) => {
	let t = de(e.config);
	return t.length ? D`<section class="glass card">
    <div class="row"><h2>${W("camera", 20)}Cameras</h2><span class="n t2" style="font-size:12px">${t.length} camera${t.length === 1 ? "" : "s"} · stills every 10 s</span></div>
    <div class="cams scams">
      ${t.map((t) => _r(e, t.camera, t.rooms.map((e) => e.name).join(" · "), () => e.openRoom(t.rooms[0]), t.rooms.some((e) => e.camera_private)))}
    </div>
  </section>` : A;
}, yr = (e) => {
	let t = R(e.hass, e.config.entities?.alarm), n = dr(e), r = n.filter((t) => !z(e.hass.states[t]) && U(e.hass.states[t])).length, i = de(e.config).length;
	return D`
    <section class="hero" aria-label="Security">
      <h1 class="sm">Security</h1>
      <p class="n">${[
		t ? z(t) ? "Alarm unavailable" : `Alarm ${H(e.hass, t).toLowerCase()}` : "",
		n.length ? `${r} open` : "",
		i ? `${i} camera${i === 1 ? "" : "s"}` : ""
	].filter(Boolean).join(" · ")}</p>
    </section>
    <div class="sec-grid">
      <div class="col">${lr(e)}${pr(e)}${hr(e)}</div>
      <div class="col">${vr(e)}${gr(e)}</div>
    </div>
  `;
}, br = (e) => {
	let t = e.config.entities?.persons ?? [];
	return t.length ? D`<div class="presence" role="list" aria-label="Presence: ${t.filter((t) => e.hass.states[t]?.state === "home").length} of ${t.length} home">
    ${t.map((t) => {
		let n = e.hass.states[t], r = String(n?.attributes.friendly_name ?? t.split(".")[1] ?? t), i = z(n), a = n?.state === "home", o = n?.attributes.entity_picture, s = n ? i ? "Unknown" : H(e.hass, n) : "Not found";
		return D`<button role="listitem" class="pchip ${a ? "home" : ""} ${i ? "na" : ""}" title="${r}: ${s}${n && !i ? `, ${K(e.hass, n.last_changed)}` : ""}"
        @click=${() => e.moreInfo(t)}>
        <span class="pav">${o ? D`<img src=${o} alt="" />` : r.charAt(0).toUpperCase()}<i></i></span>
        <span class="ptxt"><b>${r}</b><small>${s}</small></span>
      </button>`;
	})}
  </div>` : A;
}, Y = (e) => typeof e == "number" && Number.isFinite(e) ? Math.round(e) : void 0, xr = (e) => {
	let t = e.config.entities?.weather;
	if (!t) return A;
	let n = R(e.hass, t);
	if (z(n)) return A;
	let r = n.attributes, i = Rt(n), a = e.ui.wxType && i.includes(e.ui.wxType) ? e.ui.wxType : i[0], o = (a ? e.forecasts[Ft(t, a)] : void 0) ?? (Array.isArray(r.forecast) ? r.forecast : []), s = e.hass.locale?.language ?? e.hass.language ?? "en", c = a === "hourly", l = (o ?? []).slice(0, c ? 6 : 5), u = (e) => {
		let t = new Date(e);
		return Number.isNaN(t.getTime()) ? "" : c ? t.toLocaleTimeString(s, {
			hour: "2-digit",
			minute: "2-digit"
		}) : t.toLocaleDateString(s, { weekday: "short" });
	}, d = Y(r.temperature), f = String(r.temperature_unit ?? "°C"), p = Y(r.wind_speed), m = [p === void 0 ? "" : `Wind ${p} ${r.wind_speed_unit ?? "km/h"}${Wt(r.wind_bearing) ? ` ${Wt(r.wind_bearing)}` : ""}`, Y(r.humidity) === void 0 ? "" : `Humidity ${Y(r.humidity)} %`].filter(Boolean);
	return D`<div class="wxstrip" role="group" aria-label="Weather forecast">
    ${i.length > 1 ? D`<div class="wxseg" role="group" aria-label="Forecast type">
          ${i.map((t) => D`<button class=${t === a ? "on" : ""} aria-pressed=${t === a ? "true" : "false"} @click=${() => {
		e.ui.wxType = t, e.refresh();
	}}>${t === "daily" ? "Days" : "Hours"}</button>`)}
        </div>` : A}
    <button class="wxfc" title=${`${Vt(n.state)}${d === void 0 ? "" : ` ${d}${f}`}${m.length ? ` · ${m.join(" · ")}` : ""}`} @click=${() => e.moreInfo(t)}>
      ${l.length ? l.map((e) => {
		let t = Y(e.temperature), n = Y(e.templow), r = Y(e.precipitation_probability);
		return D`<span class="wxday">
              <small>${u(e.datetime)}</small>
              ${an(e.condition)}
              <b class="n">${t === void 0 ? "–" : `${t}°`}${n === void 0 ? A : D`<span class="t2">${n}°</span>`}</b>
              ${r ? D`<small class="wxpp">${r} %</small>` : A}
            </span>`;
	}) : D`<span class="wxnone t2">${i.length ? "Loading forecast..." : `${Vt(n.state)} · no forecast`}</span>`}
    </button>
  </div>`;
}, Sr = () => {
	let e = (/* @__PURE__ */ new Date()).getHours();
	return e < 5 ? "Good night." : e < 12 ? "Good morning." : e < 18 ? "Good afternoon." : "Good evening.";
}, Cr = (e, t = !1) => {
	let n = e.alerts, r = n.filter((e) => e.severity === "critical").length, i = n.filter((e) => e.severity === "warning").length, a = n.filter((e) => e.severity === "info").length, o = r + i, s = r ? "critical" : i ? "" : a ? "info" : "calm", c = o ? `${o} thing${o > 1 ? "s" : ""} need${o > 1 ? "" : "s"} attention` : a ? `Nothing urgent · ${a} note${a > 1 ? "s" : ""}` : "Nothing needs attention", l = n.slice(0, 3);
	return D`<div class="banner ${s}" role="region" aria-label="Attention">
    <span class="sig">${o || a ? O`<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 7v6M12 17h.01"></path></svg>` : W("security", 22)}</span>
    <button class="sum" @click=${() => e.go("alerts")}>
      <b>${c}</b>
      <span class="n">${r} critical · ${i} warning${i === 1 ? "" : "s"} · ${a} info</span>
    </button>
    ${t ? A : D`<div class="chips">
          ${l.map((t) => D`<button class="chip ${t.severity}" @click=${() => e.openAlert(t)}>
              <span class="ico">${W(t.icon, 20)}</span>
              <span class="txt"><span>${t.chipTitle}</span><span class="val"><b class="n">${t.chipValue}</b><span class="badge ${t.severity}">${t.badge}</span></span></span>
            </button>`)}
        </div>`}
    <button class="more" aria-label="All alerts" @click=${() => e.go("alerts")}>${W("chevron", 18)}</button>
  </div>`;
}, wr = (e) => {
	let t = e.config.entities ?? {}, n = R(e.hass, t.heat_pump);
	if (!t.heat_pump) return A;
	let r = z(n) ? void 0 : Number(n.attributes.current_temperature), i = z(n) ? void 0 : Number(n.attributes.temperature), a = r !== void 0 && Number.isFinite(r), o = a ? Math.max(0, Math.min(1, (r - 10) / 20)) : 0, s = z(n) ? "Unavailable" : String(n.attributes.hvac_action ?? n.state), c = B(e.hass, t.heat_pump_outdoor) ?? B(e.hass, t.outdoor_temperature), l = B(e.hass, t.heat_pump_supply), u = B(e.hass, t.heat_pump_return);
	return D`<section class="glass card">
    <h2 style="font-size:18px"><span style="color:var(--atlas-accent)">${W("climate", 22)}</span>Climate</h2>
    <div class="clim">
      <svg role="img" aria-label="Heat pump ${a ? r : "unavailable"} degrees" width="136" height="136" viewBox="0 0 140 140" style="flex:none">
        <circle cx="70" cy="70" r="60" fill="rgba(0,0,0,0.35)"></circle>
        <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(241,245,255,0.08)" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="${78} 100" transform="rotate(130 70 70)"></circle>
        ${a ? O`<circle cx="70" cy="70" r="58" fill="none" stroke="var(--atlas-accent)" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="${Math.max(1, 78 * o)} 100" transform="rotate(130 70 70)"></circle>` : A}
        <text x="70" y="76" text-anchor="middle" font-size="32" font-weight="700" fill="#F1F5FF">${a ? r.toFixed(1) : "–"}<tspan font-size="13" dy="-13">°C</tspan></text>
        ${i !== void 0 && Number.isFinite(i) ? O`<text x="70" y="98" text-anchor="middle" font-size="12" fill="var(--atlas-accent)">Target ${i.toFixed(1)}°</text>` : A}
      </svg>
      <div class="det">
        <b>Heat pump · ${s.charAt(0).toUpperCase() + s.slice(1)}</b>
        <span class="n t2">Outdoor ${Pn(c, "°")} · Supply ${Pn(l, "°")}</span>
        <span class="n t2">Return ${Pn(u, "°")}</span>
        <div class="btn3">
          <button class="sq" aria-label="Heat pump power" @click=${() => e.moreInfo(t.heat_pump)}>${W("power", 20)}</button>
          <button class="sq" aria-label="Eco mode" @click=${() => e.moreInfo(t.heat_pump)}>${W("eco", 20)}</button>
          <button class="sq" aria-label="Schedule" @click=${() => e.moreInfo(t.heat_pump)}>${W("schedule", 20)}</button>
        </div>
      </div>
    </div>
  </section>`;
}, Tr = (e) => e === void 0 ? "–" : `${e.toFixed(2)} kW`, Er = (e) => {
	let t = e.config.entities ?? {};
	if (!t.house_load && !t.solar_power && !t.grid_import) return A;
	let n = V(e.hass, t.solar_power), r = V(e.hass, t.house_load), i = V(e.hass, t.grid_import), a = V(e.hass, t.grid_export), o = (a ?? 0) > (i ?? 0), s = o ? a : i;
	return D`<section class="glass card" style="gap:10px">
    <div class="row">
      <h2>Energy flow</h2>
      ${g(e.config).length > 0 ? D`<button class="t2 more" @click=${() => e.go("energy")}>Circuits ${W("chevron", 14)}</button>` : A}
    </div>
    <div class="flow">
      <button class="node" @click=${() => t.solar_power && e.moreInfo(t.solar_power)}><span class="c">${W("solar", 22)}</span><b class="n">${Tr(n)}</b><span>Solar</span></button>
      <span class="link ${(n ?? 0) > .01 ? "act r" : ""}"></span>
      <button class="node house" @click=${() => t.house_load && e.moreInfo(t.house_load)}><span class="c">${W("home", 24)}</span><b class="n">${Tr(r)}</b><span>House</span></button>
      <span class="link ${(s ?? 0) > .01 ? `act ${o ? "r" : "l"}` : ""}"></span>
      <button class="node" @click=${() => t.grid_import && e.moreInfo(t.grid_import)}><span class="c">${W("grid", 22)}</span><b class="n">${Tr(s)}</b><span>${o ? "Grid export" : "Grid import"}</span></button>
    </div>
  </section>`;
}, Dr = (e) => {
	let t = e.config.entities ?? {}, n = R(e.hass, t.alarm), r = dr(e).map((t) => e.hass.states[t]), i = r.filter((e) => !z(e)), a = i.filter((e) => U(e)).length, o = (e.config.layout?.security_tiles ?? []).map((t) => v(e.config, t)).filter(Boolean);
	return D`<section class="glass card">
    <div class="row">
      ${fe(e.config) ? D`<button class="h2btn" @click=${() => e.go("security")}><h2>${W("security", 20)}Security${W("chevron", 14)}</h2></button>` : D`<h2>${W("security", 20)}Security</h2>`}
      <button class="n t2" style="font-size:12px" @click=${() => t.alarm && e.moreInfo(t.alarm)}>
        ${n ? z(n) ? "Alarm unavailable" : H(e.hass, n) : ""} · ${a} / ${i.length} open${i.length < r.length ? ` · ${r.length - i.length} n/a` : ""}
      </button>
    </div>
    ${o.length ? D`<div class="cams">${o.map((t) => _r(e, b(t), t.name, () => e.openRoom(t)))}</div>` : A}
  </section>`;
}, Or = (e) => {
	let t = e.config.entities ?? {}, n = R(e.hass, t.alarm), r = R(e.hass, t.garage_cover), i = pe(e.config).filter((t) => e.hass.states[t]?.state === "on"), a = n && n.state !== "disarmed" && !z(n), o = t.wake_pc;
	return D`<section class="glass card" style="gap:10px;padding:14px 16px">
    <h2 style="margin-left:4px">Quick actions</h2>
    <div class="actions">
      ${t.alarm ? D`<button class="qa primary" ?disabled=${z(n)} @click=${() => a ? e.moreInfo(t.alarm) : e.confirm("Arm away?", "The alarm will arm in away mode.", () => e.call("alarm_control_panel", "alarm_arm_away", { entity_id: t.alarm }), "Arm away")}>
            ${W("arm-away", 20)}${a ? "Disarm" : "Arm away"}
          </button>` : A}
      ${t.garage_cover ? D`<button class="qa" ?disabled=${z(r)} @click=${() => {
		let n = r?.state !== "open";
		e.confirm(n ? "Open the garage?" : "Close the garage?", `Garage door is ${r ? H(e.hass, r).toLowerCase() : "unknown"}.`, () => e.call("cover", n ? "open_cover" : "close_cover", { entity_id: t.garage_cover }), n ? "Open" : "Close");
	}}>${W("garage-door", 20)}Garage</button>` : A}
      <button class="qa" @click=${() => i.length ? e.confirm("Turn lights off?", `${i.length} light${i.length > 1 ? "s are" : " is"} on in mapped rooms (status LEDs excluded).`, () => e.call("homeassistant", "turn_off", { entity_id: i }), "Turn off") : e.confirm("All lights are off", "No mapped room light is on.", () => void 0, "OK")}>
        ${W("lights-off", 20)}Lights off${i.length ? D` <span class="n t2">${i.length}</span>` : A}
      </button>
      ${o ? D`<button class="qa" @click=${() => {
		let t = L(o);
		t === "script" ? e.call("script", "turn_on", { entity_id: o }) : e.call(t, "press", { entity_id: o });
	}}>${W("wake-pc", 20)}Wake PC</button>` : A}
      <button class="qa" @click=${() => e.go("rooms")}>${W("more", 20)}More</button>
    </div>
  </section>`;
}, kr = (e) => e === 8 ? [
	2,
	2,
	2,
	3,
	3,
	2,
	2,
	2
] : Array(e).fill(2), Ar = (e) => {
	let t = e.config.entities ?? {}, n = R(e.hass, t.heat_pump), r = z(n) ? void 0 : Number(n.attributes.current_temperature), i = R(e.hass, t.alarm), a = (e.config.layout?.home_tiles?.length ? e.config.layout.home_tiles : h(e.config).slice(0, 8).map((e) => e.id)).map((t) => v(e.config, t)).filter(Boolean), o = kr(a.length), s = h(e.config).length, c = i ? z(i) ? "Alarm unavailable" : `Alarm ${H(e.hass, i).toLowerCase()}` : "", l = i && (z(i) || ["triggered", "pending"].includes(i.state));
	return D`
    <section class="hero ${t.persons?.length || t.weather ? "split" : ""}" aria-label="Greeting">
      <div class="hgreet">
      <h1>${Sr()}</h1>
      <p class="n">
        ${t.heat_pump ? D`Heat pump reads ${r !== void 0 && Number.isFinite(r) ? `${r.toFixed(1)} °C` : "–"} indoors` : A}
        ${c ? D`<span style="opacity:.5"> · </span><span style="color:${l ? "var(--atlas-warn)" : "var(--atlas-accent)"};font-weight:600">${c}</span>` : A}
      </p>
      </div>
      <div class="hside">${xr(e)}${br(e)}</div>
    </section>
    ${Cr(e, e.narrow)}
    <div class="home-grid">
      <div class="col">
        <section class="glass card" style="flex:1;padding:16px">
          <div class="row" style="padding:0 4px;align-items:flex-start">
            <div><h2 style="font-size:20px">Rooms</h2><span class="t2" style="font-size:12px">Quick access to your spaces</span></div>
            <button class="pillbtn" @click=${() => e.go("rooms")}>View all ${s} rooms</button>
          </div>
          <div class="tiles" style="flex:1">${a.map((t, n) => Ln(e, t, o[n] === 3 ? "s3" : ""))}</div>
        </section>
        ${Or(e)}
      </div>
      <div class="col">${wr(e)}${Er(e)}${Dr(e)}</div>
    </div>
    ${zn(e, e.config.layout?.home_cards, "main homecards")}
  `;
}, jr = [
	["critical", "Critical"],
	["warning", "Warning"],
	["info", "Info"]
], Mr = (e) => {
	let t = e.config.alerts?.mailbox_ack, n = jr.map(([t, n]) => ({
		sev: t,
		label: n,
		items: e.alerts.filter((e) => e.severity === t)
	})).filter((e) => e.items.length);
	return D`
    <section class="hero">
      <h1 class="sm">Needs attention</h1>
      <p>Grouped by severity · rows clear automatically when the condition resolves</p>
    </section>
    ${n.length ? n.map((n) => D`<section class="glass card group">
            <h2 style="color:${Rn[n.sev]}">${n.label} · ${n.items.length}</h2>
            <div class="alist">
              ${n.items.map((r) => D`<button class="arow ${r.severity}" @click=${() => e.openAlert(r)}>
                  <span class="ico">${W(r.icon, 20)}</span>
                  <span class="txt"><b>${r.title}</b><span>${r.meta}</span></span>
                  ${r.id === "mailbox" && t ? D`<span class="ctl" role="button" @click=${(n) => {
		n.stopPropagation(), e.call("input_boolean", "turn_off", { entity_id: t });
	}}>Acknowledge</span>` : A}
                  <span class="badge ${r.severity}">${n.label}</span>
                </button>`)}
            </div>
          </section>`) : D`<section class="glass card"><p class="empty">Nothing needs attention. All mapped sources report valid states.</p></section>`}
  `;
}, Nr = (e, t) => {
	let n = t.cameras ?? "off";
	if (n === "off") return A;
	let r = ie(e.config, t.id);
	if (!r.length) return A;
	let i = r.length, a = n === "live" && !!customElements.get("ha-camera-stream"), o = Math.floor(e.tick / 1e4);
	return D`<section class="glass card camsec" style="padding:16px;gap:12px">
    <div class="row" style="padding:0 4px">
      <h2 style="font-size:20px">Cameras on ${t.name}</h2>
      <span class="t2" style="font-size:12px">${n === "live" ? "Live, muted" : "Snapshots every 10 s"} · tap a name for the room</span>
    </div>
    <div class="camwall ${e.narrow ? "" : "fitwall"}" style="--cols:${i <= 3 ? i : i === 4 ? 2 : 3}">
      ${r.map(({ camera: t, rooms: n }) => {
		let r = R(e.hass, t), i = n.map((e) => e.name).join(" · "), s = r?.attributes.entity_picture, c;
		return c = n.some((e) => e.camera_private) ? D`<div class="camslot private"><span class="t2" style="font-size:12px">Private camera · open the room to reveal</span></div>` : z(r) ? D`<div class="camslot"><b style="font-size:13px">Camera unavailable</b></div>` : a ? D`<div class="camslot live"><ha-camera-stream .hass=${e.hass} .stateObj=${r} .fitMode=${"cover"} muted></ha-camera-stream></div>` : D`<div class="camslot live">${s ? D`<img src=${`${s}&width=960&height=540&t=${o}`} alt="${i} camera" loading="lazy" />` : D`<span class="t2" style="font-size:12px">Waiting for picture</span>`}</div>`, D`<div class="camtile">
          <span class="camname"><i class="dotst ${z(r) ? "na" : ""}"></i>${n.map((t, n) => D`${n ? D`<span class="t2" aria-hidden="true">·</span>` : A}<button @click=${() => e.openRoom(t)}>${t.name}</button>`)}</span>
          ${c}
        </div>`;
	})}
    </div>
  </section>`;
}, Pr = (e, t) => {
	let n = y(e.config, t), r = n.filter((t) => !e.hot.has(t.id)).map((t) => B(e.hass, t.temperature)).filter((e) => e !== void 0), i = r.length ? `${(r.reduce((e, t) => e + t, 0) / r.length).toFixed(1)} °C typical` : "no sensors", a = n.filter((t) => e.badges.has(t.id)).length;
	return i + (a ? ` · ${a} alert${a > 1 ? "s" : ""}` : "");
}, Fr = (e) => {
	let t = _(e.config), n = re(e.config, e.floorId) ?? t[0], r = e.config.rooms?.length ?? 0, i = (e.config.rooms ?? []).filter((t) => !t.floor || !re(e.config, t.floor)), a = n ? y(e.config, n.id) : i, o = n ? Nr(e, n) : A, s = o !== A && !e.narrow, c = D`<section class="glass card roomsec" style="flex:1;padding:16px">
      <div class="row" style="padding:0 4px">
        <h2 style="font-size:20px">${n ? `${n.name}${n.level ? ` · level ${n.level}` : ""}` : "Rooms"}</h2>
        <span class="t2" style="font-size:12px">Tap a room for its devices</span>
      </div>
      <div class="tiles floor">
        ${a.map((t) => Ln(e, t, "", `${(t.devices ?? []).length} devices`))}
      </div>
    </section>`;
	return D`
    <section class="hero">
      <h1 class="sm">Rooms</h1>
      <p>${t.length} floors · ${r} rooms · pick a floor, then a room</p>
    </section>
    <div class="floors">
      ${t.map((t) => {
		let r = y(e.config, t.id).length;
		return D`<button class="glass fl ${t.id === n?.id ? "on" : ""}" @click=${() => e.go(`floor-${t.id}`)}>
          <span class="row" style="align-items:baseline"><span class="lv n">${t.level ?? ""}</span><small>${r} room${r === 1 ? "" : "s"}</small></span>
          <span style="font-size:16px;font-weight:600">${t.name}</span>
          <small class="n">${Pr(e, t.id)}</small>
        </button>`;
	})}
    </div>
    ${s ? D`<div class="fitgrid ${a.length === 1 ? "single" : ""}" style="--rcols:${a.length === 1 ? 1 : 2}">${c}${o}</div>` : D`${c}${o}`}
  `;
}, Ir = (e, t) => {
	let n = R(e.hass, t);
	return n ? z(n) ? "–" : H(e.hass, n) : "–";
}, Lr = (e, t) => {
	let n = B(e.hass, t);
	if (n === void 0) return;
	let r = String(R(e.hass, t)?.attributes.unit_of_measurement ?? "min"), i = r === "s" ? n / 60 : r === "h" ? n * 60 : r === "d" ? n * 1440 : n, a = Math.max(0, Math.round(i));
	return a >= 60 ? `${Math.floor(a / 60)} h ${a % 60} min` : `${a} min`;
}, Rr = (e) => !!(e.printer_status || e.printer_progress), zr = (e, t) => {
	let n = e.alerts.filter((e) => e.room === t.id), r = S(e.config, t), i = r.filter((t) => e.hass.states[t]?.state === "on"), a = (t.devices ?? []).filter((t) => {
		let n = e.hass.states[t.entity];
		return !n || n.state === "unavailable";
	}).length, o = Rr(t) ? B(e.hass, t.printer_progress) : void 0;
	return D`<div class="strip">
    <button class="schip ${n.length ? "warn" : "ok"}" @click=${() => e.go("alerts")}>
      ${n.length ? G("dot", 18) : D`<span class="okdot">✓</span>`}
      <span><b>${n.length ? `${n.length} alert${n.length > 1 ? "s" : ""}` : "All OK"}</b><small>${n.length ? n[0].title : "No alerts"}</small></span>
    </button>
    ${r.length ? D`<button class="schip ${i.length ? "on" : ""}" title=${i.length ? "Turn the room lights off" : "Turn the room lights on"}
          @click=${() => e.call("homeassistant", i.length ? "turn_off" : "turn_on", { entity_id: i.length ? i : r })}>
          ${G("bulb", 18)}<span><b>Lights</b><small>${i.length ? `${i.length} of ${r.length} on` : "All off"}</small></span>
        </button>` : A}
    ${Rr(t) ? D`<button class="schip" @click=${() => t.printer_status && e.moreInfo(t.printer_status)}>
          ${G("printer", 18)}<span><b>${t.printer_name || "3D printer"}</b><small>${Ir(e, t.printer_status)}${o === void 0 ? "" : ` · ${Math.round(o)} %`}</small>
          ${o === void 0 ? A : D`<i class="sbar"><i style="width:${Math.max(0, Math.min(100, o))}%"></i></i>`}</span>
        </button>` : A}
    ${pn(t) ? (() => {
		let n = mn(e, t), r = R(e.hass, t.car_range), i = [n.text, r && !z(r) ? H(e.hass, r) : ""].filter(Boolean).join(" · ");
		return D`<button class="schip ${n.state === "unlocked" || n.state === "jammed" ? "warn" : ""}" @click=${() => (n.entity || t.car_range) && e.moreInfo(n.entity || t.car_range)}>
            ${G("car", 18)}<span><b>${t.car_name || "Vehicle"}</b><small>${i || "No data"}</small></span>
          </button>`;
	})() : A}
    ${t.power ? (() => {
		let n = xn(e, t), r = Number(t.power_max) > 0 ? Number(t.power_max) : 3e3;
		return D`<button class="schip" @click=${() => e.moreInfo(t.power)}>${G("power", 18)}<span><b style="color:${Sn(n, r)}">${Cn(n)}</b><small>Power</small></span></button>`;
	})() : A}
    ${t.mower ? (() => {
		let n = R(e.hass, t.mower), r = B(e.hass, t.mower_battery);
		return D`<button class="schip ${!n || z(n) || n.state === "error" ? "warn" : n.state === "mowing" ? "on" : ""}" @click=${() => e.moreInfo(t.mower)}>${G("mower", 18)}<span><b>${t.mower_name || "Mower"}</b><small>${n ? H(e.hass, n) : "Not found"}${r === void 0 ? "" : ` · ${Math.round(r)} %`}</small></span></button>`;
	})() : A}
    ${t.salt_level ? (() => {
		let n = kn(e, t), r = n !== void 0 && n < An(t);
		return D`<button class="schip ${r ? "warn" : ""}" @click=${() => e.moreInfo(t.salt_level)}>${G("drop", 18)}<span><b>${n === void 0 ? "–" : `${Math.round(n)} %`}</b><small>${r ? "Buy salt" : t.salt_name || "Salt level"}</small></span></button>`;
	})() : A}
    ${a ? D`<span class="schip warn"><span><b>${a} unavailable</b><small>device${a > 1 ? "s" : ""} in this room</small></span></span>` : A}
  </div>`;
}, Br = (e, t) => {
	let n = t.climate_extra ?? [];
	return n.length ? D`<div class="cextra">
    ${n.map((t) => {
		let n = e.hass.states[t.entity];
		return D`<button class="cx" @click=${() => e.moreInfo(t.entity)}>
        <span class="cxi">${t.icon ? D`<ha-icon .icon=${t.icon} style="--mdc-icon-size:18px"></ha-icon>` : G(Wn(t.entity, n), 18)}</span>
        <span><b class="n">${Ir(e, t.entity)}</b><small>${rr(e.hass, t)}</small></span>
      </button>`;
	})}
  </div>` : A;
}, Vr = (e, t) => {
	if (!Rr(t)) return A;
	let n = B(e.hass, t.printer_progress), r = Lr(e, t.printer_remaining), i = R(e.hass, t.printer_picture)?.attributes.entity_picture, a = Math.floor(e.tick / 1e4), o = [
		["Nozzle", t.printer_nozzle],
		["Bed", t.printer_bed],
		["Chamber", t.printer_chamber]
	].filter(([, e]) => e), s = R(e.hass, t.printer_light), c = (t) => t && e.call("button", "press", { entity_id: t });
	return D`<section class="glass card printer">
    <div class="row">
      <h2>${G("printer", 20)}${t.printer_name || "3D printer"}</h2>
      <button class="pstatus" @click=${() => t.printer_status && e.moreInfo(t.printer_status)}>${Ir(e, t.printer_status)}</button>
    </div>
    <div class="pbody">
      ${i ? D`<button class="ppic" @click=${() => e.moreInfo(t.printer_picture)}><img src=${`${i}${i.includes("?") ? "&" : "?"}t=${a}`} alt="" /></button>` : A}
      <button class="pnum" @click=${() => t.printer_progress && e.moreInfo(t.printer_progress)}>
        <b class="n">${n === void 0 ? "–" : `${Math.round(n)} %`}</b>
        <span class="t2">${r ? `${r} remaining` : t.printer_remaining ? "no time estimate" : ""}</span>
      </button>
    </div>
    <span class="bar"><span style="width:${n === void 0 ? 0 : Math.max(0, Math.min(100, n))}%;background:var(--atlas-accent)"></span></span>
    ${o.length ? D`<div class="ptemps">${o.map(([t, n]) => D`<button @click=${() => e.moreInfo(n)}><b class="n">${Ir(e, n)}</b><small>${t}</small></button>`)}</div>` : A}
    ${t.printer_light || t.printer_pause || t.printer_resume || t.printer_stop ? D`<div class="pbtns">
          ${t.printer_light ? D`<button class="sq ${s?.state === "on" ? "on" : ""}" title="Chamber light" @click=${() => e.call(L(t.printer_light), "toggle", { entity_id: t.printer_light })}>${G("bulb", 20)}</button>` : A}
          ${t.printer_pause ? D`<button class="sq" title="Pause" @click=${() => c(t.printer_pause)}>Pause</button>` : A}
          ${t.printer_resume ? D`<button class="sq" title="Resume" @click=${() => c(t.printer_resume)}>Resume</button>` : A}
          ${t.printer_stop ? D`<button class="sq stop" title="Stop" @click=${() => e.confirm("Stop the print?", "The current print job will be cancelled.", () => c(t.printer_stop), "Stop print")}>Stop</button>` : A}
        </div>` : A}
  </section>`;
}, Hr = (e, t) => {
	let n = t.automations ?? [];
	return n.length ? D`<section class="glass card autos">
    <h2>${W("automations", 20)}Automations</h2>
    ${n.map((t) => {
		let n = e.hass.states[t], r = n?.state === "on", i = n?.attributes.last_triggered;
		return D`<div class="auto">
        <button class="atxt" @click=${() => e.moreInfo(t)}>
          <b>${String(n?.attributes.friendly_name ?? t)}</b>
          <small class="t2">${z(n) ? "Unavailable" : i ? `Last run ${K(e.hass, i)}` : "Never run"}</small>
        </button>
        <button class="tog ${r ? "on" : ""}" role="switch" aria-checked=${r ? "true" : "false"} aria-label="Enable ${String(n?.attributes.friendly_name ?? t)}"
          ?disabled=${z(n)} @click=${() => e.call("automation", "toggle", { entity_id: t })}><i></i></button>
      </div>`;
	})}
  </section>` : A;
}, Ur = 500, Wr = 8, Gr = (e) => {
	let t = 0, n = 0, r = 0, i = !1, a = !1, o, s = 1;
	return {
		down: (c) => {
			let l = c.currentTarget;
			t = c.clientX, n = e.start(), r = n, i = !1, a = !1, s = l.getBoundingClientRect().width || 1, l.setPointerCapture?.(c.pointerId), o = window.setTimeout(() => {
				a = !0, e.hold();
			}, Ur);
		},
		move: (c) => {
			if (a || !c.buttons && c.pointerType === "mouse") return;
			let l = c.clientX - t;
			if (!i && Math.abs(l) < Wr || !e.canDrag()) return;
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
}, Kr = 1, qr = 4, Jr = (e) => {
	let t = Number(e?.attributes.supported_features ?? 0);
	return {
		speed: (t & Kr) !== 0,
		direction: (t & qr) !== 0
	};
}, Yr = (e) => {
	if (e?.state !== "on") return 0;
	let t = Number(e.attributes.percentage);
	return Number.isFinite(t) ? Math.max(0, Math.min(100, Math.round(t))) : 0;
}, Xr = (e, t) => {
	let n = Number(e?.attributes.percentage_step) > 0 ? Number(e.attributes.percentage_step) : 1;
	return Math.max(Math.round(n), Math.min(100, Math.round(Math.round(t / n) * n)));
}, Zr = (e, t, n, r, i) => {
	let a = e.hass.states[t.entity], o = Jr(a), s = a?.state === "on", c = Yr(a), l = rr(e.hass, t), u = String(a?.attributes.direction ?? "forward"), d = Gr({
		start: () => Yr(e.hass.states[t.entity]),
		canDrag: () => Jr(e.hass.states[t.entity]).speed && !z(e.hass.states[t.entity]),
		snap: (n) => Xr(e.hass.states[t.entity], n),
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
	}), f = s && o.speed && c ? `On · ${c} %` : nr(e.hass, a);
	return D`<div class="dev fan ${s ? "on" : ""} ${!a || z(a) ? "na" : ""}" title=${un(e.hass, a) || t.entity}>
    <button class="dmain fdrag" style="--pct:${c}%" aria-label="${l}: tap to toggle${o.speed ? ", drag to set the speed" : ""}, hold for details"
      @pointerdown=${d.down} @pointermove=${d.move} @pointerup=${d.up} @pointercancel=${d.cancel} @contextmenu=${d.context}
      @keydown=${(e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), r());
	}}>
      <span class="ffill" aria-hidden="true"></span>
      <span class="chipi fspin">${i}</span>
      <span class="txt"><b>${l}</b><span class="fstate">${f}</span><span class="lprev"></span>${n ? D`<small class="ago n">${n}</small>` : A}</span>
    </button>
    ${o.direction ? D`<button class="fdir" ?disabled=${!a || z(a)} aria-label="${l} direction: ${u}. Switch"
          @click=${() => e.call("fan", "set_direction", {
		entity_id: t.entity,
		direction: u === "reverse" ? "forward" : "reverse"
	})}>${u === "reverse" ? "↺ Rev" : "↻ Fwd"}</button>` : A}
  </div>`;
}, Qr = 500, $r = (e, t) => {
	let n = e.hass.states[t.entity], r = L(t.entity), i = rr(e.hass, t), a = qn(t), o, s = "", c = "", l = "";
	if (a === "toggle" && Gn.includes(r) && !z(n)) {
		let a = n.state === "on";
		o = () => e.call(r, "toggle", { entity_id: t.entity }), s = `Turn ${a ? "off" : "on"} ${i}?`, c = `${i} is ${nr(e.hass, n).toLowerCase()}.`, l = a ? "Turn off" : "Turn on";
	} else if (a === "press" && Kn.includes(r) && n && n.state !== "unavailable") {
		let n = r === "script";
		o = () => e.call(r, n ? "turn_on" : "press", { entity_id: t.entity }), s = `${n ? "Run" : "Press"} ${i}?`, c = n ? "The script will run now." : "The button will be pressed now.", l = n ? "Run" : "Press";
	}
	o ? t.confirm ? e.confirm(s, c, o, l) : o() : e.moreInfo(t.entity);
}, ei = (e, t) => {
	let n, r = !1;
	return {
		down: () => {
			r = !1, n = window.setTimeout(() => {
				r = !0, e.moreInfo(t.entity);
			}, Qr);
		},
		up: () => window.clearTimeout(n),
		click: () => {
			r || $r(e, t);
		},
		context: (i) => {
			i.preventDefault(), window.clearTimeout(n), r = !0, e.moreInfo(t.entity);
		}
	};
}, ti = (e, t) => e.icon ? D`<ha-icon .icon=${e.icon} style="--mdc-icon-size:20px"></ha-icon>` : G(Wn(e.entity, t)), ni = (e, t, n) => {
	let r = e.hass.states[t.entity], i = Zn(r), a = Qn(r), o = rr(e.hass, t), s = r?.attributes.current_position, c = typeof s == "number" && r && [
		"open",
		"opening",
		"closing"
	].includes(r.state) ? ` · ${s} %` : "", l = (n, i) => {
		let a = () => e.call("cover", n, { entity_id: t.entity });
		n !== "stop_cover" && $n(t, r) ? e.confirm(`${i} ${o}?`, `${o} is ${nr(e.hass, r).toLowerCase()}.`, a, i) : a();
	}, u = (e, t, n, r) => e ? D`<button class="sq" aria-label="${r} ${o}" ?disabled=${!t} @click=${() => l(n, r)}>${r}</button>` : A;
	return D`<div class="dev cover ${tr(r)}" title=${un(e.hass, r) || t.entity}>
    <button class="dmain" @click=${() => e.moreInfo(t.entity)} @contextmenu=${(n) => {
		n.preventDefault(), e.moreInfo(t.entity);
	}}>
      <span class="chipi">${ti(t, r)}</span>
      <span class="txt"><b>${o}</b><span>${nr(e.hass, r)}${c}</span>${n ? D`<small class="ago n">${n}</small>` : A}</span>
    </button>
    <span class="cbtns">
      ${u(i.open, a.open, "open_cover", "Open")}${u(i.stop, a.stop, "stop_cover", "Stop")}${u(i.close, a.close, "close_cover", "Close")}
    </span>
  </div>`;
}, ri = (e, t, n = []) => {
	let r = e.hass.states[t.entity], i = K(e.hass, ln(r, e.config.appearance?.time_display)), a = Zn(r);
	if (L(t.entity) === "cover" && (a.open || a.close || a.stop)) return ni(e, t, i);
	if (L(t.entity) === "fan" && qn(t) === "toggle") return Zr(e, t, i, () => $r(e, t), ti(t, r));
	let o = tr(r) === "on" && n.includes(t.entity) ? "on lit" : tr(r), s = ei(e, t);
	return D`<button class="dev ${o}" title=${un(e.hass, r) || t.entity}
    @pointerdown=${s.down} @pointerup=${s.up} @pointerleave=${s.up} @click=${s.click} @contextmenu=${s.context}>
    <span class="chipi">${ti(t, r)}</span>
    <span class="txt"><b>${rr(e.hass, t)}</b><span>${nr(e.hass, r)}</span>${i ? D`<small class="ago n">${i}</small>` : A}</span>
  </button>`;
}, ii = (e, t) => {
	if (t.show_camera === !1) return A;
	if (!t.camera) return D`<section class="glass card"><h2>Camera</h2>
      <div class="camslot none"><span class="camico">${G("camera", 24)}</span><span class="t2" style="font-size:12px">This room has no camera</span></div>
    </section>`;
	let n = `cam:${t.id}`, r = e.ui[n] ?? "live", i = !t.camera_private || e.ui[`reveal:${t.id}`] === !0, a = R(e.hass, t.camera), o = R(e.hass, t.camera_snapshot) ?? a, s = (t) => {
		e.ui[n] = t, e.refresh();
	}, c = !!customElements.get("ha-camera-stream"), l;
	if (!i) l = D`<div class="camslot private"><span class="camico">${G("camera", 24)}</span>
      <b style="font-size:14px">${t.name} camera · private</b><span class="t2" style="font-size:12px">Stream hidden until you tap Reveal</span>
      <button class="ctl" @click=${() => {
		e.ui[`reveal:${t.id}`] = !0, e.refresh();
	}}>Reveal</button></div>`;
	else if (z(a)) l = D`<div class="camslot"><span class="camico">${G("camera", 24)}</span><b style="font-size:14px">Camera unavailable</b><span class="t2" style="font-size:12px">${t.camera}</span></div>`;
	else if (r === "live" && c) l = D`<div class="camslot live"><ha-camera-stream .hass=${e.hass} .stateObj=${a} .fitMode=${"cover"} controls muted></ha-camera-stream></div>`;
	else if (r === "snapshot" && o?.attributes.entity_picture) l = D`<div class="camslot live"><img src=${`${o.attributes.entity_picture}&t=${e.ui[`${n}:t`] ?? 0}`} alt="${t.name} snapshot" /></div>`;
	else {
		let e = a?.attributes.entity_picture;
		l = D`<div class="camslot live">${e ? D`<img src=${`${e}&width=1280&height=720`} alt="" />` : A}
      <span class="camwait">Starting live stream…</span></div>`;
	}
	let u = (e, t, n) => D`<button class="sq ${t ? "on" : ""}" style="color:var(--atlas-text)" @click=${n}>${e}</button>`;
	return D`<section class="glass card">
    <div class="row"><h2>Camera</h2>
      <span style="display:flex;gap:10px;align-items:center">
        ${i && !z(a) && r === "live" ? D`<span class="livetag"><i></i>Live</span>` : A}
        ${t.camera_private && i ? D`<button class="t2" style="font-size:12px" @click=${() => {
		e.ui[`reveal:${t.id}`] = !1, s("live");
	}}>Hide</button>` : A}
      </span>
    </div>
    ${l}
    ${i && !z(a) ? D`<div class="btn3" style="margin-top:0">
          ${u("Live", r === "live", () => c ? s("live") : e.moreInfo(t.camera))}
          ${u("Snapshot", r === "snapshot", () => {
		e.ui[`${n}:t`] = Date.now(), s("snapshot");
	})}
          ${u("Recordings", !1, () => e.href("/media-browser/browser"))}
        </div>` : A}
  </section>`;
}, ai = (e) => {
	let t = v(e.config, e.roomId);
	if (!t) return D`<section class="glass card"><p class="empty">Room "${e.roomId}" is not in the config.</p></section>`;
	let n = re(e.config, t.floor), r = n ? y(e.config, n.id) : h(e.config), i = r.findIndex((e) => e.id === t.id), a = r[(i - 1 + r.length) % r.length], o = r[(i + 1) % r.length], s = B(e.hass, t.temperature), c = B(e.hass, t.humidity), l = e.badges.get(t.id), u = t.devices ?? [], d = ce(e.config, t), f = d ? In(e, t) : void 0, p = zn(e, t.side_cards, "side"), m = s === void 0 ? "" : s < 16 ? "#5EC8FF" : s > 30 ? "var(--atlas-crit)" : "var(--atlas-accent)", ee = [
		s === void 0 ? "" : Pn(s),
		c === void 0 ? "" : Fn(c),
		`${u.length} device${u.length === 1 ? "" : "s"}`
	].filter(Boolean).join(" · "), g = t.temperature || t.humidity, te = e.config.appearance?.time_display, ne = (t) => {
		let n = R(e.hass, t), r = K(e.hass, ln(n, te));
		return r ? D`<small class="ago n" title=${un(e.hass, n)}>${r}</small>` : A;
	};
	return D`
    <nav class="crumb" aria-label="Breadcrumb">
      <button @click=${() => e.go("home")}>Home</button><span aria-hidden="true">›</span>
      ${n ? D`<button @click=${() => e.go(`floor-${n.id}`)}>${n.name}</button><span aria-hidden="true">›</span>` : A}
      <b>${t.name}</b>
    </nav>
    <section class="rhead">
      <div class="rtitle">
        <div class="title">${W(t.icon, 32)}<h1>${t.name}</h1>${l ? D`<span class="badge ${l.severity === "critical" ? "critical" : ""}">${l.text}</span>` : A}</div>
        <p class="n t2">${n ? D`${n.name} <span style="opacity:.5">·</span> ` : A}${ee}</p>
      </div>
      ${zr(e, t)}
      ${r.length > 1 ? D`<div class="rnav">
            <button class="ctl" aria-label="Previous room" @click=${() => e.openRoom(a)}>‹ ${a.name}</button>
            <button class="ctl" aria-label="Next room" @click=${() => e.openRoom(o)}>${o.name} ›</button>
          </div>` : A}
    </section>
    <div class="room-grid ${p === A ? "" : "has-side"}">
      <div class="col lcol">
        <section class="glass card" style="gap:16px">
          <h2>Climate</h2>
          ${g ? D`<div class="metrics">
                <button class="metric" @click=${() => t.temperature && e.moreInfo(t.temperature)}>
                  <span class="lbl">${W("temperature", 16)}Temperature${ne(t.temperature)}</span>
                  <span class="big n" style="color:${e.hot.has(t.id) ? "var(--atlas-crit)" : "inherit"}">${s === void 0 ? "–" : `${s.toFixed(1)}°`}</span>
                  <span class="bar">${s === void 0 ? A : D`<span style="width:${Math.round(Math.max(.05, Math.min(1, (s - 10) / 30)) * 100)}%;background:${m}"></span>`}</span>
                </button>
                <button class="metric" @click=${() => t.humidity && e.moreInfo(t.humidity)}>
                  <span class="lbl">${W("humidity", 16)}Humidity${ne(t.humidity)}</span>
                  <span class="big n">${c === void 0 ? "–" : `${Math.round(c)} %`}</span>
                  <span class="bar">${c === void 0 ? A : D`<span style="width:${Math.round(Math.min(100, c))}%;background:${c < 25 ? "var(--atlas-warn)" : "#5EC8FF"}"></span>`}</span>
                </button>
              </div>` : D`<span class="t2" style="font-size:14px">No temperature sensor in this room yet.</span>`}
          ${Br(e, t)}
        </section>
        ${Tn(e, t)}
        ${Mn(e, t)}
        ${ii(e, t)}
        ${Vr(e, t)}
      </div>
      ${p === A ? A : D`<div class="col scol">${p}</div>`}
      <div class="col mcol">
        <section class="glass card devcard ${d ? "has-img" : ""} ${f ? `mood ${f.state}` : ""}" style="flex:1;padding:18px;${f?.vars ?? ""}">
          ${d ? D`<img class="devbg" src=${d} alt="" />${f ? D`<span class="devglow" aria-hidden="true"></span>` : A}<span class="devshade" aria-hidden="true"></span>` : A}
          <div class="row"><h2>Devices</h2><span class="n t2" style="font-size:12px">${u.length} device${u.length === 1 ? "" : "s"} · tap to toggle, hold for details</span></div>
          ${u.length ? D`<div class="devs">${u.map((t) => ri(e, t, f?.ids ?? []))}</div>` : D`<span class="t2" style="font-size:14px">No devices mapped to this room.</span>`}
        </section>
        ${yn(e, t)}
        ${On(e, t)}
        ${Hr(e, t)}
        ${zn(e, t.cards, "main")}
        ${r.length > 1 ? D`<section class="glass card" style="padding:14px 16px;gap:10px">
              <h2 style="font-size:14px;margin-left:4px">Other rooms on ${n?.name ?? "this floor"}</h2>
              <div class="sibs">
                ${r.filter((e) => e.id !== t.id).map((t) => {
		let n = B(e.hass, t.temperature);
		return D`<button class=${e.badges.has(t.id) ? "alert" : ""} @click=${() => e.openRoom(t)}>${W(t.icon, 18)}${t.name}${n === void 0 ? A : D` <span class="n" style="opacity:.7">${n.toFixed(1)}°</span>`}</button>`;
	})}
              </div>
            </section>` : A}
      </div>
    </div>
  `;
}, oi = 2, si = 3e3, X = (e, t) => {
	let n = V(e.hass, t);
	return n === void 0 ? void 0 : n * 1e3;
}, Z = (e) => e === void 0 ? "–" : Math.abs(e) >= 1e4 ? `${(e / 1e3).toFixed(2)} kW` : `${Math.round(e)} W`, Q = (e, t, n) => e === void 0 ? "–" : `${e.toFixed(t)}${n}`, ci = (e, t) => {
	let n = B(e.hass, t);
	if (n !== void 0) return Math.abs(n) <= 1 ? n * 100 : n;
}, li = (e, t) => !!R(e.hass, t.power) && !z(R(e.hass, t.power)), ui = (e, t, n) => {
	let r = e === void 0 ? 0 : Math.max(0, Math.min(1, e));
	return O`<svg class="ering" width=${t} height=${t} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(241,245,255,0.08)" stroke-width="7" stroke-linecap="round"
      pathLength="100" stroke-dasharray="75 100" transform="rotate(135 50 50)"></circle>
    ${r > 0 ? O`<circle cx="50" cy="50" r="42" fill="none" stroke=${n ? "var(--atlas-warn)" : "var(--atlas-accent)"} stroke-width="7" stroke-linecap="round"
          pathLength="100" stroke-dasharray=${`${(r * 75).toFixed(1)} 100`} transform="rotate(135 50 50)"></circle>` : A}
  </svg>`;
}, di = (e) => [
	"a",
	"b",
	"c"
].filter((t) => e[`power_${t}`] || e[`current_${t}`] || e[`voltage_${t}`]), fi = (e, t) => {
	let n = di(t);
	if (!n.length) return A;
	let r = [
		{
			key: "power",
			label: "W",
			fmt: (t) => Z(X(e, t))
		},
		{
			key: "current",
			label: "A",
			fmt: (t) => Q(B(e.hass, t), 2, " A")
		},
		{
			key: "voltage",
			label: "V",
			fmt: (t) => Q(B(e.hass, t), 0, " V")
		}
	].filter((e) => n.some((n) => t[`${e.key}_${n}`])), i = `grid-template-columns: 22px repeat(${r.length}, minmax(0, 1fr))`;
	return D`<div class="ephases" role="table" aria-label="${t.name} phases">
    ${n.map((n) => D`<div class="ph sm" role="row" style=${i}>
        <span class="phl" role="rowheader">${n.toUpperCase()}</span>
        ${r.map((r) => {
		let i = t[`${r.key}_${n}`];
		return D`<button class="n" role="cell" ?disabled=${!i} aria-label="Phase ${n.toUpperCase()} ${r.key}" @click=${() => i && e.moreInfo(i)}>${i ? r.fmt(i) : ""}</button>`;
	})}
      </div>`)}
  </div>`;
}, pi = (e, t, n) => li(e, t) ? n !== void 0 && Math.abs(n) >= oi ? {
	text: "Consuming",
	cls: "on"
} : {
	text: "Standby",
	cls: "idle"
} : {
	text: "Offline",
	cls: "off"
}, $ = (e, t, n) => D`<button class="estat" ?disabled=${!n} @click=${() => n?.()}><b class="n">${e}</b><span>${t}</span></button>`, mi = (e, t) => {
	let n = X(e, t.power), r = t.max_power || si, i = pi(e, t, n), a = di(t), o = (t) => t ? () => e.moreInfo(t) : void 0;
	return D`<section class="glass card emain">
    <div class="row"><h2>${W("energy", 20)}${t.name}</h2><span class="estatus ${i.cls}"><i></i>${i.text}</span></div>
    <div class="emain-body">
      <button class="egauge big" @click=${() => e.moreInfo(t.power)}>
        ${ui(n === void 0 ? void 0 : n / r, 168, n !== void 0 && n > r * .8)}
        <span class="ev"><b class="n">${Z(n)}</b><span>${i.text === "Offline" ? "no data" : "now"}</span></span>
      </button>
      ${a.length ? D`<div class="phases" role="table" aria-label="Phases">
            <div class="ph head" role="row"><span></span>${a.map((e) => D`<span role="columnheader">Phase ${e.toUpperCase()}</span>`)}</div>
            <div class="ph" role="row"><span class="t2">${W("energy", 16)}Power</span>${a.map((n) => D`<button class="n" @click=${() => o(t[`power_${n}`])?.()}>${Z(X(e, t[`power_${n}`]))}</button>`)}</div>
            <div class="ph" role="row"><span class="t2">${W("power", 16)}Current</span>${a.map((n) => D`<button class="n" @click=${() => o(t[`current_${n}`])?.()}>${Q(B(e.hass, t[`current_${n}`]), 2, " A")}</button>`)}</div>
            <div class="ph" role="row"><span class="t2">${W("grid", 16)}Voltage</span>${a.map((n) => D`<button class="n" @click=${() => o(t[`voltage_${n}`])?.()}>${Q(B(e.hass, t[`voltage_${n}`]), 1, " V")}</button>`)}</div>
          </div>` : A}
    </div>
    <div class="estats">
      ${t.energy ? $(Q(B(e.hass, t.energy), 1, " kWh"), "Total energy", o(t.energy)) : A}
      ${t.power_factor ? $(Q(ci(e, t.power_factor), 0, " %"), "Power factor", o(t.power_factor)) : A}
      ${t.current ? $(Q(B(e.hass, t.current), 2, " A"), "Current", o(t.current)) : A}
      ${t.frequency ? $(Q(B(e.hass, t.frequency), 2, " Hz"), "Frequency", o(t.frequency)) : A}
    </div>
  </section>`;
}, hi = (e, t, n) => {
	let r = t ? X(e, t.power) : void 0, i = n.map((t) => ({
		m: t,
		w: X(e, t.power)
	})).filter((e) => e.w !== void 0), a = i.reduce((e, t) => e + Math.max(0, t.w), 0), o = r === void 0 ? void 0 : r - a, s = [...i].filter((e) => e.w >= oi).sort((e, t) => t.w - e.w).slice(0, 4), c = Math.max(r ?? 0, s[0]?.w ?? 0, 1), l = n.length - i.length;
	return D`<section class="glass card esum">
    <h2>${W("info", 20)}Right now</h2>
    <div class="esum-figs">
      ${t ? D`<div><b class="n">${Z(r)}</b><span>Whole house</span></div>` : A}
      <div><b class="n">${Z(i.length ? a : void 0)}</b><span>Metered circuits</span></div>
      ${o === void 0 ? A : D`<div><b class="n">${Z(Math.max(0, o))}</b><span>Not metered</span></div>`}
    </div>
    <h3 class="t2">Top consumers</h3>
    ${s.length ? D`<div class="etop">${s.map((t) => D`<button @click=${() => e.moreInfo(t.m.power)}>
            <span class="lbl"><span>${t.m.name}</span><b class="n">${Z(t.w)}</b></span>
            <span class="bar"><span style="width:${Math.round(t.w / c * 100)}%"></span></span>
          </button>`)}</div>` : D`<span class="t2" style="font-size:13px">All circuits in standby.</span>`}
    ${l ? D`<span class="t2" style="font-size:12px;color:var(--atlas-warn)">${l} circuit${l > 1 ? "s" : ""} offline</span>` : A}
  </section>`;
}, gi = (e, t) => {
	let n = X(e, t.power), r = t.max_power || si, i = pi(e, t, n), a = (t) => t ? () => e.moreInfo(t) : void 0, o = [t.voltage ? Q(B(e.hass, t.voltage), 1, " V") : "", t.frequency ? Q(B(e.hass, t.frequency), 2, " Hz") : ""].filter(Boolean).join(" · ");
	return D`<div class="ecard ${i.cls}">
    <div class="row"><b class="ename">${t.name}</b><span class="estatus ${i.cls}"><i></i>${i.text}</span></div>
    <button class="egauge" aria-label="${t.name} power details" @click=${() => e.moreInfo(t.power)}>
      ${ui(n === void 0 ? void 0 : n / r, 116, n !== void 0 && n > r * .8)}
      <span class="ev"><b class="n">${Z(n)}</b></span>
    </button>
    <div class="estats sm">
      ${t.energy ? $(Q(B(e.hass, t.energy), 1, " kWh"), "Energy", a(t.energy)) : A}
      ${t.current ? $(Q(B(e.hass, t.current), 2, " A"), "Current", a(t.current)) : A}
      ${t.power_factor ? $(Q(ci(e, t.power_factor), 0, " %"), "PF", a(t.power_factor)) : A}
    </div>
    ${fi(e, t)}
    ${o ? D`<span class="n t2 eextra">${o}</span>` : A}
  </div>`;
}, _i = (e) => {
	let t = g(e.config), n = t.find((e) => e.main), r = t.filter((e) => e !== n), i = r.filter((t) => pi(e, t, X(e, t.power)).cls === "on").length;
	return D`
    <section class="hero" aria-label="Energy">
      <h1>Energy</h1>
      <p class="n">${r.length} circuit${r.length === 1 ? "" : "s"} metered <span style="opacity:.5">·</span> ${i} consuming now</p>
    </section>
    ${t.length ? D`<div class="energy-top">${n ? mi(e, n) : A}${hi(e, n, r)}</div>
          ${r.length ? D`<section class="glass card" style="gap:14px">
                <div class="row"><h2>Circuits</h2><span class="t2" style="font-size:12px">Tap a value for its history</span></div>
                <div class="egrid">${r.map((t) => gi(e, t))}</div>
              </section>` : A}` : D`<section class="glass card"><p class="empty">No energy meters configured. Add them in Edit dashboard > Energy.</p></section>`}
  `;
}, vi = [
	"brightness",
	"color_temp",
	"hs",
	"xy",
	"rgb",
	"rgbw",
	"rgbww",
	"white"
], yi = (e) => !!e && L(e.entity_id) === "light" && Array.isArray(e.attributes.supported_color_modes) && e.attributes.supported_color_modes.some((e) => vi.includes(e)), bi = (e) => {
	if (e?.state !== "on") return 0;
	let t = e.attributes.brightness;
	return typeof t == "number" ? Math.max(1, Math.round(t / 255 * 100)) : 100;
}, xi = (e) => e ? e.state === "unavailable" ? "Unavailable" : e.state === "unknown" ? "Unknown" : e.state === "on" ? yi(e) ? `On · ${bi(e)} %` : "On" : "Off" : "Not found", Si = (e, t) => {
	let n = () => e.hass.states[t];
	return Gr({
		start: () => bi(n()),
		canDrag: () => yi(n()) && !z(n()),
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
			if (!r || z(r)) return e.moreInfo(t);
			let i = L(t);
			e.call([
				"light",
				"switch",
				"input_boolean"
			].includes(i) ? i : "homeassistant", "toggle", { entity_id: t });
		},
		hold: () => e.moreInfo(t)
	});
}, Ci = (e, t, n) => {
	let r = e.hass.states[n], i = r?.state === "on", a = !r || r.state === "unavailable", o = yi(r), s = Si(e, n), c = (t.devices ?? []).find((e) => e.entity === n)?.name ?? ae(e.config, n) ?? String(r?.attributes.friendly_name ?? n);
	return D`<button class="ltile ${i ? "on" : ""} ${a ? "na" : ""} ${o ? "dim" : ""}" style="--pct:${bi(r)}%"
    title=${o ? `${c}: tap to toggle, drag to dim, hold for details` : `${c}: tap to toggle, hold for details`}
    @pointerdown=${s.down} @pointermove=${s.move} @pointerup=${s.up} @pointercancel=${s.cancel} @contextmenu=${s.context}
    @keydown=${(t) => {
		(t.key === "Enter" || t.key === " ") && (t.preventDefault(), e.call(L(n) === "light" ? "light" : "homeassistant", "toggle", { entity_id: n }));
	}}>
    <span class="lfill" aria-hidden="true"></span>
    <span class="lic">${G(L(n) === "light" ? "bulb" : "power", 20)}</span>
    <span class="ltxt"><b>${c}</b><span class="lstate">${xi(r)}</span><span class="lstate lprev"></span></span>
  </button>`;
}, wi = (e, t) => {
	let n = S(e.config, t), r = n.filter((t) => e.hass.states[t]?.state === "on");
	return D`<div class="lroom">
    <div class="row">
      <button class="lrname" @click=${() => e.openRoom(t)}><b>${t.name}</b><small class="t2">${r.length ? `${r.length} of ${n.length} on` : "All off"}</small></button>
      <button class="tog ${r.length ? "on" : ""}" role="switch" aria-checked=${r.length ? "true" : "false"} aria-label="${t.name} lights"
        @click=${() => e.call("homeassistant", r.length ? "turn_off" : "turn_on", { entity_id: r.length ? r : n })}><i></i></button>
    </div>
    <div class="ltiles">${n.map((n) => Ci(e, t, n))}</div>
  </div>`;
}, Ti = (e) => {
	let t = (t) => t.filter((t) => S(e.config, t).length), n = _(e.config).map((n) => ({
		title: `${n.name}${n.level ? ` · level ${n.level}` : ""}`,
		rooms: t(y(e.config, n.id))
	})).filter((e) => e.rooms.length), r = t(h(e.config).filter((t) => !t.floor || !re(e.config, t.floor)));
	r.length && n.push({
		title: "Other rooms",
		rooms: r
	});
	let i = [...new Set(n.flatMap((t) => t.rooms.flatMap((t) => S(e.config, t))))], a = i.filter((t) => e.hass.states[t]?.state === "on");
	return D`
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
    ${n.length ? n.map((t) => D`<section class="glass card lfloor"><h2>${t.title}</h2><div class="lrooms">${t.rooms.map((t) => wi(e, t))}</div></section>`) : D`<section class="glass card"><p class="empty">No room has lights yet. Add light devices to a room, or set its Light entities.</p></section>`}
  `;
}, Ei = (e) => h(e.config).some((t) => S(e.config, t).length), Di = {
	critical: "Critical",
	warning: "Warning",
	minor: "Minor"
}, Oi = [
	["Settings", "/config/system"],
	["Logs", "/config/logs"],
	["Repairs", "/config/repairs"],
	["Updates", "/config/updates"]
], ki = (e, t) => {
	let n = t ? Date.parse(t) : NaN;
	if (!Number.isFinite(n)) return "";
	let r = e.hass.locale?.language ?? e.hass.language ?? "en";
	return new Date(n).toLocaleString(r, {
		day: "2-digit",
		month: "short",
		hour: "2-digit",
		minute: "2-digit"
	});
}, Ai = (e, t) => `${e} ${t}${e === 1 ? "" : "s"}`, ji = (e) => D`<div class="inc ${e.severity}">
  <div class="incmain">
    <div class="inchead"><span class="itag ${e.severity}">${Di[e.severity]}</span><b>${e.title}</b>${e.count ? D`<span class="icount n">${e.count}×</span>` : A}</div>
    ${e.detail ? D`<p>${e.detail}</p>` : A}
    ${e.sources.length ? D`<small class="t2">Source: ${e.sources.join(", ")}</small>` : A}
  </div>
  ${e.recommendation ? D`<div class="increc"><small>Recommendation</small><p>${e.recommendation}</p></div>` : A}
</div>`, Mi = (e) => {
	let t = e.config.entities?.incidents;
	if (!t) return A;
	let n = Pt(R(e.hass, t)), r = n?.counts ?? {
		critical: 0,
		warning: 0,
		minor: 0
	}, i = r.critical + r.warning + r.minor, a = n ? r.critical ? "crit" : r.warning ? "warn" : i ? "info" : "ok" : "wait", o = n ? r.critical ? Ai(r.critical, "critical incident") : r.warning ? `${Ai(r.warning, "warning")} to check` : i ? Ai(r.minor, "minor issue") : "No incidents in the latest scan" : "No report yet", s = n ? i ? [
		r.critical && Ai(r.critical, "critical"),
		r.warning && Ai(r.warning, "warning"),
		r.minor && `${r.minor} minor`
	].filter(Boolean).join(" · ") : "Home Assistant and add-on logs look clean." : `Waiting for ${t} to report. The analyzer publishes it after its next run.`;
	return D`<section class="glass card report">
    <div class="row">
      <h2>${W("system", 20)}Log report</h2>
      <button class="t2 more" @click=${() => e.moreInfo(t)}>${n?.generated ? `Updated ${ki(e, n.generated)}` : "Details"} ${W("chevron", 14)}</button>
    </div>
    <div class="rbanner ${a}">
      <span class="rico">${a === "ok" ? G("shield", 22) : a === "wait" ? G("refresh", 22) : W("alert", 22)}</span>
      <span class="atxt"><b>${o}</b><small>${s}</small></span>
    </div>
    ${n ? D`<div class="rstats">
          ${[
		"critical",
		"warning",
		"minor"
	].map((e) => D`<div class="rstat ${e} ${r[e] ? "has" : ""}"><b class="n">${r[e]}</b><small>${Di[e]}</small></div>`)}
        </div>
        ${n.incidents.length ? D`<div class="incs">${n.incidents.map(ji)}</div>` : i ? D`<p class="t2" style="margin:0;font-size:12px">The sensor reports counts but no incident list.</p>` : A}` : A}
  </section>`;
}, Ni = (e) => {
	let t = Object.values(e.hass.states).filter((e) => L(e.entity_id) === "update");
	if (!t.length) return A;
	let n = t.filter((e) => e.state === "on"), r = (e) => String(e.attributes.title ?? e.attributes.friendly_name ?? e.entity_id), i = (e) => {
		let t = e.attributes;
		return t.in_progress ? "Installing" : !t.installed_version && !t.latest_version ? "Update available" : `${t.installed_version ?? "-"} → ${t.latest_version ?? "-"}`;
	};
	return D`<section class="glass card">
    <div class="row">
      <h2>${G("refresh", 20)}Updates</h2>
      <button class="t2 more" @click=${() => e.href("/config/updates")}>All updates ${W("chevron", 14)}</button>
    </div>
    ${n.length ? D`<div class="slist">
          ${n.map((t) => D`<div class="srow open"><button class="smain" @click=${() => e.moreInfo(t.entity_id)}>
              <span class="sic">${G("refresh", 18)}</span>
              <span class="atxt"><b>${r(t)}</b><small class="t2">${i(t)}</small></span>
            </button></div>`)}
        </div>` : D`<p class="t2" style="margin:0;font-size:13px">Everything is up to date.</p>`}
  </section>`;
}, Pi = (e) => {
	let t = ue(e.config).filter((t) => {
		let n = e.hass.states[t];
		return !n || n.state === "unavailable";
	});
	return D`<section class="glass card">
    <div class="row">
      <h2>${W("alert", 20)}Unavailable devices</h2>
      <span class="n t2" style="font-size:12px">${t.length ? `${t.length} of ${ue(e.config).length}` : "None"}</span>
    </div>
    ${t.length ? D`<div class="slist">
          ${t.map((t) => {
		let n = e.hass.states[t], r = x(e.config, t), i = ae(e.config, t) ?? String(n?.attributes.friendly_name ?? t);
		return D`<div class="srow na"><button class="smain" @click=${() => n ? e.moreInfo(t) : r ? e.openRoom(r) : void 0}>
              <span class="sic">${G(n ? "power" : "dot", 18)}</span>
              <span class="atxt"><b>${i}</b><small>${r ? `${r.name} · ` : ""}${n ? "Unavailable" : "Not found"} · ${t}</small></span>
            </button></div>`;
	})}
        </div>` : D`<p class="t2" style="margin:0;font-size:13px">Every entity in the dashboard config responds.</p>`}
  </section>`;
}, Fi = (e) => {
	let t = Pt(R(e.hass, e.config.entities?.incidents)), n = e.hass.config?.version, r = [n ? `Home Assistant ${n}` : "", e.config.entities?.incidents ? t ? `Log report: ${t.counts.critical} critical · ${Ai(t.counts.warning, "warning")} · ${t.counts.minor} minor` : "Log report: waiting" : ""].filter(Boolean);
	return D`
    <section class="hero" aria-label="System">
      <h1 class="sm">System</h1>
      ${r.length ? D`<p class="n">${r.join(" · ")}</p>` : A}
    </section>
    <div class="syslinks">
      ${Oi.map(([t, n]) => D`<button class="ctl" @click=${() => e.href(n)}>${t} ${W("chevron", 14)}</button>`)}
    </div>
    <div class="sys-grid">
      <div class="col">${Mi(e)}</div>
      <div class="col">${Ni(e)}${Pi(e)}</div>
    </div>
    ${zn(e, e.config.layout?.system_cards, "main")}
  `;
}, Ii, Li = {
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
}, Ri = "atlas-home.device", zi = () => {
	try {
		return JSON.parse(localStorage.getItem(Ri) ?? "{}");
	} catch {
		return {};
	}
}, Bi = (e) => {
	try {
		localStorage.setItem(Ri, JSON.stringify(e));
	} catch {}
}, Vi = (e) => [
	1,
	3,
	5
].map((t) => parseInt(e.slice(t, t + 2), 16)).join(","), Hi = {}, Ui = {}, Wi = class extends bt {
	constructor() {
		super(), this._fcSubs = /* @__PURE__ */ new Map(), this._onResize = () => this._side && this._fitSide(this._side), this._onMq = (e) => this._narrow = e.matches, this._call = async (e, t, n) => {
			try {
				await this.hass.callService(e, t, n);
			} catch (n) {
				f(this, "hass-notification", { message: `ATLAS: ${e}.${t} failed: ${n?.message ?? n}` });
			}
		}, this._settings = !1, this._prefs = zi(), this._narrow = !1, this._tick = 0;
	}
	setConfig(e) {
		if (!e?.atlas) throw Error("atlas-view is generated by the ATLAS Home dashboard strategy");
		this._config = e;
		let t = e.atlas;
		this._relevant = /* @__PURE__ */ new Set([
			...ue(t),
			...(t.alerts?.temperature_rules ?? []).map((e) => e.entity),
			...t.alerts?.exterior_doors ?? [],
			...t.alerts?.interior_doors ?? [],
			...t.alerts?.critical ?? [],
			...[t.alerts?.mailbox, t.alerts?.mailbox_ack].filter((e) => !!e),
			...t.entities?.exclude_lights ?? [],
			...t.entities?.persons ?? [],
			...t.alerts?.rain_windows ?? [],
			...[t.alerts?.rain_weather].filter((e) => !!e),
			...ne(t),
			...h(t).flatMap((e) => [
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
				...fn(e),
				...Nn(e)
			]).filter((e) => !!e)
		]), e.view === "room" && this._prepareCamera(b(v(t, e.room)));
		let n = this._floorCameras();
		n.mode === "live" && this._prepareCamera(n.cameras[0]);
	}
	_floorCameras() {
		let e = this._config;
		if (!e || e.view !== "rooms") return {
			mode: "off",
			cameras: []
		};
		let t = re(e.atlas, e.floor) ?? _(e.atlas)[0], n = t?.cameras ?? "off";
		return n === "off" ? {
			mode: n,
			cameras: []
		} : {
			mode: n,
			cameras: ie(e.atlas, t.id).map((e) => e.camera)
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
	_neededForecasts() {
		let e = this._config?.atlas;
		if (!e || !this.hass) return [];
		let t = [], n = e.entities?.weather;
		if (n && this._config.view === "home") {
			let e = Rt(this.hass.states[n]), r = Hi.wxType ?? e[0];
			r && e.includes(r) && t.push([n, r]);
		}
		let r = e.alerts?.rain_weather || n;
		return r && e.alerts?.rain_windows?.length && Lt(this.hass.states[r]).includes("hourly") && t.push([r, "hourly"]), t;
	}
	_syncForecasts() {
		let e = this.hass?.connection;
		if (!e || !this.isConnected) return;
		let t = new Map(this._neededForecasts().map(([e, t]) => [Ft(e, t), [e, t]]));
		for (let [e, n] of this._fcSubs) t.has(e) || (n.then((e) => e()).catch(() => void 0), this._fcSubs.delete(e));
		for (let [n, [r, i]] of t) {
			if (this._fcSubs.has(n)) continue;
			let t = e.subscribeMessage((e) => {
				Ui[n] = e.forecast ?? null, this.requestUpdate();
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
		this._syncForecasts(), this._watchSide();
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
			badges: Jt(e),
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
			ui: Hi,
			forecasts: Ui
		};
	}
	render() {
		if (!this._config || !this.hass) return A;
		let e = this._config.atlas, t = e.appearance ?? {}, n = this._prefs.variant ?? t.variant ?? "warm_glass", r = this._prefs.accent && /^#[0-9a-fA-F]{6}$/.test(this._prefs.accent) ? this._prefs.accent : le(e), i = Li[t.ambience ?? "graphite"] ?? Li.graphite, a = Vi(r), o = `--atlas-accent:${r};--atlas-accent-soft:rgba(${a},0.16);--atlas-accent-glow:rgba(${a},0.45);--atlas-tile:${i.tile}`;
		if (!h(e).length) return D`<div class="root v-quiet" style=${o}><div class="frame"><div class="main">
        <section class="glass card" style="max-width:640px;margin:10vh auto;gap:14px">
          <h2 style="font-size:24px">${W("home", 28)}ATLAS Home</h2>
          <p class="t2">No rooms configured yet. Open the dashboard menu, choose <b>Edit dashboard</b>, then <b>Load demo house</b> or paste your own config in YAML mode, and save.</p>
        </section></div></div></div>`;
		let s = qt(this.hass, e, Ui), c = this._ctx(s), l = this._config.view, u = l === "room" ? v(e, this._config.room) : void 0, d = n === "warm_glass" ? ce(e, u) ?? ce(e, v(e, t.background) ?? h(e)[0]) : void 0, f;
		return f = l === "home" ? Ar(c) : l === "alerts" ? Mr(c) : l === "rooms" ? Fr(c) : l === "energy" ? _i(c) : l === "lights" ? Ti(c) : l === "security" ? yr(c) : l === "system" ? Fi(c) : ai(c), D`<div class="root v-${n}" style=${o}>
      ${this._background(n, i, d)}
      <div class="frame">
        ${this._sidebar(c)}
        <div class="main ${this._fitPage() ? "fit" : ""}">
          ${this._topbar(c)}
          ${f}
        </div>
      </div>
      ${this._bottomNav(c)}
      ${this._settings ? this._settingsPanel(n, r) : A}
      ${this._confirm ? this._confirmDialog() : A}
    </div>`;
	}
	_background(e, t, n) {
		if (e === "quiet") return D`<div class="bg" style="background:var(--atlas-canvas)"></div>`;
		let r = (e, t, n, r, i, a) => D`<div class="blob" style="left:${e}%;top:${t}%;width:${n}px;height:${r}px;background:${i};filter:blur(${a}px)"></div>`;
		return D`<div class="bg" aria-hidden="true" style="background:linear-gradient(180deg,${t.base[0]} 0%,${t.base[1]} 60%,${t.base[2]} 100%)">
      ${r(4, 2, 520, 380, t.g[0], 90)}${r(62, -6, 640, 420, t.g[1], 100)}${r(78, 40, 300, 300, t.g[2], 70)}${r(30, 55, 700, 360, t.g[3], 80)}
      ${r(12, 18, 60, 60, t.light, 14)}${r(52, 10, 46, 46, t.light, 12)}${r(88, 22, 70, 70, t.light, 16)}${r(70, 78, 50, 50, t.light, 14)}
      ${n ? D`<img class="photo" src=${n} alt="" /><div class="tint" style="background:linear-gradient(180deg,rgba(${t.dark},0.35) 0%,rgba(${t.dark},0.6) 100%)"></div>` : A}
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
			...Ei(e) ? [[
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
			[
				"Climate",
				"climate",
				!1,
				() => n.heat_pump ? e.moreInfo(n.heat_pump) : void 0
			],
			[
				"Security",
				"security",
				t === "security",
				() => fe(e.config) ? e.go("security") : n.alarm ? e.moreInfo(n.alarm) : void 0
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
		return D`<aside class="glass">
      <button class="logo" @click=${() => e.go("home")}>${W("home", 34)}<span class="lt"><b>ATLAS</b><small>Smart Home</small></span></button>
      <nav class="nav" aria-label="Main">
        ${i.map(([e, t, n, r]) => D`<button class=${n ? "on" : ""} aria-current=${n ? "page" : "false"} title=${e} @click=${r}>${W(t, 20)}<span class="lbl">${e}</span></button>`)}
      </nav>
      ${a ? D`<div class="user"><span class="avatar">${a.charAt(0).toUpperCase()}</span><span class="lbl">${a}</span></div>` : A}
    </aside>`;
	}
	_topbar(e) {
		let t = this._config.view, n = e.config.entities ?? {}, r = [
			[
				"Home",
				"home",
				t === "home" || t === "alerts"
			],
			...(e.config.layout?.top_tabs ?? []).map((t) => v(e.config, t)).filter((e) => !!e).map((e) => [
				e.name,
				`room-${e.id}`,
				t === "room" && this._config.room === e.id
			]),
			[
				"All rooms",
				"rooms",
				t === "rooms"
			]
		], i = R(this.hass, n.weather), a = B(this.hass, n.outdoor_temperature) ?? (z(i) ? void 0 : Number(i.attributes.temperature)), o = /* @__PURE__ */ new Date(), s = this.hass.locale?.language ?? this.hass.language ?? "en", c = o.toLocaleDateString(s, {
			weekday: "short",
			day: "numeric",
			month: "short"
		}), l = o.toLocaleTimeString(s, {
			hour: "2-digit",
			minute: "2-digit",
			hour12: !1
		});
		return D`<header class="glass top">
      <span class="mlogo">${W("home", 24)}<b>ATLAS</b></span>
      <div class="tabs" role="tablist" aria-label="Views">
        ${r.map(([t, n, r]) => D`<button role="tab" aria-selected=${r ? "true" : "false"} class=${r ? "on" : ""} @click=${() => e.go(n)}>${t}</button>`)}
      </div>
      <div class="tools">
        ${n.weather || n.outdoor_temperature ? D`<button class="weather" @click=${() => n.weather && e.moreInfo(n.weather)}>
              ${an(z(i) ? void 0 : i.state)}
              <span><span class="n" style="font-size:15px;font-weight:600">${a !== void 0 && Number.isFinite(a) ? `${a.toFixed(1)} °C` : "–"}</span>
              <span class="t2 wtxt" style="font-size:11px">${i && !z(i) ? H(this.hass, i) : "Weather unavailable"} · ${c}</span></span>
            </button>` : A}
        <span class="clock n">${l}</span>
        <button class="iconbtn" aria-label="Display settings" @click=${() => this._settings = !this._settings}>${W("settings", 22)}</button>
      </div>
    </header>`;
	}
	_energyNav(e) {
		return () => g(e.config).length ? e.go("energy") : e.href("/energy");
	}
	_bottomNav(e) {
		let t = this._config.view, n = e.config.entities ?? {}, r = this._energyNav(e);
		return D`<nav class="glass bnav" aria-label="Main">
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
			...Ei(e) ? [[
				"Lights",
				"light",
				t === "lights",
				() => e.go("lights")
			]] : [[
				"Climate",
				"climate",
				!1,
				() => n.heat_pump ? e.moreInfo(n.heat_pump) : void 0
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
		].map(([e, t, n, r]) => D`<button class=${n ? "on" : ""} @click=${r}>${W(t, 22)}${e}</button>`)}
    </nav>`;
	}
	_settingsPanel(e, t) {
		let n = (e) => {
			this._prefs = {
				...this._prefs,
				...e
			}, Bi(this._prefs);
		};
		return D`<div class="settings" role="dialog" aria-label="Display settings">
      <div class="row"><b>Display on this device</b><button class="iconbtn" aria-label="Close" @click=${() => this._settings = !1}>✕</button></div>
      <span class="t2" style="font-size:12px">Style</span>
      <div class="seg">${[
			["warm_glass", "Warm glass"],
			["glass", "Glass"],
			["quiet", "Quiet"]
		].map(([t, r]) => D`<button class=${e === t ? "on" : ""} @click=${() => n({ variant: t })}>${r}</button>`)}</div>
      <span class="t2" style="font-size:12px">Accent</span>
      <div class="seg">${o.map((e) => D`<button class="sw ${t === e ? "on" : ""}" style="background:${e}" aria-label="Accent ${e}" @click=${() => n({ accent: e })}></button>`)}</div>
      <button class="ctl" @click=${() => {
			this._prefs = {}, Bi({});
		}}>Use dashboard defaults</button>
      <span class="t2" style="font-size:11px">Stored in this browser only. Defaults and all entities are set in Edit dashboard.</span>
    </div>`;
	}
	_confirmDialog() {
		let e = this._confirm, t = () => this._confirm = void 0;
		return D`<div class="scrim" @click=${t}>
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
Ii = Wi, Ii.styles = Yt, Ii.properties = {
	hass: { attribute: !1 },
	_config: { state: !0 },
	_confirm: { state: !0 },
	_settings: { state: !0 },
	_prefs: { state: !0 },
	_narrow: { state: !0 },
	_tick: { state: !0 }
};
// src/ui/embedded-card.ts
var Gi = class extends HTMLElement {
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
};
m(t, ge), m(n, Ot), m(r, Wi), m("atlas-hui-card", Gi);
var Ki = window;
Ki.customStrategies = Ki.customStrategies || [], Ki.customStrategies.some((e) => e.type === "atlas-home") || Ki.customStrategies.push({
	type: e,
	strategyType: "dashboard",
	name: "ATLAS Home",
	description: "Attention-first house dashboard with rooms, alerts and cameras.",
	documentationURL: "https://github.com/robman2026/AttlasDashboard"
}), console.info(`%c ATLAS HOME %c ${i} `, "background:#56E7C0;color:#14171C;font-weight:700", "background:#252A30;color:#F1F5FF");
