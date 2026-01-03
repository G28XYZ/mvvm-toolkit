import "reflect-metadata";
import { d as ge, _ as W, a as J, b as p, e as ve, c as y } from "./tslib.es6-COgJoJmX.js";
import pe, { cloneDeep as H, isObject as ne, isEqual as ae, isEmpty as be } from "lodash";
import { makeObservable as mt, reaction as fe, runInAction as dt, observable as G, isObservable as re, computed as tt, action as j } from "mobx";
import { enablePatches as De, immerable as oe, createDraft as Ie, applyPatches as le, produce as Oe } from "immer";
import { observer as Me } from "mobx-react";
import { useMemo as Se, useEffect as ke } from "react";
const P = (e, n, d) => Reflect.getOwnMetadata(e, n) || d || {}, z = (e, n, d) => Reflect.defineMetadata(e, n, d);
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
const ce = {}, ut = [];
let de = !1;
const ri = (e, ...n) => {
  const d = new Error().stack;
  if (!de)
    console.log("%c TODO", "background: #222; color: #bada55", ce), de = !0;
  else {
    const i = we(d);
    ut.includes(i) === !1 && (ut.push(i), Reflect.set(ce, `${ut.length}) ${e}`, { msg: n, get path() {
      return console.info(n, i), i;
    } }));
  }
  function o(...i) {
  }
  return o;
}, N = (e, n) => !!e && (typeof n == "string" || typeof n == "symbol"), K = (e) => !!e && typeof e == "object" && "kind" in e, Ae = (e) => ({
  kind: "class",
  name: e,
  addInitializer: () => {
  },
  metadata: {}
}), Z = /* @__PURE__ */ Symbol("service-key"), gt = new Proxy({}, Reflect);
function Te(e) {
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
  function d(o, i) {
    if (N(o, i)) {
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
  return d;
}
function et(e, n) {
  var d;
  const o = P(Z, gt);
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
    return n ? (d = o[e]) === null || d === void 0 ? void 0 : d[n] : o[e];
}
function ue(e, n) {
  const d = (i, s) => {
    const a = String(typeof e == "string" && e || typeof e == "object" && e?.id || s?.name || i?.name), c = P(Z, gt), f = new Proxy({
      target: i,
      instance: typeof e == "object" && Reflect.get(e, "transient") || typeof e == "object" && Reflect.get(e, "lazy") ? i : new i(),
      context: s,
      options: e
    }, {
      get(m, b, g) {
        var D, S;
        if (b === "instance" && (!((D = m?.options) === null || D === void 0) && D.transient))
          return new i();
        if (b === "instance" && (!((S = m?.options) === null || S === void 0) && S.lazy) && m.instance === i) {
          const T = new i();
          return Reflect.set(m, b, T, g), T;
        }
        return Reflect.get(m, b, g);
      },
      set(m, b, g, D) {
        return Reflect.set(m, b, g, D);
      }
    });
    c[a] = f, z(Z, c, gt), z(Z, c[a], i);
  };
  function o(i, s) {
    var a, c;
    const f = i.__mvvm_legacy_source__, m = K(s) ? s : Ae((c = (a = f?.name) !== null && a !== void 0 ? a : i?.name) !== null && c !== void 0 ? c : "");
    d(i, m), f && f !== i && z(Z, P(Z, i), f);
  }
  return pe.isFunction(e) ? o(e, n) : e ? (i, s) => o(i, s) : o;
}
const oi = (e, n) => {
  const { kind: d = "class", name: o = "", addInitializer: i = () => {
  }, metadata: s } = n?.ctx || {};
  return ue(n)(e, {
    kind: d,
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
    return n instanceof it || Object.getOwnPropertyNames(this).some((d) => Object.keys(n).includes(d));
  }
  /**
   * Получить метаданные конкретного поля модели.
   */
  fieldInstance(n, d) {
    return this.fields(d).find((o) => o.name === n);
  }
  /**
   * Получить массив метаданных полей модели.
   */
  fields(n) {
    const d = [], o = /* @__PURE__ */ new Set();
    let i = n;
    for (; i; ) {
      const s = Reflect.getOwnMetadata(this.metadataKey, i);
      if (Array.isArray(s))
        for (const a of s) {
          const c = a?.name;
          if (c !== void 0) {
            const f = typeof c == "symbol" ? c : String(c);
            if (o.has(f))
              continue;
            o.add(f);
          }
          d.push(a);
        }
      i = Object.getPrototypeOf(i);
    }
    return d;
  }
}
class vt extends it {
  constructor() {
    super(...arguments), this.metadataKey = xe;
  }
}
class pt extends it {
  constructor() {
    super(...arguments), this.metadataKey = Ee;
  }
}
class bt extends it {
  constructor() {
    super(...arguments), this.metadataKey = je;
  }
}
class Dt extends it {
  /**
   * Создать метаданные поля модели.
   */
  constructor(n = {}) {
    super(n), this.factory = null, this.mapping = null, this.collectChanges = !1, this.name = null, this.ctx = null, this.metadataKey = Ve, this.factory = n.factory, this.mapping = n.mapping, this.name = n.name, this.ctx = n.ctx, this.collectChanges = !!n.collectChanges;
  }
}
class It extends it {
  /**
   * Создать метаданные для PropFromView.
   */
  constructor(n = {}) {
    super(n), this.metadataKey = Re;
    for (const d in this)
      n && d in n && (this[d] = Reflect.get(n, d));
  }
}
function _t(e) {
  const n = Object.assign({ enumerable: !1, writable: !0 }, e);
  return function(d, o) {
    if (N(d, o)) {
      Object.defineProperty(d, o, {
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
    if (K(o)) {
      const i = o;
      return i.kind === "field" ? function(s) {
        return Object.defineProperty(this, i.name, Object.assign({ value: s }, n)), s;
      } : (i.addInitializer(function() {
        const s = Object.getOwnPropertyDescriptor(this, i.name);
        s && Object.defineProperty(this, i.name, Object.assign(Object.assign({}, s), { enumerable: n.enumerable }));
      }), d);
    }
  };
}
function F(e, n) {
  return N(e, n) || K(n) ? _t()(e, n) : _t(e);
}
const ze = () => {
  var e;
  const n = globalThis;
  return !!((e = n.__MVVM_DEVTOOLS_HISTORY__) !== null && e !== void 0 ? e : n.__MVVM_DEVTOOLS_AUTO__);
}, Fe = (e) => ze() ? !e || typeof e != "object" ? { collectChanges: !0 } : "collectChanges" in e ? e : Object.assign(Object.assign({}, e), { collectChanges: !0 }) : e;
function li(e) {
  const n = (i, s) => {
    const a = new vt({ callback: e, name: String(s) }), c = P(a.metadataKey, i, new Array());
    z(a.metadataKey, [...c, a], i);
  }, d = (i) => {
    i.addInitializer(function() {
      const s = new vt({ callback: e, name: String(i.name) }), a = P(s.metadataKey, this, new Array());
      z(s.metadataKey, [...a, s], this);
    });
  };
  function o(i, s) {
    if (N(i, s)) {
      n(i, s);
      return;
    }
    if (K(s))
      return d(s), s.kind === "field" ? (a) => a : s;
  }
  return e ? ((i, s) => o(i, s)) : ((i) => i);
}
function ci(e) {
  const n = (i, s) => {
    const a = new pt({ callback: e, name: String(s) }), c = P(a.metadataKey, i, new Array());
    z(a.metadataKey, [...c, a], i);
  }, d = (i) => {
    i.addInitializer(function() {
      const s = new pt({ callback: e, name: String(i.name) }), a = P(s.metadataKey, this, new Array());
      z(s.metadataKey, [...a, s], this);
    });
  };
  function o(i, s) {
    if (N(i, s)) {
      n(i, s);
      return;
    }
    if (K(s))
      return d(s), s.kind === "field" ? (a) => a : s;
  }
  return e ? ((i, s) => o(i, s)) : ((i) => i);
}
function di(e) {
  const n = (i, s) => {
    const a = new bt({ callback: e, name: String(s) }), c = P(a.metadataKey, i, new Array());
    z(a.metadataKey, [...c, a], i);
  }, d = (i) => {
    i.addInitializer(function() {
      const s = new bt({ callback: e, name: String(i.name) }), a = P(s.metadataKey, this, new Array());
      z(s.metadataKey, [...a, s], this);
    });
  };
  function o(i, s) {
    if (N(i, s)) {
      n(i, s);
      return;
    }
    if (K(s))
      return d(s), s.kind === "field" ? void 0 : s;
  }
  if (e)
    return ((i, s) => o(i, s));
}
function hi(e, n) {
  const d = Fe(N(e, n) ? void 0 : e), o = (a, c) => {
    const f = new Dt(Object.assign(Object.assign({}, d), { name: String(c), ctx: null })), m = P(f.metadataKey, a, new Array());
    z(f.metadataKey, [...m, f], a), Object.getOwnPropertyDescriptor(a, c) || Object.defineProperty(a, c, {
      configurable: !0,
      enumerable: !0,
      get() {
        const g = this;
        if (Object.prototype.hasOwnProperty.call(g, c))
          return Reflect.get(g, c);
        const D = g.initField, S = g.initData;
        if (S && c in S && typeof D == "function")
          return D.call(g, String(c), { skipValidation: !0 }), Reflect.get(g, c);
      },
      set(g) {
        const D = this, S = D.initField, T = D.initData;
        if (T && !(c in T) && Reflect.set(T, c, g), typeof S == "function") {
          S.call(D, String(c), { skipValidation: !0 });
          return;
        }
        Object.defineProperty(this, c, { value: g, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  }, i = (a) => {
    a.addInitializer(function() {
      const c = this;
      if (typeof c.initField == "function") {
        const f = new Dt(Object.assign(Object.assign({}, d), { name: String(a.name), ctx: a })), m = P(f.metadataKey, this, new Array());
        z(f.metadataKey, [...m, f], this), c.initField.call(this, String(a.name));
      }
    });
  };
  function s(a, c) {
    if (N(a, c)) {
      o(a, c);
      return;
    }
    if (K(c))
      return i(c), c.kind === "field" ? (f) => f : c;
  }
  return N(e, n) ? s(e, n) : d && !K(n) ? (a, c) => s(a, c) : K(n) ? s(void 0, n) : (a, c) => s(a, c);
}
function fi(e) {
  const n = (i, s) => {
    const a = new It({ name: e, originName: String(s) });
    a.name = e, a.originName = String(s);
    const c = P(a.metadataKey, i, new Array());
    z(a.metadataKey, [...c, a], i);
  }, d = (i) => {
    i.addInitializer(function() {
      const s = new It(), a = s.fields(this);
      for (const c in this)
        a instanceof Array && i.name === c && (s.name = e, s.originName = c, s.value = this[c], a.push(s));
      z(s.metadataKey, a, this);
    });
  };
  function o(i, s) {
    if (N(i, s)) {
      n(i, s);
      return;
    }
    if (K(s))
      return d(s), s.kind === "field" ? (a) => a : s;
  }
  return e ? ((i, s) => o(i, s)) : ((i) => i);
}
function ui(e, n) {
  const d = (s) => class extends s {
    constructor(...a) {
      super(...a), mt(this);
    }
  }, o = (s, a) => {
    if (typeof Reflect?.getOwnMetadataKeys == "function")
      for (const c of Reflect.getOwnMetadataKeys(s)) {
        const f = Reflect.getOwnMetadata(c, s);
        Reflect.defineMetadata(c, f, a);
      }
  };
  function i(s, a) {
    if (!K(a)) {
      const c = s, f = d(c);
      return Object.defineProperty(f, "__mvvm_legacy_source__", { value: c, configurable: !0 }), o(c, f), f;
    }
    a.addInitializer(function() {
      mt(this);
    });
  }
  return e && !K(n) || e ? i(e, n) : i;
}
const Pe = () => {
  var e;
  return (e = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && e !== void 0 ? e : null;
}, Le = () => {
  var e;
  return (e = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0;
}, ct = (e) => {
  var n, d;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((n = o.__MVVM_DEVTOOLS_APPLYING__) !== null && n !== void 0 ? n : 0) + 1;
  try {
    return e();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((d = o.__MVVM_DEVTOOLS_APPLYING__) !== null && d !== void 0 ? d : 1) - 1);
  }
}, Ce = () => Le() > 0, he = (e) => ({
  data: e.service.dumpData,
  historyIndex: e.service.historyIndex
}), He = (e, n = {}) => {
  const d = Pe();
  if (!d)
    return () => {
    };
  const o = d.connect({ name: n.name, instanceId: n.instanceId });
  let i = !1;
  try {
    o.init(he(e));
  } catch {
  }
  const s = fe(() => he(e), (c) => {
    var f;
    if (!(i || Ce()))
      try {
        o.send({ type: (f = n.actionType) !== null && f !== void 0 ? f : "model:update" }, c);
      } catch {
      }
  }), a = o.subscribe((c) => {
    var f;
    if (c.type !== "DISPATCH")
      return;
    const m = (f = c.payload) === null || f === void 0 ? void 0 : f.type;
    if (m === "RESET") {
      i = !0, ct(() => {
        try {
          e.service.toInit();
        } finally {
          i = !1;
        }
      });
      return;
    }
    if (m === "COMMIT") {
      i = !0, ct(() => {
        try {
          e.service.commit();
        } finally {
          i = !1;
        }
      });
      return;
    }
    if (m === "ROLLBACK") {
      i = !0, ct(() => {
        try {
          e.service.toInit();
        } finally {
          i = !1;
        }
      });
      return;
    }
    if (m === "JUMP_TO_ACTION" || m === "JUMP_TO_STATE") {
      if (!c.state)
        return;
      try {
        const b = JSON.parse(c.state), g = b.historyIndex, D = e.service.history, S = Array.isArray(D) && D.length > 0, T = typeof g == "number" && (g === -1 && S || g >= 0 && S && g < D.length);
        i = !0, ct(() => {
          var L;
          try {
            if (T) {
              e.service.goToHistory(g);
              return;
            }
            const Y = (L = b.data) !== null && L !== void 0 ? L : b;
            dt(() => {
              e.service.loadData(Y);
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
const Ke = new pt(), $ = new Dt(), Ye = new vt(), Ge = new bt();
let _i = (() => {
  var e, n, d, o, i, s, a, c, f, m;
  let b = [], g, D = [], S = [], T, L = [], Y = [], B, st = [], U = [], w, l = [], M = [], A, E = [], V = [], R, C = [], X = [], q, nt = [], rt = [], ot, lt = [], Mt = [], St, kt = [], wt = [], At, Tt = [], Vt = [], xt, Et = [], jt = [], Rt, zt = [], Ft = [], Pt, Lt = [], Ct = [], Ht, Kt, Yt = [], Gt = [], Nt, Bt, Ut, $t, Wt, Jt, Xt, qt, Qt, Zt, te, ee;
  return e = class {
    get initData() {
      return W(this, n, "f");
    }
    set initData(t) {
      J(this, n, t, "f");
    }
    get committedData() {
      return W(this, d, "f");
    }
    set committedData(t) {
      J(this, d, t, "f");
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
      return W(this, c, "f");
    }
    set historyIndex(t) {
      J(this, c, t, "f");
    }
    /**
     * Создает модель и инициализирует данные.
     */
    constructor(t = {}, r) {
      this[f] = (p(this, b), p(this, D, !0)), n.set(this, (p(this, S), p(this, L, null))), d.set(this, (p(this, Y), p(this, st, {}))), o.set(this, (p(this, U), p(this, l, {}))), this.draft = (p(this, M), p(this, E, null)), i.set(this, (p(this, V), p(this, C, []))), s.set(this, (p(this, X), p(this, nt, []))), a.set(this, (p(this, rt), p(this, lt, []))), c.set(this, (p(this, Mt), p(this, kt, -1))), this.initializedFields = (p(this, wt), p(this, Tt, void 0)), this.legacyInitDone = (p(this, Vt), p(this, Et, !1)), this.rawInitData = (p(this, jt), p(this, zt, null)), this.options = (p(this, Ft), p(this, Lt, void 0)), this.historyMuted = (p(this, Ct), p(this, Yt, !1)), this.serviceApi = (p(this, Gt), {
        loadData: (h) => this.loadData(h),
        reject: () => this.reject(),
        commit: () => this.commit(),
        commitField: (h) => this.commitField(h),
        toInit: () => this.toInit(),
        undo: () => this.undo(),
        redo: () => this.redo(),
        goToHistory: (h) => this.goToHistory(h)
      }), this.options = r, this[oe] = !0, this.init(t), this.autoAttachDevtools(), this.initLegacyFields();
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
      const h = $.fieldInstance(t, this);
      if (h) {
        t in this.initData || Reflect.set(this.initData, t, H(Reflect.get(this, t)));
        const u = H(this.initData), _ = h?.factory ? h.factory(u, this) : Reflect.get(u, h.name);
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
          this.initData = H(_);
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
            const Q = H(_), at = x.factory ? x.factory(Q, this) : Reflect.get(Q, x.name);
            this.defineFieldValue(v, at), Reflect.set(this, v, at), u.add(v);
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
      for (const h in t)
        $.fieldInstance(h, this) && Reflect.set(r, h, H(t[h]));
      this.draft = Ie(r);
    }
    autoAttachDevtools() {
      var t, r, h, u, _, O, v, k, x, Q, at, ht;
      const ft = globalThis;
      if (!ft.__MVVM_DEVTOOLS_AUTO__ || ((r = (t = this.options) === null || t === void 0 ? void 0 : t.devtools) === null || r === void 0 ? void 0 : r.enabled) === !1)
        return;
      const ie = (v = (_ = (u = (h = this.options) === null || h === void 0 ? void 0 : h.devtools) === null || u === void 0 ? void 0 : u.name) !== null && _ !== void 0 ? _ : (O = this.constructor) === null || O === void 0 ? void 0 : O.name) !== null && v !== void 0 ? v : "Model", se = ((k = ft.__MVVM_DEVTOOLS_SEQ__) !== null && k !== void 0 ? k : 0) + 1;
      ft.__MVVM_DEVTOOLS_SEQ__ = se;
      const ye = (at = (Q = (x = this.options) === null || x === void 0 ? void 0 : x.devtools) === null || Q === void 0 ? void 0 : Q.instanceId) !== null && at !== void 0 ? at : `${ie}#${se}`;
      ((ht = globalThis.queueMicrotask) !== null && ht !== void 0 ? ht : ((me) => Promise.resolve().then(me)))(() => He(this, { name: ie, instanceId: ye }));
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
      const r = new Set(t.map((h) => h.field).filter(Boolean));
      r.size !== 0 && this.withHistoryMuted(() => {
        for (const h of r) {
          const u = this.draft, _ = this.initData, O = Reflect.has(u, h), v = Reflect.get(O ? u : _, h);
          let k = v;
          try {
            k = H(v);
          } catch {
            k = v;
          }
          Reflect.set(this, h, k), this.defineFieldValue(h, Reflect.get(this, h));
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
    produceDraft(t, r, h) {
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
            h = t;
          v && (v[h] = r);
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
    createObservable(t, r, h, u = h) {
      return t = re(t) ? t : G.box(t), new Proxy(t.get(), {
        get: (_, O, v) => {
          const k = Reflect.get(_, O, v);
          return k && typeof k == "object" && !(k instanceof e) && !re(t) ? this.createObservable(k, String(O), r, `${u}.${String(O)}`) : k;
        },
        set: (_, O, v, k) => {
          const x = Reflect.set(_, O, v, k);
          return t.set(v), this.produceDraft(u, t.get(), String(O)), this.checkChange(h, Reflect.get(this, h)), x;
        }
      });
    }
    /**
     * Определить getter/setter для поля модели.
     */
    defineFieldValue(t, r) {
      const h = $.fieldInstance(t, this);
      return r && typeof r == "object" && (r = this.createObservable(r, t, t)), r = G.box(r), Reflect.defineProperty(this, h.name, {
        get() {
          return r.get();
        },
        set: (u) => {
          dt(() => r.set(u)), this.produceDraft(h.name, r.get()), this.checkChange(h.name, r.get());
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
          const r = H(t);
          this.initData = r, this.rawInitData = r;
        } catch {
          const h = Object.assign({}, t);
          this.initData = h, this.rawInitData = h;
        }
      else
        this.rawInitData = null;
    }
    /**
     * Проверить изменение поля и обновить modified_.
     */
    checkChange(t, r) {
      const h = H(r), u = H(Reflect.get(this.committedData, t)) || H(Reflect.get(this.initData, t)), _ = t && t in this.initData && !ae(u, h);
      return dt(() => {
        _ && Reflect.set(this.modified_, t, H(u) || u);
        for (const O in this.modified_)
          t === O && t in this.modified_ && ae(u, h) && delete this.modified_[O];
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
      return !be(this.modified_);
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
          const r = this.historyIndex + 1, h = this.history[r];
          this.historyIndex = r, this.applyHistoryPatches(h.patches);
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
      }, h = (u) => {
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
          return !((_ = this.options) === null || _ === void 0) && _.byFields && !this.options.byFields.includes(u.name) || h(u.name) ? void 0 : Reflect.set(t, u.name, r(u.name));
      });
      try {
        return H(t);
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
        const h = Ye.fieldInstance(r, this);
        h && Reflect.set(t, r, h.callback(this[r], this) || "");
      }
      return t;
    }
    /**
     * Признак валидности и наличия изменений.
     */
    get validAndDirty() {
      return this.dirty && Object.values(this.validation).filter(Boolean).length === 0;
    }
    get service() {
      return Object.assign({
        dirty: this.dirty,
        dumpData: this.dumpData,
        // toJSON        : this.serviceToJSON,
        validation: this.validation,
        changes: this.changes,
        inverseChanges: this.inverseChanges,
        history: this.history,
        historyIndex: this.historyIndex
      }, this.serviceApi);
    }
  }, n = /* @__PURE__ */ new WeakMap(), d = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), i = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap(), g = [F], f = ve(oe), (() => {
    const I = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    T = [G, F], B = [G, F], w = [G, F], A = [F], R = [G, F], q = [G, F], ot = [G, F], St = [G, F], At = [F], xt = [F], Rt = [F], Pt = [F], Ht = [j], Kt = [F], Nt = [j], Bt = [tt], Ut = [j], $t = [j], Wt = [j], Jt = [j], Xt = [j], qt = [j], Qt = [j], Zt = [tt], te = [tt], ee = [(m = tt).struct.bind(m)], y(e, null, T, { kind: "accessor", name: "initData", static: !1, private: !1, access: { has: (t) => "initData" in t, get: (t) => t.initData, set: (t, r) => {
      t.initData = r;
    } }, metadata: I }, L, Y), y(e, null, B, { kind: "accessor", name: "committedData", static: !1, private: !1, access: { has: (t) => "committedData" in t, get: (t) => t.committedData, set: (t, r) => {
      t.committedData = r;
    } }, metadata: I }, st, U), y(e, null, w, { kind: "accessor", name: "modified_", static: !1, private: !1, access: { has: (t) => "modified_" in t, get: (t) => t.modified_, set: (t, r) => {
      t.modified_ = r;
    } }, metadata: I }, l, M), y(e, null, R, { kind: "accessor", name: "changes", static: !1, private: !1, access: { has: (t) => "changes" in t, get: (t) => t.changes, set: (t, r) => {
      t.changes = r;
    } }, metadata: I }, C, X), y(e, null, q, { kind: "accessor", name: "inverseChanges", static: !1, private: !1, access: { has: (t) => "inverseChanges" in t, get: (t) => t.inverseChanges, set: (t, r) => {
      t.inverseChanges = r;
    } }, metadata: I }, nt, rt), y(e, null, ot, { kind: "accessor", name: "history", static: !1, private: !1, access: { has: (t) => "history" in t, get: (t) => t.history, set: (t, r) => {
      t.history = r;
    } }, metadata: I }, lt, Mt), y(e, null, St, { kind: "accessor", name: "historyIndex", static: !1, private: !1, access: { has: (t) => "historyIndex" in t, get: (t) => t.historyIndex, set: (t, r) => {
      t.historyIndex = r;
    } }, metadata: I }, kt, wt), y(e, null, Ht, { kind: "method", name: "resetToDefault", static: !1, private: !1, access: { has: (t) => "resetToDefault" in t, get: (t) => t.resetToDefault }, metadata: I }, null, b), y(e, null, Nt, { kind: "method", name: "produceDraft", static: !1, private: !1, access: { has: (t) => "produceDraft" in t, get: (t) => t.produceDraft }, metadata: I }, null, b), y(e, null, Bt, { kind: "getter", name: "dirty", static: !1, private: !1, access: { has: (t) => "dirty" in t, get: (t) => t.dirty }, metadata: I }, null, b), y(e, null, Ut, { kind: "method", name: "commit", static: !1, private: !1, access: { has: (t) => "commit" in t, get: (t) => t.commit }, metadata: I }, null, b), y(e, null, $t, { kind: "method", name: "commitField", static: !1, private: !1, access: { has: (t) => "commitField" in t, get: (t) => t.commitField }, metadata: I }, null, b), y(e, null, Wt, { kind: "method", name: "reject", static: !1, private: !1, access: { has: (t) => "reject" in t, get: (t) => t.reject }, metadata: I }, null, b), y(e, null, Jt, { kind: "method", name: "toInit", static: !1, private: !1, access: { has: (t) => "toInit" in t, get: (t) => t.toInit }, metadata: I }, null, b), y(e, null, Xt, { kind: "method", name: "undo", static: !1, private: !1, access: { has: (t) => "undo" in t, get: (t) => t.undo }, metadata: I }, null, b), y(e, null, qt, { kind: "method", name: "redo", static: !1, private: !1, access: { has: (t) => "redo" in t, get: (t) => t.redo }, metadata: I }, null, b), y(e, null, Qt, { kind: "method", name: "goToHistory", static: !1, private: !1, access: { has: (t) => "goToHistory" in t, get: (t) => t.goToHistory }, metadata: I }, null, b), y(e, null, Zt, { kind: "getter", name: "validation", static: !1, private: !1, access: { has: (t) => "validation" in t, get: (t) => t.validation }, metadata: I }, null, b), y(e, null, te, { kind: "getter", name: "validAndDirty", static: !1, private: !1, access: { has: (t) => "validAndDirty" in t, get: (t) => t.validAndDirty }, metadata: I }, null, b), y(e, null, ee, { kind: "getter", name: "service", static: !1, private: !1, access: { has: (t) => "service" in t, get: (t) => t.service }, metadata: I }, null, b), y(null, null, g, { kind: "field", name: f, static: !1, private: !1, access: { has: (t) => f in t, get: (t) => t[f], set: (t, r) => {
      t[f] = r;
    } }, metadata: I }, D, S), y(null, null, A, { kind: "field", name: "draft", static: !1, private: !1, access: { has: (t) => "draft" in t, get: (t) => t.draft, set: (t, r) => {
      t.draft = r;
    } }, metadata: I }, E, V), y(null, null, At, { kind: "field", name: "initializedFields", static: !1, private: !1, access: { has: (t) => "initializedFields" in t, get: (t) => t.initializedFields, set: (t, r) => {
      t.initializedFields = r;
    } }, metadata: I }, Tt, Vt), y(null, null, xt, { kind: "field", name: "legacyInitDone", static: !1, private: !1, access: { has: (t) => "legacyInitDone" in t, get: (t) => t.legacyInitDone, set: (t, r) => {
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
  var n, d;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((n = o.__MVVM_DEVTOOLS_APPLYING__) !== null && n !== void 0 ? n : 0) + 1;
  try {
    return e();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((d = o.__MVVM_DEVTOOLS_APPLYING__) !== null && d !== void 0 ? d : 1) - 1);
  }
}, $e = () => Be() > 0, Ot = (e) => ({
  items: e.items.map((n) => {
    var d, o;
    return {
      name: (o = (d = n.constructor) === null || d === void 0 ? void 0 : d.name) !== null && o !== void 0 ? o : "Model",
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
  var d, o;
  const i = Ne();
  if (!i)
    return () => {
    };
  const s = i.connect({ name: n.name, instanceId: n.instanceId });
  let a = !1, c = (o = (d = e.items[0]) === null || d === void 0 ? void 0 : d.constructor) !== null && o !== void 0 ? o : null;
  try {
    s.init(Ot(e));
  } catch {
  }
  const f = fe(() => Ot(e), (g) => {
    var D;
    if (a || $e())
      return;
    const S = (D = e.items[0]) === null || D === void 0 ? void 0 : D.constructor;
    S && (c = S);
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
  })), b = s.subscribe((g) => {
    var D;
    if (g.type !== "DISPATCH")
      return;
    const S = (D = g.payload) === null || D === void 0 ? void 0 : D.type;
    if (S === "RESET" || S === "ROLLBACK") {
      m(() => e.reset());
      return;
    }
    if (S === "JUMP_TO_ACTION" || S === "JUMP_TO_STATE") {
      const T = Je(g.state);
      if (!T)
        return;
      m(() => {
        var L, Y, B;
        if (T.items.length === e.items.length && e.items.every((M) => {
          var A, E;
          return typeof ((A = M?.service) === null || A === void 0 ? void 0 : A.goToHistory) == "function" || typeof ((E = M?.service) === null || E === void 0 ? void 0 : E.loadData) == "function";
        })) {
          dt(() => {
            T.items.forEach((M, A) => {
              var E;
              const V = (E = e.items[A]) === null || E === void 0 ? void 0 : E.service, R = M.historyIndex, C = V?.history;
              if (Array.isArray(C) && C.length > 0 && typeof R == "number" && typeof V?.goToHistory == "function" && (R === -1 && C.length > 0 || R < C.length)) {
                V.goToHistory(R);
                return;
              }
              typeof V?.loadData == "function" && V.loadData(M.data);
            });
          });
          return;
        }
        const U = (Y = (L = e.items[0]) === null || L === void 0 ? void 0 : L.constructor) !== null && Y !== void 0 ? Y : c, w = T.items.map((M) => M.data);
        if (U) {
          e.applyLoaded(w, { model: U, cash: !1 }), c = U;
          return;
        }
        e.applyLoaded(w, { cash: !1 });
        const l = (B = e.items[0]) === null || B === void 0 ? void 0 : B.constructor;
        l && (c = l);
      });
    }
  });
  return () => {
    f(), typeof b == "function" && b(), typeof s.unsubscribe == "function" && s.unsubscribe(), typeof s.disconnect == "function" && s.disconnect();
  };
};
let mi = (() => {
  var e, n, d;
  let o = [], i, s = [], a = [], c, f = [], m = [], b, g, D, S, T, L, Y, B, st, U;
  return e = class {
    get items() {
      return W(this, n, "f");
    }
    set items(l) {
      J(this, n, l, "f");
    }
    get _cash() {
      return W(this, d, "f");
    }
    set _cash(l) {
      J(this, d, l, "f");
    }
    constructor() {
      n.set(this, (p(this, o), p(this, s, []))), d.set(this, (p(this, a), p(this, f, []))), p(this, m), mt(this), this.autoAttachDevtools();
    }
    add(l) {
      this.items = this.items.concat(l);
    }
    addMany(l) {
      l?.length && (this.items = this.items.concat(l));
    }
    remove(l) {
      this.items = this.items.filter((M) => M !== l);
    }
    /**
     * Найти элемент по предикату.
     */
    find(l) {
      return this.items.find(l);
    }
    /**
     * Отфильтровать элементы по предикату.
     */
    filter(l) {
      return this.items.filter(l);
    }
    /**
     * Найти элемент по id (или любому полю-ключу).
     */
    findBy(l, M) {
      return this.items.find((A) => A?.[l] === M);
    }
    clear() {
      this.items = [];
    }
    get size() {
      return this.items.length;
    }
    get snapshot() {
      return Ot(this);
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
    applyLoaded(l, M = {}) {
      const { model: A, mode: E = "replace", cash: V = !0 } = M;
      if (V && this.setCash(l), E === "append") {
        const R = A ? l.map((C) => new A(C)) : l;
        this.addMany(R);
        return;
      }
      this.items = A ? l.map((R) => new A(R)) : l;
    }
    /**
     * Сохранить оригинальные данные стора.
     */
    setCash(l) {
      this._cash = l ?? [];
    }
    autoAttachDevtools() {
      var l, M, A, E, V, R, C, X;
      const q = globalThis;
      if (!q.__MVVM_DEVTOOLS_AUTO__)
        return;
      const nt = P(_e, this.constructor, {}) || {};
      if (((l = nt.devtools) === null || l === void 0 ? void 0 : l.enabled) === !1)
        return;
      const rt = (V = (A = (M = nt.devtools) === null || M === void 0 ? void 0 : M.name) !== null && A !== void 0 ? A : (E = this.constructor) === null || E === void 0 ? void 0 : E.name) !== null && V !== void 0 ? V : "Store", ot = ((R = q.__MVVM_DEVTOOLS_STORE_SEQ__) !== null && R !== void 0 ? R : 0) + 1;
      q.__MVVM_DEVTOOLS_STORE_SEQ__ = ot;
      const lt = (X = (C = nt.devtools) === null || C === void 0 ? void 0 : C.instanceId) !== null && X !== void 0 ? X : `${rt}#${ot}`;
      Xe(this, { name: rt, instanceId: lt });
    }
  }, n = /* @__PURE__ */ new WeakMap(), d = /* @__PURE__ */ new WeakMap(), (() => {
    const w = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    i = [G], c = [G], b = [j], g = [j], D = [j], S = [j], T = [tt], L = [tt], Y = [tt], B = [j], st = [j], U = [j], y(e, null, i, { kind: "accessor", name: "items", static: !1, private: !1, access: { has: (l) => "items" in l, get: (l) => l.items, set: (l, M) => {
      l.items = M;
    } }, metadata: w }, s, a), y(e, null, c, { kind: "accessor", name: "_cash", static: !1, private: !1, access: { has: (l) => "_cash" in l, get: (l) => l._cash, set: (l, M) => {
      l._cash = M;
    } }, metadata: w }, f, m), y(e, null, b, { kind: "method", name: "add", static: !1, private: !1, access: { has: (l) => "add" in l, get: (l) => l.add }, metadata: w }, null, o), y(e, null, g, { kind: "method", name: "addMany", static: !1, private: !1, access: { has: (l) => "addMany" in l, get: (l) => l.addMany }, metadata: w }, null, o), y(e, null, D, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (l) => "remove" in l, get: (l) => l.remove }, metadata: w }, null, o), y(e, null, S, { kind: "method", name: "clear", static: !1, private: !1, access: { has: (l) => "clear" in l, get: (l) => l.clear }, metadata: w }, null, o), y(e, null, T, { kind: "getter", name: "size", static: !1, private: !1, access: { has: (l) => "size" in l, get: (l) => l.size }, metadata: w }, null, o), y(e, null, L, { kind: "getter", name: "snapshot", static: !1, private: !1, access: { has: (l) => "snapshot" in l, get: (l) => l.snapshot }, metadata: w }, null, o), y(e, null, Y, { kind: "getter", name: "cash", static: !1, private: !1, access: { has: (l) => "cash" in l, get: (l) => l.cash }, metadata: w }, null, o), y(e, null, B, { kind: "method", name: "reset", static: !1, private: !1, access: { has: (l) => "reset" in l, get: (l) => l.reset }, metadata: w }, null, o), y(e, null, st, { kind: "method", name: "applyLoaded", static: !1, private: !1, access: { has: (l) => "applyLoaded" in l, get: (l) => l.applyLoaded }, metadata: w }, null, o), y(e, null, U, { kind: "method", name: "setCash", static: !1, private: !1, access: { has: (l) => "setCash" in l, get: (l) => l.setCash }, metadata: w }, null, o), w && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: w });
  })(), e;
})();
function vi(e) {
  return et(e, "instance");
}
function pi(e) {
  return ((n, d) => Te(e)(n, d));
}
function bi(e, n) {
  const d = (o, i) => {
    var s;
    const a = typeof e == "string" ? { id: e } : typeof e == "object" ? e : { id: (s = i?.name) !== null && s !== void 0 ? s : o?.name };
    z(_e, a, o), ue(a)(o, i);
  };
  return typeof e == "function" ? d(e, n) : (o, i) => d(o, i);
}
class Di {
}
const yt = new It();
function Ii(e, n) {
  return Me((d = {}) => {
    const { resolved: o, instance: i } = Se(() => {
      const a = et(e) || (typeof e != "string" ? { instance: new e() } : void 0), c = a?.instance;
      return { resolved: a, instance: c };
    }, [e]);
    if (ke(() => {
      if (i)
        return typeof i.onInit == "function" && i.onInit(), () => {
          typeof i.onDispose == "function" && i.onDispose();
        };
    }, [i]), o) {
      const s = yt.fields(i), a = s.length > 0 ? s : yt.fields(Object.getPrototypeOf(i));
      for (const c in d)
        if (a instanceof Array) {
          const f = a.find((m) => m.name === c);
          f && Reflect.set(i, f.originName, Reflect.get(d, c));
        }
      return z(yt.metadataKey, a, i), n(Object.assign({ viewModel: i }, d));
    }
    return n(Object.assign({}, d));
  });
}
export {
  et as GetService,
  vi as GetStore,
  Te as Inject,
  pi as InjectStore,
  ui as MakeObservable,
  _i as Model,
  fi as PropFromView,
  ue as Service,
  oi as SetService,
  bi as Store,
  mi as StoreBase,
  ri as TODO,
  Di as ViewModel,
  He as attachModelDevtools,
  Xe as attachStoreDevtools,
  z as defineMetadata,
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
