import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./node_modules/vitest-launchdarkly-mock/dist/index.js', './setup-test.js'],
    alias: {
      '@/': path.resolve(__dirname, 'src') + '/',
    },
  },
});
