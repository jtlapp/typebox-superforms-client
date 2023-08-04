import { z } from 'zod';

export const zodSchema = z.object({
	name: z.string().min(2, '>= 2 chars').default('Jane'),
	age: z.number().min(13, '>= 13'),
	email: z.string().min(10).email()
});
