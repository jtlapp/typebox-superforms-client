import { Static, TObject } from "@sinclair/typebox";
import {
  type AbstractStandardValidator,
  StandardValidator,
} from "typebox-validators";

import { SuperValidateOptions, SuperValidateResult } from "./lib/types";
import { evaluateSync } from "./lib/evaluate-sync";

type SuperformValidator = (value: any) => string | string[] | null;

export function superAssertSync<T extends TObject, M = any>(
  data: Partial<Static<T>>,
  validator: AbstractStandardValidator<T>,
  options?: SuperValidateOptions
): SuperValidateResult<T, M> {
  return evaluateSync(
    data,
    validator,
    (validator, data) => validator.assert(data),
    options
  );
}

export function superValidateSync<T extends TObject, M = any>(
  data: Partial<Static<T>>,
  validator: AbstractStandardValidator<T>,
  options?: SuperValidateOptions
): SuperValidateResult<T, M> {
  return evaluateSync(
    data,
    validator,
    (validator, data) => validator.validate(data),
    options
  );
}

export function toSuperformValidators(schema: TObject) {
  const validators: Record<string, SuperformValidator> = {};
  for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
    validators[fieldName] = (value) => {
      const errors = new StandardValidator(fieldSchema as any).errors(value);
      const errorMessages = Array.from(errors).map((error) => error.message);
      return errorMessages.length ? errorMessages : null;
    };
  }
  return validators;
}
