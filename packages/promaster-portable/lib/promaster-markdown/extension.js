"use strict";
function myext() {
    var superscript = {
        type: 'superscript',
        regex: /olle/g,
        replace: 'hejhej'
    };
    var subscript = {
        type: 'subscript',
        regex: /kalle/g,
        replace: 'hello'
    };
    return [superscript, subscript];
}
exports.myext = myext;
//# sourceMappingURL=extension.js.map