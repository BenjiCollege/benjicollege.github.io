import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Apex custom domain (gerardocolegio.dev) → serve from root.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
})
