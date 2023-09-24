/// <reference types="vitest" />
import { defineConfig } from 'vite'
import veauryVitePlugins from 'veaury/vite/index.js'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vue', 'pinia'],
      dirs: ['./stores', './composables']
    }),
    vue(),
    // Turn off vue and vuejsx plugins
    // vue(),
    // vueJsx(),
    // When the type of veauryVitePlugins is set to vue,
    // only jsx in files in the directory named 'react_app' will be parsed with react jsx,
    // and jsx in other files will be parsed with vue jsx
    veauryVitePlugins({
      type: 'vue'
      // Configuration of @vitejs/plugin-vue
      // vueOptions: {...},
      // Configuration of @vitejs/plugin-react
      // reactOptions: {...},
      // Configuration of @vitejs/plugin-vue-jsx
      // vueJsxOptions: {...}
    })
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
