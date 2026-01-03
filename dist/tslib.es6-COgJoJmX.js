function v(r, n, t, e, o, f) {
  function s(w) {
    if (w !== void 0 && typeof w != "function") throw new TypeError("Function expected");
    return w;
  }
  for (var p = e.kind, l = p === "getter" ? "get" : p === "setter" ? "set" : "value", c = !n && r ? e.static ? r : r.prototype : null, a = n || (c ? Object.getOwnPropertyDescriptor(c, e.name) : {}), i, m = !1, y = t.length - 1; y >= 0; y--) {
    var h = {};
    for (var d in e) h[d] = d === "access" ? {} : e[d];
    for (var d in e.access) h.access[d] = e.access[d];
    h.addInitializer = function(w) {
      if (m) throw new TypeError("Cannot add initializers after decoration has completed");
      f.push(s(w || null));
    };
    var u = (0, t[y])(p === "accessor" ? { get: a.get, set: a.set } : a[l], h);
    if (p === "accessor") {
      if (u === void 0) continue;
      if (u === null || typeof u != "object") throw new TypeError("Object expected");
      (i = s(u.get)) && (a.get = i), (i = s(u.set)) && (a.set = i), (i = s(u.init)) && o.unshift(i);
    } else (i = s(u)) && (p === "field" ? o.unshift(i) : a[l] = i);
  }
  c && Object.defineProperty(c, e.name, a), m = !0;
}
function _(r, n, t) {
  for (var e = arguments.length > 2, o = 0; o < n.length; o++)
    t = e ? n[o].call(r, t) : n[o].call(r);
  return e ? t : void 0;
}
function E(r) {
  return typeof r == "symbol" ? r : "".concat(r);
}
function b(r, n, t, e) {
  function o(f) {
    return f instanceof t ? f : new t(function(s) {
      s(f);
    });
  }
  return new (t || (t = Promise))(function(f, s) {
    function p(a) {
      try {
        c(e.next(a));
      } catch (i) {
        s(i);
      }
    }
    function l(a) {
      try {
        c(e.throw(a));
      } catch (i) {
        s(i);
      }
    }
    function c(a) {
      a.done ? f(a.value) : o(a.value).then(p, l);
    }
    c((e = e.apply(r, n || [])).next());
  });
}
function g(r, n, t, e) {
  if (t === "a" && !e) throw new TypeError("Private accessor was defined without a getter");
  if (typeof n == "function" ? r !== n || !e : !n.has(r)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? e : t === "a" ? e.call(r) : e ? e.value : n.get(r);
}
function T(r, n, t, e, o) {
  if (e === "m") throw new TypeError("Private method is not writable");
  if (e === "a" && !o) throw new TypeError("Private accessor was defined without a setter");
  if (typeof n == "function" ? r !== n || !o : !n.has(r)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e === "a" ? o.call(r, t) : o ? o.value = t : n.set(r, t), t;
}
export {
  g as _,
  T as a,
  _ as b,
  v as c,
  b as d,
  E as e
};
//# sourceMappingURL=tslib.es6-COgJoJmX.js.map
