namespace Eligo.Portable.AbstractDocument.Impl.Docx
{
  internal class DocumentContainer : XMLContainer
  {
    private string _filePath;
    private string _fileName;
    private readonly RefContainer _references = new RefContainer();
    private string _refId;
    private string _contentType;

    public string RefId
    {
      get { return _refId; }
      set { _refId = value; }
    }

    public string FilePath
    {
      get { return _filePath; }
      set { _filePath = value; }
    }

    public string FileName
    {
      get { return _fileName; }
      set { _fileName = value; }
    }

    public string ContentType
    {
      get { return _contentType; }
      set { _contentType = value; }
    }

    public RefContainer References
    {
      get { return _references; }
    }
  }
}