// adapted from https://github.com/ciscoheat/sveltekit-superforms/blob/main/src/lib/superValidate.ts

import type { Static, TObject } from "@sinclair/typebox";
import {
  type AbstractStandardValidator,
  ValidationException,
  type ValueError,
} from "typebox-validators";

import type {
  SuperValidateOptions,
  SuperValidateResult,
} from "./public-types.js";
import { evaluateSync } from "./evaluate-sync.js";
import { getSchemaInfo, type SchemaInfo } from "./schema-info.js";
import type { ParsedData } from "./internal-types.js";
import { parseFormData } from "./parse-form-data.js";

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

  const schemaInfo = getSchemaInfo(validator.schema);
  let parsedData: ParsedData<T>;
  options ||= {};

  if (data instanceof FormData) {
    parsedData = parseFormData(data, schemaInfo, options);
  } else if (data instanceof URL || data instanceof URLSearchParams) {
    parsedData = parseSearchParams(data, schemaInfo, options);
  } else if (data instanceof Request) {
    parsedData = await tryParseFormData(data, schemaInfo, options);
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

  // TODO: reconcile this with call to evaluateSync.

  const toValidate = dataToValidate(parsedData, schemaInfo, options);
  const result =
    toValidate !== undefined
      ? evaluateSync(toValidate, validator, options, evaluateData)
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
  schemaInfo: SchemaInfo<T>,
  options: SuperValidateOptions
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
  return parseFormData(formData, schemaInfo, options);
}

function parseSearchParams<T extends TObject>(
  data: URL | URLSearchParams,
  schemaInfo: SchemaInfo<T>,
  options: SuperValidateOptions
): ParsedData<T> {
  if (data instanceof URL) data = data.searchParams;

  const convert = new FormData();
  for (const [key, value] of data.entries()) {
    convert.append(key, value);
  }

  // Only FormData can be posted.
  const output = parseFormData(convert, schemaInfo, options);
  output.posted = false;
  return output;
}
