module.exports = {
  root: true,
  plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    "react/react-in-jsx-scope": "off",
  },
};
