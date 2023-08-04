import { Type } from '@sinclair/typebox';

export const typeboxSchema = Type.Object({
	name: Type.String({ minLength: 2 }),
	age: Type.Number({ minimum: 13 }),
	email: Type.String({
		pattern: '^[a-z]+@[a-z]+[.][a-z]+$',
		minLength: 10
		//errorMessage: 'Expected email address of 10+ chars'
	})
});
