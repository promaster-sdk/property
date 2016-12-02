import {AbstractDoc} from "../../abstract-document/model/abstract-doc";
import {DocumentContainer} from "./document-container";
import * as Table from "../../abstract-document/model/section-elements/table";
import * as Paragraph from "../../abstract-document/model/section-elements/paragraph";
import * as DocxConstants from "./docx-constants";
import * as TextField from "../../abstract-document/model/atoms/text-field";
import * as TextRun from "../../abstract-document/model/atoms/text-run";
import * as TableCell from "../../abstract-document/model/table/table-cell";
import {KeepTogether} from "../../abstract-document/model/section-elements/keep-together";
import {SectionElement} from "../../abstract-document/model/section-elements/section-element";
import {Image} from "../../abstract-document/model/atoms/image";
import {MasterPage} from "../../abstract-document/model/page/master-page";
import {TextProperties} from "../../abstract-document/model/properties/text-properties";
import {Atom} from "../../abstract-document/model/atoms/atom";
import {TableCellProperties} from "../../abstract-document/model/properties/table-cell-properties";
import {TableCellPropertiesBuilder} from "../../abstract-document/model-builder/table-cell-properties-builder";
import {TextAlignment} from "../../abstract-document/model/enums/text-alignment";
import {NumberingFormat} from "../../abstract-document/model/numberings/numbering-format";
import {AbstractImage} from "../../abstract-image/abstract-image";
import * as Color from "../../abstract-image/color";
import {XmlWriter} from "./xml-writer";

export interface IZipService {
  CreateZipFile(zipFiles: Map<string, Uint8Array>): Uint8Array,
}

export interface ExportedImage<T> {
  output: T,
  format: string,
}
export interface AbstractImageExportFunc {
  <T>(format: string, image: AbstractImage, scale: number): ExportedImage<T>;
}

export class DocxDocumentRenderer //extends IDocumentRenderer
{
  private readonly _zipService: IZipService;
  private readonly _abstractImageExportFunc: AbstractImageExportFunc;

  private _imageContentTypesAdded: Array<any> = [];
  private readonly _imageHash: Map<string, any> = new Map<string, any>();

  private readonly _numberingDefinitionIdTranslation: Map<string, number> = new Map<string, number>();
  private readonly _numberingIdTranslation: Map<string, number> = new Map<string, number>();

  private _referenceId: number = 0;

  constructor(zipService: IZipService,
              abstractImageExportFunc: AbstractImageExportFunc) {
    this._zipService = zipService;
    this._abstractImageExportFunc = abstractImageExportFunc;
  }

  //    #region IDocumentRenderer Members

  public RenderDocument(doc: AbstractDoc): Uint8Array {
    const zipFiles = this.WriteResultToStream(doc);
    // Write the zip
    const zipBytes = this._zipService.CreateZipFile(zipFiles);
    return zipBytes;
  }

  //    #endregion

  private WriteResultToStream(abstractDoc: AbstractDoc): Map<string, Uint8Array> {

    this._imageContentTypesAdded = [];
    this._imageHash.clear();

    const zipFiles = new Map<string, Uint8Array>();

    const contentTypesDoc = new DocumentContainer();
    contentTypesDoc.filePath = DocxConstants.ContentTypesPath;
    contentTypesDoc.fileName = "[Content_Types].xml";
    contentTypesDoc.XMLWriter.WriteStartDocument();
    contentTypesDoc.XMLWriter.WriteStartElement("Types", DocxConstants.ContentTypeNamespace);

    const mainDoc = new DocumentContainer();
    mainDoc.filePath = DocxConstants.DocumentPath;
    mainDoc.fileName = "document.xml";
    mainDoc.contentType = DocxConstants.MainContentType;
    mainDoc.XMLWriter.WriteStartDocument(true);
    mainDoc.XMLWriter.WriteComment("This file represents a print");
    mainDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "document", DocxConstants.WordNamespace);
    mainDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "body", DocxConstants.WordNamespace);

    if (Object.keys(abstractDoc.numberings).length > 0) {
      const numberingDoc = new DocumentContainer();
      numberingDoc.filePath = DocxConstants.NumberingPath;
      numberingDoc.fileName = "numbering.xml";
      numberingDoc.contentType = DocxConstants.NumberingContentType;
      numberingDoc.XMLWriter.WriteStartDocument();
      numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "numbering", DocxConstants.WordNamespace);

      // <w:abstractNum>
      let wordNumberingDefinitionId: number = 1;
      for (const key of Object.keys(abstractDoc.numberingDefinitions)) {
        const numDef = abstractDoc.numberingDefinitions[key];
        numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "abstractNum", DocxConstants.WordNamespace);
        numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "abstractNumId", DocxConstants.WordNamespace,
          wordNumberingDefinitionId.toString());

        // <w:lvl>
        for (const numDefLevel of numDef.levels) {
          //<w:lvl w:ilvl="0" w:tplc="041D0019">
          //  <w:start w:val="1"/>
          //  <w:numFmt w:val="lowerLetter"/>
          //  <w:lvlText w:val="%1."/>
          //  <w:lvlJc w:val="left"/>
          //  <w:pPr>
          //    <w:ind w:left="1440" w:hanging="360"/>
          //  </w:pPr>
          //</w:lvl>
          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "lvl", DocxConstants.WordNamespace);
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "ilvl", DocxConstants.WordNamespace,
            numDefLevel.level.toString());
          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "start", DocxConstants.WordNamespace);
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "val", DocxConstants.WordNamespace,
            numDefLevel.start.toString());
          numberingDoc.XMLWriter.WriteEndElement();
          const numFmt = DocxDocumentRenderer.ConvertNumFormat(numDefLevel.format);
          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "numFmt", DocxConstants.WordNamespace);
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "val", DocxConstants.WordNamespace,
            numFmt);
          numberingDoc.XMLWriter.WriteEndElement();
          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "lvlText", DocxConstants.WordNamespace);
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "val", DocxConstants.WordNamespace, numDefLevel.levelText);
          numberingDoc.XMLWriter.WriteEndElement();

          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "lvlJc", DocxConstants.WordNamespace);
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "val", DocxConstants.WordNamespace, "left");
          numberingDoc.XMLWriter.WriteEndElement();

          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "pPr", DocxConstants.WordNamespace);
          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "ind", DocxConstants.WordNamespace);
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "left", DocxConstants.WordNamespace,
            numDefLevel.levelIndention.twips.toString());
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "hanging", DocxConstants.WordNamespace, "800");
          numberingDoc.XMLWriter.WriteEndElement();
          numberingDoc.XMLWriter.WriteEndElement();

          //<w:rPr>
          //var effectiveStyle = numDefLevel.GetEffectiveTextStyle(abstractDoc.Styles);
          const textProperties = numDefLevel.textProperties;
          if (textProperties != null) {
            numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "rPr", DocxConstants.WordNamespace);
            //  <w:b/>
            if (textProperties.bold)
              numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "b", DocxConstants.WordNamespace);
            numberingDoc.XMLWriter.WriteEndElement();
            numberingDoc.XMLWriter.WriteEndElement();
            // TODO: Support more of the TextStyle...
          }

          numberingDoc.XMLWriter.WriteEndElement();
        }
        this._numberingDefinitionIdTranslation.set(key, wordNumberingDefinitionId++);
      }

      numberingDoc.XMLWriter.WriteEndElement(); // abstractNum

      let wordNumberingId: number = 1;
      for (const key of Object.keys(abstractDoc.numberings)) {
        const value = abstractDoc.numberings[key];
        numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "num", DocxConstants.WordNamespace);
        numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "numId", DocxConstants.WordNamespace,
          wordNumberingId.toString());
        numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "abstractNumId",
          DocxConstants.WordNamespace);
        const wordDefinitionId = this._numberingDefinitionIdTranslation.get(value.definitionId) as number;
        numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "val", DocxConstants.WordNamespace,
          wordDefinitionId.toString());
        numberingDoc.XMLWriter.WriteEndElement();
        numberingDoc.XMLWriter.WriteEndElement();
        this._numberingIdTranslation.set(key, wordNumberingId++);
      }
      numberingDoc.XMLWriter.WriteEndElement();
      const refid = this.GetNewReferenceId();
      mainDoc.references.AddReference(refid, numberingDoc.filePath + numberingDoc.fileName,
        DocxConstants.NumberingNamespace);
      //mainDoc.references.AddReference2("rId1",  numberingDoc.FileName, DocxConstants.NumberingNamespace);

      DocxDocumentRenderer.AddDocumentToArchive(zipFiles, numberingDoc, contentTypesDoc, true);
    }


    //<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    //<w:numbering xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 wp14">
    //  <w:abstractNum w:abstractNumId="0">
    //    <w:nsid w:val="00283020"/>
    //    <w:multiLevelType w:val="hybridMultilevel"/>
    //    <w:tmpl w:val="D6702D88"/>
    //    <w:lvl w:ilvl="0" w:tplc="041D0019">
    //      <w:start w:val="1"/>
    //      <w:numFmt w:val="lowerLetter"/>
    //      <w:lvlText w:val="%1."/>
    //      <w:lvlJc w:val="left"/>
    //      <w:pPr>
    //        <w:ind w:left="1440" w:hanging="360"/>
    //      </w:pPr>
    //    </w:lvl>
    //    <w:lvl w:ilvl="1" w:tplc="041D0019">
    //      <w:start w:val="1"/>
    //      <w:numFmt w:val="lowerLetter"/>
    //      <w:lvlText w:val="%2."/>
    //      <w:lvlJc w:val="left"/>
    //      <w:pPr>
    //        <w:ind w:left="2160" w:hanging="360"/>
    //      </w:pPr>
    //    </w:lvl>
    //    <w:lvl w:ilvl="2" w:tplc="041D001B" w:tentative="1">
    //      <w:start w:val="1"/>
    //      <w:numFmt w:val="lowerRoman"/>
    //      <w:lvlText w:val="%3."/>
    //      <w:lvlJc w:val="right"/>
    //      <w:pPr>
    //        <w:ind w:left="2880" w:hanging="180"/>
    //      </w:pPr>
    //    </w:lvl>
    //  </w:abstractNum>
    //  <w:num w:numId="2">
    //    <w:abstractNumId w:val="0"/>
    //  </w:num>
    //</w:numbering>

    let lastMasterPage: MasterPage | null = null;
    let currentHeader: DocumentContainer | null = null;
    let lastHeader: DocumentContainer | null = null;
    let pages = 0;
    for (const section of abstractDoc.sections) {
      if (section.page.header != null && section.page.header.length > 0) {
        lastHeader = currentHeader;

        currentHeader = new DocumentContainer();
        const headerXmlWriter = currentHeader.XMLWriter;
        headerXmlWriter.WriteStartDocument(true);
        headerXmlWriter.WriteStartElement(DocxConstants.WordPrefix, "hdr", DocxConstants.WordNamespace);
        const header = section.page.header;
        for (const paragraph of header) {
          this.AddBaseParagraphDocX(abstractDoc, headerXmlWriter, zipFiles, currentHeader, contentTypesDoc, paragraph,
            false);
        }

        headerXmlWriter.WriteEndElement();

        const refid = this.GetNewReferenceId();
        currentHeader.refId = refid;
        currentHeader.filePath = DocxConstants.DocumentPath;
        currentHeader.fileName = "Header_" + refid + ".xml";
        currentHeader.contentType = DocxConstants.HeaderContentType;
        mainDoc.references.AddReference(refid, currentHeader.filePath + currentHeader.fileName,
          DocxConstants.HeaderNamespace);

        DocxDocumentRenderer.AddDocumentToArchive(zipFiles, currentHeader, contentTypesDoc, true);
      }
      else {
        lastHeader = currentHeader;

        currentHeader = new DocumentContainer();
        const headerXmlWriter = currentHeader.XMLWriter;
        headerXmlWriter.WriteStartDocument(true);

        headerXmlWriter.WriteStartElement(DocxConstants.WordPrefix, "hdr", DocxConstants.WordNamespace);
        headerXmlWriter.WriteEndElement();

        const refid = this.GetNewReferenceId();
        currentHeader.refId = refid;
        currentHeader.filePath = DocxConstants.DocumentPath;
        currentHeader.fileName = "Header_" + refid + ".xml";
        currentHeader.contentType = DocxConstants.HeaderContentType;
        mainDoc.references.AddReference(refid, currentHeader.filePath + currentHeader.fileName,
          DocxConstants.HeaderNamespace);

        DocxDocumentRenderer.AddDocumentToArchive(zipFiles, currentHeader, contentTypesDoc, true);
      }

      if (lastMasterPage != null) {
        DocxDocumentRenderer.InsertPageSettingsParagraph(mainDoc.XMLWriter, lastMasterPage, lastHeader as DocumentContainer);
        pages++;
      }

      lastMasterPage = section.page;

      for (const paragraph of section.sectionElements)
        this.AddBaseParagraphDocX(abstractDoc, mainDoc.XMLWriter, zipFiles, mainDoc, contentTypesDoc, paragraph, false);
    }

    if (lastMasterPage != null) {
      lastHeader = currentHeader;
      DocxDocumentRenderer.InsertPageSettings(mainDoc.XMLWriter, lastMasterPage, lastHeader as DocumentContainer);
    }

    if (mainDoc.XMLWriter != null) {
      mainDoc.XMLWriter.WriteEndElement();
      mainDoc.XMLWriter.WriteEndElement();
      mainDoc.XMLWriter.Flush();
      DocxDocumentRenderer.AddDocumentToArchive(zipFiles, mainDoc, contentTypesDoc, false);
      DocxDocumentRenderer.AddSupportFilesContents(zipFiles, contentTypesDoc);
    }

    return zipFiles;
    // // Write the zip
    // const zipBytes = this._zipService.CreateZipFile(zipFiles);
    // resultStream.Write(zipBytes, 0, zipBytes.length);
  }

  private static ConvertNumFormat(format: NumberingFormat): string {
    let wordNumFmt: string = "decimal";
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

  private static AddSupportFilesContents(zip: Map<string, Uint8Array>, contentTypesDoc: DocumentContainer): void {
    DocxDocumentRenderer.AddHeadRef(zip);
    DocxDocumentRenderer.AddContentTypes(zip, contentTypesDoc);
  }

  private static AddContentTypes(zip: Map<string, Uint8Array>, contentTypesDoc: DocumentContainer): void {
    DocxDocumentRenderer.InsertDefaultContentTypes(contentTypesDoc);
    contentTypesDoc.XMLWriter.WriteEndElement(); //Avslutar types
    DocxDocumentRenderer.AddDocumentToArchive(zip, contentTypesDoc, contentTypesDoc, false);
  }

  private  AddBaseParagraphDocX(doc: AbstractDoc,
                                xmlWriter: XmlWriter,
                                zip: Map<string, Uint8Array>,
                                currentDocument: DocumentContainer,
                                contentTypesDoc: DocumentContainer,
                                newSectionElement: SectionElement,
                                inTable: boolean): void {
    const para = newSectionElement as Table.Table;
    if (para != null) {
      this.InsertTable(doc, xmlWriter, zip, currentDocument, contentTypesDoc, para);
      //Om man l�gger in en tabell i en tabell s� m�ste man l�gga till en tom paragraf under...
      if (inTable)
        DocxDocumentRenderer.InsertEmptyParagraph(xmlWriter);
      return;
    }
    const paragraph = newSectionElement as Paragraph.Paragraph;
    if (paragraph != null) {
      this.InsertParagraph(doc, xmlWriter, zip, currentDocument, contentTypesDoc, paragraph);
      return;
    }
    const keepTogether = newSectionElement as KeepTogether;
    if (keepTogether != null) {
      for (const sectionElement of keepTogether.sectionElements)
        this.AddBaseParagraphDocX(doc, xmlWriter, zip, currentDocument, contentTypesDoc, sectionElement, inTable);
      return;
    }
    if (newSectionElement == null) {
      DocxDocumentRenderer.InsertEmptyParagraph(xmlWriter);
      return;
    }
    throw new Error("The type has not been implemented in printer");
  }


  private  InsertImageComponent(xmlWriter: XmlWriter, zip: Map<string, Uint8Array>,
                                currentDocument: DocumentContainer, contentTypesDoc: DocumentContainer, image: Image): void {
    //if (imageElement.Picture != null)
    //{
    //  //L�gg till referens
    //  if (!_imageHash.ContainsKey(imageElement.Picture.Id.ToString()))
    //    AddImageReference(zip, contentTypesDoc, imageElement);

    //  //L�gg till bilden i dokumentet
    //  var rid = _imageHash[imageElement.Picture.Id.ToString()].ToString();

    //  //Beh�ver komma �t dokumentet som bilden tillh�r
    //  var filePath = DocxConstants.ImagePath + "image_" + rid + "." + imageElement.Picture.GetFileExtension();
    //  currentDocument.references.AddReference(rid, filePath, DocxConstants.ImageNamespace);

    //  //L�gg till i MainPart
    //  //L�gg till bilden i en run
    //  xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
    //  InsertImage(xmlWriter, rid, Math.Round(imageElement.Width, 2), Math.Round(imageElement.Height, 2));
    //  xmlWriter.WriteEndElement();

    //}
    //else
    //{
    // Render the image
    // const renderer = this._abstractImageExporterFactory.Create<byte[]>("PNG");
    // const renderedImage = renderer.Render(image.imageResource.abstractImage,
    //   image.imageResource.renderScale);

    const renderedImage = this._abstractImageExportFunc("PNG", image.imageResource.abstractImage,
      image.imageResource.renderScale);

    // Lägg till referens
    if (!this._imageHash.has(image.imageResource.id.toString()))
      this.AddImageReference2(zip, contentTypesDoc, image, renderedImage as ExportedImage<Uint8Array>);

    //Lägg till bilden i dokumentet
    const rid = this._imageHash.get(image.imageResource.id.toString()).toString();

    //Behöver komma åt dokumentet som bilden tillhör
    const filePath = DocxConstants.ImagePath + "image_" + rid + "." + renderedImage.format;
    currentDocument.references.AddReference(rid, filePath, DocxConstants.ImageNamespace);

    //Lägg till i MainPart
    //Lägg till bilden i en run
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
    DocxDocumentRenderer.InsertImage(xmlWriter, rid, image.width, image.height);
    xmlWriter.WriteEndElement();
    //}
  }

  private static InsertPageSettingsParagraph(xmlWriter: XmlWriter, ps: MasterPage, lastHeader: DocumentContainer): void {
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "p", DocxConstants.WordNamespace);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pPr", DocxConstants.WordNamespace);
    DocxDocumentRenderer.InsertPageSettings(xmlWriter, ps, lastHeader);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
  }

  private static InsertPageSettings(xmlWriter: XmlWriter, ps: MasterPage, lastHeader: DocumentContainer): void {
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "sectPr", DocxConstants.WordNamespace);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "footnotePr", DocxConstants.WordNamespace);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pos", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "val", DocxConstants.WordNamespace, "beneathText");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    if (lastHeader != null) {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "headerReference", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "type", DocxConstants.WordNamespace, "default");
      xmlWriter.WriteAttributeString("id", DocxConstants.RelNamespace, lastHeader.refId);
      xmlWriter.WriteEndElement();
    }
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pgSz", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "w", DocxConstants.WordNamespace,
      (ps.style.width * DocxConstants.PointOoXmlFactor).toString());
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "h", DocxConstants.WordNamespace,
      (ps.style.height * DocxConstants.PointOoXmlFactor).toString());
    if (ps.style.orientation == "Landscape")
      xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "orient", DocxConstants.WordNamespace, "landscape");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pgMar", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "top", DocxConstants.WordNamespace,
      ((ps.style.margins.top * DocxConstants.PointOoXmlFactor)).toString());
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "bottom", DocxConstants.WordNamespace,
      ((ps.style.margins.bottom * DocxConstants.PointOoXmlFactor)).toString());
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "left", DocxConstants.WordNamespace,
      ((ps.style.margins.left * DocxConstants.PointOoXmlFactor)).toString());
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "right", DocxConstants.WordNamespace,
      ((ps.style.margins.right * DocxConstants.PointOoXmlFactor)).toString());
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "footer", DocxConstants.WordNamespace, "100");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
  }

  private static InsertDateComponent(doc: AbstractDoc, xmlWriter: XmlWriter, tf: TextField.TextField): void {
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
    //var style = fc.GetEffectiveStyle(doc.Styles) ?? ps.TextProperties;
    const textProperties = TextField.getEffectiveStyle(doc.styles, tf).textProperties;

    DocxDocumentRenderer.InsertRunProperty(xmlWriter, textProperties);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "fldChar", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("fldCharType", DocxConstants.WordNamespace, "begin");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
    DocxDocumentRenderer.InsertRunProperty(xmlWriter, textProperties);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "instrText", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("xml", "space", "", "preserve");
    xmlWriter.WriteString(" DATE \\@YYYY/MM/DD ");
    //var fcText = new TextRun("{ DATE \\@YYYY/MM/DD }", tf.GetEffectiveStyle(doc.Styles));
    const fcText = TextRun.createTextRun("{ DATE \\@YYYY/MM/DD }", undefined, TextField.getEffectiveStyle(doc.styles, tf).textProperties);

    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
    DocxDocumentRenderer.InsertRunProperty(xmlWriter, textProperties);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "fldChar", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("fldCharType", DocxConstants.WordNamespace, "separate");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    const effectiveStyle = TextField.getEffectiveStyle(doc.styles, tf);
    DocxDocumentRenderer.InsertTextComponent(/*doc,*/ xmlWriter, fcText, effectiveStyle.textProperties);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
    DocxDocumentRenderer.InsertRunProperty(xmlWriter, textProperties);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "fldChar", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("fldCharType", DocxConstants.WordNamespace, "end");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
  }

  private static InsertFieldComponent(doc: AbstractDoc, xmlWriter: XmlWriter, fc: TextField.TextField): void {
    switch (fc.fieldType) {
      case "Date":
        DocxDocumentRenderer.InsertDateComponent(doc, xmlWriter, fc);
        break;
      case "PageNumber":
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
        //var style = fc.GetEffectiveStyle(doc.Styles) ?? ps.TextProperties;
        const style = TextField.getEffectiveStyle(doc.styles, fc).textProperties;
        DocxDocumentRenderer.InsertRunProperty(xmlWriter, style);
        xmlWriter.WriteElementString(DocxConstants.WordPrefix, "pgNum", DocxConstants.WordNamespace, "");
        xmlWriter.WriteEndElement();
        break;
      default:
        throw new Error("Field type has not been implemented in printer");
    }
  }

  private static InsertTextComponent(/*doc: AbstractDoc, */xmlWriter: XmlWriter, tr: TextRun.TextRun, textProperties: TextProperties): void {
    //var effectiveStyle = tc.GetEffectiveStyle(doc.Styles);
    DocxDocumentRenderer.InsertText(xmlWriter, tr.text, textProperties);
  }

  private static InsertText(xmlWriter: XmlWriter, text: string, textProperties: TextProperties): void {
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);

    //var style = componentStyle ?? ps.TextProperties;
    //var style = textProperties.TextProperties;
    DocxDocumentRenderer.InsertRunProperty(xmlWriter, textProperties);

    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "t", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("xml", "space", "", "preserve");
    xmlWriter.WriteString(text);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
  }

  private  InsertComponent(doc: AbstractDoc, xmlWriter: XmlWriter, zip: Map<string, Uint8Array>,
                           currentDocument: DocumentContainer, contentTypesDoc: DocumentContainer, bc: Atom): void {
    const fc = bc as TextField.TextField;
    if (fc != null)
      DocxDocumentRenderer.InsertFieldComponent(doc, xmlWriter, fc);
    else {
      const tr = bc as TextRun.TextRun;
      if (tr != null) {
        const effectiveTextProps = TextRun.getEffectiveTextProperties(doc.styles, tr);
        DocxDocumentRenderer.InsertTextComponent(/*doc,*/ xmlWriter, tr, effectiveTextProps);
      }
      else {
        const im = bc as Image;
        if (im != null)
          this.InsertImageComponent(xmlWriter, zip, currentDocument, contentTypesDoc, im);
        else
          throw new Error("Contents of job is not implemented in printer");
      }
    }
  }

  private InsertParagraph(doc: AbstractDoc, xmlWriter: XmlWriter, zip: Map<string, Uint8Array>,
                          currentDocument: DocumentContainer, contentTypesDoc: DocumentContainer, para: Paragraph.Paragraph): void {

    const effectiveParaProps = Paragraph.getEffectiveParagraphProperties(doc.styles, para);

    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "p", DocxConstants.WordNamespace);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pPr", DocxConstants.WordNamespace);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "wordWrap", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "on");
    xmlWriter.WriteEndElement();

    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "spacing", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("before", DocxConstants.WordNamespace, effectiveParaProps.spacingBefore.twips().toString());
    xmlWriter.WriteAttributeString("after", DocxConstants.WordNamespace, effectiveParaProps.spacingAfter.twips().toString());
    xmlWriter.WriteEndElement();

    if (para.numbering != null) {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "numPr", DocxConstants.WordNamespace);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "ilvl", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, para.numbering.level.toString());
      xmlWriter.WriteEndElement();
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "numId", DocxConstants.WordNamespace);
      const wordNumberingId = this.GetWordNumberingId(para.numbering.numberingId);
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, wordNumberingId.toString());
      xmlWriter.WriteEndElement();
      xmlWriter.WriteEndElement();
    }

    xmlWriter.WriteElementString(DocxConstants.WordPrefix, "keepLines", DocxConstants.WordNamespace, "");
    //var effectiveStyle = para.GetEffectiveStyle(doc.Styles);
    DocxDocumentRenderer.InsertJc(xmlWriter, effectiveParaProps.alignment);
    xmlWriter.WriteEndElement();

    for (const comp of para.atoms) {
      //InsertComponent(doc, xmlWriter, zip, currentDocument, contentTypesDoc, comp, para.GetEffectiveStyle(doc.Styles));
      this.InsertComponent(doc, xmlWriter, zip, currentDocument, contentTypesDoc, comp);
    }
    xmlWriter.WriteEndElement();
  }

  private GetWordNumberingId(numberingId: string): number {
    return this._numberingIdTranslation.get(numberingId) as number;
  }

  private static InsertEmptyParagraph(xmlWriter: XmlWriter): void {
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "p", DocxConstants.WordNamespace);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pPr", DocxConstants.WordNamespace);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "spacing", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("after", DocxConstants.WordNamespace, "0");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
  }

  private InsertTable(doc: AbstractDoc, xmlWriter: XmlWriter, zip: Map<string, Uint8Array>,
                      currentDocument: DocumentContainer,
                      contentTypesDoc: DocumentContainer, tPara: Table.Table): void {

    //var xml = doc.ToXml();

    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tbl", DocxConstants.WordNamespace);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tblPr", DocxConstants.WordNamespace);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tblW", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("w", DocxConstants.WordNamespace, "0");
    xmlWriter.WriteAttributeString("type", DocxConstants.WordNamespace, "auto");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tblLayout", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("type", DocxConstants.WordNamespace, "fixed");
    xmlWriter.WriteEndElement();

    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tblGrid", DocxConstants.WordNamespace);
    for (const w of tPara.columnWidths) {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "gridCol", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("w", DocxConstants.WordNamespace,
        ((w * DocxConstants.PointOoXmlFactor)).toString());
      xmlWriter.WriteEndElement();
    }
    xmlWriter.WriteEndElement();

    for (let r = 0; r <= Table.nrOfRows(tPara) - 1; r++) {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tr", DocxConstants.WordNamespace);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "trPr", DocxConstants.WordNamespace);

      if (!isNaN(tPara.rows[r].height)) {
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "trHeight", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
          ((tPara.rows[r].height * DocxConstants.PointOoXmlFactor)).toString());
        xmlWriter.WriteAttributeString("type", DocxConstants.WordNamespace, "atLeast");
        xmlWriter.WriteEndElement();
      }
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "cantSplit", DocxConstants.WordNamespace);
      xmlWriter.WriteEndElement();
      xmlWriter.WriteEndElement();

      let c = 0;
      let tc = 0;
      while (c < tPara.columnWidths.length) {
        //var ptc = tPara.GetCell(r, tc);
        let ptc = DocxDocumentRenderer.GetCell(/*doc,*/ tPara, r, tc) as TableCell.TableCell;
        let effectiveCellProps = TableCell.getEffectiveTableCellProperties(/*doc.styles,*/ tPara, ptc);

        // let effectiveTableProps = Table.getEffectiveTableProperties(doc.styles, tPara);

        //if (effectiveTableProps.BorderThickness.GetValueOrDefault(0) > double.Epsilon)
        //{
        //if (effectiveCellProps.Borders.Bottom == null)
        //  effectiveCellProps.Borders.Bottom = effectiveTableProps.BorderThickness;
        //if (effectiveCellProps.Borders.Top == null)
        //  effectiveCellProps.Borders.Top = effectiveTableProps.BorderThickness;
        //if (effectiveCellProps.Borders.Left == null)
        //  effectiveCellProps.Borders.Left = effectiveTableProps.BorderThickness;
        //if (effectiveCellProps.Borders.Right == null)
        //  effectiveCellProps.Borders.Right = effectiveTableProps.BorderThickness;
        //}

        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tc", DocxConstants.WordNamespace);
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tcPr", DocxConstants.WordNamespace);
        if (effectiveCellProps.background && effectiveCellProps.background.a > 0) {
          xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "shd", DocxConstants.WordNamespace);
          xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "clear");
          xmlWriter.WriteAttributeString("color", DocxConstants.WordNamespace, "auto");
          xmlWriter.WriteAttributeString("fill", DocxConstants.WordNamespace,
            Color.toString6Hex(effectiveCellProps.background)
          );
          xmlWriter.WriteEndElement();
        }

        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "gridSpan", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
          ptc.columnSpan.toString());
        xmlWriter.WriteEndElement();
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tcBorders", DocxConstants.WordNamespace);
        if (effectiveCellProps.borders.bottom || 0 > 0)
          DocxDocumentRenderer.AddBordersToCell(xmlWriter, effectiveCellProps.borders.bottom as number, "bottom");
        if (effectiveCellProps.borders.left || 0 > 0)
          DocxDocumentRenderer.AddBordersToCell(xmlWriter, effectiveCellProps.borders.left as number, "left");
        if (effectiveCellProps.borders.top || 0 > 0)
          DocxDocumentRenderer.AddBordersToCell(xmlWriter, effectiveCellProps.borders.top as number, "top");
        if (effectiveCellProps.borders.right || 0 > 0)
          DocxDocumentRenderer.AddBordersToCell(xmlWriter, effectiveCellProps.borders.right as number, "right");
        xmlWriter.WriteEndElement();

        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tcMar", DocxConstants.WordNamespace);
        let mTop = 0;
        let mBottom = 0;
        let mLeft = 0;
        let mRight = 0;

        if (effectiveCellProps.padding.top)
          mTop = effectiveCellProps.padding.top;
        if (effectiveCellProps.padding.bottom)
          mBottom = effectiveCellProps.padding.bottom;
        if (effectiveCellProps.padding.left)
          mLeft = effectiveCellProps.padding.left;
        if (effectiveCellProps.padding.right)
          mRight = effectiveCellProps.padding.right;

        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "top", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("w", DocxConstants.WordNamespace, mTop.toString());
        xmlWriter.WriteAttributeString("type", DocxConstants.WordNamespace, "dxa");
        xmlWriter.WriteEndElement();
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "bottom", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("w", DocxConstants.WordNamespace,
          mBottom.toString());
        xmlWriter.WriteAttributeString("type", DocxConstants.WordNamespace, "dxa");
        xmlWriter.WriteEndElement();
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "right", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("w", DocxConstants.WordNamespace, mRight.toString());
        xmlWriter.WriteAttributeString("type", DocxConstants.WordNamespace, "dxa");
        xmlWriter.WriteEndElement();
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "left", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("w", DocxConstants.WordNamespace, mLeft.toString());
        xmlWriter.WriteAttributeString("type", DocxConstants.WordNamespace, "dxa");
        xmlWriter.WriteEndElement();
        xmlWriter.WriteEndElement();
        xmlWriter.WriteEndElement();

        if (ptc.elements.length == 0) {
          DocxDocumentRenderer.InsertEmptyParagraph(xmlWriter);
        }
        else {
          for (const bp of ptc.elements) {
            // TODO: Detta kan ge lite konstiga resultat om man har en tabell först och sedan text...
            // Borde kolla om det bara finns en och det är en tabell eller om det finns två men båra är tabeller osv.
            this.AddBaseParagraphDocX(doc, xmlWriter, zip, currentDocument, contentTypesDoc, bp, true);
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


  private static GetCell(/*abstractDoc: AbstractDoc,*/ table: Table.Table, r: number, c: number): TableCell.TableCell | null {

    if (r >= Table.nrOfRows(table))
      return null;

    const row = table.rows[r];
    if (c < row.cells.length)
      return row.cells[c];

    // Denna rad innehåller inte alla kolumner...
    // Kolla om något element i denna rad innehåller ett element
    let cs: TableCellProperties | undefined;
    for (const ptc of row.cells) {
      if (ptc == null)
        break;
      //if (ptc.GetEffectiveStyle() != null)
      cs = TableCell.getEffectiveTableCellProperties(/*abstractDoc.styles,*/ table, ptc);
    }
    if (!cs)
      cs = new TableCellPropertiesBuilder().build();
    return TableCell.createTableCell(undefined, cs, 1, []);
  }

  private static AddBordersToCell(xmlWriter: XmlWriter, borderdef: number, borderLocation: string): void {
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, borderLocation, DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "single");
    xmlWriter.WriteAttributeString("sz", DocxConstants.WordNamespace,
      (borderdef * DocxConstants.PointOoXmlFactor).toString());
    xmlWriter.WriteAttributeString("space", DocxConstants.WordNamespace, "0");
    xmlWriter.WriteAttributeString("color", DocxConstants.WordNamespace, "000000");
    xmlWriter.WriteEndElement();
  }

  private static InsertJc(xmlWriter: XmlWriter, ta: TextAlignment | undefined): void {
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "jc", DocxConstants.WordNamespace);
    if (ta == "Center")
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "center");
    else if (ta == "Start")
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "left");
    else if (ta == "End")
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "right");
    else
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "left");
    xmlWriter.WriteEndElement(); //jc
  }

  private static InsertRunProperty(xmlWriter: XmlWriter, textProperties: TextProperties): void {
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "rPr", DocxConstants.WordNamespace);
    if (textProperties.subScript || textProperties.superScript) {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "vertAlign", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
        textProperties.subScript ? "subscript" : "superscript");
      xmlWriter.WriteEndElement();
    }

    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "rFonts", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("ascii", DocxConstants.WordNamespace, "Arial");
    xmlWriter.WriteAttributeString("hAnsi", DocxConstants.WordNamespace, "Arial");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "sz", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
      ((((textProperties.fontSize) + 0.5)) * 2).toString());
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "szCs", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
      ((((textProperties.fontSize) + 0.5)) * 2).toString());
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "color", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
      textProperties.color != null ? textProperties.color.replace("#", "").substring(2, 6) : "000000");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "noProof", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "true");
    xmlWriter.WriteEndElement();
    if (textProperties.bold) {
      xmlWriter.WriteElementString(DocxConstants.WordPrefix, "b", DocxConstants.WordNamespace, "");
      xmlWriter.WriteElementString(DocxConstants.WordPrefix, "bCs", DocxConstants.WordNamespace, "");
    }
    if (textProperties.italic) {
      xmlWriter.WriteElementString(DocxConstants.WordPrefix, "i", DocxConstants.WordNamespace, "");
      xmlWriter.WriteElementString(DocxConstants.WordPrefix, "iCs", DocxConstants.WordNamespace, "");
    }
    if (textProperties.underline) {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "u", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "single");
      xmlWriter.WriteEndElement();
    }

    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "lang", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("eastAsia", DocxConstants.WordNamespace, "en-US");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
  }

  private static InsertImage(xmlWriter: XmlWriter, rid: string, width: number, height: number): void {
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pict", DocxConstants.WordNamespace);
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "shapetype", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString("coordsize", "21600,21600");
    xmlWriter.WriteAttributeString(DocxConstants.OfficePrefix, "spt", DocxConstants.OfficeNamespace, "75");
    xmlWriter.WriteAttributeString(DocxConstants.OfficePrefix, "preferrelative", DocxConstants.OfficeNamespace, "t");
    xmlWriter.WriteAttributeString("path", "m@4@5l@4@11@9@11@9@5xe");
    xmlWriter.WriteAttributeString("filled", "f");
    xmlWriter.WriteAttributeString("stroked", "f");
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "stroke", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString("joinstyle", "miter");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "formulas", DocxConstants.VmlNamespace);
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "f", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString("eqn", "if lineDrawn pixelLineWidth 0");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "f", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString("eqn", "sum @0 1 0");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "f", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString("eqn", "sum 0 0 @1");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "f", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString("eqn", "prod @2 1 2");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "f", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString("eqn", "prod @3 21600 pixelWidth");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "f", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString("eqn", "prod @3 21600 pixelHeight");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "f", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString("eqn", "sum @0 0 1");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "f", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString("eqn", "prod @6 1 2");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "f", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString("eqn", "prod @7 21600 pixelWidth");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "f", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString("eqn", "sum @8 21600 0");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "f", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString("eqn", "prod @7 21600 pixelHeight");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "f", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString("eqn", "sum @10 21600 0");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "path", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString(DocxConstants.OfficePrefix, "extrusionok", DocxConstants.OfficeNamespace, "f");
    xmlWriter.WriteAttributeString("gradientshapeok", "t");
    xmlWriter.WriteAttributeString(DocxConstants.OfficePrefix, "connecttype", DocxConstants.OfficeNamespace, "rect");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.OfficePrefix, "lock", DocxConstants.OfficeNamespace);
    xmlWriter.WriteAttributeString(DocxConstants.VmlPrefix, "ext", DocxConstants.VmlNamespace, "edit");
    xmlWriter.WriteAttributeString("aspectratio", "t");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();

    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "shape", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString("style",
      DocxDocumentRenderer.stringFormat(DocxConstants.ImageStyle, width.toFixed(2), height.toFixed(2))
    );
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "imagedata", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString(DocxConstants.RelPrefix, "id", DocxConstants.RelNamespace, rid);
    xmlWriter.WriteAttributeString(DocxConstants.OfficePrefix, "title", DocxConstants.OfficeNamespace, "");
    xmlWriter.WriteEndElement();

    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
  }

  private static stringFormat(s: string, ...rest: any[]): string {
    let result = s;
    for (let i = 0; i < rest.length; i++) {
      result = result.replace("{" + i + "}", rest[i]);
    }
    return result;
  }

  private static InsertDocumentContent(filename: string, contentType: string, contentTypesDoc: DocumentContainer): void {
    contentTypesDoc.XMLWriter.WriteStartElement("Override");
    filename = filename.replace("\\", "/");
    if (filename.startsWith("/") == false)
      filename = "/" + filename;
    contentTypesDoc.XMLWriter.WriteAttributeString("PartName", filename);
    contentTypesDoc.XMLWriter.WriteAttributeString("ContentType", contentType);
    contentTypesDoc.XMLWriter.WriteEndElement(); //Override
  }

  private static InsertImageContent(contentTypesDoc: DocumentContainer, extension: string, mimeType: string): void {
    contentTypesDoc.XMLWriter.WriteStartElement("Default");
    contentTypesDoc.XMLWriter.WriteAttributeString("Extension", extension);
    contentTypesDoc.XMLWriter.WriteAttributeString("ContentType", mimeType);
    contentTypesDoc.XMLWriter.WriteEndElement(); //Default
  }

  private static InsertDefaultContentTypes(contentTypesDoc: DocumentContainer): void {
    contentTypesDoc.XMLWriter.WriteStartElement("Default");
    contentTypesDoc.XMLWriter.WriteAttributeString("Extension", "xml");
    contentTypesDoc.XMLWriter.WriteAttributeString("ContentType", DocxConstants.MainContentType);
    contentTypesDoc.XMLWriter.WriteEndElement(); //Default
    contentTypesDoc.XMLWriter.WriteStartElement("Default");
    contentTypesDoc.XMLWriter.WriteAttributeString("Extension", "rels");
    contentTypesDoc.XMLWriter.WriteAttributeString("ContentType", DocxConstants.RelationContentType);
    contentTypesDoc.XMLWriter.WriteEndElement(); //Default
  }

  private AddImageReference2(zip: Map<string, Uint8Array>, contentTypesDoc: DocumentContainer,
                             image: Image, renderedImage: ExportedImage<Uint8Array>): void {
    const refId = this.GetNewReferenceId();
    const filePath = DocxConstants.ImagePath + "image_" + refId + "." + renderedImage.format;

    const mimeType = DocxDocumentRenderer.GetMimeType(renderedImage.format);
    if (this._imageContentTypesAdded.indexOf(mimeType) === -1) {
      DocxDocumentRenderer.InsertImageContent(contentTypesDoc, renderedImage.format, mimeType);
      this._imageContentTypesAdded.push(mimeType);
    }

    DocxDocumentRenderer.AddToArchive(zip, filePath, renderedImage.output);

    this._imageHash.set(image.imageResource.id.toString(), refId);
  }

  private static GetMimeType(format: string): string {
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

  private GetNewReferenceId(): string {
    this._referenceId += 1;
    return "rId" + this._referenceId;
  }

  private static AddHeadRef(zip: Map<string, Uint8Array>): void {

    // const headref = new MemoryStream();
    // const contents = Encoding.UTF8.GetBytes(DocxConstants.HeadRelXml);
    // headref.Write(contents, 0, contents.Length);
    //
    // DocxDocumentRenderer.AddToArchive(zip, DocxConstants.RefPath + ".rels", headref);
    // //headref.Close();
    // headref.Dispose();

    const contents = stringToUtf8ByteArray(DocxConstants.HeadRelXml);
    DocxDocumentRenderer.AddToArchive(zip, DocxConstants.RefPath + ".rels", contents);
  }

  private static AddToArchive(zip: Map<string, Uint8Array>, filePath: string, ms: Uint8Array): void {
    zip.set(filePath, ms);
  }

  private static AddDocumentToArchive(zip: Map<string, Uint8Array>, docToAdd: DocumentContainer,
                                      contentTypesDoc: DocumentContainer, insertContents: boolean): void {

    docToAdd.finish();
    DocxDocumentRenderer.AddToArchive(zip, docToAdd.filePath + docToAdd.fileName, docToAdd.memStream);
    if (insertContents)
      DocxDocumentRenderer.InsertDocumentContent(docToAdd.filePath + docToAdd.fileName, docToAdd.contentType, contentTypesDoc);
    if (docToAdd.references.count > 0) {
      docToAdd.references.finish();
      DocxDocumentRenderer.AddToArchive(zip, docToAdd.filePath + DocxConstants.RefPath + docToAdd.fileName + ".rels",
        docToAdd.references.memStream);
      docToAdd.references.close();
    }
    docToAdd.close();

  }

}