"use strict";
var keep_together_1 = require("../model/section-elements/keep-together");
var KeepTogetherBuilder = (function () {
    function KeepTogetherBuilder() {
        this.builderType = "KeepTogetherBuilder";
        this.builtType = "SectionElement";
        this.list = [];
    }
    KeepTogetherBuilder.prototype.add = function (child) {
        this.list.push(child);
    };
    KeepTogetherBuilder.prototype.build = function () {
        return keep_together_1.createKeepTogether(this.list);
    };
    return KeepTogetherBuilder;
}());
exports.KeepTogetherBuilder = KeepTogetherBuilder;
//# sourceMappingURL=keep-together-builder.js.map