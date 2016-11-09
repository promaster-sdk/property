import {csjs} from "csjs";
import insertCss from "insert-css";
import {AmountFormatSelectorStyles, AmountInputBoxStyles} from "../amount-fields/index";

export interface AmountPropertySelectorStyles {
  readonly amount: string,
  readonly amountFormatSelectorStyles: AmountFormatSelectorStyles,
  readonly amountInputBoxStyles: AmountInputBoxStyles,
}

export const amountPropertySelectorStyles: AmountPropertySelectorStyles = csjs`
  .amount {
  }
`;

insertCss(csjs.getCss(amountPropertySelectorStyles));
