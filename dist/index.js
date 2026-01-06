import "reflect-metadata";
import { d as mt, _ as $, a as W, b as p, e as pe, c as g } from "./tslib.es6-COgJoJmX.js";
import be, { isObject as ae, isEqual as re, isEmpty as De } from "lodash";
import { makeObservable as vt, reaction as _e, runInAction as Q, observable as B, isObservable as oe, computed as et, action as R, flow as Ie, isFlowCancellationError as Oe, makeAutoObservable as we } from "mobx";
import { enablePatches as Me, immerable as le, createDraft as Se, applyPatches as ce, produce as ke } from "immer";
import { observer as Te } from "mobx-react";
import { useMemo as Ae, useEffect as Ee } from "react";
const K = (e, i, r) => Reflect.getOwnMetadata(e, i) || r || {}, z = (e, i, r) => Reflect.defineMetadata(e, i, r);
function fi(...e) {
  try {
    return JSON.stringify(e), !0;
  } catch {
    return !1;
  }
}
function xe(e) {
  if (e && typeof e == "string") {
    let [i] = e.split(`
`)[2].replace(/at (get)?/, "").match(/.*/g) || [];
    return i && (i = i.trim()), i;
  }
}
const de = {}, ft = [];
let he = !1;
const _i = (e, ...i) => {
  const r = new Error().stack;
  if (!he)
    console.log("%c TODO", "background: #222; color: #bada55", de), he = !0;
  else {
    const s = xe(r);
    ft.includes(s) === !1 && (ft.push(s), Reflect.set(de, `${ft.length}) ${e}`, { msg: i, get path() {
      return console.info(i, s), s;
    } }));
  }
  function o(...s) {
  }
  return o;
}, G = (e, i) => !!e && (typeof i == "string" || typeof i == "symbol"), Y = (e) => !!e && typeof e == "object" && "kind" in e, je = (e) => ({
  kind: "class",
  name: e,
  addInitializer: () => {
  },
  metadata: {}
}), tt = /* @__PURE__ */ Symbol("service-key"), gt = new Proxy({}, Reflect);
function Ve(e) {
  const i = (o, s) => {
    Object.defineProperty(o, s, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, s))
          return Reflect.get(this, s);
        const n = it(e, "instance");
        if (n)
          return Object.defineProperty(this, s, { value: n, writable: !0, configurable: !0, enumerable: !0 }), n;
      },
      set(n) {
        const a = it(e, "instance");
        Object.defineProperty(this, s, { value: a ?? n, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  };
  function r(o, s) {
    if (G(o, s)) {
      i(o, s);
      return;
    }
    return s.addInitializer(function() {
      return mt(this, void 0, void 0, function* () {
        const n = it(e, "instance");
        n && Object.hasOwn(this, s.name) && Reflect.set(this, s.name, n);
      });
    }), (n) => n;
  }
  return r;
}
function it(e, i) {
  var r;
  const o = K(tt, gt);
  if (typeof e != "string") {
    const s = K(tt, e);
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
function ye(e, i) {
  const r = (s, n) => {
    const a = String(typeof e == "string" && e || typeof e == "object" && e?.id || n?.name || s?.name), l = K(tt, gt), h = new Proxy({
      target: s,
      instance: typeof e == "object" && Reflect.get(e, "transient") || typeof e == "object" && Reflect.get(e, "lazy") ? s : new s(),
      context: n,
      options: e
    }, {
      get(u, _, m) {
        var w, b;
        if (_ === "instance" && (!((w = u?.options) === null || w === void 0) && w.transient))
          return new s();
        if (_ === "instance" && (!((b = u?.options) === null || b === void 0) && b.lazy) && u.instance === s) {
          const A = new s();
          return Reflect.set(u, _, A, m), A;
        }
        return Reflect.get(u, _, m);
      },
      set(u, _, m, w) {
        return Reflect.set(u, _, m, w);
      }
    });
    l[a] = h, z(tt, l, gt), z(tt, l[a], s);
  };
  function o(s, n) {
    var a, l;
    const h = s.__legacy_source__, u = Y(n) ? n : je((l = (a = h?.name) !== null && a !== void 0 ? a : s?.name) !== null && l !== void 0 ? l : "");
    r(s, u), h && h !== s && z(tt, K(tt, s), h);
  }
  return be.isFunction(e) ? o(e, i) : e ? (s, n) => o(s, n) : o;
}
const yi = (e, i) => {
  const { kind: r = "class", name: o = "", addInitializer: s = () => {
  }, metadata: n } = i?.ctx || {};
  return ye(i)(e, {
    kind: r,
    name: o,
    addInitializer: s,
    metadata: n
  }), it(e).instance;
};
function _t(e) {
  const i = Object.assign({ enumerable: !1, writable: !0 }, e);
  return function(r, o) {
    if (G(r, o)) {
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
function L(e, i) {
  return G(e, i) || Y(i) ? _t()(e, i) : _t(e);
}
function mi(e, i) {
  const r = (n) => class extends n {
    constructor(...a) {
      super(...a), vt(this);
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
      vt(this);
    });
  }
  return e && !Y(i) || e ? s(e, i) : s;
}
const Pe = /* @__PURE__ */ Symbol("field-key"), Ce = /* @__PURE__ */ Symbol("validation-key"), Re = /* @__PURE__ */ Symbol("submit-key"), Fe = /* @__PURE__ */ Symbol("exclude-key"), ze = /* @__PURE__ */ Symbol("prop-from-view-key");
class st {
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
          const u = h?.name, _ = String(u);
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
    return i instanceof st || Object.getOwnPropertyNames(this).some((r) => Object.keys(i).includes(r));
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
      let u = i;
      for (; u; ) {
        const _ = Reflect.getOwnMetadata(this.metadataKey, u);
        if (Array.isArray(_))
          for (const m of _) {
            const w = m?.name, b = String(w);
            h.has(b) || (h.add(b), l.push(m));
          }
        u = Object.getPrototypeOf(u);
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
class pt extends st {
  constructor() {
    super(...arguments), this.metadataKey = Ce;
  }
}
class bt extends st {
  constructor() {
    super(...arguments), this.metadataKey = Re;
  }
}
class Dt extends st {
  constructor() {
    super(...arguments), this.metadataKey = Fe;
  }
}
class It extends st {
  /**
   * Создать метаданные поля модели.
   */
  constructor(i = {}) {
    super(i), this.factory = null, this.mapping = null, this.collectChanges = !1, this.name = null, this.ctx = null, this.metadataKey = Pe, this.factory = i.factory, this.mapping = i.mapping, this.name = i.name, this.ctx = i.ctx, this.collectChanges = !!i.collectChanges;
  }
}
class Ot extends st {
  /**
   * Создать метаданные для PropFromView.
   */
  constructor(i = {}) {
    super(i), this.metadataKey = ze;
    for (const r in this)
      i && r in i && (this[r] = Reflect.get(i, r));
  }
}
function vi(e) {
  const i = (s, n) => {
    const a = new Ot({ name: e, originName: String(n) });
    a.name = e, a.originName = String(n);
    const l = K(a.metadataKey, s, new Array());
    z(a.metadataKey, [...l, a], s);
  }, r = (s) => {
    s.addInitializer(function() {
      const n = new Ot(), a = n.fields(this);
      for (const l in this)
        a instanceof Array && s.name === l && (n.name = e, n.originName = l, n.value = this[l], a.push(n));
      z(n.metadataKey, a, this);
    });
  };
  function o(s, n) {
    if (G(s, n)) {
      i(s, n);
      return;
    }
    if (Y(n))
      return r(n), n.kind === "field" ? (a) => a : n;
  }
  return e ? ((s, n) => o(s, n)) : ((s) => s);
}
function gi(e) {
  const i = (s, n) => {
    const a = new Dt({ callback: e, name: String(n) }), l = K(a.metadataKey, s, new Array());
    z(a.metadataKey, [...l, a], s);
  }, r = (s) => {
    s.addInitializer(function() {
      const n = new Dt({ callback: e, name: String(s.name) }), a = K(n.metadataKey, this, new Array());
      z(n.metadataKey, [...a, n], this);
    });
  };
  function o(s, n) {
    if (G(s, n)) {
      i(s, n);
      return;
    }
    if (Y(n))
      return r(n), n.kind === "field" ? void 0 : n;
  }
  if (e)
    return ((s, n) => o(s, n));
}
const Le = () => {
  var e;
  return (e = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && e !== void 0 ? e : null;
}, Ke = () => {
  var e;
  return (e = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0;
}, ct = (e) => {
  var i, r;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((i = o.__MVVM_DEVTOOLS_APPLYING__) !== null && i !== void 0 ? i : 0) + 1;
  try {
    return e();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((r = o.__MVVM_DEVTOOLS_APPLYING__) !== null && r !== void 0 ? r : 1) - 1);
  }
}, He = () => Ke() > 0, ue = (e) => ({
  data: e.service.dumpData,
  historyIndex: e.service.historyIndex
}), qe = (e, i = {}) => {
  const r = Le();
  if (!r)
    return () => {
    };
  const o = r.connect({ name: i.name, instanceId: i.instanceId });
  let s = !1;
  try {
    o.init(ue(e));
  } catch {
  }
  const n = _e(() => ue(e), (l) => {
    var h;
    if (!(s || He()))
      try {
        o.send({ type: (h = i.actionType) !== null && h !== void 0 ? h : "model:update" }, l);
      } catch {
      }
  }), a = o.subscribe((l) => {
    var h;
    if (l.type !== "DISPATCH")
      return;
    const u = (h = l.payload) === null || h === void 0 ? void 0 : h.type;
    if (u === "RESET") {
      s = !0, ct(() => {
        try {
          e.service.toInit();
        } finally {
          s = !1;
        }
      });
      return;
    }
    if (u === "COMMIT") {
      s = !0, ct(() => {
        try {
          e.service.commit();
        } finally {
          s = !1;
        }
      });
      return;
    }
    if (u === "ROLLBACK") {
      s = !0, ct(() => {
        try {
          e.service.toInit();
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
        const _ = JSON.parse(l.state), m = _.historyIndex, w = e.service.history, b = Array.isArray(w) && w.length > 0, A = typeof m == "number" && (m === -1 && b || m >= 0 && b && m < w.length);
        s = !0, ct(() => {
          var j;
          try {
            if (A) {
              e.service.goToHistory(m);
              return;
            }
            const x = (j = _.data) !== null && j !== void 0 ? j : _;
            Q(() => {
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
Me();
const Ye = new bt(), U = new It(), Be = new pt(), Ge = new Dt();
let Ne = (() => {
  var e, i, r, o, s, n, a, l, h, u;
  let _ = [], m, w = [], b = [], A, j = [], x = [], H, N = [], V = [], S, d = [], M = [], k, P = [], E = [], F, q = [], J = [], X, nt = [], rt = [], ot, lt = [], Mt = [], St, kt = [], Tt = [], At, Et = [], xt = [], jt, Vt = [], Pt = [], Ct, Rt = [], Ft = [], zt, Lt = [], Kt = [], Ht, qt, Yt = [], Bt = [], Gt, Nt, Ut, $t, Wt, Qt, Jt, Xt, Zt, te, ee, ie;
  return e = class {
    get initData() {
      return $(this, i, "f");
    }
    set initData(t) {
      W(this, i, t, "f");
    }
    get committedData() {
      return $(this, r, "f");
    }
    set committedData(t) {
      W(this, r, t, "f");
    }
    get modified_() {
      return $(this, o, "f");
    }
    set modified_(t) {
      W(this, o, t, "f");
    }
    get changes() {
      return $(this, s, "f");
    }
    set changes(t) {
      W(this, s, t, "f");
    }
    get inverseChanges() {
      return $(this, n, "f");
    }
    set inverseChanges(t) {
      W(this, n, t, "f");
    }
    get history() {
      return $(this, a, "f");
    }
    set history(t) {
      W(this, a, t, "f");
    }
    get historyIndex() {
      return $(this, l, "f");
    }
    set historyIndex(t) {
      W(this, l, t, "f");
    }
    /**
     * Создает модель и инициализирует данные.
     */
    constructor(t = {}, c) {
      this[h] = (p(this, _), p(this, w, !0)), i.set(this, (p(this, b), p(this, j, null))), r.set(this, (p(this, x), p(this, N, {}))), o.set(this, (p(this, V), p(this, d, {}))), this.draft = (p(this, M), p(this, P, null)), s.set(this, (p(this, E), p(this, q, []))), n.set(this, (p(this, J), p(this, nt, []))), a.set(this, (p(this, rt), p(this, lt, []))), l.set(this, (p(this, Mt), p(this, kt, -1))), this.initializedFields = (p(this, Tt), p(this, Et, void 0)), this.legacyInitDone = (p(this, xt), p(this, Vt, !1)), this.rawInitData = (p(this, Pt), p(this, Rt, null)), this.options = (p(this, Ft), p(this, Lt, void 0)), this.historyMuted = (p(this, Kt), p(this, Yt, !1)), this.serviceApi = (p(this, Bt), {
        loadData: (f) => this.loadData(f),
        reject: () => this.reject(),
        commit: () => this.commit(),
        commitField: (f) => this.commitField(f),
        toInit: () => this.toInit(),
        undo: () => this.undo(),
        redo: () => this.redo(),
        goToHistory: (f) => this.goToHistory(f)
      }), this.options = c, this[le] = !0, this.init(t), this.autoAttachDevtools(), this.initLegacyFields();
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
        for (const c in this.validation)
          this.validation[c];
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
    initField(t, c) {
      const f = U.fieldInstance(t, this);
      if (f) {
        t in this.initData || Reflect.set(this.initData, t, Reflect.get(this, t));
        const y = f?.factory ? f.factory(this.initData, this) : Reflect.get(this.initData, f.name);
        this.defineFieldValue(t, y, f), c?.skipValidation || this.initValidation(t), this.getInitializedFields().add(String(t));
      }
    }
    getInitializedFields() {
      return this.initializedFields || (this.initializedFields = /* @__PURE__ */ new Set()), this.initializedFields;
    }
    initLegacyFields() {
      var t;
      if (this.legacyInitDone)
        return;
      const c = U.fields(this);
      if (!c.some((D) => Object.prototype.hasOwnProperty.call(this, D.name)))
        return;
      this.legacyInitDone = !0;
      const y = this.getInitializedFields(), v = (t = this.rawInitData) !== null && t !== void 0 ? t : this.initData;
      if (v && v !== this.initData)
        try {
          this.initData = v;
        } catch {
          this.initData = Object.assign({}, v);
        }
      for (const D of c) {
        const I = String(D.name);
        if (v && I in v) {
          const C = U.fieldInstance(I, this);
          if (!C)
            continue;
          if (!y.has(I)) {
            const Z = v, at = C.factory ? C.factory(Z, this) : Reflect.get(Z, C.name);
            this.defineFieldValue(I, at), Reflect.set(this, I, at), y.add(I);
          }
          continue;
        }
        y.has(I) || this.initField(I, { skipValidation: !0 });
      }
    }
    /**
     * Создать draft для отслеживания изменений.
     */
    createDraft(t) {
      const c = {};
      for (const f in t)
        U.fieldInstance(f, this) && Reflect.set(c, f, t[f]);
      this.draft = Se(c);
    }
    autoAttachDevtools() {
      var t, c, f, y, v, D, I, T, C, Z, at, ht;
      const ut = globalThis;
      if (!ut.__MVVM_DEVTOOLS_AUTO__ || ((c = (t = this.options) === null || t === void 0 ? void 0 : t.devtools) === null || c === void 0 ? void 0 : c.enabled) === !1)
        return;
      const se = (I = (v = (y = (f = this.options) === null || f === void 0 ? void 0 : f.devtools) === null || y === void 0 ? void 0 : y.name) !== null && v !== void 0 ? v : (D = this.constructor) === null || D === void 0 ? void 0 : D.name) !== null && I !== void 0 ? I : "Model", ne = ((T = ut.__MVVM_DEVTOOLS_SEQ__) !== null && T !== void 0 ? T : 0) + 1;
      ut.__MVVM_DEVTOOLS_SEQ__ = ne;
      const ve = (at = (Z = (C = this.options) === null || C === void 0 ? void 0 : C.devtools) === null || Z === void 0 ? void 0 : Z.instanceId) !== null && at !== void 0 ? at : `${se}#${ne}`;
      ((ht = globalThis.queueMicrotask) !== null && ht !== void 0 ? ht : ((ge) => Promise.resolve().then(ge)))(() => qe(this, { name: se, instanceId: ve }));
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
      this.changes = t.flatMap((c) => c.patches), this.inverseChanges = t.flatMap((c) => c.inversePatches);
    }
    applyHistoryPatches(t) {
      if (!t.length)
        return;
      ce(this.draft, t);
      const c = new Set(t.map((f) => f.field).filter(Boolean));
      c.size !== 0 && this.withHistoryMuted(() => {
        var f;
        for (const y of c) {
          const v = (f = Reflect.get(this.draft, y)) !== null && f !== void 0 ? f : Reflect.get(this.initData, y);
          let D = v;
          try {
            D = v;
          } catch {
            D = v;
          }
          Reflect.set(this, y, D), this.defineFieldValue(y, Reflect.get(this, y));
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
    produceDraft(t, c, f) {
      if (this.historyMuted)
        return;
      let y, v = [];
      t && (y = t.split(".")[0], y && !U.fieldInstance(y, this).collectChanges) || (ke(this.draft, (D) => {
        if (t) {
          let I = D;
          const T = t.split(".");
          if (T.length > 1)
            for (let C = 0; C < T.length && !(!(C == T.length - 1) && !ae(I)); C++)
              ae(I) && (I = I[T[C]]);
          else
            f = t;
          I && (I[f] = c);
        }
      }, (D, I) => {
        y && (D = D.map((T) => Object.assign(Object.assign({}, T), { field: y })), I = I.map((T) => Object.assign(Object.assign({}, T), { field: y }))), v = D, !(!D.length && !I.length) && (this.historyIndex < this.history.length - 1 && (this.history = this.history.slice(0, this.historyIndex + 1), this.syncChangesFromHistory()), this.changes.push(...D), this.inverseChanges.push(...I), this.history.push({ patches: D, inversePatches: I }), this.historyIndex = this.history.length - 1);
      }), v.length && ce(this.draft, v));
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
    createObservable(t, c, f, y = f) {
      return t = oe(t) ? t : B.box(t), new Proxy(t, {
        get: (v, D, I) => {
          const T = Reflect.get(v, D, I);
          return T && typeof T == "object" && !(T instanceof e) && !oe(t) ? this.createObservable(T, String(D), c, `${y}.${String(D)}`) : T;
        },
        set: (v, D, I, T) => {
          const C = Reflect.set(v, D, I, T);
          return t = I, this.produceDraft(y, t, String(D)), this.checkChange(f, Reflect.get(this, f)), C;
        }
      });
    }
    /**
     * Определить getter/setter для поля модели.
     */
    defineFieldValue(t, c, f) {
      return !f && (f = U.fieldInstance(t, this)), c && typeof c == "object" && (c = this.createObservable(c, t, t)), c = B.box(c), Reflect.defineProperty(this, f.name, {
        get: () => c.get(),
        set: (y) => {
          Q(() => c.set(y)), this.produceDraft(f.name, c.get()), this.checkChange(f.name, c.get());
        },
        enumerable: !0,
        configurable: !0
      }), c;
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
    checkChange(t, c) {
      const f = c, y = Reflect.get(this.committedData, t) || Reflect.get(this.initData, t), v = t && t in this.initData && !re(y, f);
      return Q(() => {
        v && Reflect.set(this.modified_, t, y || y);
        for (const D in this.modified_)
          t === D && t in this.modified_ && re(y, f) && delete this.modified_[D];
      }), v;
    }
    /**
     * Применить данные к полям модели.
     */
    defineData(t) {
      for (const c in this) {
        if (!Object.prototype.hasOwnProperty.call(this, c))
          continue;
        U.fieldInstance(c, this) && (Reflect.set(this, c, Reflect.get(t, c)), this.initField(c));
      }
    }
    /**
     * Признак наличия изменений.
     */
    get dirty() {
      return !De(this.modified_);
    }
    /**
     * Зафиксировать все изменения.
     */
    commit() {
      for (const t of U.fields(this))
        this.commitField(t.name);
      this.modified_ = {};
    }
    /**
     * Зафиксировать изменения конкретного поля.
     */
    commitField(t) {
      for (const c in this)
        c in this.modified_ && Reflect.set(this.committedData, c, this[c]);
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
            const c = Reflect.get(this.initData, t);
            this[t] = c, this.initField(t);
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
      const t = this.historyIndex + 1, c = this.history[t];
      this.historyIndex = t, this.applyHistoryPatches(c.patches), this.syncChangesFromHistory();
    }
    /**
     * Перейти к конкретному шагу истории.
     */
    goToHistory(t) {
      if (!(t < -1 || t >= this.history.length) && t !== this.historyIndex) {
        for (; this.historyIndex < t; ) {
          const c = this.historyIndex + 1, f = this.history[c];
          this.historyIndex = c, this.applyHistoryPatches(f.patches);
        }
        for (; this.historyIndex > t; ) {
          const c = this.history[this.historyIndex];
          this.historyIndex -= 1, this.applyHistoryPatches(c.inversePatches);
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
      const t = /* @__PURE__ */ Object.create({}), c = (y) => {
        const v = Ye.fieldInstance(y, this);
        return v?.callback ? v.callback(Reflect.get(this, y), this) : Reflect.get(this, y);
      }, f = (y) => {
        const v = Ge.fieldInstance(y, this);
        if (v)
          switch (typeof v.callback) {
            case "boolean":
              return !!v.callback;
            case "function":
              return v.callback(Reflect.get(this, y), this);
          }
        return !1;
      };
      U.fields(this).forEach((y) => {
        var v;
        if (y.name in this)
          return !((v = this.options) === null || v === void 0) && v.byFields && !this.options.byFields.includes(y.name) || f(y.name) ? void 0 : Reflect.set(t, y.name, c(y.name));
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
      for (const c in this) {
        const f = Be.fieldInstance(c, this);
        f && Reflect.set(t, c, f.callback(this[c], this) || "");
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
  }, i = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), m = [L], h = pe(le), (() => {
    const O = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    A = [B, L], H = [B, L], S = [B, L], k = [L], F = [B, L], X = [B, L], ot = [B, L], St = [B, L], At = [L], jt = [L], Ct = [L], zt = [L], Ht = [R], qt = [L], Gt = [R], Nt = [et], Ut = [R], $t = [R], Wt = [R], Qt = [R], Jt = [R], Xt = [R], Zt = [R], te = [et], ee = [et], ie = [(u = et).struct.bind(u)], g(e, null, A, { kind: "accessor", name: "initData", static: !1, private: !1, access: { has: (t) => "initData" in t, get: (t) => t.initData, set: (t, c) => {
      t.initData = c;
    } }, metadata: O }, j, x), g(e, null, H, { kind: "accessor", name: "committedData", static: !1, private: !1, access: { has: (t) => "committedData" in t, get: (t) => t.committedData, set: (t, c) => {
      t.committedData = c;
    } }, metadata: O }, N, V), g(e, null, S, { kind: "accessor", name: "modified_", static: !1, private: !1, access: { has: (t) => "modified_" in t, get: (t) => t.modified_, set: (t, c) => {
      t.modified_ = c;
    } }, metadata: O }, d, M), g(e, null, F, { kind: "accessor", name: "changes", static: !1, private: !1, access: { has: (t) => "changes" in t, get: (t) => t.changes, set: (t, c) => {
      t.changes = c;
    } }, metadata: O }, q, J), g(e, null, X, { kind: "accessor", name: "inverseChanges", static: !1, private: !1, access: { has: (t) => "inverseChanges" in t, get: (t) => t.inverseChanges, set: (t, c) => {
      t.inverseChanges = c;
    } }, metadata: O }, nt, rt), g(e, null, ot, { kind: "accessor", name: "history", static: !1, private: !1, access: { has: (t) => "history" in t, get: (t) => t.history, set: (t, c) => {
      t.history = c;
    } }, metadata: O }, lt, Mt), g(e, null, St, { kind: "accessor", name: "historyIndex", static: !1, private: !1, access: { has: (t) => "historyIndex" in t, get: (t) => t.historyIndex, set: (t, c) => {
      t.historyIndex = c;
    } }, metadata: O }, kt, Tt), g(e, null, Ht, { kind: "method", name: "resetToDefault", static: !1, private: !1, access: { has: (t) => "resetToDefault" in t, get: (t) => t.resetToDefault }, metadata: O }, null, _), g(e, null, Gt, { kind: "method", name: "produceDraft", static: !1, private: !1, access: { has: (t) => "produceDraft" in t, get: (t) => t.produceDraft }, metadata: O }, null, _), g(e, null, Nt, { kind: "getter", name: "dirty", static: !1, private: !1, access: { has: (t) => "dirty" in t, get: (t) => t.dirty }, metadata: O }, null, _), g(e, null, Ut, { kind: "method", name: "commit", static: !1, private: !1, access: { has: (t) => "commit" in t, get: (t) => t.commit }, metadata: O }, null, _), g(e, null, $t, { kind: "method", name: "commitField", static: !1, private: !1, access: { has: (t) => "commitField" in t, get: (t) => t.commitField }, metadata: O }, null, _), g(e, null, Wt, { kind: "method", name: "reject", static: !1, private: !1, access: { has: (t) => "reject" in t, get: (t) => t.reject }, metadata: O }, null, _), g(e, null, Qt, { kind: "method", name: "toInit", static: !1, private: !1, access: { has: (t) => "toInit" in t, get: (t) => t.toInit }, metadata: O }, null, _), g(e, null, Jt, { kind: "method", name: "undo", static: !1, private: !1, access: { has: (t) => "undo" in t, get: (t) => t.undo }, metadata: O }, null, _), g(e, null, Xt, { kind: "method", name: "redo", static: !1, private: !1, access: { has: (t) => "redo" in t, get: (t) => t.redo }, metadata: O }, null, _), g(e, null, Zt, { kind: "method", name: "goToHistory", static: !1, private: !1, access: { has: (t) => "goToHistory" in t, get: (t) => t.goToHistory }, metadata: O }, null, _), g(e, null, te, { kind: "getter", name: "validation", static: !1, private: !1, access: { has: (t) => "validation" in t, get: (t) => t.validation }, metadata: O }, null, _), g(e, null, ee, { kind: "getter", name: "validAndDirty", static: !1, private: !1, access: { has: (t) => "validAndDirty" in t, get: (t) => t.validAndDirty }, metadata: O }, null, _), g(e, null, ie, { kind: "getter", name: "service", static: !1, private: !1, access: { has: (t) => "service" in t, get: (t) => t.service }, metadata: O }, null, _), g(null, null, m, { kind: "field", name: h, static: !1, private: !1, access: { has: (t) => h in t, get: (t) => t[h], set: (t, c) => {
      t[h] = c;
    } }, metadata: O }, w, b), g(null, null, k, { kind: "field", name: "draft", static: !1, private: !1, access: { has: (t) => "draft" in t, get: (t) => t.draft, set: (t, c) => {
      t.draft = c;
    } }, metadata: O }, P, E), g(null, null, At, { kind: "field", name: "initializedFields", static: !1, private: !1, access: { has: (t) => "initializedFields" in t, get: (t) => t.initializedFields, set: (t, c) => {
      t.initializedFields = c;
    } }, metadata: O }, Et, xt), g(null, null, jt, { kind: "field", name: "legacyInitDone", static: !1, private: !1, access: { has: (t) => "legacyInitDone" in t, get: (t) => t.legacyInitDone, set: (t, c) => {
      t.legacyInitDone = c;
    } }, metadata: O }, Vt, Pt), g(null, null, Ct, { kind: "field", name: "rawInitData", static: !1, private: !1, access: { has: (t) => "rawInitData" in t, get: (t) => t.rawInitData, set: (t, c) => {
      t.rawInitData = c;
    } }, metadata: O }, Rt, Ft), g(null, null, zt, { kind: "field", name: "options", static: !1, private: !1, access: { has: (t) => "options" in t, get: (t) => t.options, set: (t, c) => {
      t.options = c;
    } }, metadata: O }, Lt, Kt), g(null, null, qt, { kind: "field", name: "historyMuted", static: !1, private: !1, access: { has: (t) => "historyMuted" in t, get: (t) => t.historyMuted, set: (t, c) => {
      t.historyMuted = c;
    } }, metadata: O }, Yt, Bt), O && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: O });
  })(), e;
})();
const Ue = () => {
  var e;
  const i = globalThis;
  return !!((e = i.__MVVM_DEVTOOLS_HISTORY__) !== null && e !== void 0 ? e : i.__MVVM_DEVTOOLS_AUTO__);
}, $e = (e) => Ue() ? !e || typeof e != "object" ? { collectChanges: !0 } : "collectChanges" in e ? e : Object.assign(Object.assign({}, e), { collectChanges: !0 }) : e;
function bi(e, i) {
  const r = $e(G(e, i) ? void 0 : e), o = (a, l) => {
    const h = new It(Object.assign(Object.assign({}, r), { name: String(l), ctx: null })), u = K(h.metadataKey, a, new Array());
    z(h.metadataKey, [...u, h], a), Object.getOwnPropertyDescriptor(a, l) || Object.defineProperty(a, l, {
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
      if (this instanceof Ne && typeof this.initField == "function") {
        const l = new It(Object.assign(Object.assign({}, r), { name: String(a.name), ctx: a })), h = K(l.metadataKey, this, new Array());
        z(l.metadataKey, [...h, l], this), this.initField.call(this, String(a.name));
      }
    });
  };
  function n(a, l) {
    if (G(a, l)) {
      o(a, l);
      return;
    }
    if (Y(l))
      return s(l), l.kind === "field" ? (h) => h : l;
  }
  return G(e, i) ? n(e, i) : r && !Y(i) ? (a, l) => n(a, l) : Y(i) ? n(void 0, i) : (a, l) => n(a, l);
}
function Di(e) {
  const i = (s, n) => {
    const a = new bt({ callback: e, name: String(n) }), l = K(a.metadataKey, s, new Array());
    z(a.metadataKey, [...l, a], s);
  }, r = (s) => {
    const n = new bt({ callback: e, name: String(s.name) });
    s.addInitializer(function() {
      const a = K(n.metadataKey, this, new Array());
      z(n.metadataKey, [...a, n], this);
    });
  };
  function o(s, n) {
    if (G(s, n)) {
      i(s, n);
      return;
    }
    if (Y(n))
      return r(n), n.kind === "field" ? (a) => a : n;
  }
  return e ? ((s, n) => o(s, n)) : ((s) => s);
}
function Ii(e) {
  const i = (s, n) => {
    const a = new pt({ callback: e, name: String(n) }), l = K(a.metadataKey, s, new Array());
    z(a.metadataKey, [...l, a], s);
  }, r = (s) => {
    const n = new pt({ callback: e, name: String(s.name) });
    s.addInitializer(function() {
      const a = K(n.metadataKey, this, new Array());
      z(n.metadataKey, [...a, n], this);
    });
  };
  function o(s, n) {
    if (G(s, n)) {
      i(s, n);
      return;
    }
    if (Y(n))
      return r(n), n.kind === "field" ? (a) => a : n;
  }
  return e ? ((s, n) => o(s, n)) : ((s) => s);
}
const me = /* @__PURE__ */ Symbol("store-key"), We = () => {
  var e;
  return (e = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && e !== void 0 ? e : null;
}, Qe = () => {
  var e;
  return (e = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0;
}, Je = (e) => {
  var i, r;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((i = o.__MVVM_DEVTOOLS_APPLYING__) !== null && i !== void 0 ? i : 0) + 1;
  try {
    return e();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((r = o.__MVVM_DEVTOOLS_APPLYING__) !== null && r !== void 0 ? r : 1) - 1);
  }
}, Xe = () => Qe() > 0, wt = (e) => ({
  items: e.items.map((i) => {
    var r, o;
    return {
      name: (o = (r = i.constructor) === null || r === void 0 ? void 0 : r.name) !== null && o !== void 0 ? o : "Model",
      data: i.service.dumpData,
      historyIndex: i.service.historyIndex
    };
  })
}), Ze = (e) => !!(e && typeof e == "object" && Array.isArray(e.items)), ti = (e) => {
  if (!e)
    return null;
  try {
    const i = JSON.parse(e);
    return Ze(i) ? i : null;
  } catch {
    return null;
  }
}, ei = (e, i = {}) => {
  var r, o;
  const s = We();
  if (!s)
    return () => {
    };
  const n = s.connect({ name: i.name, instanceId: i.instanceId });
  let a = !1, l = (o = (r = e.items[0]) === null || r === void 0 ? void 0 : r.constructor) !== null && o !== void 0 ? o : null;
  try {
    n.init(wt(e));
  } catch {
  }
  const h = _e(() => wt(e), (m) => {
    var w;
    if (a || Xe())
      return;
    const b = (w = e.items[0]) === null || w === void 0 ? void 0 : w.constructor;
    b && (l = b);
    try {
      n.send({ type: "store:update" }, m);
    } catch {
    }
  }), u = (m) => (a = !0, Je(() => {
    try {
      return m();
    } finally {
      a = !1;
    }
  })), _ = n.subscribe((m) => {
    var w;
    if (m.type !== "DISPATCH")
      return;
    const b = (w = m.payload) === null || w === void 0 ? void 0 : w.type;
    if (b === "RESET" || b === "ROLLBACK") {
      u(() => e.reset());
      return;
    }
    if (b === "JUMP_TO_ACTION" || b === "JUMP_TO_STATE") {
      const A = ti(m.state);
      if (!A)
        return;
      u(() => {
        var j, x, H;
        if (A.items.length === e.items.length && e.items.every((M) => {
          var k, P;
          return typeof ((k = M?.service) === null || k === void 0 ? void 0 : k.goToHistory) == "function" || typeof ((P = M?.service) === null || P === void 0 ? void 0 : P.loadData) == "function";
        })) {
          Q(() => {
            A.items.forEach((M, k) => {
              var P;
              const E = (P = e.items[k]) === null || P === void 0 ? void 0 : P.service, F = M.historyIndex, q = E?.history;
              if (Array.isArray(q) && q.length > 0 && typeof F == "number" && typeof E?.goToHistory == "function" && (F === -1 && q.length > 0 || F < q.length)) {
                E.goToHistory(F);
                return;
              }
              typeof E?.loadData == "function" && E.loadData(M.data);
            });
          });
          return;
        }
        const V = (x = (j = e.items[0]) === null || j === void 0 ? void 0 : j.constructor) !== null && x !== void 0 ? x : l, S = A.items.map((M) => M.data);
        if (V) {
          e.applyLoaded(S, { model: V, cash: !1 }), l = V;
          return;
        }
        e.applyLoaded(S, { cash: !1 });
        const d = (H = e.items[0]) === null || H === void 0 ? void 0 : H.constructor;
        d && (l = d);
      });
    }
  });
  return () => {
    h(), typeof _ == "function" && _(), typeof n.unsubscribe == "function" && n.unsubscribe(), typeof n.disconnect == "function" && n.disconnect();
  };
};
let Oi = (() => {
  var e, i, r;
  let o = [], s, n = [], a = [], l, h = [], u = [], _, m, w, b, A, j, x, H, N, V;
  return e = class {
    get items() {
      return $(this, i, "f");
    }
    set items(d) {
      W(this, i, d, "f");
    }
    get _cash() {
      return $(this, r, "f");
    }
    set _cash(d) {
      W(this, r, d, "f");
    }
    constructor() {
      i.set(this, (p(this, o), p(this, n, []))), r.set(this, (p(this, a), p(this, h, []))), p(this, u), vt(this), this.autoAttachDevtools();
    }
    add(d) {
      this.items = this.items.concat(d);
    }
    addMany(d) {
      d?.length && (this.items = this.items.concat(d));
    }
    remove(d) {
      this.items = this.items.filter((M) => M !== d);
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
    findBy(d, M) {
      return this.items.find((k) => k?.[d] === M);
    }
    clear() {
      this.items = [];
    }
    get size() {
      return this.items.length;
    }
    get snapshot() {
      return wt(this);
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
    applyLoaded(d, M = {}) {
      const { model: k, mode: P = "replace", cash: E = !0 } = M;
      if (E && this.setCash(d), P === "append") {
        const F = k ? d.map((q) => new k(q)) : d;
        this.addMany(F);
        return;
      }
      this.items = k ? d.map((F) => new k(F)) : d;
    }
    /**
     * Сохранить оригинальные данные стора.
     */
    setCash(d) {
      this._cash = d ?? [];
    }
    autoAttachDevtools() {
      var d, M, k, P, E, F, q, J;
      const X = globalThis;
      if (!X.__MVVM_DEVTOOLS_AUTO__)
        return;
      const nt = K(me, this.constructor, {}) || {};
      if (((d = nt.devtools) === null || d === void 0 ? void 0 : d.enabled) === !1)
        return;
      const rt = (E = (k = (M = nt.devtools) === null || M === void 0 ? void 0 : M.name) !== null && k !== void 0 ? k : (P = this.constructor) === null || P === void 0 ? void 0 : P.name) !== null && E !== void 0 ? E : "Store", ot = ((F = X.__MVVM_DEVTOOLS_STORE_SEQ__) !== null && F !== void 0 ? F : 0) + 1;
      X.__MVVM_DEVTOOLS_STORE_SEQ__ = ot;
      const lt = (J = (q = nt.devtools) === null || q === void 0 ? void 0 : q.instanceId) !== null && J !== void 0 ? J : `${rt}#${ot}`;
      ei(this, { name: rt, instanceId: lt });
    }
  }, i = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), (() => {
    const S = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    s = [B], l = [B], _ = [R], m = [R], w = [R], b = [R], A = [et], j = [et], x = [et], H = [R], N = [R], V = [R], g(e, null, s, { kind: "accessor", name: "items", static: !1, private: !1, access: { has: (d) => "items" in d, get: (d) => d.items, set: (d, M) => {
      d.items = M;
    } }, metadata: S }, n, a), g(e, null, l, { kind: "accessor", name: "_cash", static: !1, private: !1, access: { has: (d) => "_cash" in d, get: (d) => d._cash, set: (d, M) => {
      d._cash = M;
    } }, metadata: S }, h, u), g(e, null, _, { kind: "method", name: "add", static: !1, private: !1, access: { has: (d) => "add" in d, get: (d) => d.add }, metadata: S }, null, o), g(e, null, m, { kind: "method", name: "addMany", static: !1, private: !1, access: { has: (d) => "addMany" in d, get: (d) => d.addMany }, metadata: S }, null, o), g(e, null, w, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (d) => "remove" in d, get: (d) => d.remove }, metadata: S }, null, o), g(e, null, b, { kind: "method", name: "clear", static: !1, private: !1, access: { has: (d) => "clear" in d, get: (d) => d.clear }, metadata: S }, null, o), g(e, null, A, { kind: "getter", name: "size", static: !1, private: !1, access: { has: (d) => "size" in d, get: (d) => d.size }, metadata: S }, null, o), g(e, null, j, { kind: "getter", name: "snapshot", static: !1, private: !1, access: { has: (d) => "snapshot" in d, get: (d) => d.snapshot }, metadata: S }, null, o), g(e, null, x, { kind: "getter", name: "cash", static: !1, private: !1, access: { has: (d) => "cash" in d, get: (d) => d.cash }, metadata: S }, null, o), g(e, null, H, { kind: "method", name: "reset", static: !1, private: !1, access: { has: (d) => "reset" in d, get: (d) => d.reset }, metadata: S }, null, o), g(e, null, N, { kind: "method", name: "applyLoaded", static: !1, private: !1, access: { has: (d) => "applyLoaded" in d, get: (d) => d.applyLoaded }, metadata: S }, null, o), g(e, null, V, { kind: "method", name: "setCash", static: !1, private: !1, access: { has: (d) => "setCash" in d, get: (d) => d.setCash }, metadata: S }, null, o), S && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: S });
  })(), e;
})();
function Mi(e) {
  return it(e, "instance");
}
function Si(e) {
  return ((i, r) => Ve(e)(i, r));
}
function ki(e, i) {
  const r = (o, s) => {
    var n;
    const a = typeof e == "string" ? { id: e } : typeof e == "object" ? e : { id: (n = s?.name) !== null && n !== void 0 ? n : o?.name };
    z(me, a, o), ye(a)(o, s);
  };
  return typeof e == "function" ? r(e, i) : (o, s) => r(o, s);
}
class Ti {
}
const yt = new Ot();
function Ai(e, i) {
  return Te((r = {}) => {
    const { resolved: o, instance: s } = Ae(() => {
      const a = it(e) || (typeof e != "string" ? { instance: new e() } : void 0), l = a?.instance;
      return { resolved: a, instance: l };
    }, [e]);
    if (Ee(() => {
      if (s)
        return typeof s.onInit == "function" && s.onInit(), () => {
          typeof s.onDispose == "function" && s.onDispose();
        };
    }, [s]), o) {
      const n = yt.fields(s), a = n.length > 0 ? n : yt.fields(Object.getPrototypeOf(s));
      for (const l in r)
        if (a instanceof Array) {
          const h = a.find((u) => u.name === l);
          h && Reflect.set(s, h.originName, Reflect.get(r, l));
        }
      return z(yt.metadataKey, a, s), i(Object.assign({ viewModel: s }, r));
    }
    return i(Object.assign({}, r));
  });
}
const fe = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, ii = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, dt = () => {
};
class si {
  constructor(i, r) {
    var o, s, n, a, l, h, u;
    this.isExecuting = !1, this.activeCount = 0, this.isCanceled = !1, this.isDisposed = !1, this.error = null, this.controllers = /* @__PURE__ */ new Set(), this.queue = [], this.runningPromise = null, this.queueTail = Promise.resolve(), this.cancelToken = 0, this.fn = i, this.opt = Object.assign({ concurrency: (o = r?.concurrency) !== null && o !== void 0 ? o : "ignore", trackError: (s = r?.trackError) !== null && s !== void 0 ? s : !0, resetErrorOnExecute: (n = r?.resetErrorOnExecute) !== null && n !== void 0 ? n : !0, swallowError: (a = r?.swallowError) !== null && a !== void 0 ? a : !0, abortable: (l = r?.abortable) !== null && l !== void 0 ? l : !1 }, r), this.states = Object.assign(Object.assign({}, fe), (h = r?.states) !== null && h !== void 0 ? h : {}), this.stateKeys = Object.assign(Object.assign({}, ii), (u = r?.stateKeys) !== null && u !== void 0 ? u : {}), we(this, {
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
    return (o = this.states[s]) !== null && o !== void 0 ? o : fe[i];
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
    }, s = () => mt(this, void 0, void 0, function* () {
      var n, a, l, h, u, _, m, w;
      if (this.isDisposed)
        return;
      const b = this.opt.abortable ? new AbortController() : null;
      b && this.controllers.add(b), Q(() => {
        this.activeCount += 1, this.isExecuting = this.activeCount > 0, this.isCanceled = !1, this.opt.trackError && this.opt.resetErrorOnExecute && (this.error = null);
      });
      const A = this.cancelToken;
      let j = !1, x = !1, H = null, N = null;
      try {
        (a = (n = this.opt).onStart) === null || a === void 0 || a.call(n, ...i);
        const V = this.opt.abortable ? b.signal : void 0;
        N = this.fn(...i, V);
        const S = yield N;
        return x = this.cancelToken !== A, x ? void 0 : ((h = (l = this.opt).onSuccess) === null || h === void 0 || h.call(l, S, ...i), j = !0, S);
      } catch (V) {
        if (this.opt.abortable && b?.signal.aborted) {
          Q(() => {
            this.isCanceled = !0;
          }), x = !0, H = null;
          return;
        }
        if (H = V, x = this.cancelToken !== A, this.opt.trackError && Q(() => {
          this.error = V;
        }), (_ = (u = this.opt).onError) === null || _ === void 0 || _.call(u, V), !this.opt.swallowError)
          throw V;
        return;
      } finally {
        Q(() => {
          this.activeCount = Math.max(0, this.activeCount - 1), this.isExecuting = this.activeCount > 0;
        }), b && this.controllers.delete(b), !x && this.cancelToken !== A && (x = !0), (w = (m = this.opt).onFinally) === null || w === void 0 || w.call(m, { ok: j, canceled: x, error: H }, ...i);
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
          resolve: dt,
          reject: dt,
          canceled: !1,
          settled: !1
        }, l = this.activeCount === 0 && this.queue.length === 0;
        a.promise = new Promise((_, m) => {
          a.resolve = _, a.reject = m;
        }), this.queue.push(a);
        const h = () => mt(this, void 0, void 0, function* () {
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
        }), u = l ? h() : this.queueTail.then(h, h);
        return this.queueTail = u.then(dt, dt), o(a.promise);
      }
      default:
        return this.isExecuting && this.runningPromise ? this.runningPromise : o(s());
    }
  }
}
function ni(e, i) {
  return new si(e, i);
}
function Ei(e, i) {
  const r = Ie(e), o = /* @__PURE__ */ new Set(), s = i?.onCancel;
  return ni((...a) => {
    const l = r(...a);
    o.add(l);
    const h = () => {
      o.delete(l);
    };
    return l.then(h, h), new Promise((u, _) => {
      l.then(u, (m) => {
        if (Oe(m)) {
          u(void 0);
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
function xi(e) {
  return function(...i) {
    return Q(() => e.apply(this, i));
  };
}
export {
  it as GetService,
  Mi as GetStore,
  Ve as Inject,
  Si as InjectStore,
  mi as MakeObservable,
  Ne as Model,
  vi as PropFromView,
  ye as Service,
  yi as SetService,
  ki as Store,
  Oi as StoreBase,
  _i as TODO,
  Ti as ViewModel,
  ni as asyncCommand,
  qe as attachModelDevtools,
  ei as attachStoreDevtools,
  xi as commandAction,
  z as defineMetadata,
  L as define_prop,
  gi as exclude,
  bi as field,
  Ei as flowCommand,
  xe as getExecutingFunctionNameByStack,
  K as getOwnMetadata,
  fi as isSerializable,
  Di as submit,
  Ii as validation,
  Ai as view
};
//# sourceMappingURL=index.js.map
