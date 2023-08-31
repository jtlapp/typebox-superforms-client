import { Optional, type Static, type TObject } from "@sinclair/typebox";
import {
  AbstractStandardValidator,
  StandardValidator,
} from "typebox-validators";

import type {
  SuperValidateOptions,
  SuperValidateResult,
} from "./public-types.js";
import { evaluateData } from "./evaluate-data.js";

type SuperformValidator = (value: any) => string | string[] | null;

export function superformLoad<T extends TObject, M>(
  validator: AbstractStandardValidator<T>,
  options?: SuperValidateOptions
): SuperValidateResult<T, M> {
  // TODO: allow disabling validation on load, at least server-side
  return evaluateData(undefined, validator, options, (validator, data) =>
    validator.validate(data)
  );
}

export async function superformAssert<T extends TObject, M = any>(
  validator: AbstractStandardValidator<T>,
  options?: SuperValidateOptions
): Promise<SuperValidateResult<T, M>>;

export async function superformAssert<T extends TObject, M = any>(
  data: Partial<Static<T>>,
  validator: AbstractStandardValidator<T>,
  options?: SuperValidateOptions
): Promise<SuperValidateResult<T, M>>;

export async function superformAssert<T extends TObject, M = any>(
  ...args: any[]
): Promise<SuperValidateResult<T, M>> {
  const vi = args[0] instanceof AbstractStandardValidator ? 0 : 1;
  return evaluateData(
    vi === 0 ? undefined : (args[0] as Partial<Static<T>>),
    args[vi] as AbstractStandardValidator<T>,
    args[vi + 1] as SuperValidateOptions | undefined,
    (validator, data) => validator.assert(data)
  );
}

export async function superformValidate<T extends TObject, M = any>(
  validator: AbstractStandardValidator<T>,
  options?: SuperValidateOptions
): Promise<SuperValidateResult<T, M>>;

export async function superformValidate<T extends TObject, M = any>(
  data: Partial<Static<T>>,
  validator: AbstractStandardValidator<T>,
  options?: SuperValidateOptions
): Promise<SuperValidateResult<T, M>>;

export async function superformValidate<T extends TObject, M = any>(
  ...args: any[]
): Promise<SuperValidateResult<T, M>> {
  const vi = args[0] instanceof AbstractStandardValidator ? 0 : 1;
  return evaluateData(
    vi === 0 ? undefined : (args[0] as Partial<Static<T>>),
    args[vi] as AbstractStandardValidator<T>,
    args[vi + 1] as SuperValidateOptions | undefined,
    (validator, data) => validator.validate(data)
  );
}

export function toValidatorObject(schema: TObject) {
  const validatorObject: Record<string, SuperformValidator> = {};
  for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
    validatorObject[fieldName] = (value) => {
      if (value === "" && fieldSchema[Optional] == "Optional") {
        return null;
      }
      const errors = new StandardValidator(fieldSchema).errors(value);
      const errorMessages = Array.from(errors).map((error) => error.message);
      return errorMessages.length ? errorMessages : null;
    };
  }
  return validatorObject;
}
