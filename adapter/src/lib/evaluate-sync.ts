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
  evaluateData: (validator: AbstractStandardValidator<T>, data: any) => void,
  options?: SuperValidateOptions
): SuperValidateResult<T, M> {
  const schema = validator.schema as TObject;
  const errors: Record<string, string | string[]> = {};
  let valid = true;

  for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
    const key = fieldName as keyof Static<T>;
    if (data[key] === undefined) {
      if (fieldSchema.defaultValue !== undefined) {
        data[key] = fieldSchema.defaultValue;
      }
    }
  }

  if (options?.errors) {
    try {
      evaluateData(validator, data);
    } catch (e) {
      if (e instanceof ValidationException) {
        valid = false;
        for (const detail of e.details) {
          addErrorMessage(errors, detail);
        }
      } else throw e;
    }
  } else {
    valid = validator.test(data);
  }

  return {
    valid,
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
