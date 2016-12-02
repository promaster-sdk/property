"use strict";
var numbering_level_definition_1 = require("../model/numberings/numbering-level-definition");
var numbering_definition_1 = require("../model/numberings/numbering-definition");
var NumberingDefinitionBuilder = (function () {
    function NumberingDefinitionBuilder() {
        this.levels = [];
    }
    NumberingDefinitionBuilder.prototype.addLevel = function (level, format, start, levelText, levelIndention, textProperties) {
        if (textProperties === void 0) { textProperties = undefined; }
        this.levels.push(numbering_level_definition_1.createNumberingLevelDefinition(level, format, start, levelText, levelIndention, textProperties));
    };
    NumberingDefinitionBuilder.prototype.build = function () {
        return numbering_definition_1.createNumberingDefinition(this.levels);
    };
    return NumberingDefinitionBuilder;
}());
exports.NumberingDefinitionBuilder = NumberingDefinitionBuilder;
//# sourceMappingURL=numbering-definition-builder.js.map