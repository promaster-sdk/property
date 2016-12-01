/*
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
import {createTableStyle, TableStyle} from "../model/styles/table-style";
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

type IBuilder<T> = Array<T>;


export class DocumentBuilder implements DocumentBuilder {
  private readonly _sections: Array<Section> = [];
  private readonly _imageResources: Indexer<Guid, ImageResource> = {};

  private readonly _styles: Indexer<StyleKey, Style> = {};

  private readonly _numberings: Indexer<string, Numbering> = {};
  private readonly _numberingDefinitions: Indexer<string, NumberingDefinition> = {};

  private readonly _stack: Stack<IBuilder> = new Stack<IBuilder>();

  constructor() {
    this.AddDefaultStyles();
    this.AddStandardStyles();
  }

  // #region IDocumentBuilder Members

  public Build(): AbstractDoc {
    return createAbstractDoc(this._sections, this._imageResources, this._styles, this._numberings, this._numberingDefinitions);
  }

  // public GetLocalName(reportType: string, name: string): string {
  //   return reportType + "_" + name;
  // }

  public SetStyleName(name: string, style: Style): void {
    const key = createStyleKey(style.GetType(), name);
    if (this._styles.ContainsKey(key))
      this._styles[key] = style;
    else
      this._styles.Add(key, style);
  }

  public AddImageResource(id: Guid, abstractImage: AbstractImage, renderScale: number): void {
    this._imageResources[id] = createImageResource(id, abstractImage, renderScale);
  }

  public SetNumbering(numberingId: string, numbering: Numbering): void {
    this._numberings[numberingId] = numbering;
  }

  public SetNumberingDefinition(numberingDefinitionId: string, definition: NumberingDefinition): void {
    this._numberingDefinitions[numberingDefinitionId] = definition;
  }

  public BeginSection(page: MasterPage): void {
    if (this._stack.Any())
      throw new Error("Sections can only be root elements");
    this._stack.Push(new SectionBuilder(page));
  }

  public EndSection(): void {
    this._sections.push(this.Pop<SectionBuilder>().build());
  }

  public BeginTable(columns: number[], keepTogether: boolean): TableBuilder {
    const builder = new TableBuilder();
    builder.columns = columns;
    builder.keepTogether = keepTogether;
    this._stack.Push(builder);
    return builder;
  }

  public EndTable(): void {
    const tableBuilder = this.Pop<TableBuilder>();
    const paragraphBuilder = this.Peek<IBuilder<SectionElement>>();
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

  public BeginTableRow(height: number): void {
    this.Peek<TableBuilder>();
    this._stack.Push(new TableRowBuilder(height));
  }

  public EndTableRow(): void {
    const rowBuilder = this.Pop<TableRowBuilder>();
    const tableBuilder = this.Peek<TableBuilder>();
    tableBuilder.add(rowBuilder.build());
  }

  public BeginTableCell(columnSpan: number): TableCellBuilder {
    this.Peek<TableRowBuilder>();
    const builder = new TableCellBuilder();
    builder.columnSpan = columnSpan;
    this._stack.Push(builder);
    return builder;
  }

  public EndTableCell(): void {
    const cellBuilder = this.Pop<TableCellBuilder>();
    const rowBuilder = this.Peek<TableRowBuilder>();
    rowBuilder.add(cellBuilder.build());
  }

  public BeginKeepTogether(): void {
    this.Peek<IBuilder<SectionElement>>();
    this._stack.Push(new KeepTogetherBuilder());
  }

  public EndKeepTogether(): void {
    const keepTogetherBuilder = this.Pop<KeepTogetherBuilder>();
    const sectionElementContainer = this.Peek<IBuilder<SectionElement>>();
    sectionElementContainer.add(keepTogetherBuilder.build());
  }

  public BeginParagraph(): ParagraphBuilder {
    this.Peek<IBuilder<SectionElement>>();
    const builder = new ParagraphBuilder();
    this._stack.Push(builder);
    return builder;
  }

  BeginParagraph2(styleBasedOn: string): ParagraphBuilder {
    this.Peek<IBuilder<SectionElement>>();
    const builder = new ParagraphBuilder();
    builder.styleName = styleBasedOn;
    this._stack.Push(builder);
    return builder;
  }

  EndParagraph(): void {
    const paragraphBuilder = this.Pop<ParagraphBuilder>();
    const paragraphContainer = this.Peek<IBuilder<SectionElement>>();
    paragraphContainer.add(paragraphBuilder.build());
  }

  InsertImage(imageResourceId: Guid, width: number, height: number): void {
    if (!this._imageResources[imageResourceId])
      throw new Error(`Tried to add a reference to image resouce but that resource dose not exist (id=${imageResourceId}).`);
    const itemContainer = this.Peek<IBuilder<IAtom>>();
    itemContainer.add(createImage(this._imageResources[imageResourceId], width, height));
  }

  InsertImageWithResource(imageResourceId: Guid, abstractImage: AbstractImage, width: number,
                          height: number, renderScale: number = 1.0): void {
    this.AddImageResource(imageResourceId, abstractImage, renderScale);
    this.InsertImage(imageResourceId, width, height);
  }

  InsertTextRun(text: string): void {
    const paragraphBuilder = this.Peek<ParagraphBuilder>();
    const p = paragraphBuilder.build();
    const textProps = p.GetEffectiveTextProperties(this._styles);
    this.InsertTextRun2(text, textProps);
  }

  InsertTextRun2(text: string, textProperties: TextProperties): void {
    const itemContainer = this.Peek<IBuilder<Atom>>();
    const textRun = createTextRun(text, undefined, textProperties);
    itemContainer.add(textRun);
  }

  InsertTextRun3(text: string, styleName: string): void {
    const itemContainer = this.Peek<IBuilder<Atom>>();
    const builder = new TextRunBuilder();
    builder.text = text;
    //builder.TextStyle.BasedOn = styleName;
    builder.styleName = styleName;
    itemContainer.add(builder.build());
  }

  public InsertField(type: FieldType, textProperties: TextProperties): void {
    const style = createTextStyle(undefined, textProperties);
    const itemContainer = this.Peek<IBuilder<Atom>>();
    itemContainer.add(createTextField(type, style));
  }

  public InsertField2(type: FieldType, styleName: string): void {
    const itemContainer = this.Peek<IBuilder<Atom>>();
    const builder = new TextFieldBuilder();
    builder.textStyle.basedOn = styleName;
    builder.type = type;
    itemContainer.add(builder.Build());
  }

  // #endregion

  private Peek<T>(): T {
    if (!this._stack.Any())
      throw new Error("Expected " + typeof(T).Name + ", found null");
    const top = this._stack.Peek();
    if (!(top instanceof T))
      throw new Error("Expected " + typeof(T).Name + ", found " + top.GetType().Name);
    return top as T;
  }

  private Pop<T>(): T {
    if (!this._stack.Any())
      throw new Error("Expected " + typeof(T).Name + ", found null");
    const top = this._stack.Pop();
    if (!(top instanceof T))
      throw new Error("Found + " + top.GetType().Name + ", expected " + typeof(T).Name);
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

    this.AddStyle(
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
    this.AddStyle("Default", createTextStyle(undefined, createTextProperties(
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
    this._styles.add(createStyleKey(typeof(TableStyle), "Default"), createTableStyle
    (
      undefined,
      createTableProperties("Left")
    ));

    // Default style need to have all properties set to a value (NULL is now allowed)
    this.AddStyle("Default", createTableCellStyle(
      undefined,
      createTableCellProperties(
        createLayoutFoundation<number | undefined>(0, 0, 0, 0),
        createLayoutFoundation<number | undefined>(0, 0, 0, 0),
        "Middle", Color.FromArgb(0, 255, 255, 255))
    ));
  }

  private  AddStandardStyles(): void {
    this.AddTextAndParagraphStyle("Heading1", true, 12);
    this.AddTextAndParagraphStyle("Heading2", true, 10);
    this.AddTextAndParagraphStyle("HeaderHeading", true, undefined, "Center");
  }

  private AddTextAndParagraphStyle(styleName: string, bold: boolean, fontSize: number | undefined,
                                   alignment: TextAlignment | undefined = undefined): void {
    const heading1TextStyle = new TextStyleBuilder();
    heading1TextStyle.textProperties.bold = bold;
    heading1TextStyle.textProperties.fontSize = fontSize;
    this.AddStyle(styleName, heading1TextStyle.build());

    const heading1ParaStyle = new ParagraphStyleBuilder();
    heading1ParaStyle.textProperties.bold = bold;
    heading1ParaStyle.textProperties.fontSize = fontSize;
    heading1ParaStyle.paragraphProperties.alignment = alignment;
    this.AddStyle(styleName, heading1ParaStyle.build());
  }

  private AddStyle<TStyle extends Style>(name: string, style: TStyle): void {
    this._styles.add(createStyleKey(typeof(TStyle), name), style);
  }

}

*/
