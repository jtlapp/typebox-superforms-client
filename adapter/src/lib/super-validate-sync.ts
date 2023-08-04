import type { Static, TObject } from "@sinclair/typebox";
import {
  ValidationException,
  type AbstractStandardValidator,
  ValueError,
} from "typebox-validators";
import type { superValidateSync as superformsSuperValidateSync } from "sveltekit-superforms/server";

export interface SuperValidateOptions {
  errors?: boolean; // Add or remove errors from output (valid status is always preserved)
  id?: string; // Form id, for multiple forms support
}

export function superValidateSync<T extends TObject, M = any>(
  data: Partial<Static<T>>,
  validator: AbstractStandardValidator<T>,
  options?: SuperValidateOptions
): ReturnType<typeof superformsSuperValidateSync<any, M>> {
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
    validator.validate(data);
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
