import { TextProperties } from "../properties/text-properties";
export interface TextRun {
    type: "TextRun";
    styleName: string | undefined;
    text: string;
    textProperties: TextProperties;
}
export declare function createTextRun(text: string, styleName: string | undefined, textProperties: TextProperties): TextRun;
