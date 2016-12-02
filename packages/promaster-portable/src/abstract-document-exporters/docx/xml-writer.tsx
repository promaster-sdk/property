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

interface XmlElement {
  localName: string,
  ns: string | undefined,
  prefix: string | undefined,
  attributes: Array<XmlAttribute>
}

interface XmlAttribute {
  localName: string,
  value: string,
  ns: string | undefined,
  prefix: string | undefined
}

export class XmlWriter {

  private _xml: string;
  private _elementStack: Array<XmlElement> = [];

  WriteStartDocument(standalone?: boolean): void {
    console.log(`${standalone}`);
    this._xml += ``;
  }

  WriteComment(text: string): void {
    console.log(`${text}`);
    this._xml += ``;
  }

  WriteStartElement(localName: string): void;
  WriteStartElement(localName: string, ns: string): void;
  WriteStartElement(localName: string, ns: string, prefix: string): void;
  WriteStartElement(localName: string, ns?: string, prefix?: string): void {
    console.log(`${localName}, ${ns}, ${prefix}`);
    this._xml += `<${localName}>\n`;
    // localName: <book>
    // localName, ns: <book xmlns="ns">
    // localName, ns, prefix: <prefix:localName xmlns:prefix="ns">
    this._elementStack.push({localName, ns, prefix, attributes: []});
  }

  WriteElementString(prefix: string, localName: string, ns: string, value: string): void {
    console.log(`${prefix}, ${localName}, ${ns}, ${value}`);
    this._xml += "";
  }

  WriteAttributeString(localName: string, value: string): void;
  WriteAttributeString(localName: string, value: string, ns: string): void;
  WriteAttributeString(localName: string, value: string, ns: string, prefix: string): void;
  WriteAttributeString(localName: string, value: string, ns?: string, prefix?: string): void {
    this._elementStack[this._elementStack.length - 1].attributes.push({localName, value, ns, prefix});
  }

  WriteEndElement(): void {
    const element = this._elementStack.pop();
    console.log(element);
    //this._xml += `</${localName}>\n`;
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
