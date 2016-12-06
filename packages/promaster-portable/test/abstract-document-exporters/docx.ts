import {assert} from "chai";
import {XmlWriter} from "../../src/abstract-document-exporters/docx/xml-writer";
import {DocxDocumentRenderer} from "../../src/abstract-document-exporters/docx/docx-document-renderer";
import {helloWorldDoc} from "../abstract-document/hello-world-abstract-doc";
import * as HelloWorldDocx from "./hello-world-docx";

describe('XmlWriter', () => {

  it("should write xml processing instruction at start-document", () => {
    const writer = new XmlWriter();
    writer.WriteStartDocument(true);
    assert.equal(writer.getXml(), `<?xml version="1.0" encoding="utf-8" standalone="yes"?>`);
  });

  it("should shorthand close tag if no content and no attribute", () => {
    const writer = new XmlWriter();
    writer.WriteStartElement("localName");
    writer.WriteEndElement();
    assert.equal(writer.getXml(), `<localName />`);
  });

  it("should shorthand close tag if no content but attribute", () => {
    const writer = new XmlWriter();
    writer.WriteStartElement("localName");
    writer.WriteAttributeString("localName", "value");
    writer.WriteEndElement();
    assert.equal(writer.getXml(), `<localName localName="value" />`);
  });

  it("should write without namespace", () => {
    const writer = new XmlWriter();
    writer.WriteStartElement("localName");
    writer.WriteAttributeString("localName", "value");
    writer.WriteString("Some content");
    writer.WriteEndElement();
    assert.equal(writer.getXml(), `<localName localName="value">Some content</localName>`);
  });

  it("should write with namespace and prefix", () => {
    const writer = new XmlWriter();
    writer.WriteStartElement("localName", "ns", "prefix");
    writer.WriteAttributeString("localName", "value", "ns", "prefix");
    writer.WriteString("Some content");
    writer.WriteEndElement();
    assert.equal(writer.getXml(), `<prefix:localName prefix:localName="value" xmlns:prefix="ns">Some content</prefix:localName>`);
  });

  it("should write with namespace without prefix", () => {
    const writer = new XmlWriter();
    writer.WriteStartElement("localName", "ns");
    writer.WriteAttributeString("localName", "value", "ns");
    writer.WriteString("Some content");
    writer.WriteEndElement();
    assert.equal(writer.getXml(), `<localName p1:localName="value" xmlns="ns" xmlns:p1="ns">Some content</localName>`);
  });

  it("should not repeat namespaces in elements", () => {
    const writer = new XmlWriter();
    writer.WriteStartElement("parent", "ns");
    writer.WriteStartElement("child", "ns");
    writer.WriteStartElement("grandChild", "ns");
    writer.WriteEndElement();
    writer.WriteEndElement();
    writer.WriteEndElement();
    assert.equal(writer.getXml(), `<parent xmlns="ns">\n  <child>\n    <grandChild />\n  </child>\n</parent>`);
  });

  it("should not repeat namespaces in attributes", () => {
    const writer = new XmlWriter();
    writer.WriteStartElement("parent", "ns");
    writer.WriteAttributeString("foo", "bar", "ns");
    writer.WriteEndElement();
    assert.equal(writer.getXml(), `<parent p1:foo="bar" xmlns="ns" xmlns:p1="ns" />`);
  });

});

describe('DocxDocumentRenderer', () => {

  it("should write hello world document", () => {
    const exporter = new DocxDocumentRenderer(null, null);
    const doc = helloWorldDoc;
    const result = exporter.WriteResultToZipDictionary(doc);
    //console.log(result);
    assert.deepEqual(result["word\\Header_rId1.xml"], {type: "XmlString", xml: HelloWorldDocx.word_Header_rId1_xml});
    assert.deepEqual(result["word\\document.xml"], {type: "XmlString", xml: HelloWorldDocx.word_document_xml});
    assert.deepEqual(result["word\\_rels\\document.xml.rels"], {type: "XmlString", xml: HelloWorldDocx.word_rels_document_xml_rels});
    assert.deepEqual(result["[Content_Types].xml"], {type: "XmlString", xml: HelloWorldDocx.Content_Types_xml});
  });

});
