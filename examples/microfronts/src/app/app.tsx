import { lazy, useEffect, useMemo, useRef, useState } from "react";
import { searchBridge } from "../searchBridge";
import { MicrofrontModule, MicrofrontDefinition, MicrofrontRecord } from "./types";

// const Fiveka = lazy(() => import('5ka-microfront'));

type MicrofrontMode = "packages" | "federation";

const resolveMicrofrontMode = (value: unknown): MicrofrontMode => {
  if (typeof value !== "string") return "packages";
  const normalized = value.trim().toLowerCase();
  if (normalized === "federation") return "federation";
  return "packages";
};

const microfrontMode = resolveMicrofrontMode(
  import.meta.env.VITE_MICROFRONT_MODE ?? import.meta.env.MODE
);

const defer = (callback: () => void) => {
  if (typeof queueMicrotask === "function") {
    queueMicrotask(callback);
  } else {
    Promise.resolve().then(callback);
  }
};

const packageImporters: Record<string, () => Promise<MicrofrontModule>> = {
  "5ka-microfront"   : () => import("5ka-microfront"),
  "auchan-microfront": () => import("auchan-microfront"),
};

const federationOrigins: Record<string, string> = {
  "5ka-microfront": "mf5ka",
  "auchan-microfront": "mfauchan",
};

const federationImporters: Record<string, () => Promise<MicrofrontModule>> = {
  "5ka-microfront": () => import("mf5ka/microfront"),
  "auchan-microfront": () => import("mfauchan/microfront"),
};

const selectImporters = (mode: MicrofrontMode) =>
  mode === "federation" ? federationImporters : packageImporters;

const resolveOrigin = (packageName: string, mode: MicrofrontMode) =>
  mode === "federation" ? federationOrigins[packageName] ?? packageName : packageName;

const baseUrl = import.meta.env.BASE_URL ?? "/";
const withBase = (path: string) => {
  const normalized = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${normalized}${path.replace(/^\//, "")}`;
};

const normalizePackageName = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const loadManifest = async (): Promise<string[]> => {
  const response = await fetch(withBase("microfronts.json"), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Manifest request failed (${response.status})`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Manifest must be an array.");
  }
  return data.map(normalizePackageName).filter((item): item is string => Boolean(item));
};

const isMicrofrontDefinition = (value: unknown): value is MicrofrontDefinition => {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as MicrofrontDefinition).mount === "function"
  );
};

const loadMicrofrontModule = async (
  packageName: string,
  mode: MicrofrontMode
): Promise<MicrofrontRecord> => {
  const importers = selectImporters(mode);
  const importer = importers[packageName];
  if (!importer) {
    throw new Error(`Unknown microfront package "${packageName}" for mode "${mode}".`);
  }
  const mod = await importer();
  const candidates = [mod.microfront, mod.default, ...Object.values(mod)];
  const candidate = candidates.find((value) => isMicrofrontDefinition(value));
  if (!candidate) {
    const keys = Object.keys(mod);
    const hint = keys.length ? ` Available exports: ${keys.join(", ")}.` : "";
    throw new Error(`Package "${packageName}" does not export microfront.${hint}`);
  }
  const id = candidate.id || packageName;
  const title = candidate.title || id;
  return {
    id,
    packageName,
    title,
    description: candidate.description,
    mount: candidate.mount,
    origin: resolveOrigin(packageName, mode),
  };
};

const loadMicrofront = async (packageName: string): Promise<MicrofrontRecord> => {
  return await loadMicrofrontModule(packageName, microfrontMode);
};

function MicrofrontMount({ microfront }: { microfront: MicrofrontRecord }): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    const mountPoint = document.createElement("div");
    mountPoint.className = "microfront-mount";
    mountPoint.dataset.microfront = microfront.id;
    host.appendChild(mountPoint);

    const teardown = microfront.mount(mountPoint);

    return () => {
      if (typeof teardown === "function") {
        teardown();
      }
      defer(() => {
        if (host.contains(mountPoint)) {
          host.removeChild(mountPoint);
        }
      });
    };
  }, [microfront.id, microfront.mount]);

  return <div className="microfront-frame" ref={containerRef} />;
}

export function MicrofrontsApp(): JSX.Element {
  const [microfronts, setMicrofronts] = useState<MicrofrontRecord[]>([]);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState("");
  const [query, setQuery] = useState(searchBridge.getQuery());

  useEffect(() => {
    return searchBridge.onQuery(setQuery);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setLoadErrors([]);
      try {
        const manifest = Array.from(new Set(await loadManifest()));
        const results = await Promise.allSettled(
          manifest.map((packageName) => loadMicrofront(packageName))
        );
        if (cancelled) return;

        const loaded: MicrofrontRecord[] = [];
        const errors: string[] = [];

        results.forEach((result, index) => {
          const packageName = manifest[index];
          if (result.status === "fulfilled") {
            loaded.push(result.value);
          } else {
            const message =
              result.reason instanceof Error ? result.reason.message : String(result.reason);
            errors.push(`${packageName}: ${message}`);
          }
        });

        loaded.sort((a, b) => a.title.localeCompare(b.title));
        setMicrofronts(loaded);
        setLoadErrors(errors);
        setActiveId((prev) => {
          if (loaded.length === 0) return "";
          if (prev && loaded.some((item) => item.packageName === prev)) return prev;
          return loaded[0].packageName;
        });
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : String(error);
        setMicrofronts([]);
        setLoadErrors([message]);
        setActiveId("");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const active = useMemo(
    () => microfronts.find((item) => item.packageName === activeId) ?? null,
    [activeId, microfronts]
  );

  return (
    <div className="app">
      <header className="header">
        <h1>Microfront services</h1>
        <p>Shared search across product providers.</p>
      </header>

      <form
        className="search"
        onSubmit={(event) => {
          event.preventDefault();
          searchBridge.submit();
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(event) => searchBridge.setQuery(event.target.value)}
          placeholder="Search products"
          aria-label="Search products"
        />
        <button type="submit">Search</button>
      </form>

      <div className="layout">
        <aside className="services">
          <div className="section-title">Providers</div>
          {isLoading && microfronts.length === 0 ? (
            <div className="empty">Loading microfronts...</div>
          ) : microfronts.length === 0 ? (
            <div className="empty">No microfronts found.</div>
          ) : (
            <div className="service-list">
              {microfronts.map((item) => (
                <button
                  key={item.packageName}
                  type="button"
                  className="service-item"
                  data-active={item.packageName === activeId}
                  onClick={() => setActiveId(item.packageName)}
                >
                  <span className="service-title">{item.title}</span>
                  <span className="service-meta">{item.origin}</span>
                  {item.description ? <span className="service-desc">{item.description}</span> : null}
                </button>
              ))}
            </div>
          )}
          {loadErrors.length > 0 ? (
            <div className="empty">Failed to load: {loadErrors.join(", ")}</div>
          ) : null}
        </aside>

        <section className="preview">
          <div className="section-title">
            {active ? active.title : "Select a provider"}
          </div>
          {active ? (
            <MicrofrontMount microfront={active} />
          ) : isLoading ? (
            <div className="empty-panel">Loading providers...</div>
          ) : (
            <div className="empty-panel">Choose a provider to mount the microfront.</div>
          )}
        </section>
      </div>
    </div>
  );
}
