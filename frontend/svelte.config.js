import adapter from '@sveltejs/adapter-node';

const trustedOrigins = [
	'http://localhost',
	'http://127.0.0.1',
	...((process.env.TRUSTED_ORIGINS ?? '')
		.split(',')
		.map((value) => value.trim())
		.filter(Boolean))
];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		csrf: {
			trustedOrigins
		}
	},
	vitePlugin: {
		dynamicCompileOptions: ({ filename }) =>
			filename.includes('node_modules') ? undefined : { runes: true }
	}
};

export default config;
