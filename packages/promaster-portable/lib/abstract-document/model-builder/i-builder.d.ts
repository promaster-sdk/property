export declare type BuilderType = "KeepTogetherBuilder" | "ParagraphBuilder" | "SectionBuilder" | "TableBuilder" | "TableCellBuilder" | "TableRowBuilder";
export declare type BuiltType = "SectionElement" | "Atom" | "TableRow" | "TableCell";
export interface IBuilder<T> {
    builderType: BuilderType;
    builtType: BuiltType;
    add(child: T): void;
}
