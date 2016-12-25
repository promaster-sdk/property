import {TextProperties} from "../properties/text-properties";
import {Indexer} from "../abstract-doc";
import * as Style from "../styles/style";
import {StyleKey} from "../styles/style-key";
import * as TextStyle from "../styles/text-style";

export interface HyperLink {
  type: "HyperLink",
  text: string,
  target: string,
  styleName: string | undefined,
  textProperties: TextProperties,
}

export interface HyperLinkProps {
  text: string,
  target: string,
  styleName?: string,
  textProperties?: TextProperties,
}

export function create({text, target, styleName, textProperties = {}}: HyperLinkProps): HyperLink {
  return {
    type: "HyperLink",
    text,
    target,
    styleName,
    textProperties,
  }
}

export function getEffectiveTextProperties(styles: Indexer<StyleKey, Style.Style>, tr: HyperLink): TextProperties {
  const effectiveStyle = getEffectiveStyle(styles, tr);
  return effectiveStyle.textProperties;
}

function getEffectiveStyle(styles: Indexer<StyleKey, Style.Style>, tr: HyperLink): TextStyle.TextStyle {
  const localStyle = TextStyle.create({basedOn: tr.styleName, textProperties: tr.textProperties});
  const effectiveStyle = Style.getEffectiveStyle2<TextStyle.TextStyle>(styles, localStyle);
  return effectiveStyle;
}
