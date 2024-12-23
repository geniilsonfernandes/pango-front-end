import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        // 'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        // 'src/**/*.spec.{ts,tsx}',
        'src/**/*.stories.{ts,tsx}',
        // 'src/main.tsx',
      ],
      all: true,
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
});
