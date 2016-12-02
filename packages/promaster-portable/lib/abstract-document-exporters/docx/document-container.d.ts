import { XMLContainer } from "./xml-container";
import { RefContainer } from "./ref-container";
export declare class DocumentContainer extends XMLContainer {
    filePath: string;
    fileName: string;
    refId: string;
    contentType: string;
    readonly _references: RefContainer;
}
