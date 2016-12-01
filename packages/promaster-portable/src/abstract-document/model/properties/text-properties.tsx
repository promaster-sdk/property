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
