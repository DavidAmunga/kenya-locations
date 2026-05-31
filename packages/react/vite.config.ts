import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), dts({ include: ["src"] })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "cjs" ? "cjs" : "js"}`,
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "fuse.js"],
      output: {
        exports: "named",
      },
    },
    copyPublicDir: false,
  },
});
