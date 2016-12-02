import { TextPropertiesBuilder } from "./text-properties-builder";
import { TextStyle } from "../model/styles/text-style";
export declare class TextStyleBuilder {
    basedOn: string;
    textProperties: TextPropertiesBuilder;
    build(): TextStyle;
}
