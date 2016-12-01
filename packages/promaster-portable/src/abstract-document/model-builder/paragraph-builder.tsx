import {ParagraphNumbering} from "../model/section-elements/paragraph-numbering";
import {ParagraphPropertiesBuilder} from "./paragraph-properties-builder";
import {TextPropertiesBuilder} from "./text-properties-builder";
import {Paragraph, createParagraph} from "../model/section-elements/paragraph";
import {Atom} from "../model/atoms/atom";
import {IBuilder} from "./i-builder";

export class ParagraphBuilder implements IBuilder<Atom> //: List<IAtom>
{
  builderType: "ParagraphBuilder" = "ParagraphBuilder";
  builtType: "Atom" = "Atom";
  styleName: string;
  numbering: ParagraphNumbering;
  private readonly list: Array<Atom> = [];

  add(child: Atom): void {
    this.list.push(child);
  }

  readonly paragraphProperties: ParagraphPropertiesBuilder = new ParagraphPropertiesBuilder();
  readonly textProperties: TextPropertiesBuilder = new TextPropertiesBuilder();

  build(): Paragraph {
    return createParagraph(this.styleName, this.paragraphProperties.build(), this.textProperties.build(), this.list, this.numbering);
  }

}
