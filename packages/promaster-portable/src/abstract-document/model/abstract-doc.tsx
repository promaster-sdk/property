import {ImageResource} from "./primitives/image-resource";
import {NumberingDefinition} from "./numberings/numbering-definition";
import {Numbering} from "./numberings/numbering";
import {Section} from "./page/section";
import {StyleKey} from "./styles/style-key";
import {Style} from "./styles/style";

export type Indexer<T1, T2> = { [key: string]: T2};
export type Guid = string;

export interface AbstractDoc {
  sections: Section[],
  imageResources: Indexer<Guid, ImageResource>,
  styles: Indexer<StyleKey, Style>,
  numberings: Indexer<string, Numbering>,
  numberingDefinitions: Indexer<string, NumberingDefinition>,
}

export function createAbstractDoc(sections: Array<Section>, imageResources: Indexer<Guid, ImageResource>,
                            styles: Indexer<StyleKey, Style>, numberings: Indexer<string, Numbering>,
                            numberingDefinitions: Indexer<string, NumberingDefinition>): AbstractDoc {
  return {
    sections,
    imageResources,
    styles,
    numberings,
    numberingDefinitions,
  };
}
