import "reflect-metadata";
import { d as mt, _ as T, a as j, b as G, c as S } from "./tslib.es6-B_Omq7a0.js";
import Qt, { isObject as Vt, isEqual as Ct, isEmpty as Jt } from "lodash";
import { makeObservable as vt, reaction as Gt, runInAction as B, observable as ot, isObservable as Ft, computed as X, action as x, flow as Xt, isFlowCancellationError as Zt, makeAutoObservable as te } from "mobx";
import { enablePatches as ee, immerable as xt, createDraft as ie, applyPatches as Lt, produce as se } from "immer";
import { observer as ne } from "mobx-react";
import { useMemo as ae, useEffect as re } from "react";
const H = (t, e, n) => Reflect.getOwnMetadata(t, e) || n || {}, L = (t, e, n) => Reflect.defineMetadata(t, e, n);
function Ye(...t) {
  try {
    return JSON.stringify(t), !0;
  } catch {
    return !1;
  }
}
function oe(t) {
  if (t && typeof t == "string") {
    let [e] = t.split(`
`)[2].replace(/at (get)?/, "").match(/.*/g) || [];
    return e && (e = e.trim()), e;
  }
}
const Ht = {}, _t = [];
let Kt = !1;
const Be = (t, ...e) => {
  const n = new Error().stack;
  if (!Kt)
    console.log("%c TODO", "background: #222; color: #bada55", Ht), Kt = !0;
  else {
    const s = oe(n);
    _t.includes(s) === !1 && (_t.push(s), Reflect.set(Ht, `${_t.length}) ${t}`, { msg: e, get path() {
      return console.info(e, s), s;
    } }));
  }
  function r(...s) {
  }
  return r;
}, q = (t, e) => !!t && (typeof e == "string" || typeof e == "symbol"), W = (t) => !!t && typeof t == "object" && "kind" in t, le = (t) => ({
  kind: "class",
  name: t,
  addInitializer: () => {
  },
  metadata: {}
}), J = /* @__PURE__ */ Symbol("service-key"), bt = new Proxy({}, Reflect);
function ce(t) {
  const e = (r, s) => {
    Object.defineProperty(r, s, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, s))
          return Reflect.get(this, s);
        const a = Z(t, "instance");
        if (a)
          return Object.defineProperty(this, s, { value: a, writable: !0, configurable: !0, enumerable: !0 }), a;
      },
      set(a) {
        const o = Z(t, "instance");
        Object.defineProperty(this, s, { value: o ?? a, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  };
  function n(r, s) {
    if (q(r, s)) {
      e(r, s);
      return;
    }
    return s.addInitializer(function() {
      return mt(this, void 0, void 0, function* () {
        const a = Z(t, "instance");
        a && Object.hasOwn(this, s.name) && Reflect.set(this, s.name, a);
      });
    }), (a) => a;
  }
  return n;
}
function Z(t, e) {
  var n;
  const r = H(J, bt);
  if (typeof t != "string") {
    const s = H(J, t);
    if (s)
      return e && e in s ? s[e] : s;
    for (const a in r) {
      const o = r[a];
      if (o.target === t) {
        t = o.context.name;
        break;
      }
    }
  }
  if (typeof t == "string")
    return e ? (n = r[t]) === null || n === void 0 ? void 0 : n[e] : r[t];
}
function Ut(t, e) {
  const n = (s, a) => {
    const o = String(typeof t == "string" && t || typeof t == "object" && t?.id || a?.name || s?.name), l = H(J, bt), c = new Proxy({
      target: s,
      instance: typeof t == "object" && Reflect.get(t, "transient") || typeof t == "object" && Reflect.get(t, "lazy") ? s : new s(),
      context: a,
      options: t
    }, {
      get(u, g, m) {
        var O, b;
        if (g === "instance" && (!((O = u?.options) === null || O === void 0) && O.transient))
          return new s();
        if (g === "instance" && (!((b = u?.options) === null || b === void 0) && b.lazy) && u.instance === s) {
          const I = new s();
          return Reflect.set(u, g, I, m), I;
        }
        return Reflect.get(u, g, m);
      },
      set(u, g, m, O) {
        return Reflect.set(u, g, m, O);
      }
    });
    l[o] = c, L(J, l, bt), L(J, l[o], s);
  };
  function r(s, a) {
    var o, l;
    const c = s.__legacy_source__, u = W(a) ? a : le((l = (o = c?.name) !== null && o !== void 0 ? o : s?.name) !== null && l !== void 0 ? l : "");
    n(s, u), c && c !== s && L(J, H(J, s), c);
  }
  return Qt.isFunction(t) ? r(t, e) : t ? (s, a) => r(s, a) : r;
}
const Ge = (t, e) => {
  const { kind: n = "class", name: r = "", addInitializer: s = () => {
  }, metadata: a } = e?.ctx || {};
  return Ut(e)(t, {
    kind: n,
    name: r,
    addInitializer: s,
    metadata: a
  }), Z(t).instance;
};
function yt(t) {
  var e, n, r;
  const s = Object.assign({ enumerable: !1, writable: !0 }, t), a = Object.assign({ configurable: !0, enumerable: !1, writable: !0 }, t), o = {
    configurable: (e = a.configurable) !== null && e !== void 0 ? e : !0,
    enumerable: (n = a.enumerable) !== null && n !== void 0 ? n : !1,
    writable: (r = a.writable) !== null && r !== void 0 ? r : !0,
    value: void 0
  };
  return function(l, c) {
    if (q(l, c)) {
      Object.defineProperty(l, c, {
        configurable: !0,
        enumerable: s.enumerable,
        get() {
        },
        set(u) {
          o.value = u, Object.defineProperty(this, c, o), o.value = void 0;
        }
      });
      return;
    }
    if (W(c)) {
      const u = c;
      return u.kind === "field" ? function(g) {
        return o.value = g, Object.defineProperty(this, u.name, o), o.value = void 0, g;
      } : (u.addInitializer(function() {
        const g = Object.getOwnPropertyDescriptor(this, u.name);
        g && Object.defineProperty(this, u.name, Object.assign(Object.assign({}, g), { enumerable: s.enumerable }));
      }), l);
    }
  };
}
function Ue(t, e) {
  return q(t, e) || W(e) ? yt()(t, e) : yt(t);
}
function $e(t, e) {
  const n = (a) => class extends a {
    constructor(...o) {
      super(...o), vt(this);
    }
  }, r = (a, o) => {
    if (typeof Reflect?.getOwnMetadataKeys == "function")
      for (const l of Reflect.getOwnMetadataKeys(a)) {
        const c = Reflect.getOwnMetadata(l, a);
        Reflect.defineMetadata(l, c, o);
      }
  };
  function s(a, o) {
    if (!W(o)) {
      const l = a, c = n(l);
      return Object.defineProperty(c, "__legacy_source__", { value: l, configurable: !0 }), r(l, c), c;
    }
    o.addInitializer(function() {
      vt(this);
    });
  }
  return t && !W(e) || t ? s(t, e) : s;
}
const Q = /* @__PURE__ */ Symbol("field-key"), it = /* @__PURE__ */ Symbol("validation-key"), st = /* @__PURE__ */ Symbol("submit-key"), nt = /* @__PURE__ */ Symbol("exclude-key"), de = /* @__PURE__ */ Symbol("prop-from-view-key");
class tt {
  isPrototypeObject(e) {
    const n = e?.constructor;
    return !!(n && n.prototype === e);
  }
  /**
   * Получить объект, по которому кешируются метаданные.
   * Для инстанса — это его prototype, для prototype — он сам.
   */
  getCacheTarget(e) {
    return !e || typeof e != "object" ? null : this.isPrototypeObject(e) ? e : Object.getPrototypeOf(e);
  }
  computeFromPrototype(e) {
    const n = [], r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
    let a = e;
    for (; a; ) {
      const l = Reflect.getOwnMetadata(this.metadataKey, a);
      if (Array.isArray(l))
        for (const c of l) {
          const u = c?.name, g = String(u);
          s.has(g) || (s.add(g), n.push(c), r.set(g, c));
        }
      a = Object.getPrototypeOf(a);
    }
    return { ownRef: Reflect.getOwnMetadata(this.metadataKey, e), list: n, map: r };
  }
  /**
   * Создать базовые метаданные.
   */
  constructor(e = {}) {
    this.metadataKey = null, this.isInit = !1, this.cache = /* @__PURE__ */ new WeakMap(), this.name = e?.name, this.callback = e?.callback;
  }
  /**
   * Проверить, что данные соответствуют экземпляру метаданных.
   */
  isInstance(e = {}) {
    return e instanceof tt || Object.getOwnPropertyNames(this).some((n) => Object.keys(e).includes(n));
  }
  /**
   * Получить метаданные конкретного поля модели.
   */
  fieldInstance(e, n) {
    const r = n && typeof n == "object" ? Reflect.getOwnMetadata(this.metadataKey, n) : void 0;
    if (Array.isArray(r))
      return r.find((l) => l.name === e);
    const s = this.getCacheTarget(n);
    if (!s)
      return;
    const a = Reflect.getOwnMetadata(this.metadataKey, s), o = this.cache.get(s);
    if (!o || o.ownRef !== a) {
      const l = this.computeFromPrototype(s);
      return this.cache.set(s, l), l.map.get(String(e));
    }
    return o.map.get(String(e));
  }
  /**
   * Получить массив метаданных полей модели.
   */
  fields(e) {
    const n = e && typeof e == "object" ? Reflect.getOwnMetadata(this.metadataKey, e) : void 0;
    if (Array.isArray(n)) {
      const l = [], c = /* @__PURE__ */ new Set();
      let u = e;
      for (; u; ) {
        const g = Reflect.getOwnMetadata(this.metadataKey, u);
        if (Array.isArray(g))
          for (const m of g) {
            const O = m?.name, b = String(O);
            c.has(b) || (c.add(b), l.push(m));
          }
        u = Object.getPrototypeOf(u);
      }
      return l;
    }
    const r = this.getCacheTarget(e);
    if (!r)
      return [];
    const s = Reflect.getOwnMetadata(this.metadataKey, r), a = this.cache.get(r);
    if (a && a.ownRef === s)
      return a.list;
    const o = this.computeFromPrototype(r);
    return this.cache.set(r, o), o.list;
  }
}
class pt extends tt {
  constructor() {
    super(...arguments), this.metadataKey = it;
  }
}
class Mt extends tt {
  constructor() {
    super(...arguments), this.metadataKey = st;
  }
}
class Ot extends tt {
  constructor() {
    super(...arguments), this.metadataKey = nt;
  }
}
class wt extends tt {
  /**
   * Создать метаданные поля модели.
   */
  constructor(e = {}) {
    super(e), this.factory = null, this.mapping = null, this.noObserve = null, this.collectChanges = !1, this.name = null, this.ctx = null, this.metadataKey = Q, this.isInit = !1, this.factory = e.factory, this.mapping = e.mapping, this.noObserve = e.noObserve, this.name = e.name, this.ctx = e.ctx, this.collectChanges = !!e.collectChanges;
  }
}
class Dt extends tt {
  /**
   * Создать метаданные для PropFromView.
   */
  constructor(e = {}) {
    super(e), this.metadataKey = de;
    for (const n in this)
      e && n in e && (this[n] = Reflect.get(e, n));
  }
}
function Qe(t) {
  const e = (s, a) => {
    const o = new Dt({ name: t, originName: String(a) });
    o.name = t, o.originName = String(a);
    const l = H(o.metadataKey, s, new Array());
    L(o.metadataKey, [...l, o], s);
  }, n = (s) => {
    s.addInitializer(function() {
      const a = new Dt(), o = a.fields(this);
      for (const l in this)
        o instanceof Array && s.name === l && (a.name = t, a.originName = l, a.value = this[l], o.push(a));
      L(a.metadataKey, o, this);
    });
  };
  function r(s, a) {
    if (q(s, a)) {
      e(s, a);
      return;
    }
    if (W(a))
      return n(a), a.kind === "field" ? (o) => o : a;
  }
  return t ? ((s, a) => r(s, a)) : ((s) => s);
}
const zt = /* @__PURE__ */ new WeakMap(), ue = (t, e) => {
  if (!t)
    return;
  let n = zt.get(t);
  n || (n = /* @__PURE__ */ new Set(), zt.set(t, n));
  const r = String(e.name);
  if (n.has(r))
    return;
  const s = H(e.metadataKey, t, new Array());
  s.some((a) => a.name === r) || L(e.metadataKey, [...s, e], t), n.add(r);
};
function Je(t) {
  const e = (s, a) => {
    const o = new Ot({ callback: t, name: String(a) }), l = H(o.metadataKey, s, new Array());
    L(o.metadataKey, [...l, o], s);
  }, n = (s) => {
    s.addInitializer(function() {
      const a = new Ot({ callback: t, name: String(s.name) });
      ue(Object.getPrototypeOf(this), a);
    });
  };
  function r(s, a) {
    if (q(s, a)) {
      e(s, a);
      return;
    }
    if (W(a))
      return n(a), a.kind === "field" ? void 0 : a;
  }
  if (t)
    return ((s, a) => r(s, a));
}
const he = () => {
  var t;
  return (t = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && t !== void 0 ? t : null;
}, fe = () => {
  var t;
  return (t = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && t !== void 0 ? t : 0;
}, ct = (t) => {
  var e, n;
  const r = globalThis;
  r.__MVVM_DEVTOOLS_APPLYING__ = ((e = r.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0) + 1;
  try {
    return t();
  } finally {
    r.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((n = r.__MVVM_DEVTOOLS_APPLYING__) !== null && n !== void 0 ? n : 1) - 1);
  }
}, _e = () => fe() > 0, Wt = (t) => ({
  data: t.service.dumpData,
  historyIndex: t.service.historyIndex
}), ye = (t, e = {}) => {
  const n = he();
  if (!n)
    return () => {
    };
  const r = n.connect({ name: e.name, instanceId: e.instanceId });
  let s = !1;
  try {
    r.init(Wt(t));
  } catch {
  }
  const a = Gt(() => Wt(t), (l) => {
    var c;
    if (!(s || _e()))
      try {
        r.send({ type: (c = e.actionType) !== null && c !== void 0 ? c : "model:update" }, l);
      } catch {
      }
  }), o = r.subscribe((l) => {
    var c;
    if (l.type !== "DISPATCH")
      return;
    const u = (c = l.payload) === null || c === void 0 ? void 0 : c.type;
    if (u === "RESET") {
      s = !0, ct(() => {
        try {
          t.service.toInit();
        } finally {
          s = !1;
        }
      });
      return;
    }
    if (u === "COMMIT") {
      s = !0, ct(() => {
        try {
          t.service.commit();
        } finally {
          s = !1;
        }
      });
      return;
    }
    if (u === "ROLLBACK") {
      s = !0, ct(() => {
        try {
          t.service.toInit();
        } finally {
          s = !1;
        }
      });
      return;
    }
    if (u === "JUMP_TO_ACTION" || u === "JUMP_TO_STATE") {
      if (!l.state)
        return;
      try {
        const g = JSON.parse(l.state), m = g.historyIndex, O = t.service.history, b = Array.isArray(O) && O.length > 0, I = typeof m == "number" && (m === -1 && b || m >= 0 && b && m < O.length);
        s = !0, ct(() => {
          var R;
          try {
            if (I) {
              t.service.goToHistory(m);
              return;
            }
            const A = (R = g.data) !== null && R !== void 0 ? R : g;
            B(() => {
              t.service.loadData(A);
            });
          } finally {
            s = !1;
          }
        });
      } catch {
      }
    }
  });
  return () => {
    a(), typeof o == "function" && o(), typeof r.unsubscribe == "function" && r.unsubscribe(), typeof r.disconnect == "function" && r.disconnect();
  };
};
ee();
const ge = new Mt(), me = new wt(), ve = new pt(), be = new Ot();
let pe = (() => {
  var t, e, n, r, s, a, o, l, c, u, g, m, O, b, I, R, A, K, Y, P, k, d, D;
  let M = [], V, E = [], F = [], z, U, $, et, at, rt, lt, It, At, Et, Rt, Tt;
  return t = class {
    // @define_prop
    get [(e = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap(), g = /* @__PURE__ */ new WeakMap(), m = /* @__PURE__ */ new WeakMap(), O = /* @__PURE__ */ new WeakMap(), b = /* @__PURE__ */ new WeakMap(), I = /* @__PURE__ */ new WeakMap(), R = /* @__PURE__ */ new WeakMap(), A = /* @__PURE__ */ new WeakMap(), K = xt)]() {
      return T(this, e, "f");
    }
    set [K](i) {
      j(this, e, i, "f");
    }
    get initData() {
      return T(this, n, "f");
    }
    set initData(i) {
      j(this, n, i, "f");
    }
    // @define_prop
    get committedData() {
      return T(this, r, "f");
    }
    set committedData(i) {
      j(this, r, i, "f");
    }
    // @define_prop
    get modified_() {
      return T(this, s, "f");
    }
    set modified_(i) {
      j(this, s, i, "f");
    }
    // @define_prop
    get draft() {
      return T(this, a, "f");
    }
    set draft(i) {
      j(this, a, i, "f");
    }
    // @define_prop
    get changes() {
      return T(this, o, "f");
    }
    set changes(i) {
      j(this, o, i, "f");
    }
    // @define_prop
    get inverseChanges() {
      return T(this, l, "f");
    }
    set inverseChanges(i) {
      j(this, l, i, "f");
    }
    // @define_prop
    get history() {
      return T(this, c, "f");
    }
    set history(i) {
      j(this, c, i, "f");
    }
    // @define_prop
    get historyIndex() {
      return T(this, u, "f");
    }
    set historyIndex(i) {
      j(this, u, i, "f");
    }
    // @define_prop
    get legacyInitDone() {
      return T(this, g, "f");
    }
    set legacyInitDone(i) {
      j(this, g, i, "f");
    }
    // @define_prop
    get options() {
      return T(this, m, "f");
    }
    set options(i) {
      j(this, m, i, "f");
    }
    // @define_prop
    get historyMuted() {
      return T(this, O, "f");
    }
    set historyMuted(i) {
      j(this, O, i, "f");
    }
    get [Y = (V = [ot], Q)]() {
      return T(this, b, "f");
    }
    set [Y](i) {
      j(this, b, i, "f");
    }
    get [P = st]() {
      return T(this, I, "f");
    }
    set [P](i) {
      j(this, I, i, "f");
    }
    get [k = nt]() {
      return T(this, R, "f");
    }
    set [k](i) {
      j(this, R, i, "f");
    }
    get [d = it]() {
      return T(this, A, "f");
    }
    set [d](i) {
      j(this, A, i, "f");
    }
    /**
     * Создает модель и инициализирует данные.
     */
    constructor(i = {}, h) {
      e.set(this, (G(this, M), !0)), n.set(this, G(this, E, null)), r.set(this, (G(this, F), {})), s.set(this, {}), a.set(this, null), o.set(this, []), l.set(this, []), c.set(this, []), u.set(this, -1), g.set(this, !1), m.set(this, {}), O.set(this, !1), b.set(this, void 0), I.set(this, void 0), R.set(this, void 0), A.set(this, void 0), this.options = h, this[xt] = !0, this.init(i), this.initLegacyFields(), this.autoAttachDevtools();
    }
    getFieldMetaCache() {
      const i = Reflect.getOwnMetadata(Q, this), h = Object.getPrototypeOf(this), f = h ? Reflect.getOwnMetadata(Q, h) : null, _ = this[Q];
      if (_ && _ !== !0 && _.ownRef === i && _.protoRef === f)
        return _;
      const w = me.fields(this), v = /* @__PURE__ */ new Map();
      for (const y of w)
        v.set(String(y.name), y);
      return this[Q] = { ownRef: i, protoRef: f, list: w, map: v }, this[Q];
    }
    getFieldMeta(i) {
      return this.getFieldMetaCache().map.get(String(i));
    }
    getSubmitMetaCache() {
      const i = Reflect.getOwnMetadata(st, this), h = Object.getPrototypeOf(this), f = h ? Reflect.getOwnMetadata(st, h) : null, _ = this[st];
      if (_ && _ !== !0 && _.ownRef === i && _.protoRef === f)
        return _;
      const w = ge.fields(this), v = /* @__PURE__ */ new Map();
      for (const p of w)
        v.set(String(p.name), p);
      const y = { ownRef: i, protoRef: f, list: w, map: v };
      return this[st] = y, y;
    }
    getExcludeMetaCache() {
      const i = Reflect.getOwnMetadata(nt, this), h = Object.getPrototypeOf(this), f = h ? Reflect.getOwnMetadata(nt, h) : null, _ = this[nt];
      if (_ && _ !== !0 && _.ownRef === i && _.protoRef === f)
        return _;
      const w = be.fields(this), v = /* @__PURE__ */ new Map();
      for (const p of w)
        v.set(String(p.name), p);
      const y = { ownRef: i, protoRef: f, list: w, map: v };
      return this[nt] = y, y;
    }
    getValidationMetaCache() {
      const i = Reflect.getOwnMetadata(it, this), h = Object.getPrototypeOf(this), f = h ? Reflect.getOwnMetadata(it, h) : null, _ = this[it];
      if (_ && _ !== !0 && _.ownRef === i && _.protoRef === f)
        return _;
      const w = ve.fields(this), v = /* @__PURE__ */ new Map();
      for (const p of w)
        v.set(String(p.name), p);
      const y = { ownRef: i, protoRef: f, list: w, map: v };
      return this[it] = y, y;
    }
    /**
     * Сбросить внутренние стейты изменений.
     */
    // @action private resetToDefault() {
    //   this.modified_ = {};
    //   this.committedData = {};
    //   this.changes = [];
    //   this.inverseChanges = [];
    //   this.history = [];
    //   this.historyIndex = -1;
    // }
    /**
     * Инициализировать валидацию для поля или всех полей.
     */
    initValidation(i) {
      const h = this.validation;
      if (i)
        Reflect.get(h, i);
      else
        for (let f in h)
          h[f];
    }
    /**
     * Полная инициализация модели и полей.
     */
    init(i = {}) {
      this.cloneForInit(i), this.createDraft(i), this.defineData(this.initData);
    }
    /**
     * Инициализировать отдельное поле модели.
     */
    initField(i, h) {
      const f = this.getFieldMeta(i);
      if (f) {
        const _ = String(f.name);
        Object.prototype.hasOwnProperty.call(this.initData, _) || Reflect.set(this.initData, _, Reflect.get(this, _));
        let v = f?.factory ? f.factory(this.initData, this) : Reflect.get(this.initData, _);
        if (v === void 0 && !f?.factory) {
          const y = Reflect.get(this, _);
          y !== void 0 && (v = y, Reflect.set(this.initData, _, y));
        }
        this.defineFieldValue(i, v, f), h?.skipValidation || this.initValidation(i);
      }
    }
    initLegacyFields() {
      if (this.legacyInitDone)
        return;
      const i = this.getFieldMetaCache().list;
      if (i.some((h) => Object.prototype.hasOwnProperty.call(this, h.name))) {
        this.legacyInitDone = !0;
        for (let h of i) {
          const f = String(h.name);
          this.initData && f in this.initData || this.initField(f, { skipValidation: !0 });
        }
      }
    }
    /**
     * Создать draft для отслеживания изменений.
     */
    createDraft(i) {
      this.draft = ie(i);
    }
    autoAttachDevtools() {
      var i, h, f, _, w, v, y, p, N, ut, ht;
      const ft = globalThis;
      if (!ft.__MVVM_DEVTOOLS_AUTO__ || ((h = (i = this.options) === null || i === void 0 ? void 0 : i.devtools) === null || h === void 0 ? void 0 : h.enabled) === !1)
        return;
      const jt = (y = (w = (_ = (f = this.options) === null || f === void 0 ? void 0 : f.devtools) === null || _ === void 0 ? void 0 : _.name) !== null && w !== void 0 ? w : (v = this.constructor) === null || v === void 0 ? void 0 : v.name) !== null && y !== void 0 ? y : "Model", Pt = ((p = ft.__MVVM_DEVTOOLS_SEQ__) !== null && p !== void 0 ? p : 0) + 1;
      ft.__MVVM_DEVTOOLS_SEQ__ = Pt, ye(this, { name: jt, instanceId: (ht = (ut = (N = this.options) === null || N === void 0 ? void 0 : N.devtools) === null || ut === void 0 ? void 0 : ut.instanceId) !== null && ht !== void 0 ? ht : `${jt}#${Pt}` });
    }
    withHistoryMuted(i) {
      this.historyMuted = !0;
      try {
        i();
      } finally {
        this.historyMuted = !1;
      }
    }
    // @define_prop
    // private readonly serviceToJSON = () => this.dumpData;
    syncChangesFromHistory() {
      const i = this.historyIndex >= 0 ? this.history.slice(0, this.historyIndex + 1) : [];
      this.changes = i.flatMap((h) => h.patches), this.inverseChanges = i.flatMap((h) => h.inversePatches);
    }
    applyHistoryPatches(i) {
      if (!i.length)
        return;
      Lt(this.draft, i);
      const h = new Set(i.map((f) => f.field).filter(Boolean));
      h.size !== 0 && this.withHistoryMuted(() => {
        var f;
        for (let _ of h) {
          const w = (f = Reflect.get(this.draft, _)) !== null && f !== void 0 ? f : Reflect.get(this.initData, _);
          Reflect.set(this, _, w), this.defineFieldValue(_, Reflect.get(this, _));
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
    produceDraft(i, h, f) {
      if (this.historyMuted)
        return;
      let _, w = [];
      i && (_ = i.split(".")[0], _ && !this.getFieldMeta(_).collectChanges) || (se(this.draft, (v) => {
        if (i) {
          let y = v;
          const p = i.split(".");
          if (p.length > 1)
            for (let N = 0; N < p.length && !(N != p.length - 1 && !Vt(y)); N++)
              Vt(y) && (y = y[p[N]]);
          else
            f = i;
          y && (y[f] = h);
        }
      }, (v, y) => {
        _ && (v = v.map((p) => Object.assign(Object.assign({}, p), { field: _ })), y = y.map((p) => Object.assign(Object.assign({}, p), { field: _ }))), w = v, !(!v.length && !y.length) && (this.historyIndex < this.history.length - 1 && (this.history = this.history.slice(0, this.historyIndex + 1), this.syncChangesFromHistory()), this.changes.push(...v), this.inverseChanges.push(...y), this.history.push({ patches: v, inversePatches: y }), this.historyIndex = this.history.length - 1);
      }), w.length && Lt(this.draft, w));
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
    createObservable(i, h, f, _ = f) {
      return i = Ft(i) ? i : ot.box(i), new Proxy(i, {
        get: (w, v, y) => {
          const p = Reflect.get(w, v, y);
          return p && typeof p == "object" && !(p instanceof t) && !Ft(i) ? this.createObservable(p, String(v), h, `${_}.${String(v)}`) : p;
        },
        set: (w, v, y, p) => (i = y, this.produceDraft(_, i, String(v)), this.checkChange(f, Reflect.get(this, f)), Reflect.set(w, v, y, p))
      });
    }
    /**
     * Определить getter/setter для поля модели.
     */
    defineFieldValue(i, h, f) {
      const _ = f ?? this.getFieldMeta(i);
      return _.noObserve ? Reflect.defineProperty(this, _.name, { value: h }) : (h = ot.box(h), Reflect.defineProperty(this, _.name, {
        get: () => h.get(),
        set: (w) => {
          B(() => h.set(w)), this.produceDraft(_.name, h.get()), this.checkChange(_.name, h.get());
        },
        enumerable: !0,
        configurable: !0
      })), h;
    }
    /**
     * Сохранить исходные данные с глубоким клонированием.
     */
    cloneForInit(i = {}) {
      this.initData = i;
    }
    /**
     * Проверить изменение поля и обновить modified_.
     */
    checkChange(i, h) {
      const f = Reflect.get(this.committedData, i) || Reflect.get(this.initData, i), _ = i && i in this.initData && !Ct(f, h);
      return B(() => {
        if (_) {
          Reflect.set(this.modified_, i, f);
          return;
        }
        i in this.modified_ && Ct(f, h) && delete this.modified_[i];
      }), _;
    }
    /**
     * Применить данные к полям модели.
     */
    defineData(i) {
      const h = this.getFieldMetaCache().map;
      for (let f in this)
        Object.prototype.hasOwnProperty.call(this, f) && h.has(f) && (Reflect.set(this, f, Reflect.get(i, f)), this.initField(f));
    }
    /**
     * Признак наличия изменений.
     */
    get dirty() {
      return !Jt(this.modified_);
    }
    /**
     * Зафиксировать все изменения.
     */
    commit() {
      for (let i of this.getFieldMetaCache().list)
        this.commitField(i.name);
      this.modified_ = {};
    }
    /**
     * Зафиксировать изменения конкретного поля.
     */
    commitField(i) {
      for (let h in this)
        h in this.modified_ && Reflect.set(this.committedData, h, this[h]);
      delete this.modified_[i], this.modified_ = Object.assign({}, this.modified_);
    }
    /**
     * Откатить изменения к последнему коммиту.
     */
    reject() {
      for (let i in this)
        i in this.modified_ && (this[i] = Reflect.get(this.modified_, i), this.commitField(i), this.defineFieldValue(i, this[i]));
      this.commit();
    }
    /**
     * Вернуть модель к исходным данным.
     */
    toInit() {
      return this.withHistoryMuted(() => {
        this.init(this.initData);
      }), this;
    }
    /**
     * Откатить изменения на один шаг истории.
     */
    undo() {
      this.historyIndex < 0 || (this.applyHistoryPatches(this.history[this.historyIndex].inversePatches), this.historyIndex -= 1, this.syncChangesFromHistory());
    }
    /**
     * Повторить ранее откатанные изменения.
     */
    redo() {
      this.historyIndex >= this.history.length - 1 || (this.historyIndex = this.historyIndex + 1, this.applyHistoryPatches(this.history[this.historyIndex].patches), this.syncChangesFromHistory());
    }
    /**
     * Перейти к конкретному шагу истории.
     */
    goToHistory(i) {
      if (!(i < -1 || i >= this.history.length) && i !== this.historyIndex) {
        for (; this.historyIndex < i; )
          this.historyIndex = this.historyIndex + 1, this.applyHistoryPatches(this.history[this.historyIndex].patches);
        for (; this.historyIndex > i; )
          this.applyHistoryPatches(this.history[this.historyIndex].inversePatches), this.historyIndex -= 1;
        this.syncChangesFromHistory();
      }
    }
    /**
     * Перезагрузить данные модели.
     */
    loadData(i) {
      return this.withHistoryMuted(() => {
        this.init(i);
      }), this;
    }
    /**
     * Получить сериализованный дамп данных.
     */
    get dumpData() {
      this.initLegacyFields();
      const i = /* @__PURE__ */ Object.create({}), h = this.getSubmitMetaCache().map, f = this.getExcludeMetaCache().map, _ = (v) => {
        const y = Reflect.get(this, v), p = h.get(v), N = p?.callback;
        return typeof N == "function" ? N(y, this) : y;
      }, w = (v) => {
        const y = f.get(v);
        if (y)
          switch (typeof y.callback) {
            case "boolean":
              return !!y.callback;
            case "function":
              return y.callback(Reflect.get(this, v), this);
          }
        return !1;
      };
      return this.getFieldMetaCache().list.forEach((v) => {
        var y;
        if (v.name in this)
          return !((y = this.options) === null || y === void 0) && y.byFields && !this.options.byFields.includes(v.name) || w(v.name) ? void 0 : Reflect.set(i, v.name, _(v.name));
      }), i;
    }
    /**
     * Получить объект результатов валидации.
     */
    get validation() {
      this.initLegacyFields();
      const i = {};
      for (const h of this.getValidationMetaCache().list) {
        const f = String(h.name);
        Reflect.set(i, f, h.callback(Reflect.get(this, f), this) || "");
      }
      return i;
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
    get serviceApi() {
      return {
        loadData: (i) => this.loadData(i),
        reject: () => this.reject(),
        commit: () => this.commit(),
        commitField: (i) => this.commitField(i),
        toInit: () => this.toInit(),
        undo: () => this.undo(),
        redo: () => this.redo(),
        goToHistory: (i) => this.goToHistory(i)
      };
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
  }, (() => {
    const C = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    z = [x], U = [X], $ = [x], et = [x], at = [x], rt = [x], lt = [x], It = [x], At = [x], Et = [X], Rt = [X], Tt = [(D = X).struct.bind(D)], S(t, null, V, { kind: "accessor", name: "initData", static: !1, private: !1, access: { has: (i) => "initData" in i, get: (i) => i.initData, set: (i, h) => {
      i.initData = h;
    } }, metadata: C }, E, F), S(t, null, z, { kind: "method", name: "produceDraft", static: !1, private: !1, access: { has: (i) => "produceDraft" in i, get: (i) => i.produceDraft }, metadata: C }, null, M), S(t, null, U, { kind: "getter", name: "dirty", static: !1, private: !1, access: { has: (i) => "dirty" in i, get: (i) => i.dirty }, metadata: C }, null, M), S(t, null, $, { kind: "method", name: "commit", static: !1, private: !1, access: { has: (i) => "commit" in i, get: (i) => i.commit }, metadata: C }, null, M), S(t, null, et, { kind: "method", name: "commitField", static: !1, private: !1, access: { has: (i) => "commitField" in i, get: (i) => i.commitField }, metadata: C }, null, M), S(t, null, at, { kind: "method", name: "reject", static: !1, private: !1, access: { has: (i) => "reject" in i, get: (i) => i.reject }, metadata: C }, null, M), S(t, null, rt, { kind: "method", name: "toInit", static: !1, private: !1, access: { has: (i) => "toInit" in i, get: (i) => i.toInit }, metadata: C }, null, M), S(t, null, lt, { kind: "method", name: "undo", static: !1, private: !1, access: { has: (i) => "undo" in i, get: (i) => i.undo }, metadata: C }, null, M), S(t, null, It, { kind: "method", name: "redo", static: !1, private: !1, access: { has: (i) => "redo" in i, get: (i) => i.redo }, metadata: C }, null, M), S(t, null, At, { kind: "method", name: "goToHistory", static: !1, private: !1, access: { has: (i) => "goToHistory" in i, get: (i) => i.goToHistory }, metadata: C }, null, M), S(t, null, Et, { kind: "getter", name: "validation", static: !1, private: !1, access: { has: (i) => "validation" in i, get: (i) => i.validation }, metadata: C }, null, M), S(t, null, Rt, { kind: "getter", name: "validAndDirty", static: !1, private: !1, access: { has: (i) => "validAndDirty" in i, get: (i) => i.validAndDirty }, metadata: C }, null, M), S(t, null, Tt, { kind: "getter", name: "service", static: !1, private: !1, access: { has: (i) => "service" in i, get: (i) => i.service }, metadata: C }, null, M), C && Object.defineProperty(t, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: C });
  })(), t;
})();
const Me = () => {
  var t;
  const e = globalThis;
  return !!((t = e.__MVVM_DEVTOOLS_HISTORY__) !== null && t !== void 0 ? t : e.__MVVM_DEVTOOLS_AUTO__);
}, Oe = (t) => Me() ? !t || typeof t != "object" ? { collectChanges: !0 } : "collectChanges" in t ? t : Object.assign(Object.assign({}, t), { collectChanges: !0 }) : t, Nt = /* @__PURE__ */ new WeakMap(), we = (t, e) => {
  if (!t)
    return;
  let n = Nt.get(t);
  n || (n = /* @__PURE__ */ new Set(), Nt.set(t, n));
  const r = String(e.name);
  if (n.has(r))
    return;
  const s = H(e.metadataKey, t, new Array());
  s.some((a) => a.name === r) || L(e.metadataKey, [...s, e], t), n.add(r);
}, St = function(e, n) {
  const r = Oe(q(e, n) ? void 0 : e), s = (l, c) => {
    const u = new wt(Object.assign(Object.assign({}, r), { name: String(c), ctx: null }));
    L(u.metadataKey, [...H(u.metadataKey, l, new Array()), u], l), Object.getOwnPropertyDescriptor(l, c) || Object.defineProperty(l, c, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, c))
          return Reflect.get(this, c);
        if (this.initData && c in this.initData && typeof this.initField == "function")
          return this.initField.call(this, String(c), { skipValidation: !0 }), Reflect.get(this, c);
      },
      set(m) {
        if (this.initData && !(c in this.initData) && Reflect.set(this.initData, c, m), typeof this.initField == "function") {
          this.initField.call(this, String(c), { skipValidation: !0 });
          return;
        }
        Object.defineProperty(this, c, {
          value: m,
          writable: !0,
          configurable: !0,
          enumerable: !0
        });
      }
    });
  }, a = (l) => {
    l.addInitializer(function() {
      if (this instanceof pe && typeof this.initField == "function") {
        const c = new wt(Object.assign(Object.assign({}, r), { name: String(l.name), ctx: l }));
        we(Object.getPrototypeOf(this), c), this.initField.call(this, String(l.name));
      }
    });
  };
  function o(l, c) {
    if (q(l, c)) {
      s(l, c);
      return;
    }
    if (W(c))
      return a(c), c.kind === "field" ? (u) => u : c;
  }
  return q(e, n) ? o(e, n) : r && !W(n) ? (l, c) => o(l, c) : W(n) ? o(void 0, n) : (l, c) => o(l, c);
}, De = (t) => !t || typeof t != "object" ? { noObserve: !0 } : Object.assign(Object.assign({}, t), { noObserve: !0 }), Se = function(e, n) {
  return q(e, n) || W(n) ? St({ noObserve: !0 })(e, n) : St(De(e));
};
St.noObserve = Se;
const qt = /* @__PURE__ */ new WeakMap(), ke = (t, e) => {
  if (!t)
    return;
  let n = qt.get(t);
  n || (n = /* @__PURE__ */ new Set(), qt.set(t, n));
  const r = String(e.name);
  if (n.has(r))
    return;
  const s = H(e.metadataKey, t, new Array());
  s.some((a) => a.name === r) || L(e.metadataKey, [...s, e], t), n.add(r);
};
function Ze(t) {
  const e = (s, a) => {
    const o = new Mt({ callback: t, name: String(a) }), l = H(o.metadataKey, s, new Array());
    L(o.metadataKey, [...l, o], s);
  }, n = (s) => {
    const a = new Mt({ callback: t, name: String(s.name) });
    s.addInitializer(function() {
      ke(Object.getPrototypeOf(this), a);
    });
  };
  function r(s, a) {
    if (q(s, a)) {
      e(s, a);
      return;
    }
    if (W(a))
      return n(a), a.kind === "field" ? (o) => o : a;
  }
  return t ? ((s, a) => r(s, a)) : ((s) => s);
}
const Yt = /* @__PURE__ */ new WeakMap(), Ie = (t, e) => {
  if (!t)
    return;
  let n = Yt.get(t);
  n || (n = /* @__PURE__ */ new Set(), Yt.set(t, n));
  const r = String(e.name);
  if (n.has(r))
    return;
  const s = H(e.metadataKey, t, new Array());
  s.some((a) => a.name === r) || L(e.metadataKey, [...s, e], t), n.add(r);
};
function ti(t) {
  const e = (s, a) => {
    const o = new pt({ callback: t, name: String(a) }), l = H(o.metadataKey, s, new Array());
    L(o.metadataKey, [...l, o], s);
  }, n = (s) => {
    const a = new pt({ callback: t, name: String(s.name) });
    s.addInitializer(function() {
      Ie(Object.getPrototypeOf(this), a);
    });
  };
  function r(s, a) {
    if (q(s, a)) {
      e(s, a);
      return;
    }
    if (W(a))
      return n(a), a.kind === "field" ? (o) => o : a;
  }
  return t ? ((s, a) => r(s, a)) : ((s) => s);
}
const $t = /* @__PURE__ */ Symbol("store-key"), Ae = () => {
  var t;
  return (t = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && t !== void 0 ? t : null;
}, Ee = () => {
  var t;
  return (t = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && t !== void 0 ? t : 0;
}, Re = (t) => {
  var e, n;
  const r = globalThis;
  r.__MVVM_DEVTOOLS_APPLYING__ = ((e = r.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0) + 1;
  try {
    return t();
  } finally {
    r.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((n = r.__MVVM_DEVTOOLS_APPLYING__) !== null && n !== void 0 ? n : 1) - 1);
  }
}, Te = () => Ee() > 0, kt = (t) => ({
  items: t.items.map((e) => {
    var n, r;
    return {
      name: (r = (n = e.constructor) === null || n === void 0 ? void 0 : n.name) !== null && r !== void 0 ? r : "Model",
      data: e.service.dumpData,
      historyIndex: e.service.historyIndex
    };
  })
}), je = (t) => !!(t && typeof t == "object" && Array.isArray(t.items)), Pe = (t) => {
  if (!t)
    return null;
  try {
    const e = JSON.parse(t);
    return je(e) ? e : null;
  } catch {
    return null;
  }
}, Ve = (t, e = {}) => {
  var n, r;
  const s = Ae();
  if (!s)
    return () => {
    };
  const a = s.connect({ name: e.name, instanceId: e.instanceId });
  let o = !1, l = (r = (n = t.items[0]) === null || n === void 0 ? void 0 : n.constructor) !== null && r !== void 0 ? r : null;
  try {
    a.init(kt(t));
  } catch {
  }
  const c = Gt(() => kt(t), (m) => {
    var O;
    if (o || Te())
      return;
    const b = (O = t.items[0]) === null || O === void 0 ? void 0 : O.constructor;
    b && (l = b);
    try {
      a.send({ type: "store:update" }, m);
    } catch {
    }
  }), u = (m) => (o = !0, Re(() => {
    try {
      return m();
    } finally {
      o = !1;
    }
  })), g = a.subscribe((m) => {
    var O;
    if (m.type !== "DISPATCH")
      return;
    const b = (O = m.payload) === null || O === void 0 ? void 0 : O.type;
    if (b === "RESET" || b === "ROLLBACK") {
      u(() => t.reset());
      return;
    }
    if (b === "JUMP_TO_ACTION" || b === "JUMP_TO_STATE") {
      const I = Pe(m.state);
      if (!I)
        return;
      u(() => {
        var R, A, K;
        if (I.items.length === t.items.length && t.items.every((D) => {
          var M, V;
          return typeof ((M = D?.service) === null || M === void 0 ? void 0 : M.goToHistory) == "function" || typeof ((V = D?.service) === null || V === void 0 ? void 0 : V.loadData) == "function";
        })) {
          B(() => {
            I.items.forEach((D, M) => {
              var V;
              const E = (V = t.items[M]) === null || V === void 0 ? void 0 : V.service, F = D.historyIndex, z = E?.history;
              if (Array.isArray(z) && z.length > 0 && typeof F == "number" && typeof E?.goToHistory == "function" && (F === -1 && z.length > 0 || F < z.length)) {
                E.goToHistory(F);
                return;
              }
              typeof E?.loadData == "function" && E.loadData(D.data);
            });
          });
          return;
        }
        const P = (A = (R = t.items[0]) === null || R === void 0 ? void 0 : R.constructor) !== null && A !== void 0 ? A : l, k = I.items.map((D) => D.data);
        if (P) {
          t.applyLoaded(k, { model: P, cash: !1 }), l = P;
          return;
        }
        t.applyLoaded(k, { cash: !1 });
        const d = (K = t.items[0]) === null || K === void 0 ? void 0 : K.constructor;
        d && (l = d);
      });
    }
  });
  return () => {
    c(), typeof g == "function" && g(), typeof a.unsubscribe == "function" && a.unsubscribe(), typeof a.disconnect == "function" && a.disconnect();
  };
};
let ei = (() => {
  var t, e, n;
  let r = [], s, a = [], o = [], l, c = [], u = [], g, m, O, b, I, R, A, K, Y, P;
  return t = class {
    get items() {
      return T(this, e, "f");
    }
    set items(d) {
      j(this, e, d, "f");
    }
    get _cash() {
      return T(this, n, "f");
    }
    set _cash(d) {
      j(this, n, d, "f");
    }
    constructor() {
      e.set(this, (G(this, r), G(this, a, []))), n.set(this, (G(this, o), G(this, c, []))), G(this, u), vt(this), this.autoAttachDevtools();
    }
    add(d) {
      this.items.push(d);
    }
    addMany(d) {
      d?.length && (this.items = this.items.concat(d));
    }
    remove(d) {
      this.items = this.items.filter((D) => D !== d);
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
    findBy(d, D) {
      return this.items.find((M) => M?.[d] === D);
    }
    clear() {
      this.items = [];
    }
    get size() {
      return this.items.length;
    }
    get snapshot() {
      return kt(this);
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
    applyLoaded(d, D = {}) {
      const { model: M, mode: V = "replace", cash: E = !0 } = D;
      if (E && this.setCash(d), V === "append") {
        const F = M ? d.map((z) => new M(z)) : d;
        this.addMany(F);
        return;
      }
      this.items = M ? d.map((F) => new M(F)) : d;
    }
    /**
     * Сохранить оригинальные данные стора.
     */
    setCash(d) {
      this._cash = d ?? [];
    }
    autoAttachDevtools() {
      var d, D, M, V, E, F, z, U;
      const $ = globalThis;
      if (!$.__MVVM_DEVTOOLS_AUTO__)
        return;
      const et = H($t, this.constructor, {}) || {};
      if (((d = et.devtools) === null || d === void 0 ? void 0 : d.enabled) === !1)
        return;
      const at = (E = (M = (D = et.devtools) === null || D === void 0 ? void 0 : D.name) !== null && M !== void 0 ? M : (V = this.constructor) === null || V === void 0 ? void 0 : V.name) !== null && E !== void 0 ? E : "Store", rt = ((F = $.__MVVM_DEVTOOLS_STORE_SEQ__) !== null && F !== void 0 ? F : 0) + 1;
      $.__MVVM_DEVTOOLS_STORE_SEQ__ = rt;
      const lt = (U = (z = et.devtools) === null || z === void 0 ? void 0 : z.instanceId) !== null && U !== void 0 ? U : `${at}#${rt}`;
      Ve(this, { name: at, instanceId: lt });
    }
  }, e = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), (() => {
    const k = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    s = [ot], l = [ot], g = [x], m = [x], O = [x], b = [x], I = [X], R = [X], A = [X], K = [x], Y = [x], P = [x], S(t, null, s, { kind: "accessor", name: "items", static: !1, private: !1, access: { has: (d) => "items" in d, get: (d) => d.items, set: (d, D) => {
      d.items = D;
    } }, metadata: k }, a, o), S(t, null, l, { kind: "accessor", name: "_cash", static: !1, private: !1, access: { has: (d) => "_cash" in d, get: (d) => d._cash, set: (d, D) => {
      d._cash = D;
    } }, metadata: k }, c, u), S(t, null, g, { kind: "method", name: "add", static: !1, private: !1, access: { has: (d) => "add" in d, get: (d) => d.add }, metadata: k }, null, r), S(t, null, m, { kind: "method", name: "addMany", static: !1, private: !1, access: { has: (d) => "addMany" in d, get: (d) => d.addMany }, metadata: k }, null, r), S(t, null, O, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (d) => "remove" in d, get: (d) => d.remove }, metadata: k }, null, r), S(t, null, b, { kind: "method", name: "clear", static: !1, private: !1, access: { has: (d) => "clear" in d, get: (d) => d.clear }, metadata: k }, null, r), S(t, null, I, { kind: "getter", name: "size", static: !1, private: !1, access: { has: (d) => "size" in d, get: (d) => d.size }, metadata: k }, null, r), S(t, null, R, { kind: "getter", name: "snapshot", static: !1, private: !1, access: { has: (d) => "snapshot" in d, get: (d) => d.snapshot }, metadata: k }, null, r), S(t, null, A, { kind: "getter", name: "cash", static: !1, private: !1, access: { has: (d) => "cash" in d, get: (d) => d.cash }, metadata: k }, null, r), S(t, null, K, { kind: "method", name: "reset", static: !1, private: !1, access: { has: (d) => "reset" in d, get: (d) => d.reset }, metadata: k }, null, r), S(t, null, Y, { kind: "method", name: "applyLoaded", static: !1, private: !1, access: { has: (d) => "applyLoaded" in d, get: (d) => d.applyLoaded }, metadata: k }, null, r), S(t, null, P, { kind: "method", name: "setCash", static: !1, private: !1, access: { has: (d) => "setCash" in d, get: (d) => d.setCash }, metadata: k }, null, r), k && Object.defineProperty(t, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: k });
  })(), t;
})();
function si(t) {
  return Z(t, "instance");
}
function ni(t) {
  return ((e, n) => ce(t)(e, n));
}
function ai(t, e) {
  const n = (r, s) => {
    var a;
    const o = typeof t == "string" ? { id: t } : typeof t == "object" ? t : { id: (a = s?.name) !== null && a !== void 0 ? a : r?.name };
    L($t, o, r), Ut(o)(r, s);
  };
  return typeof t == "function" ? n(t, e) : (r, s) => n(r, s);
}
class ri {
}
const gt = new Dt();
function oi(t, e) {
  return ne((n = {}) => {
    const { resolved: r, instance: s } = ae(() => {
      const o = Z(t) || (typeof t != "string" ? { instance: new t() } : void 0), l = o?.instance;
      return { resolved: o, instance: l };
    }, [t]);
    if (re(() => {
      if (s)
        return typeof s.onInit == "function" && s.onInit(), () => {
          typeof s.onDispose == "function" && s.onDispose();
        };
    }, [s]), r) {
      const a = gt.fields(s), o = a.length > 0 ? a : gt.fields(Object.getPrototypeOf(s));
      for (const l in n)
        if (o instanceof Array) {
          const c = o.find((u) => u.name === l);
          c && Reflect.set(s, c.originName, Reflect.get(n, l));
        }
      return L(gt.metadataKey, o, s), e(Object.assign({ viewModel: s }, n));
    }
    return e(Object.assign({}, n));
  });
}
const Bt = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, Ce = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, dt = () => {
};
class Fe {
  constructor(e, n) {
    var r, s, a, o, l, c, u;
    this.isExecuting = !1, this.activeCount = 0, this.isCanceled = !1, this.isDisposed = !1, this.error = null, this.controllers = /* @__PURE__ */ new Set(), this.queue = [], this.runningPromise = null, this.queueTail = Promise.resolve(), this.cancelToken = 0, this.fn = e, this.opt = Object.assign({ concurrency: (r = n?.concurrency) !== null && r !== void 0 ? r : "ignore", trackError: (s = n?.trackError) !== null && s !== void 0 ? s : !0, resetErrorOnExecute: (a = n?.resetErrorOnExecute) !== null && a !== void 0 ? a : !0, swallowError: (o = n?.swallowError) !== null && o !== void 0 ? o : !0, abortable: (l = n?.abortable) !== null && l !== void 0 ? l : !1 }, n), this.states = Object.assign(Object.assign({}, Bt), (c = n?.states) !== null && c !== void 0 ? c : {}), this.stateKeys = Object.assign(Object.assign({}, Ce), (u = n?.stateKeys) !== null && u !== void 0 ? u : {}), te(this, {
      fn: !1,
      opt: !1,
      states: !1,
      stateKeys: !1,
      resolveState: !1,
      getScope: !1,
      controllers: !1,
      queue: !1,
      runningPromise: !1,
      queueTail: !1,
      cancelToken: !1
    }, { autoBind: !0 });
  }
  get canExecute() {
    return this.isDisposed || !(this.opt.canExecute ? this.opt.canExecute(this.getScope()) : !0) ? !1 : this.opt.concurrency === "ignore" ? !this.isExecuting : !0;
  }
  resolveState(e) {
    var n, r;
    const s = (n = this.stateKeys[e]) !== null && n !== void 0 ? n : e;
    return (r = this.states[s]) !== null && r !== void 0 ? r : Bt[e];
  }
  getScope() {
    return {
      state: this.state,
      states: this.states,
      isExecuting: this.isExecuting,
      activeCount: this.activeCount,
      isCanceled: this.isCanceled,
      isDisposed: this.isDisposed,
      error: this.error
    };
  }
  get state() {
    return this.isDisposed ? this.resolveState("disposed") : this.isExecuting ? this.resolveState("load") : this.error ? this.resolveState("failure") : this.isCanceled ? this.resolveState("canceled") : this.resolveState("ready");
  }
  resetError() {
    this.error = null;
  }
  cancel() {
    var e, n;
    this.cancelToken += 1, this.isCanceled = !0, (n = (e = this.opt).onCancel) === null || n === void 0 || n.call(e), this.opt.cancelQueued && this.clearQueue();
    for (const r of this.controllers)
      r.abort();
  }
  dispose() {
    this.isDisposed || (this.isDisposed = !0, this.clearQueue(), this.cancel());
  }
  clearQueue() {
    if (this.queue.length === 0)
      return;
    const e = this.queue.splice(0, this.queue.length);
    for (const n of e)
      n.canceled = !0, n.settled || (n.settled = !0, n.resolve(void 0));
  }
  execute(...e) {
    var n;
    if (this.isDisposed)
      return Promise.resolve(void 0);
    if (!this.canExecute)
      return (n = this.runningPromise) !== null && n !== void 0 ? n : Promise.resolve(void 0);
    const r = (a) => {
      this.runningPromise = a;
      const o = () => {
        this.runningPromise === a && (this.runningPromise = null);
      };
      return a.then(o, o), a;
    }, s = () => mt(this, void 0, void 0, function* () {
      var a, o, l, c, u, g, m, O;
      if (this.isDisposed)
        return;
      const b = this.opt.abortable ? new AbortController() : null;
      b && this.controllers.add(b), B(() => {
        this.activeCount += 1, this.isExecuting = this.activeCount > 0, this.isCanceled = !1, this.opt.trackError && this.opt.resetErrorOnExecute && (this.error = null);
      });
      const I = this.cancelToken;
      let R = !1, A = !1, K = null, Y = null;
      try {
        (o = (a = this.opt).onStart) === null || o === void 0 || o.call(a, ...e);
        const P = this.opt.abortable ? b.signal : void 0;
        Y = this.fn(...e, P);
        const k = yield Y;
        return A = this.cancelToken !== I, A ? void 0 : ((c = (l = this.opt).onSuccess) === null || c === void 0 || c.call(l, k, ...e), R = !0, k);
      } catch (P) {
        if (this.opt.abortable && b?.signal.aborted) {
          B(() => {
            this.isCanceled = !0;
          }), A = !0, K = null;
          return;
        }
        if (K = P, A = this.cancelToken !== I, this.opt.trackError && B(() => {
          this.error = P;
        }), (g = (u = this.opt).onError) === null || g === void 0 || g.call(u, P), !this.opt.swallowError)
          throw P;
        return;
      } finally {
        B(() => {
          this.activeCount = Math.max(0, this.activeCount - 1), this.isExecuting = this.activeCount > 0;
        }), b && this.controllers.delete(b), !A && this.cancelToken !== I && (A = !0), (O = (m = this.opt).onFinally) === null || O === void 0 || O.call(m, { ok: R, canceled: A, error: K }, ...e);
      }
    });
    switch (this.opt.concurrency) {
      case "parallel":
        return r(s());
      case "restart":
        return this.cancel(), r(s());
      case "queue": {
        const a = this.opt.queueLimit;
        if (typeof a == "number" && a > 0 && this.queue.length >= a)
          return Promise.resolve(void 0);
        const o = {
          promise: Promise.resolve(void 0),
          resolve: dt,
          reject: dt,
          canceled: !1,
          settled: !1
        }, l = this.activeCount === 0 && this.queue.length === 0;
        o.promise = new Promise((g, m) => {
          o.resolve = g, o.reject = m;
        }), this.queue.push(o);
        const c = () => mt(this, void 0, void 0, function* () {
          if (o.settled)
            return;
          if (o.canceled || this.isDisposed) {
            o.settled = !0, o.resolve(void 0);
            return;
          }
          const g = this.queue.indexOf(o);
          g >= 0 && this.queue.splice(g, 1);
          try {
            const m = yield s();
            o.settled || (o.settled = !0, o.resolve(m));
          } catch (m) {
            o.settled || (o.settled = !0, o.reject(m));
          }
        }), u = l ? c() : this.queueTail.then(c, c);
        return this.queueTail = u.then(dt, dt), r(o.promise);
      }
      default:
        return this.isExecuting && this.runningPromise ? this.runningPromise : r(s());
    }
  }
}
function xe(t, e) {
  return new Fe(t, e);
}
function li(t, e) {
  const n = Xt(t), r = /* @__PURE__ */ new Set(), s = e?.onCancel;
  return xe((...o) => {
    const l = n(...o);
    r.add(l);
    const c = () => {
      r.delete(l);
    };
    return l.then(c, c), new Promise((u, g) => {
      l.then(u, (m) => {
        if (Zt(m)) {
          u(void 0);
          return;
        }
        g(m);
      });
    });
  }, Object.assign(Object.assign({}, e), { onCancel: () => {
    var o;
    for (const l of r)
      (o = l.cancel) === null || o === void 0 || o.call(l);
    s?.();
  } }));
}
function ci(t) {
  return function(...e) {
    return B(() => t.apply(this, e));
  };
}
export {
  Z as GetService,
  si as GetStore,
  ce as Inject,
  ni as InjectStore,
  $e as MakeObservable,
  pe as Model,
  Qe as PropFromView,
  Ut as Service,
  Ge as SetService,
  ai as Store,
  ei as StoreBase,
  Be as TODO,
  ri as ViewModel,
  xe as asyncCommand,
  ye as attachModelDevtools,
  Ve as attachStoreDevtools,
  ci as commandAction,
  L as defineMetadata,
  Ue as define_prop,
  Je as exclude,
  St as field,
  li as flowCommand,
  oe as getExecutingFunctionNameByStack,
  H as getOwnMetadata,
  Ye as isSerializable,
  Ze as submit,
  ti as validation,
  oi as view
};
//# sourceMappingURL=index.js.map
