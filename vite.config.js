import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// HTTPS only when VITE_HTTPS=1 (used for the phone server so the mic works);
// the local preview server stays on http.
const useHttps = !!process.env.VITE_HTTPS

export default defineConfig({
  plugins: [react(), ...(useHttps ? [basicSsl()] : [])],
  server: {
    host: true,            // expose on LAN
    allowedHosts: true,    // accept tunnel hostnames too
    ...(useHttps ? { https: true } : {}),
  },
})
