import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: "docs",
			//fallback: "index.html",
			//precompress: true,
		}),
		paths: {
			//base: process.argv.includes('dev') ? "" : "/sprite-replicator",
			relative: true,
		},
	},
};

export default config;
