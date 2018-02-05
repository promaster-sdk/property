import * as PropertyValue from "./property-value";
import * as PropertyValueSet from "./property-value-set";
import * as Ast from "./property-filter-ast/index";
import { exhaustiveCheck } from "../utils/exhaustive-check";

export interface PropertyFilter {
  readonly text: string;
  readonly ast: Ast.Expr;
}

const _cache: { [key: string]: PropertyFilter } = {}; //tslint:disable-line

export const Empty: PropertyFilter = { text: "", ast: Ast.newEmptyExpr() }; //tslint:disable-line

function create(text: string, ast: Ast.Expr): PropertyFilter {
  return { text, ast };
}

export function fromString(filter: string): PropertyFilter | undefined {
  if (filter === null || filter === undefined) {
    throw new Error("Argument 'filter' must be defined.");
  }
  if (!_cache.hasOwnProperty(filter)) {
    const adjustedFilter = Ast.preProcessString(filter);
    if (adjustedFilter === "") {
      return Empty;
    }
    const ast = Ast.parse(adjustedFilter, false);

    if (ast === undefined) {
      console.warn("Invalid property filter syntax: " + adjustedFilter); //tslint:disable-line
      return undefined;
    }
    _cache[filter] = create(adjustedFilter, ast);
  }
  return _cache[filter];
}

export function fromStringOrEmpty(filterString: string): PropertyFilter {
  const filter = fromString(filterString);
  if (filter === undefined) {
    return Empty;
  }
  return filter;
}

export function isSyntaxValid(
  filter: string,
  propertyNames: Array<string> | undefined = undefined
): boolean {
  if (filter === null || filter === undefined) {
    throw new Error("Argument 'filter' must be defined.");
  }

  const adjusted = Ast.preProcessString(filter);
  if (adjusted === "") {
    return true;
  }
  const ast = Ast.parse(adjusted, false);

  if (ast === undefined) {
    return false;
  }

  if (propertyNames === undefined) {
    return true;
  }
  const parsed = create(filter, ast);

  const properties = getReferencedProperties(parsed);
  for (let p of properties) {
    if (propertyNames.indexOf(p) === -1) {
      return false;
    }
  }
  return true;
}

export function isValid(
  properties: PropertyValueSet.PropertyValueSet,
  filter: PropertyFilter
): boolean {
  if (properties === null || properties === undefined) {
    throw new Error("Argument 'properties' must be defined.");
  }
  if (filter === null || filter === undefined) {
    throw new Error("Argument 'filter' must be defined.");
  }
  return Ast.evaluate(filter.ast, properties, false);
}

export function isValidMatchMissing(
  properties: PropertyValueSet.PropertyValueSet,
  filter: PropertyFilter
): boolean {
  if (properties === null || properties === undefined) {
    throw new Error("Argument 'properties' must be defined.");
  }
  if (filter === null || filter === undefined) {
    throw new Error("Argument 'filter' must be defined.");
  }
  return Ast.evaluate(filter.ast, properties, true);
}

export function getReferencedProperties(filter: PropertyFilter): Array<string> {
  if (filter === null || filter === undefined) {
    throw new Error("Argument 'filter' must be defined.");
  }
  let properties: Array<string> = [];
  _findProperties(filter.ast, properties);
  return properties;
}

export function toString(filter: PropertyFilter): string {
  if (filter === null || filter === undefined) {
    throw new Error("Argument 'filter' must be defined.");
  }
  return filter.text !== null ? filter.text : "";
}

export function equals(other: PropertyFilter, filter: PropertyFilter): boolean {
  if (filter === other) {
    return true;
  }
  if (filter === null || filter === undefined) {
    return false;
  }
  if (other === null || other === undefined) {
    return false;
  }
  return filter.text === filter.text;
}

function _findProperties(e: Ast.Expr, properties: Array<string>): void {
  switch (e.type) {
    case "AndExpr":
      for (const child of e.children) {
        _findProperties(child, properties);
      }
      break;
    case "ComparisonExpr":
      _findProperties(e.leftValue, properties);
      _findProperties(e.rightValue, properties);
      break;
    case "EmptyExpr":
      // Do nothing
      break;
    case "EqualsExpr":
      _findProperties(e.leftValue, properties);
      for (const range of e.rightValueRanges) {
        _findProperties(range, properties);
      }
      break;
    case "IdentifierExpr": {
      properties.push(e.name);
      break;
    }
    case "OrExpr":
      for (const child of e.children) {
        _findProperties(child, properties);
      }
      break;
    case "ValueExpr":
      // Do nothing
      break;
    case "ValueRangeExpr":
      _findProperties(e.min, properties);
      _findProperties(e.max, properties);
      break;
    case "NullExpr":
      // Do nothing
      break;
    default:
      exhaustiveCheck(e, true);
  }
}
