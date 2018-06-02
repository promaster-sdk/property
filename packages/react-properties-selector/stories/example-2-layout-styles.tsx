import { csjs } from "csjs";
import { insertCss } from "insert-css";

export const propertiesSelectorLayoutStyles = csjs`
  .property {
    margin: 0.5em 0.8em;
    display: flex;
    justify-content: space-between;
  }
  
  .label {
    margin-right: 1em;
  }
  
  .hidden {
    display: none;
  }
`;

insertCss(csjs.getCss(propertiesSelectorLayoutStyles)); //tslint:disable-line
