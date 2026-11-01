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
})), ee = (e, t) => f(e, "hass-more-info", { entityId: t }), p = (e, t) => {
	customElements.get(e) || customElements.define(e, t);
}, m = (e) => e.rooms ?? [], h = (e) => (e.energy_meters ?? []).filter((e) => e?.power), te = [
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
], ne = (e) => h(e).flatMap((e) => te.map((t) => e[t]).filter((e) => !!e)), g = (e) => e.floors ?? [], _ = (e, t) => m(e).find((e) => e.id === t), re = (e, t) => g(e).find((e) => e.id === t), v = (e, t) => m(e).filter((e) => e.floor === t), y = (e) => e && e.show_camera !== !1 && e.camera || void 0, b = (e, t) => m(e).find((e) => e.temperature === t || e.humidity === t || y(e) === t || (e.devices ?? []).some((e) => e.entity === t)), ie = (e, t) => {
	for (let n of m(e)) {
		let e = (n.devices ?? []).find((e) => e.entity === t);
		if (e?.name) return e.name;
	}
}, ae = (e, t) => {
	if (!t?.image) return;
	if (/^(https?:)?\/\//.test(t.image) || t.image.startsWith("/")) return t.image;
	let n = e.appearance?.image_path || s;
	return n.endsWith("/") || (n += "/"), n + t.image;
}, oe = (e) => {
	let t = e.appearance?.accent ?? "";
	return /^#[0-9a-fA-F]{6}$/.test(t) ? t : a;
}, se = (e) => {
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
	for (let t of m(e)) n(t.temperature), n(t.humidity), n(y(t)), (t.devices ?? []).forEach((e) => n(e.entity));
	return [...t];
}, ce = (e) => {
	let t = new Set(e.entities?.exclude_lights ?? []), n = [];
	for (let r of m(e)) for (let e of r.devices ?? []) e.entity.startsWith("light.") && !t.has(e.entity) && n.push(e.entity);
	return n;
}, le, x = (e, t, n = {}) => ({
	type: `custom:${r}`,
	view: t,
	...n,
	atlas: e
}), ue = class extends HTMLElement {
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
		let t = g(e)[0]?.id, n = {
			subview: !0,
			back_path: "home"
		}, r = [
			{
				title: "Home",
				path: "home",
				icon: "mdi:home-variant-outline",
				type: "panel",
				cards: [x(e, "home")]
			},
			{
				title: "Alerts",
				path: "alerts",
				type: "panel",
				...n,
				cards: [x(e, "alerts")]
			},
			{
				title: "Rooms",
				path: "rooms",
				type: "panel",
				...n,
				cards: [x(e, "rooms", { floor: t })]
			}
		];
		h(e).length && r.push({
			title: "Energy",
			path: "energy",
			type: "panel",
			...n,
			cards: [x(e, "energy")]
		});
		for (let t of g(e)) r.push({
			title: t.name,
			path: `floor-${t.id}`,
			type: "panel",
			...n,
			cards: [x(e, "rooms", { floor: t.id })]
		});
		for (let t of m(e)) r.push({
			title: t.name,
			path: `room-${t.id}`,
			type: "panel",
			...n,
			cards: [x(e, "room", { room: t.id })]
		});
		return {
			title: "ATLAS Home",
			views: r
		};
	}
};
le = ue, le.registryDependencies = [], le.configRequired = !0;
// node_modules/@lit/reactive-element/css-tag.js
var de = globalThis, fe = de.ShadowRoot && (de.ShadyCSS === void 0 || de.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, pe = Symbol(), me = /* @__PURE__ */ new WeakMap(), he = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== pe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (fe && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = me.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && me.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, ge = (e) => new he(typeof e == "string" ? e : e + "", void 0, pe), _e = (e, ...t) => new he(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, pe), ve = (e, t) => {
	if (fe) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), r = de.litNonce;
		r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
	}
}, ye = fe ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return ge(t);
})(e) : e, { is: be, defineProperty: xe, getOwnPropertyDescriptor: Se, getOwnPropertyNames: Ce, getOwnPropertySymbols: we, getPrototypeOf: Te } = Object, Ee = globalThis, De = Ee.trustedTypes, Oe = De ? De.emptyScript : "", ke = Ee.reactiveElementPolyfillSupport, S = (e, t) => e, Ae = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? Oe : null;
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
}, je = (e, t) => !be(e, t), Me = {
	attribute: !0,
	type: String,
	converter: Ae,
	reflect: !1,
	useDefault: !1,
	hasChanged: je
};
Symbol.metadata ??= Symbol("metadata"), Ee.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var C = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = Me) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && xe(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = Se(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? Me;
	}
	static _$Ei() {
		if (this.hasOwnProperty(S("elementProperties"))) return;
		let e = Te(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(S("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(S("properties"))) {
			let e = this.properties, t = [...Ce(e), ...we(e)];
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
			for (let e of n) t.unshift(ye(e));
		} else e !== void 0 && t.push(ye(e));
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
		return ve(e, this.constructor.elementStyles), e;
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
			let i = (n.converter?.toAttribute === void 0 ? Ae : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? Ae : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? je)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[S("elementProperties")] = /* @__PURE__ */ new Map(), C[S("finalized")] = /* @__PURE__ */ new Map(), ke?.({ ReactiveElement: C }), (Ee.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var Ne = globalThis, Pe = (e) => e, Fe = Ne.trustedTypes, Ie = Fe ? Fe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Le = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, Re = "?" + w, ze = `<${Re}>`, T = document, E = () => T.createComment(""), D = (e) => e === null || typeof e != "object" && typeof e != "function", Be = Array.isArray, Ve = (e) => Be(e) || typeof e?.[Symbol.iterator] == "function", He = "[ 	\n\f\r]", O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ue = /-->/g, We = />/g, k = RegExp(`>|${He}(?:([^\\s"'>=/]+)(${He}*=${He}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), Ge = /'/g, Ke = /"/g, qe = /^(?:script|style|textarea|title)$/i, Je = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), A = Je(1), j = Je(2), M = Symbol.for("lit-noChange"), N = Symbol.for("lit-nothing"), Ye = /* @__PURE__ */ new WeakMap(), P = T.createTreeWalker(T, 129);
function Xe(e, t) {
	if (!Be(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return Ie === void 0 ? t : Ie.createHTML(t);
}
var Ze = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = O;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === O ? c[1] === "!--" ? o = Ue : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = k) : (qe.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = k) : o = We : o === k ? c[0] === ">" ? (o = i ?? O, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? k : c[3] === "\"" ? Ke : Ge) : o === Ke || o === Ge ? o = k : o === Ue || o === We ? o = O : (o = k, i = void 0);
		let d = o === k && e[t + 1].startsWith("/>") ? " " : "";
		a += o === O ? n + ze : l >= 0 ? (r.push(s), n.slice(0, l) + Le + n.slice(l) + w + d) : n + w + (l === -2 ? t : d);
	}
	return [Xe(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Qe = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ze(t, n);
		if (this.el = e.createElement(l, r), P.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = P.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(Le)) {
					let t = u[o++], n = i.getAttribute(e).split(w), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? nt : r[1] === "?" ? rt : r[1] === "@" ? it : tt
					}), i.removeAttribute(e);
				} else e.startsWith(w) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (qe.test(i.tagName)) {
					let e = i.textContent.split(w), t = e.length - 1;
					if (t > 0) {
						i.textContent = Fe ? Fe.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], E()), P.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], E());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === Re) c.push({
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
function F(e, t, n = e, r) {
	if (t === M) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = D(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = F(e, i._$AS(e, t.values), i, r)), t;
}
var $e = class {
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
		P.currentNode = r;
		let i = P.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new et(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new at(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = P.nextNode(), a++);
		}
		return P.currentNode = T, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, et = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = N, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = F(this, e, t), D(e) ? e === N || e == null || e === "" ? (this._$AH !== N && this._$AR(), this._$AH = N) : e !== this._$AH && e !== M && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? Ve(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== N && D(this._$AH) ? this._$AA.nextSibling.data = e : this.T(T.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Qe.createElement(Xe(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new $e(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Ye.get(e.strings);
		return t === void 0 && Ye.set(e.strings, t = new Qe(e)), t;
	}
	k(t) {
		Be(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(E()), this.O(E()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = Pe(e).nextSibling;
			Pe(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, tt = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = N, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = N;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = F(this, e, t, 0), a = !D(e) || e !== this._$AH && e !== M, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = F(this, r[n + o], t, o), s === M && (s = this._$AH[o]), a ||= !D(s) || s !== this._$AH[o], s === N ? e = N : e !== N && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === N ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, nt = class extends tt {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === N ? void 0 : e;
	}
}, rt = class extends tt {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== N);
	}
}, it = class extends tt {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = F(this, e, t, 0) ?? N) === M) return;
		let n = this._$AH, r = e === N && n !== N || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== N && (n === N || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, at = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		F(this, e);
	}
}, ot = Ne.litHtmlPolyfillSupport;
ot?.(Qe, et), (Ne.litHtmlVersions ??= []).push("3.3.3");
var st = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new et(t.insertBefore(E(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, ct = globalThis, I = class extends C {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = st(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return M;
	}
};
I._$litElement$ = !0, I.finalized = !0, ct.litElementHydrateSupport?.({ LitElement: I });
var lt = ct.litElementPolyfillSupport;
lt?.({ LitElement: I }), (ct.litElementVersions ??= []).push("4.2.2");
// src/config/preset-demo.ts
var ut = {
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
		updates: !0,
		data_quality: !0
	},
	floors: [
		{
			id: "attic",
			level: "+2",
			name: "Attic"
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
			devices: [
				{
					entity: "binary_sensor.garden_door",
					name: "Garden door"
				},
				{
					entity: "switch.garden_irrigation",
					name: "Irrigation valve"
				},
				{
					entity: "sensor.lawn_mower_status",
					name: "Lawn mower"
				}
			]
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
			devices: []
		},
		{
			id: "workshop",
			name: "Workshop",
			floor: "basement",
			icon: "settings",
			camera: "camera.workshop",
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
		security_tiles: ["entrance", "garage"]
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
}, L = (e, t = !1) => ({ entity: {
	...e ? { domain: e } : {},
	...t ? { multiple: !0 } : {}
} }), R = { text: {} }, z = { boolean: {} }, B = (e, t = {}) => ({ select: {
	mode: "dropdown",
	options: e,
	...t
} }), dt = (e) => Array.isArray(e) ? e.join(", ") : e, ft = [
	{
		name: "entity",
		label: "Entity",
		type: "entity (any)",
		required: !0,
		selector: L()
	},
	{
		name: "name",
		label: "Name",
		type: "text",
		help: "Label on the tile. Default: the entity's friendly name.",
		selector: R
	},
	{
		name: "icon",
		label: "Icon override",
		type: "mdi icon",
		help: "Optional, e.g. mdi:lamp. Default: chosen from the entity's domain and device class.",
		selector: { icon: {} }
	}
], pt = [
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
				selector: B([
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
				selector: B([
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
				selector: B("$rooms")
			},
			{
				name: "time_display",
				label: "Time shown on device tiles",
				type: "changed | updated | off",
				default: "changed",
				help: "changed: time since the state last changed (HA last_changed). updated: time since the entity last reported anything (HA last_updated). off: hide.",
				selector: B([
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
				name: "image_path",
				label: "Room image base URL",
				type: "URL",
				default: "rooms/ next to atlas-home.js",
				help: "Where room images are loaded from. Example for own photos: /local/atlas/rooms/",
				selector: R
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
				type: `entity (${dt("alarm_control_panel")})`,
				help: "Greeting line, Security card, Arm away quick action.",
				selector: L("alarm_control_panel")
			},
			{
				name: "weather",
				label: "Weather",
				type: "entity (weather)",
				help: "Top bar condition and icon.",
				selector: L("weather")
			},
			{
				name: "outdoor_temperature",
				label: "Outdoor temperature",
				type: "entity (sensor)",
				help: "Top bar temperature. Falls back to the weather entity's temperature.",
				selector: L("sensor")
			},
			{
				name: "heat_pump",
				label: "Heat pump (climate)",
				type: "entity (climate)",
				help: "Greeting indoor reading and Climate card ring (current and target).",
				selector: L("climate"),
				group: "Heat pump"
			},
			{
				name: "heat_pump_outdoor",
				label: "Heat pump outdoor sensor",
				type: "entity (sensor)",
				selector: L("sensor"),
				group: "Heat pump"
			},
			{
				name: "heat_pump_supply",
				label: "Heat pump supply line",
				type: "entity (sensor)",
				selector: L("sensor"),
				group: "Heat pump"
			},
			{
				name: "heat_pump_return",
				label: "Heat pump return line",
				type: "entity (sensor)",
				selector: L("sensor"),
				group: "Heat pump"
			},
			{
				name: "solar_power",
				label: "Solar power",
				type: "entity (sensor, W or kW)",
				selector: L("sensor"),
				group: "Energy"
			},
			{
				name: "house_load",
				label: "House load",
				type: "entity (sensor, W or kW)",
				help: "Total house consumption.",
				selector: L("sensor"),
				group: "Energy"
			},
			{
				name: "grid_import",
				label: "Grid import",
				type: "entity (sensor, W or kW)",
				selector: L("sensor"),
				group: "Energy"
			},
			{
				name: "grid_export",
				label: "Grid export",
				type: "entity (sensor, W or kW)",
				help: "When export is larger than import the arrow points to the grid.",
				selector: L("sensor"),
				group: "Energy"
			},
			{
				name: "garage_cover",
				label: "Garage door (cover)",
				type: "entity (cover)",
				help: "Garage quick action (open or close, always confirmed).",
				selector: L("cover"),
				group: "Quick actions and system"
			},
			{
				name: "wake_pc",
				label: "Wake PC",
				type: "entity (input_button, button, script)",
				help: "Wake PC quick action (press, or script.turn_on).",
				selector: L([
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
				help: "Optional log analysis sensor with attributes critical, warning, minor (numbers or lists) and summary.",
				selector: L("sensor"),
				group: "Quick actions and system"
			},
			{
				name: "persons",
				label: "Persons",
				type: "list of entity (person)",
				help: "Reserved for presence display (not shown yet).",
				selector: L("person", !0),
				group: "Quick actions and system"
			},
			{
				name: "exclude_lights",
				label: "Lights never counted as room lights",
				type: "list of entity (light)",
				help: "Camera status LEDs etc. Excluded from Lights off.",
				selector: L("light", !0),
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
						selector: R
					},
					{
						name: "entity",
						label: "Temperature sensor",
						type: "entity (sensor)",
						required: !0,
						selector: L("sensor")
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
				selector: L(["binary_sensor", "cover"], !0)
			},
			{
				name: "interior_doors",
				label: "Interior doors (info when open)",
				type: "list of entity (binary_sensor, cover)",
				selector: L(["binary_sensor", "cover"], !0)
			},
			{
				name: "critical",
				label: "Critical detectors (leak, smoke)",
				type: "list of entity (binary_sensor)",
				help: "Critical when on. Warning when the detector itself is unavailable.",
				selector: L("binary_sensor", !0)
			},
			{
				name: "mailbox",
				label: "Mailbox contact",
				type: "entity (binary_sensor)",
				help: "Info while open (or while the acknowledge helper is on).",
				selector: L("binary_sensor")
			},
			{
				name: "mailbox_ack",
				label: "Mailbox acknowledge helper",
				type: "entity (input_boolean)",
				help: "Optional. If set, the alert stays until this helper is turned off (Acknowledge button). An automation must turn it on when the mailbox opens.",
				selector: L("input_boolean")
			},
			{
				name: "updates",
				label: "Show available updates (info)",
				type: "boolean",
				default: "true",
				selector: z
			},
			{
				name: "data_quality",
				label: "Warn about unavailable mapped devices",
				type: "boolean",
				default: "true",
				selector: z
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
				selector: R
			},
			{
				name: "name",
				label: "Name",
				type: "text",
				required: !0,
				selector: R
			},
			{
				name: "level",
				label: "Level",
				type: "text",
				help: "Shown on the floor card, e.g. +1, 0, -1.",
				selector: R
			},
			{
				name: "cameras",
				label: "Camera wall",
				type: "off | live | stills",
				default: "off",
				help: "Shows the cameras of all rooms on this floor side by side on its Rooms page (stacked on the phone). live: muted live streams. stills: snapshots refreshed every 10 s (lighter on the tablet). Rooms with the camera section off are skipped; private cameras stay hidden.",
				selector: B([
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
				selector: R,
				group: "_grid"
			},
			{
				name: "name",
				label: "Name",
				type: "text",
				required: !0,
				selector: R,
				group: "_grid"
			},
			{
				name: "floor",
				label: "Floor",
				type: "floor id",
				selector: B("$floors"),
				group: "_grid"
			},
			{
				name: "icon",
				label: "Icon",
				type: "ATLAS icon key",
				help: "One of the shipped line icons, e.g. office, living, server.",
				selector: B("$icons"),
				group: "_grid"
			},
			{
				name: "image",
				label: "Image",
				type: "file name or URL",
				help: "File under the image base URL (e.g. office.jpg, backup/shelter.jpg) or a full URL. Empty: no photo.",
				selector: R
			},
			{
				name: "temperature",
				label: "Temperature sensor",
				type: "entity (sensor)",
				selector: L("sensor")
			},
			{
				name: "humidity",
				label: "Humidity sensor",
				type: "entity (sensor)",
				selector: L("sensor")
			},
			{
				name: "show_camera",
				label: "Show camera section",
				type: "boolean",
				default: "true",
				help: "Off: the room has no camera section at all (no Camera card, no stream, not counted as unavailable), even if a camera entity is set. On without a camera entity: a compact \"No camera\" card.",
				selector: z,
				group: "Camera"
			},
			{
				name: "camera",
				label: "Camera (live stream)",
				type: "entity (camera)",
				help: "Enables the camera slot (16:9) with Live, Snapshot, Recordings.",
				selector: L("camera"),
				group: "Camera"
			},
			{
				name: "camera_hq",
				label: "Camera high quality stream",
				type: "entity (camera)",
				help: "Optional, reserved for a quality switch.",
				selector: L("camera"),
				group: "Camera"
			},
			{
				name: "camera_snapshot",
				label: "Snapshot camera",
				type: "entity (camera)",
				help: "Optional. Snapshot uses this entity's picture, else the live camera's.",
				selector: L("camera"),
				group: "Camera"
			},
			{
				name: "camera_private",
				label: "Private camera",
				type: "boolean",
				default: "false",
				help: "Stream hidden until the user taps Reveal. Off: the live stream starts (muted) as soon as the room opens.",
				selector: z,
				group: "Camera"
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
				help: "Device tiles. Tap toggles light, switch, fan, input_boolean; other domains and long press open more-info.",
				selector: { object: {} },
				fields: ft
			}
		]
	},
	{
		key: "layout",
		tab: "Layout",
		title: "Layout (`layout`)",
		intro: "Which rooms appear where. Lists of room ids, in order.",
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
				selector: R
			},
			{
				name: "power",
				label: "Power sensor",
				type: "entity (sensor, W or kW)",
				required: !0,
				selector: L("sensor")
			},
			{
				name: "main",
				label: "Main meter",
				type: "boolean",
				default: "false",
				help: "Shown large at the top with phases. Use for the whole-house meter.",
				selector: z
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
				selector: L("sensor")
			},
			{
				name: "current",
				label: "Current sensor",
				type: "entity (sensor, A)",
				selector: L("sensor")
			},
			{
				name: "power_factor",
				label: "Power factor sensor",
				type: "entity (sensor)",
				help: "Percent (0-100) or 0-1; shown as %.",
				selector: L("sensor")
			},
			{
				name: "voltage",
				label: "Voltage sensor",
				type: "entity (sensor, V)",
				selector: L("sensor")
			},
			{
				name: "frequency",
				label: "Frequency sensor",
				type: "entity (sensor, Hz)",
				selector: L("sensor")
			},
			{
				name: "power_a",
				label: "Phase A power",
				type: "entity (sensor)",
				help: "Phase sensors are optional; with any of them set the meter shows a phase table.",
				selector: L("sensor")
			},
			{
				name: "power_b",
				label: "Phase B power",
				type: "entity (sensor)",
				selector: L("sensor")
			},
			{
				name: "power_c",
				label: "Phase C power",
				type: "entity (sensor)",
				selector: L("sensor")
			},
			{
				name: "current_a",
				label: "Phase A current",
				type: "entity (sensor)",
				selector: L("sensor")
			},
			{
				name: "current_b",
				label: "Phase B current",
				type: "entity (sensor)",
				selector: L("sensor")
			},
			{
				name: "current_c",
				label: "Phase C current",
				type: "entity (sensor)",
				selector: L("sensor")
			},
			{
				name: "voltage_a",
				label: "Phase A voltage",
				type: "entity (sensor)",
				selector: L("sensor")
			},
			{
				name: "voltage_b",
				label: "Phase B voltage",
				type: "entity (sensor)",
				selector: L("sensor")
			},
			{
				name: "voltage_c",
				label: "Phase C voltage",
				type: "entity (sensor)",
				selector: L("sensor")
			}
		]
	}
], mt, ht = class extends I {
	constructor() {
		super(), this._fieldIndex = new Map(pt.flatMap((e) => e.fields.map((e) => [e.name, e]))), this._label = (e) => this._fieldIndex.get(e.name)?.label ?? e.name, this._helper = (e) => this._fieldIndex.get(e.name)?.help, this._tab = "appearance", this._room = 0, this._formReady = !!customElements.get("ha-form");
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
			...structuredClone(ut)
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
			}))
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
		return A`<ha-form
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
		if (!this._config || !this.hass) return N;
		if (!this._formReady) return A`<p>Loading editor...</p>`;
		let e = !(this._config.rooms ?? []).length, t = pt.find((e) => e.key === this._tab) ?? pt[0];
		return A`
      ${e ? A`<div class="preset">
            <p>This dashboard has no rooms yet. Load the demo house as a starting point and replace its entities with yours, or paste your own config in YAML mode.</p>
            <button @click=${this._loadPreset}>Load demo house</button>
          </div>` : N}
      <nav>
        ${pt.map((e) => A`<button class=${e.key === t.key ? "on" : ""} @click=${() => this._tab = e.key}>${e.tab}</button>`)}
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
		return A`
      <div class="rooms-bar">
        <select @change=${(e) => this._room = Number(e.target.value)}>
          ${t.map((e, t) => A`<option value=${t} ?selected=${t === n}>${e.name} (${e.id})</option>`)}
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
      ${r ? this._form(r, this._schema(e.fields), (e) => i(t.map((t, r) => r === n ? e : t))) : A`<p>No rooms.</p>`}
    `;
	}
};
mt = ht, mt.properties = {
	hass: { attribute: !1 },
	_config: { state: !0 },
	_tab: { state: !0 },
	_room: { state: !0 },
	_formReady: { state: !0 }
}, mt.styles = _e`
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
var V = (e) => e.split(".")[0], H = (e, t) => t && e ? e.states[t] : void 0, U = (e) => !e || e.state === "unavailable" || e.state === "unknown", W = (e, t) => {
	let n = H(e, t);
	if (U(n)) return;
	let r = Number(n.state);
	return Number.isFinite(r) ? r : void 0;
}, G = (e, t) => {
	let n = W(e, t);
	if (n === void 0) return;
	let r = String(H(e, t)?.attributes.unit_of_measurement ?? "kW");
	return r === "W" ? n / 1e3 : r === "MW" ? n * 1e3 : n;
}, gt = (e, t) => String(H(e, t)?.attributes.friendly_name ?? t), K = (e, t) => {
	if (e.formatEntityState) return e.formatEntityState(t);
	let n = t.attributes.unit_of_measurement;
	return n ? `${t.state} ${n}` : t.state;
}, _t = (e) => e ? V(e.entity_id) === "cover" ? e.state === "open" || e.state === "opening" : e.state === "on" : !1, vt = /* @__PURE__ */ new Map(), yt = {
	critical: 0,
	warning: 1,
	info: 2
}, bt = (e) => {
	if (Array.isArray(e)) return e.length;
	let t = Number(e);
	return Number.isFinite(t) ? t : 0;
}, xt = (e, t) => {
	let n = [], r = t.alerts ?? {}, i = (e) => b(t, e)?.name, a = (n) => ie(t, n) ?? gt(e, n);
	for (let i of r.critical ?? []) {
		let r = H(e, i), o = b(t, i);
		U(r) ? n.push({
			id: `crit-na-${i}`,
			severity: "warning",
			title: `${a(i)} unavailable`,
			meta: `Detector state unknown${o ? ` · ${o.name}` : ""}`,
			chipTitle: a(i),
			chipValue: "Detector",
			badge: "Unavailable",
			icon: "alert",
			room: o?.id,
			entity: i
		}) : r.state === "on" && n.push({
			id: `crit-${i}`,
			severity: "critical",
			title: `${a(i)} triggered`,
			meta: o?.name ?? i,
			chipTitle: o?.name ?? a(i),
			chipValue: a(i),
			badge: "Triggered",
			icon: "alert",
			room: o?.id,
			roomBadge: "Alarm",
			entity: i
		});
	}
	for (let i of r.temperature_rules ?? []) {
		let r = W(e, i.entity), o = b(t, i.entity), s = i.label || o?.name || a(i.entity);
		if (r === void 0) {
			vt.delete(i.entity), n.push({
				id: `temp-na-${i.entity}`,
				severity: "warning",
				title: `${s} temperature unavailable`,
				meta: `Cannot check the ${i.above} °C limit`,
				chipTitle: s,
				chipValue: "No reading",
				badge: "Unavailable",
				icon: "temperature",
				room: o?.id,
				entity: i.entity
			});
			continue;
		}
		let c = i.clear_below ?? i.above, l = vt.get(i.entity) ? r >= c : r > i.above;
		if (vt.set(i.entity, l), l) {
			let t = W(e, o?.humidity);
			n.push({
				id: `temp-${i.entity}`,
				severity: "warning",
				title: `${s} ${r.toFixed(1)} °C${t === void 0 ? "" : ` · ${Math.round(t)} % RH`}`,
				meta: `Above the ${i.above} °C limit${o ? ` · ${o.name}` : ""}`,
				chipTitle: s,
				chipValue: `${r.toFixed(1)} °C`,
				badge: "Too hot",
				icon: "temperature",
				room: o?.id,
				roomBadge: "Too hot",
				entity: i.entity
			});
		}
	}
	let o = (r, i) => {
		for (let o of r ?? []) {
			if (!_t(H(e, o))) continue;
			let r = b(t, o);
			n.push({
				id: `door-${o}`,
				severity: i,
				title: `${r ? `${r.name} ` : ""}${a(o).toLowerCase()} open`,
				meta: `${gt(e, o)}${r ? ` · ${r.name}` : ""}`,
				chipTitle: r?.name ?? a(o),
				chipValue: a(o),
				badge: "Open",
				icon: "door-open",
				room: r?.id,
				roomBadge: `${a(o)} open`,
				entity: o
			});
		}
	};
	if (o(r.exterior_doors, "warning"), o(r.interior_doors, "info"), r.data_quality !== !1) {
		let r = se(t).filter((t) => {
			let n = H(e, t);
			return !n || n.state === "unavailable";
		});
		if (r.length) {
			let e = r.map((e) => {
				let t = i(e);
				return `${a(e)}${t ? ` (${t})` : ""}`;
			});
			n.push({
				id: "data-quality",
				severity: "warning",
				title: `${r.length} device${r.length > 1 ? "s" : ""} unavailable`,
				meta: e.slice(0, 8).join(", ") + (e.length > 8 ? ` +${e.length - 8} more` : ""),
				chipTitle: "Data quality",
				chipValue: `${r.length} device${r.length > 1 ? "s" : ""}`,
				badge: "Unavailable",
				icon: "alert"
			});
		}
	}
	let s = t.entities?.incidents;
	if (s) {
		let t = H(e, s);
		if (U(t)) n.push({
			id: "incidents-na",
			severity: "warning",
			title: "Incident report unavailable",
			meta: "Log analysis state unknown",
			chipTitle: "Log report",
			chipValue: "No data",
			badge: "Unavailable",
			icon: "system",
			entity: s
		});
		else {
			let e = bt(t.attributes.critical), r = bt(t.attributes.warning), i = bt(t.attributes.minor);
			if (e + r + i > 0) {
				let a = [
					e && `${e} critical`,
					r && `${r} warning${r > 1 ? "s" : ""}`,
					i && `${i} minor`
				].filter(Boolean).join(", ");
				n.push({
					id: "incidents",
					severity: e + r > 0 ? "warning" : "info",
					title: `Log report: ${a}`,
					meta: String(t.attributes.summary ?? "Incident analyzer"),
					chipTitle: "System",
					chipValue: `${e + r + i} issue${e + r + i > 1 ? "s" : ""}`,
					badge: "Check log",
					icon: "system",
					entity: s
				});
			}
		}
	}
	if (r.mailbox && (r.mailbox_ack ? H(e, r.mailbox_ack)?.state === "on" : H(e, r.mailbox)?.state === "on")) {
		let e = b(t, r.mailbox);
		n.push({
			id: "mailbox",
			severity: "info",
			title: "Mailbox opened",
			meta: `${e?.name ?? ""}${r.mailbox_ack ? " · stays until acknowledged" : ""}`,
			chipTitle: "Mailbox",
			chipValue: "Opened",
			badge: "Mail",
			icon: "info",
			room: e?.id,
			entity: r.mailbox_ack ?? r.mailbox
		});
	}
	if (r.updates !== !1) {
		let t = Object.values(e.states).filter((e) => V(e.entity_id) === "update" && e.state === "on");
		t.length && n.push({
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
	return n.sort((e, t) => yt[e.severity] - yt[t.severity]);
}, St = (e) => {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) n.room && n.roomBadge && !t.has(n.room) && t.set(n.room, {
		text: n.roomBadge,
		severity: n.severity
	});
	return t;
}, Ct = _e`
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
  .crumb { padding: 4px 26px 0; display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--atlas-text2); }
  .crumb button { padding: 6px 0; }
  .crumb b { color: var(--atlas-text); }
  .rhead { padding: 0 26px; display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
  .rhead .title { display: flex; align-items: center; gap: 16px; }
  .rhead h1 { font-size: 56px; font-weight: 800; letter-spacing: -0.035em; line-height: 1; }
  .rhead .badge { font-size: 13px; padding: 5px 12px; border-radius: 8px; }
  .rhead p { margin-top: 8px; font-size: 16px; }
  .room-grid { flex: 1; display: grid; grid-template-columns: 400px minmax(0, 1fr); gap: 16px; }
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
  /* Room image is only the backdrop of the Devices card. */
  .devcard { position: relative; overflow: hidden; }
  .devcard > :not(.devbg):not(.devshade) { position: relative; }
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
  .main.fit .roomsec .tiles.floor { flex: 1; min-height: 0; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: minmax(0, 1fr); gap: 10px; }
  .main.fit .tiles.floor .tile { padding: 10px 12px; min-height: 0; }
  .main.fit .tiles.floor .tile .temp { font-size: 20px; }
  .main.fit .tiles.floor .tile .top .ic { width: 20px; height: 20px; }
  .camwall.fitwall { flex: 1 1 auto; min-height: 0; grid-template-columns: repeat(var(--fcols, var(--cols, 3)), var(--fw, minmax(0, 1fr))); justify-content: center; align-content: center; }
  .camname { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; padding: 2px 4px; }

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
    .home-grid, .room-grid, .energy-top { grid-template-columns: minmax(0, 1fr); }
  }
  @media (max-width: 760px) {
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
    .rhead h1 { font-size: 36px; }
    .devs { grid-template-columns: minmax(0, 1fr); grid-auto-rows: 76px; }
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
`, wt = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Tt = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Et = class {
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
}, Dt = class extends Et {
	constructor(e) {
		if (super(e), this.it = N, e.type !== wt.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
	}
	render(e) {
		if (e === N || e == null) return this._t = void 0, this.it = e;
		if (e === M) return e;
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
Dt.directiveName = "unsafeHTML", Dt.resultType = 1;
// node_modules/lit-html/directives/unsafe-svg.js
var Ot = class extends Dt {};
Ot.directiveName = "unsafeSVG", Ot.resultType = 2;
var kt = Tt(Ot), At = {
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
}, q = (e, t = 20) => {
	let n = e ? At[e] : void 0;
	return n ? A`<svg class="ic" aria-hidden="true" width=${t} height=${t} viewBox="0 0 32 32">${kt(n)}</svg>` : N;
}, jt = {
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
	dot: "M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0"
}, Mt = (e, t = 20) => A`<svg aria-hidden="true" width=${t} height=${t} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${j`<path d=${jt[e] ?? jt.dot}></path>`}</svg>`, Nt = (e) => {
	let t = e ?? "", n = j`<circle cx="14" cy="13" r="6" fill="#FFD27A"></circle>`, r = j`<path d="M10 26h20a7 7 0 0 0 0-14 9.5 9.5 0 0 0-18.3 2A6 6 0 0 0 10 26z" fill="#D3D8DE"></path>`, i = j`<path d="M14 28l-2 3M21 28l-2 3M28 28l-2 3" stroke="#5EC8FF" stroke-width="2" stroke-linecap="round"></path>`, a = j`<path d="M24 6a10 10 0 1 0 8 15A9 9 0 0 1 24 6z" fill="#D3D8DE"></path>`, o = j`${r}`;
	return t === "sunny" ? o = j`<circle cx="20" cy="15" r="8" fill="#FFD27A"></circle>` : t === "clear-night" ? o = a : t === "partlycloudy" ? o = j`${n}${r}` : (t.includes("rain") || t === "pouring" || t.includes("snow") || t === "hail") && (o = j`${r}${i}`), A`<svg aria-hidden="true" width="40" height="32" viewBox="0 0 40 32">${o}</svg>`;
}, J = (e, ...t) => t.some((t) => e.includes(t)), Pt = [
	"door",
	"garage_door",
	"opening",
	"window"
], Ft = [
	"motion",
	"occupancy",
	"presence"
], It = (e) => {
	if (!e || V(e.entity_id) !== "binary_sensor") return !1;
	let t = String(e.attributes.device_class ?? "");
	return Pt.includes(t) || J(e.entity_id, "contact", "window", "door", "skylight", "velux");
}, Lt = (e, t) => {
	let n = V(e), r = String(t?.attributes.device_class ?? "");
	return n === "binary_sensor" ? r === "window" || J(e, "window", "skylight", "velux") ? "window" : r === "garage_door" ? "garage" : J(e, "mailbox", "letterbox") ? "mail" : r === "door" || r === "opening" || J(e, "door") ? "door" : Ft.includes(r) || J(e, "motion", "presence", "person", "occupancy") ? "motion" : "dot" : n === "light" ? "bulb" : n === "fan" ? "fan" : n === "media_player" ? "tv" : n === "cover" ? "garage" : n === "camera" ? "camera" : n === "climate" ? "heat" : n === "switch" ? J(e, "water", "valve", "irrig") ? "drop" : "power" : n === "select" ? "washer" : J(e, "print") ? "printer" : J(e, "mower") ? "mower" : J(e, "oven") ? "oven" : J(e, "washer", "dryer") ? "washer" : r === "temperature" ? "thermo" : r === "battery" ? "power" : "dot";
}, Rt = [
	"light",
	"switch",
	"fan",
	"input_boolean"
], zt = (e) => {
	if (U(e)) return "na";
	let t = V(e.entity_id), n = e.state;
	return t === "binary_sensor" ? n === "on" ? It(e) ? "open" : "on" : "idle" : t === "cover" ? n === "open" || n === "opening" ? "open" : "idle" : Rt.includes(t) ? n === "on" ? "on" : "idle" : t === "media_player" ? [
		"off",
		"standby",
		"idle"
	].includes(n) ? "idle" : "on" : t === "climate" ? n === "off" ? "idle" : "on" : "idle";
}, Bt = (e, t) => {
	if (!t) return "Not found";
	if (t.state === "unavailable") return "Unavailable";
	if (t.state === "unknown") return "Unknown";
	let n = V(t.entity_id);
	if (n === "light" && t.state === "on" && typeof t.attributes.brightness == "number") return `On · ${Math.round(t.attributes.brightness / 255 * 100)} %`;
	if (n === "climate") {
		let e = t.attributes.hvac_action ? String(t.attributes.hvac_action) : t.state, n = t.attributes.current_temperature;
		return `${e.charAt(0).toUpperCase()}${e.slice(1)}${n == null ? "" : ` · ${n} °C`}`;
	}
	return K(e, t);
}, Vt = (e, t) => t.name || String(e.states[t.entity]?.attributes.friendly_name ?? t.entity), Y = (e, t = " °C") => e === void 0 ? "–" : `${e.toFixed(1)}${t}`, Ht = (e) => e === void 0 ? "" : `${Math.round(e)} % RH`, Ut = (e, t, n = "", r) => {
	let i = W(e.hass, t.temperature), a = W(e.hass, t.humidity), o = e.badges.get(t.id), s = ae(e.config, t), c = t.temperature || t.humidity ? Ht(a) || (t.humidity ? "no reading" : "") : "no climate sensor";
	return A`<button class="tile ${n} ${o ? "alert" : ""}" aria-label="Open ${t.name}" @click=${() => e.openRoom(t)}>
    ${s ? A`<img src=${s} alt="" loading="lazy" /><span class="shade"></span>` : N}
    <span class="top">${q(t.icon, 26)}${o ? A`<span class="badge ${o.severity === "critical" ? "critical" : ""}">${o.text}</span>` : N}</span>
    <span class="bot">
      <span class="info">
        <span class="name">${t.name}</span>
        ${t.temperature ? A`<span class="temp n ${e.hot.has(t.id) ? "hot" : ""}">${Y(i)}</span>` : N}
        <span class="hum n">${[c, r].filter(Boolean).join(" · ")}</span>
      </span>
      <span class="go">${q("chevron", 14)}</span>
    </span>
  </button>`;
}, Wt = {
	critical: "var(--atlas-crit)",
	warning: "var(--atlas-warn)",
	info: "var(--atlas-info)"
}, Gt = () => {
	let e = (/* @__PURE__ */ new Date()).getHours();
	return e < 5 ? "Good night." : e < 12 ? "Good morning." : e < 18 ? "Good afternoon." : "Good evening.";
}, Kt = (e, t = !1) => {
	let n = e.alerts, r = n.filter((e) => e.severity === "critical").length, i = n.filter((e) => e.severity === "warning").length, a = n.filter((e) => e.severity === "info").length, o = r + i, s = r ? "critical" : i ? "" : a ? "info" : "calm", c = o ? `${o} thing${o > 1 ? "s" : ""} need${o > 1 ? "" : "s"} attention` : a ? `Nothing urgent · ${a} note${a > 1 ? "s" : ""}` : "Nothing needs attention", l = n.slice(0, 3);
	return A`<div class="banner ${s}" role="region" aria-label="Attention">
    <span class="sig">${o || a ? j`<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 7v6M12 17h.01"></path></svg>` : q("security", 22)}</span>
    <button class="sum" @click=${() => e.go("alerts")}>
      <b>${c}</b>
      <span class="n">${r} critical · ${i} warning${i === 1 ? "" : "s"} · ${a} info</span>
    </button>
    ${t ? N : A`<div class="chips">
          ${l.map((t) => A`<button class="chip ${t.severity}" @click=${() => e.openAlert(t)}>
              <span class="ico">${q(t.icon, 20)}</span>
              <span class="txt"><span>${t.chipTitle}</span><span class="val"><b class="n">${t.chipValue}</b><span class="badge ${t.severity}">${t.badge}</span></span></span>
            </button>`)}
        </div>`}
    <button class="more" aria-label="All alerts" @click=${() => e.go("alerts")}>${q("chevron", 18)}</button>
  </div>`;
}, qt = (e) => {
	let t = e.config.entities ?? {}, n = H(e.hass, t.heat_pump);
	if (!t.heat_pump) return N;
	let r = U(n) ? void 0 : Number(n.attributes.current_temperature), i = U(n) ? void 0 : Number(n.attributes.temperature), a = r !== void 0 && Number.isFinite(r), o = a ? Math.max(0, Math.min(1, (r - 10) / 20)) : 0, s = U(n) ? "Unavailable" : String(n.attributes.hvac_action ?? n.state), c = W(e.hass, t.heat_pump_outdoor) ?? W(e.hass, t.outdoor_temperature), l = W(e.hass, t.heat_pump_supply), u = W(e.hass, t.heat_pump_return);
	return A`<section class="glass card">
    <h2 style="font-size:18px"><span style="color:var(--atlas-accent)">${q("climate", 22)}</span>Climate</h2>
    <div class="clim">
      <svg role="img" aria-label="Heat pump ${a ? r : "unavailable"} degrees" width="136" height="136" viewBox="0 0 140 140" style="flex:none">
        <circle cx="70" cy="70" r="60" fill="rgba(0,0,0,0.35)"></circle>
        <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(241,245,255,0.08)" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="${78} 100" transform="rotate(130 70 70)"></circle>
        ${a ? j`<circle cx="70" cy="70" r="58" fill="none" stroke="var(--atlas-accent)" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="${Math.max(1, 78 * o)} 100" transform="rotate(130 70 70)"></circle>` : N}
        <text x="70" y="76" text-anchor="middle" font-size="32" font-weight="700" fill="#F1F5FF">${a ? r.toFixed(1) : "–"}<tspan font-size="13" dy="-13">°C</tspan></text>
        ${i !== void 0 && Number.isFinite(i) ? j`<text x="70" y="98" text-anchor="middle" font-size="12" fill="var(--atlas-accent)">Target ${i.toFixed(1)}°</text>` : N}
      </svg>
      <div class="det">
        <b>Heat pump · ${s.charAt(0).toUpperCase() + s.slice(1)}</b>
        <span class="n t2">Outdoor ${Y(c, "°")} · Supply ${Y(l, "°")}</span>
        <span class="n t2">Return ${Y(u, "°")}</span>
        <div class="btn3">
          <button class="sq" aria-label="Heat pump power" @click=${() => e.moreInfo(t.heat_pump)}>${q("power", 20)}</button>
          <button class="sq" aria-label="Eco mode" @click=${() => e.moreInfo(t.heat_pump)}>${q("eco", 20)}</button>
          <button class="sq" aria-label="Schedule" @click=${() => e.moreInfo(t.heat_pump)}>${q("schedule", 20)}</button>
        </div>
      </div>
    </div>
  </section>`;
}, Jt = (e) => e === void 0 ? "–" : `${e.toFixed(2)} kW`, Yt = (e) => {
	let t = e.config.entities ?? {};
	if (!t.house_load && !t.solar_power && !t.grid_import) return N;
	let n = G(e.hass, t.solar_power), r = G(e.hass, t.house_load), i = G(e.hass, t.grid_import), a = G(e.hass, t.grid_export), o = (a ?? 0) > (i ?? 0), s = o ? a : i;
	return A`<section class="glass card" style="gap:10px">
    <div class="row">
      <h2>Energy flow</h2>
      ${h(e.config).length > 0 ? A`<button class="t2 more" @click=${() => e.go("energy")}>Circuits ${q("chevron", 14)}</button>` : N}
    </div>
    <div class="flow">
      <button class="node" @click=${() => t.solar_power && e.moreInfo(t.solar_power)}><span class="c">${q("solar", 22)}</span><b class="n">${Jt(n)}</b><span>Solar</span></button>
      <span class="link ${(n ?? 0) > .01 ? "act r" : ""}"></span>
      <button class="node house" @click=${() => t.house_load && e.moreInfo(t.house_load)}><span class="c">${q("home", 24)}</span><b class="n">${Jt(r)}</b><span>House</span></button>
      <span class="link ${(s ?? 0) > .01 ? `act ${o ? "r" : "l"}` : ""}"></span>
      <button class="node" @click=${() => t.grid_import && e.moreInfo(t.grid_import)}><span class="c">${q("grid", 22)}</span><b class="n">${Jt(s)}</b><span>${o ? "Grid export" : "Grid import"}</span></button>
    </div>
  </section>`;
}, Xt = (e) => {
	let t = e.config.entities ?? {}, n = H(e.hass, t.alarm), r = m(e.config).flatMap((t) => (t.devices ?? []).map((t) => e.hass.states[t.entity])).filter((e) => It(e) || e && V(e.entity_id) === "cover"), i = r.filter((e) => !U(e)), a = i.filter((e) => e.state === "on" || e.state === "open").length, o = (e.config.layout?.security_tiles ?? []).map((t) => _(e.config, t)).filter(Boolean);
	return A`<section class="glass card">
    <div class="row">
      <h2>${q("security", 20)}Security</h2>
      <button class="n t2" style="font-size:12px" @click=${() => t.alarm && e.moreInfo(t.alarm)}>
        ${n ? U(n) ? "Alarm unavailable" : K(e.hass, n) : ""} · ${a} / ${i.length} open${i.length < r.length ? ` · ${r.length - i.length} n/a` : ""}
      </button>
    </div>
    ${o.length ? A`<div class="cams">
          ${o.map((t) => {
		let n = y(t), r = H(e.hass, n), i = !!r && !U(r) && !!r.attributes.entity_picture, a = i ? `${r.attributes.entity_picture}&width=640&height=360&t=${Math.floor(e.tick / 1e4)}` : void 0;
		return A`<button class="cam ${i ? "" : "na"}" aria-label="${t.name} camera" @click=${() => e.openRoom(t)}>
              ${a ? A`<img src=${a} alt="" />` : A`<span class="camna">${q("camera", 22)}${n ? "Camera unavailable" : "No camera"}</span>`}
              <span class="lbl"><i class="dotst ${i ? "" : "na"}"></i>${t.name}</span>
            </button>`;
	})}
        </div>` : N}
  </section>`;
}, Zt = (e) => {
	let t = e.config.entities ?? {}, n = H(e.hass, t.alarm), r = H(e.hass, t.garage_cover), i = ce(e.config).filter((t) => e.hass.states[t]?.state === "on"), a = n && n.state !== "disarmed" && !U(n), o = t.wake_pc;
	return A`<section class="glass card" style="gap:10px;padding:14px 16px">
    <h2 style="margin-left:4px">Quick actions</h2>
    <div class="actions">
      ${t.alarm ? A`<button class="qa primary" ?disabled=${U(n)} @click=${() => a ? e.moreInfo(t.alarm) : e.confirm("Arm away?", "The alarm will arm in away mode.", () => e.call("alarm_control_panel", "alarm_arm_away", { entity_id: t.alarm }), "Arm away")}>
            ${q("arm-away", 20)}${a ? "Disarm" : "Arm away"}
          </button>` : N}
      ${t.garage_cover ? A`<button class="qa" ?disabled=${U(r)} @click=${() => {
		let n = r?.state !== "open";
		e.confirm(n ? "Open the garage?" : "Close the garage?", `Garage door is ${r ? K(e.hass, r).toLowerCase() : "unknown"}.`, () => e.call("cover", n ? "open_cover" : "close_cover", { entity_id: t.garage_cover }), n ? "Open" : "Close");
	}}>${q("garage-door", 20)}Garage</button>` : N}
      <button class="qa" @click=${() => i.length ? e.confirm("Turn lights off?", `${i.length} light${i.length > 1 ? "s are" : " is"} on in mapped rooms (status LEDs excluded).`, () => e.call("light", "turn_off", { entity_id: i }), "Turn off") : e.confirm("All lights are off", "No mapped room light is on.", () => void 0, "OK")}>
        ${q("lights-off", 20)}Lights off${i.length ? A` <span class="n t2">${i.length}</span>` : N}
      </button>
      ${o ? A`<button class="qa" @click=${() => {
		let t = V(o);
		t === "script" ? e.call("script", "turn_on", { entity_id: o }) : e.call(t, "press", { entity_id: o });
	}}>${q("wake-pc", 20)}Wake PC</button>` : N}
      <button class="qa" @click=${() => e.go("rooms")}>${q("more", 20)}More</button>
    </div>
  </section>`;
}, Qt = (e) => e === 8 ? [
	2,
	2,
	2,
	3,
	3,
	2,
	2,
	2
] : Array(e).fill(2), $t = (e) => {
	let t = e.config.entities ?? {}, n = H(e.hass, t.heat_pump), r = U(n) ? void 0 : Number(n.attributes.current_temperature), i = H(e.hass, t.alarm), a = (e.config.layout?.home_tiles?.length ? e.config.layout.home_tiles : m(e.config).slice(0, 8).map((e) => e.id)).map((t) => _(e.config, t)).filter(Boolean), o = Qt(a.length), s = m(e.config).length, c = i ? U(i) ? "Alarm unavailable" : `Alarm ${K(e.hass, i).toLowerCase()}` : "", l = i && (U(i) || ["triggered", "pending"].includes(i.state));
	return A`
    <section class="hero" aria-label="Greeting">
      <h1>${Gt()}</h1>
      <p class="n">
        ${t.heat_pump ? A`Heat pump reads ${r !== void 0 && Number.isFinite(r) ? `${r.toFixed(1)} °C` : "–"} indoors` : N}
        ${c ? A`<span style="opacity:.5"> · </span><span style="color:${l ? "var(--atlas-warn)" : "var(--atlas-accent)"};font-weight:600">${c}</span>` : N}
      </p>
    </section>
    ${Kt(e, e.narrow)}
    <div class="home-grid">
      <div class="col">
        <section class="glass card" style="flex:1;padding:16px">
          <div class="row" style="padding:0 4px;align-items:flex-start">
            <div><h2 style="font-size:20px">Rooms</h2><span class="t2" style="font-size:12px">Quick access to your spaces</span></div>
            <button class="pillbtn" @click=${() => e.go("rooms")}>View all ${s} rooms</button>
          </div>
          <div class="tiles" style="flex:1">${a.map((t, n) => Ut(e, t, o[n] === 3 ? "s3" : ""))}</div>
        </section>
        ${Zt(e)}
      </div>
      <div class="col">${qt(e)}${Yt(e)}${Xt(e)}</div>
    </div>
  `;
}, en = [
	["critical", "Critical"],
	["warning", "Warning"],
	["info", "Info"]
], tn = (e) => {
	let t = e.config.alerts?.mailbox_ack, n = en.map(([t, n]) => ({
		sev: t,
		label: n,
		items: e.alerts.filter((e) => e.severity === t)
	})).filter((e) => e.items.length);
	return A`
    <section class="hero">
      <h1 class="sm">Needs attention</h1>
      <p>Grouped by severity · rows clear automatically when the condition resolves</p>
    </section>
    ${n.length ? n.map((n) => A`<section class="glass card group">
            <h2 style="color:${Wt[n.sev]}">${n.label} · ${n.items.length}</h2>
            <div class="alist">
              ${n.items.map((r) => A`<button class="arow ${r.severity}" @click=${() => e.openAlert(r)}>
                  <span class="ico">${q(r.icon, 20)}</span>
                  <span class="txt"><b>${r.title}</b><span>${r.meta}</span></span>
                  ${r.id === "mailbox" && t ? A`<span class="ctl" role="button" @click=${(n) => {
		n.stopPropagation(), e.call("input_boolean", "turn_off", { entity_id: t });
	}}>Acknowledge</span>` : N}
                  <span class="badge ${r.severity}">${n.label}</span>
                </button>`)}
            </div>
          </section>`) : A`<section class="glass card"><p class="empty">Nothing needs attention. All mapped sources report valid states.</p></section>`}
  `;
}, nn = (e, t) => {
	let n = t.cameras ?? "off";
	if (n === "off") return N;
	let r = v(e.config, t.id).filter((e) => y(e));
	if (!r.length) return N;
	let i = n === "live" && !!customElements.get("ha-camera-stream"), a = Math.floor(e.tick / 1e4);
	return A`<section class="glass card camsec" style="padding:16px;gap:12px">
    <div class="row" style="padding:0 4px">
      <h2 style="font-size:20px">Cameras on ${t.name}</h2>
      <span class="t2" style="font-size:12px">${n === "live" ? "Live, muted" : "Snapshots every 10 s"} · tap a name for the room</span>
    </div>
    <div class="camwall ${e.narrow ? "" : "fitwall"}" style="--cols:${r.length <= 3 ? r.length : r.length === 4 ? 2 : 3}">
      ${r.map((t) => {
		let n = y(t), r = H(e.hass, n), o = r?.attributes.entity_picture, s;
		return s = t.camera_private ? A`<div class="camslot private"><span class="t2" style="font-size:12px">Private camera · open the room to reveal</span></div>` : U(r) ? A`<div class="camslot"><b style="font-size:13px">Camera unavailable</b></div>` : i ? A`<div class="camslot live"><ha-camera-stream .hass=${e.hass} .stateObj=${r} .fitMode=${"cover"} muted></ha-camera-stream></div>` : A`<div class="camslot live">${o ? A`<img src=${`${o}&width=960&height=540&t=${a}`} alt="${t.name} camera" loading="lazy" />` : A`<span class="t2" style="font-size:12px">Waiting for picture</span>`}</div>`, A`<div class="camtile">
          <button class="camname" @click=${() => e.openRoom(t)}><i class="dotst ${U(r) ? "na" : ""}"></i>${t.name}</button>
          ${s}
        </div>`;
	})}
    </div>
  </section>`;
}, rn = (e, t) => {
	let n = v(e.config, t), r = n.filter((t) => !e.hot.has(t.id)).map((t) => W(e.hass, t.temperature)).filter((e) => e !== void 0), i = r.length ? `${(r.reduce((e, t) => e + t, 0) / r.length).toFixed(1)} °C typical` : "no sensors", a = n.filter((t) => e.badges.has(t.id)).length;
	return i + (a ? ` · ${a} alert${a > 1 ? "s" : ""}` : "");
}, an = (e) => {
	let t = g(e.config), n = re(e.config, e.floorId) ?? t[0], r = e.config.rooms?.length ?? 0, i = (e.config.rooms ?? []).filter((t) => !t.floor || !re(e.config, t.floor)), a = n ? v(e.config, n.id) : i, o = n ? nn(e, n) : N, s = o !== N && !e.narrow, c = A`<section class="glass card roomsec" style="flex:1;padding:16px">
      <div class="row" style="padding:0 4px">
        <h2 style="font-size:20px">${n ? `${n.name}${n.level ? ` · level ${n.level}` : ""}` : "Rooms"}</h2>
        <span class="t2" style="font-size:12px">Tap a room for its devices</span>
      </div>
      <div class="tiles floor">
        ${a.map((t) => Ut(e, t, "", `${(t.devices ?? []).length} devices`))}
      </div>
    </section>`;
	return A`
    <section class="hero">
      <h1 class="sm">Rooms</h1>
      <p>${t.length} floors · ${r} rooms · pick a floor, then a room</p>
    </section>
    <div class="floors">
      ${t.map((t) => {
		let r = v(e.config, t.id).length;
		return A`<button class="glass fl ${t.id === n?.id ? "on" : ""}" @click=${() => e.go(`floor-${t.id}`)}>
          <span class="row" style="align-items:baseline"><span class="lv n">${t.level ?? ""}</span><small>${r} room${r === 1 ? "" : "s"}</small></span>
          <span style="font-size:16px;font-weight:600">${t.name}</span>
          <small class="n">${rn(e, t.id)}</small>
        </button>`;
	})}
    </div>
    ${s ? A`<div class="fitgrid">${c}${o}</div>` : A`${c}${o}`}
  `;
}, on = 6e4, sn = 36e5, cn = 864e5, ln = (e, t, n = Date.now()) => {
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
}, un = (e, t = "changed") => !e || t === "off" ? void 0 : t === "updated" ? e.last_updated : e.last_changed, dn = (e, t) => {
	if (!t) return "";
	let n = e.locale?.language ?? e.language ?? "en", r = (e) => Number.isFinite(Date.parse(e)) ? new Date(e).toLocaleString(n) : "-";
	return `${t.entity_id}\nLast changed: ${r(t.last_changed)}\nLast updated: ${r(t.last_updated)}`;
}, fn = 500, pn = (e, t) => {
	let n, r = !1, i = Rt.includes(V(t));
	return {
		down: () => {
			r = !1, n = window.setTimeout(() => {
				r = !0, e.moreInfo(t);
			}, fn);
		},
		up: () => window.clearTimeout(n),
		click: () => {
			if (r) return;
			let n = e.hass.states[t];
			i && !U(n) ? e.call(V(t), "toggle", { entity_id: t }) : e.moreInfo(t);
		},
		context: (i) => {
			i.preventDefault(), window.clearTimeout(n), r = !0, e.moreInfo(t);
		}
	};
}, mn = (e, t) => {
	let n = e.hass.states[t.entity], r = zt(n), i = pn(e, t.entity), a = ln(e.hass, un(n, e.config.appearance?.time_display));
	return A`<button class="dev ${r}" title=${dn(e.hass, n) || t.entity}
    @pointerdown=${i.down} @pointerup=${i.up} @pointerleave=${i.up} @click=${i.click} @contextmenu=${i.context}>
    <span class="chipi">${t.icon ? A`<ha-icon .icon=${t.icon} style="--mdc-icon-size:20px"></ha-icon>` : Mt(Lt(t.entity, n))}</span>
    <span class="txt"><b>${Vt(e.hass, t)}</b><span>${Bt(e.hass, n)}</span>${a ? A`<small class="ago n">${a}</small>` : N}</span>
  </button>`;
}, hn = (e, t) => {
	if (t.show_camera === !1) return N;
	if (!t.camera) return A`<section class="glass card"><h2>Camera</h2>
      <div class="camslot none"><span class="camico">${Mt("camera", 24)}</span><span class="t2" style="font-size:12px">This room has no camera</span></div>
    </section>`;
	let n = `cam:${t.id}`, r = e.ui[n] ?? "live", i = !t.camera_private || e.ui[`reveal:${t.id}`] === !0, a = H(e.hass, t.camera), o = H(e.hass, t.camera_snapshot) ?? a, s = (t) => {
		e.ui[n] = t, e.refresh();
	}, c = !!customElements.get("ha-camera-stream"), l;
	if (!i) l = A`<div class="camslot private"><span class="camico">${Mt("camera", 24)}</span>
      <b style="font-size:14px">${t.name} camera · private</b><span class="t2" style="font-size:12px">Stream hidden until you tap Reveal</span>
      <button class="ctl" @click=${() => {
		e.ui[`reveal:${t.id}`] = !0, e.refresh();
	}}>Reveal</button></div>`;
	else if (U(a)) l = A`<div class="camslot"><span class="camico">${Mt("camera", 24)}</span><b style="font-size:14px">Camera unavailable</b><span class="t2" style="font-size:12px">${t.camera}</span></div>`;
	else if (r === "live" && c) l = A`<div class="camslot live"><ha-camera-stream .hass=${e.hass} .stateObj=${a} .fitMode=${"cover"} controls muted></ha-camera-stream></div>`;
	else if (r === "snapshot" && o?.attributes.entity_picture) l = A`<div class="camslot live"><img src=${`${o.attributes.entity_picture}&t=${e.ui[`${n}:t`] ?? 0}`} alt="${t.name} snapshot" /></div>`;
	else {
		let e = a?.attributes.entity_picture;
		l = A`<div class="camslot live">${e ? A`<img src=${`${e}&width=1280&height=720`} alt="" />` : N}
      <span class="camwait">Starting live stream…</span></div>`;
	}
	let u = (e, t, n) => A`<button class="sq ${t ? "on" : ""}" style="color:var(--atlas-text)" @click=${n}>${e}</button>`;
	return A`<section class="glass card">
    <div class="row"><h2>Camera</h2>
      <span style="display:flex;gap:10px;align-items:center">
        ${i && !U(a) && r === "live" ? A`<span class="livetag"><i></i>Live</span>` : N}
        ${t.camera_private && i ? A`<button class="t2" style="font-size:12px" @click=${() => {
		e.ui[`reveal:${t.id}`] = !1, s("live");
	}}>Hide</button>` : N}
      </span>
    </div>
    ${l}
    ${i && !U(a) ? A`<div class="btn3" style="margin-top:0">
          ${u("Live", r === "live", () => c ? s("live") : e.moreInfo(t.camera))}
          ${u("Snapshot", r === "snapshot", () => {
		e.ui[`${n}:t`] = Date.now(), s("snapshot");
	})}
          ${u("Recordings", !1, () => e.href("/media-browser/browser"))}
        </div>` : N}
  </section>`;
}, gn = (e, t, n) => {
	let r = (Array.isArray(t) ? t : t && typeof t == "object" ? [t] : []).filter((e) => e && typeof e == "object");
	return r.length ? A`<div class="owncards ${n}">${r.map((t) => A`<atlas-hui-card .config=${t} .hass=${e.hass}></atlas-hui-card>`)}</div>` : N;
}, _n = (e) => {
	let t = _(e.config, e.roomId);
	if (!t) return A`<section class="glass card"><p class="empty">Room "${e.roomId}" is not in the config.</p></section>`;
	let n = re(e.config, t.floor), r = n ? v(e.config, n.id) : m(e.config), i = r.findIndex((e) => e.id === t.id), a = r[(i - 1 + r.length) % r.length], o = r[(i + 1) % r.length], s = W(e.hass, t.temperature), c = W(e.hass, t.humidity), l = e.badges.get(t.id), u = t.devices ?? [], d = ae(e.config, t), f = s === void 0 ? "" : s < 16 ? "#5EC8FF" : s > 30 ? "var(--atlas-crit)" : "var(--atlas-accent)", ee = [
		s === void 0 ? "" : Y(s),
		c === void 0 ? "" : Ht(c),
		`${u.length} device${u.length === 1 ? "" : "s"}`
	].filter(Boolean).join(" · "), p = t.temperature || t.humidity, h = e.config.appearance?.time_display, te = (t) => {
		let n = H(e.hass, t), r = ln(e.hass, un(n, h));
		return r ? A`<small class="ago n" title=${dn(e.hass, n)}>${r}</small>` : N;
	};
	return A`
    <nav class="crumb" aria-label="Breadcrumb">
      <button @click=${() => e.go("home")}>Home</button><span aria-hidden="true">›</span>
      ${n ? A`<button @click=${() => e.go(`floor-${n.id}`)}>${n.name}</button><span aria-hidden="true">›</span>` : N}
      <b>${t.name}</b>
    </nav>
    <section class="rhead">
      <div>
        <div class="title">${q(t.icon, 44)}<h1>${t.name}</h1>${l ? A`<span class="badge ${l.severity === "critical" ? "critical" : ""}">${l.text}</span>` : N}</div>
        <p class="n t2">${n ? A`${n.name} <span style="opacity:.5">·</span> ` : N}${ee}</p>
      </div>
      ${r.length > 1 ? A`<div style="display:flex;gap:8px">
            <button class="ctl" aria-label="Previous room" @click=${() => e.openRoom(a)}>‹ ${a.name}</button>
            <button class="ctl" aria-label="Next room" @click=${() => e.openRoom(o)}>${o.name} ›</button>
          </div>` : N}
    </section>
    <div class="room-grid">
      <div class="col">
        <section class="glass card" style="gap:16px">
          <h2>Climate</h2>
          ${p ? A`<div class="metrics">
                <button class="metric" @click=${() => t.temperature && e.moreInfo(t.temperature)}>
                  <span class="lbl">${q("temperature", 16)}Temperature${te(t.temperature)}</span>
                  <span class="big n" style="color:${e.hot.has(t.id) ? "var(--atlas-crit)" : "inherit"}">${s === void 0 ? "–" : `${s.toFixed(1)}°`}</span>
                  <span class="bar">${s === void 0 ? N : A`<span style="width:${Math.round(Math.max(.05, Math.min(1, (s - 10) / 30)) * 100)}%;background:${f}"></span>`}</span>
                </button>
                <button class="metric" @click=${() => t.humidity && e.moreInfo(t.humidity)}>
                  <span class="lbl">${q("humidity", 16)}Humidity${te(t.humidity)}</span>
                  <span class="big n">${c === void 0 ? "–" : `${Math.round(c)} %`}</span>
                  <span class="bar">${c === void 0 ? N : A`<span style="width:${Math.round(Math.min(100, c))}%;background:${c < 25 ? "var(--atlas-warn)" : "#5EC8FF"}"></span>`}</span>
                </button>
              </div>` : A`<span class="t2" style="font-size:14px">No temperature sensor in this room yet.</span>`}
        </section>
        ${hn(e, t)}
        ${gn(e, t.side_cards, "side")}
      </div>
      <div class="col">
        <section class="glass card devcard ${d ? "has-img" : ""}" style="flex:1;padding:18px">
          ${d ? A`<img class="devbg" src=${d} alt="" /><span class="devshade" aria-hidden="true"></span>` : N}
          <div class="row"><h2>Devices</h2><span class="n t2" style="font-size:12px">${u.length} device${u.length === 1 ? "" : "s"} · tap to toggle, hold for details</span></div>
          ${u.length ? A`<div class="devs">${u.map((t) => mn(e, t))}</div>` : A`<span class="t2" style="font-size:14px">No devices mapped to this room.</span>`}
        </section>
        ${gn(e, t.cards, "main")}
        ${r.length > 1 ? A`<section class="glass card" style="padding:14px 16px;gap:10px">
              <h2 style="font-size:14px;margin-left:4px">Other rooms on ${n?.name ?? "this floor"}</h2>
              <div class="sibs">
                ${r.filter((e) => e.id !== t.id).map((t) => {
		let n = W(e.hass, t.temperature);
		return A`<button class=${e.badges.has(t.id) ? "alert" : ""} @click=${() => e.openRoom(t)}>${q(t.icon, 18)}${t.name}${n === void 0 ? N : A` <span class="n" style="opacity:.7">${n.toFixed(1)}°</span>`}</button>`;
	})}
              </div>
            </section>` : N}
      </div>
    </div>
  `;
}, vn = 2, yn = 3e3, X = (e, t) => {
	let n = G(e.hass, t);
	return n === void 0 ? void 0 : n * 1e3;
}, Z = (e) => e === void 0 ? "–" : Math.abs(e) >= 1e4 ? `${(e / 1e3).toFixed(2)} kW` : `${Math.round(e)} W`, Q = (e, t, n) => e === void 0 ? "–" : `${e.toFixed(t)}${n}`, bn = (e, t) => {
	let n = W(e.hass, t);
	if (n !== void 0) return Math.abs(n) <= 1 ? n * 100 : n;
}, xn = (e, t) => !!H(e.hass, t.power) && !U(H(e.hass, t.power)), Sn = (e, t, n) => {
	let r = e === void 0 ? 0 : Math.max(0, Math.min(1, e));
	return j`<svg class="ering" width=${t} height=${t} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(241,245,255,0.08)" stroke-width="7" stroke-linecap="round"
      pathLength="100" stroke-dasharray="75 100" transform="rotate(135 50 50)"></circle>
    ${r > 0 ? j`<circle cx="50" cy="50" r="42" fill="none" stroke=${n ? "var(--atlas-warn)" : "var(--atlas-accent)"} stroke-width="7" stroke-linecap="round"
          pathLength="100" stroke-dasharray=${`${(r * 75).toFixed(1)} 100`} transform="rotate(135 50 50)"></circle>` : N}
  </svg>`;
}, Cn = (e) => [
	"a",
	"b",
	"c"
].filter((t) => e[`power_${t}`] || e[`current_${t}`] || e[`voltage_${t}`]), wn = (e, t) => {
	let n = Cn(t);
	if (!n.length) return N;
	let r = [
		{
			key: "power",
			label: "W",
			fmt: (t) => Z(X(e, t))
		},
		{
			key: "current",
			label: "A",
			fmt: (t) => Q(W(e.hass, t), 2, " A")
		},
		{
			key: "voltage",
			label: "V",
			fmt: (t) => Q(W(e.hass, t), 0, " V")
		}
	].filter((e) => n.some((n) => t[`${e.key}_${n}`])), i = `grid-template-columns: 22px repeat(${r.length}, minmax(0, 1fr))`;
	return A`<div class="ephases" role="table" aria-label="${t.name} phases">
    ${n.map((n) => A`<div class="ph sm" role="row" style=${i}>
        <span class="phl" role="rowheader">${n.toUpperCase()}</span>
        ${r.map((r) => {
		let i = t[`${r.key}_${n}`];
		return A`<button class="n" role="cell" ?disabled=${!i} aria-label="Phase ${n.toUpperCase()} ${r.key}" @click=${() => i && e.moreInfo(i)}>${i ? r.fmt(i) : ""}</button>`;
	})}
      </div>`)}
  </div>`;
}, Tn = (e, t, n) => xn(e, t) ? n !== void 0 && Math.abs(n) >= vn ? {
	text: "Consuming",
	cls: "on"
} : {
	text: "Standby",
	cls: "idle"
} : {
	text: "Offline",
	cls: "off"
}, $ = (e, t, n) => A`<button class="estat" ?disabled=${!n} @click=${() => n?.()}><b class="n">${e}</b><span>${t}</span></button>`, En = (e, t) => {
	let n = X(e, t.power), r = t.max_power || yn, i = Tn(e, t, n), a = Cn(t), o = (t) => t ? () => e.moreInfo(t) : void 0;
	return A`<section class="glass card emain">
    <div class="row"><h2>${q("energy", 20)}${t.name}</h2><span class="estatus ${i.cls}"><i></i>${i.text}</span></div>
    <div class="emain-body">
      <button class="egauge big" @click=${() => e.moreInfo(t.power)}>
        ${Sn(n === void 0 ? void 0 : n / r, 168, n !== void 0 && n > r * .8)}
        <span class="ev"><b class="n">${Z(n)}</b><span>${i.text === "Offline" ? "no data" : "now"}</span></span>
      </button>
      ${a.length ? A`<div class="phases" role="table" aria-label="Phases">
            <div class="ph head" role="row"><span></span>${a.map((e) => A`<span role="columnheader">Phase ${e.toUpperCase()}</span>`)}</div>
            <div class="ph" role="row"><span class="t2">${q("energy", 16)}Power</span>${a.map((n) => A`<button class="n" @click=${() => o(t[`power_${n}`])?.()}>${Z(X(e, t[`power_${n}`]))}</button>`)}</div>
            <div class="ph" role="row"><span class="t2">${q("power", 16)}Current</span>${a.map((n) => A`<button class="n" @click=${() => o(t[`current_${n}`])?.()}>${Q(W(e.hass, t[`current_${n}`]), 2, " A")}</button>`)}</div>
            <div class="ph" role="row"><span class="t2">${q("grid", 16)}Voltage</span>${a.map((n) => A`<button class="n" @click=${() => o(t[`voltage_${n}`])?.()}>${Q(W(e.hass, t[`voltage_${n}`]), 1, " V")}</button>`)}</div>
          </div>` : N}
    </div>
    <div class="estats">
      ${t.energy ? $(Q(W(e.hass, t.energy), 1, " kWh"), "Total energy", o(t.energy)) : N}
      ${t.power_factor ? $(Q(bn(e, t.power_factor), 0, " %"), "Power factor", o(t.power_factor)) : N}
      ${t.current ? $(Q(W(e.hass, t.current), 2, " A"), "Current", o(t.current)) : N}
      ${t.frequency ? $(Q(W(e.hass, t.frequency), 2, " Hz"), "Frequency", o(t.frequency)) : N}
    </div>
  </section>`;
}, Dn = (e, t, n) => {
	let r = t ? X(e, t.power) : void 0, i = n.map((t) => ({
		m: t,
		w: X(e, t.power)
	})).filter((e) => e.w !== void 0), a = i.reduce((e, t) => e + Math.max(0, t.w), 0), o = r === void 0 ? void 0 : r - a, s = [...i].filter((e) => e.w >= vn).sort((e, t) => t.w - e.w).slice(0, 4), c = Math.max(r ?? 0, s[0]?.w ?? 0, 1), l = n.length - i.length;
	return A`<section class="glass card esum">
    <h2>${q("info", 20)}Right now</h2>
    <div class="esum-figs">
      ${t ? A`<div><b class="n">${Z(r)}</b><span>Whole house</span></div>` : N}
      <div><b class="n">${Z(i.length ? a : void 0)}</b><span>Metered circuits</span></div>
      ${o === void 0 ? N : A`<div><b class="n">${Z(Math.max(0, o))}</b><span>Not metered</span></div>`}
    </div>
    <h3 class="t2">Top consumers</h3>
    ${s.length ? A`<div class="etop">${s.map((t) => A`<button @click=${() => e.moreInfo(t.m.power)}>
            <span class="lbl"><span>${t.m.name}</span><b class="n">${Z(t.w)}</b></span>
            <span class="bar"><span style="width:${Math.round(t.w / c * 100)}%"></span></span>
          </button>`)}</div>` : A`<span class="t2" style="font-size:13px">All circuits in standby.</span>`}
    ${l ? A`<span class="t2" style="font-size:12px;color:var(--atlas-warn)">${l} circuit${l > 1 ? "s" : ""} offline</span>` : N}
  </section>`;
}, On = (e, t) => {
	let n = X(e, t.power), r = t.max_power || yn, i = Tn(e, t, n), a = (t) => t ? () => e.moreInfo(t) : void 0, o = [t.voltage ? Q(W(e.hass, t.voltage), 1, " V") : "", t.frequency ? Q(W(e.hass, t.frequency), 2, " Hz") : ""].filter(Boolean).join(" · ");
	return A`<div class="ecard ${i.cls}">
    <div class="row"><b class="ename">${t.name}</b><span class="estatus ${i.cls}"><i></i>${i.text}</span></div>
    <button class="egauge" aria-label="${t.name} power details" @click=${() => e.moreInfo(t.power)}>
      ${Sn(n === void 0 ? void 0 : n / r, 116, n !== void 0 && n > r * .8)}
      <span class="ev"><b class="n">${Z(n)}</b></span>
    </button>
    <div class="estats sm">
      ${t.energy ? $(Q(W(e.hass, t.energy), 1, " kWh"), "Energy", a(t.energy)) : N}
      ${t.current ? $(Q(W(e.hass, t.current), 2, " A"), "Current", a(t.current)) : N}
      ${t.power_factor ? $(Q(bn(e, t.power_factor), 0, " %"), "PF", a(t.power_factor)) : N}
    </div>
    ${wn(e, t)}
    ${o ? A`<span class="n t2 eextra">${o}</span>` : N}
  </div>`;
}, kn = (e) => {
	let t = h(e.config), n = t.find((e) => e.main), r = t.filter((e) => e !== n), i = r.filter((t) => Tn(e, t, X(e, t.power)).cls === "on").length;
	return A`
    <section class="hero" aria-label="Energy">
      <h1>Energy</h1>
      <p class="n">${r.length} circuit${r.length === 1 ? "" : "s"} metered <span style="opacity:.5">·</span> ${i} consuming now</p>
    </section>
    ${t.length ? A`<div class="energy-top">${n ? En(e, n) : N}${Dn(e, n, r)}</div>
          ${r.length ? A`<section class="glass card" style="gap:14px">
                <div class="row"><h2>Circuits</h2><span class="t2" style="font-size:12px">Tap a value for its history</span></div>
                <div class="egrid">${r.map((t) => On(e, t))}</div>
              </section>` : N}` : A`<section class="glass card"><p class="empty">No energy meters configured. Add them in Edit dashboard > Energy.</p></section>`}
  `;
}, An, jn = {
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
}, Mn = "atlas-home.device", Nn = () => {
	try {
		return JSON.parse(localStorage.getItem(Mn) ?? "{}");
	} catch {
		return {};
	}
}, Pn = (e) => {
	try {
		localStorage.setItem(Mn, JSON.stringify(e));
	} catch {}
}, Fn = (e) => [
	1,
	3,
	5
].map((t) => parseInt(e.slice(t, t + 2), 16)).join(","), In = {}, Ln = class extends I {
	constructor() {
		super(), this._onMq = (e) => this._narrow = e.matches, this._call = async (e, t, n) => {
			try {
				await this.hass.callService(e, t, n);
			} catch (n) {
				f(this, "hass-notification", { message: `ATLAS: ${e}.${t} failed: ${n?.message ?? n}` });
			}
		}, this._settings = !1, this._prefs = Nn(), this._narrow = !1, this._tick = 0;
	}
	setConfig(e) {
		if (!e?.atlas) throw Error("atlas-view is generated by the ATLAS Home dashboard strategy");
		this._config = e;
		let t = e.atlas;
		this._relevant = /* @__PURE__ */ new Set([
			...se(t),
			...(t.alerts?.temperature_rules ?? []).map((e) => e.entity),
			...t.alerts?.exterior_doors ?? [],
			...t.alerts?.interior_doors ?? [],
			...t.alerts?.critical ?? [],
			...[t.alerts?.mailbox, t.alerts?.mailbox_ack].filter((e) => !!e),
			...t.entities?.exclude_lights ?? [],
			...ne(t)
		]), e.view === "room" && this._prepareCamera(y(_(t, e.room)));
		let n = this._floorCameras();
		n.mode === "live" && this._prepareCamera(n.cameras[0]);
	}
	_floorCameras() {
		let e = this._config;
		if (!e || e.view !== "rooms") return {
			mode: "off",
			cameras: []
		};
		let t = re(e.atlas, e.floor) ?? g(e.atlas)[0], n = t?.cameras ?? "off";
		return n === "off" ? {
			mode: n,
			cameras: []
		} : {
			mode: n,
			cameras: v(e.atlas, t.id).map((e) => y(e)).filter((e) => !!e)
		};
	}
	getCardSize() {
		return 12;
	}
	connectedCallback() {
		super.connectedCallback();
		let e = this._config?.view === "home" || this._floorCameras().mode !== "off" ? 1e4 : 3e4;
		this._timer = window.setInterval(() => this._tick = Date.now(), e), this._mq = window.matchMedia("(max-width: 760px)"), this._narrow = this._mq.matches, this._mq.addEventListener("change", this._onMq);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.clearInterval(this._timer), this._mq?.removeEventListener("change", this._onMq), this._ro?.disconnect(), this._wall = void 0;
	}
	_fitPage() {
		let e = this._floorCameras();
		return !this._narrow && e.mode !== "off" && e.cameras.length > 0;
	}
	updated() {
		let e = this.renderRoot.querySelector(".camwall.fitwall") ?? void 0;
		e !== this._wall && (this._ro?.disconnect(), this._wall = e, e && (this._ro = new ResizeObserver(() => this._fitWall(e)), this._ro.observe(e)));
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
			badges: St(e),
			hot: n,
			floorId: t.floor,
			roomId: t.room,
			narrow: this._narrow,
			tick: this._tick,
			go: (e) => d(e),
			href: (e) => l(e),
			openRoom: (e) => d(`room-${typeof e == "string" ? e : e.id}`),
			moreInfo: (e) => ee(this, e),
			call: this._call,
			confirm: (e, t, n, r = "Confirm") => this._confirm = {
				title: e,
				text: t,
				action: n,
				ok: r
			},
			openAlert: (e) => {
				e.room ? d(`room-${e.room}`) : e.entity ? ee(this, e.entity) : e.href ? l(e.href) : d("alerts");
			},
			refresh: () => this.requestUpdate(),
			ui: In
		};
	}
	render() {
		if (!this._config || !this.hass) return N;
		let e = this._config.atlas, t = e.appearance ?? {}, n = this._prefs.variant ?? t.variant ?? "warm_glass", r = this._prefs.accent && /^#[0-9a-fA-F]{6}$/.test(this._prefs.accent) ? this._prefs.accent : oe(e), i = jn[t.ambience ?? "graphite"] ?? jn.graphite, a = Fn(r), o = `--atlas-accent:${r};--atlas-accent-soft:rgba(${a},0.16);--atlas-accent-glow:rgba(${a},0.45);--atlas-tile:${i.tile}`;
		if (!m(e).length) return A`<div class="root v-quiet" style=${o}><div class="frame"><div class="main">
        <section class="glass card" style="max-width:640px;margin:10vh auto;gap:14px">
          <h2 style="font-size:24px">${q("home", 28)}ATLAS Home</h2>
          <p class="t2">No rooms configured yet. Open the dashboard menu, choose <b>Edit dashboard</b>, then <b>Load demo house</b> or paste your own config in YAML mode, and save.</p>
        </section></div></div></div>`;
		let s = xt(this.hass, e), c = this._ctx(s), l = this._config.view, u = l === "room" ? _(e, this._config.room) : void 0, d = n === "warm_glass" ? ae(e, u?.image ? u : _(e, t.background) ?? m(e)[0]) : void 0, f;
		return f = l === "home" ? $t(c) : l === "alerts" ? tn(c) : l === "rooms" ? an(c) : l === "energy" ? kn(c) : _n(c), A`<div class="root v-${n}" style=${o}>
      ${this._background(n, i, d)}
      <div class="frame">
        ${this._sidebar(c)}
        <div class="main ${this._fitPage() ? "fit" : ""}">
          ${this._topbar(c)}
          ${f}
        </div>
      </div>
      ${this._bottomNav(c)}
      ${this._settings ? this._settingsPanel(n, r) : N}
      ${this._confirm ? this._confirmDialog() : N}
    </div>`;
	}
	_background(e, t, n) {
		if (e === "quiet") return A`<div class="bg" style="background:var(--atlas-canvas)"></div>`;
		let r = (e, t, n, r, i, a) => A`<div class="blob" style="left:${e}%;top:${t}%;width:${n}px;height:${r}px;background:${i};filter:blur(${a}px)"></div>`;
		return A`<div class="bg" aria-hidden="true" style="background:linear-gradient(180deg,${t.base[0]} 0%,${t.base[1]} 60%,${t.base[2]} 100%)">
      ${r(4, 2, 520, 380, t.g[0], 90)}${r(62, -6, 640, 420, t.g[1], 100)}${r(78, 40, 300, 300, t.g[2], 70)}${r(30, 55, 700, 360, t.g[3], 80)}
      ${r(12, 18, 60, 60, t.light, 14)}${r(52, 10, 46, 46, t.light, 12)}${r(88, 22, 70, 70, t.light, 16)}${r(70, 78, 50, 50, t.light, 14)}
      ${n ? A`<img class="photo" src=${n} alt="" /><div class="tint" style="background:linear-gradient(180deg,rgba(${t.dark},0.35) 0%,rgba(${t.dark},0.6) 100%)"></div>` : N}
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
				!1,
				() => n.alarm ? e.moreInfo(n.alarm) : void 0
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
				!1,
				() => e.href("/config/system")
			]
		], a = this.hass.user?.name ?? "";
		return A`<aside class="glass">
      <button class="logo" @click=${() => e.go("home")}>${q("home", 34)}<span class="lt"><b>ATLAS</b><small>Smart Home</small></span></button>
      <nav class="nav" aria-label="Main">
        ${i.map(([e, t, n, r]) => A`<button class=${n ? "on" : ""} aria-current=${n ? "page" : "false"} title=${e} @click=${r}>${q(t, 20)}<span class="lbl">${e}</span></button>`)}
      </nav>
      ${a ? A`<div class="user"><span class="avatar">${a.charAt(0).toUpperCase()}</span><span class="lbl">${a}</span></div>` : N}
    </aside>`;
	}
	_topbar(e) {
		let t = this._config.view, n = e.config.entities ?? {}, r = [
			[
				"Home",
				"home",
				t === "home" || t === "alerts"
			],
			...(e.config.layout?.top_tabs ?? []).map((t) => _(e.config, t)).filter((e) => !!e).map((e) => [
				e.name,
				`room-${e.id}`,
				t === "room" && this._config.room === e.id
			]),
			[
				"All rooms",
				"rooms",
				t === "rooms"
			]
		], i = H(this.hass, n.weather), a = W(this.hass, n.outdoor_temperature) ?? (U(i) ? void 0 : Number(i.attributes.temperature)), o = /* @__PURE__ */ new Date(), s = this.hass.locale?.language ?? this.hass.language ?? "en", c = o.toLocaleDateString(s, {
			weekday: "short",
			day: "numeric",
			month: "short"
		}), l = o.toLocaleTimeString(s, {
			hour: "2-digit",
			minute: "2-digit",
			hour12: !1
		});
		return A`<header class="glass top">
      <span class="mlogo">${q("home", 24)}<b>ATLAS</b></span>
      <div class="tabs" role="tablist" aria-label="Views">
        ${r.map(([t, n, r]) => A`<button role="tab" aria-selected=${r ? "true" : "false"} class=${r ? "on" : ""} @click=${() => e.go(n)}>${t}</button>`)}
      </div>
      <div class="tools">
        ${n.weather || n.outdoor_temperature ? A`<button class="weather" @click=${() => n.weather && e.moreInfo(n.weather)}>
              ${Nt(U(i) ? void 0 : i.state)}
              <span><span class="n" style="font-size:15px;font-weight:600">${a !== void 0 && Number.isFinite(a) ? `${a.toFixed(1)} °C` : "–"}</span>
              <span class="t2 wtxt" style="font-size:11px">${i && !U(i) ? K(this.hass, i) : "Weather unavailable"} · ${c}</span></span>
            </button>` : N}
        <span class="clock n">${l}</span>
        <button class="iconbtn" aria-label="Display settings" @click=${() => this._settings = !this._settings}>${q("settings", 22)}</button>
      </div>
    </header>`;
	}
	_energyNav(e) {
		return () => h(e.config).length ? e.go("energy") : e.href("/energy");
	}
	_bottomNav(e) {
		let t = this._config.view, n = e.config.entities ?? {}, r = this._energyNav(e);
		return A`<nav class="glass bnav" aria-label="Main">
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
				"Alerts",
				"alert",
				t === "alerts",
				() => e.go("alerts")
			]
		].map(([e, t, n, r]) => A`<button class=${n ? "on" : ""} @click=${r}>${q(t, 22)}${e}</button>`)}
    </nav>`;
	}
	_settingsPanel(e, t) {
		let n = (e) => {
			this._prefs = {
				...this._prefs,
				...e
			}, Pn(this._prefs);
		};
		return A`<div class="settings" role="dialog" aria-label="Display settings">
      <div class="row"><b>Display on this device</b><button class="iconbtn" aria-label="Close" @click=${() => this._settings = !1}>✕</button></div>
      <span class="t2" style="font-size:12px">Style</span>
      <div class="seg">${[
			["warm_glass", "Warm glass"],
			["glass", "Glass"],
			["quiet", "Quiet"]
		].map(([t, r]) => A`<button class=${e === t ? "on" : ""} @click=${() => n({ variant: t })}>${r}</button>`)}</div>
      <span class="t2" style="font-size:12px">Accent</span>
      <div class="seg">${o.map((e) => A`<button class="sw ${t === e ? "on" : ""}" style="background:${e}" aria-label="Accent ${e}" @click=${() => n({ accent: e })}></button>`)}</div>
      <button class="ctl" @click=${() => {
			this._prefs = {}, Pn({});
		}}>Use dashboard defaults</button>
      <span class="t2" style="font-size:11px">Stored in this browser only. Defaults and all entities are set in Edit dashboard.</span>
    </div>`;
	}
	_confirmDialog() {
		let e = this._confirm, t = () => this._confirm = void 0;
		return A`<div class="scrim" @click=${t}>
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
An = Ln, An.styles = Ct, An.properties = {
	hass: { attribute: !1 },
	_config: { state: !0 },
	_confirm: { state: !0 },
	_settings: { state: !0 },
	_prefs: { state: !0 },
	_narrow: { state: !0 },
	_tick: { state: !0 }
};
// src/ui/embedded-card.ts
var Rn = class extends HTMLElement {
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
p(t, ue), p(n, ht), p(r, Ln), p("atlas-hui-card", Rn);
var zn = window;
zn.customStrategies = zn.customStrategies || [], zn.customStrategies.some((e) => e.type === "atlas-home") || zn.customStrategies.push({
	type: e,
	strategyType: "dashboard",
	name: "ATLAS Home",
	description: "Attention-first house dashboard with rooms, alerts and cameras.",
	documentationURL: "https://github.com/robman2026/AttlasDashboard"
}), console.info(`%c ATLAS HOME %c ${i} `, "background:#56E7C0;color:#14171C;font-weight:700", "background:#252A30;color:#F1F5FF");
