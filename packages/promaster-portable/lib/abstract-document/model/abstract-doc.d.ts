import { ImageResource } from "./primitives/image-resource";
import { NumberingDefinition } from "./numberings/numbering-definition";
import { Numbering } from "./numberings/numbering";
import { Section } from "./page/section";
import { StyleKey } from "./styles/style-key";
import { Style } from "./styles/style";
export declare type Indexer<T1, T2> = {
    readonly [key: string]: T2;
};
export declare type Guid = string;
export interface AbstractDoc {
    imageResources: Indexer<Guid, ImageResource>[];
    numberingDefinitions: Indexer<string, NumberingDefinition>[];
    numberings: Indexer<string, Numbering>[];
    sections: Section[];
    styles: Indexer<StyleKey, Style>[];
}
