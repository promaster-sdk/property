"use strict";
var showdown_1 = require("showdown");
var extension_1 = require("./extension");
function makeHtml(text) {
    var converter = new showdown_1.Converter();
    showdown_1.extension('myext', extension_1.myext);
    return converter.makeHtml(text);
}
exports.makeHtml = makeHtml;
//# sourceMappingURL=functions.js.map