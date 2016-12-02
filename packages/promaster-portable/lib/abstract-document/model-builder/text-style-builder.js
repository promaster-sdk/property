"use strict";
var text_properties_builder_1 = require("./text-properties-builder");
var text_style_1 = require("../model/styles/text-style");
var TextStyleBuilder = (function () {
    function TextStyleBuilder() {
        this.textProperties = new text_properties_builder_1.TextPropertiesBuilder();
    }
    TextStyleBuilder.prototype.build = function () {
        return text_style_1.createTextStyle(this.basedOn, this.textProperties.build());
    };
    return TextStyleBuilder;
}());
exports.TextStyleBuilder = TextStyleBuilder;
//# sourceMappingURL=text-style-builder.js.map