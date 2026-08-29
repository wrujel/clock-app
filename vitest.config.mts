import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: fileURLToPath(new URL("./", import.meta.url)) },
      // next/image static imports resolve to a StaticImageData object at build
      // time; Vite would hand back a URL string, so stub the shape instead.
      {
        find: /^.*\.(svg|png|jpe?g|webp|avif|gif)$/,
        replacement: fileURLToPath(
          new URL("./test/stubs/image.ts", import.meta.url),
        ),
      },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    coverage: {
      provider: "v8",
      all: true,
      reporter: ["text", "json-summary", "json", "lcov", "html"],
      reportsDirectory: "./coverage",
      include: ["app/**/*.{ts,tsx}"],
      exclude: ["app/**/*.d.ts"],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
