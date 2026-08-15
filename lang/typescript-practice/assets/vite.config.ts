import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [],
  test: {
    projects: [
      {
        name: 'unit',
        test: {
          environment: 'node',
          include: ['src/**/*.test.ts'],
        },
      },
    ],
  },
  lint: {
    ignorePatterns: ['dist/**'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      'typescript/consistent-type-definitions': ['error', 'interface'],

      // assertions: ban as / angle-bracket (as const still allowed)
      'typescript/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' },
      ],
      'typescript/no-unnecessary-type-assertion': 'error',
      'typescript/no-explicit-any': 'error',

      // don't throw away known types
      'typescript/no-inferrable-types': 'error',
      'typescript/no-empty-object-type': 'error',
      'typescript/no-restricted-types': [
        'error',
        {
          types: {
            object: 'Use a concrete type or Record<string, T>.',
            unknown:
              'Parse at the boundary; don\'t pass unknown through the app.',
            '{}': 'Not a dictionary; use a concrete type.',
          },
        },
      ],

      // array-spread branch types; object `{}` omit is not covered
      'unicorn/consistent-empty-array-spread': 'error',
    },
  },
  fmt: {
    ignorePatterns: ['dist/**'],
    singleQuote: true,
    sortPackageJson: true,
    sortImports: true,
    sortTailwindcss: true,
  },
  staged: {
    '*.{js,ts,tsx}': 'vp check --fix',
  },
});
