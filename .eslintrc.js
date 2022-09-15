module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "airbnb-base",
    /* 'plugin:@typescript-eslint/recommended',
          'plugin:@typescript-eslint/recommended-requiring-type-checking', */
  ],
  // "parser": '@typescript-eslint/parser',
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
    createDefaultProgram: true,
  },
  plugins: [
    /* '@typescript-eslint', */
    "unused-imports",
  ],
  rules: {
    "max-len": [
      "error",
      {
        code: 150,
      },
    ],
    "no-console": "warn",
    "no-empty": "warn",
    "no-trailing-spaces": "error",
    "import/prefer-default-export": "off",
    /* '@typescript-eslint/no-floating-promises': 0,
          '@typescript-eslint/no-misused-promises': 0,
          '@typescript-eslint/no-unsafe-call': 'warn',
          '@typescript-eslint/no-unsafe-member-access': 0,
          '@typescript-eslint/restrict-template-expressions': 0,
          '@typescript-eslint/no-unsafe-assignment': 0,
          '@typescript-eslint/no-unsafe-return': 0, */
    "no-underscore-dangle": 0,
    "no-param-reassign": 0,
    "class-methods-use-this": 0,
    "no-useless-constructor": 0,
    "no-useless-escape": 0,
    "@typescript-eslint/no-var-requires": 0,
    "no-unsafe-call": 0,
    "no-mixed-operators": 0,
    radix: 0,
    "no-plusplus": 0,
    /* '@typescript-eslint/no-inferrable-types': 0, */
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts"],
        moduleDirectory: ["node_modules", "src/"],
      },
    },
  },
};
