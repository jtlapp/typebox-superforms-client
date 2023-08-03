import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

import { demoSchema } from '$lib/schema.js';

export const load = async () => {
	// Server API:
	const form = await superValidate(demoSchema);

	// Always return { form } in load and form actions.
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, demoSchema);
		console.log('POST', form);

		// Convenient validation check:
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated data

		// Yep, return { form } here too
		return { form };
	}
};
