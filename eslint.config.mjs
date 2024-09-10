import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import _import from "eslint-plugin-import";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("eslint:recommended"), {
    plugins: {
        import: fixupPluginRules(_import),
    },

    languageOptions: {
        globals: {
            ...globals.node,
        },
        ecmaVersion: 2020,
        sourceType: "module",
        parserOptions: {
            project: "tsconfig.json",
            tsconfigRootDir: ".",
        },
    },

    rules: {
        "no-unused-vars": "warn",
        "no-var": "error",
        "sort-imports": ["error", {
            ignoreDeclarationSort: true,
        }],
        "import/order": ["error", {
            groups: [["builtin", "external", "internal"]],
            "newlines-between": "always",
        }],
        "no-const-assign": "error",
        "no-var": "",
        "prefer-const": ["error", {
            destructuring: "any",
            ignoreReadBeforeAssign: false,
        }],
        "brace-style": ["error", "stroustrup", {
            allowSingleLine: false,
        }],
        "lines-around-comment": ["error", {
            beforeBlockComment: true,
        }],
        indent: ["error", 4],
        "object-curly-newline": ["error", {
            ObjectExpression: { multiline: true, consistent: true },
            ObjectPattern: { multiline: true, consistent: true },
            ImportDeclaration: { multiline: true, consistent: true },
            ExportDeclaration: { multiline: true, consistent: true },
        }],
        "class-methods-use-this": ["error", {
            exceptMethods: [],
        }],
        "lines-between-class-members": ["error", "always", {
            exceptAfterSingleLine: false,
        }],
        "padded-blocks": ["error", { 
            classes: "always"
        }],
    },
}, {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
        parser: tsParser,
    },
}];