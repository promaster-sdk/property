import {ImageResource} from "./primitives/image-resource";
import {NumberingDefinition} from "./numberings/numbering-definition";
import {Numbering} from "./numberings/numbering";
import {Section} from "./page/section";
import * as StyleKey from "./styles/style-key";
import {Style} from "./styles/style";
import {Font} from "./primitives/font";
import {createDefaultAndStandardStyles} from "./default-styles";

export type Indexer<T1, T2> = {[key: string]: T2};
export type Guid = string;

export interface AbstractDoc {
  readonly fonts: Indexer<string, Font>,
  readonly imageResources: Indexer<Guid, ImageResource>,
  readonly styles: Indexer<StyleKey.StyleKey, Style>,
  readonly numberings: Indexer<string, Numbering>,
  readonly numberingDefinitions: Indexer<string, NumberingDefinition>,
  readonly children: Array<Section>,
}

export interface AbstractDocProps {
  readonly fonts?: Indexer<string, Font>,
  readonly imageResources?: Indexer<Guid, ImageResource>,
  readonly styles?: Indexer<StyleKey.StyleKey, Style>,
  readonly numberings?: Indexer<string, Numbering>,
  readonly numberingDefinitions?: Indexer<string, NumberingDefinition>,
  readonly children?: Array<Section>,
}

export function create(props?: AbstractDocProps): AbstractDoc {
  const {
    fonts = {},
    imageResources = {},
    styles = createDefaultAndStandardStyles(),
    numberings = {},
    numberingDefinitions = {},
    children = [],
  } = props || {};
  return {
    fonts: fonts,
    imageResources: imageResources,
    styles: styles,
    numberings: numberings,
    numberingDefinitions: numberingDefinitions,
    children: children,
  };
}

export function getStyle(type: string, name: string, doc: AbstractDoc): Style | undefined {
  const key = StyleKey.create(type, name);
  return doc.styles[key];
}
