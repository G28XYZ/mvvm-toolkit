import "reflect-metadata";
import { d as ut, _ as L, a as F, b as U, c as D } from "./tslib.es6-B_Omq7a0.js";
import Ct, { isObject as Dt, isEqual as Mt, isEmpty as xt } from "lodash";
import { makeObservable as ht, reaction as Pt, runInAction as G, observable as it, isObservable as wt, computed as X, action as C, flow as Lt, isFlowCancellationError as Ft, makeAutoObservable as Kt } from "mobx";
import { enablePatches as Ht, immerable as St, createDraft as zt, applyPatches as It, produce as qt } from "immer";
import { observer as Yt } from "mobx-react";
import { useMemo as Bt, useEffect as Nt } from "react";
const K = (t, e, r) => Reflect.getOwnMetadata(t, e) || r || {}, x = (t, e, r) => Reflect.defineMetadata(t, e, r);
function ke(...t) {
  try {
    return JSON.stringify(t), !0;
  } catch {
    return !1;
  }
}
function Gt(t) {
  if (t && typeof t == "string") {
    let [e] = t.split(`
`)[2].replace(/at (get)?/, "").match(/.*/g) || [];
    return e && (e = e.trim()), e;
  }
}
const At = {}, lt = [];
let kt = !1;
const Te = (t, ...e) => {
  const r = new Error().stack;
  if (!kt)
    console.log("%c TODO", "background: #222; color: #bada55", At), kt = !0;
  else {
    const n = Gt(r);
    lt.includes(n) === !1 && (lt.push(n), Reflect.set(At, `${lt.length}) ${t}`, { msg: e, get path() {
      return console.info(e, n), n;
    } }));
  }
  function o(...n) {
  }
  return o;
}, Y = (t, e) => !!t && (typeof e == "string" || typeof e == "symbol"), q = (t) => !!t && typeof t == "object" && "kind" in t, Wt = (t) => ({
  kind: "class",
  name: t,
  addInitializer: () => {
  },
  metadata: {}
}), J = /* @__PURE__ */ Symbol("service-key"), ft = new Proxy({}, Reflect);
function Ut(t) {
  const e = (o, n) => {
    Object.defineProperty(o, n, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, n))
          return Reflect.get(this, n);
        const s = Z(t, "instance");
        if (s)
          return Object.defineProperty(this, n, { value: s, writable: !0, configurable: !0, enumerable: !0 }), s;
      },
      set(s) {
        const a = Z(t, "instance");
        Object.defineProperty(this, n, { value: a ?? s, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  };
  function r(o, n) {
    if (Y(o, n)) {
      e(o, n);
      return;
    }
    return n.addInitializer(function() {
      return ut(this, void 0, void 0, function* () {
        const s = Z(t, "instance");
        s && Object.hasOwn(this, n.name) && Reflect.set(this, n.name, s);
      });
    }), (s) => s;
  }
  return r;
}
function Z(t, e) {
  var r;
  const o = K(J, ft);
  if (typeof t != "string") {
    const n = K(J, t);
    if (n)
      return e && e in n ? n[e] : n;
    for (const s in o) {
      const a = o[s];
      if (a.target === t) {
        t = a.context.name;
        break;
      }
    }
  }
  if (typeof t == "string")
    return e ? (r = o[t]) === null || r === void 0 ? void 0 : r[e] : o[t];
}
function Vt(t, e) {
  const r = (n, s) => {
    const a = String(typeof t == "string" && t || typeof t == "object" && t?.id || s?.name || n?.name), l = K(J, ft), d = new Proxy({
      target: n,
      instance: typeof t == "object" && Reflect.get(t, "transient") || typeof t == "object" && Reflect.get(t, "lazy") ? n : new n(),
      context: s,
      options: t
    }, {
      get(u, f, _) {
        var g, m;
        if (f === "instance" && (!((g = u?.options) === null || g === void 0) && g.transient))
          return new n();
        if (f === "instance" && (!((m = u?.options) === null || m === void 0) && m.lazy) && u.instance === n) {
          const I = new n();
          return Reflect.set(u, f, I, _), I;
        }
        return Reflect.get(u, f, _);
      },
      set(u, f, _, g) {
        return Reflect.set(u, f, _, g);
      }
    });
    l[a] = d, x(J, l, ft), x(J, l[a], n);
  };
  function o(n, s) {
    var a, l;
    const d = n.__legacy_source__, u = q(s) ? s : Wt((l = (a = d?.name) !== null && a !== void 0 ? a : n?.name) !== null && l !== void 0 ? l : "");
    r(n, u), d && d !== n && x(J, K(J, n), d);
  }
  return Ct.isFunction(t) ? o(t, e) : t ? (n, s) => o(n, s) : o;
}
const Ee = (t, e) => {
  const { kind: r = "class", name: o = "", addInitializer: n = () => {
  }, metadata: s } = e?.ctx || {};
  return Vt(e)(t, {
    kind: r,
    name: o,
    addInitializer: n,
    metadata: s
  }), Z(t).instance;
};
function ct(t) {
  var e, r, o;
  const n = Object.assign({ enumerable: !1, writable: !0 }, t), s = Object.assign({ configurable: !0, enumerable: !1, writable: !0 }, t), a = {
    configurable: (e = s.configurable) !== null && e !== void 0 ? e : !0,
    enumerable: (r = s.enumerable) !== null && r !== void 0 ? r : !1,
    writable: (o = s.writable) !== null && o !== void 0 ? o : !0,
    value: void 0
  };
  return function(l, d) {
    if (Y(l, d)) {
      Object.defineProperty(l, d, {
        configurable: !0,
        enumerable: n.enumerable,
        get() {
        },
        set(u) {
          a.value = u, Object.defineProperty(this, d, a), a.value = void 0;
        }
      });
      return;
    }
    if (q(d)) {
      const u = d;
      return u.kind === "field" ? function(f) {
        return a.value = f, Object.defineProperty(this, u.name, a), a.value = void 0, f;
      } : (u.addInitializer(function() {
        const f = Object.getOwnPropertyDescriptor(this, u.name);
        f && Object.defineProperty(this, u.name, Object.assign(Object.assign({}, f), { enumerable: n.enumerable }));
      }), l);
    }
  };
}
function je(t, e) {
  return Y(t, e) || q(e) ? ct()(t, e) : ct(t);
}
function Pe(t, e) {
  const r = (s) => class extends s {
    constructor(...a) {
      super(...a), ht(this);
    }
  }, o = (s, a) => {
    if (typeof Reflect?.getOwnMetadataKeys == "function")
      for (const l of Reflect.getOwnMetadataKeys(s)) {
        const d = Reflect.getOwnMetadata(l, s);
        Reflect.defineMetadata(l, d, a);
      }
  };
  function n(s, a) {
    if (!q(a)) {
      const l = s, d = r(l);
      return Object.defineProperty(d, "__legacy_source__", { value: l, configurable: !0 }), o(l, d), d;
    }
    a.addInitializer(function() {
      ht(this);
    });
  }
  return t && !q(e) || t ? n(t, e) : n;
}
const $t = /* @__PURE__ */ Symbol("field-key"), Qt = /* @__PURE__ */ Symbol("validation-key"), Jt = /* @__PURE__ */ Symbol("submit-key"), Xt = /* @__PURE__ */ Symbol("exclude-key"), Zt = /* @__PURE__ */ Symbol("prop-from-view-key");
class tt {
  isPrototypeObject(e) {
    const r = e?.constructor;
    return !!(r && r.prototype === e);
  }
  /**
   * Получить объект, по которому кешируются метаданные.
   * Для инстанса — это его prototype, для prototype — он сам.
   */
  getCacheTarget(e) {
    return !e || typeof e != "object" ? null : this.isPrototypeObject(e) ? e : Object.getPrototypeOf(e);
  }
  computeFromPrototype(e) {
    const r = [], o = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
    let s = e;
    for (; s; ) {
      const l = Reflect.getOwnMetadata(this.metadataKey, s);
      if (Array.isArray(l))
        for (const d of l) {
          const u = d?.name, f = String(u);
          n.has(f) || (n.add(f), r.push(d), o.set(f, d));
        }
      s = Object.getPrototypeOf(s);
    }
    return { ownRef: Reflect.getOwnMetadata(this.metadataKey, e), list: r, map: o };
  }
  /**
   * Создать базовые метаданные.
   */
  constructor(e = {}) {
    this.metadataKey = null, this.cache = /* @__PURE__ */ new WeakMap(), this.name = e?.name, this.callback = e?.callback;
  }
  /**
   * Проверить, что данные соответствуют экземпляру метаданных.
   */
  isInstance(e = {}) {
    return e instanceof tt || Object.getOwnPropertyNames(this).some((r) => Object.keys(e).includes(r));
  }
  /**
   * Получить метаданные конкретного поля модели.
   */
  fieldInstance(e, r) {
    const o = r && typeof r == "object" ? Reflect.getOwnMetadata(this.metadataKey, r) : void 0;
    if (Array.isArray(o))
      return o.find((l) => l.name === e);
    const n = this.getCacheTarget(r);
    if (!n)
      return;
    const s = Reflect.getOwnMetadata(this.metadataKey, n), a = this.cache.get(n);
    if (!a || a.ownRef !== s) {
      const l = this.computeFromPrototype(n);
      return this.cache.set(n, l), l.map.get(String(e));
    }
    return a.map.get(String(e));
  }
  /**
   * Получить массив метаданных полей модели.
   */
  fields(e) {
    const r = e && typeof e == "object" ? Reflect.getOwnMetadata(this.metadataKey, e) : void 0;
    if (Array.isArray(r)) {
      const l = [], d = /* @__PURE__ */ new Set();
      let u = e;
      for (; u; ) {
        const f = Reflect.getOwnMetadata(this.metadataKey, u);
        if (Array.isArray(f))
          for (const _ of f) {
            const g = _?.name, m = String(g);
            d.has(m) || (d.add(m), l.push(_));
          }
        u = Object.getPrototypeOf(u);
      }
      return l;
    }
    const o = this.getCacheTarget(e);
    if (!o)
      return [];
    const n = Reflect.getOwnMetadata(this.metadataKey, o), s = this.cache.get(o);
    if (s && s.ownRef === n)
      return s.list;
    const a = this.computeFromPrototype(o);
    return this.cache.set(o, a), a.list;
  }
}
class _t extends tt {
  constructor() {
    super(...arguments), this.metadataKey = Qt;
  }
}
class yt extends tt {
  constructor() {
    super(...arguments), this.metadataKey = Jt;
  }
}
class vt extends tt {
  constructor() {
    super(...arguments), this.metadataKey = Xt;
  }
}
class mt extends tt {
  /**
   * Создать метаданные поля модели.
   */
  constructor(e = {}) {
    super(e), this.factory = null, this.mapping = null, this.noObserve = null, this.collectChanges = !1, this.name = null, this.ctx = null, this.metadataKey = $t, this.factory = e.factory, this.mapping = e.mapping, this.noObserve = e.noObserve, this.name = e.name, this.ctx = e.ctx, this.collectChanges = !!e.collectChanges;
  }
}
class gt extends tt {
  /**
   * Создать метаданные для PropFromView.
   */
  constructor(e = {}) {
    super(e), this.metadataKey = Zt;
    for (const r in this)
      e && r in e && (this[r] = Reflect.get(e, r));
  }
}
function Ve(t) {
  const e = (n, s) => {
    const a = new gt({ name: t, originName: String(s) });
    a.name = t, a.originName = String(s);
    const l = K(a.metadataKey, n, new Array());
    x(a.metadataKey, [...l, a], n);
  }, r = (n) => {
    n.addInitializer(function() {
      const s = new gt(), a = s.fields(this);
      for (const l in this)
        a instanceof Array && n.name === l && (s.name = t, s.originName = l, s.value = this[l], a.push(s));
      x(s.metadataKey, a, this);
    });
  };
  function o(n, s) {
    if (Y(n, s)) {
      e(n, s);
      return;
    }
    if (q(s))
      return r(s), s.kind === "field" ? (a) => a : s;
  }
  return t ? ((n, s) => o(n, s)) : ((n) => n);
}
function Re(t) {
  const e = (n, s) => {
    const a = new vt({ callback: t, name: String(s) }), l = K(a.metadataKey, n, new Array());
    x(a.metadataKey, [...l, a], n);
  }, r = (n) => {
    n.addInitializer(function() {
      const s = new vt({ callback: t, name: String(n.name) }), a = K(s.metadataKey, this, new Array());
      x(s.metadataKey, [...a, s], this);
    });
  };
  function o(n, s) {
    if (Y(n, s)) {
      e(n, s);
      return;
    }
    if (q(s))
      return r(s), s.kind === "field" ? void 0 : s;
  }
  if (t)
    return ((n, s) => o(n, s));
}
const te = () => {
  var t;
  return (t = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && t !== void 0 ? t : null;
}, ee = () => {
  var t;
  return (t = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && t !== void 0 ? t : 0;
}, nt = (t) => {
  var e, r;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((e = o.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0) + 1;
  try {
    return t();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((r = o.__MVVM_DEVTOOLS_APPLYING__) !== null && r !== void 0 ? r : 1) - 1);
  }
}, ie = () => ee() > 0, Tt = (t) => ({
  data: t.service.dumpData,
  historyIndex: t.service.historyIndex
}), ne = (t, e = {}) => {
  const r = te();
  if (!r)
    return () => {
    };
  const o = r.connect({ name: e.name, instanceId: e.instanceId });
  let n = !1;
  try {
    o.init(Tt(t));
  } catch {
  }
  const s = Pt(() => Tt(t), (l) => {
    var d;
    if (!(n || ie()))
      try {
        o.send({ type: (d = e.actionType) !== null && d !== void 0 ? d : "model:update" }, l);
      } catch {
      }
  }), a = o.subscribe((l) => {
    var d;
    if (l.type !== "DISPATCH")
      return;
    const u = (d = l.payload) === null || d === void 0 ? void 0 : d.type;
    if (u === "RESET") {
      n = !0, nt(() => {
        try {
          t.service.toInit();
        } finally {
          n = !1;
        }
      });
      return;
    }
    if (u === "COMMIT") {
      n = !0, nt(() => {
        try {
          t.service.commit();
        } finally {
          n = !1;
        }
      });
      return;
    }
    if (u === "ROLLBACK") {
      n = !0, nt(() => {
        try {
          t.service.toInit();
        } finally {
          n = !1;
        }
      });
      return;
    }
    if (u === "JUMP_TO_ACTION" || u === "JUMP_TO_STATE") {
      if (!l.state)
        return;
      try {
        const f = JSON.parse(l.state), _ = f.historyIndex, g = t.service.history, m = Array.isArray(g) && g.length > 0, I = typeof _ == "number" && (_ === -1 && m || _ >= 0 && m && _ < g.length);
        n = !0, nt(() => {
          var p;
          try {
            if (I) {
              t.service.goToHistory(_);
              return;
            }
            const T = (p = f.data) !== null && p !== void 0 ? p : f;
            G(() => {
              t.service.loadData(T);
            });
          } finally {
            n = !1;
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
Ht();
const se = new yt(), W = new mt(), ae = new _t(), re = new vt();
let oe = (() => {
  var t, e, r, o, n, s, a, l, d, u, f, _, g, m, I;
  let p = [], T, H = [], B = [], P, M, c, b, w, V, A, R, z, $, Q, et;
  return t = class {
    // @define_prop
    get [(e = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), d = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap(), f = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new WeakMap(), g = /* @__PURE__ */ new WeakMap(), m = St)]() {
      return L(this, e, "f");
    }
    set [m](i) {
      F(this, e, i, "f");
    }
    get initData() {
      return L(this, r, "f");
    }
    set initData(i) {
      F(this, r, i, "f");
    }
    // @define_prop
    get committedData() {
      return L(this, o, "f");
    }
    set committedData(i) {
      F(this, o, i, "f");
    }
    // @define_prop
    get modified_() {
      return L(this, n, "f");
    }
    set modified_(i) {
      F(this, n, i, "f");
    }
    // @define_prop
    get draft() {
      return L(this, s, "f");
    }
    set draft(i) {
      F(this, s, i, "f");
    }
    // @define_prop
    get changes() {
      return L(this, a, "f");
    }
    set changes(i) {
      F(this, a, i, "f");
    }
    // @define_prop
    get inverseChanges() {
      return L(this, l, "f");
    }
    set inverseChanges(i) {
      F(this, l, i, "f");
    }
    // @define_prop
    get history() {
      return L(this, d, "f");
    }
    set history(i) {
      F(this, d, i, "f");
    }
    // @define_prop
    get historyIndex() {
      return L(this, u, "f");
    }
    set historyIndex(i) {
      F(this, u, i, "f");
    }
    // @define_prop
    get legacyInitDone() {
      return L(this, f, "f");
    }
    set legacyInitDone(i) {
      F(this, f, i, "f");
    }
    // @define_prop
    get options() {
      return L(this, _, "f");
    }
    set options(i) {
      F(this, _, i, "f");
    }
    // @define_prop
    get historyMuted() {
      return L(this, g, "f");
    }
    set historyMuted(i) {
      F(this, g, i, "f");
    }
    /**
     * Создает модель и инициализирует данные.
     */
    constructor(i = {}, h) {
      e.set(this, (U(this, p), !0)), r.set(this, U(this, H, null)), o.set(this, (U(this, B), {})), n.set(this, {}), s.set(this, null), a.set(this, []), l.set(this, []), d.set(this, []), u.set(this, -1), f.set(this, !1), _.set(this, {}), g.set(this, !1), this.options = h, this[St] = !0, this.init(i), this.initLegacyFields(), this.autoAttachDevtools();
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
      if (i)
        Reflect.get(this.validation, i);
      else
        for (let h in this.validation)
          this.validation[h];
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
      const y = W.fieldInstance(i, this);
      if (y) {
        i in this.initData || Reflect.set(this.initData, i, Reflect.get(this, i));
        const v = y?.factory ? y.factory(this.initData, this) : this.initData[y.name];
        this.defineFieldValue(i, v, y), h?.skipValidation || this.initValidation(i);
      }
    }
    initLegacyFields() {
      if (this.legacyInitDone)
        return;
      const i = W.fields(this);
      if (i.some((h) => Object.prototype.hasOwnProperty.call(this, h.name))) {
        this.legacyInitDone = !0;
        for (let h of i)
          this.initData && String(h.name) in this.initData || !W.fieldInstance(String(h.name), this) || this.initField(String(h.name), { skipValidation: !0 });
      }
    }
    /**
     * Создать draft для отслеживания изменений.
     */
    createDraft(i) {
      this.draft = zt(i);
    }
    autoAttachDevtools() {
      var i, h, y, v, O, j, S, k, N, at, rt;
      const ot = globalThis;
      if (!ot.__MVVM_DEVTOOLS_AUTO__ || ((h = (i = this.options) === null || i === void 0 ? void 0 : i.devtools) === null || h === void 0 ? void 0 : h.enabled) === !1)
        return;
      const pt = (S = (O = (v = (y = this.options) === null || y === void 0 ? void 0 : y.devtools) === null || v === void 0 ? void 0 : v.name) !== null && O !== void 0 ? O : (j = this.constructor) === null || j === void 0 ? void 0 : j.name) !== null && S !== void 0 ? S : "Model", Ot = ((k = ot.__MVVM_DEVTOOLS_SEQ__) !== null && k !== void 0 ? k : 0) + 1;
      ot.__MVVM_DEVTOOLS_SEQ__ = Ot, ne(this, { name: pt, instanceId: (rt = (at = (N = this.options) === null || N === void 0 ? void 0 : N.devtools) === null || at === void 0 ? void 0 : at.instanceId) !== null && rt !== void 0 ? rt : `${pt}#${Ot}` });
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
      It(this.draft, i);
      const h = new Set(i.map((y) => y.field).filter(Boolean));
      h.size !== 0 && this.withHistoryMuted(() => {
        var y;
        for (let v of h) {
          const O = (y = Reflect.get(this.draft, v)) !== null && y !== void 0 ? y : Reflect.get(this.initData, v);
          Reflect.set(this, v, O), this.defineFieldValue(v, Reflect.get(this, v));
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
    produceDraft(i, h, y) {
      if (this.historyMuted)
        return;
      let v, O = [];
      i && (v = i.split(".")[0], v && !W.fieldInstance(v, this).collectChanges) || (qt(this.draft, (j) => {
        if (i) {
          let S = j;
          const k = i.split(".");
          if (k.length > 1)
            for (let N = 0; N < k.length && !(N != k.length - 1 && !Dt(S)); N++)
              Dt(S) && (S = S[k[N]]);
          else
            y = i;
          S && (S[y] = h);
        }
      }, (j, S) => {
        v && (j = j.map((k) => Object.assign(Object.assign({}, k), { field: v })), S = S.map((k) => Object.assign(Object.assign({}, k), { field: v }))), O = j, !(!j.length && !S.length) && (this.historyIndex < this.history.length - 1 && (this.history = this.history.slice(0, this.historyIndex + 1), this.syncChangesFromHistory()), this.changes.push(...j), this.inverseChanges.push(...S), this.history.push({ patches: j, inversePatches: S }), this.historyIndex = this.history.length - 1);
      }), O.length && It(this.draft, O));
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
    createObservable(i, h, y, v = y) {
      return i = wt(i) ? i : it.box(i), new Proxy(i, {
        get: (O, j, S) => {
          const k = Reflect.get(O, j, S);
          return k && typeof k == "object" && !(k instanceof t) && !wt(i) ? this.createObservable(k, String(j), h, `${v}.${String(j)}`) : k;
        },
        set: (O, j, S, k) => (i = S, this.produceDraft(v, i, String(j)), this.checkChange(y, Reflect.get(this, y)), Reflect.set(O, j, S, k))
      });
    }
    /**
     * Определить getter/setter для поля модели.
     */
    defineFieldValue(i, h, y = W.fieldInstance(i, this)) {
      return y.noObserve ? Reflect.defineProperty(this, y.name, { value: h }) : (h = it.box(h), Reflect.defineProperty(this, y.name, {
        get: () => h.get(),
        set: (v) => {
          G(() => h.set(v)), this.produceDraft(y.name, h.get()), this.checkChange(y.name, h.get());
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
      const y = Reflect.get(this.committedData, i) || Reflect.get(this.initData, i), v = i && i in this.initData && !Mt(y, h);
      return G(() => {
        v && Reflect.set(this.modified_, i, y);
        for (const O in this.modified_)
          i === O && i in this.modified_ && Mt(y, h) && delete this.modified_[O];
      }), v;
    }
    /**
     * Применить данные к полям модели.
     */
    defineData(i) {
      for (let h in this)
        Object.prototype.hasOwnProperty.call(this, h) && W.fieldInstance(h, this) && (Reflect.set(this, h, Reflect.get(i, h)), this.initField(h));
    }
    /**
     * Признак наличия изменений.
     */
    get dirty() {
      return !xt(this.modified_);
    }
    /**
     * Зафиксировать все изменения.
     */
    commit() {
      for (let i of W.fields(this))
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
        for (let i in this)
          i in this.initData && (this[i] = Reflect.get(this.initData, i), this.initField(i));
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
        this.init(i), this.defineData(this.initData);
      }), this;
    }
    /**
     * Получить сериализованный дамп данных.
     */
    get dumpData() {
      this.initLegacyFields();
      const i = /* @__PURE__ */ Object.create({}), h = (v) => {
        try {
          return se.fieldInstance(v, this).callback(Reflect.get(this, v), this);
        } catch {
          return Reflect.get(this, v);
        }
      }, y = (v) => {
        const O = re.fieldInstance(v, this);
        if (O)
          switch (typeof O.callback) {
            case "boolean":
              return !!O.callback;
            case "function":
              return O.callback(Reflect.get(this, v), this);
          }
        return !1;
      };
      return W.fields(this).forEach((v) => {
        var O;
        if (v.name in this)
          return !((O = this.options) === null || O === void 0) && O.byFields && !this.options.byFields.includes(v.name) || y(v.name) ? void 0 : Reflect.set(i, v.name, h(v.name));
      }), i;
    }
    /**
     * Получить объект результатов валидации.
     */
    get validation() {
      this.initLegacyFields();
      const i = {};
      for (const h in this) {
        const y = ae.fieldInstance(h, this);
        y && Reflect.set(i, h, y.callback(this[h], this) || "");
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
    const E = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    T = [it], P = [C], M = [X], c = [C], b = [C], w = [C], V = [C], A = [C], R = [C], z = [C], $ = [X], Q = [X], et = [(I = X).struct.bind(I)], D(t, null, T, { kind: "accessor", name: "initData", static: !1, private: !1, access: { has: (i) => "initData" in i, get: (i) => i.initData, set: (i, h) => {
      i.initData = h;
    } }, metadata: E }, H, B), D(t, null, P, { kind: "method", name: "produceDraft", static: !1, private: !1, access: { has: (i) => "produceDraft" in i, get: (i) => i.produceDraft }, metadata: E }, null, p), D(t, null, M, { kind: "getter", name: "dirty", static: !1, private: !1, access: { has: (i) => "dirty" in i, get: (i) => i.dirty }, metadata: E }, null, p), D(t, null, c, { kind: "method", name: "commit", static: !1, private: !1, access: { has: (i) => "commit" in i, get: (i) => i.commit }, metadata: E }, null, p), D(t, null, b, { kind: "method", name: "commitField", static: !1, private: !1, access: { has: (i) => "commitField" in i, get: (i) => i.commitField }, metadata: E }, null, p), D(t, null, w, { kind: "method", name: "reject", static: !1, private: !1, access: { has: (i) => "reject" in i, get: (i) => i.reject }, metadata: E }, null, p), D(t, null, V, { kind: "method", name: "toInit", static: !1, private: !1, access: { has: (i) => "toInit" in i, get: (i) => i.toInit }, metadata: E }, null, p), D(t, null, A, { kind: "method", name: "undo", static: !1, private: !1, access: { has: (i) => "undo" in i, get: (i) => i.undo }, metadata: E }, null, p), D(t, null, R, { kind: "method", name: "redo", static: !1, private: !1, access: { has: (i) => "redo" in i, get: (i) => i.redo }, metadata: E }, null, p), D(t, null, z, { kind: "method", name: "goToHistory", static: !1, private: !1, access: { has: (i) => "goToHistory" in i, get: (i) => i.goToHistory }, metadata: E }, null, p), D(t, null, $, { kind: "getter", name: "validation", static: !1, private: !1, access: { has: (i) => "validation" in i, get: (i) => i.validation }, metadata: E }, null, p), D(t, null, Q, { kind: "getter", name: "validAndDirty", static: !1, private: !1, access: { has: (i) => "validAndDirty" in i, get: (i) => i.validAndDirty }, metadata: E }, null, p), D(t, null, et, { kind: "getter", name: "service", static: !1, private: !1, access: { has: (i) => "service" in i, get: (i) => i.service }, metadata: E }, null, p), E && Object.defineProperty(t, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: E });
  })(), t;
})();
const le = () => {
  var t;
  const e = globalThis;
  return !!((t = e.__MVVM_DEVTOOLS_HISTORY__) !== null && t !== void 0 ? t : e.__MVVM_DEVTOOLS_AUTO__);
}, ce = (t) => le() ? !t || typeof t != "object" ? { collectChanges: !0 } : "collectChanges" in t ? t : Object.assign(Object.assign({}, t), { collectChanges: !0 }) : t;
function Et(t, e) {
  const r = ce(Y(t, e) ? void 0 : t), o = (a, l) => {
    const d = new mt(Object.assign(Object.assign({}, r), { name: String(l), ctx: null })), u = K(d.metadataKey, a, new Array());
    x(d.metadataKey, [...u, d], a), Object.getOwnPropertyDescriptor(a, l) || Object.defineProperty(a, l, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, l))
          return Reflect.get(this, l);
        if (this.initData && l in this.initData && typeof this.initField == "function")
          return this.initField.call(this, String(l), { skipValidation: !0 }), Reflect.get(this, l);
      },
      set(_) {
        if (this.initData && !(l in this.initData) && Reflect.set(this.initData, l, _), typeof this.initField == "function") {
          this.initField.call(this, String(l), { skipValidation: !0 });
          return;
        }
        Object.defineProperty(this, l, { value: _, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  }, n = (a) => {
    a.addInitializer(function() {
      if (this instanceof oe && typeof this.initField == "function") {
        const l = new mt(Object.assign(Object.assign({}, r), { name: String(a.name), ctx: a })), d = K(l.metadataKey, this, new Array());
        x(l.metadataKey, [...d, l], this), this.initField.call(this, String(a.name));
      }
    });
  };
  function s(a, l) {
    if (Y(a, l)) {
      o(a, l);
      return;
    }
    if (q(l))
      return n(l), l.kind === "field" ? (d) => d : l;
  }
  return Y(t, e) ? s(t, e) : r && !q(e) ? (a, l) => s(a, l) : q(e) ? s(void 0, e) : (a, l) => s(a, l);
}
const de = (t) => !t || typeof t != "object" ? { noObserve: !0 } : Object.assign(Object.assign({}, t), { noObserve: !0 });
(function(t) {
  t.noObserve = (function(r, o) {
    return Y(r, o) || q(o) ? t({ noObserve: !0 })(r, o) : t(de(r));
  });
})(Et || (Et = {}));
function xe(t) {
  const e = (n, s) => {
    const a = new yt({ callback: t, name: String(s) }), l = K(a.metadataKey, n, new Array());
    x(a.metadataKey, [...l, a], n);
  }, r = (n) => {
    const s = new yt({ callback: t, name: String(n.name) });
    n.addInitializer(function() {
      const a = K(s.metadataKey, this, new Array());
      x(s.metadataKey, [...a, s], this);
    });
  };
  function o(n, s) {
    if (Y(n, s)) {
      e(n, s);
      return;
    }
    if (q(s))
      return r(s), s.kind === "field" ? (a) => a : s;
  }
  return t ? ((n, s) => o(n, s)) : ((n) => n);
}
function Le(t) {
  const e = (n, s) => {
    const a = new _t({ callback: t, name: String(s) }), l = K(a.metadataKey, n, new Array());
    x(a.metadataKey, [...l, a], n);
  }, r = (n) => {
    const s = new _t({ callback: t, name: String(n.name) });
    n.addInitializer(function() {
      const a = K(s.metadataKey, this, new Array());
      x(s.metadataKey, [...a, s], this);
    });
  };
  function o(n, s) {
    if (Y(n, s)) {
      e(n, s);
      return;
    }
    if (q(s))
      return r(s), s.kind === "field" ? (a) => a : s;
  }
  return t ? ((n, s) => o(n, s)) : ((n) => n);
}
const Rt = /* @__PURE__ */ Symbol("store-key"), ue = () => {
  var t;
  return (t = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && t !== void 0 ? t : null;
}, he = () => {
  var t;
  return (t = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && t !== void 0 ? t : 0;
}, fe = (t) => {
  var e, r;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((e = o.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0) + 1;
  try {
    return t();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((r = o.__MVVM_DEVTOOLS_APPLYING__) !== null && r !== void 0 ? r : 1) - 1);
  }
}, _e = () => he() > 0, bt = (t) => ({
  items: t.items.map((e) => {
    var r, o;
    return {
      name: (o = (r = e.constructor) === null || r === void 0 ? void 0 : r.name) !== null && o !== void 0 ? o : "Model",
      data: e.service.dumpData,
      historyIndex: e.service.historyIndex
    };
  })
}), ye = (t) => !!(t && typeof t == "object" && Array.isArray(t.items)), ve = (t) => {
  if (!t)
    return null;
  try {
    const e = JSON.parse(t);
    return ye(e) ? e : null;
  } catch {
    return null;
  }
}, me = (t, e = {}) => {
  var r, o;
  const n = ue();
  if (!n)
    return () => {
    };
  const s = n.connect({ name: e.name, instanceId: e.instanceId });
  let a = !1, l = (o = (r = t.items[0]) === null || r === void 0 ? void 0 : r.constructor) !== null && o !== void 0 ? o : null;
  try {
    s.init(bt(t));
  } catch {
  }
  const d = Pt(() => bt(t), (_) => {
    var g;
    if (a || _e())
      return;
    const m = (g = t.items[0]) === null || g === void 0 ? void 0 : g.constructor;
    m && (l = m);
    try {
      s.send({ type: "store:update" }, _);
    } catch {
    }
  }), u = (_) => (a = !0, fe(() => {
    try {
      return _();
    } finally {
      a = !1;
    }
  })), f = s.subscribe((_) => {
    var g;
    if (_.type !== "DISPATCH")
      return;
    const m = (g = _.payload) === null || g === void 0 ? void 0 : g.type;
    if (m === "RESET" || m === "ROLLBACK") {
      u(() => t.reset());
      return;
    }
    if (m === "JUMP_TO_ACTION" || m === "JUMP_TO_STATE") {
      const I = ve(_.state);
      if (!I)
        return;
      u(() => {
        var p, T, H;
        if (I.items.length === t.items.length && t.items.every((b) => {
          var w, V;
          return typeof ((w = b?.service) === null || w === void 0 ? void 0 : w.goToHistory) == "function" || typeof ((V = b?.service) === null || V === void 0 ? void 0 : V.loadData) == "function";
        })) {
          G(() => {
            I.items.forEach((b, w) => {
              var V;
              const A = (V = t.items[w]) === null || V === void 0 ? void 0 : V.service, R = b.historyIndex, z = A?.history;
              if (Array.isArray(z) && z.length > 0 && typeof R == "number" && typeof A?.goToHistory == "function" && (R === -1 && z.length > 0 || R < z.length)) {
                A.goToHistory(R);
                return;
              }
              typeof A?.loadData == "function" && A.loadData(b.data);
            });
          });
          return;
        }
        const P = (T = (p = t.items[0]) === null || p === void 0 ? void 0 : p.constructor) !== null && T !== void 0 ? T : l, M = I.items.map((b) => b.data);
        if (P) {
          t.applyLoaded(M, { model: P, cash: !1 }), l = P;
          return;
        }
        t.applyLoaded(M, { cash: !1 });
        const c = (H = t.items[0]) === null || H === void 0 ? void 0 : H.constructor;
        c && (l = c);
      });
    }
  });
  return () => {
    d(), typeof f == "function" && f(), typeof s.unsubscribe == "function" && s.unsubscribe(), typeof s.disconnect == "function" && s.disconnect();
  };
};
let Fe = (() => {
  var t, e, r;
  let o = [], n, s = [], a = [], l, d = [], u = [], f, _, g, m, I, p, T, H, B, P;
  return t = class {
    get items() {
      return L(this, e, "f");
    }
    set items(c) {
      F(this, e, c, "f");
    }
    get _cash() {
      return L(this, r, "f");
    }
    set _cash(c) {
      F(this, r, c, "f");
    }
    constructor() {
      e.set(this, (U(this, o), U(this, s, []))), r.set(this, (U(this, a), U(this, d, []))), U(this, u), ht(this), this.autoAttachDevtools();
    }
    add(c) {
      this.items.push(c);
    }
    addMany(c) {
      c?.length && (this.items = this.items.concat(c));
    }
    remove(c) {
      this.items = this.items.filter((b) => b !== c);
    }
    /**
     * Найти элемент по предикату.
     */
    find(c) {
      return this.items.find(c);
    }
    /**
     * Отфильтровать элементы по предикату.
     */
    filter(c) {
      return this.items.filter(c);
    }
    /**
     * Найти элемент по id (или любому полю-ключу).
     */
    findBy(c, b) {
      return this.items.find((w) => w?.[c] === b);
    }
    clear() {
      this.items = [];
    }
    get size() {
      return this.items.length;
    }
    get snapshot() {
      return bt(this);
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
    applyLoaded(c, b = {}) {
      const { model: w, mode: V = "replace", cash: A = !0 } = b;
      if (A && this.setCash(c), V === "append") {
        const R = w ? c.map((z) => new w(z)) : c;
        this.addMany(R);
        return;
      }
      this.items = w ? c.map((R) => new w(R)) : c;
    }
    /**
     * Сохранить оригинальные данные стора.
     */
    setCash(c) {
      this._cash = c ?? [];
    }
    autoAttachDevtools() {
      var c, b, w, V, A, R, z, $;
      const Q = globalThis;
      if (!Q.__MVVM_DEVTOOLS_AUTO__)
        return;
      const et = K(Rt, this.constructor, {}) || {};
      if (((c = et.devtools) === null || c === void 0 ? void 0 : c.enabled) === !1)
        return;
      const E = (A = (w = (b = et.devtools) === null || b === void 0 ? void 0 : b.name) !== null && w !== void 0 ? w : (V = this.constructor) === null || V === void 0 ? void 0 : V.name) !== null && A !== void 0 ? A : "Store", i = ((R = Q.__MVVM_DEVTOOLS_STORE_SEQ__) !== null && R !== void 0 ? R : 0) + 1;
      Q.__MVVM_DEVTOOLS_STORE_SEQ__ = i;
      const h = ($ = (z = et.devtools) === null || z === void 0 ? void 0 : z.instanceId) !== null && $ !== void 0 ? $ : `${E}#${i}`;
      me(this, { name: E, instanceId: h });
    }
  }, e = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), (() => {
    const M = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    n = [it], l = [it], f = [C], _ = [C], g = [C], m = [C], I = [X], p = [X], T = [X], H = [C], B = [C], P = [C], D(t, null, n, { kind: "accessor", name: "items", static: !1, private: !1, access: { has: (c) => "items" in c, get: (c) => c.items, set: (c, b) => {
      c.items = b;
    } }, metadata: M }, s, a), D(t, null, l, { kind: "accessor", name: "_cash", static: !1, private: !1, access: { has: (c) => "_cash" in c, get: (c) => c._cash, set: (c, b) => {
      c._cash = b;
    } }, metadata: M }, d, u), D(t, null, f, { kind: "method", name: "add", static: !1, private: !1, access: { has: (c) => "add" in c, get: (c) => c.add }, metadata: M }, null, o), D(t, null, _, { kind: "method", name: "addMany", static: !1, private: !1, access: { has: (c) => "addMany" in c, get: (c) => c.addMany }, metadata: M }, null, o), D(t, null, g, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (c) => "remove" in c, get: (c) => c.remove }, metadata: M }, null, o), D(t, null, m, { kind: "method", name: "clear", static: !1, private: !1, access: { has: (c) => "clear" in c, get: (c) => c.clear }, metadata: M }, null, o), D(t, null, I, { kind: "getter", name: "size", static: !1, private: !1, access: { has: (c) => "size" in c, get: (c) => c.size }, metadata: M }, null, o), D(t, null, p, { kind: "getter", name: "snapshot", static: !1, private: !1, access: { has: (c) => "snapshot" in c, get: (c) => c.snapshot }, metadata: M }, null, o), D(t, null, T, { kind: "getter", name: "cash", static: !1, private: !1, access: { has: (c) => "cash" in c, get: (c) => c.cash }, metadata: M }, null, o), D(t, null, H, { kind: "method", name: "reset", static: !1, private: !1, access: { has: (c) => "reset" in c, get: (c) => c.reset }, metadata: M }, null, o), D(t, null, B, { kind: "method", name: "applyLoaded", static: !1, private: !1, access: { has: (c) => "applyLoaded" in c, get: (c) => c.applyLoaded }, metadata: M }, null, o), D(t, null, P, { kind: "method", name: "setCash", static: !1, private: !1, access: { has: (c) => "setCash" in c, get: (c) => c.setCash }, metadata: M }, null, o), M && Object.defineProperty(t, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: M });
  })(), t;
})();
function He(t) {
  return Z(t, "instance");
}
function ze(t) {
  return ((e, r) => Ut(t)(e, r));
}
function qe(t, e) {
  const r = (o, n) => {
    var s;
    const a = typeof t == "string" ? { id: t } : typeof t == "object" ? t : { id: (s = n?.name) !== null && s !== void 0 ? s : o?.name };
    x(Rt, a, o), Vt(a)(o, n);
  };
  return typeof t == "function" ? r(t, e) : (o, n) => r(o, n);
}
class Ye {
}
const dt = new gt();
function Be(t, e) {
  return Yt((r = {}) => {
    const { resolved: o, instance: n } = Bt(() => {
      const a = Z(t) || (typeof t != "string" ? { instance: new t() } : void 0), l = a?.instance;
      return { resolved: a, instance: l };
    }, [t]);
    if (Nt(() => {
      if (n)
        return typeof n.onInit == "function" && n.onInit(), () => {
          typeof n.onDispose == "function" && n.onDispose();
        };
    }, [n]), o) {
      const s = dt.fields(n), a = s.length > 0 ? s : dt.fields(Object.getPrototypeOf(n));
      for (const l in r)
        if (a instanceof Array) {
          const d = a.find((u) => u.name === l);
          d && Reflect.set(n, d.originName, Reflect.get(r, l));
        }
      return x(dt.metadataKey, a, n), e(Object.assign({ viewModel: n }, r));
    }
    return e(Object.assign({}, r));
  });
}
const jt = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, ge = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, st = () => {
};
class be {
  constructor(e, r) {
    var o, n, s, a, l, d, u;
    this.isExecuting = !1, this.activeCount = 0, this.isCanceled = !1, this.isDisposed = !1, this.error = null, this.controllers = /* @__PURE__ */ new Set(), this.queue = [], this.runningPromise = null, this.queueTail = Promise.resolve(), this.cancelToken = 0, this.fn = e, this.opt = Object.assign({ concurrency: (o = r?.concurrency) !== null && o !== void 0 ? o : "ignore", trackError: (n = r?.trackError) !== null && n !== void 0 ? n : !0, resetErrorOnExecute: (s = r?.resetErrorOnExecute) !== null && s !== void 0 ? s : !0, swallowError: (a = r?.swallowError) !== null && a !== void 0 ? a : !0, abortable: (l = r?.abortable) !== null && l !== void 0 ? l : !1 }, r), this.states = Object.assign(Object.assign({}, jt), (d = r?.states) !== null && d !== void 0 ? d : {}), this.stateKeys = Object.assign(Object.assign({}, ge), (u = r?.stateKeys) !== null && u !== void 0 ? u : {}), Kt(this, {
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
    var r, o;
    const n = (r = this.stateKeys[e]) !== null && r !== void 0 ? r : e;
    return (o = this.states[n]) !== null && o !== void 0 ? o : jt[e];
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
    var e, r;
    this.cancelToken += 1, this.isCanceled = !0, (r = (e = this.opt).onCancel) === null || r === void 0 || r.call(e), this.opt.cancelQueued && this.clearQueue();
    for (const o of this.controllers)
      o.abort();
  }
  dispose() {
    this.isDisposed || (this.isDisposed = !0, this.clearQueue(), this.cancel());
  }
  clearQueue() {
    if (this.queue.length === 0)
      return;
    const e = this.queue.splice(0, this.queue.length);
    for (const r of e)
      r.canceled = !0, r.settled || (r.settled = !0, r.resolve(void 0));
  }
  execute(...e) {
    var r;
    if (this.isDisposed)
      return Promise.resolve(void 0);
    if (!this.canExecute)
      return (r = this.runningPromise) !== null && r !== void 0 ? r : Promise.resolve(void 0);
    const o = (s) => {
      this.runningPromise = s;
      const a = () => {
        this.runningPromise === s && (this.runningPromise = null);
      };
      return s.then(a, a), s;
    }, n = () => ut(this, void 0, void 0, function* () {
      var s, a, l, d, u, f, _, g;
      if (this.isDisposed)
        return;
      const m = this.opt.abortable ? new AbortController() : null;
      m && this.controllers.add(m), G(() => {
        this.activeCount += 1, this.isExecuting = this.activeCount > 0, this.isCanceled = !1, this.opt.trackError && this.opt.resetErrorOnExecute && (this.error = null);
      });
      const I = this.cancelToken;
      let p = !1, T = !1, H = null, B = null;
      try {
        (a = (s = this.opt).onStart) === null || a === void 0 || a.call(s, ...e);
        const P = this.opt.abortable ? m.signal : void 0;
        B = this.fn(...e, P);
        const M = yield B;
        return T = this.cancelToken !== I, T ? void 0 : ((d = (l = this.opt).onSuccess) === null || d === void 0 || d.call(l, M, ...e), p = !0, M);
      } catch (P) {
        if (this.opt.abortable && m?.signal.aborted) {
          G(() => {
            this.isCanceled = !0;
          }), T = !0, H = null;
          return;
        }
        if (H = P, T = this.cancelToken !== I, this.opt.trackError && G(() => {
          this.error = P;
        }), (f = (u = this.opt).onError) === null || f === void 0 || f.call(u, P), !this.opt.swallowError)
          throw P;
        return;
      } finally {
        G(() => {
          this.activeCount = Math.max(0, this.activeCount - 1), this.isExecuting = this.activeCount > 0;
        }), m && this.controllers.delete(m), !T && this.cancelToken !== I && (T = !0), (g = (_ = this.opt).onFinally) === null || g === void 0 || g.call(_, { ok: p, canceled: T, error: H }, ...e);
      }
    });
    switch (this.opt.concurrency) {
      case "parallel":
        return o(n());
      case "restart":
        return this.cancel(), o(n());
      case "queue": {
        const s = this.opt.queueLimit;
        if (typeof s == "number" && s > 0 && this.queue.length >= s)
          return Promise.resolve(void 0);
        const a = {
          promise: Promise.resolve(void 0),
          resolve: st,
          reject: st,
          canceled: !1,
          settled: !1
        }, l = this.activeCount === 0 && this.queue.length === 0;
        a.promise = new Promise((f, _) => {
          a.resolve = f, a.reject = _;
        }), this.queue.push(a);
        const d = () => ut(this, void 0, void 0, function* () {
          if (a.settled)
            return;
          if (a.canceled || this.isDisposed) {
            a.settled = !0, a.resolve(void 0);
            return;
          }
          const f = this.queue.indexOf(a);
          f >= 0 && this.queue.splice(f, 1);
          try {
            const _ = yield n();
            a.settled || (a.settled = !0, a.resolve(_));
          } catch (_) {
            a.settled || (a.settled = !0, a.reject(_));
          }
        }), u = l ? d() : this.queueTail.then(d, d);
        return this.queueTail = u.then(st, st), o(a.promise);
      }
      default:
        return this.isExecuting && this.runningPromise ? this.runningPromise : o(n());
    }
  }
}
function pe(t, e) {
  return new be(t, e);
}
function Ne(t, e) {
  const r = Lt(t), o = /* @__PURE__ */ new Set(), n = e?.onCancel;
  return pe((...a) => {
    const l = r(...a);
    o.add(l);
    const d = () => {
      o.delete(l);
    };
    return l.then(d, d), new Promise((u, f) => {
      l.then(u, (_) => {
        if (Ft(_)) {
          u(void 0);
          return;
        }
        f(_);
      });
    });
  }, Object.assign(Object.assign({}, e), { onCancel: () => {
    var a;
    for (const l of o)
      (a = l.cancel) === null || a === void 0 || a.call(l);
    n?.();
  } }));
}
function Ge(t) {
  return function(...e) {
    return G(() => t.apply(this, e));
  };
}
export {
  Z as GetService,
  He as GetStore,
  Ut as Inject,
  ze as InjectStore,
  Pe as MakeObservable,
  oe as Model,
  Ve as PropFromView,
  Vt as Service,
  Ee as SetService,
  qe as Store,
  Fe as StoreBase,
  Te as TODO,
  Ye as ViewModel,
  pe as asyncCommand,
  ne as attachModelDevtools,
  me as attachStoreDevtools,
  Ge as commandAction,
  x as defineMetadata,
  je as define_prop,
  Re as exclude,
  Et as field,
  Ne as flowCommand,
  Gt as getExecutingFunctionNameByStack,
  K as getOwnMetadata,
  ke as isSerializable,
  xe as submit,
  Le as validation,
  Be as view
};
