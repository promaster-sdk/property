import {Section} from "./page/types";
import {Style, StyleKey} from "./styles/types";
import {NumberingDefinition, Numbering} from "./numberings/types";
import {ImageResource} from "./primitives/types";

export type Indexer<T1, T2> = { readonly [key: string]: T2};
export type Guid = string;

export interface AbstractDoc {
  imageResources: Indexer<Guid, ImageResource>[];
  numberingDefinitions: Indexer<string, NumberingDefinition>[];
  numberings: Indexer<string, Numbering>[];
  sections: Section[];
  styles: Indexer<StyleKey, Style>[];
}
