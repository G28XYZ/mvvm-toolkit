import "reflect-metadata";
import { d as re, _ as V, a as x, b as q, c as w } from "./tslib.es6-B_Omq7a0.js";
import Se, { isEqual as ge, isEmpty as Re } from "lodash";
import { makeObservable as oe, observable as H, isObservable as ve, runInAction as Y, computed as N, action as T, flow as je, isFlowCancellationError as De, makeAutoObservable as Ee } from "mobx";
import { observer as Pe } from "mobx-react";
import { useMemo as Fe, useEffect as Ce, isValidElement as Ae } from "react";
const P = (e, t, n) => Reflect.getOwnMetadata(e, t) || n || {}, j = (e, t, n) => Reflect.defineMetadata(e, t, n);
function lt(...e) {
  try {
    return JSON.stringify(e), !0;
  } catch {
    return !1;
  }
}
function Ie(e) {
  if (e && typeof e == "string") {
    let [t] = e.split(`
`)[2].replace(/at (get)?/, "").match(/.*/g) || [];
    return t && (t = t.trim()), t;
  }
}
const ye = {}, ne = [];
let be = !1;
const ct = (e, ...t) => {
  const n = new Error().stack;
  if (!be)
    console.log("%c TODO", "background: #222; color: #bada55", ye), be = !0;
  else {
    const i = Ie(n);
    ne.includes(i) === !1 && (ne.push(i), Reflect.set(ye, `${ne.length}) ${e}`, { msg: t, get path() {
      return console.info(t, i), i;
    } }));
  }
  function o(...i) {
  }
  return o;
}, K = (e, t) => !!e && (typeof t == "string" || typeof t == "symbol"), E = (e) => !!e && typeof e == "object" && "kind" in e, Ve = (e) => ({
  kind: "class",
  name: e,
  addInitializer: () => {
  },
  metadata: {}
}), B = /* @__PURE__ */ Symbol("service-key"), le = new Proxy({}, Reflect);
function xe(e) {
  const t = (o, i) => {
    Object.defineProperty(o, i, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, i))
          return Reflect.get(this, i);
        const s = Q(e, "instance");
        if (s)
          return Object.defineProperty(this, i, { value: s, writable: !0, configurable: !0, enumerable: !0 }), s;
      },
      set(s) {
        const r = Q(e, "instance");
        Object.defineProperty(this, i, { value: r ?? s, writable: !0, configurable: !0, enumerable: !0 });
      }
    });
  };
  function n(o, i) {
    if (K(o, i)) {
      t(o, i);
      return;
    }
    return i.addInitializer(function() {
      return re(this, void 0, void 0, function* () {
        const s = Q(e, "instance");
        s && Object.hasOwn(this, i.name) && Reflect.set(this, i.name, s);
      });
    }), (s) => s;
  }
  return n;
}
function Q(e, t) {
  var n;
  const o = P(B, le);
  if (typeof e != "string") {
    const i = P(B, e);
    if (i)
      return t && t in i ? i[t] : i;
    for (const s in o) {
      const r = o[s];
      if (r.target === e) {
        e = r.context.name;
        break;
      }
    }
  }
  if (typeof e == "string")
    return t ? (n = o[e]) === null || n === void 0 ? void 0 : n[t] : o[e];
}
function ke(e, t) {
  const n = (i, s) => {
    const r = String(typeof e == "string" && e || typeof e == "object" && e?.id || s?.name || i?.name), l = P(B, le), d = new Proxy({
      target: i,
      instance: typeof e == "object" && Reflect.get(e, "transient") || typeof e == "object" && Reflect.get(e, "lazy") ? i : new i(),
      context: s,
      options: e
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
    l[r] = d, j(B, l, le), j(B, l[r], i);
  };
  function o(i, s) {
    var r, l;
    const d = i.__legacy_source__, u = E(s) ? s : Ve((l = (r = d?.name) !== null && r !== void 0 ? r : i?.name) !== null && l !== void 0 ? l : "");
    n(i, u), d && d !== i && j(B, P(B, i), d);
  }
  return Se.isFunction(e) ? o(e, t) : e ? (i, s) => o(i, s) : o;
}
const dt = (e, t) => {
  const { kind: n = "class", name: o = "", addInitializer: i = () => {
  }, metadata: s } = t?.ctx || {};
  return ke(t)(e, {
    kind: n,
    name: o,
    addInitializer: i,
    metadata: s
  }), Q(e).instance;
};
function se(e) {
  var t, n, o;
  const i = Object.assign({ enumerable: !1, writable: !0 }, e), s = Object.assign({ configurable: !0, enumerable: !1, writable: !0 }, e), r = {
    configurable: (t = s.configurable) !== null && t !== void 0 ? t : !0,
    enumerable: (n = s.enumerable) !== null && n !== void 0 ? n : !1,
    writable: (o = s.writable) !== null && o !== void 0 ? o : !0,
    value: void 0
  };
  return function(l, d) {
    if (K(l, d)) {
      Object.defineProperty(l, d, {
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
      }), l);
    }
  };
}
function ut(e, t) {
  return K(e, t) || E(t) ? se()(e, t) : se(e);
}
function ft(e, t) {
  const n = (s) => class extends s {
    constructor(...r) {
      super(...r), oe(this);
    }
  }, o = (s, r) => {
    if (typeof Reflect?.getOwnMetadataKeys == "function")
      for (const l of Reflect.getOwnMetadataKeys(s)) {
        const d = Reflect.getOwnMetadata(l, s);
        Reflect.defineMetadata(l, d, r);
      }
  };
  function i(s, r) {
    if (!E(r)) {
      const l = s, d = n(l);
      return Object.defineProperty(d, "__legacy_source__", { value: l, configurable: !0 }), o(l, d), d;
    }
    r.addInitializer(function() {
      oe(this);
    });
  }
  return e && !E(t) || e ? i(e, t) : i;
}
const W = /* @__PURE__ */ Symbol("field-key"), G = /* @__PURE__ */ Symbol("validation-key"), J = /* @__PURE__ */ Symbol("submit-key"), X = /* @__PURE__ */ Symbol("exclude-key"), Te = /* @__PURE__ */ Symbol("prop-from-view-key");
class $ {
  isPrototypeObject(t) {
    const n = t?.constructor;
    return !!(n && n.prototype === t);
  }
  /**
   * Получить объект, по которому кешируются метаданные.
   * Для инстанса — это его prototype, для prototype — он сам.
   */
  getCacheTarget(t) {
    return !t || typeof t != "object" ? null : this.isPrototypeObject(t) ? t : Object.getPrototypeOf(t);
  }
  computeFromPrototype(t) {
    const n = [], o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
    let s = t;
    for (; s; ) {
      const l = Reflect.getOwnMetadata(this.metadataKey, s);
      if (Array.isArray(l))
        for (const d of l) {
          const u = d?.name, g = String(u);
          i.has(g) || (i.add(g), n.push(d), o.set(g, d));
        }
      s = Object.getPrototypeOf(s);
    }
    return { ownRef: Reflect.getOwnMetadata(this.metadataKey, t), list: n, map: o };
  }
  /**
   * Создать базовые метаданные.
   */
  constructor(t = {}) {
    this.metadataKey = null, this.isInit = !1, this.cache = /* @__PURE__ */ new WeakMap(), this.name = t?.name, this.callback = t?.callback;
  }
  /**
   * Проверить, что данные соответствуют экземпляру метаданных.
   */
  isInstance(t = {}) {
    return t instanceof $ || Object.getOwnPropertyNames(this).some((n) => Object.keys(t).includes(n));
  }
  /**
   * Получить метаданные конкретного поля модели.
   */
  fieldInstance(t, n) {
    const o = n && typeof n == "object" ? Reflect.getOwnMetadata(this.metadataKey, n) : void 0;
    if (Array.isArray(o))
      return o.find((l) => l.name === t);
    const i = this.getCacheTarget(n);
    if (!i)
      return;
    const s = Reflect.getOwnMetadata(this.metadataKey, i), r = this.cache.get(i);
    if (!r || r.ownRef !== s) {
      const l = this.computeFromPrototype(i);
      return this.cache.set(i, l), l.map.get(String(t));
    }
    return r.map.get(String(t));
  }
  /**
   * Получить массив метаданных полей модели.
   */
  fields(t) {
    const n = t && typeof t == "object" ? Reflect.getOwnMetadata(this.metadataKey, t) : void 0;
    if (Array.isArray(n)) {
      const l = [], d = /* @__PURE__ */ new Set();
      let u = t;
      for (; u; ) {
        const g = Reflect.getOwnMetadata(this.metadataKey, u);
        if (Array.isArray(g))
          for (const b of g) {
            const k = b?.name, _ = String(k);
            d.has(_) || (d.add(_), l.push(b));
          }
        u = Object.getPrototypeOf(u);
      }
      return l;
    }
    const o = this.getCacheTarget(t);
    if (!o)
      return [];
    const i = Reflect.getOwnMetadata(this.metadataKey, o), s = this.cache.get(o);
    if (s && s.ownRef === i)
      return s.list;
    const r = this.computeFromPrototype(o);
    return this.cache.set(o, r), r.list;
  }
}
class ce extends $ {
  constructor() {
    super(...arguments), this.metadataKey = G;
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
  constructor(t = {}) {
    super(t), this.factory = null, this.mapping = null, this.noObserve = null, this.collectChanges = !1, this.name = null, this.ctx = null, this.metadataKey = W, this.isInit = !1, this.factory = t.factory, this.mapping = t.mapping, this.noObserve = t.noObserve, this.name = t.name, this.ctx = t.ctx, this.collectChanges = !!t.collectChanges;
  }
}
class he extends $ {
  /**
   * Создать метаданные для PropFromView.
   */
  constructor(t = {}) {
    super(t), this.metadataKey = Te;
    for (const n in this)
      t && n in t && (this[n] = Reflect.get(t, n));
  }
}
function ht(e) {
  const t = (i, s) => {
    const r = new he({ name: e, originName: String(s) });
    r.name = e, r.originName = String(s);
    const l = P(r.metadataKey, i, new Array());
    j(r.metadataKey, [...l, r], i);
  }, n = (i) => {
    i.addInitializer(function() {
      const s = new he(), r = s.fields(this);
      for (const l in this)
        r instanceof Array && i.name === l && (s.name = e, s.originName = l, s.value = this[l], r.push(s));
      j(s.metadataKey, r, this);
    });
  };
  function o(i, s) {
    if (K(i, s)) {
      t(i, s);
      return;
    }
    if (E(s))
      return n(s), s.kind === "field" ? (r) => r : s;
  }
  return e ? ((i, s) => o(i, s)) : ((i) => i);
}
const _e = /* @__PURE__ */ new WeakMap(), Ke = (e, t) => {
  if (!e)
    return;
  let n = _e.get(e);
  n || (n = /* @__PURE__ */ new Set(), _e.set(e, n));
  const o = String(t.name);
  if (n.has(o))
    return;
  const i = P(t.metadataKey, e, new Array());
  i.some((s) => s.name === o) || j(t.metadataKey, [...i, t], e), n.add(o);
};
function mt(e) {
  const t = (i, s) => {
    const r = new ue({ callback: e, name: String(s) }), l = P(r.metadataKey, i, new Array());
    j(r.metadataKey, [...l, r], i);
  }, n = (i) => {
    i.addInitializer(function() {
      const s = new ue({ callback: e, name: String(i.name) });
      Ke(Object.getPrototypeOf(this), s);
    });
  };
  function o(i, s) {
    if (K(i, s)) {
      t(i, s);
      return;
    }
    if (E(s))
      return n(s), s.kind === "field" ? void 0 : s;
  }
  if (e)
    return ((i, s) => o(i, s));
}
const ze = new de(), Le = new fe(), qe = new ce(), We = new ue();
let Be = (() => {
  var e, t, n, o, i, s, r, l, d, u, g, b, k, _, F;
  let S = [], D, z = [], L = [], C, p, c, A, I, Z, ee, U;
  return e = class {
    get initData() {
      return V(this, t, "f");
    }
    set initData(a) {
      x(this, t, a, "f");
    }
    // @define_prop
    get committedData() {
      return V(this, n, "f");
    }
    set committedData(a) {
      x(this, n, a, "f");
    }
    // @define_prop
    get modified_() {
      return V(this, o, "f");
    }
    set modified_(a) {
      x(this, o, a, "f");
    }
    // @define_prop
    get legacyInitDone() {
      return V(this, i, "f");
    }
    set legacyInitDone(a) {
      x(this, i, a, "f");
    }
    // @define_prop
    get options() {
      return V(this, s, "f");
    }
    set options(a) {
      x(this, s, a, "f");
    }
    get [(t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), i = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), d = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap(), g = (D = [H], W))]() {
      return V(this, r, "f");
    }
    set [g](a) {
      x(this, r, a, "f");
    }
    get [b = J]() {
      return V(this, l, "f");
    }
    set [b](a) {
      x(this, l, a, "f");
    }
    get [k = X]() {
      return V(this, d, "f");
    }
    set [k](a) {
      x(this, d, a, "f");
    }
    get [_ = G]() {
      return V(this, u, "f");
    }
    set [_](a) {
      x(this, u, a, "f");
    }
    /**
     * Создает модель и инициализирует данные.
     */
    constructor(a = {}, f) {
      t.set(this, (q(this, S), q(this, z, null))), n.set(this, (q(this, L), {})), o.set(this, {}), i.set(this, !1), s.set(this, {}), r.set(this, void 0), l.set(this, void 0), d.set(this, void 0), u.set(this, void 0), this.options = f, this.init(a), this.initLegacyFields();
    }
    getFieldMetaCache() {
      const a = Reflect.getOwnMetadata(W, this), f = Object.getPrototypeOf(this), h = f ? Reflect.getOwnMetadata(W, f) : null, m = this[W];
      if (m && m !== !0 && m.ownRef === a && m.protoRef === h)
        return m;
      const O = Le.fields(this), v = /* @__PURE__ */ new Map();
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
      const O = ze.fields(this), v = /* @__PURE__ */ new Map();
      for (const M of O)
        v.set(String(M.name), M);
      const y = { ownRef: a, protoRef: h, list: O, map: v };
      return this[J] = y, y;
    }
    getExcludeMetaCache() {
      const a = Reflect.getOwnMetadata(X, this), f = Object.getPrototypeOf(this), h = f ? Reflect.getOwnMetadata(X, f) : null, m = this[X];
      if (m && m !== !0 && m.ownRef === a && m.protoRef === h)
        return m;
      const O = We.fields(this), v = /* @__PURE__ */ new Map();
      for (const M of O)
        v.set(String(M.name), M);
      const y = { ownRef: a, protoRef: h, list: O, map: v };
      return this[X] = y, y;
    }
    getValidationMetaCache() {
      const a = Reflect.getOwnMetadata(G, this), f = Object.getPrototypeOf(this), h = f ? Reflect.getOwnMetadata(G, f) : null, m = this[G];
      if (m && m !== !0 && m.ownRef === a && m.protoRef === h)
        return m;
      const O = qe.fields(this), v = /* @__PURE__ */ new Map();
      for (const M of O)
        v.set(String(M.name), M);
      const y = { ownRef: a, protoRef: h, list: O, map: v };
      return this[G] = y, y;
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
          return M && typeof M == "object" && !(M instanceof e) && !ve(a) ? this.createObservable(M, String(v), f, `${m}.${String(v)}`) : M;
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
    C = [N], p = [T], c = [T], A = [T], I = [T], Z = [N], ee = [N], U = [(F = N).struct.bind(F)], w(e, null, D, { kind: "accessor", name: "initData", static: !1, private: !1, access: { has: (a) => "initData" in a, get: (a) => a.initData, set: (a, f) => {
      a.initData = f;
    } }, metadata: R }, z, L), w(e, null, C, { kind: "getter", name: "dirty", static: !1, private: !1, access: { has: (a) => "dirty" in a, get: (a) => a.dirty }, metadata: R }, null, S), w(e, null, p, { kind: "method", name: "commit", static: !1, private: !1, access: { has: (a) => "commit" in a, get: (a) => a.commit }, metadata: R }, null, S), w(e, null, c, { kind: "method", name: "commitField", static: !1, private: !1, access: { has: (a) => "commitField" in a, get: (a) => a.commitField }, metadata: R }, null, S), w(e, null, A, { kind: "method", name: "reject", static: !1, private: !1, access: { has: (a) => "reject" in a, get: (a) => a.reject }, metadata: R }, null, S), w(e, null, I, { kind: "method", name: "toInit", static: !1, private: !1, access: { has: (a) => "toInit" in a, get: (a) => a.toInit }, metadata: R }, null, S), w(e, null, Z, { kind: "getter", name: "validation", static: !1, private: !1, access: { has: (a) => "validation" in a, get: (a) => a.validation }, metadata: R }, null, S), w(e, null, ee, { kind: "getter", name: "validAndDirty", static: !1, private: !1, access: { has: (a) => "validAndDirty" in a, get: (a) => a.validAndDirty }, metadata: R }, null, S), w(e, null, U, { kind: "getter", name: "service", static: !1, private: !1, access: { has: (a) => "service" in a, get: (a) => a.service }, metadata: R }, null, S), R && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: R });
  })(), e;
})();
const pe = /* @__PURE__ */ new WeakMap(), Ye = (e, t) => {
  if (!e)
    return;
  let n = pe.get(e);
  n || (n = /* @__PURE__ */ new Set(), pe.set(e, n));
  const o = String(t.name);
  if (n.has(o))
    return;
  const i = P(t.metadataKey, e, new Array());
  i.some((s) => s.name === o) || j(t.metadataKey, [...i, t], e), n.add(o);
}, me = function(t, n) {
  const o = K(t, n) ? void 0 : t, i = (l, d) => {
    const u = new fe(Object.assign(Object.assign({}, o), { name: String(d), ctx: null }));
    j(u.metadataKey, [...P(u.metadataKey, l, new Array()), u], l), Object.getOwnPropertyDescriptor(l, d) || Object.defineProperty(l, d, {
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
  }, s = (l) => {
    l.addInitializer(function() {
      if (this instanceof Be && typeof this.initField == "function") {
        const d = new fe(Object.assign(Object.assign({}, o), { name: String(l.name), ctx: l }));
        Ye(Object.getPrototypeOf(this), d), this.initField.call(this, String(l.name));
      }
    });
  };
  function r(l, d) {
    if (K(l, d)) {
      i(l, d);
      return;
    }
    if (E(d))
      return s(d), d.kind === "field" ? (u) => u : d;
  }
  return K(t, n) ? r(t, n) : o && !E(n) ? (l, d) => r(l, d) : E(n) ? r(void 0, n) : (l, d) => r(l, d);
}, Ne = (e) => !e || typeof e != "object" ? { noObserve: !0 } : Object.assign(Object.assign({}, e), { noObserve: !0 }), Qe = function(t, n) {
  return K(t, n) || E(n) ? me({ noObserve: !0 })(t, n) : me(Ne(t));
};
me.noObserve = Qe;
const we = /* @__PURE__ */ new WeakMap(), $e = (e, t) => {
  if (!e)
    return;
  let n = we.get(e);
  n || (n = /* @__PURE__ */ new Set(), we.set(e, n));
  const o = String(t.name);
  if (n.has(o))
    return;
  const i = P(t.metadataKey, e, new Array());
  i.some((s) => s.name === o) || j(t.metadataKey, [...i, t], e), n.add(o);
};
function vt(e) {
  const t = (i, s) => {
    const r = new de({ callback: e, name: String(s) }), l = P(r.metadataKey, i, new Array());
    j(r.metadataKey, [...l, r], i);
  }, n = (i) => {
    const s = new de({ callback: e, name: String(i.name) });
    i.addInitializer(function() {
      $e(Object.getPrototypeOf(this), s);
    });
  };
  function o(i, s) {
    if (K(i, s)) {
      t(i, s);
      return;
    }
    if (E(s))
      return n(s), s.kind === "field" ? (r) => r : s;
  }
  return e ? ((i, s) => o(i, s)) : ((i) => i);
}
const Oe = /* @__PURE__ */ new WeakMap(), Ue = (e, t) => {
  if (!e)
    return;
  let n = Oe.get(e);
  n || (n = /* @__PURE__ */ new Set(), Oe.set(e, n));
  const o = String(t.name);
  if (n.has(o))
    return;
  const i = P(t.metadataKey, e, new Array());
  i.some((s) => s.name === o) || j(t.metadataKey, [...i, t], e), n.add(o);
};
function yt(e) {
  const t = (i, s) => {
    const r = new ce({ callback: e, name: String(s) }), l = P(r.metadataKey, i, new Array());
    j(r.metadataKey, [...l, r], i);
  }, n = (i) => {
    const s = new ce({ callback: e, name: String(i.name) });
    i.addInitializer(function() {
      Ue(Object.getPrototypeOf(this), s);
    });
  };
  function o(i, s) {
    if (K(i, s)) {
      t(i, s);
      return;
    }
    if (E(s))
      return n(s), s.kind === "field" ? (r) => r : s;
  }
  return e ? ((i, s) => o(i, s)) : ((i) => i);
}
const Ge = (e) => ({
  items: e.items.map((t) => {
    var n, o;
    return {
      name: (o = (n = t.constructor) === null || n === void 0 ? void 0 : n.name) !== null && o !== void 0 ? o : "Model",
      data: t.service.dumpData
    };
  })
});
let bt = (() => {
  var e, t, n;
  let o = [], i, s = [], r = [], l, d = [], u = [], g, b, k, _, F, S, D, z, L, C;
  return e = class {
    get items() {
      return V(this, t, "f");
    }
    set items(c) {
      x(this, t, c, "f");
    }
    get _cash() {
      return V(this, n, "f");
    }
    set _cash(c) {
      x(this, n, c, "f");
    }
    constructor() {
      t.set(this, (q(this, o), q(this, s, []))), n.set(this, (q(this, r), q(this, d, []))), q(this, u), oe(this);
    }
    add(c) {
      this.items.push(c);
    }
    addMany(c) {
      c?.length && (this.items = this.items.concat(c));
    }
    remove(c) {
      this.items = this.items.filter((A) => A !== c);
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
    findBy(c, A) {
      return this.items.find((I) => I?.[c] === A);
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
    applyLoaded(c, A = {}) {
      const { model: I, mode: Z = "replace", cash: ee = !0 } = A;
      if (ee && this.setCash(c), Z === "append") {
        const U = I ? c.map((R) => new I(R)) : c;
        this.addMany(U);
        return;
      }
      this.items = I ? c.map((U) => new I(U)) : c;
    }
    /**
     * Сохранить оригинальные данные стора.
     */
    setCash(c) {
      this._cash = c ?? [];
    }
  }, t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), (() => {
    const p = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    i = [H], l = [H], g = [T], b = [T], k = [T], _ = [T], F = [N], S = [N], D = [N], z = [T], L = [T], C = [T], w(e, null, i, { kind: "accessor", name: "items", static: !1, private: !1, access: { has: (c) => "items" in c, get: (c) => c.items, set: (c, A) => {
      c.items = A;
    } }, metadata: p }, s, r), w(e, null, l, { kind: "accessor", name: "_cash", static: !1, private: !1, access: { has: (c) => "_cash" in c, get: (c) => c._cash, set: (c, A) => {
      c._cash = A;
    } }, metadata: p }, d, u), w(e, null, g, { kind: "method", name: "add", static: !1, private: !1, access: { has: (c) => "add" in c, get: (c) => c.add }, metadata: p }, null, o), w(e, null, b, { kind: "method", name: "addMany", static: !1, private: !1, access: { has: (c) => "addMany" in c, get: (c) => c.addMany }, metadata: p }, null, o), w(e, null, k, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (c) => "remove" in c, get: (c) => c.remove }, metadata: p }, null, o), w(e, null, _, { kind: "method", name: "clear", static: !1, private: !1, access: { has: (c) => "clear" in c, get: (c) => c.clear }, metadata: p }, null, o), w(e, null, F, { kind: "getter", name: "size", static: !1, private: !1, access: { has: (c) => "size" in c, get: (c) => c.size }, metadata: p }, null, o), w(e, null, S, { kind: "getter", name: "snapshot", static: !1, private: !1, access: { has: (c) => "snapshot" in c, get: (c) => c.snapshot }, metadata: p }, null, o), w(e, null, D, { kind: "getter", name: "cash", static: !1, private: !1, access: { has: (c) => "cash" in c, get: (c) => c.cash }, metadata: p }, null, o), w(e, null, z, { kind: "method", name: "reset", static: !1, private: !1, access: { has: (c) => "reset" in c, get: (c) => c.reset }, metadata: p }, null, o), w(e, null, L, { kind: "method", name: "applyLoaded", static: !1, private: !1, access: { has: (c) => "applyLoaded" in c, get: (c) => c.applyLoaded }, metadata: p }, null, o), w(e, null, C, { kind: "method", name: "setCash", static: !1, private: !1, access: { has: (c) => "setCash" in c, get: (c) => c.setCash }, metadata: p }, null, o), p && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: p });
  })(), e;
})();
function pt(e) {
  return Q(e, "instance");
}
function wt(e) {
  return ((t, n) => xe(e)(t, n));
}
function Ot(e, t) {
  const n = (o, i) => {
    var s;
    const r = typeof e == "string" ? { id: e } : typeof e == "object" ? e : { id: (s = i?.name) !== null && s !== void 0 ? s : o?.name };
    ke(r)(o, i);
  };
  return typeof e == "function" ? n(e, t) : (o, i) => n(o, i);
}
class Mt {
}
const ae = new he(), Je = (e) => typeof Node < "u" && e instanceof Node, Xe = (e) => {
  if (e == null)
    return !0;
  const t = typeof e;
  return t === "function" ? !1 : t !== "object" ? !0 : Ae(e) ? !1 : !Je(e);
}, He = (e, t) => {
  if (!Xe(t))
    throw new TypeError(`PropFromView only accepts object or primitive values; functions, React elements, and DOM nodes are not allowed for prop "${e}".`);
};
function kt(e, t) {
  return Pe((n = {}) => {
    const { resolved: o, instance: i } = Fe(() => {
      const r = Q(e) || (typeof e != "string" ? { instance: new e() } : void 0), l = r?.instance;
      return { resolved: r, instance: l };
    }, [e]);
    if (Ce(() => {
      if (i)
        return typeof i.onInit == "function" && i.onInit(), () => {
          typeof i.onDispose == "function" && i.onDispose();
        };
    }, [i]), o) {
      const s = ae.fields(i), r = s.length > 0 ? s : ae.fields(Object.getPrototypeOf(i));
      for (const l in n)
        if (r instanceof Array) {
          const d = r.find((u) => u.name === l);
          if (d) {
            const u = Reflect.get(n, l);
            He(l, u), Reflect.set(i, d.originName, u);
          }
        }
      return j(ae.metadataKey, r, i), t(Object.assign({ viewModel: i }, n));
    }
    return t(Object.assign({}, n));
  });
}
const Me = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, Ze = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, te = () => {
};
class et {
  constructor(t, n) {
    var o, i, s, r, l, d, u;
    this.isExecuting = !1, this.activeCount = 0, this.isCanceled = !1, this.isDisposed = !1, this.error = null, this.controllers = /* @__PURE__ */ new Set(), this.queue = [], this.runningPromise = null, this.queueTail = Promise.resolve(), this.cancelToken = 0, this.fn = t, this.opt = Object.assign({ concurrency: (o = n?.concurrency) !== null && o !== void 0 ? o : "ignore", trackError: (i = n?.trackError) !== null && i !== void 0 ? i : !0, resetErrorOnExecute: (s = n?.resetErrorOnExecute) !== null && s !== void 0 ? s : !0, swallowError: (r = n?.swallowError) !== null && r !== void 0 ? r : !0, abortable: (l = n?.abortable) !== null && l !== void 0 ? l : !1 }, n), this.states = Object.assign(Object.assign({}, Me), (d = n?.states) !== null && d !== void 0 ? d : {}), this.stateKeys = Object.assign(Object.assign({}, Ze), (u = n?.stateKeys) !== null && u !== void 0 ? u : {}), Ee(this, {
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
  resolveState(t) {
    var n, o;
    const i = (n = this.stateKeys[t]) !== null && n !== void 0 ? n : t;
    return (o = this.states[i]) !== null && o !== void 0 ? o : Me[t];
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
    var t, n;
    this.cancelToken += 1, this.isCanceled = !0, (n = (t = this.opt).onCancel) === null || n === void 0 || n.call(t), this.opt.cancelQueued && this.clearQueue();
    for (const o of this.controllers)
      o.abort();
  }
  dispose() {
    this.isDisposed || (this.isDisposed = !0, this.clearQueue(), this.cancel());
  }
  clearQueue() {
    if (this.queue.length === 0)
      return;
    const t = this.queue.splice(0, this.queue.length);
    for (const n of t)
      n.canceled = !0, n.settled || (n.settled = !0, n.resolve(void 0));
  }
  execute(...t) {
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
      var s, r, l, d, u, g, b, k;
      if (this.isDisposed)
        return;
      const _ = this.opt.abortable ? new AbortController() : null;
      _ && this.controllers.add(_), Y(() => {
        this.activeCount += 1, this.isExecuting = this.activeCount > 0, this.isCanceled = !1, this.opt.trackError && this.opt.resetErrorOnExecute && (this.error = null);
      });
      const F = this.cancelToken;
      let S = !1, D = !1, z = null, L = null;
      try {
        (r = (s = this.opt).onStart) === null || r === void 0 || r.call(s, ...t);
        const C = this.opt.abortable ? _.signal : void 0;
        L = this.fn(...t, C);
        const p = yield L;
        return D = this.cancelToken !== F, D ? void 0 : ((d = (l = this.opt).onSuccess) === null || d === void 0 || d.call(l, p, ...t), S = !0, p);
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
        }), _ && this.controllers.delete(_), !D && this.cancelToken !== F && (D = !0), (k = (b = this.opt).onFinally) === null || k === void 0 || k.call(b, { ok: S, canceled: D, error: z }, ...t);
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
        }, l = this.activeCount === 0 && this.queue.length === 0;
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
        }), u = l ? d() : this.queueTail.then(d, d);
        return this.queueTail = u.then(te, te), o(r.promise);
      }
      default:
        return this.isExecuting && this.runningPromise ? this.runningPromise : o(i());
    }
  }
}
function tt(e, t) {
  return new et(e, t);
}
function St(e, t) {
  const n = je(e), o = /* @__PURE__ */ new Set(), i = t?.onCancel;
  return tt((...r) => {
    const l = n(...r);
    o.add(l);
    const d = () => {
      o.delete(l);
    };
    return l.then(d, d), new Promise((u, g) => {
      l.then(u, (b) => {
        if (De(b)) {
          u(void 0);
          return;
        }
        g(b);
      });
    });
  }, Object.assign(Object.assign({}, t), { onCancel: () => {
    var r;
    for (const l of o)
      (r = l.cancel) === null || r === void 0 || r.call(l);
    i?.();
  } }));
}
function Rt(e) {
  return function(...t) {
    return Y(() => e.apply(this, t));
  };
}
export {
  Q as GetService,
  pt as GetStore,
  xe as Inject,
  wt as InjectStore,
  ft as MakeObservable,
  Be as Model,
  ht as PropFromView,
  ke as Service,
  dt as SetService,
  Ot as Store,
  bt as StoreBase,
  ct as TODO,
  Mt as ViewModel,
  tt as asyncCommand,
  Rt as commandAction,
  j as defineMetadata,
  ut as define_prop,
  mt as exclude,
  me as field,
  St as flowCommand,
  Ie as getExecutingFunctionNameByStack,
  P as getOwnMetadata,
  lt as isSerializable,
  vt as submit,
  yt as validation,
  kt as view
};
