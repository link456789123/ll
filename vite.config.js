import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// GitHub Pages 访问地址带仓库名前缀（https://<username>.github.io/<repo>/）
// 因此构建产物需要设置 base；开发时保持 '/' 方便本地预览
const REPO_NAME = 'll'

export default defineConfig(({ command }) => ({
  // ⚠️ 若 GitHub 仓库名与此不一致，请同步修改 REPO_NAME
  base: command === 'build' ? `/${REPO_NAME}/` : '/',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
