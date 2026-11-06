import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const API_BASE_URL = 'http://localhost/fs2026/kanba_bd/api'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const apiUrl = new URL(env.VITE_API_BASE_URL || API_BASE_URL)
  const apiProxy = {
    target: apiUrl.origin,
    changeOrigin: true,
    rewrite: (path) => `${apiUrl.pathname.replace(/\/+$/, '')}${path.replace(/^\/api/, '')}`,
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': apiProxy,
      },
    },
    preview: {
      proxy: {
        '/api': apiProxy,
      },
    },
  }
})
