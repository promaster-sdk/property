export declare type Translator = (textKey: string, params?: Map<string, string>) => string;
export declare const mapTranslator: (translations: Map<string, string>, textKey: string, params?: Map<string, string>) => any;
export declare const applyMapTranslator: (translations: Map<string, string>) => Translator;
export declare const createTranslator: (translations: Map<string, string>) => Translator;
