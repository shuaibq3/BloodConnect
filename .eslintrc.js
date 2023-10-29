module.exports = {
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {}
    }
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard-with-typescript'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}', '*.ts'
      ],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 2
      },
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'import/no-unresolved': ['error'],
    'no-console': ['warn'],
    '@typescript-eslint/consistent-type-definitions': ['off'],
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/space-before-function-paren': ['error', 'never'],
    '@typescript-eslint/no-empty-interface': ['off'],
    '@typescript-eslint/no-empty-function': ['off'],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: { delimiter: 'semi', requireLast: true },
      singleline: { delimiter: 'semi', requireLast: false }
    }]
  },
  ignorePatterns: ['coverage/', '**/node_modules']
}
