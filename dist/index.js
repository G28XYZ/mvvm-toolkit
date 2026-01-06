import "reflect-metadata";
import { d as mt, _ as $, a as W, b as p, e as ge, c as g } from "./tslib.es6-COgJoJmX.js";
import pe, { isObject as ne, isEqual as ae, isEmpty as be } from "lodash";
import { makeObservable as vt, reaction as fe, runInAction as Q, observable as B, isObservable as re, computed as et, action as F, flow as De, isFlowCancellationError as Oe, makeAutoObservable as Ie } from "mobx";
import { enablePatches as we, immerable as oe, createDraft as Me, applyPatches as le, produce as Se } from "immer";
import { observer as ke } from "mobx-react";
import { useMemo as Ae, useEffect as Te } from "react";
const K = (e, i, r) => Reflect.getOwnMetadata(e, i) || r || {}, z = (e, i, r) => Reflect.defineMetadata(e, i, r);
function hi(...e) {
  try {
    return JSON.stringify(e), !0;
  } catch {
    return !1;
  }
}
function Ee(e) {
  if (e && typeof e == "string") {
    let [i] = e.split(`
`)[2].replace(/at (get)?/, "").match(/.*/g) || [];
    return i && (i = i.trim()), i;
  }
}
const ce = {}, ft = [];
let de = !1;
const fi = (e, ...i) => {
  const r = new Error().stack;
  if (!de)
    console.log("%c TODO", "background: #222; color: #bada55", ce), de = !0;
  else {
    const s = Ee(r);
    ft.includes(s) === !1 && (ft.push(s), Reflect.set(ce, `${ft.length}) ${e}`, { msg: i, get path() {
      return console.info(i, s), s;
    } }));
  }
  function o(...s) {
  }
  return o;
}, G = (e, i) => !!e && (typeof i == "string" || typeof i == "symbol"), Y = (e) => !!e && typeof e == "object" && "kind" in e, xe = (e) => ({
  kind: "class",
  name: e,
  addInitializer: () => {
  },
  metadata: {}
}), tt = /* @__PURE__ */ Symbol("service-key"), gt = new Proxy({}, Reflect);
function je(e) {
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
function _e(e, i) {
  const r = (s, n) => {
    const a = String(typeof e == "string" && e || typeof e == "object" && e?.id || n?.name || s?.name), l = K(tt, gt), u = new Proxy({
      target: s,
      instance: typeof e == "object" && Reflect.get(e, "transient") || typeof e == "object" && Reflect.get(e, "lazy") ? s : new s(),
      context: n,
      options: e
    }, {
      get(h, _, m) {
        var I, b;
        if (_ === "instance" && (!((I = h?.options) === null || I === void 0) && I.transient))
          return new s();
        if (_ === "instance" && (!((b = h?.options) === null || b === void 0) && b.lazy) && h.instance === s) {
          const T = new s();
          return Reflect.set(h, _, T, m), T;
        }
        return Reflect.get(h, _, m);
      },
      set(h, _, m, I) {
        return Reflect.set(h, _, m, I);
      }
    });
    l[a] = u, z(tt, l, gt), z(tt, l[a], s);
  };
  function o(s, n) {
    var a, l;
    const u = s.__legacy_source__, h = Y(n) ? n : xe((l = (a = u?.name) !== null && a !== void 0 ? a : s?.name) !== null && l !== void 0 ? l : "");
    r(s, h), u && u !== s && z(tt, K(tt, s), u);
  }
  return pe.isFunction(e) ? o(e, i) : e ? (s, n) => o(s, n) : o;
}
const _i = (e, i) => {
  const { kind: r = "class", name: o = "", addInitializer: s = () => {
  }, metadata: n } = i?.ctx || {};
  return _e(i)(e, {
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
function yi(e, i) {
  const r = (n) => class extends n {
    constructor(...a) {
      super(...a), vt(this);
    }
  }, o = (n, a) => {
    if (typeof Reflect?.getOwnMetadataKeys == "function")
      for (const l of Reflect.getOwnMetadataKeys(n)) {
        const u = Reflect.getOwnMetadata(l, n);
        Reflect.defineMetadata(l, u, a);
      }
  };
  function s(n, a) {
    if (!Y(a)) {
      const l = n, u = r(l);
      return Object.defineProperty(u, "__legacy_source__", { value: l, configurable: !0 }), o(l, u), u;
    }
    a.addInitializer(function() {
      vt(this);
    });
  }
  return e && !Y(i) || e ? s(e, i) : s;
}
const Ve = /* @__PURE__ */ Symbol("field-key"), Pe = /* @__PURE__ */ Symbol("validation-key"), Ce = /* @__PURE__ */ Symbol("submit-key"), Re = /* @__PURE__ */ Symbol("exclude-key"), Fe = /* @__PURE__ */ Symbol("prop-from-view-key");
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
        for (const u of l) {
          const h = u?.name, _ = String(h);
          s.has(_) || (s.add(_), r.push(u), o.set(_, u));
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
      const l = [], u = /* @__PURE__ */ new Set();
      let h = i;
      for (; h; ) {
        const _ = Reflect.getOwnMetadata(this.metadataKey, h);
        if (Array.isArray(_))
          for (const m of _) {
            const I = m?.name, b = String(I);
            u.has(b) || (u.add(b), l.push(m));
          }
        h = Object.getPrototypeOf(h);
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
    super(...arguments), this.metadataKey = Pe;
  }
}
class bt extends st {
  constructor() {
    super(...arguments), this.metadataKey = Ce;
  }
}
class Dt extends st {
  constructor() {
    super(...arguments), this.metadataKey = Re;
  }
}
class Ot extends st {
  /**
   * Создать метаданные поля модели.
   */
  constructor(i = {}) {
    super(i), this.factory = null, this.mapping = null, this.collectChanges = !1, this.name = null, this.ctx = null, this.metadataKey = Ve, this.factory = i.factory, this.mapping = i.mapping, this.name = i.name, this.ctx = i.ctx, this.collectChanges = !!i.collectChanges;
  }
}
class It extends st {
  /**
   * Создать метаданные для PropFromView.
   */
  constructor(i = {}) {
    super(i), this.metadataKey = Fe;
    for (const r in this)
      i && r in i && (this[r] = Reflect.get(i, r));
  }
}
function mi(e) {
  const i = (s, n) => {
    const a = new It({ name: e, originName: String(n) });
    a.name = e, a.originName = String(n);
    const l = K(a.metadataKey, s, new Array());
    z(a.metadataKey, [...l, a], s);
  }, r = (s) => {
    s.addInitializer(function() {
      const n = new It(), a = n.fields(this);
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
function vi(e) {
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
const ze = () => {
  var e;
  return (e = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && e !== void 0 ? e : null;
}, Le = () => {
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
}, Ke = () => Le() > 0, ue = (e) => ({
  data: e.service.dumpData,
  historyIndex: e.service.historyIndex
}), He = (e, i = {}) => {
  const r = ze();
  if (!r)
    return () => {
    };
  const o = r.connect({ name: i.name, instanceId: i.instanceId });
  let s = !1;
  try {
    o.init(ue(e));
  } catch {
  }
  const n = fe(() => ue(e), (l) => {
    var u;
    if (!(s || Ke()))
      try {
        o.send({ type: (u = i.actionType) !== null && u !== void 0 ? u : "model:update" }, l);
      } catch {
      }
  }), a = o.subscribe((l) => {
    var u;
    if (l.type !== "DISPATCH")
      return;
    const h = (u = l.payload) === null || u === void 0 ? void 0 : u.type;
    if (h === "RESET") {
      s = !0, ct(() => {
        try {
          e.service.toInit();
        } finally {
          s = !1;
        }
      });
      return;
    }
    if (h === "COMMIT") {
      s = !0, ct(() => {
        try {
          e.service.commit();
        } finally {
          s = !1;
        }
      });
      return;
    }
    if (h === "ROLLBACK") {
      s = !0, ct(() => {
        try {
          e.service.toInit();
        } finally {
          s = !1;
        }
      });
      return;
    }
    if (h === "JUMP_TO_ACTION" || h === "JUMP_TO_STATE") {
      if (!l.state)
        return;
      try {
        const _ = JSON.parse(l.state), m = _.historyIndex, I = e.service.history, b = Array.isArray(I) && I.length > 0, T = typeof m == "number" && (m === -1 && b || m >= 0 && b && m < I.length);
        s = !0, ct(() => {
          var j;
          try {
            if (T) {
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
we();
const qe = new bt(), U = new Ot(), Ye = new pt(), Be = new Dt();
let Ge = (() => {
  var e, i, r, o, s, n, a, l, u, h;
  let _ = [], m, I = [], b = [], T, j = [], x = [], H, N = [], V = [], S, d = [], M = [], k, P = [], E = [], R, q = [], J = [], X, nt = [], rt = [], ot, lt = [], Mt = [], St, kt = [], At = [], Tt, Et = [], xt = [], jt, Vt = [], Pt = [], Ct, Rt = [], Ft = [], zt, Lt = [], Kt = [], Ht, qt = [], Yt = [], Bt, Gt, Nt, Ut, $t, Wt, Qt, Jt, Xt, Zt, te, ee;
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
      this[u] = (p(this, _), p(this, I, !0)), i.set(this, (p(this, b), p(this, j, null))), r.set(this, (p(this, x), p(this, N, {}))), o.set(this, (p(this, V), p(this, d, {}))), this.draft = (p(this, M), p(this, P, null)), s.set(this, (p(this, E), p(this, q, []))), n.set(this, (p(this, J), p(this, nt, []))), a.set(this, (p(this, rt), p(this, lt, []))), l.set(this, (p(this, Mt), p(this, kt, -1))), this.initializedFields = (p(this, At), p(this, Et, void 0)), this.legacyInitDone = (p(this, xt), p(this, Vt, !1)), this.rawInitData = (p(this, Pt), p(this, Rt, null)), this.options = (p(this, Ft), p(this, Lt, void 0)), this.historyMuted = (p(this, Kt), p(this, qt, !1)), this.serviceApi = (p(this, Yt), {
        loadData: (f) => this.loadData(f),
        reject: () => this.reject(),
        commit: () => this.commit(),
        commitField: (f) => this.commitField(f),
        toInit: () => this.toInit(),
        undo: () => this.undo(),
        redo: () => this.redo(),
        goToHistory: (f) => this.goToHistory(f)
      }), this.options = c, this[oe] = !0, this.init(t), this.autoAttachDevtools(), this.initLegacyFields();
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
        const O = String(D.name);
        if (v && O in v) {
          const C = U.fieldInstance(O, this);
          if (!C)
            continue;
          if (!y.has(O)) {
            const Z = v, at = C.factory ? C.factory(Z, this) : Reflect.get(Z, C.name);
            this.defineFieldValue(O, at), Reflect.set(this, O, at), y.add(O);
          }
          continue;
        }
        y.has(O) || this.initField(O, { skipValidation: !0 });
      }
    }
    /**
     * Создать draft для отслеживания изменений.
     */
    createDraft(t) {
      const c = {};
      for (const f in t)
        U.fieldInstance(f, this) && Reflect.set(c, f, t[f]);
      this.draft = Me(c);
    }
    autoAttachDevtools() {
      var t, c, f, y, v, D, O, A, C, Z, at, ut;
      const ht = globalThis;
      if (!ht.__MVVM_DEVTOOLS_AUTO__ || ((c = (t = this.options) === null || t === void 0 ? void 0 : t.devtools) === null || c === void 0 ? void 0 : c.enabled) === !1)
        return;
      const ie = (O = (v = (y = (f = this.options) === null || f === void 0 ? void 0 : f.devtools) === null || y === void 0 ? void 0 : y.name) !== null && v !== void 0 ? v : (D = this.constructor) === null || D === void 0 ? void 0 : D.name) !== null && O !== void 0 ? O : "Model", se = ((A = ht.__MVVM_DEVTOOLS_SEQ__) !== null && A !== void 0 ? A : 0) + 1;
      ht.__MVVM_DEVTOOLS_SEQ__ = se;
      const me = (at = (Z = (C = this.options) === null || C === void 0 ? void 0 : C.devtools) === null || Z === void 0 ? void 0 : Z.instanceId) !== null && at !== void 0 ? at : `${ie}#${se}`;
      ((ut = globalThis.queueMicrotask) !== null && ut !== void 0 ? ut : ((ve) => Promise.resolve().then(ve)))(() => He(this, { name: ie, instanceId: me }));
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
      le(this.draft, t);
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
      t && (y = t.split(".")[0], y && !U.fieldInstance(y, this).collectChanges) || (Se(this.draft, (D) => {
        if (t) {
          let O = D;
          const A = t.split(".");
          if (A.length > 1)
            for (let C = 0; C < A.length && !(!(C == A.length - 1) && !ne(O)); C++)
              ne(O) && (O = O[A[C]]);
          else
            f = t;
          O && (O[f] = c);
        }
      }, (D, O) => {
        y && (D = D.map((A) => Object.assign(Object.assign({}, A), { field: y })), O = O.map((A) => Object.assign(Object.assign({}, A), { field: y }))), v = D, !(!D.length && !O.length) && (this.historyIndex < this.history.length - 1 && (this.history = this.history.slice(0, this.historyIndex + 1), this.syncChangesFromHistory()), this.changes.push(...D), this.inverseChanges.push(...O), this.history.push({ patches: D, inversePatches: O }), this.historyIndex = this.history.length - 1);
      }), v.length && le(this.draft, v));
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
      return t = re(t) ? t : B.box(t), new Proxy(t, {
        get: (v, D, O) => {
          const A = Reflect.get(v, D, O);
          return A && typeof A == "object" && !(A instanceof e) && !re(t) ? this.createObservable(A, String(D), c, `${y}.${String(D)}`) : A;
        },
        set: (v, D, O, A) => {
          const C = Reflect.set(v, D, O, A);
          return t = O, this.produceDraft(y, t, String(D)), this.checkChange(f, Reflect.get(this, f)), C;
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
      const f = c, y = Reflect.get(this.committedData, t) || Reflect.get(this.initData, t), v = t && t in this.initData && !ae(y, f);
      return Q(() => {
        v && Reflect.set(this.modified_, t, y || y);
        for (const D in this.modified_)
          t === D && t in this.modified_ && ae(y, f) && delete this.modified_[D];
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
      return !be(this.modified_);
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
        const v = qe.fieldInstance(y, this);
        return v?.callback ? v.callback(Reflect.get(this, y), this) : Reflect.get(this, y);
      }, f = (y) => {
        const v = Be.fieldInstance(y, this);
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
        const f = Ye.fieldInstance(c, this);
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
  }, i = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), m = [L], u = ge(oe), (() => {
    const w = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    T = [B, L], H = [B, L], S = [B, L], k = [L], R = [B, L], X = [B, L], ot = [B, L], St = [B, L], Tt = [L], jt = [L], Ct = [L], zt = [L], Ht = [L], Bt = [F], Gt = [et], Nt = [F], Ut = [F], $t = [F], Wt = [F], Qt = [F], Jt = [F], Xt = [F], Zt = [et], te = [et], ee = [(h = et).struct.bind(h)], g(e, null, T, { kind: "accessor", name: "initData", static: !1, private: !1, access: { has: (t) => "initData" in t, get: (t) => t.initData, set: (t, c) => {
      t.initData = c;
    } }, metadata: w }, j, x), g(e, null, H, { kind: "accessor", name: "committedData", static: !1, private: !1, access: { has: (t) => "committedData" in t, get: (t) => t.committedData, set: (t, c) => {
      t.committedData = c;
    } }, metadata: w }, N, V), g(e, null, S, { kind: "accessor", name: "modified_", static: !1, private: !1, access: { has: (t) => "modified_" in t, get: (t) => t.modified_, set: (t, c) => {
      t.modified_ = c;
    } }, metadata: w }, d, M), g(e, null, R, { kind: "accessor", name: "changes", static: !1, private: !1, access: { has: (t) => "changes" in t, get: (t) => t.changes, set: (t, c) => {
      t.changes = c;
    } }, metadata: w }, q, J), g(e, null, X, { kind: "accessor", name: "inverseChanges", static: !1, private: !1, access: { has: (t) => "inverseChanges" in t, get: (t) => t.inverseChanges, set: (t, c) => {
      t.inverseChanges = c;
    } }, metadata: w }, nt, rt), g(e, null, ot, { kind: "accessor", name: "history", static: !1, private: !1, access: { has: (t) => "history" in t, get: (t) => t.history, set: (t, c) => {
      t.history = c;
    } }, metadata: w }, lt, Mt), g(e, null, St, { kind: "accessor", name: "historyIndex", static: !1, private: !1, access: { has: (t) => "historyIndex" in t, get: (t) => t.historyIndex, set: (t, c) => {
      t.historyIndex = c;
    } }, metadata: w }, kt, At), g(e, null, Bt, { kind: "method", name: "produceDraft", static: !1, private: !1, access: { has: (t) => "produceDraft" in t, get: (t) => t.produceDraft }, metadata: w }, null, _), g(e, null, Gt, { kind: "getter", name: "dirty", static: !1, private: !1, access: { has: (t) => "dirty" in t, get: (t) => t.dirty }, metadata: w }, null, _), g(e, null, Nt, { kind: "method", name: "commit", static: !1, private: !1, access: { has: (t) => "commit" in t, get: (t) => t.commit }, metadata: w }, null, _), g(e, null, Ut, { kind: "method", name: "commitField", static: !1, private: !1, access: { has: (t) => "commitField" in t, get: (t) => t.commitField }, metadata: w }, null, _), g(e, null, $t, { kind: "method", name: "reject", static: !1, private: !1, access: { has: (t) => "reject" in t, get: (t) => t.reject }, metadata: w }, null, _), g(e, null, Wt, { kind: "method", name: "toInit", static: !1, private: !1, access: { has: (t) => "toInit" in t, get: (t) => t.toInit }, metadata: w }, null, _), g(e, null, Qt, { kind: "method", name: "undo", static: !1, private: !1, access: { has: (t) => "undo" in t, get: (t) => t.undo }, metadata: w }, null, _), g(e, null, Jt, { kind: "method", name: "redo", static: !1, private: !1, access: { has: (t) => "redo" in t, get: (t) => t.redo }, metadata: w }, null, _), g(e, null, Xt, { kind: "method", name: "goToHistory", static: !1, private: !1, access: { has: (t) => "goToHistory" in t, get: (t) => t.goToHistory }, metadata: w }, null, _), g(e, null, Zt, { kind: "getter", name: "validation", static: !1, private: !1, access: { has: (t) => "validation" in t, get: (t) => t.validation }, metadata: w }, null, _), g(e, null, te, { kind: "getter", name: "validAndDirty", static: !1, private: !1, access: { has: (t) => "validAndDirty" in t, get: (t) => t.validAndDirty }, metadata: w }, null, _), g(e, null, ee, { kind: "getter", name: "service", static: !1, private: !1, access: { has: (t) => "service" in t, get: (t) => t.service }, metadata: w }, null, _), g(null, null, m, { kind: "field", name: u, static: !1, private: !1, access: { has: (t) => u in t, get: (t) => t[u], set: (t, c) => {
      t[u] = c;
    } }, metadata: w }, I, b), g(null, null, k, { kind: "field", name: "draft", static: !1, private: !1, access: { has: (t) => "draft" in t, get: (t) => t.draft, set: (t, c) => {
      t.draft = c;
    } }, metadata: w }, P, E), g(null, null, Tt, { kind: "field", name: "initializedFields", static: !1, private: !1, access: { has: (t) => "initializedFields" in t, get: (t) => t.initializedFields, set: (t, c) => {
      t.initializedFields = c;
    } }, metadata: w }, Et, xt), g(null, null, jt, { kind: "field", name: "legacyInitDone", static: !1, private: !1, access: { has: (t) => "legacyInitDone" in t, get: (t) => t.legacyInitDone, set: (t, c) => {
      t.legacyInitDone = c;
    } }, metadata: w }, Vt, Pt), g(null, null, Ct, { kind: "field", name: "rawInitData", static: !1, private: !1, access: { has: (t) => "rawInitData" in t, get: (t) => t.rawInitData, set: (t, c) => {
      t.rawInitData = c;
    } }, metadata: w }, Rt, Ft), g(null, null, zt, { kind: "field", name: "options", static: !1, private: !1, access: { has: (t) => "options" in t, get: (t) => t.options, set: (t, c) => {
      t.options = c;
    } }, metadata: w }, Lt, Kt), g(null, null, Ht, { kind: "field", name: "historyMuted", static: !1, private: !1, access: { has: (t) => "historyMuted" in t, get: (t) => t.historyMuted, set: (t, c) => {
      t.historyMuted = c;
    } }, metadata: w }, qt, Yt), w && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: w });
  })(), e;
})();
const Ne = () => {
  var e;
  const i = globalThis;
  return !!((e = i.__MVVM_DEVTOOLS_HISTORY__) !== null && e !== void 0 ? e : i.__MVVM_DEVTOOLS_AUTO__);
}, Ue = (e) => Ne() ? !e || typeof e != "object" ? { collectChanges: !0 } : "collectChanges" in e ? e : Object.assign(Object.assign({}, e), { collectChanges: !0 }) : e;
function pi(e, i) {
  const r = Ue(G(e, i) ? void 0 : e), o = (a, l) => {
    const u = new Ot(Object.assign(Object.assign({}, r), { name: String(l), ctx: null })), h = K(u.metadataKey, a, new Array());
    z(u.metadataKey, [...h, u], a), Object.getOwnPropertyDescriptor(a, l) || Object.defineProperty(a, l, {
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
      if (this instanceof Ge && typeof this.initField == "function") {
        const l = new Ot(Object.assign(Object.assign({}, r), { name: String(a.name), ctx: a })), u = K(l.metadataKey, this, new Array());
        z(l.metadataKey, [...u, l], this), this.initField.call(this, String(a.name));
      }
    });
  };
  function n(a, l) {
    if (G(a, l)) {
      o(a, l);
      return;
    }
    if (Y(l))
      return s(l), l.kind === "field" ? (u) => u : l;
  }
  return G(e, i) ? n(e, i) : r && !Y(i) ? (a, l) => n(a, l) : Y(i) ? n(void 0, i) : (a, l) => n(a, l);
}
function bi(e) {
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
function Di(e) {
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
const ye = /* @__PURE__ */ Symbol("store-key"), $e = () => {
  var e;
  return (e = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && e !== void 0 ? e : null;
}, We = () => {
  var e;
  return (e = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0;
}, Qe = (e) => {
  var i, r;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((i = o.__MVVM_DEVTOOLS_APPLYING__) !== null && i !== void 0 ? i : 0) + 1;
  try {
    return e();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((r = o.__MVVM_DEVTOOLS_APPLYING__) !== null && r !== void 0 ? r : 1) - 1);
  }
}, Je = () => We() > 0, wt = (e) => ({
  items: e.items.map((i) => {
    var r, o;
    return {
      name: (o = (r = i.constructor) === null || r === void 0 ? void 0 : r.name) !== null && o !== void 0 ? o : "Model",
      data: i.service.dumpData,
      historyIndex: i.service.historyIndex
    };
  })
}), Xe = (e) => !!(e && typeof e == "object" && Array.isArray(e.items)), Ze = (e) => {
  if (!e)
    return null;
  try {
    const i = JSON.parse(e);
    return Xe(i) ? i : null;
  } catch {
    return null;
  }
}, ti = (e, i = {}) => {
  var r, o;
  const s = $e();
  if (!s)
    return () => {
    };
  const n = s.connect({ name: i.name, instanceId: i.instanceId });
  let a = !1, l = (o = (r = e.items[0]) === null || r === void 0 ? void 0 : r.constructor) !== null && o !== void 0 ? o : null;
  try {
    n.init(wt(e));
  } catch {
  }
  const u = fe(() => wt(e), (m) => {
    var I;
    if (a || Je())
      return;
    const b = (I = e.items[0]) === null || I === void 0 ? void 0 : I.constructor;
    b && (l = b);
    try {
      n.send({ type: "store:update" }, m);
    } catch {
    }
  }), h = (m) => (a = !0, Qe(() => {
    try {
      return m();
    } finally {
      a = !1;
    }
  })), _ = n.subscribe((m) => {
    var I;
    if (m.type !== "DISPATCH")
      return;
    const b = (I = m.payload) === null || I === void 0 ? void 0 : I.type;
    if (b === "RESET" || b === "ROLLBACK") {
      h(() => e.reset());
      return;
    }
    if (b === "JUMP_TO_ACTION" || b === "JUMP_TO_STATE") {
      const T = Ze(m.state);
      if (!T)
        return;
      h(() => {
        var j, x, H;
        if (T.items.length === e.items.length && e.items.every((M) => {
          var k, P;
          return typeof ((k = M?.service) === null || k === void 0 ? void 0 : k.goToHistory) == "function" || typeof ((P = M?.service) === null || P === void 0 ? void 0 : P.loadData) == "function";
        })) {
          Q(() => {
            T.items.forEach((M, k) => {
              var P;
              const E = (P = e.items[k]) === null || P === void 0 ? void 0 : P.service, R = M.historyIndex, q = E?.history;
              if (Array.isArray(q) && q.length > 0 && typeof R == "number" && typeof E?.goToHistory == "function" && (R === -1 && q.length > 0 || R < q.length)) {
                E.goToHistory(R);
                return;
              }
              typeof E?.loadData == "function" && E.loadData(M.data);
            });
          });
          return;
        }
        const V = (x = (j = e.items[0]) === null || j === void 0 ? void 0 : j.constructor) !== null && x !== void 0 ? x : l, S = T.items.map((M) => M.data);
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
    u(), typeof _ == "function" && _(), typeof n.unsubscribe == "function" && n.unsubscribe(), typeof n.disconnect == "function" && n.disconnect();
  };
};
let Oi = (() => {
  var e, i, r;
  let o = [], s, n = [], a = [], l, u = [], h = [], _, m, I, b, T, j, x, H, N, V;
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
      i.set(this, (p(this, o), p(this, n, []))), r.set(this, (p(this, a), p(this, u, []))), p(this, h), vt(this), this.autoAttachDevtools();
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
        const R = k ? d.map((q) => new k(q)) : d;
        this.addMany(R);
        return;
      }
      this.items = k ? d.map((R) => new k(R)) : d;
    }
    /**
     * Сохранить оригинальные данные стора.
     */
    setCash(d) {
      this._cash = d ?? [];
    }
    autoAttachDevtools() {
      var d, M, k, P, E, R, q, J;
      const X = globalThis;
      if (!X.__MVVM_DEVTOOLS_AUTO__)
        return;
      const nt = K(ye, this.constructor, {}) || {};
      if (((d = nt.devtools) === null || d === void 0 ? void 0 : d.enabled) === !1)
        return;
      const rt = (E = (k = (M = nt.devtools) === null || M === void 0 ? void 0 : M.name) !== null && k !== void 0 ? k : (P = this.constructor) === null || P === void 0 ? void 0 : P.name) !== null && E !== void 0 ? E : "Store", ot = ((R = X.__MVVM_DEVTOOLS_STORE_SEQ__) !== null && R !== void 0 ? R : 0) + 1;
      X.__MVVM_DEVTOOLS_STORE_SEQ__ = ot;
      const lt = (J = (q = nt.devtools) === null || q === void 0 ? void 0 : q.instanceId) !== null && J !== void 0 ? J : `${rt}#${ot}`;
      ti(this, { name: rt, instanceId: lt });
    }
  }, i = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), (() => {
    const S = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    s = [B], l = [B], _ = [F], m = [F], I = [F], b = [F], T = [et], j = [et], x = [et], H = [F], N = [F], V = [F], g(e, null, s, { kind: "accessor", name: "items", static: !1, private: !1, access: { has: (d) => "items" in d, get: (d) => d.items, set: (d, M) => {
      d.items = M;
    } }, metadata: S }, n, a), g(e, null, l, { kind: "accessor", name: "_cash", static: !1, private: !1, access: { has: (d) => "_cash" in d, get: (d) => d._cash, set: (d, M) => {
      d._cash = M;
    } }, metadata: S }, u, h), g(e, null, _, { kind: "method", name: "add", static: !1, private: !1, access: { has: (d) => "add" in d, get: (d) => d.add }, metadata: S }, null, o), g(e, null, m, { kind: "method", name: "addMany", static: !1, private: !1, access: { has: (d) => "addMany" in d, get: (d) => d.addMany }, metadata: S }, null, o), g(e, null, I, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (d) => "remove" in d, get: (d) => d.remove }, metadata: S }, null, o), g(e, null, b, { kind: "method", name: "clear", static: !1, private: !1, access: { has: (d) => "clear" in d, get: (d) => d.clear }, metadata: S }, null, o), g(e, null, T, { kind: "getter", name: "size", static: !1, private: !1, access: { has: (d) => "size" in d, get: (d) => d.size }, metadata: S }, null, o), g(e, null, j, { kind: "getter", name: "snapshot", static: !1, private: !1, access: { has: (d) => "snapshot" in d, get: (d) => d.snapshot }, metadata: S }, null, o), g(e, null, x, { kind: "getter", name: "cash", static: !1, private: !1, access: { has: (d) => "cash" in d, get: (d) => d.cash }, metadata: S }, null, o), g(e, null, H, { kind: "method", name: "reset", static: !1, private: !1, access: { has: (d) => "reset" in d, get: (d) => d.reset }, metadata: S }, null, o), g(e, null, N, { kind: "method", name: "applyLoaded", static: !1, private: !1, access: { has: (d) => "applyLoaded" in d, get: (d) => d.applyLoaded }, metadata: S }, null, o), g(e, null, V, { kind: "method", name: "setCash", static: !1, private: !1, access: { has: (d) => "setCash" in d, get: (d) => d.setCash }, metadata: S }, null, o), S && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: S });
  })(), e;
})();
function wi(e) {
  return it(e, "instance");
}
function Mi(e) {
  return ((i, r) => je(e)(i, r));
}
function Si(e, i) {
  const r = (o, s) => {
    var n;
    const a = typeof e == "string" ? { id: e } : typeof e == "object" ? e : { id: (n = s?.name) !== null && n !== void 0 ? n : o?.name };
    z(ye, a, o), _e(a)(o, s);
  };
  return typeof e == "function" ? r(e, i) : (o, s) => r(o, s);
}
class ki {
}
const yt = new It();
function Ai(e, i) {
  return ke((r = {}) => {
    const { resolved: o, instance: s } = Ae(() => {
      const a = it(e) || (typeof e != "string" ? { instance: new e() } : void 0), l = a?.instance;
      return { resolved: a, instance: l };
    }, [e]);
    if (Te(() => {
      if (s)
        return typeof s.onInit == "function" && s.onInit(), () => {
          typeof s.onDispose == "function" && s.onDispose();
        };
    }, [s]), o) {
      const n = yt.fields(s), a = n.length > 0 ? n : yt.fields(Object.getPrototypeOf(s));
      for (const l in r)
        if (a instanceof Array) {
          const u = a.find((h) => h.name === l);
          u && Reflect.set(s, u.originName, Reflect.get(r, l));
        }
      return z(yt.metadataKey, a, s), i(Object.assign({ viewModel: s }, r));
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
}, ei = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, dt = () => {
};
class ii {
  constructor(i, r) {
    var o, s, n, a, l, u, h;
    this.isExecuting = !1, this.activeCount = 0, this.isCanceled = !1, this.isDisposed = !1, this.error = null, this.controllers = /* @__PURE__ */ new Set(), this.queue = [], this.runningPromise = null, this.queueTail = Promise.resolve(), this.cancelToken = 0, this.fn = i, this.opt = Object.assign({ concurrency: (o = r?.concurrency) !== null && o !== void 0 ? o : "ignore", trackError: (s = r?.trackError) !== null && s !== void 0 ? s : !0, resetErrorOnExecute: (n = r?.resetErrorOnExecute) !== null && n !== void 0 ? n : !0, swallowError: (a = r?.swallowError) !== null && a !== void 0 ? a : !0, abortable: (l = r?.abortable) !== null && l !== void 0 ? l : !1 }, r), this.states = Object.assign(Object.assign({}, he), (u = r?.states) !== null && u !== void 0 ? u : {}), this.stateKeys = Object.assign(Object.assign({}, ei), (h = r?.stateKeys) !== null && h !== void 0 ? h : {}), Ie(this, {
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
    }, s = () => mt(this, void 0, void 0, function* () {
      var n, a, l, u, h, _, m, I;
      if (this.isDisposed)
        return;
      const b = this.opt.abortable ? new AbortController() : null;
      b && this.controllers.add(b), Q(() => {
        this.activeCount += 1, this.isExecuting = this.activeCount > 0, this.isCanceled = !1, this.opt.trackError && this.opt.resetErrorOnExecute && (this.error = null);
      });
      const T = this.cancelToken;
      let j = !1, x = !1, H = null, N = null;
      try {
        (a = (n = this.opt).onStart) === null || a === void 0 || a.call(n, ...i);
        const V = this.opt.abortable ? b.signal : void 0;
        N = this.fn(...i, V);
        const S = yield N;
        return x = this.cancelToken !== T, x ? void 0 : ((u = (l = this.opt).onSuccess) === null || u === void 0 || u.call(l, S, ...i), j = !0, S);
      } catch (V) {
        if (this.opt.abortable && b?.signal.aborted) {
          Q(() => {
            this.isCanceled = !0;
          }), x = !0, H = null;
          return;
        }
        if (H = V, x = this.cancelToken !== T, this.opt.trackError && Q(() => {
          this.error = V;
        }), (_ = (h = this.opt).onError) === null || _ === void 0 || _.call(h, V), !this.opt.swallowError)
          throw V;
        return;
      } finally {
        Q(() => {
          this.activeCount = Math.max(0, this.activeCount - 1), this.isExecuting = this.activeCount > 0;
        }), b && this.controllers.delete(b), !x && this.cancelToken !== T && (x = !0), (I = (m = this.opt).onFinally) === null || I === void 0 || I.call(m, { ok: j, canceled: x, error: H }, ...i);
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
        const u = () => mt(this, void 0, void 0, function* () {
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
        }), h = l ? u() : this.queueTail.then(u, u);
        return this.queueTail = h.then(dt, dt), o(a.promise);
      }
      default:
        return this.isExecuting && this.runningPromise ? this.runningPromise : o(s());
    }
  }
}
function si(e, i) {
  return new ii(e, i);
}
function Ti(e, i) {
  const r = De(e), o = /* @__PURE__ */ new Set(), s = i?.onCancel;
  return si((...a) => {
    const l = r(...a);
    o.add(l);
    const u = () => {
      o.delete(l);
    };
    return l.then(u, u), new Promise((h, _) => {
      l.then(h, (m) => {
        if (Oe(m)) {
          h(void 0);
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
function Ei(e) {
  return function(...i) {
    return Q(() => e.apply(this, i));
  };
}
export {
  it as GetService,
  wi as GetStore,
  je as Inject,
  Mi as InjectStore,
  yi as MakeObservable,
  Ge as Model,
  mi as PropFromView,
  _e as Service,
  _i as SetService,
  Si as Store,
  Oi as StoreBase,
  fi as TODO,
  ki as ViewModel,
  si as asyncCommand,
  He as attachModelDevtools,
  ti as attachStoreDevtools,
  Ei as commandAction,
  z as defineMetadata,
  L as define_prop,
  vi as exclude,
  pi as field,
  Ti as flowCommand,
  Ee as getExecutingFunctionNameByStack,
  K as getOwnMetadata,
  hi as isSerializable,
  bi as submit,
  Di as validation,
  Ai as view
};
//# sourceMappingURL=index.js.map
