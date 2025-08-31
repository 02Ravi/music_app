import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => {
  // read env var from .env files or Vercel dashboard
  const musicLibraryUrl =
    process.env.MUSIC_LIBRARY_URL || 'http://localhost:3001/assets/remoteEntry.js'

  return {
    plugins: [
      react(),
      federation({
        name: 'mainApp',
        remotes: {
          musicLibrary: { external: musicLibraryUrl, format: 'esm' }
        },
        shared: {
          react: { singleton: true, requiredVersion: '^19.0.0' },
          'react-dom': { singleton: true, requiredVersion: '^19.0.0' }
        }
      })
    ],
    server: { port: 3000 },
    build: { target: 'esnext' },
    resolve: { dedupe: ['react', 'react-dom'] },
  //  optimizeDeps: { exclude: ['musicLibrary'] }
  }
})
