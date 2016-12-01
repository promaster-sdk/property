import {Section, createSection} from "../model/page/section";
import {MasterPage} from "../model/page/master-page";
import {SectionElement} from "../model/section-elements/section-element";

export class SectionBuilder //: List<ISectionElement>, IBuilder<ISectionElement>
{
  page: MasterPage;
  private readonly list: Array<SectionElement> = [];

  constructor(page: MasterPage) {
    this.page = page;
  }

  add(child: SectionElement): void {
    this.list.push(child);
  }

  build(): Section {
    return createSection(this.page, this.list);
  }
}
