import "reflect-metadata";
import { d as oe, _ as I, a as V, b as q, c as w } from "./tslib.es6-B_Omq7a0.js";
import je, { isEqual as ve, isEmpty as De } from "lodash";
import { makeObservable as le, observable as H, isObservable as ye, runInAction as L, computed as N, action as x, flow as Ee, isFlowCancellationError as Pe, makeAutoObservable as Ce } from "mobx";
import { observer as Fe } from "mobx-react";
import { useMemo as Ae, useEffect as Ie, isValidElement as Ve } from "react";
const P = (e, t, n) => Reflect.getOwnMetadata(e, t) || n || {}, j = (e, t, n) => Reflect.defineMetadata(e, t, n);
function dt(...e) {
  try {
    return JSON.stringify(e), !0;
  } catch {
    return !1;
  }
}
function xe(e) {
  if (e && typeof e == "string") {
    let [t] = e.split(`
`)[2].replace(/at (get)?/, "").match(/.*/g) || [];
    return t && (t = t.trim()), t;
  }
}
const be = {}, se = [];
let _e = !1;
const ut = (e, ...t) => {
  const n = new Error().stack;
  if (!_e)
    console.log("%c TODO", "background: #222; color: #bada55", be), _e = !0;
  else {
    const i = xe(n);
    se.includes(i) === !1 && (se.push(i), Reflect.set(be, `${se.length}) ${e}`, { msg: t, get path() {
      return console.info(t, i), i;
    } }));
  }
  function o(...i) {
  }
  return o;
}, T = (e, t) => !!e && (typeof t == "string" || typeof t == "symbol"), E = (e) => !!e && typeof e == "object" && "kind" in e, Te = (e) => ({
  kind: "class",
  name: e,
  addInitializer: () => {
  },
  metadata: {}
}), Y = /* @__PURE__ */ Symbol("service-key"), ce = new Proxy({}, Reflect);
function Ke(e) {
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
    if (T(o, i)) {
      t(o, i);
      return;
    }
    return i.addInitializer(function() {
      return oe(this, void 0, void 0, function* () {
        const s = Q(e, "instance");
        s && Object.hasOwn(this, i.name) && Reflect.set(this, i.name, s);
      });
    }), (s) => s;
  }
  return n;
}
function Q(e, t) {
  var n;
  const o = P(Y, ce);
  if (typeof e != "string") {
    const i = P(Y, e);
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
function Se(e, t) {
  const n = (i, s) => {
    const r = String(typeof e == "string" && e || typeof e == "object" && e?.id || s?.name || i?.name), l = P(Y, ce), c = new Proxy({
      target: i,
      instance: typeof e == "object" && Reflect.get(e, "transient") || typeof e == "object" && Reflect.get(e, "lazy") ? i : new i(),
      context: s,
      options: e
    }, {
      get(u, g, b) {
        var k, p;
        if (g === "instance" && (!((k = u?.options) === null || k === void 0) && k.transient))
          return new i();
        if (g === "instance" && (!((p = u?.options) === null || p === void 0) && p.lazy) && u.instance === i) {
          const C = new i();
          return Reflect.set(u, g, C, b), C;
        }
        return Reflect.get(u, g, b);
      },
      set(u, g, b, k) {
        return Reflect.set(u, g, b, k);
      }
    });
    l[r] = c, j(Y, l, ce), j(Y, l[r], i);
  };
  function o(i, s) {
    var r, l;
    const c = i.__legacy_source__, u = E(s) ? s : Te((l = (r = c?.name) !== null && r !== void 0 ? r : i?.name) !== null && l !== void 0 ? l : "");
    n(i, u), c && c !== i && j(Y, P(Y, i), c);
  }
  return je.isFunction(e) ? o(e, t) : e ? (i, s) => o(i, s) : o;
}
const ft = (e, t) => {
  const { kind: n = "class", name: o = "", addInitializer: i = () => {
  }, metadata: s } = t?.ctx || {};
  return Se(t)(e, {
    kind: n,
    name: o,
    addInitializer: i,
    metadata: s
  }), Q(e).instance;
};
function ae(e) {
  var t, n, o;
  const i = Object.assign({ enumerable: !1, writable: !0 }, e), s = Object.assign({ configurable: !0, enumerable: !1, writable: !0 }, e), r = {
    configurable: (t = s.configurable) !== null && t !== void 0 ? t : !0,
    enumerable: (n = s.enumerable) !== null && n !== void 0 ? n : !1,
    writable: (o = s.writable) !== null && o !== void 0 ? o : !0,
    value: void 0
  };
  return function(l, c) {
    if (T(l, c)) {
      Object.defineProperty(l, c, {
        configurable: !0,
        enumerable: i.enumerable,
        get() {
        },
        set(u) {
          r.value = u, Object.defineProperty(this, c, r), r.value = void 0;
        }
      });
      return;
    }
    if (E(c)) {
      const u = c;
      return u.kind === "field" ? function(g) {
        return r.value = g, Object.defineProperty(this, u.name, r), r.value = void 0, g;
      } : (u.addInitializer(function() {
        const g = Object.getOwnPropertyDescriptor(this, u.name);
        g && Object.defineProperty(this, u.name, Object.assign(Object.assign({}, g), { enumerable: i.enumerable }));
      }), l);
    }
  };
}
function ht(e, t) {
  return T(e, t) || E(t) ? ae()(e, t) : ae(e);
}
function mt(e, t) {
  const n = (s) => class extends s {
    constructor(...r) {
      super(...r), le(this);
    }
  }, o = (s, r) => {
    if (typeof Reflect?.getOwnMetadataKeys == "function")
      for (const l of Reflect.getOwnMetadataKeys(s)) {
        const c = Reflect.getOwnMetadata(l, s);
        Reflect.defineMetadata(l, c, r);
      }
  };
  function i(s, r) {
    if (!E(r)) {
      const l = s, c = n(l);
      return Object.defineProperty(c, "__legacy_source__", { value: l, configurable: !0 }), o(l, c), c;
    }
    r.addInitializer(function() {
      le(this);
    });
  }
  return e && !E(t) || e ? i(e, t) : i;
}
const B = /* @__PURE__ */ Symbol("field-key"), U = /* @__PURE__ */ Symbol("validation-key"), G = /* @__PURE__ */ Symbol("submit-key"), J = /* @__PURE__ */ Symbol("exclude-key"), ze = /* @__PURE__ */ Symbol("prop-from-view-key");
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
        for (const c of l) {
          const u = c?.name, g = String(u);
          i.has(g) || (i.add(g), n.push(c), o.set(g, c));
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
      const l = [], c = /* @__PURE__ */ new Set();
      let u = t;
      for (; u; ) {
        const g = Reflect.getOwnMetadata(this.metadataKey, u);
        if (Array.isArray(g))
          for (const b of g) {
            const k = b?.name, p = String(k);
            c.has(p) || (c.add(p), l.push(b));
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
class de extends $ {
  constructor() {
    super(...arguments), this.metadataKey = U;
  }
}
class ue extends $ {
  constructor() {
    super(...arguments), this.metadataKey = G;
  }
}
class fe extends $ {
  constructor() {
    super(...arguments), this.metadataKey = J;
  }
}
class he extends $ {
  /**
   * Создать метаданные поля модели.
   */
  constructor(t = {}) {
    super(t), this.factory = null, this.mapping = null, this.noObserve = null, this.collectChanges = !1, this.name = null, this.ctx = null, this.metadataKey = B, this.isInit = !1, this.factory = t.factory, this.mapping = t.mapping, this.noObserve = t.noObserve, this.name = t.name, this.ctx = t.ctx, this.collectChanges = !!t.collectChanges;
  }
}
class me extends $ {
  /**
   * Создать метаданные для PropFromView.
   */
  constructor(t = {}) {
    super(t), this.metadataKey = ze;
    for (const n in this)
      t && n in t && (this[n] = Reflect.get(t, n));
  }
}
function gt(e) {
  const t = (i, s) => {
    const r = new me({ name: e, originName: String(s) });
    r.name = e, r.originName = String(s);
    const l = P(r.metadataKey, i, new Array());
    j(r.metadataKey, [...l, r], i);
  }, n = (i) => {
    i.addInitializer(function() {
      const s = new me(), r = s.fields(this);
      for (const l in this)
        r instanceof Array && i.name === l && (s.name = e, s.originName = l, s.value = this[l], r.push(s));
      j(s.metadataKey, r, this);
    });
  };
  function o(i, s) {
    if (T(i, s)) {
      t(i, s);
      return;
    }
    if (E(s))
      return n(s), s.kind === "field" ? (r) => r : s;
  }
  return e ? ((i, s) => o(i, s)) : ((i) => i);
}
const pe = /* @__PURE__ */ new WeakMap(), Le = (e, t) => {
  if (!e)
    return;
  let n = pe.get(e);
  n || (n = /* @__PURE__ */ new Set(), pe.set(e, n));
  const o = String(t.name);
  if (n.has(o))
    return;
  const i = P(t.metadataKey, e, new Array());
  i.some((s) => s.name === o) || j(t.metadataKey, [...i, t], e), n.add(o);
};
function vt(e) {
  const t = (i, s) => {
    const r = new fe({ callback: e, name: String(s) }), l = P(r.metadataKey, i, new Array());
    j(r.metadataKey, [...l, r], i);
  }, n = (i) => {
    i.addInitializer(function() {
      const s = new fe({ callback: e, name: String(i.name) });
      Le(Object.getPrototypeOf(this), s);
    });
  };
  function o(i, s) {
    if (T(i, s)) {
      t(i, s);
      return;
    }
    if (E(s))
      return n(s), s.kind === "field" ? void 0 : s;
  }
  if (e)
    return ((i, s) => o(i, s));
}
const We = new ue(), qe = new he(), Be = new de(), Ye = new fe();
let Ne = (() => {
  var e, t, n, o, i, s, r, l, c, u, g, b, k, p, C;
  let S = [], D, K = [], W = [], F, _, d, A, z, Z, ee, X;
  return e = class {
    get initData() {
      return I(this, t, "f");
    }
    set initData(a) {
      V(this, t, a, "f");
    }
    // @define_prop
    get committedData() {
      return I(this, n, "f");
    }
    set committedData(a) {
      V(this, n, a, "f");
    }
    // @define_prop
    get modified_() {
      return I(this, o, "f");
    }
    set modified_(a) {
      V(this, o, a, "f");
    }
    // @define_prop
    get legacyInitDone() {
      return I(this, i, "f");
    }
    set legacyInitDone(a) {
      V(this, i, a, "f");
    }
    // @define_prop
    get options() {
      return I(this, s, "f");
    }
    set options(a) {
      V(this, s, a, "f");
    }
    get [(t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), i = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap(), g = (D = [H], B))]() {
      return I(this, r, "f");
    }
    set [g](a) {
      V(this, r, a, "f");
    }
    get [b = G]() {
      return I(this, l, "f");
    }
    set [b](a) {
      V(this, l, a, "f");
    }
    get [k = J]() {
      return I(this, c, "f");
    }
    set [k](a) {
      V(this, c, a, "f");
    }
    get [p = U]() {
      return I(this, u, "f");
    }
    set [p](a) {
      V(this, u, a, "f");
    }
    /**
     * Создает модель и инициализирует данные.
     */
    constructor(a = {}, f) {
      t.set(this, (q(this, S), q(this, K, null))), n.set(this, (q(this, W), {})), o.set(this, {}), i.set(this, !1), s.set(this, {}), r.set(this, void 0), l.set(this, void 0), c.set(this, void 0), u.set(this, void 0), this.options = f, this.init(a), this.initLegacyFields();
    }
    getFieldMetaCache() {
      const a = Reflect.getOwnMetadata(B, this), f = Object.getPrototypeOf(this), h = f ? Reflect.getOwnMetadata(B, f) : null, m = this[B];
      if (m && m !== !0 && m.ownRef === a && m.protoRef === h)
        return m;
      const O = qe.fields(this), v = /* @__PURE__ */ new Map();
      for (const y of O)
        v.set(String(y.name), y);
      return this[B] = { ownRef: a, protoRef: h, list: O, map: v }, this[B];
    }
    getFieldMeta(a) {
      return this.getFieldMetaCache().map.get(String(a));
    }
    getSubmitMetaCache() {
      const a = Reflect.getOwnMetadata(G, this), f = Object.getPrototypeOf(this), h = f ? Reflect.getOwnMetadata(G, f) : null, m = this[G];
      if (m && m !== !0 && m.ownRef === a && m.protoRef === h)
        return m;
      const O = We.fields(this), v = /* @__PURE__ */ new Map();
      for (const M of O)
        v.set(String(M.name), M);
      const y = { ownRef: a, protoRef: h, list: O, map: v };
      return this[G] = y, y;
    }
    getExcludeMetaCache() {
      const a = Reflect.getOwnMetadata(J, this), f = Object.getPrototypeOf(this), h = f ? Reflect.getOwnMetadata(J, f) : null, m = this[J];
      if (m && m !== !0 && m.ownRef === a && m.protoRef === h)
        return m;
      const O = Ye.fields(this), v = /* @__PURE__ */ new Map();
      for (const M of O)
        v.set(String(M.name), M);
      const y = { ownRef: a, protoRef: h, list: O, map: v };
      return this[J] = y, y;
    }
    getValidationMetaCache() {
      const a = Reflect.getOwnMetadata(U, this), f = Object.getPrototypeOf(this), h = f ? Reflect.getOwnMetadata(U, f) : null, m = this[U];
      if (m && m !== !0 && m.ownRef === a && m.protoRef === h)
        return m;
      const O = Be.fields(this), v = /* @__PURE__ */ new Map();
      for (const M of O)
        v.set(String(M.name), M);
      const y = { ownRef: a, protoRef: h, list: O, map: v };
      return this[U] = y, y;
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
      return a = ye(a) ? a : H.box(a), new Proxy(a, {
        get: (O, v, y) => {
          const M = Reflect.get(O, v, y);
          return M && typeof M == "object" && !(M instanceof e) && !ye(a) ? this.createObservable(M, String(v), f, `${m}.${String(v)}`) : M;
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
          L(() => f.set(O)), this.checkChange(m.name, f.get());
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
      const h = Reflect.get(this.committedData, a) || Reflect.get(this.initData, a), m = a && a in this.initData && !ve(h, f);
      return L(() => {
        if (m) {
          Reflect.set(this.modified_, a, h);
          return;
        }
        a in this.modified_ && ve(h, f) && delete this.modified_[a];
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
      return !De(this.modified_);
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
        const y = Reflect.get(this, v), M = f.get(v), ne = M?.callback;
        return typeof ne == "function" ? ne(y, this) : y;
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
    F = [N], _ = [x], d = [x], A = [x], z = [x], Z = [N], ee = [N], X = [(C = N).struct.bind(C)], w(e, null, D, { kind: "accessor", name: "initData", static: !1, private: !1, access: { has: (a) => "initData" in a, get: (a) => a.initData, set: (a, f) => {
      a.initData = f;
    } }, metadata: R }, K, W), w(e, null, F, { kind: "getter", name: "dirty", static: !1, private: !1, access: { has: (a) => "dirty" in a, get: (a) => a.dirty }, metadata: R }, null, S), w(e, null, _, { kind: "method", name: "commit", static: !1, private: !1, access: { has: (a) => "commit" in a, get: (a) => a.commit }, metadata: R }, null, S), w(e, null, d, { kind: "method", name: "commitField", static: !1, private: !1, access: { has: (a) => "commitField" in a, get: (a) => a.commitField }, metadata: R }, null, S), w(e, null, A, { kind: "method", name: "reject", static: !1, private: !1, access: { has: (a) => "reject" in a, get: (a) => a.reject }, metadata: R }, null, S), w(e, null, z, { kind: "method", name: "toInit", static: !1, private: !1, access: { has: (a) => "toInit" in a, get: (a) => a.toInit }, metadata: R }, null, S), w(e, null, Z, { kind: "getter", name: "validation", static: !1, private: !1, access: { has: (a) => "validation" in a, get: (a) => a.validation }, metadata: R }, null, S), w(e, null, ee, { kind: "getter", name: "validAndDirty", static: !1, private: !1, access: { has: (a) => "validAndDirty" in a, get: (a) => a.validAndDirty }, metadata: R }, null, S), w(e, null, X, { kind: "getter", name: "service", static: !1, private: !1, access: { has: (a) => "service" in a, get: (a) => a.service }, metadata: R }, null, S), R && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: R });
  })(), e;
})();
const we = /* @__PURE__ */ new WeakMap(), Qe = (e, t) => {
  if (!e)
    return;
  let n = we.get(e);
  n || (n = /* @__PURE__ */ new Set(), we.set(e, n));
  const o = String(t.name);
  if (n.has(o))
    return;
  const i = P(t.metadataKey, e, new Array());
  i.some((s) => s.name === o) || j(t.metadataKey, [...i, t], e), n.add(o);
}, ge = function(t, n) {
  const o = T(t, n) ? void 0 : t, i = (l, c) => {
    const u = new he(Object.assign(Object.assign({}, o), { name: String(c), ctx: null }));
    j(u.metadataKey, [...P(u.metadataKey, l, new Array()), u], l), Object.getOwnPropertyDescriptor(l, c) || Object.defineProperty(l, c, {
      configurable: !0,
      enumerable: !0,
      get() {
        if (Object.prototype.hasOwnProperty.call(this, c))
          return Reflect.get(this, c);
        if (this.initData && c in this.initData && typeof this.initField == "function")
          return this.initField.call(this, String(c), { skipValidation: !0 }), Reflect.get(this, c);
      },
      set(b) {
        if (this.initData && !(c in this.initData) && Reflect.set(this.initData, c, b), typeof this.initField == "function") {
          this.initField.call(this, String(c), { skipValidation: !0 });
          return;
        }
        Object.defineProperty(this, c, {
          value: b,
          writable: !0,
          configurable: !0,
          enumerable: !0
        });
      }
    });
  }, s = (l) => {
    l.addInitializer(function() {
      if (this instanceof Ne && typeof this.initField == "function") {
        const c = new he(Object.assign(Object.assign({}, o), { name: String(l.name), ctx: l }));
        Qe(Object.getPrototypeOf(this), c), this.initField.call(this, String(l.name));
      }
    });
  };
  function r(l, c) {
    if (T(l, c)) {
      i(l, c);
      return;
    }
    if (E(c))
      return s(c), c.kind === "field" ? (u) => u : c;
  }
  return T(t, n) ? r(t, n) : o && !E(n) ? (l, c) => r(l, c) : E(n) ? r(void 0, n) : (l, c) => r(l, c);
}, $e = (e) => !e || typeof e != "object" ? { noObserve: !0 } : Object.assign(Object.assign({}, e), { noObserve: !0 }), Ue = function(t, n) {
  return T(t, n) || E(n) ? ge({ noObserve: !0 })(t, n) : ge($e(t));
};
ge.noObserve = Ue;
const Oe = /* @__PURE__ */ new WeakMap(), Ge = (e, t) => {
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
function bt(e) {
  const t = (i, s) => {
    const r = new ue({ callback: e, name: String(s) }), l = P(r.metadataKey, i, new Array());
    j(r.metadataKey, [...l, r], i);
  }, n = (i) => {
    const s = new ue({ callback: e, name: String(i.name) });
    i.addInitializer(function() {
      Ge(Object.getPrototypeOf(this), s);
    });
  };
  function o(i, s) {
    if (T(i, s)) {
      t(i, s);
      return;
    }
    if (E(s))
      return n(s), s.kind === "field" ? (r) => r : s;
  }
  return e ? ((i, s) => o(i, s)) : ((i) => i);
}
const Me = /* @__PURE__ */ new WeakMap(), Je = (e, t) => {
  if (!e)
    return;
  let n = Me.get(e);
  n || (n = /* @__PURE__ */ new Set(), Me.set(e, n));
  const o = String(t.name);
  if (n.has(o))
    return;
  const i = P(t.metadataKey, e, new Array());
  i.some((s) => s.name === o) || j(t.metadataKey, [...i, t], e), n.add(o);
};
function _t(e) {
  const t = (i, s) => {
    const r = new de({ callback: e, name: String(s) }), l = P(r.metadataKey, i, new Array());
    j(r.metadataKey, [...l, r], i);
  }, n = (i) => {
    const s = new de({ callback: e, name: String(i.name) });
    i.addInitializer(function() {
      Je(Object.getPrototypeOf(this), s);
    });
  };
  function o(i, s) {
    if (T(i, s)) {
      t(i, s);
      return;
    }
    if (E(s))
      return n(s), s.kind === "field" ? (r) => r : s;
  }
  return e ? ((i, s) => o(i, s)) : ((i) => i);
}
const Xe = (e) => ({
  items: e.items.map((t) => {
    var n, o;
    return {
      name: (o = (n = t.constructor) === null || n === void 0 ? void 0 : n.name) !== null && o !== void 0 ? o : "Model",
      data: t.service.dumpData
    };
  })
});
let ie = (() => {
  var e, t, n;
  let o = [], i, s = [], r = [], l, c = [], u = [], g, b, k, p, C, S, D, K, W, F;
  return e = class {
    get items() {
      return I(this, t, "f");
    }
    set items(d) {
      V(this, t, d, "f");
    }
    get _cash() {
      return I(this, n, "f");
    }
    set _cash(d) {
      V(this, n, d, "f");
    }
    constructor() {
      t.set(this, (q(this, o), q(this, s, []))), n.set(this, (q(this, r), q(this, c, []))), this._model = q(this, u), le(this);
    }
    add(d) {
      this.items.push(d);
    }
    addMany(d) {
      d?.length && (this.items = this.items.concat(d));
    }
    remove(d) {
      this.items = this.items.filter((A) => A !== d);
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
    findBy(d, A) {
      return this.items.find((z) => z?.[d] === A);
    }
    clear() {
      this.items = [];
    }
    get size() {
      return this.items.length;
    }
    get snapshot() {
      return Xe(this);
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
    applyLoaded(d, A = {}) {
      const { model: z, mode: Z = "replace", cash: ee = !0 } = A, X = z === void 0 ? this._model : z;
      ee && this.setCash(d);
      const R = X ? d.map((a) => new X(a)) : d;
      if (Z === "append") {
        this.addMany(R);
        return;
      }
      this.items = R;
    }
    /**
     * Сохранить оригинальные данные стора.
     */
    setCash(d) {
      this._cash = d ?? [];
    }
  }, t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), (() => {
    const _ = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    i = [H], l = [H], g = [x], b = [x], k = [x], p = [x], C = [N], S = [N], D = [N], K = [x], W = [x], F = [x], w(e, null, i, { kind: "accessor", name: "items", static: !1, private: !1, access: { has: (d) => "items" in d, get: (d) => d.items, set: (d, A) => {
      d.items = A;
    } }, metadata: _ }, s, r), w(e, null, l, { kind: "accessor", name: "_cash", static: !1, private: !1, access: { has: (d) => "_cash" in d, get: (d) => d._cash, set: (d, A) => {
      d._cash = A;
    } }, metadata: _ }, c, u), w(e, null, g, { kind: "method", name: "add", static: !1, private: !1, access: { has: (d) => "add" in d, get: (d) => d.add }, metadata: _ }, null, o), w(e, null, b, { kind: "method", name: "addMany", static: !1, private: !1, access: { has: (d) => "addMany" in d, get: (d) => d.addMany }, metadata: _ }, null, o), w(e, null, k, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (d) => "remove" in d, get: (d) => d.remove }, metadata: _ }, null, o), w(e, null, p, { kind: "method", name: "clear", static: !1, private: !1, access: { has: (d) => "clear" in d, get: (d) => d.clear }, metadata: _ }, null, o), w(e, null, C, { kind: "getter", name: "size", static: !1, private: !1, access: { has: (d) => "size" in d, get: (d) => d.size }, metadata: _ }, null, o), w(e, null, S, { kind: "getter", name: "snapshot", static: !1, private: !1, access: { has: (d) => "snapshot" in d, get: (d) => d.snapshot }, metadata: _ }, null, o), w(e, null, D, { kind: "getter", name: "cash", static: !1, private: !1, access: { has: (d) => "cash" in d, get: (d) => d.cash }, metadata: _ }, null, o), w(e, null, K, { kind: "method", name: "reset", static: !1, private: !1, access: { has: (d) => "reset" in d, get: (d) => d.reset }, metadata: _ }, null, o), w(e, null, W, { kind: "method", name: "applyLoaded", static: !1, private: !1, access: { has: (d) => "applyLoaded" in d, get: (d) => d.applyLoaded }, metadata: _ }, null, o), w(e, null, F, { kind: "method", name: "setCash", static: !1, private: !1, access: { has: (d) => "setCash" in d, get: (d) => d.setCash }, metadata: _ }, null, o), _ && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: _ });
  })(), e;
})();
const Re = function(t) {
  return new.target ? Reflect.construct(ie, [], new.target) : class extends ie {
    constructor() {
      super(), this._model = t;
    }
  };
};
Re.prototype = ie.prototype;
Object.setPrototypeOf(Re, ie);
function Ot(e) {
  return Q(e, "instance");
}
function Mt(e) {
  return ((t, n) => Ke(e)(t, n));
}
function kt(e, t) {
  const n = (o, i) => {
    var s;
    const r = typeof e == "string" ? { id: e } : typeof e == "object" ? e : { id: (s = i?.name) !== null && s !== void 0 ? s : o?.name };
    Se(r)(o, i);
  };
  return typeof e == "function" ? n(e, t) : (o, i) => n(o, i);
}
class St {
}
const re = new me(), He = (e) => typeof Node < "u" && e instanceof Node, Ze = (e) => {
  if (e == null)
    return !0;
  const t = typeof e;
  return t === "function" ? !1 : t !== "object" ? !0 : Ve(e) ? !1 : !He(e);
}, et = (e, t) => {
  if (!Ze(t))
    throw new TypeError(`PropFromView only accepts object or primitive values; functions, React elements, and DOM nodes are not allowed for prop "${e}".`);
};
function Rt(e, t) {
  return Fe((n = {}) => {
    const { resolved: o, instance: i } = Ae(() => {
      const r = Q(e) || (typeof e != "string" ? { instance: new e() } : void 0), l = r?.instance;
      return { resolved: r, instance: l };
    }, [e]);
    if (Ie(() => {
      if (i)
        return typeof i.onInit == "function" && i.onInit(), () => {
          typeof i.onDispose == "function" && i.onDispose();
        };
    }, [i]), o) {
      const s = re.fields(i), r = s.length > 0 ? s : re.fields(Object.getPrototypeOf(i));
      for (const l in n)
        if (r instanceof Array) {
          const c = r.find((u) => u.name === l);
          if (c) {
            const u = Reflect.get(n, l);
            et(l, u), Reflect.set(i, c.originName, u);
          }
        }
      return j(re.metadataKey, r, i), t(Object.assign({ viewModel: i }, n));
    }
    return t(Object.assign({}, n));
  });
}
const ke = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, tt = {
  load: "load",
  failure: "failure",
  ready: "ready",
  canceled: "canceled",
  disposed: "disposed"
}, te = () => {
};
class it {
  /**
   * @param fn Асинхронная функция, которую выполняет команда.
   *           Если `abortable=true`, в неё будет передан `AbortSignal` последним аргументом.
   * @param opt Опции команды.
   */
  constructor(t, n) {
    var o, i, s, r, l, c, u;
    this.isExecuting = !1, this.activeCount = 0, this.isCanceled = !1, this.isDisposed = !1, this.error = null, this.result = void 0, this.controllers = /* @__PURE__ */ new Set(), this.queue = [], this.runningPromise = null, this.queueTail = Promise.resolve(), this.cancelToken = 0, this.fn = t, this.opt = Object.assign({ concurrency: (o = n?.concurrency) !== null && o !== void 0 ? o : "ignore", trackError: (i = n?.trackError) !== null && i !== void 0 ? i : !0, resetErrorOnExecute: (s = n?.resetErrorOnExecute) !== null && s !== void 0 ? s : !0, swallowError: (r = n?.swallowError) !== null && r !== void 0 ? r : !0, abortable: (l = n?.abortable) !== null && l !== void 0 ? l : !1 }, n), this.states = Object.assign(Object.assign({}, ke), (c = n?.states) !== null && c !== void 0 ? c : {}), this.stateKeys = Object.assign(Object.assign({}, tt), (u = n?.stateKeys) !== null && u !== void 0 ? u : {}), Ce(this, {
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
  /**
   * Можно ли выполнить команду прямо сейчас.
   * Учитывает:
   * - dispose
   * - `opt.canExecute(scope)`
   * - политику конкурентности: для `"ignore"` запрещает запуск при `isExecuting=true`
   */
  get canExecute() {
    return this.isDisposed || !(this.opt.canExecute ? this.opt.canExecute(this.getScope()) : !0) ? !1 : this.opt.concurrency === "ignore" ? !this.isExecuting : !0;
  }
  /**
   * Разрешает лейбл состояния по “роли” (load/ready/failure/...) с учётом stateKeys/states.
   */
  resolveState(t) {
    var n, o;
    const i = (n = this.stateKeys[t]) !== null && n !== void 0 ? n : t;
    return (o = this.states[i]) !== null && o !== void 0 ? o : ke[t];
  }
  /**
   * Возвращает текущий scope (снимок) для передачи в `canExecute`.
   */
  getScope() {
    return {
      state: this.state,
      states: this.states,
      isExecuting: this.isExecuting,
      activeCount: this.activeCount,
      isCanceled: this.isCanceled,
      isDisposed: this.isDisposed,
      error: this.error,
      result: this.result
    };
  }
  /**
   * Computed “машина состояний”.
   *
   * Приоритет:
   * 1) disposed
   * 2) load (если выполняется)
   * 3) failure (если есть error)
   * 4) canceled (если isCanceled)
   * 5) ready
   */
  get state() {
    return this.isDisposed ? this.resolveState("disposed") : this.isExecuting ? this.resolveState("load") : this.error ? this.resolveState("failure") : this.isCanceled ? this.resolveState("canceled") : this.resolveState("ready");
  }
  /**
   * Сбрасывает `error`.
   */
  resetError() {
    this.error = null;
  }
  /**
   * Отменяет текущие активные выполнения:
   * - увеличивает cancelToken (помечает текущий запуск “устаревшим”)
   * - ставит isCanceled=true
   * - вызывает onCancel
   * - при cancelQueued=true — очищает очередь
   * - при abortable=true — abort() все активные AbortController
   */
  cancel() {
    var t, n;
    this.cancelToken += 1, this.isCanceled = !0, this.result = void 0, (n = (t = this.opt).onCancel) === null || n === void 0 || n.call(t), this.opt.cancelQueued && this.clearQueue();
    for (const o of this.controllers)
      o.abort();
  }
  /**
   * Помечает команду как уничтоженную, очищает очередь и отменяет активные выполнения.
   * После dispose новые execute() не выполняются.
   */
  dispose() {
    this.isDisposed || (this.isDisposed = !0, this.result = void 0, this.clearQueue(), this.cancel());
  }
  /**
   * Очищает очередь (concurrency="queue").
   * Все ожидающие элементы резолвятся в `undefined`.
   */
  clearQueue() {
    if (this.queue.length === 0)
      return;
    const t = this.queue.splice(0, this.queue.length);
    for (const n of t)
      n.canceled = !0, n.settled || (n.settled = !0, n.resolve(void 0));
  }
  /**
   * Выполняет команду с учётом выбранной конкурентности.
   *
   * @remarks
   * Возвращаемое значение часто типизируется как `TResult | undefined`, потому что:
   * - при отмене/abort результат принудительно становится `undefined`
   * - при swallowError=true ошибка не пробрасывается, а возвращается `undefined`
   */
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
    }, i = () => oe(this, void 0, void 0, function* () {
      var s, r, l, c, u, g, b, k;
      if (this.isDisposed)
        return;
      const p = this.opt.abortable ? new AbortController() : null;
      p && this.controllers.add(p), L(() => {
        this.activeCount += 1, this.isExecuting = this.activeCount > 0, this.isCanceled = !1, this.result = void 0, this.opt.trackError && this.opt.resetErrorOnExecute && (this.error = null);
      });
      const C = this.cancelToken;
      let S = !1, D = !1, K = null, W = null;
      try {
        (r = (s = this.opt).onStart) === null || r === void 0 || r.call(s, ...t);
        const F = this.opt.abortable ? p.signal : void 0;
        W = this.fn(...t, F);
        const _ = yield W;
        if (D = this.cancelToken !== C, D) {
          L(() => {
            this.isCanceled = !0, this.result = void 0;
          });
          return;
        }
        return L(() => {
          this.result = _;
        }), (c = (l = this.opt).onSuccess) === null || c === void 0 || c.call(l, _, ...t), S = !0, _;
      } catch (F) {
        if (this.opt.abortable && p?.signal.aborted) {
          L(() => {
            this.isCanceled = !0, this.result = void 0;
          }), D = !0, K = null;
          return;
        }
        if (K = F, D = this.cancelToken !== C, L(() => {
          this.result = void 0, this.opt.trackError && (this.error = F);
        }), (g = (u = this.opt).onError) === null || g === void 0 || g.call(u, F), !this.opt.swallowError)
          throw F;
        return;
      } finally {
        L(() => {
          this.activeCount = Math.max(0, this.activeCount - 1), this.isExecuting = this.activeCount > 0;
        }), p && this.controllers.delete(p), !D && this.cancelToken !== C && (D = !0), (k = (b = this.opt).onFinally) === null || k === void 0 || k.call(b, { ok: S, canceled: D, error: K }, ...t);
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
        const c = () => oe(this, void 0, void 0, function* () {
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
        }), u = l ? c() : this.queueTail.then(c, c);
        return this.queueTail = u.then(te, te), o(r.promise);
      }
      default:
        return this.isExecuting && this.runningPromise ? this.runningPromise : o(i());
    }
  }
}
function nt(e, t) {
  return new it(e, t);
}
function jt(e, t) {
  const n = Ee(e), o = /* @__PURE__ */ new Set(), i = t?.onCancel;
  return nt((...r) => {
    const l = n(...r);
    o.add(l);
    const c = () => {
      o.delete(l);
    };
    return l.then(c, c), new Promise((u, g) => {
      l.then(u, (b) => {
        if (Pe(b)) {
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
function Dt(e) {
  return function(...t) {
    return L(() => e.apply(this, t));
  };
}
export {
  Q as GetService,
  Ot as GetStore,
  Ke as Inject,
  Mt as InjectStore,
  mt as MakeObservable,
  Ne as Model,
  gt as PropFromView,
  Se as Service,
  ft as SetService,
  kt as Store,
  Re as StoreBase,
  ut as TODO,
  St as ViewModel,
  nt as asyncCommand,
  Dt as commandAction,
  j as defineMetadata,
  ht as define_prop,
  vt as exclude,
  ge as field,
  jt as flowCommand,
  xe as getExecutingFunctionNameByStack,
  P as getOwnMetadata,
  dt as isSerializable,
  bt as submit,
  _t as validation,
  Rt as view
};
