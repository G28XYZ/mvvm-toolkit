import "reflect-metadata";
import React from "react";
import { ProductView } from "./app";
import { I18nProvider } from "./i18n/I18nProvider";

const STYLE_ID = "microfront-style-5ka";

const resolvedStylesUrl = import.meta.env.PROD ? new URL("./microfront.css", import.meta.url).href : "";

function ensureStyles() {
  if (!resolvedStylesUrl || typeof document === "undefined") return;
  if (document.querySelector(`link[data-microfront-style="${STYLE_ID}"]`)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = resolvedStylesUrl;
  link.dataset.microfrontStyle = STYLE_ID;
  document.head.appendChild(link);
}

// ✅ никаких эффектов: просто вызываем один раз при инициализации модуля
ensureStyles();

export const microfrontMeta = {
  id         : "5ka",
  title      : "5ka catalog",
  description: "Search, filter, and browse products.",
};

// ✅ default export = React компонент
export default function MicrofrontRoot() {
  return (
    <React.StrictMode>
      <I18nProvider>
        <ProductView />
      </I18nProvider>
    </React.StrictMode>
  );
}