import {PropertyFilter, PropertyFilterAst as Ast, PropertyValue, Units, UnitName} from "promaster-primitives";
import {inferTypeMap} from "../type-inference/filter-type-inferrer";
import {ExprType, ExprTypeEnum} from "../type-inference/expr-type";
import {FilterPrettyPrintMessages} from "./filter-pretty-print-messages";

export function filterPrettyPrintIndented(messages: FilterPrettyPrintMessages,
                                          indentationDepth: number,
                                          indentionString: string, f: PropertyFilter.PropertyFilter): string {
  const e = f.ast;
  if (e == null)
    return "";

  const typeMap = inferTypeMap(f);

  return visit(e, indentationDepth, indentionString, messages, typeMap);
}

function visit(e: Ast.Expr, indentationDepth: number,
               indentionString: string,
               messages: FilterPrettyPrintMessages,
               typeMap: Map<Ast.Expr, ExprType>): string {

  const innerVisit = (indent: number, expr: Ast.Expr): string => visit(expr, indent, indentionString, messages, typeMap);

  if (e.type === "AndExpr") {
    let s = "";
    for (let child of e.children) {
      s += innerVisit(indentationDepth + 1, child);
      if (child !== e.children[e.children.length - 1]) {
        s += "\n" + _generateIndention(indentationDepth, indentionString) + messages.andMessage() + "\n";
      }
    }
    return s;
  }
  else if (e.type === "ComparisonExpr") {
    const left = innerVisit(indentationDepth, e.leftValue);
    const right = innerVisit(indentationDepth, e.rightValue);
    return _generateIndention(indentationDepth, indentionString) + messages.comparisionOperationMessage(e.operationType, left, right);
  }
  else if (e.type === "EmptyExpr") {
    return "";
  }
  else if (e.type === "EqualsExpr") {
    const left = innerVisit(indentationDepth, e.leftValue);
    const builder: Array<string> = [];
    for (let range of e.rightValueRanges) {
      builder.push(innerVisit(indentationDepth, range));
      if (range != e.rightValueRanges[e.rightValueRanges.length - 1])
        builder.push(messages.orMessage());
    }

    let buf = "";
    const reversed = _reversed(builder);
    for (let i = 0; i < reversed.length; i++) {
      let x = reversed[i];
      buf += x;
      if (i < reversed.length - 1)
        buf += " ";
    }
    let joined = buf;
    return _generateIndention(indentationDepth, indentionString) + messages.equalsOperationMessage(e.operationType, left, joined);
  }
  else if (e.type === "IdentifierExpr") {
    return messages.propertyNameMessage(e.name);
  }
  else if (e.type === "OrExpr") {
    let s = "";
    for (let child of e.children) {
      s += innerVisit(indentationDepth + 1, child);

      if (child != e.children[e.children.length - 1]) {
        s += "\n" + _generateIndention(indentationDepth, indentionString) + messages.orMessage() + "\n";
      }
    }
    return s;
  }
  else if (e.type === "ValueExpr") {
    const type = typeMap.get(e);
    if (type && type.exprTypeEnum == ExprTypeEnum.Property && type.propertyName != null) {
      return messages.propertyValueItemMessage(type.propertyName, e.parsed);
    }
    else if (e.parsed.type === "integer") {
      const integer = PropertyValue.getInteger(e.parsed);
      const cultureFormatted = integer ? integer.toString() : "";
      return cultureFormatted;
    }
    else if (e.parsed.type == "amount") {
      const split = e.unParsed.split(':');
      if (split.length == 2)
        return split[0] + " " + UnitName.getName(Units.getUnitFromString(split[1]));
      else
        return split[0];
    }
    else if (e.parsed.type == "text")
      return PropertyValue.getText(e.parsed) || "";
  }
  else if (e.type === "ValueRangeExpr") {
    const min = innerVisit(indentationDepth, e.min);
    const max = innerVisit(indentationDepth, e.max);
    return min === max ? min : messages.rangeMessage(min, max);
  }
  else if (e.type === "NullExpr") {
    return messages.nullMessage();
  }
  else {
    throw new Error("invalid type.");
  }
  return "";
}

// Returns a reversed copy
function _reversed(array: Array<any>): Array<any> {
  return array.slice().reverse();
}

function _generateIndention(indentationDepth: number, indentionString: string): string {
  let b = "";
  for (let i = 0; i < indentationDepth; i++) {
    b += indentionString;
  }
  return b;
}
