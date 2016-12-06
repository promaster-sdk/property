//En basklass som kapslar in information om en xmlström. De andra
//container-klasserna ärver ifrån denna

import {XmlWriter} from "./xml-writer";

export class XMLContainer {

  private _xmlWriter: XmlWriter = new XmlWriter();

  getXml(): string {
    return this._xmlWriter.getXml();
  }

  get XMLWriter(): XmlWriter {
    return this._xmlWriter;
  }

  close(): void {
    this.XMLWriter.close();
  }

  finish(): void {
    this.XMLWriter.Flush();
  }
}
