import "reflect-metadata";
import { d as ut, _ as L, a as F, b as U, c as D } from "./tslib.es6-B_Omq7a0.js";
import Rt, { isObject as Dt, isEqual as Mt, isEmpty as xt } from "lodash";
import { makeObservable as ht, reaction as jt, runInAction as N, observable as it, isObservable as wt, computed as X, action as x, flow as Ct, isFlowCancellationError as Lt, makeAutoObservable as Ft } from "mobx";
import { enablePatches as Kt, immerable as St, createDraft as Ht, applyPatches as It, produce as zt } from "immer";
import { observer as qt } from "mobx-react";
import { useMemo as Yt, useEffect as Bt } from "react";
const K = (t, i, r) => Reflect.getOwnMetadata(t, i) || r || {}, C = (t, i, r) => Reflect.defineMetadata(t, i, r);
function Ie(...t) {
  try {
    return JSON.stringify(t), !0;
  } catch {
    return !1;
  }
}
function Gt(t) {
  if (t && typeof t == "string") {
    let [i] = t.split(`
`)[2].replace(/at (get)?/, "").match(/.*/g) || [];
    return i && (i = i.trim()), i;
  }
}
const At = {}, lt = [];
let kt = !1;
const Ae = (t, ...i) => {
  const r = new Error().stack;
  if (!kt)
    console.log("%c TODO", "background: #222; color: #bada55", At), kt = !0;
  else {
    const n = Gt(r);
    lt.includes(n) === !1 && (lt.push(n), Reflect.set(At, `${lt.length}) ${t}`, { msg: i, get path() {
      return console.info(i, n), n;
    } }));
  }
  function o(...n) {
  }
  return o;
}, Y = (t, i) => !!t && (typeof i == "string" || typeof i == "symbol"), q = (t) => !!t && typeof t == "object" && "kind" in t, Nt = (t) => ({
  kind: "class",
  name: t,
  addInitializer: () => {
  },
  metadata: {}
}), J = /* @__PURE__ */ Symbol("service-key"), ft = new Proxy({}, Reflect);
function Wt(t) {
  const i = (o, n) => {
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
      i(o, n);
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
function Z(t, i) {
  var r;
  const o = K(J, ft);
  if (typeof t != "string") {
    const n = K(J, t);
    if (n)
      return i && i in n ? n[i] : n;
    for (const s in o) {
      const a = o[s];
      if (a.target === t) {
        t = a.context.name;
        break;
      }
    }
  }
  if (typeof t == "string")
    return i ? (r = o[t]) === null || r === void 0 ? void 0 : r[i] : o[t];
}
function Pt(t, i) {
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
    l[a] = d, C(J, l, ft), C(J, l[a], n);
  };
  function o(n, s) {
    var a, l;
    const d = n.__legacy_source__, u = q(s) ? s : Nt((l = (a = d?.name) !== null && a !== void 0 ? a : n?.name) !== null && l !== void 0 ? l : "");
    r(n, u), d && d !== n && C(J, K(J, n), d);
  }
  return Rt.isFunction(t) ? o(t, i) : t ? (n, s) => o(n, s) : o;
}
const ke = (t, i) => {
  const { kind: r = "class", name: o = "", addInitializer: n = () => {
  }, metadata: s } = i?.ctx || {};
  return Pt(i)(t, {
    kind: r,
    name: o,
    addInitializer: n,
    metadata: s
  }), Z(t).instance;
};
function ct(t) {
  var i, r, o;
  const n = Object.assign({ enumerable: !1, writable: !0 }, t), s = Object.assign({ configurable: !0, enumerable: !1, writable: !0 }, t), a = {
    configurable: (i = s.configurable) !== null && i !== void 0 ? i : !0,
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
function Te(t, i) {
  return Y(t, i) || q(i) ? ct()(t, i) : ct(t);
}
function Ee(t, i) {
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
  return t && !q(i) || t ? n(t, i) : n;
}
const Ut = /* @__PURE__ */ Symbol("field-key"), $t = /* @__PURE__ */ Symbol("validation-key"), Qt = /* @__PURE__ */ Symbol("submit-key"), Jt = /* @__PURE__ */ Symbol("exclude-key"), Xt = /* @__PURE__ */ Symbol("prop-from-view-key");
class tt {
  isPrototypeObject(i) {
    const r = i?.constructor;
    return !!(r && r.prototype === i);
  }
  /**
   * Получить объект, по которому кешируются метаданные.
   * Для инстанса — это его prototype, для prototype — он сам.
   */
  getCacheTarget(i) {
    return !i || typeof i != "object" ? null : this.isPrototypeObject(i) ? i : Object.getPrototypeOf(i);
  }
  computeFromPrototype(i) {
    const r = [], o = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
    let s = i;
    for (; s; ) {
      const l = Reflect.getOwnMetadata(this.metadataKey, s);
      if (Array.isArray(l))
        for (const d of l) {
          const u = d?.name, f = String(u);
          n.has(f) || (n.add(f), r.push(d), o.set(f, d));
        }
      s = Object.getPrototypeOf(s);
    }
    return { ownRef: Reflect.getOwnMetadata(this.metadataKey, i), list: r, map: o };
  }
  /**
   * Создать базовые метаданные.
   */
  constructor(i = {}) {
    this.metadataKey = null, this.cache = /* @__PURE__ */ new WeakMap(), this.name = i?.name, this.callback = i?.callback;
  }
  /**
   * Проверить, что данные соответствуют экземпляру метаданных.
   */
  isInstance(i = {}) {
    return i instanceof tt || Object.getOwnPropertyNames(this).some((r) => Object.keys(i).includes(r));
  }
  /**
   * Получить метаданные конкретного поля модели.
   */
  fieldInstance(i, r) {
    const o = r && typeof r == "object" ? Reflect.getOwnMetadata(this.metadataKey, r) : void 0;
    if (Array.isArray(o))
      return o.find((l) => l.name === i);
    const n = this.getCacheTarget(r);
    if (!n)
      return;
    const s = Reflect.getOwnMetadata(this.metadataKey, n), a = this.cache.get(n);
    if (!a || a.ownRef !== s) {
      const l = this.computeFromPrototype(n);
      return this.cache.set(n, l), l.map.get(String(i));
    }
    return a.map.get(String(i));
  }
  /**
   * Получить массив метаданных полей модели.
   */
  fields(i) {
    const r = i && typeof i == "object" ? Reflect.getOwnMetadata(this.metadataKey, i) : void 0;
    if (Array.isArray(r)) {
      const l = [], d = /* @__PURE__ */ new Set();
      let u = i;
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
    const o = this.getCacheTarget(i);
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
    super(...arguments), this.metadataKey = $t;
  }
}
class yt extends tt {
  constructor() {
    super(...arguments), this.metadataKey = Qt;
  }
}
class vt extends tt {
  constructor() {
    super(...arguments), this.metadataKey = Jt;
  }
}
class mt extends tt {
  /**
   * Создать метаданные поля модели.
   */
  constructor(i = {}) {
    super(i), this.factory = null, this.mapping = null, this.collectChanges = !1, this.name = null, this.ctx = null, this.metadataKey = Ut, this.factory = i.factory, this.mapping = i.mapping, this.name = i.name, this.ctx = i.ctx, this.collectChanges = !!i.collectChanges;
  }
}
class gt extends tt {
  /**
   * Создать метаданные для PropFromView.
   */
  constructor(i = {}) {
    super(i), this.metadataKey = Xt;
    for (const r in this)
      i && r in i && (this[r] = Reflect.get(i, r));
  }
}
function je(t) {
  const i = (n, s) => {
    const a = new gt({ name: t, originName: String(s) });
    a.name = t, a.originName = String(s);
    const l = K(a.metadataKey, n, new Array());
    C(a.metadataKey, [...l, a], n);
  }, r = (n) => {
    n.addInitializer(function() {
      const s = new gt(), a = s.fields(this);
      for (const l in this)
        a instanceof Array && n.name === l && (s.name = t, s.originName = l, s.value = this[l], a.push(s));
      C(s.metadataKey, a, this);
    });
  };
  function o(n, s) {
    if (Y(n, s)) {
      i(n, s);
      return;
    }
    if (q(s))
      return r(s), s.kind === "field" ? (a) => a : s;
  }
  return t ? ((n, s) => o(n, s)) : ((n) => n);
}
function Pe(t) {
  const i = (n, s) => {
    const a = new vt({ callback: t, name: String(s) }), l = K(a.metadataKey, n, new Array());
    C(a.metadataKey, [...l, a], n);
  }, r = (n) => {
    n.addInitializer(function() {
      const s = new vt({ callback: t, name: String(n.name) }), a = K(s.metadataKey, this, new Array());
      C(s.metadataKey, [...a, s], this);
    });
  };
  function o(n, s) {
    if (Y(n, s)) {
      i(n, s);
      return;
    }
    if (q(s))
      return r(s), s.kind === "field" ? void 0 : s;
  }
  if (t)
    return ((n, s) => o(n, s));
}
const Zt = () => {
  var t;
  return (t = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && t !== void 0 ? t : null;
}, te = () => {
  var t;
  return (t = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && t !== void 0 ? t : 0;
}, nt = (t) => {
  var i, r;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((i = o.__MVVM_DEVTOOLS_APPLYING__) !== null && i !== void 0 ? i : 0) + 1;
  try {
    return t();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((r = o.__MVVM_DEVTOOLS_APPLYING__) !== null && r !== void 0 ? r : 1) - 1);
  }
}, ee = () => te() > 0, Tt = (t) => ({
  data: t.service.dumpData,
  historyIndex: t.service.historyIndex
}), ie = (t, i = {}) => {
  const r = Zt();
  if (!r)
    return () => {
    };
  const o = r.connect({ name: i.name, instanceId: i.instanceId });
  let n = !1;
  try {
    o.init(Tt(t));
  } catch {
  }
  const s = jt(() => Tt(t), (l) => {
    var d;
    if (!(n || ee()))
      try {
        o.send({ type: (d = i.actionType) !== null && d !== void 0 ? d : "model:update" }, l);
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
            N(() => {
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
Kt();
const ne = new yt(), W = new mt(), se = new _t(), ae = new vt();
let re = (() => {
  var t, i, r, o, n, s, a, l, d, u, f, _, g, m, I;
  let p = [], T, H = [], B = [], P, M, c, b, w, V, A, R, z, $, Q, et;
  return t = class {
    // @define_prop
    get [(i = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), d = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap(), f = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new WeakMap(), g = /* @__PURE__ */ new WeakMap(), m = St)]() {
      return L(this, i, "f");
    }
    set [m](e) {
      F(this, i, e, "f");
    }
    get initData() {
      return L(this, r, "f");
    }
    set initData(e) {
      F(this, r, e, "f");
    }
    // @define_prop
    get committedData() {
      return L(this, o, "f");
    }
    set committedData(e) {
      F(this, o, e, "f");
    }
    // @define_prop
    get modified_() {
      return L(this, n, "f");
    }
    set modified_(e) {
      F(this, n, e, "f");
    }
    // @define_prop
    get draft() {
      return L(this, s, "f");
    }
    set draft(e) {
      F(this, s, e, "f");
    }
    // @define_prop
    get changes() {
      return L(this, a, "f");
    }
    set changes(e) {
      F(this, a, e, "f");
    }
    // @define_prop
    get inverseChanges() {
      return L(this, l, "f");
    }
    set inverseChanges(e) {
      F(this, l, e, "f");
    }
    // @define_prop
    get history() {
      return L(this, d, "f");
    }
    set history(e) {
      F(this, d, e, "f");
    }
    // @define_prop
    get historyIndex() {
      return L(this, u, "f");
    }
    set historyIndex(e) {
      F(this, u, e, "f");
    }
    // @define_prop
    get legacyInitDone() {
      return L(this, f, "f");
    }
    set legacyInitDone(e) {
      F(this, f, e, "f");
    }
    // @define_prop
    get options() {
      return L(this, _, "f");
    }
    set options(e) {
      F(this, _, e, "f");
    }
    // @define_prop
    get historyMuted() {
      return L(this, g, "f");
    }
    set historyMuted(e) {
      F(this, g, e, "f");
    }
    /**
     * Создает модель и инициализирует данные.
     */
    constructor(e = {}, h) {
      i.set(this, (U(this, p), !0)), r.set(this, U(this, H, null)), o.set(this, (U(this, B), {})), n.set(this, {}), s.set(this, null), a.set(this, []), l.set(this, []), d.set(this, []), u.set(this, -1), f.set(this, !1), _.set(this, {}), g.set(this, !1), this.options = h, this[St] = !0, this.init(e), this.autoAttachDevtools(), this.initLegacyFields();
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
      if (e)
        Reflect.get(this.validation, e);
      else
        for (let h in this.validation)
          this.validation[h];
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
      const v = W.fieldInstance(e, this);
      if (v) {
        e in this.initData || Reflect.set(this.initData, e, Reflect.get(this, e));
        const y = v?.factory ? v.factory(this.initData, this) : Reflect.get(this.initData, v.name);
        this.defineFieldValue(e, y, v), h?.skipValidation || this.initValidation(e);
      }
    }
    initLegacyFields() {
      if (this.legacyInitDone)
        return;
      const e = W.fields(this);
      if (e.some((h) => Object.prototype.hasOwnProperty.call(this, h.name))) {
        this.legacyInitDone = !0;
        for (let h of e)
          this.initData && String(h.name) in this.initData || !W.fieldInstance(String(h.name), this) || this.initField(String(h.name), { skipValidation: !0 });
      }
    }
    /**
     * Создать draft для отслеживания изменений.
     */
    createDraft(e) {
      this.draft = Ht(e);
    }
    autoAttachDevtools() {
      var e, h, v, y, O, j, S, k, G, at, rt;
      const ot = globalThis;
      if (!ot.__MVVM_DEVTOOLS_AUTO__ || ((h = (e = this.options) === null || e === void 0 ? void 0 : e.devtools) === null || h === void 0 ? void 0 : h.enabled) === !1)
        return;
      const pt = (S = (O = (y = (v = this.options) === null || v === void 0 ? void 0 : v.devtools) === null || y === void 0 ? void 0 : y.name) !== null && O !== void 0 ? O : (j = this.constructor) === null || j === void 0 ? void 0 : j.name) !== null && S !== void 0 ? S : "Model", Ot = ((k = ot.__MVVM_DEVTOOLS_SEQ__) !== null && k !== void 0 ? k : 0) + 1;
      ot.__MVVM_DEVTOOLS_SEQ__ = Ot, ie(this, { name: pt, instanceId: (rt = (at = (G = this.options) === null || G === void 0 ? void 0 : G.devtools) === null || at === void 0 ? void 0 : at.instanceId) !== null && rt !== void 0 ? rt : `${pt}#${Ot}` });
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
      It(this.draft, e);
      const h = new Set(e.map((v) => v.field).filter(Boolean));
      h.size !== 0 && this.withHistoryMuted(() => {
        var v;
        for (let y of h) {
          const O = (v = Reflect.get(this.draft, y)) !== null && v !== void 0 ? v : Reflect.get(this.initData, y);
          Reflect.set(this, y, O), this.defineFieldValue(y, Reflect.get(this, y));
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
    produceDraft(e, h, v) {
      if (this.historyMuted)
        return;
      let y, O = [];
      e && (y = e.split(".")[0], y && !W.fieldInstance(y, this).collectChanges) || (zt(this.draft, (j) => {
        if (e) {
          let S = j;
          const k = e.split(".");
          if (k.length > 1)
            for (let G = 0; G < k.length && !(G != k.length - 1 && !Dt(S)); G++)
              Dt(S) && (S = S[k[G]]);
          else
            v = e;
          S && (S[v] = h);
        }
      }, (j, S) => {
        y && (j = j.map((k) => Object.assign(Object.assign({}, k), { field: y })), S = S.map((k) => Object.assign(Object.assign({}, k), { field: y }))), O = j, !(!j.length && !S.length) && (this.historyIndex < this.history.length - 1 && (this.history = this.history.slice(0, this.historyIndex + 1), this.syncChangesFromHistory()), this.changes.push(...j), this.inverseChanges.push(...S), this.history.push({ patches: j, inversePatches: S }), this.historyIndex = this.history.length - 1);
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
    createObservable(e, h, v, y = v) {
      return e = wt(e) ? e : it.box(e), new Proxy(e, {
        get: (O, j, S) => {
          const k = Reflect.get(O, j, S);
          return k && typeof k == "object" && !(k instanceof t) && !wt(e) ? this.createObservable(k, String(j), h, `${y}.${String(j)}`) : k;
        },
        set: (O, j, S, k) => (e = S, this.produceDraft(y, e, String(j)), this.checkChange(v, Reflect.get(this, v)), Reflect.set(O, j, S, k))
      });
    }
    /**
     * Определить getter/setter для поля модели.
     */
    defineFieldValue(e, h, v = W.fieldInstance(e, this)) {
      return h = it.box(h), Reflect.defineProperty(this, v.name, {
        get: () => h.get(),
        set: (y) => {
          N(() => h.set(y)), this.produceDraft(v.name, h.get()), this.checkChange(v.name, h.get());
        },
        enumerable: !0,
        configurable: !0
      }), h;
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
      const v = Reflect.get(this.committedData, e) || Reflect.get(this.initData, e), y = e && e in this.initData && !Mt(v, h);
      return N(() => {
        y && Reflect.set(this.modified_, e, v);
        for (const O in this.modified_)
          e === O && e in this.modified_ && Mt(v, h) && delete this.modified_[O];
      }), y;
    }
    /**
     * Применить данные к полям модели.
     */
    defineData(e) {
      for (let h in this)
        Object.prototype.hasOwnProperty.call(this, h) && W.fieldInstance(h, this) && (Reflect.set(this, h, Reflect.get(e, h)), this.initField(h));
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
      for (let e of W.fields(this))
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
        for (let e in this)
          e in this.initData && (this[e] = Reflect.get(this.initData, e), this.initField(e));
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
        this.init(e), this.defineData(this.initData);
      }), this;
    }
    /**
     * Получить сериализованный дамп данных.
     */
    get dumpData() {
      this.initLegacyFields();
      const e = /* @__PURE__ */ Object.create({}), h = (y) => {
        try {
          return ne.fieldInstance(y, this).callback(Reflect.get(this, y), this);
        } catch {
          return Reflect.get(this, y);
        }
      }, v = (y) => {
        const O = ae.fieldInstance(y, this);
        if (O)
          switch (typeof O.callback) {
            case "boolean":
              return !!O.callback;
            case "function":
              return O.callback(Reflect.get(this, y), this);
          }
        return !1;
      };
      return W.fields(this).forEach((y) => {
        var O;
        if (y.name in this)
          return !((O = this.options) === null || O === void 0) && O.byFields && !this.options.byFields.includes(y.name) || v(y.name) ? void 0 : Reflect.set(e, y.name, h(y.name));
      }), e;
    }
    /**
     * Получить объект результатов валидации.
     */
    get validation() {
      this.initLegacyFields();
      const e = {};
      for (const h in this) {
        const v = se.fieldInstance(h, this);
        v && Reflect.set(e, h, v.callback(this[h], this) || "");
      }
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
    const E = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    T = [it], P = [x], M = [X], c = [x], b = [x], w = [x], V = [x], A = [x], R = [x], z = [x], $ = [X], Q = [X], et = [(I = X).struct.bind(I)], D(t, null, T, { kind: "accessor", name: "initData", static: !1, private: !1, access: { has: (e) => "initData" in e, get: (e) => e.initData, set: (e, h) => {
      e.initData = h;
    } }, metadata: E }, H, B), D(t, null, P, { kind: "method", name: "produceDraft", static: !1, private: !1, access: { has: (e) => "produceDraft" in e, get: (e) => e.produceDraft }, metadata: E }, null, p), D(t, null, M, { kind: "getter", name: "dirty", static: !1, private: !1, access: { has: (e) => "dirty" in e, get: (e) => e.dirty }, metadata: E }, null, p), D(t, null, c, { kind: "method", name: "commit", static: !1, private: !1, access: { has: (e) => "commit" in e, get: (e) => e.commit }, metadata: E }, null, p), D(t, null, b, { kind: "method", name: "commitField", static: !1, private: !1, access: { has: (e) => "commitField" in e, get: (e) => e.commitField }, metadata: E }, null, p), D(t, null, w, { kind: "method", name: "reject", static: !1, private: !1, access: { has: (e) => "reject" in e, get: (e) => e.reject }, metadata: E }, null, p), D(t, null, V, { kind: "method", name: "toInit", static: !1, private: !1, access: { has: (e) => "toInit" in e, get: (e) => e.toInit }, metadata: E }, null, p), D(t, null, A, { kind: "method", name: "undo", static: !1, private: !1, access: { has: (e) => "undo" in e, get: (e) => e.undo }, metadata: E }, null, p), D(t, null, R, { kind: "method", name: "redo", static: !1, private: !1, access: { has: (e) => "redo" in e, get: (e) => e.redo }, metadata: E }, null, p), D(t, null, z, { kind: "method", name: "goToHistory", static: !1, private: !1, access: { has: (e) => "goToHistory" in e, get: (e) => e.goToHistory }, metadata: E }, null, p), D(t, null, $, { kind: "getter", name: "validation", static: !1, private: !1, access: { has: (e) => "validation" in e, get: (e) => e.validation }, metadata: E }, null, p), D(t, null, Q, { kind: "getter", name: "validAndDirty", static: !1, private: !1, access: { has: (e) => "validAndDirty" in e, get: (e) => e.validAndDirty }, metadata: E }, null, p), D(t, null, et, { kind: "getter", name: "service", static: !1, private: !1, access: { has: (e) => "service" in e, get: (e) => e.service }, metadata: E }, null, p), E && Object.defineProperty(t, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: E });
  })(), t;
})();
const oe = () => {
  var t;
  const i = globalThis;
  return !!((t = i.__MVVM_DEVTOOLS_HISTORY__) !== null && t !== void 0 ? t : i.__MVVM_DEVTOOLS_AUTO__);
}, le = (t) => oe() ? !t || typeof t != "object" ? { collectChanges: !0 } : "collectChanges" in t ? t : Object.assign(Object.assign({}, t), { collectChanges: !0 }) : t;
function Re(t, i) {
  const r = le(Y(t, i) ? void 0 : t), o = (a, l) => {
    const d = new mt(Object.assign(Object.assign({}, r), { name: String(l), ctx: null })), u = K(d.metadataKey, a, new Array());
    C(d.metadataKey, [...u, d], a), Object.getOwnPropertyDescriptor(a, l) || Object.defineProperty(a, l, {
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
      if (this instanceof re && typeof this.initField == "function") {
        const l = new mt(Object.assign(Object.assign({}, r), { name: String(a.name), ctx: a })), d = K(l.metadataKey, this, new Array());
        C(l.metadataKey, [...d, l], this), this.initField.call(this, String(a.name));
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
  return Y(t, i) ? s(t, i) : r && !q(i) ? (a, l) => s(a, l) : q(i) ? s(void 0, i) : (a, l) => s(a, l);
}
function xe(t) {
  const i = (n, s) => {
    const a = new yt({ callback: t, name: String(s) }), l = K(a.metadataKey, n, new Array());
    C(a.metadataKey, [...l, a], n);
  }, r = (n) => {
    const s = new yt({ callback: t, name: String(n.name) });
    n.addInitializer(function() {
      const a = K(s.metadataKey, this, new Array());
      C(s.metadataKey, [...a, s], this);
    });
  };
  function o(n, s) {
    if (Y(n, s)) {
      i(n, s);
      return;
    }
    if (q(s))
      return r(s), s.kind === "field" ? (a) => a : s;
  }
  return t ? ((n, s) => o(n, s)) : ((n) => n);
}
function Ce(t) {
  const i = (n, s) => {
    const a = new _t({ callback: t, name: String(s) }), l = K(a.metadataKey, n, new Array());
    C(a.metadataKey, [...l, a], n);
  }, r = (n) => {
    const s = new _t({ callback: t, name: String(n.name) });
    n.addInitializer(function() {
      const a = K(s.metadataKey, this, new Array());
      C(s.metadataKey, [...a, s], this);
    });
  };
  function o(n, s) {
    if (Y(n, s)) {
      i(n, s);
      return;
    }
    if (q(s))
      return r(s), s.kind === "field" ? (a) => a : s;
  }
  return t ? ((n, s) => o(n, s)) : ((n) => n);
}
const Vt = /* @__PURE__ */ Symbol("store-key"), ce = () => {
  var t;
  return (t = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && t !== void 0 ? t : null;
}, de = () => {
  var t;
  return (t = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && t !== void 0 ? t : 0;
}, ue = (t) => {
  var i, r;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((i = o.__MVVM_DEVTOOLS_APPLYING__) !== null && i !== void 0 ? i : 0) + 1;
  try {
    return t();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((r = o.__MVVM_DEVTOOLS_APPLYING__) !== null && r !== void 0 ? r : 1) - 1);
  }
}, he = () => de() > 0, bt = (t) => ({
  items: t.items.map((i) => {
    var r, o;
    return {
      name: (o = (r = i.constructor) === null || r === void 0 ? void 0 : r.name) !== null && o !== void 0 ? o : "Model",
      data: i.service.dumpData,
      historyIndex: i.service.historyIndex
    };
  })
}), fe = (t) => !!(t && typeof t == "object" && Array.isArray(t.items)), _e = (t) => {
  if (!t)
    return null;
  try {
    const i = JSON.parse(t);
    return fe(i) ? i : null;
  } catch {
    return null;
  }
}, ye = (t, i = {}) => {
  var r, o;
  const n = ce();
  if (!n)
    return () => {
    };
  const s = n.connect({ name: i.name, instanceId: i.instanceId });
  let a = !1, l = (o = (r = t.items[0]) === null || r === void 0 ? void 0 : r.constructor) !== null && o !== void 0 ? o : null;
  try {
    s.init(bt(t));
  } catch {
  }
  const d = jt(() => bt(t), (_) => {
    var g;
    if (a || he())
      return;
    const m = (g = t.items[0]) === null || g === void 0 ? void 0 : g.constructor;
    m && (l = m);
    try {
      s.send({ type: "store:update" }, _);
    } catch {
    }
  }), u = (_) => (a = !0, ue(() => {
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
      const I = _e(_.state);
      if (!I)
        return;
      u(() => {
        var p, T, H;
        if (I.items.length === t.items.length && t.items.every((b) => {
          var w, V;
          return typeof ((w = b?.service) === null || w === void 0 ? void 0 : w.goToHistory) == "function" || typeof ((V = b?.service) === null || V === void 0 ? void 0 : V.loadData) == "function";
        })) {
          N(() => {
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
let Le = (() => {
  var t, i, r;
  let o = [], n, s = [], a = [], l, d = [], u = [], f, _, g, m, I, p, T, H, B, P;
  return t = class {
    get items() {
      return L(this, i, "f");
    }
    set items(c) {
      F(this, i, c, "f");
    }
    get _cash() {
      return L(this, r, "f");
    }
    set _cash(c) {
      F(this, r, c, "f");
    }
    constructor() {
      i.set(this, (U(this, o), U(this, s, []))), r.set(this, (U(this, a), U(this, d, []))), U(this, u), ht(this), this.autoAttachDevtools();
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
      const et = K(Vt, this.constructor, {}) || {};
      if (((c = et.devtools) === null || c === void 0 ? void 0 : c.enabled) === !1)
        return;
      const E = (A = (w = (b = et.devtools) === null || b === void 0 ? void 0 : b.name) !== null && w !== void 0 ? w : (V = this.constructor) === null || V === void 0 ? void 0 : V.name) !== null && A !== void 0 ? A : "Store", e = ((R = Q.__MVVM_DEVTOOLS_STORE_SEQ__) !== null && R !== void 0 ? R : 0) + 1;
      Q.__MVVM_DEVTOOLS_STORE_SEQ__ = e;
      const h = ($ = (z = et.devtools) === null || z === void 0 ? void 0 : z.instanceId) !== null && $ !== void 0 ? $ : `${E}#${e}`;
      ye(this, { name: E, instanceId: h });
    }
  }, i = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), (() => {
    const M = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    n = [it], l = [it], f = [x], _ = [x], g = [x], m = [x], I = [X], p = [X], T = [X], H = [x], B = [x], P = [x], D(t, null, n, { kind: "accessor", name: "items", static: !1, private: !1, access: { has: (c) => "items" in c, get: (c) => c.items, set: (c, b) => {
      c.items = b;
    } }, metadata: M }, s, a), D(t, null, l, { kind: "accessor", name: "_cash", static: !1, private: !1, access: { has: (c) => "_cash" in c, get: (c) => c._cash, set: (c, b) => {
      c._cash = b;
    } }, metadata: M }, d, u), D(t, null, f, { kind: "method", name: "add", static: !1, private: !1, access: { has: (c) => "add" in c, get: (c) => c.add }, metadata: M }, null, o), D(t, null, _, { kind: "method", name: "addMany", static: !1, private: !1, access: { has: (c) => "addMany" in c, get: (c) => c.addMany }, metadata: M }, null, o), D(t, null, g, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (c) => "remove" in c, get: (c) => c.remove }, metadata: M }, null, o), D(t, null, m, { kind: "method", name: "clear", static: !1, private: !1, access: { has: (c) => "clear" in c, get: (c) => c.clear }, metadata: M }, null, o), D(t, null, I, { kind: "getter", name: "size", static: !1, private: !1, access: { has: (c) => "size" in c, get: (c) => c.size }, metadata: M }, null, o), D(t, null, p, { kind: "getter", name: "snapshot", static: !1, private: !1, access: { has: (c) => "snapshot" in c, get: (c) => c.snapshot }, metadata: M }, null, o), D(t, null, T, { kind: "getter", name: "cash", static: !1, private: !1, access: { has: (c) => "cash" in c, get: (c) => c.cash }, metadata: M }, null, o), D(t, null, H, { kind: "method", name: "reset", static: !1, private: !1, access: { has: (c) => "reset" in c, get: (c) => c.reset }, metadata: M }, null, o), D(t, null, B, { kind: "method", name: "applyLoaded", static: !1, private: !1, access: { has: (c) => "applyLoaded" in c, get: (c) => c.applyLoaded }, metadata: M }, null, o), D(t, null, P, { kind: "method", name: "setCash", static: !1, private: !1, access: { has: (c) => "setCash" in c, get: (c) => c.setCash }, metadata: M }, null, o), M && Object.defineProperty(t, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: M });
  })(), t;
})();
function Ke(t) {
  return Z(t, "instance");
}
function He(t) {
  return ((i, r) => Wt(t)(i, r));
}
function ze(t, i) {
  const r = (o, n) => {
    var s;
    const a = typeof t == "string" ? { id: t } : typeof t == "object" ? t : { id: (s = n?.name) !== null && s !== void 0 ? s : o?.name };
    C(Vt, a, o), Pt(a)(o, n);
  };
  return typeof t == "function" ? r(t, i) : (o, n) => r(o, n);
}
class qe {
}
const dt = new gt();
function Ye(t, i) {
  return qt((r = {}) => {
    const { resolved: o, instance: n } = Yt(() => {
      const a = Z(t) || (typeof t != "string" ? { instance: new t() } : void 0), l = a?.instance;
      return { resolved: a, instance: l };
    }, [t]);
    if (Bt(() => {
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
      return C(dt.metadataKey, a, n), i(Object.assign({ viewModel: n }, r));
    }
    return i(Object.assign({}, r));
  });
}
const Et = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, ve = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, st = () => {
};
class me {
  constructor(i, r) {
    var o, n, s, a, l, d, u;
    this.isExecuting = !1, this.activeCount = 0, this.isCanceled = !1, this.isDisposed = !1, this.error = null, this.controllers = /* @__PURE__ */ new Set(), this.queue = [], this.runningPromise = null, this.queueTail = Promise.resolve(), this.cancelToken = 0, this.fn = i, this.opt = Object.assign({ concurrency: (o = r?.concurrency) !== null && o !== void 0 ? o : "ignore", trackError: (n = r?.trackError) !== null && n !== void 0 ? n : !0, resetErrorOnExecute: (s = r?.resetErrorOnExecute) !== null && s !== void 0 ? s : !0, swallowError: (a = r?.swallowError) !== null && a !== void 0 ? a : !0, abortable: (l = r?.abortable) !== null && l !== void 0 ? l : !1 }, r), this.states = Object.assign(Object.assign({}, Et), (d = r?.states) !== null && d !== void 0 ? d : {}), this.stateKeys = Object.assign(Object.assign({}, ve), (u = r?.stateKeys) !== null && u !== void 0 ? u : {}), Ft(this, {
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
    var r, o;
    const n = (r = this.stateKeys[i]) !== null && r !== void 0 ? r : i;
    return (o = this.states[n]) !== null && o !== void 0 ? o : Et[i];
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
    var i, r;
    this.cancelToken += 1, this.isCanceled = !0, (r = (i = this.opt).onCancel) === null || r === void 0 || r.call(i), this.opt.cancelQueued && this.clearQueue();
    for (const o of this.controllers)
      o.abort();
  }
  dispose() {
    this.isDisposed || (this.isDisposed = !0, this.clearQueue(), this.cancel());
  }
  clearQueue() {
    if (this.queue.length === 0)
      return;
    const i = this.queue.splice(0, this.queue.length);
    for (const r of i)
      r.canceled = !0, r.settled || (r.settled = !0, r.resolve(void 0));
  }
  execute(...i) {
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
      m && this.controllers.add(m), N(() => {
        this.activeCount += 1, this.isExecuting = this.activeCount > 0, this.isCanceled = !1, this.opt.trackError && this.opt.resetErrorOnExecute && (this.error = null);
      });
      const I = this.cancelToken;
      let p = !1, T = !1, H = null, B = null;
      try {
        (a = (s = this.opt).onStart) === null || a === void 0 || a.call(s, ...i);
        const P = this.opt.abortable ? m.signal : void 0;
        B = this.fn(...i, P);
        const M = yield B;
        return T = this.cancelToken !== I, T ? void 0 : ((d = (l = this.opt).onSuccess) === null || d === void 0 || d.call(l, M, ...i), p = !0, M);
      } catch (P) {
        if (this.opt.abortable && m?.signal.aborted) {
          N(() => {
            this.isCanceled = !0;
          }), T = !0, H = null;
          return;
        }
        if (H = P, T = this.cancelToken !== I, this.opt.trackError && N(() => {
          this.error = P;
        }), (f = (u = this.opt).onError) === null || f === void 0 || f.call(u, P), !this.opt.swallowError)
          throw P;
        return;
      } finally {
        N(() => {
          this.activeCount = Math.max(0, this.activeCount - 1), this.isExecuting = this.activeCount > 0;
        }), m && this.controllers.delete(m), !T && this.cancelToken !== I && (T = !0), (g = (_ = this.opt).onFinally) === null || g === void 0 || g.call(_, { ok: p, canceled: T, error: H }, ...i);
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
function ge(t, i) {
  return new me(t, i);
}
function Be(t, i) {
  const r = Ct(t), o = /* @__PURE__ */ new Set(), n = i?.onCancel;
  return ge((...a) => {
    const l = r(...a);
    o.add(l);
    const d = () => {
      o.delete(l);
    };
    return l.then(d, d), new Promise((u, f) => {
      l.then(u, (_) => {
        if (Lt(_)) {
          u(void 0);
          return;
        }
        f(_);
      });
    });
  }, Object.assign(Object.assign({}, i), { onCancel: () => {
    var a;
    for (const l of o)
      (a = l.cancel) === null || a === void 0 || a.call(l);
    n?.();
  } }));
}
function Ge(t) {
  return function(...i) {
    return N(() => t.apply(this, i));
  };
}
export {
  Z as GetService,
  Ke as GetStore,
  Wt as Inject,
  He as InjectStore,
  Ee as MakeObservable,
  re as Model,
  je as PropFromView,
  Pt as Service,
  ke as SetService,
  ze as Store,
  Le as StoreBase,
  Ae as TODO,
  qe as ViewModel,
  ge as asyncCommand,
  ie as attachModelDevtools,
  ye as attachStoreDevtools,
  Ge as commandAction,
  C as defineMetadata,
  Te as define_prop,
  Pe as exclude,
  Re as field,
  Be as flowCommand,
  Gt as getExecutingFunctionNameByStack,
  K as getOwnMetadata,
  Ie as isSerializable,
  xe as submit,
  Ce as validation,
  Ye as view
};
//# sourceMappingURL=index.js.map
