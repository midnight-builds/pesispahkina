import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'dev-dist', 'node_modules'] },
  // Selainpuolen lähdekoodi
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2021,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Virhe (ei varoitus): varoitukset jäävät roikkumaan, ja rikkoutunut
      // Fast Refresh huomataan vasta kun HMR lakkaa toimimasta.
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Tyyppi-importit `import type` -muodossa (koodikannan vallitseva tapa) —
      // pitää tyypit erillään ajonaikaisista riippuvuuksista bundlatessa.
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      // == sallittu vain null-vertailuun (x == null kattaa myös undefinedin).
      eqeqeq: ['error', 'always', { null: 'ignore' }],
    },
  },
  // Node-puolen konfiguraatiotiedostot ja e2e-testit
  {
    files: ['*.{js,ts}', 'vite.config.ts', 'e2e/**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
);
