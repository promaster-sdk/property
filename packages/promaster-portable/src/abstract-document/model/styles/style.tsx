import {StyleKey, createStyleKey} from "./style-key";
import {Indexer} from "../abstract-doc";
// import * as ParagraphStyle from "./paragraph-style";
// import * as TableCellStyle from "./table-cell-style";
// import {TableStyle} from "./table-style";

 export type StyleType = "ParagraphStyle" | "TableCellStyle" | "TableStyle" | "TextStyle";
//
// export type Style = ParagraphStyle.ParagraphStyle | TableCellStyle.TableCellStyle | TableStyle;
// export type Style3 = ParagraphStyle.ParagraphStyle | TableCellStyle. | TableStyle;

export interface Style {
  type: StyleType,
  basedOn: string | undefined,
}


export function getEffectiveStyle2<TStyle extends Style>(styles: Indexer<StyleKey, Style>, style: Style): TStyle {

  //throw new Error(`TODO!! ${styles} ${style}`);

  const styleType = style.type;
  const styleStack: Array<Style> = [];
  styleStack.push(style);
  while (style.basedOn) {
    style = styles[createStyleKey(styleType, style.basedOn)];
    styleStack.push(style);
  }
  let effective: Style = styles[createStyleKey(styleType, "Default")];
  while (styleStack.length > 0) {
    style = styleStack.pop() as Style;
    switch ((style as Style).type) {
      case "ParagraphStyle":
        //effective = ParagraphStyle.overrideWith(style, effective);
        break;
      default:
        //effective = effective.OverrideWith(style, effective) as TStyle;
    }
  }
  return effective as TStyle;

}
