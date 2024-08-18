import { defineConfig } from 'tsup'

export default defineConfig({
  name: "@yaml-js/envyaml",
  entry: ['src/yaml-js.env.ts'],
  format: ['esm', 'cjs'],
  target: 'node22',
  dts: true,
  minify: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  skipNodeModulesBundle: true,
  platform: 'node'
});
