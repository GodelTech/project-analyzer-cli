const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-plugin-prettier');
const eslintPluginUnicorn = require('eslint-plugin-unicorn');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
    },
    plugins: {
      eslintPluginUnicorn,
      prettier,
    },
    rules: {
      // 'semi': 'error',
      'prettier/prettier': 'error',
    },
  },
];
