"use strict";
var table_cell_properties_1 = require("../model/properties/table-cell-properties");
var layout_foundation_1 = require("../model/primitives/layout-foundation");
var TableCellPropertiesBuilder = (function () {
    function TableCellPropertiesBuilder() {
        this.borders = layout_foundation_1.createLayoutFoundation(undefined, undefined, undefined, undefined);
        this.padding = layout_foundation_1.createLayoutFoundation(undefined, undefined, undefined, undefined);
    }
    TableCellPropertiesBuilder.prototype.setBorderThickness = function (thickness) {
        this.borders.left = thickness;
        this.borders.top = thickness;
        this.borders.right = thickness;
        this.borders.bottom = thickness;
    };
    TableCellPropertiesBuilder.prototype.build = function () {
        return table_cell_properties_1.createTableCellProperties(this.borders, this.padding, this.verticalAlignment, this.background);
    };
    return TableCellPropertiesBuilder;
}());
exports.TableCellPropertiesBuilder = TableCellPropertiesBuilder;
//# sourceMappingURL=table-cell-properties-builder.js.map