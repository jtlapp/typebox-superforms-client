import type { Static, TObject } from "@sinclair/typebox";
import {
  type AbstractStandardValidator,
  ValidationException,
  ValueError,
} from "typebox-validators";

import { SuperValidateOptions, SuperValidateResult } from "./types";

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
    // Initialize data with default values

    data = {};
    for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
      if (fieldSchema.defaultValue !== undefined) {
        data[fieldName as keyof Static<T>] = fieldSchema.defaultValue;
      }
    }

    // Only valid when all fields are optional.

    valid = validator.test(data);
  } else {
    // Initialize missing data with default values

    for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
      const key = fieldName as keyof Static<T>;
      if (data[key] === undefined) {
        if (fieldSchema.defaultValue !== undefined) {
          data[key] = fieldSchema.defaultValue;
        }
      }
    }

    // Validate the provided data

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
