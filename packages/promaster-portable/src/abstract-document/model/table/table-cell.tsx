import * as TableCellProperties from "../properties/table-cell-properties";
import {SectionElement} from "../section-elements/section-element";
import {Table} from "../section-elements/table";
import * as Style from "../styles/style";
import {StyleKey} from "../styles/style-key";
import {Indexer} from "../abstract-doc";
import {TableCellStyle, createTableCellStyle} from "../styles/table-cell-style";

export interface TableCell {
  styleName: string | undefined,
  columnSpan: number,
  elements: SectionElement[],
  tableCellProperties: TableCellProperties.TableCellProperties,
}

export function createTableCell(styleName: string | undefined, tableCellProperties: TableCellProperties.TableCellProperties,
                                columnSpan: number, elements: Array<SectionElement>): TableCell {
  return {
    styleName,
    tableCellProperties,
    columnSpan,
    elements,
  }
}

export function getEffectiveTableCellProperties(/*styles: Indexer<StyleKey, Style.Style>,*/ parentTable: Table, tc: TableCell): TableCellProperties.TableCellProperties {
  // First our parent table gets its say
  let effectiveTableCellProperties = parentTable.tableCellProperties;

  // Then our style gets its say
  // const effectiveStyle = GetEffectiveStyle(styles, tc);
  effectiveTableCellProperties = TableCellProperties.overrideWith(effectiveTableCellProperties, effectiveTableCellProperties);

  // Last our own properties gets its say
  effectiveTableCellProperties = TableCellProperties.overrideWith(tc.tableCellProperties, effectiveTableCellProperties);

  return effectiveTableCellProperties;
}

export function getEffectiveStyle(styles: Indexer<StyleKey, Style.Style>, tc: TableCell): TableCellStyle {
  const localStyle = createTableCellStyle(tc.styleName, tc.tableCellProperties);
  const effectiveStyle = Style.getEffectiveStyle2<TableCellStyle>(styles, localStyle);
  return effectiveStyle;
}
