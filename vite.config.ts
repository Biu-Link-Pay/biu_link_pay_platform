import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    // vue-i18n 生产构建必需，避免 __INTLIFY_PROD_DEVTOOLS__ 未定义导致空白屏
    __INTLIFY_PROD_DEVTOOLS__: false,
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: true,
  },
  plugins: [
    vue(),
    vueDevTools({
      launchEditor: 'cursor',
    }),
    tailwindcss(),
    // 打包分析
    mode === 'analyze' && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境移除 console.log
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 打包分析时生成 sourcemap
    sourcemap: mode === 'analyze',
  },
}))
