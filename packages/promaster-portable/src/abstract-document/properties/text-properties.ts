export interface TextProperties {
  fontFamily?: string,
  bold?: boolean,
  color?: string,
  fontSize?: number,
  italic?: boolean,
  subScript?: boolean,
  superScript?: boolean,
  underline?: boolean,
}

export interface TextPropertiesProps {
  fontFamily?: string,
  bold?: boolean,
  color?: string,
  fontSize?: number,
  italic?: boolean,
  subScript?: boolean,
  superScript?: boolean,
  underline?: boolean,
}

export function create({
  fontFamily,
  fontSize,
  underline = false,
  bold = false,
  italic = false,
  color = "black",
  subScript = false,
  superScript = false
}:TextPropertiesProps = {}): TextProperties {
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
  return create({
    fontFamily: overrider.fontFamily || toOverride.fontFamily,
    fontSize: overrider.fontSize || toOverride.fontSize,
    underline: overrider.underline || toOverride.underline,
    bold: overrider.bold || toOverride.bold,
    italic: overrider.italic || toOverride.italic,
    color: overrider.color || toOverride.color,
    subScript: overrider.subScript || toOverride.subScript,
    superScript: overrider.superScript || toOverride.superScript
  });
}

