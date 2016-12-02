"use strict";
var table_cell_style_1 = require("../model/styles/table-cell-style");
var table_cell_properties_builder_1 = require("./table-cell-properties-builder");
var TableCellStyleBuilder = (function () {
    function TableCellStyleBuilder() {
        this.tableCellProperties = new table_cell_properties_builder_1.TableCellPropertiesBuilder();
    }
    TableCellStyleBuilder.prototype.build = function () {
        return table_cell_style_1.createTableCellStyle(this.basedOn, this.tableCellProperties.build());
    };
    return TableCellStyleBuilder;
}());
exports.TableCellStyleBuilder = TableCellStyleBuilder;
//# sourceMappingURL=table-cell-style-builder.js.map