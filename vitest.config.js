import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.{js,ts}", "src/**/*.spec.{js,ts}"],
    globals: true,
    clearMocks: true,
    restoreMocks: true,
  },
});
