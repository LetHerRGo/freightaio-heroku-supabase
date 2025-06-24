import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  base: "/", // Ensures correct relative paths when served from Express
  build: {
    outDir: "../server/public", // Output Vite build to Express's public folder
    emptyOutDir: true,          // Clean folder before build
  },
  server: {
    proxy: {
      '/login': 'http://localhost:8080',
      '/track': 'http://localhost:8080',
      '/addshipment': 'http://localhost:8080',
      '/agent': 'http://localhost:8080',
      '/client': 'http://localhost:8080',
      '/trace': 'http://localhost:8080',
      '/logs': 'http://localhost:8080',
    },
  },
})
