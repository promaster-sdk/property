import {TextProperties} from "../properties/text-properties";
import {Indexer} from "../abstract-doc";
import * as Style from "../styles/style";
import {StyleKey} from "../styles/style-key";
import {TextStyle, createTextStyle} from "../styles/text-style";

export interface TextRun {
  type: "TextRun",
  styleName: string | undefined,
  text: string,
  textProperties: TextProperties,
}

export function createTextRun(text: string, styleName: string | undefined, textProperties: TextProperties): TextRun {
  return {
    type: "TextRun",
    text,
    styleName,
    textProperties,
  }
}

export function getEffectiveTextProperties(styles: Indexer<StyleKey, Style.Style>, tr: TextRun): TextProperties {
  const effectiveStyle = getEffectiveStyle(styles, tr);
  return effectiveStyle.textProperties;
}

function getEffectiveStyle(styles: Indexer<StyleKey, Style.Style>, tr: TextRun): TextStyle {
  const localStyle = createTextStyle(tr.styleName, tr.textProperties);
  const effectiveStyle = Style.getEffectiveStyle2<TextStyle>(styles, localStyle);
  return effectiveStyle;
}
