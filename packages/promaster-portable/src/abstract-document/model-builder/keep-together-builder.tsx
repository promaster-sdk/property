import {KeepTogether, createKeepTogether} from "../model/section-elements/keep-together";
import {SectionElement} from "../model/section-elements/section-element";

export class KeepTogetherBuilder //: List<ISectionElement>, IBuilder<ISectionElement>
{
  private readonly list: Array<SectionElement> = [];

  add(child: SectionElement): void {
    this.list.push(child);
  }

  build(): KeepTogether {
    return createKeepTogether(this.list);
  }
}
