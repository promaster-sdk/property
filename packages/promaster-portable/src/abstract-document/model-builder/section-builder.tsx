import {Section, createSection} from "../model/page/section";
import {MasterPage} from "../model/page/master-page";
import {SectionElement} from "../model/section-elements/section-element";

export class SectionBuilder //: List<ISectionElement>, IBuilder<ISectionElement>
{
  page: MasterPage;
  private readonly list: Array<SectionElement> = [];

  add(child: SectionElement): void {
    this.list.push(child);
  }

  Build(): Section {
    return createSection(this.page, this.list);
  }
}
