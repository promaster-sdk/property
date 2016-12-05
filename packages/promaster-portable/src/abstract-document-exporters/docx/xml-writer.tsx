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
  parent: XmlElement,
  children: Array<XmlElement>
}

interface XmlAttribute {
  localName: string,
  value: string,
  ns: string | undefined,
  prefix: string | undefined
}

interface XmlNamespaceIndexer {
  [ns: string]: string,
}

type XmlWriterState = "Start" | "Prolog" | "Element" | "Attribute" | "Content" | "Error";

export class XmlWriter {
  /*
   public enum WriteState
   {
   Start,
   Prolog,
   Element,
   Attribute,
   Content,
   Closed,
   Error,
   }

   */

  private _xml: string = "";
  private _state: XmlWriterState = "Start";
  private _elementNameStack: Array<string> = [];
  private static readonly quoteChar = "\"";
  private _encoding: string = "ENCODING TODO!";
  private _namespaces: XmlNamespaceIndexer = {};

  WriteStartDocument(standalone?: boolean): void {

    try {
      console.log(`${standalone}`);

      this.changeState("Prolog");
      // if (this._state !== "Start") {
      //   throw new Error("Invalid state");
      // }
      // this._state = "Prolog";

      let bufBld: string = "";
      bufBld += ("version=" + XmlWriter.quoteChar + "1.0" + XmlWriter.quoteChar);
      if (this._encoding != null) {
        bufBld += (" encoding=");
        bufBld += XmlWriter.quoteChar;
        // bufBld += this.encoding.WebName;
        bufBld += this._encoding;
        bufBld += XmlWriter.quoteChar;
      }
      if (standalone) {
        bufBld += " standalone=";
        bufBld += XmlWriter.quoteChar;
        bufBld += standalone ? "no" : "yes";
        bufBld += XmlWriter.quoteChar;
      }
      // this.InternalWriteProcessingInstruction("xml", bufBld);
      // private InternalWriteProcessingInstruction(name: string, text: string): void {
      this.write("<?");
      // ValidateName(name, false);
      this.write(name);
      this.write(" ");
      if (bufBld) {
        this.write(bufBld);
      }
      this.write("?>");
      // }
    }
    catch (e) {
      this._state = "Error";
      throw e;
    }
  }


  WriteComment(text: string): void {
    try {
      if (text && (text.indexOf("--") >= 0 || (text.length != 0 && text[text.length - 1] == "-"))) {
        throw new Error("Xml_InvalidCommentChars");
      }
      // AutoComplete(Token.Comment);
      this.write("<!--");
      if (text) {
        // xmlEncoder.WriteRawWithSurrogateChecking(text);
        this.write(text);
      }
      this.write("-->");
    }
    catch (e) {
      this._state = "Error";
      throw e;
    }

  }

  WriteStartElement(localName: string): void;
  WriteStartElement(localName: string, ns: string): void;
  WriteStartElement(localName: string, ns: string, prefix: string): void;
  WriteStartElement(localName: string, ns?: string, prefix?: string): void {
    this.changeState("Element");
    const elementName: string = XmlWriter.getPrefixedName(localName, prefix);
    this.write(elementName);
    if (ns) {
      this.addNamespace(ns, prefix);
    }
    this._elementNameStack.push(elementName);
  }

  private addNamespace(ns: string, prefix: string | undefined) {
    // Make sure we don't duplicate prefixes
    prefix = prefix || "";
    this._namespaces[prefix] = ns;
  }

  WriteString(text: string): void {
    this.changeState("Content");
    this.write(text);
  }

  WriteElementString(localName: string, ns: string, prefix: string, value: string): void {
    this.WriteStartElement(localName, ns, prefix);
    this.WriteString(value);
    this.WriteEndElement();
  }

  WriteAttributeString(localName: string, value: string): void;
  WriteAttributeString(localName: string, value: string, ns: string): void;
  WriteAttributeString(localName: string, value: string, ns: string, prefix: string): void;
  WriteAttributeString(localName: string, value: string, ns?: string, prefix?: string): void {
    this.changeState("Attribute");
    if (ns) {
      // Seems like a prefix is always invented for attributes if not provided
      // (but for elements it is OK to have blank prefix)
      if (!prefix || prefix.length === 0) {
        let i = 1;
        while (i < 100) {
          if (!this._namespaces.hasOwnProperty("p" + i))
            break;
          i++;
        }
        prefix = "p" + i;
      }
      this.addNamespace(ns, prefix);
    }
    const attributeName: string = XmlWriter.getPrefixedName(localName, prefix);
    this.write(` ${attributeName}=${XmlWriter.quoteChar}${value}${XmlWriter.quoteChar}`);
  }

  WriteEndElement(): void {
    this.changeState("Content");
    const elementName = this._elementNameStack.pop();
    this.write(`</${elementName}>`);
  }

  Flush(): void {
  }

  getXml(): string {
    return this._xml;
  }

  private write(text: string) {
    this._xml += text;
    console.log(`xml: '${this._xml}'`,);
  }

  private writeNamespaceAttributesAndClear(): void {
    for (const prefix of Object.keys(this._namespaces)) {
      this.writeNamespaceAttribute(this._namespaces[prefix], prefix);
    }
    // Clear for next time
    this._namespaces = {};
  }

  private writeNamespaceAttribute(ns: string, prefix: string | undefined): void {
    if (ns) {
      if (prefix) {
        this.write(` xmlns:${prefix}="${ns}"`);
      }
      else {
        this.write(` xmlns="${ns}"`);
      }
    }
  }

  private static getPrefixedName(localName: string, prefix: string | undefined): string {
    if (prefix) {
      return `${prefix}:${localName}`;
    }
    else {
      return `${localName}`;
    }
  }

  private changeState(newState: XmlWriterState) {

    let ok: boolean = false;
    if (this._state === newState) {
      // Same state is OK
      ok = true;
    }
    else if (this._state === "Start") {
      if (newState === "Prolog") {
        ok = true;
      }
      if (newState === "Element") {
        this.write("<");
        ok = true;
      }
    }
    else if (this._state === "Element") {
      if (newState === "Attribute") {
        ok = true;
      }
      else if (newState === "Content") {
        this.writeNamespaceAttributesAndClear();
        this.write(">");
        ok = true;
      }
    }
    else if (this._state === "Attribute") {
      if (newState === "Content") {
        this.writeNamespaceAttributesAndClear();
        this.write(">");
        ok = true;
      }
    }

    if (ok) {
      this._state = newState;
    }
    else {
      throw new Error(`Invalid state change, from ${this._state} to ${newState}`);
    }

  }

}
