import { Type } from '@sinclair/typebox';
import { fail } from '@sveltejs/kit';
import { StandardValidator } from 'typebox-validators/standard/index.js';
import { superValidateSync } from 'typebox-superforms';

const typeboxSchema = Type.Object({
	name: Type.String({ minLength: 2, default: 'Jane' }),
	age: Type.Number({ minimum: 13 }),
	email: Type.String({
		pattern: '^[a-z]+@[a-z]+[.][a-z]+$',
		minLength: 10
		//errorMessage: 'Expected email address of 10+ chars'
	})
});

const validator = new StandardValidator(typeboxSchema);

export const load = async () => {
	const form = superValidateSync(validator);

	console.log('TYPEBOX FORM', form);
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = superValidateSync(request, typeboxSchema);
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
