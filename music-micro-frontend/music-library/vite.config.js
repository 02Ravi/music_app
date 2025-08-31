

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'musicLibrary',
      filename: 'remoteEntry.js',
      exposes: { './MusicLibrary': './src/MusicLibrary.jsx' },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' }
      }
    })
  ],
  build: { target: 'esnext', minify: false, cssCodeSplit: false },
  server: { port: 3001, cors: true },
  preview: { port: 3001, cors: true },
  resolve: { dedupe: ['react', 'react-dom'] }
})
