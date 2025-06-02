module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended",
  ],
  plugins: ["prettier", "import"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-console": "error",
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^(req|res|next)$",
      },
    ],
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        alphabetize: { order: "asc", caseInsensitive: true },
        "newlines-between": "always",
      },
    ],
    "prettier/prettier": ["error", { endOfLine: "lf" }],
    "import/extensions": ["error", "ignorePackages", { js: "always" }],
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["**/*.test.js"] },
    ],
  },
  settings: {
    "import/resolver": {
      node: { extensions: [".js"] },
    },
  },
};
