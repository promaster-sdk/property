import * as R from "ramda";
import * as React from "react";
import {
  AbstractDoc as AbstractDoc1,
  Section as Section1,
  Group as Group1,
  Paragraph as Paragraph1,
  Table as Table1,
  TableRow as TableRow1,
  TableCell as TableCell1,
  HyperLink as HyperLink1,
  Image as Image1,
  Markdown as Markdown1,
  TextField as TextField1,
  TextRun as TextRun1
} from "../abstract-document";

export type Jsx<T> = T & {
  readonly children?: React.ReactNode;  
};

export const AbstractDoc = (props: Jsx<AbstractDoc1.AbstractDocProps>): React.ReactElement<Jsx<AbstractDoc1.AbstractDocProps>> => AbstractDoc1.create(props) as any;
export const Section = (props: Jsx<Section1.SectionProps>): React.ReactElement<Jsx<Section1.Section>> => Section1.create(props) as any;
export const Group = (props: Jsx<Group1.GroupProps>): React.ReactElement<Jsx<Group1.Group>> => Group1.create(props) as any;
export const Paragraph = (props: Jsx<Paragraph1.ParagraphProps>): React.ReactElement<Jsx<Paragraph1.Paragraph>> => Paragraph1.create(props) as any;
export const Table = (props: Jsx<Table1.TableProps>): React.ReactElement<Jsx<Table1.Table>> => Table1.create(props) as any;
export const TableRow = (props: Jsx<TableRow1.TableRowProps>): React.ReactElement<Jsx<TableRow1.TableRow>> => TableRow1.create(props) as any;
export const TableCell = (props: Jsx<TableCell1.TableCellProps>): React.ReactElement<Jsx<TableCell1.TableCell>> => TableCell1.create(props) as any;
export const HyperLink = (props: Jsx<HyperLink1.HyperLinkProps>): React.ReactElement<Jsx<HyperLink1.HyperLink>> => HyperLink1.create(props) as any;
export const Image = (props: Jsx<Image1.ImageProps>): React.ReactElement<Jsx<Image1.Image>> => Image1.create(props) as any;
export const Markdown = (props: Jsx<Markdown1.MarkdownProps>): React.ReactElement<Jsx<Markdown1.MarkdownProps>> => Markdown1.create(props) as any;
export const TextField = (props: Jsx<TextField1.TextFieldProps>): React.ReactElement<Jsx<TextField1.TextField>> => TextField1.create(props) as any;
export const TextRun = (props: Jsx<TextRun1.TextRunProps>): React.ReactElement<Jsx<TextRun1.TextRun>> => TextRun1.create(props) as any;

export function render(element: any): any {
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
    return R.unnest(element.props.children.map((c: any) => {
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