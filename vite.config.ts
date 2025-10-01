import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Use relative base path for GitHub Pages, root for local dev
  const base = command === 'build' && mode === 'production'
    ? '/feature-flag-service/'
    : '/'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base,
  }
})
