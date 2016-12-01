using System.IO;
using System.Text;
using System.Xml;

namespace Eligo.Portable.AbstractDocument.Impl.Docx
{
  //En basklass som kapslar in information om en xmlström. De andra
  //container-klasserna ärver ifrån denna
  internal class XMLContainer
  {
    private XmlWriter m_XMLWriter;
    private MemoryStream m_MemStream;

    public MemoryStream MemStream
    {
      get
      {
        if (m_MemStream == null)
        {
          m_MemStream = new MemoryStream();
        }
        return m_MemStream;
      }
    }

    public XmlWriter XMLWriter
    {
      get { return m_XMLWriter; }
    }

    public XMLContainer()
    {
      //Skapa en XmlWriter
      XmlWriterSettings settings = new XmlWriterSettings();
      settings.Encoding = Encoding.UTF8;
      settings.Indent = true;
      settings.CloseOutput = true;
      m_XMLWriter = XmlWriter.Create(MemStream, settings); //XMLWriter
    }

    public virtual void Close()
    {
      //Stänger och frigör minne
      XMLWriter.Dispose();
      MemStream.Dispose();
      m_MemStream = null;
      m_XMLWriter = null;
    }

    public virtual void Finish()
    {
      XMLWriter.Flush();
    }
  }
}