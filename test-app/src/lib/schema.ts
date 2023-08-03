import { z } from 'zod';

export const demoSchema = z.object({
	name: z.string().min(2, '>= 2 chars').default('Jane'),
	email: z.string().email()
});
