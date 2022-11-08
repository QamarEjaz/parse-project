module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  ignorePatterns: ['**/*.css', '**/*.scss', '**/*.png'],
  rules: {
    // indent: ['error', 2],
    'linebreak-style': ['warn', 'unix'],
    // quotes: ['warn', 'single'],
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
    ],
    '@typescript-eslint/explicit-function-return-type': 'warn', // Consider using explicit annotations for object literals and function return types even when they can be inferred.
    'no-empty': 'warn'
  },
  globals: {
    React: true,
    google: true,
    mount: true,
    mountWithRouter: true,
    shallow: true,
    shallowWithRouter: true,
    context: true,
    expect: true,
    jsdom: true,
    JSX: true,
    window: true,
    Element: true,
    HTMLElement: true,
    HTMLDivElement: true,
    HTMLInputElement: true,
    HTMLTextAreaElement: true,
    HTMLButtonElement: true,
    SVGSVGElement: true,
    document: true
  }
};