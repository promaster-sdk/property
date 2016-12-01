import {Guid, AbstractDoc, createAbstractDoc, Indexer} from "../model/abstract-doc";
import {NumberingDefinition} from "../model/numberings/numbering-definition";
import {Numbering} from "../model/numberings/numbering";
import {Style} from "../model/styles/style";
import {SectionBuilder} from "./section-builder";
import {MasterPage} from "../model/page/master-page";
import {TableBuilder} from "./table-builder";
import {AbstractImage} from "../../abstract-image/abstract-image";
import {TableCellBuilder} from "./table-cell-builder";
import {TableRowBuilder} from "./table-row-builder";
import {KeepTogetherBuilder} from "./keep-together-builder";
import {ParagraphBuilder} from "./paragraph-builder";
import {TextProperties, createTextProperties} from "../model/properties/text-properties";
import {createTextRun} from "../model/atoms/text-run";
import {TextRunBuilder} from "./text-run-builder";
import {FieldType} from "../model/enums/field-type";
import {createTextStyle} from "../model/styles/text-style";
import {createTextField} from "../model/atoms/text-field";
import {TextAlignment} from "../model/enums/text-alignment";
import {TextStyleBuilder} from "./text-style-builder";
import {ParagraphStyleBuilder} from "./paragraph-style-builder";
import {fromTwips} from "../model/primitives/abstract-length";
import {createParagraphStyle} from "../model/styles/paragraph-style";
import {createTableStyle} from "../model/styles/table-style";
import {createTableCellProperties} from "../model/properties/table-cell-properties";
import {createLayoutFoundation} from "../model/primitives/layout-foundation";
import {createParagraphProperties} from "../model/properties/paragraph-properties";
import {Section} from "../model/page/section";
import {ImageResource, createImageResource} from "../model/primitives/image-resource";
import {StyleKey, createStyleKey} from "../model/styles/style-key";
import {createImage} from "../model/atoms/image";
import {SectionElement} from "../model/section-elements/section-element";
import {Atom} from "../model/atoms/atom";
import {TextFieldBuilder} from "./text-field-builder";
import {createTableCellStyle} from "../model/styles/table-cell-style";
import {createTableProperties} from "../model/properties/table-properties";
import {IBuilder, BuilderType, BuiltType} from "./i-builder";
import {getEffectiveTextProperties} from "../model/section-elements/paragraph";
import {fromArgb} from "../../abstract-image/color";


export class DocumentBuilder implements DocumentBuilder {
  private readonly _sections: Array<Section> = [];
  private readonly _imageResources: Indexer<Guid, ImageResource> = {};

  private readonly _styles: Indexer<StyleKey, Style> = {};

  private readonly _numberings: Indexer<string, Numbering> = {};
  private readonly _numberingDefinitions: Indexer<string, NumberingDefinition> = {};

  private readonly _stack: Array<any> = [];

  constructor() {
    this.AddDefaultStyles();
    this.addStandardStyles();
  }

  // #region IDocumentBuilder Members

  build(): AbstractDoc {
    return createAbstractDoc(this._sections, this._imageResources, this._styles, this._numberings, this._numberingDefinitions);
  }

  // GetLocalName(reportType: string, name: string): string {
  //   return reportType + "_" + name;
  // }

  setStyleName(name: string, style: Style): void {
    const key = createStyleKey(style.type, name);
    // if (this._styles.ContainsKey(key))
    this._styles[key] = style;
    // else
    //   this._styles.Add(key, style);
  }

  addImageResource(id: Guid, abstractImage: AbstractImage, renderScale: number): void {
    this._imageResources[id] = createImageResource(id, abstractImage, renderScale);
  }

  setNumbering(numberingId: string, numbering: Numbering): void {
    this._numberings[numberingId] = numbering;
  }

  setNumberingDefinition(numberingDefinitionId: string, definition: NumberingDefinition): void {
    this._numberingDefinitions[numberingDefinitionId] = definition;
  }

  beginSection(page: MasterPage): void {
    if (this._stack.length > 0)
      throw new Error("Sections can only be root elements");
    this._stack.push(new SectionBuilder(page));
  }

  endSection(): void {
    this._sections.push(this.pop<SectionBuilder>("SectionBuilder", undefined).build());
  }

  beginTable(columns: number[], keepTogether: boolean): TableBuilder {
    const builder = new TableBuilder();
    builder.columns = columns;
    builder.keepTogether = keepTogether;
    this._stack.push(builder);
    return builder;
  }

  endTable(): void {
    const tableBuilder = this.pop<TableBuilder>("TableBuilder", undefined);
    const paragraphBuilder = this.peek<IBuilder<SectionElement>>(undefined, "SectionElement");
    if (tableBuilder.keepTogether) {
      paragraphBuilder.add(tableBuilder.build());
    }
    else {
      throw new Error("TODO!!");
      // paragraphBuilder.AddRange(
      // tableBuilder.Select(
      // (r) => new Table(tableBuilder.StyleName, tableBuilder.TableProperties.Build(), tableBuilder.TableCellProperties.Build(),
      // tableBuilder.Columns, new SafeList < TableRow > {r})));
    }
  }

  beginTableRow(height: number): void {
    this.peek<TableBuilder>("TableBuilder", undefined);
    this._stack.push(new TableRowBuilder(height));
  }

  endTableRow(): void {
    const rowBuilder = this.pop<TableRowBuilder>("TableRowBuilder", undefined);
    const tableBuilder = this.peek<TableBuilder>("TableBuilder", undefined);
    tableBuilder.add(rowBuilder.build());
  }

  beginTableCell(columnSpan: number): TableCellBuilder {
    this.peek<TableRowBuilder>("TableRowBuilder", undefined);
    const builder = new TableCellBuilder();
    builder.columnSpan = columnSpan;
    this._stack.push(builder);
    return builder;
  }

  endTableCell(): void {
    const cellBuilder = this.pop<TableCellBuilder>("TableCellBuilder", undefined);
    const rowBuilder = this.peek<TableRowBuilder>("TableRowBuilder", undefined);
    rowBuilder.add(cellBuilder.build());
  }

  beginKeepTogether(): void {
    this.peek<IBuilder<SectionElement>>(undefined, "SectionElement");
    this._stack.push(new KeepTogetherBuilder());
  }

  endKeepTogether(): void {
    const keepTogetherBuilder = this.pop<KeepTogetherBuilder>("KeepTogetherBuilder", undefined);
    const sectionElementContainer = this.peek<IBuilder<SectionElement>>(undefined, "SectionElement");
    sectionElementContainer.add(keepTogetherBuilder.build());
  }

  beginParagraph(): ParagraphBuilder {
    this.peek<IBuilder<SectionElement>>(undefined, "SectionElement");
    const builder = new ParagraphBuilder();
    this._stack.push(builder);
    return builder;
  }

  beginParagraph2(styleBasedOn: string): ParagraphBuilder {
    this.peek<IBuilder<SectionElement>>(undefined, "SectionElement");
    const builder = new ParagraphBuilder();
    builder.styleName = styleBasedOn;
    this._stack.push(builder);
    return builder;
  }

  endParagraph(): void {
    const paragraphBuilder = this.pop<ParagraphBuilder>("ParagraphBuilder", undefined);
    const paragraphContainer = this.peek<IBuilder<SectionElement>>(undefined, "SectionElement");
    paragraphContainer.add(paragraphBuilder.build());
  }

  insertImage(imageResourceId: Guid, width: number, height: number): void {
    if (!this._imageResources[imageResourceId])
      throw new Error(`Tried to add a reference to image resouce but that resource dose not exist (id=${imageResourceId}).`);
    const itemContainer = this.peek<IBuilder<Atom>>(undefined, "Atom");
    itemContainer.add(createImage(this._imageResources[imageResourceId], width, height));
  }

  insertImageWithResource(imageResourceId: Guid, abstractImage: AbstractImage, width: number,
                          height: number, renderScale: number = 1.0): void {
    this.addImageResource(imageResourceId, abstractImage, renderScale);
    this.insertImage(imageResourceId, width, height);
  }

  insertTextRun(text: string): void {
    const paragraphBuilder = this.peek<ParagraphBuilder>("ParagraphBuilder", undefined);
    const p = paragraphBuilder.build();
    const textProps = getEffectiveTextProperties(this._styles, p);
    this.insertTextRun2(text, textProps);
  }

  insertTextRun2(text: string, textProperties: TextProperties): void {
    const itemContainer = this.peek<IBuilder<Atom>>(undefined, "Atom");
    const textRun = createTextRun(text, undefined, textProperties);
    itemContainer.add(textRun);
  }

  insertTextRun3(text: string, styleName: string): void {
    const itemContainer = this.peek<IBuilder<Atom>>(undefined, "Atom");
    const builder = new TextRunBuilder();
    builder.text = text;
    //builder.TextStyle.BasedOn = styleName;
    builder.styleName = styleName;
    itemContainer.add(builder.build());
  }

  insertField(type: FieldType, textProperties: TextProperties): void {
    const style = createTextStyle(undefined, textProperties);
    const itemContainer = this.peek<IBuilder<Atom>>(undefined, "Atom");
    itemContainer.add(createTextField(type, style));
  }

  insertField2(type: FieldType, styleName: string): void {
    const itemContainer = this.peek<IBuilder<Atom>>(undefined, "Atom");
    const builder = new TextFieldBuilder();
    builder.textStyle.basedOn = styleName;
    builder.type = type;
    itemContainer.add(builder.Build());
  }

  // #endregion

  private peek<T>(builderType: BuilderType| undefined, builtType: BuiltType | undefined): T {
    if (this._stack.length === 0)
      throw new Error("Expected " + builderType + ", found empty stack");
    // const top = this._stack.peek();
    const top = this._stack[this._stack.length - 1];
    if ((builderType && top.builderType !== builderType) ||
      (builtType && top.builtType !== builtType))
      throw new Error("Expected " + builderType + ", found " + typeof(top));
    return top as T;
  }

  private pop<T>(builderType: BuilderType | undefined, builtType: BuiltType | undefined): T {
    if (this._stack.length === 0)
      throw new Error("Expected " + builderType + ", found empty stack");
    const top = this._stack.pop();
    if ((builderType && top.builderType !== builderType) ||
      (builtType && top.builtType !== builtType))
      throw new Error("Found + " + top.builderType + ", expected " + builderType);
    return top as T;
  }

  private AddDefaultStyles(): void {
    // Default style need to have all properties set to a value (NULL is now allowed)
    //_styles.Add(new StyleKey(typeof(ParagraphStyle), "Default"), (new ParagraphStyleBuilder()
    //{
    //  BasedOn = null,
    //  FontFamily = "Lucida Grande/Lucida Sans Unicode",
    //  FontSize = 10,
    //  LineHeight = 13,
    //  Underline = false,
    //  Bold = false,
    //  Italic = false,
    //  Color = null,
    //  SubScript = false,
    //  SuperScript = false,
    //  Alignment = TextAlignment.Start
    //}).Build());

    this.addStyle(
      "Default", createParagraphStyle(
        undefined,
        createParagraphProperties(
          "Start",
          fromTwips(0),
          fromTwips(0)),
        createTextProperties(
          "Lucida Grande/Lucida Sans Unicode",
          10,
          false,
          false,
          false,
          undefined,
          false,
          false
        )));

    // Default style need to have all properties set to a value (NULL is now allowed)
    this.addStyle("Default", createTextStyle(undefined, createTextProperties(
      "Lucida Grande/Lucida Sans Unicode",
      10,
      false,
      false,
      false,
      undefined,
      false,
      false
    )));

    // Default style need to have all properties set to a value (NULL is now allowed)
    this._styles[createStyleKey("TableStyle", "Default")] = createTableStyle
    (
      undefined,
      createTableProperties("Left")
    );

    // Default style need to have all properties set to a value (NULL is now allowed)
    this.addStyle("Default", createTableCellStyle(
      undefined,
      createTableCellProperties(
        createLayoutFoundation<number | undefined>(0, 0, 0, 0),
        createLayoutFoundation<number | undefined>(0, 0, 0, 0),
        "Middle", fromArgb(0, 255, 255, 255))
    ));
  }

  private  addStandardStyles(): void {
    this.addTextAndParagraphStyle("Heading1", true, 12);
    this.addTextAndParagraphStyle("Heading2", true, 10);
    this.addTextAndParagraphStyle("HeaderHeading", true, undefined, "Center");
  }

  private addTextAndParagraphStyle(styleName: string, bold: boolean, fontSize: number | undefined,
                                   alignment: TextAlignment | undefined = undefined): void {
    const heading1TextStyle = new TextStyleBuilder();
    heading1TextStyle.textProperties.bold = bold;
    heading1TextStyle.textProperties.fontSize = fontSize;
    this.addStyle(styleName, heading1TextStyle.build());

    const heading1ParaStyle = new ParagraphStyleBuilder();
    heading1ParaStyle.textProperties.bold = bold;
    heading1ParaStyle.textProperties.fontSize = fontSize;
    heading1ParaStyle.paragraphProperties.alignment = alignment;
    this.addStyle(styleName, heading1ParaStyle.build());
  }

  private addStyle<TStyle extends Style>(name: string, style: TStyle): void {
    this._styles[createStyleKey(style.type, name)] = style;
  }

}
