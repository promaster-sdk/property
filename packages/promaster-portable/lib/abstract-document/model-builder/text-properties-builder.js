"use strict";
var text_properties_1 = require("../model/properties/text-properties");
var TextPropertiesBuilder = (function () {
    function TextPropertiesBuilder() {
    }
    TextPropertiesBuilder.prototype.build = function () {
        return text_properties_1.createTextProperties(this.fontFamily, this.fontSize, this.underline, this.bold, this.italic, this.color, this.subScript, this.superScript);
    };
    return TextPropertiesBuilder;
}());
exports.TextPropertiesBuilder = TextPropertiesBuilder;
//# sourceMappingURL=text-properties-builder.js.map