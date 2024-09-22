import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'assets/style.css';
          return 'assets/[name].[ext]';
        }
      }
    },
    cssCodeSplit: false,
  },
  css: {
    // Assurez-vous que le CSS est extrait dans un fichier séparé
    extract: 'style.css',
  }
})