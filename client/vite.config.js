import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  base: "./", // Ensures correct relative paths when served from Express
  build: {
    outDir: "../public", // Output Vite build to Express's public folder
    emptyOutDir: true,          // Clean folder before build
  },
  server: {
    proxy: {
      '/tags': 'http://localhost:8080',
      '/photos': 'http://localhost:8080',
    },
  },
})
