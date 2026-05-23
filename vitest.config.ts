import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["lib/tests/**/*.test.ts"],
    setupFiles: ["lib/tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["lib/**/*.ts"],
      exclude: [
        "lib/tests/**",
        "lib/data/**",
        "lib/index.ts",
        "lib/utils/index.ts",
      ],
    },
  },
});
