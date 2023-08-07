import type { Static, TObject } from "@sinclair/typebox";
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
  /**
   * Whether to provide the schema-supplied defaults for missing values.
   * Defaults to false. When false or when the schema does not explicitly
   * provide a default, optional fields default to `undefined`, nullable fields
   * default to `null`, boolean fields default to `false`, and all other fields
   * default to the empty string, including numeric fields. This latter rule
   * keeps fields from showing `0`, which may be unreasonable.
   */
  supplyDefaults?: boolean;
}

export type SuperValidateResult<T extends TObject, M = any> = Omit<
  ReturnType<typeof originalSuperValidateSync<any, M>>,
  "data"
> & {
  data: Partial<Static<T>>;
};
