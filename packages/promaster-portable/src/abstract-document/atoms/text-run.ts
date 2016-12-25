import {TextProperties} from "../properties/text-properties";
import {Indexer} from "../abstract-doc";
import * as Style from "../styles/style";
import {StyleKey} from "../styles/style-key";
import * as TextStyle from "../styles/text-style";
// import * as Paragraph from "../section-elements/paragraph";

export interface TextRun {
  type: "TextRun",
  styleName: string | undefined,
  text: string,
  textProperties: TextProperties,
}

export interface TextRunProps {
  styleName?: string,
  text: string,
  textProperties?: TextProperties,
}

export function create({text, styleName, textProperties = {}}:TextRunProps): TextRun {

  // if(!textProperties) {
  //   var textProps = Paragraph.getEffectiveTextProperties(_styles);
  // }

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

function getEffectiveStyle(styles: Indexer<StyleKey, Style.Style>, tr: TextRun): TextStyle.TextStyle {
  const localStyle = TextStyle.create({basedOn: tr.styleName, textProperties: tr.textProperties});
  const effectiveStyle = Style.getEffectiveStyle2<TextStyle.TextStyle>(styles, localStyle);
  return effectiveStyle;
}
