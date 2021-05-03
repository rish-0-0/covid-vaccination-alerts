module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "airbnb-base",
    "plugin:import/typescript",
    "plugin:import/extensions",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  // plugins: [
  //   '@typescript-eslint',
  // ],
  rules: {
    "no-console": 0,
  },
};
