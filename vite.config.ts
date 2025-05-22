import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: '뭐먹을냉?',
        short_name: '뭐먹을냉?',
        description: '뭐먹을냉? PWA',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        prefer_related_applications: true,
        lang: 'ko',
        display: 'standalone',
        icons: [
          {
            src: 'refrigerator.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'refrigerator.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    })
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 8080
  }
})