import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "lib/index.ts"),
        counties: resolve(__dirname, "lib/counties.ts"),
        localities: resolve(__dirname, "lib/localities.ts"),
        areas: resolve(__dirname, "lib/areas.ts"),
        constituencies: resolve(__dirname, "lib/constituencies.ts"),
        wards: resolve(__dirname, "lib/wards.ts"),
        "sub-counties": resolve(__dirname, "lib/sub-counties.ts"),
        search: resolve(__dirname, "lib/search.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        `${entryName}.${format === "cjs" ? "cjs" : "js"}`,
    },
    rollupOptions: {
      external: [],
      output: {
        preserveModules: false,
        exports: "named",
      },
    },
    copyPublicDir: false,
  },
  plugins: [dts({ include: ["lib"] })],
});
