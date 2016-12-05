import {StyleKey, createStyleKey} from "./style-key";
import {Indexer} from "../abstract-doc";
import * as ParagraphStyle from "./paragraph-style";
import * as TableCellStyle from "./table-cell-style";
import * as TableStyle from "./table-style";
import * as TextStyle from "./text-style";
import {exhaustiveCheck} from "../../../utils/index";

export type Style =
  ParagraphStyle.ParagraphStyle
    | TableCellStyle.TableCellStyle
    | TableStyle.TableStyle
    | TextStyle.TextStyle;

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
    switch (style.type) {
      case "ParagraphStyle":
        effective = ParagraphStyle.overrideWith(style, effective as ParagraphStyle.ParagraphStyle);
        break;
      case "TableCellStyle":
        effective = TableCellStyle.overrideWith(style, effective as TableCellStyle.TableCellStyle);
        break;
      case "TableStyle":
        effective = TableStyle.overrideWith(style, effective as TableStyle.TableStyle);
        break;
      case "TextStyle":
        effective = TextStyle.overrideWith(style, effective as TextStyle.TextStyle);
        break;
      default:
        exhaustiveCheck(style);
    }
  }
  return effective as TStyle;

}
