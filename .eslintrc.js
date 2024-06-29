  module.exports = {
    "parserOptions": {
      "ecmaVersion": 2020,  // Ensures ESLint parses modern ECMAScript features
      "project": "tsconfig.eslint.json",
      "tsconfigRootDir": __dirname,
      "sourceType": "module",
    },
    "env": {
      "es6": true,  // Enables ES6 global variables
      "node": true  // Node.js global variables and Node.js scoping
    },
    "extends": [
      "eslint:recommended"  // Start with a base of recommended rules
    ],
    "plugins": [
      "import"  // Use the import plugin
    ],
    "rules": {
      "sort-imports": ["error", {
        "ignoreDeclarationSort": true
      }],
      "import/order": ["error", {
        "groups": [["builtin", "external", "internal"]],
        "newlines-between": "always"
      }],
      "no-const-assign": "error",  // Disallow modifying variables that are declared using const
      "no-var": "error",  // Require let or const instead of var
      "prefer-const": ["error", {
        "destructuring": "any",
        "ignoreReadBeforeAssign": false
      }]
    },
  }
