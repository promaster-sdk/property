import * as R from "ramda";
import * as AD from "../../abstract-document/index";

const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

const _numberingLevelItems = new Map<string, number>();

export function preProcess(doc: AD.AbstractDoc.AbstractDoc): AD.AbstractDoc.AbstractDoc {
  const sections = doc.sections.map((s) => preProcessSection(s, doc));
  return AD.AbstractDoc.create({sections, imageResources: doc.imageResources, styles: doc.styles, numberings: doc.numberings, numberingDefinitions: doc.numberingDefinitions});
}

function preProcessSection(s: AD.Section.Section, doc: AD.AbstractDoc.AbstractDoc): AD.Section.Section {
  const sectionElements = s.sectionElements.map((e) => preProcessSectionElement(e, doc));
  return AD.Section.create({page: s.page, sectionElements});
}

function preProcessSectionElement(e: AD.SectionElement.SectionElement, doc: AD.AbstractDoc.AbstractDoc): AD.SectionElement.SectionElement {
  switch (e.type) {
    case "Paragraph":
      return preProcessParagraph(e, doc);
    case "Table":
      return preProcessTable(e, doc);
    case "KeepTogether":
      return preProcessKeepTogether(e, doc);
  }
}

function preProcessParagraph(paragraph: AD.Paragraph.Paragraph, doc: AD.AbstractDoc.AbstractDoc): AD.SectionElement.SectionElement {
  const atoms = R.unnest(paragraph.atoms.map((a) => preProcessAtom(a)));
  const adjustedParagraph = AD.Paragraph.create({
    styleName: paragraph.styleName,
    paragraphProperties: paragraph.paragraphProperties,
    textProperties: paragraph.textProperties,
    atoms,
    numbering: paragraph.numbering
  });

  if (paragraph.numbering === undefined)
    return adjustedParagraph;

  const numbering = paragraph.numbering.numberingId;
  const level = paragraph.numbering.level;
  const key = numbering + "_" + level.toString();
  const levelDefinitions = doc.numberingDefinitions[numbering].levels;
  for (let levelDefinition of levelDefinitions.filter((l) => l.level > level))
    _numberingLevelItems.delete(numbering + "_" + levelDefinition.level.toString());

  let numberText = levelDefinitions[level].levelText;
  const indentationWidth = AD.AbstractLength.asPoints(levelDefinitions[level].levelIndention);
  if (!_numberingLevelItems.has(key))
    _numberingLevelItems.set(key, levelDefinitions[level].start);
  else
    _numberingLevelItems.set(key, _numberingLevelItems.get(key) + 1);

  for (let levelDefinition of levelDefinitions.filter((l) => l.level <= level)) {
    const numberingLevel = numbering + "_" + levelDefinition.level.toString();
    const levelText = generateLevelText(levelDefinition.format, _numberingLevelItems.get(numberingLevel) || 0);
    numberText = numberText.replace("%" + (levelDefinition.level + 1).toString(), levelText);
  }

  let rows: Array<AD.TableRow.TableRow> = [];
  let cells: Array<AD.TableCell.TableCell> = [];
  const noBorder = AD.LayoutFoundation.create<number | undefined>({top: undefined, bottom: undefined, left: undefined, right: undefined});

  const c1Elements: Array<AD.SectionElement.SectionElement> = [
    AD.Paragraph.create({
      styleName: "",
      paragraphProperties: paragraph.paragraphProperties,
      textProperties: paragraph.textProperties,
      atoms: [AD.TextRun.create({text: "", textProperties: paragraph.textProperties})]
    })
  ];
  cells.push(AD.TableCell.create({
    tableCellProperties: AD.TableCellProperties.create({borders: noBorder, padding: noBorder, verticalAlignment: "Top"}),
    columnSpan: 1,
    elements: c1Elements
  }));

  const textProps = levelDefinitions[level].textProperties;
  if (textProps === undefined)
    throw new Error("Missing level definition for level " + level);

  const c2Elements = [
    AD.Paragraph.create({
      styleName: paragraph.styleName,
      paragraphProperties: paragraph.paragraphProperties,
      textProperties: textProps,
      atoms: [AD.TextRun.create({text: numberText, textProperties: textProps})]
    })
  ];
  cells.push(AD.TableCell.create({
    tableCellProperties: AD.TableCellProperties.create({borders: noBorder, padding: noBorder, verticalAlignment: "Top"}),
    columnSpan: 1,
    elements: c2Elements
  }));

  const c3Elements = [
    adjustedParagraph
  ];
  cells.push(AD.TableCell.create({
    tableCellProperties: AD.TableCellProperties.create({borders: noBorder, padding: noBorder, verticalAlignment: "Top"}),
    columnSpan: 1,
    elements: c3Elements
  }));
  rows.push(AD.TableRow.create({height: NaN, cells}));

  return AD.Table.create({
    tableProperties: AD.TableProperties.create("Left"), tableCellProperties: AD.TableCellProperties.create({
      borders: noBorder,
      padding: noBorder,
      verticalAlignment: "Top"
    }), columnWidths: [indentationWidth - 40, 40, Infinity], rows
  });
}

function generateLevelText(numberingFormat: AD.NumberingFormat.NumberingFormat, num: number): string {
  switch (numberingFormat) {
    case "Decimal":
      return num.toString();
    case "DecimalZero":
      return num > 9 ? num.toString() : ("0" + num.toString());
    case "LowerLetter":
      return toChar(num - 1).toLowerCase();
    case "UpperLetter":
      return toChar(num - 1).toUpperCase();
    case "LowerRoman":
      return toRoman(num).toLowerCase();
    case "UpperRoman":
      return toRoman(num).toUpperCase();
  }
}

function toRoman(n: number): string {
  if ((n < 0) || (n > 3999))
    throw new Error("number is out of range for Roman letters");
  else if (n < 1)
    return "";
  else if (n >= 1000)
    return "M" + toRoman(n - 1000);
  else if (n >= 900)
    return "CM" + toRoman(n - 900);
  else if (n >= 500)
    return "D" + toRoman(n - 500);
  else if (n >= 400)
    return "CD" + toRoman(n - 400);
  else if (n >= 100)
    return "C" + toRoman(n - 100);
  else if (n >= 90)
    return "XC" + toRoman(n - 90);
  else if (n >= 50)
    return "L" + toRoman(n - 50);
  else if (n >= 40)
    return "XL" + toRoman(n - 40);
  else if (n >= 10)
    return "X" + toRoman(n - 10);
  else if (n >= 9)
    return "IX" + toRoman(n - 9);
  else if (n >= 5)
    return "V" + toRoman(n - 5);
  else if (n >= 4)
    return "IV" + toRoman(n - 4);
  else
    return "I" + toRoman(n - 1);
}

function toChar(num: number): string {
  let builder = "";
  do
  {
    const character = num % alphabet.length;
    builder = alphabet[character] + builder;
    num /= alphabet.length;
  } while (num > alphabet.length);
  return builder;
}

function preProcessAtom(a: AD.Atom.Atom): Array<AD.Atom.Atom> {
  if (a.type === "TextRun")
    return preProcessTextRun(a);
  return [a];
}

function preProcessTextRun(r: AD.TextRun.TextRun): Array<AD.Atom.Atom> {
  const text = !r.text ? [""] : r.text.split(' ');
  return R.addIndex(R.map)((s, i) => AD.TextRun.create({
    text: s + (i == text.length - 1 ? "" : " "),
    styleName: r.styleName,
    textProperties: r.textProperties
  }), text);
}

function preProcessTable(table: AD.Table.Table, doc: AD.AbstractDoc.AbstractDoc): AD.SectionElement.SectionElement {
  const rows = table.rows.map((r) => preProcessTableRow(r, doc));
  return AD.Table.create({
    styleName: table.styleName,
    tableProperties: table.tableProperties,
    tableCellProperties: table.tableCellProperties,
    columnWidths: table.columnWidths,
    rows
  });
}

function preProcessTableRow(r: AD.TableRow.TableRow, doc: AD.AbstractDoc.AbstractDoc): AD.TableRow.TableRow {
  const cells = r.cells.map((c) => preProcessTableCell(c, doc));
  return AD.TableRow.create({height: r.height, cells});
}

function preProcessTableCell(c: AD.TableCell.TableCell, doc: AD.AbstractDoc.AbstractDoc): AD.TableCell.TableCell {
  const elements = c.elements.map((e) => preProcessSectionElement(e, doc));
  return AD.TableCell.create({styleName: c.styleName, tableCellProperties: c.tableCellProperties, columnSpan: c.columnSpan, elements});
}

function preProcessKeepTogether(keepTogether: AD.KeepTogether.KeepTogether, doc: AD.AbstractDoc.AbstractDoc): AD.SectionElement.SectionElement {
  const sectionElements = keepTogether.sectionElements.map((e) => preProcessSectionElement(e, doc));
  return AD.KeepTogether.create({sectionElements});
}
