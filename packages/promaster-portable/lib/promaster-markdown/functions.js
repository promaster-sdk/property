"use strict";
var showdown_1 = require("showdown");
var extension_1 = require("./extension");
function makeHtml(text) {
    showdown_1.extension('subsup', extension_1.supsub);
    var converter = new showdown_1.Converter({ extensions: ['subsup'] });
    return converter.makeHtml(text);
}
exports.makeHtml = makeHtml;
//# sourceMappingURL=functions.js.map