import {StyleKey} from "./style-key";

export interface Style {
  type: string,
  basedOn: string | undefined,
}


export function GetEffectiveStyle2<TStyle extends Style>(styles: Map<StyleKey, Style>, style: Style): TStyle {
  throw new Error(`TODO!! ${styles} ${style}`);
  /*
   const styleType = style.type;
   const styleStack:Array<Style> = [];
   // let style:Style  = style;
   styleStack.push(style);
   while (style.basedOn != null)
   {
   style = styles[createStyleKey(styleType, style.basedOn)];
   styleStack.push(style);
   }
   let effective:Style  = styles[createStyleKey(styleType, "Default")];
   while (styleStack.length > 0)
   {
   style = styleStack.pop() as Style;
   effective = effective.OverrideWith(style) as TStyle;
   }
   return effective as TStyle;
   */
}
