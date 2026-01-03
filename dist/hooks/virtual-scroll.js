import { _ as k, a as I, b as m, c as v } from "../tslib.es6-COgJoJmX.js";
import { makeObservable as L, action as w, observable as y } from "mobx";
import { useMemo as A, useEffect as f } from "react";
let P = (() => {
  var e, r, o, s, n, h;
  let c = [], _, p = [], i = [], d, u = [], H = [], M, T, b;
  return e = class {
    get scrollTop() {
      return k(this, r, "f");
    }
    set scrollTop(t) {
      I(this, r, t, "f");
    }
    get viewportHeight() {
      return k(this, o, "f");
    }
    set viewportHeight(t) {
      I(this, o, t, "f");
    }
    constructor({ rowHeight: t, overscan: a = 0 }) {
      r.set(this, (m(this, c), m(this, p, 0))), o.set(this, (m(this, i), m(this, u, 0))), this.overscan = m(this, H), this.rowHeight = t > 0 ? t : 1, this.overscan = Math.max(0, a), L(this);
    }
    setScrollTop(t) {
      this.scrollTop = Math.max(0, t);
    }
    setViewportHeight(t) {
      this.viewportHeight = Math.max(0, t);
    }
    updateMetrics(t, a) {
      this.scrollTop = Math.max(0, t), this.viewportHeight = Math.max(0, a);
    }
    setRowHeight(t) {
      this.rowHeight = t > 0 ? t : 1;
    }
    setOverscan(t) {
      this.overscan = Math.max(0, t);
    }
    getSlice(t) {
      const a = t.length, g = this.rowHeight > 0 ? this.rowHeight : 1, S = Math.max(0, this.scrollTop), E = Math.max(0, this.viewportHeight), x = Math.max(0, this.overscan), O = a * g, V = Math.max(0, Math.floor(S / g) - x), z = Math.min(a, Math.ceil((S + E) / g) + x), F = t.slice(V, z);
      return { total: a, totalHeight: O, startIndex: V, endIndex: z, visibleItems: F };
    }
  }, r = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), (() => {
    const l = typeof Symbol == "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
    _ = [y], d = [y], M = [(s = w).bound.bind(s)], T = [(n = w).bound.bind(n)], b = [(h = w).bound.bind(h)], v(e, null, _, { kind: "accessor", name: "scrollTop", static: !1, private: !1, access: { has: (t) => "scrollTop" in t, get: (t) => t.scrollTop, set: (t, a) => {
      t.scrollTop = a;
    } }, metadata: l }, p, i), v(e, null, d, { kind: "accessor", name: "viewportHeight", static: !1, private: !1, access: { has: (t) => "viewportHeight" in t, get: (t) => t.viewportHeight, set: (t, a) => {
      t.viewportHeight = a;
    } }, metadata: l }, u, H), v(e, null, M, { kind: "method", name: "setScrollTop", static: !1, private: !1, access: { has: (t) => "setScrollTop" in t, get: (t) => t.setScrollTop }, metadata: l }, null, c), v(e, null, T, { kind: "method", name: "setViewportHeight", static: !1, private: !1, access: { has: (t) => "setViewportHeight" in t, get: (t) => t.setViewportHeight }, metadata: l }, null, c), v(e, null, b, { kind: "method", name: "updateMetrics", static: !1, private: !1, access: { has: (t) => "updateMetrics" in t, get: (t) => t.updateMetrics }, metadata: l }, null, c), l && Object.defineProperty(e, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: l });
  })(), e;
})();
const D = ({ overscan: e = 0, rowHeight: r, targetRef: o }) => {
  const s = A(() => new P({ rowHeight: r, overscan: e }), []);
  return f(() => {
    if (typeof window > "u")
      return;
    let n = null, h = null, c = !0;
    const _ = (i) => {
      const d = () => s.setScrollTop(i.scrollTop), u = () => s.setViewportHeight(i.clientHeight);
      s.updateMetrics(i.scrollTop, i.clientHeight), i.addEventListener("scroll", d, { passive: !0 }), window.addEventListener("resize", u), n = () => {
        i.removeEventListener("scroll", d), window.removeEventListener("resize", u);
      };
    }, p = () => {
      if (!c)
        return;
      const i = o.current;
      if (i) {
        _(i);
        return;
      }
      h = window.requestAnimationFrame(p);
    };
    return p(), () => {
      c = !1, h !== null && window.cancelAnimationFrame(h), n && n();
    };
  }, [s, o]), f(() => {
    s.setRowHeight(r);
  }, [s, r]), f(() => {
    s.setOverscan(e);
  }, [s, e]), s;
};
export {
  P as VirtualScroll,
  D as useVirtualScroller
};
//# sourceMappingURL=virtual-scroll.js.map
