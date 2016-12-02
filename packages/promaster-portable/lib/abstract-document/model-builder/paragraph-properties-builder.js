"use strict";
var paragraph_properties_1 = require("../model/properties/paragraph-properties");
var ParagraphPropertiesBuilder = (function () {
    function ParagraphPropertiesBuilder() {
    }
    ParagraphPropertiesBuilder.prototype.build = function () {
        return paragraph_properties_1.createParagraphProperties(this.alignment, this.spacingBefore, this.spacingAfter);
    };
    return ParagraphPropertiesBuilder;
}());
exports.ParagraphPropertiesBuilder = ParagraphPropertiesBuilder;
//# sourceMappingURL=paragraph-properties-builder.js.map