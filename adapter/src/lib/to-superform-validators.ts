import { TObject } from "@sinclair/typebox";
import { StandardValidator } from "typebox-validators";

import { toErrorMessages } from "../util/to-error-messages.js";

type SuperformValidator = (value: any) => string | string[] | null;

export function toSuperformValidators(schema: TObject) {
  const validators: Record<string, SuperformValidator> = {};
  for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
    validators[fieldName] = (value) => {
      const errors = new StandardValidator(fieldSchema as any).errors(value);
      return toErrorMessages(Array.from(errors));
    };
  }
  return validators;
}
