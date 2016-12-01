import {TableRow, createTableRow} from "../model/table/table-row";
import {TableCell} from "../model/table/table-cell";
import {IBuilder} from "./i-builder";

export class TableRowBuilder implements IBuilder<TableCell> //: List<TableCell>,
{
  builderType: "TableRowBuilder" = "TableRowBuilder";
  builtType: "TableCell" = "TableCell";
  height: number;
  private readonly list: Array<TableCell> = [];

  constructor(height: number) {
    this.height = height;
  }

  add(child: TableCell): void {
    this.list.push(child);
  }

  build(): TableRow {
    return createTableRow(this.height, this.list);
  }
}
