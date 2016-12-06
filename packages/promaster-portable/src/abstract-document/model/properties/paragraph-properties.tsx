import {TextAlignment} from "../enums/text-alignment";
import {AbstractLength} from "../primitives/abstract-length";

export interface ParagraphProperties {
  alignment: TextAlignment|undefined,
  spacingAfter: AbstractLength | undefined,
  spacingBefore: AbstractLength | undefined,
}

export function createParagraphProperties(alignment: TextAlignment | undefined, spacingBefore: AbstractLength | undefined,
                                          spacingAfter: AbstractLength | undefined): ParagraphProperties {
  return {
    alignment,
    spacingBefore,
    spacingAfter,
  }
}

export function overrideWith(overrider: ParagraphProperties, toOverride: ParagraphProperties): ParagraphProperties {
  if (!overrider)
    return toOverride;
  return createParagraphProperties(
    overrider.alignment || toOverride.alignment,
    overrider.spacingBefore || toOverride.spacingBefore,
    overrider.spacingAfter || toOverride.spacingAfter
  );
}
