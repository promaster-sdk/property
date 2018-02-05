import * as Ast from "./types";
import * as PropertyValue from "../property-value";
import * as PropertyValueSet from "../property-value-set";

export type EvaluatePropertyFilterFunc = (
  properties: PropertyValueSet.PropertyValueSet,
  matchMissingIdentifiers: boolean
) => boolean;

function makeLambda(_e: Ast.BooleanExpr): EvaluatePropertyFilterFunc {
  return () => true;
}
