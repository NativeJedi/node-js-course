import js from '@eslint/js';
import node from 'eslint-plugin-node';
import security from 'eslint-plugin-security';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  {
    extends: ['js/recommended', 'prettier'],
    plugins: {
      js,
      node,
      security,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-console': 'warn',
    },
  },
  prettier,
]);
