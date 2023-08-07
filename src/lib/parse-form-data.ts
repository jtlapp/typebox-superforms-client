import type { Static, TObject } from "@sinclair/typebox";
//import { parse } from "devalue";

import {
  unspecifiedValue,
  type FieldInfo,
  type SchemaInfo,
} from "./schema-info.js";
import { type ParsedData, JavaScriptType } from "./internal-types.js";
import type { SuperValidateOptions } from "./public-types.js";

// TODO: provide options via an enclosing object

export function parseFormData<T extends TObject>(
  formData: FormData,
  schemaInfo: SchemaInfo<T>,
  options: SuperValidateOptions
): ParsedData<T> {
  const id = formData.get("__superform_id")?.toString() ?? undefined;

  // if (formData.has("__superform_json")) {
  //   try {
  //     const output = parse(formData.getAll("__superform_json").join("") ?? "");
  //     if (typeof output === "object") {
  //       return { id, data: output, posted: true };
  //     }
  //   } catch {
  //     // TODO: If can't parse the requested json, parse as a regular form???
  //   }
  // }

  return {
    id,
    data: formDataToValidation(formData, schemaInfo, options),
    posted: true,
  };
}

export function formDataToValidation<T extends TObject>(
  data: FormData,
  schemaInfo: SchemaInfo<T>,
  options: SuperValidateOptions
): Static<T> {
  const output: Record<string, unknown> = {};

  for (const fieldName of schemaInfo.fieldNames) {
    const fieldInfo = schemaInfo.fields[fieldName];
    const entries = data.getAll(fieldName);

    if (fieldInfo.fieldType == JavaScriptType.Array) {
      output[fieldName] = entries.map((entry) =>
        parseSingleEntry(entry, fieldInfo.memberType!, fieldInfo, options)
      );
    } else {
      output[fieldName] = parseSingleEntry(
        entries[0],
        fieldInfo.fieldType,
        fieldInfo,
        options
      );
    }
  }

  return output;
}

function parseFormDataEntry(
  value: string | null | undefined,
  fieldType: JavaScriptType,
  fieldInfo: FieldInfo,
  options: SuperValidateOptions
): unknown {
  if (!value) {
    return options.supplyDefaults && fieldInfo.hasDefault
      ? fieldInfo.defaultValue
      : unspecifiedValue(fieldInfo);
  }

  if (fieldType == JavaScriptType.String) {
    return value;
  } else if (fieldType == JavaScriptType.Integer) {
    return parseInt(value);
  } else if (fieldType == JavaScriptType.Number) {
    return parseFloat(value);
  } else if (fieldType == JavaScriptType.Boolean) {
    return Boolean(value == "false" ? "" : value).valueOf();
  } else if (fieldType == JavaScriptType.Date) {
    return new Date(value);
  } else if (fieldType == JavaScriptType.Array) {
    return parseFormDataEntry(value, fieldInfo.memberType!, fieldInfo, options);
  } else if (fieldType == JavaScriptType.BigInt) {
    try {
      return BigInt(value);
    } catch {
      return NaN;
    }
  } else if (fieldType == JavaScriptType.Symbol) {
    return Symbol(String(value));
  } else {
    throw Error(
      `Type '${fieldType}' in '${
        fieldInfo.fieldName ? "field " + fieldInfo.fieldName : "[array member]"
      } not supported`
    );
  }
}

function parseSingleEntry(
  entry: FormDataEntryValue,
  fieldType: JavaScriptType,
  fieldInfo: FieldInfo,
  options: SuperValidateOptions
) {
  if (entry && typeof entry !== "string") {
    return undefined; // File object, not supported
  }
  return parseFormDataEntry(entry, fieldType, fieldInfo, options);
}
