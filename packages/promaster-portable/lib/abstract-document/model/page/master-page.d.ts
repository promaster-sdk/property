import { SectionElement } from "../section-elements/section-element";
import { PageStyle } from "../styles/page-style";
export interface MasterPage {
    footer: SectionElement[];
    header: SectionElement[];
    printableHeight: number;
    printableWidth: number;
    style: PageStyle;
}
