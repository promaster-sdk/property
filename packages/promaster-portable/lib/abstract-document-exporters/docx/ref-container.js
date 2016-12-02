"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DocxConstants = require("./docx-constants");
var xml_container_1 = require("./xml-container");
var RefContainer = (function (_super) {
    __extends(RefContainer, _super);
    function RefContainer() {
        _super.call(this);
        this._references = [];
        this.XMLWriter.WriteStartDocument(true);
        this.XMLWriter.WriteStartElement("Relationships", DocxConstants.RelationNamespace);
    }
    RefContainer.prototype.AddReference = function (refId, filePath, type) {
        if (filePath.startsWith("/") == false)
            filePath = "/" + filePath;
        this.AddReference2(refId, filePath, type);
    };
    RefContainer.prototype.AddReference2 = function (refId, filePath, type) {
        if (this._references.indexOf(refId) !== -1)
            return;
        this.XMLWriter.WriteStartElement("Relationship");
        this.XMLWriter.WriteAttributeString("Type", type);
        filePath = filePath.replace("\\", "/");
        this.XMLWriter.WriteAttributeString("Target", filePath);
        this.XMLWriter.WriteAttributeString("Id", refId);
        this.XMLWriter.WriteEndElement();
        this._references.push(refId);
    };
    Object.defineProperty(RefContainer.prototype, "count", {
        get: function () {
            return this._references.length;
        },
        enumerable: true,
        configurable: true
    });
    RefContainer.prototype.finish = function () {
        this.XMLWriter.WriteEndElement();
        _super.prototype.Finish.call(this);
    };
    RefContainer.prototype.close = function () {
        _super.prototype.close.call(this);
        this._references = [];
    };
    return RefContainer;
}(xml_container_1.XMLContainer));
exports.RefContainer = RefContainer;
//# sourceMappingURL=ref-container.js.map