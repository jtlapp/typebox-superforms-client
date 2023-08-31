// adapted from https://github.com/ciscoheat/sveltekit-superforms/blob/main/src/lib/superValidate.ts

import type { Static, TObject } from "@sinclair/typebox";
import {
  type SchemaInfo,
  getSchemaInfo,
  parseFormFields,
} from "typebox-form-parser";
import type { AbstractStandardValidator } from "typebox-validators";

import type {
  SuperValidateOptions,
  SuperValidateResult,
} from "./public-types.js";
import { evaluateData } from "./evaluate-data.js";
import type { ParsedData } from "./internal-types.js";

export async function evaluateAsync<T extends TObject, M = any>(
  data: Request | Partial<Static<T>> | undefined,
  validator: AbstractStandardValidator<T>,
  options: SuperValidateOptions | undefined,
  evaluateData: (validator: AbstractStandardValidator<T>, data: any) => void
): SuperValidateResult<T, M> {
  // if (data && typeof data === 'object' && 'safeParseAsync' in data) {
  //   options = schema as SuperValidateOptions | undefined;
  //   schema = data as T;
  //   data = null;
  // }

  const schemaInfo = getSchemaInfo(validator.schema as TObject<any>);
  let parsedData: ParsedData<T>;
  options ||= {};

  if (data instanceof FormData) {
    parsedData = parseFormFields(data, schemaInfo);
  } else if (data instanceof URL) {
    parsedData = parseFormFields(data.searchParams, schemaInfo);
  } else if (data instanceof URLSearchParams) {
    parsedData = parseFormFields(data, schemaInfo);
  } else if (data instanceof Request) {
    parsedData = await tryParseFormData(data, schemaInfo);
    // } else if (
    //   data &&
    //   typeof data === 'object' &&
    //   'request' in data &&
    //   data.request instanceof Request
    // ) {
    //   parsedData = await tryParseFormData(data.request);
  } else {
    parsedData = {
      id: undefined,
      data: data as Record<string, unknown>,
      posted: false,
    };
  }

  // TODO: reconcile this with call to evaluateData.

  const toValidate = dataToValidate(parsedData, schemaInfo, options);
  const result =
    toValidate !== undefined
      ? evaluateData(toValidate, validator, options, evaluateData)
      : undefined;

  return validateResult<UnwrapEffects<T>, M>(parsedData, schemaInfo, result);
}

/**
 * Check what data to validate. If no parsed data, the default entity
 * may still have to be validated if there are side-effects or errors
 * should be displayed.
 */
function dataToValidate<T extends TObject>(
  parsed: ParsedData<T>,
  schemaInfo: SchemaInfo<T>,
  options: SuperValidateOptions
): Record<string, unknown> | undefined {
  if (!parsed.data) {
    return options.supplyDefaults && options.errors === true
      ? schemaInfo.defaultObject
      : undefined;
  }
  return parsed.data;
}

async function tryParseFormData<T extends TObject>(
  request: Request,
  schemaInfo: SchemaInfo<T>
) {
  let formData: FormData | undefined = undefined;
  try {
    formData = await request.formData();
  } catch (e) {
    if (e instanceof TypeError && e.message.includes("already been consumed")) {
      // Pass through the "body already consumed" error, which applies to
      // POST requests when event/request is used after formData has been fetched.
      throw e;
    }
    // No data found, return an empty form
    return { id: undefined, data: undefined, posted: false };
  }
  return parseFormFields(formData, schemaInfo);
}
