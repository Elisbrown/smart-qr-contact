import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	preview: {
		allowedHosts: ['smart-qr-contact.onrender.com']
	}
};

export default config;
