'use strict';

// see https://eslint.org/
// see https://github.com/typescript-eslint/typescript-eslint
// see https://typescript-eslint.io/
// see https://typescript-eslint.io/getting-started

// config based on https://www.robertcooper.me/using-eslint-and-prettier-in-a-typescript-project
// and https://typescript-eslint.io/getting-started
module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser

	parserOptions: {
		ecmaVersion: 'latest', // Allows for the parsing of modern ECMAScript features
		// see https://typescript-eslint.io/packages/parser#project
		project: ['./tsconfig.json', './test/tsconfig.json'],
	},

	extends: [
		'eslint:recommended',
		// Note:
		//   @typescript-eslint/strict-type-checked automatically disables the conflicting base rules
		//   that comes from eslint:recommended.
		//   See Extension Rules at https://typescript-eslint.io/rules/?=extension#extension-rules
		//   See https://typescript-eslint.io/linting/configs/#strict-type-checked
		//   See https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/strict-type-checked.ts
		'plugin:@typescript-eslint/strict-type-checked',
	],

	rules: {
		// https://eslint.org/docs/latest/rules/eqeqeq
		// Require the use of === and !==
		eqeqeq: 'error',

		// https://typescript-eslint.io/rules/no-unused-vars
		// It is set to 'error' by @typescript-eslint/recommended
		// (which also correctly disables ESLint's base no-unused-vars).
		// Let's decrease to only 'warn'.
		'@typescript-eslint/no-unused-vars': 'warn',

		// https://typescript-eslint.io/rules/strict-boolean-expressions
		'@typescript-eslint/strict-boolean-expressions': [
			'error',
			{
				// it is better to be explicit
				allowString: false,
				allowNumber: false,
				allowNullableObject: false,
			},
		],

		// https://typescript-eslint.io/rules/prefer-nullish-coalescing
		'@typescript-eslint/prefer-nullish-coalescing': 'error',

		// https://typescript-eslint.io/rules/class-methods-use-this
		// could be useful
		// 'class-methods-use-this': 'off',
		// '@typescript-eslint/class-methods-use-this': 'error',
	},

	// https://eslint.org/docs/latest/use/configure/rules#using-configuration-files-1
	overrides: [
		{
			files: ['test/**/*.ts'],
			rules: {
				'@typescript-eslint/no-unused-vars': 'off',
			},
		},
	],

	// This file is the root-level one used by the project
	// and ESLint should not search beyond this directory for config files
	root: true,
};
