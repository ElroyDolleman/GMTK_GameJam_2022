module.exports = {
	"ignorePatterns": [
		"*.json",
		"*.js"
	],
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"plugins": [
		"@typescript-eslint"
	],
	"overrides": [
		{
			"files": ['*.ts', '*.tsx'],
			"parserOptions": {
				"project": ['./tsconfig.json'],
			},
		},
	],
	"rules": {
		"curly": "error",
		"no-new-wrappers": "error",
		"prefer-const": "off",
		"no-constant-condition": "error",
		"no-var": "error",
		"no-empty": "off",
		"space-before-blocks": "off",
		"no-empty-function": "off",
		"quotes": ["error", "single"],
		"indent": ["error", "tab"],
		"brace-style": ["error", "allman", { "allowSingleLine": true }],
		"no-trailing-spaces": "error",

		// TYPESCRIPT
		"@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/no-inferrable-types": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/await-thenable": "error",
		"@typescript-eslint/prefer-readonly": "off",
		"@typescript-eslint/explicit-function-return-type": "error",
		"@typescript-eslint/space-before-blocks": "error",
		"@typescript-eslint/type-annotation-spacing": "error",
		"@typescript-eslint/explicit-member-accessibility": "error",
		"@typescript-eslint/typedef": [
			"error",
			{
				"memberVariableDeclaration": true,
				"propertyDeclaration": true,
				"parameter": true,
			}
		]
	},
	"ignorePatterns": ["src/**/*.test.ts", "src/frontend/generated/*"]
}