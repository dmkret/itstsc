module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'plugin:compat/recommended',
	],
	plugins: ['svelte3', '@typescript-eslint', 'compat', 'import'],
	ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript'),
		polyfills: ['Promise', 'URL'],
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	rules: {
		'import/extensions': 'off',
		'import/order': [
			'warn',
			{
				alphabetize: { order: 'asc' },
				pathGroups: [
					{
						pattern: '$+(app|env)/**',
						group: 'internal',
						position: 'before',
					},
					{
						pattern: '$lib/**',
						group: 'internal',
						position: 'after',
					},
				],
				groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
				'newlines-between': 'always',
			},
		],
	},
};
