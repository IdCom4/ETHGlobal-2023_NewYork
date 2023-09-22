/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vue', 'pinia'],
      dirs: ['./stores', './composables']
    }),
    vue()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/tests-setup.ts']
  },
  resolve: {
    alias: {
      '@': './'
    }
  }
})
