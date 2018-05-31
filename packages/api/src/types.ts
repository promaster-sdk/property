import {
  PropertyFilter,
  PropertyValue,
  Quantity,
  Unit
} from "@promaster/promaster-primitives";

export type Url = string;
export type Uuid = string;

export interface Release {
  readonly release_id: Uuid;
  readonly release_name: string;
  readonly date: Date;
  readonly products: Url;
}

export interface Marker {
  readonly marker_name: string;
  readonly release_id?: Uuid;
  readonly release_name?: string;
  readonly transaction_id?: string;
  readonly products: Url;
}

export interface RawProduct {
  readonly id: Uuid;
  readonly key: string;
  readonly name: string;
  readonly retired: boolean;
  readonly transaction_id: string;
  readonly tables: Url;
  readonly all_tables: Url;
  readonly data: RawProductData;
}

export type RawProductData = { readonly [tableName: string]: RawTableData };

export type RawTableData = ReadonlyArray<RawTableRow>;
export type RawTableRow = { readonly [columnName: string]: RawColumnData };

export type RawColumnData = string;

export interface RawTree {
  readonly name: string;
  readonly relations: ReadonlyArray<RawTreeRelation>;
}

export interface RawTreeRelation {
  readonly parent: Uuid | null;
  readonly child: Uuid;
  readonly sort_no: number;
}

export type ValueMapping =
  | AmountValueMapping
  | "string"
  | "PropertyFilter"
  | "PropertyValueSet"
  | "number"
  | "Quantity"
  | "Unit";
export type AmountValueMapping = { type: "Amount"; unit: Unit.Unit<any> }; //tslint:disable-line

export type Mapping<TMappedType> = {
  readonly [FieldName in keyof TMappedType]: ValueMapping
};

export interface ProductProperty {
  readonly sort_no: number;
  readonly name: string;
  readonly group: string;
  readonly validation_filter: PropertyFilter.PropertyFilter;
  readonly visibility_filter: PropertyFilter.PropertyFilter;
  readonly quantity: Quantity.Quantity;
  readonly def_value: ReadonlyArray<ProductPropertyDefValue>;
  readonly value: ReadonlyArray<ProductPropertyValue>;
  readonly translation: ReadonlyArray<ProductPropertyTranslation>;
}

export interface ProductPropertyValue {
  readonly sort_no: number;
  readonly value: PropertyValue.PropertyValue;
  readonly image: string | undefined;
  readonly property_filter: PropertyFilter.PropertyFilter;
  readonly description: string;
  readonly translation: ReadonlyArray<ProductPropertyTranslation>;
}

export interface Translation {
  readonly [locale: string]: string;
}

export interface ProductPropertyDefValue {
  readonly sort_no: number;
  readonly value: PropertyValue.PropertyValue;
  readonly property_filter: PropertyFilter.PropertyFilter;
}

export interface ProductPropertyTranslation {
  readonly language: string;
  readonly type: string;
  readonly translation: string;
}

export interface ProductCode {
  readonly property_filter: PropertyFilter.PropertyFilter;
  readonly type: string;
  readonly code: string;
}

export interface ProductImage {
  readonly property_filter: PropertyFilter.PropertyFilter;
  readonly image: Url;
  readonly size: string;
  readonly type: string;
  readonly name: string;
  readonly file_name: string;
}

export interface ProductDocument {
  readonly property_filter: PropertyFilter.PropertyFilter;
  readonly file_name: string;
  readonly document: Url;
  readonly language: string;
  readonly name: string;
  readonly type: string;
}

export interface TextTableItem {
  readonly property_filter: PropertyFilter.PropertyFilter;
  readonly text: string;
}

export interface TextTable {
  readonly [localeAndKey: string]: ReadonlyArray<TextTableItem>;
}

export type PropertyTable = ReadonlyArray<ProductProperty>;
export type ImageTable = ReadonlyArray<ProductImage>;
export type DocumentTable = ReadonlyArray<ProductDocument>;
export type LanguageTable = ReadonlyArray<ProductLanguage>;
export type CodeTable = ReadonlyArray<ProductCode>;

export interface ProductLanguage {
  readonly sort_no: number;
  readonly name: string;
}

export interface Tree {
  readonly name: string;
  readonly relations: ReadonlyArray<TreeRelation>;
}

export interface TreeRelation {
  readonly parent: Uuid | null;
  readonly child: Uuid;
  readonly sort_no: number;
}
