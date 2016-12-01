import {TablePropertiesBuilder} from "./table-properties-builder";
import {TableCellPropertiesBuilder} from "./table-cell-properties-builder";
import {Table, createTable} from "../model/section-elements/table";
import {TableRow} from "../model/table/table-row";
import {IBuilder} from "./i-builder";

export class TableBuilder implements  IBuilder<TableRow> //: List<TableRow>
{
  builderType: "TableBuilder" = "TableBuilder";
  builtType: "TableRow" = "TableRow";
  columns: number[];
  keepTogether: boolean;
  styleName: string;
  readonly tableProperties: TablePropertiesBuilder = new TablePropertiesBuilder();
  readonly tableCellProperties: TableCellPropertiesBuilder = new TableCellPropertiesBuilder();
  private readonly list: Array<TableRow> = [];

  add(child: TableRow): void {
    this.list.push(child);
  }

  build(): Table {
    return createTable(this.styleName, this.tableProperties.build(), this.tableCellProperties.build(), this.columns, this.list);
  }

}
