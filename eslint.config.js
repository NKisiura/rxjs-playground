// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
      eslintConfigPrettier,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // TYPESCRIPT RULES
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: {
            regex: "^(?!.*Interface$)",
            match: true,
          },
          leadingUnderscore: "forbid",
          trailingUnderscore: "forbid",
        },
        {
          selector: "enum",
          format: ["PascalCase"],
          custom: {
            regex: "^(?!.*Enum$)",
            match: true,
          },
          leadingUnderscore: "forbid",
          trailingUnderscore: "forbid",
        },
      ],

      // ANGULAR RULES
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@angular-eslint/component-max-inline-declarations": ["error"],
      "@angular-eslint/consistent-component-styles": ["error"],
      "@angular-eslint/contextual-decorator": ["error"],
      "@angular-eslint/no-async-lifecycle-method": ["error"],
      "@angular-eslint/no-attribute-decorator": ["error"],
      "@angular-eslint/no-conflicting-lifecycle": ["error"],
      "@angular-eslint/no-duplicates-in-metadata-arrays": ["error"],
      "@angular-eslint/prefer-on-push-component-change-detection": ["error"],
      "@angular-eslint/prefer-standalone": ["error"],
      "@angular-eslint/relative-url-prefix": ["error"],
      "@angular-eslint/sort-lifecycle-methods": ["error"],
      "@angular-eslint/use-component-selector": ["error"],
      "@angular-eslint/use-component-view-encapsulation": ["error"],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/conditional-complexity": [
        "error",
        {
          maxComplexity: 3,
        },
      ],
      "@angular-eslint/template/cyclomatic-complexity": [
        "error",
        {
          maxComplexity: 5,
        },
      ],
      "@angular-eslint/template/attributes-order": ["error"],
      "@angular-eslint/template/button-has-type": ["error"],
      "@angular-eslint/template/no-duplicate-attributes": ["error"],
      "@angular-eslint/template/no-inline-styles": ["error"],
      "@angular-eslint/template/no-interpolation-in-attributes": ["error"],
      "@angular-eslint/template/prefer-control-flow": ["error"],
      "@angular-eslint/template/prefer-self-closing-tags": ["error"],
      "@angular-eslint/template/use-track-by-function": ["error"],
    },
  },
);
