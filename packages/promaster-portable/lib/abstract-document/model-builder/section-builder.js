"use strict";
var section_1 = require("../model/page/section");
var SectionBuilder = (function () {
    function SectionBuilder(page) {
        this.builderType = "SectionBuilder";
        this.builtType = "SectionElement";
        this.list = [];
        this.page = page;
    }
    SectionBuilder.prototype.add = function (child) {
        this.list.push(child);
    };
    SectionBuilder.prototype.build = function () {
        return section_1.createSection(this.page, this.list);
    };
    return SectionBuilder;
}());
exports.SectionBuilder = SectionBuilder;
//# sourceMappingURL=section-builder.js.map