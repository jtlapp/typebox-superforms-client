import type { Static, TObject } from "@sinclair/typebox";

export enum TypeBoxType {
  Array = "Array",
  BigInt = "BigInt",
  Boolean = "Boolean",
  Date = "Date",
  Integer = "Integer",
  Literal = "Literal",
  Null = "Null",
  Number = "Number",
  Object = "Object",
  Record = "Record",
  String = "String",
  Symbol = "Symbol",
  Tuple = "Tuple",
  Undefined = "Undefined",
  Union = "Union",
}

export enum JavaScriptType {
  Array = "array",
  BigInt = "bigint",
  Boolean = "boolean",
  Date = "date",
  Integer = "integer",
  Null = "null",
  Number = "number",
  Object = "object",
  String = "string",
  Symbol = "symbol",
  Undefined = "undefined",
}

export type ParsedData<T extends TObject> = {
  id: string | undefined;
  posted: boolean;
  data: Static<T> | undefined;
};
