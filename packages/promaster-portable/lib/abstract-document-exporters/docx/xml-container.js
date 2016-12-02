"use strict";
var XMLContainer = (function () {
    function XMLContainer() {
    }
    Object.defineProperty(XMLContainer.prototype, "XMLWriter", {
        get: function () {
            return this.m_XMLWriter;
        },
        enumerable: true,
        configurable: true
    });
    XMLContainer.prototype.close = function () {
    };
    XMLContainer.prototype.Finish = function () {
        this.XMLWriter.Flush();
    };
    return XMLContainer;
}());
exports.XMLContainer = XMLContainer;
//# sourceMappingURL=xml-container.js.map