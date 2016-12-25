import * as AD from "../../abstract-document/index";
import {preProcess} from "./pre-process";
import {measure} from "./measure";
import * as BlobStream from "blob-stream";
import {renderImage} from "./render-image";
import * as AbstractImage from "../../abstract-image";

export function exportToPdfPromise(doc: AD.AbstractDoc.AbstractDoc) {
  const PDFDocument = require("pdfkit");
  return new Promise((resolve) => {
    const document = preProcess(doc);
    const desiredSizes = measure(document);

    let pdf = new PDFDocument({compress: false, autoFirstPage: false}) as any;
    for (let section of document.sections)
      renderSection(document, pdf, desiredSizes, section, undefined);

    const stream = pdf.pipe(BlobStream());
    pdf.end();
    stream.on("finish", () => { resolve(stream); });
  });
}

export function exportToPdf(doc: AD.AbstractDoc.AbstractDoc, stream: any) {
  const PDFDocument = require("pdfkit");
  const document = preProcess(doc);
  const desiredSizes = measure(document);
  let pdf = new PDFDocument({compress: false, autoFirstPage: false}) as any;
  for (let section of document.sections)
    renderSection(document, pdf, desiredSizes, section, undefined);
  pdf.pipe(stream);
  pdf.end();
}

function renderSection(doc: AD.AbstractDoc.AbstractDoc, pdf: any, desiredSizes: Map<any, AD.Size.Size>, section: AD.Section.Section, totalPages: number | undefined) {
  const pageWidth = AD.PageStyle.getWidth(section.page.style);
  const pageHeight = AD.PageStyle.getHeight(section.page.style);
  const layout = section.page.style.orientation === "Landscape" ? "landscape" : "portrait";
  const pageOptions = {
    size: [pageWidth, pageHeight],
    layout: layout,
    margins: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  };
  pdf.addPage(pageOptions);

  let x = section.page.style.margins.left;
  let y = section.page.style.margins.top;
  let renderHeader = true;
  for (let element of section.sectionElements) {
    const elementSize = getDesiredSize(element, desiredSizes);
    if (y + elementSize.height > (pageHeight - section.page.style.margins.bottom)) {
      pdf.addPage(pageOptions);
      y = section.page.style.margins.top;
      renderHeader = true;
    }

    if (renderHeader) {
      for (let headerElement of section.page.header) {
        const headerElementSize = getDesiredSize(headerElement, desiredSizes);
        renderSectionElement(doc, pdf, desiredSizes, AD.Rect.create(x, y, headerElementSize.width, headerElementSize.height), headerElement, totalPages);
        y += headerElementSize.height;
      }
      renderHeader = false;
    }

    renderSectionElement(doc, pdf, desiredSizes, AD.Rect.create(x, y, elementSize.width, elementSize.height), element, totalPages);
    y += elementSize.height;
  }
}

function renderSectionElement(doc: AD.AbstractDoc.AbstractDoc, pdf: any, desiredSizes: Map<any, AD.Size.Size>, finalRect: AD.Rect.Rect, element: AD.SectionElement.SectionElement, totalPages: number | undefined) {
  switch (element.type) {
    case "Paragraph":
      renderParagraph(doc, pdf, desiredSizes, finalRect, element, totalPages);
      return;
    case "Table":
      renderTable(doc, pdf, desiredSizes, finalRect, element, totalPages);
      return;
    case "KeepTogether":
      renderKeepTogether(doc, pdf, desiredSizes, finalRect, element, totalPages);
      return;
  }
}

function renderParagraph(doc: AD.AbstractDoc.AbstractDoc, pdf: any, desiredSizes: Map<any, AD.Size.Size>, finalRect: AD.Rect.Rect, paragraph: AD.Paragraph.Paragraph, totalPages: number | undefined) {
  const availableWidth = finalRect.width;

  let rows: Array<Array<AD.Atom.Atom>> = [];
  let currentRow: Array<AD.Atom.Atom> = [];
  let currentWidth = 0;
  for (const atom of paragraph.atoms) {
    const atomSize = getDesiredSize(atom, desiredSizes);
    if (currentWidth + atomSize.width >= availableWidth) {
      rows.push(currentRow);
      currentRow = [];
      currentWidth = 0;
    }
    currentRow.push(atom);
    currentWidth += atomSize.width;
  }
  if (currentRow.length > 0)
    rows.push(currentRow);

  const effectiveParaProps = AD.Paragraph.getEffectiveParagraphProperties(doc.styles, paragraph);

  let y = finalRect.y;
  if (effectiveParaProps.spacingBefore !== undefined)
    y += AD.AbstractLength.asPoints(effectiveParaProps.spacingBefore);

  for (let row of rows) {
    const rowWidth = row.reduce((a, b) => a + getDesiredSize(b, desiredSizes).width, 0);
    let x = finalRect.x;
    if (effectiveParaProps.alignment === "Center")
      x = finalRect.x + 0.5 * (availableWidth - rowWidth);
    else if (effectiveParaProps.alignment === "End")
      x = finalRect.x + availableWidth - rowWidth;

    let rowHeight = 0;
    for (const atom of row) {
      const atomSize = getDesiredSize(atom, desiredSizes);
      rowHeight = Math.max(rowHeight, atomSize.height);
      renderAtom(doc, pdf, AD.Rect.create(x, y, atomSize.width, atomSize.height), atom, totalPages);
      x += atomSize.width;
    }

    y += rowHeight;
  }
}

function renderKeepTogether(doc: AD.AbstractDoc.AbstractDoc, pdf: any, desiredSizes: Map<any, AD.Size.Size>, finalRect: AD.Rect.Rect, keepTogether: AD.KeepTogether.KeepTogether, totalPages: number | undefined) {
  let y = finalRect.y;
  for (const element of keepTogether.sectionElements) {
    const elementSize = getDesiredSize(element, desiredSizes);
    renderSectionElement(doc, pdf, desiredSizes, AD.Rect.create(finalRect.x, y, elementSize.width, elementSize.height), element, totalPages);
    y += elementSize.height;
  }
}

function renderAtom(doc: AD.AbstractDoc.AbstractDoc, pdf: any, finalRect: AD.Rect.Rect, atom: AD.Atom.Atom, totalPages: number | undefined) {
  switch (atom.type) {
    case "TextField":
      renderTextField(doc, pdf, finalRect, atom, totalPages);
      return;
    case "TextRun":
      renderTextRun(doc, pdf, finalRect, atom);
      return;
    case "Image":
      renderImage(pdf, finalRect, atom);
      return;
    case "HyperLink":
      renderHyperLink(doc, pdf, finalRect, atom);
      return;
  }
}

function renderTextField(doc: AD.AbstractDoc.AbstractDoc, pdf: any, finalRect: AD.Rect.Rect, textField: AD.TextField.TextField, totalPages: number | undefined) {
  const effectiveStyle = AD.TextField.getEffectiveStyle(doc.styles, textField);
  switch (textField.fieldType) {
    case "Date":
      drawText(pdf, finalRect, effectiveStyle.textProperties, new Date(Date.now()).toDateString());
      return;
    case "PageNumber":
      drawText(pdf, finalRect, effectiveStyle.textProperties, pdf.bufferedPageRange().count.toString() + (totalPages ? "" : (" (" + totalPages + ")")));
      return;
  }
}

function renderTextRun(doc: AD.AbstractDoc.AbstractDoc, pdf: any, finalRect: AD.Rect.Rect, text: AD.TextRun.TextRun) {
  const effectiveTextProperties = AD.TextRun.getEffectiveTextProperties(doc.styles, text);
  drawText(pdf, finalRect, effectiveTextProperties, text.text);
}

function renderHyperLink(doc: AD.AbstractDoc.AbstractDoc, pdf: any, finalRect: AD.Rect.Rect, hyperLink: AD.HyperLink.HyperLink) {
  const effectiveTextProperties = AD.HyperLink.getEffectiveTextProperties(doc.styles, hyperLink);
  drawHyperLink(pdf, finalRect, effectiveTextProperties, hyperLink);
}

function drawHyperLink(pdf: any, finalRect: AD.Rect.Rect, textProperties: AD.TextProperties.TextProperties, hyperLink: AD.HyperLink.HyperLink) {
  let features: Array<string> = [];
  if (textProperties.italic) features.push("ital");
  if (textProperties.subScript) features.push("subs");
  if (textProperties.superScript) features.push("sups");

  pdf
    .font(/*textProperties.fontFamily || */"Helvetica", /*textProperties.fontFamily || */"Helvetica", textProperties.fontSize || 10)
    .fillColor(textProperties.color || "blue")
    .text(hyperLink.text, finalRect.x, finalRect.y, {
      width: finalRect.width,
      height: finalRect.height,
      underline: textProperties.underline || false,
      features: features,
    })
    .underline(finalRect.x, finalRect.y, finalRect.width, finalRect.height, { color: "blue" })
    .link(finalRect.x, finalRect.y, finalRect.width, finalRect.height, hyperLink.target);
}

function drawText(pdf: any, finalRect: AD.Rect.Rect, textProperties: AD.TextProperties.TextProperties, text: string) {
  let features: Array<string> = [];
  if (textProperties.italic) features.push("ital");
  if (textProperties.subScript) features.push("subs");
  if (textProperties.superScript) features.push("sups");

  pdf
    .font(/*textProperties.fontFamily || */"Helvetica", /*textProperties.fontFamily || */"Helvetica", textProperties.fontSize || 10)
    .fillColor(textProperties.color || "black")
    .text(text, finalRect.x, finalRect.y, {
      width: finalRect.width,
      height: finalRect.height,
      underline: textProperties.underline || false,
      features: features,
    });
}

function renderTable(doc: AD.AbstractDoc.AbstractDoc, pdf: any, desiredSizes: Map<any, AD.Size.Size>, finalRect: AD.Rect.Rect, table: AD.Table.Table, totalPages: number | undefined) {
  let y = finalRect.y;
  for (let row of table.rows) {
    const rowSize = getDesiredSize(row, desiredSizes);
    const rowRect = AD.Rect.create(finalRect.x, y, rowSize.width, rowSize.height);
    renderRow(doc, pdf, desiredSizes, rowRect, table, row, totalPages);
    y += rowSize.height;
  }
}

function renderRow(doc: AD.AbstractDoc.AbstractDoc, pdf: any, desiredSizes: Map<any, AD.Size.Size>, finalRect: AD.Rect.Rect, table: AD.Table.Table, row: AD.TableRow.TableRow, totalPages: number | undefined) {
  let x = finalRect.x;
  for (const cell of row.cells) {
    const cellSize = getDesiredSize(cell, desiredSizes);
    const cellRect = AD.Rect.create(x, finalRect.y, cellSize.width, cellSize.height);
    renderCell(doc, pdf, desiredSizes, cellRect, table, cell, totalPages);
    x += cellSize.width;
  }
}

function renderCell(doc: AD.AbstractDoc.AbstractDoc, pdf: any, desiredSizes: Map<any, AD.Size.Size>, finalRect: AD.Rect.Rect, table: AD.Table.Table, cell: AD.TableCell.TableCell, totalPages: number | undefined) {
  const cellEffectiveStyle = AD.TableCell.getEffectiveTableCellProperties(table, cell);
  if (cellEffectiveStyle.background && cellEffectiveStyle.background.a > 0) {
    const colorHex = "#"+AbstractImage.toString6Hex(cellEffectiveStyle.background) || "#000";
    pdf.rect(finalRect.x, finalRect.y, finalRect.width, finalRect.height)
      .fillOpacity(cellEffectiveStyle.background.a / 255)
      .fillAndStroke(colorHex, colorHex)
  }

  let y = finalRect.y;
  for (const element of cell.elements) {
    const elementSize = getDesiredSize(element, desiredSizes);
    const elementRect = AD.Rect.create(finalRect.x, y, finalRect.width, elementSize.height);
    renderSectionElement(doc, pdf, desiredSizes, elementRect, element, totalPages);
    y += elementSize.height;
  }

  if (cellEffectiveStyle.borders.top) {
    pdf.moveTo(finalRect.x, finalRect.y)
      .lineTo(finalRect.x + finalRect.width, finalRect.y)
      .stroke();
  }
  if (cellEffectiveStyle.borders.bottom) {
    pdf.moveTo(finalRect.x, finalRect.y + finalRect.height)
      .lineTo(finalRect.x + finalRect.width, finalRect.y + finalRect.height)
      .stroke();
  }
  if (cellEffectiveStyle.borders.left) {
    pdf.moveTo(finalRect.x, finalRect.y)
      .lineTo(finalRect.x, finalRect.y + finalRect.height)
      .stroke();
  }
  if (cellEffectiveStyle.borders.right) {
    pdf.moveTo(finalRect.x + finalRect.width, finalRect.y)
      .lineTo(finalRect.x + finalRect.width, finalRect.y + finalRect.height)
      .stroke();
  }
}

function getDesiredSize(element: any, desiredSizes: Map<any, AD.Size.Size>): AD.Size.Size {
  const size = desiredSizes.get(element);
  if (size) {
    return size;
  }
  throw new Error("Could not find size for element!");
}
