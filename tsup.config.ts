import { defineConfig } from 'tsup'

  export default defineConfig({
      entry: ['src/server.ts'],
      outDir: 'build',
      format: ['cjs'],
      sourcemap: true,
      clean: true,
  })