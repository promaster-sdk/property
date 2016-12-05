export interface TextProperties {
  bold: boolean | undefined,
  color: string | undefined,
  fontFamily: string,
  fontSize: number  | undefined,
  italic: boolean | undefined,
  subScript: boolean | undefined,
  superScript: boolean | undefined,
  underline: boolean | undefined,
}

export function createTextProperties(fontFamily: string,
                                     fontSize: number | undefined,
                                     underline: boolean | undefined,
                                     bold: boolean | undefined,
                                     italic: boolean | undefined,
                                     color: string | undefined,
                                     subScript: boolean | undefined,
                                     superScript: boolean | undefined): TextProperties {
  return {
    fontFamily,
    fontSize,
    underline,
    bold,
    italic,
    color,
    subScript,
    superScript,
  }
}

export function overrideWith(overrider: TextProperties, toOverride: TextProperties): TextProperties {
  if (!overrider)
    return toOverride;
  return createTextProperties(
    overrider.fontFamily || toOverride.fontFamily,
    overrider.fontSize || toOverride.fontSize,
    overrider.underline || toOverride.underline,
    overrider.bold || toOverride.bold,
    overrider.italic || toOverride.italic,
    overrider.color || toOverride.color,
    overrider.subScript || toOverride.subScript,
    overrider.superScript || toOverride.superScript
  );
}

