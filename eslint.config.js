import mantine from 'eslint-config-mantine';
import tseslint from 'typescript-eslint';


export default tseslint.config(...mantine, {
  ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}', './.storybook/main.ts'],
  plugins: ['@tanstack/query'],
  extends: ['plugin:@tanstack/query/recommended'],
  rules: {
    '@tanstack/query/exhaustive-deps': 'error',
    '@tanstack/query/no-deprecated-options': 'error',
    '@tanstack/query/prefer-query-object-syntax': 'error',
    '@tanstack/query/stable-query-client': 'error',
  },
});