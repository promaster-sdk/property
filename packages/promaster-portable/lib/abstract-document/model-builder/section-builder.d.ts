import { Section } from "../model/page/section";
import { MasterPage } from "../model/page/master-page";
import { SectionElement } from "../model/section-elements/section-element";
import { IBuilder } from "./i-builder";
export declare class SectionBuilder implements IBuilder<SectionElement> {
    builderType: "SectionBuilder";
    builtType: "SectionElement";
    page: MasterPage;
    private readonly list;
    constructor(page: MasterPage);
    add(child: SectionElement): void;
    build(): Section;
}
