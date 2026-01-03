import "reflect-metadata";
import { _ as ge, a as W, b as J, c as b, d as ve, e as y } from "./tslib.es6-uRq23Qk6.js";
import be, { cloneDeep as C, isObject as ne, isEqual as ae, isEmpty as pe } from "lodash";
import { makeObservable as yt, reaction as fe, runInAction as ct, observable as N, isObservable as re, computed as tt, action as j } from "mobx";
import { enablePatches as De, immerable as oe, createDraft as Ie, applyPatches as le, produce as Oe } from "immer";
import { observer as Me } from "mobx-react";
import { useMemo as Se, useEffect as ke } from "react";
const P = (e, n, c) => Reflect.getOwnMetadata(e, n) || c || {}, R = (e, n, c) => Reflect.defineMetadata(e, n, c);
function ai(...e) {
  try {
    return JSON.stringify(e), !0;
  } catch {
    return !1;
  }
}
function we(e) {
  if (e && typeof e == "string") {
    let [n] = e.split(`
`)[2].replace(/at (get)?/, "").match(/.*/g) || [];
    return n && (n = n.trim()), n;
  }
}
const ce = {}, ft = [];
let de = !1;
const ri = (e, ...n) => {
  const c = new Error().stack;
  if (!de)
    console.log("%c TODO", "background: #222; color: #bada55", ce), de = !0;
  else {
    const i = we(c);
    ft.includes(i) === !1 && (ft.push(i), Reflect.set(ce, `${ft.length}) ${e}`, { msg: n, get path() {
      return console.info(n, i), i;
    } }));
  }
  function o(...i) {
  }
  return o;
}, B = (e, n) => !!e && (typeof n == "string" || typeof n == "symbol"), H = (e) => !!e && typeof e == "object" && "kind" in e, Te = (e) => ({
  kind: "class",
  name: e,
  addInitializer: () => {
  },
  metadata: {}
}), Z = /* @__PURE__ */ Symbol("service-key"), mt = new Proxy({}, Reflect);
function Ae(e) {
  const n = (o, i) => {
    Object.defineProperty(o, i, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, i))
          return Reflect.get(this, i);
        const s = et(e, "instance");
        if (s)
          return Object.defineProperty(this, i, { value: s, writable: !0, configurable: !0, enumerable: !0 }), s;
      },
      set(s) {
        const a = et(e, "instance");
        Object.defineProperty(this, i, { value: a ?? s, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  };
  function c(o, i) {
    if (B(o, i)) {
      n(o, i);
      return;
    }
    return i.addInitializer(function() {
      return ge(this, void 0, void 0, function* () {
        const s = et(e, "instance");
        s && Object.hasOwn(this, i.name) && Reflect.set(this, i.name, s);
      });
    }), (s) => s;
  }
  return c;
}
function et(e, n) {
  var c;
  const o = P(Z, mt);
  if (typeof e != "string") {
    const i = P(Z, e);
    if (i)
      return n && n in i ? i[n] : i;
    for (const s in o) {
      const a = o[s];
      if (a.target === e) {
        e = a.context.name;
        break;
      }
    }
  }
  if (typeof e == "string")
    return n ? (c = o[e]) === null || c === void 0 ? void 0 : c[n] : o[e];
}
function ue(e, n) {
  const c = (i, s) => {
    const a = String(typeof e == "string" && e || typeof e == "object" && e?.id || s?.name || i?.name), l = P(Z, mt), h = new Proxy({
      target: i,
      instance: typeof e == "object" && Reflect.get(e, "transient") || typeof e == "object" && Reflect.get(e, "lazy") ? i : new i(),
      context: s,
      options: e
    }, {
      get(m, p, g) {
        var D, S;
        if (p === "instance" && (!((D = m?.options) === null || D === void 0) && D.transient))
          return new i();
        if (p === "instance" && (!((S = m?.options) === null || S === void 0) && S.lazy) && m.instance === i) {
          const A = new i();
          return Reflect.set(m, p, A, g), A;
        }
        return Reflect.get(m, p, g);
      },
      set(m, p, g, D) {
        return Reflect.set(m, p, g, D);
      }
    });
    l[a] = h, R(Z, l, mt), R(Z, l[a], i);
  };
  function o(i, s) {
    var a, l;
    const h = i.__mvvm_legacy_source__, m = H(s) ? s : Te((l = (a = h?.name) !== null && a !== void 0 ? a : i?.name) !== null && l !== void 0 ? l : "");
    c(i, m), h && h !== i && R(Z, P(Z, i), h);
  }
  return be.isFunction(e) ? o(e, n) : e ? (i, s) => o(i, s) : o;
}
const oi = (e, n) => {
  const { kind: c = "class", name: o = "", addInitializer: i = () => {
  }, metadata: s } = n?.ctx || {};
  return ue(n)(e, {
    kind: c,
    name: o,
    addInitializer: i,
    metadata: s
  }), et(e).instance;
}, Ve = /* @__PURE__ */ Symbol("field-key"), xe = /* @__PURE__ */ Symbol("validation-key"), Ee = /* @__PURE__ */ Symbol("submit-key"), je = /* @__PURE__ */ Symbol("exclude-key"), Re = /* @__PURE__ */ Symbol("prop-from-view-key");
class it {
  /**
   * Создать базовые метаданные.
   */
  constructor(n = {}) {
    this.metadataKey = null, this.name = n?.name, this.callback = n?.callback;
  }
  /**
   * Проверить, что данные соответствуют экземпляру метаданных.
   */
  isInstance(n = {}) {
    return n instanceof it || Object.getOwnPropertyNames(this).some((c) => Object.keys(n).includes(c));
  }
  /**
   * Получить метаданные конкретного поля модели.
   */
  fieldInstance(n, c) {
    return this.fields(c).find((o) => o.name === n);
  }
  /**
   * Получить массив метаданных полей модели.
   */
  fields(n) {
    const c = [], o = /* @__PURE__ */ new Set();
    let i = n;
    for (; i; ) {
      const s = Reflect.getOwnMetadata(this.metadataKey, i);
      if (Array.isArray(s))
        for (const a of s) {
          const l = a?.name;
          if (l !== void 0) {
            const h = typeof l == "symbol" ? l : String(l);
            if (o.has(h))
              continue;
            o.add(h);
          }
          c.push(a);
        }
      i = Object.getPrototypeOf(i);
    }
    return c;
  }
}
class gt extends it {
  constructor() {
    super(...arguments), this.metadataKey = xe;
  }
}
class vt extends it {
  constructor() {
    super(...arguments), this.metadataKey = Ee;
  }
}
class bt extends it {
  constructor() {
    super(...arguments), this.metadataKey = je;
  }
}
class pt extends it {
  /**
   * Создать метаданные поля модели.
   */
  constructor(n = {}) {
    super(n), this.factory = null, this.mapping = null, this.collectChanges = !1, this.name = null, this.ctx = null, this.metadataKey = Ve, this.factory = n.factory, this.mapping = n.mapping, this.name = n.name, this.ctx = n.ctx, this.collectChanges = !!n.collectChanges;
  }
}
class Dt extends it {
  /**
   * Создать метаданные для PropFromView.
   */
  constructor(n = {}) {
    super(n), this.metadataKey = Re;
    for (const c in this)
      n && c in n && (this[c] = Reflect.get(n, c));
  }
}
function ut(e) {
  const n = Object.assign({ enumerable: !1, writable: !0 }, e);
  return function(c, o) {
    if (B(c, o)) {
      Object.defineProperty(c, o, {
        configurable: !0,
        enumerable: n.enumerable,
        get() {
        },
        set(i) {
          Object.defineProperty(this, o, Object.assign({ value: i }, n));
        }
      });
      return;
    }
    if (H(o)) {
      const i = o;
      return i.kind === "field" ? function(s) {
        return Object.defineProperty(this, i.name, Object.assign({ value: s }, n)), s;
      } : (i.addInitializer(function() {
        const s = Object.getOwnPropertyDescriptor(this, i.name);
        s && Object.defineProperty(this, i.name, Object.assign(Object.assign({}, s), { enumerable: n.enumerable }));
      }), c);
    }
  };
}
function F(e, n) {
  return B(e, n) || H(n) ? ut()(e, n) : ut(e);
}
const ze = () => {
  var e;
  const n = globalThis;
  return !!((e = n.__MVVM_DEVTOOLS_HISTORY__) !== null && e !== void 0 ? e : n.__MVVM_DEVTOOLS_AUTO__);
}, Fe = (e) => ze() ? !e || typeof e != "object" ? { collectChanges: !0 } : "collectChanges" in e ? e : Object.assign(Object.assign({}, e), { collectChanges: !0 }) : e;
function li(e) {
  const n = (i, s) => {
    const a = new gt({ callback: e, name: String(s) }), l = P(a.metadataKey, i, new Array());
    R(a.metadataKey, [...l, a], i);
  }, c = (i) => {
    i.addInitializer(function() {
      const s = new gt({ callback: e, name: String(i.name) }), a = P(s.metadataKey, this, new Array());
      R(s.metadataKey, [...a, s], this);
    });
  };
  function o(i, s) {
    if (B(i, s)) {
      n(i, s);
      return;
    }
    if (H(s))
      return c(s), s.kind === "field" ? (a) => a : s;
  }
  return e ? ((i, s) => o(i, s)) : ((i) => i);
}
function ci(e) {
  const n = (i, s) => {
    const a = new vt({ callback: e, name: String(s) }), l = P(a.metadataKey, i, new Array());
    R(a.metadataKey, [...l, a], i);
  }, c = (i) => {
    i.addInitializer(function() {
      const s = new vt({ callback: e, name: String(i.name) }), a = P(s.metadataKey, this, new Array());
      R(s.metadataKey, [...a, s], this);
    });
  };
  function o(i, s) {
    if (B(i, s)) {
      n(i, s);
      return;
    }
    if (H(s))
      return c(s), s.kind === "field" ? (a) => a : s;
  }
  return e ? ((i, s) => o(i, s)) : ((i) => i);
}
function di(e) {
  const n = (i, s) => {
    const a = new bt({ callback: e, name: String(s) }), l = P(a.metadataKey, i, new Array());
    R(a.metadataKey, [...l, a], i);
  }, c = (i) => {
    i.addInitializer(function() {
      const s = new bt({ callback: e, name: String(i.name) }), a = P(s.metadataKey, this, new Array());
      R(s.metadataKey, [...a, s], this);
    });
  };
  function o(i, s) {
    if (B(i, s)) {
      n(i, s);
      return;
    }
    if (H(s))
      return c(s), s.kind === "field" ? void 0 : s;
  }
  if (e)
    return ((i, s) => o(i, s));
}
function hi(e, n) {
  const c = Fe(B(e, n) ? void 0 : e), o = (a, l) => {
    const h = new pt(Object.assign(Object.assign({}, c), { name: String(l), ctx: null })), m = P(h.metadataKey, a, new Array());
    R(h.metadataKey, [...m, h], a), Object.getOwnPropertyDescriptor(a, l) || Object.defineProperty(a, l, {
      configurable: !0,
      enumerable: !0,
      get() {
        const g = this;
        if (Object.prototype.hasOwnProperty.call(g, l))
          return Reflect.get(g, l);
        const D = g.initField, S = g.initData;
        if (S && l in S && typeof D == "function")
          return D.call(g, String(l), { skipValidation: !0 }), Reflect.get(g, l);
      },
      set(g) {
        const D = this, S = D.initField, A = D.initData;
        if (A && !(l in A) && Reflect.set(A, l, g), typeof S == "function") {
          S.call(D, String(l), { skipValidation: !0 });
          return;
        }
        Object.defineProperty(this, l, { value: g, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  }, i = (a) => {
    a.addInitializer(function() {
      const l = this;
      if (typeof l.initField == "function") {
        const h = new pt(Object.assign(Object.assign({}, c), { name: String(a.name), ctx: a })), m = P(h.metadataKey, this, new Array());
        R(h.metadataKey, [...m, h], this), l.initField.call(this, String(a.name));
      }
    });
  };
  function s(a, l) {
    if (B(a, l)) {
      o(a, l);
      return;
    }
    if (H(l))
      return i(l), l.kind === "field" ? (h) => h : l;
  }
  return B(e, n) ? s(e, n) : c && !H(n) ? (a, l) => s(a, l) : H(n) ? s(void 0, n) : (a, l) => s(a, l);
}
function fi(e) {
  const n = (i, s) => {
    const a = new Dt({ name: e, originName: String(s) });
    a.name = e, a.originName = String(s);
    const l = P(a.metadataKey, i, new Array());
    R(a.metadataKey, [...l, a], i);
  }, c = (i) => {
    i.addInitializer(function() {
      const s = new Dt(), a = s.fields(this);
      for (const l in this)
        a instanceof Array && i.name === l && (s.name = e, s.originName = l, s.value = this[l], a.push(s));
      R(s.metadataKey, a, this);
    });
  };
  function o(i, s) {
    if (B(i, s)) {
      n(i, s);
      return;
    }
    if (H(s))
      return c(s), s.kind === "field" ? (a) => a : s;
  }
  return e ? ((i, s) => o(i, s)) : ((i) => i);
}
function ui(e, n) {
  const c = (s) => class extends s {
    constructor(...a) {
      super(...a), yt(this);
    }
  }, o = (s, a) => {
    if (typeof Reflect?.getOwnMetadataKeys == "function")
      for (const l of Reflect.getOwnMetadataKeys(s)) {
        const h = Reflect.getOwnMetadata(l, s);
        Reflect.defineMetadata(l, h, a);
      }
  };
  function i(s, a) {
    if (!H(a)) {
      const l = s, h = c(l);
      return Object.defineProperty(h, "__mvvm_legacy_source__", { value: l, configurable: !0 }), o(l, h), h;
    }
    a.addInitializer(function() {
      yt(this);
    });
  }
  return e && !H(n) || e ? i(e, n) : i;
}
const Pe = () => {
  var e;
  return (e = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && e !== void 0 ? e : null;
}, Le = () => {
  var e;
  return (e = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0;
}, lt = (e) => {
  var n, c;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((n = o.__MVVM_DEVTOOLS_APPLYING__) !== null && n !== void 0 ? n : 0) + 1;
  try {
    return e();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((c = o.__MVVM_DEVTOOLS_APPLYING__) !== null && c !== void 0 ? c : 1) - 1);
  }
}, Ce = () => Le() > 0, he = (e) => ({
  data: e.service.dumpData,
  historyIndex: e.service.historyIndex
}), He = (e, n = {}) => {
  const c = Pe();
  if (!c)
    return () => {
    };
  const o = c.connect({ name: n.name, instanceId: n.instanceId });
  let i = !1;
  try {
    o.init(he(e));
  } catch {
  }
  const s = fe(() => he(e), (l) => {
    var h;
    if (!(i || Ce()))
      try {
        o.send({ type: (h = n.actionType) !== null && h !== void 0 ? h : "model:update" }, l);
      } catch {
      }
  }), a = o.subscribe((l) => {
    var h;
    if (l.type !== "DISPATCH")
      return;
    const m = (h = l.payload) === null || h === void 0 ? void 0 : h.type;
    if (m === "RESET") {
      i = !0, lt(() => {
        try {
          e.service.toInit();
        } finally {
          i = !1;
        }
      });
      return;
    }
    if (m === "COMMIT") {
      i = !0, lt(() => {
        try {
          e.service.commit();
        } finally {
          i = !1;
        }
      });
      return;
    }
    if (m === "ROLLBACK") {
      i = !0, lt(() => {
        try {
          e.service.toInit();
        } finally {
          i = !1;
        }
      });
      return;
    }
    if (m === "JUMP_TO_ACTION" || m === "JUMP_TO_STATE") {
      if (!l.state)
        return;
      try {
        const p = JSON.parse(l.state), g = p.historyIndex, D = e.service.history, S = Array.isArray(D) && D.length > 0, A = typeof g == "number" && (g === -1 && S || g >= 0 && S && g < D.length);
        i = !0, lt(() => {
          var L;
          try {
            if (A) {
              e.service.goToHistory(g);
              return;
            }
            const K = (L = p.data) !== null && L !== void 0 ? L : p;
            ct(() => {
              e.service.loadData(K);
            });
          } finally {
            i = !1;
          }
        });
      } catch {
      }
    }
  });
  return () => {
    s(), typeof a == "function" && a(), typeof o.unsubscribe == "function" && o.unsubscribe(), typeof o.disconnect == "function" && o.disconnect();
  };
};
De();
const Ke = new vt(), $ = new pt(), Ye = new gt(), Ge = new bt();
let _i = (() => {
  var e, n, c, o, i, s, a, l, h, m;
  let p = [], g, D = [], S = [], A, L = [], K = [], U, st = [], T = [], d, V = [], M = [], z, E = [], w = [], Y, G = [], X = [], q, at = [], rt = [], ot, Ot = [], Mt = [], St, kt = [], wt = [], Tt, At = [], Vt = [], xt, Et = [], jt = [], Rt, zt = [], Ft = [], Pt, Lt = [], Ct = [], Ht, Kt, Yt = [], Gt = [], Nt, Bt, Ut, $t, Wt, Jt, Xt, qt, Qt, Zt, te, ee;
  return e = class {
    get initData() {
      return W(this, n, "f");
    }
    set initData(t) {
      J(this, n, t, "f");
    }
    get committedData() {
      return W(this, c, "f");
    }
    set committedData(t) {
      J(this, c, t, "f");
    }
    get modified_() {
      return W(this, o, "f");
    }
    set modified_(t) {
      J(this, o, t, "f");
    }
    get changes() {
      return W(this, i, "f");
    }
    set changes(t) {
      J(this, i, t, "f");
    }
    get inverseChanges() {
      return W(this, s, "f");
    }
    set inverseChanges(t) {
      J(this, s, t, "f");
    }
    get history() {
      return W(this, a, "f");
    }
    set history(t) {
      J(this, a, t, "f");
    }
    get historyIndex() {
      return W(this, l, "f");
    }
    set historyIndex(t) {
      J(this, l, t, "f");
    }
    /**
     * Создает модель и инициализирует данные.
     */
    constructor(t = {}, r) {
      this[h] = (b(this, p), b(this, D, !0)), n.set(this, (b(this, S), b(this, L, null))), c.set(this, (b(this, K), b(this, st, {}))), o.set(this, (b(this, T), b(this, V, {}))), this.draft = (b(this, M), b(this, E, null)), i.set(this, (b(this, w), b(this, G, []))), s.set(this, (b(this, X), b(this, at, []))), a.set(this, (b(this, rt), b(this, Ot, []))), l.set(this, (b(this, Mt), b(this, kt, -1))), this.initializedFields = (b(this, wt), b(this, At, void 0)), this.legacyInitDone = (b(this, Vt), b(this, Et, !1)), this.rawInitData = (b(this, jt), b(this, zt, null)), this.options = (b(this, Ft), b(this, Lt, void 0)), this.historyMuted = (b(this, Ct), b(this, Yt, !1)), b(this, Gt), this.options = r, this[oe] = !0, this.init(t), this.autoAttachDevtools(), this.initLegacyFields();
    }
    /**
     * Сбросить внутренние стейты изменений.
     */
    resetToDefault() {
      this.modified_ = {}, this.committedData = {}, this.changes = [], this.inverseChanges = [], this.history = [], this.historyIndex = -1;
    }
    /**
     * Инициализировать валидацию для поля или всех полей.
     */
    initValidation(t) {
      if (t)
        Reflect.get(this.validation, t);
      else
        for (const r in this.validation)
          this.validation[r];
    }
    /**
     * Полная инициализация модели и полей.
     */
    init(t = {}) {
      this.cloneForInit(t), this.resetToDefault(), this.createDraft(t), this.defineData(this.initData);
    }
    /**
     * Инициализировать отдельное поле модели.
     */
    initField(t, r) {
      const f = $.fieldInstance(t, this);
      if (f) {
        t in this.initData || Reflect.set(this.initData, t, C(Reflect.get(this, t)));
        const u = C(this.initData), _ = f?.factory ? f.factory(u, this) : Reflect.get(u, f.name);
        this.defineFieldValue(t, _), r?.skipValidation || this.initValidation(t), this.getInitializedFields().add(String(t));
      }
    }
    getInitializedFields() {
      return this.initializedFields || (this.initializedFields = /* @__PURE__ */ new Set()), this.initializedFields;
    }
    initLegacyFields() {
      var t;
      if (this.legacyInitDone)
        return;
      const r = $.fields(this);
      if (!r.some((O) => Object.prototype.hasOwnProperty.call(this, O.name)))
        return;
      this.legacyInitDone = !0;
      const u = this.getInitializedFields(), _ = (t = this.rawInitData) !== null && t !== void 0 ? t : this.initData;
      if (_ && _ !== this.initData)
        try {
          this.initData = C(_);
        } catch {
          this.initData = Object.assign({}, _);
        }
      for (const O of r) {
        const v = String(O.name);
        if (_ && v in _) {
          const x = $.fieldInstance(v, this);
          if (!x)
            continue;
          if (!u.has(v)) {
            const Q = C(_), nt = x.factory ? x.factory(Q, this) : Reflect.get(Q, x.name);
            this.defineFieldValue(v, nt), Reflect.set(this, v, nt), u.add(v);
          }
          continue;
        }
        u.has(v) || this.initField(v, { skipValidation: !0 });
      }
    }
    /**
     * Создать draft для отслеживания изменений.
     */
    createDraft(t) {
      const r = {};
      for (const f in t)
        $.fieldInstance(f, this) && Reflect.set(r, f, C(t[f]));
      this.draft = Ie(r);
    }
    autoAttachDevtools() {
      var t, r, f, u, _, O, v, k, x, Q, nt, dt;
      const ht = globalThis;
      if (!ht.__MVVM_DEVTOOLS_AUTO__ || ((r = (t = this.options) === null || t === void 0 ? void 0 : t.devtools) === null || r === void 0 ? void 0 : r.enabled) === !1)
        return;
      const ie = (v = (_ = (u = (f = this.options) === null || f === void 0 ? void 0 : f.devtools) === null || u === void 0 ? void 0 : u.name) !== null && _ !== void 0 ? _ : (O = this.constructor) === null || O === void 0 ? void 0 : O.name) !== null && v !== void 0 ? v : "Model", se = ((k = ht.__MVVM_DEVTOOLS_SEQ__) !== null && k !== void 0 ? k : 0) + 1;
      ht.__MVVM_DEVTOOLS_SEQ__ = se;
      const ye = (nt = (Q = (x = this.options) === null || x === void 0 ? void 0 : x.devtools) === null || Q === void 0 ? void 0 : Q.instanceId) !== null && nt !== void 0 ? nt : `${ie}#${se}`;
      ((dt = globalThis.queueMicrotask) !== null && dt !== void 0 ? dt : ((me) => Promise.resolve().then(me)))(() => He(this, { name: ie, instanceId: ye }));
    }
    withHistoryMuted(t) {
      this.historyMuted = !0;
      try {
        t();
      } finally {
        this.historyMuted = !1;
      }
    }
    // @define_prop
    // private readonly serviceToJSON = () => this.dumpData;
    syncChangesFromHistory() {
      const t = this.historyIndex >= 0 ? this.history.slice(0, this.historyIndex + 1) : [];
      this.changes = t.flatMap((r) => r.patches), this.inverseChanges = t.flatMap((r) => r.inversePatches);
    }
    applyHistoryPatches(t) {
      if (!t.length)
        return;
      le(this.draft, t);
      const r = new Set(t.map((f) => f.field).filter(Boolean));
      r.size !== 0 && this.withHistoryMuted(() => {
        for (const f of r) {
          const u = this.draft, _ = this.initData, O = Reflect.has(u, f), v = Reflect.get(O ? u : _, f);
          let k = v;
          try {
            k = C(v);
          } catch {
            k = v;
          }
          Reflect.set(this, f, k), this.defineFieldValue(f, Reflect.get(this, f));
        }
      });
    }
    /**
     * зафиксировать изменение значения
     * @param changePath
     * @param newValue
     * @param endField
     * @returns
     */
    /**
     * Зафиксировать изменение в draft и собрать патчи.
     */
    produceDraft(t, r, f) {
      if (this.historyMuted)
        return;
      let u, _ = [];
      t && (u = t.split(".")[0], u && !$.fieldInstance(u, this).collectChanges) || (Oe(this.draft, (O) => {
        if (t) {
          let v = O;
          const k = t.split(".");
          if (k.length > 1)
            for (let x = 0; x < k.length && !(!(x == k.length - 1) && !ne(v)); x++)
              ne(v) && (v = v[k[x]]);
          else
            f = t;
          v && (v[f] = r);
        }
      }, (O, v) => {
        u && (O = O.map((k) => Object.assign(Object.assign({}, k), { field: u })), v = v.map((k) => Object.assign(Object.assign({}, k), { field: u }))), _ = O, !(!O.length && !v.length) && (this.historyIndex < this.history.length - 1 && (this.history = this.history.slice(0, this.historyIndex + 1), this.syncChangesFromHistory()), this.changes.push(...O), this.inverseChanges.push(...v), this.history.push({ patches: O, inversePatches: v }), this.historyIndex = this.history.length - 1);
      }), _.length && le(this.draft, _));
    }
    /**
     * сделать значение наблюдаемым, повесить observable в глубину
     * @param value
     * @param field
     * @param originField
     * @param changePath
     * @returns
     */
    /**
     * Сделать значение наблюдаемым с отслеживанием вложенных изменений.
     */
    createObservable(t, r, f, u = f) {
      return t = re(t) ? t : N.box(t), new Proxy(t.get(), {
        get: (_, O, v) => {
          const k = Reflect.get(_, O, v);
          return k && typeof k == "object" && !(k instanceof e) && !re(t) ? this.createObservable(k, String(O), r, `${u}.${String(O)}`) : k;
        },
        set: (_, O, v, k) => {
          const x = Reflect.set(_, O, v, k);
          return t.set(v), this.produceDraft(u, t.get(), String(O)), this.checkChange(f, Reflect.get(this, f)), x;
        }
      });
    }
    /**
     * Определить getter/setter для поля модели.
     */
    defineFieldValue(t, r) {
      const f = $.fieldInstance(t, this);
      return r && typeof r == "object" && (r = this.createObservable(r, t, t)), r = N.box(r), Reflect.defineProperty(this, f.name, {
        get() {
          return r.get();
        },
        set: (u) => {
          ct(() => r.set(u)), this.produceDraft(f.name, r.get()), this.checkChange(f.name, r.get());
        },
        enumerable: !0,
        configurable: !0
      }), r;
    }
    /**
     * Сохранить исходные данные с глубоким клонированием.
     */
    cloneForInit(t) {
      if (t)
        try {
          const r = C(t);
          this.initData = r, this.rawInitData = r;
        } catch {
          const f = Object.assign({}, t);
          this.initData = f, this.rawInitData = f;
        }
      else
        this.rawInitData = null;
    }
    /**
     * Проверить изменение поля и обновить modified_.
     */
    checkChange(t, r) {
      const f = C(r), u = C(Reflect.get(this.committedData, t)) || C(Reflect.get(this.initData, t)), _ = t && t in this.initData && !ae(u, f);
      return ct(() => {
        _ && Reflect.set(this.modified_, t, C(u) || u);
        for (const O in this.modified_)
          t === O && t in this.modified_ && ae(u, f) && delete this.modified_[O];
      }), _;
    }
    /**
     * Применить данные к полям модели.
     */
    defineData(t) {
      for (const r in this) {
        if (!Object.prototype.hasOwnProperty.call(this, r))
          continue;
        $.fieldInstance(r, this) && (Reflect.set(this, r, Reflect.get(t, r)), this.initField(r));
      }
    }
    /**
     * Признак наличия изменений.
     */
    get dirty() {
      return !pe(this.modified_);
    }
    /**
     * Зафиксировать все изменения.
     */
    commit() {
      for (const t of $.fields(this))
        this.commitField(t.name);
      this.modified_ = {};
    }
    /**
     * Зафиксировать изменения конкретного поля.
     */
    commitField(t) {
      for (const r in this)
        r in this.modified_ && Reflect.set(this.committedData, r, this[r]);
      delete this.modified_[t], this.modified_ = Object.assign({}, this.modified_);
    }
    /**
     * Откатить изменения к последнему коммиту.
     */
    reject() {
      for (const t in this)
        t in this.modified_ && (this[t] = Reflect.get(this.modified_, t), this.commitField(t), this.defineFieldValue(t, this[t]));
      this.commit();
    }
    /**
     * Вернуть модель к исходным данным.
     */
    toInit() {
      return this.withHistoryMuted(() => {
        for (const t in this)
          if (t in this.initData) {
            const r = Reflect.get(this.initData, t);
            this[t] = r, this.initField(t);
          }
        this.init(this.initData);
      }), this;
    }
    /**
     * Откатить изменения на один шаг истории.
     */
    undo() {
      if (this.historyIndex < 0)
        return;
      const t = this.history[this.historyIndex];
      this.historyIndex -= 1, this.applyHistoryPatches(t.inversePatches), this.syncChangesFromHistory();
    }
    /**
     * Повторить ранее откатанные изменения.
     */
    redo() {
      if (this.historyIndex >= this.history.length - 1)
        return;
      const t = this.historyIndex + 1, r = this.history[t];
      this.historyIndex = t, this.applyHistoryPatches(r.patches), this.syncChangesFromHistory();
    }
    /**
     * Перейти к конкретному шагу истории.
     */
    goToHistory(t) {
      if (!(t < -1 || t >= this.history.length) && t !== this.historyIndex) {
        for (; this.historyIndex < t; ) {
          const r = this.historyIndex + 1, f = this.history[r];
          this.historyIndex = r, this.applyHistoryPatches(f.patches);
        }
        for (; this.historyIndex > t; ) {
          const r = this.history[this.historyIndex];
          this.historyIndex -= 1, this.applyHistoryPatches(r.inversePatches);
        }
        this.syncChangesFromHistory();
      }
    }
    /**
     * Перезагрузить данные модели.
     */
    loadData(t) {
      return this.withHistoryMuted(() => {
        this.init(t), this.defineData(this.initData);
      }), this;
    }
    /**
     * Получить сериализованный дамп данных.
     */
    get dumpData() {
      this.initLegacyFields();
      const t = /* @__PURE__ */ Object.create({}), r = (u) => {
        const _ = Ke.fieldInstance(u, this);
        return _?.callback ? _.callback(Reflect.get(this, u), this) : Reflect.get(this, u);
      }, f = (u) => {
        const _ = Ge.fieldInstance(u, this);
        if (_)
          switch (typeof _.callback) {
            case "boolean":
              return !!_.callback;
            case "function":
              return _.callback(Reflect.get(this, u), this);
          }
        return !1;
      };
      $.fields(this).forEach((u) => {
        var _;
        if (u.name in this)
          return !((_ = this.options) === null || _ === void 0) && _.byFields && !this.options.byFields.includes(u.name) || f(u.name) ? void 0 : Reflect.set(t, u.name, r(u.name));
      });
      try {
        return C(t);
      } catch {
        return t && Object.assign({}, t);
      }
    }
    /**
     * Получить объект результатов валидации.
     */
    get validation() {
      this.initLegacyFields();
      const t = {};
      for (const r in this) {
        const f = Ye.fieldInstance(r, this);
        f && Reflect.set(t, r, f.callback(this[r], this) || "");
      }
      return t;
    }
    /**
     * Признак валидности и наличия изменений.
     */
    get validAndDirty() {
      return this.dirty && Object.values(this.validation).filter(Boolean).length === 0;
    }
    /**
     * Публичный API модели для вью.
     */
    get service() {
      return {
        dirty: this.dirty,
        dumpData: this.dumpData,
        // toJSON        : this.serviceToJSON,
        loadData: (t) => this.loadData(t),
        validation: this.validation,
        reject: this.reject.bind(this),
        commit: this.commit.bind(this),
        commitField: this.commitField.bind(this),
        changes: this.changes,
        inverseChanges: this.inverseChanges,
        history: this.history,
        historyIndex: this.historyIndex,
        toInit: () => this.toInit(),
        undo: this.undo.bind(this),
        redo: this.redo.bind(this),
        goToHistory: this.goToHistory.bind(this)
      };
    }
  }, n = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), i = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), g = [F], h = ve(oe), (() => {
    const I = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    A = [N, F], U = [N, F], d = [N, F], z = [F], Y = [N, F], q = [N, F], ot = [N, F], St = [N, F], Tt = [F], xt = [F], Rt = [F], Pt = [F], Ht = [j], Kt = [F], Nt = [j], Bt = [tt], Ut = [j], $t = [j], Wt = [j], Jt = [j], Xt = [j], qt = [j], Qt = [j], Zt = [tt], te = [tt], ee = [(m = tt).struct.bind(m)], y(e, null, A, { kind: "accessor", name: "initData", static: !1, private: !1, access: { has: (t) => "initData" in t, get: (t) => t.initData, set: (t, r) => {
      t.initData = r;
    } }, metadata: I }, L, K), y(e, null, U, { kind: "accessor", name: "committedData", static: !1, private: !1, access: { has: (t) => "committedData" in t, get: (t) => t.committedData, set: (t, r) => {
      t.committedData = r;
    } }, metadata: I }, st, T), y(e, null, d, { kind: "accessor", name: "modified_", static: !1, private: !1, access: { has: (t) => "modified_" in t, get: (t) => t.modified_, set: (t, r) => {
      t.modified_ = r;
    } }, metadata: I }, V, M), y(e, null, Y, { kind: "accessor", name: "changes", static: !1, private: !1, access: { has: (t) => "changes" in t, get: (t) => t.changes, set: (t, r) => {
      t.changes = r;
    } }, metadata: I }, G, X), y(e, null, q, { kind: "accessor", name: "inverseChanges", static: !1, private: !1, access: { has: (t) => "inverseChanges" in t, get: (t) => t.inverseChanges, set: (t, r) => {
      t.inverseChanges = r;
    } }, metadata: I }, at, rt), y(e, null, ot, { kind: "accessor", name: "history", static: !1, private: !1, access: { has: (t) => "history" in t, get: (t) => t.history, set: (t, r) => {
      t.history = r;
    } }, metadata: I }, Ot, Mt), y(e, null, St, { kind: "accessor", name: "historyIndex", static: !1, private: !1, access: { has: (t) => "historyIndex" in t, get: (t) => t.historyIndex, set: (t, r) => {
      t.historyIndex = r;
    } }, metadata: I }, kt, wt), y(e, null, Ht, { kind: "method", name: "resetToDefault", static: !1, private: !1, access: { has: (t) => "resetToDefault" in t, get: (t) => t.resetToDefault }, metadata: I }, null, p), y(e, null, Nt, { kind: "method", name: "produceDraft", static: !1, private: !1, access: { has: (t) => "produceDraft" in t, get: (t) => t.produceDraft }, metadata: I }, null, p), y(e, null, Bt, { kind: "getter", name: "dirty", static: !1, private: !1, access: { has: (t) => "dirty" in t, get: (t) => t.dirty }, metadata: I }, null, p), y(e, null, Ut, { kind: "method", name: "commit", static: !1, private: !1, access: { has: (t) => "commit" in t, get: (t) => t.commit }, metadata: I }, null, p), y(e, null, $t, { kind: "method", name: "commitField", static: !1, private: !1, access: { has: (t) => "commitField" in t, get: (t) => t.commitField }, metadata: I }, null, p), y(e, null, Wt, { kind: "method", name: "reject", static: !1, private: !1, access: { has: (t) => "reject" in t, get: (t) => t.reject }, metadata: I }, null, p), y(e, null, Jt, { kind: "method", name: "toInit", static: !1, private: !1, access: { has: (t) => "toInit" in t, get: (t) => t.toInit }, metadata: I }, null, p), y(e, null, Xt, { kind: "method", name: "undo", static: !1, private: !1, access: { has: (t) => "undo" in t, get: (t) => t.undo }, metadata: I }, null, p), y(e, null, qt, { kind: "method", name: "redo", static: !1, private: !1, access: { has: (t) => "redo" in t, get: (t) => t.redo }, metadata: I }, null, p), y(e, null, Qt, { kind: "method", name: "goToHistory", static: !1, private: !1, access: { has: (t) => "goToHistory" in t, get: (t) => t.goToHistory }, metadata: I }, null, p), y(e, null, Zt, { kind: "getter", name: "validation", static: !1, private: !1, access: { has: (t) => "validation" in t, get: (t) => t.validation }, metadata: I }, null, p), y(e, null, te, { kind: "getter", name: "validAndDirty", static: !1, private: !1, access: { has: (t) => "validAndDirty" in t, get: (t) => t.validAndDirty }, metadata: I }, null, p), y(e, null, ee, { kind: "getter", name: "service", static: !1, private: !1, access: { has: (t) => "service" in t, get: (t) => t.service }, metadata: I }, null, p), y(null, null, g, { kind: "field", name: h, static: !1, private: !1, access: { has: (t) => h in t, get: (t) => t[h], set: (t, r) => {
      t[h] = r;
    } }, metadata: I }, D, S), y(null, null, z, { kind: "field", name: "draft", static: !1, private: !1, access: { has: (t) => "draft" in t, get: (t) => t.draft, set: (t, r) => {
      t.draft = r;
    } }, metadata: I }, E, w), y(null, null, Tt, { kind: "field", name: "initializedFields", static: !1, private: !1, access: { has: (t) => "initializedFields" in t, get: (t) => t.initializedFields, set: (t, r) => {
      t.initializedFields = r;
    } }, metadata: I }, At, Vt), y(null, null, xt, { kind: "field", name: "legacyInitDone", static: !1, private: !1, access: { has: (t) => "legacyInitDone" in t, get: (t) => t.legacyInitDone, set: (t, r) => {
      t.legacyInitDone = r;
    } }, metadata: I }, Et, jt), y(null, null, Rt, { kind: "field", name: "rawInitData", static: !1, private: !1, access: { has: (t) => "rawInitData" in t, get: (t) => t.rawInitData, set: (t, r) => {
      t.rawInitData = r;
    } }, metadata: I }, zt, Ft), y(null, null, Pt, { kind: "field", name: "options", static: !1, private: !1, access: { has: (t) => "options" in t, get: (t) => t.options, set: (t, r) => {
      t.options = r;
    } }, metadata: I }, Lt, Ct), y(null, null, Kt, { kind: "field", name: "historyMuted", static: !1, private: !1, access: { has: (t) => "historyMuted" in t, get: (t) => t.historyMuted, set: (t, r) => {
      t.historyMuted = r;
    } }, metadata: I }, Yt, Gt), I && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: I });
  })(), e;
})();
const _e = /* @__PURE__ */ Symbol("store-key"), Ne = () => {
  var e;
  return (e = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && e !== void 0 ? e : null;
}, Be = () => {
  var e;
  return (e = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0;
}, Ue = (e) => {
  var n, c;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((n = o.__MVVM_DEVTOOLS_APPLYING__) !== null && n !== void 0 ? n : 0) + 1;
  try {
    return e();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((c = o.__MVVM_DEVTOOLS_APPLYING__) !== null && c !== void 0 ? c : 1) - 1);
  }
}, $e = () => Be() > 0, It = (e) => ({
  items: e.items.map((n) => {
    var c, o;
    return {
      name: (o = (c = n.constructor) === null || c === void 0 ? void 0 : c.name) !== null && o !== void 0 ? o : "Model",
      data: n.service.dumpData,
      historyIndex: n.service.historyIndex
    };
  })
}), We = (e) => !!(e && typeof e == "object" && Array.isArray(e.items)), Je = (e) => {
  if (!e)
    return null;
  try {
    const n = JSON.parse(e);
    return We(n) ? n : null;
  } catch {
    return null;
  }
}, Xe = (e, n = {}) => {
  var c, o;
  const i = Ne();
  if (!i)
    return () => {
    };
  const s = i.connect({ name: n.name, instanceId: n.instanceId });
  let a = !1, l = (o = (c = e.items[0]) === null || c === void 0 ? void 0 : c.constructor) !== null && o !== void 0 ? o : null;
  try {
    s.init(It(e));
  } catch {
  }
  const h = fe(() => It(e), (g) => {
    var D;
    if (a || $e())
      return;
    const S = (D = e.items[0]) === null || D === void 0 ? void 0 : D.constructor;
    S && (l = S);
    try {
      s.send({ type: "store:update" }, g);
    } catch {
    }
  }), m = (g) => (a = !0, Ue(() => {
    try {
      return g();
    } finally {
      a = !1;
    }
  })), p = s.subscribe((g) => {
    var D;
    if (g.type !== "DISPATCH")
      return;
    const S = (D = g.payload) === null || D === void 0 ? void 0 : D.type;
    if (S === "RESET" || S === "ROLLBACK") {
      m(() => e.reset());
      return;
    }
    if (S === "JUMP_TO_ACTION" || S === "JUMP_TO_STATE") {
      const A = Je(g.state);
      if (!A)
        return;
      m(() => {
        var L, K, U;
        if (A.items.length === e.items.length && e.items.every((M) => {
          var z, E;
          return typeof ((z = M?.service) === null || z === void 0 ? void 0 : z.goToHistory) == "function" || typeof ((E = M?.service) === null || E === void 0 ? void 0 : E.loadData) == "function";
        })) {
          ct(() => {
            A.items.forEach((M, z) => {
              var E;
              const w = (E = e.items[z]) === null || E === void 0 ? void 0 : E.service, Y = M.historyIndex, G = w?.history;
              if (Array.isArray(G) && G.length > 0 && typeof Y == "number" && typeof w?.goToHistory == "function" && (Y === -1 && G.length > 0 || Y < G.length)) {
                w.goToHistory(Y);
                return;
              }
              typeof w?.loadData == "function" && w.loadData(M.data);
            });
          });
          return;
        }
        const T = (K = (L = e.items[0]) === null || L === void 0 ? void 0 : L.constructor) !== null && K !== void 0 ? K : l, d = A.items.map((M) => M.data);
        if (T) {
          e.applyLoaded(d, { model: T, cash: !1 }), l = T;
          return;
        }
        e.applyLoaded(d, { cash: !1 });
        const V = (U = e.items[0]) === null || U === void 0 ? void 0 : U.constructor;
        V && (l = V);
      });
    }
  });
  return () => {
    h(), typeof p == "function" && p(), typeof s.unsubscribe == "function" && s.unsubscribe(), typeof s.disconnect == "function" && s.disconnect();
  };
};
let mi = (() => {
  var e, n, c;
  let o = [], i, s = [], a = [], l, h = [], m = [], p, g, D, S, A, L, K, U, st;
  return e = class {
    get items() {
      return W(this, n, "f");
    }
    set items(d) {
      J(this, n, d, "f");
    }
    get _cash() {
      return W(this, c, "f");
    }
    set _cash(d) {
      J(this, c, d, "f");
    }
    constructor() {
      n.set(this, (b(this, o), b(this, s, []))), c.set(this, (b(this, a), b(this, h, []))), b(this, m), yt(this), this.autoAttachDevtools();
    }
    add(d) {
      this.items = [...this.items, d];
    }
    remove(d) {
      this.items = this.items.filter((V) => V !== d);
    }
    /**
     * Найти элемент по предикату.
     */
    find(d) {
      return this.items.find(d);
    }
    /**
     * Отфильтровать элементы по предикату.
     */
    filter(d) {
      return this.items.filter(d);
    }
    /**
     * Найти элемент по id (или любому полю-ключу).
     */
    findBy(d, V) {
      return this.items.find((M) => M?.[d] === V);
    }
    clear() {
      this.items = [];
    }
    get size() {
      return this.items.length;
    }
    get snapshot() {
      return It(this);
    }
    /**
     * Оригинальные данные (до маппинга в модели).
     */
    get cash() {
      return this._cash;
    }
    reset() {
      this.clear();
    }
    /**
     * Применить загруженные данные к items.
     */
    applyLoaded(d, V = {}) {
      const { model: M, mode: z = "replace", cash: E = !0 } = V;
      if (E && this.setCash(d), z === "append") {
        this.items = [...this.items, ...[M ? d.map((w) => new M(w)) : d].flat(1)];
        return;
      }
      this.items = M ? d.map((w) => new M(w)) : d;
    }
    /**
     * Сохранить оригинальные данные стора.
     */
    setCash(d) {
      this._cash = d ?? [];
    }
    autoAttachDevtools() {
      var d, V, M, z, E, w, Y, G;
      const X = globalThis;
      if (!X.__MVVM_DEVTOOLS_AUTO__)
        return;
      const q = P(_e, this.constructor, {}) || {};
      if (((d = q.devtools) === null || d === void 0 ? void 0 : d.enabled) === !1)
        return;
      const at = (E = (M = (V = q.devtools) === null || V === void 0 ? void 0 : V.name) !== null && M !== void 0 ? M : (z = this.constructor) === null || z === void 0 ? void 0 : z.name) !== null && E !== void 0 ? E : "Store", rt = ((w = X.__MVVM_DEVTOOLS_STORE_SEQ__) !== null && w !== void 0 ? w : 0) + 1;
      X.__MVVM_DEVTOOLS_STORE_SEQ__ = rt;
      const ot = (G = (Y = q.devtools) === null || Y === void 0 ? void 0 : Y.instanceId) !== null && G !== void 0 ? G : `${at}#${rt}`;
      Xe(this, { name: at, instanceId: ot });
    }
  }, n = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap(), (() => {
    const T = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    i = [N], l = [N], p = [j], g = [j], D = [j], S = [tt], A = [tt], L = [tt], K = [j], U = [j], st = [j], y(e, null, i, { kind: "accessor", name: "items", static: !1, private: !1, access: { has: (d) => "items" in d, get: (d) => d.items, set: (d, V) => {
      d.items = V;
    } }, metadata: T }, s, a), y(e, null, l, { kind: "accessor", name: "_cash", static: !1, private: !1, access: { has: (d) => "_cash" in d, get: (d) => d._cash, set: (d, V) => {
      d._cash = V;
    } }, metadata: T }, h, m), y(e, null, p, { kind: "method", name: "add", static: !1, private: !1, access: { has: (d) => "add" in d, get: (d) => d.add }, metadata: T }, null, o), y(e, null, g, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (d) => "remove" in d, get: (d) => d.remove }, metadata: T }, null, o), y(e, null, D, { kind: "method", name: "clear", static: !1, private: !1, access: { has: (d) => "clear" in d, get: (d) => d.clear }, metadata: T }, null, o), y(e, null, S, { kind: "getter", name: "size", static: !1, private: !1, access: { has: (d) => "size" in d, get: (d) => d.size }, metadata: T }, null, o), y(e, null, A, { kind: "getter", name: "snapshot", static: !1, private: !1, access: { has: (d) => "snapshot" in d, get: (d) => d.snapshot }, metadata: T }, null, o), y(e, null, L, { kind: "getter", name: "cash", static: !1, private: !1, access: { has: (d) => "cash" in d, get: (d) => d.cash }, metadata: T }, null, o), y(e, null, K, { kind: "method", name: "reset", static: !1, private: !1, access: { has: (d) => "reset" in d, get: (d) => d.reset }, metadata: T }, null, o), y(e, null, U, { kind: "method", name: "applyLoaded", static: !1, private: !1, access: { has: (d) => "applyLoaded" in d, get: (d) => d.applyLoaded }, metadata: T }, null, o), y(e, null, st, { kind: "method", name: "setCash", static: !1, private: !1, access: { has: (d) => "setCash" in d, get: (d) => d.setCash }, metadata: T }, null, o), T && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: T });
  })(), e;
})();
function vi(e) {
  return et(e, "instance");
}
function bi(e) {
  return ((n, c) => Ae(e)(n, c));
}
function pi(e, n) {
  const c = (o, i) => {
    var s;
    const a = typeof e == "string" ? { id: e } : typeof e == "object" ? e : { id: (s = i?.name) !== null && s !== void 0 ? s : o?.name };
    R(_e, a, o), ue(a)(o, i);
  };
  return typeof e == "function" ? c(e, n) : (o, i) => c(o, i);
}
class Di {
}
const _t = new Dt();
function Ii(e, n) {
  return Me((c = {}) => {
    const { resolved: o, instance: i } = Se(() => {
      const a = et(e) || (typeof e != "string" ? { instance: new e() } : void 0), l = a?.instance;
      return { resolved: a, instance: l };
    }, [e]);
    if (ke(() => {
      if (i)
        return typeof i.onInit == "function" && i.onInit(), () => {
          typeof i.onDispose == "function" && i.onDispose();
        };
    }, [i]), o) {
      const s = _t.fields(i), a = s.length > 0 ? s : _t.fields(Object.getPrototypeOf(i));
      for (const l in c)
        if (a instanceof Array) {
          const h = a.find((m) => m.name === l);
          h && Reflect.set(i, h.originName, Reflect.get(c, l));
        }
      return R(_t.metadataKey, a, i), n(Object.assign({ viewModel: i }, c));
    }
    return n(Object.assign({}, c));
  });
}
export {
  et as GetService,
  vi as GetStore,
  Ae as Inject,
  bi as InjectStore,
  ui as MakeObservable,
  _i as Model,
  fi as PropFromView,
  ue as Service,
  oi as SetService,
  pi as Store,
  mi as StoreBase,
  ri as TODO,
  Di as ViewModel,
  He as attachModelDevtools,
  Xe as attachStoreDevtools,
  R as defineMetadata,
  F as define_prop,
  di as exclude,
  hi as field,
  we as getExecutingFunctionNameByStack,
  P as getOwnMetadata,
  ai as isSerializable,
  ci as submit,
  li as validation,
  Ii as view
};
//# sourceMappingURL=index.js.map
