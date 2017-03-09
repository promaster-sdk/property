import * as R from "ramda";
import {ImageResource} from "./primitives/image-resource";
import {NumberingDefinition} from "./numberings/numbering-definition";
import {Numbering} from "./numberings/numbering";
import * as StyleKey from "./styles/style-key";
import {Style} from "./styles/style";
import {Font} from "./primitives/font";
import {Indexer, Guid} from "./types";
import {defaultAndStandardStyles} from "./default-styles";

export interface Resources {
  readonly fonts?: Indexer<string, Font>,
  readonly imageResources?: Indexer<Guid, ImageResource>,
  readonly styles?: Indexer<StyleKey.StyleKey, Style>,
  readonly numberings?: Indexer<string, Numbering>,
  readonly numberingDefinitions?: Indexer<string, NumberingDefinition>,
}

export function mergeResources(resources: Array<Resources>): Resources {
  const fonts = R.mergeAll(resources.map((r) => r.fonts)) as any;
  const imageResources = R.mergeAll(resources.map((r) => r.imageResources)) as any;
  const numberingDefinitions = R.mergeAll(resources.map((r) => r.numberingDefinitions)) as any;
  const numberings = R.mergeAll(resources.map((r) => r.numberings)) as any;
  const styles = R.mergeAll(resources.map((r) => r.styles)) as any;
  return {
    fonts,
    imageResources,
    numberingDefinitions,
    numberings,
    styles
  };
}

export function getStyle(type: string, name: string, resources: Resources): Style | undefined {
  const key = StyleKey.create(type, name);
  const style = resources.styles ? resources.styles[key] : undefined;
  return style || defaultAndStandardStyles[key];
}
