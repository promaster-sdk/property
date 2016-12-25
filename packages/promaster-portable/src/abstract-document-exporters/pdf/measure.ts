import * as R from "ramda";
import * as AD from "../../abstract-document/index";

export function measure(document: AD.AbstractDoc.AbstractDoc): Map<any, AD.Size.Size> {
  return mergeMaps(document.sections.map((s) => measureSection(document, s)));
}

function measureSection(doc: AD.AbstractDoc.AbstractDoc, section: AD.Section.Section): Map<any, AD.Size.Size> {
  const availableWidth = AD.PageStyle.getWidth(section.page.style) - (section.page.style.margins.left + section.page.style.margins.right);
  const availableHeight = AD.PageStyle.getHeight(section.page.style) - (section.page.style.margins.top + section.page.style.margins.bottom);
  const availableSize = AD.Size.create(availableWidth, availableHeight);
  const sectionSizes = section.sectionElements.map((e) => measureSectionElement(doc, availableSize, e));
  const headerSizes = section.page.header.map((e) => measureSectionElement(doc, availableSize, e));
  return mergeMaps(R.concat(sectionSizes, headerSizes));
}

function measureSectionElement(doc: AD.AbstractDoc.AbstractDoc, availableSize: AD.Size.Size, element: AD.SectionElement.SectionElement): Map<any, AD.Size.Size> {
  switch (element.type) {
    case "Paragraph":
      return measureParagraph(doc, availableSize, element);
    case "Table":
      return measureTable(doc, availableSize, element);
    case "KeepTogether":
      return measureKeepTogether(doc, availableSize, element);
  }
}

function measureParagraph(doc: AD.AbstractDoc.AbstractDoc, availableSize: AD.Size.Size, paragraph: AD.Paragraph.Paragraph): Map<any, AD.Size.Size> {
  let desiredHeight = 0;
  let currentRowWidth = 0;
  let currentRowHeight = 0;
  let desiredSizes = new Map<any, AD.Size.Size>();
  for (let atom of paragraph.atoms) {
    const atomSize = measureAtom(doc, availableSize, atom);
    desiredSizes.set(atom, atomSize);
    if (currentRowWidth + atomSize.width >= availableSize.width) {
      desiredHeight += currentRowHeight;
      currentRowWidth = 0;
      currentRowHeight = 0;
    }
    currentRowWidth += atomSize.width;
    currentRowHeight = Math.max(atomSize.height, currentRowHeight);
  }
  desiredHeight += currentRowHeight;

  const properties = AD.Paragraph.getEffectiveParagraphProperties(doc.styles, paragraph);
  if (properties.spacingBefore !== undefined)
    desiredHeight += AD.AbstractLength.asPoints(properties.spacingBefore);
  if (properties.spacingAfter !== undefined)
    desiredHeight += AD.AbstractLength.asPoints(properties.spacingAfter);

  desiredSizes.set(paragraph, AD.Size.create(availableSize.width, desiredHeight));

  return desiredSizes;
}

function measureTable(doc: AD.AbstractDoc.AbstractDoc, availableSize: AD.Size.Size, table: AD.Table.Table): Map<any, AD.Size.Size> {
  const numInfinityColumns = table.columnWidths.filter((w) => !isFinite(w)).length;
  const fixedColumnsWidth = table.columnWidths.filter((w) => isFinite(w)).reduce((a, b) => a + b, 0);
  const infinityWidth = (availableSize.width - fixedColumnsWidth) / numInfinityColumns;
  const columnWidths = table.columnWidths.map((w) => isFinite(w) ? w : infinityWidth);
  const desiredSizes = new Map<any, AD.Size.Size>();

  for (let row of table.rows) {
    let column = 0;
    let availableHeight = isFinite(row.height) ? row.height : Infinity;
    for (let cell of row.cells) {
      const cellWidth = columnWidths.slice(column, column + cell.columnSpan).reduce((a, b) => a + b, 0);
      let cellAvailableHeight = availableHeight;
      let cellDesiredHeight = 0.0;

      for (let element of cell.elements) {
        const elementAvailableSize = AD.Size.create(cellWidth, cellAvailableHeight);
        const elementSizes = measureSectionElement(doc, elementAvailableSize, element);
        elementSizes.forEach((v, k) => desiredSizes.set(k, v));
        const elementSize = getDesiredSize(element, desiredSizes);
        cellDesiredHeight += elementSize.height;
        cellAvailableHeight -= elementSize.height;
      }

      desiredSizes.set(cell, AD.Size.create(cellWidth, cellDesiredHeight));
      column += cell.columnSpan;
    }
  }

  const desiredWidth = table.columnWidths.some((w) => !isFinite(w)) ? availableSize.width : table.columnWidths.reduce((a, b) => a + b, 0);

  let desiredHeight = 0.0;
  for (let row of table.rows) {
    let rowHeight = isFinite(row.height) ? row.height : row.cells.map((c) => getDesiredSize(c, desiredSizes).height).reduce((a, b) => Math.max(a, b), 0);
    desiredHeight += rowHeight;
    desiredSizes.set(row, AD.Size.create(desiredWidth, rowHeight));
  }

  desiredSizes.set(table, AD.Size.create(desiredWidth, desiredHeight));

  return desiredSizes;
}

function measureKeepTogether(doc: AD.AbstractDoc.AbstractDoc, availableSize: AD.Size.Size, keepTogether: AD.KeepTogether.KeepTogether) {
  let desiredSizes = mergeMaps(keepTogether.sectionElements.map((e) => measureSectionElement(doc, availableSize, e)));
  let desiredHeight = R.reduce((sum, e) => sum + getDesiredSize(e, desiredSizes).height, 0.0, keepTogether.sectionElements);
  desiredSizes.set(keepTogether, AD.Size.create(availableSize.width, desiredHeight));
  return desiredSizes;
}

function measureAtom(doc: AD.AbstractDoc.AbstractDoc, availableSize: AD.Size.Size, atom: AD.Atom.Atom): AD.Size.Size {
  switch (atom.type) {
    case "TextRun":
      return measureTextRun(doc, atom);
    case "TextField":
      return measureTextField(doc, atom);
    case "Image":
      return measureImage(availableSize, atom);
    case "HyperLink":
      return measureHyperLink(doc, atom);
  }
}

function measureTextRun(doc: AD.AbstractDoc.AbstractDoc, textRun: AD.TextRun.TextRun): AD.Size.Size {
  return measureText(textRun.text, AD.TextRun.getEffectiveTextProperties(doc.styles, textRun));
}

function measureHyperLink(doc: AD.AbstractDoc.AbstractDoc, hyperLink: AD.HyperLink.HyperLink): AD.Size.Size {
  return measureText(hyperLink.text, AD.HyperLink.getEffectiveTextProperties(doc.styles, hyperLink));
}

function measureTextField(doc: AD.AbstractDoc.AbstractDoc, textField: AD.TextField.TextField): AD.Size.Size {
  switch (textField.fieldType) {
    case "Date":
      return measureText(new Date(Date.now()).toDateString(), AD.TextField.getEffectiveStyle(doc.styles, textField).textProperties);
    case "PageNumber":
      return measureText("Page 999 (999)", AD.TextField.getEffectiveStyle(doc.styles, textField).textProperties);
  }
}

function measureImage(availableSize: AD.Size.Size, image: AD.Image.Image): AD.Size.Size {
  const desiredWidth = isFinite(image.width) ? image.width : availableSize.width;
  const desiredHeight = isFinite(image.height) ? image.height : availableSize.height;
  return AD.Size.create(desiredWidth, desiredHeight);
}

function measureText(text: string, textProperties: AD.TextProperties.TextProperties): AD.Size.Size {
  const PDFDocument = require("pdfkit");

  let pdf = new PDFDocument();
  pdf.font(/*textProperties.fontFamily || */"Helvetica", /*textProperties.fontFamily || */"Helvetica", textProperties.fontSize || 10);
  const width = pdf.widthOfString(text);
  const height = pdf.heightOfString(text);
  return AD.Size.create(width, height);
}

function mergeMaps(maps: Array<Map<any, AD.Size.Size>>): Map<any, AD.Size.Size> {
  let newMap = new Map<any, AD.Size.Size>();
  maps.forEach((m) => m.forEach((v, k) => newMap.set(k, v)));
  return newMap;
}

function getDesiredSize(element: any, desiredSizes: Map<any, AD.Size.Size>): AD.Size.Size {
  const size = desiredSizes.get(element);
  if (size) {
    return size;
  }
  throw new Error("Could not find size for element!");
}
