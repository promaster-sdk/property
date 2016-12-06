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

interface XmlNamespaceDictionary {
  [ns: string]: string,
}

interface XmlElementContext {
  elementName: string,
  namespaces: XmlNamespaceDictionary,
}

type XmlWriterState = "Start" | "Prolog" | "Element" | "Content" | "Error" | "Closed";

export class XmlWriter {

  private _xml: string = "";
  private _state: XmlWriterState = "Start";
  private static readonly quoteChar = "\"";
  private readonly _encoding: string = "utf-8";
  private readonly _indent: number = 2;

  // private _namespacesStack: Array<XmlNamespaceDictionary> = [];
  // private _namespaces: XmlNamespaceDictionary = {};

  private _contextStack: Array<XmlElementContext> = [];

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
        this.throwInvalidState();
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
      if (this._state === "Prolog" || this._state === "Content") {
        if (text && (text.indexOf("--") >= 0 || (text.length != 0 && text[text.length - 1] == "-"))) {
          throw new Error("Xml_InvalidCommentChars");
        }
        text = text || "";
        this.writeIndent();
        this.write(`<!--${text}-->`);
      }
      else {
        this.throwInvalidState();
      }
      // Set next state
      // For XML-comments this case the next state should be the same as the previous one!
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
      if (this._state === "Start" || this._state === "Prolog" || this._state === "Element" || this._state === "Content") {
        const elementName: string = XmlWriter.getPrefixedName(localName, prefix);
        this._contextStack.push({elementName, namespaces: {}});
        if (this._state === "Element") {
          // Close previous start-element
          this.completeStartElement(false, this.peekContextStack().namespaces);
        }
        this.writeIndent(this._state !== "Start");
        // this.changeState("Element");
        this.write("<" + elementName);
        if (ns) {
          this.addNamespace(ns, prefix);
        }

      }
      else {
        this.throwInvalidState();
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
      if (this._state === "Content" || this._state === "Element") {

        if (this._state === "Element") {
          this.completeStartElement(false, this.peekContextStack().namespaces);
        }

        this.write(text);
      }
      else {
        this.throwInvalidState();
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
      if (this._state === "Element") {
        if (ns) {
          // Seems like a prefix is always invented for attributes if not provided
          // (but for elements it is OK to have blank prefix)
          if (!prefix || prefix.length === 0) {
            prefix = this.getPrefixFromAncestors(ns);
            if (!prefix) {
              prefix = XmlWriter.generatePrefix(this.peekContextStack().namespaces);
            }
          }
          this.addNamespace(ns, prefix);
        }
        const attributeName: string = XmlWriter.getPrefixedName(localName, prefix);
        this.write(` ${attributeName}=${XmlWriter.quoteChar}${value}${XmlWriter.quoteChar}`);
      }
      else {
        this.throwInvalidState();
      }
      // Set next state
      this._state = "Element";
    }
    catch (e) {
      this._state = "Error";
      throw e;
    }

  }

  // Find existing prefix for a specified namespace
  private getPrefixFromAncestors(ns: string): string | undefined {
    for (const context of this._contextStack) {
      for (const prefix of Object.keys(context)) {
        if (context.namespaces[prefix] === ns)
          return prefix;
      }
    }
    return undefined;
  }

  private peekContextStack() {
    return this._contextStack[this._contextStack.length - 1];
  }

  private static generatePrefix(namespaces: XmlNamespaceDictionary) {
    let i = 1;
    while (i < 100) {
      if (!namespaces.hasOwnProperty("p" + i))
        break;
      i++;
    }
    return "p" + i;
  }

  WriteEndElement(): void {

    try {
      if (this._state === "Content" || this._state === "Element") {
        const context = this._contextStack.pop() as XmlElementContext;
        // Only close in itself if no content....
        if (this._state === "Element") {
          this.completeStartElement(true, context.namespaces);
        }
        else {
          this.writeIndent(false);
          this.write(`</${context.elementName}>`);
        }
        //this._contextStack.pop();

      }
      else {
        this.throwInvalidState();
      }
      // Set next state
      // if (this._state === "Element") {
      //   this._state = "Element";
      // }
      // else {
      this._state = "Content";
      // }
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

  private completeStartElement(close: boolean, namespaces: XmlNamespaceDictionary) {

    this.writeNamespaceAttributes(namespaces);
    // Push and clear for next time
    // this._namespacesStack.push(this._namespaces);
    // this._namespaces = {};
    if (close) {
      this.write(" />");
    }
    else {
      this.write(">");
    }
  }

  private throwInvalidState() {
    throw new Error(`Invalid state '${this._state}'.`);
  }

  private addNamespace(ns: string, prefix: string | undefined) {
    // Make sure we don't duplicate prefixes
    prefix = prefix || "";
    this.peekContextStack().namespaces[prefix] = ns;
  }

  private writeIndent(newLine: boolean = true) {
    if (this._indent > 0) {
      if (newLine) {
        this.write("\n");
      }
      if (!(this._state === "Start" || this._state === "Prolog")) {
        for (let i = 0; i < this._indent * this._contextStack.length; i++) {
          this.write(" ");
        }
      }
    }
  }

  private write(text: string) {
    this._xml += text;
    //console.log(`xml: '${this._xml}'`,);
  }

  private writeNamespaceAttributes(namespaces: XmlNamespaceDictionary): void {

    console.log("writeNamespaceAttributes", namespaces);

    // We should not repeat namespaces that exists in our ancestors
    // Check which of our current namespaces that does not exist in this ancestor
    const toWrite = this.getNamespacesNotInAncestors(namespaces);

    console.log("writeNamespaceAttributes2", toWrite);

    // Write the ones that was not found in ancestor
    for (const prefix of Object.keys(toWrite)) {
      this.writeNamespaceAttribute(namespaces[prefix], prefix);
    }

  }

  private getNamespacesNotInAncestors(namespaces: XmlNamespaceDictionary) {
    const toWrite: XmlNamespaceDictionary = {};
    for (const prefix of Object.keys(namespaces)) {
      let exists: boolean = false;
      // Don't check the current (last) context in the stack
      for (let i = 0; i < this._contextStack.length - 1; i++) {
        const context = this._contextStack[i];
        if (context.namespaces[prefix] == namespaces[prefix]) {
          exists = true;
          break;
        }
      }
      if (!exists)
        toWrite[prefix] = namespaces[prefix];
    }
    return toWrite;
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

}
