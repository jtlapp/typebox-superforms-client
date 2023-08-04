import { Optional, Static, TObject } from "@sinclair/typebox";
import {
  AbstractStandardValidator,
  StandardValidator,
} from "typebox-validators";

import { SuperValidateOptions, SuperValidateResult } from "./lib/types";
import { evaluateSync } from "./lib/evaluate-sync";

type SuperformValidator = (value: any) => string | string[] | null;

export function superAssertSync<T extends TObject, M = any>(
  validator: AbstractStandardValidator<T>,
  options?: SuperValidateOptions
): SuperValidateResult<T, M>;

export function superAssertSync<T extends TObject, M = any>(
  data: Partial<Static<T>>,
  validator: AbstractStandardValidator<T>,
  options?: SuperValidateOptions
): SuperValidateResult<T, M>;

export function superAssertSync<T extends TObject, M = any>(
  ...args: any[]
): SuperValidateResult<T, M> {
  const vi = args[0] instanceof AbstractStandardValidator ? 0 : 1;
  return evaluateSync(
    vi === 0 ? undefined : (args[0] as Partial<Static<T>>),
    args[vi] as AbstractStandardValidator<T>,
    args[vi + 1] as SuperValidateOptions | undefined,
    (validator, data) => validator.assert(data)
  );
}

export function superValidateSync<T extends TObject, M = any>(
  validator: AbstractStandardValidator<T>,
  options?: SuperValidateOptions
): SuperValidateResult<T, M>;

export function superValidateSync<T extends TObject, M = any>(
  data: Partial<Static<T>>,
  validator: AbstractStandardValidator<T>,
  options?: SuperValidateOptions
): SuperValidateResult<T, M>;

export function superValidateSync<T extends TObject, M = any>(
  ...args: any[]
): SuperValidateResult<T, M> {
  const vi = args[0] instanceof AbstractStandardValidator ? 0 : 1;
  return evaluateSync(
    vi === 0 ? undefined : (args[0] as Partial<Static<T>>),
    args[vi] as AbstractStandardValidator<T>,
    args[vi + 1] as SuperValidateOptions | undefined,
    (validator, data) => validator.validate(data)
  );
}

export function toValidatorObject(schema: TObject) {
  const validators: Record<string, SuperformValidator> = {};
  for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
    validators[fieldName] = (value) => {
      if (value === "" && fieldSchema[Optional] == "Optional") {
        return null;
      }
      const errors = new StandardValidator(fieldSchema).errors(value);
      const errorMessages = Array.from(errors).map((error) => error.message);
      return errorMessages.length ? errorMessages : null;
    };
  }
  return validators;
}
