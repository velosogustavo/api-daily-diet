import { defineConfig } from 'tsup'

  export default defineConfig({
      entry: ['src/**/*.ts', '!src/test/**'],
      outDir: 'build',
      format: ['cjs'],
      sourcemap: true,
      clean: true,
  })