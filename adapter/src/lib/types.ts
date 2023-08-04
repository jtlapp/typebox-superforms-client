import { Static, TObject } from "@sinclair/typebox";
import type { superValidateSync as originalSuperValidateSync } from "sveltekit-superforms/server";

export interface SuperValidateOptions {
  errors?: boolean; // Add or remove errors from output (valid status is always preserved)
  id?: string; // Form id, for multiple forms support
}

export type SuperValidateResult<T extends TObject, M = any> = Omit<
  ReturnType<typeof originalSuperValidateSync<any, M>>,
  "data"
> & {
  data: Partial<Static<T>>;
};
