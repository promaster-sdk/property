"use strict";
var paragraph_properties_builder_1 = require("./paragraph-properties-builder");
var text_properties_builder_1 = require("./text-properties-builder");
var paragraph_1 = require("../model/section-elements/paragraph");
var ParagraphBuilder = (function () {
    function ParagraphBuilder() {
        this.builderType = "ParagraphBuilder";
        this.builtType = "Atom";
        this.list = [];
        this.paragraphProperties = new paragraph_properties_builder_1.ParagraphPropertiesBuilder();
        this.textProperties = new text_properties_builder_1.TextPropertiesBuilder();
    }
    ParagraphBuilder.prototype.add = function (child) {
        this.list.push(child);
    };
    ParagraphBuilder.prototype.build = function () {
        return paragraph_1.createParagraph(this.styleName, this.paragraphProperties.build(), this.textProperties.build(), this.list, this.numbering);
    };
    return ParagraphBuilder;
}());
exports.ParagraphBuilder = ParagraphBuilder;
//# sourceMappingURL=paragraph-builder.js.map