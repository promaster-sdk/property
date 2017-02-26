import * as R from "ramda";
import * as React from "react";
import {
  AbstractDoc as AbstractDoc1,
  Section as Section1,
  KeepTogether as KeepTogether1,
  Paragraph as Paragraph1,
  Table as Table1,
  TableRow as TableRow1,
  TableCell as TableCell1,
  HyperLink as HyperLink1,
  Image as Image1,
  Markdown as Markdown1,
  SectionElement as SectionElement1,
  TextField as TextField1,
  TextRun as TextRun1
} from "../abstract-document";

export const AbstractDoc = (props: AbstractDoc1.AbstractDocProps): React.ReactElement<AbstractDoc1.AbstractDocProps> => AbstractDoc1.create(props) as any;
export const Section = (props: Section1.SectionProps): React.ReactElement<Section1.Section> => Section1.create(props) as any;
export const KeepTogether = (props: KeepTogether1.KeepTogetherProps): React.ReactElement<KeepTogether1.KeepTogether> => KeepTogether1.create(props) as any;
export const Paragraph = (props: Paragraph1.ParagraphProps): React.ReactElement<Paragraph1.Paragraph> => Paragraph1.create(props) as any;
export const Table = (props: Table1.TableProps): React.ReactElement<Table1.Table> => Table1.create(props) as any;
export const TableRow = (props: TableRow1.TableRowProps): React.ReactElement<TableRow1.TableRow> => TableRow1.create(props) as any;
export const TableCell = (props: TableCell1.TableCellProps): React.ReactElement<TableCell1.TableCell> => TableCell1.create(props) as any;
export const HyperLink = (props: HyperLink1.HyperLinkProps): React.ReactElement<HyperLink1.HyperLink> => HyperLink1.create(props) as any;
export const Image = (props: Image1.ImageProps): React.ReactElement<Image1.Image> => Image1.create(props) as any;
export const Markdown = (props: Markdown1.MarkdownProps): React.ReactElement<Array<SectionElement1.SectionElement>> => Markdown1.create(props) as any;
export const TextField = (props: TextField1.TextFieldProps): React.ReactElement<TextField1.TextField> => TextField1.create(props) as any;
export const TextRun = (props: TextRun1.TextRunProps): React.ReactElement<TextRun1.TextRun> => TextRun1.create(props) as any;

export function render(element: any) {
  if (typeof element.type !== "function") {
    return element;
  }
  const props = element.props || {};
  const children = renderChildren(element);
  return (element.type as any)({...props, children});
}

function renderChildren(element: React.ReactElement<any>) {
  if (!element.props || !element.props.children) {
    return [];
  } else if (Array.isArray(element.props.children)) {
    return R.unnest(element.props.children.map((c) => {
      if (!c) {
        return [];
      }
      if (Array.isArray(c)) {
        return c.map(render);
      }
      return render(c);
    }));
  } else {
    const elements = render(element.props.children);        // Markdown returns an array of elements already
    return Array.isArray(elements) ? elements : [elements]; // so we need to test for that before we return.
  }
}