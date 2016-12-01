"use strict";
var text_run_1 = require("../model/atoms/text-run");
var text_properties_builder_1 = require("./text-properties-builder");
var TextRunBuilder = (function () {
    function TextRunBuilder() {
        this.textProperties = new text_properties_builder_1.TextPropertiesBuilder();
    }
    TextRunBuilder.prototype.build = function () {
        return text_run_1.createTextRun(this.text, this.styleName, this.textProperties.build());
    };
    return TextRunBuilder;
}());
exports.TextRunBuilder = TextRunBuilder;
//# sourceMappingURL=text-run-builder.js.map