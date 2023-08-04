import { StandardValidator } from 'typebox-validators/standard/index.js';
import { superValidateSync } from 'typebox-superforms';

//import { typeboxSchema } from '$lib/typebox-schema.js';
import { Type } from '@sinclair/typebox';

const typeboxSchema = Type.Object({
	name: Type.String({ minLength: 2, defaultValue: 'Jane' }),
	age: Type.Number({ minimum: 13 }),
	email: Type.String({
		pattern: '^[a-z]+@[a-z]+[.][a-z]+$',
		minLength: 10
		//errorMessage: 'Expected email address of 10+ chars'
	})
});

const validator = new StandardValidator(typeboxSchema);

export const load = async () => {
	const form = superValidateSync({}, validator);

	console.log('TYPEBOX FORM', form);
	return { form };
};
