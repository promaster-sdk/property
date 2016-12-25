"use strict";
var index_1 = require("../../abstract-document/index");
var Color = require("../../abstract-image/color");
var document_container_1 = require("./document-container");
var DocxConstants = require("./docx-constants");
var string_utils_1 = require("./string-utils");
var JSZip = require("jszip");
function exportToDocx(exportAbstractImageFunc, doc) {
    var zipFiles = exportToZipMap(doc);
    var convertedZipFiles = new Map();
    for (var _i = 0, _a = Object.keys(zipFiles); _i < _a.length; _i++) {
        var itemKey = _a[_i];
        var item = zipFiles[itemKey];
        if (item) {
            switch (item.type) {
                case "AbstractImage":
                    var renderedImage = exportAbstractImageFunc("PNG", item.image, item.renderScale);
                    convertedZipFiles.set(itemKey, renderedImage.output);
                    break;
                case "XmlString":
                    convertedZipFiles.set(itemKey, string_utils_1.stringToUtf8ByteArray(item.xml));
                    break;
            }
        }
    }
    var zip = new JSZip();
    for (var _b = 0, _c = Array.from(convertedZipFiles.keys()); _b < _c.length; _b++) {
        var itemKey = _c[_b];
        var data = convertedZipFiles.get(itemKey);
        zip.file(itemKey, data);
    }
    return zip.generateAsync({ type: "uint8array" });
}
exports.exportToDocx = exportToDocx;
function exportToZipMap(abstractDoc) {
    var state = {
        imageContentTypesAdded: [],
        imageHash: new Map(),
        numberingDefinitionIdTranslation: new Map(),
        numberingIdTranslation: new Map(),
        referenceId: 0,
    };
    var GetNewReferenceId = function (state) {
        state.referenceId += 1;
        return "rId" + state.referenceId;
    };
    var zipFiles = {};
    var contentTypesDoc = new document_container_1.DocumentContainer();
    contentTypesDoc.filePath = DocxConstants.ContentTypesPath;
    contentTypesDoc.fileName = "[Content_Types].xml";
    contentTypesDoc.XMLWriter.WriteStartDocument();
    contentTypesDoc.XMLWriter.WriteStartElement("Types", DocxConstants.ContentTypeNamespace);
    var mainDoc = new document_container_1.DocumentContainer();
    mainDoc.filePath = DocxConstants.DocumentPath;
    mainDoc.fileName = "document.xml";
    mainDoc.contentType = DocxConstants.MainContentType;
    mainDoc.XMLWriter.WriteStartDocument(true);
    mainDoc.XMLWriter.WriteComment("This file represents a print");
    mainDoc.XMLWriter.WriteStartElement("document", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    mainDoc.XMLWriter.WriteStartElement("body", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    if (Object.keys(abstractDoc.numberings).length > 0) {
        var numberingDoc = new document_container_1.DocumentContainer();
        numberingDoc.filePath = DocxConstants.NumberingPath;
        numberingDoc.fileName = "numbering.xml";
        numberingDoc.contentType = DocxConstants.NumberingContentType;
        numberingDoc.XMLWriter.WriteStartDocument();
        numberingDoc.XMLWriter.WriteStartElement("numbering", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
        var wordNumberingDefinitionId = 1;
        for (var _i = 0, _a = Object.keys(abstractDoc.numberingDefinitions); _i < _a.length; _i++) {
            var key = _a[_i];
            var numDef = abstractDoc.numberingDefinitions[key];
            numberingDoc.XMLWriter.WriteStartElement("abstractNum", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            numberingDoc.XMLWriter.WriteAttributeString("abstractNumId", wordNumberingDefinitionId.toString(), DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            for (var _b = 0, _c = numDef.levels; _b < _c.length; _b++) {
                var numDefLevel = _c[_b];
                numberingDoc.XMLWriter.WriteStartElement("lvl", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                numberingDoc.XMLWriter.WriteAttributeString("ilvl", numDefLevel.level.toString(), DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                numberingDoc.XMLWriter.WriteStartElement("start", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                numberingDoc.XMLWriter.WriteAttributeString("val", numDefLevel.start.toString(), DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                numberingDoc.XMLWriter.WriteEndElement();
                var numFmt = convertNumFormat(numDefLevel.format);
                numberingDoc.XMLWriter.WriteStartElement("numFmt", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                numberingDoc.XMLWriter.WriteAttributeString("val", numFmt, DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                numberingDoc.XMLWriter.WriteEndElement();
                numberingDoc.XMLWriter.WriteStartElement("lvlText", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                numberingDoc.XMLWriter.WriteAttributeString("val", numDefLevel.levelText, DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                numberingDoc.XMLWriter.WriteEndElement();
                numberingDoc.XMLWriter.WriteStartElement("lvlJc", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                numberingDoc.XMLWriter.WriteAttributeString("val", "left", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                numberingDoc.XMLWriter.WriteEndElement();
                numberingDoc.XMLWriter.WriteStartElement("pPr", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                numberingDoc.XMLWriter.WriteStartElement("ind", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                numberingDoc.XMLWriter.WriteAttributeString("left", numDefLevel.levelIndention.twips.toString(), DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                numberingDoc.XMLWriter.WriteAttributeString("hanging", "800", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                numberingDoc.XMLWriter.WriteEndElement();
                numberingDoc.XMLWriter.WriteEndElement();
                var textProperties = numDefLevel.textProperties;
                if (textProperties != null) {
                    numberingDoc.XMLWriter.WriteStartElement("rPr", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                    if (textProperties.bold)
                        numberingDoc.XMLWriter.WriteStartElement("b", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                    numberingDoc.XMLWriter.WriteEndElement();
                    numberingDoc.XMLWriter.WriteEndElement();
                }
                numberingDoc.XMLWriter.WriteEndElement();
            }
            state.numberingDefinitionIdTranslation.set(key, wordNumberingDefinitionId++);
        }
        numberingDoc.XMLWriter.WriteEndElement();
        var wordNumberingId = 1;
        for (var _d = 0, _e = Object.keys(abstractDoc.numberings); _d < _e.length; _d++) {
            var key = _e[_d];
            var value = abstractDoc.numberings[key];
            numberingDoc.XMLWriter.WriteStartElement("num", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            numberingDoc.XMLWriter.WriteAttributeString("numId", wordNumberingId.toString(), DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            numberingDoc.XMLWriter.WriteStartElement("abstractNumId", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            var wordDefinitionId = state.numberingDefinitionIdTranslation.get(value.definitionId);
            numberingDoc.XMLWriter.WriteAttributeString("val", wordDefinitionId.toString(), DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            numberingDoc.XMLWriter.WriteEndElement();
            numberingDoc.XMLWriter.WriteEndElement();
            state.numberingIdTranslation.set(key, wordNumberingId++);
        }
        numberingDoc.XMLWriter.WriteEndElement();
        var refid = GetNewReferenceId(state);
        mainDoc.references.AddReference(refid, numberingDoc.filePath + numberingDoc.fileName, DocxConstants.NumberingNamespace);
        addDocumentToArchive(zipFiles, numberingDoc, contentTypesDoc, true);
    }
    var lastMasterPage = null;
    var currentHeader = null;
    var lastHeader = null;
    var pages = 0;
    for (var _f = 0, _g = abstractDoc.sections; _f < _g.length; _f++) {
        var section = _g[_f];
        if (section.page.header != null && section.page.header.length > 0) {
            lastHeader = currentHeader;
            currentHeader = new document_container_1.DocumentContainer();
            var headerXmlWriter = currentHeader.XMLWriter;
            headerXmlWriter.WriteStartDocument(true);
            headerXmlWriter.WriteStartElement("hdr", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            var header = section.page.header;
            for (var _h = 0, header_1 = header; _h < header_1.length; _h++) {
                var paragraph = header_1[_h];
                addBaseParagraphDocX(abstractDoc, headerXmlWriter, zipFiles, currentHeader, contentTypesDoc, paragraph, false, state.imageHash, state.imageContentTypesAdded, function () { return GetNewReferenceId(state); }, state.numberingIdTranslation);
            }
            headerXmlWriter.WriteEndElement();
            var refid = GetNewReferenceId(state);
            currentHeader.refId = refid;
            currentHeader.filePath = DocxConstants.DocumentPath;
            currentHeader.fileName = "Header_" + refid + ".xml";
            currentHeader.contentType = DocxConstants.HeaderContentType;
            mainDoc.references.AddReference(refid, currentHeader.filePath + currentHeader.fileName, DocxConstants.HeaderNamespace);
            addDocumentToArchive(zipFiles, currentHeader, contentTypesDoc, true);
        }
        else {
            lastHeader = currentHeader;
            currentHeader = new document_container_1.DocumentContainer();
            var headerXmlWriter = currentHeader.XMLWriter;
            headerXmlWriter.WriteStartDocument(true);
            headerXmlWriter.WriteStartElement("hdr", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            headerXmlWriter.WriteEndElement();
            var refid = GetNewReferenceId(state);
            currentHeader.refId = refid;
            currentHeader.filePath = DocxConstants.DocumentPath;
            currentHeader.fileName = "Header_" + refid + ".xml";
            currentHeader.contentType = DocxConstants.HeaderContentType;
            mainDoc.references.AddReference(refid, currentHeader.filePath + currentHeader.fileName, DocxConstants.HeaderNamespace);
            addDocumentToArchive(zipFiles, currentHeader, contentTypesDoc, true);
        }
        if (lastMasterPage != null) {
            insertPageSettingsParagraph(mainDoc.XMLWriter, lastMasterPage, lastHeader);
            pages++;
        }
        lastMasterPage = section.page;
        for (var _j = 0, _k = section.sectionElements; _j < _k.length; _j++) {
            var paragraph = _k[_j];
            addBaseParagraphDocX(abstractDoc, mainDoc.XMLWriter, zipFiles, mainDoc, contentTypesDoc, paragraph, false, state.imageHash, state.imageContentTypesAdded, function () { return GetNewReferenceId(state); }, state.numberingIdTranslation);
        }
    }
    if (lastMasterPage != null) {
        lastHeader = currentHeader;
        insertPageSettings(mainDoc.XMLWriter, lastMasterPage, lastHeader);
    }
    if (mainDoc.XMLWriter != null) {
        mainDoc.XMLWriter.WriteEndElement();
        mainDoc.XMLWriter.WriteEndElement();
        mainDoc.XMLWriter.Flush();
        addDocumentToArchive(zipFiles, mainDoc, contentTypesDoc, false);
        addSupportFilesContents(zipFiles, contentTypesDoc);
    }
    return zipFiles;
}
exports.exportToZipMap = exportToZipMap;
function addBaseParagraphDocX(doc, xmlWriter, zip, currentDocument, contentTypesDoc, newSectionElement, inTable, imageHash, imageContentTypesAdded, getNewReferenceId, numberingIdTranslation) {
    if (!newSectionElement) {
        insertEmptyParagraph(xmlWriter);
        return;
    }
    switch (newSectionElement.type) {
        case "Table":
            insertTable(doc, xmlWriter, zip, currentDocument, contentTypesDoc, newSectionElement, imageHash, imageContentTypesAdded, getNewReferenceId, numberingIdTranslation);
            if (inTable)
                insertEmptyParagraph(xmlWriter);
            return;
        case "Paragraph":
            insertParagraph(doc, xmlWriter, zip, currentDocument, contentTypesDoc, newSectionElement, imageHash, imageContentTypesAdded, getNewReferenceId, numberingIdTranslation);
            return;
        case "KeepTogether":
            for (var _i = 0, _a = newSectionElement.sectionElements; _i < _a.length; _i++) {
                var sectionElement = _a[_i];
                addBaseParagraphDocX(doc, xmlWriter, zip, currentDocument, contentTypesDoc, sectionElement, inTable, imageHash, imageContentTypesAdded, getNewReferenceId, numberingIdTranslation);
            }
            return;
    }
    throw new Error("The type has not been implemented in printer");
}
function insertTable(doc, xmlWriter, zip, currentDocument, contentTypesDoc, tPara, imageHash, imageContentTypesAdded, getNewReferenceId, numberingIdTranslation) {
    xmlWriter.WriteStartElement("tbl", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteStartElement("tblPr", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteStartElement("tblW", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("w", "0", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("type", "auto", DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("tblLayout", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("type", "fixed", DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("tblGrid", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    for (var _i = 0, _a = tPara.columnWidths; _i < _a.length; _i++) {
        var w = _a[_i];
        xmlWriter.WriteStartElement("gridCol", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
        xmlWriter.WriteAttributeString("w", ((w * DocxConstants.PointOoXmlFactor)).toString(), DocxConstants.WordNamespace);
        xmlWriter.WriteEndElement();
    }
    xmlWriter.WriteEndElement();
    for (var r = 0; r <= index_1.Table.nrOfRows(tPara) - 1; r++) {
        xmlWriter.WriteStartElement("tr", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
        xmlWriter.WriteStartElement("trPr", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
        if (!isNaN(tPara.rows[r].height)) {
            xmlWriter.WriteStartElement("trHeight", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            xmlWriter.WriteAttributeString("val", ((tPara.rows[r].height * DocxConstants.PointOoXmlFactor)).toString(), DocxConstants.WordNamespace);
            xmlWriter.WriteAttributeString("type", "atLeast", DocxConstants.WordNamespace);
            xmlWriter.WriteEndElement();
        }
        xmlWriter.WriteStartElement("cantSplit", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
        xmlWriter.WriteEndElement();
        xmlWriter.WriteEndElement();
        var c = 0;
        var tc = 0;
        while (c < tPara.columnWidths.length) {
            var ptc = getCell(tPara, r, tc);
            var effectiveCellProps = index_1.TableCell.getEffectiveTableCellProperties(tPara, ptc);
            xmlWriter.WriteStartElement("tc", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            xmlWriter.WriteStartElement("tcPr", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            if (effectiveCellProps.background && effectiveCellProps.background.a > 0) {
                xmlWriter.WriteStartElement("shd", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
                xmlWriter.WriteAttributeString("val", "clear", DocxConstants.WordNamespace);
                xmlWriter.WriteAttributeString("color", "auto", DocxConstants.WordNamespace);
                xmlWriter.WriteAttributeString("fill", Color.toString6Hex(effectiveCellProps.background), DocxConstants.WordNamespace);
                xmlWriter.WriteEndElement();
            }
            xmlWriter.WriteStartElement("gridSpan", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            xmlWriter.WriteAttributeString("val", ptc.columnSpan.toString(), DocxConstants.WordNamespace);
            xmlWriter.WriteEndElement();
            xmlWriter.WriteStartElement("tcBorders", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            if (effectiveCellProps) {
                if (effectiveCellProps.borders.bottom || 0 > 0)
                    addBordersToCell(xmlWriter, effectiveCellProps.borders.bottom, "bottom");
                if (effectiveCellProps.borders.left || 0 > 0)
                    addBordersToCell(xmlWriter, effectiveCellProps.borders.left, "left");
                if (effectiveCellProps.borders.top || 0 > 0)
                    addBordersToCell(xmlWriter, effectiveCellProps.borders.top, "top");
                if (effectiveCellProps.borders.right || 0 > 0)
                    addBordersToCell(xmlWriter, effectiveCellProps.borders.right, "right");
            }
            xmlWriter.WriteEndElement();
            xmlWriter.WriteStartElement("tcMar", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            var mTop = 0;
            var mBottom = 0;
            var mLeft = 0;
            var mRight = 0;
            if (effectiveCellProps.padding.top)
                mTop = effectiveCellProps.padding.top;
            if (effectiveCellProps.padding.bottom)
                mBottom = effectiveCellProps.padding.bottom;
            if (effectiveCellProps.padding.left)
                mLeft = effectiveCellProps.padding.left;
            if (effectiveCellProps.padding.right)
                mRight = effectiveCellProps.padding.right;
            xmlWriter.WriteStartElement("top", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            xmlWriter.WriteAttributeString("w", mTop.toString(), DocxConstants.WordNamespace);
            xmlWriter.WriteAttributeString("type", "dxa", DocxConstants.WordNamespace);
            xmlWriter.WriteEndElement();
            xmlWriter.WriteStartElement("bottom", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            xmlWriter.WriteAttributeString("w", mBottom.toString(), DocxConstants.WordNamespace);
            xmlWriter.WriteAttributeString("type", "dxa", DocxConstants.WordNamespace);
            xmlWriter.WriteEndElement();
            xmlWriter.WriteStartElement("right", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            xmlWriter.WriteAttributeString("w", mRight.toString(), DocxConstants.WordNamespace);
            xmlWriter.WriteAttributeString("type", "dxa", DocxConstants.WordNamespace);
            xmlWriter.WriteEndElement();
            xmlWriter.WriteStartElement("left", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            xmlWriter.WriteAttributeString("w", mLeft.toString(), DocxConstants.WordNamespace);
            xmlWriter.WriteAttributeString("type", "dxa", DocxConstants.WordNamespace);
            xmlWriter.WriteEndElement();
            xmlWriter.WriteEndElement();
            xmlWriter.WriteEndElement();
            if (ptc.elements.length == 0) {
                insertEmptyParagraph(xmlWriter);
            }
            else {
                for (var _b = 0, _c = ptc.elements; _b < _c.length; _b++) {
                    var bp = _c[_b];
                    addBaseParagraphDocX(doc, xmlWriter, zip, currentDocument, contentTypesDoc, bp, true, imageHash, imageContentTypesAdded, getNewReferenceId, numberingIdTranslation);
                }
            }
            xmlWriter.WriteEndElement();
            c += ptc.columnSpan;
            tc += 1;
        }
        xmlWriter.WriteEndElement();
    }
    xmlWriter.WriteEndElement();
}
function insertParagraph(doc, xmlWriter, zip, currentDocument, contentTypesDoc, para, imageHash, imageContentTypesAdded, getNewReferenceId, numberingIdTranslation) {
    var effectiveParaProps = index_1.Paragraph.getEffectiveParagraphProperties(doc.styles, para);
    xmlWriter.WriteStartElement("p", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteStartElement("pPr", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteStartElement("wordWrap", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("val", "on", DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("spacing", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    if (effectiveParaProps.spacingBefore)
        xmlWriter.WriteAttributeString("before", effectiveParaProps.spacingBefore.twips.toString(), DocxConstants.WordNamespace);
    if (effectiveParaProps.spacingAfter)
        xmlWriter.WriteAttributeString("after", effectiveParaProps.spacingAfter.twips.toString(), DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
    if (para.numbering != null) {
        xmlWriter.WriteStartElement("numPr", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
        xmlWriter.WriteStartElement("ilvl", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
        xmlWriter.WriteAttributeString("val", para.numbering.level.toString(), DocxConstants.WordNamespace);
        xmlWriter.WriteEndElement();
        xmlWriter.WriteStartElement("numId", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
        var wordNumberingId = getWordNumberingId(para.numbering.numberingId, numberingIdTranslation);
        xmlWriter.WriteAttributeString("val", wordNumberingId.toString(), DocxConstants.WordNamespace);
        xmlWriter.WriteEndElement();
        xmlWriter.WriteEndElement();
    }
    xmlWriter.WriteElementString("keepLines", "", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    insertJc(xmlWriter, effectiveParaProps.alignment);
    xmlWriter.WriteEndElement();
    for (var _i = 0, _a = para.atoms; _i < _a.length; _i++) {
        var comp = _a[_i];
        insertComponent(doc, xmlWriter, zip, currentDocument, contentTypesDoc, comp, imageHash, imageContentTypesAdded, getNewReferenceId);
    }
    xmlWriter.WriteEndElement();
}
function getWordNumberingId(numberingId, numberingIdTranslation) {
    return numberingIdTranslation.get(numberingId);
}
function insertComponent(doc, xmlWriter, zip, currentDocument, contentTypesDoc, bc, imageHash, imageContentTypesAdded, getNewReferenceId) {
    switch (bc.type) {
        case "TextField":
            insertFieldComponent(doc, xmlWriter, bc);
            break;
        case "TextRun":
            var effectiveTextProps = index_1.TextRun.getEffectiveTextProperties(doc.styles, bc);
            insertTextComponent(xmlWriter, bc, effectiveTextProps);
            break;
        case "Image":
            insertImageComponent(xmlWriter, zip, currentDocument, contentTypesDoc, bc, imageHash, imageContentTypesAdded, getNewReferenceId);
            break;
        default:
            throw new Error("Contents of job is not implemented in printer");
    }
}
function insertImageComponent(xmlWriter, zip, currentDocument, contentTypesDoc, image, imageHash, imageContentTypesAdded, getNewReferenceId) {
    var renderedImageFormat = "PNG";
    if (!imageHash.has(image.imageResource.id.toString())) {
        var refId = getNewReferenceId();
        addImageReference2(zip, contentTypesDoc, image, renderedImageFormat, imageContentTypesAdded, imageHash, refId);
    }
    var rid = imageHash.get(image.imageResource.id.toString()).toString();
    var filePath = DocxConstants.ImagePath + "image_" + rid + "." + renderedImageFormat;
    currentDocument.references.AddReference(rid, filePath, DocxConstants.ImageNamespace);
    xmlWriter.WriteStartElement("r", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    insertImage(xmlWriter, rid, image.width, image.height);
    xmlWriter.WriteEndElement();
}
function convertNumFormat(format) {
    var wordNumFmt = "decimal";
    switch (format) {
        case "Decimal":
            wordNumFmt = "decimal";
            break;
        case "DecimalZero":
            wordNumFmt = "decimalZero";
            break;
        case "LowerLetter":
            wordNumFmt = "lowerLetter";
            break;
        case "LowerRoman":
            wordNumFmt = "lowerRoman";
            break;
        case "UpperLetter":
            wordNumFmt = "upperLetter";
            break;
        case "UpperRoman":
            wordNumFmt = "upperRoman";
            break;
    }
    return wordNumFmt;
}
function addImageReference2(zip, contentTypesDoc, image, renderedImageFormat, imageContentTypesAdded, imageHash, refId) {
    var filePath = DocxConstants.ImagePath + "image_" + refId + "." + renderedImageFormat;
    var mimeType = getMimeType(renderedImageFormat);
    if (imageContentTypesAdded.indexOf(mimeType) === -1) {
        insertImageContentType(renderedImageFormat, mimeType, contentTypesDoc);
        imageContentTypesAdded.push(mimeType);
    }
    addImageToArchive(zip, filePath, image.imageResource.abstractImage, image.imageResource.renderScale, "PNG");
    imageHash.set(image.imageResource.id.toString(), refId);
}
function addSupportFilesContents(zip, contentTypesDoc) {
    addHeadRef(zip);
    addContentTypes(zip, contentTypesDoc);
}
function addContentTypes(zip, contentTypesDoc) {
    insertDefaultContentTypes(contentTypesDoc);
    contentTypesDoc.XMLWriter.WriteEndElement();
    addDocumentToArchive(zip, contentTypesDoc, contentTypesDoc, false);
}
function insertPageSettingsParagraph(xmlWriter, ps, lastHeader) {
    xmlWriter.WriteStartElement("p", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteStartElement("pPr", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    insertPageSettings(xmlWriter, ps, lastHeader);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
}
function insertPageSettings(xmlWriter, ps, lastHeader) {
    xmlWriter.WriteStartElement("sectPr", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteStartElement("footnotePr", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteStartElement("pos", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("val", "beneathText", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    if (lastHeader != null) {
        xmlWriter.WriteStartElement("headerReference", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
        xmlWriter.WriteAttributeString("type", "default", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
        xmlWriter.WriteAttributeString("id", lastHeader.refId, DocxConstants.RelNamespace);
        xmlWriter.WriteEndElement();
    }
    xmlWriter.WriteStartElement("pgSz", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("w", (index_1.PageStyle.getWidth(ps.style) * DocxConstants.PointOoXmlFactor).toString(), DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("h", (index_1.PageStyle.getHeight(ps.style) * DocxConstants.PointOoXmlFactor).toString(), DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    if (ps.style.orientation == "Landscape")
        xmlWriter.WriteAttributeString("orient", "landscape", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("pgMar", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("top", ((ps.style.margins.top * DocxConstants.PointOoXmlFactor)).toFixed(0), DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("bottom", ((ps.style.margins.bottom * DocxConstants.PointOoXmlFactor)).toFixed(0), DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("left", ((ps.style.margins.left * DocxConstants.PointOoXmlFactor)).toFixed(0), DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("right", ((ps.style.margins.right * DocxConstants.PointOoXmlFactor)).toFixed(0), DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("footer", "100", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
}
function insertDateComponent(doc, xmlWriter, tf) {
    xmlWriter.WriteStartElement("r", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    var textProperties = index_1.TextField.getEffectiveStyle(doc.styles, tf).textProperties;
    insertRunProperty(xmlWriter, textProperties);
    xmlWriter.WriteStartElement("fldChar", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("fldCharType", "begin", DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("r", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    insertRunProperty(xmlWriter, textProperties);
    xmlWriter.WriteStartElement("instrText", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("space", "preserve", "", "xml");
    xmlWriter.WriteString(" DATE \\@YYYY/MM/DD ");
    var fcText = index_1.TextRun.create({ text: "{ DATE \\@YYYY/MM/DD }", textProperties: index_1.TextField.getEffectiveStyle(doc.styles, tf).textProperties });
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("r", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    insertRunProperty(xmlWriter, textProperties);
    xmlWriter.WriteStartElement("fldChar", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("fldCharType", "separate", DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    var effectiveStyle = index_1.TextField.getEffectiveStyle(doc.styles, tf);
    insertTextComponent(xmlWriter, fcText, effectiveStyle.textProperties);
    xmlWriter.WriteStartElement("r", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    insertRunProperty(xmlWriter, textProperties);
    xmlWriter.WriteStartElement("fldChar", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("fldCharType", "end", DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
}
function insertTextComponent(xmlWriter, tr, textProperties) {
    insertText(xmlWriter, tr.text, textProperties);
}
function escape(text) {
    if (text === null || text === undefined)
        return "";
    var escapeMap = {
        ">": "&gt;",
        "<": "&lt;",
        "'": "&apos;",
        "\"": "&quot;",
        "&": "&amp;",
    };
    return text.replace(new RegExp("([&\"<>'])", "g"), function (_str, item) { return escapeMap[item]; });
}
function insertText(xmlWriter, text, textProperties) {
    xmlWriter.WriteStartElement("r", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    insertRunProperty(xmlWriter, textProperties);
    xmlWriter.WriteStartElement("t", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("space", "preserve", "", "xml");
    xmlWriter.WriteString(escape(text));
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
}
function insertEmptyParagraph(xmlWriter) {
    xmlWriter.WriteStartElement("p", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteStartElement("pPr", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteStartElement("spacing", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("after", "0", DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
}
function getCell(table, r, c) {
    if (r >= index_1.Table.nrOfRows(table))
        return null;
    var row = table.rows[r];
    if (c < row.cells.length)
        return row.cells[c];
    var cs;
    for (var _i = 0, _a = row.cells; _i < _a.length; _i++) {
        var ptc = _a[_i];
        if (ptc == null)
            break;
        cs = index_1.TableCell.getEffectiveTableCellProperties(table, ptc);
    }
    if (!cs) {
        cs = index_1.TableCellProperties.create({
            borders: index_1.LayoutFoundation.create({ top: 0, bottom: 0, left: 0, right: 0 }),
            padding: index_1.LayoutFoundation.create({ top: 0, bottom: 0, left: 0, right: 0 })
        });
    }
    return index_1.TableCell.create({ tableCellProperties: cs, columnSpan: 1, elements: [] });
}
function insertFieldComponent(doc, xmlWriter, fc) {
    switch (fc.fieldType) {
        case "Date":
            insertDateComponent(doc, xmlWriter, fc);
            break;
        case "PageNumber":
            xmlWriter.WriteStartElement("r", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            var style = index_1.TextField.getEffectiveStyle(doc.styles, fc).textProperties;
            insertRunProperty(xmlWriter, style);
            xmlWriter.WriteElementString("pgNum", "", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
            xmlWriter.WriteEndElement();
            break;
        default:
            throw new Error("Field type '" + fc.fieldType + "' has not been implemented in printer");
    }
}
function addBordersToCell(xmlWriter, borderdef, borderLocation) {
    xmlWriter.WriteStartElement(borderLocation, DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("val", "single", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("sz", (borderdef * DocxConstants.PointOoXmlFactor).toString(), DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("space", "0", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("color", "000000", DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
}
function insertJc(xmlWriter, ta) {
    xmlWriter.WriteStartElement("jc", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    if (ta == "Center")
        xmlWriter.WriteAttributeString("val", "center", DocxConstants.WordNamespace);
    else if (ta == "Start")
        xmlWriter.WriteAttributeString("val", "left", DocxConstants.WordNamespace);
    else if (ta == "End")
        xmlWriter.WriteAttributeString("val", "right", DocxConstants.WordNamespace);
    else
        xmlWriter.WriteAttributeString("val", "left", DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
}
function insertRunProperty(xmlWriter, textProperties) {
    xmlWriter.WriteStartElement("rPr", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    if (textProperties.subScript || textProperties.superScript) {
        xmlWriter.WriteStartElement("vertAlign", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
        xmlWriter.WriteAttributeString("val", textProperties.subScript ? "subscript" : "superscript", DocxConstants.WordNamespace);
        xmlWriter.WriteEndElement();
    }
    xmlWriter.WriteStartElement("rFonts", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("ascii", "Arial", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("hAnsi", "Arial", DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("sz", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("val", ((((textProperties.fontSize) + 0.5)) * 2).toString(), DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("szCs", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("val", ((((textProperties.fontSize) + 0.5)) * 2).toString(), DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("color", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("val", textProperties.color != null ? textProperties.color.replace("#", "").substring(0, 6) : "000000", DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("noProof", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("val", "true", DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
    if (textProperties.bold) {
        xmlWriter.WriteElementString("b", "", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
        xmlWriter.WriteElementString("bCs", "", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    }
    if (textProperties.italic) {
        xmlWriter.WriteElementString("i", "", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
        xmlWriter.WriteElementString("iCs", "", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    }
    if (textProperties.underline) {
        xmlWriter.WriteStartElement("u", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
        xmlWriter.WriteAttributeString("val", "single", DocxConstants.WordNamespace);
        xmlWriter.WriteEndElement();
    }
    xmlWriter.WriteStartElement("lang", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteAttributeString("eastAsia", "en-US", DocxConstants.WordNamespace);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
}
function insertImage(xmlWriter, rid, width, height) {
    xmlWriter.WriteStartElement("pict", DocxConstants.WordNamespace, DocxConstants.WordPrefix);
    xmlWriter.WriteStartElement("shapetype", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("coordsize", "21600,21600");
    xmlWriter.WriteAttributeString("spt", "75", DocxConstants.OfficeNamespace, DocxConstants.OfficePrefix);
    xmlWriter.WriteAttributeString("preferrelative", "t", DocxConstants.OfficeNamespace, DocxConstants.OfficePrefix);
    xmlWriter.WriteAttributeString("path", "m@4@5l@4@11@9@11@9@5xe");
    xmlWriter.WriteAttributeString("filled", "f");
    xmlWriter.WriteAttributeString("stroked", "f");
    xmlWriter.WriteStartElement("stroke", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("joinstyle", "miter");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("formulas", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteStartElement("f", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("eqn", "if lineDrawn pixelLineWidth 0");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("f", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("eqn", "sum @0 1 0");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("f", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("eqn", "sum 0 0 @1");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("f", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("eqn", "prod @2 1 2");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("f", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("eqn", "prod @3 21600 pixelWidth");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("f", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("eqn", "prod @3 21600 pixelHeight");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("f", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("eqn", "sum @0 0 1");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("f", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("eqn", "prod @6 1 2");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("f", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("eqn", "prod @7 21600 pixelWidth");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("f", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("eqn", "sum @8 21600 0");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("f", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("eqn", "prod @7 21600 pixelHeight");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("f", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("eqn", "sum @10 21600 0");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("path", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("extrusionok", "f", DocxConstants.OfficeNamespace, DocxConstants.OfficePrefix);
    xmlWriter.WriteAttributeString("gradientshapeok", "t");
    xmlWriter.WriteAttributeString("connecttype", "rect", DocxConstants.OfficeNamespace, DocxConstants.OfficePrefix);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("lock", DocxConstants.OfficeNamespace, DocxConstants.OfficePrefix);
    xmlWriter.WriteAttributeString("ext", "edit", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("aspectratio", "t");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement("shape", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("style", stringFormat(DocxConstants.ImageStyle, width.toFixed(2), height.toFixed(2)));
    xmlWriter.WriteStartElement("imagedata", DocxConstants.VmlNamespace, DocxConstants.VmlPrefix);
    xmlWriter.WriteAttributeString("id", rid, DocxConstants.RelNamespace, DocxConstants.RelPrefix);
    xmlWriter.WriteAttributeString("title", "", DocxConstants.OfficeNamespace, DocxConstants.OfficePrefix);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
}
function stringFormat(s) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    var result = s;
    for (var i = 0; i < rest.length; i++) {
        result = result.replace("{" + i + "}", rest[i]);
    }
    return result;
}
function insertDocumentContentType(filename, contentType, contentTypesDoc) {
    contentTypesDoc.XMLWriter.WriteStartElement("Override");
    filename = filename.replace("\\", "/");
    if (filename.startsWith("/") == false)
        filename = "/" + filename;
    contentTypesDoc.XMLWriter.WriteAttributeString("PartName", filename);
    contentTypesDoc.XMLWriter.WriteAttributeString("ContentType", contentType);
    contentTypesDoc.XMLWriter.WriteEndElement();
}
function insertImageContentType(extension, mimeType, contentTypesDoc) {
    contentTypesDoc.XMLWriter.WriteStartElement("Default");
    contentTypesDoc.XMLWriter.WriteAttributeString("Extension", extension);
    contentTypesDoc.XMLWriter.WriteAttributeString("ContentType", mimeType);
    contentTypesDoc.XMLWriter.WriteEndElement();
}
function insertDefaultContentTypes(contentTypesDoc) {
    contentTypesDoc.XMLWriter.WriteStartElement("Default");
    contentTypesDoc.XMLWriter.WriteAttributeString("Extension", "xml");
    contentTypesDoc.XMLWriter.WriteAttributeString("ContentType", DocxConstants.MainContentType);
    contentTypesDoc.XMLWriter.WriteEndElement();
    contentTypesDoc.XMLWriter.WriteStartElement("Default");
    contentTypesDoc.XMLWriter.WriteAttributeString("Extension", "rels");
    contentTypesDoc.XMLWriter.WriteAttributeString("ContentType", DocxConstants.RelationContentType);
    contentTypesDoc.XMLWriter.WriteEndElement();
}
function getMimeType(format) {
    switch (format.toLowerCase()) {
        case "gif":
            return "image/gif";
        case "jpeg":
        case "jpg":
            return "image/jpeg";
        case "png":
            return "image/png";
        case "bmp":
            return "image/bmp";
        default:
            throw new Error("Unknown ImageType");
    }
}
function addHeadRef(zip) {
    var contents = DocxConstants.HeadRelXml;
    addXmlStringToArchive(zip, DocxConstants.RefPath + ".rels", contents);
}
function addDocumentToArchive(zip, docToAdd, contentTypesDoc, insertContentType) {
    var docToAddFullPath = docToAdd.filePath + docToAdd.fileName;
    addXmlStringToArchive(zip, docToAddFullPath, docToAdd.XMLWriter.getXml());
    if (docToAdd.references.count > 0) {
        docToAdd.references.finish();
        addXmlStringToArchive(zip, docToAdd.filePath + DocxConstants.RefPath + docToAdd.fileName + ".rels", docToAdd.references.XMLWriter.getXml());
        docToAdd.references.XMLWriter.close();
    }
    docToAdd.XMLWriter.close();
    if (insertContentType) {
        insertDocumentContentType(docToAddFullPath, docToAdd.contentType, contentTypesDoc);
    }
}
function addXmlStringToArchive(zip, filePath, xml) {
    zip[filePath] = { type: "XmlString", xml: xml };
}
function addImageToArchive(zip, filePath, ms, renderScale, renderFormat) {
    zip[filePath] = { type: "AbstractImage", image: ms, renderScale: renderScale, renderFormat: renderFormat };
}
//# sourceMappingURL=docx-document-renderer.js.map