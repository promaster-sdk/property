using System.Collections.Generic;

namespace Eligo.Portable.AbstractDocument.Impl.Docx
{
  internal class RefContainer : XMLContainer
  {
    private List<string> _references = new List<string>();

    public RefContainer()
    {
      XMLWriter.WriteStartDocument(true);
      XMLWriter.WriteStartElement("Relationships", DocxConstants.RelationNamespace);
    }

    public void AddReference(string refId, string filePath, string type)
    {

      if (filePath.StartsWith("/") == false)
        filePath = "/" + filePath;
      AddReference2(refId, filePath, type);

      //if (_references.Contains(refId))
      //  return;
      //XMLWriter.WriteStartElement("Relationship");
      //XMLWriter.WriteAttributeString("Type", type);
      //filePath = filePath.Replace("\\", "/");
      //if (filePath.StartsWith("/") == false)
      //  filePath = "/" + filePath;
      //XMLWriter.WriteAttributeString("Target", filePath);
      //XMLWriter.WriteAttributeString("Id", refId);
      //XMLWriter.WriteEndElement();
      //_references.Add(refId);
    }

    public void AddReference2(string refId, string filePath, string type)
    {
      if (_references.Contains(refId))
        return;
      XMLWriter.WriteStartElement("Relationship");
      XMLWriter.WriteAttributeString("Type", type);
      filePath = filePath.Replace("\\", "/");
      XMLWriter.WriteAttributeString("Target", filePath);
      XMLWriter.WriteAttributeString("Id", refId);
      XMLWriter.WriteEndElement();
      _references.Add(refId);
    }

    public int Count
    {
      get { return _references.Count; }
    }

    public override void Finish()
    {
      XMLWriter.WriteEndElement();
      base.Finish();
    }

    public override void Close()
    {
      base.Close();
      _references.Clear();
      _references = null;
    }
  }
}