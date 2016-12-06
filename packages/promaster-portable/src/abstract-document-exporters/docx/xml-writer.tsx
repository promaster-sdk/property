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

type XmlWriterState = "Start" | "Prolog" | "Element" | "Attribute" | "Content" | "Error" | "Closed";

export class XmlWriter {

  private _xml: string = "";
  private _state: XmlWriterState = "Start";
  private _elementNameStack: Array<string> = [];
  private static readonly quoteChar = "\"";
  private _encoding: string = "utf-8";
  private _namespaces: XmlNamespaceIndexer = {};
  private _indent: number = 2;

  WriteStartDocument(standalone?: boolean): void {

    try {
      if (this._state === "Start" || this._state === "Prolog") {

        let bufBld: string = "";
        bufBld += "version=" + XmlWriter.quoteChar + "1.0" + XmlWriter.quoteChar;
        if (this._encoding != null) {
          bufBld += ` encoding=${XmlWriter.quoteChar}${this._encoding}${XmlWriter.quoteChar}`;
        }
        if (standalone) {
          const standAlone = standalone ? "yes" : "no";
          bufBld += ` standalone=${XmlWriter.quoteChar}${standAlone}${XmlWriter.quoteChar}`;
        }
        this.writeIndent(this._state !== "Start");
        const xmlProcessingIntruction = `<?xml ${bufBld}?>`;
        this.write(xmlProcessingIntruction);
      }
      else {
        throw new Error("Invalid state.");
      }
      // Set next state
      this._state = "Prolog";
    }
    catch (e) {
      this._state = "Error";
      throw e;
    }
  }

  WriteComment(text: string): void {
    try {
      if (this._state === "Content") {
        if (text && (text.indexOf("--") >= 0 || (text.length != 0 && text[text.length - 1] == "-"))) {
          throw new Error("Xml_InvalidCommentChars");
        }
        text = text || "";
        this.writeIndent();
        this.write("<!--${text}-->");
      }
      else {
        throw new Error("Invalid state.");
      }
      // Set next state
      this._state = "Content";
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

    try {
      if (this._state === "Start" || this._state === "Prolog" || this._state === "Content") {
        this.writeIndent(!(this._state === "Start" || this._state === "Prolog"));
        // this.changeState("Element");
        const elementName: string = XmlWriter.getPrefixedName(localName, prefix);
        this.write("<" + elementName);
        if (ns) {
          this.addNamespace(ns, prefix);
        }
        this._elementNameStack.push(elementName);
      }
      else {
        throw new Error("Invalid state.");
      }
      // Set next state
      this._state = "Element";
    }
    catch (e) {
      this._state = "Error";
      throw e;
    }

  }

  WriteString(text: string): void {

    try {
      if (this._state === "Content" || this._state === "Element" || this._state === "Attribute") {

        if (this._state === "Element" || this._state === "Attribute") {
          // Close the start element
          this.writeNamespaceAttributesAndClear();
          this.write(">");
        }

        this.write(text);
      }
      else {
        throw new Error("Invalid state.");
      }
      // Set next state
      this._state = "Content";
    }
    catch (e) {
      this._state = "Error";
      throw e;
    }
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

    try {
      if (this._state === "Element" || this._state === "Attribute") {
        // this.changeState("Attribute");
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
      else {
        throw new Error("Invalid state.");
      }
      // Set next state
      this._state = "Attribute";
    }
    catch (e) {
      this._state = "Error";
      throw e;
    }

  }

  WriteEndElement(): void {

    try {
      if (this._state === "Content" || this._state === "Element" || this._state === "Attribute") {
        // this.changeState("Content");
        const elementName = this._elementNameStack.pop();
        if (this._state === "Attribute" || this._state === "Element") {
          this.write(` />`);
        }
        else {
          this.write(`</${elementName}>`);
        }
      }
      else {
        throw new Error("Invalid state.");
      }
      // Set next state
      this._state = "Content";
    }
    catch (e) {
      this._state = "Error";
      throw e;
    }


  }

  Flush(): void {
    this.close();
  }

  close(): void {
    this._state = "Closed";
  }

  getXml(): string {
    return this._xml;
  }

  private addNamespace(ns: string, prefix: string | undefined) {
    // Make sure we don't duplicate prefixes
    prefix = prefix || "";
    this._namespaces[prefix] = ns;
  }

  private writeIndent(newLine: boolean = true) {
    if (this._indent > 0) {
      if (newLine) {
        this.write("\n");
      }
      if (!(this._state === "Start" || this._state === "Prolog")) {
        for (let i = 0; i < this._indent; i++) {
          this.write(" ");
        }
      }
    }
  }

  private write(text: string) {
    this._xml += text;
    //console.log(`xml: '${this._xml}'`,);
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

  // private changeState(newState: XmlWriterState) {
  //
  //   let ok: boolean = false;
  //   if (this._state === newState) {
  //     // Same state is OK
  //     ok = true;
  //   }
  //   else if (this._state === "Prolog") {
  //     if (newState === "Element") {
  //       this.write("<");
  //       ok = true;
  //     }
  //   }
  //   else if (this._state === "Start") {
  //     if (newState === "Prolog") {
  //       ok = true;
  //     }
  //     if (newState === "Element") {
  //       this.write("<");
  //       ok = true;
  //     }
  //   }
  //   else if (this._state === "Element") {
  //     if (newState === "Attribute") {
  //       ok = true;
  //     }
  //     else if (newState === "Content") {
  //       this.writeNamespaceAttributesAndClear();
  //       this.write(">");
  //       ok = true;
  //     }
  //   }
  //   else if (this._state === "Attribute") {
  //     if (newState === "Content") {
  //       this.writeNamespaceAttributesAndClear();
  //       //this.write(">");
  //       ok = true;
  //     }
  //   }
  //   else if (this._state === "Content") {
  //     if (newState === "Element") {
  //       this.write("<");
  //       ok = true;
  //     }
  //   }
  //
  //   if (ok) {
  //     this._state = newState;
  //   }
  //   else {
  //     throw new Error(`Invalid state change, from ${this._state} to ${newState}`);
  //   }
  //
  // }

}
