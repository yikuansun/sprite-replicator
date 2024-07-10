import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: "docs",
			fallback: "index.html",
			precompress: true,
		}),
		paths: {
			base: process.argv.includes('dev') ? "" : "/photopea-sketchfab"
		},
	},
};

export default config;
