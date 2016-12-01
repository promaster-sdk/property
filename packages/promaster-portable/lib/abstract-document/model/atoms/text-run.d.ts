import { TextProperties } from "../properties/text-properties";
export interface TextRun {
    type: "TextRun";
    styleName: string;
    text: string;
    textProperties: TextProperties;
}
export declare function createTextRun(text: string, styleName: string, textProperties: TextProperties): TextRun;
