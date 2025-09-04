module.exports = {
  root: true,
  env: { es6: true, node: true, jest: true },
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  ignorePatterns: ['android/**', 'ios/**', 'vendor/**', 'node_modules/**', 'RNTemp/**'],
  extends: [],
  rules: {},
};
