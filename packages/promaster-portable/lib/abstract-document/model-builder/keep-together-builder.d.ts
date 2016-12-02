import { KeepTogether } from "../model/section-elements/keep-together";
import { SectionElement } from "../model/section-elements/section-element";
import { IBuilder } from "./i-builder";
export declare class KeepTogetherBuilder implements IBuilder<SectionElement> {
    builderType: "KeepTogetherBuilder";
    builtType: "SectionElement";
    private readonly list;
    add(child: SectionElement): void;
    build(): KeepTogether;
}
