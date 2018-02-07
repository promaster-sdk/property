import * as R from "ramda";
import {
  PropertyFilter,
  PropertyValueSet,
  PropertyValue,
  Amount,
  Units
} from "@promaster/promaster-primitives";
import { exhaustiveCheck } from "../exhaustive-check/index";
import * as Types from "./types";

//tslint:disable:no-any

export function mapRawTree(tree: Types.RawTree): Types.Tree {
  return {
    name: tree.name,
    relations: convertArray(tree.relations, convertTreeRelation)
  };
}

/**
 * Maps table data from raw data, using the mapping declaration provided.
 */
export function mapTable<T>(
  rawProductData: Types.RawProductData,
  tableName: string,
  mapping: Types.Mapping<T>
): ReadonlyArray<T> | undefined {
  const rawTableData: Types.RawTableData = rawProductData[tableName];
  if (!rawTableData) {
    return [];
  }
  return rawTableData.map(row => runMapping(mapping, row) as T);
}

export function mapText(rawProductData: Types.RawProductData): Types.TextTable {
  return convertTextTable(rawProductData["text"]);
}

export function mapProperty(
  rawProductData: Types.RawProductData
): ReadonlyArray<Types.ProductProperty> {
  return convertArray(rawProductData["property"], convertProductProperty);
}

export function mapImage(
  rawProductData: Types.RawProductData
): ReadonlyArray<Types.ProductImage> {
  return convertArray(rawProductData["image"], convertProductImage);
}

export function mapDocument(
  rawProductData: Types.RawProductData
): ReadonlyArray<Types.ProductDocument> {
  return convertArray(rawProductData["document"], convertProductDocument);
}

export function mapLanguage(
  rawProductData: Types.RawProductData
): ReadonlyArray<Types.ProductLanguage> {
  return convertArray(rawProductData["language"], convertProductLanguage);
}

export function mapCode(
  rawProductData: Types.RawProductData
): ReadonlyArray<Types.ProductCode> {
  return convertArray(rawProductData["code"], convertProductCode);
}

function runMapping(
  mapping: Types.Mapping<{}>,
  rawData: Types.RawTableRow
): {} {
  const x = R.toPairs<Types.ValueMapping, {}>(mapping).map(
    ([key, valueMapping]) =>
      [key, mapValue(valueMapping as any, rawData[key as any])] as [string, any]
  ); //tslint:disable-line
  return R.fromPairs(x);
}

function mapValue(
  mapping: Types.ValueMapping,
  rawValue: Types.RawColumnData
): any {
  // tslint:disable-line

  if (typeof mapping === "string") {
    switch (mapping) {
      case "string":
        return rawValue || "";
      case "number":
        return convertFloat(rawValue);
      case "PropertyFilter":
        return convertFilter(rawValue);
      case "PropertyValueSet":
        return convertPropertyValueSet(rawValue);
      case "Quantity":
        return Units.getQuantityTypeFromString(rawValue);
      case "Unit":
        if (Units.isUnit(rawValue)) {
          return Units.getUnitFromString(rawValue);
        }
        return undefined;
      default:
        exhaustiveCheck(mapping);
    }
  } else {
    switch (mapping.type) {
      case "Amount":
        const amountValue = parseFloat(rawValue as string) || 0;
        return Amount.create(amountValue, mapping.unit);
      default:
        //exhaustiveCheck(mapping);
        throw new Error("Exhaustive check");
    }
  }
}

function convertTextTable(
  textTable: ReadonlyArray<any> | undefined
): Types.TextTable {
  let table: {
    // tslint:disable-next-line:readonly-keyword
    [key: string]: Array<{
      readonly property_filter: PropertyFilter.PropertyFilter;
      readonly text: string;
    }>;
  } = {};
  for (let text of textTable || []) {
    const key = text.language + "_" + text.name;
    const propertyFilter = convertFilter(text.property_filter);
    const item = {
      property_filter: propertyFilter,
      text: text.text
    };
    if (table[key] === undefined) {
      table[key] = [item];
    } else {
      table[key].push(item);
    }
  }
  return table;
}

function convertProductProperty(productProperty: any): Types.ProductProperty {
  return {
    sort_no: parseInt(productProperty.sort_no, 10),
    name: productProperty.name,
    group: productProperty.group,
    validation_filter: convertFilter(productProperty.validation_filter),
    visibility_filter: convertFilter(productProperty.visibility_filter),
    quantity: productProperty.quantity,
    def_value: convertArray(
      productProperty.def_value,
      convertProductPropertyDefValue
    ),
    value: convertArray(productProperty.value, convertProductPropertyValue),
    translation: convertArray(
      productProperty.translation,
      convertProductPropertyTranslation
    )
  };
}

function convertProductPropertyTranslation(
  rawTranslation: any
): Types.ProductPropertyTranslation {
  return {
    language: rawTranslation.language as string,
    type: rawTranslation.type as string,
    translation: rawTranslation.translation as string
  };
}

function convertProductPropertyDefValue(
  defValue: any
): Types.ProductPropertyDefValue | undefined {
  const value = convertPropertyValue(defValue.value);
  if (value === undefined) {
    return undefined;
  }
  return {
    sort_no: convertInt(defValue.sort_no, 0),
    value: value,
    property_filter: convertFilter(defValue.property_filter)
  };
}

function convertProductPropertyValue(
  propertyValue: any
): Types.ProductPropertyValue | undefined {
  const value = convertPropertyValue(propertyValue.value);
  if (value === undefined) {
    return undefined;
  }
  const image = propertyValue.image ? propertyValue.image : undefined;
  return {
    sort_no: convertInt(propertyValue.sort_no, 0),
    value: value,
    property_filter: convertFilter(propertyValue.property_filter),
    description: propertyValue.description,
    image: image,
    translation: convertArray(
      propertyValue.translation,
      convertProductPropertyTranslation
    )
  };
}

function convertProductCode(code: any): Types.ProductCode {
  return {
    property_filter: convertFilter(code.property_filter),
    type: code.type !== undefined ? code.type : "main",
    code: code.code
  };
}

function convertProductLanguage(language: any): Types.ProductLanguage {
  return {
    sort_no: language.sort_no,
    name: language.name
  };
}

function convertProductImage(image: any): Types.ProductImage {
  return {
    property_filter: convertFilter(image.property_filter),
    image: image.image,
    size: image.size,
    type: image.type,
    name: image.name,
    file_name: image.file_name
  };
}

function convertProductDocument(document: any): Types.ProductDocument {
  return {
    property_filter: convertFilter(document.property_filter),
    file_name: document.file_name,
    document: document.document,
    language: document.language,
    name: document.name,
    type: document.type
  };
}

function convertTreeRelation(relation: any): Types.TreeRelation {
  return {
    parent: relation.parent,
    child: relation.child,
    sort_no: relation.sort_no
  };
}

function convertArray<TFrom, TTo>(
  array: ReadonlyArray<TFrom> | undefined,
  mapper: (t: TFrom) => TTo | undefined
): ReadonlyArray<TTo> {
  let valid: Array<TTo> = [];
  for (let item of array || []) {
    const mapped = mapper(item);
    if (mapped !== undefined) {
      //tslint:disable-next-line
      valid.push(mapped);
    }
  }
  return valid;
}

function convertFilter(
  filter: string | undefined
): PropertyFilter.PropertyFilter {
  return PropertyFilter.fromStringOrEmpty(filter || "");
}

function convertPropertyValueSet(
  values: string | undefined
): PropertyValueSet.PropertyValueSet {
  return PropertyValueSet.fromString(values || "") || PropertyValueSet.Empty;
}

function convertPropertyValue(
  value: string | undefined
): PropertyValue.PropertyValue | undefined {
  return PropertyValue.fromString(value || "");
}

function convertInt(value: string | undefined, defaultValue: number): number {
  const int = parseInt(value || "", 10);
  if (isNaN(int)) {
    return defaultValue;
  }
  return int;
}

function convertFloat(value: string | undefined): number | undefined {
  const float = parseFloat(value || "");
  if (isNaN(float)) {
    return undefined;
  }
  return float;
}

// function convertAmount<T extends Quantity.Quantity>(value: string | undefined, unit: Unit.Unit<T>): Amount.Amount<T> | undefined {
//   const float = parseFloat(value || "");
//   if (isNaN(float)) {
//     return undefined;
//   }
//   return Amount.create(float, unit);
// }
