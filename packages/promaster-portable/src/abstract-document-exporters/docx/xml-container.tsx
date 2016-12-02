//En basklass som kapslar in information om en xmlström. De andra
//container-klasserna ärver ifrån denna

import {XmlWriter} from "./xml-writer";

export class XMLContainer {

  private m_XMLWriter: XmlWriter;
  private m_MemStream: any; //MemoryStream;

  get memStream(): any {
    return this.m_MemStream;
  }


  get  XMLWriter(): XmlWriter {
    return this.m_XMLWriter;
  }
/*
  constructor() {
    //Skapa en XmlWriter
    const settings: XmlWriterSettings = new XmlWriterSettings();
    settings.Encoding = Encoding.UTF8;
    settings.Indent = true;
    settings.CloseOutput = true;
    this.m_XMLWriter = XmlWriter.Create(this.MemStream, settings); //XMLWriter
  }
 */
  close(): void {
   /*
    //Stänger och frigör minne
    this.XMLWriter.Dispose();
    this.MemStream.Dispose();
    this.m_MemStream = null;
    this.m_XMLWriter = null;
    */
  }

  finish(): void {
    this.XMLWriter.Flush();
  }
}
