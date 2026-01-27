import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/ElectronProvider/index.ts",
    "src/metro/index.ts",
    "src/expo/index.ts",
    "src/uniwind"
  ],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  outDir: "dist",
  external: [
    "react",
    "react-native",
    "expo",
    "electron"
  ],
  loader: {
    ".css": "copy",
    ".js": "copy" // copies your index.js for Metro
  },
  outExtension({ format }) {
    return {
      js: format === "esm" ? ".mjs" : ".cjs"
    };
  }
});
