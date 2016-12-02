/*
import {AbstractDoc} from "../../abstract-document/model/abstract-doc";
import {DocumentContainer} from "./document-container";
import {XmlWriter, MemoryStream} from "./xml-container";
import {Table} from "../../abstract-document/model/section-elements/table";
import {KeepTogether} from "../../abstract-document/model/section-elements/keep-together";
import {Paragraph} from "../../abstract-document/model/section-elements/paragraph";
import {SectionElement} from "../../abstract-document/model/section-elements/section-element";
import {Image} from "../../abstract-document/model/atoms/image";
import {MasterPage} from "../../abstract-document/model/page/master-page";
import {PageOrientation} from "../../abstract-document/model/enums/page-orientation";
import * as DocxConstants from "./docx-constants";
import {TextField} from "../../abstract-document/model/atoms/text-field";
import {createTextRun, TextRun} from "../../abstract-document/model/atoms/text-run";
import {FieldType} from "../../abstract-document/model/enums/field-type";
import {TextProperties} from "../../abstract-document/model/properties/text-properties";
import {Atom} from "../../abstract-document/model/atoms/atom";
import {TableCellProperties} from "../../abstract-document/model/properties/table-cell-properties";
import {TableCell, createTableCell} from "../../abstract-document/model/table/table-cell";
import {TableCellPropertiesBuilder} from "../../abstract-document/model-builder/table-cell-properties-builder";
import {TextAlignment} from "../../abstract-document/model/enums/text-alignment";
import {NumberingFormat} from "../../abstract-document/model/numberings/numbering-format";

export interface ILogWriter {
}
export interface IAbstractImageExporterFactory {
}
export interface IZipService {
  CreateZipFile(zipFiles: Map<string, Uint8Array>): void,
}
export interface Stream {
}

export class DocxDocumentRenderer //extends IDocumentRenderer
{
  private static readonly LogCategory: string = "typeof(DocxDocumentRenderer).Name";

  private readonly _logWriter: ILogWriter;
  private readonly _zipService: ILogWriter;
  private readonly _abstractImageExporterFactory: IAbstractImageExporterFactory;

  private readonly _imageContentTypesAdded: Array<any> = [];
  private readonly _imageHash: Map<string, any> = new Map<string, any>();

  private readonly _numberingDefinitionIdTranslation: Map<string, number> = new Map<string, number>();
  private readonly _numberingIdTranslation: Map<string, number> = new Map<string, number>();

  private _referenceId: number = 0;

  constructor(logWriter: ILogWriter, zipService: IZipService,
              abstractImageExporterFactory: IAbstractImageExporterFactory) {
    this._logWriter = logWriter;
    this._zipService = zipService;
    this._abstractImageExporterFactory = abstractImageExporterFactory;
  }

  //    #region IDocumentRenderer Members

  public RenderDocumentToStreamAsync(doc: AbstractDoc, outputStream: Stream): Promise<any> {
    this.WriteResultToStream(doc, outputStream);
    return TaskEx.FromResult<object>(null);
  }


  //    #endregion

  private WriteResultToStream(abstractDoc: AbstractDoc, resultStream: Stream): void {
    this._imageContentTypesAdded.Clear();
    this._imageHash.Clear();

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

    if (abstractDoc.numberings.Count > 0) {
      const numberingDoc = new DocumentContainer();
      numberingDoc.filePath = DocxConstants.NumberingPath;
      numberingDoc.fileName = "numbering.xml";
      numberingDoc.contentType = DocxConstants.NumberingContentType;
      numberingDoc.XMLWriter.WriteStartDocument();
      numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "numbering", DocxConstants.WordNamespace);

      // <w:abstractNum>
      let wordNumberingDefinitionId: number = 1;
      for (const kvp of abstractDoc.numberingDefinitions) {
        const numDef = kvp.Value;
        numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "abstractNum", DocxConstants.WordNamespace);
        numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "abstractNumId", DocxConstants.WordNamespace, wordNumberingDefinitionId.ToString());

        // <w:lvl>
        for (const numDefLevel of numDef.Levels) {
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
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "ilvl", DocxConstants.WordNamespace, numDefLevel.Level.ToString());
          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "start", DocxConstants.WordNamespace);
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "val", DocxConstants.WordNamespace, numDefLevel.Start.ToString());
          numberingDoc.XMLWriter.WriteEndElement();
          const numFmt = ConvertNumFormat(numDefLevel.Format);
          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "numFmt", DocxConstants.WordNamespace);
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "val", DocxConstants.WordNamespace,
            numFmt);
          numberingDoc.XMLWriter.WriteEndElement();
          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "lvlText", DocxConstants.WordNamespace);
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "val", DocxConstants.WordNamespace, numDefLevel.LevelText);
          numberingDoc.XMLWriter.WriteEndElement();

          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "lvlJc", DocxConstants.WordNamespace);
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "val", DocxConstants.WordNamespace, "left");
          numberingDoc.XMLWriter.WriteEndElement();

          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "pPr", DocxConstants.WordNamespace);
          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "ind", DocxConstants.WordNamespace);
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "left", DocxConstants.WordNamespace, numDefLevel.LevelIndention.Twips().ToString());
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "hanging", DocxConstants.WordNamespace, "800");
          numberingDoc.XMLWriter.WriteEndElement();
          numberingDoc.XMLWriter.WriteEndElement();

          //<w:rPr>
          //var effectiveStyle = numDefLevel.GetEffectiveTextStyle(abstractDoc.Styles);
          const textProperties = numDefLevel.TextProperties;
          if (textProperties != null) {
            numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "rPr", DocxConstants.WordNamespace);
            //  <w:b/>
            if (textProperties.Bold.GetValueOrDefault(false) == true)
              numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "b", DocxConstants.WordNamespace);
            numberingDoc.XMLWriter.WriteEndElement();
            numberingDoc.XMLWriter.WriteEndElement();
            // TODO: Support more of the TextStyle...
          }

          numberingDoc.XMLWriter.WriteEndElement();
        }
        this._numberingDefinitionIdTranslation.set(kvp.Key, wordNumberingDefinitionId++);
      }

      numberingDoc.XMLWriter.WriteEndElement(); // abstractNum

      let wordNumberingId: number = 1;
      for (const kvp of abstractDoc.numberings) {
        numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "num", DocxConstants.WordNamespace);
        numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "numId", DocxConstants.WordNamespace,
          wordNumberingId.toString());
        numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "abstractNumId",
          DocxConstants.WordNamespace);
        const wordDefinitionId = this._numberingDefinitionIdTranslation.get(kvp.Value.DefinitionId);
        numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "val", DocxConstants.WordNamespace,
          wordDefinitionId.toString());
        numberingDoc.XMLWriter.WriteEndElement();
        numberingDoc.XMLWriter.WriteEndElement();
        this._numberingIdTranslation.Add(kvp.Key, wordNumberingId++);
      }
      numberingDoc.XMLWriter.WriteEndElement();
      const refid = this.GetNewReferenceId();
      mainDoc.References.AddReference(refid, numberingDoc.filePath + numberingDoc.fileName,
        DocxConstants.NumberingNamespace);
      //mainDoc.References.AddReference2("rId1",  numberingDoc.FileName, DocxConstants.NumberingNamespace);

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

        this.AddDocumentToArchive(zipFiles, currentHeader, contentTypesDoc, true);
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
        mainDoc.References.AddReference(refid, currentHeader.filePath + currentHeader.fileName,
          DocxConstants.HeaderNamespace);

        this.AddDocumentToArchive(zipFiles, currentHeader, contentTypesDoc, true);
      }

      if (lastMasterPage != null) {
        this.InsertPageSettingsParagraph(mainDoc.XMLWriter, lastMasterPage, lastHeader);
        pages++;
      }

      lastMasterPage = section.page;

      for (const paragraph of section.sectionElements)
        this.AddBaseParagraphDocX(abstractDoc, mainDoc.XMLWriter, zipFiles, mainDoc, contentTypesDoc, paragraph, false);
    }

    if (lastMasterPage != null) {
      lastHeader = currentHeader;
      this.InsertPageSettings(mainDoc.XMLWriter, lastMasterPage, lastHeader);
    }

    if (mainDoc.XMLWriter != null) {
      mainDoc.XMLWriter.WriteEndElement();
      mainDoc.XMLWriter.WriteEndElement();
      mainDoc.XMLWriter.Flush();
      this.AddDocumentToArchive(zipFiles, mainDoc, contentTypesDoc, false);
      this.AddSupportFilesContents(zipFiles, contentTypesDoc);
    }


    // Write the zip
    const zipStream = this._zipService.CreateZipFile(zipFiles);
    const zipBytes = zipStream.ToArray();
    resultStream.Write(zipBytes, 0, zipBytes.Length);
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

  private AddSupportFilesContents(zip: Map<string, Uint8Array>, contentTypesDoc: DocumentContainer): void {
    this.AddHeadRef(zip);
    this.AddContentTypes(zip, contentTypesDoc);
  }

  private AddContentTypes(zip: Map<string, Uint8Array>, contentTypesDoc: DocumentContainer): void {
    this.InsertDefaultContentTypes(contentTypesDoc);
    contentTypesDoc.XMLWriter.WriteEndElement(); //Avslutar types
    this.AddDocumentToArchive(zip, contentTypesDoc, contentTypesDoc, false);
  }

  private  AddBaseParagraphDocX(doc: AbstractDoc,
                                xmlWriter: XmlWriter,
                                zip: Map<string, Uint8Array>,
                                currentDocument: DocumentContainer,
                                contentTypesDoc: DocumentContainer,
                                newSectionElement: SectionElement,
                                inTable: boolean): void {
    const para = newSectionElement as Table;
    if (para != null) {
      this.InsertTable(doc, xmlWriter, zip, currentDocument, contentTypesDoc, para);
      //Om man l�gger in en tabell i en tabell s� m�ste man l�gga till en tom paragraf under...
      if (inTable)
        DocxDocumentRenderer.InsertEmptyParagraph(xmlWriter);
      return;
    }
    const paragraph = newSectionElement as Paragraph;
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
    //  currentDocument.References.AddReference(rid, filePath, DocxConstants.ImageNamespace);

    //  //L�gg till i MainPart
    //  //L�gg till bilden i en run
    //  xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
    //  InsertImage(xmlWriter, rid, Math.Round(imageElement.Width, 2), Math.Round(imageElement.Height, 2));
    //  xmlWriter.WriteEndElement();

    //}
    //else
    //{
    // Render the image
    const renderer = this._abstractImageExporterFactory.Create<byte[]>("PNG");
    const renderedImage = renderer.Render(image.imageResource.abstractImage,
      image.imageResource.renderScale);

    // L�gg till referens
    if (!this._imageHash.ContainsKey(image.imageResource.id.toString()))
      this.AddImageReference2(zip, contentTypesDoc, image, renderedImage);

    //L�gg till bilden i dokumentet
    const rid = this._imageHash.get(image.imageResource.id.toString()).toString();

    //Beh�ver komma �t dokumentet som bilden tillh�r
    const filePath = DocxConstants.ImagePath + "image_" + rid + "." + renderedImage.Format;
    currentDocument.References.AddReference(rid, filePath, DocxConstants.ImageNamespace);

    //L�gg till i MainPart
    //L�gg till bilden i en run
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
    this.InsertImage(xmlWriter, rid, Math.round(image.Width, 2), Math.Round(image.Height, 2));
    xmlWriter.WriteEndElement();
    //}
  }

  private InsertPageSettingsParagraph(xmlWriter: XmlWriter, ps: MasterPage, lastHeader: DocumentContainer): void {
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "p", DocxConstants.WordNamespace);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pPr", DocxConstants.WordNamespace);
    this.InsertPageSettings(xmlWriter, ps, lastHeader);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
  }

  private  InsertPageSettings(xmlWriter: XmlWriter, ps: MasterPage, lastHeader: DocumentContainer): void {
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "sectPr", DocxConstants.WordNamespace);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "footnotePr", DocxConstants.WordNamespace);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pos", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "val", DocxConstants.WordNamespace, "beneathText");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    if (lastHeader != null) {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "headerReference", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "type", DocxConstants.WordNamespace, "default");
      xmlWriter.WriteAttributeString("id", DocxConstants.RelNamespace, lastHeader.RefId);
      xmlWriter.WriteEndElement();
    }
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pgSz", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "w", DocxConstants.WordNamespace,
      Convert.ToString(ps.style.width * DocxConstants.PointOoXmlFactor));
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "h", DocxConstants.WordNamespace,
      Convert.ToString(ps.style.height * DocxConstants.PointOoXmlFactor));
    if (ps.style.orientation == PageOrientation.Landscape)
      xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "orient", DocxConstants.WordNamespace, "landscape");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pgMar", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "top", DocxConstants.WordNamespace,
      ((ps.style.margins.top * DocxConstants.PointOoXmlFactor)).ToString(CultureInfo.InvariantCulture));
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "bottom", DocxConstants.WordNamespace,
      ((ps.style.margins.bottom * DocxConstants.PointOoXmlFactor)).ToString(CultureInfo.InvariantCulture));
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "left", DocxConstants.WordNamespace,
      ((ps.style.margins.left * DocxConstants.PointOoXmlFactor)).ToString(CultureInfo.InvariantCulture));
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "right", DocxConstants.WordNamespace,
      ((ps.style.margins.right * DocxConstants.PointOoXmlFactor)).ToString(CultureInfo.InvariantCulture));
    xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "footer", DocxConstants.WordNamespace, "100");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
  }

  private  InsertDateComponent(doc: AbstractDoc, xmlWriter: XmlWriter, tf: TextField): void {
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
    //var style = fc.GetEffectiveStyle(doc.Styles) ?? ps.TextProperties;
    const textProperties = tf.GetEffectiveStyle(doc.Styles).TextProperties;

    this.InsertRunProperty(xmlWriter, textProperties);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "fldChar", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("fldCharType", DocxConstants.WordNamespace, "begin");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
    this.InsertRunProperty(xmlWriter, textProperties);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "instrText", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("xml", "space", "", "preserve");
    xmlWriter.WriteString(" DATE \\@YYYY/MM/DD ");
    //var fcText = new TextRun("{ DATE \\@YYYY/MM/DD }", tf.GetEffectiveStyle(doc.Styles));
    const fcText = createTextRun("{ DATE \\@YYYY/MM/DD }", null, tf.GetEffectiveStyle(doc.Styles).TextProperties);

    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
    this.InsertRunProperty(xmlWriter, textProperties);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "fldChar", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("fldCharType", DocxConstants.WordNamespace, "separate");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
    const effectiveStyle = tf.GetEffectiveStyle(doc.styles);
    this.InsertTextComponent(doc, xmlWriter, fcText, effectiveStyle.TextProperties);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
    this.InsertRunProperty(xmlWriter, textProperties);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "fldChar", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("fldCharType", DocxConstants.WordNamespace, "end");
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
  }

  private  InsertFieldComponent(doc: AbstractDoc, xmlWriter: XmlWriter, fc: TextField): void {
    switch (fc.type) {
      case FieldType.Date:
        this.InsertDateComponent(doc, xmlWriter, fc);
        break;
      case FieldType.PageNumber:
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
        //var style = fc.GetEffectiveStyle(doc.Styles) ?? ps.TextProperties;
        const style = fc.GetEffectiveStyle(doc.styles).TextProperties;
        this.InsertRunProperty(xmlWriter, style);
        xmlWriter.WriteElementString(DocxConstants.WordPrefix, "pgNum", DocxConstants.WordNamespace, "");
        xmlWriter.WriteEndElement();
        break;
      default:
        throw new Error("Field type has not been implemented in printer");
    }
  }

  private InsertTextComponent(doc: AbstractDoc, xmlWriter: XmlWriter, tr: TextRun, textProperties: TextProperties): void {
    //var effectiveStyle = tc.GetEffectiveStyle(doc.Styles);
    this.InsertText(xmlWriter, tr.text, textProperties);
  }

  private InsertText(xmlWriter: XmlWriter, text: string, textProperties: TextProperties): void {
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);

    //var style = componentStyle ?? ps.TextProperties;
    //var style = textProperties.TextProperties;
    this.InsertRunProperty(xmlWriter, textProperties);

    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "t", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("xml", "space", "", "preserve");
    xmlWriter.WriteString(text);
    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
  }

  private  InsertComponent(doc: AbstractDoc, xmlWriter: XmlWriter, zip: Map<string, Uint8Array>,
                           currentDocument: DocumentContainer, contentTypesDoc: DocumentContainer, bc: Atom): void {
    const fc = bc as TextField;
    if (fc != null)
      this.InsertFieldComponent(doc, xmlWriter, fc);
    else {
      const tr = bc as TextRun;
      if (tr != null) {
        const effectiveTextProps = tr.GetEffectiveTextProperties(doc.styles);
        this.InsertTextComponent(doc, xmlWriter, tr, effectiveTextProps);
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
                          currentDocument: DocumentContainer, contentTypesDoc: DocumentContainer, para: Paragraph): void {

    const effectiveParaProps = para.GetEffectiveParagraphProperties(doc.styles);

    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "p", DocxConstants.WordNamespace);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pPr", DocxConstants.WordNamespace);
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "wordWrap", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "on");
    xmlWriter.WriteEndElement();

    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "spacing", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("before", DocxConstants.WordNamespace, effectiveParaProps.SpacingBefore.Value.Twips().ToString());
    xmlWriter.WriteAttributeString("after", DocxConstants.WordNamespace, effectiveParaProps.SpacingAfter.Value.Twips().ToString());
    xmlWriter.WriteEndElement();

    if (para.numbering != null) {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "numPr", DocxConstants.WordNamespace);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "ilvl", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, para.numbering.level.toString());
      xmlWriter.WriteEndElement();
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "numId", DocxConstants.WordNamespace);
      const wordNumberingId = this.GetWordNumberingId(para.numbering.numberingId);
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, wordNumberingId.ToString());
      xmlWriter.WriteEndElement();
      xmlWriter.WriteEndElement();
    }

    xmlWriter.WriteElementString(DocxConstants.WordPrefix, "keepLines", DocxConstants.WordNamespace, "");
    //var effectiveStyle = para.GetEffectiveStyle(doc.Styles);
    this.InsertJc(xmlWriter, effectiveParaProps.Alignment.Value);
    xmlWriter.WriteEndElement();

    for (const comp of para.atoms) {
      //InsertComponent(doc, xmlWriter, zip, currentDocument, contentTypesDoc, comp, para.GetEffectiveStyle(doc.Styles));
      this.InsertComponent(doc, xmlWriter, zip, currentDocument, contentTypesDoc, comp);
    }
    xmlWriter.WriteEndElement();
  }

  private GetWordNumberingId(numberingId: string): number {
    return this._numberingIdTranslation.get(numberingId);
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
                      contentTypesDoc: DocumentContainer, tPara: Table): void {

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
        ((int)(w * DocxConstants.PointOoXmlFactor)).ToString(CultureInfo.InvariantCulture));
      xmlWriter.WriteEndElement();
    }
    xmlWriter.WriteEndElement();

    for (let r = 0; r <= tPara.NrOfRows - 1; r++) {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tr", DocxConstants.WordNamespace);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "trPr", DocxConstants.WordNamespace);

      if (!isNaN(tPara.rows[r].height)) {
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "trHeight", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
          (Convert.ToInt32(tPara.rows[r].height * DocxConstants.PointOoXmlFactor)).ToString(CultureInfo.InvariantCulture));
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
        let ptc = this.GetCell(doc, tPara, r, tc);
        let effectiveCellProps = ptc.GetEffectiveTableCellProperties(doc.styles, tPara);
        let effectiveTableProps = tPara.GetEffectiveTableProperties(doc.styles);
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
        if (effectiveCellProps.Background.HasValue && effectiveCellProps.Background.Value.A > 0) {
          xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "shd", DocxConstants.WordNamespace);
          xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "clear");
          xmlWriter.WriteAttributeString("color", DocxConstants.WordNamespace, "auto");
          xmlWriter.WriteAttributeString("fill", DocxConstants.WordNamespace,
            effectiveCellProps.Background.Value.ToString6Hex());
          xmlWriter.WriteEndElement();
        }

        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "gridSpan", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
          ptc.columnSpan.ToString(CultureInfo.InvariantCulture));
        xmlWriter.WriteEndElement();
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tcBorders", DocxConstants.WordNamespace);
        if (effectiveCellProps.Borders.Bottom.GetValueOrDefault(0) > 0)
          this.AddBordersToCell(xmlWriter, effectiveCellProps.Borders.Bottom.Value, "bottom");
        if (effectiveCellProps.Borders.Left.GetValueOrDefault(0) > 0)
          this.AddBordersToCell(xmlWriter, effectiveCellProps.Borders.Left.Value, "left");
        if (effectiveCellProps.Borders.Top.GetValueOrDefault(0) > 0)
          this.AddBordersToCell(xmlWriter, effectiveCellProps.Borders.Top.Value, "top");
        if (effectiveCellProps.Borders.Right.GetValueOrDefault(0) > 0)
          this.AddBordersToCell(xmlWriter, effectiveCellProps.Borders.Right.Value, "right");
        xmlWriter.WriteEndElement();

        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tcMar", DocxConstants.WordNamespace);
        let mTop = 0;
        let mBottom = 0;
        let mLeft = 0;
        let mRight = 0;

        if (effectiveCellProps.Padding.Top.HasValue)
          mTop = effectiveCellProps.Padding.Top;
        if (effectiveCellProps.Padding.Bottom.HasValue)
          mBottom = effectiveCellProps.Padding.Bottom;
        if (effectiveCellProps.Padding.Left.HasValue)
          mLeft = effectiveCellProps.Padding.Left;
        if (effectiveCellProps.Padding.Right.HasValue)
          mRight = effectiveCellProps.Padding.Right;

        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "top", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("w", DocxConstants.WordNamespace, mTop.toString(CultureInfo.InvariantCulture));
        xmlWriter.WriteAttributeString("type", DocxConstants.WordNamespace, "dxa");
        xmlWriter.WriteEndElement();
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "bottom", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("w", DocxConstants.WordNamespace,
          mBottom.toString(CultureInfo.InvariantCulture));
        xmlWriter.WriteAttributeString("type", DocxConstants.WordNamespace, "dxa");
        xmlWriter.WriteEndElement();
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "right", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("w", DocxConstants.WordNamespace, mRight.ToString(CultureInfo.InvariantCulture));
        xmlWriter.WriteAttributeString("type", DocxConstants.WordNamespace, "dxa");
        xmlWriter.WriteEndElement();
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "left", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("w", DocxConstants.WordNamespace, mLeft.ToString(CultureInfo.InvariantCulture));
        xmlWriter.WriteAttributeString("type", DocxConstants.WordNamespace, "dxa");
        xmlWriter.WriteEndElement();
        xmlWriter.WriteEndElement();
        xmlWriter.WriteEndElement();

        if (ptc.elements.length == 0) {
          DocxDocumentRenderer.InsertEmptyParagraph(xmlWriter);
        }
        else {
          for (const bp in ptc.elements) {
            //TODO: Detta kan ge lite konstiga resultat om man har en tabell f�rst och sedan text...
            //Borde kolla om det bara finns en och det �r en tabell eller om det finns tv� men b�ra �r tabeller osv.
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


  private static GetCell(abstractDoc: AbstractDoc, table: Table, r: number, c: number): TableCell | null {
    if (r >= table.NrOfRows)
      return null;

    const row = table.rows[r];
    if (c < row.cells.length)
      return row.cells[c];

    //Denna rad inneh�ller inte alla kolumner...
    //Kolla om n�got element i denna rad inneh�ller ett element
    let cs: TableCellProperties = null;
    for (const ptc of row.cells) {
      if (ptc == null)
        break;
      //if (ptc.GetEffectiveStyle() != null)
      cs = ptc.GetEffectiveTableCellProperties(abstractDoc.styles, table);
    }
    if (cs == null)
      cs = new TableCellPropertiesBuilder().build();
    return createTableCell(undefined, cs, 1, []);
  }

  private AddBordersToCell(xmlWriter: XmlWriter, borderdef: number, borderLocation: string): void {
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, borderLocation, DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "single");
    xmlWriter.WriteAttributeString("sz", DocxConstants.WordNamespace,
      (borderdef * DocxConstants.PointOoXmlFactor).ToString(CultureInfo.InvariantCulture));
    xmlWriter.WriteAttributeString("space", DocxConstants.WordNamespace, "0");
    xmlWriter.WriteAttributeString("color", DocxConstants.WordNamespace, "000000");
    xmlWriter.WriteEndElement();
  }

  private static InsertJc(xmlWriter: XmlWriter, ta: TextAlignment): void {
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

  private InsertRunProperty(xmlWriter: XmlWriter, textProperties: TextProperties): void {
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
      Convert.ToString((((textProperties.fontSize) + 0.5)) * 2));
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "szCs", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
      Convert.ToString((((textProperties.fontSize) + 0.5)) * 2));
    xmlWriter.WriteEndElement();
    xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "color", DocxConstants.WordNamespace);
    xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
      textProperties.Color != null ? textProperties.Color.Replace("#", "").Substring(2, 6) : "000000");
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

  private InsertImage(xmlWriter: XmlWriter, rid: string, width: number, height: number): void {
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
      string.Format(DocxConstants.ImageStyle, width.ToString(CultureInfo.InvariantCulture),
        height.ToString(CultureInfo.InvariantCulture)));
    xmlWriter.WriteStartElement(DocxConstants.VmlPrefix, "imagedata", DocxConstants.VmlNamespace);
    xmlWriter.WriteAttributeString(DocxConstants.RelPrefix, "id", DocxConstants.RelNamespace, rid);
    xmlWriter.WriteAttributeString(DocxConstants.OfficePrefix, "title", DocxConstants.OfficeNamespace, "");
    xmlWriter.WriteEndElement();

    xmlWriter.WriteEndElement();
    xmlWriter.WriteEndElement();
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
                             image: Image, renderedImage: RenderedImage<Uint8Array>): void {
    const refId = this.GetNewReferenceId();
    const filePath = DocxConstants.ImagePath + "image_" + refId + "." + renderedImage.Format;

    const mimeType = DocxDocumentRenderer.GetMimeType(renderedImage.Format);
    if (this._imageContentTypesAdded.indexOf(mimeType) === -1) {
      DocxDocumentRenderer.InsertImageContent(contentTypesDoc, renderedImage.Format, mimeType);
      this._imageContentTypesAdded.push(mimeType);
    }

    const stream = new MemoryStream(renderedImage.Output);

    this.AddToArchive(zip, filePath, stream);

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

  private AddHeadRef(zip: Map<string, Uint8Array>): void {
    const headref = new MemoryStream();
    const contents = Encoding.UTF8.GetBytes(DocxConstants.HeadRelXml);
    headref.Write(contents, 0, contents.Length);

    DocxDocumentRenderer.AddToArchive(zip, DocxConstants.RefPath + ".rels", headref);
    //headref.Close();
    headref.Dispose();
  }


  private static AddToArchive(zip: Map<string, Uint8Array>, filePath: string, ms: Stream): void {

    // ms.Flush();
    // ms.Position = 0;
    // var buffer = new byte[((int)ms.Length) - 1 + 1];
    // ms.Read(buffer, 0, buffer.Length);
    // zip.Add(filePath, buffer);

    throw new Error("TODO!!");

  }

  private static AddDocumentToArchive(zip: Map<string, Uint8Array>, docToAdd: DocumentContainer,
                               contentTypesDoc: DocumentContainer, insertContents: boolean): void {
    docToAdd.Finish();
    DocxDocumentRenderer.AddToArchive(zip, docToAdd.filePath + docToAdd.fileName, docToAdd.memStream);
    if (insertContents)
      DocxDocumentRenderer.InsertDocumentContent(docToAdd.filePath + docToAdd.fileName, docToAdd.contentType, contentTypesDoc);
    if (docToAdd.References.Count > 0) {
      docToAdd.References.Finish();
      DocxDocumentRenderer.AddToArchive(zip, docToAdd.filePath + DocxConstants.RefPath + docToAdd.fileName + ".rels",
        docToAdd.References.MemStream);
      docToAdd.References.Close();
    }
    docToAdd.Close();
  }

}
*/
