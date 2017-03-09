import * as AD from "../../abstract-document/index";

export function getResources(doc: AD.AbstractDoc.AbstractDoc): AD.Resources.Resources {
  const resources = doc.children.map((s) => getResourcesSection(s));
  return AD.Resources.mergeResources(resources);
}

function getResourcesSection(s: AD.Section.Section): AD.Resources.Resources {
  const header = AD.Resources.mergeResources(s.page.header.map((e) => getResourcesSectionElement(e)));
  const footer = AD.Resources.mergeResources(s.page.footer.map((e) => getResourcesSectionElement(e)));
  const children = AD.Resources.mergeResources(s.children.map((e) => getResourcesSectionElement(e)));
  return AD.Resources.mergeResources([header, footer, children]);
}

function getResourcesSectionElement(e: AD.SectionElement.SectionElement): AD.Resources.Resources {
  switch (e.type) {
    case "Paragraph":
      return getResourcesParagraph(e);
    case "Table":
      return getResourcesTable(e);
    case "KeepTogether":
      return getResourcesKeepTogether(e);
  }
}

function getResourcesParagraph(paragraph: AD.Paragraph.Paragraph): AD.Resources.Resources {
  return paragraph;
}

function getResourcesTable(table: AD.Table.Table): AD.Resources.Resources {
  return AD.Resources.mergeResources(table.children.map((r) => getResourcesTableRow(r)));
}

function getResourcesTableRow(r: AD.TableRow.TableRow): AD.Resources.Resources {
  return AD.Resources.mergeResources(r.children.map((c) => getResourcesTableCell(c)));
}

function getResourcesTableCell(c: AD.TableCell.TableCell): AD.Resources.Resources {
  return AD.Resources.mergeResources(c.children.map((e) => getResourcesSectionElement(e)));
}

function getResourcesKeepTogether(keepTogether: AD.KeepTogether.KeepTogether): AD.Resources.Resources {
  return AD.Resources.mergeResources(keepTogether.children.map((e) => getResourcesSectionElement(e)));
}
