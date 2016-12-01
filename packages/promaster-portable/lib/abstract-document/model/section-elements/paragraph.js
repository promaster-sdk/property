"use strict";
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
//# sourceMappingURL=paragraph.js.map