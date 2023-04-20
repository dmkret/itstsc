import adapter from '@sveltejs/adapter-static';
import babelPresetEnv from '@babel/preset-env';
import preprocess from 'svelte-preprocess';

const projectName = process.env.GITHUB_REPOSITORY?.split('/')[0];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		babel: {
			presets: [
				[
					babelPresetEnv,
					{
						loose: true,
						modules: false,
						targets: {
							esmodules: true,
						},
						useBuiltIns: 'usage',
						corejs: { version: '3.30', proposals: true },
					},
				],
			],
		},
	}),

	kit: {
		adapter: adapter(),
		paths: {
			base: projectName ? `/${projectName}` : undefined,
		},
	},
};

export default config;
