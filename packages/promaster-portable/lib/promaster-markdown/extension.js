"use strict";
function supsub() {
    var superscript = {
        type: 'lang',
        regex: /\^([^\r]*)\^/g,
        replace: '<sup>$1</sup>'
    };
    var subscript = {
        type: 'lang',
        regex: /~T([^\r]*)~T/g,
        replace: '<sub>$1</sub>'
    };
    return [superscript, subscript];
}
exports.supsub = supsub;
//# sourceMappingURL=extension.js.map