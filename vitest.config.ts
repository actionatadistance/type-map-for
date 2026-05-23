import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
      tsconfig: './tsconfig.json',
      include:  ['packages/*/test/**/*.test-d.ts'],
    },
    include: [],
  },
});
