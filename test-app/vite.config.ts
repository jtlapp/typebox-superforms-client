import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tsconfigpaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [sveltekit(), tsconfigpaths()]
});
