"use strict";
function createParagraphStyle(basedOn, paragraphProperties, textProperties) {
    return {
        type: "ParagraphStyle",
        basedOn: basedOn,
        paragraphProperties: paragraphProperties,
        textProperties: textProperties,
    };
}
exports.createParagraphStyle = createParagraphStyle;
//# sourceMappingURL=paragraph-style.js.map