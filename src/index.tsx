import React from "react";
import ReactDOM from "react-dom/client";
import AppWithRouter from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>
);
