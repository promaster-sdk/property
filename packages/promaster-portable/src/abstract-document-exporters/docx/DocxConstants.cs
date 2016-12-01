namespace Eligo.Portable.AbstractDocument.Impl.Docx
{
  internal class DocxConstants
  {
    public const string WordNamespace = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
    public const string WordPrefix = "w";
    public const string VmlNamespace = "urn:schemas-microsoft-com:vml";
    public const string VmlPrefix = "v";
    public const string OfficeNamespace = "urn:schemas-microsoft-com:office:office";
    public const string OfficePrefix = "o";
    public const string HeadRelXml =
      "<?xml version=\'1.0\' encoding=\'utf-8\'?><Relationships xmlns=\'http://schemas.openxmlformats.org/package/2006/relationships\'><Relationship Type=\'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\' Target=\'/word/document.xml\' Id=\'Rac2f7d58837f4830\'/></Relationships>";

    public const string RelNamespace = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
    public const string RelPrefix = "r";
    public const int PointOoXmlFactor = 20;

    public const string ImageStyle = "width:{0}pt;height:{1}pt;mso-position-horizontal-relative:char;mso-position-vertical-relative:line;v-text-anchor:middle";

    public const string ContentTypeNamespace = "http://schemas.openxmlformats.org/package/2006/content-types";
    public const string HeaderNamespace = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/header";
    public const string ImageNamespace = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image";
    public const string RelationNamespace = "http://schemas.openxmlformats.org/package/2006/relationships";
    public const string NumberingNamespace = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering";

    public const string DocumentPath = "word\\";
    public const string RefPath = "_rels\\";
    public const string ImagePath = "media\\";
    public const string ContentTypesPath = "";
    public const string NumberingPath = "word\\";

    public const string HeaderContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml";
    public const string MainContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml";
    public const string RelationContentType = "application/vnd.openxmlformats-package.relationships+xml";
    public const string NumberingContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml";


  }
}