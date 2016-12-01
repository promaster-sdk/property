import {TableCell, createTableCell} from "../model/table/table-cell";
import {TableCellPropertiesBuilder} from "./table-cell-properties-builder";
import {SectionElement} from "../model/section-elements/section-element";
import {IBuilder} from "./i-builder";

export class TableCellBuilder implements IBuilder<SectionElement> //: List<ISectionElement>
{
  builderType: "TableCellBuilder" = "TableCellBuilder";
  builtType: "SectionElement" = "SectionElement";
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
