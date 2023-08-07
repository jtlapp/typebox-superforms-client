import { Kind, type Static, type TObject } from "@sinclair/typebox";
import {
  type AbstractStandardValidator,
  ValidationException,
  type ValueError,
} from "typebox-validators";

import type {
  SuperValidateOptions,
  SuperValidateResult,
} from "./public-types.js";

export function evaluateSync<T extends TObject, M = any>(
  data: Partial<Static<T>> | undefined,
  validator: AbstractStandardValidator<T>,
  options: SuperValidateOptions | undefined,
  evaluateData: (validator: AbstractStandardValidator<T>, data: any) => void
): SuperValidateResult<T, M> {
  const schema = validator.schema as TObject;
  const errors: Record<string, string | string[]> = {};
  let valid = true;

  if (data === undefined) {
    data = {};
    assignDefaults(schema, data);
    valid = validator.test(data);
  } else {
    assignDefaults(schema, data);
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
  }

  return {
    valid,
    posted: false,
    data,
    errors,
    constraints: {},
    id: options?.id,
  };
}

function assignDefaults<T extends TObject>(schema: T, obj: Partial<Static<T>>) {
  for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
    const key = fieldName as keyof Static<T>;
    if (obj[key] === undefined) {
      obj[key] =
        fieldSchema.default ?? (fieldSchema[Kind] === "Boolean" ? false : "");
    }
  }
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
