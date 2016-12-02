"use strict";
var text_style_builder_1 = require("./text-style-builder");
var text_field_1 = require("../model/atoms/text-field");
var TextFieldBuilder = (function () {
    function TextFieldBuilder() {
        this.textStyle = new text_style_builder_1.TextStyleBuilder();
    }
    TextFieldBuilder.prototype.Build = function () {
        return text_field_1.createTextField(this.type, this.textStyle.build());
    };
    return TextFieldBuilder;
}());
exports.TextFieldBuilder = TextFieldBuilder;
//# sourceMappingURL=text-field-builder.js.map