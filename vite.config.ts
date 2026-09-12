import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Apex custom domain (gerardocolegio.dev) → serve from root.
export default defineConfig({
  base: '/',
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
  plugins: [react(), tailwindcss(), {
    name: 'production-content-policy',
    apply: 'build',
    transformIndexHtml() {
      return [{ tag: 'meta', attrs: {
        'http-equiv': 'Content-Security-Policy',
        // GSAP/React use dynamic style attributes; executable inline scripts
        // and eval remain forbidden. No embedded Twitch player or tracking.
        content: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://api.web3forms.com; media-src 'self' blob:; object-src 'none'; base-uri 'none'; frame-src 'none'; worker-src 'none'; form-action 'self'",
      }, injectTo: 'head-prepend' }]
    },
  }],
})
