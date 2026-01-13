import React from "react";
import { MICROFRONTS, type MicrofrontKey } from "./microfronts.registry";

type MicrofrontMode = "packages" | "federation";
const resolveMode = (v: unknown): MicrofrontMode =>
  String(v ?? "").trim().toLowerCase() === "federation" ? "federation" : "packages";

const mode = resolveMode(import.meta.env.VITE_MICROFRONT_MODE ?? import.meta.env.MODE);

export type LoadedMicrofront = {
  key: MicrofrontKey;
  origin: string;
  title: string;
  description?: string;
  Component: React.ComponentType;
};

function createResource<T>(loader: () => Promise<T>) {
  let status: "pending" | "success" | "error" = "pending";
  let value: T;
  let error: unknown;

  const promise = loader().then(
    (v) => {
      status = "success";
      value = v;
    },
    (e) => {
      status = "error";
      error = e;
    }
  );

  return {
    read(): T {
      if (status === "pending") throw promise;
      if (status === "error") throw error;
      return value!;
    },
  };
}

const baseUrl = import.meta.env.BASE_URL ?? "/";
const withBase = (p: string) => (baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`) + p.replace(/^\//, "");

async function loadManifestKeys(): Promise<MicrofrontKey[]> {
  const res = await fetch(withBase("microfront.json"), { cache: "no-store" });
  if (!res.ok) throw new Error(`Manifest request failed (${res.status})`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Manifest must be an array.");

  return data
    .map((x) => (typeof x === "string" ? (x.trim() as MicrofrontKey) : null))
    .filter((x): x is MicrofrontKey => Boolean(x && x in MICROFRONTS));
}

async function loadOne(key: MicrofrontKey): Promise<LoadedMicrofront> {
  const meta = MICROFRONTS[key];
  const mod = await meta.importers[mode]();

  const Component = (mod?.default ?? mod?.Microfront ?? mod?.App) as React.ComponentType | undefined;
  if (!Component) throw new Error(`"${key}" must export default React component.`);

  const mfMeta = mod?.microfrontMeta ?? {};
  return {
    key,
    origin: mode === "federation" ? meta.remote : key,
    title: mfMeta.title ?? key,
    description: mfMeta.description,
    Component,
  };
}

// ✅ ресурс кешируется на уровне модуля — загрузка один раз
export const microfrontsResource = createResource(async () => {
  const keys = Array.from(new Set(await loadManifestKeys()));
  const results = await Promise.all(keys.map(loadOne));
  return results.sort((a, b) => a.title.localeCompare(b.title));
});