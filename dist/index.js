import "reflect-metadata";
import { d as yt, _ as U, a as $, b as g, e as ye, c as v } from "./tslib.es6-COgJoJmX.js";
import me, { isObject as se, isEqual as ne, isEmpty as ve } from "lodash";
import { makeObservable as mt, reaction as ue, runInAction as W, observable as at, isObservable as ae, computed as Z, action as R, flow as ge, isFlowCancellationError as pe, makeAutoObservable as be } from "mobx";
import { enablePatches as De, immerable as re, createDraft as Oe, applyPatches as oe, produce as Ie } from "immer";
import { observer as we } from "mobx-react";
import { useMemo as Me, useEffect as Se } from "react";
const L = (e, i, r) => Reflect.getOwnMetadata(e, i) || r || {}, F = (e, i, r) => Reflect.defineMetadata(e, i, r);
function li(...e) {
  try {
    return JSON.stringify(e), !0;
  } catch {
    return !1;
  }
}
function ke(e) {
  if (e && typeof e == "string") {
    let [i] = e.split(`
`)[2].replace(/at (get)?/, "").match(/.*/g) || [];
    return i && (i = i.trim()), i;
  }
}
const le = {}, ut = [];
let ce = !1;
const ci = (e, ...i) => {
  const r = new Error().stack;
  if (!ce)
    console.log("%c TODO", "background: #222; color: #bada55", le), ce = !0;
  else {
    const s = ke(r);
    ut.includes(s) === !1 && (ut.push(s), Reflect.set(le, `${ut.length}) ${e}`, { msg: i, get path() {
      return console.info(i, s), s;
    } }));
  }
  function o(...s) {
  }
  return o;
}, B = (e, i) => !!e && (typeof i == "string" || typeof i == "symbol"), Y = (e) => !!e && typeof e == "object" && "kind" in e, Ae = (e) => ({
  kind: "class",
  name: e,
  addInitializer: () => {
  },
  metadata: {}
}), X = /* @__PURE__ */ Symbol("service-key"), vt = new Proxy({}, Reflect);
function Te(e) {
  const i = (o, s) => {
    Object.defineProperty(o, s, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, s))
          return Reflect.get(this, s);
        const n = tt(e, "instance");
        if (n)
          return Object.defineProperty(this, s, { value: n, writable: !0, configurable: !0, enumerable: !0 }), n;
      },
      set(n) {
        const a = tt(e, "instance");
        Object.defineProperty(this, s, { value: a ?? n, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  };
  function r(o, s) {
    if (B(o, s)) {
      i(o, s);
      return;
    }
    return s.addInitializer(function() {
      return yt(this, void 0, void 0, function* () {
        const n = tt(e, "instance");
        n && Object.hasOwn(this, s.name) && Reflect.set(this, s.name, n);
      });
    }), (n) => n;
  }
  return r;
}
function tt(e, i) {
  var r;
  const o = L(X, vt);
  if (typeof e != "string") {
    const s = L(X, e);
    if (s)
      return i && i in s ? s[i] : s;
    for (const n in o) {
      const a = o[n];
      if (a.target === e) {
        e = a.context.name;
        break;
      }
    }
  }
  if (typeof e == "string")
    return i ? (r = o[e]) === null || r === void 0 ? void 0 : r[i] : o[e];
}
function fe(e, i) {
  const r = (s, n) => {
    const a = String(typeof e == "string" && e || typeof e == "object" && e?.id || n?.name || s?.name), l = L(X, vt), h = new Proxy({
      target: s,
      instance: typeof e == "object" && Reflect.get(e, "transient") || typeof e == "object" && Reflect.get(e, "lazy") ? s : new s(),
      context: n,
      options: e
    }, {
      get(f, _, m) {
        var D, p;
        if (_ === "instance" && (!((D = f?.options) === null || D === void 0) && D.transient))
          return new s();
        if (_ === "instance" && (!((p = f?.options) === null || p === void 0) && p.lazy) && f.instance === s) {
          const T = new s();
          return Reflect.set(f, _, T, m), T;
        }
        return Reflect.get(f, _, m);
      },
      set(f, _, m, D) {
        return Reflect.set(f, _, m, D);
      }
    });
    l[a] = h, F(X, l, vt), F(X, l[a], s);
  };
  function o(s, n) {
    var a, l;
    const h = s.__legacy_source__, f = Y(n) ? n : Ae((l = (a = h?.name) !== null && a !== void 0 ? a : s?.name) !== null && l !== void 0 ? l : "");
    r(s, f), h && h !== s && F(X, L(X, s), h);
  }
  return me.isFunction(e) ? o(e, i) : e ? (s, n) => o(s, n) : o;
}
const di = (e, i) => {
  const { kind: r = "class", name: o = "", addInitializer: s = () => {
  }, metadata: n } = i?.ctx || {};
  return fe(i)(e, {
    kind: r,
    name: o,
    addInitializer: s,
    metadata: n
  }), tt(e).instance;
};
function ft(e) {
  const i = Object.assign({ enumerable: !1, writable: !0 }, e);
  return function(r, o) {
    if (B(r, o)) {
      Object.defineProperty(r, o, {
        configurable: !0,
        enumerable: i.enumerable,
        get() {
        },
        set(s) {
          Object.defineProperty(this, o, Object.assign({ value: s }, i));
        }
      });
      return;
    }
    if (Y(o)) {
      const s = o;
      return s.kind === "field" ? function(n) {
        return Object.defineProperty(this, s.name, Object.assign({ value: n }, i)), n;
      } : (s.addInitializer(function() {
        const n = Object.getOwnPropertyDescriptor(this, s.name);
        n && Object.defineProperty(this, s.name, Object.assign(Object.assign({}, n), { enumerable: i.enumerable }));
      }), r);
    }
  };
}
function z(e, i) {
  return B(e, i) || Y(i) ? ft()(e, i) : ft(e);
}
function hi(e, i) {
  const r = (n) => class extends n {
    constructor(...a) {
      super(...a), mt(this);
    }
  }, o = (n, a) => {
    if (typeof Reflect?.getOwnMetadataKeys == "function")
      for (const l of Reflect.getOwnMetadataKeys(n)) {
        const h = Reflect.getOwnMetadata(l, n);
        Reflect.defineMetadata(l, h, a);
      }
  };
  function s(n, a) {
    if (!Y(a)) {
      const l = n, h = r(l);
      return Object.defineProperty(h, "__legacy_source__", { value: l, configurable: !0 }), o(l, h), h;
    }
    a.addInitializer(function() {
      mt(this);
    });
  }
  return e && !Y(i) || e ? s(e, i) : s;
}
const Ee = /* @__PURE__ */ Symbol("field-key"), xe = /* @__PURE__ */ Symbol("validation-key"), je = /* @__PURE__ */ Symbol("submit-key"), Ve = /* @__PURE__ */ Symbol("exclude-key"), Pe = /* @__PURE__ */ Symbol("prop-from-view-key");
class et {
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
    const r = [], o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
    let n = i;
    for (; n; ) {
      const l = Reflect.getOwnMetadata(this.metadataKey, n);
      if (Array.isArray(l))
        for (const h of l) {
          const f = h?.name, _ = String(f);
          s.has(_) || (s.add(_), r.push(h), o.set(_, h));
        }
      n = Object.getPrototypeOf(n);
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
    return i instanceof et || Object.getOwnPropertyNames(this).some((r) => Object.keys(i).includes(r));
  }
  /**
   * Получить метаданные конкретного поля модели.
   */
  fieldInstance(i, r) {
    const o = r && typeof r == "object" ? Reflect.getOwnMetadata(this.metadataKey, r) : void 0;
    if (Array.isArray(o))
      return o.find((l) => l.name === i);
    const s = this.getCacheTarget(r);
    if (!s)
      return;
    const n = Reflect.getOwnMetadata(this.metadataKey, s), a = this.cache.get(s);
    if (!a || a.ownRef !== n) {
      const l = this.computeFromPrototype(s);
      return this.cache.set(s, l), l.map.get(String(i));
    }
    return a.map.get(String(i));
  }
  /**
   * Получить массив метаданных полей модели.
   */
  fields(i) {
    const r = i && typeof i == "object" ? Reflect.getOwnMetadata(this.metadataKey, i) : void 0;
    if (Array.isArray(r)) {
      const l = [], h = /* @__PURE__ */ new Set();
      let f = i;
      for (; f; ) {
        const _ = Reflect.getOwnMetadata(this.metadataKey, f);
        if (Array.isArray(_))
          for (const m of _) {
            const D = m?.name, p = String(D);
            h.has(p) || (h.add(p), l.push(m));
          }
        f = Object.getPrototypeOf(f);
      }
      return l;
    }
    const o = this.getCacheTarget(i);
    if (!o)
      return [];
    const s = Reflect.getOwnMetadata(this.metadataKey, o), n = this.cache.get(o);
    if (n && n.ownRef === s)
      return n.list;
    const a = this.computeFromPrototype(o);
    return this.cache.set(o, a), a.list;
  }
}
class gt extends et {
  constructor() {
    super(...arguments), this.metadataKey = xe;
  }
}
class pt extends et {
  constructor() {
    super(...arguments), this.metadataKey = je;
  }
}
class bt extends et {
  constructor() {
    super(...arguments), this.metadataKey = Ve;
  }
}
class Dt extends et {
  /**
   * Создать метаданные поля модели.
   */
  constructor(i = {}) {
    super(i), this.factory = null, this.mapping = null, this.collectChanges = !1, this.name = null, this.ctx = null, this.metadataKey = Ee, this.factory = i.factory, this.mapping = i.mapping, this.name = i.name, this.ctx = i.ctx, this.collectChanges = !!i.collectChanges;
  }
}
class Ot extends et {
  /**
   * Создать метаданные для PropFromView.
   */
  constructor(i = {}) {
    super(i), this.metadataKey = Pe;
    for (const r in this)
      i && r in i && (this[r] = Reflect.get(i, r));
  }
}
function ui(e) {
  const i = (s, n) => {
    const a = new Ot({ name: e, originName: String(n) });
    a.name = e, a.originName = String(n);
    const l = L(a.metadataKey, s, new Array());
    F(a.metadataKey, [...l, a], s);
  }, r = (s) => {
    s.addInitializer(function() {
      const n = new Ot(), a = n.fields(this);
      for (const l in this)
        a instanceof Array && s.name === l && (n.name = e, n.originName = l, n.value = this[l], a.push(n));
      F(n.metadataKey, a, this);
    });
  };
  function o(s, n) {
    if (B(s, n)) {
      i(s, n);
      return;
    }
    if (Y(n))
      return r(n), n.kind === "field" ? (a) => a : n;
  }
  return e ? ((s, n) => o(s, n)) : ((s) => s);
}
function fi(e) {
  const i = (s, n) => {
    const a = new bt({ callback: e, name: String(n) }), l = L(a.metadataKey, s, new Array());
    F(a.metadataKey, [...l, a], s);
  }, r = (s) => {
    s.addInitializer(function() {
      const n = new bt({ callback: e, name: String(s.name) }), a = L(n.metadataKey, this, new Array());
      F(n.metadataKey, [...a, n], this);
    });
  };
  function o(s, n) {
    if (B(s, n)) {
      i(s, n);
      return;
    }
    if (Y(n))
      return r(n), n.kind === "field" ? void 0 : n;
  }
  if (e)
    return ((s, n) => o(s, n));
}
const Ce = () => {
  var e;
  return (e = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && e !== void 0 ? e : null;
}, Re = () => {
  var e;
  return (e = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0;
}, ot = (e) => {
  var i, r;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((i = o.__MVVM_DEVTOOLS_APPLYING__) !== null && i !== void 0 ? i : 0) + 1;
  try {
    return e();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((r = o.__MVVM_DEVTOOLS_APPLYING__) !== null && r !== void 0 ? r : 1) - 1);
  }
}, Fe = () => Re() > 0, de = (e) => ({
  data: e.service.dumpData,
  historyIndex: e.service.historyIndex
}), ze = (e, i = {}) => {
  const r = Ce();
  if (!r)
    return () => {
    };
  const o = r.connect({ name: i.name, instanceId: i.instanceId });
  let s = !1;
  try {
    o.init(de(e));
  } catch {
  }
  const n = ue(() => de(e), (l) => {
    var h;
    if (!(s || Fe()))
      try {
        o.send({ type: (h = i.actionType) !== null && h !== void 0 ? h : "model:update" }, l);
      } catch {
      }
  }), a = o.subscribe((l) => {
    var h;
    if (l.type !== "DISPATCH")
      return;
    const f = (h = l.payload) === null || h === void 0 ? void 0 : h.type;
    if (f === "RESET") {
      s = !0, ot(() => {
        try {
          e.service.toInit();
        } finally {
          s = !1;
        }
      });
      return;
    }
    if (f === "COMMIT") {
      s = !0, ot(() => {
        try {
          e.service.commit();
        } finally {
          s = !1;
        }
      });
      return;
    }
    if (f === "ROLLBACK") {
      s = !0, ot(() => {
        try {
          e.service.toInit();
        } finally {
          s = !1;
        }
      });
      return;
    }
    if (f === "JUMP_TO_ACTION" || f === "JUMP_TO_STATE") {
      if (!l.state)
        return;
      try {
        const _ = JSON.parse(l.state), m = _.historyIndex, D = e.service.history, p = Array.isArray(D) && D.length > 0, T = typeof m == "number" && (m === -1 && p || m >= 0 && p && m < D.length);
        s = !0, ot(() => {
          var j;
          try {
            if (T) {
              e.service.goToHistory(m);
              return;
            }
            const x = (j = _.data) !== null && j !== void 0 ? j : _;
            W(() => {
              e.service.loadData(x);
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
    n(), typeof a == "function" && a(), typeof o.unsubscribe == "function" && o.unsubscribe(), typeof o.disconnect == "function" && o.disconnect();
  };
};
De();
const Le = new pt(), N = new Dt(), Ke = new gt(), He = new bt();
let qe = (() => {
  var e, i, r, o, s, n, a, l, h, f;
  let _ = [], m, D = [], p = [], T, j = [], x = [], K, G = [], V = [], S, c = [], I = [], A, P = [], E = [], C, H = [], Q = [], J, it = [], st = [], nt, rt = [], wt = [], Mt, St = [], kt = [], At, Tt = [], Et = [], xt, jt = [], Vt = [], Pt, Ct = [], Rt = [], Ft, zt = [], Lt = [], Kt, Ht = [], qt = [], Yt, Bt, Gt, Nt, Ut, $t, Wt, Qt, Jt, Xt, Zt, te;
  return e = class {
    get initData() {
      return U(this, i, "f");
    }
    set initData(t) {
      $(this, i, t, "f");
    }
    get committedData() {
      return U(this, r, "f");
    }
    set committedData(t) {
      $(this, r, t, "f");
    }
    get modified_() {
      return U(this, o, "f");
    }
    set modified_(t) {
      $(this, o, t, "f");
    }
    get changes() {
      return U(this, s, "f");
    }
    set changes(t) {
      $(this, s, t, "f");
    }
    get inverseChanges() {
      return U(this, n, "f");
    }
    set inverseChanges(t) {
      $(this, n, t, "f");
    }
    get history() {
      return U(this, a, "f");
    }
    set history(t) {
      $(this, a, t, "f");
    }
    get historyIndex() {
      return U(this, l, "f");
    }
    set historyIndex(t) {
      $(this, l, t, "f");
    }
    /**
     * Создает модель и инициализирует данные.
     */
    constructor(t = {}, d) {
      this[h] = (g(this, _), g(this, D, !0)), i.set(this, (g(this, p), g(this, j, null))), r.set(this, (g(this, x), g(this, G, {}))), o.set(this, (g(this, V), g(this, c, {}))), this.draft = (g(this, I), g(this, P, null)), s.set(this, (g(this, E), g(this, H, []))), n.set(this, (g(this, Q), g(this, it, []))), a.set(this, (g(this, st), g(this, rt, []))), l.set(this, (g(this, wt), g(this, St, -1))), this.initializedFields = (g(this, kt), g(this, Tt, void 0)), this.legacyInitDone = (g(this, Et), g(this, jt, !1)), this.rawInitData = (g(this, Vt), g(this, Ct, null)), this.options = (g(this, Rt), g(this, zt, void 0)), this.historyMuted = (g(this, Lt), g(this, Ht, !1)), this.serviceApi = (g(this, qt), {
        loadData: (u) => this.loadData(u),
        reject: () => this.reject(),
        commit: () => this.commit(),
        commitField: (u) => this.commitField(u),
        toInit: () => this.toInit(),
        undo: () => this.undo(),
        redo: () => this.redo(),
        goToHistory: (u) => this.goToHistory(u)
      }), this.options = d, this[re] = !0, this.init(t), this.autoAttachDevtools(), this.initLegacyFields();
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
    initValidation(t) {
      if (t)
        Reflect.get(this.validation, t);
      else
        for (const d in this.validation)
          this.validation[d];
    }
    /**
     * Полная инициализация модели и полей.
     */
    init(t = {}) {
      this.cloneForInit(t), this.createDraft(t), this.defineData(this.initData);
    }
    /**
     * Инициализировать отдельное поле модели.
     */
    initField(t, d) {
      const u = N.fieldInstance(t, this);
      if (u) {
        t in this.initData || Reflect.set(this.initData, t, Reflect.get(this, t));
        const y = u?.factory ? u.factory(this.initData, this) : Reflect.get(this.initData, u.name);
        this.defineFieldValue(t, y, u), d?.skipValidation || this.initValidation(t), this.getInitializedFields().add(String(t));
      }
    }
    getInitializedFields() {
      return this.initializedFields || (this.initializedFields = /* @__PURE__ */ new Set()), this.initializedFields;
    }
    initLegacyFields() {
      var t;
      if (this.legacyInitDone)
        return;
      const d = N.fields(this);
      if (!d.some((b) => Object.prototype.hasOwnProperty.call(this, b.name)))
        return;
      this.legacyInitDone = !0;
      const u = this.getInitializedFields(), y = (t = this.rawInitData) !== null && t !== void 0 ? t : this.initData;
      if (y && y !== this.initData)
        try {
          this.initData = y;
        } catch {
          this.initData = Object.assign({}, y);
        }
      for (const b of d) {
        const w = String(b.name);
        if (y && w in y) {
          const M = N.fieldInstance(w, this);
          if (!M)
            continue;
          if (!u.has(w)) {
            const k = y, q = M.factory ? M.factory(k, this) : Reflect.get(k, M.name);
            this.defineFieldValue(w, q, M), Reflect.set(this, w, q), u.add(w);
          }
          continue;
        }
        u.has(w) || this.initField(w, { skipValidation: !0 });
      }
    }
    /**
     * Создать draft для отслеживания изменений.
     */
    createDraft(t) {
      const d = {};
      for (const u in t)
        N.fieldInstance(u, this) && Reflect.set(d, u, t[u]);
      this.draft = Oe(d);
    }
    autoAttachDevtools() {
      var t, d, u, y, b, w, M, k, q, ct, dt;
      const ht = globalThis;
      if (!ht.__MVVM_DEVTOOLS_AUTO__ || ((d = (t = this.options) === null || t === void 0 ? void 0 : t.devtools) === null || d === void 0 ? void 0 : d.enabled) === !1)
        return;
      const ee = (M = (b = (y = (u = this.options) === null || u === void 0 ? void 0 : u.devtools) === null || y === void 0 ? void 0 : y.name) !== null && b !== void 0 ? b : (w = this.constructor) === null || w === void 0 ? void 0 : w.name) !== null && M !== void 0 ? M : "Model", ie = ((k = ht.__MVVM_DEVTOOLS_SEQ__) !== null && k !== void 0 ? k : 0) + 1;
      ht.__MVVM_DEVTOOLS_SEQ__ = ie, ze(this, { name: ee, instanceId: (dt = (ct = (q = this.options) === null || q === void 0 ? void 0 : q.devtools) === null || ct === void 0 ? void 0 : ct.instanceId) !== null && dt !== void 0 ? dt : `${ee}#${ie}` });
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
      this.changes = t.flatMap((d) => d.patches), this.inverseChanges = t.flatMap((d) => d.inversePatches);
    }
    applyHistoryPatches(t) {
      if (!t.length)
        return;
      oe(this.draft, t);
      const d = new Set(t.map((u) => u.field).filter(Boolean));
      d.size !== 0 && this.withHistoryMuted(() => {
        var u;
        for (const y of d) {
          const b = (u = Reflect.get(this.draft, y)) !== null && u !== void 0 ? u : Reflect.get(this.initData, y);
          Reflect.set(this, y, b), this.defineFieldValue(y, Reflect.get(this, y));
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
    produceDraft(t, d, u) {
      if (this.historyMuted)
        return;
      let y, b = [];
      t && (y = t.split(".")[0], y && !N.fieldInstance(y, this).collectChanges) || (Ie(this.draft, (w) => {
        if (t) {
          let M = w;
          const k = t.split(".");
          if (k.length > 1)
            for (let q = 0; q < k.length && !(q != k.length - 1 && !se(M)); q++)
              se(M) && (M = M[k[q]]);
          else
            u = t;
          M && (M[u] = d);
        }
      }, (w, M) => {
        y && (w = w.map((k) => Object.assign(Object.assign({}, k), { field: y })), M = M.map((k) => Object.assign(Object.assign({}, k), { field: y }))), b = w, !(!w.length && !M.length) && (this.historyIndex < this.history.length - 1 && (this.history = this.history.slice(0, this.historyIndex + 1), this.syncChangesFromHistory()), this.changes.push(...w), this.inverseChanges.push(...M), this.history.push({ patches: w, inversePatches: M }), this.historyIndex = this.history.length - 1);
      }), b.length && oe(this.draft, b));
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
    createObservable(t, d, u, y = u) {
      return t = ae(t) ? t : at.box(t), new Proxy(t, {
        get: (b, w, M) => {
          const k = Reflect.get(b, w, M);
          return k && typeof k == "object" && !(k instanceof e) && !ae(t) ? this.createObservable(k, String(w), d, `${y}.${String(w)}`) : k;
        },
        set: (b, w, M, k) => (t = M, this.produceDraft(y, t, String(w)), this.checkChange(u, Reflect.get(this, u)), Reflect.set(b, w, M, k))
      });
    }
    /**
     * Определить getter/setter для поля модели.
     */
    defineFieldValue(t, d, u) {
      return !u && (u = N.fieldInstance(t, this)), d && typeof d == "object" && (d = this.createObservable(d, t, t)), d = at.box(d), Reflect.defineProperty(this, u.name, {
        get: () => d.get(),
        set: (y) => {
          W(() => d.set(y)), this.produceDraft(u.name, d.get()), this.checkChange(u.name, d.get());
        },
        enumerable: !0,
        configurable: !0
      }), d;
    }
    /**
     * Сохранить исходные данные с глубоким клонированием.
     */
    cloneForInit(t) {
      if (t)
        try {
          this.initData = Object.assign({}, t);
        } catch {
        }
      else
        this.rawInitData = null;
    }
    /**
     * Проверить изменение поля и обновить modified_.
     */
    checkChange(t, d) {
      const u = Reflect.get(this.committedData, t) || Reflect.get(this.initData, t), y = t && t in this.initData && !ne(u, d);
      return W(() => {
        y && Reflect.set(this.modified_, t, u);
        for (const b in this.modified_)
          t === b && t in this.modified_ && ne(u, d) && delete this.modified_[b];
      }), y;
    }
    /**
     * Применить данные к полям модели.
     */
    defineData(t) {
      for (const d in this)
        Object.prototype.hasOwnProperty.call(this, d) && N.fieldInstance(d, this) && (Reflect.set(this, d, Reflect.get(t, d)), this.initField(d));
    }
    /**
     * Признак наличия изменений.
     */
    get dirty() {
      return !ve(this.modified_);
    }
    /**
     * Зафиксировать все изменения.
     */
    commit() {
      for (const t of N.fields(this))
        this.commitField(t.name);
      this.modified_ = {};
    }
    /**
     * Зафиксировать изменения конкретного поля.
     */
    commitField(t) {
      for (const d in this)
        d in this.modified_ && Reflect.set(this.committedData, d, this[d]);
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
          t in this.initData && (this[t] = Reflect.get(this.initData, t), this.initField(t));
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
    goToHistory(t) {
      if (!(t < -1 || t >= this.history.length) && t !== this.historyIndex) {
        for (; this.historyIndex < t; )
          this.historyIndex = this.historyIndex + 1, this.applyHistoryPatches(this.history[this.historyIndex].patches);
        for (; this.historyIndex > t; )
          this.applyHistoryPatches(this.history[this.historyIndex].inversePatches), this.historyIndex -= 1;
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
      const t = /* @__PURE__ */ Object.create({}), d = (y) => {
        try {
          return Le.fieldInstance(y, this).callback(Reflect.get(this, y), this);
        } catch {
          return Reflect.get(this, y);
        }
      }, u = (y) => {
        const b = He.fieldInstance(y, this);
        if (b)
          switch (typeof b.callback) {
            case "boolean":
              return !!b.callback;
            case "function":
              return b.callback(Reflect.get(this, y), this);
          }
        return !1;
      };
      N.fields(this).forEach((y) => {
        var b;
        if (y.name in this)
          return !((b = this.options) === null || b === void 0) && b.byFields && !this.options.byFields.includes(y.name) || u(y.name) ? void 0 : Reflect.set(t, y.name, d(y.name));
      });
      try {
        return t;
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
      for (const d in this) {
        const u = Ke.fieldInstance(d, this);
        u && Reflect.set(t, d, u.callback(this[d], this) || "");
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
  }, i = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), m = [z], h = ye(re), (() => {
    const O = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    T = [at, z], K = [z], S = [z], A = [z], C = [z], J = [z], nt = [z], Mt = [z], At = [z], xt = [z], Pt = [z], Ft = [z], Kt = [z], Yt = [R], Bt = [Z], Gt = [R], Nt = [R], Ut = [R], $t = [R], Wt = [R], Qt = [R], Jt = [R], Xt = [Z], Zt = [Z], te = [(f = Z).struct.bind(f)], v(e, null, T, { kind: "accessor", name: "initData", static: !1, private: !1, access: { has: (t) => "initData" in t, get: (t) => t.initData, set: (t, d) => {
      t.initData = d;
    } }, metadata: O }, j, x), v(e, null, K, { kind: "accessor", name: "committedData", static: !1, private: !1, access: { has: (t) => "committedData" in t, get: (t) => t.committedData, set: (t, d) => {
      t.committedData = d;
    } }, metadata: O }, G, V), v(e, null, S, { kind: "accessor", name: "modified_", static: !1, private: !1, access: { has: (t) => "modified_" in t, get: (t) => t.modified_, set: (t, d) => {
      t.modified_ = d;
    } }, metadata: O }, c, I), v(e, null, C, { kind: "accessor", name: "changes", static: !1, private: !1, access: { has: (t) => "changes" in t, get: (t) => t.changes, set: (t, d) => {
      t.changes = d;
    } }, metadata: O }, H, Q), v(e, null, J, { kind: "accessor", name: "inverseChanges", static: !1, private: !1, access: { has: (t) => "inverseChanges" in t, get: (t) => t.inverseChanges, set: (t, d) => {
      t.inverseChanges = d;
    } }, metadata: O }, it, st), v(e, null, nt, { kind: "accessor", name: "history", static: !1, private: !1, access: { has: (t) => "history" in t, get: (t) => t.history, set: (t, d) => {
      t.history = d;
    } }, metadata: O }, rt, wt), v(e, null, Mt, { kind: "accessor", name: "historyIndex", static: !1, private: !1, access: { has: (t) => "historyIndex" in t, get: (t) => t.historyIndex, set: (t, d) => {
      t.historyIndex = d;
    } }, metadata: O }, St, kt), v(e, null, Yt, { kind: "method", name: "produceDraft", static: !1, private: !1, access: { has: (t) => "produceDraft" in t, get: (t) => t.produceDraft }, metadata: O }, null, _), v(e, null, Bt, { kind: "getter", name: "dirty", static: !1, private: !1, access: { has: (t) => "dirty" in t, get: (t) => t.dirty }, metadata: O }, null, _), v(e, null, Gt, { kind: "method", name: "commit", static: !1, private: !1, access: { has: (t) => "commit" in t, get: (t) => t.commit }, metadata: O }, null, _), v(e, null, Nt, { kind: "method", name: "commitField", static: !1, private: !1, access: { has: (t) => "commitField" in t, get: (t) => t.commitField }, metadata: O }, null, _), v(e, null, Ut, { kind: "method", name: "reject", static: !1, private: !1, access: { has: (t) => "reject" in t, get: (t) => t.reject }, metadata: O }, null, _), v(e, null, $t, { kind: "method", name: "toInit", static: !1, private: !1, access: { has: (t) => "toInit" in t, get: (t) => t.toInit }, metadata: O }, null, _), v(e, null, Wt, { kind: "method", name: "undo", static: !1, private: !1, access: { has: (t) => "undo" in t, get: (t) => t.undo }, metadata: O }, null, _), v(e, null, Qt, { kind: "method", name: "redo", static: !1, private: !1, access: { has: (t) => "redo" in t, get: (t) => t.redo }, metadata: O }, null, _), v(e, null, Jt, { kind: "method", name: "goToHistory", static: !1, private: !1, access: { has: (t) => "goToHistory" in t, get: (t) => t.goToHistory }, metadata: O }, null, _), v(e, null, Xt, { kind: "getter", name: "validation", static: !1, private: !1, access: { has: (t) => "validation" in t, get: (t) => t.validation }, metadata: O }, null, _), v(e, null, Zt, { kind: "getter", name: "validAndDirty", static: !1, private: !1, access: { has: (t) => "validAndDirty" in t, get: (t) => t.validAndDirty }, metadata: O }, null, _), v(e, null, te, { kind: "getter", name: "service", static: !1, private: !1, access: { has: (t) => "service" in t, get: (t) => t.service }, metadata: O }, null, _), v(null, null, m, { kind: "field", name: h, static: !1, private: !1, access: { has: (t) => h in t, get: (t) => t[h], set: (t, d) => {
      t[h] = d;
    } }, metadata: O }, D, p), v(null, null, A, { kind: "field", name: "draft", static: !1, private: !1, access: { has: (t) => "draft" in t, get: (t) => t.draft, set: (t, d) => {
      t.draft = d;
    } }, metadata: O }, P, E), v(null, null, At, { kind: "field", name: "initializedFields", static: !1, private: !1, access: { has: (t) => "initializedFields" in t, get: (t) => t.initializedFields, set: (t, d) => {
      t.initializedFields = d;
    } }, metadata: O }, Tt, Et), v(null, null, xt, { kind: "field", name: "legacyInitDone", static: !1, private: !1, access: { has: (t) => "legacyInitDone" in t, get: (t) => t.legacyInitDone, set: (t, d) => {
      t.legacyInitDone = d;
    } }, metadata: O }, jt, Vt), v(null, null, Pt, { kind: "field", name: "rawInitData", static: !1, private: !1, access: { has: (t) => "rawInitData" in t, get: (t) => t.rawInitData, set: (t, d) => {
      t.rawInitData = d;
    } }, metadata: O }, Ct, Rt), v(null, null, Ft, { kind: "field", name: "options", static: !1, private: !1, access: { has: (t) => "options" in t, get: (t) => t.options, set: (t, d) => {
      t.options = d;
    } }, metadata: O }, zt, Lt), v(null, null, Kt, { kind: "field", name: "historyMuted", static: !1, private: !1, access: { has: (t) => "historyMuted" in t, get: (t) => t.historyMuted, set: (t, d) => {
      t.historyMuted = d;
    } }, metadata: O }, Ht, qt), O && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: O });
  })(), e;
})();
const Ye = () => {
  var e;
  const i = globalThis;
  return !!((e = i.__MVVM_DEVTOOLS_HISTORY__) !== null && e !== void 0 ? e : i.__MVVM_DEVTOOLS_AUTO__);
}, Be = (e) => Ye() ? !e || typeof e != "object" ? { collectChanges: !0 } : "collectChanges" in e ? e : Object.assign(Object.assign({}, e), { collectChanges: !0 }) : e;
function yi(e, i) {
  const r = Be(B(e, i) ? void 0 : e), o = (a, l) => {
    const h = new Dt(Object.assign(Object.assign({}, r), { name: String(l), ctx: null })), f = L(h.metadataKey, a, new Array());
    F(h.metadataKey, [...f, h], a), Object.getOwnPropertyDescriptor(a, l) || Object.defineProperty(a, l, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, l))
          return Reflect.get(this, l);
        if (this.initData && l in this.initData && typeof this.initField == "function")
          return this.initField.call(this, String(l), { skipValidation: !0 }), Reflect.get(this, l);
      },
      set(m) {
        if (this.initData && !(l in this.initData) && Reflect.set(this.initData, l, m), typeof this.initField == "function") {
          this.initField.call(this, String(l), { skipValidation: !0 });
          return;
        }
        Object.defineProperty(this, l, { value: m, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  }, s = (a) => {
    a.addInitializer(function() {
      if (this instanceof qe && typeof this.initField == "function") {
        const l = new Dt(Object.assign(Object.assign({}, r), { name: String(a.name), ctx: a })), h = L(l.metadataKey, this, new Array());
        F(l.metadataKey, [...h, l], this), this.initField.call(this, String(a.name));
      }
    });
  };
  function n(a, l) {
    if (B(a, l)) {
      o(a, l);
      return;
    }
    if (Y(l))
      return s(l), l.kind === "field" ? (h) => h : l;
  }
  return B(e, i) ? n(e, i) : r && !Y(i) ? (a, l) => n(a, l) : Y(i) ? n(void 0, i) : (a, l) => n(a, l);
}
function mi(e) {
  const i = (s, n) => {
    const a = new pt({ callback: e, name: String(n) }), l = L(a.metadataKey, s, new Array());
    F(a.metadataKey, [...l, a], s);
  }, r = (s) => {
    const n = new pt({ callback: e, name: String(s.name) });
    s.addInitializer(function() {
      const a = L(n.metadataKey, this, new Array());
      F(n.metadataKey, [...a, n], this);
    });
  };
  function o(s, n) {
    if (B(s, n)) {
      i(s, n);
      return;
    }
    if (Y(n))
      return r(n), n.kind === "field" ? (a) => a : n;
  }
  return e ? ((s, n) => o(s, n)) : ((s) => s);
}
function vi(e) {
  const i = (s, n) => {
    const a = new gt({ callback: e, name: String(n) }), l = L(a.metadataKey, s, new Array());
    F(a.metadataKey, [...l, a], s);
  }, r = (s) => {
    const n = new gt({ callback: e, name: String(s.name) });
    s.addInitializer(function() {
      const a = L(n.metadataKey, this, new Array());
      F(n.metadataKey, [...a, n], this);
    });
  };
  function o(s, n) {
    if (B(s, n)) {
      i(s, n);
      return;
    }
    if (Y(n))
      return r(n), n.kind === "field" ? (a) => a : n;
  }
  return e ? ((s, n) => o(s, n)) : ((s) => s);
}
const _e = /* @__PURE__ */ Symbol("store-key"), Ge = () => {
  var e;
  return (e = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && e !== void 0 ? e : null;
}, Ne = () => {
  var e;
  return (e = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0;
}, Ue = (e) => {
  var i, r;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((i = o.__MVVM_DEVTOOLS_APPLYING__) !== null && i !== void 0 ? i : 0) + 1;
  try {
    return e();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((r = o.__MVVM_DEVTOOLS_APPLYING__) !== null && r !== void 0 ? r : 1) - 1);
  }
}, $e = () => Ne() > 0, It = (e) => ({
  items: e.items.map((i) => {
    var r, o;
    return {
      name: (o = (r = i.constructor) === null || r === void 0 ? void 0 : r.name) !== null && o !== void 0 ? o : "Model",
      data: i.service.dumpData,
      historyIndex: i.service.historyIndex
    };
  })
}), We = (e) => !!(e && typeof e == "object" && Array.isArray(e.items)), Qe = (e) => {
  if (!e)
    return null;
  try {
    const i = JSON.parse(e);
    return We(i) ? i : null;
  } catch {
    return null;
  }
}, Je = (e, i = {}) => {
  var r, o;
  const s = Ge();
  if (!s)
    return () => {
    };
  const n = s.connect({ name: i.name, instanceId: i.instanceId });
  let a = !1, l = (o = (r = e.items[0]) === null || r === void 0 ? void 0 : r.constructor) !== null && o !== void 0 ? o : null;
  try {
    n.init(It(e));
  } catch {
  }
  const h = ue(() => It(e), (m) => {
    var D;
    if (a || $e())
      return;
    const p = (D = e.items[0]) === null || D === void 0 ? void 0 : D.constructor;
    p && (l = p);
    try {
      n.send({ type: "store:update" }, m);
    } catch {
    }
  }), f = (m) => (a = !0, Ue(() => {
    try {
      return m();
    } finally {
      a = !1;
    }
  })), _ = n.subscribe((m) => {
    var D;
    if (m.type !== "DISPATCH")
      return;
    const p = (D = m.payload) === null || D === void 0 ? void 0 : D.type;
    if (p === "RESET" || p === "ROLLBACK") {
      f(() => e.reset());
      return;
    }
    if (p === "JUMP_TO_ACTION" || p === "JUMP_TO_STATE") {
      const T = Qe(m.state);
      if (!T)
        return;
      f(() => {
        var j, x, K;
        if (T.items.length === e.items.length && e.items.every((I) => {
          var A, P;
          return typeof ((A = I?.service) === null || A === void 0 ? void 0 : A.goToHistory) == "function" || typeof ((P = I?.service) === null || P === void 0 ? void 0 : P.loadData) == "function";
        })) {
          W(() => {
            T.items.forEach((I, A) => {
              var P;
              const E = (P = e.items[A]) === null || P === void 0 ? void 0 : P.service, C = I.historyIndex, H = E?.history;
              if (Array.isArray(H) && H.length > 0 && typeof C == "number" && typeof E?.goToHistory == "function" && (C === -1 && H.length > 0 || C < H.length)) {
                E.goToHistory(C);
                return;
              }
              typeof E?.loadData == "function" && E.loadData(I.data);
            });
          });
          return;
        }
        const V = (x = (j = e.items[0]) === null || j === void 0 ? void 0 : j.constructor) !== null && x !== void 0 ? x : l, S = T.items.map((I) => I.data);
        if (V) {
          e.applyLoaded(S, { model: V, cash: !1 }), l = V;
          return;
        }
        e.applyLoaded(S, { cash: !1 });
        const c = (K = e.items[0]) === null || K === void 0 ? void 0 : K.constructor;
        c && (l = c);
      });
    }
  });
  return () => {
    h(), typeof _ == "function" && _(), typeof n.unsubscribe == "function" && n.unsubscribe(), typeof n.disconnect == "function" && n.disconnect();
  };
};
let gi = (() => {
  var e, i, r;
  let o = [], s, n = [], a = [], l, h = [], f = [], _, m, D, p, T, j, x, K, G, V;
  return e = class {
    get items() {
      return U(this, i, "f");
    }
    set items(c) {
      $(this, i, c, "f");
    }
    get _cash() {
      return U(this, r, "f");
    }
    set _cash(c) {
      $(this, r, c, "f");
    }
    constructor() {
      i.set(this, (g(this, o), g(this, n, []))), r.set(this, (g(this, a), g(this, h, []))), g(this, f), mt(this), this.autoAttachDevtools();
    }
    add(c) {
      this.items.push(c);
    }
    addMany(c) {
      c?.length && (this.items = this.items.concat(c));
    }
    remove(c) {
      this.items = this.items.filter((I) => I !== c);
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
    findBy(c, I) {
      return this.items.find((A) => A?.[c] === I);
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
    applyLoaded(c, I = {}) {
      const { model: A, mode: P = "replace", cash: E = !0 } = I;
      if (E && this.setCash(c), P === "append") {
        const C = A ? c.map((H) => new A(H)) : c;
        this.addMany(C);
        return;
      }
      this.items = A ? c.map((C) => new A(C)) : c;
    }
    /**
     * Сохранить оригинальные данные стора.
     */
    setCash(c) {
      this._cash = c ?? [];
    }
    autoAttachDevtools() {
      var c, I, A, P, E, C, H, Q;
      const J = globalThis;
      if (!J.__MVVM_DEVTOOLS_AUTO__)
        return;
      const it = L(_e, this.constructor, {}) || {};
      if (((c = it.devtools) === null || c === void 0 ? void 0 : c.enabled) === !1)
        return;
      const st = (E = (A = (I = it.devtools) === null || I === void 0 ? void 0 : I.name) !== null && A !== void 0 ? A : (P = this.constructor) === null || P === void 0 ? void 0 : P.name) !== null && E !== void 0 ? E : "Store", nt = ((C = J.__MVVM_DEVTOOLS_STORE_SEQ__) !== null && C !== void 0 ? C : 0) + 1;
      J.__MVVM_DEVTOOLS_STORE_SEQ__ = nt;
      const rt = (Q = (H = it.devtools) === null || H === void 0 ? void 0 : H.instanceId) !== null && Q !== void 0 ? Q : `${st}#${nt}`;
      Je(this, { name: st, instanceId: rt });
    }
  }, i = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), (() => {
    const S = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    s = [at], l = [at], _ = [R], m = [R], D = [R], p = [R], T = [Z], j = [Z], x = [Z], K = [R], G = [R], V = [R], v(e, null, s, { kind: "accessor", name: "items", static: !1, private: !1, access: { has: (c) => "items" in c, get: (c) => c.items, set: (c, I) => {
      c.items = I;
    } }, metadata: S }, n, a), v(e, null, l, { kind: "accessor", name: "_cash", static: !1, private: !1, access: { has: (c) => "_cash" in c, get: (c) => c._cash, set: (c, I) => {
      c._cash = I;
    } }, metadata: S }, h, f), v(e, null, _, { kind: "method", name: "add", static: !1, private: !1, access: { has: (c) => "add" in c, get: (c) => c.add }, metadata: S }, null, o), v(e, null, m, { kind: "method", name: "addMany", static: !1, private: !1, access: { has: (c) => "addMany" in c, get: (c) => c.addMany }, metadata: S }, null, o), v(e, null, D, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (c) => "remove" in c, get: (c) => c.remove }, metadata: S }, null, o), v(e, null, p, { kind: "method", name: "clear", static: !1, private: !1, access: { has: (c) => "clear" in c, get: (c) => c.clear }, metadata: S }, null, o), v(e, null, T, { kind: "getter", name: "size", static: !1, private: !1, access: { has: (c) => "size" in c, get: (c) => c.size }, metadata: S }, null, o), v(e, null, j, { kind: "getter", name: "snapshot", static: !1, private: !1, access: { has: (c) => "snapshot" in c, get: (c) => c.snapshot }, metadata: S }, null, o), v(e, null, x, { kind: "getter", name: "cash", static: !1, private: !1, access: { has: (c) => "cash" in c, get: (c) => c.cash }, metadata: S }, null, o), v(e, null, K, { kind: "method", name: "reset", static: !1, private: !1, access: { has: (c) => "reset" in c, get: (c) => c.reset }, metadata: S }, null, o), v(e, null, G, { kind: "method", name: "applyLoaded", static: !1, private: !1, access: { has: (c) => "applyLoaded" in c, get: (c) => c.applyLoaded }, metadata: S }, null, o), v(e, null, V, { kind: "method", name: "setCash", static: !1, private: !1, access: { has: (c) => "setCash" in c, get: (c) => c.setCash }, metadata: S }, null, o), S && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: S });
  })(), e;
})();
function bi(e) {
  return tt(e, "instance");
}
function Di(e) {
  return ((i, r) => Te(e)(i, r));
}
function Oi(e, i) {
  const r = (o, s) => {
    var n;
    const a = typeof e == "string" ? { id: e } : typeof e == "object" ? e : { id: (n = s?.name) !== null && n !== void 0 ? n : o?.name };
    F(_e, a, o), fe(a)(o, s);
  };
  return typeof e == "function" ? r(e, i) : (o, s) => r(o, s);
}
class Ii {
}
const _t = new Ot();
function wi(e, i) {
  return we((r = {}) => {
    const { resolved: o, instance: s } = Me(() => {
      const a = tt(e) || (typeof e != "string" ? { instance: new e() } : void 0), l = a?.instance;
      return { resolved: a, instance: l };
    }, [e]);
    if (Se(() => {
      if (s)
        return typeof s.onInit == "function" && s.onInit(), () => {
          typeof s.onDispose == "function" && s.onDispose();
        };
    }, [s]), o) {
      const n = _t.fields(s), a = n.length > 0 ? n : _t.fields(Object.getPrototypeOf(s));
      for (const l in r)
        if (a instanceof Array) {
          const h = a.find((f) => f.name === l);
          h && Reflect.set(s, h.originName, Reflect.get(r, l));
        }
      return F(_t.metadataKey, a, s), i(Object.assign({ viewModel: s }, r));
    }
    return i(Object.assign({}, r));
  });
}
const he = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, Xe = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, lt = () => {
};
class Ze {
  constructor(i, r) {
    var o, s, n, a, l, h, f;
    this.isExecuting = !1, this.activeCount = 0, this.isCanceled = !1, this.isDisposed = !1, this.error = null, this.controllers = /* @__PURE__ */ new Set(), this.queue = [], this.runningPromise = null, this.queueTail = Promise.resolve(), this.cancelToken = 0, this.fn = i, this.opt = Object.assign({ concurrency: (o = r?.concurrency) !== null && o !== void 0 ? o : "ignore", trackError: (s = r?.trackError) !== null && s !== void 0 ? s : !0, resetErrorOnExecute: (n = r?.resetErrorOnExecute) !== null && n !== void 0 ? n : !0, swallowError: (a = r?.swallowError) !== null && a !== void 0 ? a : !0, abortable: (l = r?.abortable) !== null && l !== void 0 ? l : !1 }, r), this.states = Object.assign(Object.assign({}, he), (h = r?.states) !== null && h !== void 0 ? h : {}), this.stateKeys = Object.assign(Object.assign({}, Xe), (f = r?.stateKeys) !== null && f !== void 0 ? f : {}), be(this, {
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
    const s = (r = this.stateKeys[i]) !== null && r !== void 0 ? r : i;
    return (o = this.states[s]) !== null && o !== void 0 ? o : he[i];
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
    const o = (n) => {
      this.runningPromise = n;
      const a = () => {
        this.runningPromise === n && (this.runningPromise = null);
      };
      return n.then(a, a), n;
    }, s = () => yt(this, void 0, void 0, function* () {
      var n, a, l, h, f, _, m, D;
      if (this.isDisposed)
        return;
      const p = this.opt.abortable ? new AbortController() : null;
      p && this.controllers.add(p), W(() => {
        this.activeCount += 1, this.isExecuting = this.activeCount > 0, this.isCanceled = !1, this.opt.trackError && this.opt.resetErrorOnExecute && (this.error = null);
      });
      const T = this.cancelToken;
      let j = !1, x = !1, K = null, G = null;
      try {
        (a = (n = this.opt).onStart) === null || a === void 0 || a.call(n, ...i);
        const V = this.opt.abortable ? p.signal : void 0;
        G = this.fn(...i, V);
        const S = yield G;
        return x = this.cancelToken !== T, x ? void 0 : ((h = (l = this.opt).onSuccess) === null || h === void 0 || h.call(l, S, ...i), j = !0, S);
      } catch (V) {
        if (this.opt.abortable && p?.signal.aborted) {
          W(() => {
            this.isCanceled = !0;
          }), x = !0, K = null;
          return;
        }
        if (K = V, x = this.cancelToken !== T, this.opt.trackError && W(() => {
          this.error = V;
        }), (_ = (f = this.opt).onError) === null || _ === void 0 || _.call(f, V), !this.opt.swallowError)
          throw V;
        return;
      } finally {
        W(() => {
          this.activeCount = Math.max(0, this.activeCount - 1), this.isExecuting = this.activeCount > 0;
        }), p && this.controllers.delete(p), !x && this.cancelToken !== T && (x = !0), (D = (m = this.opt).onFinally) === null || D === void 0 || D.call(m, { ok: j, canceled: x, error: K }, ...i);
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
        const a = {
          promise: Promise.resolve(void 0),
          resolve: lt,
          reject: lt,
          canceled: !1,
          settled: !1
        }, l = this.activeCount === 0 && this.queue.length === 0;
        a.promise = new Promise((_, m) => {
          a.resolve = _, a.reject = m;
        }), this.queue.push(a);
        const h = () => yt(this, void 0, void 0, function* () {
          if (a.settled)
            return;
          if (a.canceled || this.isDisposed) {
            a.settled = !0, a.resolve(void 0);
            return;
          }
          const _ = this.queue.indexOf(a);
          _ >= 0 && this.queue.splice(_, 1);
          try {
            const m = yield s();
            a.settled || (a.settled = !0, a.resolve(m));
          } catch (m) {
            a.settled || (a.settled = !0, a.reject(m));
          }
        }), f = l ? h() : this.queueTail.then(h, h);
        return this.queueTail = f.then(lt, lt), o(a.promise);
      }
      default:
        return this.isExecuting && this.runningPromise ? this.runningPromise : o(s());
    }
  }
}
function ti(e, i) {
  return new Ze(e, i);
}
function Mi(e, i) {
  const r = ge(e), o = /* @__PURE__ */ new Set(), s = i?.onCancel;
  return ti((...a) => {
    const l = r(...a);
    o.add(l);
    const h = () => {
      o.delete(l);
    };
    return l.then(h, h), new Promise((f, _) => {
      l.then(f, (m) => {
        if (pe(m)) {
          f(void 0);
          return;
        }
        _(m);
      });
    });
  }, Object.assign(Object.assign({}, i), { onCancel: () => {
    var a;
    for (const l of o)
      (a = l.cancel) === null || a === void 0 || a.call(l);
    s?.();
  } }));
}
function Si(e) {
  return function(...i) {
    return W(() => e.apply(this, i));
  };
}
export {
  tt as GetService,
  bi as GetStore,
  Te as Inject,
  Di as InjectStore,
  hi as MakeObservable,
  qe as Model,
  ui as PropFromView,
  fe as Service,
  di as SetService,
  Oi as Store,
  gi as StoreBase,
  ci as TODO,
  Ii as ViewModel,
  ti as asyncCommand,
  ze as attachModelDevtools,
  Je as attachStoreDevtools,
  Si as commandAction,
  F as defineMetadata,
  z as define_prop,
  fi as exclude,
  yi as field,
  Mi as flowCommand,
  ke as getExecutingFunctionNameByStack,
  L as getOwnMetadata,
  li as isSerializable,
  mi as submit,
  vi as validation,
  wi as view
};
//# sourceMappingURL=index.js.map
