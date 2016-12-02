"use strict";
var abstract_doc_1 = require("../model/abstract-doc");
var section_builder_1 = require("./section-builder");
var table_builder_1 = require("./table-builder");
var table_cell_builder_1 = require("./table-cell-builder");
var table_row_builder_1 = require("./table-row-builder");
var keep_together_builder_1 = require("./keep-together-builder");
var paragraph_builder_1 = require("./paragraph-builder");
var text_properties_1 = require("../model/properties/text-properties");
var text_run_1 = require("../model/atoms/text-run");
var text_run_builder_1 = require("./text-run-builder");
var text_style_1 = require("../model/styles/text-style");
var text_field_1 = require("../model/atoms/text-field");
var text_style_builder_1 = require("./text-style-builder");
var paragraph_style_builder_1 = require("./paragraph-style-builder");
var abstract_length_1 = require("../model/primitives/abstract-length");
var paragraph_style_1 = require("../model/styles/paragraph-style");
var table_style_1 = require("../model/styles/table-style");
var table_cell_properties_1 = require("../model/properties/table-cell-properties");
var layout_foundation_1 = require("../model/primitives/layout-foundation");
var paragraph_properties_1 = require("../model/properties/paragraph-properties");
var image_resource_1 = require("../model/primitives/image-resource");
var style_key_1 = require("../model/styles/style-key");
var image_1 = require("../model/atoms/image");
var text_field_builder_1 = require("./text-field-builder");
var table_cell_style_1 = require("../model/styles/table-cell-style");
var table_properties_1 = require("../model/properties/table-properties");
var paragraph_1 = require("../model/section-elements/paragraph");
var color_1 = require("../../abstract-image/color");
var DocumentBuilder = (function () {
    function DocumentBuilder() {
        this._sections = [];
        this._imageResources = {};
        this._styles = {};
        this._numberings = {};
        this._numberingDefinitions = {};
        this._stack = [];
        this.AddDefaultStyles();
        this.addStandardStyles();
    }
    DocumentBuilder.prototype.build = function () {
        return abstract_doc_1.createAbstractDoc(this._sections, this._imageResources, this._styles, this._numberings, this._numberingDefinitions);
    };
    DocumentBuilder.prototype.setStyleName = function (name, style) {
        var key = style_key_1.createStyleKey(style.type, name);
        this._styles[key] = style;
    };
    DocumentBuilder.prototype.addImageResource = function (id, abstractImage, renderScale) {
        this._imageResources[id] = image_resource_1.createImageResource(id, abstractImage, renderScale);
    };
    DocumentBuilder.prototype.setNumbering = function (numberingId, numbering) {
        this._numberings[numberingId] = numbering;
    };
    DocumentBuilder.prototype.setNumberingDefinition = function (numberingDefinitionId, definition) {
        this._numberingDefinitions[numberingDefinitionId] = definition;
    };
    DocumentBuilder.prototype.beginSection = function (page) {
        if (this._stack.length > 0)
            throw new Error("Sections can only be root elements");
        this._stack.push(new section_builder_1.SectionBuilder(page));
    };
    DocumentBuilder.prototype.endSection = function () {
        this._sections.push(this.pop("SectionBuilder", undefined).build());
    };
    DocumentBuilder.prototype.beginTable = function (columns, keepTogether) {
        var builder = new table_builder_1.TableBuilder();
        builder.columns = columns;
        builder.keepTogether = keepTogether;
        this._stack.push(builder);
        return builder;
    };
    DocumentBuilder.prototype.endTable = function () {
        var tableBuilder = this.pop("TableBuilder", undefined);
        var paragraphBuilder = this.peek(undefined, "SectionElement");
        if (tableBuilder.keepTogether) {
            paragraphBuilder.add(tableBuilder.build());
        }
        else {
            throw new Error("TODO!!");
        }
    };
    DocumentBuilder.prototype.beginTableRow = function (height) {
        this.peek("TableBuilder", undefined);
        this._stack.push(new table_row_builder_1.TableRowBuilder(height));
    };
    DocumentBuilder.prototype.endTableRow = function () {
        var rowBuilder = this.pop("TableRowBuilder", undefined);
        var tableBuilder = this.peek("TableBuilder", undefined);
        tableBuilder.add(rowBuilder.build());
    };
    DocumentBuilder.prototype.beginTableCell = function (columnSpan) {
        this.peek("TableRowBuilder", undefined);
        var builder = new table_cell_builder_1.TableCellBuilder();
        builder.columnSpan = columnSpan;
        this._stack.push(builder);
        return builder;
    };
    DocumentBuilder.prototype.endTableCell = function () {
        var cellBuilder = this.pop("TableCellBuilder", undefined);
        var rowBuilder = this.peek("TableRowBuilder", undefined);
        rowBuilder.add(cellBuilder.build());
    };
    DocumentBuilder.prototype.beginKeepTogether = function () {
        this.peek(undefined, "SectionElement");
        this._stack.push(new keep_together_builder_1.KeepTogetherBuilder());
    };
    DocumentBuilder.prototype.endKeepTogether = function () {
        var keepTogetherBuilder = this.pop("KeepTogetherBuilder", undefined);
        var sectionElementContainer = this.peek(undefined, "SectionElement");
        sectionElementContainer.add(keepTogetherBuilder.build());
    };
    DocumentBuilder.prototype.beginParagraph = function () {
        this.peek(undefined, "SectionElement");
        var builder = new paragraph_builder_1.ParagraphBuilder();
        this._stack.push(builder);
        return builder;
    };
    DocumentBuilder.prototype.beginParagraph2 = function (styleBasedOn) {
        this.peek(undefined, "SectionElement");
        var builder = new paragraph_builder_1.ParagraphBuilder();
        builder.styleName = styleBasedOn;
        this._stack.push(builder);
        return builder;
    };
    DocumentBuilder.prototype.endParagraph = function () {
        var paragraphBuilder = this.pop("ParagraphBuilder", undefined);
        var paragraphContainer = this.peek(undefined, "SectionElement");
        paragraphContainer.add(paragraphBuilder.build());
    };
    DocumentBuilder.prototype.insertImage = function (imageResourceId, width, height) {
        if (!this._imageResources[imageResourceId])
            throw new Error("Tried to add a reference to image resouce but that resource dose not exist (id=" + imageResourceId + ").");
        var itemContainer = this.peek(undefined, "Atom");
        itemContainer.add(image_1.createImage(this._imageResources[imageResourceId], width, height));
    };
    DocumentBuilder.prototype.insertImageWithResource = function (imageResourceId, abstractImage, width, height, renderScale) {
        if (renderScale === void 0) { renderScale = 1.0; }
        this.addImageResource(imageResourceId, abstractImage, renderScale);
        this.insertImage(imageResourceId, width, height);
    };
    DocumentBuilder.prototype.insertTextRun = function (text) {
        var paragraphBuilder = this.peek("ParagraphBuilder", undefined);
        var p = paragraphBuilder.build();
        var textProps = paragraph_1.getEffectiveTextProperties(this._styles, p);
        this.insertTextRun2(text, textProps);
    };
    DocumentBuilder.prototype.insertTextRun2 = function (text, textProperties) {
        var itemContainer = this.peek(undefined, "Atom");
        var textRun = text_run_1.createTextRun(text, undefined, textProperties);
        itemContainer.add(textRun);
    };
    DocumentBuilder.prototype.insertTextRun3 = function (text, styleName) {
        var itemContainer = this.peek(undefined, "Atom");
        var builder = new text_run_builder_1.TextRunBuilder();
        builder.text = text;
        builder.styleName = styleName;
        itemContainer.add(builder.build());
    };
    DocumentBuilder.prototype.insertField = function (type, textProperties) {
        var style = text_style_1.createTextStyle(undefined, textProperties);
        var itemContainer = this.peek(undefined, "Atom");
        itemContainer.add(text_field_1.createTextField(type, style));
    };
    DocumentBuilder.prototype.insertField2 = function (type, styleName) {
        var itemContainer = this.peek(undefined, "Atom");
        var builder = new text_field_builder_1.TextFieldBuilder();
        builder.textStyle.basedOn = styleName;
        builder.type = type;
        itemContainer.add(builder.Build());
    };
    DocumentBuilder.prototype.peek = function (builderType, builtType) {
        if (this._stack.length === 0)
            throw new Error("Expected " + builderType + ", found empty stack");
        var top = this._stack[this._stack.length - 1];
        if ((builderType && top.builderType !== builderType) ||
            (builtType && top.builtType !== builtType))
            throw new Error("Expected " + builderType + ", found " + typeof (top));
        return top;
    };
    DocumentBuilder.prototype.pop = function (builderType, builtType) {
        if (this._stack.length === 0)
            throw new Error("Expected " + builderType + ", found empty stack");
        var top = this._stack.pop();
        if ((builderType && top.builderType !== builderType) ||
            (builtType && top.builtType !== builtType))
            throw new Error("Found + " + top.builderType + ", expected " + builderType);
        return top;
    };
    DocumentBuilder.prototype.AddDefaultStyles = function () {
        this.addStyle("Default", paragraph_style_1.createParagraphStyle(undefined, paragraph_properties_1.createParagraphProperties("Start", abstract_length_1.fromTwips(0), abstract_length_1.fromTwips(0)), text_properties_1.createTextProperties("Lucida Grande/Lucida Sans Unicode", 10, false, false, false, undefined, false, false)));
        this.addStyle("Default", text_style_1.createTextStyle(undefined, text_properties_1.createTextProperties("Lucida Grande/Lucida Sans Unicode", 10, false, false, false, undefined, false, false)));
        this._styles[style_key_1.createStyleKey("TableStyle", "Default")] = table_style_1.createTableStyle(undefined, table_properties_1.createTableProperties("Left"));
        this.addStyle("Default", table_cell_style_1.createTableCellStyle(undefined, table_cell_properties_1.createTableCellProperties(layout_foundation_1.createLayoutFoundation(0, 0, 0, 0), layout_foundation_1.createLayoutFoundation(0, 0, 0, 0), "Middle", color_1.fromArgb(0, 255, 255, 255))));
    };
    DocumentBuilder.prototype.addStandardStyles = function () {
        this.addTextAndParagraphStyle("Heading1", true, 12);
        this.addTextAndParagraphStyle("Heading2", true, 10);
        this.addTextAndParagraphStyle("HeaderHeading", true, undefined, "Center");
    };
    DocumentBuilder.prototype.addTextAndParagraphStyle = function (styleName, bold, fontSize, alignment) {
        if (alignment === void 0) { alignment = undefined; }
        var heading1TextStyle = new text_style_builder_1.TextStyleBuilder();
        heading1TextStyle.textProperties.bold = bold;
        heading1TextStyle.textProperties.fontSize = fontSize;
        this.addStyle(styleName, heading1TextStyle.build());
        var heading1ParaStyle = new paragraph_style_builder_1.ParagraphStyleBuilder();
        heading1ParaStyle.textProperties.bold = bold;
        heading1ParaStyle.textProperties.fontSize = fontSize;
        heading1ParaStyle.paragraphProperties.alignment = alignment;
        this.addStyle(styleName, heading1ParaStyle.build());
    };
    DocumentBuilder.prototype.addStyle = function (name, style) {
        this._styles[style_key_1.createStyleKey(style.type, name)] = style;
    };
    return DocumentBuilder;
}());
exports.DocumentBuilder = DocumentBuilder;
//# sourceMappingURL=document-builder-impl.js.map