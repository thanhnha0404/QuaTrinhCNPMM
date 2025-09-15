import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "demo",
  server: {
    port: 5173
  },
  resolve: {
    alias: {
      "cart-library": "../src"
    }
  }
});



