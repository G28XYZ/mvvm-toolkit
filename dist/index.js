import "reflect-metadata";
import { d as vt, _ as W, a as Q, b as I, e as be, c as g } from "./tslib.es6-COgJoJmX.js";
import De, { cloneDeep as Y, isObject as re, isEqual as oe, isEmpty as Ie } from "lodash";
import { makeObservable as gt, reaction as ye, runInAction as J, observable as G, isObservable as le, computed as it, action as F, flow as Oe, isFlowCancellationError as Me, makeAutoObservable as Se } from "mobx";
import { enablePatches as we, immerable as ce, createDraft as ke, applyPatches as de, produce as Te } from "immer";
import { observer as Ee } from "mobx-react";
import { useMemo as Ae, useEffect as xe } from "react";
const K = (e, s, r) => Reflect.getOwnMetadata(e, s) || r || {}, z = (e, s, r) => Reflect.defineMetadata(e, s, r);
function fi(...e) {
  try {
    return JSON.stringify(e), !0;
  } catch {
    return !1;
  }
}
function Ve(e) {
  if (e && typeof e == "string") {
    let [s] = e.split(`
`)[2].replace(/at (get)?/, "").match(/.*/g) || [];
    return s && (s = s.trim()), s;
  }
}
const ue = {}, _t = [];
let he = !1;
const _i = (e, ...s) => {
  const r = new Error().stack;
  if (!he)
    console.log("%c TODO", "background: #222; color: #bada55", ue), he = !0;
  else {
    const i = Ve(r);
    _t.includes(i) === !1 && (_t.push(i), Reflect.set(ue, `${_t.length}) ${e}`, { msg: s, get path() {
      return console.info(s, i), i;
    } }));
  }
  function o(...i) {
  }
  return o;
}, N = (e, s) => !!e && (typeof s == "string" || typeof s == "symbol"), B = (e) => !!e && typeof e == "object" && "kind" in e, je = (e) => ({
  kind: "class",
  name: e,
  addInitializer: () => {
  },
  metadata: {}
}), et = /* @__PURE__ */ Symbol("service-key"), pt = new Proxy({}, Reflect);
function Ce(e) {
  const s = (o, i) => {
    Object.defineProperty(o, i, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, i))
          return Reflect.get(this, i);
        const n = st(e, "instance");
        if (n)
          return Object.defineProperty(this, i, { value: n, writable: !0, configurable: !0, enumerable: !0 }), n;
      },
      set(n) {
        const a = st(e, "instance");
        Object.defineProperty(this, i, { value: a ?? n, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  };
  function r(o, i) {
    if (N(o, i)) {
      s(o, i);
      return;
    }
    return i.addInitializer(function() {
      return vt(this, void 0, void 0, function* () {
        const n = st(e, "instance");
        n && Object.hasOwn(this, i.name) && Reflect.set(this, i.name, n);
      });
    }), (n) => n;
  }
  return r;
}
function st(e, s) {
  var r;
  const o = K(et, pt);
  if (typeof e != "string") {
    const i = K(et, e);
    if (i)
      return s && s in i ? i[s] : i;
    for (const n in o) {
      const a = o[n];
      if (a.target === e) {
        e = a.context.name;
        break;
      }
    }
  }
  if (typeof e == "string")
    return s ? (r = o[e]) === null || r === void 0 ? void 0 : r[s] : o[e];
}
function me(e, s) {
  const r = (i, n) => {
    const a = String(typeof e == "string" && e || typeof e == "object" && e?.id || n?.name || i?.name), l = K(et, pt), u = new Proxy({
      target: i,
      instance: typeof e == "object" && Reflect.get(e, "transient") || typeof e == "object" && Reflect.get(e, "lazy") ? i : new i(),
      context: n,
      options: e
    }, {
      get(f, m, _) {
        var b, p;
        if (m === "instance" && (!((b = f?.options) === null || b === void 0) && b.transient))
          return new i();
        if (m === "instance" && (!((p = f?.options) === null || p === void 0) && p.lazy) && f.instance === i) {
          const k = new i();
          return Reflect.set(f, m, k, _), k;
        }
        return Reflect.get(f, m, _);
      },
      set(f, m, _, b) {
        return Reflect.set(f, m, _, b);
      }
    });
    l[a] = u, z(et, l, pt), z(et, l[a], i);
  };
  function o(i, n) {
    var a, l;
    const u = i.__mvvm_legacy_source__, f = B(n) ? n : je((l = (a = u?.name) !== null && a !== void 0 ? a : i?.name) !== null && l !== void 0 ? l : "");
    r(i, f), u && u !== i && z(et, K(et, i), u);
  }
  return De.isFunction(e) ? o(e, s) : e ? (i, n) => o(i, n) : o;
}
const yi = (e, s) => {
  const { kind: r = "class", name: o = "", addInitializer: i = () => {
  }, metadata: n } = s?.ctx || {};
  return me(s)(e, {
    kind: r,
    name: o,
    addInitializer: i,
    metadata: n
  }), st(e).instance;
}, Pe = /* @__PURE__ */ Symbol("field-key"), Fe = /* @__PURE__ */ Symbol("validation-key"), Re = /* @__PURE__ */ Symbol("submit-key"), ze = /* @__PURE__ */ Symbol("exclude-key"), Le = /* @__PURE__ */ Symbol("prop-from-view-key");
class nt {
  /**
   * Создать базовые метаданные.
   */
  constructor(s = {}) {
    this.metadataKey = null, this.name = s?.name, this.callback = s?.callback;
  }
  /**
   * Проверить, что данные соответствуют экземпляру метаданных.
   */
  isInstance(s = {}) {
    return s instanceof nt || Object.getOwnPropertyNames(this).some((r) => Object.keys(s).includes(r));
  }
  /**
   * Получить метаданные конкретного поля модели.
   */
  fieldInstance(s, r) {
    return this.fields(r).find((o) => o.name === s);
  }
  /**
   * Получить массив метаданных полей модели.
   */
  fields(s) {
    const r = [], o = /* @__PURE__ */ new Set();
    let i = s;
    for (; i; ) {
      const n = Reflect.getOwnMetadata(this.metadataKey, i);
      if (Array.isArray(n))
        for (const a of n) {
          const l = a?.name;
          if (l !== void 0) {
            const u = typeof l == "symbol" ? l : String(l);
            if (o.has(u))
              continue;
            o.add(u);
          }
          r.push(a);
        }
      i = Object.getPrototypeOf(i);
    }
    return r;
  }
}
class bt extends nt {
  constructor() {
    super(...arguments), this.metadataKey = Fe;
  }
}
class Dt extends nt {
  constructor() {
    super(...arguments), this.metadataKey = Re;
  }
}
class It extends nt {
  constructor() {
    super(...arguments), this.metadataKey = ze;
  }
}
class Ot extends nt {
  /**
   * Создать метаданные поля модели.
   */
  constructor(s = {}) {
    super(s), this.factory = null, this.mapping = null, this.collectChanges = !1, this.name = null, this.ctx = null, this.metadataKey = Pe, this.factory = s.factory, this.mapping = s.mapping, this.name = s.name, this.ctx = s.ctx, this.collectChanges = !!s.collectChanges;
  }
}
class Mt extends nt {
  /**
   * Создать метаданные для PropFromView.
   */
  constructor(s = {}) {
    super(s), this.metadataKey = Le;
    for (const r in this)
      s && r in s && (this[r] = Reflect.get(s, r));
  }
}
function yt(e) {
  const s = Object.assign({ enumerable: !1, writable: !0 }, e);
  return function(r, o) {
    if (N(r, o)) {
      Object.defineProperty(r, o, {
        configurable: !0,
        enumerable: s.enumerable,
        get() {
        },
        set(i) {
          Object.defineProperty(this, o, Object.assign({ value: i }, s));
        }
      });
      return;
    }
    if (B(o)) {
      const i = o;
      return i.kind === "field" ? function(n) {
        return Object.defineProperty(this, i.name, Object.assign({ value: n }, s)), n;
      } : (i.addInitializer(function() {
        const n = Object.getOwnPropertyDescriptor(this, i.name);
        n && Object.defineProperty(this, i.name, Object.assign(Object.assign({}, n), { enumerable: s.enumerable }));
      }), r);
    }
  };
}
function L(e, s) {
  return N(e, s) || B(s) ? yt()(e, s) : yt(e);
}
const Ke = () => {
  var e;
  const s = globalThis;
  return !!((e = s.__MVVM_DEVTOOLS_HISTORY__) !== null && e !== void 0 ? e : s.__MVVM_DEVTOOLS_AUTO__);
}, He = (e) => Ke() ? !e || typeof e != "object" ? { collectChanges: !0 } : "collectChanges" in e ? e : Object.assign(Object.assign({}, e), { collectChanges: !0 }) : e;
function mi(e) {
  const s = (i, n) => {
    const a = new bt({ callback: e, name: String(n) }), l = K(a.metadataKey, i, new Array());
    z(a.metadataKey, [...l, a], i);
  }, r = (i) => {
    i.addInitializer(function() {
      const n = new bt({ callback: e, name: String(i.name) }), a = K(n.metadataKey, this, new Array());
      z(n.metadataKey, [...a, n], this);
    });
  };
  function o(i, n) {
    if (N(i, n)) {
      s(i, n);
      return;
    }
    if (B(n))
      return r(n), n.kind === "field" ? (a) => a : n;
  }
  return e ? ((i, n) => o(i, n)) : ((i) => i);
}
function vi(e) {
  const s = (i, n) => {
    const a = new Dt({ callback: e, name: String(n) }), l = K(a.metadataKey, i, new Array());
    z(a.metadataKey, [...l, a], i);
  }, r = (i) => {
    i.addInitializer(function() {
      const n = new Dt({ callback: e, name: String(i.name) }), a = K(n.metadataKey, this, new Array());
      z(n.metadataKey, [...a, n], this);
    });
  };
  function o(i, n) {
    if (N(i, n)) {
      s(i, n);
      return;
    }
    if (B(n))
      return r(n), n.kind === "field" ? (a) => a : n;
  }
  return e ? ((i, n) => o(i, n)) : ((i) => i);
}
function gi(e) {
  const s = (i, n) => {
    const a = new It({ callback: e, name: String(n) }), l = K(a.metadataKey, i, new Array());
    z(a.metadataKey, [...l, a], i);
  }, r = (i) => {
    i.addInitializer(function() {
      const n = new It({ callback: e, name: String(i.name) }), a = K(n.metadataKey, this, new Array());
      z(n.metadataKey, [...a, n], this);
    });
  };
  function o(i, n) {
    if (N(i, n)) {
      s(i, n);
      return;
    }
    if (B(n))
      return r(n), n.kind === "field" ? void 0 : n;
  }
  if (e)
    return ((i, n) => o(i, n));
}
function pi(e, s) {
  const r = He(N(e, s) ? void 0 : e), o = (a, l) => {
    const u = new Ot(Object.assign(Object.assign({}, r), { name: String(l), ctx: null })), f = K(u.metadataKey, a, new Array());
    z(u.metadataKey, [...f, u], a), Object.getOwnPropertyDescriptor(a, l) || Object.defineProperty(a, l, {
      configurable: !0,
      enumerable: !0,
      get() {
        const _ = this;
        if (Object.prototype.hasOwnProperty.call(_, l))
          return Reflect.get(_, l);
        const b = _.initField, p = _.initData;
        if (p && l in p && typeof b == "function")
          return b.call(_, String(l), { skipValidation: !0 }), Reflect.get(_, l);
      },
      set(_) {
        const b = this, p = b.initField, k = b.initData;
        if (k && !(l in k) && Reflect.set(k, l, _), typeof p == "function") {
          p.call(b, String(l), { skipValidation: !0 });
          return;
        }
        Object.defineProperty(this, l, { value: _, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  }, i = (a) => {
    a.addInitializer(function() {
      const l = this;
      if (typeof l.initField == "function") {
        const u = new Ot(Object.assign(Object.assign({}, r), { name: String(a.name), ctx: a })), f = K(u.metadataKey, this, new Array());
        z(u.metadataKey, [...f, u], this), l.initField.call(this, String(a.name));
      }
    });
  };
  function n(a, l) {
    if (N(a, l)) {
      o(a, l);
      return;
    }
    if (B(l))
      return i(l), l.kind === "field" ? (u) => u : l;
  }
  return N(e, s) ? n(e, s) : r && !B(s) ? (a, l) => n(a, l) : B(s) ? n(void 0, s) : (a, l) => n(a, l);
}
function bi(e) {
  const s = (i, n) => {
    const a = new Mt({ name: e, originName: String(n) });
    a.name = e, a.originName = String(n);
    const l = K(a.metadataKey, i, new Array());
    z(a.metadataKey, [...l, a], i);
  }, r = (i) => {
    i.addInitializer(function() {
      const n = new Mt(), a = n.fields(this);
      for (const l in this)
        a instanceof Array && i.name === l && (n.name = e, n.originName = l, n.value = this[l], a.push(n));
      z(n.metadataKey, a, this);
    });
  };
  function o(i, n) {
    if (N(i, n)) {
      s(i, n);
      return;
    }
    if (B(n))
      return r(n), n.kind === "field" ? (a) => a : n;
  }
  return e ? ((i, n) => o(i, n)) : ((i) => i);
}
function Di(e, s) {
  const r = (n) => class extends n {
    constructor(...a) {
      super(...a), gt(this);
    }
  }, o = (n, a) => {
    if (typeof Reflect?.getOwnMetadataKeys == "function")
      for (const l of Reflect.getOwnMetadataKeys(n)) {
        const u = Reflect.getOwnMetadata(l, n);
        Reflect.defineMetadata(l, u, a);
      }
  };
  function i(n, a) {
    if (!B(a)) {
      const l = n, u = r(l);
      return Object.defineProperty(u, "__mvvm_legacy_source__", { value: l, configurable: !0 }), o(l, u), u;
    }
    a.addInitializer(function() {
      gt(this);
    });
  }
  return e && !B(s) || e ? i(e, s) : i;
}
const qe = () => {
  var e;
  return (e = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && e !== void 0 ? e : null;
}, Ye = () => {
  var e;
  return (e = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0;
}, dt = (e) => {
  var s, r;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((s = o.__MVVM_DEVTOOLS_APPLYING__) !== null && s !== void 0 ? s : 0) + 1;
  try {
    return e();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((r = o.__MVVM_DEVTOOLS_APPLYING__) !== null && r !== void 0 ? r : 1) - 1);
  }
}, Be = () => Ye() > 0, fe = (e) => ({
  data: e.service.dumpData,
  historyIndex: e.service.historyIndex
}), Ge = (e, s = {}) => {
  const r = qe();
  if (!r)
    return () => {
    };
  const o = r.connect({ name: s.name, instanceId: s.instanceId });
  let i = !1;
  try {
    o.init(fe(e));
  } catch {
  }
  const n = ye(() => fe(e), (l) => {
    var u;
    if (!(i || Be()))
      try {
        o.send({ type: (u = s.actionType) !== null && u !== void 0 ? u : "model:update" }, l);
      } catch {
      }
  }), a = o.subscribe((l) => {
    var u;
    if (l.type !== "DISPATCH")
      return;
    const f = (u = l.payload) === null || u === void 0 ? void 0 : u.type;
    if (f === "RESET") {
      i = !0, dt(() => {
        try {
          e.service.toInit();
        } finally {
          i = !1;
        }
      });
      return;
    }
    if (f === "COMMIT") {
      i = !0, dt(() => {
        try {
          e.service.commit();
        } finally {
          i = !1;
        }
      });
      return;
    }
    if (f === "ROLLBACK") {
      i = !0, dt(() => {
        try {
          e.service.toInit();
        } finally {
          i = !1;
        }
      });
      return;
    }
    if (f === "JUMP_TO_ACTION" || f === "JUMP_TO_STATE") {
      if (!l.state)
        return;
      try {
        const m = JSON.parse(l.state), _ = m.historyIndex, b = e.service.history, p = Array.isArray(b) && b.length > 0, k = typeof _ == "number" && (_ === -1 && p || _ >= 0 && p && _ < b.length);
        i = !0, dt(() => {
          var j;
          try {
            if (k) {
              e.service.goToHistory(_);
              return;
            }
            const x = (j = m.data) !== null && j !== void 0 ? j : m;
            J(() => {
              e.service.loadData(x);
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
    n(), typeof a == "function" && a(), typeof o.unsubscribe == "function" && o.unsubscribe(), typeof o.disconnect == "function" && o.disconnect();
  };
};
we();
const Ne = new Dt(), $ = new Ot(), Ue = new bt(), $e = new It();
let Ii = (() => {
  var e, s, r, o, i, n, a, l, u, f;
  let m = [], _, b = [], p = [], k, j = [], x = [], H, U = [], C = [], T, d = [], S = [], E, P = [], A = [], R, q = [], X = [], Z, at = [], ot = [], lt, ct = [], wt = [], kt, Tt = [], Et = [], At, xt = [], Vt = [], jt, Ct = [], Pt = [], Ft, Rt = [], zt = [], Lt, Kt = [], Ht = [], qt, Yt, Bt = [], Gt = [], Nt, Ut, $t, Wt, Qt, Jt, Xt, Zt, te, ee, ie, se;
  return e = class {
    get initData() {
      return W(this, s, "f");
    }
    set initData(t) {
      Q(this, s, t, "f");
    }
    get committedData() {
      return W(this, r, "f");
    }
    set committedData(t) {
      Q(this, r, t, "f");
    }
    get modified_() {
      return W(this, o, "f");
    }
    set modified_(t) {
      Q(this, o, t, "f");
    }
    get changes() {
      return W(this, i, "f");
    }
    set changes(t) {
      Q(this, i, t, "f");
    }
    get inverseChanges() {
      return W(this, n, "f");
    }
    set inverseChanges(t) {
      Q(this, n, t, "f");
    }
    get history() {
      return W(this, a, "f");
    }
    set history(t) {
      Q(this, a, t, "f");
    }
    get historyIndex() {
      return W(this, l, "f");
    }
    set historyIndex(t) {
      Q(this, l, t, "f");
    }
    /**
     * Создает модель и инициализирует данные.
     */
    constructor(t = {}, c) {
      this[u] = (I(this, m), I(this, b, !0)), s.set(this, (I(this, p), I(this, j, null))), r.set(this, (I(this, x), I(this, U, {}))), o.set(this, (I(this, C), I(this, d, {}))), this.draft = (I(this, S), I(this, P, null)), i.set(this, (I(this, A), I(this, q, []))), n.set(this, (I(this, X), I(this, at, []))), a.set(this, (I(this, ot), I(this, ct, []))), l.set(this, (I(this, wt), I(this, Tt, -1))), this.initializedFields = (I(this, Et), I(this, xt, void 0)), this.legacyInitDone = (I(this, Vt), I(this, Ct, !1)), this.rawInitData = (I(this, Pt), I(this, Rt, null)), this.options = (I(this, zt), I(this, Kt, void 0)), this.historyMuted = (I(this, Ht), I(this, Bt, !1)), this.serviceApi = (I(this, Gt), {
        loadData: (h) => this.loadData(h),
        reject: () => this.reject(),
        commit: () => this.commit(),
        commitField: (h) => this.commitField(h),
        toInit: () => this.toInit(),
        undo: () => this.undo(),
        redo: () => this.redo(),
        goToHistory: (h) => this.goToHistory(h)
      }), this.options = c, this[ce] = !0, this.init(t), this.autoAttachDevtools(), this.initLegacyFields();
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
      this.cloneForInit(t), this.resetToDefault(), this.createDraft(t), this.defineData(this.initData);
    }
    /**
     * Инициализировать отдельное поле модели.
     */
    initField(t, c) {
      const h = $.fieldInstance(t, this);
      if (h) {
        t in this.initData || Reflect.set(this.initData, t, Y(Reflect.get(this, t)));
        const y = Y(this.initData), v = h?.factory ? h.factory(y, this) : Reflect.get(y, h.name);
        this.defineFieldValue(t, v), c?.skipValidation || this.initValidation(t), this.getInitializedFields().add(String(t));
      }
    }
    getInitializedFields() {
      return this.initializedFields || (this.initializedFields = /* @__PURE__ */ new Set()), this.initializedFields;
    }
    initLegacyFields() {
      var t;
      if (this.legacyInitDone)
        return;
      const c = $.fields(this);
      if (!c.some((M) => Object.prototype.hasOwnProperty.call(this, M.name)))
        return;
      this.legacyInitDone = !0;
      const y = this.getInitializedFields(), v = (t = this.rawInitData) !== null && t !== void 0 ? t : this.initData;
      if (v && v !== this.initData)
        try {
          this.initData = Y(v);
        } catch {
          this.initData = Object.assign({}, v);
        }
      for (const M of c) {
        const D = String(M.name);
        if (v && D in v) {
          const V = $.fieldInstance(D, this);
          if (!V)
            continue;
          if (!y.has(D)) {
            const tt = Y(v), rt = V.factory ? V.factory(tt, this) : Reflect.get(tt, V.name);
            this.defineFieldValue(D, rt), Reflect.set(this, D, rt), y.add(D);
          }
          continue;
        }
        y.has(D) || this.initField(D, { skipValidation: !0 });
      }
    }
    /**
     * Создать draft для отслеживания изменений.
     */
    createDraft(t) {
      const c = {};
      for (const h in t)
        $.fieldInstance(h, this) && Reflect.set(c, h, Y(t[h]));
      this.draft = ke(c);
    }
    autoAttachDevtools() {
      var t, c, h, y, v, M, D, w, V, tt, rt, ht;
      const ft = globalThis;
      if (!ft.__MVVM_DEVTOOLS_AUTO__ || ((c = (t = this.options) === null || t === void 0 ? void 0 : t.devtools) === null || c === void 0 ? void 0 : c.enabled) === !1)
        return;
      const ne = (D = (v = (y = (h = this.options) === null || h === void 0 ? void 0 : h.devtools) === null || y === void 0 ? void 0 : y.name) !== null && v !== void 0 ? v : (M = this.constructor) === null || M === void 0 ? void 0 : M.name) !== null && D !== void 0 ? D : "Model", ae = ((w = ft.__MVVM_DEVTOOLS_SEQ__) !== null && w !== void 0 ? w : 0) + 1;
      ft.__MVVM_DEVTOOLS_SEQ__ = ae;
      const ge = (rt = (tt = (V = this.options) === null || V === void 0 ? void 0 : V.devtools) === null || tt === void 0 ? void 0 : tt.instanceId) !== null && rt !== void 0 ? rt : `${ne}#${ae}`;
      ((ht = globalThis.queueMicrotask) !== null && ht !== void 0 ? ht : ((pe) => Promise.resolve().then(pe)))(() => Ge(this, { name: ne, instanceId: ge }));
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
      de(this.draft, t);
      const c = new Set(t.map((h) => h.field).filter(Boolean));
      c.size !== 0 && this.withHistoryMuted(() => {
        for (const h of c) {
          const y = this.draft, v = this.initData, M = Reflect.has(y, h), D = Reflect.get(M ? y : v, h);
          let w = D;
          try {
            w = Y(D);
          } catch {
            w = D;
          }
          Reflect.set(this, h, w), this.defineFieldValue(h, Reflect.get(this, h));
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
    produceDraft(t, c, h) {
      if (this.historyMuted)
        return;
      let y, v = [];
      t && (y = t.split(".")[0], y && !$.fieldInstance(y, this).collectChanges) || (Te(this.draft, (M) => {
        if (t) {
          let D = M;
          const w = t.split(".");
          if (w.length > 1)
            for (let V = 0; V < w.length && !(!(V == w.length - 1) && !re(D)); V++)
              re(D) && (D = D[w[V]]);
          else
            h = t;
          D && (D[h] = c);
        }
      }, (M, D) => {
        y && (M = M.map((w) => Object.assign(Object.assign({}, w), { field: y })), D = D.map((w) => Object.assign(Object.assign({}, w), { field: y }))), v = M, !(!M.length && !D.length) && (this.historyIndex < this.history.length - 1 && (this.history = this.history.slice(0, this.historyIndex + 1), this.syncChangesFromHistory()), this.changes.push(...M), this.inverseChanges.push(...D), this.history.push({ patches: M, inversePatches: D }), this.historyIndex = this.history.length - 1);
      }), v.length && de(this.draft, v));
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
    createObservable(t, c, h, y = h) {
      return t = le(t) ? t : G.box(t), new Proxy(t.get(), {
        get: (v, M, D) => {
          const w = Reflect.get(v, M, D);
          return w && typeof w == "object" && !(w instanceof e) && !le(t) ? this.createObservable(w, String(M), c, `${y}.${String(M)}`) : w;
        },
        set: (v, M, D, w) => {
          const V = Reflect.set(v, M, D, w);
          return t.set(D), this.produceDraft(y, t.get(), String(M)), this.checkChange(h, Reflect.get(this, h)), V;
        }
      });
    }
    /**
     * Определить getter/setter для поля модели.
     */
    defineFieldValue(t, c) {
      const h = $.fieldInstance(t, this);
      return c && typeof c == "object" && (c = this.createObservable(c, t, t)), c = G.box(c), Reflect.defineProperty(this, h.name, {
        get() {
          return c.get();
        },
        set: (y) => {
          J(() => c.set(y)), this.produceDraft(h.name, c.get()), this.checkChange(h.name, c.get());
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
          const c = Y(t);
          this.initData = c, this.rawInitData = c;
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
    checkChange(t, c) {
      const h = Y(c), y = Y(Reflect.get(this.committedData, t)) || Y(Reflect.get(this.initData, t)), v = t && t in this.initData && !oe(y, h);
      return J(() => {
        v && Reflect.set(this.modified_, t, Y(y) || y);
        for (const M in this.modified_)
          t === M && t in this.modified_ && oe(y, h) && delete this.modified_[M];
      }), v;
    }
    /**
     * Применить данные к полям модели.
     */
    defineData(t) {
      for (const c in this) {
        if (!Object.prototype.hasOwnProperty.call(this, c))
          continue;
        $.fieldInstance(c, this) && (Reflect.set(this, c, Reflect.get(t, c)), this.initField(c));
      }
    }
    /**
     * Признак наличия изменений.
     */
    get dirty() {
      return !Ie(this.modified_);
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
          const c = this.historyIndex + 1, h = this.history[c];
          this.historyIndex = c, this.applyHistoryPatches(h.patches);
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
        const v = Ne.fieldInstance(y, this);
        return v?.callback ? v.callback(Reflect.get(this, y), this) : Reflect.get(this, y);
      }, h = (y) => {
        const v = $e.fieldInstance(y, this);
        if (v)
          switch (typeof v.callback) {
            case "boolean":
              return !!v.callback;
            case "function":
              return v.callback(Reflect.get(this, y), this);
          }
        return !1;
      };
      $.fields(this).forEach((y) => {
        var v;
        if (y.name in this)
          return !((v = this.options) === null || v === void 0) && v.byFields && !this.options.byFields.includes(y.name) || h(y.name) ? void 0 : Reflect.set(t, y.name, c(y.name));
      });
      try {
        return Y(t);
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
        const h = Ue.fieldInstance(c, this);
        h && Reflect.set(t, c, h.callback(this[c], this) || "");
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
  }, s = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), i = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), _ = [L], u = be(ce), (() => {
    const O = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    k = [G, L], H = [G, L], T = [G, L], E = [L], R = [G, L], Z = [G, L], lt = [G, L], kt = [G, L], At = [L], jt = [L], Ft = [L], Lt = [L], qt = [F], Yt = [L], Nt = [F], Ut = [it], $t = [F], Wt = [F], Qt = [F], Jt = [F], Xt = [F], Zt = [F], te = [F], ee = [it], ie = [it], se = [(f = it).struct.bind(f)], g(e, null, k, { kind: "accessor", name: "initData", static: !1, private: !1, access: { has: (t) => "initData" in t, get: (t) => t.initData, set: (t, c) => {
      t.initData = c;
    } }, metadata: O }, j, x), g(e, null, H, { kind: "accessor", name: "committedData", static: !1, private: !1, access: { has: (t) => "committedData" in t, get: (t) => t.committedData, set: (t, c) => {
      t.committedData = c;
    } }, metadata: O }, U, C), g(e, null, T, { kind: "accessor", name: "modified_", static: !1, private: !1, access: { has: (t) => "modified_" in t, get: (t) => t.modified_, set: (t, c) => {
      t.modified_ = c;
    } }, metadata: O }, d, S), g(e, null, R, { kind: "accessor", name: "changes", static: !1, private: !1, access: { has: (t) => "changes" in t, get: (t) => t.changes, set: (t, c) => {
      t.changes = c;
    } }, metadata: O }, q, X), g(e, null, Z, { kind: "accessor", name: "inverseChanges", static: !1, private: !1, access: { has: (t) => "inverseChanges" in t, get: (t) => t.inverseChanges, set: (t, c) => {
      t.inverseChanges = c;
    } }, metadata: O }, at, ot), g(e, null, lt, { kind: "accessor", name: "history", static: !1, private: !1, access: { has: (t) => "history" in t, get: (t) => t.history, set: (t, c) => {
      t.history = c;
    } }, metadata: O }, ct, wt), g(e, null, kt, { kind: "accessor", name: "historyIndex", static: !1, private: !1, access: { has: (t) => "historyIndex" in t, get: (t) => t.historyIndex, set: (t, c) => {
      t.historyIndex = c;
    } }, metadata: O }, Tt, Et), g(e, null, qt, { kind: "method", name: "resetToDefault", static: !1, private: !1, access: { has: (t) => "resetToDefault" in t, get: (t) => t.resetToDefault }, metadata: O }, null, m), g(e, null, Nt, { kind: "method", name: "produceDraft", static: !1, private: !1, access: { has: (t) => "produceDraft" in t, get: (t) => t.produceDraft }, metadata: O }, null, m), g(e, null, Ut, { kind: "getter", name: "dirty", static: !1, private: !1, access: { has: (t) => "dirty" in t, get: (t) => t.dirty }, metadata: O }, null, m), g(e, null, $t, { kind: "method", name: "commit", static: !1, private: !1, access: { has: (t) => "commit" in t, get: (t) => t.commit }, metadata: O }, null, m), g(e, null, Wt, { kind: "method", name: "commitField", static: !1, private: !1, access: { has: (t) => "commitField" in t, get: (t) => t.commitField }, metadata: O }, null, m), g(e, null, Qt, { kind: "method", name: "reject", static: !1, private: !1, access: { has: (t) => "reject" in t, get: (t) => t.reject }, metadata: O }, null, m), g(e, null, Jt, { kind: "method", name: "toInit", static: !1, private: !1, access: { has: (t) => "toInit" in t, get: (t) => t.toInit }, metadata: O }, null, m), g(e, null, Xt, { kind: "method", name: "undo", static: !1, private: !1, access: { has: (t) => "undo" in t, get: (t) => t.undo }, metadata: O }, null, m), g(e, null, Zt, { kind: "method", name: "redo", static: !1, private: !1, access: { has: (t) => "redo" in t, get: (t) => t.redo }, metadata: O }, null, m), g(e, null, te, { kind: "method", name: "goToHistory", static: !1, private: !1, access: { has: (t) => "goToHistory" in t, get: (t) => t.goToHistory }, metadata: O }, null, m), g(e, null, ee, { kind: "getter", name: "validation", static: !1, private: !1, access: { has: (t) => "validation" in t, get: (t) => t.validation }, metadata: O }, null, m), g(e, null, ie, { kind: "getter", name: "validAndDirty", static: !1, private: !1, access: { has: (t) => "validAndDirty" in t, get: (t) => t.validAndDirty }, metadata: O }, null, m), g(e, null, se, { kind: "getter", name: "service", static: !1, private: !1, access: { has: (t) => "service" in t, get: (t) => t.service }, metadata: O }, null, m), g(null, null, _, { kind: "field", name: u, static: !1, private: !1, access: { has: (t) => u in t, get: (t) => t[u], set: (t, c) => {
      t[u] = c;
    } }, metadata: O }, b, p), g(null, null, E, { kind: "field", name: "draft", static: !1, private: !1, access: { has: (t) => "draft" in t, get: (t) => t.draft, set: (t, c) => {
      t.draft = c;
    } }, metadata: O }, P, A), g(null, null, At, { kind: "field", name: "initializedFields", static: !1, private: !1, access: { has: (t) => "initializedFields" in t, get: (t) => t.initializedFields, set: (t, c) => {
      t.initializedFields = c;
    } }, metadata: O }, xt, Vt), g(null, null, jt, { kind: "field", name: "legacyInitDone", static: !1, private: !1, access: { has: (t) => "legacyInitDone" in t, get: (t) => t.legacyInitDone, set: (t, c) => {
      t.legacyInitDone = c;
    } }, metadata: O }, Ct, Pt), g(null, null, Ft, { kind: "field", name: "rawInitData", static: !1, private: !1, access: { has: (t) => "rawInitData" in t, get: (t) => t.rawInitData, set: (t, c) => {
      t.rawInitData = c;
    } }, metadata: O }, Rt, zt), g(null, null, Lt, { kind: "field", name: "options", static: !1, private: !1, access: { has: (t) => "options" in t, get: (t) => t.options, set: (t, c) => {
      t.options = c;
    } }, metadata: O }, Kt, Ht), g(null, null, Yt, { kind: "field", name: "historyMuted", static: !1, private: !1, access: { has: (t) => "historyMuted" in t, get: (t) => t.historyMuted, set: (t, c) => {
      t.historyMuted = c;
    } }, metadata: O }, Bt, Gt), O && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: O });
  })(), e;
})();
const ve = /* @__PURE__ */ Symbol("store-key"), We = () => {
  var e;
  return (e = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && e !== void 0 ? e : null;
}, Qe = () => {
  var e;
  return (e = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0;
}, Je = (e) => {
  var s, r;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((s = o.__MVVM_DEVTOOLS_APPLYING__) !== null && s !== void 0 ? s : 0) + 1;
  try {
    return e();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((r = o.__MVVM_DEVTOOLS_APPLYING__) !== null && r !== void 0 ? r : 1) - 1);
  }
}, Xe = () => Qe() > 0, St = (e) => ({
  items: e.items.map((s) => {
    var r, o;
    return {
      name: (o = (r = s.constructor) === null || r === void 0 ? void 0 : r.name) !== null && o !== void 0 ? o : "Model",
      data: s.service.dumpData,
      historyIndex: s.service.historyIndex
    };
  })
}), Ze = (e) => !!(e && typeof e == "object" && Array.isArray(e.items)), ti = (e) => {
  if (!e)
    return null;
  try {
    const s = JSON.parse(e);
    return Ze(s) ? s : null;
  } catch {
    return null;
  }
}, ei = (e, s = {}) => {
  var r, o;
  const i = We();
  if (!i)
    return () => {
    };
  const n = i.connect({ name: s.name, instanceId: s.instanceId });
  let a = !1, l = (o = (r = e.items[0]) === null || r === void 0 ? void 0 : r.constructor) !== null && o !== void 0 ? o : null;
  try {
    n.init(St(e));
  } catch {
  }
  const u = ye(() => St(e), (_) => {
    var b;
    if (a || Xe())
      return;
    const p = (b = e.items[0]) === null || b === void 0 ? void 0 : b.constructor;
    p && (l = p);
    try {
      n.send({ type: "store:update" }, _);
    } catch {
    }
  }), f = (_) => (a = !0, Je(() => {
    try {
      return _();
    } finally {
      a = !1;
    }
  })), m = n.subscribe((_) => {
    var b;
    if (_.type !== "DISPATCH")
      return;
    const p = (b = _.payload) === null || b === void 0 ? void 0 : b.type;
    if (p === "RESET" || p === "ROLLBACK") {
      f(() => e.reset());
      return;
    }
    if (p === "JUMP_TO_ACTION" || p === "JUMP_TO_STATE") {
      const k = ti(_.state);
      if (!k)
        return;
      f(() => {
        var j, x, H;
        if (k.items.length === e.items.length && e.items.every((S) => {
          var E, P;
          return typeof ((E = S?.service) === null || E === void 0 ? void 0 : E.goToHistory) == "function" || typeof ((P = S?.service) === null || P === void 0 ? void 0 : P.loadData) == "function";
        })) {
          J(() => {
            k.items.forEach((S, E) => {
              var P;
              const A = (P = e.items[E]) === null || P === void 0 ? void 0 : P.service, R = S.historyIndex, q = A?.history;
              if (Array.isArray(q) && q.length > 0 && typeof R == "number" && typeof A?.goToHistory == "function" && (R === -1 && q.length > 0 || R < q.length)) {
                A.goToHistory(R);
                return;
              }
              typeof A?.loadData == "function" && A.loadData(S.data);
            });
          });
          return;
        }
        const C = (x = (j = e.items[0]) === null || j === void 0 ? void 0 : j.constructor) !== null && x !== void 0 ? x : l, T = k.items.map((S) => S.data);
        if (C) {
          e.applyLoaded(T, { model: C, cash: !1 }), l = C;
          return;
        }
        e.applyLoaded(T, { cash: !1 });
        const d = (H = e.items[0]) === null || H === void 0 ? void 0 : H.constructor;
        d && (l = d);
      });
    }
  });
  return () => {
    u(), typeof m == "function" && m(), typeof n.unsubscribe == "function" && n.unsubscribe(), typeof n.disconnect == "function" && n.disconnect();
  };
};
let Mi = (() => {
  var e, s, r;
  let o = [], i, n = [], a = [], l, u = [], f = [], m, _, b, p, k, j, x, H, U, C;
  return e = class {
    get items() {
      return W(this, s, "f");
    }
    set items(d) {
      Q(this, s, d, "f");
    }
    get _cash() {
      return W(this, r, "f");
    }
    set _cash(d) {
      Q(this, r, d, "f");
    }
    constructor() {
      s.set(this, (I(this, o), I(this, n, []))), r.set(this, (I(this, a), I(this, u, []))), I(this, f), gt(this), this.autoAttachDevtools();
    }
    add(d) {
      this.items = this.items.concat(d);
    }
    addMany(d) {
      d?.length && (this.items = this.items.concat(d));
    }
    remove(d) {
      this.items = this.items.filter((S) => S !== d);
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
    findBy(d, S) {
      return this.items.find((E) => E?.[d] === S);
    }
    clear() {
      this.items = [];
    }
    get size() {
      return this.items.length;
    }
    get snapshot() {
      return St(this);
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
    applyLoaded(d, S = {}) {
      const { model: E, mode: P = "replace", cash: A = !0 } = S;
      if (A && this.setCash(d), P === "append") {
        const R = E ? d.map((q) => new E(q)) : d;
        this.addMany(R);
        return;
      }
      this.items = E ? d.map((R) => new E(R)) : d;
    }
    /**
     * Сохранить оригинальные данные стора.
     */
    setCash(d) {
      this._cash = d ?? [];
    }
    autoAttachDevtools() {
      var d, S, E, P, A, R, q, X;
      const Z = globalThis;
      if (!Z.__MVVM_DEVTOOLS_AUTO__)
        return;
      const at = K(ve, this.constructor, {}) || {};
      if (((d = at.devtools) === null || d === void 0 ? void 0 : d.enabled) === !1)
        return;
      const ot = (A = (E = (S = at.devtools) === null || S === void 0 ? void 0 : S.name) !== null && E !== void 0 ? E : (P = this.constructor) === null || P === void 0 ? void 0 : P.name) !== null && A !== void 0 ? A : "Store", lt = ((R = Z.__MVVM_DEVTOOLS_STORE_SEQ__) !== null && R !== void 0 ? R : 0) + 1;
      Z.__MVVM_DEVTOOLS_STORE_SEQ__ = lt;
      const ct = (X = (q = at.devtools) === null || q === void 0 ? void 0 : q.instanceId) !== null && X !== void 0 ? X : `${ot}#${lt}`;
      ei(this, { name: ot, instanceId: ct });
    }
  }, s = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), (() => {
    const T = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    i = [G], l = [G], m = [F], _ = [F], b = [F], p = [F], k = [it], j = [it], x = [it], H = [F], U = [F], C = [F], g(e, null, i, { kind: "accessor", name: "items", static: !1, private: !1, access: { has: (d) => "items" in d, get: (d) => d.items, set: (d, S) => {
      d.items = S;
    } }, metadata: T }, n, a), g(e, null, l, { kind: "accessor", name: "_cash", static: !1, private: !1, access: { has: (d) => "_cash" in d, get: (d) => d._cash, set: (d, S) => {
      d._cash = S;
    } }, metadata: T }, u, f), g(e, null, m, { kind: "method", name: "add", static: !1, private: !1, access: { has: (d) => "add" in d, get: (d) => d.add }, metadata: T }, null, o), g(e, null, _, { kind: "method", name: "addMany", static: !1, private: !1, access: { has: (d) => "addMany" in d, get: (d) => d.addMany }, metadata: T }, null, o), g(e, null, b, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (d) => "remove" in d, get: (d) => d.remove }, metadata: T }, null, o), g(e, null, p, { kind: "method", name: "clear", static: !1, private: !1, access: { has: (d) => "clear" in d, get: (d) => d.clear }, metadata: T }, null, o), g(e, null, k, { kind: "getter", name: "size", static: !1, private: !1, access: { has: (d) => "size" in d, get: (d) => d.size }, metadata: T }, null, o), g(e, null, j, { kind: "getter", name: "snapshot", static: !1, private: !1, access: { has: (d) => "snapshot" in d, get: (d) => d.snapshot }, metadata: T }, null, o), g(e, null, x, { kind: "getter", name: "cash", static: !1, private: !1, access: { has: (d) => "cash" in d, get: (d) => d.cash }, metadata: T }, null, o), g(e, null, H, { kind: "method", name: "reset", static: !1, private: !1, access: { has: (d) => "reset" in d, get: (d) => d.reset }, metadata: T }, null, o), g(e, null, U, { kind: "method", name: "applyLoaded", static: !1, private: !1, access: { has: (d) => "applyLoaded" in d, get: (d) => d.applyLoaded }, metadata: T }, null, o), g(e, null, C, { kind: "method", name: "setCash", static: !1, private: !1, access: { has: (d) => "setCash" in d, get: (d) => d.setCash }, metadata: T }, null, o), T && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: T });
  })(), e;
})();
function wi(e) {
  return st(e, "instance");
}
function ki(e) {
  return ((s, r) => Ce(e)(s, r));
}
function Ti(e, s) {
  const r = (o, i) => {
    var n;
    const a = typeof e == "string" ? { id: e } : typeof e == "object" ? e : { id: (n = i?.name) !== null && n !== void 0 ? n : o?.name };
    z(ve, a, o), me(a)(o, i);
  };
  return typeof e == "function" ? r(e, s) : (o, i) => r(o, i);
}
class Ei {
}
const mt = new Mt();
function Ai(e, s) {
  return Ee((r = {}) => {
    const { resolved: o, instance: i } = Ae(() => {
      const a = st(e) || (typeof e != "string" ? { instance: new e() } : void 0), l = a?.instance;
      return { resolved: a, instance: l };
    }, [e]);
    if (xe(() => {
      if (i)
        return typeof i.onInit == "function" && i.onInit(), () => {
          typeof i.onDispose == "function" && i.onDispose();
        };
    }, [i]), o) {
      const n = mt.fields(i), a = n.length > 0 ? n : mt.fields(Object.getPrototypeOf(i));
      for (const l in r)
        if (a instanceof Array) {
          const u = a.find((f) => f.name === l);
          u && Reflect.set(i, u.originName, Reflect.get(r, l));
        }
      return z(mt.metadataKey, a, i), s(Object.assign({ viewModel: i }, r));
    }
    return s(Object.assign({}, r));
  });
}
const _e = {
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
}, ut = () => {
};
class si {
  constructor(s, r) {
    var o, i, n, a, l, u, f;
    this.isExecuting = !1, this.activeCount = 0, this.isCanceled = !1, this.isDisposed = !1, this.error = null, this.controllers = /* @__PURE__ */ new Set(), this.queue = [], this.runningPromise = null, this.queueTail = Promise.resolve(), this.cancelToken = 0, this.fn = s, this.opt = Object.assign({ concurrency: (o = r?.concurrency) !== null && o !== void 0 ? o : "ignore", trackError: (i = r?.trackError) !== null && i !== void 0 ? i : !0, resetErrorOnExecute: (n = r?.resetErrorOnExecute) !== null && n !== void 0 ? n : !0, swallowError: (a = r?.swallowError) !== null && a !== void 0 ? a : !0, abortable: (l = r?.abortable) !== null && l !== void 0 ? l : !1 }, r), this.states = Object.assign(Object.assign({}, _e), (u = r?.states) !== null && u !== void 0 ? u : {}), this.stateKeys = Object.assign(Object.assign({}, ii), (f = r?.stateKeys) !== null && f !== void 0 ? f : {}), Se(this, {
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
  resolveState(s) {
    var r, o;
    const i = (r = this.stateKeys[s]) !== null && r !== void 0 ? r : s;
    return (o = this.states[i]) !== null && o !== void 0 ? o : _e[s];
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
    var s, r;
    this.cancelToken += 1, this.isCanceled = !0, (r = (s = this.opt).onCancel) === null || r === void 0 || r.call(s), this.opt.cancelQueued && this.clearQueue();
    for (const o of this.controllers)
      o.abort();
  }
  dispose() {
    this.isDisposed || (this.isDisposed = !0, this.clearQueue(), this.cancel());
  }
  clearQueue() {
    if (this.queue.length === 0)
      return;
    const s = this.queue.splice(0, this.queue.length);
    for (const r of s)
      r.canceled = !0, r.settled || (r.settled = !0, r.resolve(void 0));
  }
  execute(...s) {
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
    }, i = () => vt(this, void 0, void 0, function* () {
      var n, a, l, u, f, m, _, b;
      if (this.isDisposed)
        return;
      const p = this.opt.abortable ? new AbortController() : null;
      p && this.controllers.add(p), J(() => {
        this.activeCount += 1, this.isExecuting = this.activeCount > 0, this.isCanceled = !1, this.opt.trackError && this.opt.resetErrorOnExecute && (this.error = null);
      });
      const k = this.cancelToken;
      let j = !1, x = !1, H = null, U = null;
      try {
        (a = (n = this.opt).onStart) === null || a === void 0 || a.call(n, ...s);
        const C = this.opt.abortable ? p.signal : void 0;
        U = this.fn(...s, C);
        const T = yield U;
        return x = this.cancelToken !== k, x ? void 0 : ((u = (l = this.opt).onSuccess) === null || u === void 0 || u.call(l, T, ...s), j = !0, T);
      } catch (C) {
        if (this.opt.abortable && p?.signal.aborted) {
          J(() => {
            this.isCanceled = !0;
          }), x = !0, H = null;
          return;
        }
        if (H = C, x = this.cancelToken !== k, this.opt.trackError && J(() => {
          this.error = C;
        }), (m = (f = this.opt).onError) === null || m === void 0 || m.call(f, C), !this.opt.swallowError)
          throw C;
        return;
      } finally {
        J(() => {
          this.activeCount = Math.max(0, this.activeCount - 1), this.isExecuting = this.activeCount > 0;
        }), p && this.controllers.delete(p), !x && this.cancelToken !== k && (x = !0), (b = (_ = this.opt).onFinally) === null || b === void 0 || b.call(_, { ok: j, canceled: x, error: H }, ...s);
      }
    });
    switch (this.opt.concurrency) {
      case "parallel":
        return o(i());
      case "restart":
        return this.cancel(), o(i());
      case "queue": {
        const n = this.opt.queueLimit;
        if (typeof n == "number" && n > 0 && this.queue.length >= n)
          return Promise.resolve(void 0);
        const a = {
          promise: Promise.resolve(void 0),
          resolve: ut,
          reject: ut,
          canceled: !1,
          settled: !1
        }, l = this.activeCount === 0 && this.queue.length === 0;
        a.promise = new Promise((m, _) => {
          a.resolve = m, a.reject = _;
        }), this.queue.push(a);
        const u = () => vt(this, void 0, void 0, function* () {
          if (a.settled)
            return;
          if (a.canceled || this.isDisposed) {
            a.settled = !0, a.resolve(void 0);
            return;
          }
          const m = this.queue.indexOf(a);
          m >= 0 && this.queue.splice(m, 1);
          try {
            const _ = yield i();
            a.settled || (a.settled = !0, a.resolve(_));
          } catch (_) {
            a.settled || (a.settled = !0, a.reject(_));
          }
        }), f = l ? u() : this.queueTail.then(u, u);
        return this.queueTail = f.then(ut, ut), o(a.promise);
      }
      default:
        return this.isExecuting && this.runningPromise ? this.runningPromise : o(i());
    }
  }
}
function ni(e, s) {
  return new si(e, s);
}
function xi(e, s) {
  const r = Oe(e), o = /* @__PURE__ */ new Set(), i = s?.onCancel;
  return ni((...a) => {
    const l = r(...a);
    o.add(l);
    const u = () => {
      o.delete(l);
    };
    return l.then(u, u), new Promise((f, m) => {
      l.then(f, (_) => {
        if (Me(_)) {
          f(void 0);
          return;
        }
        m(_);
      });
    });
  }, Object.assign(Object.assign({}, s), { onCancel: () => {
    var a;
    for (const l of o)
      (a = l.cancel) === null || a === void 0 || a.call(l);
    i?.();
  } }));
}
function Vi(e) {
  return function(...s) {
    return J(() => e.apply(this, s));
  };
}
export {
  st as GetService,
  wi as GetStore,
  Ce as Inject,
  ki as InjectStore,
  Di as MakeObservable,
  Ii as Model,
  bi as PropFromView,
  me as Service,
  yi as SetService,
  Ti as Store,
  Mi as StoreBase,
  _i as TODO,
  Ei as ViewModel,
  ni as asyncCommand,
  Ge as attachModelDevtools,
  ei as attachStoreDevtools,
  Vi as commandAction,
  z as defineMetadata,
  L as define_prop,
  gi as exclude,
  pi as field,
  xi as flowCommand,
  Ve as getExecutingFunctionNameByStack,
  K as getOwnMetadata,
  fi as isSerializable,
  vi as submit,
  mi as validation,
  Ai as view
};
//# sourceMappingURL=index.js.map
