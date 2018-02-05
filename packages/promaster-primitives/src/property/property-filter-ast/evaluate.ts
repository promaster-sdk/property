import * as Ast from "./types";
import * as PropertyValue from "../property-value";
import * as PropertyValueSet from "../property-value-set";

export function evaluate(
  e: Ast.Expr,
  properties: PropertyValueSet.PropertyValueSet,
  matchMissingIdentifiers: boolean
  // tslint:disable-next-line:no-any
): any {
  if (e.type === "AndExpr") {
    for (let child of e.children) {
      if (!evaluate(child, properties, matchMissingIdentifiers)) {
        return false;
      }
    }
    return true;
  } else if (e.type === "ComparisonExpr") {
    // Handle match missing identifier
    if (
      matchMissingIdentifiers &&
      (_isMissingIdent(e.leftValue, properties) ||
        _isMissingIdent(e.rightValue, properties))
    ) {
      return true;
    }

    const left: PropertyValue.PropertyValue = evaluate(
      e.leftValue,
      properties,
      matchMissingIdentifiers
    );
    if (left === null) {
      return false;
    }

    const right: PropertyValue.PropertyValue = evaluate(
      e.rightValue,
      properties,
      matchMissingIdentifiers
    );
    if (right === null) {
      return false;
    }

    switch (e.operationType) {
      case "less":
        return PropertyValue.lessThan(left, right);
      case "greater":
        return PropertyValue.greaterThan(left, right);
      case "lessOrEqual":
        return PropertyValue.lessOrEqualTo(left, right);
      case "greaterOrEqual":
        return PropertyValue.greaterOrEqualTo(left, right);
      default:
        throw new Error(`Unknown comparisontype`);
    }
  } else if (e.type === "EmptyExpr") {
    return true;
  } else if (e.type === "EqualsExpr") {
    // Handle match missing identifier
    if (matchMissingIdentifiers) {
      if (
        _isMissingIdent(e.leftValue, properties) ||
        e.rightValueRanges.filter(
          (vr: Ast.ValueRangeExpr) =>
            _isMissingIdent(vr.min, properties) ||
            _isMissingIdent(vr.max, properties)
        ).length > 0
      ) {
        return true;
      }
    }

    const left: PropertyValue.PropertyValue = evaluate(
      e.leftValue,
      properties,
      matchMissingIdentifiers
    );

    for (let range of e.rightValueRanges) {
      let rangeResult = evaluate(range, properties, matchMissingIdentifiers);
      let min: PropertyValue.PropertyValue = rangeResult[0];
      let max: PropertyValue.PropertyValue = rangeResult[1];

      // console.log("left", JSON.stringify(left));
      // console.log("min", JSON.stringify(min));
      // console.log("max", JSON.stringify(max));

      // console.log("left unit is m3/s", (left as any).value.unit === Units.CubicMeterPerSecond);
      // console.log("min unit is m3/h", (min as any).value.unit === Units.CubicMeterPerHour);
      //
      // const pv1 = PropertyValue.fromString("0:CubicMeterPerSecond");
      // console.log("NISSE", JSON.stringify(pv1) === JSON.stringify(left));
      // console.log("pv1", JSON.stringify(pv1));
      // console.log("left", JSON.stringify(left));
      //
      // const pv2 = PropertyValue.fromText("16:CubicMeterPerHour");
      // console.log("OLLE", PropertyValue.greaterOrEqualTo(pv1, pv2));

      // console.log("greaterOrEqualTo(left, min)", PropertyValue.greaterOrEqualTo(left, min));
      // console.log("PropertyValue.lessOrEqualTo(left, max)", PropertyValue.lessOrEqualTo(left, max));

      // Match on NULL or inclusive in range
      if (
        ((max === null || min === null) && left === null) ||
        (left !== null &&
          min !== null &&
          max !== null &&
          (PropertyValue.greaterOrEqualTo(left, min) &&
            PropertyValue.lessOrEqualTo(left, max)))
      ) {
        return e.operationType === "equals";
      }
    }

    return e.operationType === "notEquals";
  } else if (e.type === "IdentifierExpr") {
    if (
      properties !== null &&
      PropertyValueSet.hasProperty(e.name, properties)
    ) {
      return PropertyValueSet.get(e.name, properties);
    } else {
      return null;
    }
  } else if (e.type === "OrExpr") {
    for (let child of e.children) {
      if (evaluate(child, properties, matchMissingIdentifiers)) {
        return true;
      }
    }
    return false;
  } else if (e.type === "ValueExpr") {
    return e.parsed;
  } else if (e.type === "ValueRangeExpr") {
    return [
      evaluate(e.min, properties, matchMissingIdentifiers),
      evaluate(e.max, properties, matchMissingIdentifiers)
    ];
  } else if (e.type === "NullExpr") {
    return null;
  } else {
    throw new Error("invalid type.");
  }
}

function _isMissingIdent(
  e: Ast.Expr,
  properties: PropertyValueSet.PropertyValueSet
): boolean {
  // If expression is an missing identifier it should match anything
  if (e.type === "IdentifierExpr") {
    if (!PropertyValueSet.hasProperty(e.name, properties)) {
      return true;
    }
  }
  return false;
}
