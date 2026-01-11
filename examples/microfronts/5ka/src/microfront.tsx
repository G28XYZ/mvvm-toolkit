import "reflect-metadata";

import React from "react";
import ReactDOM from "react-dom/client";

import { ProductView } from "./app";
import { I18nProvider } from "./i18n/I18nProvider";

const ROOT_CLASS = "fiveka-root";
const STYLE_ID = "microfront-style-5ka";
const resolvedStylesUrl = import.meta.env.PROD
  ? new URL("./microfront.css", import.meta.url).href
  : "";

const defer = (callback: () => void) => Promise.resolve().then(callback);

const ensureStyles = () => {
  if (!resolvedStylesUrl || typeof document === "undefined") return;
  if (document.querySelector(`link[data-microfront-style="${STYLE_ID}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = resolvedStylesUrl;
  link.dataset.microfrontStyle = STYLE_ID;
  document.head.appendChild(link);
};

const microfront = {
  id: "5ka",
  title: "5ka catalog",
  description: "Search and browse products from 5ka.",
  mount(element: HTMLElement): () => void {
    ensureStyles();
    element.classList.add(ROOT_CLASS);
    element.replaceChildren();

    const root = ReactDOM.createRoot(element);
    root.render(
      <React.StrictMode>
        <I18nProvider>
          <ProductView />
        </I18nProvider>
      </React.StrictMode>
    );

    return () => {
      element.classList.remove(ROOT_CLASS);
      defer(() => {
        root.unmount();
      });
    };
  },
};

export { microfront };
export default microfront;
