"use strict";
var table_row_1 = require("../model/table/table-row");
var TableRowBuilder = (function () {
    function TableRowBuilder(height) {
        this.builderType = "TableRowBuilder";
        this.builtType = "TableCell";
        this.list = [];
        this.height = height;
    }
    TableRowBuilder.prototype.add = function (child) {
        this.list.push(child);
    };
    TableRowBuilder.prototype.build = function () {
        return table_row_1.createTableRow(this.height, this.list);
    };
    return TableRowBuilder;
}());
exports.TableRowBuilder = TableRowBuilder;
//# sourceMappingURL=table-row-builder.js.map