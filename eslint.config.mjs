// @ts-check

import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

export default tseslint.config(js.configs.recommended, {
  files: ['**/*.ts', '**/*.mjs', '**/*.cjs'],
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.jest,
    },
    parser: tseslint.parser,
    parserOptions: {
      project: true,
      ecmaVersion: 2020,
    },
  },
  plugins: {
    eslintPluginUnicorn,
    prettier,
    '@typescript-eslint': tseslint.plugin,
  },
  rules: {
    'no-unused-vars': 'off', // covered by TS
    'no-undef': 'off', // covered by TS
    'prettier/prettier': 'error',
  },
});
