import React from "react";
import ReactDOM from "react-dom/client";

import { MicrofrontsApp } from "./app";
import "./styles.css";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <MicrofrontsApp />
    </React.StrictMode>
  );
}
