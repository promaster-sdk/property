// export interface XmlWriter {
//   WriteStartDocument(standalone?: boolean): void,
//   WriteComment(text: string): void,
//
//   WriteStartElement(localName: string): void,
//   WriteStartElement(localName: string, ns: string): void,
//   WriteStartElement(localName: string, ns: string, prefix: string): void,
//
//   WriteElementString(prefix: string, localName: string, ns: string, value: string): void,
//
//   WriteAttributeString(localName: string, value: string): void,
//   WriteAttributeString(localName: string, value: string, ns: string): void,
//   WriteAttributeString(localName: string, value: string, ns: string, prefix: string): void,
//
//   WriteEndElement(): void,
//   Flush(): void,
//   WriteString(text: string): void,
// }

export class XmlWriter {

  private _xml: string;

  WriteStartDocument(standalone?: boolean): void {
    console.log(`${standalone}`);
    this._xml += "";
  }

  WriteComment(text: string): void {
    console.log(`${text}`);
    this._xml += "";
  }

  WriteStartElement(localName: string): void;
  WriteStartElement(localName: string, ns: string): void;
  WriteStartElement(localName: string, ns: string, prefix: string): void;
  WriteStartElement(localName: string, ns?: string, prefix?: string): void {
    console.log(`${localName}, ${ns}, ${prefix}`);
    this._xml += "";
  }

  WriteElementString(prefix: string, localName: string, ns: string, value: string): void {
    console.log(`${prefix}, ${localName}, ${ns}, ${value}`);
    this._xml += "";
  }

  WriteAttributeString(localName: string, value: string): void;
  WriteAttributeString(localName: string, value: string, ns: string): void;
  WriteAttributeString(localName: string, value: string, ns: string, prefix: string): void;
  WriteAttributeString(localName: string, value: string, ns?: string, prefix?: string): void {
    console.log(`${localName}, ${value}, ${ns}, ${prefix}`);
    this._xml += "";
  }

  WriteEndElement(): void {
    this._xml += "";
  }

  Flush(): void {
    this._xml += "";
  }

  WriteString(text: string): void {
    console.log(`${text}`);
    this._xml += "";
  }

  getXml(): string {
    return this._xml;
  }

}
