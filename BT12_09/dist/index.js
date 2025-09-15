// src/components/Button.tsx
import { jsx } from "react/jsx-runtime";
var Button = ({ label, style, ...props }) => {
  return /* @__PURE__ */ jsx(
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
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var Input = ({ label, style, ...props }) => {
  return /* @__PURE__ */ jsxs("div", { style: { marginBottom: "8px" }, children: [
    label && /* @__PURE__ */ jsx2("label", { style: { marginRight: "8px" }, children: label }),
    /* @__PURE__ */ jsx2(
      "input",
      {
        ...props,
        style: { padding: "6px", borderRadius: "6px", ...style }
      }
    )
  ] });
};

// src/components/Modal.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var Modal = ({ open, title, onClose, children }) => {
  if (!open) return null;
  return /* @__PURE__ */ jsx3(
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
      children: /* @__PURE__ */ jsxs2("div", { style: { background: "#fff", padding: 16, borderRadius: 12, minWidth: 320 }, children: [
        title && /* @__PURE__ */ jsx3("h3", { style: { marginTop: 0 }, children: title }),
        /* @__PURE__ */ jsx3("div", { children }),
        /* @__PURE__ */ jsx3("div", { style: { marginTop: 12, textAlign: "right" }, children: /* @__PURE__ */ jsx3(Button, { label: "\u0110\xF3ng", onClick: onClose }) })
      ] })
    }
  );
};

// src/components/Card.tsx
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var Card = ({ children, title, style }) => {
  return /* @__PURE__ */ jsxs3(
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
        title && /* @__PURE__ */ jsx4("h3", { style: { marginTop: 0 }, children: title }),
        children
      ]
    }
  );
};

// src/Cart.tsx
import { useState } from "react";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var Cart = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
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
  return /* @__PURE__ */ jsxs4(Card, { title: "\u{1F6D2} Gi\u1ECF h\xE0ng", children: [
    /* @__PURE__ */ jsxs4("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
      /* @__PURE__ */ jsx5(
        Input,
        {
          value: newItem,
          onChange: (e) => setNewItem(e.target.value),
          placeholder: "T\xEAn s\u1EA3n ph\u1EA9m..."
        }
      ),
      /* @__PURE__ */ jsx5(Button, { label: "Th\xEAm", onClick: addItem })
    ] }),
    /* @__PURE__ */ jsx5("ul", { children: items.map((item) => /* @__PURE__ */ jsxs4("li", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
      item.name,
      " - SL:",
      /* @__PURE__ */ jsx5(
        "input",
        {
          type: "number",
          min: 1,
          value: item.quantity,
          onChange: (e) => updateItem(item.id, parseInt(e.target.value || "1", 10)),
          style: { width: 60, padding: 4 }
        }
      ),
      /* @__PURE__ */ jsx5(Button, { label: "X\xF3a", onClick: () => removeItem(item.id) })
    ] }, item.id)) })
  ] });
};
export {
  Button,
  Card,
  Cart,
  Input,
  Modal
};
