"use strict";
var table_cell_1 = require("../model/table/table-cell");
var table_cell_properties_builder_1 = require("./table-cell-properties-builder");
var TableCellBuilder = (function () {
    function TableCellBuilder() {
        this.builderType = "TableCellBuilder";
        this.builtType = "SectionElement";
        this.tableCellProperties = new table_cell_properties_builder_1.TableCellPropertiesBuilder();
        this.list = [];
    }
    TableCellBuilder.prototype.add = function (child) {
        this.list.push(child);
    };
    TableCellBuilder.prototype.build = function () {
        return table_cell_1.createTableCell(this.styleName, this.tableCellProperties.build(), this.columnSpan, this.list);
    };
    return TableCellBuilder;
}());
exports.TableCellBuilder = TableCellBuilder;
//# sourceMappingURL=table-cell-builder.js.map