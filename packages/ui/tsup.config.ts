import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outExtension({ format }) {
    return { js: format === 'esm' ? '.mjs' : '.js' };
  },
  external: ['react', 'react-dom', 'react-hook-form', 'zod', '@franklinjunior23/react-formsteps-core'],
});
