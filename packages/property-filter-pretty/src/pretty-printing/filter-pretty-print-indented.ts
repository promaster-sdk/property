import { Serialize, UnitFormat, UnitMap } from "uom";
import { PropertyFilter, PropertyFilterAst as Ast, PropertyValue } from "@promaster-sdk/property";
import { exhaustiveCheck } from "ts-exhaustive-check/lib-cjs";
import { inferTypeMap } from "../type-inference/filter-type-inferrer";
import { ExprType, ExprTypeEnum } from "../type-inference/expr-type";
import { FilterPrettyPrintMessages } from "./filter-pretty-print-messages";

export function filterPrettyPrintIndented(
  messages: FilterPrettyPrintMessages,
  indentationDepth: number,
  indentionString: string,
  f: PropertyFilter.PropertyFilter,
  // unitsFormat: {
  //   readonly [key: string]: UnitFormat.UnitFormat;
  // } = UnitsFormat
  unitsFormat: UnitFormat.UnitFormatMap,
  unitLookup: UnitMap.UnitLookup
): string {
  const e = f.ast;
  if (e === null) {
    return "";
  }

  const typeMap = inferTypeMap(f);

  return visit(e, indentationDepth, indentionString, messages, typeMap, unitsFormat, unitLookup);
}

function visit(
  e: Ast.Expr,
  indentationDepth: number,
  indentionString: string,
  messages: FilterPrettyPrintMessages,
  typeMap: ReadonlyMap<Ast.Expr, ExprType>,
  unitsFormat: {
    readonly [key: string]: UnitFormat.UnitFormat;
  },
  unitLookup: UnitMap.UnitLookup
): string {
  const innerVisit = (indent: number, expr: Ast.Expr): string =>
    visit(expr, indent, indentionString, messages, typeMap, unitsFormat, unitLookup);
  switch (e.type) {
    case "AndExpr": {
      let s = "";
      for (const child of e.children) {
        s += innerVisit(indentationDepth, child);
        if (child !== e.children[e.children.length - 1]) {
          s += "\n" + _generateIndention(indentationDepth + 1, indentionString) + messages.andMessage() + "\n";
        }
      }
      return s;
    }
    case "ComparisonExpr": {
      const left = innerVisit(indentationDepth, e.leftValue);
      const right = innerVisit(indentationDepth, e.rightValue);
      return (
        _generateIndention(indentationDepth, indentionString) +
        messages.comparisionOperationMessage(e.operationType, left, right)
      );
    }
    case "EmptyExpr": {
      return "";
    }
    case "EqualsExpr": {
      const left = innerVisit(indentationDepth, e.leftValue);
      const builder: Array<string> = [];
      for (const range of e.rightValueRanges) {
        const rangeMessage = innerVisit(indentationDepth, range);
        builder.push(rangeMessage);
        if (range !== e.rightValueRanges[e.rightValueRanges.length - 1]) {
          builder.push(messages.orMessage());
        }
      }

      let buf = "";
      const reversed = _reversed(builder);
      for (let i = 0; i < reversed.length; i++) {
        const x = reversed[i];
        buf += x;
        if (i < reversed.length - 1) {
          buf += " ";
        }
      }
      const joined = buf;
      return (
        _generateIndention(indentationDepth, indentionString) +
        messages.equalsOperationMessage(e.operationType, left, joined)
      );
    }

    case "IdentifierExpr": {
      return messages.propertyNameMessage(e.name);
    }
    case "OrExpr": {
      let s = "";
      for (const child of e.children) {
        s += innerVisit(indentationDepth + 1, child);

        if (child !== e.children[e.children.length - 1]) {
          s += "\n" + _generateIndention(indentationDepth, indentionString) + messages.orMessage() + "\n";
        }
      }
      return s;
    }
    case "ValueExpr": {
      const type = typeMap.get(e);
      if (type && type.exprTypeEnum === ExprTypeEnum.Property && type.propertyName !== null) {
        return messages.propertyValueMessage(type.propertyName!, e.parsed);
      } else if (e.parsed.type === "integer") {
        const integer = PropertyValue.getInteger(e.parsed);
        const cultureFormatted = integer ? integer.toString() : "";
        return cultureFormatted;
      } else if (e.parsed.type === "amount") {
        const split = e.unParsed.split(":");
        if (split.length === 2) {
          const unit = Serialize.stringToUnit(split[1], unitLookup);
          if (unit) {
            const unitFormat = UnitFormat.getUnitFormat(unit, unitsFormat);
            if (unitFormat) {
              return split[0] + " " + unitFormat.label;
            } else {
              return split[0];
            }
          } else {
            return split[0];
          }
        } else {
          return split[0];
        }
      } else if (e.parsed.type === "text") {
        return PropertyValue.getText(e.parsed) || "";
      }
      break;
    }
    case "ValueRangeExpr": {
      const min = innerVisit(indentationDepth, e.min);
      const max = innerVisit(indentationDepth, e.max);
      return min === max ? min : messages.rangeMessage(min, max);
    }
    case "NullExpr": {
      return messages.nullMessage();
    }
    case "AddExpr": {
      return `${innerVisit(indentationDepth, e.left)} ${e.operationType === "add" ? "+" : "-"} ${innerVisit(
        indentationDepth,
        e.right
      )}`;
    }
    case "MulExpr": {
      return `${innerVisit(indentationDepth, e.left)} ${e.operationType === "multiply" ? "*" : "/"} ${innerVisit(
        indentationDepth,
        e.right
      )}`;
    }
    case "UnaryExpr": {
      return `-${innerVisit(indentationDepth, e.value)}`;
    }
    default: {
      exhaustiveCheck(e, true);
    }
  }
  return "";
}

// Returns a reversed copy
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _reversed(array: ReadonlyArray<any>): ReadonlyArray<any> {
  return array.slice().reverse();
}

function _generateIndention(indentationDepth: number, indentionString: string): string {
  let b = "";
  for (let i = 0; i < indentationDepth; i++) {
    b += indentionString;
  }
  return b;
}
