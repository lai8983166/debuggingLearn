module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'vitest.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // Custom: warn on [TEACHING_BUG] markers so reviewers can spot intentional bugs.
    // We don't fail the build (the markers are intentional), just surface them.
    'no-restricted-syntax': [
      'warn',
      {
        selector: "Literal[value=/\\[TEACHING_BUG\\]/]",
        message:
          '[TEACHING_BUG] marker found — make sure this is an intentional teaching bug, not a real defect.',
      },
    ],
  },
};
