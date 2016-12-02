
  export class DocxDocumentRenderer //extends IDocumentRenderer
  {
  /*
    private static readonly string LogCategory = typeof(DocxDocumentRenderer).Name;

    private readonly ILogWriter _logWriter;
    private readonly IZipService _zipService;
    private readonly IAbstractImageExporterFactory _abstractImageExporterFactory;

    private readonly List<object> _imageContentTypesAdded = new List<object>();
    private readonly Dictionary<string, object> _imageHash = new Dictionary<string, object>();

    private readonly Dictionary<string, int> _numberingDefinitionIdTranslation = new Dictionary<string, int>();
    private readonly Dictionary<string, int> _numberingIdTranslation = new Dictionary<string, int>();

    private int _referenceId = 0;

    public DocxDocumentRenderer(ILogWriter logWriter, IZipService zipService,
      IAbstractImageExporterFactory abstractImageExporterFactory)
    {
      _logWriter = logWriter;
      _zipService = zipService;
      _abstractImageExporterFactory = abstractImageExporterFactory;
    }

//    #region IDocumentRenderer Members

    public Task RenderDocumentToStreamAsync(AbstractDoc doc, Stream outputStream)
    {
      WriteResultToStream(doc, outputStream);
      return TaskEx.FromResult<object>(null);
    }

//    #endregion

    private void WriteResultToStream(AbstractDoc abstractDoc, Stream resultStream)
    {
      _imageContentTypesAdded.Clear();
      _imageHash.Clear();

      var zipFiles = new SafeDictionary<string, byte[]>();

      var contentTypesDoc = new DocumentContainer();
      contentTypesDoc.FilePath = DocxConstants.ContentTypesPath;
      contentTypesDoc.FileName = "[Content_Types].xml";
      contentTypesDoc.XMLWriter.WriteStartDocument();
      contentTypesDoc.XMLWriter.WriteStartElement("Types", DocxConstants.ContentTypeNamespace);

      var mainDoc = new DocumentContainer();
      mainDoc.FilePath = DocxConstants.DocumentPath;
      mainDoc.FileName = "document.xml";
      mainDoc.ContentType = DocxConstants.MainContentType;
      mainDoc.XMLWriter.WriteStartDocument(true);
      mainDoc.XMLWriter.WriteComment("This file represents a print");
      mainDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "document", DocxConstants.WordNamespace);
      mainDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "body", DocxConstants.WordNamespace);

      if (abstractDoc.Numberings.Count > 0)
      {
        var numberingDoc = new DocumentContainer();
        numberingDoc.FilePath = DocxConstants.NumberingPath;
        numberingDoc.FileName = "numbering.xml";
        numberingDoc.ContentType = DocxConstants.NumberingContentType;
        numberingDoc.XMLWriter.WriteStartDocument();
        numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "numbering", DocxConstants.WordNamespace);

        // <w:abstractNum>
        int wordNumberingDefinitionId = 1;
        foreach (var kvp in abstractDoc.NumberingDefinitions)
        {
          var numDef = kvp.Value;
          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "abstractNum", DocxConstants.WordNamespace);
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "abstractNumId", DocxConstants.WordNamespace, wordNumberingDefinitionId.ToString());

          // <w:lvl>
          foreach (var numDefLevel in numDef.Levels)
          {
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
            var numFmt = ConvertNumFormat(numDefLevel.Format);
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
            var textProperties = numDefLevel.TextProperties;
            if (textProperties != null)
            {
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
          _numberingDefinitionIdTranslation.Add(kvp.Key, wordNumberingDefinitionId++);
        }

        numberingDoc.XMLWriter.WriteEndElement(); // abstractNum

        int wordNumberingId = 1;
        foreach (var kvp in abstractDoc.Numberings)
        {
          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "num", DocxConstants.WordNamespace);
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "numId", DocxConstants.WordNamespace,
            wordNumberingId.ToString());
          numberingDoc.XMLWriter.WriteStartElement(DocxConstants.WordPrefix, "abstractNumId",
            DocxConstants.WordNamespace);
          var wordDefinitionId = _numberingDefinitionIdTranslation[kvp.Value.DefinitionId];
          numberingDoc.XMLWriter.WriteAttributeString(DocxConstants.WordPrefix, "val", DocxConstants.WordNamespace,
            wordDefinitionId.ToString());
          numberingDoc.XMLWriter.WriteEndElement();
          numberingDoc.XMLWriter.WriteEndElement();
          _numberingIdTranslation.Add(kvp.Key, wordNumberingId++);
        }
        numberingDoc.XMLWriter.WriteEndElement();
        var refid = GetNewReferenceId();
        mainDoc.References.AddReference(refid, numberingDoc.FilePath + numberingDoc.FileName,
          DocxConstants.NumberingNamespace);
        //mainDoc.References.AddReference2("rId1",  numberingDoc.FileName, DocxConstants.NumberingNamespace);

        AddDocumentToArchive(zipFiles, numberingDoc, contentTypesDoc, true);
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

      MasterPage lastMasterPage = null;
      DocumentContainer currentHeader = null;
      DocumentContainer lastHeader = null;
      var pages = 0;
      foreach (var section in abstractDoc.Sections)
      {
        if (section.Page.Header != null && section.Page.Header.Count > 0)
        {
          lastHeader = currentHeader;

          currentHeader = new DocumentContainer();
          var headerXmlWriter = currentHeader.XMLWriter;
          headerXmlWriter.WriteStartDocument(true);
          headerXmlWriter.WriteStartElement(DocxConstants.WordPrefix, "hdr", DocxConstants.WordNamespace);
          var header = section.Page.Header;
          foreach (var paragraph in header)
          {
            AddBaseParagraphDocX(abstractDoc, headerXmlWriter, zipFiles, currentHeader, contentTypesDoc, paragraph,
              false);
          }

          headerXmlWriter.WriteEndElement();

          var refid = GetNewReferenceId();
          currentHeader.RefId = refid;
          currentHeader.FilePath = DocxConstants.DocumentPath;
          currentHeader.FileName = "Header_" + refid + ".xml";
          currentHeader.ContentType = DocxConstants.HeaderContentType;
          mainDoc.References.AddReference(refid, currentHeader.FilePath + currentHeader.FileName,
            DocxConstants.HeaderNamespace);

          AddDocumentToArchive(zipFiles, currentHeader, contentTypesDoc, true);
        }
        else
        {
          lastHeader = currentHeader;

          currentHeader = new DocumentContainer();
          var headerXmlWriter = currentHeader.XMLWriter;
          headerXmlWriter.WriteStartDocument(true);

          headerXmlWriter.WriteStartElement(DocxConstants.WordPrefix, "hdr", DocxConstants.WordNamespace);
          headerXmlWriter.WriteEndElement();

          var refid = GetNewReferenceId();
          currentHeader.RefId = refid;
          currentHeader.FilePath = DocxConstants.DocumentPath;
          currentHeader.FileName = "Header_" + refid + ".xml";
          currentHeader.ContentType = DocxConstants.HeaderContentType;
          mainDoc.References.AddReference(refid, currentHeader.FilePath + currentHeader.FileName,
            DocxConstants.HeaderNamespace);

          AddDocumentToArchive(zipFiles, currentHeader, contentTypesDoc, true);
        }

        if (lastMasterPage != null)
        {
          InsertPageSettingsParagraph(mainDoc.XMLWriter, lastMasterPage, lastHeader);
          pages++;
        }

        lastMasterPage = section.Page;

        foreach (var paragraph in section.SectionElements)
          AddBaseParagraphDocX(abstractDoc, mainDoc.XMLWriter, zipFiles, mainDoc, contentTypesDoc, paragraph, false);
      }

      if (lastMasterPage != null)
      {
        lastHeader = currentHeader;
        InsertPageSettings(mainDoc.XMLWriter, lastMasterPage, lastHeader);
      }

      if (mainDoc.XMLWriter != null)
      {
        mainDoc.XMLWriter.WriteEndElement();
        mainDoc.XMLWriter.WriteEndElement();
        mainDoc.XMLWriter.Flush();
        AddDocumentToArchive(zipFiles, mainDoc, contentTypesDoc, false);
        AddSupportFilesContents(zipFiles, contentTypesDoc);
      }


      // Write the zip
      var zipStream = _zipService.CreateZipFile(zipFiles);
      var zipBytes = zipStream.ToArray();
      resultStream.Write(zipBytes, 0, zipBytes.Length);
    }

    private static string ConvertNumFormat(NumberingFormat format)
    {
      string wordNumFmt = "decimal";
      switch (format)
      {
        case NumberingFormat.Decimal:
          wordNumFmt = "decimal";
          break;
        case NumberingFormat.DecimalZero:
          wordNumFmt = "decimalZero";
          break;
        case NumberingFormat.LowerLetter:
          wordNumFmt = "lowerLetter";
          break;
        case NumberingFormat.LowerRoman:
          wordNumFmt = "lowerRoman";
          break;
        case NumberingFormat.UpperLetter:
          wordNumFmt = "upperLetter";
          break;
        case NumberingFormat.UpperRoman:
          wordNumFmt = "upperRoman";
          break;
      }
      return wordNumFmt;
    }


    private void AddSupportFilesContents(SafeDictionary<string, byte[]> zip, DocumentContainer contentTypesDoc)
    {
      AddHeadRef(zip);
      AddContentTypes(zip, contentTypesDoc);
    }

    private void AddContentTypes(SafeDictionary<string, byte[]> zip, DocumentContainer contentTypesDoc)
    {
      InsertDefaultContentTypes(contentTypesDoc);
      contentTypesDoc.XMLWriter.WriteEndElement(); //Avslutar types
      AddDocumentToArchive(zip, contentTypesDoc, contentTypesDoc, false);
    }

    private void AddBaseParagraphDocX(AbstractDoc doc,
      XmlWriter xmlWriter,
      SafeDictionary<string, byte[]> zip,
      DocumentContainer currentDocument,
      DocumentContainer contentTypesDoc,
      ISectionElement newSectionElement,
      bool inTable)
    {
      var para = newSectionElement as Table;
      if (para != null)
      {
        InsertTable(doc, xmlWriter, zip, currentDocument, contentTypesDoc, para);
        //Om man l�gger in en tabell i en tabell s� m�ste man l�gga till en tom paragraf under...
        if (inTable)
          InsertEmptyParagraph(xmlWriter);
        return;
      }
      var paragraph = newSectionElement as Paragraph;
      if (paragraph != null)
      {
        InsertParagraph(doc, xmlWriter, zip, currentDocument, contentTypesDoc, paragraph);
        return;
      }
      var keepTogether = newSectionElement as KeepTogether;
      if (keepTogether != null)
      {
        foreach (var sectionElement in keepTogether.SectionElements)
          AddBaseParagraphDocX(doc, xmlWriter, zip, currentDocument, contentTypesDoc, sectionElement, inTable);
        return;
      }
      if (newSectionElement == null)
      {
        InsertEmptyParagraph(xmlWriter);
        return;
      }
      throw (new NotImplementedException("The type has not been implemented in printer"));
    }

    private void InsertImageComponent(XmlWriter xmlWriter, SafeDictionary<string, byte[]> zip,
      DocumentContainer currentDocument, DocumentContainer contentTypesDoc, Image image)
    {
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
      var renderer = _abstractImageExporterFactory.Create<byte[]>("PNG");
      var renderedImage = renderer.Render(image.ImageResource.AbstractImage,
        image.ImageResource.RenderScale);

      // L�gg till referens
      if (!_imageHash.ContainsKey(image.ImageResource.Id.ToString()))
        AddImageReference2(zip, contentTypesDoc, image, renderedImage);

      //L�gg till bilden i dokumentet
      var rid = _imageHash[image.ImageResource.Id.ToString()].ToString();

      //Beh�ver komma �t dokumentet som bilden tillh�r
      var filePath = DocxConstants.ImagePath + "image_" + rid + "." + renderedImage.Format;
      currentDocument.References.AddReference(rid, filePath, DocxConstants.ImageNamespace);

      //L�gg till i MainPart
      //L�gg till bilden i en run
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
      InsertImage(xmlWriter, rid, Math.Round(image.Width, 2), Math.Round(image.Height, 2));
      xmlWriter.WriteEndElement();
      //}
    }

    private void InsertPageSettingsParagraph(XmlWriter xmlWriter, MasterPage ps, DocumentContainer lastHeader)
    {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "p", DocxConstants.WordNamespace);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pPr", DocxConstants.WordNamespace);
      InsertPageSettings(xmlWriter, ps, lastHeader);
      xmlWriter.WriteEndElement();
      xmlWriter.WriteEndElement();
    }

    private void InsertPageSettings(XmlWriter xmlWriter, MasterPage ps, DocumentContainer lastHeader)
    {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "sectPr", DocxConstants.WordNamespace);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "footnotePr", DocxConstants.WordNamespace);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pos", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "val", DocxConstants.WordNamespace, "beneathText");
      xmlWriter.WriteEndElement();
      xmlWriter.WriteEndElement();
      if (lastHeader != null)
      {
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "headerReference", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "type", DocxConstants.WordNamespace, "default");
        xmlWriter.WriteAttributeString("id", DocxConstants.RelNamespace, lastHeader.RefId);
        xmlWriter.WriteEndElement();
      }
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pgSz", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "w", DocxConstants.WordNamespace,
        Convert.ToString(ps.Style.Width * DocxConstants.PointOoXmlFactor));
      xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "h", DocxConstants.WordNamespace,
        Convert.ToString(ps.Style.Height * DocxConstants.PointOoXmlFactor));
      if (ps.Style.Orientation == PageOrientation.Landscape)
        xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "orient", DocxConstants.WordNamespace, "landscape");
      xmlWriter.WriteEndElement();
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pgMar", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "top", DocxConstants.WordNamespace,
        ((int)(ps.Style.Margins.Top * DocxConstants.PointOoXmlFactor)).ToString(CultureInfo.InvariantCulture));
      xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "bottom", DocxConstants.WordNamespace,
        ((int)(ps.Style.Margins.Bottom * DocxConstants.PointOoXmlFactor)).ToString(CultureInfo.InvariantCulture));
      xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "left", DocxConstants.WordNamespace,
        ((int)(ps.Style.Margins.Left * DocxConstants.PointOoXmlFactor)).ToString(CultureInfo.InvariantCulture));
      xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "right", DocxConstants.WordNamespace,
        ((int)(ps.Style.Margins.Right * DocxConstants.PointOoXmlFactor)).ToString(CultureInfo.InvariantCulture));
      xmlWriter.WriteAttributeString(DocxConstants.WordPrefix, "footer", DocxConstants.WordNamespace, "100");
      xmlWriter.WriteEndElement();
      xmlWriter.WriteEndElement();
    }

    private void InsertDateComponent(AbstractDoc doc, XmlWriter xmlWriter, TextField tf)
    {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
      //var style = fc.GetEffectiveStyle(doc.Styles) ?? ps.TextProperties;
      var textProperties = tf.GetEffectiveStyle(doc.Styles).TextProperties;

      InsertRunProperty(xmlWriter, textProperties);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "fldChar", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("fldCharType", DocxConstants.WordNamespace, "begin");
      xmlWriter.WriteEndElement();
      xmlWriter.WriteEndElement();
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
      InsertRunProperty(xmlWriter, textProperties);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "instrText", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("xml", "space", "", "preserve");
      xmlWriter.WriteString(" DATE \\@YYYY/MM/DD ");
      //var fcText = new TextRun("{ DATE \\@YYYY/MM/DD }", tf.GetEffectiveStyle(doc.Styles));
      var fcText = new TextRun("{ DATE \\@YYYY/MM/DD }", null, tf.GetEffectiveStyle(doc.Styles).TextProperties);

      xmlWriter.WriteEndElement();
      xmlWriter.WriteEndElement();
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
      InsertRunProperty(xmlWriter, textProperties);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "fldChar", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("fldCharType", DocxConstants.WordNamespace, "separate");
      xmlWriter.WriteEndElement();
      xmlWriter.WriteEndElement();
      var effectiveStyle = tf.GetEffectiveStyle(doc.Styles);
      InsertTextComponent(doc, xmlWriter, fcText, effectiveStyle.TextProperties);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
      InsertRunProperty(xmlWriter, textProperties);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "fldChar", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("fldCharType", DocxConstants.WordNamespace, "end");
      xmlWriter.WriteEndElement();
      xmlWriter.WriteEndElement();
    }

    private void InsertFieldComponent(AbstractDoc doc, XmlWriter xmlWriter, TextField fc)
    {
      switch (fc.Type)
      {
        case FieldType.Date:
          InsertDateComponent(doc, xmlWriter, fc);
          break;
        case FieldType.PageNumber:
          xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);
          //var style = fc.GetEffectiveStyle(doc.Styles) ?? ps.TextProperties;
          var style = fc.GetEffectiveStyle(doc.Styles).TextProperties;
          InsertRunProperty(xmlWriter, style);
          xmlWriter.WriteElementString(DocxConstants.WordPrefix, "pgNum", DocxConstants.WordNamespace, "");
          xmlWriter.WriteEndElement();
          break;
        default:
          throw (new NotImplementedException("Field type has not been implemented in printer"));
      }
    }

    private void InsertTextComponent(AbstractDoc doc, XmlWriter xmlWriter, TextRun tr, TextProperties textProperties)
    {
      //var effectiveStyle = tc.GetEffectiveStyle(doc.Styles);
      InsertText(xmlWriter, tr.Text, textProperties);
    }

    private void InsertText(XmlWriter xmlWriter, string text, TextProperties textProperties)
    {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "r", DocxConstants.WordNamespace);

      //var style = componentStyle ?? ps.TextProperties;
      //var style = textProperties.TextProperties;
      InsertRunProperty(xmlWriter, textProperties);

      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "t", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("xml", "space", "", "preserve");
      xmlWriter.WriteString(text);
      xmlWriter.WriteEndElement();
      xmlWriter.WriteEndElement();
    }

    private void InsertComponent(AbstractDoc doc, XmlWriter xmlWriter, SafeDictionary<string, byte[]> zip,
      DocumentContainer currentDocument, DocumentContainer contentTypesDoc, IAtom bc)
    {
      var fc = bc as TextField;
      if (fc != null)
        InsertFieldComponent(doc, xmlWriter, fc);
      else
      {
        var tr = bc as TextRun;
        if (tr != null)
        {
          var effectiveTextProps = tr.GetEffectiveTextProperties(doc.Styles);
          InsertTextComponent(doc, xmlWriter, tr, effectiveTextProps);
        }
        else
        {
          var im = bc as Image;
          if (im != null)
            InsertImageComponent(xmlWriter, zip, currentDocument, contentTypesDoc, im);
          else
            throw new NotImplementedException("Contents of job is not implemented in printer");
        }
      }
    }

    private void InsertParagraph(AbstractDoc doc, XmlWriter xmlWriter, SafeDictionary<string, byte[]> zip,
      DocumentContainer currentDocument, DocumentContainer contentTypesDoc, Paragraph para)
    {

      var effectiveParaProps = para.GetEffectiveParagraphProperties(doc.Styles);

      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "p", DocxConstants.WordNamespace);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pPr", DocxConstants.WordNamespace);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "wordWrap", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "on");
      xmlWriter.WriteEndElement();

      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "spacing", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("before", DocxConstants.WordNamespace, effectiveParaProps.SpacingBefore.Value.Twips().ToString());
      xmlWriter.WriteAttributeString("after", DocxConstants.WordNamespace, effectiveParaProps.SpacingAfter.Value.Twips().ToString());
      xmlWriter.WriteEndElement();

      if (para.Numbering != null)
      {
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "numPr", DocxConstants.WordNamespace);
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "ilvl", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, para.Numbering.Level.ToString());
        xmlWriter.WriteEndElement();
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "numId", DocxConstants.WordNamespace);
        var wordNumberingId = GetWordNumberingId(para.Numbering.NumberingId);
        xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, wordNumberingId.ToString());
        xmlWriter.WriteEndElement();
        xmlWriter.WriteEndElement();
      }

      xmlWriter.WriteElementString(DocxConstants.WordPrefix, "keepLines", DocxConstants.WordNamespace, "");
      //var effectiveStyle = para.GetEffectiveStyle(doc.Styles);
      InsertJc(xmlWriter, effectiveParaProps.Alignment.Value);
      xmlWriter.WriteEndElement();

      foreach (var comp in para.Atoms)
      {
        //InsertComponent(doc, xmlWriter, zip, currentDocument, contentTypesDoc, comp, para.GetEffectiveStyle(doc.Styles));
        InsertComponent(doc, xmlWriter, zip, currentDocument, contentTypesDoc, comp);
      }
      xmlWriter.WriteEndElement();
    }

    private int GetWordNumberingId(string numberingId)
    {
      return _numberingIdTranslation[numberingId];
    }

    private void InsertEmptyParagraph(XmlWriter xmlWriter)
    {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "p", DocxConstants.WordNamespace);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "pPr", DocxConstants.WordNamespace);
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "spacing", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("after", DocxConstants.WordNamespace, "0");
      xmlWriter.WriteEndElement();
      xmlWriter.WriteEndElement();
      xmlWriter.WriteEndElement();
    }

    private void InsertTable(AbstractDoc doc, XmlWriter xmlWriter, SafeDictionary<string, byte[]> zip,
      DocumentContainer currentDocument,
      DocumentContainer contentTypesDoc, Table tPara)
    {

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
      foreach (var w in tPara.ColumnWidths)
      {
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "gridCol", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("w", DocxConstants.WordNamespace,
          ((int)(w * DocxConstants.PointOoXmlFactor)).ToString(CultureInfo.InvariantCulture));
        xmlWriter.WriteEndElement();
      }
      xmlWriter.WriteEndElement();

      for (var r = 0; r <= tPara.NrOfRows - 1; r++)
      {
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tr", DocxConstants.WordNamespace);
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "trPr", DocxConstants.WordNamespace);

        if (!double.IsNaN(tPara.Rows[r].Height))
        {
          xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "trHeight", DocxConstants.WordNamespace);
          xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
            (Convert.ToInt32(tPara.Rows[r].Height * DocxConstants.PointOoXmlFactor)).ToString(CultureInfo.InvariantCulture));
          xmlWriter.WriteAttributeString("type", DocxConstants.WordNamespace, "atLeast");
          xmlWriter.WriteEndElement();
        }
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "cantSplit", DocxConstants.WordNamespace);
        xmlWriter.WriteEndElement();
        xmlWriter.WriteEndElement();

        var c = 0;
        var tc = 0;
        while (c < tPara.ColumnWidths.Length)
        {
          //var ptc = tPara.GetCell(r, tc);
          var ptc = GetCell(doc, tPara, r, tc);
          var effectiveCellProps = ptc.GetEffectiveTableCellProperties(doc.Styles, tPara);
          var effectiveTableProps = tPara.GetEffectiveTableProperties(doc.Styles);
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
          if (effectiveCellProps.Background.HasValue && effectiveCellProps.Background.Value.A > 0)
          {
            xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "shd", DocxConstants.WordNamespace);
            xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "clear");
            xmlWriter.WriteAttributeString("color", DocxConstants.WordNamespace, "auto");
            xmlWriter.WriteAttributeString("fill", DocxConstants.WordNamespace,
              effectiveCellProps.Background.Value.ToString6Hex());
            xmlWriter.WriteEndElement();
          }

          xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "gridSpan", DocxConstants.WordNamespace);
          xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
            ptc.ColumnSpan.ToString(CultureInfo.InvariantCulture));
          xmlWriter.WriteEndElement();
          xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tcBorders", DocxConstants.WordNamespace);
          if (effectiveCellProps.Borders.Bottom.GetValueOrDefault(0) > 0)
            AddBordersToCell(xmlWriter, effectiveCellProps.Borders.Bottom.Value, "bottom");
          if (effectiveCellProps.Borders.Left.GetValueOrDefault(0) > 0)
            AddBordersToCell(xmlWriter, effectiveCellProps.Borders.Left.Value, "left");
          if (effectiveCellProps.Borders.Top.GetValueOrDefault(0) > 0)
            AddBordersToCell(xmlWriter, effectiveCellProps.Borders.Top.Value, "top");
          if (effectiveCellProps.Borders.Right.GetValueOrDefault(0) > 0)
            AddBordersToCell(xmlWriter, effectiveCellProps.Borders.Right.Value, "right");
          xmlWriter.WriteEndElement();

          xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "tcMar", DocxConstants.WordNamespace);
          var mTop = 0;
          var mBottom = 0;
          var mLeft = 0;
          var mRight = 0;

          if (effectiveCellProps.Padding.Top.HasValue)
            mTop = (int)(effectiveCellProps.Padding.Top);
          if (effectiveCellProps.Padding.Bottom.HasValue)
            mBottom = (int)(effectiveCellProps.Padding.Bottom);
          if (effectiveCellProps.Padding.Left.HasValue)
            mLeft = (int)(effectiveCellProps.Padding.Left);
          if (effectiveCellProps.Padding.Right.HasValue)
            mRight = (int)(effectiveCellProps.Padding.Right);

          xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "top", DocxConstants.WordNamespace);
          xmlWriter.WriteAttributeString("w", DocxConstants.WordNamespace, mTop.ToString(CultureInfo.InvariantCulture));
          xmlWriter.WriteAttributeString("type", DocxConstants.WordNamespace, "dxa");
          xmlWriter.WriteEndElement();
          xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "bottom", DocxConstants.WordNamespace);
          xmlWriter.WriteAttributeString("w", DocxConstants.WordNamespace,
            mBottom.ToString(CultureInfo.InvariantCulture));
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

          if (ptc.Elements.Count == 0)
            InsertEmptyParagraph(xmlWriter);
          else
          {
            foreach (var bp in ptc.Elements)
            {
              //TODO: Detta kan ge lite konstiga resultat om man har en tabell f�rst och sedan text...
              //Borde kolla om det bara finns en och det �r en tabell eller om det finns tv� men b�ra �r tabeller osv.
              AddBaseParagraphDocX(doc, xmlWriter, zip, currentDocument, contentTypesDoc, bp, true);
            }
          }

          xmlWriter.WriteEndElement();
          c += ptc.ColumnSpan;
          tc += 1;
        }
        xmlWriter.WriteEndElement();
      }

      xmlWriter.WriteEndElement();
    }

    private TableCell GetCell(AbstractDoc abstractDoc, Table table, int r, int c)
    {
      if (r >= table.NrOfRows)
        return null;

      var row = table.Rows[r];
      if (c < row.Cells.Count)
        return row.Cells[c];

      //Denna rad inneh�ller inte alla kolumner...
      //Kolla om n�got element i denna rad inneh�ller ett element
      TableCellProperties cs = null;
      foreach (var ptc in row.Cells)
      {
        if (ptc == null)
          break;
        //if (ptc.GetEffectiveStyle() != null)
        cs = ptc.GetEffectiveTableCellProperties(abstractDoc.Styles, table);
      }
      if (cs == null)
        cs = new TableCellPropertiesBuilder().Build();
      return new TableCell(null, cs, 1, new List<ISectionElement>());
    }

    private void AddBordersToCell(XmlWriter xmlWriter, double borderdef, string borderLocation)
    {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, borderLocation, DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "single");
      xmlWriter.WriteAttributeString("sz", DocxConstants.WordNamespace,
        ((int)borderdef * DocxConstants.PointOoXmlFactor).ToString(CultureInfo.InvariantCulture));
      xmlWriter.WriteAttributeString("space", DocxConstants.WordNamespace, "0");
      xmlWriter.WriteAttributeString("color", DocxConstants.WordNamespace, "000000");
      xmlWriter.WriteEndElement();
    }

    private void InsertJc(XmlWriter xmlWriter, TextAlignment ta)
    {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "jc", DocxConstants.WordNamespace);
      if (ta == TextAlignment.Center)
        xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "center");
      else if (ta == TextAlignment.Start)
        xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "left");
      else if (ta == TextAlignment.End)
        xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "right");
      else
        xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "left");
      xmlWriter.WriteEndElement(); //jc
    }

    private void InsertRunProperty(XmlWriter xmlWriter, TextProperties textProperties)
    {
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "rPr", DocxConstants.WordNamespace);
      if (textProperties.SubScript.Value || textProperties.SuperScript.Value)
      {
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "vertAlign", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
          textProperties.SubScript.Value ? "subscript" : "superscript");
        xmlWriter.WriteEndElement();
      }

      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "rFonts", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("ascii", DocxConstants.WordNamespace, "Arial");
      xmlWriter.WriteAttributeString("hAnsi", DocxConstants.WordNamespace, "Arial");
      xmlWriter.WriteEndElement();
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "sz", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
        Convert.ToString(((int)((textProperties.FontSize) + 0.5)) * 2));
      xmlWriter.WriteEndElement();
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "szCs", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
        Convert.ToString(((int)((textProperties.FontSize) + 0.5)) * 2));
      xmlWriter.WriteEndElement();
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "color", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace,
        textProperties.Color != null ? textProperties.Color.Replace("#", "").Substring(2, 6) : "000000");
      xmlWriter.WriteEndElement();
      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "noProof", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "true");
      xmlWriter.WriteEndElement();
      if (textProperties.Bold.Value)
      {
        xmlWriter.WriteElementString(DocxConstants.WordPrefix, "b", DocxConstants.WordNamespace, "");
        xmlWriter.WriteElementString(DocxConstants.WordPrefix, "bCs", DocxConstants.WordNamespace, "");
      }
      if (textProperties.Italic.Value)
      {
        xmlWriter.WriteElementString(DocxConstants.WordPrefix, "i", DocxConstants.WordNamespace, "");
        xmlWriter.WriteElementString(DocxConstants.WordPrefix, "iCs", DocxConstants.WordNamespace, "");
      }
      if (textProperties.Underline.Value)
      {
        xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "u", DocxConstants.WordNamespace);
        xmlWriter.WriteAttributeString("val", DocxConstants.WordNamespace, "single");
        xmlWriter.WriteEndElement();
      }

      xmlWriter.WriteStartElement(DocxConstants.WordPrefix, "lang", DocxConstants.WordNamespace);
      xmlWriter.WriteAttributeString("eastAsia", DocxConstants.WordNamespace, "en-US");
      xmlWriter.WriteEndElement();
      xmlWriter.WriteEndElement();
    }

    private void InsertImage(XmlWriter xmlWriter, string rid, double width, double height)
    {
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

    private void InsertDocumentContent(string filename, string contentType, DocumentContainer contentTypesDoc)
    {
      contentTypesDoc.XMLWriter.WriteStartElement("Override");
      filename = filename.Replace("\\", "/");
      if (filename.StartsWith("/") == false)
        filename = "/" + filename;
      contentTypesDoc.XMLWriter.WriteAttributeString("PartName", filename);
      contentTypesDoc.XMLWriter.WriteAttributeString("ContentType", contentType);
      contentTypesDoc.XMLWriter.WriteEndElement(); //Override
    }

    private void InsertImageContent(DocumentContainer contentTypesDoc, string extension, string mimeType)
    {
      contentTypesDoc.XMLWriter.WriteStartElement("Default");
      contentTypesDoc.XMLWriter.WriteAttributeString("Extension", extension);
      contentTypesDoc.XMLWriter.WriteAttributeString("ContentType", mimeType);
      contentTypesDoc.XMLWriter.WriteEndElement(); //Default
    }

    private void InsertDefaultContentTypes(DocumentContainer contentTypesDoc)
    {
      contentTypesDoc.XMLWriter.WriteStartElement("Default");
      contentTypesDoc.XMLWriter.WriteAttributeString("Extension", "xml");
      contentTypesDoc.XMLWriter.WriteAttributeString("ContentType", DocxConstants.MainContentType);
      contentTypesDoc.XMLWriter.WriteEndElement(); //Default
      contentTypesDoc.XMLWriter.WriteStartElement("Default");
      contentTypesDoc.XMLWriter.WriteAttributeString("Extension", "rels");
      contentTypesDoc.XMLWriter.WriteAttributeString("ContentType", DocxConstants.RelationContentType);
      contentTypesDoc.XMLWriter.WriteEndElement(); //Default
    }

    private void AddImageReference2(SafeDictionary<string, byte[]> zip, DocumentContainer contentTypesDoc,
      Image image, RenderedImage<byte[]> renderedImage)
    {
      var refId = GetNewReferenceId();
      var filePath = DocxConstants.ImagePath + "image_" + refId + "." + renderedImage.Format;

      var mimeType = GetMimeType(renderedImage.Format);
      if (_imageContentTypesAdded.Contains(mimeType) == false)
      {
        InsertImageContent(contentTypesDoc, renderedImage.Format, mimeType);
        _imageContentTypesAdded.Add(mimeType);
      }

      var stream = new MemoryStream(renderedImage.Output);

      AddToArchive(zip, filePath, stream);

      _imageHash.Add(image.ImageResource.Id.ToString(), refId);
    }

    private string GetMimeType(string format)
    {
      switch (format.ToLowerInvariant())
      {
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
          throw (new Exception("Unknown ImageType"));
      }
    }

    private string GetNewReferenceId()
    {
      _referenceId += 1;
      return "rId" + _referenceId;
    }

    private void AddHeadRef(SafeDictionary<string, byte[]> zip)
    {
      var headref = new MemoryStream();
      var contents = Encoding.UTF8.GetBytes(DocxConstants.HeadRelXml);
      headref.Write(contents, 0, contents.Length);

      AddToArchive(zip, DocxConstants.RefPath + ".rels", headref);
      //headref.Close();
      headref.Dispose();
    }

    private void AddToArchive(SafeDictionary<string, byte[]> zip, string filePath, Stream ms)
    {
      ms.Flush();
      ms.Position = 0;
      var buffer = new byte[((int)ms.Length) - 1 + 1];
      ms.Read(buffer, 0, buffer.Length);

      zip.Add(filePath, buffer);
    }

    private void AddDocumentToArchive(SafeDictionary<string, byte[]> zip, DocumentContainer docToAdd,
      DocumentContainer contentTypesDoc, bool insertContents)
    {
      docToAdd.Finish();
      AddToArchive(zip, docToAdd.FilePath + docToAdd.FileName, docToAdd.MemStream);
      if (insertContents)
        InsertDocumentContent(docToAdd.FilePath + docToAdd.FileName, docToAdd.ContentType, contentTypesDoc);
      if (docToAdd.References.Count > 0)
      {
        docToAdd.References.Finish();
        AddToArchive(zip, docToAdd.FilePath + DocxConstants.RefPath + docToAdd.FileName + ".rels",
          docToAdd.References.MemStream);
        docToAdd.References.Close();
      }
      docToAdd.Close();
    }
*/
  }
