module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  // plugins: [
  //   '@typescript-eslint',
  // ],
  rules: {
  },
};
