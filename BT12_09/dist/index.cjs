"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Button: () => Button,
  Card: () => Card,
  Cart: () => Cart,
  Input: () => Input,
  Modal: () => Modal
});
module.exports = __toCommonJS(index_exports);

// src/components/Button.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var Button = ({ label, style, ...props }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "button",
    {
      ...props,
      style: {
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#2563eb",
        color: "white",
        cursor: "pointer",
        ...style
      },
      children: label
    }
  );
};

// src/components/Input.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var Input = ({ label, style, ...props }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { marginBottom: "8px" }, children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { style: { marginRight: "8px" }, children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "input",
      {
        ...props,
        style: { padding: "6px", borderRadius: "6px", ...style }
      }
    )
  ] });
};

// src/components/Modal.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var Modal = ({ open, title, onClose, children }) => {
  if (!open) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1e3
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { background: "#fff", padding: 16, borderRadius: 12, minWidth: 320 }, children: [
        title && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { marginTop: 0 }, children: title }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { children }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { marginTop: 12, textAlign: "right" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Button, { label: "\u0110\xF3ng", onClick: onClose }) })
      ] })
    }
  );
};

// src/components/Card.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var Card = ({ children, title, style }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "div",
    {
      style: {
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        ...style || {}
      },
      children: [
        title && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { style: { marginTop: 0 }, children: title }),
        children
      ]
    }
  );
};

// src/Cart.tsx
var import_react = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var Cart = () => {
  const [items, setItems] = (0, import_react.useState)([]);
  const [newItem, setNewItem] = (0, import_react.useState)("");
  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, { id: Date.now(), name: newItem.trim(), quantity: 1 }]);
    setNewItem("");
  };
  const updateItem = (id, quantity) => {
    setItems(items.map((i) => i.id === id ? { ...i, quantity } : i));
  };
  const removeItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(Card, { title: "\u{1F6D2} Gi\u1ECF h\xE0ng", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        Input,
        {
          value: newItem,
          onChange: (e) => setNewItem(e.target.value),
          placeholder: "T\xEAn s\u1EA3n ph\u1EA9m..."
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Button, { label: "Th\xEAm", onClick: addItem })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("ul", { children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("li", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
      item.name,
      " - SL:",
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "input",
        {
          type: "number",
          min: 1,
          value: item.quantity,
          onChange: (e) => updateItem(item.id, parseInt(e.target.value || "1", 10)),
          style: { width: 60, padding: 4 }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Button, { label: "X\xF3a", onClick: () => removeItem(item.id) })
    ] }, item.id)) })
  ] });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Button,
  Card,
  Cart,
  Input,
  Modal
});
