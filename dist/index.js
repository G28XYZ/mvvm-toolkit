import "reflect-metadata";
import { d as _e, _ as W, a as q, b as p, e as pe, c as m } from "./tslib.es6-COgJoJmX.js";
import De, { cloneDeep as K, isObject as ne, isEqual as ae, isEmpty as Ie } from "lodash";
import { makeObservable as mt, reaction as ye, runInAction as J, observable as B, isObservable as re, computed as et, action as j, flow as Oe, isFlowCancellationError as Me, makeAutoObservable as Se } from "mobx";
import { enablePatches as we, immerable as oe, createDraft as ke, applyPatches as le, produce as Te } from "immer";
import { observer as Ae } from "mobx-react";
import { useMemo as Ee, useEffect as xe } from "react";
const z = (e, s, r) => Reflect.getOwnMetadata(e, s) || r || {}, F = (e, s, r) => Reflect.defineMetadata(e, s, r);
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
const ce = {}, ft = [];
let de = !1;
const _i = (e, ...s) => {
  const r = new Error().stack;
  if (!de)
    console.log("%c TODO", "background: #222; color: #bada55", ce), de = !0;
  else {
    const i = Ve(r);
    ft.includes(i) === !1 && (ft.push(i), Reflect.set(ce, `${ft.length}) ${e}`, { msg: s, get path() {
      return console.info(s, i), i;
    } }));
  }
  function o(...i) {
  }
  return o;
}, G = (e, s) => !!e && (typeof s == "string" || typeof s == "symbol"), H = (e) => !!e && typeof e == "object" && "kind" in e, je = (e) => ({
  kind: "class",
  name: e,
  addInitializer: () => {
  },
  metadata: {}
}), tt = /* @__PURE__ */ Symbol("service-key"), gt = new Proxy({}, Reflect);
function Pe(e) {
  const s = (o, i) => {
    Object.defineProperty(o, i, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, i))
          return Reflect.get(this, i);
        const n = it(e, "instance");
        if (n)
          return Object.defineProperty(this, i, { value: n, writable: !0, configurable: !0, enumerable: !0 }), n;
      },
      set(n) {
        const a = it(e, "instance");
        Object.defineProperty(this, i, { value: a ?? n, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  };
  function r(o, i) {
    if (G(o, i)) {
      s(o, i);
      return;
    }
    return i.addInitializer(function() {
      return _e(this, void 0, void 0, function* () {
        const n = it(e, "instance");
        n && Object.hasOwn(this, i.name) && Reflect.set(this, i.name, n);
      });
    }), (n) => n;
  }
  return r;
}
function it(e, s) {
  var r;
  const o = z(tt, gt);
  if (typeof e != "string") {
    const i = z(tt, e);
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
    const a = String(typeof e == "string" && e || typeof e == "object" && e?.id || n?.name || i?.name), l = z(tt, gt), h = new Proxy({
      target: i,
      instance: typeof e == "object" && Reflect.get(e, "transient") || typeof e == "object" && Reflect.get(e, "lazy") ? i : new i(),
      context: n,
      options: e
    }, {
      get(_, v, g) {
        var D, S;
        if (v === "instance" && (!((D = _?.options) === null || D === void 0) && D.transient))
          return new i();
        if (v === "instance" && (!((S = _?.options) === null || S === void 0) && S.lazy) && _.instance === i) {
          const A = new i();
          return Reflect.set(_, v, A, g), A;
        }
        return Reflect.get(_, v, g);
      },
      set(_, v, g, D) {
        return Reflect.set(_, v, g, D);
      }
    });
    l[a] = h, F(tt, l, gt), F(tt, l[a], i);
  };
  function o(i, n) {
    var a, l;
    const h = i.__mvvm_legacy_source__, _ = H(n) ? n : je((l = (a = h?.name) !== null && a !== void 0 ? a : i?.name) !== null && l !== void 0 ? l : "");
    r(i, _), h && h !== i && F(tt, z(tt, i), h);
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
  }), it(e).instance;
}, Fe = /* @__PURE__ */ Symbol("field-key"), Re = /* @__PURE__ */ Symbol("validation-key"), ze = /* @__PURE__ */ Symbol("submit-key"), Ce = /* @__PURE__ */ Symbol("exclude-key"), Le = /* @__PURE__ */ Symbol("prop-from-view-key");
class st {
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
    return s instanceof st || Object.getOwnPropertyNames(this).some((r) => Object.keys(s).includes(r));
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
            const h = typeof l == "symbol" ? l : String(l);
            if (o.has(h))
              continue;
            o.add(h);
          }
          r.push(a);
        }
      i = Object.getPrototypeOf(i);
    }
    return r;
  }
}
class vt extends st {
  constructor() {
    super(...arguments), this.metadataKey = Re;
  }
}
class bt extends st {
  constructor() {
    super(...arguments), this.metadataKey = ze;
  }
}
class pt extends st {
  constructor() {
    super(...arguments), this.metadataKey = Ce;
  }
}
class Dt extends st {
  /**
   * Создать метаданные поля модели.
   */
  constructor(s = {}) {
    super(s), this.factory = null, this.mapping = null, this.collectChanges = !1, this.name = null, this.ctx = null, this.metadataKey = Fe, this.factory = s.factory, this.mapping = s.mapping, this.name = s.name, this.ctx = s.ctx, this.collectChanges = !!s.collectChanges;
  }
}
class It extends st {
  /**
   * Создать метаданные для PropFromView.
   */
  constructor(s = {}) {
    super(s), this.metadataKey = Le;
    for (const r in this)
      s && r in s && (this[r] = Reflect.get(s, r));
  }
}
function _t(e) {
  const s = Object.assign({ enumerable: !1, writable: !0 }, e);
  return function(r, o) {
    if (G(r, o)) {
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
    if (H(o)) {
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
function R(e, s) {
  return G(e, s) || H(s) ? _t()(e, s) : _t(e);
}
const Ke = () => {
  var e;
  const s = globalThis;
  return !!((e = s.__MVVM_DEVTOOLS_HISTORY__) !== null && e !== void 0 ? e : s.__MVVM_DEVTOOLS_AUTO__);
}, He = (e) => Ke() ? !e || typeof e != "object" ? { collectChanges: !0 } : "collectChanges" in e ? e : Object.assign(Object.assign({}, e), { collectChanges: !0 }) : e;
function mi(e) {
  const s = (i, n) => {
    const a = new vt({ callback: e, name: String(n) }), l = z(a.metadataKey, i, new Array());
    F(a.metadataKey, [...l, a], i);
  }, r = (i) => {
    i.addInitializer(function() {
      const n = new vt({ callback: e, name: String(i.name) }), a = z(n.metadataKey, this, new Array());
      F(n.metadataKey, [...a, n], this);
    });
  };
  function o(i, n) {
    if (G(i, n)) {
      s(i, n);
      return;
    }
    if (H(n))
      return r(n), n.kind === "field" ? (a) => a : n;
  }
  return e ? ((i, n) => o(i, n)) : ((i) => i);
}
function gi(e) {
  const s = (i, n) => {
    const a = new bt({ callback: e, name: String(n) }), l = z(a.metadataKey, i, new Array());
    F(a.metadataKey, [...l, a], i);
  }, r = (i) => {
    i.addInitializer(function() {
      const n = new bt({ callback: e, name: String(i.name) }), a = z(n.metadataKey, this, new Array());
      F(n.metadataKey, [...a, n], this);
    });
  };
  function o(i, n) {
    if (G(i, n)) {
      s(i, n);
      return;
    }
    if (H(n))
      return r(n), n.kind === "field" ? (a) => a : n;
  }
  return e ? ((i, n) => o(i, n)) : ((i) => i);
}
function vi(e) {
  const s = (i, n) => {
    const a = new pt({ callback: e, name: String(n) }), l = z(a.metadataKey, i, new Array());
    F(a.metadataKey, [...l, a], i);
  }, r = (i) => {
    i.addInitializer(function() {
      const n = new pt({ callback: e, name: String(i.name) }), a = z(n.metadataKey, this, new Array());
      F(n.metadataKey, [...a, n], this);
    });
  };
  function o(i, n) {
    if (G(i, n)) {
      s(i, n);
      return;
    }
    if (H(n))
      return r(n), n.kind === "field" ? void 0 : n;
  }
  if (e)
    return ((i, n) => o(i, n));
}
function bi(e, s) {
  const r = He(G(e, s) ? void 0 : e), o = (a, l) => {
    const h = new Dt(Object.assign(Object.assign({}, r), { name: String(l), ctx: null })), _ = z(h.metadataKey, a, new Array());
    F(h.metadataKey, [..._, h], a), Object.getOwnPropertyDescriptor(a, l) || Object.defineProperty(a, l, {
      configurable: !0,
      enumerable: !0,
      get() {
        const g = this;
        if (Object.prototype.hasOwnProperty.call(g, l))
          return Reflect.get(g, l);
        const D = g.initField, S = g.initData;
        if (S && l in S && typeof D == "function")
          return D.call(g, String(l), { skipValidation: !0 }), Reflect.get(g, l);
      },
      set(g) {
        const D = this, S = D.initField, A = D.initData;
        if (A && !(l in A) && Reflect.set(A, l, g), typeof S == "function") {
          S.call(D, String(l), { skipValidation: !0 });
          return;
        }
        Object.defineProperty(this, l, { value: g, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  }, i = (a) => {
    a.addInitializer(function() {
      const l = this;
      if (typeof l.initField == "function") {
        const h = new Dt(Object.assign(Object.assign({}, r), { name: String(a.name), ctx: a })), _ = z(h.metadataKey, this, new Array());
        F(h.metadataKey, [..._, h], this), l.initField.call(this, String(a.name));
      }
    });
  };
  function n(a, l) {
    if (G(a, l)) {
      o(a, l);
      return;
    }
    if (H(l))
      return i(l), l.kind === "field" ? (h) => h : l;
  }
  return G(e, s) ? n(e, s) : r && !H(s) ? (a, l) => n(a, l) : H(s) ? n(void 0, s) : (a, l) => n(a, l);
}
function pi(e) {
  const s = (i, n) => {
    const a = new It({ name: e, originName: String(n) });
    a.name = e, a.originName = String(n);
    const l = z(a.metadataKey, i, new Array());
    F(a.metadataKey, [...l, a], i);
  }, r = (i) => {
    i.addInitializer(function() {
      const n = new It(), a = n.fields(this);
      for (const l in this)
        a instanceof Array && i.name === l && (n.name = e, n.originName = l, n.value = this[l], a.push(n));
      F(n.metadataKey, a, this);
    });
  };
  function o(i, n) {
    if (G(i, n)) {
      s(i, n);
      return;
    }
    if (H(n))
      return r(n), n.kind === "field" ? (a) => a : n;
  }
  return e ? ((i, n) => o(i, n)) : ((i) => i);
}
function Di(e, s) {
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
  function i(n, a) {
    if (!H(a)) {
      const l = n, h = r(l);
      return Object.defineProperty(h, "__mvvm_legacy_source__", { value: l, configurable: !0 }), o(l, h), h;
    }
    a.addInitializer(function() {
      mt(this);
    });
  }
  return e && !H(s) || e ? i(e, s) : i;
}
const Ye = () => {
  var e;
  return (e = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && e !== void 0 ? e : null;
}, Be = () => {
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
}, Ge = () => Be() > 0, he = (e) => ({
  data: e.service.dumpData,
  historyIndex: e.service.historyIndex
}), Ne = (e, s = {}) => {
  const r = Ye();
  if (!r)
    return () => {
    };
  const o = r.connect({ name: s.name, instanceId: s.instanceId });
  let i = !1;
  try {
    o.init(he(e));
  } catch {
  }
  const n = ye(() => he(e), (l) => {
    var h;
    if (!(i || Ge()))
      try {
        o.send({ type: (h = s.actionType) !== null && h !== void 0 ? h : "model:update" }, l);
      } catch {
      }
  }), a = o.subscribe((l) => {
    var h;
    if (l.type !== "DISPATCH")
      return;
    const _ = (h = l.payload) === null || h === void 0 ? void 0 : h.type;
    if (_ === "RESET") {
      i = !0, dt(() => {
        try {
          e.service.toInit();
        } finally {
          i = !1;
        }
      });
      return;
    }
    if (_ === "COMMIT") {
      i = !0, dt(() => {
        try {
          e.service.commit();
        } finally {
          i = !1;
        }
      });
      return;
    }
    if (_ === "ROLLBACK") {
      i = !0, dt(() => {
        try {
          e.service.toInit();
        } finally {
          i = !1;
        }
      });
      return;
    }
    if (_ === "JUMP_TO_ACTION" || _ === "JUMP_TO_STATE") {
      if (!l.state)
        return;
      try {
        const v = JSON.parse(l.state), g = v.historyIndex, D = e.service.history, S = Array.isArray(D) && D.length > 0, A = typeof g == "number" && (g === -1 && S || g >= 0 && S && g < D.length);
        i = !0, dt(() => {
          var C;
          try {
            if (A) {
              e.service.goToHistory(g);
              return;
            }
            const Y = (C = v.data) !== null && C !== void 0 ? C : v;
            J(() => {
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
    n(), typeof a == "function" && a(), typeof o.unsubscribe == "function" && o.unsubscribe(), typeof o.disconnect == "function" && o.disconnect();
  };
};
we();
const Ue = new bt(), $ = new Dt(), $e = new vt(), We = new pt();
let Ii = (() => {
  var e, s, r, o, i, n, a, l, h, _;
  let v = [], g, D = [], S = [], A, C = [], Y = [], N, nt = [], U = [], k, d = [], M = [], T, V = [], E = [], P, L = [], X = [], Q, at = [], ot = [], lt, ct = [], Mt = [], St, wt = [], kt = [], Tt, At = [], Et = [], xt, Vt = [], jt = [], Pt, Ft = [], Rt = [], zt, Ct = [], Lt = [], Kt, Ht, Yt = [], Bt = [], Gt, Nt, Ut, $t, Wt, qt, Jt, Xt, Qt, Zt, te, ee;
  return e = class {
    get initData() {
      return W(this, s, "f");
    }
    set initData(t) {
      q(this, s, t, "f");
    }
    get committedData() {
      return W(this, r, "f");
    }
    set committedData(t) {
      q(this, r, t, "f");
    }
    get modified_() {
      return W(this, o, "f");
    }
    set modified_(t) {
      q(this, o, t, "f");
    }
    get changes() {
      return W(this, i, "f");
    }
    set changes(t) {
      q(this, i, t, "f");
    }
    get inverseChanges() {
      return W(this, n, "f");
    }
    set inverseChanges(t) {
      q(this, n, t, "f");
    }
    get history() {
      return W(this, a, "f");
    }
    set history(t) {
      q(this, a, t, "f");
    }
    get historyIndex() {
      return W(this, l, "f");
    }
    set historyIndex(t) {
      q(this, l, t, "f");
    }
    /**
     * Создает модель и инициализирует данные.
     */
    constructor(t = {}, c) {
      this[h] = (p(this, v), p(this, D, !0)), s.set(this, (p(this, S), p(this, C, null))), r.set(this, (p(this, Y), p(this, nt, {}))), o.set(this, (p(this, U), p(this, d, {}))), this.draft = (p(this, M), p(this, V, null)), i.set(this, (p(this, E), p(this, L, []))), n.set(this, (p(this, X), p(this, at, []))), a.set(this, (p(this, ot), p(this, ct, []))), l.set(this, (p(this, Mt), p(this, wt, -1))), this.initializedFields = (p(this, kt), p(this, At, void 0)), this.legacyInitDone = (p(this, Et), p(this, Vt, !1)), this.rawInitData = (p(this, jt), p(this, Ft, null)), this.options = (p(this, Rt), p(this, Ct, void 0)), this.historyMuted = (p(this, Lt), p(this, Yt, !1)), this.serviceApi = (p(this, Bt), {
        loadData: (u) => this.loadData(u),
        reject: () => this.reject(),
        commit: () => this.commit(),
        commitField: (u) => this.commitField(u),
        toInit: () => this.toInit(),
        undo: () => this.undo(),
        redo: () => this.redo(),
        goToHistory: (u) => this.goToHistory(u)
      }), this.options = c, this[oe] = !0, this.init(t), this.autoAttachDevtools(), this.initLegacyFields();
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
      const u = $.fieldInstance(t, this);
      if (u) {
        t in this.initData || Reflect.set(this.initData, t, K(Reflect.get(this, t)));
        const f = K(this.initData), y = u?.factory ? u.factory(f, this) : Reflect.get(f, u.name);
        this.defineFieldValue(t, y), c?.skipValidation || this.initValidation(t), this.getInitializedFields().add(String(t));
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
      if (!c.some((O) => Object.prototype.hasOwnProperty.call(this, O.name)))
        return;
      this.legacyInitDone = !0;
      const f = this.getInitializedFields(), y = (t = this.rawInitData) !== null && t !== void 0 ? t : this.initData;
      if (y && y !== this.initData)
        try {
          this.initData = K(y);
        } catch {
          this.initData = Object.assign({}, y);
        }
      for (const O of c) {
        const b = String(O.name);
        if (y && b in y) {
          const x = $.fieldInstance(b, this);
          if (!x)
            continue;
          if (!f.has(b)) {
            const Z = K(y), rt = x.factory ? x.factory(Z, this) : Reflect.get(Z, x.name);
            this.defineFieldValue(b, rt), Reflect.set(this, b, rt), f.add(b);
          }
          continue;
        }
        f.has(b) || this.initField(b, { skipValidation: !0 });
      }
    }
    /**
     * Создать draft для отслеживания изменений.
     */
    createDraft(t) {
      const c = {};
      for (const u in t)
        $.fieldInstance(u, this) && Reflect.set(c, u, K(t[u]));
      this.draft = ke(c);
    }
    autoAttachDevtools() {
      var t, c, u, f, y, O, b, w, x, Z, rt, ht;
      const ut = globalThis;
      if (!ut.__MVVM_DEVTOOLS_AUTO__ || ((c = (t = this.options) === null || t === void 0 ? void 0 : t.devtools) === null || c === void 0 ? void 0 : c.enabled) === !1)
        return;
      const ie = (b = (y = (f = (u = this.options) === null || u === void 0 ? void 0 : u.devtools) === null || f === void 0 ? void 0 : f.name) !== null && y !== void 0 ? y : (O = this.constructor) === null || O === void 0 ? void 0 : O.name) !== null && b !== void 0 ? b : "Model", se = ((w = ut.__MVVM_DEVTOOLS_SEQ__) !== null && w !== void 0 ? w : 0) + 1;
      ut.__MVVM_DEVTOOLS_SEQ__ = se;
      const ve = (rt = (Z = (x = this.options) === null || x === void 0 ? void 0 : x.devtools) === null || Z === void 0 ? void 0 : Z.instanceId) !== null && rt !== void 0 ? rt : `${ie}#${se}`;
      ((ht = globalThis.queueMicrotask) !== null && ht !== void 0 ? ht : ((be) => Promise.resolve().then(be)))(() => Ne(this, { name: ie, instanceId: ve }));
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
      const c = new Set(t.map((u) => u.field).filter(Boolean));
      c.size !== 0 && this.withHistoryMuted(() => {
        for (const u of c) {
          const f = this.draft, y = this.initData, O = Reflect.has(f, u), b = Reflect.get(O ? f : y, u);
          let w = b;
          try {
            w = K(b);
          } catch {
            w = b;
          }
          Reflect.set(this, u, w), this.defineFieldValue(u, Reflect.get(this, u));
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
    produceDraft(t, c, u) {
      if (this.historyMuted)
        return;
      let f, y = [];
      t && (f = t.split(".")[0], f && !$.fieldInstance(f, this).collectChanges) || (Te(this.draft, (O) => {
        if (t) {
          let b = O;
          const w = t.split(".");
          if (w.length > 1)
            for (let x = 0; x < w.length && !(!(x == w.length - 1) && !ne(b)); x++)
              ne(b) && (b = b[w[x]]);
          else
            u = t;
          b && (b[u] = c);
        }
      }, (O, b) => {
        f && (O = O.map((w) => Object.assign(Object.assign({}, w), { field: f })), b = b.map((w) => Object.assign(Object.assign({}, w), { field: f }))), y = O, !(!O.length && !b.length) && (this.historyIndex < this.history.length - 1 && (this.history = this.history.slice(0, this.historyIndex + 1), this.syncChangesFromHistory()), this.changes.push(...O), this.inverseChanges.push(...b), this.history.push({ patches: O, inversePatches: b }), this.historyIndex = this.history.length - 1);
      }), y.length && le(this.draft, y));
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
    createObservable(t, c, u, f = u) {
      return t = re(t) ? t : B.box(t), new Proxy(t.get(), {
        get: (y, O, b) => {
          const w = Reflect.get(y, O, b);
          return w && typeof w == "object" && !(w instanceof e) && !re(t) ? this.createObservable(w, String(O), c, `${f}.${String(O)}`) : w;
        },
        set: (y, O, b, w) => {
          const x = Reflect.set(y, O, b, w);
          return t.set(b), this.produceDraft(f, t.get(), String(O)), this.checkChange(u, Reflect.get(this, u)), x;
        }
      });
    }
    /**
     * Определить getter/setter для поля модели.
     */
    defineFieldValue(t, c) {
      const u = $.fieldInstance(t, this);
      return c && typeof c == "object" && (c = this.createObservable(c, t, t)), c = B.box(c), Reflect.defineProperty(this, u.name, {
        get() {
          return c.get();
        },
        set: (f) => {
          J(() => c.set(f)), this.produceDraft(u.name, c.get()), this.checkChange(u.name, c.get());
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
          const c = K(t);
          this.initData = c, this.rawInitData = c;
        } catch {
          const u = Object.assign({}, t);
          this.initData = u, this.rawInitData = u;
        }
      else
        this.rawInitData = null;
    }
    /**
     * Проверить изменение поля и обновить modified_.
     */
    checkChange(t, c) {
      const u = K(c), f = K(Reflect.get(this.committedData, t)) || K(Reflect.get(this.initData, t)), y = t && t in this.initData && !ae(f, u);
      return J(() => {
        y && Reflect.set(this.modified_, t, K(f) || f);
        for (const O in this.modified_)
          t === O && t in this.modified_ && ae(f, u) && delete this.modified_[O];
      }), y;
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
          const c = this.historyIndex + 1, u = this.history[c];
          this.historyIndex = c, this.applyHistoryPatches(u.patches);
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
      const t = /* @__PURE__ */ Object.create({}), c = (f) => {
        const y = Ue.fieldInstance(f, this);
        return y?.callback ? y.callback(Reflect.get(this, f), this) : Reflect.get(this, f);
      }, u = (f) => {
        const y = We.fieldInstance(f, this);
        if (y)
          switch (typeof y.callback) {
            case "boolean":
              return !!y.callback;
            case "function":
              return y.callback(Reflect.get(this, f), this);
          }
        return !1;
      };
      $.fields(this).forEach((f) => {
        var y;
        if (f.name in this)
          return !((y = this.options) === null || y === void 0) && y.byFields && !this.options.byFields.includes(f.name) || u(f.name) ? void 0 : Reflect.set(t, f.name, c(f.name));
      });
      try {
        return K(t);
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
        const u = $e.fieldInstance(c, this);
        u && Reflect.set(t, c, u.callback(this[c], this) || "");
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
  }, s = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), i = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), a = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), g = [R], h = pe(oe), (() => {
    const I = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    A = [B, R], N = [B, R], k = [B, R], T = [R], P = [B, R], Q = [B, R], lt = [B, R], St = [B, R], Tt = [R], xt = [R], Pt = [R], zt = [R], Kt = [j], Ht = [R], Gt = [j], Nt = [et], Ut = [j], $t = [j], Wt = [j], qt = [j], Jt = [j], Xt = [j], Qt = [j], Zt = [et], te = [et], ee = [(_ = et).struct.bind(_)], m(e, null, A, { kind: "accessor", name: "initData", static: !1, private: !1, access: { has: (t) => "initData" in t, get: (t) => t.initData, set: (t, c) => {
      t.initData = c;
    } }, metadata: I }, C, Y), m(e, null, N, { kind: "accessor", name: "committedData", static: !1, private: !1, access: { has: (t) => "committedData" in t, get: (t) => t.committedData, set: (t, c) => {
      t.committedData = c;
    } }, metadata: I }, nt, U), m(e, null, k, { kind: "accessor", name: "modified_", static: !1, private: !1, access: { has: (t) => "modified_" in t, get: (t) => t.modified_, set: (t, c) => {
      t.modified_ = c;
    } }, metadata: I }, d, M), m(e, null, P, { kind: "accessor", name: "changes", static: !1, private: !1, access: { has: (t) => "changes" in t, get: (t) => t.changes, set: (t, c) => {
      t.changes = c;
    } }, metadata: I }, L, X), m(e, null, Q, { kind: "accessor", name: "inverseChanges", static: !1, private: !1, access: { has: (t) => "inverseChanges" in t, get: (t) => t.inverseChanges, set: (t, c) => {
      t.inverseChanges = c;
    } }, metadata: I }, at, ot), m(e, null, lt, { kind: "accessor", name: "history", static: !1, private: !1, access: { has: (t) => "history" in t, get: (t) => t.history, set: (t, c) => {
      t.history = c;
    } }, metadata: I }, ct, Mt), m(e, null, St, { kind: "accessor", name: "historyIndex", static: !1, private: !1, access: { has: (t) => "historyIndex" in t, get: (t) => t.historyIndex, set: (t, c) => {
      t.historyIndex = c;
    } }, metadata: I }, wt, kt), m(e, null, Kt, { kind: "method", name: "resetToDefault", static: !1, private: !1, access: { has: (t) => "resetToDefault" in t, get: (t) => t.resetToDefault }, metadata: I }, null, v), m(e, null, Gt, { kind: "method", name: "produceDraft", static: !1, private: !1, access: { has: (t) => "produceDraft" in t, get: (t) => t.produceDraft }, metadata: I }, null, v), m(e, null, Nt, { kind: "getter", name: "dirty", static: !1, private: !1, access: { has: (t) => "dirty" in t, get: (t) => t.dirty }, metadata: I }, null, v), m(e, null, Ut, { kind: "method", name: "commit", static: !1, private: !1, access: { has: (t) => "commit" in t, get: (t) => t.commit }, metadata: I }, null, v), m(e, null, $t, { kind: "method", name: "commitField", static: !1, private: !1, access: { has: (t) => "commitField" in t, get: (t) => t.commitField }, metadata: I }, null, v), m(e, null, Wt, { kind: "method", name: "reject", static: !1, private: !1, access: { has: (t) => "reject" in t, get: (t) => t.reject }, metadata: I }, null, v), m(e, null, qt, { kind: "method", name: "toInit", static: !1, private: !1, access: { has: (t) => "toInit" in t, get: (t) => t.toInit }, metadata: I }, null, v), m(e, null, Jt, { kind: "method", name: "undo", static: !1, private: !1, access: { has: (t) => "undo" in t, get: (t) => t.undo }, metadata: I }, null, v), m(e, null, Xt, { kind: "method", name: "redo", static: !1, private: !1, access: { has: (t) => "redo" in t, get: (t) => t.redo }, metadata: I }, null, v), m(e, null, Qt, { kind: "method", name: "goToHistory", static: !1, private: !1, access: { has: (t) => "goToHistory" in t, get: (t) => t.goToHistory }, metadata: I }, null, v), m(e, null, Zt, { kind: "getter", name: "validation", static: !1, private: !1, access: { has: (t) => "validation" in t, get: (t) => t.validation }, metadata: I }, null, v), m(e, null, te, { kind: "getter", name: "validAndDirty", static: !1, private: !1, access: { has: (t) => "validAndDirty" in t, get: (t) => t.validAndDirty }, metadata: I }, null, v), m(e, null, ee, { kind: "getter", name: "service", static: !1, private: !1, access: { has: (t) => "service" in t, get: (t) => t.service }, metadata: I }, null, v), m(null, null, g, { kind: "field", name: h, static: !1, private: !1, access: { has: (t) => h in t, get: (t) => t[h], set: (t, c) => {
      t[h] = c;
    } }, metadata: I }, D, S), m(null, null, T, { kind: "field", name: "draft", static: !1, private: !1, access: { has: (t) => "draft" in t, get: (t) => t.draft, set: (t, c) => {
      t.draft = c;
    } }, metadata: I }, V, E), m(null, null, Tt, { kind: "field", name: "initializedFields", static: !1, private: !1, access: { has: (t) => "initializedFields" in t, get: (t) => t.initializedFields, set: (t, c) => {
      t.initializedFields = c;
    } }, metadata: I }, At, Et), m(null, null, xt, { kind: "field", name: "legacyInitDone", static: !1, private: !1, access: { has: (t) => "legacyInitDone" in t, get: (t) => t.legacyInitDone, set: (t, c) => {
      t.legacyInitDone = c;
    } }, metadata: I }, Vt, jt), m(null, null, Pt, { kind: "field", name: "rawInitData", static: !1, private: !1, access: { has: (t) => "rawInitData" in t, get: (t) => t.rawInitData, set: (t, c) => {
      t.rawInitData = c;
    } }, metadata: I }, Ft, Rt), m(null, null, zt, { kind: "field", name: "options", static: !1, private: !1, access: { has: (t) => "options" in t, get: (t) => t.options, set: (t, c) => {
      t.options = c;
    } }, metadata: I }, Ct, Lt), m(null, null, Ht, { kind: "field", name: "historyMuted", static: !1, private: !1, access: { has: (t) => "historyMuted" in t, get: (t) => t.historyMuted, set: (t, c) => {
      t.historyMuted = c;
    } }, metadata: I }, Yt, Bt), I && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: I });
  })(), e;
})();
const ge = /* @__PURE__ */ Symbol("store-key"), qe = () => {
  var e;
  return (e = globalThis.__REDUX_DEVTOOLS_EXTENSION__) !== null && e !== void 0 ? e : null;
}, Je = () => {
  var e;
  return (e = globalThis.__MVVM_DEVTOOLS_APPLYING__) !== null && e !== void 0 ? e : 0;
}, Xe = (e) => {
  var s, r;
  const o = globalThis;
  o.__MVVM_DEVTOOLS_APPLYING__ = ((s = o.__MVVM_DEVTOOLS_APPLYING__) !== null && s !== void 0 ? s : 0) + 1;
  try {
    return e();
  } finally {
    o.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, ((r = o.__MVVM_DEVTOOLS_APPLYING__) !== null && r !== void 0 ? r : 1) - 1);
  }
}, Qe = () => Je() > 0, Ot = (e) => ({
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
  const i = qe();
  if (!i)
    return () => {
    };
  const n = i.connect({ name: s.name, instanceId: s.instanceId });
  let a = !1, l = (o = (r = e.items[0]) === null || r === void 0 ? void 0 : r.constructor) !== null && o !== void 0 ? o : null;
  try {
    n.init(Ot(e));
  } catch {
  }
  const h = ye(() => Ot(e), (g) => {
    var D;
    if (a || Qe())
      return;
    const S = (D = e.items[0]) === null || D === void 0 ? void 0 : D.constructor;
    S && (l = S);
    try {
      n.send({ type: "store:update" }, g);
    } catch {
    }
  }), _ = (g) => (a = !0, Xe(() => {
    try {
      return g();
    } finally {
      a = !1;
    }
  })), v = n.subscribe((g) => {
    var D;
    if (g.type !== "DISPATCH")
      return;
    const S = (D = g.payload) === null || D === void 0 ? void 0 : D.type;
    if (S === "RESET" || S === "ROLLBACK") {
      _(() => e.reset());
      return;
    }
    if (S === "JUMP_TO_ACTION" || S === "JUMP_TO_STATE") {
      const A = ti(g.state);
      if (!A)
        return;
      _(() => {
        var C, Y, N;
        if (A.items.length === e.items.length && e.items.every((M) => {
          var T, V;
          return typeof ((T = M?.service) === null || T === void 0 ? void 0 : T.goToHistory) == "function" || typeof ((V = M?.service) === null || V === void 0 ? void 0 : V.loadData) == "function";
        })) {
          J(() => {
            A.items.forEach((M, T) => {
              var V;
              const E = (V = e.items[T]) === null || V === void 0 ? void 0 : V.service, P = M.historyIndex, L = E?.history;
              if (Array.isArray(L) && L.length > 0 && typeof P == "number" && typeof E?.goToHistory == "function" && (P === -1 && L.length > 0 || P < L.length)) {
                E.goToHistory(P);
                return;
              }
              typeof E?.loadData == "function" && E.loadData(M.data);
            });
          });
          return;
        }
        const U = (Y = (C = e.items[0]) === null || C === void 0 ? void 0 : C.constructor) !== null && Y !== void 0 ? Y : l, k = A.items.map((M) => M.data);
        if (U) {
          e.applyLoaded(k, { model: U, cash: !1 }), l = U;
          return;
        }
        e.applyLoaded(k, { cash: !1 });
        const d = (N = e.items[0]) === null || N === void 0 ? void 0 : N.constructor;
        d && (l = d);
      });
    }
  });
  return () => {
    h(), typeof v == "function" && v(), typeof n.unsubscribe == "function" && n.unsubscribe(), typeof n.disconnect == "function" && n.disconnect();
  };
};
let Mi = (() => {
  var e, s, r;
  let o = [], i, n = [], a = [], l, h = [], _ = [], v, g, D, S, A, C, Y, N, nt, U;
  return e = class {
    get items() {
      return W(this, s, "f");
    }
    set items(d) {
      q(this, s, d, "f");
    }
    get _cash() {
      return W(this, r, "f");
    }
    set _cash(d) {
      q(this, r, d, "f");
    }
    constructor() {
      s.set(this, (p(this, o), p(this, n, []))), r.set(this, (p(this, a), p(this, h, []))), p(this, _), mt(this), this.autoAttachDevtools();
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
      return this.items.find((T) => T?.[d] === M);
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
    applyLoaded(d, M = {}) {
      const { model: T, mode: V = "replace", cash: E = !0 } = M;
      if (E && this.setCash(d), V === "append") {
        const P = T ? d.map((L) => new T(L)) : d;
        this.addMany(P);
        return;
      }
      this.items = T ? d.map((P) => new T(P)) : d;
    }
    /**
     * Сохранить оригинальные данные стора.
     */
    setCash(d) {
      this._cash = d ?? [];
    }
    autoAttachDevtools() {
      var d, M, T, V, E, P, L, X;
      const Q = globalThis;
      if (!Q.__MVVM_DEVTOOLS_AUTO__)
        return;
      const at = z(ge, this.constructor, {}) || {};
      if (((d = at.devtools) === null || d === void 0 ? void 0 : d.enabled) === !1)
        return;
      const ot = (E = (T = (M = at.devtools) === null || M === void 0 ? void 0 : M.name) !== null && T !== void 0 ? T : (V = this.constructor) === null || V === void 0 ? void 0 : V.name) !== null && E !== void 0 ? E : "Store", lt = ((P = Q.__MVVM_DEVTOOLS_STORE_SEQ__) !== null && P !== void 0 ? P : 0) + 1;
      Q.__MVVM_DEVTOOLS_STORE_SEQ__ = lt;
      const ct = (X = (L = at.devtools) === null || L === void 0 ? void 0 : L.instanceId) !== null && X !== void 0 ? X : `${ot}#${lt}`;
      ei(this, { name: ot, instanceId: ct });
    }
  }, s = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), (() => {
    const k = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    i = [B], l = [B], v = [j], g = [j], D = [j], S = [j], A = [et], C = [et], Y = [et], N = [j], nt = [j], U = [j], m(e, null, i, { kind: "accessor", name: "items", static: !1, private: !1, access: { has: (d) => "items" in d, get: (d) => d.items, set: (d, M) => {
      d.items = M;
    } }, metadata: k }, n, a), m(e, null, l, { kind: "accessor", name: "_cash", static: !1, private: !1, access: { has: (d) => "_cash" in d, get: (d) => d._cash, set: (d, M) => {
      d._cash = M;
    } }, metadata: k }, h, _), m(e, null, v, { kind: "method", name: "add", static: !1, private: !1, access: { has: (d) => "add" in d, get: (d) => d.add }, metadata: k }, null, o), m(e, null, g, { kind: "method", name: "addMany", static: !1, private: !1, access: { has: (d) => "addMany" in d, get: (d) => d.addMany }, metadata: k }, null, o), m(e, null, D, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (d) => "remove" in d, get: (d) => d.remove }, metadata: k }, null, o), m(e, null, S, { kind: "method", name: "clear", static: !1, private: !1, access: { has: (d) => "clear" in d, get: (d) => d.clear }, metadata: k }, null, o), m(e, null, A, { kind: "getter", name: "size", static: !1, private: !1, access: { has: (d) => "size" in d, get: (d) => d.size }, metadata: k }, null, o), m(e, null, C, { kind: "getter", name: "snapshot", static: !1, private: !1, access: { has: (d) => "snapshot" in d, get: (d) => d.snapshot }, metadata: k }, null, o), m(e, null, Y, { kind: "getter", name: "cash", static: !1, private: !1, access: { has: (d) => "cash" in d, get: (d) => d.cash }, metadata: k }, null, o), m(e, null, N, { kind: "method", name: "reset", static: !1, private: !1, access: { has: (d) => "reset" in d, get: (d) => d.reset }, metadata: k }, null, o), m(e, null, nt, { kind: "method", name: "applyLoaded", static: !1, private: !1, access: { has: (d) => "applyLoaded" in d, get: (d) => d.applyLoaded }, metadata: k }, null, o), m(e, null, U, { kind: "method", name: "setCash", static: !1, private: !1, access: { has: (d) => "setCash" in d, get: (d) => d.setCash }, metadata: k }, null, o), k && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: k });
  })(), e;
})();
function wi(e) {
  return it(e, "instance");
}
function ki(e) {
  return ((s, r) => Pe(e)(s, r));
}
function Ti(e, s) {
  const r = (o, i) => {
    var n;
    const a = typeof e == "string" ? { id: e } : typeof e == "object" ? e : { id: (n = i?.name) !== null && n !== void 0 ? n : o?.name };
    F(ge, a, o), me(a)(o, i);
  };
  return typeof e == "function" ? r(e, s) : (o, i) => r(o, i);
}
class Ai {
}
const yt = new It();
function Ei(e, s) {
  return Ae((r = {}) => {
    const { resolved: o, instance: i } = Ee(() => {
      const a = it(e) || (typeof e != "string" ? { instance: new e() } : void 0), l = a?.instance;
      return { resolved: a, instance: l };
    }, [e]);
    if (xe(() => {
      if (i)
        return typeof i.onInit == "function" && i.onInit(), () => {
          typeof i.onDispose == "function" && i.onDispose();
        };
    }, [i]), o) {
      const n = yt.fields(i), a = n.length > 0 ? n : yt.fields(Object.getPrototypeOf(i));
      for (const l in r)
        if (a instanceof Array) {
          const h = a.find((_) => _.name === l);
          h && Reflect.set(i, h.originName, Reflect.get(r, l));
        }
      return F(yt.metadataKey, a, i), s(Object.assign({ viewModel: i }, r));
    }
    return s(Object.assign({}, r));
  });
}
const ue = {
  load: "load",
  failure: "failure",
  ready: "ready"
}, ii = {
  load: "load",
  failure: "failure",
  ready: "ready"
}, fe = () => {
};
class si {
  constructor(s, r) {
    var o, i, n, a, l, h;
    this.isExecuting = !1, this.error = null, this.controllers = /* @__PURE__ */ new Set(), this.runningCount = 0, this.runningPromise = null, this.queueTail = Promise.resolve(), this.disposed = !1, this.fn = s, this.opt = Object.assign({ concurrency: (o = r?.concurrency) !== null && o !== void 0 ? o : "ignore", trackError: (i = r?.trackError) !== null && i !== void 0 ? i : !0, swallowError: (n = r?.swallowError) !== null && n !== void 0 ? n : !0, abortable: (a = r?.abortable) !== null && a !== void 0 ? a : !1 }, r), this.states = Object.assign(Object.assign({}, ue), (l = r?.states) !== null && l !== void 0 ? l : {}), this.stateKeys = Object.assign(Object.assign({}, ii), (h = r?.stateKeys) !== null && h !== void 0 ? h : {}), Se(this, {
      fn: !1,
      opt: !1,
      states: !1,
      stateKeys: !1,
      resolveState: !1,
      getScope: !1,
      controllers: !1,
      runningCount: !1,
      runningPromise: !1,
      queueTail: !1,
      disposed: !1
    }, { autoBind: !0 });
  }
  get canExecute() {
    return this.disposed || !(this.opt.canExecute ? this.opt.canExecute(this.getScope()) : !0) ? !1 : this.opt.concurrency === "ignore" ? !this.isExecuting : !0;
  }
  resolveState(s) {
    var r, o;
    const i = (r = this.stateKeys[s]) !== null && r !== void 0 ? r : s;
    return (o = this.states[i]) !== null && o !== void 0 ? o : ue[s];
  }
  getScope() {
    return {
      state: this.state,
      states: this.states,
      isExecuting: this.isExecuting,
      error: this.error
    };
  }
  get state() {
    return this.isExecuting ? this.resolveState("load") : this.error ? this.resolveState("failure") : this.resolveState("ready");
  }
  resetError() {
    this.error = null;
  }
  cancel() {
    var s, r;
    (r = (s = this.opt).onCancel) === null || r === void 0 || r.call(s);
    for (const o of this.controllers)
      o.abort();
  }
  dispose() {
    this.disposed = !0, this.cancel();
  }
  execute(...s) {
    var r;
    if (this.disposed)
      return Promise.resolve(void 0);
    if (!this.canExecute)
      return (r = this.runningPromise) !== null && r !== void 0 ? r : Promise.resolve(void 0);
    const o = (n) => {
      this.runningPromise = n;
      const a = () => {
        this.runningPromise === n && (this.runningPromise = null);
      };
      return n.then(a, a), n;
    }, i = () => _e(this, void 0, void 0, function* () {
      var n, a;
      if (this.disposed)
        return;
      const l = this.opt.abortable ? new AbortController() : null;
      l && this.controllers.add(l), J(() => {
        this.runningCount += 1, this.isExecuting = this.runningCount > 0, this.opt.trackError && (this.error = null);
      });
      let h = null;
      try {
        const _ = this.opt.abortable ? l.signal : void 0;
        return h = this.fn(...s, _), yield h;
      } catch (_) {
        if (this.opt.abortable && l?.signal.aborted)
          return;
        if (this.opt.trackError && J(() => {
          this.error = _;
        }), (a = (n = this.opt).onError) === null || a === void 0 || a.call(n, _), !this.opt.swallowError)
          throw _;
        return;
      } finally {
        J(() => {
          this.runningCount = Math.max(0, this.runningCount - 1), this.isExecuting = this.runningCount > 0;
        }), l && this.controllers.delete(l);
      }
    });
    switch (this.opt.concurrency) {
      case "parallel":
        return o(i());
      case "restart":
        return this.cancel(), o(i());
      case "queue": {
        const n = this.queueTail.then(i, i);
        return this.queueTail = n.then(fe, fe), o(n);
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
    const h = () => {
      o.delete(l);
    };
    return l.then(h, h), new Promise((_, v) => {
      l.then(_, (g) => {
        if (Me(g)) {
          _(void 0);
          return;
        }
        v(g);
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
  it as GetService,
  wi as GetStore,
  Pe as Inject,
  ki as InjectStore,
  Di as MakeObservable,
  Ii as Model,
  pi as PropFromView,
  me as Service,
  yi as SetService,
  Ti as Store,
  Mi as StoreBase,
  _i as TODO,
  Ai as ViewModel,
  ni as asyncCommand,
  Ne as attachModelDevtools,
  ei as attachStoreDevtools,
  Vi as commandAction,
  F as defineMetadata,
  R as define_prop,
  vi as exclude,
  bi as field,
  xi as flowCommand,
  Ve as getExecutingFunctionNameByStack,
  z as getOwnMetadata,
  fi as isSerializable,
  gi as submit,
  mi as validation,
  Ei as view
};
//# sourceMappingURL=index.js.map
