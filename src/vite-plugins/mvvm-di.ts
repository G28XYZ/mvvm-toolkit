import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

type EntryKind = "service" | "store";

/** Информация о сущности, найденной в исходниках. */
type ContainerEntry = {
  className: string;
  entryKey: string;
  filePath: string;
  kind: EntryKind;
};

/** Цель для генерации container.d.ts. */
type ContainerTarget = {
  containerPath: string;
  existed: boolean;
};

const SERVICE_DECORATOR = "Service";
const STORE_DECORATOR = "Store";
const MVVM_MODULE = "rvm-toolkit";

type VitePluginLike = {
  name: string;
  enforce?: "pre" | "post";
  configResolved?(resolved: { root?: string }): void;
  buildStart?(): void | Promise<void>;
  handleHotUpdate?(ctx: { file: string }): void | Promise<void>;
};

/**
 * Vite-плагин для автоматического обновления container.d.ts и di.d.ts
 * на основе сервисов, отмеченных декоратором Service.
 *
 * Плагин сканирует исходники и добавляет типы сервисов в ближайший container.d.ts,
 * а также подключает контейнеры к di.d.ts проекта.
 *
 * @example
 * // vite.config.ts
 * import { mvvmServiceDiPlugin } from "rvm-toolkit/vite-plugins";
 *
 * export default defineConfig({
 *   plugins: [mvvmServiceDiPlugin()],
 * });
 */
export function mvvmServiceDiPlugin(): VitePluginLike {
  let config: { root?: string };
  let srcRoot = "";
  let diPath = "";

  /** Полный скан исходников и обновление контейнеров. */
  async function scanAndUpdateAll() {
    const files = await collectSourceFiles(srcRoot);
    for (const file of files) {
      await processFile(file);
    }
  }

  async function ensureDiFile() {
    if (!diPath) return;
    const diExists = await exists(diPath);
    if (diExists) return;

    const containers = await collectContainerFiles(srcRoot);
    if (containers.length === 0) {
      const content = [
        `declare module "${MVVM_MODULE}" {`,
        "  interface DiServices {}",
        "}",
        "",
      ].join("\n");
      await fs.writeFile(diPath, content, "utf8");
      return;
    }

    const imports: string[] = [];
    const serviceInterfaces: string[] = [];
    const storeInterfaces: string[] = [];
    for (const containerPath of containers) {
      const content = await fs.readFile(containerPath, "utf8");
      const servicesName = inferInterfaceName(containerPath);
      const storesName = inferStoresInterfaceName(containerPath);
      const importPath = toImportPath(path.dirname(diPath), containerPath);
      if (content.includes(`export interface ${servicesName}`)) {
        imports.push(`import type { ${servicesName} } from "${importPath}";`);
        serviceInterfaces.push(servicesName);
      }
      if (content.includes(`export interface ${storesName}`)) {
        imports.push(`import type { ${storesName} } from "${importPath}";`);
        storeInterfaces.push(storesName);
      }
    }

    const content = [
      ...imports,
      "",
      `declare module "${MVVM_MODULE}" {`,
      serviceInterfaces.length
        ? `  interface DiServices extends ${serviceInterfaces.join(", ")} {}`
        : "  interface DiServices {}",
      storeInterfaces.length
        ? `  interface DiStores extends ${storeInterfaces.join(", ")} {}`
        : "  interface DiStores {}",
      "}",
      "",
    ].join("\n");
    await fs.writeFile(diPath, content, "utf8");
  }

  /** Обработать конкретный файл и обновить контейнеры. */
  async function processFile(filePath: string) {
    const entries = await extractEntries(filePath);
    for (const entry of entries) {
      await ensureEntryInContainer(entry);
    }
  }

  /** Извлечь сущности с декоратором Service/Store из файла. */
  async function extractEntries(filePath: string): Promise<ContainerEntry[]> {
    const content = await fs.readFile(filePath, "utf8");
    const kind = filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    const source = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, kind);

    const serviceIdentifiers = new Set<string>();
    const storeIdentifiers = new Set<string>();

    for (const statement of source.statements) {
      if (!ts.isImportDeclaration(statement)) continue;
      const moduleName = statement.moduleSpecifier.getText(source).replace(/['"]/g, "");
      if (moduleName !== MVVM_MODULE) continue;
      const importClause = statement.importClause;
      if (!importClause?.namedBindings || !ts.isNamedImports(importClause.namedBindings)) continue;

      for (const element of importClause.namedBindings.elements) {
        const imported = element.propertyName?.text ?? element.name.text;
        const local = element.name.text;
        if (imported === SERVICE_DECORATOR) {
          serviceIdentifiers.add(local);
        }
        if (imported === STORE_DECORATOR) {
          storeIdentifiers.add(local);
        }
      }
    }

    if (serviceIdentifiers.size === 0 && storeIdentifiers.size === 0) return [];

    const results: ContainerEntry[] = [];

    source.forEachChild((node) => {
      if (!ts.isClassDeclaration(node) || !node.name) return;
      const className = node.name.text;
      const decorators = ts.getDecorators(node) ?? [];

      for (const decorator of decorators) {
        const expr = decorator.expression;
        if (ts.isIdentifier(expr) && serviceIdentifiers.has(expr.text)) {
          if (serviceIdentifiers.has(expr.text)) {
            results.push({ className, entryKey: className, filePath, kind: "service" });
          } else if (storeIdentifiers.has(expr.text)) {
            results.push({ className, entryKey: className, filePath, kind: "store" });
          }
        } else if (ts.isCallExpression(expr) && ts.isIdentifier(expr.expression)) {
          const decoratorName = expr.expression.text;
          const isService = serviceIdentifiers.has(decoratorName);
          const isStore = storeIdentifiers.has(decoratorName);
          if (!isService && !isStore) continue;
          const [firstArg] = expr.arguments;
          let key = className;
          if (firstArg && ts.isStringLiteralLike(firstArg)) {
            key = firstArg.text;
          } else if (firstArg && ts.isObjectLiteralExpression(firstArg)) {
            const idProp = firstArg.properties.find(
              (prop): prop is ts.PropertyAssignment =>
                ts.isPropertyAssignment(prop) &&
                ts.isIdentifier(prop.name) &&
                prop.name.text === "id" &&
                ts.isStringLiteralLike(prop.initializer)
            );
            if (idProp && ts.isStringLiteralLike(idProp.initializer)) {
              key = idProp.initializer.text;
            }
          }
          results.push({ className, entryKey: key, filePath, kind: isStore ? "store" : "service" });
        }
      }
    });

    return results;
  }

  /** Добавить сущность в container.d.ts и di.d.ts. */
  async function ensureEntryInContainer(entry: ContainerEntry) {
    const target = await findContainerTarget(entry.filePath);
    const containerExisted = target.existed;
    const entryKey = formatServiceKey(entry.entryKey);
    const interfaceName =
      entry.kind === "store" ? inferStoresInterfaceName(target.containerPath) : inferInterfaceName(target.containerPath);
    const diInterfaceName = entry.kind === "store" ? "DiStores" : "DiServices";

    if (!containerExisted) {
      const importPath = toImportPath(path.dirname(target.containerPath), entry.filePath);
      const content = [
        `import type { ${entry.className} } from "${importPath}";`,
        "",
        `export interface ${interfaceName} {`,
        `  ${entryKey}: typeof ${entry.className};`,
        "}",
        "",
      ].join("\n");
      await fs.writeFile(target.containerPath, content, "utf8");
      await ensureDiIncludesContainer(target.containerPath, interfaceName, diInterfaceName);
      return;
    }

    const existing = await fs.readFile(target.containerPath, "utf8");
    const updated = updateContainerContent(existing, target.containerPath, {
      ...entry,
      entryKey,
      interfaceName,
    });
    if (updated !== existing) {
      await fs.writeFile(target.containerPath, updated, "utf8");
    }
    await ensureDiIncludesContainer(target.containerPath, interfaceName, diInterfaceName);
  }

  /** Найти или определить путь для container.d.ts. */
  async function findContainerTarget(filePath: string): Promise<ContainerTarget> {
    const absolute = path.resolve(filePath);
    let currentDir = path.dirname(absolute);

    while (currentDir.startsWith(srcRoot)) {
      const candidate = path.join(currentDir, "container.d.ts");
      if (await exists(candidate)) {
        return { containerPath: candidate, existed: true };
      }
      if (currentDir === srcRoot) break;
      currentDir = path.dirname(currentDir);
    }

    const relativeToSrc = path.relative(srcRoot, absolute);
    const segments = relativeToSrc.split(path.sep);
    let containerDir = srcRoot;

    if (segments[0] === "modules" && segments.length > 1) {
      containerDir = path.join(srcRoot, "modules", segments[1]);
    } else if (segments.length > 0 && segments[0]) {
      containerDir = path.join(srcRoot, segments[0]);
    }

    return { containerPath: path.join(containerDir, "container.d.ts"), existed: false };
  }

  /** Обновить содержимое container.d.ts с учетом сервиса. */
  function updateContainerContent(
    content: string,
    containerPath: string,
    entry: ContainerEntry & { interfaceName: string; entryKey: string }
  ): string {
    const importPath = toImportPath(path.dirname(containerPath), entry.filePath);
    const importStatement = `import type { ${entry.className} } from "${importPath}";`;

    let updated = content;
    if (!new RegExp(`^import type \\{ ${entry.className} \\} from \\\"${escapeRegExp(importPath)}\\\";`, "m").test(content)) {
      updated = insertImport(updated, importStatement);
    }

    const interfaceBlock = findInterfaceBlock(updated, entry.interfaceName);
    if (!interfaceBlock) {
      const block = [
        "",
        `export interface ${entry.interfaceName} {`,
        `  ${entry.entryKey}: typeof ${entry.className};`,
        "}",
        "",
      ].join("\n");
      return `${updated.trimEnd()}\n${block}`;
    }

    if (!new RegExp(`${escapeRegExp(entry.entryKey)}\\s*:`).test(interfaceBlock.body)) {
      const entryLine = `${interfaceBlock.indent}${entry.entryKey}: typeof ${entry.className};`;
      updated = updated.slice(0, interfaceBlock.endIndex) + `\n${entryLine}` + updated.slice(interfaceBlock.endIndex);
    }

    return updated;
  }

  /** Убедиться, что di.d.ts содержит импорт и интерфейс контейнера. */
  async function ensureDiIncludesContainer(containerPath: string, interfaceName: string, diInterfaceName: "DiServices" | "DiStores") {
    if (!diPath) return;

    const diExists = await exists(diPath);
    if (!diExists) {
      const importPath = toImportPath(path.dirname(diPath), containerPath);
      const importStatement = `import type { ${interfaceName} } from "${importPath}";`;
      const initialContent = [
        importStatement,
        "",
        `declare module "${MVVM_MODULE}" {`,
        `  interface ${diInterfaceName} extends ${interfaceName} {}`,
        "}",
        "",
      ].join("\n");
      await fs.writeFile(diPath, initialContent, "utf8");
      return;
    }

    const existing = await fs.readFile(diPath, "utf8");
    let updated = existing;

    const importPath = toImportPath(path.dirname(diPath), containerPath);
    const importStatement = `import type { ${interfaceName} } from "${importPath}";`;

    if (!new RegExp(`^import type \\{ ${interfaceName} \\} from \\\"${escapeRegExp(importPath)}\\\";`, "m").test(updated)) {
      updated = insertDiImport(updated, importStatement);
    }

    updated = normalizeDiDeclaration(updated, "DiServices");
    updated = normalizeDiDeclaration(updated, "DiStores");
    updated = ensureDiExtends(updated, diInterfaceName, interfaceName);

    if (updated !== existing) {
      await fs.writeFile(diPath, updated, "utf8");
    }
  }

  /** Вставить import в файл после блока импортов. */
  function insertImport(content: string, importStatement: string): string {
    const lines = content.split("\n");
    let insertIndex = 0;

    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].startsWith("import ")) {
        insertIndex = i + 1;
      } else if (lines[i].trim() !== "") {
        break;
      }
    }

    lines.splice(insertIndex, 0, importStatement);
    return lines.join("\n");
  }

  /** Вставить import в di.d.ts. */
  function insertDiImport(content: string, importStatement: string): string {
    const lines = content.split("\n");
    let insertIndex = 0;

    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].startsWith("import ")) {
        insertIndex = i + 1;
      } else if (lines[i].trim() !== "") {
        break;
      }
    }

    lines.splice(insertIndex, 0, importStatement);
    return lines.join("\n");
  }

  /** Найти блок интерфейса и вернуть позиции для вставки. */
  function findInterfaceBlock(content: string, interfaceName: string) {
    const startMatch = content.match(new RegExp(`export interface ${escapeRegExp(interfaceName)}\\s*\\{`));
    if (!startMatch || startMatch.index === undefined) return null;
    const startIndex = startMatch.index + startMatch[0].length;
    const endIndex = content.indexOf("}", startIndex);
    if (endIndex === -1) return null;

    const body = content.slice(startIndex, endIndex);
    const indentMatch = body.match(/\n(\s*)\w/);
    const indent = indentMatch ? indentMatch[1] : "  ";

    return { body, endIndex, indent };
  }

  /** Исправить устаревший синтаксис interface DiServices, X {} на extends. */
  function normalizeDiDeclaration(content: string, name: "DiServices" | "DiStores") {
    const re = new RegExp(`interface ${name},\\s*([^\\{]+)\\{`, "g");
    return content.replace(re, `interface ${name} extends $1{`);
  }

  /** Обновить extends у interface DiServices/DiStores. */
  function ensureDiExtends(content: string, diInterfaceName: "DiServices" | "DiStores", interfaceName: string) {
    const match = content.match(new RegExp(`interface ${diInterfaceName}(\\s+extends\\s+([^\\{]+))?\\s*\\{`));
    if (!match || match.index === undefined) return content;

    const extendsList = match[2]?.trim();
    if (extendsList && new RegExp(`\\b${escapeRegExp(interfaceName)}\\b`).test(extendsList)) {
      return content;
    }

    const insertion = extendsList ? ` extends ${extendsList}, ${interfaceName} {` : ` extends ${interfaceName} {`;
    const start = match.index;
    const end = start + match[0].length;
    return content.slice(0, start) + `interface ${diInterfaceName}${insertion}` + content.slice(end);
  }

  /** Сформировать имя интерфейса по пути контейнера. */
  function inferInterfaceName(containerPath: string): string {
    const relative = path.relative(srcRoot, containerPath).replace(/\\/g, "/");
    const segments = relative.split("/");

    let nameSegment = segments[0];
    if (segments[0] === "modules" && segments[1]) {
      nameSegment = segments[1];
    }

    const base = toPascalCase(nameSegment.replace(/\.d\.ts$/, ""));
    return `${base}Services`;
  }

  function inferStoresInterfaceName(containerPath: string): string {
    const relative = path.relative(srcRoot, containerPath).replace(/\\/g, "/");
    const segments = relative.split("/");

    let nameSegment = segments[0];
    if (segments[0] === "modules" && segments[1]) {
      nameSegment = segments[1];
    }

    const base = toPascalCase(nameSegment.replace(/\.d\.ts$/, ""));
    return `${base}Stores`;
  }

  /** Преобразовать строку в PascalCase. */
  function toPascalCase(value: string): string {
    return value
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
  }

  /** Привести ключ сервиса к валидному идентификатору. */
  function formatServiceKey(value: string): string {
    if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value)) return value;
    return JSON.stringify(value);
  }

  /** Построить относительный путь импорта без расширения. */
  function toImportPath(fromDir: string, filePath: string): string {
    const relative = path.relative(fromDir, filePath).replace(/\\/g, "/");
    const withoutExt = relative.replace(/\.(tsx|ts|d\.ts)$/, "");
    return withoutExt.startsWith(".") ? withoutExt : `./${withoutExt}`;
  }

  /** Экранировать строку для RegExp. */
  function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /** Собрать все .ts/.tsx файлы в директории. */
  async function collectSourceFiles(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await collectSourceFiles(fullPath)));
      } else if (entry.isFile()) {
        if (!/\.tsx?$/.test(entry.name)) continue;
        if (entry.name.endsWith(".d.ts")) continue;
        files.push(fullPath);
      }
    }

    return files;
  }

  /** Собрать все container.d.ts в директории src. */
  async function collectContainerFiles(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await collectContainerFiles(fullPath)));
      } else if (entry.isFile()) {
        if (entry.name === "container.d.ts") {
          files.push(fullPath);
        }
      }
    }

    return files;
  }

  /** Проверить существование файла. */
  async function exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  return {
    name: "mvvm-service-di",
    enforce: "pre",
    configResolved(resolved) {
      config = resolved;
      srcRoot = path.resolve(config.root ?? process.cwd(), "src");
      diPath = path.resolve(config.root ?? process.cwd(), "di.d.ts");
    },
    async buildStart() {
      await ensureDiFile();
      await scanAndUpdateAll();
    },
    async handleHotUpdate(ctx) {
      if (!ctx.file.startsWith(srcRoot)) return;
      if (!/\.tsx?$/.test(ctx.file) || ctx.file.endsWith(".d.ts")) return;
      await processFile(ctx.file);
    },
  };
}
