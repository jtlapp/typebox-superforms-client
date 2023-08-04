import { Static, TObject } from "@sinclair/typebox";
import type { superValidateSync as originalSuperValidateSync } from "sveltekit-superforms/server";

export type SourceData<T extends TObject> = Request | Partial<Static<T>>;

export interface SuperValidateOptions {
  /**
   * Whether to report error messages. Doesn't affect value of returned
   * `valid` property. Defaults to false.
   */
  errors?: boolean;
  /**
   * Unique ID of the form, needed when there are multiple forms.
   */
  id?: string;
}

export type SuperValidateResult<T extends TObject, M = any> = Omit<
  ReturnType<typeof originalSuperValidateSync<any, M>>,
  "data"
> & {
  data: Partial<Static<T>>;
};
