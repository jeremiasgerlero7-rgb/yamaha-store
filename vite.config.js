import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logoyamaha.png'],
      manifest: {
        name: 'Yamaha Store',
        short_name: 'Yamaha',
        description: 'Tienda oficial Yamaha',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
      },
      // Genera los iconos automáticamente desde logoyamaha.png
      pwaAssets: {
        config: true
      }
    })
  ]
})