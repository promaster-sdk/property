import {KeepTogether, createKeepTogether} from "../model/section-elements/keep-together";
import {SectionElement} from "../model/section-elements/section-element";
import {IBuilder} from "./i-builder";

export class KeepTogetherBuilder implements IBuilder<SectionElement> //: List<ISectionElement>,
{
  builderType: "KeepTogetherBuilder" = "KeepTogetherBuilder";
  builtType: "SectionElement" = "SectionElement";
  private readonly list: Array<SectionElement> = [];

  add(child: SectionElement): void {
    this.list.push(child);
  }

  build(): KeepTogether {
    return createKeepTogether(this.list);
  }
}
