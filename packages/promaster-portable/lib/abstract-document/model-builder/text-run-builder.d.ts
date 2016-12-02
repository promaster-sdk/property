import { TextRun } from "../model/atoms/text-run";
import { TextPropertiesBuilder } from "./text-properties-builder";
export declare class TextRunBuilder {
    text: string;
    styleName: string;
    readonly textProperties: TextPropertiesBuilder;
    build(): TextRun;
}
