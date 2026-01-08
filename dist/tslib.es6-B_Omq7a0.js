function v(t, n, r, e, o, f) {
  function s(w) {
    if (w !== void 0 && typeof w != "function") throw new TypeError("Function expected");
    return w;
  }
  for (var p = e.kind, l = p === "getter" ? "get" : p === "setter" ? "set" : "value", c = !n && t ? e.static ? t : t.prototype : null, a = n || (c ? Object.getOwnPropertyDescriptor(c, e.name) : {}), i, m = !1, y = r.length - 1; y >= 0; y--) {
    var h = {};
    for (var d in e) h[d] = d === "access" ? {} : e[d];
    for (var d in e.access) h.access[d] = e.access[d];
    h.addInitializer = function(w) {
      if (m) throw new TypeError("Cannot add initializers after decoration has completed");
      f.push(s(w || null));
    };
    var u = (0, r[y])(p === "accessor" ? { get: a.get, set: a.set } : a[l], h);
    if (p === "accessor") {
      if (u === void 0) continue;
      if (u === null || typeof u != "object") throw new TypeError("Object expected");
      (i = s(u.get)) && (a.get = i), (i = s(u.set)) && (a.set = i), (i = s(u.init)) && o.unshift(i);
    } else (i = s(u)) && (p === "field" ? o.unshift(i) : a[l] = i);
  }
  c && Object.defineProperty(c, e.name, a), m = !0;
}
function E(t, n, r) {
  for (var e = arguments.length > 2, o = 0; o < n.length; o++)
    r = e ? n[o].call(t, r) : n[o].call(t);
  return e ? r : void 0;
}
function _(t, n, r, e) {
  function o(f) {
    return f instanceof r ? f : new r(function(s) {
      s(f);
    });
  }
  return new (r || (r = Promise))(function(f, s) {
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
    c((e = e.apply(t, n || [])).next());
  });
}
function b(t, n, r, e) {
  if (r === "a" && !e) throw new TypeError("Private accessor was defined without a getter");
  if (typeof n == "function" ? t !== n || !e : !n.has(t)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return r === "m" ? e : r === "a" ? e.call(t) : e ? e.value : n.get(t);
}
function g(t, n, r, e, o) {
  if (e === "m") throw new TypeError("Private method is not writable");
  if (e === "a" && !o) throw new TypeError("Private accessor was defined without a setter");
  if (typeof n == "function" ? t !== n || !o : !n.has(t)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e === "a" ? o.call(t, r) : o ? o.value = r : n.set(t, r), r;
}
export {
  b as _,
  g as a,
  E as b,
  v as c,
  _ as d
};
//# sourceMappingURL=tslib.es6-B_Omq7a0.js.map
