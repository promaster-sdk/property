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

  private _xml: string;
  private _state: XmlWriterState = "Start";
  private _elementNameStack: Array<string> = [];
  private static readonly quoteChar = "\"";
  private _encoding: string = "ENCODING TODO!";

  WriteStartDocument(standalone?: boolean): void {

    try {
      console.log(`${standalone}`);

      if (this._state !== "Start") {
        throw new Error("Invalid state");
      }
      this._state = "Prolog";

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
      this.writeNamespaceAttribute(ns, prefix);
    }
    this._elementNameStack.push(elementName);
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
    const attributeName: string = XmlWriter.getPrefixedName(localName, prefix);
    this.write(` ${attributeName}=${value}`);
    if (ns) {
      this.writeNamespaceAttribute(ns, prefix);
    }
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
    if (this._state === "Start" && newState === "Element") {
      this.write("<");
      ok = true;
    }
    else if (this._state === "Element" && newState === "Attribute") {
      this.write(" ");
      ok = true;
    }
    else if ((this._state === "Element" || this._state === "Attribute") && newState === "Content") {
      this.write(">");
      ok = true;
    }

    if (ok) {
      this._state = newState;
    }
    else {
      throw new Error(`Invalid state change, from ${this._state} to ${newState}`);
    }

  }

}
