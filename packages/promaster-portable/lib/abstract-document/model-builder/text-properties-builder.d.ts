import { TextProperties } from "../model/properties/text-properties";
export declare class TextPropertiesBuilder {
    fontFamily: string;
    fontSize: number | undefined;
    underline: boolean | undefined;
    bold: boolean | undefined;
    italic: boolean | undefined;
    color: string;
    subScript: boolean | undefined;
    superScript: boolean | undefined;
    build(): TextProperties;
}
