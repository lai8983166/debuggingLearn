import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vitejs.dev/config/
// `base` is set to './' so the production build works under sub-paths
// (e.g. when deployed to https://<user>.github.io/devtools-teaching-lab/).
// Override with VITE_BASE_PATH env if you deploy at root.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
