
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

  WriteStartDocument(standalone?: boolean): void {
    console.log(`${standalone}`);
  }

  WriteComment(text: string): void {
    console.log(`${text}`);
  }

  WriteStartElement(localName: string): void;
  WriteStartElement(localName: string, ns: string): void;
  WriteStartElement(localName: string, ns: string, prefix: string): void;
  WriteStartElement(localName: string, ns?: string, prefix?: string): void {
    console.log(`${localName}, ${ns}, ${prefix}`);
  }

  WriteElementString(prefix: string, localName: string, ns: string, value: string): void {
    console.log(`${prefix}, ${localName}, ${ns}, ${value}`);
  }

  WriteAttributeString(localName: string, value: string): void;
  WriteAttributeString(localName: string, value: string, ns: string): void;
  WriteAttributeString(localName: string, value: string, ns: string, prefix: string): void;
  WriteAttributeString(localName: string, value: string, ns?: string, prefix?: string): void {
    console.log(`${localName}, ${value}, ${ns}, ${prefix}`);
  }

  WriteEndElement(): void {
  }

  Flush(): void {
  }

  WriteString(text: string): void {
    console.log(`${text}`);
  }

}

