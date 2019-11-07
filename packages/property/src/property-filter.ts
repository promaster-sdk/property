import { Unit } from "uom";
import * as PropertyValueSet from "./property-value-set";
import * as PropertyValue from "./property-value";
import * as Ast from "./property-filter-ast/index";

export interface PropertyFilter {
  readonly text: string;
  readonly ast: Ast.BooleanExpr;
  readonly _evaluate: Ast.CompiledFilterFunction;
}

const _cache: { [key: string]: PropertyFilter } = {}; //eslint-disable-line

export const Empty: PropertyFilter = {
  text: "",
  ast: Ast.newEmptyExpr(),
  _evaluate: () => true
};

function create(text: string, ast: Ast.BooleanExpr): PropertyFilter {
  return { text, ast, _evaluate: Ast.compileAst(ast) };
}

export function fromString(
  filter: string,
  units: Unit.UnitMap
): PropertyFilter | undefined {
  if (filter === null || filter === undefined) {
    throw new Error("Argument 'filter' must be defined.");
  }
  // eslint-disable-next-line no-prototype-builtins
  if (!_cache.hasOwnProperty(filter)) {
    const adjustedFilter = Ast.preProcessString(filter);
    if (adjustedFilter === "") {
      return Empty;
    }
    const ast = Ast.parse(adjustedFilter, units, false);

    if (ast === undefined) {
      console.warn("Invalid property filter syntax: " + adjustedFilter);
      return undefined;
    }
    _cache[filter] = create(adjustedFilter, ast);
  }
  return _cache[filter];
}

export function fromStringOrEmpty(
  filterString: string,
  units: Unit.UnitMap
): PropertyFilter {
  const filter = fromString(filterString, units);
  if (filter === undefined) {
    return Empty;
  }
  return filter;
}

export function isSyntaxValid(
  filter: string,
  units: Unit.UnitMap,
  propertyNames: Array<string> | undefined = undefined
): boolean {
  if (filter === null || filter === undefined) {
    throw new Error("Argument 'filter' must be defined.");
  }

  const adjusted = Ast.preProcessString(filter);
  if (adjusted === "") {
    return true;
  }
  const ast = Ast.parse(adjusted, units, false);

  if (ast === undefined) {
    return false;
  }

  if (propertyNames === undefined) {
    return true;
  }
  const parsed = create(filter, ast);

  const properties = getReferencedProperties(parsed);
  for (const p of properties) {
    if (propertyNames.indexOf(p) === -1) {
      return false;
    }
  }
  return true;
}

export function isValid(
  properties: PropertyValueSet.PropertyValueSet,
  filter: PropertyFilter,
  comparer: PropertyValue.Comparer = PropertyValue.defaultComparer
): boolean {
  return filter._evaluate(properties, comparer);
}

export function isValidMatchMissing(
  properties: PropertyValueSet.PropertyValueSet,
  filter: PropertyFilter,
  comparer: PropertyValue.Comparer = PropertyValue.defaultComparer
): boolean {
  if (properties === null || properties === undefined) {
    throw new Error("Argument 'properties' must be defined.");
  }
  if (filter === null || filter === undefined) {
    throw new Error("Argument 'filter' must be defined.");
  }
  return Ast.evaluateAst(filter.ast, properties, true, comparer);
}

export function getReferencedProperties(filter: PropertyFilter): Array<string> {
  if (filter === null || filter === undefined) {
    throw new Error("Argument 'filter' must be defined.");
  }
  const properties: Array<string> = [];
  Ast.findProperties(filter.ast, properties);
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
  // eslint-disable-next-line no-self-compare
  return filter.text === filter.text;
}
