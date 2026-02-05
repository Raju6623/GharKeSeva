import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: 'public',
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  build: {
    // Bundle optimization for production
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk - React ecosystem
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          // Redux chunk
          'redux': ['@reduxjs/toolkit', 'react-redux'],
          // UI library chunk
          'ui': ['lucide-react'],
          // Axios chunk
          'http': ['axios']
        }
      }
    },
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.log in production
        drop_debugger: true  // Remove debugger statements
      }
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Source maps for production debugging
    sourcemap: false
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux', 'axios']
  }
})
