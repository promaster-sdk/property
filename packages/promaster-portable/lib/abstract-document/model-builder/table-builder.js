"use strict";
var table_properties_builder_1 = require("./table-properties-builder");
var table_cell_properties_builder_1 = require("./table-cell-properties-builder");
var table_1 = require("../model/section-elements/table");
var TableBuilder = (function () {
    function TableBuilder() {
        this.builderType = "TableBuilder";
        this.builtType = "TableRow";
        this.tableProperties = new table_properties_builder_1.TablePropertiesBuilder();
        this.tableCellProperties = new table_cell_properties_builder_1.TableCellPropertiesBuilder();
        this.list = [];
    }
    TableBuilder.prototype.add = function (child) {
        this.list.push(child);
    };
    TableBuilder.prototype.build = function () {
        return table_1.createTable(this.styleName, this.tableProperties.build(), this.tableCellProperties.build(), this.columns, this.list);
    };
    return TableBuilder;
}());
exports.TableBuilder = TableBuilder;
//# sourceMappingURL=table-builder.js.map