module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
    es2020: true,
  },

  ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.js"],

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },

  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],

  settings: {
    react: {
      version: "detect",
    },
  },

  plugins: ["react-refresh"],

  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",

    "react/no-unknown-property": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
