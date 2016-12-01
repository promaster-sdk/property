import {TableCell, createTableCell} from "../model/table/table-cell";
import {TableCellPropertiesBuilder} from "./table-cell-properties-builder";
import {SectionElement} from "../model/section-elements/section-element";

export class TableCellBuilder //: List<ISectionElement>, IBuilder<ISectionElement>
{
  styleName: string;
  columnSpan: number;
  readonly tableCellProperties: TableCellPropertiesBuilder = new TableCellPropertiesBuilder();
  private readonly list: Array<SectionElement> = [];

  add(child: SectionElement): void {
    this.list.push(child);
  }

  build(): TableCell {
    return createTableCell(this.styleName, this.tableCellProperties.build(), this.columnSpan, this.list);
  }

}
