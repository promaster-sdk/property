import * as R from "ramda";
import {fromTwips} from "./primitives/abstract-length";
import {
  ParagraphStyle, ParagraphProperties, TextProperties,
  StyleKey, TableStyle, TableProperties, TextStyle, TableCellStyle,
  TableCellProperties, LayoutFoundation, Style, TextAlignment
} from "./index";
import {fromArgb} from "../abstract-image/color";
import {Indexer} from "./abstract-doc";

export function createDefaultAndStandardStyles(): Indexer<StyleKey.StyleKey, Style.Style> {
  return {...createDefaultStyles(), ...createStandardStyles()};
}

export function createStandardStyles(): Indexer<StyleKey.StyleKey, Style.Style> {

  // createTextAndParagraphStyle("Heading1", true, 12);
  // createTextAndParagraphStyle("Heading2", true, 10);
  // createTextAndParagraphStyle("HeaderHeading", true, undefined, "Center");

  return createStyles([
    ["Heading1", createTextStyle(true, 12)],
    ["Heading1", createParagraphStyle(true, 12)],
    // Heading2
    ["Heading2", createTextStyle(true, 10)],
    ["Heading2", createParagraphStyle(true, 10)],
    // HeaderHeading
    ["HeaderHeading", createTextStyle(true, undefined)],
    ["HeaderHeading", createParagraphStyle(true, undefined, "Center")],
  ]);

}

function createStyles(tuples: Array<[string, Style.Style]>): Indexer<StyleKey.StyleKey, Style.Style> {
  return R.fromPairs(tuples.map((s) => [StyleKey.create(s[1].type, s[0]), s[1]] as R.KeyValuePair<StyleKey.StyleKey, Style.Style>));
}

export function createDefaultStyles(): Indexer<StyleKey.StyleKey, Style.Style> {

  // Default style need to have all properties set to a value (NULL is now allowed)
  const paragraphStyle = defaultParagraphStyle();
  const textStyle = defaultTextStyle();
  const tableStyle = defaultTableStyle();
  const tableCellStyle = defaultTableCellStyle();
  return {
    [StyleKey.create(paragraphStyle.type, "Default")]: paragraphStyle,
    [StyleKey.create(textStyle.type, "Default")]: textStyle,
    [StyleKey.create(tableStyle.type, "Default")]: tableStyle,
    [StyleKey.create(tableCellStyle.type, "Default")]: tableCellStyle,
  };

}

function createTextStyle(bold: boolean, fontSize: number | undefined): TextStyle.TextStyle {

  // const heading1TextStyle = new TextStyleBuilder();
  // heading1TextStyle.textProperties.bold = bold;
  // heading1TextStyle.textProperties.fontSize = fontSize;
  // this.addStyle(styleName, heading1TextStyle.build());

  return TextStyle.create({textProperties: TextProperties.create({fontSize, bold})});

}

function createParagraphStyle(bold: boolean, fontSize: number | undefined,
                              alignment: TextAlignment.TextAlignment | undefined = undefined): ParagraphStyle.ParagraphStyle {

  // const heading1ParaStyle = new ParagraphStyleBuilder();
  // heading1ParaStyle.textProperties.bold = bold;
  // heading1ParaStyle.textProperties.fontSize = fontSize;
  // heading1ParaStyle.paragraphProperties.alignment = alignment;
  // this.addStyle(styleName, heading1ParaStyle.build());

  return ParagraphStyle.create({
    paragraphProperties: ParagraphProperties.create({alignment}),
    textProperties: TextProperties.create({fontSize, bold})
  });

}

function defaultParagraphStyle(): ParagraphStyle.ParagraphStyle {
  return ParagraphStyle.create({
    paragraphProperties: ParagraphProperties.create({
      alignment: "Start",
      spacingBefore: fromTwips(0),
      spacingAfter: fromTwips(0)
    }),
    textProperties: TextProperties.create({
      fontFamily: "Lucida Grande/Lucida Sans Unicode",
      fontSize: 10,
      underline: false,
      bold: false,
      italic: false,
      subScript: false,
      superScript: false
    })
  });
}

function defaultTextStyle(): TextStyle.TextStyle {

  return TextStyle.create({
    textProperties: TextProperties.create({
      fontFamily: "Lucida Grande/Lucida Sans Unicode",
      fontSize: 10,
      underline: false,
      bold: false,
      italic: false,
      subScript: false,
      superScript: false
    })
  });
}

function defaultTableStyle(): TableStyle.TableStyle {
  return TableStyle.create({
    tableProperties: TableProperties.create("Left")
  });
}

function defaultTableCellStyle(): TableCellStyle.TableCellStyle {
  return TableCellStyle.create({
    tableCellProperties: TableCellProperties.create({
      borders: LayoutFoundation.create<number | undefined>({top: 0, bottom: 0, left: 0, right: 0}),
      padding: LayoutFoundation.create<number | undefined>({top: 0, bottom: 0, left: 0, right: 0}),
      verticalAlignment: "Middle", background: fromArgb(0, 255, 255, 255)
    })
  });
}

