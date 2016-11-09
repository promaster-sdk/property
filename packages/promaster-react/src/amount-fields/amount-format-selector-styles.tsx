import csjs from "csjs";
import insertCss from "insert-css";

export interface AmountFormatSelectorStyles {
  readonly format: string,
  readonly formatActive: string,
  readonly unit: string,
  readonly precision: string,
  readonly cancel: string,
}

export const amountFormatSelectorStyles: AmountFormatSelectorStyles = csjs`
  .format {
  }
  
  .formatActive {
  }
  
  .unit {
  }
  
  .precision {
  }
  
  .cancel {
  }
`;

insertCss(csjs.getCss(amountFormatSelectorStyles));
