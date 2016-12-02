"use strict";
var text_properties_builder_1 = require("./text-properties-builder");
var paragraph_style_1 = require("../model/styles/paragraph-style");
var paragraph_properties_builder_1 = require("./paragraph-properties-builder");
var ParagraphStyleBuilder = (function () {
    function ParagraphStyleBuilder() {
        this.paragraphProperties = new paragraph_properties_builder_1.ParagraphPropertiesBuilder();
        this.textProperties = new text_properties_builder_1.TextPropertiesBuilder();
    }
    ParagraphStyleBuilder.prototype.build = function () {
        return paragraph_style_1.createParagraphStyle(this.basedOn, this.paragraphProperties.build(), this.textProperties.build());
    };
    return ParagraphStyleBuilder;
}());
exports.ParagraphStyleBuilder = ParagraphStyleBuilder;
//# sourceMappingURL=paragraph-style-builder.js.map