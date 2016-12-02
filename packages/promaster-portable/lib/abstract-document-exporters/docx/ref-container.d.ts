import { XMLContainer } from "./xml-container";
export declare class RefContainer extends XMLContainer {
    _references: Array<string>;
    constructor();
    AddReference(refId: string, filePath: string, type: string): void;
    AddReference2(refId: string, filePath: string, type: string): void;
    readonly count: number;
    finish(): void;
    close(): void;
}
