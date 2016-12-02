"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var xml_container_1 = require("./xml-container");
var ref_container_1 = require("./ref-container");
var DocumentContainer = (function (_super) {
    __extends(DocumentContainer, _super);
    function DocumentContainer() {
        _super.apply(this, arguments);
        this._references = new ref_container_1.RefContainer();
    }
    return DocumentContainer;
}(xml_container_1.XMLContainer));
exports.DocumentContainer = DocumentContainer;
//# sourceMappingURL=document-container.js.map