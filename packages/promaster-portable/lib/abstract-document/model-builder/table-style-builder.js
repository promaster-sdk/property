"use strict";
var table_style_1 = require("../model/styles/table-style");
var TableStyleBuilder = (function () {
    function TableStyleBuilder() {
    }
    TableStyleBuilder.prototype.Build = function () {
        return table_style_1.createTableStyle(this.basedOn, this.tableProperties);
    };
    return TableStyleBuilder;
}());
exports.TableStyleBuilder = TableStyleBuilder;
//# sourceMappingURL=table-style-builder.js.map