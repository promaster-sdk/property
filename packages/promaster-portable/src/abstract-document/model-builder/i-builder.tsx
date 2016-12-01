export type BuilderType = "KeepTogetherBuilder" | "ParagraphBuilder" |
  "SectionBuilder" |  "TableBuilder" | "TableCellBuilder" | "TableRowBuilder";

export type BuiltType = "SectionElement" | "Atom" |  "TableRow" | "TableCell";

export interface IBuilder<T> {
  builderType: BuilderType,
  builtType: BuiltType,
  add(child: T): void,
  // addRange(children: Array<T>): void ;
}
