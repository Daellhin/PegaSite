import adapter from '@sveltejs/adapter-static';
import nesting from 'postcss-nesting';
import preprocess from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		preprocess({
			postcss: {
				plugins: [nesting()]
			}
		})
	],
	onwarn: (warning, handler) => {
		if (
			warning.code === "css-unused-selector" ||
			warning.filename.match(/^\/node_modules\/cl-editor/) ||
			warning.filename.match(/^\/node_modules\/svelte-multiselect/) ||
			warning.filename.match(/^\/node_modules\/svelte-select/)
		) { return }
		handler(warning)
	},
	kit: {
		adapter: adapter({
			pages: 'public',
			assets: 'public',
			fallback: 'fallback.html',
			precompress: false
		}),
		alias: {
			$components: 'src/components',
			$data: 'src/data'
		}
	},
};

export default config;
