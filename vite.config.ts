import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

// Single ES module bundle for Home Assistant. Files in public/ (room images)
// are copied next to it so HACS installs them together (HACS downloads all of dist/).
export default defineConfig({
  define: { __ATLAS_VERSION__: JSON.stringify(pkg.version) },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2021",
    lib: {
      entry: "src/atlas-home.ts",
      formats: ["es"],
      fileName: () => "atlas-home.js",
    },
    rolldownOptions: {
      output: { codeSplitting: false },
    },
  },
});
