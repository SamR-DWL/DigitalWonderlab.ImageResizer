import { UmbElementMixin as Se } from "@umbraco-cms/backoffice/element-api";
import { UmbMediaTreeRepository as ze } from "@umbraco-cms/backoffice/media";
import { UMB_AUTH_CONTEXT as Ae } from "@umbraco-cms/backoffice/auth";
const Lt = globalThis, Vt = Lt.ShadowRoot && (Lt.ShadyCSS === void 0 || Lt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Yt = /* @__PURE__ */ Symbol(), re = /* @__PURE__ */ new WeakMap();
let _e = class {
  constructor(l, e, f) {
    if (this._$cssResult$ = !0, f !== Yt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = l, this.t = e;
  }
  get styleSheet() {
    let l = this.o;
    const e = this.t;
    if (Vt && l === void 0) {
      const f = e !== void 0 && e.length === 1;
      f && (l = re.get(e)), l === void 0 && ((this.o = l = new CSSStyleSheet()).replaceSync(this.cssText), f && re.set(e, l));
    }
    return l;
  }
  toString() {
    return this.cssText;
  }
};
const Ee = (S) => new _e(typeof S == "string" ? S : S + "", void 0, Yt), Ce = (S, ...l) => {
  const e = S.length === 1 ? S[0] : l.reduce((f, a, r) => f + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + S[r + 1], S[0]);
  return new _e(e, S, Yt);
}, Ie = (S, l) => {
  if (Vt) S.adoptedStyleSheets = l.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of l) {
    const f = document.createElement("style"), a = Lt.litNonce;
    a !== void 0 && f.setAttribute("nonce", a), f.textContent = e.cssText, S.appendChild(f);
  }
}, ne = Vt ? (S) => S : (S) => S instanceof CSSStyleSheet ? ((l) => {
  let e = "";
  for (const f of l.cssRules) e += f.cssText;
  return Ee(e);
})(S) : S;
const { is: $e, defineProperty: Oe, getOwnPropertyDescriptor: Re, getOwnPropertyNames: Te, getOwnPropertySymbols: Be, getPrototypeOf: De } = Object, Ht = globalThis, se = Ht.trustedTypes, Pe = se ? se.emptyScript : "", Me = Ht.reactiveElementPolyfillSupport, Ot = (S, l) => S, jt = { toAttribute(S, l) {
  switch (l) {
    case Boolean:
      S = S ? Pe : null;
      break;
    case Object:
    case Array:
      S = S == null ? S : JSON.stringify(S);
  }
  return S;
}, fromAttribute(S, l) {
  let e = S;
  switch (l) {
    case Boolean:
      e = S !== null;
      break;
    case Number:
      e = S === null ? null : Number(S);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(S);
      } catch {
        e = null;
      }
  }
  return e;
} }, Xt = (S, l) => !$e(S, l), ae = { attribute: !0, type: String, converter: jt, reflect: !1, useDefault: !1, hasChanged: Xt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Ht.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let St = class extends HTMLElement {
  static addInitializer(l) {
    this._$Ei(), (this.l ??= []).push(l);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(l, e = ae) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(l) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(l, e), !e.noAccessor) {
      const f = /* @__PURE__ */ Symbol(), a = this.getPropertyDescriptor(l, f, e);
      a !== void 0 && Oe(this.prototype, l, a);
    }
  }
  static getPropertyDescriptor(l, e, f) {
    const { get: a, set: r } = Re(this.prototype, l) ?? { get() {
      return this[e];
    }, set(s) {
      this[e] = s;
    } };
    return { get: a, set(s) {
      const n = a?.call(this);
      r?.call(this, s), this.requestUpdate(l, n, f);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(l) {
    return this.elementProperties.get(l) ?? ae;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ot("elementProperties"))) return;
    const l = De(this);
    l.finalize(), l.l !== void 0 && (this.l = [...l.l]), this.elementProperties = new Map(l.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ot("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ot("properties"))) {
      const e = this.properties, f = [...Te(e), ...Be(e)];
      for (const a of f) this.createProperty(a, e[a]);
    }
    const l = this[Symbol.metadata];
    if (l !== null) {
      const e = litPropertyMetadata.get(l);
      if (e !== void 0) for (const [f, a] of e) this.elementProperties.set(f, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, f] of this.elementProperties) {
      const a = this._$Eu(e, f);
      a !== void 0 && this._$Eh.set(a, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(l) {
    const e = [];
    if (Array.isArray(l)) {
      const f = new Set(l.flat(1 / 0).reverse());
      for (const a of f) e.unshift(ne(a));
    } else l !== void 0 && e.push(ne(l));
    return e;
  }
  static _$Eu(l, e) {
    const f = e.attribute;
    return f === !1 ? void 0 : typeof f == "string" ? f : typeof l == "string" ? l.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((l) => this.enableUpdating = l), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((l) => l(this));
  }
  addController(l) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(l), this.renderRoot !== void 0 && this.isConnected && l.hostConnected?.();
  }
  removeController(l) {
    this._$EO?.delete(l);
  }
  _$E_() {
    const l = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const f of e.keys()) this.hasOwnProperty(f) && (l.set(f, this[f]), delete this[f]);
    l.size > 0 && (this._$Ep = l);
  }
  createRenderRoot() {
    const l = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ie(l, this.constructor.elementStyles), l;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((l) => l.hostConnected?.());
  }
  enableUpdating(l) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((l) => l.hostDisconnected?.());
  }
  attributeChangedCallback(l, e, f) {
    this._$AK(l, f);
  }
  _$ET(l, e) {
    const f = this.constructor.elementProperties.get(l), a = this.constructor._$Eu(l, f);
    if (a !== void 0 && f.reflect === !0) {
      const r = (f.converter?.toAttribute !== void 0 ? f.converter : jt).toAttribute(e, f.type);
      this._$Em = l, r == null ? this.removeAttribute(a) : this.setAttribute(a, r), this._$Em = null;
    }
  }
  _$AK(l, e) {
    const f = this.constructor, a = f._$Eh.get(l);
    if (a !== void 0 && this._$Em !== a) {
      const r = f.getPropertyOptions(a), s = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : jt;
      this._$Em = a;
      const n = s.fromAttribute(e, r.type);
      this[a] = n ?? this._$Ej?.get(a) ?? n, this._$Em = null;
    }
  }
  requestUpdate(l, e, f, a = !1, r) {
    if (l !== void 0) {
      const s = this.constructor;
      if (a === !1 && (r = this[l]), f ??= s.getPropertyOptions(l), !((f.hasChanged ?? Xt)(r, e) || f.useDefault && f.reflect && r === this._$Ej?.get(l) && !this.hasAttribute(s._$Eu(l, f)))) return;
      this.C(l, e, f);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(l, e, { useDefault: f, reflect: a, wrapped: r }, s) {
    f && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(l) && (this._$Ej.set(l, s ?? e ?? this[l]), r !== !0 || s !== void 0) || (this._$AL.has(l) || (this.hasUpdated || f || (e = void 0), this._$AL.set(l, e)), a === !0 && this._$Em !== l && (this._$Eq ??= /* @__PURE__ */ new Set()).add(l));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const l = this.scheduleUpdate();
    return l != null && await l, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [a, r] of this._$Ep) this[a] = r;
        this._$Ep = void 0;
      }
      const f = this.constructor.elementProperties;
      if (f.size > 0) for (const [a, r] of f) {
        const { wrapped: s } = r, n = this[a];
        s !== !0 || this._$AL.has(a) || n === void 0 || this.C(a, void 0, r, n);
      }
    }
    let l = !1;
    const e = this._$AL;
    try {
      l = this.shouldUpdate(e), l ? (this.willUpdate(e), this._$EO?.forEach((f) => f.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (f) {
      throw l = !1, this._$EM(), f;
    }
    l && this._$AE(e);
  }
  willUpdate(l) {
  }
  _$AE(l) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(l)), this.updated(l);
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
  shouldUpdate(l) {
    return !0;
  }
  update(l) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(l) {
  }
  firstUpdated(l) {
  }
};
St.elementStyles = [], St.shadowRootOptions = { mode: "open" }, St[Ot("elementProperties")] = /* @__PURE__ */ new Map(), St[Ot("finalized")] = /* @__PURE__ */ new Map(), Me?.({ ReactiveElement: St }), (Ht.reactiveElementVersions ??= []).push("2.1.2");
const Jt = globalThis, oe = (S) => S, Wt = Jt.trustedTypes, le = Wt ? Wt.createPolicy("lit-html", { createHTML: (S) => S }) : void 0, ge = "$lit$", vt = `lit$${Math.random().toFixed(9).slice(2)}$`, be = "?" + vt, Fe = `<${be}>`, xt = document, Tt = () => xt.createComment(""), Bt = (S) => S === null || typeof S != "object" && typeof S != "function", Qt = Array.isArray, Ne = (S) => Qt(S) || typeof S?.[Symbol.iterator] == "function", qt = `[ 	
\f\r]`, $t = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, ue = />/g, wt = RegExp(`>|${qt}(?:([^\\s"'>=/]+)(${qt}*=${qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ce = /'/g, de = /"/g, ye = /^(?:script|style|textarea|title)$/i, Ue = (S) => (l, ...e) => ({ _$litType$: S, strings: l, values: e }), ut = Ue(1), zt = /* @__PURE__ */ Symbol.for("lit-noChange"), st = /* @__PURE__ */ Symbol.for("lit-nothing"), fe = /* @__PURE__ */ new WeakMap(), kt = xt.createTreeWalker(xt, 129);
function ve(S, l) {
  if (!Qt(S) || !S.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return le !== void 0 ? le.createHTML(l) : l;
}
const Le = (S, l) => {
  const e = S.length - 1, f = [];
  let a, r = l === 2 ? "<svg>" : l === 3 ? "<math>" : "", s = $t;
  for (let n = 0; n < e; n++) {
    const u = S[n];
    let y, w, g = -1, v = 0;
    for (; v < u.length && (s.lastIndex = v, w = s.exec(u), w !== null); ) v = s.lastIndex, s === $t ? w[1] === "!--" ? s = he : w[1] !== void 0 ? s = ue : w[2] !== void 0 ? (ye.test(w[2]) && (a = RegExp("</" + w[2], "g")), s = wt) : w[3] !== void 0 && (s = wt) : s === wt ? w[0] === ">" ? (s = a ?? $t, g = -1) : w[1] === void 0 ? g = -2 : (g = s.lastIndex - w[2].length, y = w[1], s = w[3] === void 0 ? wt : w[3] === '"' ? de : ce) : s === de || s === ce ? s = wt : s === he || s === ue ? s = $t : (s = wt, a = void 0);
    const o = s === wt && S[n + 1].startsWith("/>") ? " " : "";
    r += s === $t ? u + Fe : g >= 0 ? (f.push(y), u.slice(0, g) + ge + u.slice(g) + vt + o) : u + vt + (g === -2 ? n : o);
  }
  return [ve(S, r + (S[e] || "<?>") + (l === 2 ? "</svg>" : l === 3 ? "</math>" : "")), f];
};
class Dt {
  constructor({ strings: l, _$litType$: e }, f) {
    let a;
    this.parts = [];
    let r = 0, s = 0;
    const n = l.length - 1, u = this.parts, [y, w] = Le(l, e);
    if (this.el = Dt.createElement(y, f), kt.currentNode = this.el.content, e === 2 || e === 3) {
      const g = this.el.content.firstChild;
      g.replaceWith(...g.childNodes);
    }
    for (; (a = kt.nextNode()) !== null && u.length < n; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const g of a.getAttributeNames()) if (g.endsWith(ge)) {
          const v = w[s++], o = a.getAttribute(g).split(vt), _ = /([.?@])?(.*)/.exec(v);
          u.push({ type: 1, index: r, name: _[2], strings: o, ctor: _[1] === "." ? We : _[1] === "?" ? He : _[1] === "@" ? Ze : Zt }), a.removeAttribute(g);
        } else g.startsWith(vt) && (u.push({ type: 6, index: r }), a.removeAttribute(g));
        if (ye.test(a.tagName)) {
          const g = a.textContent.split(vt), v = g.length - 1;
          if (v > 0) {
            a.textContent = Wt ? Wt.emptyScript : "";
            for (let o = 0; o < v; o++) a.append(g[o], Tt()), kt.nextNode(), u.push({ type: 2, index: ++r });
            a.append(g[v], Tt());
          }
        }
      } else if (a.nodeType === 8) if (a.data === be) u.push({ type: 2, index: r });
      else {
        let g = -1;
        for (; (g = a.data.indexOf(vt, g + 1)) !== -1; ) u.push({ type: 7, index: r }), g += vt.length - 1;
      }
      r++;
    }
  }
  static createElement(l, e) {
    const f = xt.createElement("template");
    return f.innerHTML = l, f;
  }
}
function At(S, l, e = S, f) {
  if (l === zt) return l;
  let a = f !== void 0 ? e._$Co?.[f] : e._$Cl;
  const r = Bt(l) ? void 0 : l._$litDirective$;
  return a?.constructor !== r && (a?._$AO?.(!1), r === void 0 ? a = void 0 : (a = new r(S), a._$AT(S, e, f)), f !== void 0 ? (e._$Co ??= [])[f] = a : e._$Cl = a), a !== void 0 && (l = At(S, a._$AS(S, l.values), a, f)), l;
}
class je {
  constructor(l, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = l, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(l) {
    const { el: { content: e }, parts: f } = this._$AD, a = (l?.creationScope ?? xt).importNode(e, !0);
    kt.currentNode = a;
    let r = kt.nextNode(), s = 0, n = 0, u = f[0];
    for (; u !== void 0; ) {
      if (s === u.index) {
        let y;
        u.type === 2 ? y = new Pt(r, r.nextSibling, this, l) : u.type === 1 ? y = new u.ctor(r, u.name, u.strings, this, l) : u.type === 6 && (y = new Ge(r, this, l)), this._$AV.push(y), u = f[++n];
      }
      s !== u?.index && (r = kt.nextNode(), s++);
    }
    return kt.currentNode = xt, a;
  }
  p(l) {
    let e = 0;
    for (const f of this._$AV) f !== void 0 && (f.strings !== void 0 ? (f._$AI(l, f, e), e += f.strings.length - 2) : f._$AI(l[e])), e++;
  }
}
class Pt {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(l, e, f, a) {
    this.type = 2, this._$AH = st, this._$AN = void 0, this._$AA = l, this._$AB = e, this._$AM = f, this.options = a, this._$Cv = a?.isConnected ?? !0;
  }
  get parentNode() {
    let l = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && l?.nodeType === 11 && (l = e.parentNode), l;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(l, e = this) {
    l = At(this, l, e), Bt(l) ? l === st || l == null || l === "" ? (this._$AH !== st && this._$AR(), this._$AH = st) : l !== this._$AH && l !== zt && this._(l) : l._$litType$ !== void 0 ? this.$(l) : l.nodeType !== void 0 ? this.T(l) : Ne(l) ? this.k(l) : this._(l);
  }
  O(l) {
    return this._$AA.parentNode.insertBefore(l, this._$AB);
  }
  T(l) {
    this._$AH !== l && (this._$AR(), this._$AH = this.O(l));
  }
  _(l) {
    this._$AH !== st && Bt(this._$AH) ? this._$AA.nextSibling.data = l : this.T(xt.createTextNode(l)), this._$AH = l;
  }
  $(l) {
    const { values: e, _$litType$: f } = l, a = typeof f == "number" ? this._$AC(l) : (f.el === void 0 && (f.el = Dt.createElement(ve(f.h, f.h[0]), this.options)), f);
    if (this._$AH?._$AD === a) this._$AH.p(e);
    else {
      const r = new je(a, this), s = r.u(this.options);
      r.p(e), this.T(s), this._$AH = r;
    }
  }
  _$AC(l) {
    let e = fe.get(l.strings);
    return e === void 0 && fe.set(l.strings, e = new Dt(l)), e;
  }
  k(l) {
    Qt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let f, a = 0;
    for (const r of l) a === e.length ? e.push(f = new Pt(this.O(Tt()), this.O(Tt()), this, this.options)) : f = e[a], f._$AI(r), a++;
    a < e.length && (this._$AR(f && f._$AB.nextSibling, a), e.length = a);
  }
  _$AR(l = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); l !== this._$AB; ) {
      const f = oe(l).nextSibling;
      oe(l).remove(), l = f;
    }
  }
  setConnected(l) {
    this._$AM === void 0 && (this._$Cv = l, this._$AP?.(l));
  }
}
class Zt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(l, e, f, a, r) {
    this.type = 1, this._$AH = st, this._$AN = void 0, this.element = l, this.name = e, this._$AM = a, this.options = r, f.length > 2 || f[0] !== "" || f[1] !== "" ? (this._$AH = Array(f.length - 1).fill(new String()), this.strings = f) : this._$AH = st;
  }
  _$AI(l, e = this, f, a) {
    const r = this.strings;
    let s = !1;
    if (r === void 0) l = At(this, l, e, 0), s = !Bt(l) || l !== this._$AH && l !== zt, s && (this._$AH = l);
    else {
      const n = l;
      let u, y;
      for (l = r[0], u = 0; u < r.length - 1; u++) y = At(this, n[f + u], e, u), y === zt && (y = this._$AH[u]), s ||= !Bt(y) || y !== this._$AH[u], y === st ? l = st : l !== st && (l += (y ?? "") + r[u + 1]), this._$AH[u] = y;
    }
    s && !a && this.j(l);
  }
  j(l) {
    l === st ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, l ?? "");
  }
}
class We extends Zt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(l) {
    this.element[this.name] = l === st ? void 0 : l;
  }
}
class He extends Zt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(l) {
    this.element.toggleAttribute(this.name, !!l && l !== st);
  }
}
class Ze extends Zt {
  constructor(l, e, f, a, r) {
    super(l, e, f, a, r), this.type = 5;
  }
  _$AI(l, e = this) {
    if ((l = At(this, l, e, 0) ?? st) === zt) return;
    const f = this._$AH, a = l === st && f !== st || l.capture !== f.capture || l.once !== f.once || l.passive !== f.passive, r = l !== st && (f === st || a);
    a && this.element.removeEventListener(this.name, this, f), r && this.element.addEventListener(this.name, this, l), this._$AH = l;
  }
  handleEvent(l) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, l) : this._$AH.handleEvent(l);
  }
}
class Ge {
  constructor(l, e, f) {
    this.element = l, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = f;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(l) {
    At(this, l);
  }
}
const qe = Jt.litHtmlPolyfillSupport;
qe?.(Dt, Pt), (Jt.litHtmlVersions ??= []).push("3.3.2");
const Ke = (S, l, e) => {
  const f = e?.renderBefore ?? l;
  let a = f._$litPart$;
  if (a === void 0) {
    const r = e?.renderBefore ?? null;
    f._$litPart$ = a = new Pt(l.insertBefore(Tt(), r), r, void 0, e ?? {});
  }
  return a._$AI(S), a;
};
const te = globalThis;
class Rt extends St {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const l = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= l.firstChild, l;
  }
  update(l) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(l), this._$Do = Ke(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return zt;
  }
}
Rt._$litElement$ = !0, Rt.finalized = !0, te.litElementHydrateSupport?.({ LitElement: Rt });
const Ve = te.litElementPolyfillSupport;
Ve?.({ LitElement: Rt });
(te.litElementVersions ??= []).push("4.2.2");
const Ye = (S) => (l, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(S, l);
  }) : customElements.define(S, l);
};
const Xe = { attribute: !0, type: String, converter: jt, reflect: !1, hasChanged: Xt }, Je = (S = Xe, l, e) => {
  const { kind: f, metadata: a } = e;
  let r = globalThis.litPropertyMetadata.get(a);
  if (r === void 0 && globalThis.litPropertyMetadata.set(a, r = /* @__PURE__ */ new Map()), f === "setter" && ((S = Object.create(S)).wrapped = !0), r.set(e.name, S), f === "accessor") {
    const { name: s } = e;
    return { set(n) {
      const u = l.get.call(this);
      l.set.call(this, n), this.requestUpdate(s, u, S, !0, n);
    }, init(n) {
      return n !== void 0 && this.C(s, void 0, S, n), n;
    } };
  }
  if (f === "setter") {
    const { name: s } = e;
    return function(n) {
      const u = this[s];
      l.call(this, n), this.requestUpdate(s, u, S, !0, n);
    };
  }
  throw Error("Unsupported decorator location: " + f);
};
function Qe(S) {
  return (l, e) => typeof e == "object" ? Je(S, l, e) : ((f, a, r) => {
    const s = a.hasOwnProperty(r);
    return a.constructor.createProperty(r, f), s ? Object.getOwnPropertyDescriptor(a, r) : void 0;
  })(S, l, e);
}
function ft(S) {
  return Qe({ ...S, state: !0, attribute: !1 });
}
var Nt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ti(S) {
  return S && S.__esModule && Object.prototype.hasOwnProperty.call(S, "default") ? S.default : S;
}
function Ut(S) {
  throw new Error('Could not dynamically require "' + S + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Kt = { exports: {} };
var pe;
function ei() {
  return pe || (pe = 1, (function(S, l) {
    (function(e) {
      S.exports = e();
    })(function() {
      return (function e(f, a, r) {
        function s(y, w) {
          if (!a[y]) {
            if (!f[y]) {
              var g = typeof Ut == "function" && Ut;
              if (!w && g) return g(y, !0);
              if (n) return n(y, !0);
              var v = new Error("Cannot find module '" + y + "'");
              throw v.code = "MODULE_NOT_FOUND", v;
            }
            var o = a[y] = { exports: {} };
            f[y][0].call(o.exports, function(_) {
              var h = f[y][1][_];
              return s(h || _);
            }, o, o.exports, e, f, a, r);
          }
          return a[y].exports;
        }
        for (var n = typeof Ut == "function" && Ut, u = 0; u < r.length; u++) s(r[u]);
        return s;
      })({ 1: [function(e, f, a) {
        var r = e("./utils"), s = e("./support"), n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        a.encode = function(u) {
          for (var y, w, g, v, o, _, h, p = [], c = 0, b = u.length, x = b, E = r.getTypeOf(u) !== "string"; c < u.length; ) x = b - c, g = E ? (y = u[c++], w = c < b ? u[c++] : 0, c < b ? u[c++] : 0) : (y = u.charCodeAt(c++), w = c < b ? u.charCodeAt(c++) : 0, c < b ? u.charCodeAt(c++) : 0), v = y >> 2, o = (3 & y) << 4 | w >> 4, _ = 1 < x ? (15 & w) << 2 | g >> 6 : 64, h = 2 < x ? 63 & g : 64, p.push(n.charAt(v) + n.charAt(o) + n.charAt(_) + n.charAt(h));
          return p.join("");
        }, a.decode = function(u) {
          var y, w, g, v, o, _, h = 0, p = 0, c = "data:";
          if (u.substr(0, c.length) === c) throw new Error("Invalid base64 input, it looks like a data url.");
          var b, x = 3 * (u = u.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (u.charAt(u.length - 1) === n.charAt(64) && x--, u.charAt(u.length - 2) === n.charAt(64) && x--, x % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (b = s.uint8array ? new Uint8Array(0 | x) : new Array(0 | x); h < u.length; ) y = n.indexOf(u.charAt(h++)) << 2 | (v = n.indexOf(u.charAt(h++))) >> 4, w = (15 & v) << 4 | (o = n.indexOf(u.charAt(h++))) >> 2, g = (3 & o) << 6 | (_ = n.indexOf(u.charAt(h++))), b[p++] = y, o !== 64 && (b[p++] = w), _ !== 64 && (b[p++] = g);
          return b;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, f, a) {
        var r = e("./external"), s = e("./stream/DataWorker"), n = e("./stream/Crc32Probe"), u = e("./stream/DataLengthProbe");
        function y(w, g, v, o, _) {
          this.compressedSize = w, this.uncompressedSize = g, this.crc32 = v, this.compression = o, this.compressedContent = _;
        }
        y.prototype = { getContentWorker: function() {
          var w = new s(r.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new u("data_length")), g = this;
          return w.on("end", function() {
            if (this.streamInfo.data_length !== g.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), w;
        }, getCompressedWorker: function() {
          return new s(r.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, y.createWorkerFrom = function(w, g, v) {
          return w.pipe(new n()).pipe(new u("uncompressedSize")).pipe(g.compressWorker(v)).pipe(new u("compressedSize")).withStreamInfo("compression", g);
        }, f.exports = y;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, f, a) {
        var r = e("./stream/GenericWorker");
        a.STORE = { magic: "\0\0", compressWorker: function() {
          return new r("STORE compression");
        }, uncompressWorker: function() {
          return new r("STORE decompression");
        } }, a.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, f, a) {
        var r = e("./utils"), s = (function() {
          for (var n, u = [], y = 0; y < 256; y++) {
            n = y;
            for (var w = 0; w < 8; w++) n = 1 & n ? 3988292384 ^ n >>> 1 : n >>> 1;
            u[y] = n;
          }
          return u;
        })();
        f.exports = function(n, u) {
          return n !== void 0 && n.length ? r.getTypeOf(n) !== "string" ? (function(y, w, g, v) {
            var o = s, _ = v + g;
            y ^= -1;
            for (var h = v; h < _; h++) y = y >>> 8 ^ o[255 & (y ^ w[h])];
            return -1 ^ y;
          })(0 | u, n, n.length, 0) : (function(y, w, g, v) {
            var o = s, _ = v + g;
            y ^= -1;
            for (var h = v; h < _; h++) y = y >>> 8 ^ o[255 & (y ^ w.charCodeAt(h))];
            return -1 ^ y;
          })(0 | u, n, n.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, f, a) {
        a.base64 = !1, a.binary = !1, a.dir = !1, a.createFolders = !0, a.date = null, a.compression = null, a.compressionOptions = null, a.comment = null, a.unixPermissions = null, a.dosPermissions = null;
      }, {}], 6: [function(e, f, a) {
        var r = null;
        r = typeof Promise < "u" ? Promise : e("lie"), f.exports = { Promise: r };
      }, { lie: 37 }], 7: [function(e, f, a) {
        var r = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", s = e("pako"), n = e("./utils"), u = e("./stream/GenericWorker"), y = r ? "uint8array" : "array";
        function w(g, v) {
          u.call(this, "FlateWorker/" + g), this._pako = null, this._pakoAction = g, this._pakoOptions = v, this.meta = {};
        }
        a.magic = "\b\0", n.inherits(w, u), w.prototype.processChunk = function(g) {
          this.meta = g.meta, this._pako === null && this._createPako(), this._pako.push(n.transformTo(y, g.data), !1);
        }, w.prototype.flush = function() {
          u.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, w.prototype.cleanUp = function() {
          u.prototype.cleanUp.call(this), this._pako = null;
        }, w.prototype._createPako = function() {
          this._pako = new s[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var g = this;
          this._pako.onData = function(v) {
            g.push({ data: v, meta: g.meta });
          };
        }, a.compressWorker = function(g) {
          return new w("Deflate", g);
        }, a.uncompressWorker = function() {
          return new w("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, f, a) {
        function r(o, _) {
          var h, p = "";
          for (h = 0; h < _; h++) p += String.fromCharCode(255 & o), o >>>= 8;
          return p;
        }
        function s(o, _, h, p, c, b) {
          var x, E, A = o.file, M = o.compression, T = b !== y.utf8encode, L = n.transformTo("string", b(A.name)), R = n.transformTo("string", y.utf8encode(A.name)), H = A.comment, X = n.transformTo("string", b(H)), k = n.transformTo("string", y.utf8encode(H)), B = R.length !== A.name.length, i = k.length !== H.length, P = "", Q = "", U = "", tt = A.dir, j = A.date, J = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          _ && !h || (J.crc32 = o.crc32, J.compressedSize = o.compressedSize, J.uncompressedSize = o.uncompressedSize);
          var $ = 0;
          _ && ($ |= 8), T || !B && !i || ($ |= 2048);
          var I = 0, Y = 0;
          tt && (I |= 16), c === "UNIX" ? (Y = 798, I |= (function(G, at) {
            var pt = G;
            return G || (pt = at ? 16893 : 33204), (65535 & pt) << 16;
          })(A.unixPermissions, tt)) : (Y = 20, I |= (function(G) {
            return 63 & (G || 0);
          })(A.dosPermissions)), x = j.getUTCHours(), x <<= 6, x |= j.getUTCMinutes(), x <<= 5, x |= j.getUTCSeconds() / 2, E = j.getUTCFullYear() - 1980, E <<= 4, E |= j.getUTCMonth() + 1, E <<= 5, E |= j.getUTCDate(), B && (Q = r(1, 1) + r(w(L), 4) + R, P += "up" + r(Q.length, 2) + Q), i && (U = r(1, 1) + r(w(X), 4) + k, P += "uc" + r(U.length, 2) + U);
          var q = "";
          return q += `
\0`, q += r($, 2), q += M.magic, q += r(x, 2), q += r(E, 2), q += r(J.crc32, 4), q += r(J.compressedSize, 4), q += r(J.uncompressedSize, 4), q += r(L.length, 2), q += r(P.length, 2), { fileRecord: g.LOCAL_FILE_HEADER + q + L + P, dirRecord: g.CENTRAL_FILE_HEADER + r(Y, 2) + q + r(X.length, 2) + "\0\0\0\0" + r(I, 4) + r(p, 4) + L + P + X };
        }
        var n = e("../utils"), u = e("../stream/GenericWorker"), y = e("../utf8"), w = e("../crc32"), g = e("../signature");
        function v(o, _, h, p) {
          u.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = _, this.zipPlatform = h, this.encodeFileName = p, this.streamFiles = o, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        n.inherits(v, u), v.prototype.push = function(o) {
          var _ = o.meta.percent || 0, h = this.entriesCount, p = this._sources.length;
          this.accumulate ? this.contentBuffer.push(o) : (this.bytesWritten += o.data.length, u.prototype.push.call(this, { data: o.data, meta: { currentFile: this.currentFile, percent: h ? (_ + 100 * (h - p - 1)) / h : 100 } }));
        }, v.prototype.openedSource = function(o) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = o.file.name;
          var _ = this.streamFiles && !o.file.dir;
          if (_) {
            var h = s(o, _, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: h.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, v.prototype.closedSource = function(o) {
          this.accumulate = !1;
          var _ = this.streamFiles && !o.file.dir, h = s(o, _, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(h.dirRecord), _) this.push({ data: (function(p) {
            return g.DATA_DESCRIPTOR + r(p.crc32, 4) + r(p.compressedSize, 4) + r(p.uncompressedSize, 4);
          })(o), meta: { percent: 100 } });
          else for (this.push({ data: h.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, v.prototype.flush = function() {
          for (var o = this.bytesWritten, _ = 0; _ < this.dirRecords.length; _++) this.push({ data: this.dirRecords[_], meta: { percent: 100 } });
          var h = this.bytesWritten - o, p = (function(c, b, x, E, A) {
            var M = n.transformTo("string", A(E));
            return g.CENTRAL_DIRECTORY_END + "\0\0\0\0" + r(c, 2) + r(c, 2) + r(b, 4) + r(x, 4) + r(M.length, 2) + M;
          })(this.dirRecords.length, h, o, this.zipComment, this.encodeFileName);
          this.push({ data: p, meta: { percent: 100 } });
        }, v.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, v.prototype.registerPrevious = function(o) {
          this._sources.push(o);
          var _ = this;
          return o.on("data", function(h) {
            _.processChunk(h);
          }), o.on("end", function() {
            _.closedSource(_.previous.streamInfo), _._sources.length ? _.prepareNextSource() : _.end();
          }), o.on("error", function(h) {
            _.error(h);
          }), this;
        }, v.prototype.resume = function() {
          return !!u.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, v.prototype.error = function(o) {
          var _ = this._sources;
          if (!u.prototype.error.call(this, o)) return !1;
          for (var h = 0; h < _.length; h++) try {
            _[h].error(o);
          } catch {
          }
          return !0;
        }, v.prototype.lock = function() {
          u.prototype.lock.call(this);
          for (var o = this._sources, _ = 0; _ < o.length; _++) o[_].lock();
        }, f.exports = v;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, f, a) {
        var r = e("../compressions"), s = e("./ZipFileWorker");
        a.generateWorker = function(n, u, y) {
          var w = new s(u.streamFiles, y, u.platform, u.encodeFileName), g = 0;
          try {
            n.forEach(function(v, o) {
              g++;
              var _ = (function(b, x) {
                var E = b || x, A = r[E];
                if (!A) throw new Error(E + " is not a valid compression method !");
                return A;
              })(o.options.compression, u.compression), h = o.options.compressionOptions || u.compressionOptions || {}, p = o.dir, c = o.date;
              o._compressWorker(_, h).withStreamInfo("file", { name: v, dir: p, date: c, comment: o.comment || "", unixPermissions: o.unixPermissions, dosPermissions: o.dosPermissions }).pipe(w);
            }), w.entriesCount = g;
          } catch (v) {
            w.error(v);
          }
          return w;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, f, a) {
        function r() {
          if (!(this instanceof r)) return new r();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var s = new r();
            for (var n in this) typeof this[n] != "function" && (s[n] = this[n]);
            return s;
          };
        }
        (r.prototype = e("./object")).loadAsync = e("./load"), r.support = e("./support"), r.defaults = e("./defaults"), r.version = "3.10.1", r.loadAsync = function(s, n) {
          return new r().loadAsync(s, n);
        }, r.external = e("./external"), f.exports = r;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, f, a) {
        var r = e("./utils"), s = e("./external"), n = e("./utf8"), u = e("./zipEntries"), y = e("./stream/Crc32Probe"), w = e("./nodejsUtils");
        function g(v) {
          return new s.Promise(function(o, _) {
            var h = v.decompressed.getContentWorker().pipe(new y());
            h.on("error", function(p) {
              _(p);
            }).on("end", function() {
              h.streamInfo.crc32 !== v.decompressed.crc32 ? _(new Error("Corrupted zip : CRC32 mismatch")) : o();
            }).resume();
          });
        }
        f.exports = function(v, o) {
          var _ = this;
          return o = r.extend(o || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: n.utf8decode }), w.isNode && w.isStream(v) ? s.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : r.prepareContent("the loaded zip file", v, !0, o.optimizedBinaryString, o.base64).then(function(h) {
            var p = new u(o);
            return p.load(h), p;
          }).then(function(h) {
            var p = [s.Promise.resolve(h)], c = h.files;
            if (o.checkCRC32) for (var b = 0; b < c.length; b++) p.push(g(c[b]));
            return s.Promise.all(p);
          }).then(function(h) {
            for (var p = h.shift(), c = p.files, b = 0; b < c.length; b++) {
              var x = c[b], E = x.fileNameStr, A = r.resolve(x.fileNameStr);
              _.file(A, x.decompressed, { binary: !0, optimizedBinaryString: !0, date: x.date, dir: x.dir, comment: x.fileCommentStr.length ? x.fileCommentStr : null, unixPermissions: x.unixPermissions, dosPermissions: x.dosPermissions, createFolders: o.createFolders }), x.dir || (_.file(A).unsafeOriginalName = E);
            }
            return p.zipComment.length && (_.comment = p.zipComment), _;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, f, a) {
        var r = e("../utils"), s = e("../stream/GenericWorker");
        function n(u, y) {
          s.call(this, "Nodejs stream input adapter for " + u), this._upstreamEnded = !1, this._bindStream(y);
        }
        r.inherits(n, s), n.prototype._bindStream = function(u) {
          var y = this;
          (this._stream = u).pause(), u.on("data", function(w) {
            y.push({ data: w, meta: { percent: 0 } });
          }).on("error", function(w) {
            y.isPaused ? this.generatedError = w : y.error(w);
          }).on("end", function() {
            y.isPaused ? y._upstreamEnded = !0 : y.end();
          });
        }, n.prototype.pause = function() {
          return !!s.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, n.prototype.resume = function() {
          return !!s.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, f.exports = n;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, f, a) {
        var r = e("readable-stream").Readable;
        function s(n, u, y) {
          r.call(this, u), this._helper = n;
          var w = this;
          n.on("data", function(g, v) {
            w.push(g) || w._helper.pause(), y && y(v);
          }).on("error", function(g) {
            w.emit("error", g);
          }).on("end", function() {
            w.push(null);
          });
        }
        e("../utils").inherits(s, r), s.prototype._read = function() {
          this._helper.resume();
        }, f.exports = s;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, f, a) {
        f.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(r, s) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(r, s);
          if (typeof r == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(r, s);
        }, allocBuffer: function(r) {
          if (Buffer.alloc) return Buffer.alloc(r);
          var s = new Buffer(r);
          return s.fill(0), s;
        }, isBuffer: function(r) {
          return Buffer.isBuffer(r);
        }, isStream: function(r) {
          return r && typeof r.on == "function" && typeof r.pause == "function" && typeof r.resume == "function";
        } };
      }, {}], 15: [function(e, f, a) {
        function r(A, M, T) {
          var L, R = n.getTypeOf(M), H = n.extend(T || {}, w);
          H.date = H.date || /* @__PURE__ */ new Date(), H.compression !== null && (H.compression = H.compression.toUpperCase()), typeof H.unixPermissions == "string" && (H.unixPermissions = parseInt(H.unixPermissions, 8)), H.unixPermissions && 16384 & H.unixPermissions && (H.dir = !0), H.dosPermissions && 16 & H.dosPermissions && (H.dir = !0), H.dir && (A = c(A)), H.createFolders && (L = p(A)) && b.call(this, L, !0);
          var X = R === "string" && H.binary === !1 && H.base64 === !1;
          T && T.binary !== void 0 || (H.binary = !X), (M instanceof g && M.uncompressedSize === 0 || H.dir || !M || M.length === 0) && (H.base64 = !1, H.binary = !0, M = "", H.compression = "STORE", R = "string");
          var k = null;
          k = M instanceof g || M instanceof u ? M : _.isNode && _.isStream(M) ? new h(A, M) : n.prepareContent(A, M, H.binary, H.optimizedBinaryString, H.base64);
          var B = new v(A, k, H);
          this.files[A] = B;
        }
        var s = e("./utf8"), n = e("./utils"), u = e("./stream/GenericWorker"), y = e("./stream/StreamHelper"), w = e("./defaults"), g = e("./compressedObject"), v = e("./zipObject"), o = e("./generate"), _ = e("./nodejsUtils"), h = e("./nodejs/NodejsStreamInputAdapter"), p = function(A) {
          A.slice(-1) === "/" && (A = A.substring(0, A.length - 1));
          var M = A.lastIndexOf("/");
          return 0 < M ? A.substring(0, M) : "";
        }, c = function(A) {
          return A.slice(-1) !== "/" && (A += "/"), A;
        }, b = function(A, M) {
          return M = M !== void 0 ? M : w.createFolders, A = c(A), this.files[A] || r.call(this, A, null, { dir: !0, createFolders: M }), this.files[A];
        };
        function x(A) {
          return Object.prototype.toString.call(A) === "[object RegExp]";
        }
        var E = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(A) {
          var M, T, L;
          for (M in this.files) L = this.files[M], (T = M.slice(this.root.length, M.length)) && M.slice(0, this.root.length) === this.root && A(T, L);
        }, filter: function(A) {
          var M = [];
          return this.forEach(function(T, L) {
            A(T, L) && M.push(L);
          }), M;
        }, file: function(A, M, T) {
          if (arguments.length !== 1) return A = this.root + A, r.call(this, A, M, T), this;
          if (x(A)) {
            var L = A;
            return this.filter(function(H, X) {
              return !X.dir && L.test(H);
            });
          }
          var R = this.files[this.root + A];
          return R && !R.dir ? R : null;
        }, folder: function(A) {
          if (!A) return this;
          if (x(A)) return this.filter(function(R, H) {
            return H.dir && A.test(R);
          });
          var M = this.root + A, T = b.call(this, M), L = this.clone();
          return L.root = T.name, L;
        }, remove: function(A) {
          A = this.root + A;
          var M = this.files[A];
          if (M || (A.slice(-1) !== "/" && (A += "/"), M = this.files[A]), M && !M.dir) delete this.files[A];
          else for (var T = this.filter(function(R, H) {
            return H.name.slice(0, A.length) === A;
          }), L = 0; L < T.length; L++) delete this.files[T[L].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(A) {
          var M, T = {};
          try {
            if ((T = n.extend(A || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: s.utf8encode })).type = T.type.toLowerCase(), T.compression = T.compression.toUpperCase(), T.type === "binarystring" && (T.type = "string"), !T.type) throw new Error("No output type specified.");
            n.checkSupport(T.type), T.platform !== "darwin" && T.platform !== "freebsd" && T.platform !== "linux" && T.platform !== "sunos" || (T.platform = "UNIX"), T.platform === "win32" && (T.platform = "DOS");
            var L = T.comment || this.comment || "";
            M = o.generateWorker(this, T, L);
          } catch (R) {
            (M = new u("error")).error(R);
          }
          return new y(M, T.type || "string", T.mimeType);
        }, generateAsync: function(A, M) {
          return this.generateInternalStream(A).accumulate(M);
        }, generateNodeStream: function(A, M) {
          return (A = A || {}).type || (A.type = "nodebuffer"), this.generateInternalStream(A).toNodejsStream(M);
        } };
        f.exports = E;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, f, a) {
        f.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, f, a) {
        var r = e("./DataReader");
        function s(n) {
          r.call(this, n);
          for (var u = 0; u < this.data.length; u++) n[u] = 255 & n[u];
        }
        e("../utils").inherits(s, r), s.prototype.byteAt = function(n) {
          return this.data[this.zero + n];
        }, s.prototype.lastIndexOfSignature = function(n) {
          for (var u = n.charCodeAt(0), y = n.charCodeAt(1), w = n.charCodeAt(2), g = n.charCodeAt(3), v = this.length - 4; 0 <= v; --v) if (this.data[v] === u && this.data[v + 1] === y && this.data[v + 2] === w && this.data[v + 3] === g) return v - this.zero;
          return -1;
        }, s.prototype.readAndCheckSignature = function(n) {
          var u = n.charCodeAt(0), y = n.charCodeAt(1), w = n.charCodeAt(2), g = n.charCodeAt(3), v = this.readData(4);
          return u === v[0] && y === v[1] && w === v[2] && g === v[3];
        }, s.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return [];
          var u = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, u;
        }, f.exports = s;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, f, a) {
        var r = e("../utils");
        function s(n) {
          this.data = n, this.length = n.length, this.index = 0, this.zero = 0;
        }
        s.prototype = { checkOffset: function(n) {
          this.checkIndex(this.index + n);
        }, checkIndex: function(n) {
          if (this.length < this.zero + n || n < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + n + "). Corrupted zip ?");
        }, setIndex: function(n) {
          this.checkIndex(n), this.index = n;
        }, skip: function(n) {
          this.setIndex(this.index + n);
        }, byteAt: function() {
        }, readInt: function(n) {
          var u, y = 0;
          for (this.checkOffset(n), u = this.index + n - 1; u >= this.index; u--) y = (y << 8) + this.byteAt(u);
          return this.index += n, y;
        }, readString: function(n) {
          return r.transformTo("string", this.readData(n));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var n = this.readInt(4);
          return new Date(Date.UTC(1980 + (n >> 25 & 127), (n >> 21 & 15) - 1, n >> 16 & 31, n >> 11 & 31, n >> 5 & 63, (31 & n) << 1));
        } }, f.exports = s;
      }, { "../utils": 32 }], 19: [function(e, f, a) {
        var r = e("./Uint8ArrayReader");
        function s(n) {
          r.call(this, n);
        }
        e("../utils").inherits(s, r), s.prototype.readData = function(n) {
          this.checkOffset(n);
          var u = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, u;
        }, f.exports = s;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, f, a) {
        var r = e("./DataReader");
        function s(n) {
          r.call(this, n);
        }
        e("../utils").inherits(s, r), s.prototype.byteAt = function(n) {
          return this.data.charCodeAt(this.zero + n);
        }, s.prototype.lastIndexOfSignature = function(n) {
          return this.data.lastIndexOf(n) - this.zero;
        }, s.prototype.readAndCheckSignature = function(n) {
          return n === this.readData(4);
        }, s.prototype.readData = function(n) {
          this.checkOffset(n);
          var u = this.data.slice(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, u;
        }, f.exports = s;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, f, a) {
        var r = e("./ArrayReader");
        function s(n) {
          r.call(this, n);
        }
        e("../utils").inherits(s, r), s.prototype.readData = function(n) {
          if (this.checkOffset(n), n === 0) return new Uint8Array(0);
          var u = this.data.subarray(this.zero + this.index, this.zero + this.index + n);
          return this.index += n, u;
        }, f.exports = s;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, f, a) {
        var r = e("../utils"), s = e("../support"), n = e("./ArrayReader"), u = e("./StringReader"), y = e("./NodeBufferReader"), w = e("./Uint8ArrayReader");
        f.exports = function(g) {
          var v = r.getTypeOf(g);
          return r.checkSupport(v), v !== "string" || s.uint8array ? v === "nodebuffer" ? new y(g) : s.uint8array ? new w(r.transformTo("uint8array", g)) : new n(r.transformTo("array", g)) : new u(g);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, f, a) {
        a.LOCAL_FILE_HEADER = "PK", a.CENTRAL_FILE_HEADER = "PK", a.CENTRAL_DIRECTORY_END = "PK", a.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", a.ZIP64_CENTRAL_DIRECTORY_END = "PK", a.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, f, a) {
        var r = e("./GenericWorker"), s = e("../utils");
        function n(u) {
          r.call(this, "ConvertWorker to " + u), this.destType = u;
        }
        s.inherits(n, r), n.prototype.processChunk = function(u) {
          this.push({ data: s.transformTo(this.destType, u.data), meta: u.meta });
        }, f.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, f, a) {
        var r = e("./GenericWorker"), s = e("../crc32");
        function n() {
          r.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(n, r), n.prototype.processChunk = function(u) {
          this.streamInfo.crc32 = s(u.data, this.streamInfo.crc32 || 0), this.push(u);
        }, f.exports = n;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, f, a) {
        var r = e("../utils"), s = e("./GenericWorker");
        function n(u) {
          s.call(this, "DataLengthProbe for " + u), this.propName = u, this.withStreamInfo(u, 0);
        }
        r.inherits(n, s), n.prototype.processChunk = function(u) {
          if (u) {
            var y = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = y + u.data.length;
          }
          s.prototype.processChunk.call(this, u);
        }, f.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, f, a) {
        var r = e("../utils"), s = e("./GenericWorker");
        function n(u) {
          s.call(this, "DataWorker");
          var y = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, u.then(function(w) {
            y.dataIsReady = !0, y.data = w, y.max = w && w.length || 0, y.type = r.getTypeOf(w), y.isPaused || y._tickAndRepeat();
          }, function(w) {
            y.error(w);
          });
        }
        r.inherits(n, s), n.prototype.cleanUp = function() {
          s.prototype.cleanUp.call(this), this.data = null;
        }, n.prototype.resume = function() {
          return !!s.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, r.delay(this._tickAndRepeat, [], this)), !0);
        }, n.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (r.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, n.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var u = null, y = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              u = this.data.substring(this.index, y);
              break;
            case "uint8array":
              u = this.data.subarray(this.index, y);
              break;
            case "array":
            case "nodebuffer":
              u = this.data.slice(this.index, y);
          }
          return this.index = y, this.push({ data: u, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, f.exports = n;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, f, a) {
        function r(s) {
          this.name = s || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        r.prototype = { push: function(s) {
          this.emit("data", s);
        }, end: function() {
          if (this.isFinished) return !1;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (s) {
            this.emit("error", s);
          }
          return !0;
        }, error: function(s) {
          return !this.isFinished && (this.isPaused ? this.generatedError = s : (this.isFinished = !0, this.emit("error", s), this.previous && this.previous.error(s), this.cleanUp()), !0);
        }, on: function(s, n) {
          return this._listeners[s].push(n), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(s, n) {
          if (this._listeners[s]) for (var u = 0; u < this._listeners[s].length; u++) this._listeners[s][u].call(this, n);
        }, pipe: function(s) {
          return s.registerPrevious(this);
        }, registerPrevious: function(s) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = s.streamInfo, this.mergeStreamInfo(), this.previous = s;
          var n = this;
          return s.on("data", function(u) {
            n.processChunk(u);
          }), s.on("end", function() {
            n.end();
          }), s.on("error", function(u) {
            n.error(u);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return !1;
          var s = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), s = !0), this.previous && this.previous.resume(), !s;
        }, flush: function() {
        }, processChunk: function(s) {
          this.push(s);
        }, withStreamInfo: function(s, n) {
          return this.extraStreamInfo[s] = n, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var s in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, s) && (this.streamInfo[s] = this.extraStreamInfo[s]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var s = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + s : s;
        } }, f.exports = r;
      }, {}], 29: [function(e, f, a) {
        var r = e("../utils"), s = e("./ConvertWorker"), n = e("./GenericWorker"), u = e("../base64"), y = e("../support"), w = e("../external"), g = null;
        if (y.nodestream) try {
          g = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function v(_, h) {
          return new w.Promise(function(p, c) {
            var b = [], x = _._internalType, E = _._outputType, A = _._mimeType;
            _.on("data", function(M, T) {
              b.push(M), h && h(T);
            }).on("error", function(M) {
              b = [], c(M);
            }).on("end", function() {
              try {
                var M = (function(T, L, R) {
                  switch (T) {
                    case "blob":
                      return r.newBlob(r.transformTo("arraybuffer", L), R);
                    case "base64":
                      return u.encode(L);
                    default:
                      return r.transformTo(T, L);
                  }
                })(E, (function(T, L) {
                  var R, H = 0, X = null, k = 0;
                  for (R = 0; R < L.length; R++) k += L[R].length;
                  switch (T) {
                    case "string":
                      return L.join("");
                    case "array":
                      return Array.prototype.concat.apply([], L);
                    case "uint8array":
                      for (X = new Uint8Array(k), R = 0; R < L.length; R++) X.set(L[R], H), H += L[R].length;
                      return X;
                    case "nodebuffer":
                      return Buffer.concat(L);
                    default:
                      throw new Error("concat : unsupported type '" + T + "'");
                  }
                })(x, b), A);
                p(M);
              } catch (T) {
                c(T);
              }
              b = [];
            }).resume();
          });
        }
        function o(_, h, p) {
          var c = h;
          switch (h) {
            case "blob":
            case "arraybuffer":
              c = "uint8array";
              break;
            case "base64":
              c = "string";
          }
          try {
            this._internalType = c, this._outputType = h, this._mimeType = p, r.checkSupport(c), this._worker = _.pipe(new s(c)), _.lock();
          } catch (b) {
            this._worker = new n("error"), this._worker.error(b);
          }
        }
        o.prototype = { accumulate: function(_) {
          return v(this, _);
        }, on: function(_, h) {
          var p = this;
          return _ === "data" ? this._worker.on(_, function(c) {
            h.call(p, c.data, c.meta);
          }) : this._worker.on(_, function() {
            r.delay(h, arguments, p);
          }), this;
        }, resume: function() {
          return r.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(_) {
          if (r.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new g(this, { objectMode: this._outputType !== "nodebuffer" }, _);
        } }, f.exports = o;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, f, a) {
        if (a.base64 = !0, a.array = !0, a.string = !0, a.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", a.nodebuffer = typeof Buffer < "u", a.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") a.blob = !1;
        else {
          var r = new ArrayBuffer(0);
          try {
            a.blob = new Blob([r], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var s = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              s.append(r), a.blob = s.getBlob("application/zip").size === 0;
            } catch {
              a.blob = !1;
            }
          }
        }
        try {
          a.nodestream = !!e("readable-stream").Readable;
        } catch {
          a.nodestream = !1;
        }
      }, { "readable-stream": 16 }], 31: [function(e, f, a) {
        for (var r = e("./utils"), s = e("./support"), n = e("./nodejsUtils"), u = e("./stream/GenericWorker"), y = new Array(256), w = 0; w < 256; w++) y[w] = 252 <= w ? 6 : 248 <= w ? 5 : 240 <= w ? 4 : 224 <= w ? 3 : 192 <= w ? 2 : 1;
        y[254] = y[254] = 1;
        function g() {
          u.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function v() {
          u.call(this, "utf-8 encode");
        }
        a.utf8encode = function(o) {
          return s.nodebuffer ? n.newBufferFrom(o, "utf-8") : (function(_) {
            var h, p, c, b, x, E = _.length, A = 0;
            for (b = 0; b < E; b++) (64512 & (p = _.charCodeAt(b))) == 55296 && b + 1 < E && (64512 & (c = _.charCodeAt(b + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (c - 56320), b++), A += p < 128 ? 1 : p < 2048 ? 2 : p < 65536 ? 3 : 4;
            for (h = s.uint8array ? new Uint8Array(A) : new Array(A), b = x = 0; x < A; b++) (64512 & (p = _.charCodeAt(b))) == 55296 && b + 1 < E && (64512 & (c = _.charCodeAt(b + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (c - 56320), b++), p < 128 ? h[x++] = p : (p < 2048 ? h[x++] = 192 | p >>> 6 : (p < 65536 ? h[x++] = 224 | p >>> 12 : (h[x++] = 240 | p >>> 18, h[x++] = 128 | p >>> 12 & 63), h[x++] = 128 | p >>> 6 & 63), h[x++] = 128 | 63 & p);
            return h;
          })(o);
        }, a.utf8decode = function(o) {
          return s.nodebuffer ? r.transformTo("nodebuffer", o).toString("utf-8") : (function(_) {
            var h, p, c, b, x = _.length, E = new Array(2 * x);
            for (h = p = 0; h < x; ) if ((c = _[h++]) < 128) E[p++] = c;
            else if (4 < (b = y[c])) E[p++] = 65533, h += b - 1;
            else {
              for (c &= b === 2 ? 31 : b === 3 ? 15 : 7; 1 < b && h < x; ) c = c << 6 | 63 & _[h++], b--;
              1 < b ? E[p++] = 65533 : c < 65536 ? E[p++] = c : (c -= 65536, E[p++] = 55296 | c >> 10 & 1023, E[p++] = 56320 | 1023 & c);
            }
            return E.length !== p && (E.subarray ? E = E.subarray(0, p) : E.length = p), r.applyFromCharCode(E);
          })(o = r.transformTo(s.uint8array ? "uint8array" : "array", o));
        }, r.inherits(g, u), g.prototype.processChunk = function(o) {
          var _ = r.transformTo(s.uint8array ? "uint8array" : "array", o.data);
          if (this.leftOver && this.leftOver.length) {
            if (s.uint8array) {
              var h = _;
              (_ = new Uint8Array(h.length + this.leftOver.length)).set(this.leftOver, 0), _.set(h, this.leftOver.length);
            } else _ = this.leftOver.concat(_);
            this.leftOver = null;
          }
          var p = (function(b, x) {
            var E;
            for ((x = x || b.length) > b.length && (x = b.length), E = x - 1; 0 <= E && (192 & b[E]) == 128; ) E--;
            return E < 0 || E === 0 ? x : E + y[b[E]] > x ? E : x;
          })(_), c = _;
          p !== _.length && (s.uint8array ? (c = _.subarray(0, p), this.leftOver = _.subarray(p, _.length)) : (c = _.slice(0, p), this.leftOver = _.slice(p, _.length))), this.push({ data: a.utf8decode(c), meta: o.meta });
        }, g.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: a.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, a.Utf8DecodeWorker = g, r.inherits(v, u), v.prototype.processChunk = function(o) {
          this.push({ data: a.utf8encode(o.data), meta: o.meta });
        }, a.Utf8EncodeWorker = v;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, f, a) {
        var r = e("./support"), s = e("./base64"), n = e("./nodejsUtils"), u = e("./external");
        function y(h) {
          return h;
        }
        function w(h, p) {
          for (var c = 0; c < h.length; ++c) p[c] = 255 & h.charCodeAt(c);
          return p;
        }
        e("setimmediate"), a.newBlob = function(h, p) {
          a.checkSupport("blob");
          try {
            return new Blob([h], { type: p });
          } catch {
            try {
              var c = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return c.append(h), c.getBlob(p);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var g = { stringifyByChunk: function(h, p, c) {
          var b = [], x = 0, E = h.length;
          if (E <= c) return String.fromCharCode.apply(null, h);
          for (; x < E; ) p === "array" || p === "nodebuffer" ? b.push(String.fromCharCode.apply(null, h.slice(x, Math.min(x + c, E)))) : b.push(String.fromCharCode.apply(null, h.subarray(x, Math.min(x + c, E)))), x += c;
          return b.join("");
        }, stringifyByChar: function(h) {
          for (var p = "", c = 0; c < h.length; c++) p += String.fromCharCode(h[c]);
          return p;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return r.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(), nodebuffer: (function() {
          try {
            return r.nodebuffer && String.fromCharCode.apply(null, n.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })() } };
        function v(h) {
          var p = 65536, c = a.getTypeOf(h), b = !0;
          if (c === "uint8array" ? b = g.applyCanBeUsed.uint8array : c === "nodebuffer" && (b = g.applyCanBeUsed.nodebuffer), b) for (; 1 < p; ) try {
            return g.stringifyByChunk(h, c, p);
          } catch {
            p = Math.floor(p / 2);
          }
          return g.stringifyByChar(h);
        }
        function o(h, p) {
          for (var c = 0; c < h.length; c++) p[c] = h[c];
          return p;
        }
        a.applyFromCharCode = v;
        var _ = {};
        _.string = { string: y, array: function(h) {
          return w(h, new Array(h.length));
        }, arraybuffer: function(h) {
          return _.string.uint8array(h).buffer;
        }, uint8array: function(h) {
          return w(h, new Uint8Array(h.length));
        }, nodebuffer: function(h) {
          return w(h, n.allocBuffer(h.length));
        } }, _.array = { string: v, array: y, arraybuffer: function(h) {
          return new Uint8Array(h).buffer;
        }, uint8array: function(h) {
          return new Uint8Array(h);
        }, nodebuffer: function(h) {
          return n.newBufferFrom(h);
        } }, _.arraybuffer = { string: function(h) {
          return v(new Uint8Array(h));
        }, array: function(h) {
          return o(new Uint8Array(h), new Array(h.byteLength));
        }, arraybuffer: y, uint8array: function(h) {
          return new Uint8Array(h);
        }, nodebuffer: function(h) {
          return n.newBufferFrom(new Uint8Array(h));
        } }, _.uint8array = { string: v, array: function(h) {
          return o(h, new Array(h.length));
        }, arraybuffer: function(h) {
          return h.buffer;
        }, uint8array: y, nodebuffer: function(h) {
          return n.newBufferFrom(h);
        } }, _.nodebuffer = { string: v, array: function(h) {
          return o(h, new Array(h.length));
        }, arraybuffer: function(h) {
          return _.nodebuffer.uint8array(h).buffer;
        }, uint8array: function(h) {
          return o(h, new Uint8Array(h.length));
        }, nodebuffer: y }, a.transformTo = function(h, p) {
          if (p = p || "", !h) return p;
          a.checkSupport(h);
          var c = a.getTypeOf(p);
          return _[c][h](p);
        }, a.resolve = function(h) {
          for (var p = h.split("/"), c = [], b = 0; b < p.length; b++) {
            var x = p[b];
            x === "." || x === "" && b !== 0 && b !== p.length - 1 || (x === ".." ? c.pop() : c.push(x));
          }
          return c.join("/");
        }, a.getTypeOf = function(h) {
          return typeof h == "string" ? "string" : Object.prototype.toString.call(h) === "[object Array]" ? "array" : r.nodebuffer && n.isBuffer(h) ? "nodebuffer" : r.uint8array && h instanceof Uint8Array ? "uint8array" : r.arraybuffer && h instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, a.checkSupport = function(h) {
          if (!r[h.toLowerCase()]) throw new Error(h + " is not supported by this platform");
        }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(h) {
          var p, c, b = "";
          for (c = 0; c < (h || "").length; c++) b += "\\x" + ((p = h.charCodeAt(c)) < 16 ? "0" : "") + p.toString(16).toUpperCase();
          return b;
        }, a.delay = function(h, p, c) {
          setImmediate(function() {
            h.apply(c || null, p || []);
          });
        }, a.inherits = function(h, p) {
          function c() {
          }
          c.prototype = p.prototype, h.prototype = new c();
        }, a.extend = function() {
          var h, p, c = {};
          for (h = 0; h < arguments.length; h++) for (p in arguments[h]) Object.prototype.hasOwnProperty.call(arguments[h], p) && c[p] === void 0 && (c[p] = arguments[h][p]);
          return c;
        }, a.prepareContent = function(h, p, c, b, x) {
          return u.Promise.resolve(p).then(function(E) {
            return r.blob && (E instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(E)) !== -1) && typeof FileReader < "u" ? new u.Promise(function(A, M) {
              var T = new FileReader();
              T.onload = function(L) {
                A(L.target.result);
              }, T.onerror = function(L) {
                M(L.target.error);
              }, T.readAsArrayBuffer(E);
            }) : E;
          }).then(function(E) {
            var A = a.getTypeOf(E);
            return A ? (A === "arraybuffer" ? E = a.transformTo("uint8array", E) : A === "string" && (x ? E = s.decode(E) : c && b !== !0 && (E = (function(M) {
              return w(M, r.uint8array ? new Uint8Array(M.length) : new Array(M.length));
            })(E))), E) : u.Promise.reject(new Error("Can't read the data of '" + h + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, f, a) {
        var r = e("./reader/readerFor"), s = e("./utils"), n = e("./signature"), u = e("./zipEntry"), y = e("./support");
        function w(g) {
          this.files = [], this.loadOptions = g;
        }
        w.prototype = { checkSignature: function(g) {
          if (!this.reader.readAndCheckSignature(g)) {
            this.reader.index -= 4;
            var v = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + s.pretty(v) + ", expected " + s.pretty(g) + ")");
          }
        }, isSignature: function(g, v) {
          var o = this.reader.index;
          this.reader.setIndex(g);
          var _ = this.reader.readString(4) === v;
          return this.reader.setIndex(o), _;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var g = this.reader.readData(this.zipCommentLength), v = y.uint8array ? "uint8array" : "array", o = s.transformTo(v, g);
          this.zipComment = this.loadOptions.decodeFileName(o);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var g, v, o, _ = this.zip64EndOfCentralSize - 44; 0 < _; ) g = this.reader.readInt(2), v = this.reader.readInt(4), o = this.reader.readData(v), this.zip64ExtensibleData[g] = { id: g, length: v, value: o };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var g, v;
          for (g = 0; g < this.files.length; g++) v = this.files[g], this.reader.setIndex(v.localHeaderOffset), this.checkSignature(n.LOCAL_FILE_HEADER), v.readLocalPart(this.reader), v.handleUTF8(), v.processAttributes();
        }, readCentralDir: function() {
          var g;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(n.CENTRAL_FILE_HEADER); ) (g = new u({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(g);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var g = this.reader.lastIndexOfSignature(n.CENTRAL_DIRECTORY_END);
          if (g < 0) throw this.isSignature(0, n.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(g);
          var v = g;
          if (this.checkSignature(n.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === s.MAX_VALUE_16BITS || this.diskWithCentralDirStart === s.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === s.MAX_VALUE_16BITS || this.centralDirRecords === s.MAX_VALUE_16BITS || this.centralDirSize === s.MAX_VALUE_32BITS || this.centralDirOffset === s.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (g = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(g), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, n.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var o = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (o += 20, o += 12 + this.zip64EndOfCentralSize);
          var _ = v - o;
          if (0 < _) this.isSignature(v, n.CENTRAL_FILE_HEADER) || (this.reader.zero = _);
          else if (_ < 0) throw new Error("Corrupted zip: missing " + Math.abs(_) + " bytes.");
        }, prepareReader: function(g) {
          this.reader = r(g);
        }, load: function(g) {
          this.prepareReader(g), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, f.exports = w;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, f, a) {
        var r = e("./reader/readerFor"), s = e("./utils"), n = e("./compressedObject"), u = e("./crc32"), y = e("./utf8"), w = e("./compressions"), g = e("./support");
        function v(o, _) {
          this.options = o, this.loadOptions = _;
        }
        v.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(o) {
          var _, h;
          if (o.skip(22), this.fileNameLength = o.readInt(2), h = o.readInt(2), this.fileName = o.readData(this.fileNameLength), o.skip(h), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((_ = (function(p) {
            for (var c in w) if (Object.prototype.hasOwnProperty.call(w, c) && w[c].magic === p) return w[c];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
          this.decompressed = new n(this.compressedSize, this.uncompressedSize, this.crc32, _, o.readData(this.compressedSize));
        }, readCentralPart: function(o) {
          this.versionMadeBy = o.readInt(2), o.skip(2), this.bitFlag = o.readInt(2), this.compressionMethod = o.readString(2), this.date = o.readDate(), this.crc32 = o.readInt(4), this.compressedSize = o.readInt(4), this.uncompressedSize = o.readInt(4);
          var _ = o.readInt(2);
          if (this.extraFieldsLength = o.readInt(2), this.fileCommentLength = o.readInt(2), this.diskNumberStart = o.readInt(2), this.internalFileAttributes = o.readInt(2), this.externalFileAttributes = o.readInt(4), this.localHeaderOffset = o.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          o.skip(_), this.readExtraFields(o), this.parseZIP64ExtraField(o), this.fileComment = o.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var o = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), o == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), o == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var o = r(this.extraFields[1].value);
            this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = o.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = o.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = o.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = o.readInt(4));
          }
        }, readExtraFields: function(o) {
          var _, h, p, c = o.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); o.index + 4 < c; ) _ = o.readInt(2), h = o.readInt(2), p = o.readData(h), this.extraFields[_] = { id: _, length: h, value: p };
          o.setIndex(c);
        }, handleUTF8: function() {
          var o = g.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = y.utf8decode(this.fileName), this.fileCommentStr = y.utf8decode(this.fileComment);
          else {
            var _ = this.findExtraFieldUnicodePath();
            if (_ !== null) this.fileNameStr = _;
            else {
              var h = s.transformTo(o, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(h);
            }
            var p = this.findExtraFieldUnicodeComment();
            if (p !== null) this.fileCommentStr = p;
            else {
              var c = s.transformTo(o, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(c);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var o = this.extraFields[28789];
          if (o) {
            var _ = r(o.value);
            return _.readInt(1) !== 1 || u(this.fileName) !== _.readInt(4) ? null : y.utf8decode(_.readData(o.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var o = this.extraFields[25461];
          if (o) {
            var _ = r(o.value);
            return _.readInt(1) !== 1 || u(this.fileComment) !== _.readInt(4) ? null : y.utf8decode(_.readData(o.length - 5));
          }
          return null;
        } }, f.exports = v;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, f, a) {
        function r(_, h, p) {
          this.name = _, this.dir = p.dir, this.date = p.date, this.comment = p.comment, this.unixPermissions = p.unixPermissions, this.dosPermissions = p.dosPermissions, this._data = h, this._dataBinary = p.binary, this.options = { compression: p.compression, compressionOptions: p.compressionOptions };
        }
        var s = e("./stream/StreamHelper"), n = e("./stream/DataWorker"), u = e("./utf8"), y = e("./compressedObject"), w = e("./stream/GenericWorker");
        r.prototype = { internalStream: function(_) {
          var h = null, p = "string";
          try {
            if (!_) throw new Error("No output type specified.");
            var c = (p = _.toLowerCase()) === "string" || p === "text";
            p !== "binarystring" && p !== "text" || (p = "string"), h = this._decompressWorker();
            var b = !this._dataBinary;
            b && !c && (h = h.pipe(new u.Utf8EncodeWorker())), !b && c && (h = h.pipe(new u.Utf8DecodeWorker()));
          } catch (x) {
            (h = new w("error")).error(x);
          }
          return new s(h, p, "");
        }, async: function(_, h) {
          return this.internalStream(_).accumulate(h);
        }, nodeStream: function(_, h) {
          return this.internalStream(_ || "nodebuffer").toNodejsStream(h);
        }, _compressWorker: function(_, h) {
          if (this._data instanceof y && this._data.compression.magic === _.magic) return this._data.getCompressedWorker();
          var p = this._decompressWorker();
          return this._dataBinary || (p = p.pipe(new u.Utf8EncodeWorker())), y.createWorkerFrom(p, _, h);
        }, _decompressWorker: function() {
          return this._data instanceof y ? this._data.getContentWorker() : this._data instanceof w ? this._data : new n(this._data);
        } };
        for (var g = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], v = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, o = 0; o < g.length; o++) r.prototype[g[o]] = v;
        f.exports = r;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, f, a) {
        (function(r) {
          var s, n, u = r.MutationObserver || r.WebKitMutationObserver;
          if (u) {
            var y = 0, w = new u(_), g = r.document.createTextNode("");
            w.observe(g, { characterData: !0 }), s = function() {
              g.data = y = ++y % 2;
            };
          } else if (r.setImmediate || r.MessageChannel === void 0) s = "document" in r && "onreadystatechange" in r.document.createElement("script") ? function() {
            var h = r.document.createElement("script");
            h.onreadystatechange = function() {
              _(), h.onreadystatechange = null, h.parentNode.removeChild(h), h = null;
            }, r.document.documentElement.appendChild(h);
          } : function() {
            setTimeout(_, 0);
          };
          else {
            var v = new r.MessageChannel();
            v.port1.onmessage = _, s = function() {
              v.port2.postMessage(0);
            };
          }
          var o = [];
          function _() {
            var h, p;
            n = !0;
            for (var c = o.length; c; ) {
              for (p = o, o = [], h = -1; ++h < c; ) p[h]();
              c = o.length;
            }
            n = !1;
          }
          f.exports = function(h) {
            o.push(h) !== 1 || n || s();
          };
        }).call(this, typeof Nt < "u" ? Nt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, f, a) {
        var r = e("immediate");
        function s() {
        }
        var n = {}, u = ["REJECTED"], y = ["FULFILLED"], w = ["PENDING"];
        function g(c) {
          if (typeof c != "function") throw new TypeError("resolver must be a function");
          this.state = w, this.queue = [], this.outcome = void 0, c !== s && h(this, c);
        }
        function v(c, b, x) {
          this.promise = c, typeof b == "function" && (this.onFulfilled = b, this.callFulfilled = this.otherCallFulfilled), typeof x == "function" && (this.onRejected = x, this.callRejected = this.otherCallRejected);
        }
        function o(c, b, x) {
          r(function() {
            var E;
            try {
              E = b(x);
            } catch (A) {
              return n.reject(c, A);
            }
            E === c ? n.reject(c, new TypeError("Cannot resolve promise with itself")) : n.resolve(c, E);
          });
        }
        function _(c) {
          var b = c && c.then;
          if (c && (typeof c == "object" || typeof c == "function") && typeof b == "function") return function() {
            b.apply(c, arguments);
          };
        }
        function h(c, b) {
          var x = !1;
          function E(T) {
            x || (x = !0, n.reject(c, T));
          }
          function A(T) {
            x || (x = !0, n.resolve(c, T));
          }
          var M = p(function() {
            b(A, E);
          });
          M.status === "error" && E(M.value);
        }
        function p(c, b) {
          var x = {};
          try {
            x.value = c(b), x.status = "success";
          } catch (E) {
            x.status = "error", x.value = E;
          }
          return x;
        }
        (f.exports = g).prototype.finally = function(c) {
          if (typeof c != "function") return this;
          var b = this.constructor;
          return this.then(function(x) {
            return b.resolve(c()).then(function() {
              return x;
            });
          }, function(x) {
            return b.resolve(c()).then(function() {
              throw x;
            });
          });
        }, g.prototype.catch = function(c) {
          return this.then(null, c);
        }, g.prototype.then = function(c, b) {
          if (typeof c != "function" && this.state === y || typeof b != "function" && this.state === u) return this;
          var x = new this.constructor(s);
          return this.state !== w ? o(x, this.state === y ? c : b, this.outcome) : this.queue.push(new v(x, c, b)), x;
        }, v.prototype.callFulfilled = function(c) {
          n.resolve(this.promise, c);
        }, v.prototype.otherCallFulfilled = function(c) {
          o(this.promise, this.onFulfilled, c);
        }, v.prototype.callRejected = function(c) {
          n.reject(this.promise, c);
        }, v.prototype.otherCallRejected = function(c) {
          o(this.promise, this.onRejected, c);
        }, n.resolve = function(c, b) {
          var x = p(_, b);
          if (x.status === "error") return n.reject(c, x.value);
          var E = x.value;
          if (E) h(c, E);
          else {
            c.state = y, c.outcome = b;
            for (var A = -1, M = c.queue.length; ++A < M; ) c.queue[A].callFulfilled(b);
          }
          return c;
        }, n.reject = function(c, b) {
          c.state = u, c.outcome = b;
          for (var x = -1, E = c.queue.length; ++x < E; ) c.queue[x].callRejected(b);
          return c;
        }, g.resolve = function(c) {
          return c instanceof this ? c : n.resolve(new this(s), c);
        }, g.reject = function(c) {
          var b = new this(s);
          return n.reject(b, c);
        }, g.all = function(c) {
          var b = this;
          if (Object.prototype.toString.call(c) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var x = c.length, E = !1;
          if (!x) return this.resolve([]);
          for (var A = new Array(x), M = 0, T = -1, L = new this(s); ++T < x; ) R(c[T], T);
          return L;
          function R(H, X) {
            b.resolve(H).then(function(k) {
              A[X] = k, ++M !== x || E || (E = !0, n.resolve(L, A));
            }, function(k) {
              E || (E = !0, n.reject(L, k));
            });
          }
        }, g.race = function(c) {
          var b = this;
          if (Object.prototype.toString.call(c) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var x = c.length, E = !1;
          if (!x) return this.resolve([]);
          for (var A = -1, M = new this(s); ++A < x; ) T = c[A], b.resolve(T).then(function(L) {
            E || (E = !0, n.resolve(M, L));
          }, function(L) {
            E || (E = !0, n.reject(M, L));
          });
          var T;
          return M;
        };
      }, { immediate: 36 }], 38: [function(e, f, a) {
        var r = {};
        (0, e("./lib/utils/common").assign)(r, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), f.exports = r;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, f, a) {
        var r = e("./zlib/deflate"), s = e("./utils/common"), n = e("./utils/strings"), u = e("./zlib/messages"), y = e("./zlib/zstream"), w = Object.prototype.toString, g = 0, v = -1, o = 0, _ = 8;
        function h(c) {
          if (!(this instanceof h)) return new h(c);
          this.options = s.assign({ level: v, method: _, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: o, to: "" }, c || {});
          var b = this.options;
          b.raw && 0 < b.windowBits ? b.windowBits = -b.windowBits : b.gzip && 0 < b.windowBits && b.windowBits < 16 && (b.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new y(), this.strm.avail_out = 0;
          var x = r.deflateInit2(this.strm, b.level, b.method, b.windowBits, b.memLevel, b.strategy);
          if (x !== g) throw new Error(u[x]);
          if (b.header && r.deflateSetHeader(this.strm, b.header), b.dictionary) {
            var E;
            if (E = typeof b.dictionary == "string" ? n.string2buf(b.dictionary) : w.call(b.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(b.dictionary) : b.dictionary, (x = r.deflateSetDictionary(this.strm, E)) !== g) throw new Error(u[x]);
            this._dict_set = !0;
          }
        }
        function p(c, b) {
          var x = new h(b);
          if (x.push(c, !0), x.err) throw x.msg || u[x.err];
          return x.result;
        }
        h.prototype.push = function(c, b) {
          var x, E, A = this.strm, M = this.options.chunkSize;
          if (this.ended) return !1;
          E = b === ~~b ? b : b === !0 ? 4 : 0, typeof c == "string" ? A.input = n.string2buf(c) : w.call(c) === "[object ArrayBuffer]" ? A.input = new Uint8Array(c) : A.input = c, A.next_in = 0, A.avail_in = A.input.length;
          do {
            if (A.avail_out === 0 && (A.output = new s.Buf8(M), A.next_out = 0, A.avail_out = M), (x = r.deflate(A, E)) !== 1 && x !== g) return this.onEnd(x), !(this.ended = !0);
            A.avail_out !== 0 && (A.avail_in !== 0 || E !== 4 && E !== 2) || (this.options.to === "string" ? this.onData(n.buf2binstring(s.shrinkBuf(A.output, A.next_out))) : this.onData(s.shrinkBuf(A.output, A.next_out)));
          } while ((0 < A.avail_in || A.avail_out === 0) && x !== 1);
          return E === 4 ? (x = r.deflateEnd(this.strm), this.onEnd(x), this.ended = !0, x === g) : E !== 2 || (this.onEnd(g), !(A.avail_out = 0));
        }, h.prototype.onData = function(c) {
          this.chunks.push(c);
        }, h.prototype.onEnd = function(c) {
          c === g && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)), this.chunks = [], this.err = c, this.msg = this.strm.msg;
        }, a.Deflate = h, a.deflate = p, a.deflateRaw = function(c, b) {
          return (b = b || {}).raw = !0, p(c, b);
        }, a.gzip = function(c, b) {
          return (b = b || {}).gzip = !0, p(c, b);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, f, a) {
        var r = e("./zlib/inflate"), s = e("./utils/common"), n = e("./utils/strings"), u = e("./zlib/constants"), y = e("./zlib/messages"), w = e("./zlib/zstream"), g = e("./zlib/gzheader"), v = Object.prototype.toString;
        function o(h) {
          if (!(this instanceof o)) return new o(h);
          this.options = s.assign({ chunkSize: 16384, windowBits: 0, to: "" }, h || {});
          var p = this.options;
          p.raw && 0 <= p.windowBits && p.windowBits < 16 && (p.windowBits = -p.windowBits, p.windowBits === 0 && (p.windowBits = -15)), !(0 <= p.windowBits && p.windowBits < 16) || h && h.windowBits || (p.windowBits += 32), 15 < p.windowBits && p.windowBits < 48 && (15 & p.windowBits) == 0 && (p.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new w(), this.strm.avail_out = 0;
          var c = r.inflateInit2(this.strm, p.windowBits);
          if (c !== u.Z_OK) throw new Error(y[c]);
          this.header = new g(), r.inflateGetHeader(this.strm, this.header);
        }
        function _(h, p) {
          var c = new o(p);
          if (c.push(h, !0), c.err) throw c.msg || y[c.err];
          return c.result;
        }
        o.prototype.push = function(h, p) {
          var c, b, x, E, A, M, T = this.strm, L = this.options.chunkSize, R = this.options.dictionary, H = !1;
          if (this.ended) return !1;
          b = p === ~~p ? p : p === !0 ? u.Z_FINISH : u.Z_NO_FLUSH, typeof h == "string" ? T.input = n.binstring2buf(h) : v.call(h) === "[object ArrayBuffer]" ? T.input = new Uint8Array(h) : T.input = h, T.next_in = 0, T.avail_in = T.input.length;
          do {
            if (T.avail_out === 0 && (T.output = new s.Buf8(L), T.next_out = 0, T.avail_out = L), (c = r.inflate(T, u.Z_NO_FLUSH)) === u.Z_NEED_DICT && R && (M = typeof R == "string" ? n.string2buf(R) : v.call(R) === "[object ArrayBuffer]" ? new Uint8Array(R) : R, c = r.inflateSetDictionary(this.strm, M)), c === u.Z_BUF_ERROR && H === !0 && (c = u.Z_OK, H = !1), c !== u.Z_STREAM_END && c !== u.Z_OK) return this.onEnd(c), !(this.ended = !0);
            T.next_out && (T.avail_out !== 0 && c !== u.Z_STREAM_END && (T.avail_in !== 0 || b !== u.Z_FINISH && b !== u.Z_SYNC_FLUSH) || (this.options.to === "string" ? (x = n.utf8border(T.output, T.next_out), E = T.next_out - x, A = n.buf2string(T.output, x), T.next_out = E, T.avail_out = L - E, E && s.arraySet(T.output, T.output, x, E, 0), this.onData(A)) : this.onData(s.shrinkBuf(T.output, T.next_out)))), T.avail_in === 0 && T.avail_out === 0 && (H = !0);
          } while ((0 < T.avail_in || T.avail_out === 0) && c !== u.Z_STREAM_END);
          return c === u.Z_STREAM_END && (b = u.Z_FINISH), b === u.Z_FINISH ? (c = r.inflateEnd(this.strm), this.onEnd(c), this.ended = !0, c === u.Z_OK) : b !== u.Z_SYNC_FLUSH || (this.onEnd(u.Z_OK), !(T.avail_out = 0));
        }, o.prototype.onData = function(h) {
          this.chunks.push(h);
        }, o.prototype.onEnd = function(h) {
          h === u.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)), this.chunks = [], this.err = h, this.msg = this.strm.msg;
        }, a.Inflate = o, a.inflate = _, a.inflateRaw = function(h, p) {
          return (p = p || {}).raw = !0, _(h, p);
        }, a.ungzip = _;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, f, a) {
        var r = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        a.assign = function(u) {
          for (var y = Array.prototype.slice.call(arguments, 1); y.length; ) {
            var w = y.shift();
            if (w) {
              if (typeof w != "object") throw new TypeError(w + "must be non-object");
              for (var g in w) w.hasOwnProperty(g) && (u[g] = w[g]);
            }
          }
          return u;
        }, a.shrinkBuf = function(u, y) {
          return u.length === y ? u : u.subarray ? u.subarray(0, y) : (u.length = y, u);
        };
        var s = { arraySet: function(u, y, w, g, v) {
          if (y.subarray && u.subarray) u.set(y.subarray(w, w + g), v);
          else for (var o = 0; o < g; o++) u[v + o] = y[w + o];
        }, flattenChunks: function(u) {
          var y, w, g, v, o, _;
          for (y = g = 0, w = u.length; y < w; y++) g += u[y].length;
          for (_ = new Uint8Array(g), y = v = 0, w = u.length; y < w; y++) o = u[y], _.set(o, v), v += o.length;
          return _;
        } }, n = { arraySet: function(u, y, w, g, v) {
          for (var o = 0; o < g; o++) u[v + o] = y[w + o];
        }, flattenChunks: function(u) {
          return [].concat.apply([], u);
        } };
        a.setTyped = function(u) {
          u ? (a.Buf8 = Uint8Array, a.Buf16 = Uint16Array, a.Buf32 = Int32Array, a.assign(a, s)) : (a.Buf8 = Array, a.Buf16 = Array, a.Buf32 = Array, a.assign(a, n));
        }, a.setTyped(r);
      }, {}], 42: [function(e, f, a) {
        var r = e("./common"), s = !0, n = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          s = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          n = !1;
        }
        for (var u = new r.Buf8(256), y = 0; y < 256; y++) u[y] = 252 <= y ? 6 : 248 <= y ? 5 : 240 <= y ? 4 : 224 <= y ? 3 : 192 <= y ? 2 : 1;
        function w(g, v) {
          if (v < 65537 && (g.subarray && n || !g.subarray && s)) return String.fromCharCode.apply(null, r.shrinkBuf(g, v));
          for (var o = "", _ = 0; _ < v; _++) o += String.fromCharCode(g[_]);
          return o;
        }
        u[254] = u[254] = 1, a.string2buf = function(g) {
          var v, o, _, h, p, c = g.length, b = 0;
          for (h = 0; h < c; h++) (64512 & (o = g.charCodeAt(h))) == 55296 && h + 1 < c && (64512 & (_ = g.charCodeAt(h + 1))) == 56320 && (o = 65536 + (o - 55296 << 10) + (_ - 56320), h++), b += o < 128 ? 1 : o < 2048 ? 2 : o < 65536 ? 3 : 4;
          for (v = new r.Buf8(b), h = p = 0; p < b; h++) (64512 & (o = g.charCodeAt(h))) == 55296 && h + 1 < c && (64512 & (_ = g.charCodeAt(h + 1))) == 56320 && (o = 65536 + (o - 55296 << 10) + (_ - 56320), h++), o < 128 ? v[p++] = o : (o < 2048 ? v[p++] = 192 | o >>> 6 : (o < 65536 ? v[p++] = 224 | o >>> 12 : (v[p++] = 240 | o >>> 18, v[p++] = 128 | o >>> 12 & 63), v[p++] = 128 | o >>> 6 & 63), v[p++] = 128 | 63 & o);
          return v;
        }, a.buf2binstring = function(g) {
          return w(g, g.length);
        }, a.binstring2buf = function(g) {
          for (var v = new r.Buf8(g.length), o = 0, _ = v.length; o < _; o++) v[o] = g.charCodeAt(o);
          return v;
        }, a.buf2string = function(g, v) {
          var o, _, h, p, c = v || g.length, b = new Array(2 * c);
          for (o = _ = 0; o < c; ) if ((h = g[o++]) < 128) b[_++] = h;
          else if (4 < (p = u[h])) b[_++] = 65533, o += p - 1;
          else {
            for (h &= p === 2 ? 31 : p === 3 ? 15 : 7; 1 < p && o < c; ) h = h << 6 | 63 & g[o++], p--;
            1 < p ? b[_++] = 65533 : h < 65536 ? b[_++] = h : (h -= 65536, b[_++] = 55296 | h >> 10 & 1023, b[_++] = 56320 | 1023 & h);
          }
          return w(b, _);
        }, a.utf8border = function(g, v) {
          var o;
          for ((v = v || g.length) > g.length && (v = g.length), o = v - 1; 0 <= o && (192 & g[o]) == 128; ) o--;
          return o < 0 || o === 0 ? v : o + u[g[o]] > v ? o : v;
        };
      }, { "./common": 41 }], 43: [function(e, f, a) {
        f.exports = function(r, s, n, u) {
          for (var y = 65535 & r | 0, w = r >>> 16 & 65535 | 0, g = 0; n !== 0; ) {
            for (n -= g = 2e3 < n ? 2e3 : n; w = w + (y = y + s[u++] | 0) | 0, --g; ) ;
            y %= 65521, w %= 65521;
          }
          return y | w << 16 | 0;
        };
      }, {}], 44: [function(e, f, a) {
        f.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, f, a) {
        var r = (function() {
          for (var s, n = [], u = 0; u < 256; u++) {
            s = u;
            for (var y = 0; y < 8; y++) s = 1 & s ? 3988292384 ^ s >>> 1 : s >>> 1;
            n[u] = s;
          }
          return n;
        })();
        f.exports = function(s, n, u, y) {
          var w = r, g = y + u;
          s ^= -1;
          for (var v = y; v < g; v++) s = s >>> 8 ^ w[255 & (s ^ n[v])];
          return -1 ^ s;
        };
      }, {}], 46: [function(e, f, a) {
        var r, s = e("../utils/common"), n = e("./trees"), u = e("./adler32"), y = e("./crc32"), w = e("./messages"), g = 0, v = 4, o = 0, _ = -2, h = -1, p = 4, c = 2, b = 8, x = 9, E = 286, A = 30, M = 19, T = 2 * E + 1, L = 15, R = 3, H = 258, X = H + R + 1, k = 42, B = 113, i = 1, P = 2, Q = 3, U = 4;
        function tt(t, D) {
          return t.msg = w[D], D;
        }
        function j(t) {
          return (t << 1) - (4 < t ? 9 : 0);
        }
        function J(t) {
          for (var D = t.length; 0 <= --D; ) t[D] = 0;
        }
        function $(t) {
          var D = t.state, O = D.pending;
          O > t.avail_out && (O = t.avail_out), O !== 0 && (s.arraySet(t.output, D.pending_buf, D.pending_out, O, t.next_out), t.next_out += O, D.pending_out += O, t.total_out += O, t.avail_out -= O, D.pending -= O, D.pending === 0 && (D.pending_out = 0));
        }
        function I(t, D) {
          n._tr_flush_block(t, 0 <= t.block_start ? t.block_start : -1, t.strstart - t.block_start, D), t.block_start = t.strstart, $(t.strm);
        }
        function Y(t, D) {
          t.pending_buf[t.pending++] = D;
        }
        function q(t, D) {
          t.pending_buf[t.pending++] = D >>> 8 & 255, t.pending_buf[t.pending++] = 255 & D;
        }
        function G(t, D) {
          var O, m, d = t.max_chain_length, z = t.strstart, F = t.prev_length, N = t.nice_match, C = t.strstart > t.w_size - X ? t.strstart - (t.w_size - X) : 0, W = t.window, K = t.w_mask, Z = t.prev, V = t.strstart + H, nt = W[z + F - 1], it = W[z + F];
          t.prev_length >= t.good_match && (d >>= 2), N > t.lookahead && (N = t.lookahead);
          do
            if (W[(O = D) + F] === it && W[O + F - 1] === nt && W[O] === W[z] && W[++O] === W[z + 1]) {
              z += 2, O++;
              do
                ;
              while (W[++z] === W[++O] && W[++z] === W[++O] && W[++z] === W[++O] && W[++z] === W[++O] && W[++z] === W[++O] && W[++z] === W[++O] && W[++z] === W[++O] && W[++z] === W[++O] && z < V);
              if (m = H - (V - z), z = V - H, F < m) {
                if (t.match_start = D, N <= (F = m)) break;
                nt = W[z + F - 1], it = W[z + F];
              }
            }
          while ((D = Z[D & K]) > C && --d != 0);
          return F <= t.lookahead ? F : t.lookahead;
        }
        function at(t) {
          var D, O, m, d, z, F, N, C, W, K, Z = t.w_size;
          do {
            if (d = t.window_size - t.lookahead - t.strstart, t.strstart >= Z + (Z - X)) {
              for (s.arraySet(t.window, t.window, Z, Z, 0), t.match_start -= Z, t.strstart -= Z, t.block_start -= Z, D = O = t.hash_size; m = t.head[--D], t.head[D] = Z <= m ? m - Z : 0, --O; ) ;
              for (D = O = Z; m = t.prev[--D], t.prev[D] = Z <= m ? m - Z : 0, --O; ) ;
              d += Z;
            }
            if (t.strm.avail_in === 0) break;
            if (F = t.strm, N = t.window, C = t.strstart + t.lookahead, W = d, K = void 0, K = F.avail_in, W < K && (K = W), O = K === 0 ? 0 : (F.avail_in -= K, s.arraySet(N, F.input, F.next_in, K, C), F.state.wrap === 1 ? F.adler = u(F.adler, N, K, C) : F.state.wrap === 2 && (F.adler = y(F.adler, N, K, C)), F.next_in += K, F.total_in += K, K), t.lookahead += O, t.lookahead + t.insert >= R) for (z = t.strstart - t.insert, t.ins_h = t.window[z], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[z + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[z + R - 1]) & t.hash_mask, t.prev[z & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = z, z++, t.insert--, !(t.lookahead + t.insert < R)); ) ;
          } while (t.lookahead < X && t.strm.avail_in !== 0);
        }
        function pt(t, D) {
          for (var O, m; ; ) {
            if (t.lookahead < X) {
              if (at(t), t.lookahead < X && D === g) return i;
              if (t.lookahead === 0) break;
            }
            if (O = 0, t.lookahead >= R && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + R - 1]) & t.hash_mask, O = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), O !== 0 && t.strstart - O <= t.w_size - X && (t.match_length = G(t, O)), t.match_length >= R) if (m = n._tr_tally(t, t.strstart - t.match_start, t.match_length - R), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= R) {
              for (t.match_length--; t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + R - 1]) & t.hash_mask, O = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart, --t.match_length != 0; ) ;
              t.strstart++;
            } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask;
            else m = n._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;
            if (m && (I(t, !1), t.strm.avail_out === 0)) return i;
          }
          return t.insert = t.strstart < R - 1 ? t.strstart : R - 1, D === v ? (I(t, !0), t.strm.avail_out === 0 ? Q : U) : t.last_lit && (I(t, !1), t.strm.avail_out === 0) ? i : P;
        }
        function et(t, D) {
          for (var O, m, d; ; ) {
            if (t.lookahead < X) {
              if (at(t), t.lookahead < X && D === g) return i;
              if (t.lookahead === 0) break;
            }
            if (O = 0, t.lookahead >= R && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + R - 1]) & t.hash_mask, O = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = R - 1, O !== 0 && t.prev_length < t.max_lazy_match && t.strstart - O <= t.w_size - X && (t.match_length = G(t, O), t.match_length <= 5 && (t.strategy === 1 || t.match_length === R && 4096 < t.strstart - t.match_start) && (t.match_length = R - 1)), t.prev_length >= R && t.match_length <= t.prev_length) {
              for (d = t.strstart + t.lookahead - R, m = n._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - R), t.lookahead -= t.prev_length - 1, t.prev_length -= 2; ++t.strstart <= d && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + R - 1]) & t.hash_mask, O = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), --t.prev_length != 0; ) ;
              if (t.match_available = 0, t.match_length = R - 1, t.strstart++, m && (I(t, !1), t.strm.avail_out === 0)) return i;
            } else if (t.match_available) {
              if ((m = n._tr_tally(t, 0, t.window[t.strstart - 1])) && I(t, !1), t.strstart++, t.lookahead--, t.strm.avail_out === 0) return i;
            } else t.match_available = 1, t.strstart++, t.lookahead--;
          }
          return t.match_available && (m = n._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < R - 1 ? t.strstart : R - 1, D === v ? (I(t, !0), t.strm.avail_out === 0 ? Q : U) : t.last_lit && (I(t, !1), t.strm.avail_out === 0) ? i : P;
        }
        function rt(t, D, O, m, d) {
          this.good_length = t, this.max_lazy = D, this.nice_length = O, this.max_chain = m, this.func = d;
        }
        function dt() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = b, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new s.Buf16(2 * T), this.dyn_dtree = new s.Buf16(2 * (2 * A + 1)), this.bl_tree = new s.Buf16(2 * (2 * M + 1)), J(this.dyn_ltree), J(this.dyn_dtree), J(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new s.Buf16(L + 1), this.heap = new s.Buf16(2 * E + 1), J(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new s.Buf16(2 * E + 1), J(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function ot(t) {
          var D;
          return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = c, (D = t.state).pending = 0, D.pending_out = 0, D.wrap < 0 && (D.wrap = -D.wrap), D.status = D.wrap ? k : B, t.adler = D.wrap === 2 ? 0 : 1, D.last_flush = g, n._tr_init(D), o) : tt(t, _);
        }
        function gt(t) {
          var D = ot(t);
          return D === o && (function(O) {
            O.window_size = 2 * O.w_size, J(O.head), O.max_lazy_match = r[O.level].max_lazy, O.good_match = r[O.level].good_length, O.nice_match = r[O.level].nice_length, O.max_chain_length = r[O.level].max_chain, O.strstart = 0, O.block_start = 0, O.lookahead = 0, O.insert = 0, O.match_length = O.prev_length = R - 1, O.match_available = 0, O.ins_h = 0;
          })(t.state), D;
        }
        function _t(t, D, O, m, d, z) {
          if (!t) return _;
          var F = 1;
          if (D === h && (D = 6), m < 0 ? (F = 0, m = -m) : 15 < m && (F = 2, m -= 16), d < 1 || x < d || O !== b || m < 8 || 15 < m || D < 0 || 9 < D || z < 0 || p < z) return tt(t, _);
          m === 8 && (m = 9);
          var N = new dt();
          return (t.state = N).strm = t, N.wrap = F, N.gzhead = null, N.w_bits = m, N.w_size = 1 << N.w_bits, N.w_mask = N.w_size - 1, N.hash_bits = d + 7, N.hash_size = 1 << N.hash_bits, N.hash_mask = N.hash_size - 1, N.hash_shift = ~~((N.hash_bits + R - 1) / R), N.window = new s.Buf8(2 * N.w_size), N.head = new s.Buf16(N.hash_size), N.prev = new s.Buf16(N.w_size), N.lit_bufsize = 1 << d + 6, N.pending_buf_size = 4 * N.lit_bufsize, N.pending_buf = new s.Buf8(N.pending_buf_size), N.d_buf = 1 * N.lit_bufsize, N.l_buf = 3 * N.lit_bufsize, N.level = D, N.strategy = z, N.method = O, gt(t);
        }
        r = [new rt(0, 0, 0, 0, function(t, D) {
          var O = 65535;
          for (O > t.pending_buf_size - 5 && (O = t.pending_buf_size - 5); ; ) {
            if (t.lookahead <= 1) {
              if (at(t), t.lookahead === 0 && D === g) return i;
              if (t.lookahead === 0) break;
            }
            t.strstart += t.lookahead, t.lookahead = 0;
            var m = t.block_start + O;
            if ((t.strstart === 0 || t.strstart >= m) && (t.lookahead = t.strstart - m, t.strstart = m, I(t, !1), t.strm.avail_out === 0) || t.strstart - t.block_start >= t.w_size - X && (I(t, !1), t.strm.avail_out === 0)) return i;
          }
          return t.insert = 0, D === v ? (I(t, !0), t.strm.avail_out === 0 ? Q : U) : (t.strstart > t.block_start && (I(t, !1), t.strm.avail_out), i);
        }), new rt(4, 4, 8, 4, pt), new rt(4, 5, 16, 8, pt), new rt(4, 6, 32, 32, pt), new rt(4, 4, 16, 16, et), new rt(8, 16, 32, 32, et), new rt(8, 16, 128, 128, et), new rt(8, 32, 128, 256, et), new rt(32, 128, 258, 1024, et), new rt(32, 258, 258, 4096, et)], a.deflateInit = function(t, D) {
          return _t(t, D, b, 15, 8, 0);
        }, a.deflateInit2 = _t, a.deflateReset = gt, a.deflateResetKeep = ot, a.deflateSetHeader = function(t, D) {
          return t && t.state ? t.state.wrap !== 2 ? _ : (t.state.gzhead = D, o) : _;
        }, a.deflate = function(t, D) {
          var O, m, d, z;
          if (!t || !t.state || 5 < D || D < 0) return t ? tt(t, _) : _;
          if (m = t.state, !t.output || !t.input && t.avail_in !== 0 || m.status === 666 && D !== v) return tt(t, t.avail_out === 0 ? -5 : _);
          if (m.strm = t, O = m.last_flush, m.last_flush = D, m.status === k) if (m.wrap === 2) t.adler = 0, Y(m, 31), Y(m, 139), Y(m, 8), m.gzhead ? (Y(m, (m.gzhead.text ? 1 : 0) + (m.gzhead.hcrc ? 2 : 0) + (m.gzhead.extra ? 4 : 0) + (m.gzhead.name ? 8 : 0) + (m.gzhead.comment ? 16 : 0)), Y(m, 255 & m.gzhead.time), Y(m, m.gzhead.time >> 8 & 255), Y(m, m.gzhead.time >> 16 & 255), Y(m, m.gzhead.time >> 24 & 255), Y(m, m.level === 9 ? 2 : 2 <= m.strategy || m.level < 2 ? 4 : 0), Y(m, 255 & m.gzhead.os), m.gzhead.extra && m.gzhead.extra.length && (Y(m, 255 & m.gzhead.extra.length), Y(m, m.gzhead.extra.length >> 8 & 255)), m.gzhead.hcrc && (t.adler = y(t.adler, m.pending_buf, m.pending, 0)), m.gzindex = 0, m.status = 69) : (Y(m, 0), Y(m, 0), Y(m, 0), Y(m, 0), Y(m, 0), Y(m, m.level === 9 ? 2 : 2 <= m.strategy || m.level < 2 ? 4 : 0), Y(m, 3), m.status = B);
          else {
            var F = b + (m.w_bits - 8 << 4) << 8;
            F |= (2 <= m.strategy || m.level < 2 ? 0 : m.level < 6 ? 1 : m.level === 6 ? 2 : 3) << 6, m.strstart !== 0 && (F |= 32), F += 31 - F % 31, m.status = B, q(m, F), m.strstart !== 0 && (q(m, t.adler >>> 16), q(m, 65535 & t.adler)), t.adler = 1;
          }
          if (m.status === 69) if (m.gzhead.extra) {
            for (d = m.pending; m.gzindex < (65535 & m.gzhead.extra.length) && (m.pending !== m.pending_buf_size || (m.gzhead.hcrc && m.pending > d && (t.adler = y(t.adler, m.pending_buf, m.pending - d, d)), $(t), d = m.pending, m.pending !== m.pending_buf_size)); ) Y(m, 255 & m.gzhead.extra[m.gzindex]), m.gzindex++;
            m.gzhead.hcrc && m.pending > d && (t.adler = y(t.adler, m.pending_buf, m.pending - d, d)), m.gzindex === m.gzhead.extra.length && (m.gzindex = 0, m.status = 73);
          } else m.status = 73;
          if (m.status === 73) if (m.gzhead.name) {
            d = m.pending;
            do {
              if (m.pending === m.pending_buf_size && (m.gzhead.hcrc && m.pending > d && (t.adler = y(t.adler, m.pending_buf, m.pending - d, d)), $(t), d = m.pending, m.pending === m.pending_buf_size)) {
                z = 1;
                break;
              }
              z = m.gzindex < m.gzhead.name.length ? 255 & m.gzhead.name.charCodeAt(m.gzindex++) : 0, Y(m, z);
            } while (z !== 0);
            m.gzhead.hcrc && m.pending > d && (t.adler = y(t.adler, m.pending_buf, m.pending - d, d)), z === 0 && (m.gzindex = 0, m.status = 91);
          } else m.status = 91;
          if (m.status === 91) if (m.gzhead.comment) {
            d = m.pending;
            do {
              if (m.pending === m.pending_buf_size && (m.gzhead.hcrc && m.pending > d && (t.adler = y(t.adler, m.pending_buf, m.pending - d, d)), $(t), d = m.pending, m.pending === m.pending_buf_size)) {
                z = 1;
                break;
              }
              z = m.gzindex < m.gzhead.comment.length ? 255 & m.gzhead.comment.charCodeAt(m.gzindex++) : 0, Y(m, z);
            } while (z !== 0);
            m.gzhead.hcrc && m.pending > d && (t.adler = y(t.adler, m.pending_buf, m.pending - d, d)), z === 0 && (m.status = 103);
          } else m.status = 103;
          if (m.status === 103 && (m.gzhead.hcrc ? (m.pending + 2 > m.pending_buf_size && $(t), m.pending + 2 <= m.pending_buf_size && (Y(m, 255 & t.adler), Y(m, t.adler >> 8 & 255), t.adler = 0, m.status = B)) : m.status = B), m.pending !== 0) {
            if ($(t), t.avail_out === 0) return m.last_flush = -1, o;
          } else if (t.avail_in === 0 && j(D) <= j(O) && D !== v) return tt(t, -5);
          if (m.status === 666 && t.avail_in !== 0) return tt(t, -5);
          if (t.avail_in !== 0 || m.lookahead !== 0 || D !== g && m.status !== 666) {
            var N = m.strategy === 2 ? (function(C, W) {
              for (var K; ; ) {
                if (C.lookahead === 0 && (at(C), C.lookahead === 0)) {
                  if (W === g) return i;
                  break;
                }
                if (C.match_length = 0, K = n._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++, K && (I(C, !1), C.strm.avail_out === 0)) return i;
              }
              return C.insert = 0, W === v ? (I(C, !0), C.strm.avail_out === 0 ? Q : U) : C.last_lit && (I(C, !1), C.strm.avail_out === 0) ? i : P;
            })(m, D) : m.strategy === 3 ? (function(C, W) {
              for (var K, Z, V, nt, it = C.window; ; ) {
                if (C.lookahead <= H) {
                  if (at(C), C.lookahead <= H && W === g) return i;
                  if (C.lookahead === 0) break;
                }
                if (C.match_length = 0, C.lookahead >= R && 0 < C.strstart && (Z = it[V = C.strstart - 1]) === it[++V] && Z === it[++V] && Z === it[++V]) {
                  nt = C.strstart + H;
                  do
                    ;
                  while (Z === it[++V] && Z === it[++V] && Z === it[++V] && Z === it[++V] && Z === it[++V] && Z === it[++V] && Z === it[++V] && Z === it[++V] && V < nt);
                  C.match_length = H - (nt - V), C.match_length > C.lookahead && (C.match_length = C.lookahead);
                }
                if (C.match_length >= R ? (K = n._tr_tally(C, 1, C.match_length - R), C.lookahead -= C.match_length, C.strstart += C.match_length, C.match_length = 0) : (K = n._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++), K && (I(C, !1), C.strm.avail_out === 0)) return i;
              }
              return C.insert = 0, W === v ? (I(C, !0), C.strm.avail_out === 0 ? Q : U) : C.last_lit && (I(C, !1), C.strm.avail_out === 0) ? i : P;
            })(m, D) : r[m.level].func(m, D);
            if (N !== Q && N !== U || (m.status = 666), N === i || N === Q) return t.avail_out === 0 && (m.last_flush = -1), o;
            if (N === P && (D === 1 ? n._tr_align(m) : D !== 5 && (n._tr_stored_block(m, 0, 0, !1), D === 3 && (J(m.head), m.lookahead === 0 && (m.strstart = 0, m.block_start = 0, m.insert = 0))), $(t), t.avail_out === 0)) return m.last_flush = -1, o;
          }
          return D !== v ? o : m.wrap <= 0 ? 1 : (m.wrap === 2 ? (Y(m, 255 & t.adler), Y(m, t.adler >> 8 & 255), Y(m, t.adler >> 16 & 255), Y(m, t.adler >> 24 & 255), Y(m, 255 & t.total_in), Y(m, t.total_in >> 8 & 255), Y(m, t.total_in >> 16 & 255), Y(m, t.total_in >> 24 & 255)) : (q(m, t.adler >>> 16), q(m, 65535 & t.adler)), $(t), 0 < m.wrap && (m.wrap = -m.wrap), m.pending !== 0 ? o : 1);
        }, a.deflateEnd = function(t) {
          var D;
          return t && t.state ? (D = t.state.status) !== k && D !== 69 && D !== 73 && D !== 91 && D !== 103 && D !== B && D !== 666 ? tt(t, _) : (t.state = null, D === B ? tt(t, -3) : o) : _;
        }, a.deflateSetDictionary = function(t, D) {
          var O, m, d, z, F, N, C, W, K = D.length;
          if (!t || !t.state || (z = (O = t.state).wrap) === 2 || z === 1 && O.status !== k || O.lookahead) return _;
          for (z === 1 && (t.adler = u(t.adler, D, K, 0)), O.wrap = 0, K >= O.w_size && (z === 0 && (J(O.head), O.strstart = 0, O.block_start = 0, O.insert = 0), W = new s.Buf8(O.w_size), s.arraySet(W, D, K - O.w_size, O.w_size, 0), D = W, K = O.w_size), F = t.avail_in, N = t.next_in, C = t.input, t.avail_in = K, t.next_in = 0, t.input = D, at(O); O.lookahead >= R; ) {
            for (m = O.strstart, d = O.lookahead - (R - 1); O.ins_h = (O.ins_h << O.hash_shift ^ O.window[m + R - 1]) & O.hash_mask, O.prev[m & O.w_mask] = O.head[O.ins_h], O.head[O.ins_h] = m, m++, --d; ) ;
            O.strstart = m, O.lookahead = R - 1, at(O);
          }
          return O.strstart += O.lookahead, O.block_start = O.strstart, O.insert = O.lookahead, O.lookahead = 0, O.match_length = O.prev_length = R - 1, O.match_available = 0, t.next_in = N, t.input = C, t.avail_in = F, O.wrap = z, o;
        }, a.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, f, a) {
        f.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, f, a) {
        f.exports = function(r, s) {
          var n, u, y, w, g, v, o, _, h, p, c, b, x, E, A, M, T, L, R, H, X, k, B, i, P;
          n = r.state, u = r.next_in, i = r.input, y = u + (r.avail_in - 5), w = r.next_out, P = r.output, g = w - (s - r.avail_out), v = w + (r.avail_out - 257), o = n.dmax, _ = n.wsize, h = n.whave, p = n.wnext, c = n.window, b = n.hold, x = n.bits, E = n.lencode, A = n.distcode, M = (1 << n.lenbits) - 1, T = (1 << n.distbits) - 1;
          t: do {
            x < 15 && (b += i[u++] << x, x += 8, b += i[u++] << x, x += 8), L = E[b & M];
            e: for (; ; ) {
              if (b >>>= R = L >>> 24, x -= R, (R = L >>> 16 & 255) === 0) P[w++] = 65535 & L;
              else {
                if (!(16 & R)) {
                  if ((64 & R) == 0) {
                    L = E[(65535 & L) + (b & (1 << R) - 1)];
                    continue e;
                  }
                  if (32 & R) {
                    n.mode = 12;
                    break t;
                  }
                  r.msg = "invalid literal/length code", n.mode = 30;
                  break t;
                }
                H = 65535 & L, (R &= 15) && (x < R && (b += i[u++] << x, x += 8), H += b & (1 << R) - 1, b >>>= R, x -= R), x < 15 && (b += i[u++] << x, x += 8, b += i[u++] << x, x += 8), L = A[b & T];
                i: for (; ; ) {
                  if (b >>>= R = L >>> 24, x -= R, !(16 & (R = L >>> 16 & 255))) {
                    if ((64 & R) == 0) {
                      L = A[(65535 & L) + (b & (1 << R) - 1)];
                      continue i;
                    }
                    r.msg = "invalid distance code", n.mode = 30;
                    break t;
                  }
                  if (X = 65535 & L, x < (R &= 15) && (b += i[u++] << x, (x += 8) < R && (b += i[u++] << x, x += 8)), o < (X += b & (1 << R) - 1)) {
                    r.msg = "invalid distance too far back", n.mode = 30;
                    break t;
                  }
                  if (b >>>= R, x -= R, (R = w - g) < X) {
                    if (h < (R = X - R) && n.sane) {
                      r.msg = "invalid distance too far back", n.mode = 30;
                      break t;
                    }
                    if (B = c, (k = 0) === p) {
                      if (k += _ - R, R < H) {
                        for (H -= R; P[w++] = c[k++], --R; ) ;
                        k = w - X, B = P;
                      }
                    } else if (p < R) {
                      if (k += _ + p - R, (R -= p) < H) {
                        for (H -= R; P[w++] = c[k++], --R; ) ;
                        if (k = 0, p < H) {
                          for (H -= R = p; P[w++] = c[k++], --R; ) ;
                          k = w - X, B = P;
                        }
                      }
                    } else if (k += p - R, R < H) {
                      for (H -= R; P[w++] = c[k++], --R; ) ;
                      k = w - X, B = P;
                    }
                    for (; 2 < H; ) P[w++] = B[k++], P[w++] = B[k++], P[w++] = B[k++], H -= 3;
                    H && (P[w++] = B[k++], 1 < H && (P[w++] = B[k++]));
                  } else {
                    for (k = w - X; P[w++] = P[k++], P[w++] = P[k++], P[w++] = P[k++], 2 < (H -= 3); ) ;
                    H && (P[w++] = P[k++], 1 < H && (P[w++] = P[k++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (u < y && w < v);
          u -= H = x >> 3, b &= (1 << (x -= H << 3)) - 1, r.next_in = u, r.next_out = w, r.avail_in = u < y ? y - u + 5 : 5 - (u - y), r.avail_out = w < v ? v - w + 257 : 257 - (w - v), n.hold = b, n.bits = x;
        };
      }, {}], 49: [function(e, f, a) {
        var r = e("../utils/common"), s = e("./adler32"), n = e("./crc32"), u = e("./inffast"), y = e("./inftrees"), w = 1, g = 2, v = 0, o = -2, _ = 1, h = 852, p = 592;
        function c(k) {
          return (k >>> 24 & 255) + (k >>> 8 & 65280) + ((65280 & k) << 8) + ((255 & k) << 24);
        }
        function b() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new r.Buf16(320), this.work = new r.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function x(k) {
          var B;
          return k && k.state ? (B = k.state, k.total_in = k.total_out = B.total = 0, k.msg = "", B.wrap && (k.adler = 1 & B.wrap), B.mode = _, B.last = 0, B.havedict = 0, B.dmax = 32768, B.head = null, B.hold = 0, B.bits = 0, B.lencode = B.lendyn = new r.Buf32(h), B.distcode = B.distdyn = new r.Buf32(p), B.sane = 1, B.back = -1, v) : o;
        }
        function E(k) {
          var B;
          return k && k.state ? ((B = k.state).wsize = 0, B.whave = 0, B.wnext = 0, x(k)) : o;
        }
        function A(k, B) {
          var i, P;
          return k && k.state ? (P = k.state, B < 0 ? (i = 0, B = -B) : (i = 1 + (B >> 4), B < 48 && (B &= 15)), B && (B < 8 || 15 < B) ? o : (P.window !== null && P.wbits !== B && (P.window = null), P.wrap = i, P.wbits = B, E(k))) : o;
        }
        function M(k, B) {
          var i, P;
          return k ? (P = new b(), (k.state = P).window = null, (i = A(k, B)) !== v && (k.state = null), i) : o;
        }
        var T, L, R = !0;
        function H(k) {
          if (R) {
            var B;
            for (T = new r.Buf32(512), L = new r.Buf32(32), B = 0; B < 144; ) k.lens[B++] = 8;
            for (; B < 256; ) k.lens[B++] = 9;
            for (; B < 280; ) k.lens[B++] = 7;
            for (; B < 288; ) k.lens[B++] = 8;
            for (y(w, k.lens, 0, 288, T, 0, k.work, { bits: 9 }), B = 0; B < 32; ) k.lens[B++] = 5;
            y(g, k.lens, 0, 32, L, 0, k.work, { bits: 5 }), R = !1;
          }
          k.lencode = T, k.lenbits = 9, k.distcode = L, k.distbits = 5;
        }
        function X(k, B, i, P) {
          var Q, U = k.state;
          return U.window === null && (U.wsize = 1 << U.wbits, U.wnext = 0, U.whave = 0, U.window = new r.Buf8(U.wsize)), P >= U.wsize ? (r.arraySet(U.window, B, i - U.wsize, U.wsize, 0), U.wnext = 0, U.whave = U.wsize) : (P < (Q = U.wsize - U.wnext) && (Q = P), r.arraySet(U.window, B, i - P, Q, U.wnext), (P -= Q) ? (r.arraySet(U.window, B, i - P, P, 0), U.wnext = P, U.whave = U.wsize) : (U.wnext += Q, U.wnext === U.wsize && (U.wnext = 0), U.whave < U.wsize && (U.whave += Q))), 0;
        }
        a.inflateReset = E, a.inflateReset2 = A, a.inflateResetKeep = x, a.inflateInit = function(k) {
          return M(k, 15);
        }, a.inflateInit2 = M, a.inflate = function(k, B) {
          var i, P, Q, U, tt, j, J, $, I, Y, q, G, at, pt, et, rt, dt, ot, gt, _t, t, D, O, m, d = 0, z = new r.Buf8(4), F = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!k || !k.state || !k.output || !k.input && k.avail_in !== 0) return o;
          (i = k.state).mode === 12 && (i.mode = 13), tt = k.next_out, Q = k.output, J = k.avail_out, U = k.next_in, P = k.input, j = k.avail_in, $ = i.hold, I = i.bits, Y = j, q = J, D = v;
          t: for (; ; ) switch (i.mode) {
            case _:
              if (i.wrap === 0) {
                i.mode = 13;
                break;
              }
              for (; I < 16; ) {
                if (j === 0) break t;
                j--, $ += P[U++] << I, I += 8;
              }
              if (2 & i.wrap && $ === 35615) {
                z[i.check = 0] = 255 & $, z[1] = $ >>> 8 & 255, i.check = n(i.check, z, 2, 0), I = $ = 0, i.mode = 2;
                break;
              }
              if (i.flags = 0, i.head && (i.head.done = !1), !(1 & i.wrap) || (((255 & $) << 8) + ($ >> 8)) % 31) {
                k.msg = "incorrect header check", i.mode = 30;
                break;
              }
              if ((15 & $) != 8) {
                k.msg = "unknown compression method", i.mode = 30;
                break;
              }
              if (I -= 4, t = 8 + (15 & ($ >>>= 4)), i.wbits === 0) i.wbits = t;
              else if (t > i.wbits) {
                k.msg = "invalid window size", i.mode = 30;
                break;
              }
              i.dmax = 1 << t, k.adler = i.check = 1, i.mode = 512 & $ ? 10 : 12, I = $ = 0;
              break;
            case 2:
              for (; I < 16; ) {
                if (j === 0) break t;
                j--, $ += P[U++] << I, I += 8;
              }
              if (i.flags = $, (255 & i.flags) != 8) {
                k.msg = "unknown compression method", i.mode = 30;
                break;
              }
              if (57344 & i.flags) {
                k.msg = "unknown header flags set", i.mode = 30;
                break;
              }
              i.head && (i.head.text = $ >> 8 & 1), 512 & i.flags && (z[0] = 255 & $, z[1] = $ >>> 8 & 255, i.check = n(i.check, z, 2, 0)), I = $ = 0, i.mode = 3;
            case 3:
              for (; I < 32; ) {
                if (j === 0) break t;
                j--, $ += P[U++] << I, I += 8;
              }
              i.head && (i.head.time = $), 512 & i.flags && (z[0] = 255 & $, z[1] = $ >>> 8 & 255, z[2] = $ >>> 16 & 255, z[3] = $ >>> 24 & 255, i.check = n(i.check, z, 4, 0)), I = $ = 0, i.mode = 4;
            case 4:
              for (; I < 16; ) {
                if (j === 0) break t;
                j--, $ += P[U++] << I, I += 8;
              }
              i.head && (i.head.xflags = 255 & $, i.head.os = $ >> 8), 512 & i.flags && (z[0] = 255 & $, z[1] = $ >>> 8 & 255, i.check = n(i.check, z, 2, 0)), I = $ = 0, i.mode = 5;
            case 5:
              if (1024 & i.flags) {
                for (; I < 16; ) {
                  if (j === 0) break t;
                  j--, $ += P[U++] << I, I += 8;
                }
                i.length = $, i.head && (i.head.extra_len = $), 512 & i.flags && (z[0] = 255 & $, z[1] = $ >>> 8 & 255, i.check = n(i.check, z, 2, 0)), I = $ = 0;
              } else i.head && (i.head.extra = null);
              i.mode = 6;
            case 6:
              if (1024 & i.flags && (j < (G = i.length) && (G = j), G && (i.head && (t = i.head.extra_len - i.length, i.head.extra || (i.head.extra = new Array(i.head.extra_len)), r.arraySet(i.head.extra, P, U, G, t)), 512 & i.flags && (i.check = n(i.check, P, G, U)), j -= G, U += G, i.length -= G), i.length)) break t;
              i.length = 0, i.mode = 7;
            case 7:
              if (2048 & i.flags) {
                if (j === 0) break t;
                for (G = 0; t = P[U + G++], i.head && t && i.length < 65536 && (i.head.name += String.fromCharCode(t)), t && G < j; ) ;
                if (512 & i.flags && (i.check = n(i.check, P, G, U)), j -= G, U += G, t) break t;
              } else i.head && (i.head.name = null);
              i.length = 0, i.mode = 8;
            case 8:
              if (4096 & i.flags) {
                if (j === 0) break t;
                for (G = 0; t = P[U + G++], i.head && t && i.length < 65536 && (i.head.comment += String.fromCharCode(t)), t && G < j; ) ;
                if (512 & i.flags && (i.check = n(i.check, P, G, U)), j -= G, U += G, t) break t;
              } else i.head && (i.head.comment = null);
              i.mode = 9;
            case 9:
              if (512 & i.flags) {
                for (; I < 16; ) {
                  if (j === 0) break t;
                  j--, $ += P[U++] << I, I += 8;
                }
                if ($ !== (65535 & i.check)) {
                  k.msg = "header crc mismatch", i.mode = 30;
                  break;
                }
                I = $ = 0;
              }
              i.head && (i.head.hcrc = i.flags >> 9 & 1, i.head.done = !0), k.adler = i.check = 0, i.mode = 12;
              break;
            case 10:
              for (; I < 32; ) {
                if (j === 0) break t;
                j--, $ += P[U++] << I, I += 8;
              }
              k.adler = i.check = c($), I = $ = 0, i.mode = 11;
            case 11:
              if (i.havedict === 0) return k.next_out = tt, k.avail_out = J, k.next_in = U, k.avail_in = j, i.hold = $, i.bits = I, 2;
              k.adler = i.check = 1, i.mode = 12;
            case 12:
              if (B === 5 || B === 6) break t;
            case 13:
              if (i.last) {
                $ >>>= 7 & I, I -= 7 & I, i.mode = 27;
                break;
              }
              for (; I < 3; ) {
                if (j === 0) break t;
                j--, $ += P[U++] << I, I += 8;
              }
              switch (i.last = 1 & $, I -= 1, 3 & ($ >>>= 1)) {
                case 0:
                  i.mode = 14;
                  break;
                case 1:
                  if (H(i), i.mode = 20, B !== 6) break;
                  $ >>>= 2, I -= 2;
                  break t;
                case 2:
                  i.mode = 17;
                  break;
                case 3:
                  k.msg = "invalid block type", i.mode = 30;
              }
              $ >>>= 2, I -= 2;
              break;
            case 14:
              for ($ >>>= 7 & I, I -= 7 & I; I < 32; ) {
                if (j === 0) break t;
                j--, $ += P[U++] << I, I += 8;
              }
              if ((65535 & $) != ($ >>> 16 ^ 65535)) {
                k.msg = "invalid stored block lengths", i.mode = 30;
                break;
              }
              if (i.length = 65535 & $, I = $ = 0, i.mode = 15, B === 6) break t;
            case 15:
              i.mode = 16;
            case 16:
              if (G = i.length) {
                if (j < G && (G = j), J < G && (G = J), G === 0) break t;
                r.arraySet(Q, P, U, G, tt), j -= G, U += G, J -= G, tt += G, i.length -= G;
                break;
              }
              i.mode = 12;
              break;
            case 17:
              for (; I < 14; ) {
                if (j === 0) break t;
                j--, $ += P[U++] << I, I += 8;
              }
              if (i.nlen = 257 + (31 & $), $ >>>= 5, I -= 5, i.ndist = 1 + (31 & $), $ >>>= 5, I -= 5, i.ncode = 4 + (15 & $), $ >>>= 4, I -= 4, 286 < i.nlen || 30 < i.ndist) {
                k.msg = "too many length or distance symbols", i.mode = 30;
                break;
              }
              i.have = 0, i.mode = 18;
            case 18:
              for (; i.have < i.ncode; ) {
                for (; I < 3; ) {
                  if (j === 0) break t;
                  j--, $ += P[U++] << I, I += 8;
                }
                i.lens[F[i.have++]] = 7 & $, $ >>>= 3, I -= 3;
              }
              for (; i.have < 19; ) i.lens[F[i.have++]] = 0;
              if (i.lencode = i.lendyn, i.lenbits = 7, O = { bits: i.lenbits }, D = y(0, i.lens, 0, 19, i.lencode, 0, i.work, O), i.lenbits = O.bits, D) {
                k.msg = "invalid code lengths set", i.mode = 30;
                break;
              }
              i.have = 0, i.mode = 19;
            case 19:
              for (; i.have < i.nlen + i.ndist; ) {
                for (; rt = (d = i.lencode[$ & (1 << i.lenbits) - 1]) >>> 16 & 255, dt = 65535 & d, !((et = d >>> 24) <= I); ) {
                  if (j === 0) break t;
                  j--, $ += P[U++] << I, I += 8;
                }
                if (dt < 16) $ >>>= et, I -= et, i.lens[i.have++] = dt;
                else {
                  if (dt === 16) {
                    for (m = et + 2; I < m; ) {
                      if (j === 0) break t;
                      j--, $ += P[U++] << I, I += 8;
                    }
                    if ($ >>>= et, I -= et, i.have === 0) {
                      k.msg = "invalid bit length repeat", i.mode = 30;
                      break;
                    }
                    t = i.lens[i.have - 1], G = 3 + (3 & $), $ >>>= 2, I -= 2;
                  } else if (dt === 17) {
                    for (m = et + 3; I < m; ) {
                      if (j === 0) break t;
                      j--, $ += P[U++] << I, I += 8;
                    }
                    I -= et, t = 0, G = 3 + (7 & ($ >>>= et)), $ >>>= 3, I -= 3;
                  } else {
                    for (m = et + 7; I < m; ) {
                      if (j === 0) break t;
                      j--, $ += P[U++] << I, I += 8;
                    }
                    I -= et, t = 0, G = 11 + (127 & ($ >>>= et)), $ >>>= 7, I -= 7;
                  }
                  if (i.have + G > i.nlen + i.ndist) {
                    k.msg = "invalid bit length repeat", i.mode = 30;
                    break;
                  }
                  for (; G--; ) i.lens[i.have++] = t;
                }
              }
              if (i.mode === 30) break;
              if (i.lens[256] === 0) {
                k.msg = "invalid code -- missing end-of-block", i.mode = 30;
                break;
              }
              if (i.lenbits = 9, O = { bits: i.lenbits }, D = y(w, i.lens, 0, i.nlen, i.lencode, 0, i.work, O), i.lenbits = O.bits, D) {
                k.msg = "invalid literal/lengths set", i.mode = 30;
                break;
              }
              if (i.distbits = 6, i.distcode = i.distdyn, O = { bits: i.distbits }, D = y(g, i.lens, i.nlen, i.ndist, i.distcode, 0, i.work, O), i.distbits = O.bits, D) {
                k.msg = "invalid distances set", i.mode = 30;
                break;
              }
              if (i.mode = 20, B === 6) break t;
            case 20:
              i.mode = 21;
            case 21:
              if (6 <= j && 258 <= J) {
                k.next_out = tt, k.avail_out = J, k.next_in = U, k.avail_in = j, i.hold = $, i.bits = I, u(k, q), tt = k.next_out, Q = k.output, J = k.avail_out, U = k.next_in, P = k.input, j = k.avail_in, $ = i.hold, I = i.bits, i.mode === 12 && (i.back = -1);
                break;
              }
              for (i.back = 0; rt = (d = i.lencode[$ & (1 << i.lenbits) - 1]) >>> 16 & 255, dt = 65535 & d, !((et = d >>> 24) <= I); ) {
                if (j === 0) break t;
                j--, $ += P[U++] << I, I += 8;
              }
              if (rt && (240 & rt) == 0) {
                for (ot = et, gt = rt, _t = dt; rt = (d = i.lencode[_t + (($ & (1 << ot + gt) - 1) >> ot)]) >>> 16 & 255, dt = 65535 & d, !(ot + (et = d >>> 24) <= I); ) {
                  if (j === 0) break t;
                  j--, $ += P[U++] << I, I += 8;
                }
                $ >>>= ot, I -= ot, i.back += ot;
              }
              if ($ >>>= et, I -= et, i.back += et, i.length = dt, rt === 0) {
                i.mode = 26;
                break;
              }
              if (32 & rt) {
                i.back = -1, i.mode = 12;
                break;
              }
              if (64 & rt) {
                k.msg = "invalid literal/length code", i.mode = 30;
                break;
              }
              i.extra = 15 & rt, i.mode = 22;
            case 22:
              if (i.extra) {
                for (m = i.extra; I < m; ) {
                  if (j === 0) break t;
                  j--, $ += P[U++] << I, I += 8;
                }
                i.length += $ & (1 << i.extra) - 1, $ >>>= i.extra, I -= i.extra, i.back += i.extra;
              }
              i.was = i.length, i.mode = 23;
            case 23:
              for (; rt = (d = i.distcode[$ & (1 << i.distbits) - 1]) >>> 16 & 255, dt = 65535 & d, !((et = d >>> 24) <= I); ) {
                if (j === 0) break t;
                j--, $ += P[U++] << I, I += 8;
              }
              if ((240 & rt) == 0) {
                for (ot = et, gt = rt, _t = dt; rt = (d = i.distcode[_t + (($ & (1 << ot + gt) - 1) >> ot)]) >>> 16 & 255, dt = 65535 & d, !(ot + (et = d >>> 24) <= I); ) {
                  if (j === 0) break t;
                  j--, $ += P[U++] << I, I += 8;
                }
                $ >>>= ot, I -= ot, i.back += ot;
              }
              if ($ >>>= et, I -= et, i.back += et, 64 & rt) {
                k.msg = "invalid distance code", i.mode = 30;
                break;
              }
              i.offset = dt, i.extra = 15 & rt, i.mode = 24;
            case 24:
              if (i.extra) {
                for (m = i.extra; I < m; ) {
                  if (j === 0) break t;
                  j--, $ += P[U++] << I, I += 8;
                }
                i.offset += $ & (1 << i.extra) - 1, $ >>>= i.extra, I -= i.extra, i.back += i.extra;
              }
              if (i.offset > i.dmax) {
                k.msg = "invalid distance too far back", i.mode = 30;
                break;
              }
              i.mode = 25;
            case 25:
              if (J === 0) break t;
              if (G = q - J, i.offset > G) {
                if ((G = i.offset - G) > i.whave && i.sane) {
                  k.msg = "invalid distance too far back", i.mode = 30;
                  break;
                }
                at = G > i.wnext ? (G -= i.wnext, i.wsize - G) : i.wnext - G, G > i.length && (G = i.length), pt = i.window;
              } else pt = Q, at = tt - i.offset, G = i.length;
              for (J < G && (G = J), J -= G, i.length -= G; Q[tt++] = pt[at++], --G; ) ;
              i.length === 0 && (i.mode = 21);
              break;
            case 26:
              if (J === 0) break t;
              Q[tt++] = i.length, J--, i.mode = 21;
              break;
            case 27:
              if (i.wrap) {
                for (; I < 32; ) {
                  if (j === 0) break t;
                  j--, $ |= P[U++] << I, I += 8;
                }
                if (q -= J, k.total_out += q, i.total += q, q && (k.adler = i.check = i.flags ? n(i.check, Q, q, tt - q) : s(i.check, Q, q, tt - q)), q = J, (i.flags ? $ : c($)) !== i.check) {
                  k.msg = "incorrect data check", i.mode = 30;
                  break;
                }
                I = $ = 0;
              }
              i.mode = 28;
            case 28:
              if (i.wrap && i.flags) {
                for (; I < 32; ) {
                  if (j === 0) break t;
                  j--, $ += P[U++] << I, I += 8;
                }
                if ($ !== (4294967295 & i.total)) {
                  k.msg = "incorrect length check", i.mode = 30;
                  break;
                }
                I = $ = 0;
              }
              i.mode = 29;
            case 29:
              D = 1;
              break t;
            case 30:
              D = -3;
              break t;
            case 31:
              return -4;
            default:
              return o;
          }
          return k.next_out = tt, k.avail_out = J, k.next_in = U, k.avail_in = j, i.hold = $, i.bits = I, (i.wsize || q !== k.avail_out && i.mode < 30 && (i.mode < 27 || B !== 4)) && X(k, k.output, k.next_out, q - k.avail_out) ? (i.mode = 31, -4) : (Y -= k.avail_in, q -= k.avail_out, k.total_in += Y, k.total_out += q, i.total += q, i.wrap && q && (k.adler = i.check = i.flags ? n(i.check, Q, q, k.next_out - q) : s(i.check, Q, q, k.next_out - q)), k.data_type = i.bits + (i.last ? 64 : 0) + (i.mode === 12 ? 128 : 0) + (i.mode === 20 || i.mode === 15 ? 256 : 0), (Y == 0 && q === 0 || B === 4) && D === v && (D = -5), D);
        }, a.inflateEnd = function(k) {
          if (!k || !k.state) return o;
          var B = k.state;
          return B.window && (B.window = null), k.state = null, v;
        }, a.inflateGetHeader = function(k, B) {
          var i;
          return k && k.state ? (2 & (i = k.state).wrap) == 0 ? o : ((i.head = B).done = !1, v) : o;
        }, a.inflateSetDictionary = function(k, B) {
          var i, P = B.length;
          return k && k.state ? (i = k.state).wrap !== 0 && i.mode !== 11 ? o : i.mode === 11 && s(1, B, P, 0) !== i.check ? -3 : X(k, B, P, P) ? (i.mode = 31, -4) : (i.havedict = 1, v) : o;
        }, a.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, f, a) {
        var r = e("../utils/common"), s = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], n = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], u = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], y = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        f.exports = function(w, g, v, o, _, h, p, c) {
          var b, x, E, A, M, T, L, R, H, X = c.bits, k = 0, B = 0, i = 0, P = 0, Q = 0, U = 0, tt = 0, j = 0, J = 0, $ = 0, I = null, Y = 0, q = new r.Buf16(16), G = new r.Buf16(16), at = null, pt = 0;
          for (k = 0; k <= 15; k++) q[k] = 0;
          for (B = 0; B < o; B++) q[g[v + B]]++;
          for (Q = X, P = 15; 1 <= P && q[P] === 0; P--) ;
          if (P < Q && (Q = P), P === 0) return _[h++] = 20971520, _[h++] = 20971520, c.bits = 1, 0;
          for (i = 1; i < P && q[i] === 0; i++) ;
          for (Q < i && (Q = i), k = j = 1; k <= 15; k++) if (j <<= 1, (j -= q[k]) < 0) return -1;
          if (0 < j && (w === 0 || P !== 1)) return -1;
          for (G[1] = 0, k = 1; k < 15; k++) G[k + 1] = G[k] + q[k];
          for (B = 0; B < o; B++) g[v + B] !== 0 && (p[G[g[v + B]]++] = B);
          if (T = w === 0 ? (I = at = p, 19) : w === 1 ? (I = s, Y -= 257, at = n, pt -= 257, 256) : (I = u, at = y, -1), k = i, M = h, tt = B = $ = 0, E = -1, A = (J = 1 << (U = Q)) - 1, w === 1 && 852 < J || w === 2 && 592 < J) return 1;
          for (; ; ) {
            for (L = k - tt, H = p[B] < T ? (R = 0, p[B]) : p[B] > T ? (R = at[pt + p[B]], I[Y + p[B]]) : (R = 96, 0), b = 1 << k - tt, i = x = 1 << U; _[M + ($ >> tt) + (x -= b)] = L << 24 | R << 16 | H | 0, x !== 0; ) ;
            for (b = 1 << k - 1; $ & b; ) b >>= 1;
            if (b !== 0 ? ($ &= b - 1, $ += b) : $ = 0, B++, --q[k] == 0) {
              if (k === P) break;
              k = g[v + p[B]];
            }
            if (Q < k && ($ & A) !== E) {
              for (tt === 0 && (tt = Q), M += i, j = 1 << (U = k - tt); U + tt < P && !((j -= q[U + tt]) <= 0); ) U++, j <<= 1;
              if (J += 1 << U, w === 1 && 852 < J || w === 2 && 592 < J) return 1;
              _[E = $ & A] = Q << 24 | U << 16 | M - h | 0;
            }
          }
          return $ !== 0 && (_[M + $] = k - tt << 24 | 64 << 16 | 0), c.bits = Q, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, f, a) {
        f.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, f, a) {
        var r = e("../utils/common"), s = 0, n = 1;
        function u(d) {
          for (var z = d.length; 0 <= --z; ) d[z] = 0;
        }
        var y = 0, w = 29, g = 256, v = g + 1 + w, o = 30, _ = 19, h = 2 * v + 1, p = 15, c = 16, b = 7, x = 256, E = 16, A = 17, M = 18, T = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], L = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], R = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], H = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], X = new Array(2 * (v + 2));
        u(X);
        var k = new Array(2 * o);
        u(k);
        var B = new Array(512);
        u(B);
        var i = new Array(256);
        u(i);
        var P = new Array(w);
        u(P);
        var Q, U, tt, j = new Array(o);
        function J(d, z, F, N, C) {
          this.static_tree = d, this.extra_bits = z, this.extra_base = F, this.elems = N, this.max_length = C, this.has_stree = d && d.length;
        }
        function $(d, z) {
          this.dyn_tree = d, this.max_code = 0, this.stat_desc = z;
        }
        function I(d) {
          return d < 256 ? B[d] : B[256 + (d >>> 7)];
        }
        function Y(d, z) {
          d.pending_buf[d.pending++] = 255 & z, d.pending_buf[d.pending++] = z >>> 8 & 255;
        }
        function q(d, z, F) {
          d.bi_valid > c - F ? (d.bi_buf |= z << d.bi_valid & 65535, Y(d, d.bi_buf), d.bi_buf = z >> c - d.bi_valid, d.bi_valid += F - c) : (d.bi_buf |= z << d.bi_valid & 65535, d.bi_valid += F);
        }
        function G(d, z, F) {
          q(d, F[2 * z], F[2 * z + 1]);
        }
        function at(d, z) {
          for (var F = 0; F |= 1 & d, d >>>= 1, F <<= 1, 0 < --z; ) ;
          return F >>> 1;
        }
        function pt(d, z, F) {
          var N, C, W = new Array(p + 1), K = 0;
          for (N = 1; N <= p; N++) W[N] = K = K + F[N - 1] << 1;
          for (C = 0; C <= z; C++) {
            var Z = d[2 * C + 1];
            Z !== 0 && (d[2 * C] = at(W[Z]++, Z));
          }
        }
        function et(d) {
          var z;
          for (z = 0; z < v; z++) d.dyn_ltree[2 * z] = 0;
          for (z = 0; z < o; z++) d.dyn_dtree[2 * z] = 0;
          for (z = 0; z < _; z++) d.bl_tree[2 * z] = 0;
          d.dyn_ltree[2 * x] = 1, d.opt_len = d.static_len = 0, d.last_lit = d.matches = 0;
        }
        function rt(d) {
          8 < d.bi_valid ? Y(d, d.bi_buf) : 0 < d.bi_valid && (d.pending_buf[d.pending++] = d.bi_buf), d.bi_buf = 0, d.bi_valid = 0;
        }
        function dt(d, z, F, N) {
          var C = 2 * z, W = 2 * F;
          return d[C] < d[W] || d[C] === d[W] && N[z] <= N[F];
        }
        function ot(d, z, F) {
          for (var N = d.heap[F], C = F << 1; C <= d.heap_len && (C < d.heap_len && dt(z, d.heap[C + 1], d.heap[C], d.depth) && C++, !dt(z, N, d.heap[C], d.depth)); ) d.heap[F] = d.heap[C], F = C, C <<= 1;
          d.heap[F] = N;
        }
        function gt(d, z, F) {
          var N, C, W, K, Z = 0;
          if (d.last_lit !== 0) for (; N = d.pending_buf[d.d_buf + 2 * Z] << 8 | d.pending_buf[d.d_buf + 2 * Z + 1], C = d.pending_buf[d.l_buf + Z], Z++, N === 0 ? G(d, C, z) : (G(d, (W = i[C]) + g + 1, z), (K = T[W]) !== 0 && q(d, C -= P[W], K), G(d, W = I(--N), F), (K = L[W]) !== 0 && q(d, N -= j[W], K)), Z < d.last_lit; ) ;
          G(d, x, z);
        }
        function _t(d, z) {
          var F, N, C, W = z.dyn_tree, K = z.stat_desc.static_tree, Z = z.stat_desc.has_stree, V = z.stat_desc.elems, nt = -1;
          for (d.heap_len = 0, d.heap_max = h, F = 0; F < V; F++) W[2 * F] !== 0 ? (d.heap[++d.heap_len] = nt = F, d.depth[F] = 0) : W[2 * F + 1] = 0;
          for (; d.heap_len < 2; ) W[2 * (C = d.heap[++d.heap_len] = nt < 2 ? ++nt : 0)] = 1, d.depth[C] = 0, d.opt_len--, Z && (d.static_len -= K[2 * C + 1]);
          for (z.max_code = nt, F = d.heap_len >> 1; 1 <= F; F--) ot(d, W, F);
          for (C = V; F = d.heap[1], d.heap[1] = d.heap[d.heap_len--], ot(d, W, 1), N = d.heap[1], d.heap[--d.heap_max] = F, d.heap[--d.heap_max] = N, W[2 * C] = W[2 * F] + W[2 * N], d.depth[C] = (d.depth[F] >= d.depth[N] ? d.depth[F] : d.depth[N]) + 1, W[2 * F + 1] = W[2 * N + 1] = C, d.heap[1] = C++, ot(d, W, 1), 2 <= d.heap_len; ) ;
          d.heap[--d.heap_max] = d.heap[1], (function(it, mt) {
            var Et, bt, Ct, lt, Mt, Gt, yt = mt.dyn_tree, ee = mt.max_code, we = mt.stat_desc.static_tree, ke = mt.stat_desc.has_stree, xe = mt.stat_desc.extra_bits, ie = mt.stat_desc.extra_base, It = mt.stat_desc.max_length, Ft = 0;
            for (lt = 0; lt <= p; lt++) it.bl_count[lt] = 0;
            for (yt[2 * it.heap[it.heap_max] + 1] = 0, Et = it.heap_max + 1; Et < h; Et++) It < (lt = yt[2 * yt[2 * (bt = it.heap[Et]) + 1] + 1] + 1) && (lt = It, Ft++), yt[2 * bt + 1] = lt, ee < bt || (it.bl_count[lt]++, Mt = 0, ie <= bt && (Mt = xe[bt - ie]), Gt = yt[2 * bt], it.opt_len += Gt * (lt + Mt), ke && (it.static_len += Gt * (we[2 * bt + 1] + Mt)));
            if (Ft !== 0) {
              do {
                for (lt = It - 1; it.bl_count[lt] === 0; ) lt--;
                it.bl_count[lt]--, it.bl_count[lt + 1] += 2, it.bl_count[It]--, Ft -= 2;
              } while (0 < Ft);
              for (lt = It; lt !== 0; lt--) for (bt = it.bl_count[lt]; bt !== 0; ) ee < (Ct = it.heap[--Et]) || (yt[2 * Ct + 1] !== lt && (it.opt_len += (lt - yt[2 * Ct + 1]) * yt[2 * Ct], yt[2 * Ct + 1] = lt), bt--);
            }
          })(d, z), pt(W, nt, d.bl_count);
        }
        function t(d, z, F) {
          var N, C, W = -1, K = z[1], Z = 0, V = 7, nt = 4;
          for (K === 0 && (V = 138, nt = 3), z[2 * (F + 1) + 1] = 65535, N = 0; N <= F; N++) C = K, K = z[2 * (N + 1) + 1], ++Z < V && C === K || (Z < nt ? d.bl_tree[2 * C] += Z : C !== 0 ? (C !== W && d.bl_tree[2 * C]++, d.bl_tree[2 * E]++) : Z <= 10 ? d.bl_tree[2 * A]++ : d.bl_tree[2 * M]++, W = C, nt = (Z = 0) === K ? (V = 138, 3) : C === K ? (V = 6, 3) : (V = 7, 4));
        }
        function D(d, z, F) {
          var N, C, W = -1, K = z[1], Z = 0, V = 7, nt = 4;
          for (K === 0 && (V = 138, nt = 3), N = 0; N <= F; N++) if (C = K, K = z[2 * (N + 1) + 1], !(++Z < V && C === K)) {
            if (Z < nt) for (; G(d, C, d.bl_tree), --Z != 0; ) ;
            else C !== 0 ? (C !== W && (G(d, C, d.bl_tree), Z--), G(d, E, d.bl_tree), q(d, Z - 3, 2)) : Z <= 10 ? (G(d, A, d.bl_tree), q(d, Z - 3, 3)) : (G(d, M, d.bl_tree), q(d, Z - 11, 7));
            W = C, nt = (Z = 0) === K ? (V = 138, 3) : C === K ? (V = 6, 3) : (V = 7, 4);
          }
        }
        u(j);
        var O = !1;
        function m(d, z, F, N) {
          q(d, (y << 1) + (N ? 1 : 0), 3), (function(C, W, K, Z) {
            rt(C), Y(C, K), Y(C, ~K), r.arraySet(C.pending_buf, C.window, W, K, C.pending), C.pending += K;
          })(d, z, F);
        }
        a._tr_init = function(d) {
          O || ((function() {
            var z, F, N, C, W, K = new Array(p + 1);
            for (C = N = 0; C < w - 1; C++) for (P[C] = N, z = 0; z < 1 << T[C]; z++) i[N++] = C;
            for (i[N - 1] = C, C = W = 0; C < 16; C++) for (j[C] = W, z = 0; z < 1 << L[C]; z++) B[W++] = C;
            for (W >>= 7; C < o; C++) for (j[C] = W << 7, z = 0; z < 1 << L[C] - 7; z++) B[256 + W++] = C;
            for (F = 0; F <= p; F++) K[F] = 0;
            for (z = 0; z <= 143; ) X[2 * z + 1] = 8, z++, K[8]++;
            for (; z <= 255; ) X[2 * z + 1] = 9, z++, K[9]++;
            for (; z <= 279; ) X[2 * z + 1] = 7, z++, K[7]++;
            for (; z <= 287; ) X[2 * z + 1] = 8, z++, K[8]++;
            for (pt(X, v + 1, K), z = 0; z < o; z++) k[2 * z + 1] = 5, k[2 * z] = at(z, 5);
            Q = new J(X, T, g + 1, v, p), U = new J(k, L, 0, o, p), tt = new J(new Array(0), R, 0, _, b);
          })(), O = !0), d.l_desc = new $(d.dyn_ltree, Q), d.d_desc = new $(d.dyn_dtree, U), d.bl_desc = new $(d.bl_tree, tt), d.bi_buf = 0, d.bi_valid = 0, et(d);
        }, a._tr_stored_block = m, a._tr_flush_block = function(d, z, F, N) {
          var C, W, K = 0;
          0 < d.level ? (d.strm.data_type === 2 && (d.strm.data_type = (function(Z) {
            var V, nt = 4093624447;
            for (V = 0; V <= 31; V++, nt >>>= 1) if (1 & nt && Z.dyn_ltree[2 * V] !== 0) return s;
            if (Z.dyn_ltree[18] !== 0 || Z.dyn_ltree[20] !== 0 || Z.dyn_ltree[26] !== 0) return n;
            for (V = 32; V < g; V++) if (Z.dyn_ltree[2 * V] !== 0) return n;
            return s;
          })(d)), _t(d, d.l_desc), _t(d, d.d_desc), K = (function(Z) {
            var V;
            for (t(Z, Z.dyn_ltree, Z.l_desc.max_code), t(Z, Z.dyn_dtree, Z.d_desc.max_code), _t(Z, Z.bl_desc), V = _ - 1; 3 <= V && Z.bl_tree[2 * H[V] + 1] === 0; V--) ;
            return Z.opt_len += 3 * (V + 1) + 5 + 5 + 4, V;
          })(d), C = d.opt_len + 3 + 7 >>> 3, (W = d.static_len + 3 + 7 >>> 3) <= C && (C = W)) : C = W = F + 5, F + 4 <= C && z !== -1 ? m(d, z, F, N) : d.strategy === 4 || W === C ? (q(d, 2 + (N ? 1 : 0), 3), gt(d, X, k)) : (q(d, 4 + (N ? 1 : 0), 3), (function(Z, V, nt, it) {
            var mt;
            for (q(Z, V - 257, 5), q(Z, nt - 1, 5), q(Z, it - 4, 4), mt = 0; mt < it; mt++) q(Z, Z.bl_tree[2 * H[mt] + 1], 3);
            D(Z, Z.dyn_ltree, V - 1), D(Z, Z.dyn_dtree, nt - 1);
          })(d, d.l_desc.max_code + 1, d.d_desc.max_code + 1, K + 1), gt(d, d.dyn_ltree, d.dyn_dtree)), et(d), N && rt(d);
        }, a._tr_tally = function(d, z, F) {
          return d.pending_buf[d.d_buf + 2 * d.last_lit] = z >>> 8 & 255, d.pending_buf[d.d_buf + 2 * d.last_lit + 1] = 255 & z, d.pending_buf[d.l_buf + d.last_lit] = 255 & F, d.last_lit++, z === 0 ? d.dyn_ltree[2 * F]++ : (d.matches++, z--, d.dyn_ltree[2 * (i[F] + g + 1)]++, d.dyn_dtree[2 * I(z)]++), d.last_lit === d.lit_bufsize - 1;
        }, a._tr_align = function(d) {
          q(d, 2, 3), G(d, x, X), (function(z) {
            z.bi_valid === 16 ? (Y(z, z.bi_buf), z.bi_buf = 0, z.bi_valid = 0) : 8 <= z.bi_valid && (z.pending_buf[z.pending++] = 255 & z.bi_buf, z.bi_buf >>= 8, z.bi_valid -= 8);
          })(d);
        };
      }, { "../utils/common": 41 }], 53: [function(e, f, a) {
        f.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, f, a) {
        (function(r) {
          (function(s, n) {
            if (!s.setImmediate) {
              var u, y, w, g, v = 1, o = {}, _ = !1, h = s.document, p = Object.getPrototypeOf && Object.getPrototypeOf(s);
              p = p && p.setTimeout ? p : s, u = {}.toString.call(s.process) === "[object process]" ? function(E) {
                process.nextTick(function() {
                  b(E);
                });
              } : (function() {
                if (s.postMessage && !s.importScripts) {
                  var E = !0, A = s.onmessage;
                  return s.onmessage = function() {
                    E = !1;
                  }, s.postMessage("", "*"), s.onmessage = A, E;
                }
              })() ? (g = "setImmediate$" + Math.random() + "$", s.addEventListener ? s.addEventListener("message", x, !1) : s.attachEvent("onmessage", x), function(E) {
                s.postMessage(g + E, "*");
              }) : s.MessageChannel ? ((w = new MessageChannel()).port1.onmessage = function(E) {
                b(E.data);
              }, function(E) {
                w.port2.postMessage(E);
              }) : h && "onreadystatechange" in h.createElement("script") ? (y = h.documentElement, function(E) {
                var A = h.createElement("script");
                A.onreadystatechange = function() {
                  b(E), A.onreadystatechange = null, y.removeChild(A), A = null;
                }, y.appendChild(A);
              }) : function(E) {
                setTimeout(b, 0, E);
              }, p.setImmediate = function(E) {
                typeof E != "function" && (E = new Function("" + E));
                for (var A = new Array(arguments.length - 1), M = 0; M < A.length; M++) A[M] = arguments[M + 1];
                var T = { callback: E, args: A };
                return o[v] = T, u(v), v++;
              }, p.clearImmediate = c;
            }
            function c(E) {
              delete o[E];
            }
            function b(E) {
              if (_) setTimeout(b, 0, E);
              else {
                var A = o[E];
                if (A) {
                  _ = !0;
                  try {
                    (function(M) {
                      var T = M.callback, L = M.args;
                      switch (L.length) {
                        case 0:
                          T();
                          break;
                        case 1:
                          T(L[0]);
                          break;
                        case 2:
                          T(L[0], L[1]);
                          break;
                        case 3:
                          T(L[0], L[1], L[2]);
                          break;
                        default:
                          T.apply(n, L);
                      }
                    })(A);
                  } finally {
                    c(E), _ = !1;
                  }
                }
              }
            }
            function x(E) {
              E.source === s && typeof E.data == "string" && E.data.indexOf(g) === 0 && b(+E.data.slice(g.length));
            }
          })(typeof self > "u" ? r === void 0 ? this : r : self);
        }).call(this, typeof Nt < "u" ? Nt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(Kt)), Kt.exports;
}
var ii = ei();
const me = /* @__PURE__ */ ti(ii);
var ri = Object.defineProperty, ni = Object.getOwnPropertyDescriptor, ct = (S, l, e, f) => {
  for (var a = f > 1 ? void 0 : f ? ni(l, e) : l, r = S.length - 1, s; r >= 0; r--)
    (s = S[r]) && (a = (f ? s(l, e, a) : s(a)) || a);
  return f && a && ri(l, e, a), a;
};
let ht = class extends Se(Rt) {
  constructor() {
    super(...arguments), this._currentSection = "Images", this._maxWidth = "2400", this._ignoreMaxWidth = !1, this._compressionLevel = "medium", this._sortedMediaItems = [], this._resizableMediaItems = [], this._selectedMediaItems = [], this._isAnalyzing = !1, this._isProcessing = !1, this._isDownloadingPreview = !1, this._tableLimit = 50, this._showDialog = null, this._totalItemsFound = 0, this._progressNum = 0, this._numOfSuccessfullyResizedMediaItems = 0, this._mbsSaved = 0, this._originalSize = 0, this._foundFolders = [], this._mediaTreeRepository = new ze(this), this._closeDialog = () => {
      this._showDialog = null;
    }, this._onKeyDown = (S) => {
      S.key === "Escape" && this._showDialog && this._closeDialog();
    };
  }
  async connectedCallback() {
    super.connectedCallback(), window.addEventListener("keydown", this._onKeyDown), this._authContext = await this.getContext(Ae);
  }
  disconnectedCallback() {
    window.removeEventListener("keydown", this._onKeyDown), super.disconnectedCallback();
  }
  async _getAuthHeaders() {
    return this._authContext ? {
      Authorization: `Bearer ${await this._authContext.getLatestToken()}`
    } : {};
  }
  // Navigate to section
  _navigateToSection(S) {
    this._currentSection = S;
  }
  // Analyze images
  async _analyzeImages() {
    this._isAnalyzing = !0, this._sortedMediaItems = [], this._resizableMediaItems = [], this._selectedMediaItems = [], this._foundFolders = [], this._totalItemsFound = 0, await this._processMediaItems(null), this._isAnalyzing = !1, this._navigateToSection("Show Image Previews");
  }
  // Recursively process media items with pagination
  async _processMediaItems(S) {
    let l = 0;
    const e = 50;
    let f = !0;
    for (; f; ) {
      const a = {
        skip: l,
        take: e
      };
      if (S === null) {
        const { data: r } = await this._mediaTreeRepository.requestTreeRootItems(a);
        if (!r || r.items.length === 0) {
          f = !1;
          break;
        }
        await this._processMediaBatch(r.items), r.items.length < e ? f = !1 : l += e;
      } else {
        const { data: r } = await this._mediaTreeRepository.requestTreeItemsOf({
          parent: { unique: S, entityType: "media" },
          skip: l,
          take: e
        });
        if (!r || r.items.length === 0) {
          f = !1;
          break;
        }
        await this._processMediaBatch(r.items), r.items.length < e ? f = !1 : l += e;
      }
    }
  }
  // Process a batch of media items
  async _processMediaBatch(S) {
    for (const l of S)
      l.isFolder || l.hasChildren ? (this._foundFolders.push({ id: l.unique, name: l.name }), await this._processMediaItems(l.unique)) : (this._totalItemsFound++, await this._handleMediaItem(l));
  }
  // Handle individual media item - fetch details from backend
  async _handleMediaItem(S) {
    try {
      const e = {
        ...await this._getAuthHeaders(),
        "Content-Type": "application/json"
      }, f = await fetch(`/umbraco/management/api/v1/mediaprocessor/GetById/${S.unique}`, {
        headers: e
      });
      if (!f.ok) {
        console.warn(`Could not fetch media details for ${S.unique}:`, f.status);
        return;
      }
      const a = await f.json();
      if (!a) return;
      const r = a.url || "", s = parseInt(a.width) || 0, n = parseInt(a.height) || 0, u = parseInt(a.bytes) || 0, y = a.extension?.toLowerCase() || "", w = this._ignoreMaxWidth ? 0 : parseInt(this._maxWidth);
      if (s > 0 && (!w || s > w)) {
        const g = await this._getFolderName(S.parent?.unique || null), v = {
          id: S.unique,
          // Keep as string GUID
          name: S.name,
          owner: "Unknown",
          updateDate: new Date(S.updateDate).toLocaleDateString(),
          src: r || "",
          width: s,
          height: n,
          size: parseFloat((u / 1e6).toFixed(2)),
          sizeNotFixed: u / 1e6,
          fileType: y,
          fileExtension: y,
          folder: g,
          parentId: S.parent?.unique || null,
          resizable: ["jpeg", "jpg", "png"].includes(y),
          recentlyResizedCorrectly: !1,
          originalSizeBetter: !1
        };
        this._sortedMediaItems = [...this._sortedMediaItems, v], v.resizable && (this._resizableMediaItems = [...this._resizableMediaItems, v], this._selectedMediaItems = [...this._selectedMediaItems, v]), this._sortedMediaItems.sort((o, _) => _.width - o.width);
      }
    } catch (l) {
      console.error("Error handling media item:", l);
    }
  }
  // Get folder name
  async _getFolderName(S) {
    if (!S) return "[root]";
    const l = this._foundFolders.find((e) => e.id === S);
    return l ? l.name : "[root]";
  }
  // Toggle item selection
  _toggleItemSelection(S) {
    this._selectedMediaItems.findIndex((e) => e.id === S.id) >= 0 ? this._selectedMediaItems = this._selectedMediaItems.filter((e) => e.id !== S.id) : this._selectedMediaItems = [...this._selectedMediaItems, S];
  }
  // Select all
  _selectAll() {
    this._selectedMediaItems = [...this._resizableMediaItems];
  }
  // Deselect all
  _deselectAll() {
    this._selectedMediaItems = [];
  }
  // Resize images
  async _resizeImages() {
    this._isProcessing = !0, this._progressNum = 0, this._originalSize = 0, this._mbsSaved = 0;
    const S = 25;
    for (let l = 0; l < this._selectedMediaItems.length; l += S) {
      const f = this._selectedMediaItems.slice(l, l + S).map((a) => ({
        MediaID: a.id,
        // Now a string GUID
        Format: a.fileExtension === "png" ? "png" : "jpg",
        OriginalSize: a.sizeNotFixed * 1024,
        FileName: a.name
      }));
      await this._sendProcessRequest(f), this._progressNum = Math.min(l + S, this._selectedMediaItems.length);
    }
    this._numOfSuccessfullyResizedMediaItems = this._selectedMediaItems.filter(
      (l) => l.recentlyResizedCorrectly
    ).length, this._isProcessing = !1, this._navigateToSection("Results");
  }
  // Send process request
  async _sendProcessRequest(S) {
    const l = new FormData();
    l.append("MediaList", JSON.stringify(S)), l.append("MaxWidth", this._ignoreMaxWidth ? "0" : this._maxWidth), l.append("CompressionLevel", this._compressionLevel);
    const f = {
      ...await this._getAuthHeaders()
    };
    (await (await fetch("/umbraco/management/api/v1/mediaprocessor/ProcessServer", {
      method: "POST",
      headers: f,
      body: l
    })).json()).forEach((s) => {
      const n = this._selectedMediaItems.find((u) => u.id === s.MediaID);
      n && (n.recentlyResizedCorrectly = s.IsResized, n.originalSizeBetter = s.IsOriginalSizeBetter, n.widthPostResizing = s.WidthPostResizing, n.fileSizePostResizing = s.NewSizeInBytes / 1e6, n.fileSizeReductionPercentage = s.FileSizeReductionPercentage, this._originalSize += n.size, s.IsResized && (this._mbsSaved += n.size - s.NewSizeInBytes / 1e6));
    });
  }
  // Download preview
  async _downloadPreview() {
    this._isDownloadingPreview = !0;
    const S = new me(), l = 25;
    for (let r = 0; r < this._selectedMediaItems.length; r += l) {
      const n = this._selectedMediaItems.slice(r, r + l).map((o) => ({
        MediaID: o.id,
        Format: o.fileExtension === "png" ? "png" : "jpg",
        OriginalSize: o.sizeNotFixed * 1024,
        FileName: o.name
      })), u = new FormData();
      u.append("MediaList", JSON.stringify(n)), u.append("MaxWidth", this._ignoreMaxWidth ? "0" : this._maxWidth), u.append("CompressionLevel", this._compressionLevel);
      const w = {
        ...await this._getAuthHeaders()
      };
      (await (await fetch("/umbraco/management/api/v1/mediaprocessor/GetPreview", {
        method: "POST",
        headers: w,
        body: u
      })).json()).forEach((o) => {
        const _ = this._base64ToArrayBuffer(o.NewFile);
        S.file(`preview_${o.FileName}.${o.FileFormat}`, _);
      });
    }
    const e = await S.generateAsync({ type: "blob" }), f = URL.createObjectURL(e), a = document.createElement("a");
    a.href = f, a.download = "image_previews.zip", a.click(), URL.revokeObjectURL(f), this._isDownloadingPreview = !1;
  }
  // Download backup
  async _downloadBackup() {
    this._showDialog = null, this._isProcessing = !0;
    const S = new me(), l = 25;
    for (let r = 0; r < this._selectedMediaItems.length; r += l) {
      const n = this._selectedMediaItems.slice(r, r + l).map((o) => o.id).join(","), u = new FormData();
      u.append("mediaIds", n);
      const w = {
        ...await this._getAuthHeaders()
      };
      (await (await fetch("/umbraco/management/api/v1/mediaprocessor/BackupMediaItems", {
        method: "POST",
        headers: w,
        body: u
      })).json()).forEach((o) => {
        const _ = this._base64ToArrayBuffer(o.fileArray);
        S.file(o.name, _);
      });
    }
    const e = await S.generateAsync({ type: "blob" }), f = URL.createObjectURL(e), a = document.createElement("a");
    a.href = f, a.download = "selected_images_backup.zip", a.click(), URL.revokeObjectURL(f), this._isProcessing = !1;
  }
  _base64ToArrayBuffer(S) {
    const l = window.atob(S), e = l.length, f = new Uint8Array(e);
    for (let a = 0; a < e; a++)
      f[a] = l.charCodeAt(a);
    return f;
  }
  render() {
    return ut`
      <uui-box headline="Digital Wonderlab Image Resizer">
        ${this._renderCurrentSection()}
      </uui-box>
      ${this._renderDialogs()}
    `;
  }
  _renderCurrentSection() {
    switch (this._currentSection) {
      case "Images":
        return this._renderConfigurationSection();
      case "Show Image Previews":
        return this._renderPreviewSection();
      case "Confirmation":
        return this._renderConfirmationSection();
      case "Results":
        return this._renderResultsSection();
      default:
        return st;
    }
  }
  _renderConfigurationSection() {
    return ut`
      <div class="section">
        <p>Smaller images load faster. Use this plugin to easily reduce the size of images that have been uploaded at a larger width than you need to a new maximum width of your choice. Then choose a compression level to further reduce the file size.</p>
        
        <div class="settings-container">
          <div class="width-setting">
            <h4>1. Max Width</h4>
            <p class="small-text">Images exceeding this width will be resized while preserving their aspect ratio.</p>
            <uui-input
              type="number"
              .value=${this._maxWidth}
              @change=${(S) => this._maxWidth = S.target.value}
              ?disabled=${this._ignoreMaxWidth}
              placeholder="e.g. 2400"
            >
              <span slot="append" class="input-suffix">px</span>
            </uui-input>
            <uui-checkbox
              ?checked=${this._ignoreMaxWidth}
              @change=${(S) => this._ignoreMaxWidth = S.target.checked}
              label="Ignore Max Width"
            >
              No thanks, I don't want to change the width of my images.
            </uui-checkbox>
          </div>

          <div class="compression-setting">
            <h4>2. Compression Level</h4>
            <p class="small-text">A higher level of compression will result in a lower file size, but with a greater reduction in image quality.</p>
            <div class="compression-buttons">
              ${this._renderCompressionButton("none", "None", "No compression added")}
              ${this._renderCompressionButton("low", "Minimum", "25% compression added")}
              ${this._renderCompressionButton("medium", "Medium (recommended)", "50% compression added")}
              ${this._renderCompressionButton("high", "Maximum", "75% compression added")}
            </div>
          </div>
        </div>

        <div class="actions">
          <uui-button
            look="primary"
            color="positive"
            @click=${this._analyzeImages}
            ?disabled=${this._isAnalyzing}
          >
            ${this._isAnalyzing ? ut`
              <uui-loader-circle></uui-loader-circle>
              Analysing... (Found ${this._totalItemsFound} items)
            ` : "Analyse Images..."}
          </uui-button>
        </div>
      </div>
    `;
  }
  _renderCompressionButton(S, l, e) {
    const f = this._compressionLevel === S;
    return ut`
      <uui-button
        look=${f ? "primary" : "outline"}
        label=${l}
        @click=${() => this._compressionLevel = S}
        class="compression-btn ${f ? "selected" : ""}"
      >
        <span class="compression-btn-content">
          <strong>${l}</strong>
          <span class="compression-btn-description">${e}</span>
        </span>
      </uui-button>
    `;
  }
  _renderPreviewSection() {
    return ut`
      <div class="section">
        <div class="header">
          <div>
            <h3>Images to Resize</h3>
            <p>Found ${this._sortedMediaItems.length} images. ${this._resizableMediaItems.length} can be resized.</p>
          </div>
          <div class="header-actions">
            <uui-button look="default" @click=${() => this._navigateToSection("Images")}>Back</uui-button>
            <uui-button
              look="outline"
              @click=${this._downloadPreview}
              ?disabled=${this._selectedMediaItems.length === 0 || this._isDownloadingPreview}
            >
              ${this._isDownloadingPreview ? ut`
                <uui-loader-circle></uui-loader-circle>
                Generating Preview...
              ` : "Download Preview"}
            </uui-button>
            <uui-button
              look="primary"
              color="positive"
              @click=${() => this._navigateToSection("Confirmation")}
              ?disabled=${this._selectedMediaItems.length === 0}
            >
              Convert ${this._selectedMediaItems.length} Images...
            </uui-button>
          </div>
        </div>

        <div class="table-actions">
          <span class="selection-summary">
            <strong>${this._selectedMediaItems.length}</strong> of ${this._resizableMediaItems.length} resizable images selected
          </span>
          <uui-button
            look="secondary"
            label="Select all"
            ?disabled=${this._resizableMediaItems.length === 0 || this._selectedMediaItems.length === this._resizableMediaItems.length}
            @click=${this._selectAll}
          >Select all</uui-button>
          <uui-button
            look="secondary"
            label="Deselect all"
            ?disabled=${this._selectedMediaItems.length === 0}
            @click=${this._deselectAll}
          >Deselect all</uui-button>
        </div>

        ${this._renderMediaTable()}
      </div>
    `;
  }
  _renderMediaTable() {
    const S = this._sortedMediaItems.slice(0, this._tableLimit), l = this._resizableMediaItems.length > 0 && this._selectedMediaItems.length === this._resizableMediaItems.length;
    return ut`
      <uui-table>
        <uui-table-head>
          <uui-table-head-cell>
            <uui-checkbox
              label="Select all resizable images"
              label-position="none"
              ?checked=${l}
              ?disabled=${this._resizableMediaItems.length === 0}
              @change=${(e) => e.target.checked ? this._selectAll() : this._deselectAll()}
            ></uui-checkbox>
          </uui-table-head-cell>
          <uui-table-head-cell>File Name</uui-table-head-cell>
          <uui-table-head-cell>Type</uui-table-head-cell>
          <uui-table-head-cell>Parent Folder</uui-table-head-cell>
          <uui-table-head-cell>File Size</uui-table-head-cell>
          <uui-table-head-cell>Width</uui-table-head-cell>
        </uui-table-head>
        ${S.map((e) => this._renderMediaTableRow(e))}
      </uui-table>
    `;
  }
  _renderMediaTableRow(S) {
    const l = this._selectedMediaItems.some((e) => e.id === S.id);
    return ut`
      <uui-table-row>
        <uui-table-cell>
          <uui-checkbox
            label="Select ${S.name}"
            label-position="none"
            ?checked=${l}
            ?disabled=${!S.resizable}
            @change=${() => this._toggleItemSelection(S)}
          ></uui-checkbox>
        </uui-table-cell>
        <uui-table-cell>
          <a href="/umbraco/section/media/workspace/media/edit/${S.id}" target="_blank">${S.name}</a>
        </uui-table-cell>
        <uui-table-cell>${S.fileType}</uui-table-cell>
        <uui-table-cell>${S.folder}</uui-table-cell>
        <uui-table-cell>
          <uui-tag color=${S.sizeNotFixed > 1 ? "danger" : "positive"}>
            ${S.size}mb
          </uui-tag>
        </uui-table-cell>
        <uui-table-cell>
          <uui-tag color=${S.width > parseInt(this._maxWidth || "2400") ? "danger" : "positive"}>
            ${S.width}px
          </uui-tag>
        </uui-table-cell>
      </uui-table-row>
    `;
  }
  _renderConfirmationSection() {
    return ut`
      <div class="section">
        <h3>Confirmation</h3>
        <h4>Are you sure you want to resize ${this._selectedMediaItems.length} images?</h4>
        
        <div class="warning">
          <uui-icon name="alert"></uui-icon>
          <p>Caution: this will modify the selected images. This cannot be undone.</p>
        </div>

        <div class="actions">
          <uui-button look="default" @click=${() => this._navigateToSection("Show Image Previews")}>
            Back
          </uui-button>
          <uui-button look="outline" @click=${() => this._showDialog = "backup"}>
            Download Backup
          </uui-button>
          <uui-button 
            look="primary" 
            color="positive"
            @click=${this._resizeImages}
            ?disabled=${this._isProcessing}
          >
            ${this._isProcessing ? ut`
              <uui-loader-circle></uui-loader-circle>
              Processing... (${this._progressNum}/${this._selectedMediaItems.length})
            ` : `Resize ${this._selectedMediaItems.length} Images`}
          </uui-button>
        </div>
      </div>
    `;
  }
  _renderResultsSection() {
    return ut`
      <div class="section">
        <h3>Resizing Complete</h3>
        <p>
          ${this._numOfSuccessfullyResizedMediaItems} out of ${this._selectedMediaItems.length} images were resized successfully.
          You reduced the collective file sizes by ${this._mbsSaved.toFixed(2)}mb.
        </p>

        <uui-button look="primary" @click=${() => this._navigateToSection("Images")}>
          Done
        </uui-button>

        ${this._renderResultsTable()}
      </div>
    `;
  }
  _renderResultsTable() {
    return ut`
      <uui-table>
        <uui-table-head>
          <uui-table-head-cell>Status</uui-table-head-cell>
          <uui-table-head-cell>File Name</uui-table-head-cell>
          <uui-table-head-cell>Width</uui-table-head-cell>
          <uui-table-head-cell>File Size</uui-table-head-cell>
          <uui-table-head-cell>Reduction</uui-table-head-cell>
        </uui-table-head>
        ${this._selectedMediaItems.map((S) => ut`
          <uui-table-row>
            <uui-table-cell>
              ${S.recentlyResizedCorrectly ? ut`<uui-icon name="check" style="color: green"></uui-icon>` : S.originalSizeBetter ? ut`<uui-icon name="alert" style="color: rgb(191,33,78); cursor:pointer" @click=${() => this._showDialog = "size-increased"}></uui-icon>` : ut`<uui-icon name="remove" style="color: rgb(191,33,78); cursor:pointer" @click=${() => this._showDialog = "resize-failed"}></uui-icon>`}
            </uui-table-cell>
            <uui-table-cell>
              <a href="/umbraco/section/media/workspace/media/edit/${S.id}" target="_blank">${S.name}</a>
            </uui-table-cell>
            <uui-table-cell>
              ${S.widthPostResizing ? `${S.width}px → ${S.widthPostResizing}px` : `${S.width}px`}
            </uui-table-cell>
            <uui-table-cell>
              ${S.fileSizePostResizing ? `${S.size}mb → ${S.fileSizePostResizing.toFixed(2)}mb` : `${S.size}mb`}
            </uui-table-cell>
            <uui-table-cell>
              ${S.fileSizeReductionPercentage ? `${S.fileSizeReductionPercentage.toFixed(2)}%` : "-"}
            </uui-table-cell>
          </uui-table-row>
        `)}
      </uui-table>
    `;
  }
  _onBackdropClick(S) {
    S.target === S.currentTarget && this._closeDialog();
  }
  _renderDialogs() {
    return this._showDialog ? ut`
      <div class="dialog-backdrop" @click=${this._onBackdropClick}>
      <uui-dialog role="dialog" aria-modal="true">
        ${this._showDialog === "backup" ? ut`
          <uui-dialog-layout headline="Download Backup">
            <p>This will download a backup of your selected images in their current state.</p>
            <uui-button slot="actions" @click=${() => this._showDialog = null}>Cancel</uui-button>
            <uui-button slot="actions" look="primary" @click=${this._downloadBackup}>Confirm</uui-button>
          </uui-dialog-layout>
        ` : st}
        ${this._showDialog === "size-increased" ? ut`
          <uui-dialog-layout headline="The size has increased?">
            <p>When resizing an image, the output is re-encoded using standard compression settings.</p>
            <p>These settings may apply less compression than was originally used on the image, so even though the dimensions are smaller, the re-encoded file can end up larger in size.</p>
            <p>We recommend taking note of this image and running a manual compression on it, or choosing a higher compression level in the settings to ensure the output is smaller.</p>
            <uui-button slot="actions" look="primary" @click=${() => this._showDialog = null}>OK</uui-button>
          </uui-dialog-layout>
        ` : st}
        ${this._showDialog === "resize-failed" ? ut`
          <uui-dialog-layout headline="Image could not be processed">
            <p>This image could not be resized. This is most commonly caused by the file being missing or inaccessible in Umbraco's media storage.</p>
            <p>Check that the file exists in the media library and has not been manually removed from the file system. If the problem persists, re-uploading the image through Umbraco should resolve it.</p>
            <uui-button slot="actions" look="primary" @click=${() => this._showDialog = null}>OK</uui-button>
          </uui-dialog-layout>
        ` : st}
      </uui-dialog>
      </div>
    ` : st;
  }
};
ht.styles = Ce`
    :host {
      display: block;
      padding: var(--uui-size-layout-1);
    }

    .section {
      padding: var(--uui-size-space-5);
    }

    .settings-container {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: var(--uui-size-space-5);
      margin: var(--uui-size-space-5) 0;
    }

    .compression-buttons {
      display: flex;
      gap: var(--uui-size-space-3);
      flex-wrap: wrap;
    }

    .compression-btn {
      min-width: 190px;
      min-height: 110px;
    }

    .compression-btn-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--uui-size-space-2);
      text-align: center;
      white-space: normal;
      padding: var(--uui-size-space-2);
    }

    .compression-btn-description {
      font-size: 0.85em;
      font-weight: normal;
      color: var(--uui-color-text-alt);
    }

    /* On the selected (primary) button the text is light, so the description must follow it */
    .compression-btn.selected .compression-btn-description {
      color: inherit;
      opacity: 0.85;
    }

    .input-suffix {
      display: flex;
      align-items: center;
      padding: 0 var(--uui-size-space-3);
      color: var(--uui-color-text-alt);
    }

    .selection-summary {
      margin-right: auto;
      color: var(--uui-color-text-alt);
    }

    .dialog-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--uui-size-space-5);
      background: rgba(0, 0, 0, 0.5);
    }

    .dialog-backdrop uui-dialog {
      width: 100%;
      max-width: 560px;
      max-height: 90vh;
      overflow: auto;
    }

    .small-text {
      font-size: 0.9em;
      color: var(--uui-color-text-alt);
    }

    .grey-text {
      color: var(--uui-color-text-alt);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--uui-size-space-4);
    }

    .header-actions {
      display: flex;
      gap: var(--uui-size-space-3);
    }

    .table-actions {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-3);
      margin-bottom: var(--uui-size-space-4);
    }

    .actions {
      display: flex;
      gap: var(--uui-size-space-3);
      margin-top: var(--uui-size-space-4);
    }

    .warning {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-3);
      padding: var(--uui-size-space-4);
      background: var(--uui-color-warning-emphasis);
      border-radius: var(--uui-border-radius);
      margin: var(--uui-size-space-4) 0;
    }

    uui-table {
      margin-top: var(--uui-size-space-4);
    }
  `;
ct([
  ft()
], ht.prototype, "_currentSection", 2);
ct([
  ft()
], ht.prototype, "_maxWidth", 2);
ct([
  ft()
], ht.prototype, "_ignoreMaxWidth", 2);
ct([
  ft()
], ht.prototype, "_compressionLevel", 2);
ct([
  ft()
], ht.prototype, "_sortedMediaItems", 2);
ct([
  ft()
], ht.prototype, "_resizableMediaItems", 2);
ct([
  ft()
], ht.prototype, "_selectedMediaItems", 2);
ct([
  ft()
], ht.prototype, "_isAnalyzing", 2);
ct([
  ft()
], ht.prototype, "_isProcessing", 2);
ct([
  ft()
], ht.prototype, "_isDownloadingPreview", 2);
ct([
  ft()
], ht.prototype, "_tableLimit", 2);
ct([
  ft()
], ht.prototype, "_showDialog", 2);
ct([
  ft()
], ht.prototype, "_totalItemsFound", 2);
ct([
  ft()
], ht.prototype, "_progressNum", 2);
ct([
  ft()
], ht.prototype, "_numOfSuccessfullyResizedMediaItems", 2);
ct([
  ft()
], ht.prototype, "_mbsSaved", 2);
ct([
  ft()
], ht.prototype, "_originalSize", 2);
ct([
  ft()
], ht.prototype, "_foundFolders", 2);
ht = ct([
  Ye("media-resizer-dashboard")
], ht);
export {
  ht as MediaResizerDashboardElement
};
//# sourceMappingURL=media-resizer.js.map
