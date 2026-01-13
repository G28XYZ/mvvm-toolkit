import React, { Suspense, useMemo, useState } from "react";
import { microfrontsResource } from "../resource";
import { ErrorBoundary } from "../errorBoundary";
import { view } from "rvm-toolkit";

const MicrofrontsShell = view('mfHost:AppVM', ({ viewModel: vm }) => {
  const microfronts = microfrontsResource.read();
  const [activeKey, setActiveKey] = useState(() => microfronts[0]?.key ?? "");
  const active = useMemo(() => microfronts.find((m) => m.key === activeKey) ?? null, [microfronts, activeKey]);

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
          vm.submit();
        }}
      >
        <input
          type        = "search"
          value       = {vm.query}
          onChange    = {(e) => vm.setQuery(e.target.value)}
          placeholder = "Search products"
          aria-label  = "Search products"
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
})

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