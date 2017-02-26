import * as R from "ramda";
import * as AD from "../../abstract-document/index";

const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

const _numberingLevelItems = new Map<string, number>();

export function preProcess(doc: AD.AbstractDoc.AbstractDoc): AD.AbstractDoc.AbstractDoc {
  const children = doc.children.map((s) => preProcessSection(s, doc));
  return AD.AbstractDoc.create({children: children, fonts: doc.fonts, imageResources: doc.imageResources, styles: doc.styles, numberings: doc.numberings, numberingDefinitions: doc.numberingDefinitions});
}

function preProcessSection(s: AD.Section.Section, doc: AD.AbstractDoc.AbstractDoc): AD.Section.Section {
  const header = R.unnest(s.page.header.map((e) => preProcessSectionElement(e, doc)));
  const footer = R.unnest(s.page.footer.map((e) => preProcessSectionElement(e, doc)));
  const page = AD.MasterPage.create({style: s.page.style, header: header, footer: footer});
  const children = R.unnest(s.children.map((e) => preProcessSectionElement(e, doc)));
  return AD.Section.create({page: page, children});
}

function preProcessSectionElement(e: AD.SectionElement.SectionElement, doc: AD.AbstractDoc.AbstractDoc): Array<AD.SectionElement.SectionElement> {
  switch (e.type) {
    case "Paragraph":
      return preProcessParagraph(e, doc);
    case "Table":
      return [preProcessTable(e, doc)];
    case "KeepTogether":
      return [preProcessKeepTogether(e, doc)];
  }
}

function preProcessParagraph(paragraph: AD.Paragraph.Paragraph, doc: AD.AbstractDoc.AbstractDoc): Array<AD.SectionElement.SectionElement> {
  const adjustedParagraphs = adjustParagraph(paragraph);

  if (paragraph.numbering === undefined){
    return adjustedParagraphs;
  }

  const numbering = paragraph.numbering.numberingId;
  const level = paragraph.numbering.level;
  const key = numbering + "_" + level.toString();
  const levelDefinitions = doc.numberingDefinitions[numbering].levels;
  for (let levelDefinition of levelDefinitions.filter((l) => l.level > level))
    _numberingLevelItems.delete(numbering + "_" + levelDefinition.level.toString());

  let numberText = levelDefinitions[level].levelText;
  const indentationWidth = levelDefinitions[level].levelIndention;
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
  let children: Array<AD.TableCell.TableCell> = [];

  children.push(AD.TableCell.create());

  children.push(AD.TableCell.create({
    children: [
      AD.Paragraph.create({
        styleName: paragraph.styleName,
        children: [AD.TextRun.create({style: paragraph.style.textStyle, text: numberText})]
      })
    ]
  }));

  children.push(AD.TableCell.create({
    children: adjustedParagraphs
  }));
  rows.push(AD.TableRow.create({children}));

  return [AD.Table.create({
    style: AD.TableStyle.create({alignment: "Left", cellStyle: AD.TableCellStyle.create({verticalAlignment: "Top"})}),
    columnWidths: [indentationWidth - 40, 40, Infinity],
    children: rows
  })];
}

function adjustParagraph(paragraph: AD.Paragraph.Paragraph): Array<AD.SectionElement.SectionElement> {
  return [paragraph];
  // let adjustedParagraphs: Array<AD.SectionElement.SectionElement> = [];
  // paragraph.children.forEach((a) => {
  //   switch (a.type) {
  //     case  "TextRun":
  //       const tr = preProcessTextRun(a, paragraph);
  //       adjustedParagraphs.push(tr);
  //       break;
  //       //FIXME: remove, we moved this section to when we "import" markdown into abstract doc instead of
  //       //       to when we export it.
  //     // case  "Markdown":
  //     //   const md = preProcessMarkdown(a); // this returns more paragraphs that we need
  //     //   adjustedParagraphs = adjustedParagraphs.concat(md);
  //     //   // md.forEach((mdparagraph) => {     // adjust so run them through ourselves once.
  //     //   //   console.log("***\n", JSON.stringify(mdparagraph), "\n");
  //     //   //   const mdproc = adjustParagraph(mdparagraph);
  //     //   //   console.log("===\n", JSON.stringify(mdproc), "\n");
  //     //   //   adjustedParagraphs = adjustedParagraphs.concat(mdproc)
  //     //   // })
  //     //   break;
  //     default:
  //       const children = [a];
  //       adjustedParagraphs.push(AD.Paragraph.create({
  //         styleName: paragraph.styleName,
  //         paragraphProperties: paragraph.paragraphProperties,
  //         textProperties: paragraph.textProperties,
  //         children,
  //         numbering: paragraph.numbering
  //       }));
  //       break;
  //   }
  // });

  // return adjustedParagraphs;
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

// function preProcessTextRun(r: AD.TextRun.TextRun, paragraph: AD.Paragraph.Paragraph): AD.Paragraph.Paragraph {
//   console.log("text", r.text);
//   const text = (!r.text ? [""] : r.text.split(' ')).filter((f) => f!=="");
//   const children: Array<AD.Atom.Atom> = R.addIndex(R.map)((s, i) => AD.TextRun.create({
//     text: s + (i == text.length - 1 ? "" : " "),
//     styleName: r.styleName,
//     textProperties: r.textProperties
//   }), text);
//   console.log("children", children);
//   return AD.Paragraph.create({
//     styleName: paragraph.styleName,
//     paragraphProperties: paragraph.paragraphProperties,
//     textProperties: paragraph.textProperties,
//     children,
//     numbering: paragraph.numbering
//   });
// }

function preProcessTable(table: AD.Table.Table, doc: AD.AbstractDoc.AbstractDoc): AD.SectionElement.SectionElement {
  const children = table.children.map((r) => preProcessTableRow(r, doc));
  return AD.Table.create({
    columnWidths: table.columnWidths,
    styleName: table.styleName,
    style: table.style,
    children: children
  });
}

function preProcessTableRow(r: AD.TableRow.TableRow, doc: AD.AbstractDoc.AbstractDoc): AD.TableRow.TableRow {
  const children = r.children.map((c) => preProcessTableCell(c, doc));
  return AD.TableRow.create({children: children});
}

function preProcessTableCell(c: AD.TableCell.TableCell, doc: AD.AbstractDoc.AbstractDoc): AD.TableCell.TableCell {
  const children = R.unnest(c.children.map((e) => preProcessSectionElement(e, doc)));
  return AD.TableCell.create({styleName: c.styleName, columnSpan: c.columnSpan, style: c.style, children: children});
}

function preProcessKeepTogether(keepTogether: AD.KeepTogether.KeepTogether, doc: AD.AbstractDoc.AbstractDoc): AD.SectionElement.SectionElement {
  const children = R.unnest(keepTogether.children.map((e) => preProcessSectionElement(e, doc)));
  return AD.KeepTogether.create({children: children});
}
