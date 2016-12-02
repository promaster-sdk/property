import { StyleKey } from "./style-key";
import { Indexer } from "../abstract-doc";
export interface Style {
    type: string;
    basedOn: string | undefined;
}
export declare function getEffectiveStyle2<TStyle extends Style>(styles: Indexer<StyleKey, Style>, style: Style): TStyle;
