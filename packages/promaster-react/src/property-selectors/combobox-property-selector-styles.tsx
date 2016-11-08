import csjs from "csjs";
import insertCss from "insert-css";

export interface Styles {
  readonly select: string,
  readonly selectInvalid: string,
  readonly selectLocked: string,
  readonly selectInvalidLocked: string,
  readonly option: string,
  readonly optionInvalid: string,
}

export const styles: Styles = csjs`
  .select {
		background: yellow;
  }

  .selectInvalid: {
    border-color: red;
  }

  .selectLocked: {
    background: lightgray;
    color: darkgray;
    border: none;
  }

  .selectInvalidLocked: {
  }

  .option: {
  }

  .optionInvalid: {
  }
`;

insertCss(csjs.getCss(styles));
