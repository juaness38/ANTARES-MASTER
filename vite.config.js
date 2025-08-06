import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    proxy: {
      // Driver AI Health endpoint
      '/api/driver/health': {
        target: 'http://3.85.5.222:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/driver\/health/, '/api/health'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 Driver Health Proxy Request (LIGHTSAIL):', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ Driver Health Proxy Response (LIGHTSAIL):', proxyRes.statusCode);
          });
        }
      },
      
      // Driver AI Chat endpoint (testing Lightsail for /api/chat)
      '/api/driver/chat': {
        target: 'http://3.85.5.222:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/driver\/chat/, '/api/chat'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 Driver Chat Proxy Request (→ LIGHTSAIL /api/chat):', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ Driver Chat Proxy Response (LIGHTSAIL):', proxyRes.statusCode);
          });
        }
      },
      
      // Driver AI Analyze endpoint
      '/api/driver/analyze': {
        target: 'http://3.85.5.222:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/driver\/analyze/, '/api/analyze'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 Driver Analyze Proxy Request (LIGHTSAIL):', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ Driver Analyze Proxy Response (LIGHTSAIL):', proxyRes.statusCode);
          });
        }
      }
    }
  }
})
