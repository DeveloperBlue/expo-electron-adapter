import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    main: 'electron/main.ts',
    preload: 'electron/preload.ts'
  },
  outDir: '.electron/build/bundle',
  format: ['cjs'],
  platform: 'node',
  target: 'node20',
  external: ['electron'],
  bundle: true,
  sourcemap: true,
  clean: true,
  minify: false, // or true for production
});