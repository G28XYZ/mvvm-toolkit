import "reflect-metadata";
import { d as ut, _ as x, a as F, b as U, c as D } from "./tslib.es6-B_Omq7a0.js";
import Ct, { isObject as Mt, isEqual as wt, isEmpty as Lt } from "lodash";
import { makeObservable as ht, reaction as Pt, runInAction as G, observable as it, isObservable as St, computed as X, action as C, flow as xt, isFlowCancellationError as Ft, makeAutoObservable as Ht } from "mobx";
import { enablePatches as Kt, immerable as It, createDraft as zt, applyPatches as At, produce as qt } from "immer";
import { observer as Yt } from "mobx-react";
import { useMemo as Bt, useEffect as Nt } from "react";
const H = (t, e, a) => Reflect.getOwnMetadata(t, e) || a || {}, L = (t, e, a) => Reflect.defineMetadata(t, e, a);
function Ee(...t) {
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
const kt = {}, lt = [];
let Et = !1;
const Te = (t, ...e) => {
  const a = new Error().stack;
  if (!Et)
    console.log("%c TODO", "background: #222; color: #bada55", kt), Et = !0;
  else {
    const s = Gt(a);
    lt.includes(s) === !1 && (lt.push(s), Reflect.set(kt, `${lt.length}) ${t}`, { msg: e, get path() {
      return console.info(e, s), s;
    } }));
  }
  function o(...s) {
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
  const e = (o, s) => {
    Object.defineProperty(o, s, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, s))
          return Reflect.get(this, s);
        const n = Z(t, "instance");
        if (n)
          return Object.defineProperty(this, s, { value: n, writable: !0, configurable: !0, enumerable: !0 }), n;
      },
      set(n) {
        const r = Z(t, "instance");
        Object.defineProperty(this, s, { value: r ?? n, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  };
  function a(o, s) {
    if (Y(o, s)) {
      e(o, s);
      return;
    }
    return s.addInitializer(function() {
      return ut(this, void 0, void 0, function* () {
        const n = Z(t, "instance");
        n && Object.hasOwn(this, s.name) && Reflect.set(this, s.name, n);
      });
    }), (n) => n;
  }
  return a;
}
function Z(t, e) {
  var a;
  const o = H(J, ft);
  if (typeof t != "string") {
    const s = H(J, t);
    if (s)
      return e && e in s ? s[e] : s;
    for (const n in o) {
      const r = o[n];
      if (r.target === t) {
        t = r.context.name;
        break;
      }
    }
  }
  if (typeof t == "string")
    return e ? (a = o[t]) === null || a === void 0 ? void 0 : a[e] : o[t];
}
function Vt(t, e) {
  const a = (s, n) => {
    const r = String(typeof t == "string" && t || typeof t == "object" && t?.id || n?.name || s?.name), l = H(J, ft), c = new Proxy({
      target: s,
      instance: typeof t == "object" && Reflect.get(t, "transient") || typeof t == "object" && Reflect.get(t, "lazy") ? s : new s(),
      context: n,
      options: t
    }, {
      get(u, f, _) {
        var g, m;
        if (f === "instance" && (!((g = u?.options) === null || g === void 0) && g.transient))
          return new s();
        if (f === "instance" && (!((m = u?.options) === null || m === void 0) && m.lazy) && u.instance === s) {
          const I = new s();
          return Reflect.set(u, f, I, _), I;
        }
        return Reflect.get(u, f, _);
      },
      set(u, f, _, g) {
        return Reflect.set(u, f, _, g);
      }
    });
    l[r] = c, L(J, l, ft), L(J, l[r], s);
  };
  function o(s, n) {
    var r, l;
    const c = s.__legacy_source__, u = q(n) ? n : Wt((l = (r = c?.name) !== null && r !== void 0 ? r : s?.name) !== null && l !== void 0 ? l : "");
    a(s, u), c && c !== s && L(J, H(J, s), c);
  }
  return Ct.isFunction(t) ? o(t, e) : t ? (s, n) => o(s, n) : o;
}
const je = (t, e) => {
  const { kind: a = "class", name: o = "", addInitializer: s = () => {
  }, metadata: n } = e?.ctx || {};
  return Vt(e)(t, {
    kind: a,
    name: o,
    addInitializer: s,
    metadata: n
  }), Z(t).instance;
};
function ct(t) {
  var e, a, o;
  const s = Object.assign({ enumerable: !1, writable: !0 }, t), n = Object.assign({ configurable: !0, enumerable: !1, writable: !0 }, t), r = {
    configurable: (e = n.configurable) !== null && e !== void 0 ? e : !0,
    enumerable: (a = n.enumerable) !== null && a !== void 0 ? a : !1,
    writable: (o = n.writable) !== null && o !== void 0 ? o : !0,
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
          r.value = u, Object.defineProperty(this, c, r), r.value = void 0;
        }
      });
      return;
    }
    if (q(c)) {
      const u = c;
      return u.kind === "field" ? function(f) {
        return r.value = f, Object.defineProperty(this, u.name, r), r.value = void 0, f;
      } : (u.addInitializer(function() {
        const f = Object.getOwnPropertyDescriptor(this, u.name);
        f && Object.defineProperty(this, u.name, Object.assign(Object.assign({}, f), { enumerable: s.enumerable }));
      }), l);
    }
  };
}
function Pe(t, e) {
  return Y(t, e) || q(e) ? ct()(t, e) : ct(t);
}
function Ve(t, e) {
  const a = (n) => class extends n {
    constructor(...r) {
      super(...r), ht(this);
    }
  }, o = (n, r) => {
    if (typeof Reflect?.getOwnMetadataKeys == "function")
      for (const l of Reflect.getOwnMetadataKeys(n)) {
        const c = Reflect.getOwnMetadata(l, n);
        Reflect.defineMetadata(l, c, r);
      }
  };
  function s(n, r) {
    if (!q(r)) {
      const l = n, c = a(l);
      return Object.defineProperty(c, "__legacy_source__", { value: l, configurable: !0 }), o(l, c), c;
    }
    r.addInitializer(function() {
      ht(this);
    });
  }
  return t && !q(e) || t ? s(t, e) : s;
}
const $t = /* @__PURE__ */ Symbol("field-key"), Qt = /* @__PURE__ */ Symbol("validation-key"), Jt = /* @__PURE__ */ Symbol("submit-key"), Xt = /* @__PURE__ */ Symbol("exclude-key"), Zt = /* @__PURE__ */ Symbol("prop-from-view-key");
class tt {
  isPrototypeObject(e) {
    const a = e?.constructor;
    return !!(a && a.prototype === e);
  }
  /**
   * Получить объект, по которому кешируются метаданные.
   * Для инстанса — это его prototype, для prototype — он сам.
   */
  getCacheTarget(e) {
    return !e || typeof e != "object" ? null : this.isPrototypeObject(e) ? e : Object.getPrototypeOf(e);
  }
  computeFromPrototype(e) {
    const a = [], o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
    let n = e;
    for (; n; ) {
      const l = Reflect.getOwnMetadata(this.metadataKey, n);
      if (Array.isArray(l))
        for (const c of l) {
          const u = c?.name, f = String(u);
          s.has(f) || (s.add(f), a.push(c), o.set(f, c));
        }
      n = Object.getPrototypeOf(n);
    }
    return { ownRef: Reflect.getOwnMetadata(this.metadataKey, e), list: a, map: o };
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
    return e instanceof tt || Object.getOwnPropertyNames(this).some((a) => Object.keys(e).includes(a));
  }
  /**
   * Получить метаданные конкретного поля модели.
   */
  fieldInstance(e, a) {
    const o = a && typeof a == "object" ? Reflect.getOwnMetadata(this.metadataKey, a) : void 0;
    if (Array.isArray(o))
      return o.find((l) => l.name === e);
    const s = this.getCacheTarget(a);
    if (!s)
      return;
    const n = Reflect.getOwnMetadata(this.metadataKey, s), r = this.cache.get(s);
    if (!r || r.ownRef !== n) {
      const l = this.computeFromPrototype(s);
      return this.cache.set(s, l), l.map.get(String(e));
    }
    return r.map.get(String(e));
  }
  /**
   * Получить массив метаданных полей модели.
   */
  fields(e) {
    const a = e && typeof e == "object" ? Reflect.getOwnMetadata(this.metadataKey, e) : void 0;
    if (Array.isArray(a)) {
      const l = [], c = /* @__PURE__ */ new Set();
      let u = e;
      for (; u; ) {
        const f = Reflect.getOwnMetadata(this.metadataKey, u);
        if (Array.isArray(f))
          for (const _ of f) {
            const g = _?.name, m = String(g);
            c.has(m) || (c.add(m), l.push(_));
          }
        u = Object.getPrototypeOf(u);
      }
      return l;
    }
    const o = this.getCacheTarget(e);
    if (!o)
      return [];
    const s = Reflect.getOwnMetadata(this.metadataKey, o), n = this.cache.get(o);
    if (n && n.ownRef === s)
      return n.list;
    const r = this.computeFromPrototype(o);
    return this.cache.set(o, r), r.list;
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
    super(e), this.factory = null, this.mapping = null, this.noObserve = null, this.collectChanges = !1, this.name = null, this.ctx = null, this.metadataKey = $t, this.isInit = !1, this.factory = e.factory, this.mapping = e.mapping, this.noObserve = e.noObserve, this.name = e.name, this.ctx = e.ctx, this.collectChanges = !!e.collectChanges;
  }
}
class gt extends tt {
  /**
   * Создать метаданные для PropFromView.
   */
  constructor(e = {}) {
    super(e), this.metadataKey = Zt;
    for (const a in this)
      e && a in e && (this[a] = Reflect.get(e, a));
  }
}
function Re(t) {
  const e = (s, n) => {
    const r = new gt({ name: t, originName: String(n) });
    r.name = t, r.originName = String(n);
    const l = H(r.metadataKey, s, new Array());
    L(r.metadataKey, [...l, r], s);
  }, a = (s) => {
    s.addInitializer(function() {
      const n = new gt(), r = n.fields(this);
      for (const l in this)
        r instanceof Array && s.name === l && (n.name = t, n.originName = l, n.value = this[l], r.push(n));
      L(n.metadataKey, r, this);
    });
  };
  function o(s, n) {
    if (Y(s, n)) {
      e(s, n);
      return;
    }
    if (q(n))
      return a(n), n.kind === "field" ? (r) => r : n;
  }
  return t ? ((s, n) => o(s, n)) : ((s) => s);
}
function Ce(t) {
  const e = (s, n) => {
    const r = new vt({ callback: t, name: String(n) }), l = H(r.metadataKey, s, new Array());
    L(r.metadataKey, [...l, r], s);
  }, a = (s) => {
    s.addInitializer(function() {
      const n = new vt({ callback: t, name: String(s.name) }), r = H(n.metadataKey, this, new Array());
      L(n.metadataKey, [...r, n], this);
    });
  };
  function o(s, n) {
    if (Y(s, n)) {
      e(s, n);
      return;
    }
    if (q(n))
      return a(n), n.kind === "field" ? void 0 : n;
  }
  if (t)
    return ((s, n) => o(s, n));
}
const te = () => {
  var t;
  return (t = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && t !== void 0 ? t : null;
}, ee = () => {
  var t;
  return (t = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && t !== void 0 ? t : 0;
}, st = (t) => {
  var e, a;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((e = o.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0) + 1;
  try {
    return t();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((a = o.__MVVM_DEVTOOLS_APPLYING__) !== null && a !== void 0 ? a : 1) - 1);
  }
}, ie = () => ee() > 0, Tt = (t) => ({
  data: t.service.dumpData,
  historyIndex: t.service.historyIndex
}), se = (t, e = {}) => {
  const a = te();
  if (!a)
    return () => {
    };
  const o = a.connect({ name: e.name, instanceId: e.instanceId });
  let s = !1;
  try {
    o.init(Tt(t));
  } catch {
  }
  const n = Pt(() => Tt(t), (l) => {
    var c;
    if (!(s || ie()))
      try {
        o.send({ type: (c = e.actionType) !== null && c !== void 0 ? c : "model:update" }, l);
      } catch {
      }
  }), r = o.subscribe((l) => {
    var c;
    if (l.type !== "DISPATCH")
      return;
    const u = (c = l.payload) === null || c === void 0 ? void 0 : c.type;
    if (u === "RESET") {
      s = !0, st(() => {
        try {
          t.service.toInit();
        } finally {
          s = !1;
        }
      });
      return;
    }
    if (u === "COMMIT") {
      s = !0, st(() => {
        try {
          t.service.commit();
        } finally {
          s = !1;
        }
      });
      return;
    }
    if (u === "ROLLBACK") {
      s = !0, st(() => {
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
        const f = JSON.parse(l.state), _ = f.historyIndex, g = t.service.history, m = Array.isArray(g) && g.length > 0, I = typeof _ == "number" && (_ === -1 && m || _ >= 0 && m && _ < g.length);
        s = !0, st(() => {
          var p;
          try {
            if (I) {
              t.service.goToHistory(_);
              return;
            }
            const E = (p = f.data) !== null && p !== void 0 ? p : f;
            G(() => {
              t.service.loadData(E);
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
    n(), typeof r == "function" && r(), typeof o.unsubscribe == "function" && o.unsubscribe(), typeof o.disconnect == "function" && o.disconnect();
  };
};
Kt();
const ne = new yt(), W = new mt(), ae = new _t(), re = new vt();
let oe = (() => {
  var t, e, a, o, s, n, r, l, c, u, f, _, g, m, I;
  let p = [], E, K = [], B = [], P, M, d, b, w, V, A, R, z, $, Q, et;
  return t = class {
    // @define_prop
    get [(e = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap(), f = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new WeakMap(), g = /* @__PURE__ */ new WeakMap(), m = It)]() {
      return x(this, e, "f");
    }
    set [m](i) {
      F(this, e, i, "f");
    }
    get initData() {
      return x(this, a, "f");
    }
    set initData(i) {
      F(this, a, i, "f");
    }
    // @define_prop
    get committedData() {
      return x(this, o, "f");
    }
    set committedData(i) {
      F(this, o, i, "f");
    }
    // @define_prop
    get modified_() {
      return x(this, s, "f");
    }
    set modified_(i) {
      F(this, s, i, "f");
    }
    // @define_prop
    get draft() {
      return x(this, n, "f");
    }
    set draft(i) {
      F(this, n, i, "f");
    }
    // @define_prop
    get changes() {
      return x(this, r, "f");
    }
    set changes(i) {
      F(this, r, i, "f");
    }
    // @define_prop
    get inverseChanges() {
      return x(this, l, "f");
    }
    set inverseChanges(i) {
      F(this, l, i, "f");
    }
    // @define_prop
    get history() {
      return x(this, c, "f");
    }
    set history(i) {
      F(this, c, i, "f");
    }
    // @define_prop
    get historyIndex() {
      return x(this, u, "f");
    }
    set historyIndex(i) {
      F(this, u, i, "f");
    }
    // @define_prop
    get legacyInitDone() {
      return x(this, f, "f");
    }
    set legacyInitDone(i) {
      F(this, f, i, "f");
    }
    // @define_prop
    get options() {
      return x(this, _, "f");
    }
    set options(i) {
      F(this, _, i, "f");
    }
    // @define_prop
    get historyMuted() {
      return x(this, g, "f");
    }
    set historyMuted(i) {
      F(this, g, i, "f");
    }
    /**
     * Создает модель и инициализирует данные.
     */
    constructor(i = {}, h) {
      e.set(this, (U(this, p), !0)), a.set(this, U(this, K, null)), o.set(this, (U(this, B), {})), s.set(this, {}), n.set(this, null), r.set(this, []), l.set(this, []), c.set(this, []), u.set(this, -1), f.set(this, !1), _.set(this, {}), g.set(this, !1), this.options = h, this[It] = !0, this.init(i), this.initLegacyFields(), this.autoAttachDevtools();
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
      const Ot = (S = (O = (v = (y = this.options) === null || y === void 0 ? void 0 : y.devtools) === null || v === void 0 ? void 0 : v.name) !== null && O !== void 0 ? O : (j = this.constructor) === null || j === void 0 ? void 0 : j.name) !== null && S !== void 0 ? S : "Model", Dt = ((k = ot.__MVVM_DEVTOOLS_SEQ__) !== null && k !== void 0 ? k : 0) + 1;
      ot.__MVVM_DEVTOOLS_SEQ__ = Dt, se(this, { name: Ot, instanceId: (rt = (at = (N = this.options) === null || N === void 0 ? void 0 : N.devtools) === null || at === void 0 ? void 0 : at.instanceId) !== null && rt !== void 0 ? rt : `${Ot}#${Dt}` });
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
      At(this.draft, i);
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
            for (let N = 0; N < k.length && !(N != k.length - 1 && !Mt(S)); N++)
              Mt(S) && (S = S[k[N]]);
          else
            y = i;
          S && (S[y] = h);
        }
      }, (j, S) => {
        v && (j = j.map((k) => Object.assign(Object.assign({}, k), { field: v })), S = S.map((k) => Object.assign(Object.assign({}, k), { field: v }))), O = j, !(!j.length && !S.length) && (this.historyIndex < this.history.length - 1 && (this.history = this.history.slice(0, this.historyIndex + 1), this.syncChangesFromHistory()), this.changes.push(...j), this.inverseChanges.push(...S), this.history.push({ patches: j, inversePatches: S }), this.historyIndex = this.history.length - 1);
      }), O.length && At(this.draft, O));
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
      return i = St(i) ? i : it.box(i), new Proxy(i, {
        get: (O, j, S) => {
          const k = Reflect.get(O, j, S);
          return k && typeof k == "object" && !(k instanceof t) && !St(i) ? this.createObservable(k, String(j), h, `${v}.${String(j)}`) : k;
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
      const y = Reflect.get(this.committedData, i) || Reflect.get(this.initData, i), v = i && i in this.initData && !wt(y, h);
      return G(() => {
        v && Reflect.set(this.modified_, i, y);
        for (const O in this.modified_)
          i === O && i in this.modified_ && wt(y, h) && delete this.modified_[O];
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
      return !Lt(this.modified_);
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
          return ne.fieldInstance(v, this).callback(Reflect.get(this, v), this);
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
    const T = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    E = [it], P = [C], M = [X], d = [C], b = [C], w = [C], V = [C], A = [C], R = [C], z = [C], $ = [X], Q = [X], et = [(I = X).struct.bind(I)], D(t, null, E, { kind: "accessor", name: "initData", static: !1, private: !1, access: { has: (i) => "initData" in i, get: (i) => i.initData, set: (i, h) => {
      i.initData = h;
    } }, metadata: T }, K, B), D(t, null, P, { kind: "method", name: "produceDraft", static: !1, private: !1, access: { has: (i) => "produceDraft" in i, get: (i) => i.produceDraft }, metadata: T }, null, p), D(t, null, M, { kind: "getter", name: "dirty", static: !1, private: !1, access: { has: (i) => "dirty" in i, get: (i) => i.dirty }, metadata: T }, null, p), D(t, null, d, { kind: "method", name: "commit", static: !1, private: !1, access: { has: (i) => "commit" in i, get: (i) => i.commit }, metadata: T }, null, p), D(t, null, b, { kind: "method", name: "commitField", static: !1, private: !1, access: { has: (i) => "commitField" in i, get: (i) => i.commitField }, metadata: T }, null, p), D(t, null, w, { kind: "method", name: "reject", static: !1, private: !1, access: { has: (i) => "reject" in i, get: (i) => i.reject }, metadata: T }, null, p), D(t, null, V, { kind: "method", name: "toInit", static: !1, private: !1, access: { has: (i) => "toInit" in i, get: (i) => i.toInit }, metadata: T }, null, p), D(t, null, A, { kind: "method", name: "undo", static: !1, private: !1, access: { has: (i) => "undo" in i, get: (i) => i.undo }, metadata: T }, null, p), D(t, null, R, { kind: "method", name: "redo", static: !1, private: !1, access: { has: (i) => "redo" in i, get: (i) => i.redo }, metadata: T }, null, p), D(t, null, z, { kind: "method", name: "goToHistory", static: !1, private: !1, access: { has: (i) => "goToHistory" in i, get: (i) => i.goToHistory }, metadata: T }, null, p), D(t, null, $, { kind: "getter", name: "validation", static: !1, private: !1, access: { has: (i) => "validation" in i, get: (i) => i.validation }, metadata: T }, null, p), D(t, null, Q, { kind: "getter", name: "validAndDirty", static: !1, private: !1, access: { has: (i) => "validAndDirty" in i, get: (i) => i.validAndDirty }, metadata: T }, null, p), D(t, null, et, { kind: "getter", name: "service", static: !1, private: !1, access: { has: (i) => "service" in i, get: (i) => i.service }, metadata: T }, null, p), T && Object.defineProperty(t, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: T });
  })(), t;
})();
const le = () => {
  var t;
  const e = globalThis;
  return !!((t = e.__MVVM_DEVTOOLS_HISTORY__) !== null && t !== void 0 ? t : e.__MVVM_DEVTOOLS_AUTO__);
}, ce = (t) => le() ? !t || typeof t != "object" ? { collectChanges: !0 } : "collectChanges" in t ? t : Object.assign(Object.assign({}, t), { collectChanges: !0 }) : t, bt = function(e, a) {
  const o = ce(Y(e, a) ? void 0 : e), s = (l, c) => {
    const u = new mt(Object.assign(Object.assign({}, o), { name: String(c), ctx: null }));
    L(u.metadataKey, [...H(u.metadataKey, l, new Array()), u], l), Object.getOwnPropertyDescriptor(l, c) || Object.defineProperty(l, c, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, c))
          return Reflect.get(this, c);
        if (this.initData && c in this.initData && typeof this.initField == "function")
          return this.initField.call(this, String(c), { skipValidation: !0 }), Reflect.get(this, c);
      },
      set(_) {
        if (this.initData && !(c in this.initData) && Reflect.set(this.initData, c, _), typeof this.initField == "function") {
          this.initField.call(this, String(c), { skipValidation: !0 });
          return;
        }
        Object.defineProperty(this, c, {
          value: _,
          writable: !0,
          configurable: !0,
          enumerable: !0
        });
      }
    });
  }, n = (l) => {
    l.addInitializer(function() {
      if (this instanceof oe && typeof this.initField == "function") {
        const c = new mt(Object.assign(Object.assign({}, o), { name: String(l.name), ctx: l }));
        L(c.metadataKey, [...H(c.metadataKey, this, new Array()), c], this), this.initField.call(this, String(l.name));
      }
    });
  };
  function r(l, c) {
    if (Y(l, c)) {
      s(l, c);
      return;
    }
    if (q(c))
      return n(c), c.kind === "field" ? (u) => u : c;
  }
  return Y(e, a) ? r(e, a) : o && !q(a) ? (l, c) => r(l, c) : q(a) ? r(void 0, a) : (l, c) => r(l, c);
}, de = (t) => !t || typeof t != "object" ? { noObserve: !0 } : Object.assign(Object.assign({}, t), { noObserve: !0 }), ue = function(e, a) {
  return Y(e, a) || q(a) ? bt({ noObserve: !0 })(e, a) : bt(de(e));
};
bt.noObserve = ue;
function xe(t) {
  const e = (s, n) => {
    const r = new yt({ callback: t, name: String(n) }), l = H(r.metadataKey, s, new Array());
    L(r.metadataKey, [...l, r], s);
  }, a = (s) => {
    const n = new yt({ callback: t, name: String(s.name) });
    s.addInitializer(function() {
      const r = H(n.metadataKey, this, new Array());
      L(n.metadataKey, [...r, n], this);
    });
  };
  function o(s, n) {
    if (Y(s, n)) {
      e(s, n);
      return;
    }
    if (q(n))
      return a(n), n.kind === "field" ? (r) => r : n;
  }
  return t ? ((s, n) => o(s, n)) : ((s) => s);
}
function Fe(t) {
  const e = (s, n) => {
    const r = new _t({ callback: t, name: String(n) }), l = H(r.metadataKey, s, new Array());
    L(r.metadataKey, [...l, r], s);
  }, a = (s) => {
    const n = new _t({ callback: t, name: String(s.name) });
    s.addInitializer(function() {
      const r = H(n.metadataKey, this, new Array());
      L(n.metadataKey, [...r, n], this);
    });
  };
  function o(s, n) {
    if (Y(s, n)) {
      e(s, n);
      return;
    }
    if (q(n))
      return a(n), n.kind === "field" ? (r) => r : n;
  }
  return t ? ((s, n) => o(s, n)) : ((s) => s);
}
const Rt = /* @__PURE__ */ Symbol("store-key"), he = () => {
  var t;
  return (t = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && t !== void 0 ? t : null;
}, fe = () => {
  var t;
  return (t = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && t !== void 0 ? t : 0;
}, _e = (t) => {
  var e, a;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((e = o.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0) + 1;
  try {
    return t();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((a = o.__MVVM_DEVTOOLS_APPLYING__) !== null && a !== void 0 ? a : 1) - 1);
  }
}, ye = () => fe() > 0, pt = (t) => ({
  items: t.items.map((e) => {
    var a, o;
    return {
      name: (o = (a = e.constructor) === null || a === void 0 ? void 0 : a.name) !== null && o !== void 0 ? o : "Model",
      data: e.service.dumpData,
      historyIndex: e.service.historyIndex
    };
  })
}), ve = (t) => !!(t && typeof t == "object" && Array.isArray(t.items)), me = (t) => {
  if (!t)
    return null;
  try {
    const e = JSON.parse(t);
    return ve(e) ? e : null;
  } catch {
    return null;
  }
}, ge = (t, e = {}) => {
  var a, o;
  const s = he();
  if (!s)
    return () => {
    };
  const n = s.connect({ name: e.name, instanceId: e.instanceId });
  let r = !1, l = (o = (a = t.items[0]) === null || a === void 0 ? void 0 : a.constructor) !== null && o !== void 0 ? o : null;
  try {
    n.init(pt(t));
  } catch {
  }
  const c = Pt(() => pt(t), (_) => {
    var g;
    if (r || ye())
      return;
    const m = (g = t.items[0]) === null || g === void 0 ? void 0 : g.constructor;
    m && (l = m);
    try {
      n.send({ type: "store:update" }, _);
    } catch {
    }
  }), u = (_) => (r = !0, _e(() => {
    try {
      return _();
    } finally {
      r = !1;
    }
  })), f = n.subscribe((_) => {
    var g;
    if (_.type !== "DISPATCH")
      return;
    const m = (g = _.payload) === null || g === void 0 ? void 0 : g.type;
    if (m === "RESET" || m === "ROLLBACK") {
      u(() => t.reset());
      return;
    }
    if (m === "JUMP_TO_ACTION" || m === "JUMP_TO_STATE") {
      const I = me(_.state);
      if (!I)
        return;
      u(() => {
        var p, E, K;
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
        const P = (E = (p = t.items[0]) === null || p === void 0 ? void 0 : p.constructor) !== null && E !== void 0 ? E : l, M = I.items.map((b) => b.data);
        if (P) {
          t.applyLoaded(M, { model: P, cash: !1 }), l = P;
          return;
        }
        t.applyLoaded(M, { cash: !1 });
        const d = (K = t.items[0]) === null || K === void 0 ? void 0 : K.constructor;
        d && (l = d);
      });
    }
  });
  return () => {
    c(), typeof f == "function" && f(), typeof n.unsubscribe == "function" && n.unsubscribe(), typeof n.disconnect == "function" && n.disconnect();
  };
};
let He = (() => {
  var t, e, a;
  let o = [], s, n = [], r = [], l, c = [], u = [], f, _, g, m, I, p, E, K, B, P;
  return t = class {
    get items() {
      return x(this, e, "f");
    }
    set items(d) {
      F(this, e, d, "f");
    }
    get _cash() {
      return x(this, a, "f");
    }
    set _cash(d) {
      F(this, a, d, "f");
    }
    constructor() {
      e.set(this, (U(this, o), U(this, n, []))), a.set(this, (U(this, r), U(this, c, []))), U(this, u), ht(this), this.autoAttachDevtools();
    }
    add(d) {
      this.items.push(d);
    }
    addMany(d) {
      d?.length && (this.items = this.items.concat(d));
    }
    remove(d) {
      this.items = this.items.filter((b) => b !== d);
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
    findBy(d, b) {
      return this.items.find((w) => w?.[d] === b);
    }
    clear() {
      this.items = [];
    }
    get size() {
      return this.items.length;
    }
    get snapshot() {
      return pt(this);
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
    applyLoaded(d, b = {}) {
      const { model: w, mode: V = "replace", cash: A = !0 } = b;
      if (A && this.setCash(d), V === "append") {
        const R = w ? d.map((z) => new w(z)) : d;
        this.addMany(R);
        return;
      }
      this.items = w ? d.map((R) => new w(R)) : d;
    }
    /**
     * Сохранить оригинальные данные стора.
     */
    setCash(d) {
      this._cash = d ?? [];
    }
    autoAttachDevtools() {
      var d, b, w, V, A, R, z, $;
      const Q = globalThis;
      if (!Q.__MVVM_DEVTOOLS_AUTO__)
        return;
      const et = H(Rt, this.constructor, {}) || {};
      if (((d = et.devtools) === null || d === void 0 ? void 0 : d.enabled) === !1)
        return;
      const T = (A = (w = (b = et.devtools) === null || b === void 0 ? void 0 : b.name) !== null && w !== void 0 ? w : (V = this.constructor) === null || V === void 0 ? void 0 : V.name) !== null && A !== void 0 ? A : "Store", i = ((R = Q.__MVVM_DEVTOOLS_STORE_SEQ__) !== null && R !== void 0 ? R : 0) + 1;
      Q.__MVVM_DEVTOOLS_STORE_SEQ__ = i;
      const h = ($ = (z = et.devtools) === null || z === void 0 ? void 0 : z.instanceId) !== null && $ !== void 0 ? $ : `${T}#${i}`;
      ge(this, { name: T, instanceId: h });
    }
  }, e = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new WeakMap(), (() => {
    const M = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    s = [it], l = [it], f = [C], _ = [C], g = [C], m = [C], I = [X], p = [X], E = [X], K = [C], B = [C], P = [C], D(t, null, s, { kind: "accessor", name: "items", static: !1, private: !1, access: { has: (d) => "items" in d, get: (d) => d.items, set: (d, b) => {
      d.items = b;
    } }, metadata: M }, n, r), D(t, null, l, { kind: "accessor", name: "_cash", static: !1, private: !1, access: { has: (d) => "_cash" in d, get: (d) => d._cash, set: (d, b) => {
      d._cash = b;
    } }, metadata: M }, c, u), D(t, null, f, { kind: "method", name: "add", static: !1, private: !1, access: { has: (d) => "add" in d, get: (d) => d.add }, metadata: M }, null, o), D(t, null, _, { kind: "method", name: "addMany", static: !1, private: !1, access: { has: (d) => "addMany" in d, get: (d) => d.addMany }, metadata: M }, null, o), D(t, null, g, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (d) => "remove" in d, get: (d) => d.remove }, metadata: M }, null, o), D(t, null, m, { kind: "method", name: "clear", static: !1, private: !1, access: { has: (d) => "clear" in d, get: (d) => d.clear }, metadata: M }, null, o), D(t, null, I, { kind: "getter", name: "size", static: !1, private: !1, access: { has: (d) => "size" in d, get: (d) => d.size }, metadata: M }, null, o), D(t, null, p, { kind: "getter", name: "snapshot", static: !1, private: !1, access: { has: (d) => "snapshot" in d, get: (d) => d.snapshot }, metadata: M }, null, o), D(t, null, E, { kind: "getter", name: "cash", static: !1, private: !1, access: { has: (d) => "cash" in d, get: (d) => d.cash }, metadata: M }, null, o), D(t, null, K, { kind: "method", name: "reset", static: !1, private: !1, access: { has: (d) => "reset" in d, get: (d) => d.reset }, metadata: M }, null, o), D(t, null, B, { kind: "method", name: "applyLoaded", static: !1, private: !1, access: { has: (d) => "applyLoaded" in d, get: (d) => d.applyLoaded }, metadata: M }, null, o), D(t, null, P, { kind: "method", name: "setCash", static: !1, private: !1, access: { has: (d) => "setCash" in d, get: (d) => d.setCash }, metadata: M }, null, o), M && Object.defineProperty(t, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: M });
  })(), t;
})();
function ze(t) {
  return Z(t, "instance");
}
function qe(t) {
  return ((e, a) => Ut(t)(e, a));
}
function Ye(t, e) {
  const a = (o, s) => {
    var n;
    const r = typeof t == "string" ? { id: t } : typeof t == "object" ? t : { id: (n = s?.name) !== null && n !== void 0 ? n : o?.name };
    L(Rt, r, o), Vt(r)(o, s);
  };
  return typeof t == "function" ? a(t, e) : (o, s) => a(o, s);
}
class Be {
}
const dt = new gt();
function Ne(t, e) {
  return Yt((a = {}) => {
    const { resolved: o, instance: s } = Bt(() => {
      const r = Z(t) || (typeof t != "string" ? { instance: new t() } : void 0), l = r?.instance;
      return { resolved: r, instance: l };
    }, [t]);
    if (Nt(() => {
      if (s)
        return typeof s.onInit == "function" && s.onInit(), () => {
          typeof s.onDispose == "function" && s.onDispose();
        };
    }, [s]), o) {
      const n = dt.fields(s), r = n.length > 0 ? n : dt.fields(Object.getPrototypeOf(s));
      for (const l in a)
        if (r instanceof Array) {
          const c = r.find((u) => u.name === l);
          c && Reflect.set(s, c.originName, Reflect.get(a, l));
        }
      return L(dt.metadataKey, r, s), e(Object.assign({ viewModel: s }, a));
    }
    return e(Object.assign({}, a));
  });
}
const jt = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, be = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, nt = () => {
};
class pe {
  constructor(e, a) {
    var o, s, n, r, l, c, u;
    this.isExecuting = !1, this.activeCount = 0, this.isCanceled = !1, this.isDisposed = !1, this.error = null, this.controllers = /* @__PURE__ */ new Set(), this.queue = [], this.runningPromise = null, this.queueTail = Promise.resolve(), this.cancelToken = 0, this.fn = e, this.opt = Object.assign({ concurrency: (o = a?.concurrency) !== null && o !== void 0 ? o : "ignore", trackError: (s = a?.trackError) !== null && s !== void 0 ? s : !0, resetErrorOnExecute: (n = a?.resetErrorOnExecute) !== null && n !== void 0 ? n : !0, swallowError: (r = a?.swallowError) !== null && r !== void 0 ? r : !0, abortable: (l = a?.abortable) !== null && l !== void 0 ? l : !1 }, a), this.states = Object.assign(Object.assign({}, jt), (c = a?.states) !== null && c !== void 0 ? c : {}), this.stateKeys = Object.assign(Object.assign({}, be), (u = a?.stateKeys) !== null && u !== void 0 ? u : {}), Ht(this, {
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
    var a, o;
    const s = (a = this.stateKeys[e]) !== null && a !== void 0 ? a : e;
    return (o = this.states[s]) !== null && o !== void 0 ? o : jt[e];
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
    var e, a;
    this.cancelToken += 1, this.isCanceled = !0, (a = (e = this.opt).onCancel) === null || a === void 0 || a.call(e), this.opt.cancelQueued && this.clearQueue();
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
    for (const a of e)
      a.canceled = !0, a.settled || (a.settled = !0, a.resolve(void 0));
  }
  execute(...e) {
    var a;
    if (this.isDisposed)
      return Promise.resolve(void 0);
    if (!this.canExecute)
      return (a = this.runningPromise) !== null && a !== void 0 ? a : Promise.resolve(void 0);
    const o = (n) => {
      this.runningPromise = n;
      const r = () => {
        this.runningPromise === n && (this.runningPromise = null);
      };
      return n.then(r, r), n;
    }, s = () => ut(this, void 0, void 0, function* () {
      var n, r, l, c, u, f, _, g;
      if (this.isDisposed)
        return;
      const m = this.opt.abortable ? new AbortController() : null;
      m && this.controllers.add(m), G(() => {
        this.activeCount += 1, this.isExecuting = this.activeCount > 0, this.isCanceled = !1, this.opt.trackError && this.opt.resetErrorOnExecute && (this.error = null);
      });
      const I = this.cancelToken;
      let p = !1, E = !1, K = null, B = null;
      try {
        (r = (n = this.opt).onStart) === null || r === void 0 || r.call(n, ...e);
        const P = this.opt.abortable ? m.signal : void 0;
        B = this.fn(...e, P);
        const M = yield B;
        return E = this.cancelToken !== I, E ? void 0 : ((c = (l = this.opt).onSuccess) === null || c === void 0 || c.call(l, M, ...e), p = !0, M);
      } catch (P) {
        if (this.opt.abortable && m?.signal.aborted) {
          G(() => {
            this.isCanceled = !0;
          }), E = !0, K = null;
          return;
        }
        if (K = P, E = this.cancelToken !== I, this.opt.trackError && G(() => {
          this.error = P;
        }), (f = (u = this.opt).onError) === null || f === void 0 || f.call(u, P), !this.opt.swallowError)
          throw P;
        return;
      } finally {
        G(() => {
          this.activeCount = Math.max(0, this.activeCount - 1), this.isExecuting = this.activeCount > 0;
        }), m && this.controllers.delete(m), !E && this.cancelToken !== I && (E = !0), (g = (_ = this.opt).onFinally) === null || g === void 0 || g.call(_, { ok: p, canceled: E, error: K }, ...e);
      }
    });
    switch (this.opt.concurrency) {
      case "parallel":
        return o(s());
      case "restart":
        return this.cancel(), o(s());
      case "queue": {
        const n = this.opt.queueLimit;
        if (typeof n == "number" && n > 0 && this.queue.length >= n)
          return Promise.resolve(void 0);
        const r = {
          promise: Promise.resolve(void 0),
          resolve: nt,
          reject: nt,
          canceled: !1,
          settled: !1
        }, l = this.activeCount === 0 && this.queue.length === 0;
        r.promise = new Promise((f, _) => {
          r.resolve = f, r.reject = _;
        }), this.queue.push(r);
        const c = () => ut(this, void 0, void 0, function* () {
          if (r.settled)
            return;
          if (r.canceled || this.isDisposed) {
            r.settled = !0, r.resolve(void 0);
            return;
          }
          const f = this.queue.indexOf(r);
          f >= 0 && this.queue.splice(f, 1);
          try {
            const _ = yield s();
            r.settled || (r.settled = !0, r.resolve(_));
          } catch (_) {
            r.settled || (r.settled = !0, r.reject(_));
          }
        }), u = l ? c() : this.queueTail.then(c, c);
        return this.queueTail = u.then(nt, nt), o(r.promise);
      }
      default:
        return this.isExecuting && this.runningPromise ? this.runningPromise : o(s());
    }
  }
}
function Oe(t, e) {
  return new pe(t, e);
}
function Ge(t, e) {
  const a = xt(t), o = /* @__PURE__ */ new Set(), s = e?.onCancel;
  return Oe((...r) => {
    const l = a(...r);
    o.add(l);
    const c = () => {
      o.delete(l);
    };
    return l.then(c, c), new Promise((u, f) => {
      l.then(u, (_) => {
        if (Ft(_)) {
          u(void 0);
          return;
        }
        f(_);
      });
    });
  }, Object.assign(Object.assign({}, e), { onCancel: () => {
    var r;
    for (const l of o)
      (r = l.cancel) === null || r === void 0 || r.call(l);
    s?.();
  } }));
}
function We(t) {
  return function(...e) {
    return G(() => t.apply(this, e));
  };
}
export {
  Z as GetService,
  ze as GetStore,
  Ut as Inject,
  qe as InjectStore,
  Ve as MakeObservable,
  oe as Model,
  Re as PropFromView,
  Vt as Service,
  je as SetService,
  Ye as Store,
  He as StoreBase,
  Te as TODO,
  Be as ViewModel,
  Oe as asyncCommand,
  se as attachModelDevtools,
  ge as attachStoreDevtools,
  We as commandAction,
  L as defineMetadata,
  Pe as define_prop,
  Ce as exclude,
  bt as field,
  Ge as flowCommand,
  Gt as getExecutingFunctionNameByStack,
  H as getOwnMetadata,
  Ee as isSerializable,
  xe as submit,
  Fe as validation,
  Ne as view
};
//# sourceMappingURL=index.js.map
