import "reflect-metadata";

import React from "react";
import ReactDOM from "react-dom/client";

import { AuchanView } from "./app";
import "./styles.css";
import { I18nProvider } from "./i18n/I18nProvider";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
			<I18nProvider>
      	<AuchanView />
			</I18nProvider>
    </React.StrictMode>
  );
}
