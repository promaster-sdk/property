import * as R from "ramda";
import * as ADPdf from "../../../src/abstract-document-exporters/pdf/render";
import * as AD from "../../../src/abstract-document";
import * as AI from "../../../src/abstract-image";
// import {assert} from "chai";
import * as fs from "fs";
// import * as path from "path";
// import {generateExample, generateHyperlink} from "../test-utils/example-document";
// import {generateText, generateTextInTable, generateMarkdownText} from "../test-utils/textrun";

const pdfKit = require("pdfkit");

describe("PdfExporter", () => {

  // it("should not crash", function(done) {
  //   const doc = generateExample();
  //   let stream = fs.createWriteStream("test.pdf");
  //   stream.on('finish', function() { done(); });
  //   ADPdf.exportToPdf(doc, stream);
  // });
  //
  // it("should render hyperlinks", function(done) {
  //   const doc = generateHyperlink();
  //   let stream = fs.createWriteStream("test_hyperlink.pdf");
  //   stream.on('finish', function() { done(); });
  //   ADPdf.exportToPdf(doc, stream);
  // });
  //
  // it("should render text", function(done) {
  //   const doc = generateText();
  //   let stream = fs.createWriteStream("test_text.pdf");
  //   stream.on('finish', function() { done(); });
  //   ADPdf.exportToPdf(doc, stream);
  // });
  //
  // it("should render text in tables", function(done) {
  //   const doc = generateTextInTable();
  //   let stream = fs.createWriteStream("test_text-in-table.pdf");
  //   stream.on('finish', function() { done(); });
  //   ADPdf.exportToPdf(doc, stream);
  // });
  //
  // it("should render simple markdown text", function(done) {
  //   const doc = generateMarkdownText(0);
  //   let stream = fs.createWriteStream("test_markdown0.pdf");
  //   stream.on('finish', function() { done(); });
  //   ADPdf.exportToPdf(doc, stream);
  // });
  //
  // it("should render more advanced markdown text", function(done) {
  //   const doc = generateMarkdownText(1);
  //   let stream = fs.createWriteStream("test_markdown1.pdf");
  //   stream.on('finish', function() { done(); });
  //   ADPdf.exportToPdf(doc, stream);
  // });
  //
  // it("should render even MORE advanced markdown text", function(done) {
  //   const doc = generateMarkdownText(2);
  //   let stream = fs.createWriteStream("test_markdown2.pdf");
  //   stream.on('finish', function() { done(); });
  //   ADPdf.exportToPdf(doc, stream);
  // });

  it("should render abstract image correctly", function(done) {
    const abstractImage = AI.createAbstractImage(AI.createPoint(0, 0), AI.createSize(200, 200), AI.white, [
      AI.createPolyLine([
        AI.createPoint(100, 0),
        AI.createPoint(100, 200),
        AI.createPoint(50, 250),
      ], AI.black, 1),
      AI.createPolyLine([AI.createPoint(0, 100), AI.createPoint(200, 100)], AI.black, 1),
      AI.createText(AI.createPoint(100, 100), "Test", "Helvetica", 10, AI.black, "normal", -90, "left", "uniform", "uniform", 0, AI.black)
    ]);
    const image = AD.ImageResource.create({id: "image", abstractImage: abstractImage});
    const doc = AD.AbstractDoc.create({imageResources: {"image": image}, children: [
      AD.Section.create({children: [
        AD.Paragraph.create({children: [
          AD.Image.create({imageResource: image, width: 100, height: 100})
        ]}),
        AD.Paragraph.create({children: [
          AD.Image.create({imageResource: image, width: 100, height: 100})
        ]})
      ]})
    ]});
    let stream = fs.createWriteStream("test_abstractimage.pdf");
    stream.on('finish', function() { done(); });
    ADPdf.exportToStream(pdfKit, stream, doc);
  });

  it("should render tables correctly", function(done) {
    const tableCellStyle = AD.TableCellStyle.create({background: "#AAAAFF", padding: AD.LayoutFoundation.create({top: 10, bottom: 20, left: 30, right: 40})});
    const doc = AD.AbstractDoc.create({children: [
      AD.Section.create({children: [
        AD.Table.create({columnWidths: [Infinity, 200], children: [
          AD.TableRow.create({children: [
            AD.TableCell.create({style: tableCellStyle, children: [
              AD.Paragraph.create({children: [
                AD.TextRun.create({text: "Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing "})
              ]})
            ]}),
            AD.TableCell.create({style: tableCellStyle, children: [
              AD.Paragraph.create({children: [
                AD.TextRun.create({text: "Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing "})
              ]})
            ]})
          ]})
        ]})
      ]})
    ]});
    let stream = fs.createWriteStream("test_table.pdf");
    stream.on('finish', function() { done(); });
    ADPdf.exportToStream(pdfKit, stream, doc);
  });

  it("should render paragraphs in Daxline correctly", function(done) {
    const fonts = {
      "Daxline": AD.Font.create({
        normal: "DaxlinePro-Regular_13131.ttf",
        bold: "DaxlinePro-Regular_13131.ttf",
        italic: "DaxlinePro-Regular_13131.ttf",
        boldItalic: "DaxlinePro-Regular_13131.ttf"
      }),
    };
    const fontStyle = AD.TextStyle.create({fontFamily: "Daxline"});
    const doc = AD.AbstractDoc.create({fonts: fonts, children: [
        AD.Section.create({children: [
          AD.Paragraph.create({styleName: "H1", children: [
            AD.TextRun.create({text: "Testing"})
          ]}),
          AD.Paragraph.create({styleName: "H2", children: [
            AD.TextRun.create({style: fontStyle, text: "Testing"})
          ]}),
          AD.Paragraph.create({styleName: "H3", children: [
            AD.TextRun.create({style: fontStyle, text: "Testing"})
          ]}),
          AD.Paragraph.create({children: [
            AD.TextRun.create({style: fontStyle, text: "Testing paragraph 1"})
          ]}),
          AD.Paragraph.create({children: [
            AD.TextRun.create({style: fontStyle, text: "Testing paragraph 2"})
          ]}),
        ]})
      ]
    });
    let stream = fs.createWriteStream("test_paragraphstyling_daxline.pdf");
    stream.on('finish', function() { done(); });
    ADPdf.exportToStream(pdfKit, stream, doc);
  });

  it("should render paragraphs in Arial correctly", function(done) {
    const fonts = {
      "Arial": AD.Font.create({
        normal: "Arial.ttf",
        bold: "Arial-Bold.ttf",
        italic: "Arial-Oblique.ttf",
        boldItalic: "Arial-BoldOblique.ttf"
      }),
    };
    const fontStyle = AD.TextStyle.create({fontFamily: "Arial"});
    const doc = AD.AbstractDoc.create({fonts: fonts, children: [
      AD.Section.create({children: [
        AD.Paragraph.create({styleName: "H1", children: [
          AD.TextRun.create({style: fontStyle, text: "Testing"})
        ]}),
        AD.Paragraph.create({styleName: "H2", children: [
          AD.TextRun.create({style: fontStyle, text: "Testing"})
        ]}),
        AD.Paragraph.create({styleName: "H3", children: [
          AD.TextRun.create({style: fontStyle, text: "Testing"})
        ]}),
        AD.Paragraph.create({children: [
          AD.TextRun.create({style: fontStyle, text: "Testing paragraph 1"})
        ]}),
        AD.Paragraph.create({children: [
          AD.TextRun.create({style: fontStyle, text: "Testing paragraph 2"})
        ]}),
      ]})
    ]
    });
    let stream = fs.createWriteStream("test_paragraphstyling_arial.pdf");
    stream.on('finish', function() { done(); });
    ADPdf.exportToStream(pdfKit, stream, doc);
  });

  it("should render page number correctly", function(done) {
    const doc = AD.AbstractDoc.create({children: [
      AD.Section.create({children: [
        AD.Paragraph.create({children: [
          AD.TextField.create({fieldType: "PageNumber"})
        ]})
      ]}),
      AD.Section.create({children: [
        AD.Paragraph.create({children: [
          AD.TextField.create({fieldType: "PageNumber"})
        ]})
      ]}),
      AD.Section.create({children: [
        AD.Paragraph.create({children: [
          AD.TextField.create({fieldType: "PageNumber"})
        ]})
      ]})
    ]});
    let stream = fs.createWriteStream("test_pagenumber.pdf");
    stream.on('finish', function() { done(); });
    ADPdf.exportToStream(pdfKit, stream, doc);
  });

  it("should render header and footer correctly", function(done) {
    const pageStyle = AD.PageStyle.create({
      headerMargins: AD.LayoutFoundation.create({bottom: 50}),
      contentMargins: AD.LayoutFoundation.create({left: 30, right: 20}),
      footerMargins: AD.LayoutFoundation.create({top: 50}),
    });
    const header = [
      AD.Paragraph.create({children: [
        AD.TextRun.create({text: "Header"}),
        AD.TextField.create({fieldType: "PageNumber"})
      ]})
    ];
    const footer = [
      AD.Paragraph.create({children: [
        AD.TextRun.create({text: "Footer"}),
        AD.TextField.create({fieldType: "PageNumber"})
      ]})
    ];
    const page = AD.MasterPage.create({style: pageStyle, header: header, footer: footer});
    const doc = AD.AbstractDoc.create({children: [
      AD.Section.create({page: page, children: R.range(0, 100).map(() =>
        AD.Paragraph.create({children: [
          AD.TextField.create({fieldType: "PageNumber"})
        ]})
      )}),
    ]});
    let stream = fs.createWriteStream("test_headerfooter.pdf");
    stream.on('finish', function() { done(); });
    ADPdf.exportToStream(pdfKit, stream, doc);
  });
});

