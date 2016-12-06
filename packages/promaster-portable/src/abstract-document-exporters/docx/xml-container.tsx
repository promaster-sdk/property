//En basklass som kapslar in information om en xmlström. De andra
//container-klasserna ärver ifrån denna

import {XmlWriter} from "./xml-writer";
import {stringToUtf8ByteArray} from "./string-utils";

export class XMLContainer {

  private _xmlWriter: XmlWriter = new XmlWriter();

  getXmlAsUtf8ByteArray(): Uint8Array {
    return stringToUtf8ByteArray(this._xmlWriter.getXml());
  }

  get XMLWriter(): XmlWriter {
    return this._xmlWriter;
  }

  close(): void {
  }

  finish(): void {
    this.XMLWriter.Flush();
  }
}
