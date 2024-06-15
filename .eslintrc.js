module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
      jest: true
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:security/recommended-legacy',
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: [
      'react',
    ],
    rules: {
      'no-console': 'warn',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };
