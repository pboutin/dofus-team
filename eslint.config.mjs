import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsEslintParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import-x';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginReact from 'eslint-plugin-react';
import globals from 'globals';

export default [
  {
    files: ['src/**.*.js', 'src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
      'import-x': eslintPluginImport,
      'react-hooks': eslintPluginReactHooks,
      'react': eslintPluginReact,
    },
    settings: {
      'import-x/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      ...eslintConfigPrettier.rules,
      ...tsEslintPlugin.configs.recommended.rules,
      ...eslintPluginImport.configs.recommended.rules,
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      'import-x/order': [
        'warn',
        {
          'groups': ['builtin', 'external'],

          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
          'pathGroupsExcludedImportTypes': ['type'],
        },
      ],
      'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['src/*'],
              message: 'Imports must be relative to the src directory.',
            },
          ],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { ignoreRestSiblings: true, argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
];
