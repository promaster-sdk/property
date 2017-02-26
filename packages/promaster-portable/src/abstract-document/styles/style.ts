import * as ParagraphStyle from "./paragraph-style";
import * as TableCellStyle from "./table-cell-style";
import * as TableStyle from "./table-style";
import * as TextStyle from "./text-style";

export type Style =
  ParagraphStyle.ParagraphStyle
    | TableCellStyle.TableCellStyle
    | TableStyle.TableStyle
    | TextStyle.TextStyle;

