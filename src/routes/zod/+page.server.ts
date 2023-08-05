import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";

import { zodSchema } from "../schemas.js";

export const load = async () => {
  // Server API:
  const form = await superValidate(zodSchema);

  // Always return { form } in load and form actions.
  console.log("ZOD FORM", form);
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zodSchema);
    console.log("POSTED ACTION", form);

    // Convenient validation check:
    if (!form.valid) {
      // Again, always return { form } and things will just work.
      return fail(400, { form });
    }

    // TODO: Do something with the validated data

    // Yep, return { form } here too
    return { form };
  },
};
