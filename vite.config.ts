import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // Optimize build performance
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'react-hot-toast'],
          supabase: ['@supabase/supabase-js'],
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Optimize for production
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  },
  server: {
    // Optimize dev server
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    // Pre-bundle dependencies for faster dev startup
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'react-hot-toast',
      '@supabase/supabase-js'
    ]
  }
})