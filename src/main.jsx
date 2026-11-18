import React from "react";
import ReactDOM from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "./styles/global.css";
import { applyPaletteToCss } from "./theme/palette.js";
import App from "./App.jsx";

applyPaletteToCss();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
