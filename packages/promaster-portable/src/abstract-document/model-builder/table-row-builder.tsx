import {TableRow, createTableRow} from "../model/table/table-row";
import {TableCell} from "../model/table/table-cell";

export class TableRowBuilder //: List<TableCell>, IBuilder<TableCell>
{
  height: number;
  private readonly list: Array<TableCell> = [];

  add(child: TableCell): void {
    this.list.push(child);
  }

  build(): TableRow {
    return createTableRow(this.height, this.list);
  }
}
