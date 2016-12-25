import * as TableCellProperties from "../properties/table-cell-properties";
import * as SectionElement from "../section-elements/section-element";
import * as Table from "../section-elements/table";
import * as Style from "../styles/style";
import * as StyleKey from "../styles/style-key";
import * as TableCellStyle from "../styles/table-cell-style";
import {Indexer} from "../abstract-doc";

export interface TableCell {
  styleName: string | undefined,
  columnSpan: number,
  elements: SectionElement.SectionElement[],
  tableCellProperties: TableCellProperties.TableCellProperties,
}

export interface TableCellProps {
  styleName?: string,
  columnSpan?: number,
  elements: SectionElement.SectionElement[],
  tableCellProperties?: TableCellProperties.TableCellProperties,
}

export function create({
  styleName = undefined,
  tableCellProperties = TableCellProperties.create(),
  columnSpan = 1,
  elements
}: TableCellProps): TableCell {
  return {
    styleName,
    tableCellProperties,
    columnSpan,
    elements,
  }
}

export function getEffectiveTableCellProperties(/*styles: Indexer<StyleKey, Style.Style>,*/ parentTable: Table.Table, tc: TableCell): TableCellProperties.TableCellProperties {
  // First our parent table gets its say
  let effectiveTableCellProperties = parentTable.tableCellProperties;

  // Then our style gets its say
  // const effectiveStyle = GetEffectiveStyle(styles, tc);
  effectiveTableCellProperties = TableCellProperties.overrideWith(effectiveTableCellProperties, effectiveTableCellProperties);

  // Last our own properties gets its say
  effectiveTableCellProperties = TableCellProperties.overrideWith(tc.tableCellProperties, effectiveTableCellProperties);

  return effectiveTableCellProperties;
}

export function getEffectiveStyle(styles: Indexer<StyleKey.StyleKey, Style.Style>, tc: TableCell): TableCellStyle.TableCellStyle {
  const localStyle = TableCellStyle.create({basedOn: tc.styleName, tableCellProperties: tc.tableCellProperties});
  const effectiveStyle = Style.getEffectiveStyle2<TableCellStyle.TableCellStyle>(styles, localStyle);
  return effectiveStyle;
}
