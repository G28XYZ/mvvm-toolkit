import React, { Suspense, useMemo, useState } from "react";
import { microfrontsResource } from "../resource";
import { ErrorBoundary } from "../errorBoundary";
import { searchBridge } from "../searchBridge";

// если хочешь убрать state для query — можно перейти на useSyncExternalStore,
// но это отдельный шаг. Пока оставлю как было.
import { useEffect } from "react";

function MicrofrontsShell(): JSX.Element {
  const microfronts = microfrontsResource.read();
  const [activeKey, setActiveKey] = useState(() => microfronts[0]?.key ?? "");
  const active = useMemo(() => microfronts.find((m) => m.key === activeKey) ?? null, [microfronts, activeKey]);

  const [query, setQuery] = useState(searchBridge.getQuery());
  useEffect(() => searchBridge.onQuery(setQuery), []); // это можно тоже убрать через useSyncExternalStore

  return (
    <div className="app">
      <header className="header">
        <h1>Microfront services</h1>
        <p>Shared search across product providers.</p>
      </header>

      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault();
          searchBridge.submit();
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => searchBridge.setQuery(e.target.value)}
          placeholder="Search products"
          aria-label="Search products"
        />
        <button type="submit">Search</button>
      </form>

      <div className="layout">
        <aside className="services">
          <div className="section-title">Providers</div>
          <div className="service-list">
            {microfronts.map((m) => (
              <button
                key={m.key}
                type="button"
                className="service-item"
                data-active={m.key === activeKey}
                onClick={() => setActiveKey(m.key)}
              >
                <span className="service-title">{m.title}</span>
                <span className="service-meta">{m.origin}</span>
                {m.description ? <span className="service-desc">{m.description}</span> : null}
              </button>
            ))}
          </div>
        </aside>

        <section className="preview">
          <div className="section-title">{active ? active.title : "Select a provider"}</div>

          {active ? (
            <Suspense fallback={<div className="empty-panel">Loading microfront…</div>}>
              <active.Component />
            </Suspense>
          ) : (
            <div className="empty-panel">No microfronts found.</div>
          )}
        </section>
      </div>
    </div>
  );
}

export function MicrofrontsApp(): JSX.Element {
  return (
    <ErrorBoundary
      fallback={(err) => (
        <div className="app">
          <div className="empty-panel">
            Failed to load microfronts: {err instanceof Error ? err.message : String(err)}
          </div>
        </div>
      )}
    >
      <Suspense fallback={<div className="empty-panel">Loading providers…</div>}>
        <MicrofrontsShell />
      </Suspense>
    </ErrorBoundary>
  );
}