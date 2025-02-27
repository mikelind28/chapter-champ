import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
    fs: {
      allow: [
        'node_modules/slick-carousel/slick/fonts', // Explicitly allow access to slick-carousel fonts
        'public',  // Ensure static assets in public are accessible
        'src'      // Allow access to source files
      ]
    }
  },
});