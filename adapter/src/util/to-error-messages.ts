import type { ValueError } from "typebox-validators";

export function toErrorMessages(errors: ValueError[]) {
  const errorMessages = errors.map((error) => error.message);
  return errorMessages.length ? errorMessages : null;
}
