import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    browser: {
      enabled: true,
      provider: "playwright",
      instances: [{ browser: "chromium" }],
      headless: true,
    },
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.test.ts"],
    env: {
      NODE_ENV: "test",
    },
  },
  optimizeDeps: {
    exclude: ["@sqlite.org/sqlite-wasm"],
  },
});
