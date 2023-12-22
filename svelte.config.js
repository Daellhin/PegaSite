import adapter from '@sveltejs/adapter-static'
import nesting from 'postcss-nesting'
import preprocess from 'svelte-preprocess'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

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
			warning.code === "a11y-no-noninteractive-tabindex" ||
			warning.code === "a11y-label-has-associated-control" ||
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
			$data: 'src/data',
			$lib: 'src/lib',
		},
		version: {
            name: process.env.npm_package_version
        }
	},
}

export default config
