import { defineConfig } from "vite";

// Local preview harness with a mocked hass object (dev/index.html). Not shipped.
export default defineConfig({ root: ".", server: { port: 5173, host: "127.0.0.1" } });
