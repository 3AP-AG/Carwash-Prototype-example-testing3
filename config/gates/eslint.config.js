// Gate: lint (frontend and e2e). Locked. Run by the Makefile from the repo root with
// `--no-inline-config`, so no eslint-disable comment can switch a rule off. Paths below are relative
// to the repo root. Encodes template rules as errors:
// - no fetch / XMLHttpRequest / axios outside src/api/: API calls go through the generated client
// - UI only from '@/ui', never from ui/ internals or MUI / Emotion
// - a feature imports only '@/ui', '@/api' and '@/platform', never another feature
// - no @ts-ignore / @ts-nocheck; no .only / .skip in tests
// Packages resolve from frontend/: this folder has no node_modules.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(new URL('../../frontend/package.json', import.meta.url));
const js = require('@eslint/js');
const globals = require('globals');
const reactHooks = require('eslint-plugin-react-hooks');
const tseslint = require('typescript-eslint');

const gatesDir = fileURLToPath(new URL('.', import.meta.url));

const useGeneratedClient = 'Use the generated client in src/api/generated.';
const uiPatterns = [
  { group: ['@/ui/*', '**/ui/*'], message: "Import UI from '@/ui' only." },
  { group: ['@mui/*', '@emotion/*'], message: "MUI is used only inside src/ui; import components from '@/ui'." },
];
const noFocusedOrSkipped = ['it', 'describe', 'test'].flatMap((object) => [
  { object, property: 'only', message: 'No focused tests.' },
  { object, property: 'skip', message: 'No skipped tests.' },
]);

export default tseslint.config(
  { ignores: ['frontend/dist/**', 'frontend/src/api/generated/**', '**/*.config.{ts,js,mjs}'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['frontend/src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.gate.json'],
        tsconfigRootDir: gatesDir,
      },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: useGeneratedClient },
        { name: 'XMLHttpRequest', message: useGeneratedClient },
      ],
      'no-restricted-imports': [
        'error',
        { paths: [{ name: 'axios', message: useGeneratedClient }], patterns: uiPatterns },
      ],
      'no-restricted-properties': ['error', ...noFocusedOrSkipped],
    },
  },
  {
    // A feature never imports another feature; shared code belongs in ui/, api/ or platform/.
    files: ['frontend/src/features/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'axios', message: useGeneratedClient }],
          patterns: [
            ...uiPatterns,
            {
              group: ['@/features/*', '**/features/*'],
              message: "A feature imports only '@/ui', '@/api' and '@/platform', never another feature.",
            },
          ],
        },
      ],
    },
  },
  {
    // Acceptance tests: the same bans on skipped, focused and ts-ignored tests.
    files: ['e2e/**/*.ts'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: ['./tsconfig.e2e.json'],
        tsconfigRootDir: gatesDir,
      },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
      'no-restricted-properties': ['error', ...noFocusedOrSkipped],
    },
  },
  {
    // The fetcher is the one place allowed to call fetch.
    files: ['frontend/src/api/client.ts'],
    rules: { 'no-restricted-globals': 'off' },
  },
  {
    // ui/ itself may import its own files and MUI.
    files: ['frontend/src/ui/**'],
    rules: { 'no-restricted-imports': 'off' },
  },
);
