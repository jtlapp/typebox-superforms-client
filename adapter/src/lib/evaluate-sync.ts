import type { Static, TObject } from "@sinclair/typebox";
import {
  type AbstractStandardValidator,
  ValidationException,
  ValueError,
} from "typebox-validators";

import { SuperValidateOptions, SuperValidateResult } from "./types";

export function evaluateSync<T extends TObject, M = any>(
  data: Partial<Static<T>>,
  validator: AbstractStandardValidator<T>,
  evaluate: (validator: AbstractStandardValidator<T>, data: any) => void,
  options?: SuperValidateOptions
): SuperValidateResult<T, M> {
  const schema = validator.schema as TObject;
  const errors: Record<string, string | string[]> = {};
  let errored = false;

  for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
    const key = fieldName as keyof Static<T>;
    if (data[key] === undefined) {
      if (fieldSchema.defaultValue !== undefined) {
        data[key] = fieldSchema.defaultValue;
      }
    }
  }

  try {
    evaluate(validator, data);
  } catch (e) {
    if (e instanceof ValidationException) {
      errored = true;
      if (!options?.errors) {
        for (const detail of e.details) {
          addErrorMessage(errors, detail);
        }
      }
    } else throw e;
  }

  return {
    valid: !errored,
    posted: true,
    data,
    errors,
    constraints: {},
    id: options?.id,
  };
}

function addErrorMessage(
  errors: Record<string, string | string[]>,
  detail: ValueError
) {
  const field = detail.path.substring(1);
  const existing = errors[field];
  if (existing) {
    if (Array.isArray(existing)) {
      existing.push(detail.message);
    } else {
      errors[field] = [existing, detail.message];
    }
  } else {
    errors[field] = detail.message;
  }
}
