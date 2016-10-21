/*
import {Expr,
    ComparisonExpr,
    EmptyExpr,
    EqualsExpr,
    IdentifierExpr,
    OrExpr,
    ValueRangeExpr,
    ValueExpr,
    NullExpr,
    AndExpr,
    ComparisonOperationType,
    EqualsOperationType} from "promaster-primitives/lib/fun";

export class FilterPrinter {

  print(expr:Expr):string {
    var builder = "";
    if (expr == null)
      return "";
    this._print(expr, builder);
    return builder.toString();
  }

  _print(expr:Expr, s:string):void {

    if (expr instanceof AndExpr) {
      let e:AndExpr = expr;
      for (let child of e.children) {
        this._print(child, s);
        if (child != e.children[e.children.length - 1])
          s += "&";
      }
    }
    else if (expr instanceof ComparisonExpr) {
      let e:ComparisonExpr = expr;
      this._print(e.leftValue, s);
      s += FilterPrinter._comparisonOperationTypeToString(e.operationType);
      this._print(e.rightValue, s);
    }
    else if (expr instanceof EmptyExpr) {
    }
    else if (expr instanceof EqualsExpr) {
      let e:EqualsExpr = expr;
      this._print(e.leftValue, s);
      s += FilterPrinter._equalsOperationTypeToString(e.operationType);
      for (let range of e.rightValueRanges) {
        this._print(range, s);
        if (range != e.rightValueRanges[e.rightValueRanges.length - 1])
          s += ",";
      }
    }
    else if (expr instanceof IdentifierExpr) {
      let e:IdentifierExpr = expr;
      s += e.name;
    }
    else if (expr instanceof OrExpr) {
      let e:OrExpr = expr;
      for (let child of e.children) {
        this._print(child, s);
        if (child != e.children[e.children.length - 1])
          s += "|";
      }
    }
    else if (expr instanceof ValueExpr) {
      let e:ValueExpr = expr;
      s += e.parsed.toString();
    }
    else if (expr instanceof ValueRangeExpr) {
      let e:ValueRangeExpr = expr;
      this._print(e.min, s);
      if (e.min != e.max) {
        s += "~";
        this._print(e.max, s);
      }
    }
    else if (expr instanceof NullExpr) {
      s += "null";
    }

  }

  static _comparisonOperationTypeToString(type:ComparisonOperationType):string {
    switch (type) {
      case ComparisonOperationType.LessOrEqual:
        return "<=";
      case ComparisonOperationType.GreaterOrEqual:
        return ">=";
      case ComparisonOperationType.Less:
        return "<";
      case ComparisonOperationType.Greater:
        return ">";
      default:
        throw "Unknown ComparisonOperationType ";
    }
  }

  static _equalsOperationTypeToString(type:EqualsOperationType):string {
    switch (type) {
      case EqualsOperationType.Equals:
        return "=";
      case EqualsOperationType.NotEquals:
        return "!=";
      default:
        throw "Unknown EqualsOperationType ";
    }
  }

}

*/
//# sourceMappingURL=filter_printer.js.map