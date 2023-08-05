//import { fail } from '@sveltejs/kit';
import { StandardValidator } from "typebox-validators/standard/index.js";

import { superValidateSync } from "$lib/index.js";
import { typeboxSchemaWithDefaults } from "../../schemas.js";

const validator = new StandardValidator(typeboxSchemaWithDefaults);

export const load = async () => {
  const form = superValidateSync(validator);

  console.log("TYPEBOX FORM", form);
  return { form };
};

// export const actions = {
// 	default: async ({ request }) => {
// 		const form = superValidateSync(request, typeboxSchema);
// 		console.log('POST', form);

// 		// Convenient validation check:
// 		if (!form.valid) {
// 			// Again, always return { form } and things will just work.
// 			return fail(400, { form });
// 		}

// 		// TODO: Do something with the validated data

// 		// Yep, return { form } here too
// 		return { form };
// 	}
// };
