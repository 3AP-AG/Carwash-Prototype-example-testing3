// Vite config. Dev server proxies /api and /gate to Spring on :8080, so local dev is same-origin
// like production. Test settings live in the locked config/gates/vitest.gate.config.ts.
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const backend = 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    proxy: {
      '/api': backend,
      '/gate': backend,
    },
  },
});
