import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['pdfjs-dist'] // Ensures pdf.js works properly
  },
  build: {
    rollupOptions: {
      external: ['pdfjs-dist/build/pdf.worker.mjs']
    }
  }
});
