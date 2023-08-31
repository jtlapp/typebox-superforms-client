import type { Static, TObject } from "@sinclair/typebox";

export type ParsedData<T extends TObject> = {
  id: string | undefined;
  posted: boolean;
  data: Static<T> | undefined;
};
