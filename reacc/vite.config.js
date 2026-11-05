import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Your Express app (lab.js) serves /api/login, /api/experiments, etc.
      // This forwards those requests from the Vite dev server to Express,
      // so fetch("/api/login") keeps working exactly like it did in plain HTML.
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      // These two live at the root of your Express app (not under /api).
      // Without them, Vite would answer with index.html and res.json() would
      // blow up. /logout is used by the Navbar; /refresh_token by Manage when
      // an access token expires.
      "/logout": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/refresh_token": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
