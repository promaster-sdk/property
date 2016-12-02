"use strict";
var table_properties_1 = require("../model/properties/table-properties");
var TablePropertiesBuilder = (function () {
    function TablePropertiesBuilder() {
    }
    TablePropertiesBuilder.prototype.build = function () {
        return table_properties_1.createTableProperties(this.alignment);
    };
    return TablePropertiesBuilder;
}());
exports.TablePropertiesBuilder = TablePropertiesBuilder;
//# sourceMappingURL=table-properties-builder.js.map