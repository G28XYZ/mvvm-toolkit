import "reflect-metadata";
import { d as re, _ as x, a as T, b as q, c as w } from "./tslib.es6-B_Omq7a0.js";
import Se, { isEqual as ge, isEmpty as Re } from "lodash";
import { makeObservable as oe, observable as H, isObservable as ve, runInAction as Y, computed as Q, action as V, flow as je, isFlowCancellationError as De, makeAutoObservable as Ee } from "mobx";
import { observer as Pe } from "mobx-react";
import { useMemo as Fe, useEffect as Ce } from "react";
const P = (t, e, n) => Reflect.getOwnMetadata(t, e) || n || {}, j = (t, e, n) => Reflect.defineMetadata(t, e, n);
function st(...t) {
  try {
    return JSON.stringify(t), !0;
  } catch {
    return !1;
  }
}
function Ae(t) {
  if (t && typeof t == "string") {
    let [e] = t.split(`
`)[2].replace(/at (get)?/, "").match(/.*/g) || [];
    return e && (e = e.trim()), e;
  }
}
const ye = {}, ne = [];
let be = !1;
const at = (t, ...e) => {
  const n = new Error().stack;
  if (!be)
    console.log("%c TODO", "background: #222; color: #bada55", ye), be = !0;
  else {
    const i = Ae(n);
    ne.includes(i) === !1 && (ne.push(i), Reflect.set(ye, `${ne.length}) ${t}`, { msg: e, get path() {
      return console.info(e, i), i;
    } }));
  }
  function o(...i) {
  }
  return o;
}, K = (t, e) => !!t && (typeof e == "string" || typeof e == "symbol"), E = (t) => !!t && typeof t == "object" && "kind" in t, Ie = (t) => ({
  kind: "class",
  name: t,
  addInitializer: () => {
  },
  metadata: {}
}), B = /* @__PURE__ */ Symbol("service-key"), ce = new Proxy({}, Reflect);
function xe(t) {
  const e = (o, i) => {
    Object.defineProperty(o, i, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, i))
          return Reflect.get(this, i);
        const s = U(t, "instance");
        if (s)
          return Object.defineProperty(this, i, { value: s, writable: !0, configurable: !0, enumerable: !0 }), s;
      },
      set(s) {
        const r = U(t, "instance");
        Object.defineProperty(this, i, { value: r ?? s, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  };
  function n(o, i) {
    if (K(o, i)) {
      e(o, i);
      return;
    }
    return i.addInitializer(function() {
      return re(this, void 0, void 0, function* () {
        const s = U(t, "instance");
        s && Object.hasOwn(this, i.name) && Reflect.set(this, i.name, s);
      });
    }), (s) => s;
  }
  return n;
}
function U(t, e) {
  var n;
  const o = P(B, ce);
  if (typeof t != "string") {
    const i = P(B, t);
    if (i)
      return e && e in i ? i[e] : i;
    for (const s in o) {
      const r = o[s];
      if (r.target === t) {
        t = r.context.name;
        break;
      }
    }
  }
  if (typeof t == "string")
    return e ? (n = o[t]) === null || n === void 0 ? void 0 : n[e] : o[t];
}
function ke(t, e) {
  const n = (i, s) => {
    const r = String(typeof t == "string" && t || typeof t == "object" && t?.id || s?.name || i?.name), c = P(B, ce), d = new Proxy({
      target: i,
      instance: typeof t == "object" && Reflect.get(t, "transient") || typeof t == "object" && Reflect.get(t, "lazy") ? i : new i(),
      context: s,
      options: t
    }, {
      get(u, g, b) {
        var k, _;
        if (g === "instance" && (!((k = u?.options) === null || k === void 0) && k.transient))
          return new i();
        if (g === "instance" && (!((_ = u?.options) === null || _ === void 0) && _.lazy) && u.instance === i) {
          const F = new i();
          return Reflect.set(u, g, F, b), F;
        }
        return Reflect.get(u, g, b);
      },
      set(u, g, b, k) {
        return Reflect.set(u, g, b, k);
      }
    });
    c[r] = d, j(B, c, ce), j(B, c[r], i);
  };
  function o(i, s) {
    var r, c;
    const d = i.__legacy_source__, u = E(s) ? s : Ie((c = (r = d?.name) !== null && r !== void 0 ? r : i?.name) !== null && c !== void 0 ? c : "");
    n(i, u), d && d !== i && j(B, P(B, i), d);
  }
  return Se.isFunction(t) ? o(t, e) : t ? (i, s) => o(i, s) : o;
}
const rt = (t, e) => {
  const { kind: n = "class", name: o = "", addInitializer: i = () => {
  }, metadata: s } = e?.ctx || {};
  return ke(e)(t, {
    kind: n,
    name: o,
    addInitializer: i,
    metadata: s
  }), U(t).instance;
};
function se(t) {
  var e, n, o;
  const i = Object.assign({ enumerable: !1, writable: !0 }, t), s = Object.assign({ configurable: !0, enumerable: !1, writable: !0 }, t), r = {
    configurable: (e = s.configurable) !== null && e !== void 0 ? e : !0,
    enumerable: (n = s.enumerable) !== null && n !== void 0 ? n : !1,
    writable: (o = s.writable) !== null && o !== void 0 ? o : !0,
    value: void 0
  };
  return function(c, d) {
    if (K(c, d)) {
      Object.defineProperty(c, d, {
        configurable: !0,
        enumerable: i.enumerable,
        get() {
        },
        set(u) {
          r.value = u, Object.defineProperty(this, d, r), r.value = void 0;
        }
      });
      return;
    }
    if (E(d)) {
      const u = d;
      return u.kind === "field" ? function(g) {
        return r.value = g, Object.defineProperty(this, u.name, r), r.value = void 0, g;
      } : (u.addInitializer(function() {
        const g = Object.getOwnPropertyDescriptor(this, u.name);
        g && Object.defineProperty(this, u.name, Object.assign(Object.assign({}, g), { enumerable: i.enumerable }));
      }), c);
    }
  };
}
function ot(t, e) {
  return K(t, e) || E(e) ? se()(t, e) : se(t);
}
function ct(t, e) {
  const n = (s) => class extends s {
    constructor(...r) {
      super(...r), oe(this);
    }
  }, o = (s, r) => {
    if (typeof Reflect?.getOwnMetadataKeys == "function")
      for (const c of Reflect.getOwnMetadataKeys(s)) {
        const d = Reflect.getOwnMetadata(c, s);
        Reflect.defineMetadata(c, d, r);
      }
  };
  function i(s, r) {
    if (!E(r)) {
      const c = s, d = n(c);
      return Object.defineProperty(d, "__legacy_source__", { value: c, configurable: !0 }), o(c, d), d;
    }
    r.addInitializer(function() {
      oe(this);
    });
  }
  return t && !E(e) || t ? i(t, e) : i;
}
const W = /* @__PURE__ */ Symbol("field-key"), N = /* @__PURE__ */ Symbol("validation-key"), J = /* @__PURE__ */ Symbol("submit-key"), X = /* @__PURE__ */ Symbol("exclude-key"), Te = /* @__PURE__ */ Symbol("prop-from-view-key");
class $ {
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
    const n = [], o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
    let s = e;
    for (; s; ) {
      const c = Reflect.getOwnMetadata(this.metadataKey, s);
      if (Array.isArray(c))
        for (const d of c) {
          const u = d?.name, g = String(u);
          i.has(g) || (i.add(g), n.push(d), o.set(g, d));
        }
      s = Object.getPrototypeOf(s);
    }
    return { ownRef: Reflect.getOwnMetadata(this.metadataKey, e), list: n, map: o };
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
    return e instanceof $ || Object.getOwnPropertyNames(this).some((n) => Object.keys(e).includes(n));
  }
  /**
   * Получить метаданные конкретного поля модели.
   */
  fieldInstance(e, n) {
    const o = n && typeof n == "object" ? Reflect.getOwnMetadata(this.metadataKey, n) : void 0;
    if (Array.isArray(o))
      return o.find((c) => c.name === e);
    const i = this.getCacheTarget(n);
    if (!i)
      return;
    const s = Reflect.getOwnMetadata(this.metadataKey, i), r = this.cache.get(i);
    if (!r || r.ownRef !== s) {
      const c = this.computeFromPrototype(i);
      return this.cache.set(i, c), c.map.get(String(e));
    }
    return r.map.get(String(e));
  }
  /**
   * Получить массив метаданных полей модели.
   */
  fields(e) {
    const n = e && typeof e == "object" ? Reflect.getOwnMetadata(this.metadataKey, e) : void 0;
    if (Array.isArray(n)) {
      const c = [], d = /* @__PURE__ */ new Set();
      let u = e;
      for (; u; ) {
        const g = Reflect.getOwnMetadata(this.metadataKey, u);
        if (Array.isArray(g))
          for (const b of g) {
            const k = b?.name, _ = String(k);
            d.has(_) || (d.add(_), c.push(b));
          }
        u = Object.getPrototypeOf(u);
      }
      return c;
    }
    const o = this.getCacheTarget(e);
    if (!o)
      return [];
    const i = Reflect.getOwnMetadata(this.metadataKey, o), s = this.cache.get(o);
    if (s && s.ownRef === i)
      return s.list;
    const r = this.computeFromPrototype(o);
    return this.cache.set(o, r), r.list;
  }
}
class le extends $ {
  constructor() {
    super(...arguments), this.metadataKey = N;
  }
}
class de extends $ {
  constructor() {
    super(...arguments), this.metadataKey = J;
  }
}
class ue extends $ {
  constructor() {
    super(...arguments), this.metadataKey = X;
  }
}
class fe extends $ {
  /**
   * Создать метаданные поля модели.
   */
  constructor(e = {}) {
    super(e), this.factory = null, this.mapping = null, this.noObserve = null, this.collectChanges = !1, this.name = null, this.ctx = null, this.metadataKey = W, this.isInit = !1, this.factory = e.factory, this.mapping = e.mapping, this.noObserve = e.noObserve, this.name = e.name, this.ctx = e.ctx, this.collectChanges = !!e.collectChanges;
  }
}
class he extends $ {
  /**
   * Создать метаданные для PropFromView.
   */
  constructor(e = {}) {
    super(e), this.metadataKey = Te;
    for (const n in this)
      e && n in e && (this[n] = Reflect.get(e, n));
  }
}
function lt(t) {
  const e = (i, s) => {
    const r = new he({ name: t, originName: String(s) });
    r.name = t, r.originName = String(s);
    const c = P(r.metadataKey, i, new Array());
    j(r.metadataKey, [...c, r], i);
  }, n = (i) => {
    i.addInitializer(function() {
      const s = new he(), r = s.fields(this);
      for (const c in this)
        r instanceof Array && i.name === c && (s.name = t, s.originName = c, s.value = this[c], r.push(s));
      j(s.metadataKey, r, this);
    });
  };
  function o(i, s) {
    if (K(i, s)) {
      e(i, s);
      return;
    }
    if (E(s))
      return n(s), s.kind === "field" ? (r) => r : s;
  }
  return t ? ((i, s) => o(i, s)) : ((i) => i);
}
const _e = /* @__PURE__ */ new WeakMap(), Ve = (t, e) => {
  if (!t)
    return;
  let n = _e.get(t);
  n || (n = /* @__PURE__ */ new Set(), _e.set(t, n));
  const o = String(e.name);
  if (n.has(o))
    return;
  const i = P(e.metadataKey, t, new Array());
  i.some((s) => s.name === o) || j(e.metadataKey, [...i, e], t), n.add(o);
};
function dt(t) {
  const e = (i, s) => {
    const r = new ue({ callback: t, name: String(s) }), c = P(r.metadataKey, i, new Array());
    j(r.metadataKey, [...c, r], i);
  }, n = (i) => {
    i.addInitializer(function() {
      const s = new ue({ callback: t, name: String(i.name) });
      Ve(Object.getPrototypeOf(this), s);
    });
  };
  function o(i, s) {
    if (K(i, s)) {
      e(i, s);
      return;
    }
    if (E(s))
      return n(s), s.kind === "field" ? void 0 : s;
  }
  if (t)
    return ((i, s) => o(i, s));
}
const Ke = new de(), ze = new fe(), Le = new le(), qe = new ue();
let We = (() => {
  var t, e, n, o, i, s, r, c, d, u, g, b, k, _, F;
  let S = [], D, z = [], L = [], C, p, l, A, I, Z, ee, G;
  return t = class {
    get initData() {
      return x(this, e, "f");
    }
    set initData(a) {
      T(this, e, a, "f");
    }
    // @define_prop
    get committedData() {
      return x(this, n, "f");
    }
    set committedData(a) {
      T(this, n, a, "f");
    }
    // @define_prop
    get modified_() {
      return x(this, o, "f");
    }
    set modified_(a) {
      T(this, o, a, "f");
    }
    // @define_prop
    get legacyInitDone() {
      return x(this, i, "f");
    }
    set legacyInitDone(a) {
      T(this, i, a, "f");
    }
    // @define_prop
    get options() {
      return x(this, s, "f");
    }
    set options(a) {
      T(this, s, a, "f");
    }
    get [(e = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), i = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap(), d = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap(), g = (D = [H], W))]() {
      return x(this, r, "f");
    }
    set [g](a) {
      T(this, r, a, "f");
    }
    get [b = J]() {
      return x(this, c, "f");
    }
    set [b](a) {
      T(this, c, a, "f");
    }
    get [k = X]() {
      return x(this, d, "f");
    }
    set [k](a) {
      T(this, d, a, "f");
    }
    get [_ = N]() {
      return x(this, u, "f");
    }
    set [_](a) {
      T(this, u, a, "f");
    }
    /**
     * Создает модель и инициализирует данные.
     */
    constructor(a = {}, f) {
      e.set(this, (q(this, S), q(this, z, null))), n.set(this, (q(this, L), {})), o.set(this, {}), i.set(this, !1), s.set(this, {}), r.set(this, void 0), c.set(this, void 0), d.set(this, void 0), u.set(this, void 0), this.options = f, this.init(a), this.initLegacyFields();
    }
    getFieldMetaCache() {
      const a = Reflect.getOwnMetadata(W, this), f = Object.getPrototypeOf(this), h = f ? Reflect.getOwnMetadata(W, f) : null, m = this[W];
      if (m && m !== !0 && m.ownRef === a && m.protoRef === h)
        return m;
      const O = ze.fields(this), v = /* @__PURE__ */ new Map();
      for (const y of O)
        v.set(String(y.name), y);
      return this[W] = { ownRef: a, protoRef: h, list: O, map: v }, this[W];
    }
    getFieldMeta(a) {
      return this.getFieldMetaCache().map.get(String(a));
    }
    getSubmitMetaCache() {
      const a = Reflect.getOwnMetadata(J, this), f = Object.getPrototypeOf(this), h = f ? Reflect.getOwnMetadata(J, f) : null, m = this[J];
      if (m && m !== !0 && m.ownRef === a && m.protoRef === h)
        return m;
      const O = Ke.fields(this), v = /* @__PURE__ */ new Map();
      for (const M of O)
        v.set(String(M.name), M);
      const y = { ownRef: a, protoRef: h, list: O, map: v };
      return this[J] = y, y;
    }
    getExcludeMetaCache() {
      const a = Reflect.getOwnMetadata(X, this), f = Object.getPrototypeOf(this), h = f ? Reflect.getOwnMetadata(X, f) : null, m = this[X];
      if (m && m !== !0 && m.ownRef === a && m.protoRef === h)
        return m;
      const O = qe.fields(this), v = /* @__PURE__ */ new Map();
      for (const M of O)
        v.set(String(M.name), M);
      const y = { ownRef: a, protoRef: h, list: O, map: v };
      return this[X] = y, y;
    }
    getValidationMetaCache() {
      const a = Reflect.getOwnMetadata(N, this), f = Object.getPrototypeOf(this), h = f ? Reflect.getOwnMetadata(N, f) : null, m = this[N];
      if (m && m !== !0 && m.ownRef === a && m.protoRef === h)
        return m;
      const O = Le.fields(this), v = /* @__PURE__ */ new Map();
      for (const M of O)
        v.set(String(M.name), M);
      const y = { ownRef: a, protoRef: h, list: O, map: v };
      return this[N] = y, y;
    }
    /**
     * Инициализировать валидацию для поля или всех полей.
     */
    initValidation(a) {
      const f = this.validation;
      if (a)
        Reflect.get(f, a);
      else
        for (let h in f)
          f[h];
    }
    /**
     * Полная инициализация модели и полей.
     */
    init(a = {}) {
      this.cloneForInit(a), this.defineData(this.initData);
    }
    /**
     * Инициализировать отдельное поле модели.
     */
    initField(a, f) {
      const h = this.getFieldMeta(a);
      if (h) {
        const m = String(h.name);
        Object.prototype.hasOwnProperty.call(this.initData, m) || Reflect.set(this.initData, m, Reflect.get(this, m));
        let v = h?.factory ? h.factory(this.initData, this) : Reflect.get(this.initData, m);
        if (v === void 0 && !h?.factory) {
          const y = Reflect.get(this, m);
          y !== void 0 && (v = y, Reflect.set(this.initData, m, y));
        }
        this.defineFieldValue(a, v, h), f?.skipValidation || this.initValidation(a);
      }
    }
    initLegacyFields() {
      if (this.legacyInitDone)
        return;
      const a = this.getFieldMetaCache().list;
      if (a.some((f) => Object.prototype.hasOwnProperty.call(this, f.name))) {
        this.legacyInitDone = !0;
        for (let f of a) {
          const h = String(f.name);
          this.initData && h in this.initData || this.initField(h, { skipValidation: !0 });
        }
      }
    }
    // @define_prop
    // private readonly serviceToJSON = () => this.dumpData;
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
    createObservable(a, f, h, m = h) {
      return a = ve(a) ? a : H.box(a), new Proxy(a, {
        get: (O, v, y) => {
          const M = Reflect.get(O, v, y);
          return M && typeof M == "object" && !(M instanceof t) && !ve(a) ? this.createObservable(M, String(v), f, `${m}.${String(v)}`) : M;
        },
        set: (O, v, y, M) => (a = y, this.checkChange(h, Reflect.get(this, h)), Reflect.set(O, v, y, M))
      });
    }
    /**
     * Определить getter/setter для поля модели.
     */
    defineFieldValue(a, f, h) {
      const m = h ?? this.getFieldMeta(a);
      return m.noObserve ? Reflect.defineProperty(this, m.name, { value: f }) : (f = H.box(f), Reflect.defineProperty(this, m.name, {
        get: () => f.get(),
        set: (O) => {
          Y(() => f.set(O)), this.checkChange(m.name, f.get());
        },
        enumerable: !0,
        configurable: !0
      })), f;
    }
    /**
     * Сохранить исходные данные с глубоким клонированием.
     */
    cloneForInit(a = {}) {
      this.initData = a;
    }
    /**
     * Проверить изменение поля и обновить modified_.
     */
    checkChange(a, f) {
      const h = Reflect.get(this.committedData, a) || Reflect.get(this.initData, a), m = a && a in this.initData && !ge(h, f);
      return Y(() => {
        if (m) {
          Reflect.set(this.modified_, a, h);
          return;
        }
        a in this.modified_ && ge(h, f) && delete this.modified_[a];
      }), m;
    }
    /**
     * Применить данные к полям модели.
     */
    defineData(a) {
      const f = this.getFieldMetaCache().map;
      for (let h in this)
        Object.prototype.hasOwnProperty.call(this, h) && f.has(h) && (Reflect.set(this, h, Reflect.get(a, h)), this.initField(h));
    }
    /**
     * Признак наличия изменений.
     */
    get dirty() {
      return !Re(this.modified_);
    }
    /**
     * Зафиксировать все изменения.
     */
    commit() {
      for (let a of this.getFieldMetaCache().list)
        this.commitField(a.name);
      this.modified_ = {};
    }
    /**
     * Зафиксировать изменения конкретного поля.
     */
    commitField(a) {
      for (let f in this)
        f in this.modified_ && Reflect.set(this.committedData, f, this[f]);
      delete this.modified_[a], this.modified_ = Object.assign({}, this.modified_);
    }
    /**
     * Откатить изменения к последнему коммиту.
     */
    reject() {
      for (let a in this)
        a in this.modified_ && (this[a] = Reflect.get(this.modified_, a), this.commitField(a), this.defineFieldValue(a, this[a]));
      this.commit();
    }
    /**
     * Вернуть модель к исходным данным.
     */
    toInit() {
      return this.init(this.initData), this;
    }
    /**
     * Перезагрузить данные модели.
     */
    loadData(a) {
      return this.init(a), this;
    }
    /**
     * Получить сериализованный дамп данных.
     */
    get dumpData() {
      this.initLegacyFields();
      const a = /* @__PURE__ */ Object.create({}), f = this.getSubmitMetaCache().map, h = this.getExcludeMetaCache().map, m = (v) => {
        const y = Reflect.get(this, v), M = f.get(v), ie = M?.callback;
        return typeof ie == "function" ? ie(y, this) : y;
      }, O = (v) => {
        const y = h.get(v);
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
          return !((y = this.options) === null || y === void 0) && y.byFields && !this.options.byFields.includes(v.name) || O(v.name) ? void 0 : Reflect.set(a, v.name, m(v.name));
      }), a;
    }
    /**
     * Получить объект результатов валидации.
     */
    get validation() {
      this.initLegacyFields();
      const a = {};
      for (const f of this.getValidationMetaCache().list) {
        const h = String(f.name);
        Reflect.set(a, h, f.callback(Reflect.get(this, h), this) || "");
      }
      return a;
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
        loadData: (a) => this.loadData(a),
        reject: () => this.reject(),
        commit: () => this.commit(),
        commitField: (a) => this.commitField(a),
        toInit: () => this.toInit()
      };
    }
    get service() {
      return Object.assign({
        dirty: this.dirty,
        dumpData: this.dumpData,
        // toJSON        : this.serviceToJSON,
        validation: this.validation
      }, this.serviceApi);
    }
  }, (() => {
    const R = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    C = [Q], p = [V], l = [V], A = [V], I = [V], Z = [Q], ee = [Q], G = [(F = Q).struct.bind(F)], w(t, null, D, { kind: "accessor", name: "initData", static: !1, private: !1, access: { has: (a) => "initData" in a, get: (a) => a.initData, set: (a, f) => {
      a.initData = f;
    } }, metadata: R }, z, L), w(t, null, C, { kind: "getter", name: "dirty", static: !1, private: !1, access: { has: (a) => "dirty" in a, get: (a) => a.dirty }, metadata: R }, null, S), w(t, null, p, { kind: "method", name: "commit", static: !1, private: !1, access: { has: (a) => "commit" in a, get: (a) => a.commit }, metadata: R }, null, S), w(t, null, l, { kind: "method", name: "commitField", static: !1, private: !1, access: { has: (a) => "commitField" in a, get: (a) => a.commitField }, metadata: R }, null, S), w(t, null, A, { kind: "method", name: "reject", static: !1, private: !1, access: { has: (a) => "reject" in a, get: (a) => a.reject }, metadata: R }, null, S), w(t, null, I, { kind: "method", name: "toInit", static: !1, private: !1, access: { has: (a) => "toInit" in a, get: (a) => a.toInit }, metadata: R }, null, S), w(t, null, Z, { kind: "getter", name: "validation", static: !1, private: !1, access: { has: (a) => "validation" in a, get: (a) => a.validation }, metadata: R }, null, S), w(t, null, ee, { kind: "getter", name: "validAndDirty", static: !1, private: !1, access: { has: (a) => "validAndDirty" in a, get: (a) => a.validAndDirty }, metadata: R }, null, S), w(t, null, G, { kind: "getter", name: "service", static: !1, private: !1, access: { has: (a) => "service" in a, get: (a) => a.service }, metadata: R }, null, S), R && Object.defineProperty(t, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: R });
  })(), t;
})();
const pe = /* @__PURE__ */ new WeakMap(), Be = (t, e) => {
  if (!t)
    return;
  let n = pe.get(t);
  n || (n = /* @__PURE__ */ new Set(), pe.set(t, n));
  const o = String(e.name);
  if (n.has(o))
    return;
  const i = P(e.metadataKey, t, new Array());
  i.some((s) => s.name === o) || j(e.metadataKey, [...i, e], t), n.add(o);
}, me = function(e, n) {
  const o = K(e, n) ? void 0 : e, i = (c, d) => {
    const u = new fe(Object.assign(Object.assign({}, o), { name: String(d), ctx: null }));
    j(u.metadataKey, [...P(u.metadataKey, c, new Array()), u], c), Object.getOwnPropertyDescriptor(c, d) || Object.defineProperty(c, d, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, d))
          return Reflect.get(this, d);
        if (this.initData && d in this.initData && typeof this.initField == "function")
          return this.initField.call(this, String(d), { skipValidation: !0 }), Reflect.get(this, d);
      },
      set(b) {
        if (this.initData && !(d in this.initData) && Reflect.set(this.initData, d, b), typeof this.initField == "function") {
          this.initField.call(this, String(d), { skipValidation: !0 });
          return;
        }
        Object.defineProperty(this, d, {
          value: b,
          writable: !0,
          configurable: !0,
          enumerable: !0
        });
      }
    });
  }, s = (c) => {
    c.addInitializer(function() {
      if (this instanceof We && typeof this.initField == "function") {
        const d = new fe(Object.assign(Object.assign({}, o), { name: String(c.name), ctx: c }));
        Be(Object.getPrototypeOf(this), d), this.initField.call(this, String(c.name));
      }
    });
  };
  function r(c, d) {
    if (K(c, d)) {
      i(c, d);
      return;
    }
    if (E(d))
      return s(d), d.kind === "field" ? (u) => u : d;
  }
  return K(e, n) ? r(e, n) : o && !E(n) ? (c, d) => r(c, d) : E(n) ? r(void 0, n) : (c, d) => r(c, d);
}, Ye = (t) => !t || typeof t != "object" ? { noObserve: !0 } : Object.assign(Object.assign({}, t), { noObserve: !0 }), Qe = function(e, n) {
  return K(e, n) || E(n) ? me({ noObserve: !0 })(e, n) : me(Ye(e));
};
me.noObserve = Qe;
const we = /* @__PURE__ */ new WeakMap(), Ue = (t, e) => {
  if (!t)
    return;
  let n = we.get(t);
  n || (n = /* @__PURE__ */ new Set(), we.set(t, n));
  const o = String(e.name);
  if (n.has(o))
    return;
  const i = P(e.metadataKey, t, new Array());
  i.some((s) => s.name === o) || j(e.metadataKey, [...i, e], t), n.add(o);
};
function ft(t) {
  const e = (i, s) => {
    const r = new de({ callback: t, name: String(s) }), c = P(r.metadataKey, i, new Array());
    j(r.metadataKey, [...c, r], i);
  }, n = (i) => {
    const s = new de({ callback: t, name: String(i.name) });
    i.addInitializer(function() {
      Ue(Object.getPrototypeOf(this), s);
    });
  };
  function o(i, s) {
    if (K(i, s)) {
      e(i, s);
      return;
    }
    if (E(s))
      return n(s), s.kind === "field" ? (r) => r : s;
  }
  return t ? ((i, s) => o(i, s)) : ((i) => i);
}
const Oe = /* @__PURE__ */ new WeakMap(), $e = (t, e) => {
  if (!t)
    return;
  let n = Oe.get(t);
  n || (n = /* @__PURE__ */ new Set(), Oe.set(t, n));
  const o = String(e.name);
  if (n.has(o))
    return;
  const i = P(e.metadataKey, t, new Array());
  i.some((s) => s.name === o) || j(e.metadataKey, [...i, e], t), n.add(o);
};
function ht(t) {
  const e = (i, s) => {
    const r = new le({ callback: t, name: String(s) }), c = P(r.metadataKey, i, new Array());
    j(r.metadataKey, [...c, r], i);
  }, n = (i) => {
    const s = new le({ callback: t, name: String(i.name) });
    i.addInitializer(function() {
      $e(Object.getPrototypeOf(this), s);
    });
  };
  function o(i, s) {
    if (K(i, s)) {
      e(i, s);
      return;
    }
    if (E(s))
      return n(s), s.kind === "field" ? (r) => r : s;
  }
  return t ? ((i, s) => o(i, s)) : ((i) => i);
}
const Ge = (t) => ({
  items: t.items.map((e) => {
    var n, o;
    return {
      name: (o = (n = e.constructor) === null || n === void 0 ? void 0 : n.name) !== null && o !== void 0 ? o : "Model",
      data: e.service.dumpData
    };
  })
});
let mt = (() => {
  var t, e, n;
  let o = [], i, s = [], r = [], c, d = [], u = [], g, b, k, _, F, S, D, z, L, C;
  return t = class {
    get items() {
      return x(this, e, "f");
    }
    set items(l) {
      T(this, e, l, "f");
    }
    get _cash() {
      return x(this, n, "f");
    }
    set _cash(l) {
      T(this, n, l, "f");
    }
    constructor() {
      e.set(this, (q(this, o), q(this, s, []))), n.set(this, (q(this, r), q(this, d, []))), q(this, u), oe(this);
    }
    add(l) {
      this.items.push(l);
    }
    addMany(l) {
      l?.length && (this.items = this.items.concat(l));
    }
    remove(l) {
      this.items = this.items.filter((A) => A !== l);
    }
    /**
     * Найти элемент по предикату.
     */
    find(l) {
      return this.items.find(l);
    }
    /**
     * Отфильтровать элементы по предикату.
     */
    filter(l) {
      return this.items.filter(l);
    }
    /**
     * Найти элемент по id (или любому полю-ключу).
     */
    findBy(l, A) {
      return this.items.find((I) => I?.[l] === A);
    }
    clear() {
      this.items = [];
    }
    get size() {
      return this.items.length;
    }
    get snapshot() {
      return Ge(this);
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
    applyLoaded(l, A = {}) {
      const { model: I, mode: Z = "replace", cash: ee = !0 } = A;
      if (ee && this.setCash(l), Z === "append") {
        const G = I ? l.map((R) => new I(R)) : l;
        this.addMany(G);
        return;
      }
      this.items = I ? l.map((G) => new I(G)) : l;
    }
    /**
     * Сохранить оригинальные данные стора.
     */
    setCash(l) {
      this._cash = l ?? [];
    }
  }, e = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), (() => {
    const p = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    i = [H], c = [H], g = [V], b = [V], k = [V], _ = [V], F = [Q], S = [Q], D = [Q], z = [V], L = [V], C = [V], w(t, null, i, { kind: "accessor", name: "items", static: !1, private: !1, access: { has: (l) => "items" in l, get: (l) => l.items, set: (l, A) => {
      l.items = A;
    } }, metadata: p }, s, r), w(t, null, c, { kind: "accessor", name: "_cash", static: !1, private: !1, access: { has: (l) => "_cash" in l, get: (l) => l._cash, set: (l, A) => {
      l._cash = A;
    } }, metadata: p }, d, u), w(t, null, g, { kind: "method", name: "add", static: !1, private: !1, access: { has: (l) => "add" in l, get: (l) => l.add }, metadata: p }, null, o), w(t, null, b, { kind: "method", name: "addMany", static: !1, private: !1, access: { has: (l) => "addMany" in l, get: (l) => l.addMany }, metadata: p }, null, o), w(t, null, k, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (l) => "remove" in l, get: (l) => l.remove }, metadata: p }, null, o), w(t, null, _, { kind: "method", name: "clear", static: !1, private: !1, access: { has: (l) => "clear" in l, get: (l) => l.clear }, metadata: p }, null, o), w(t, null, F, { kind: "getter", name: "size", static: !1, private: !1, access: { has: (l) => "size" in l, get: (l) => l.size }, metadata: p }, null, o), w(t, null, S, { kind: "getter", name: "snapshot", static: !1, private: !1, access: { has: (l) => "snapshot" in l, get: (l) => l.snapshot }, metadata: p }, null, o), w(t, null, D, { kind: "getter", name: "cash", static: !1, private: !1, access: { has: (l) => "cash" in l, get: (l) => l.cash }, metadata: p }, null, o), w(t, null, z, { kind: "method", name: "reset", static: !1, private: !1, access: { has: (l) => "reset" in l, get: (l) => l.reset }, metadata: p }, null, o), w(t, null, L, { kind: "method", name: "applyLoaded", static: !1, private: !1, access: { has: (l) => "applyLoaded" in l, get: (l) => l.applyLoaded }, metadata: p }, null, o), w(t, null, C, { kind: "method", name: "setCash", static: !1, private: !1, access: { has: (l) => "setCash" in l, get: (l) => l.setCash }, metadata: p }, null, o), p && Object.defineProperty(t, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: p });
  })(), t;
})();
function vt(t) {
  return U(t, "instance");
}
function yt(t) {
  return ((e, n) => xe(t)(e, n));
}
function bt(t, e) {
  const n = (o, i) => {
    var s;
    const r = typeof t == "string" ? { id: t } : typeof t == "object" ? t : { id: (s = i?.name) !== null && s !== void 0 ? s : o?.name };
    ke(r)(o, i);
  };
  return typeof t == "function" ? n(t, e) : (o, i) => n(o, i);
}
class _t {
}
const ae = new he();
function pt(t, e) {
  return Pe((n = {}) => {
    const { resolved: o, instance: i } = Fe(() => {
      const r = U(t) || (typeof t != "string" ? { instance: new t() } : void 0), c = r?.instance;
      return { resolved: r, instance: c };
    }, [t]);
    if (Ce(() => {
      if (i)
        return typeof i.onInit == "function" && i.onInit(), () => {
          typeof i.onDispose == "function" && i.onDispose();
        };
    }, [i]), o) {
      const s = ae.fields(i), r = s.length > 0 ? s : ae.fields(Object.getPrototypeOf(i));
      for (const c in n)
        if (r instanceof Array) {
          const d = r.find((u) => u.name === c);
          d && Reflect.set(i, d.originName, Reflect.get(n, c));
        }
      return j(ae.metadataKey, r, i), e(Object.assign({ viewModel: i }, n));
    }
    return e(Object.assign({}, n));
  });
}
const Me = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, Ne = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, te = () => {
};
class Je {
  constructor(e, n) {
    var o, i, s, r, c, d, u;
    this.isExecuting = !1, this.activeCount = 0, this.isCanceled = !1, this.isDisposed = !1, this.error = null, this.controllers = /* @__PURE__ */ new Set(), this.queue = [], this.runningPromise = null, this.queueTail = Promise.resolve(), this.cancelToken = 0, this.fn = e, this.opt = Object.assign({ concurrency: (o = n?.concurrency) !== null && o !== void 0 ? o : "ignore", trackError: (i = n?.trackError) !== null && i !== void 0 ? i : !0, resetErrorOnExecute: (s = n?.resetErrorOnExecute) !== null && s !== void 0 ? s : !0, swallowError: (r = n?.swallowError) !== null && r !== void 0 ? r : !0, abortable: (c = n?.abortable) !== null && c !== void 0 ? c : !1 }, n), this.states = Object.assign(Object.assign({}, Me), (d = n?.states) !== null && d !== void 0 ? d : {}), this.stateKeys = Object.assign(Object.assign({}, Ne), (u = n?.stateKeys) !== null && u !== void 0 ? u : {}), Ee(this, {
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
    var n, o;
    const i = (n = this.stateKeys[e]) !== null && n !== void 0 ? n : e;
    return (o = this.states[i]) !== null && o !== void 0 ? o : Me[e];
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
    for (const n of e)
      n.canceled = !0, n.settled || (n.settled = !0, n.resolve(void 0));
  }
  execute(...e) {
    var n;
    if (this.isDisposed)
      return Promise.resolve(void 0);
    if (!this.canExecute)
      return (n = this.runningPromise) !== null && n !== void 0 ? n : Promise.resolve(void 0);
    const o = (s) => {
      this.runningPromise = s;
      const r = () => {
        this.runningPromise === s && (this.runningPromise = null);
      };
      return s.then(r, r), s;
    }, i = () => re(this, void 0, void 0, function* () {
      var s, r, c, d, u, g, b, k;
      if (this.isDisposed)
        return;
      const _ = this.opt.abortable ? new AbortController() : null;
      _ && this.controllers.add(_), Y(() => {
        this.activeCount += 1, this.isExecuting = this.activeCount > 0, this.isCanceled = !1, this.opt.trackError && this.opt.resetErrorOnExecute && (this.error = null);
      });
      const F = this.cancelToken;
      let S = !1, D = !1, z = null, L = null;
      try {
        (r = (s = this.opt).onStart) === null || r === void 0 || r.call(s, ...e);
        const C = this.opt.abortable ? _.signal : void 0;
        L = this.fn(...e, C);
        const p = yield L;
        return D = this.cancelToken !== F, D ? void 0 : ((d = (c = this.opt).onSuccess) === null || d === void 0 || d.call(c, p, ...e), S = !0, p);
      } catch (C) {
        if (this.opt.abortable && _?.signal.aborted) {
          Y(() => {
            this.isCanceled = !0;
          }), D = !0, z = null;
          return;
        }
        if (z = C, D = this.cancelToken !== F, this.opt.trackError && Y(() => {
          this.error = C;
        }), (g = (u = this.opt).onError) === null || g === void 0 || g.call(u, C), !this.opt.swallowError)
          throw C;
        return;
      } finally {
        Y(() => {
          this.activeCount = Math.max(0, this.activeCount - 1), this.isExecuting = this.activeCount > 0;
        }), _ && this.controllers.delete(_), !D && this.cancelToken !== F && (D = !0), (k = (b = this.opt).onFinally) === null || k === void 0 || k.call(b, { ok: S, canceled: D, error: z }, ...e);
      }
    });
    switch (this.opt.concurrency) {
      case "parallel":
        return o(i());
      case "restart":
        return this.cancel(), o(i());
      case "queue": {
        const s = this.opt.queueLimit;
        if (typeof s == "number" && s > 0 && this.queue.length >= s)
          return Promise.resolve(void 0);
        const r = {
          promise: Promise.resolve(void 0),
          resolve: te,
          reject: te,
          canceled: !1,
          settled: !1
        }, c = this.activeCount === 0 && this.queue.length === 0;
        r.promise = new Promise((g, b) => {
          r.resolve = g, r.reject = b;
        }), this.queue.push(r);
        const d = () => re(this, void 0, void 0, function* () {
          if (r.settled)
            return;
          if (r.canceled || this.isDisposed) {
            r.settled = !0, r.resolve(void 0);
            return;
          }
          const g = this.queue.indexOf(r);
          g >= 0 && this.queue.splice(g, 1);
          try {
            const b = yield i();
            r.settled || (r.settled = !0, r.resolve(b));
          } catch (b) {
            r.settled || (r.settled = !0, r.reject(b));
          }
        }), u = c ? d() : this.queueTail.then(d, d);
        return this.queueTail = u.then(te, te), o(r.promise);
      }
      default:
        return this.isExecuting && this.runningPromise ? this.runningPromise : o(i());
    }
  }
}
function Xe(t, e) {
  return new Je(t, e);
}
function wt(t, e) {
  const n = je(t), o = /* @__PURE__ */ new Set(), i = e?.onCancel;
  return Xe((...r) => {
    const c = n(...r);
    o.add(c);
    const d = () => {
      o.delete(c);
    };
    return c.then(d, d), new Promise((u, g) => {
      c.then(u, (b) => {
        if (De(b)) {
          u(void 0);
          return;
        }
        g(b);
      });
    });
  }, Object.assign(Object.assign({}, e), { onCancel: () => {
    var r;
    for (const c of o)
      (r = c.cancel) === null || r === void 0 || r.call(c);
    i?.();
  } }));
}
function Ot(t) {
  return function(...e) {
    return Y(() => t.apply(this, e));
  };
}
export {
  U as GetService,
  vt as GetStore,
  xe as Inject,
  yt as InjectStore,
  ct as MakeObservable,
  We as Model,
  lt as PropFromView,
  ke as Service,
  rt as SetService,
  bt as Store,
  mt as StoreBase,
  at as TODO,
  _t as ViewModel,
  Xe as asyncCommand,
  Ot as commandAction,
  j as defineMetadata,
  ot as define_prop,
  dt as exclude,
  me as field,
  wt as flowCommand,
  Ae as getExecutingFunctionNameByStack,
  P as getOwnMetadata,
  st as isSerializable,
  ft as submit,
  ht as validation,
  pt as view
};
