//import { fail } from '@sveltejs/kit';
import { StandardValidator } from "typebox-validators/standard/index.js";

import { superValidateSync } from "$lib/index.js";
import { typeboxSchema } from "../schemas.js";

const validator = new StandardValidator(typeboxSchema);

export const load = async () => {
  const form = superValidateSync(validator);

  console.log("TYPEBOX FORM", form);
  return { form };
};
