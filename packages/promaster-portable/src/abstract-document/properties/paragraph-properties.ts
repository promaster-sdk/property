import {TextAlignment} from "../enums/text-alignment";
import {AbstractLength} from "../primitives/abstract-length";

export interface ParagraphProperties {
  alignment?: TextAlignment
  spacingAfter?: AbstractLength
  spacingBefore?: AbstractLength
}

export interface ParagraphPropertiesProps {
  alignment?: TextAlignment
  spacingAfter?: AbstractLength
  spacingBefore?: AbstractLength
}

// export function create(alignment: TextAlignment | undefined, spacingBefore: AbstractLength | undefined,
//                        spacingAfter: AbstractLength | undefined): ParagraphProperties {
//   return {
//     alignment,
//     spacingBefore,
//     spacingAfter,
//   }
// }

export function create(props: ParagraphPropertiesProps = {}): ParagraphProperties {
  return props;
}

export function overrideWith(overrider: ParagraphProperties, toOverride: ParagraphProperties): ParagraphProperties {
  if (!overrider)
    return toOverride;
  return create({
    alignment: overrider.alignment || toOverride.alignment,
    spacingBefore: overrider.spacingBefore || toOverride.spacingBefore,
    spacingAfter: overrider.spacingAfter || toOverride.spacingAfter
  });
}
