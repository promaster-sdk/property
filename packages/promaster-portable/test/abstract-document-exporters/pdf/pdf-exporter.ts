import * as ADPdf from "../../../src/abstract-document-exporters/pdf/render";
// import {assert} from "chai";
import * as fs from "fs";
// import * as path from "path";
import {generateExample, generateHyperlink} from "../test-utils/example-document";

describe("PdfExporter", () => {

  it("should not crash", function(done) {
    const doc = generateExample();
    let stream = fs.createWriteStream("test.pdf");
    stream.on('finish', function() {
      console.log("Done!");
      done();
    });
    ADPdf.exportToPdf(doc, stream);
  });

  it("should render hyperlinks", function(done) {
    const doc = generateHyperlink();
    // console.log("doc", doc); //tslint:disable-line
    let stream = fs.createWriteStream("test_hyperlink.pdf");
    stream.on('finish', function() { console.log("Done!"); done(); });
    ADPdf.exportToPdf(doc, stream);
  });
});