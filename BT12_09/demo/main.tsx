import React from "react";
import ReactDOM from "react-dom/client";
import { SimpleCartDemo } from "./SimpleCartDemo";

function Demo() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <SimpleCartDemo />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>
);



