import { UnitMap } from "uom";
import { LRUCache } from "lru-cache";
import * as PropertyValueSet from "./property-value-set";
import * as PropertyValue from "./property-value";
import * as Ast from "./property-filter-ast/index";

export interface PropertyFilter {
  readonly text: string;
  readonly ast: Ast.BooleanExpr;
  readonly _evaluate: Ast.CompiledFilterFunction;
}

const LRUCacheOptions = {
  max: 20000, // Arbitrary number. Uses on average up to 400mb
};
const _cache = new LRUCache<string, PropertyFilter>(LRUCacheOptions);

export const Empty: PropertyFilter = {
  text: "",
  ast: Ast.newEmptyExpr(),
  _evaluate: () => true,
};

function create(text: string, ast: Ast.BooleanExpr): PropertyFilter {
  return { text, ast, _evaluate: Ast.compileAst(ast) };
}

export function fromString(filter: string, unitLookup: UnitMap.UnitLookup): PropertyFilter | undefined {
  if (filter === null || filter === undefined) {
    throw new Error("Argument 'filter' must be defined.");
  }
  if (!_cache.has(filter)) {
    if (filter === "" || filter.trim().length === 0) {
      return Empty;
    }
    const ast = Ast.parse(filter, unitLookup, false);

    if (ast === undefined) {
      console.warn("Invalid property filter syntax: " + filter);
      return undefined;
    }
    _cache.set(filter, create(filter, ast));
  }

  return _cache.get(filter);
}

export function fromStringOrEmpty(filterString: string, unitLookup: UnitMap.UnitLookup): PropertyFilter {
  const filter = fromString(filterString, unitLookup);
  if (filter === undefined) {
    return Empty;
  }
  return filter;
}

export function isSyntaxValid(
  filter: string,
  unitLookup: UnitMap.UnitLookup,
  propertyNames: ReadonlyArray<string> | undefined = undefined
): boolean {
  if (filter === null || filter === undefined) {
    throw new Error("Argument 'filter' must be defined.");
  }

  if (filter === "" || filter.trim().length === 0) {
    return true;
  }
  const ast = Ast.parse(filter, unitLookup, false);

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

export function getReferencedProperties(filter: PropertyFilter): ReadonlyArray<string> {
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
  return other.text === filter.text;
}
