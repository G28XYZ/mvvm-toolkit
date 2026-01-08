import "reflect-metadata";
import { d as vt, _ as R, a as j, b as G, c as S } from "./tslib.es6-B_Omq7a0.js";
import Bt, { isObject as Ct, isEqual as Vt, isEmpty as Gt } from "lodash";
import { makeObservable as gt, reaction as qt, runInAction as B, observable as rt, isObservable as Ft, computed as J, action as x, flow as Ut, isFlowCancellationError as $t, makeAutoObservable as Qt } from "mobx";
import { enablePatches as Jt, immerable as xt, createDraft as Xt, applyPatches as Lt, produce as Zt } from "immer";
import { observer as te } from "mobx-react";
import { useMemo as ee, useEffect as ie } from "react";
const K = (t, i, a) => Reflect.getOwnMetadata(t, i) || a || {}, L = (t, i, a) => Reflect.defineMetadata(t, i, a);
function xe(...t) {
  try {
    return JSON.stringify(t), !0;
  } catch {
    return !1;
  }
}
function se(t) {
  if (t && typeof t == "string") {
    let [i] = t.split(`
`)[2].replace(/at (get)?/, "").match(/.*/g) || [];
    return i && (i = i.trim()), i;
  }
}
const Kt = {}, _t = [];
let Ht = !1;
const Le = (t, ...i) => {
  const a = new Error().stack;
  if (!Ht)
    console.log("%c TODO", "background: #222; color: #bada55", Kt), Ht = !0;
  else {
    const s = se(a);
    _t.includes(s) === !1 && (_t.push(s), Reflect.set(Kt, `${_t.length}) ${t}`, { msg: i, get path() {
      return console.info(i, s), s;
    } }));
  }
  function r(...s) {
  }
  return r;
}, Y = (t, i) => !!t && (typeof i == "string" || typeof i == "symbol"), W = (t) => !!t && typeof t == "object" && "kind" in t, ne = (t) => ({
  kind: "class",
  name: t,
  addInitializer: () => {
  },
  metadata: {}
}), Q = /* @__PURE__ */ Symbol("service-key"), pt = new Proxy({}, Reflect);
function ae(t) {
  const i = (r, s) => {
    Object.defineProperty(r, s, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, s))
          return Reflect.get(this, s);
        const n = X(t, "instance");
        if (n)
          return Object.defineProperty(this, s, { value: n, writable: !0, configurable: !0, enumerable: !0 }), n;
      },
      set(n) {
        const o = X(t, "instance");
        Object.defineProperty(this, s, { value: o ?? n, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  };
  function a(r, s) {
    if (Y(r, s)) {
      i(r, s);
      return;
    }
    return s.addInitializer(function() {
      return vt(this, void 0, void 0, function* () {
        const n = X(t, "instance");
        n && Object.hasOwn(this, s.name) && Reflect.set(this, s.name, n);
      });
    }), (n) => n;
  }
  return a;
}
function X(t, i) {
  var a;
  const r = K(Q, pt);
  if (typeof t != "string") {
    const s = K(Q, t);
    if (s)
      return i && i in s ? s[i] : s;
    for (const n in r) {
      const o = r[n];
      if (o.target === t) {
        t = o.context.name;
        break;
      }
    }
  }
  if (typeof t == "string")
    return i ? (a = r[t]) === null || a === void 0 ? void 0 : a[i] : r[t];
}
function Yt(t, i) {
  const a = (s, n) => {
    const o = String(typeof t == "string" && t || typeof t == "object" && t?.id || n?.name || s?.name), l = K(Q, pt), c = new Proxy({
      target: s,
      instance: typeof t == "object" && Reflect.get(t, "transient") || typeof t == "object" && Reflect.get(t, "lazy") ? s : new s(),
      context: n,
      options: t
    }, {
      get(u, y, m) {
        var O, b;
        if (y === "instance" && (!((O = u?.options) === null || O === void 0) && O.transient))
          return new s();
        if (y === "instance" && (!((b = u?.options) === null || b === void 0) && b.lazy) && u.instance === s) {
          const k = new s();
          return Reflect.set(u, y, k, m), k;
        }
        return Reflect.get(u, y, m);
      },
      set(u, y, m, O) {
        return Reflect.set(u, y, m, O);
      }
    });
    l[o] = c, L(Q, l, pt), L(Q, l[o], s);
  };
  function r(s, n) {
    var o, l;
    const c = s.__legacy_source__, u = W(n) ? n : ne((l = (o = c?.name) !== null && o !== void 0 ? o : s?.name) !== null && l !== void 0 ? l : "");
    a(s, u), c && c !== s && L(Q, K(Q, s), c);
  }
  return Bt.isFunction(t) ? r(t, i) : t ? (s, n) => r(s, n) : r;
}
const Ke = (t, i) => {
  const { kind: a = "class", name: r = "", addInitializer: s = () => {
  }, metadata: n } = i?.ctx || {};
  return Yt(i)(t, {
    kind: a,
    name: r,
    addInitializer: s,
    metadata: n
  }), X(t).instance;
};
function yt(t) {
  var i, a, r;
  const s = Object.assign({ enumerable: !1, writable: !0 }, t), n = Object.assign({ configurable: !0, enumerable: !1, writable: !0 }, t), o = {
    configurable: (i = n.configurable) !== null && i !== void 0 ? i : !0,
    enumerable: (a = n.enumerable) !== null && a !== void 0 ? a : !1,
    writable: (r = n.writable) !== null && r !== void 0 ? r : !0,
    value: void 0
  };
  return function(l, c) {
    if (Y(l, c)) {
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
      return u.kind === "field" ? function(y) {
        return o.value = y, Object.defineProperty(this, u.name, o), o.value = void 0, y;
      } : (u.addInitializer(function() {
        const y = Object.getOwnPropertyDescriptor(this, u.name);
        y && Object.defineProperty(this, u.name, Object.assign(Object.assign({}, y), { enumerable: s.enumerable }));
      }), l);
    }
  };
}
function He(t, i) {
  return Y(t, i) || W(i) ? yt()(t, i) : yt(t);
}
function ze(t, i) {
  const a = (n) => class extends n {
    constructor(...o) {
      super(...o), gt(this);
    }
  }, r = (n, o) => {
    if (typeof Reflect?.getOwnMetadataKeys == "function")
      for (const l of Reflect.getOwnMetadataKeys(n)) {
        const c = Reflect.getOwnMetadata(l, n);
        Reflect.defineMetadata(l, c, o);
      }
  };
  function s(n, o) {
    if (!W(o)) {
      const l = n, c = a(l);
      return Object.defineProperty(c, "__legacy_source__", { value: l, configurable: !0 }), r(l, c), c;
    }
    o.addInitializer(function() {
      gt(this);
    });
  }
  return t && !W(i) || t ? s(t, i) : s;
}
const oe = /* @__PURE__ */ Symbol("field-key"), re = /* @__PURE__ */ Symbol("validation-key"), le = /* @__PURE__ */ Symbol("submit-key"), ce = /* @__PURE__ */ Symbol("exclude-key"), de = /* @__PURE__ */ Symbol("prop-from-view-key");
class Z {
  isPrototypeObject(i) {
    const a = i?.constructor;
    return !!(a && a.prototype === i);
  }
  /**
   * Получить объект, по которому кешируются метаданные.
   * Для инстанса — это его prototype, для prototype — он сам.
   */
  getCacheTarget(i) {
    return !i || typeof i != "object" ? null : this.isPrototypeObject(i) ? i : Object.getPrototypeOf(i);
  }
  computeFromPrototype(i) {
    const a = [], r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
    let n = i;
    for (; n; ) {
      const l = Reflect.getOwnMetadata(this.metadataKey, n);
      if (Array.isArray(l))
        for (const c of l) {
          const u = c?.name, y = String(u);
          s.has(y) || (s.add(y), a.push(c), r.set(y, c));
        }
      n = Object.getPrototypeOf(n);
    }
    return { ownRef: Reflect.getOwnMetadata(this.metadataKey, i), list: a, map: r };
  }
  /**
   * Создать базовые метаданные.
   */
  constructor(i = {}) {
    this.metadataKey = null, this.isInit = !1, this.cache = /* @__PURE__ */ new WeakMap(), this.name = i?.name, this.callback = i?.callback;
  }
  /**
   * Проверить, что данные соответствуют экземпляру метаданных.
   */
  isInstance(i = {}) {
    return i instanceof Z || Object.getOwnPropertyNames(this).some((a) => Object.keys(i).includes(a));
  }
  /**
   * Получить метаданные конкретного поля модели.
   */
  fieldInstance(i, a) {
    const r = a && typeof a == "object" ? Reflect.getOwnMetadata(this.metadataKey, a) : void 0;
    if (Array.isArray(r))
      return r.find((l) => l.name === i);
    const s = this.getCacheTarget(a);
    if (!s)
      return;
    const n = Reflect.getOwnMetadata(this.metadataKey, s), o = this.cache.get(s);
    if (!o || o.ownRef !== n) {
      const l = this.computeFromPrototype(s);
      return this.cache.set(s, l), l.map.get(String(i));
    }
    return o.map.get(String(i));
  }
  /**
   * Получить массив метаданных полей модели.
   */
  fields(i) {
    const a = i && typeof i == "object" ? Reflect.getOwnMetadata(this.metadataKey, i) : void 0;
    if (Array.isArray(a)) {
      const l = [], c = /* @__PURE__ */ new Set();
      let u = i;
      for (; u; ) {
        const y = Reflect.getOwnMetadata(this.metadataKey, u);
        if (Array.isArray(y))
          for (const m of y) {
            const O = m?.name, b = String(O);
            c.has(b) || (c.add(b), l.push(m));
          }
        u = Object.getPrototypeOf(u);
      }
      return l;
    }
    const r = this.getCacheTarget(i);
    if (!r)
      return [];
    const s = Reflect.getOwnMetadata(this.metadataKey, r), n = this.cache.get(r);
    if (n && n.ownRef === s)
      return n.list;
    const o = this.computeFromPrototype(r);
    return this.cache.set(r, o), o.list;
  }
}
class bt extends Z {
  constructor() {
    super(...arguments), this.metadataKey = re;
  }
}
class Mt extends Z {
  constructor() {
    super(...arguments), this.metadataKey = le;
  }
}
class Ot extends Z {
  constructor() {
    super(...arguments), this.metadataKey = ce;
  }
}
class wt extends Z {
  /**
   * Создать метаданные поля модели.
   */
  constructor(i = {}) {
    super(i), this.factory = null, this.mapping = null, this.noObserve = null, this.collectChanges = !1, this.name = null, this.ctx = null, this.metadataKey = oe, this.isInit = !1, this.factory = i.factory, this.mapping = i.mapping, this.noObserve = i.noObserve, this.name = i.name, this.ctx = i.ctx, this.collectChanges = !!i.collectChanges;
  }
}
class Dt extends Z {
  /**
   * Создать метаданные для PropFromView.
   */
  constructor(i = {}) {
    super(i), this.metadataKey = de;
    for (const a in this)
      i && a in i && (this[a] = Reflect.get(i, a));
  }
}
function We(t) {
  const i = (s, n) => {
    const o = new Dt({ name: t, originName: String(n) });
    o.name = t, o.originName = String(n);
    const l = K(o.metadataKey, s, new Array());
    L(o.metadataKey, [...l, o], s);
  }, a = (s) => {
    s.addInitializer(function() {
      const n = new Dt(), o = n.fields(this);
      for (const l in this)
        o instanceof Array && s.name === l && (n.name = t, n.originName = l, n.value = this[l], o.push(n));
      L(n.metadataKey, o, this);
    });
  };
  function r(s, n) {
    if (Y(s, n)) {
      i(s, n);
      return;
    }
    if (W(n))
      return a(n), n.kind === "field" ? (o) => o : n;
  }
  return t ? ((s, n) => r(s, n)) : ((s) => s);
}
function qe(t) {
  const i = (s, n) => {
    const o = new Ot({ callback: t, name: String(n) }), l = K(o.metadataKey, s, new Array());
    L(o.metadataKey, [...l, o], s);
  }, a = (s) => {
    s.addInitializer(function() {
      const n = new Ot({ callback: t, name: String(s.name) }), o = K(n.metadataKey, this, new Array());
      L(n.metadataKey, [...o, n], this);
    });
  };
  function r(s, n) {
    if (Y(s, n)) {
      i(s, n);
      return;
    }
    if (W(n))
      return a(n), n.kind === "field" ? void 0 : n;
  }
  if (t)
    return ((s, n) => r(s, n));
}
const ue = () => {
  var t;
  return (t = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && t !== void 0 ? t : null;
}, he = () => {
  var t;
  return (t = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && t !== void 0 ? t : 0;
}, ct = (t) => {
  var i, a;
  const r = globalThis;
  r.__MVVM_DEVTOOLS_APPLYING__ = ((i = r.__MVVM_DEVTOOLS_APPLYING__) !== null && i !== void 0 ? i : 0) + 1;
  try {
    return t();
  } finally {
    r.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((a = r.__MVVM_DEVTOOLS_APPLYING__) !== null && a !== void 0 ? a : 1) - 1);
  }
}, fe = () => he() > 0, zt = (t) => ({
  data: t.service.dumpData,
  historyIndex: t.service.historyIndex
}), _e = (t, i = {}) => {
  const a = ue();
  if (!a)
    return () => {
    };
  const r = a.connect({ name: i.name, instanceId: i.instanceId });
  let s = !1;
  try {
    r.init(zt(t));
  } catch {
  }
  const n = qt(() => zt(t), (l) => {
    var c;
    if (!(s || fe()))
      try {
        r.send({ type: (c = i.actionType) !== null && c !== void 0 ? c : "model:update" }, l);
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
        const y = JSON.parse(l.state), m = y.historyIndex, O = t.service.history, b = Array.isArray(O) && O.length > 0, k = typeof m == "number" && (m === -1 && b || m >= 0 && b && m < O.length);
        s = !0, ct(() => {
          var T;
          try {
            if (k) {
              t.service.goToHistory(m);
              return;
            }
            const A = (T = y.data) !== null && T !== void 0 ? T : y;
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
    n(), typeof o == "function" && o(), typeof r.unsubscribe == "function" && r.unsubscribe(), typeof r.disconnect == "function" && r.disconnect();
  };
};
Jt();
const et = new Mt(), it = new wt(), st = new bt(), nt = new Ot();
let ye = (() => {
  var t, i, a, r, s, n, o, l, c, u, y, m, O, b, k, T, A, H, N, P, I, d, D;
  let M = [], C, E = [], F = [], z, U, $, tt, at, ot, lt, kt, At, Et, Tt, Rt;
  return t = class {
    // @define_prop
    get [(i = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap(), y = /* @__PURE__ */ new WeakMap(), m = /* @__PURE__ */ new WeakMap(), O = /* @__PURE__ */ new WeakMap(), b = /* @__PURE__ */ new WeakMap(), k = /* @__PURE__ */ new WeakMap(), T = /* @__PURE__ */ new WeakMap(), A = /* @__PURE__ */ new WeakMap(), H = xt)]() {
      return R(this, i, "f");
    }
    set [H](e) {
      j(this, i, e, "f");
    }
    get initData() {
      return R(this, a, "f");
    }
    set initData(e) {
      j(this, a, e, "f");
    }
    // @define_prop
    get committedData() {
      return R(this, r, "f");
    }
    set committedData(e) {
      j(this, r, e, "f");
    }
    // @define_prop
    get modified_() {
      return R(this, s, "f");
    }
    set modified_(e) {
      j(this, s, e, "f");
    }
    // @define_prop
    get draft() {
      return R(this, n, "f");
    }
    set draft(e) {
      j(this, n, e, "f");
    }
    // @define_prop
    get changes() {
      return R(this, o, "f");
    }
    set changes(e) {
      j(this, o, e, "f");
    }
    // @define_prop
    get inverseChanges() {
      return R(this, l, "f");
    }
    set inverseChanges(e) {
      j(this, l, e, "f");
    }
    // @define_prop
    get history() {
      return R(this, c, "f");
    }
    set history(e) {
      j(this, c, e, "f");
    }
    // @define_prop
    get historyIndex() {
      return R(this, u, "f");
    }
    set historyIndex(e) {
      j(this, u, e, "f");
    }
    // @define_prop
    get legacyInitDone() {
      return R(this, y, "f");
    }
    set legacyInitDone(e) {
      j(this, y, e, "f");
    }
    // @define_prop
    get options() {
      return R(this, m, "f");
    }
    set options(e) {
      j(this, m, e, "f");
    }
    // @define_prop
    get historyMuted() {
      return R(this, O, "f");
    }
    set historyMuted(e) {
      j(this, O, e, "f");
    }
    // @define_prop
    get [N = (C = [rt], it.metadataKey)]() {
      return R(this, b, "f");
    }
    set [N](e) {
      j(this, b, e, "f");
    }
    // @define_prop
    get [P = et.metadataKey]() {
      return R(this, k, "f");
    }
    set [P](e) {
      j(this, k, e, "f");
    }
    // @define_prop
    get [I = nt.metadataKey]() {
      return R(this, T, "f");
    }
    set [I](e) {
      j(this, T, e, "f");
    }
    // @define_prop
    get [d = st.metadataKey]() {
      return R(this, A, "f");
    }
    set [d](e) {
      j(this, A, e, "f");
    }
    /**
     * Создает модель и инициализирует данные.
     */
    constructor(e = {}, h) {
      i.set(this, (G(this, M), !0)), a.set(this, G(this, E, null)), r.set(this, (G(this, F), {})), s.set(this, {}), n.set(this, null), o.set(this, []), l.set(this, []), c.set(this, []), u.set(this, -1), y.set(this, !1), m.set(this, {}), O.set(this, !1), b.set(this, null), k.set(this, null), T.set(this, null), A.set(this, null), this.options = h, this[xt] = !0, this.init(e), this.initLegacyFields(), this.autoAttachDevtools();
    }
    getFieldMetaCache() {
      const e = Reflect.getOwnMetadata(it.metadataKey, this), h = Object.getPrototypeOf(this), f = h ? Reflect.getOwnMetadata(it.metadataKey, h) : null, _ = this[it.metadataKey];
      if (_ && _ !== !0 && _.ownRef === e && _.protoRef === f)
        return _;
      const w = it.fields(this), g = /* @__PURE__ */ new Map();
      for (const p of w)
        g.set(String(p.name), p);
      const v = { ownRef: e, protoRef: f, list: w, map: g };
      return this[it.metadataKey] = v, v;
    }
    getFieldMeta(e) {
      return this.getFieldMetaCache().map.get(String(e));
    }
    getSubmitMetaCache() {
      const e = Reflect.getOwnMetadata(et.metadataKey, this), h = Object.getPrototypeOf(this), f = h ? Reflect.getOwnMetadata(et.metadataKey, h) : null, _ = this[et.metadataKey];
      if (_ && _ !== !0 && _.ownRef === e && _.protoRef === f)
        return _;
      const w = et.fields(this), g = /* @__PURE__ */ new Map();
      for (const p of w)
        g.set(String(p.name), p);
      const v = { ownRef: e, protoRef: f, list: w, map: g };
      return this[et.metadataKey] = v, v;
    }
    getExcludeMetaCache() {
      const e = Reflect.getOwnMetadata(nt.metadataKey, this), h = Object.getPrototypeOf(this), f = h ? Reflect.getOwnMetadata(nt.metadataKey, h) : null, _ = this[nt.metadataKey];
      if (_ && _ !== !0 && _.ownRef === e && _.protoRef === f)
        return _;
      const w = nt.fields(this), g = /* @__PURE__ */ new Map();
      for (const p of w)
        g.set(String(p.name), p);
      const v = { ownRef: e, protoRef: f, list: w, map: g };
      return this[nt.metadataKey] = v, v;
    }
    getValidationMetaCache() {
      const e = Reflect.getOwnMetadata(st.metadataKey, this), h = Object.getPrototypeOf(this), f = h ? Reflect.getOwnMetadata(st.metadataKey, h) : null, _ = this[st.metadataKey];
      if (_ && _ !== !0 && _.ownRef === e && _.protoRef === f)
        return _;
      const w = st.fields(this), g = /* @__PURE__ */ new Map();
      for (const p of w)
        g.set(String(p.name), p);
      const v = { ownRef: e, protoRef: f, list: w, map: g };
      return this[st.metadataKey] = v, v;
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
    initValidation(e) {
      const h = this.validation;
      if (e)
        Reflect.get(h, e);
      else
        for (let f in h)
          h[f];
    }
    /**
     * Полная инициализация модели и полей.
     */
    init(e = {}) {
      this.cloneForInit(e), this.createDraft(e), this.defineData(this.initData);
    }
    /**
     * Инициализировать отдельное поле модели.
     */
    initField(e, h) {
      const f = this.getFieldMeta(e);
      if (f) {
        e in this.initData || Reflect.set(this.initData, e, Reflect.get(this, e));
        const _ = f?.factory ? f.factory(this.initData, this) : this.initData[f.name];
        this.defineFieldValue(e, _, f), h?.skipValidation || this.initValidation(e);
      }
    }
    initLegacyFields() {
      if (this.legacyInitDone)
        return;
      const e = this.getFieldMetaCache().list;
      if (e.some((h) => Object.prototype.hasOwnProperty.call(this, h.name))) {
        this.legacyInitDone = !0;
        for (let h of e) {
          const f = String(h.name);
          this.initData && f in this.initData || this.initField(f, { skipValidation: !0 });
        }
      }
    }
    /**
     * Создать draft для отслеживания изменений.
     */
    createDraft(e) {
      this.draft = Xt(e);
    }
    autoAttachDevtools() {
      var e, h, f, _, w, g, v, p, q, ut, ht;
      const ft = globalThis;
      if (!ft.__MVVM_DEVTOOLS_AUTO__ || ((h = (e = this.options) === null || e === void 0 ? void 0 : e.devtools) === null || h === void 0 ? void 0 : h.enabled) === !1)
        return;
      const jt = (v = (w = (_ = (f = this.options) === null || f === void 0 ? void 0 : f.devtools) === null || _ === void 0 ? void 0 : _.name) !== null && w !== void 0 ? w : (g = this.constructor) === null || g === void 0 ? void 0 : g.name) !== null && v !== void 0 ? v : "Model", Pt = ((p = ft.__MVVM_DEVTOOLS_SEQ__) !== null && p !== void 0 ? p : 0) + 1;
      ft.__MVVM_DEVTOOLS_SEQ__ = Pt, _e(this, { name: jt, instanceId: (ht = (ut = (q = this.options) === null || q === void 0 ? void 0 : q.devtools) === null || ut === void 0 ? void 0 : ut.instanceId) !== null && ht !== void 0 ? ht : `${jt}#${Pt}` });
    }
    withHistoryMuted(e) {
      this.historyMuted = !0;
      try {
        e();
      } finally {
        this.historyMuted = !1;
      }
    }
    // @define_prop
    // private readonly serviceToJSON = () => this.dumpData;
    syncChangesFromHistory() {
      const e = this.historyIndex >= 0 ? this.history.slice(0, this.historyIndex + 1) : [];
      this.changes = e.flatMap((h) => h.patches), this.inverseChanges = e.flatMap((h) => h.inversePatches);
    }
    applyHistoryPatches(e) {
      if (!e.length)
        return;
      Lt(this.draft, e);
      const h = new Set(e.map((f) => f.field).filter(Boolean));
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
    produceDraft(e, h, f) {
      if (this.historyMuted)
        return;
      let _, w = [];
      e && (_ = e.split(".")[0], _ && !this.getFieldMeta(_).collectChanges) || (Zt(this.draft, (g) => {
        if (e) {
          let v = g;
          const p = e.split(".");
          if (p.length > 1)
            for (let q = 0; q < p.length && !(q != p.length - 1 && !Ct(v)); q++)
              Ct(v) && (v = v[p[q]]);
          else
            f = e;
          v && (v[f] = h);
        }
      }, (g, v) => {
        _ && (g = g.map((p) => Object.assign(Object.assign({}, p), { field: _ })), v = v.map((p) => Object.assign(Object.assign({}, p), { field: _ }))), w = g, !(!g.length && !v.length) && (this.historyIndex < this.history.length - 1 && (this.history = this.history.slice(0, this.historyIndex + 1), this.syncChangesFromHistory()), this.changes.push(...g), this.inverseChanges.push(...v), this.history.push({ patches: g, inversePatches: v }), this.historyIndex = this.history.length - 1);
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
    createObservable(e, h, f, _ = f) {
      return e = Ft(e) ? e : rt.box(e), new Proxy(e, {
        get: (w, g, v) => {
          const p = Reflect.get(w, g, v);
          return p && typeof p == "object" && !(p instanceof t) && !Ft(e) ? this.createObservable(p, String(g), h, `${_}.${String(g)}`) : p;
        },
        set: (w, g, v, p) => (e = v, this.produceDraft(_, e, String(g)), this.checkChange(f, Reflect.get(this, f)), Reflect.set(w, g, v, p))
      });
    }
    /**
     * Определить getter/setter для поля модели.
     */
    defineFieldValue(e, h, f) {
      const _ = f ?? this.getFieldMeta(e);
      return _.noObserve ? Reflect.defineProperty(this, _.name, { value: h }) : (h = rt.box(h), Reflect.defineProperty(this, _.name, {
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
    cloneForInit(e = {}) {
      this.initData = e;
    }
    /**
     * Проверить изменение поля и обновить modified_.
     */
    checkChange(e, h) {
      const f = Reflect.get(this.committedData, e) || Reflect.get(this.initData, e), _ = e && e in this.initData && !Vt(f, h);
      return B(() => {
        if (_) {
          Reflect.set(this.modified_, e, f);
          return;
        }
        e in this.modified_ && Vt(f, h) && delete this.modified_[e];
      }), _;
    }
    /**
     * Применить данные к полям модели.
     */
    defineData(e) {
      const h = this.getFieldMetaCache().map;
      for (let f in this)
        Object.prototype.hasOwnProperty.call(this, f) && h.has(f) && (Reflect.set(this, f, Reflect.get(e, f)), this.initField(f));
    }
    /**
     * Признак наличия изменений.
     */
    get dirty() {
      return !Gt(this.modified_);
    }
    /**
     * Зафиксировать все изменения.
     */
    commit() {
      for (let e of this.getFieldMetaCache().list)
        this.commitField(e.name);
      this.modified_ = {};
    }
    /**
     * Зафиксировать изменения конкретного поля.
     */
    commitField(e) {
      for (let h in this)
        h in this.modified_ && Reflect.set(this.committedData, h, this[h]);
      delete this.modified_[e], this.modified_ = Object.assign({}, this.modified_);
    }
    /**
     * Откатить изменения к последнему коммиту.
     */
    reject() {
      for (let e in this)
        e in this.modified_ && (this[e] = Reflect.get(this.modified_, e), this.commitField(e), this.defineFieldValue(e, this[e]));
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
    goToHistory(e) {
      if (!(e < -1 || e >= this.history.length) && e !== this.historyIndex) {
        for (; this.historyIndex < e; )
          this.historyIndex = this.historyIndex + 1, this.applyHistoryPatches(this.history[this.historyIndex].patches);
        for (; this.historyIndex > e; )
          this.applyHistoryPatches(this.history[this.historyIndex].inversePatches), this.historyIndex -= 1;
        this.syncChangesFromHistory();
      }
    }
    /**
     * Перезагрузить данные модели.
     */
    loadData(e) {
      return this.withHistoryMuted(() => {
        this.init(e);
      }), this;
    }
    /**
     * Получить сериализованный дамп данных.
     */
    get dumpData() {
      this.initLegacyFields();
      const e = /* @__PURE__ */ Object.create({}), h = this.getSubmitMetaCache().map, f = this.getExcludeMetaCache().map, _ = (g) => {
        const v = Reflect.get(this, g), p = h.get(g), q = p?.callback;
        return typeof q == "function" ? q(v, this) : v;
      }, w = (g) => {
        const v = f.get(g);
        if (v)
          switch (typeof v.callback) {
            case "boolean":
              return !!v.callback;
            case "function":
              return v.callback(Reflect.get(this, g), this);
          }
        return !1;
      };
      return this.getFieldMetaCache().list.forEach((g) => {
        var v;
        if (g.name in this)
          return !((v = this.options) === null || v === void 0) && v.byFields && !this.options.byFields.includes(g.name) || w(g.name) ? void 0 : Reflect.set(e, g.name, _(g.name));
      }), e;
    }
    /**
     * Получить объект результатов валидации.
     */
    get validation() {
      this.initLegacyFields();
      const e = {};
      for (const h of this.getValidationMetaCache().list)
        Reflect.set(e, h.name, h.callback(this[h.name], this) || "");
      return e;
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
        loadData: (e) => this.loadData(e),
        reject: () => this.reject(),
        commit: () => this.commit(),
        commitField: (e) => this.commitField(e),
        toInit: () => this.toInit(),
        undo: () => this.undo(),
        redo: () => this.redo(),
        goToHistory: (e) => this.goToHistory(e)
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
    const V = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    z = [x], U = [J], $ = [x], tt = [x], at = [x], ot = [x], lt = [x], kt = [x], At = [x], Et = [J], Tt = [J], Rt = [(D = J).struct.bind(D)], S(t, null, C, { kind: "accessor", name: "initData", static: !1, private: !1, access: { has: (e) => "initData" in e, get: (e) => e.initData, set: (e, h) => {
      e.initData = h;
    } }, metadata: V }, E, F), S(t, null, z, { kind: "method", name: "produceDraft", static: !1, private: !1, access: { has: (e) => "produceDraft" in e, get: (e) => e.produceDraft }, metadata: V }, null, M), S(t, null, U, { kind: "getter", name: "dirty", static: !1, private: !1, access: { has: (e) => "dirty" in e, get: (e) => e.dirty }, metadata: V }, null, M), S(t, null, $, { kind: "method", name: "commit", static: !1, private: !1, access: { has: (e) => "commit" in e, get: (e) => e.commit }, metadata: V }, null, M), S(t, null, tt, { kind: "method", name: "commitField", static: !1, private: !1, access: { has: (e) => "commitField" in e, get: (e) => e.commitField }, metadata: V }, null, M), S(t, null, at, { kind: "method", name: "reject", static: !1, private: !1, access: { has: (e) => "reject" in e, get: (e) => e.reject }, metadata: V }, null, M), S(t, null, ot, { kind: "method", name: "toInit", static: !1, private: !1, access: { has: (e) => "toInit" in e, get: (e) => e.toInit }, metadata: V }, null, M), S(t, null, lt, { kind: "method", name: "undo", static: !1, private: !1, access: { has: (e) => "undo" in e, get: (e) => e.undo }, metadata: V }, null, M), S(t, null, kt, { kind: "method", name: "redo", static: !1, private: !1, access: { has: (e) => "redo" in e, get: (e) => e.redo }, metadata: V }, null, M), S(t, null, At, { kind: "method", name: "goToHistory", static: !1, private: !1, access: { has: (e) => "goToHistory" in e, get: (e) => e.goToHistory }, metadata: V }, null, M), S(t, null, Et, { kind: "getter", name: "validation", static: !1, private: !1, access: { has: (e) => "validation" in e, get: (e) => e.validation }, metadata: V }, null, M), S(t, null, Tt, { kind: "getter", name: "validAndDirty", static: !1, private: !1, access: { has: (e) => "validAndDirty" in e, get: (e) => e.validAndDirty }, metadata: V }, null, M), S(t, null, Rt, { kind: "getter", name: "service", static: !1, private: !1, access: { has: (e) => "service" in e, get: (e) => e.service }, metadata: V }, null, M), V && Object.defineProperty(t, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: V });
  })(), t;
})();
const me = () => {
  var t;
  const i = globalThis;
  return !!((t = i.__MVVM_DEVTOOLS_HISTORY__) !== null && t !== void 0 ? t : i.__MVVM_DEVTOOLS_AUTO__);
}, ve = (t) => me() ? !t || typeof t != "object" ? { collectChanges: !0 } : "collectChanges" in t ? t : Object.assign(Object.assign({}, t), { collectChanges: !0 }) : t, St = function(i, a) {
  const r = ve(Y(i, a) ? void 0 : i), s = (l, c) => {
    const u = new wt(Object.assign(Object.assign({}, r), { name: String(c), ctx: null }));
    L(u.metadataKey, [...K(u.metadataKey, l, new Array()), u], l), Object.getOwnPropertyDescriptor(l, c) || Object.defineProperty(l, c, {
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
  }, n = (l) => {
    l.addInitializer(function() {
      if (this instanceof ye && typeof this.initField == "function") {
        const c = new wt(Object.assign(Object.assign({}, r), { name: String(l.name), ctx: l }));
        L(c.metadataKey, [...K(c.metadataKey, this, new Array()), c], this), this.initField.call(this, String(l.name));
      }
    });
  };
  function o(l, c) {
    if (Y(l, c)) {
      s(l, c);
      return;
    }
    if (W(c))
      return n(c), c.kind === "field" ? (u) => u : c;
  }
  return Y(i, a) ? o(i, a) : r && !W(a) ? (l, c) => o(l, c) : W(a) ? o(void 0, a) : (l, c) => o(l, c);
}, ge = (t) => !t || typeof t != "object" ? { noObserve: !0 } : Object.assign(Object.assign({}, t), { noObserve: !0 }), pe = function(i, a) {
  return Y(i, a) || W(a) ? St({ noObserve: !0 })(i, a) : St(ge(i));
};
St.noObserve = pe;
function Ne(t) {
  const i = (s, n) => {
    const o = new Mt({ callback: t, name: String(n) }), l = K(o.metadataKey, s, new Array());
    L(o.metadataKey, [...l, o], s);
  }, a = (s) => {
    const n = new Mt({ callback: t, name: String(s.name) });
    s.addInitializer(function() {
      const o = K(n.metadataKey, this, new Array());
      L(n.metadataKey, [...o, n], this);
    });
  };
  function r(s, n) {
    if (Y(s, n)) {
      i(s, n);
      return;
    }
    if (W(n))
      return a(n), n.kind === "field" ? (o) => o : n;
  }
  return t ? ((s, n) => r(s, n)) : ((s) => s);
}
function Be(t) {
  const i = (s, n) => {
    const o = new bt({ callback: t, name: String(n) }), l = K(o.metadataKey, s, new Array());
    L(o.metadataKey, [...l, o], s);
  }, a = (s) => {
    const n = new bt({ callback: t, name: String(s.name) });
    s.addInitializer(function() {
      const o = K(n.metadataKey, this, new Array());
      L(n.metadataKey, [...o, n], this);
    });
  };
  function r(s, n) {
    if (Y(s, n)) {
      i(s, n);
      return;
    }
    if (W(n))
      return a(n), n.kind === "field" ? (o) => o : n;
  }
  return t ? ((s, n) => r(s, n)) : ((s) => s);
}
const Nt = /* @__PURE__ */ Symbol("store-key"), be = () => {
  var t;
  return (t = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && t !== void 0 ? t : null;
}, Me = () => {
  var t;
  return (t = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && t !== void 0 ? t : 0;
}, Oe = (t) => {
  var i, a;
  const r = globalThis;
  r.__MVVM_DEVTOOLS_APPLYING__ = ((i = r.__MVVM_DEVTOOLS_APPLYING__) !== null && i !== void 0 ? i : 0) + 1;
  try {
    return t();
  } finally {
    r.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((a = r.__MVVM_DEVTOOLS_APPLYING__) !== null && a !== void 0 ? a : 1) - 1);
  }
}, we = () => Me() > 0, It = (t) => ({
  items: t.items.map((i) => {
    var a, r;
    return {
      name: (r = (a = i.constructor) === null || a === void 0 ? void 0 : a.name) !== null && r !== void 0 ? r : "Model",
      data: i.service.dumpData,
      historyIndex: i.service.historyIndex
    };
  })
}), De = (t) => !!(t && typeof t == "object" && Array.isArray(t.items)), Se = (t) => {
  if (!t)
    return null;
  try {
    const i = JSON.parse(t);
    return De(i) ? i : null;
  } catch {
    return null;
  }
}, Ie = (t, i = {}) => {
  var a, r;
  const s = be();
  if (!s)
    return () => {
    };
  const n = s.connect({ name: i.name, instanceId: i.instanceId });
  let o = !1, l = (r = (a = t.items[0]) === null || a === void 0 ? void 0 : a.constructor) !== null && r !== void 0 ? r : null;
  try {
    n.init(It(t));
  } catch {
  }
  const c = qt(() => It(t), (m) => {
    var O;
    if (o || we())
      return;
    const b = (O = t.items[0]) === null || O === void 0 ? void 0 : O.constructor;
    b && (l = b);
    try {
      n.send({ type: "store:update" }, m);
    } catch {
    }
  }), u = (m) => (o = !0, Oe(() => {
    try {
      return m();
    } finally {
      o = !1;
    }
  })), y = n.subscribe((m) => {
    var O;
    if (m.type !== "DISPATCH")
      return;
    const b = (O = m.payload) === null || O === void 0 ? void 0 : O.type;
    if (b === "RESET" || b === "ROLLBACK") {
      u(() => t.reset());
      return;
    }
    if (b === "JUMP_TO_ACTION" || b === "JUMP_TO_STATE") {
      const k = Se(m.state);
      if (!k)
        return;
      u(() => {
        var T, A, H;
        if (k.items.length === t.items.length && t.items.every((D) => {
          var M, C;
          return typeof ((M = D?.service) === null || M === void 0 ? void 0 : M.goToHistory) == "function" || typeof ((C = D?.service) === null || C === void 0 ? void 0 : C.loadData) == "function";
        })) {
          B(() => {
            k.items.forEach((D, M) => {
              var C;
              const E = (C = t.items[M]) === null || C === void 0 ? void 0 : C.service, F = D.historyIndex, z = E?.history;
              if (Array.isArray(z) && z.length > 0 && typeof F == "number" && typeof E?.goToHistory == "function" && (F === -1 && z.length > 0 || F < z.length)) {
                E.goToHistory(F);
                return;
              }
              typeof E?.loadData == "function" && E.loadData(D.data);
            });
          });
          return;
        }
        const P = (A = (T = t.items[0]) === null || T === void 0 ? void 0 : T.constructor) !== null && A !== void 0 ? A : l, I = k.items.map((D) => D.data);
        if (P) {
          t.applyLoaded(I, { model: P, cash: !1 }), l = P;
          return;
        }
        t.applyLoaded(I, { cash: !1 });
        const d = (H = t.items[0]) === null || H === void 0 ? void 0 : H.constructor;
        d && (l = d);
      });
    }
  });
  return () => {
    c(), typeof y == "function" && y(), typeof n.unsubscribe == "function" && n.unsubscribe(), typeof n.disconnect == "function" && n.disconnect();
  };
};
let Ge = (() => {
  var t, i, a;
  let r = [], s, n = [], o = [], l, c = [], u = [], y, m, O, b, k, T, A, H, N, P;
  return t = class {
    get items() {
      return R(this, i, "f");
    }
    set items(d) {
      j(this, i, d, "f");
    }
    get _cash() {
      return R(this, a, "f");
    }
    set _cash(d) {
      j(this, a, d, "f");
    }
    constructor() {
      i.set(this, (G(this, r), G(this, n, []))), a.set(this, (G(this, o), G(this, c, []))), G(this, u), gt(this), this.autoAttachDevtools();
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
    applyLoaded(d, D = {}) {
      const { model: M, mode: C = "replace", cash: E = !0 } = D;
      if (E && this.setCash(d), C === "append") {
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
      var d, D, M, C, E, F, z, U;
      const $ = globalThis;
      if (!$.__MVVM_DEVTOOLS_AUTO__)
        return;
      const tt = K(Nt, this.constructor, {}) || {};
      if (((d = tt.devtools) === null || d === void 0 ? void 0 : d.enabled) === !1)
        return;
      const at = (E = (M = (D = tt.devtools) === null || D === void 0 ? void 0 : D.name) !== null && M !== void 0 ? M : (C = this.constructor) === null || C === void 0 ? void 0 : C.name) !== null && E !== void 0 ? E : "Store", ot = ((F = $.__MVVM_DEVTOOLS_STORE_SEQ__) !== null && F !== void 0 ? F : 0) + 1;
      $.__MVVM_DEVTOOLS_STORE_SEQ__ = ot;
      const lt = (U = (z = tt.devtools) === null || z === void 0 ? void 0 : z.instanceId) !== null && U !== void 0 ? U : `${at}#${ot}`;
      Ie(this, { name: at, instanceId: lt });
    }
  }, i = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new WeakMap(), (() => {
    const I = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    s = [rt], l = [rt], y = [x], m = [x], O = [x], b = [x], k = [J], T = [J], A = [J], H = [x], N = [x], P = [x], S(t, null, s, { kind: "accessor", name: "items", static: !1, private: !1, access: { has: (d) => "items" in d, get: (d) => d.items, set: (d, D) => {
      d.items = D;
    } }, metadata: I }, n, o), S(t, null, l, { kind: "accessor", name: "_cash", static: !1, private: !1, access: { has: (d) => "_cash" in d, get: (d) => d._cash, set: (d, D) => {
      d._cash = D;
    } }, metadata: I }, c, u), S(t, null, y, { kind: "method", name: "add", static: !1, private: !1, access: { has: (d) => "add" in d, get: (d) => d.add }, metadata: I }, null, r), S(t, null, m, { kind: "method", name: "addMany", static: !1, private: !1, access: { has: (d) => "addMany" in d, get: (d) => d.addMany }, metadata: I }, null, r), S(t, null, O, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (d) => "remove" in d, get: (d) => d.remove }, metadata: I }, null, r), S(t, null, b, { kind: "method", name: "clear", static: !1, private: !1, access: { has: (d) => "clear" in d, get: (d) => d.clear }, metadata: I }, null, r), S(t, null, k, { kind: "getter", name: "size", static: !1, private: !1, access: { has: (d) => "size" in d, get: (d) => d.size }, metadata: I }, null, r), S(t, null, T, { kind: "getter", name: "snapshot", static: !1, private: !1, access: { has: (d) => "snapshot" in d, get: (d) => d.snapshot }, metadata: I }, null, r), S(t, null, A, { kind: "getter", name: "cash", static: !1, private: !1, access: { has: (d) => "cash" in d, get: (d) => d.cash }, metadata: I }, null, r), S(t, null, H, { kind: "method", name: "reset", static: !1, private: !1, access: { has: (d) => "reset" in d, get: (d) => d.reset }, metadata: I }, null, r), S(t, null, N, { kind: "method", name: "applyLoaded", static: !1, private: !1, access: { has: (d) => "applyLoaded" in d, get: (d) => d.applyLoaded }, metadata: I }, null, r), S(t, null, P, { kind: "method", name: "setCash", static: !1, private: !1, access: { has: (d) => "setCash" in d, get: (d) => d.setCash }, metadata: I }, null, r), I && Object.defineProperty(t, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: I });
  })(), t;
})();
function $e(t) {
  return X(t, "instance");
}
function Qe(t) {
  return ((i, a) => ae(t)(i, a));
}
function Je(t, i) {
  const a = (r, s) => {
    var n;
    const o = typeof t == "string" ? { id: t } : typeof t == "object" ? t : { id: (n = s?.name) !== null && n !== void 0 ? n : r?.name };
    L(Nt, o, r), Yt(o)(r, s);
  };
  return typeof t == "function" ? a(t, i) : (r, s) => a(r, s);
}
class Xe {
}
const mt = new Dt();
function Ze(t, i) {
  return te((a = {}) => {
    const { resolved: r, instance: s } = ee(() => {
      const o = X(t) || (typeof t != "string" ? { instance: new t() } : void 0), l = o?.instance;
      return { resolved: o, instance: l };
    }, [t]);
    if (ie(() => {
      if (s)
        return typeof s.onInit == "function" && s.onInit(), () => {
          typeof s.onDispose == "function" && s.onDispose();
        };
    }, [s]), r) {
      const n = mt.fields(s), o = n.length > 0 ? n : mt.fields(Object.getPrototypeOf(s));
      for (const l in a)
        if (o instanceof Array) {
          const c = o.find((u) => u.name === l);
          c && Reflect.set(s, c.originName, Reflect.get(a, l));
        }
      return L(mt.metadataKey, o, s), i(Object.assign({ viewModel: s }, a));
    }
    return i(Object.assign({}, a));
  });
}
const Wt = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, ke = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, dt = () => {
};
class Ae {
  constructor(i, a) {
    var r, s, n, o, l, c, u;
    this.isExecuting = !1, this.activeCount = 0, this.isCanceled = !1, this.isDisposed = !1, this.error = null, this.controllers = /* @__PURE__ */ new Set(), this.queue = [], this.runningPromise = null, this.queueTail = Promise.resolve(), this.cancelToken = 0, this.fn = i, this.opt = Object.assign({ concurrency: (r = a?.concurrency) !== null && r !== void 0 ? r : "ignore", trackError: (s = a?.trackError) !== null && s !== void 0 ? s : !0, resetErrorOnExecute: (n = a?.resetErrorOnExecute) !== null && n !== void 0 ? n : !0, swallowError: (o = a?.swallowError) !== null && o !== void 0 ? o : !0, abortable: (l = a?.abortable) !== null && l !== void 0 ? l : !1 }, a), this.states = Object.assign(Object.assign({}, Wt), (c = a?.states) !== null && c !== void 0 ? c : {}), this.stateKeys = Object.assign(Object.assign({}, ke), (u = a?.stateKeys) !== null && u !== void 0 ? u : {}), Qt(this, {
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
  resolveState(i) {
    var a, r;
    const s = (a = this.stateKeys[i]) !== null && a !== void 0 ? a : i;
    return (r = this.states[s]) !== null && r !== void 0 ? r : Wt[i];
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
    var i, a;
    this.cancelToken += 1, this.isCanceled = !0, (a = (i = this.opt).onCancel) === null || a === void 0 || a.call(i), this.opt.cancelQueued && this.clearQueue();
    for (const r of this.controllers)
      r.abort();
  }
  dispose() {
    this.isDisposed || (this.isDisposed = !0, this.clearQueue(), this.cancel());
  }
  clearQueue() {
    if (this.queue.length === 0)
      return;
    const i = this.queue.splice(0, this.queue.length);
    for (const a of i)
      a.canceled = !0, a.settled || (a.settled = !0, a.resolve(void 0));
  }
  execute(...i) {
    var a;
    if (this.isDisposed)
      return Promise.resolve(void 0);
    if (!this.canExecute)
      return (a = this.runningPromise) !== null && a !== void 0 ? a : Promise.resolve(void 0);
    const r = (n) => {
      this.runningPromise = n;
      const o = () => {
        this.runningPromise === n && (this.runningPromise = null);
      };
      return n.then(o, o), n;
    }, s = () => vt(this, void 0, void 0, function* () {
      var n, o, l, c, u, y, m, O;
      if (this.isDisposed)
        return;
      const b = this.opt.abortable ? new AbortController() : null;
      b && this.controllers.add(b), B(() => {
        this.activeCount += 1, this.isExecuting = this.activeCount > 0, this.isCanceled = !1, this.opt.trackError && this.opt.resetErrorOnExecute && (this.error = null);
      });
      const k = this.cancelToken;
      let T = !1, A = !1, H = null, N = null;
      try {
        (o = (n = this.opt).onStart) === null || o === void 0 || o.call(n, ...i);
        const P = this.opt.abortable ? b.signal : void 0;
        N = this.fn(...i, P);
        const I = yield N;
        return A = this.cancelToken !== k, A ? void 0 : ((c = (l = this.opt).onSuccess) === null || c === void 0 || c.call(l, I, ...i), T = !0, I);
      } catch (P) {
        if (this.opt.abortable && b?.signal.aborted) {
          B(() => {
            this.isCanceled = !0;
          }), A = !0, H = null;
          return;
        }
        if (H = P, A = this.cancelToken !== k, this.opt.trackError && B(() => {
          this.error = P;
        }), (y = (u = this.opt).onError) === null || y === void 0 || y.call(u, P), !this.opt.swallowError)
          throw P;
        return;
      } finally {
        B(() => {
          this.activeCount = Math.max(0, this.activeCount - 1), this.isExecuting = this.activeCount > 0;
        }), b && this.controllers.delete(b), !A && this.cancelToken !== k && (A = !0), (O = (m = this.opt).onFinally) === null || O === void 0 || O.call(m, { ok: T, canceled: A, error: H }, ...i);
      }
    });
    switch (this.opt.concurrency) {
      case "parallel":
        return r(s());
      case "restart":
        return this.cancel(), r(s());
      case "queue": {
        const n = this.opt.queueLimit;
        if (typeof n == "number" && n > 0 && this.queue.length >= n)
          return Promise.resolve(void 0);
        const o = {
          promise: Promise.resolve(void 0),
          resolve: dt,
          reject: dt,
          canceled: !1,
          settled: !1
        }, l = this.activeCount === 0 && this.queue.length === 0;
        o.promise = new Promise((y, m) => {
          o.resolve = y, o.reject = m;
        }), this.queue.push(o);
        const c = () => vt(this, void 0, void 0, function* () {
          if (o.settled)
            return;
          if (o.canceled || this.isDisposed) {
            o.settled = !0, o.resolve(void 0);
            return;
          }
          const y = this.queue.indexOf(o);
          y >= 0 && this.queue.splice(y, 1);
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
function Ee(t, i) {
  return new Ae(t, i);
}
function ti(t, i) {
  const a = Ut(t), r = /* @__PURE__ */ new Set(), s = i?.onCancel;
  return Ee((...o) => {
    const l = a(...o);
    r.add(l);
    const c = () => {
      r.delete(l);
    };
    return l.then(c, c), new Promise((u, y) => {
      l.then(u, (m) => {
        if ($t(m)) {
          u(void 0);
          return;
        }
        y(m);
      });
    });
  }, Object.assign(Object.assign({}, i), { onCancel: () => {
    var o;
    for (const l of r)
      (o = l.cancel) === null || o === void 0 || o.call(l);
    s?.();
  } }));
}
function ei(t) {
  return function(...i) {
    return B(() => t.apply(this, i));
  };
}
export {
  X as GetService,
  $e as GetStore,
  ae as Inject,
  Qe as InjectStore,
  ze as MakeObservable,
  ye as Model,
  We as PropFromView,
  Yt as Service,
  Ke as SetService,
  Je as Store,
  Ge as StoreBase,
  Le as TODO,
  Xe as ViewModel,
  Ee as asyncCommand,
  _e as attachModelDevtools,
  Ie as attachStoreDevtools,
  ei as commandAction,
  L as defineMetadata,
  He as define_prop,
  qe as exclude,
  St as field,
  ti as flowCommand,
  se as getExecutingFunctionNameByStack,
  K as getOwnMetadata,
  xe as isSerializable,
  Ne as submit,
  Be as validation,
  Ze as view
};
//# sourceMappingURL=index.js.map
