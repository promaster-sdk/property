"use strict";
var style_1 = require("../styles/style");
var paragraph_style_1 = require("../styles/paragraph-style");
function createParagraph(styleName, paragraphProperties, textProperties, atoms, numbering) {
    return {
        type: "Paragraph",
        styleName: styleName,
        paragraphProperties: paragraphProperties,
        textProperties: textProperties,
        atoms: atoms,
        numbering: numbering,
    };
}
exports.createParagraph = createParagraph;
function getEffectiveParagraphProperties(styles, p) {
    var effectiveStyle = getEffectiveStyle(styles, p);
    return effectiveStyle.paragraphProperties;
}
exports.getEffectiveParagraphProperties = getEffectiveParagraphProperties;
function getEffectiveTextProperties(styles, p) {
    var effectiveStyle = getEffectiveStyle(styles, p);
    return effectiveStyle.textProperties;
}
exports.getEffectiveTextProperties = getEffectiveTextProperties;
function getEffectiveStyle(styles, p) {
    var localStyle = paragraph_style_1.createParagraphStyle(p.styleName, p.paragraphProperties, p.textProperties);
    var effectiveStyle = style_1.getEffectiveStyle2(styles, localStyle);
    return effectiveStyle;
}
//# sourceMappingURL=paragraph.js.map