import { d as v } from "../tslib.es6-B_Omq7a0.js";
import m from "node:fs/promises";
import a from "node:path";
import l from "typescript";
const Q = "Service", Y = "Store", I = "rvm-toolkit";
function re() {
  let P, p = "", u = "";
  function W() {
    return v(this, void 0, void 0, function* () {
      const t = yield K(p);
      for (const i of t)
        yield k(i);
    });
  }
  function z() {
    return v(this, void 0, void 0, function* () {
      if (!u || (yield b(u)))
        return;
      const i = yield L(p);
      if (i.length === 0) {
        const o = [
          `declare module "${I}" {`,
          "  interface DiServices {}",
          "}",
          ""
        ].join(`
`);
        yield m.writeFile(u, o, "utf8");
        return;
      }
      const e = [], r = [], n = [];
      for (const o of i) {
        const c = yield m.readFile(o, "utf8"), f = _(o), d = N(o), $ = g(a.dirname(u), o);
        c.includes(`export interface ${f}`) && (e.push(`import type { ${f} } from "${$}";`), r.push(f)), c.includes(`export interface ${d}`) && (e.push(`import type { ${d} } from "${$}";`), n.push(d));
      }
      const s = [
        ...e,
        "",
        `declare module "${I}" {`,
        r.length ? `  interface DiServices extends ${r.join(", ")} {}` : "  interface DiServices {}",
        n.length ? `  interface DiStores extends ${n.join(", ")} {}` : "  interface DiStores {}",
        "}",
        ""
      ].join(`
`);
      yield m.writeFile(u, s, "utf8");
    });
  }
  function k(t) {
    return v(this, void 0, void 0, function* () {
      const i = yield B(t);
      for (const e of i)
        yield M(e);
    });
  }
  function B(t) {
    return v(this, void 0, void 0, function* () {
      var i, e;
      const r = yield m.readFile(t, "utf8"), n = t.endsWith(".tsx") ? l.ScriptKind.TSX : l.ScriptKind.TS, s = l.createSourceFile(t, r, l.ScriptTarget.Latest, !0, n), o = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set();
      for (const d of s.statements) {
        if (!l.isImportDeclaration(d) || d.moduleSpecifier.getText(s).replace(/['"]/g, "") !== I)
          continue;
        const h = d.importClause;
        if (!(!h?.namedBindings || !l.isNamedImports(h.namedBindings)))
          for (const E of h.namedBindings.elements) {
            const D = (e = (i = E.propertyName) === null || i === void 0 ? void 0 : i.text) !== null && e !== void 0 ? e : E.name.text, x = E.name.text;
            D === Q && o.add(x), D === Y && c.add(x);
          }
      }
      if (o.size === 0 && c.size === 0)
        return [];
      const f = [];
      return s.forEachChild((d) => {
        var $;
        if (!l.isClassDeclaration(d) || !d.name)
          return;
        const h = d.name.text, E = ($ = l.getDecorators(d)) !== null && $ !== void 0 ? $ : [];
        for (const D of E) {
          const x = D.expression;
          if (l.isIdentifier(x) && o.has(x.text))
            o.has(x.text) ? f.push({ className: h, entryKey: h, filePath: t, kind: "service" }) : c.has(x.text) && f.push({ className: h, entryKey: h, filePath: t, kind: "store" });
          else if (l.isCallExpression(x) && l.isIdentifier(x.expression)) {
            const O = x.expression.text, G = o.has(O), A = c.has(O);
            if (!G && !A)
              continue;
            const [y] = x.arguments;
            let j = h;
            if (y && l.isStringLiteralLike(y))
              j = y.text;
            else if (y && l.isObjectLiteralExpression(y)) {
              const F = y.properties.find((w) => l.isPropertyAssignment(w) && l.isIdentifier(w.name) && w.name.text === "id" && l.isStringLiteralLike(w.initializer));
              F && l.isStringLiteralLike(F.initializer) && (j = F.initializer.text);
            }
            f.push({ className: h, entryKey: j, filePath: t, kind: A ? "store" : "service" });
          }
        }
      }), f;
    });
  }
  function M(t) {
    return v(this, void 0, void 0, function* () {
      const i = yield U(t.filePath), e = i.existed, r = q(t.entryKey), n = t.kind === "store" ? N(i.containerPath) : _(i.containerPath), s = t.kind === "store" ? "DiStores" : "DiServices";
      if (!e) {
        const f = g(a.dirname(i.containerPath), t.filePath), d = [
          `import type { ${t.className} } from "${f}";`,
          "",
          `export interface ${n} {`,
          `  ${r}: typeof ${t.className};`,
          "}",
          ""
        ].join(`
`);
        yield m.writeFile(i.containerPath, d, "utf8"), yield C(i.containerPath, n, s);
        return;
      }
      const o = yield m.readFile(i.containerPath, "utf8"), c = V(o, i.containerPath, Object.assign(Object.assign({}, t), {
        entryKey: r,
        interfaceName: n
      }));
      c !== o && (yield m.writeFile(i.containerPath, c, "utf8")), yield C(i.containerPath, n, s);
    });
  }
  function U(t) {
    return v(this, void 0, void 0, function* () {
      const i = a.resolve(t);
      let e = a.dirname(i);
      for (; e.startsWith(p); ) {
        const o = a.join(e, "container.d.ts");
        if (yield b(o))
          return { containerPath: o, existed: !0 };
        if (e === p)
          break;
        e = a.dirname(e);
      }
      const n = a.relative(p, i).split(a.sep);
      let s = p;
      return n[0] === "modules" && n.length > 1 ? s = a.join(p, "modules", n[1]) : n.length > 0 && n[0] && (s = a.join(p, n[0])), { containerPath: a.join(s, "container.d.ts"), existed: !1 };
    });
  }
  function V(t, i, e) {
    const r = g(a.dirname(i), e.filePath), n = `import type { ${e.className} } from "${r}";`;
    let s = t;
    new RegExp(`^import type \\{ ${e.className} \\} from \\"${S(r)}\\";`, "m").test(t) || (s = Z(s, n));
    const o = J(s, e.interfaceName);
    if (!o) {
      const c = [
        "",
        `export interface ${e.interfaceName} {`,
        `  ${e.entryKey}: typeof ${e.className};`,
        "}",
        ""
      ].join(`
`);
      return `${s.trimEnd()}
${c}`;
    }
    if (!new RegExp(`${S(e.entryKey)}\\s*:`).test(o.body)) {
      const c = `${o.indent}${e.entryKey}: typeof ${e.className};`;
      s = s.slice(0, o.endIndex) + `
${c}` + s.slice(o.endIndex);
    }
    return s;
  }
  function C(t, i, e) {
    return v(this, void 0, void 0, function* () {
      if (!u)
        return;
      if (!(yield b(u))) {
        const f = g(a.dirname(u), t), $ = [
          `import type { ${i} } from "${f}";`,
          "",
          `declare module "${I}" {`,
          `  interface ${e} extends ${i} {}`,
          "}",
          ""
        ].join(`
`);
        yield m.writeFile(u, $, "utf8");
        return;
      }
      const n = yield m.readFile(u, "utf8");
      let s = n;
      const o = g(a.dirname(u), t), c = `import type { ${i} } from "${o}";`;
      new RegExp(`^import type \\{ ${i} \\} from \\"${S(o)}\\";`, "m").test(s) || (s = H(s, c)), s = R(s, "DiServices"), s = R(s, "DiStores"), s = X(s, e, i), s !== n && (yield m.writeFile(u, s, "utf8"));
    });
  }
  function Z(t, i) {
    const e = t.split(`
`);
    let r = 0;
    for (let n = 0; n < e.length; n += 1)
      if (e[n].startsWith("import "))
        r = n + 1;
      else if (e[n].trim() !== "")
        break;
    return e.splice(r, 0, i), e.join(`
`);
  }
  function H(t, i) {
    const e = t.split(`
`);
    let r = 0;
    for (let n = 0; n < e.length; n += 1)
      if (e[n].startsWith("import "))
        r = n + 1;
      else if (e[n].trim() !== "")
        break;
    return e.splice(r, 0, i), e.join(`
`);
  }
  function J(t, i) {
    const e = t.match(new RegExp(`export interface ${S(i)}\\s*\\{`));
    if (!e || e.index === void 0)
      return null;
    const r = e.index + e[0].length, n = t.indexOf("}", r);
    if (n === -1)
      return null;
    const s = t.slice(r, n), o = s.match(/\n(\s*)\w/), c = o ? o[1] : "  ";
    return { body: s, endIndex: n, indent: c };
  }
  function R(t, i) {
    const e = new RegExp(`interface ${i},\\s*([^\\{]+)\\{`, "g");
    return t.replace(e, `interface ${i} extends $1{`);
  }
  function X(t, i, e) {
    var r;
    const n = t.match(new RegExp(`interface ${i}(\\s+extends\\s+([^\\{]+))?\\s*\\{`));
    if (!n || n.index === void 0)
      return t;
    const s = (r = n[2]) === null || r === void 0 ? void 0 : r.trim();
    if (s && new RegExp(`\\b${S(e)}\\b`).test(s))
      return t;
    const o = s ? ` extends ${s}, ${e} {` : ` extends ${e} {`, c = n.index, f = c + n[0].length;
    return t.slice(0, c) + `interface ${i}${o}` + t.slice(f);
  }
  function _(t) {
    const e = a.relative(p, t).replace(/\\/g, "/").split("/");
    let r = e[0];
    return e[0] === "modules" && e[1] && (r = e[1]), `${T(r.replace(/\.d\.ts$/, ""))}Services`;
  }
  function N(t) {
    const e = a.relative(p, t).replace(/\\/g, "/").split("/");
    let r = e[0];
    return e[0] === "modules" && e[1] && (r = e[1]), `${T(r.replace(/\.d\.ts$/, ""))}Stores`;
  }
  function T(t) {
    return t.split(/[^a-zA-Z0-9]+/).filter(Boolean).map((i) => i.charAt(0).toUpperCase() + i.slice(1)).join("");
  }
  function q(t) {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(t) ? t : JSON.stringify(t);
  }
  function g(t, i) {
    const r = a.relative(t, i).replace(/\\/g, "/").replace(/\.(tsx|ts|d\.ts)$/, "");
    return r.startsWith(".") ? r : `./${r}`;
  }
  function S(t) {
    return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function K(t) {
    return v(this, void 0, void 0, function* () {
      const i = yield m.readdir(t, { withFileTypes: !0 }), e = [];
      for (const r of i) {
        if (r.name.startsWith("."))
          continue;
        const n = a.join(t, r.name);
        if (r.isDirectory())
          e.push(...yield K(n));
        else if (r.isFile()) {
          if (!/\.tsx?$/.test(r.name) || r.name.endsWith(".d.ts"))
            continue;
          e.push(n);
        }
      }
      return e;
    });
  }
  function L(t) {
    return v(this, void 0, void 0, function* () {
      const i = yield m.readdir(t, { withFileTypes: !0 }), e = [];
      for (const r of i) {
        if (r.name.startsWith("."))
          continue;
        const n = a.join(t, r.name);
        r.isDirectory() ? e.push(...yield L(n)) : r.isFile() && r.name === "container.d.ts" && e.push(n);
      }
      return e;
    });
  }
  function b(t) {
    return v(this, void 0, void 0, function* () {
      try {
        return yield m.access(t), !0;
      } catch {
        return !1;
      }
    });
  }
  return {
    name: "mvvm-service-di",
    enforce: "pre",
    configResolved(t) {
      var i, e;
      P = t, p = a.resolve((i = P.root) !== null && i !== void 0 ? i : process.cwd(), "src"), u = a.resolve((e = P.root) !== null && e !== void 0 ? e : process.cwd(), "di.d.ts");
    },
    buildStart() {
      return v(this, void 0, void 0, function* () {
        yield z(), yield W();
      });
    },
    handleHotUpdate(t) {
      return v(this, void 0, void 0, function* () {
        t.file.startsWith(p) && (!/\.tsx?$/.test(t.file) || t.file.endsWith(".d.ts") || (yield k(t.file)));
      });
    }
  };
}
export {
  re as mvvmServiceDiPlugin
};
//# sourceMappingURL=mvvm-di.js.map
